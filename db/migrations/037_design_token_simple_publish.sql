create or replace function publish_promo_design_token_version(
  p_token_set_id uuid,
  p_source_version_id uuid,
  p_working_version_id uuid,
  p_values jsonb,
  p_template_ids uuid[] default '{}'::uuid[],
  p_source_name text default '',
  p_source_hash text default '',
  p_change_note text default 'Design token values saved and activated.'
) returns jsonb
language plpgsql
as $$
declare
  v_active_id uuid;
  v_version_id uuid;
  v_template_id uuid;
  v_template wizard_form_templates%rowtype;
  v_draft_id uuid;
  v_draft_version integer;
  v_template_results jsonb := '[]'::jsonb;
  v_current_values jsonb := '[]'::jsonb;
  v_requested_values jsonb := '[]'::jsonb;
begin
  perform pg_advisory_xact_lock(hashtext('promo_design_token_set:' || p_token_set_id::text));

  select id into v_active_id
  from promo_design_token_set_versions
  where token_set_id = p_token_set_id and status = 'active'
  for update;

  if v_active_id is distinct from p_source_version_id then
    raise exception 'Design token version changed. Reload before saving.';
  end if;

  foreach v_template_id in array coalesce(p_template_ids, '{}'::uuid[]) loop
    select * into v_template
    from wizard_form_templates
    where id = v_template_id and status = 'active'
    for update;
    if not found then
      raise exception 'Selected template is not active: %', v_template_id;
    end if;
    if exists (
      select 1 from wizard_form_templates
      where template_key = v_template.template_key and status = 'draft'
    ) then
      raise exception 'A draft already exists for template: %', v_template.name;
    end if;
  end loop;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'tokenKey', token_key,
      'value', token_value,
      'metadata', metadata
    ) order by token_key
  ), '[]'::jsonb)
  into v_current_values
  from promo_design_token_values
  where token_set_version_id = v_active_id;

  select coalesce(jsonb_agg(value order by value->>'tokenKey'), '[]'::jsonb)
  into v_requested_values
  from jsonb_array_elements(coalesce(p_values, '[]'::jsonb)) value;

  if p_working_version_id is not null then
    if not exists (
      select 1 from promo_design_token_set_versions
      where id = p_working_version_id
        and token_set_id = p_token_set_id
        and status = 'draft'
    ) then
      raise exception 'Working design token draft is no longer available';
    end if;
    v_version_id := p_working_version_id;
    perform replace_promo_design_token_draft_values(
      v_version_id, p_values, p_source_name, p_source_hash,
      p_change_note, 'draft_updated'
    );
  elsif v_active_id is not null and v_current_values = v_requested_values then
    v_version_id := v_active_id;
  else
    v_version_id := create_promo_design_token_draft(
      p_token_set_id, p_source_version_id, p_values, p_source_name,
      p_source_hash, p_change_note, 'draft_created'
    );
  end if;

  if v_version_id is distinct from v_active_id then
    perform activate_promo_design_token_version(v_version_id, p_change_note);
  end if;

  foreach v_template_id in array coalesce(p_template_ids, '{}'::uuid[]) loop
    select * into v_template
    from wizard_form_templates
    where id = v_template_id and status = 'active';

    v_draft_id := clone_wizard_form_template_draft(
      v_template_id,
      'Draft created for design token application.'
    );
    select version into v_draft_version
    from wizard_form_templates
    where id = v_draft_id;

    insert into wizard_form_template_layouts (
      form_template_id, renderer_key, renderer_version, contract_version,
      layout_revision, layout_spec, validation_result, change_note
    )
    select
      v_draft_id, renderer_key, renderer_version, contract_version,
      1, layout_spec, validation_result, 'Layout cloned for design token application.'
    from wizard_form_template_layouts
    where form_template_id = v_template_id;

    update wizard_form_templates
    set design_token_set_version_id = v_version_id,
      change_note = p_change_note,
      updated_at = now()
    where id = v_draft_id;

    perform activate_wizard_form_template(v_draft_id, p_change_note);

    v_template_results := v_template_results || jsonb_build_array(jsonb_build_object(
      'templateKey', v_template.template_key,
      'previousVersion', v_template.version,
      'newVersion', v_draft_version,
      'templateId', v_draft_id,
      'status', 'active'
    ));
  end loop;

  return jsonb_build_object(
    'tokenVersionId', v_version_id,
    'templates', v_template_results
  );
end $$;

insert into locale_message_keys (message_key, namespace, description)
select message_key, 'admin', 'Design token table editor message.'
from (values
  ('admin.designToken.search'),
  ('admin.designToken.allCategories'),
  ('admin.designToken.changedOnly'),
  ('admin.designToken.category'),
  ('admin.designToken.token'),
  ('admin.designToken.type'),
  ('admin.designToken.value'),
  ('admin.designToken.status'),
  ('admin.designToken.changed'),
  ('admin.designToken.normal'),
  ('admin.designToken.csvExport'),
  ('admin.designToken.saveAndApply'),
  ('admin.designToken.applyTemplates'),
  ('admin.designToken.templateDraftConflict'),
  ('admin.designToken.selectTemplateRequired'),
  ('admin.designToken.csvTypeError'),
  ('admin.designToken.csvSizeError'),
  ('admin.designToken.saveSuccess'),
  ('admin.designToken.saveApplySuccess')
) as messages(message_key)
on conflict (message_key) do nothing;

with messages(locale, message_key, value) as (
  values
    ('ko', 'admin.designToken.search', '토큰 검색'),
    ('ko', 'admin.designToken.allCategories', '전체 분류'),
    ('ko', 'admin.designToken.changedOnly', '변경된 항목만 보기'),
    ('ko', 'admin.designToken.category', '분류'),
    ('ko', 'admin.designToken.token', '토큰'),
    ('ko', 'admin.designToken.type', '형식'),
    ('ko', 'admin.designToken.value', '현재 값'),
    ('ko', 'admin.designToken.status', '상태'),
    ('ko', 'admin.designToken.changed', '변경됨'),
    ('ko', 'admin.designToken.normal', '정상'),
    ('ko', 'admin.designToken.csvExport', 'CSV 내보내기'),
    ('ko', 'admin.designToken.saveAndApply', '저장 및 적용'),
    ('ko', 'admin.designToken.applyTemplates', '적용할 프로모션 템플릿'),
    ('ko', 'admin.designToken.templateDraftConflict', '기존 초안이 있어 적용할 수 없습니다.'),
    ('ko', 'admin.designToken.selectTemplateRequired', '적용할 프로모션 템플릿을 하나 이상 선택하세요.'),
    ('ko', 'admin.designToken.csvTypeError', 'CSV 파일만 가져올 수 있습니다.'),
    ('ko', 'admin.designToken.csvSizeError', 'CSV 파일은 2MB 이하여야 합니다.'),
    ('ko', 'admin.designToken.saveSuccess', '디자인 토큰을 저장하고 활성화했습니다.'),
    ('ko', 'admin.designToken.saveApplySuccess', '디자인 토큰을 저장하고 프로모션 템플릿 {count}개에 적용했습니다.'),
    ('en', 'admin.designToken.search', 'Search tokens'),
    ('en', 'admin.designToken.allCategories', 'All categories'),
    ('en', 'admin.designToken.changedOnly', 'Show changed only'),
    ('en', 'admin.designToken.category', 'Category'),
    ('en', 'admin.designToken.token', 'Token'),
    ('en', 'admin.designToken.type', 'Type'),
    ('en', 'admin.designToken.value', 'Current value'),
    ('en', 'admin.designToken.status', 'Status'),
    ('en', 'admin.designToken.changed', 'Changed'),
    ('en', 'admin.designToken.normal', 'Valid'),
    ('en', 'admin.designToken.csvExport', 'Export CSV'),
    ('en', 'admin.designToken.saveAndApply', 'Save and apply'),
    ('en', 'admin.designToken.applyTemplates', 'Promotion templates to update'),
    ('en', 'admin.designToken.templateDraftConflict', 'This template already has a draft.'),
    ('en', 'admin.designToken.selectTemplateRequired', 'Select at least one promotion template.'),
    ('en', 'admin.designToken.csvTypeError', 'Only CSV files can be imported.'),
    ('en', 'admin.designToken.csvSizeError', 'CSV files must be 2MB or smaller.'),
    ('en', 'admin.designToken.saveSuccess', 'Design tokens saved and activated.'),
    ('en', 'admin.designToken.saveApplySuccess', 'Design tokens saved and applied to {count} promotion templates.')
), next_versions as (
  select messages.*,
    coalesce((
      select max(version) + 1
      from locale_message_versions existing
      where existing.locale = messages.locale
        and existing.message_key = messages.message_key
    ), 1) as next_version
  from messages
)
insert into locale_message_versions (
  locale, message_key, value, status, version, change_note, changed_by
)
select locale, message_key, value, 'active', next_version,
  'Added for the design token table editor.', 'migration-037'
from next_versions
where exists (select 1 from locales where code = next_versions.locale)
  and not exists (
    select 1 from locale_message_versions active
    where active.locale = next_versions.locale
      and active.message_key = next_versions.message_key
      and active.status = 'active'
  );

update locales
set snapshot_revision = snapshot_revision + 1,
  updated_at = now()
where code in ('ko', 'en');

-- Design token set lifecycle:
-- active -> inactive -> archived
-- GGPoker is maintained as a Dark-only token set. Missing Dark values inherit
-- the previous Light value once, then Light values are removed.

alter table promo_design_token_sets
  drop constraint if exists promo_design_token_sets_status_check;
alter table promo_design_token_sets
  add constraint promo_design_token_sets_status_check
  check (status in ('active', 'inactive', 'archived'));

alter table promo_design_token_histories
  drop constraint if exists promo_design_token_histories_action_check;
alter table promo_design_token_histories
  add constraint promo_design_token_histories_action_check
  check (action in (
    'set_created', 'set_updated', 'set_cloned', 'set_activated',
    'set_deactivated', 'set_default', 'set_archived',
    'draft_created', 'draft_updated', 'imported', 'validated',
    'activated', 'rollback_draft_created'
  ));

update promo_design_token_values token_value
set token_value = coalesce(
      nullif(token_value.value_dark, ''),
      nullif(token_value.value_light, ''),
      token_value.token_value
    ),
    value_dark = coalesce(
      nullif(token_value.value_dark, ''),
      nullif(token_value.value_light, ''),
      token_value.token_value
    ),
    value_light = '',
    active_theme = 'dark'
from promo_design_token_set_versions version
join promo_design_token_sets token_set on token_set.id = version.token_set_id
where token_value.token_set_version_id = version.id
  and (
    lower(token_set.set_key) like '%ggpoker%'
    or lower(token_set.name) like '%ggpoker%'
  );

insert into promo_design_token_histories (
  token_set_id, action, previous_status, new_status, change_note, snapshot
)
select
  token_set.id,
  'set_updated',
  token_set.status,
  token_set.status,
  'Normalized GGPoker tokens to a Dark-only value set.',
  jsonb_build_object(
    'activeTheme', 'dark',
    'lightValuesRemoved', true,
    'darkFallback', 'value_light'
  )
from promo_design_token_sets token_set
where (
  lower(token_set.set_key) like '%ggpoker%'
  or lower(token_set.name) like '%ggpoker%'
)
and not exists (
  select 1
  from promo_design_token_histories history
  where history.token_set_id = token_set.id
    and history.change_note = 'Normalized GGPoker tokens to a Dark-only value set.'
);

with messages(locale, message_key, value) as (
  values
    ('ko', 'admin.designToken.deleted', '비활성 디자인 토큰 세트를 삭제했습니다.'),
    ('ko', 'admin.designToken.setActivated', '디자인 토큰 세트를 활성화했습니다.'),
    ('ko', 'admin.designToken.setDeactivated', '디자인 토큰 세트를 비활성화했습니다.'),
    ('ko', 'admin.designToken.setDefault', '기본값 지정'),
    ('ko', 'admin.designToken.defaultChanged', '기본 디자인 토큰 세트를 변경했습니다.'),
    ('ko', 'admin.designToken.defaultBadge', '기본'),
    ('ko', 'admin.designToken.defaultDeactivateHint', '다른 활성 토큰 세트를 기본값으로 지정한 후 비활성화할 수 있습니다.'),
    ('ko', 'admin.designToken.deleteConfirm', '이 디자인 토큰 세트를 삭제하시겠습니까? 삭제 후 신규 프로모션에서 사용할 수 없습니다.'),
    ('en', 'admin.designToken.deleted', 'Inactive design token set deleted.'),
    ('en', 'admin.designToken.setActivated', 'Design token set activated.'),
    ('en', 'admin.designToken.setDeactivated', 'Design token set deactivated.'),
    ('en', 'admin.designToken.setDefault', 'Set as default'),
    ('en', 'admin.designToken.defaultChanged', 'Default design token set changed.'),
    ('en', 'admin.designToken.defaultBadge', 'Default'),
    ('en', 'admin.designToken.defaultDeactivateHint', 'Set another active token set as default before deactivating this one.'),
    ('en', 'admin.designToken.deleteConfirm', 'Delete this design token set? It will no longer be available to new promotions.')
), deactivated as (
  update locale_message_versions current
  set status = 'inactive', updated_at = now()
  from messages
  where current.locale = messages.locale
    and current.message_key = messages.message_key
    and current.status = 'active'
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
  'Added design token set lifecycle messages.', 'migration-045'
from next_versions
where exists (select 1 from locales where code = next_versions.locale);

update locales
set snapshot_revision = snapshot_revision + 1, updated_at = now()
where code in ('ko', 'en');

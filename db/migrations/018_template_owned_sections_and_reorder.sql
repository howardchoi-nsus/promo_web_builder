alter table wizard_content_sections
  add column if not exists owner_form_template_id uuid references wizard_form_templates(id) on delete cascade;

alter table wizard_form_template_sections
  add column if not exists section_id uuid references wizard_content_sections(id) on delete cascade,
  add column if not exists user_reorder_allowed boolean not null default true;

alter table wizard_content_section_items
  add column if not exists user_reorder_allowed boolean not null default true;

update wizard_form_template_sections ts
set section_id = (
  select s.id from wizard_content_sections s
  where s.section_key = ts.section_key and s.status = 'active'
  order by s.version desc limit 1
)
where ts.section_id is null
  and exists (
    select 1 from wizard_content_sections s
    where s.section_key = ts.section_key and s.status = 'active'
  );

update wizard_form_template_sections
set user_reorder_allowed = order_change_allowed;

create index if not exists wizard_content_sections_owner_idx
  on wizard_content_sections(owner_form_template_id, status, sort_order);

create index if not exists wizard_form_template_sections_section_idx
  on wizard_form_template_sections(section_id);

comment on column wizard_form_template_sections.user_reorder_allowed
  is 'Whether a Promo Wizard user may reorder this section. Admin draft ordering is always allowed.';
comment on column wizard_content_section_items.user_reorder_allowed
  is 'Whether a Promo Wizard user may reorder this item inside its section.';

create or replace function activate_wizard_form_template_owned_sections(p_template_id uuid)
returns void
language plpgsql
as $$
begin
  update wizard_content_sections
  set status = 'active', updated_at = now()
  where owner_form_template_id = p_template_id and status = 'draft';
end;
$$;

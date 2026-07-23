- Repair environments where migration 029 was applied without migration 028.
-- Keep this migration idempotent because Production may already have received
-- the template_key_snapshot column as an operator hotfix.

alter table promo_section_design_runs
  add column if not exists template_key_snapshot text;

update promo_section_design_runs run
set template_key_snapshot = template.template_key
from wizard_form_templates template
where run.form_template_id = template.id
  and nullif(trim(run.template_key_snapshot), '') is null;

alter table promo_section_design_runs
  alter column form_template_id drop not null;

alter table promo_section_design_runs
  drop constraint if exists promo_section_design_runs_form_template_id_fkey;

alter table promo_section_design_runs
  add constraint promo_section_design_runs_form_template_id_fkey
  foreign key (form_template_id) references wizard_form_templates(id) on delete set null;

comment on column promo_section_design_runs.template_key_snapshot is
  'Immutable template key captured when the section AI design run is created.';

create or replace function prevent_wizard_template_delete_with_active_section_runs()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from promo_section_design_runs run
    where run.form_template_id = old.id
      and run.status in (
        'queued', 'analyzing_content', 'generating_layout', 'validating_layout',
        'generating_assets', 'validating_assets', 'ready'
      )
  ) then
    raise exception 'Template % has active section AI design runs and cannot be deleted', old.id;
  end if;
  return old;
end $$;

drop trigger if exists wizard_template_active_section_run_delete_guard on wizard_form_templates;
create trigger wizard_template_active_section_run_delete_guard
before delete on wizard_form_templates
for each row execute function prevent_wizard_template_delete_with_active_section_runs();

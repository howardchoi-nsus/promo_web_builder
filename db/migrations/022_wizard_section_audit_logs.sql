create table if not exists wizard_section_audit_logs (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid references wizard_form_templates(id) on delete set null,
  form_template_key text not null default '',
  section_id uuid references wizard_content_sections(id) on delete set null,
  section_key text not null default '',
  item_id uuid references wizard_content_section_items(id) on delete set null,
  item_key text not null default '',
  entity_type text not null check (entity_type in ('section', 'item')),
  action text not null check (action in ('create', 'update', 'delete', 'reorder', 'activate', 'draft')),
  summary text not null default '',
  previous_state jsonb,
  new_state jsonb,
  created_at timestamptz not null default now()
);

create index if not exists wizard_section_audit_logs_created_idx
  on wizard_section_audit_logs(created_at desc);

create index if not exists wizard_section_audit_logs_template_idx
  on wizard_section_audit_logs(form_template_id, created_at desc);

create index if not exists wizard_section_audit_logs_section_idx
  on wizard_section_audit_logs(section_key, created_at desc);

comment on table wizard_section_audit_logs is
  'Read-only audit trail for Admin form-template section and item CRUD operations.';

create or replace function log_wizard_form_template_section_change()
returns trigger language plpgsql as $$
declare
  v_row wizard_form_template_sections%rowtype;
  v_template_key text := '';
  v_action text;
begin
  v_row := case when tg_op = 'DELETE' then old else new end;
  select template_key into v_template_key from wizard_form_templates where id = v_row.form_template_id;
  v_action := case
    when tg_op = 'INSERT' then 'create'
    when tg_op = 'DELETE' then 'delete'
    when old.sort_order is distinct from new.sort_order then 'reorder'
    else 'update'
  end;
  insert into wizard_section_audit_logs (
    form_template_id, form_template_key, section_id, section_key,
    entity_type, action, summary, previous_state, new_state
  ) values (
    v_row.form_template_id, coalesce(v_template_key, ''), v_row.section_id, v_row.section_key,
    'section', v_action, 'Template section ' || v_action,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end
  );
  return case when tg_op = 'DELETE' then old else new end;
end $$;

drop trigger if exists wizard_form_template_section_audit on wizard_form_template_sections;
create trigger wizard_form_template_section_audit
after insert or update or delete on wizard_form_template_sections
for each row execute function log_wizard_form_template_section_change();

create or replace function log_wizard_content_section_change()
returns trigger language plpgsql as $$
declare
  v_row wizard_content_sections%rowtype;
  v_template_key text := '';
  v_action text;
begin
  v_row := case when tg_op = 'DELETE' then old else new end;
  select template_key into v_template_key from wizard_form_templates where id = v_row.owner_form_template_id;
  v_action := case
    when tg_op = 'INSERT' and new.status = 'draft' then 'draft'
    when tg_op = 'INSERT' then 'create'
    when tg_op = 'DELETE' then 'delete'
    when old.status is distinct from new.status and new.status = 'active' then 'activate'
    when old.sort_order is distinct from new.sort_order then 'reorder'
    else 'update'
  end;
  insert into wizard_section_audit_logs (
    form_template_id, form_template_key, section_id, section_key,
    entity_type, action, summary, previous_state, new_state
  ) values (
    v_row.owner_form_template_id, coalesce(v_template_key, ''),
    case when tg_op = 'DELETE' then null else v_row.id end, v_row.section_key,
    'section', v_action, v_row.name || ' section ' || v_action,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end
  );
  return case when tg_op = 'DELETE' then old else new end;
end $$;

drop trigger if exists wizard_content_section_audit on wizard_content_sections;
create trigger wizard_content_section_audit
after insert or update or delete on wizard_content_sections
for each row execute function log_wizard_content_section_change();

create or replace function log_wizard_content_section_item_change()
returns trigger language plpgsql as $$
declare
  v_row wizard_content_section_items%rowtype;
  v_section wizard_content_sections%rowtype;
  v_template_key text := '';
  v_action text;
begin
  v_row := case when tg_op = 'DELETE' then old else new end;
  select * into v_section from wizard_content_sections where id = v_row.section_id;
  select template_key into v_template_key from wizard_form_templates where id = v_section.owner_form_template_id;
  v_action := case
    when tg_op = 'INSERT' then 'create'
    when tg_op = 'DELETE' then 'delete'
    when old.sort_order is distinct from new.sort_order then 'reorder'
    else 'update'
  end;
  insert into wizard_section_audit_logs (
    form_template_id, form_template_key, section_id, section_key,
    item_id, item_key, entity_type, action, summary, previous_state, new_state
  ) values (
    v_section.owner_form_template_id, coalesce(v_template_key, ''), v_row.section_id,
    coalesce(v_section.section_key, ''),
    case when tg_op = 'DELETE' then null else v_row.id end, v_row.item_key,
    'item', v_action, v_row.name || ' item ' || v_action,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end
  );
  return case when tg_op = 'DELETE' then old else new end;
end $$;

drop trigger if exists wizard_content_section_item_audit on wizard_content_section_items;
create trigger wizard_content_section_item_audit
after insert or update or delete on wizard_content_section_items
for each row execute function log_wizard_content_section_item_change();

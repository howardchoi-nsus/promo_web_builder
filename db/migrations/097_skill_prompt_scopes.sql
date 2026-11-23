-- Additive metadata only. Existing versions keep unrestricted legacy semantics.
-- Existing immutable-version triggers remain; declare scopes on NEW versions.
alter table promo_agent_skill_versions add column if not exists allowed_prompt_types jsonb not null default '[]'::jsonb;
do $$ begin
 if not exists(select 1 from pg_constraint where conname='promo_skill_prompt_scope_array') then
  alter table promo_agent_skill_versions add constraint promo_skill_prompt_scope_array check(jsonb_typeof(allowed_prompt_types)='array');
 end if;
end $$;

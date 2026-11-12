begin;
select pg_advisory_xact_lock(hashtext('migration:091_admin_agent_skills'));
create table if not exists promo_agent_skills (
 id uuid primary key, skill_key text not null unique check(skill_key ~ '^[a-z][a-z0-9-]{1,79}$'),
 name text not null check(length(name) between 1 and 160), description text not null default '',
 active boolean not null default false, latest_version integer not null default 1 check(latest_version>0),
 updated_by text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists promo_agent_skill_versions (
 id uuid primary key, skill_id uuid not null references promo_agent_skills(id),
 version integer not null check(version>0), name text not null, source_url text not null default '',
 markdown text not null check(octet_length(markdown) between 1 and 60000),
 content_hash text not null check(content_hash ~ '^[0-9a-f]{64}$'), change_note text not null default '',
 created_by text not null, created_at timestamptz not null default now(), unique(skill_id,version)
);
create or replace function prevent_agent_skill_version_mutation() returns trigger language plpgsql as $$
begin raise exception 'Agent skill versions are immutable; create a new version'; end; $$;
drop trigger if exists agent_skill_version_immutable on promo_agent_skill_versions;
create trigger agent_skill_version_immutable before update or delete on promo_agent_skill_versions
 for each row execute function prevent_agent_skill_version_mutation();
commit;

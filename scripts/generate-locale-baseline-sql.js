const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "db", "seeds", "002_seed_locale_messages.sql");
const ko = fs.readFileSync(path.join(root, "locales", "ko.json"), "utf8").trim();
const en = fs.readFileSync(path.join(root, "locales", "en.json"), "utf8").trim();

const sql = `-- Generated from locales/ko.json and locales/en.json.
-- Idempotent: preserves existing versions and only creates a baseline active
-- version when a locale/message key has no active version.

begin;

insert into locales (code, label, is_default, enabled)
values ('ko', '한국어', false, true), ('en', 'English', false, true)
on conflict (code) do update
set label = excluded.label, enabled = true, updated_at = now();

update locales
set is_default = true, updated_at = now()
where code = 'ko'
  and not exists (select 1 from locales where is_default = true);

with baseline(locale, messages) as (
  values
    ('ko', $ko_baseline$${ko}$ko_baseline$::jsonb),
    ('en', $en_baseline$${en}$en_baseline$::jsonb)
)
insert into locale_message_keys (message_key, namespace)
select distinct entry.key, split_part(entry.key, '.', 1)
from baseline
cross join lateral jsonb_each_text(baseline.messages) as entry
on conflict (message_key) do nothing;

with baseline(locale, messages) as (
  values
    ('ko', $ko_baseline$${ko}$ko_baseline$::jsonb),
    ('en', $en_baseline$${en}$en_baseline$::jsonb)
), source as (
  select baseline.locale, entry.key as message_key, entry.value
  from baseline
  cross join lateral jsonb_each_text(baseline.messages) as entry
), inserted as (
  insert into locale_message_versions (
    locale, message_key, value, status, version, change_note, changed_by
  )
  select source.locale, source.message_key, source.value, 'active',
    coalesce((
      select max(existing.version) + 1
      from locale_message_versions existing
      where existing.locale = source.locale
        and existing.message_key = source.message_key
    ), 1),
    'Initial locale message imported from repository baseline.',
    'baseline-seed'
  from source
  where not exists (
    select 1
    from locale_message_versions active
    where active.locale = source.locale
      and active.message_key = source.message_key
      and active.status = 'active'
  )
  returning locale
)
update locales
set snapshot_revision = snapshot_revision + 1, updated_at = now()
where code in (select distinct locale from inserted);

commit;

select locale, status, count(*)::integer as message_count
from locale_message_versions
where locale in ('ko', 'en')
group by locale, status
order by locale, status;
`;

fs.writeFileSync(outputPath, sql, "utf8");
console.log(`Generated ${path.relative(root, outputPath)}`);

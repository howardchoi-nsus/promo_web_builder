with messages(locale, message_key, value) as (
  values
    ('ko', 'admin.designToken.category', '토큰 이름 (name)'),
    ('en', 'admin.designToken.category', 'Token name')
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
  'Renamed the design token category column to token name.', 'migration-074'
from next_versions
where exists (select 1 from locales where code = next_versions.locale);

update locales
set snapshot_revision = snapshot_revision + 1, updated_at = now()
where code in ('ko', 'en');

const { getSql, readBaseline, validateMessageKey, validateMessageValue } = require("../api/_locale-message-store");

const localeLabels = { ko: "한국어", en: "English" };

async function seedLocale(sql, locale) {
  const baseline = readBaseline(locale);
  if (!baseline) throw new Error(`Baseline locale not found: ${locale}`);
  await sql`
    insert into locales (code, label, is_default, enabled)
    values (${locale}, ${localeLabels[locale] || locale}, ${locale === "ko"}, true)
    on conflict (code) do update set label = excluded.label, updated_at = now()`;

  let inserted = 0;
  for (const [messageKey, rawValue] of Object.entries(baseline)) {
    validateMessageKey(messageKey);
    const value = validateMessageValue(rawValue, { baselineValue: rawValue });
    const namespace = messageKey.split(".")[0];
    await sql`
      insert into locale_message_keys (message_key, namespace)
      values (${messageKey}, ${namespace})
      on conflict (message_key) do nothing`;
    const rows = await sql`
      insert into locale_message_versions (
        locale, message_key, value, status, version, change_note, changed_by
      )
      select ${locale}, ${messageKey}, ${value}, 'active', 1,
        'Initial locale message imported from repository baseline.', 'baseline-seed'
      where not exists (
        select 1 from locale_message_versions where locale = ${locale} and message_key = ${messageKey}
      )
      returning id`;
    inserted += rows.length;
  }
  if (inserted) {
    await sql`update locales set snapshot_revision = snapshot_revision + 1, updated_at = now() where code = ${locale}`;
  }
  return { locale, keyCount: Object.keys(baseline).length, inserted };
}

async function main() {
  const sql = getSql();
  const results = [];
  for (const locale of ["ko", "en"]) results.push(await seedLocale(sql, locale));
  console.log(JSON.stringify({ ok: true, results }, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = { seedLocale };

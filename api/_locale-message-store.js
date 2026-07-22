const fs = require("node:fs");
const path = require("node:path");
const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

const MESSAGE_KEY_PATTERN = /^[a-z][A-Za-z0-9]*(\.[a-z][A-Za-z0-9]*)+$/;
const PLACEHOLDER_PATTERN = /\{([A-Za-z][A-Za-z0-9]*)\}/g;
const MAX_MESSAGE_LENGTH = 4000;
const BASELINE_LOCALES = ["ko", "en"];

function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    const error = new Error("DATABASE_URL is not configured");
    error.statusCode = 500;
    throw error;
  }
  return neon(databaseUrl);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return typeof body === "object" && !Array.isArray(body) ? body : {};
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function canonicalizeLocale(value) {
  const locale = String(value || "").trim();
  if (!locale || locale.length > 35) throw validationError("locale is required");
  try {
    return Intl.getCanonicalLocales(locale)[0];
  } catch {
    throw validationError("locale must be a valid BCP 47 language tag");
  }
}

function validateMessageKey(value) {
  const messageKey = String(value || "").trim();
  if (!MESSAGE_KEY_PATTERN.test(messageKey)) {
    throw validationError("messageKey must use dot-separated lower camelCase segments");
  }
  return messageKey;
}

function extractPlaceholders(value) {
  return [...String(value || "").matchAll(PLACEHOLDER_PATTERN)]
    .map((match) => match[1])
    .sort();
}

function validateMessageValue(value, { baselineValue } = {}) {
  const message = String(value ?? "");
  if (!message.trim()) throw validationError("value is required");
  if (message.length > MAX_MESSAGE_LENGTH) throw validationError(`value must be ${MAX_MESSAGE_LENGTH} characters or fewer`);
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(message)) throw validationError("value contains a control character");
  if (/<\/?[a-z][^>]*>/i.test(message)) throw validationError("HTML is not allowed in locale messages");
  if (baselineValue !== undefined) {
    const actual = extractPlaceholders(message);
    const expected = extractPlaceholders(baselineValue);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw validationError(`placeholder set must match baseline: ${expected.join(", ") || "none"}`);
    }
  }
  return message;
}

function validationError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function readBaseline(locale) {
  const normalized = canonicalizeLocale(locale);
  const language = normalized.split("-")[0];
  if (!BASELINE_LOCALES.includes(language)) return null;
  const candidates = [
    path.join(process.cwd(), "locales", `${language}.json`),
    path.join(__dirname, "..", "locales", `${language}.json`),
  ];
  for (const candidate of candidates) {
    try { return JSON.parse(fs.readFileSync(candidate, "utf8")); } catch { /* try next */ }
  }
  return null;
}

function baselineValueFor(locale, messageKey) {
  return readBaseline(locale)?.[messageKey] ?? readBaseline("ko")?.[messageKey];
}

function toLocale(row) {
  return {
    code: row.code,
    label: row.label,
    isDefault: Boolean(row.is_default),
    enabled: Boolean(row.enabled),
    snapshotRevision: Number(row.snapshot_revision || 0),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function toMessageVersion(row) {
  return {
    id: row.id,
    locale: row.locale,
    messageKey: row.message_key,
    namespace: row.namespace || String(row.message_key || "").split(".")[0],
    value: row.value || "",
    status: row.status,
    version: Number(row.version || 1),
    changeNote: row.change_note || "",
    changedBy: row.changed_by || "system",
    archivedAt: row.archived_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function assertEnabledLocale(sql, locale) {
  const rows = await sql`select code from locales where code = ${locale} and enabled = true limit 1`;
  if (!rows.length) throw validationError("locale is not enabled", 400);
}

async function fetchLocales(sql, { includeDisabled = true } = {}) {
  const rows = includeDisabled
    ? await sql`select code, label, is_default, enabled, snapshot_revision, created_at, updated_at from locales order by is_default desc, code asc`
    : await sql`select code, label, is_default, enabled, snapshot_revision, created_at, updated_at from locales where enabled = true order by is_default desc, code asc`;
  return rows.map(toLocale);
}

async function createLocale(sql, input) {
  const code = canonicalizeLocale(input.code);
  const label = String(input.label || code).trim();
  if (!label) throw validationError("label is required");
  const rows = await sql`
    with inserted_locale as (
      insert into locales (code, label, is_default, enabled)
      values (${code}, ${label}, false, true)
      on conflict (code) do nothing
      returning *
    ), drafts as (
      insert into locale_message_versions (
        locale, message_key, value, status, version, change_note, changed_by
      )
      select ${code}, k.message_key, '', 'draft', 1,
        'Initial translation draft created for a new locale.', 'system'
      from locale_message_keys k
      where exists (select 1 from inserted_locale)
      on conflict (locale, message_key) where status = 'draft' do nothing
    )
    select code, label, is_default, enabled, snapshot_revision, created_at, updated_at
    from inserted_locale`;
  if (!rows.length) throw validationError("locale already exists", 409);
  return toLocale(rows[0]);
}

async function updateLocale(sql, input) {
  const code = canonicalizeLocale(input.code);
  const currentRows = await sql`
    select code, label, is_default, enabled, snapshot_revision, created_at, updated_at
    from locales where code = ${code} limit 1`;
  if (!currentRows.length) throw validationError("locale not found", 404);
  const current = currentRows[0];
  const label = Object.prototype.hasOwnProperty.call(input, "label") ? String(input.label || "").trim() : current.label;
  const enabled = Object.prototype.hasOwnProperty.call(input, "enabled")
    ? normalizeBoolean(input.enabled, current.enabled)
    : Boolean(current.enabled);
  if (!label) throw validationError("label is required");
  if (current.is_default && !enabled) throw validationError("default locale cannot be disabled", 409);
  const rows = await sql`
    update locales set label = ${label}, enabled = ${enabled}, updated_at = now()
    where code = ${code}
    returning code, label, is_default, enabled, snapshot_revision, created_at, updated_at`;
  return toLocale(rows[0]);
}

async function setDefaultLocale(sql, codeInput) {
  const code = canonicalizeLocale(codeInput);
  const rows = await sql`
    with target as (
      select code from locales where code = ${code} and enabled = true
    ), cleared as (
      update locales set is_default = false, updated_at = now()
      where is_default = true and exists (select 1 from target)
    ), selected as (
      update locales set is_default = true, updated_at = now()
      where code = ${code} and exists (select 1 from target)
      returning code, label, is_default, enabled, snapshot_revision, created_at, updated_at
    ) select * from selected`;
  if (!rows.length) throw validationError("enabled locale not found", 404);
  return toLocale(rows[0]);
}

async function fetchMessages(sql, locale, { namespace = "", includeArchived = false } = {}) {
  const rows = includeArchived
    ? await sql`
      select v.id::text, v.locale, v.message_key, k.namespace, v.value, v.status, v.version,
        v.change_note, v.changed_by, v.archived_at, v.created_at, v.updated_at
      from locale_message_versions v join locale_message_keys k using (message_key)
      where v.locale = ${locale} and (${namespace} = '' or k.namespace = ${namespace})
      order by v.message_key asc, v.version desc`
    : await sql`
      select v.id::text, v.locale, v.message_key, k.namespace, v.value, v.status, v.version,
        v.change_note, v.changed_by, v.archived_at, v.created_at, v.updated_at
      from locale_message_versions v join locale_message_keys k using (message_key)
      where v.locale = ${locale} and v.status <> 'archived'
        and (${namespace} = '' or k.namespace = ${namespace})
      order by v.message_key asc, v.version desc`;
  return rows.map(toMessageVersion);
}

async function fetchSnapshot(sql, locale) {
  await assertEnabledLocale(sql, locale);
  const [localeRows, messageRows, defaultLocaleRows, defaultMessageRows] = await Promise.all([
    sql`select code, snapshot_revision, updated_at from locales where code = ${locale} limit 1`,
    sql`select message_key, value from locale_message_versions where locale = ${locale} and status = 'active' order by message_key`,
    sql`select code, snapshot_revision, updated_at from locales where is_default = true and enabled = true limit 1`,
    sql`
      select v.message_key, v.value
      from locale_message_versions v join locales l on l.code = v.locale
      where l.is_default = true and l.enabled = true and v.status = 'active'
      order by v.message_key`,
  ]);
  const messages = Object.fromEntries(messageRows.map((row) => [row.message_key, row.value]));
  const defaultMessages = Object.fromEntries(defaultMessageRows.map((row) => [row.message_key, row.value]));
  return {
    locale,
    revision: Number(localeRows[0]?.snapshot_revision || 0),
    updatedAt: localeRows[0]?.updated_at || null,
    messages,
    defaultLocale: defaultLocaleRows[0]?.code || "ko",
    defaultRevision: Number(defaultLocaleRows[0]?.snapshot_revision || 0),
    defaultMessages,
  };
}

async function saveDraft(sql, input) {
  const locale = canonicalizeLocale(input.locale);
  const messageKey = validateMessageKey(input.messageKey);
  await assertEnabledLocale(sql, locale);
  const value = validateMessageValue(input.value, { baselineValue: baselineValueFor(locale, messageKey) });
  const changeNote = String(input.changeNote || "Locale message draft updated.").trim();
  const actor = String(input.actor || "system").trim() || "system";
  const existingRows = await sql`
    select id::text from locale_message_versions
    where locale = ${locale} and message_key = ${messageKey} and status = 'draft'
    limit 1`;
  if (existingRows.length) {
    const rows = await sql`
      with updated as (
        update locale_message_versions set value = ${value}, change_note = ${changeNote},
          changed_by = ${actor}, updated_at = now()
        where id = ${existingRows[0].id}::uuid and status = 'draft'
        returning *
      ), audit as (
        insert into locale_message_audit_logs (
          locale_message_version_id, locale, message_key, action, to_version, actor, change_note
        ) select id, locale, message_key, 'update_draft', version, ${actor}, ${changeNote} from updated
      )
      select u.id::text, u.*, k.namespace from updated u join locale_message_keys k using (message_key)`;
    return toMessageVersion(rows[0]);
  }
  const namespace = messageKey.split(".")[0];
  const rows = await sql`
    with locked as (
      select pg_advisory_xact_lock(hashtext(${`${locale}:${messageKey}`}))
    ), key_row as (
      insert into locale_message_keys (message_key, namespace)
      values (${messageKey}, ${namespace})
      on conflict (message_key) do update set updated_at = locale_message_keys.updated_at
      returning message_key, namespace
    ), inserted as (
      insert into locale_message_versions (
        locale, message_key, value, status, version, change_note, changed_by
      )
      select ${locale}, ${messageKey}, ${value}, 'draft',
        coalesce((select max(version) + 1 from locale_message_versions where locale = ${locale} and message_key = ${messageKey}), 1),
        ${changeNote}, ${actor}
      from locked
      returning *
    ), audit as (
      insert into locale_message_audit_logs (
        locale_message_version_id, locale, message_key, action, to_version, actor, change_note
      ) select id, locale, message_key, 'create_draft', version, ${actor}, ${changeNote} from inserted
    )
    select i.id::text, i.*, k.namespace from inserted i join key_row k using (message_key)`;
  return toMessageVersion(rows[0]);
}

async function activateDraft(sql, id, { actor = "system", changeNote = "Locale message activated." } = {}) {
  const rows = await sql`
    with target as (
      select * from locale_message_versions where id = ${id}::uuid and status = 'draft' for update
    ), demoted as (
      update locale_message_versions v set status = 'inactive', updated_at = now()
      from target t where v.locale = t.locale and v.message_key = t.message_key and v.status = 'active'
      returning v.version
    ), promoted as (
      update locale_message_versions v set status = 'active', change_note = ${changeNote},
        changed_by = ${actor}, updated_at = now()
      from target t where v.id = t.id
      returning v.*
    ), bumped as (
      update locales l set snapshot_revision = snapshot_revision + 1, updated_at = now()
      from promoted p where l.code = p.locale
    ), audit as (
      insert into locale_message_audit_logs (
        locale_message_version_id, locale, message_key, action, from_version, to_version, actor, change_note
      ) select p.id, p.locale, p.message_key, 'activate', (select max(version) from demoted), p.version,
        ${actor}, ${changeNote} from promoted p
    )
    select p.id::text, p.*, k.namespace from promoted p join locale_message_keys k using (message_key)`;
  if (!rows.length) throw validationError("draft locale message not found", 404);
  return toMessageVersion(rows[0]);
}

async function activateDrafts(sql, idsInput, { actor = "system", changeNote = "Locale messages activated." } = {}) {
  const ids = [...new Set((Array.isArray(idsInput) ? idsInput : []).map((id) => String(id || "").trim()).filter(Boolean))];
  if (!ids.length) throw validationError("ids are required");
  const rows = await sql`
    with requested as (
      select value::uuid as id from jsonb_array_elements_text(${JSON.stringify(ids)}::jsonb)
    ), targets as (
      select v.* from locale_message_versions v join requested r on r.id = v.id
      where v.status = 'draft' for update
    ), valid as (
      select count(*) as count from targets having count(*) = ${ids.length}
    ), demoted as (
      update locale_message_versions v set status = 'inactive', updated_at = now()
      from targets t, valid
      where v.locale = t.locale and v.message_key = t.message_key and v.status = 'active'
      returning v.locale, v.message_key, v.version
    ), promoted as (
      update locale_message_versions v set status = 'active', change_note = ${changeNote},
        changed_by = ${actor}, updated_at = now()
      from targets t, valid where v.id = t.id
      returning v.*
    ), bumped as (
      update locales l set snapshot_revision = snapshot_revision + 1, updated_at = now()
      where l.code in (select distinct locale from promoted)
    ), audit as (
      insert into locale_message_audit_logs (
        locale_message_version_id, locale, message_key, action, from_version, to_version, actor, change_note
      ) select p.id, p.locale, p.message_key, 'activate',
        (select max(d.version) from demoted d where d.locale = p.locale and d.message_key = p.message_key),
        p.version, ${actor}, ${changeNote} from promoted p
    )
    select p.id::text, p.*, k.namespace from promoted p join locale_message_keys k using (message_key)
    order by p.locale, p.message_key`;
  if (rows.length !== ids.length) throw validationError("all ids must reference draft locale messages", 409);
  return rows.map(toMessageVersion);
}

async function archiveVersion(sql, id, { actor = "system", changeNote = "Locale message archived." } = {}) {
  const rows = await sql`
    with archived as (
      update locale_message_versions set status = 'archived', archived_at = now(),
        change_note = ${changeNote}, changed_by = ${actor}, updated_at = now()
      where id = ${id}::uuid and status in ('draft', 'inactive')
      returning *
    ), audit as (
      insert into locale_message_audit_logs (
        locale_message_version_id, locale, message_key, action, from_version, actor, change_note
      ) select id, locale, message_key, 'archive', version, ${actor}, ${changeNote} from archived
    )
    select a.id::text, a.*, k.namespace from archived a join locale_message_keys k using (message_key)`;
  if (!rows.length) throw validationError("only draft or inactive messages can be archived", 409);
  return toMessageVersion(rows[0]);
}

async function rollbackVersion(sql, id, { actor = "system", changeNote = "Draft restored from previous version." } = {}) {
  const sourceRows = await sql`
    select locale, message_key, value, version from locale_message_versions where id = ${id}::uuid limit 1`;
  if (!sourceRows.length) throw validationError("locale message version not found", 404);
  const source = sourceRows[0];
  validateMessageValue(source.value, { baselineValue: baselineValueFor(source.locale, source.message_key) });
  const rows = await sql`
    with locked as (
      select pg_advisory_xact_lock(hashtext(${`${source.locale}:${source.message_key}`}))
    ), inserted as (
      insert into locale_message_versions (
        locale, message_key, value, status, version, change_note, changed_by
      )
      select ${source.locale}, ${source.message_key}, ${source.value}, 'draft',
        coalesce((select max(version) + 1 from locale_message_versions
          where locale = ${source.locale} and message_key = ${source.message_key}), 1),
        ${changeNote}, ${actor}
      from locked
      where not exists (
        select 1 from locale_message_versions
        where locale = ${source.locale} and message_key = ${source.message_key} and status = 'draft'
      )
      returning *
    ), audit as (
      insert into locale_message_audit_logs (
        locale_message_version_id, locale, message_key, action, from_version, to_version, actor, change_note
      ) select id, locale, message_key, 'rollback', ${Number(source.version)}, version, ${actor}, ${changeNote}
      from inserted
    )
    select i.id::text, i.*, k.namespace from inserted i join locale_message_keys k using (message_key)`;
  if (!rows.length) throw validationError("archive the existing draft before rollback", 409);
  return toMessageVersion(rows[0]);
}

async function fetchHistory(sql, locale, messageKey) {
  const rows = await sql`
    select v.id::text, v.*, k.namespace
    from locale_message_versions v join locale_message_keys k using (message_key)
    where v.locale = ${locale} and v.message_key = ${messageKey}
    order by v.version desc`;
  return rows.map(toMessageVersion);
}

module.exports = {
  BASELINE_LOCALES,
  MAX_MESSAGE_LENGTH,
  MESSAGE_KEY_PATTERN,
  getSql,
  parseBody,
  normalizeBoolean,
  canonicalizeLocale,
  validateMessageKey,
  extractPlaceholders,
  validateMessageValue,
  readBaseline,
  baselineValueFor,
  toLocale,
  toMessageVersion,
  assertEnabledLocale,
  fetchLocales,
  createLocale,
  updateLocale,
  setDefaultLocale,
  fetchMessages,
  fetchSnapshot,
  saveDraft,
  activateDraft,
  activateDrafts,
  archiveVersion,
  rollbackVersion,
  fetchHistory,
};

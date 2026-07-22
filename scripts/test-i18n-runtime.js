const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "prototype", "i18n-runtime.js"), "utf8");
const baselines = {
  ko: JSON.parse(fs.readFileSync(path.join(root, "locales", "ko.json"), "utf8")),
  en: JSON.parse(fs.readFileSync(path.join(root, "locales", "en.json"), "utf8")),
};
const stored = new Map();
const requests = [];

function response(body, { status = 200, etag = "" } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => name.toLowerCase() === "etag" ? etag : null },
    json: async () => body,
  };
}

const window = {
  navigator: { language: "ko-KR", languages: ["ko-KR"] },
  document: { documentElement: { lang: "" } },
  localStorage: {
    getItem: (key) => stored.get(key) || null,
    setItem: (key, value) => stored.set(key, value),
  },
  fetch: async (url, options = {}) => {
    requests.push({ url, options });
    const baselineMatch = url.match(/^\/locales\/(.+)\.json$/);
    if (baselineMatch) {
      const locale = decodeURIComponent(baselineMatch[1]);
      return baselines[locale] ? response(baselines[locale]) : response({}, { status: 404 });
    }
    const locale = new URL(url, "https://example.test").searchParams.get("locale");
    return response({
      ok: true,
      locale,
      defaultLocale: "ko",
      revision: locale === "en" ? 4 : 3,
      messages: locale === "en" ? { "common.action.save": "Save from DB" } : { "common.action.save": "DB 저장" },
      defaultMessages: { "common.action.cancel": "DB 취소" },
    }, { etag: `"${locale}-revision"` });
  },
};

vm.runInNewContext(source, { window, Intl, URL, encodeURIComponent, Object, Set, Map, String, Number, Promise });

(async () => {
  let notifications = 0;
  const unsubscribe = window.PromoI18n.subscribe(() => { notifications += 1; });
  await window.PromoI18n.init({ locale: "ko-KR" });
  assert.equal(window.document.documentElement.lang, "ko-KR");
  assert.equal(window.PromoI18n.t("common.action.save"), baselines.ko["common.action.save"]);

  await window.PromoI18n.reloadSnapshot();
  assert.equal(window.PromoI18n.t("common.action.save"), "DB 저장");
  assert.equal(window.PromoI18n.t("builder.sectionCount", { count: 5 }), baselines.ko["builder.sectionCount"].replace("{count}", "5"));
  assert.equal(window.PromoI18n.t("missing.key"), "missing.key");

  await window.PromoI18n.setLocale("en");
  assert.equal(window.PromoI18n.getLocale(), "en");
  assert.equal(window.document.documentElement.lang, "en");
  assert.equal(stored.get("promoPrototype.locale.v1"), "en");
  assert.equal(window.PromoI18n.t("common.action.save"), "Save from DB");
  assert.equal(window.PromoI18n.t("common.action.cancel"), baselines.en["common.action.cancel"]);
  assert.ok(notifications >= 4);

  await window.PromoI18n.reloadSnapshot();
  const lastRequest = requests.at(-1);
  assert.equal(lastRequest.options.headers["If-None-Match"], '"en-revision"');
  unsubscribe();
  console.log("i18n runtime behavior test passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

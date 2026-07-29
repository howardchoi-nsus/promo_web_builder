const assert = require("node:assert/strict");

const originalFetch = global.fetch;
const originalApiKey = process.env.OPENAI_API_KEY;
process.env.OPENAI_API_KEY = "test-openai-key";

let providerOutput = "섹션: {{sectionName}}\n콘텐츠: {{contentJson}}";
global.fetch = async () => ({
  ok: true,
  headers: { get: () => "request-test" },
  json: async () => ({
    output_text: providerOutput,
    usage: { input_tokens: 10, output_tokens: 8 },
  }),
});

const handler = require("../api/prompt-template-translate");

function responseRecorder() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

(async () => {
  const success = responseRecorder();
  await handler({
    method: "POST",
    headers: { origin: "https://promo.test", host: "promo.test" },
    body: {
      text: "Section: {{sectionName}}\nContent: {{contentJson}}",
    },
  }, success);
  assert.equal(success.statusCode, 200);
  assert.equal(success.payload.ok, true);
  assert.match(success.payload.translation, /\{\{sectionName\}\}/);
  assert.match(success.payload.translation, /\{\{contentJson\}\}/);
  assert.equal(success.headers["Cache-Control"], "no-store");

  providerOutput = "섹션 이름을 번역했지만 변수는 제거했습니다.";
  const mismatch = responseRecorder();
  await handler({
    method: "POST",
    headers: { origin: "https://promo.test", host: "promo.test" },
    body: {
      text: "Section: {{sectionName}}",
    },
  }, mismatch);
  assert.equal(mismatch.statusCode, 502);
  assert.equal(mismatch.payload.code, "PROMPT_TRANSLATION_PLACEHOLDER_MISMATCH");

  const crossOrigin = responseRecorder();
  await handler({
    method: "POST",
    headers: { origin: "https://attacker.test", host: "promo.test" },
    body: { text: "Translate this prompt." },
  }, crossOrigin);
  assert.equal(crossOrigin.statusCode, 403);
  assert.equal(crossOrigin.payload.code, "PROMPT_TRANSLATION_ORIGIN_REQUIRED");

  const method = responseRecorder();
  await handler({ method: "GET" }, method);
  assert.equal(method.statusCode, 405);
  assert.equal(method.headers.Allow, "POST");

  console.log("Prompt template translation tests passed");
})().finally(() => {
  global.fetch = originalFetch;
  if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalApiKey;
});

import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { fetchDirectusWithRetry, secretFromRef } = require("../api/directus-connection-test.js");
let healthAttempts = 0;
let observedAuthorization = "";
const server = http.createServer((request, response) => {
  observedAuthorization = String(request.headers.authorization || "");
  if (request.url === "/server/health" && healthAttempts++ === 0) {
    response.writeHead(503, { "Content-Type": "application/json" });
    response.end('{"status":"error"}');
    return;
  }
  if (request.url === "/server/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end('{"status":"ok"}');
    return;
  }
  response.writeHead(404).end();
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  const { port } = server.address();
  const result = await fetchDirectusWithRetry(`http://127.0.0.1:${port}/server/health`, {
    token: "mock-token",
    timeoutMs: 1000,
    retryCount: 1,
  });
  assert.equal(result.status, "ok");
  assert.equal(healthAttempts, 2);
  assert.equal(observedAuthorization, "Bearer mock-token");
  assert.equal(secretFromRef("env:DIRECTUS_SECRET_TEST", { DIRECTUS_SECRET_TEST: "resolved" }), "resolved");
  assert.equal(secretFromRef("env:OTHER_SECRET", { OTHER_SECRET: "blocked" }), "");
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log("Directus connection client mock tests passed.");

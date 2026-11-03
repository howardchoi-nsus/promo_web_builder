import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const { createHandler } = require("../api/promo-page-quality-test");
const qualityHandler = createHandler({ env: {} });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshotDirectory = process.argv.find((value) => value.startsWith("--screenshot-dir="))?.split("=").slice(1).join("=") || "";
const assets = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/output-quality-test", ["output-quality-test.html", "text/html; charset=utf-8"]],
  ["/output-quality-test.html", ["output-quality-test.html", "text/html; charset=utf-8"]],
  ["/output-quality-test.css", ["output-quality-test.css", "text/css; charset=utf-8"]],
  ["/output-quality-test.js", ["output-quality-test.js", "text/javascript; charset=utf-8"]],
]);

async function body(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function apiResponse(res) {
  return {
    setHeader(name, value) { res.setHeader(name, value); },
    status(code) { res.statusCode = code; return this; },
    json(value) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(value));
      return this;
    },
  };
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (url.pathname === "/api/promo-page-quality-test") {
      await qualityHandler({ method: req.method, headers: req.headers, body: req.method === "POST" ? await body(req) : {} }, apiResponse(res));
      return;
    }
    const asset = assets.get(url.pathname);
    if (!asset) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", asset[1]);
    res.end(await readFile(path.join(root, asset[0])));
  } catch (error) {
    res.statusCode = 500;
    res.end(error.message);
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const origin = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(origin, { waitUntil: "domcontentloaded" });
  const testCard = page.getByRole("link", { name: /웹 출력 품질 테스트/ });
  await testCard.waitFor();
  await testCard.click();
  await page.waitForURL(`${origin}/output-quality-test`);
  await page.getByText("샘플 테스트 가능", { exact: true }).waitFor();
  await page.getByRole("button", { name: /샘플 검사 실행/ }).click();
  await page.getByText("샘플 출력 계약을 통과했습니다.", { exact: true }).waitFor();
  await page.frameLocator("#result-frame").getByRole("heading", { name: "가을 멤버 위크" }).waitFor();
  assert.equal(await page.locator(".check-card.is-passed").count(), 1);
  assert.equal(await page.locator(".check-card.is-not-run").count(), 3);
  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(screenshotDirectory, "03-quality-console-desktop.png"), fullPage: true });
  }

  await page.getByRole("button", { name: /Mobile 390/ }).click();
  assert.equal(await page.locator("#result-frame").evaluate((frame) => frame.style.width), "390px");
  assert.equal(await page.getByRole("link", { name: "결과 페이지 열기" }).isHidden(), true);
  await page.locator('[name="title"]').fill("수정된 가을 멤버 위크");
  await page.getByText("입력 내용이 변경되었습니다.", { exact: true }).waitFor();
  assert.equal(await page.locator("#result-frame").isHidden(), true);
  await page.getByRole("button", { name: /샘플 검사 실행/ }).click();
  await page.frameLocator("#result-frame").getByRole("heading", { name: "수정된 가을 멤버 위크" }).waitFor();
  assert.deepEqual(pageErrors, []);

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const mobileErrors = [];
  mobilePage.on("pageerror", (error) => mobileErrors.push(error.message));
  await mobilePage.goto(`${origin}/output-quality-test`, { waitUntil: "domcontentloaded" });
  await mobilePage.getByText("샘플 테스트 가능", { exact: true }).waitFor();
  await mobilePage.getByRole("button", { name: /샘플 검사 실행/ }).click();
  await mobilePage.getByText("샘플 출력 계약을 통과했습니다.", { exact: true }).waitFor();
  await mobilePage.frameLocator("#result-frame").getByRole("heading", { name: "가을 멤버 위크" }).waitFor();
  await mobilePage.getByRole("button", { name: /Mobile 390/ }).click();
  if (screenshotDirectory) {
    await mobilePage.locator("#preview-shell").screenshot({ path: path.join(screenshotDirectory, "05-quality-console-mobile-preview.png") });
    await mobilePage.evaluate(() => window.scrollTo(0, 0));
    await mobilePage.screenshot({ path: path.join(screenshotDirectory, "04-quality-console-mobile.png"), fullPage: true });
  }
  assert.deepEqual(mobileErrors, []);
  await mobilePage.close();
  console.log("Output quality test browser flow passed");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

import assert from "node:assert/strict";
import { chromium } from "playwright";
import {
  assertPromoPageBrowserQuality,
  evaluatePromoPageBrowserQuality,
} from "./lib/promo-page-browser-quality-gate.mjs";

const requiredVisibleCopy = [
  "Autumn Member Week",
  "A clearer way to unlock your seasonal benefit.",
  "Available to eligible members for a limited time.",
  "View benefit",
  "Eligibility and local terms apply.",
];

const qualityChecks = [
  "CONTENT_FIDELITY: PASS",
  "RESPONSIVE_1440: PASS",
  "RESPONSIVE_390: PASS",
  "ACCESSIBILITY: PASS",
  "CONTRAST: PASS",
  "OVERFLOW: PASS",
  "LEGAL_VISIBILITY: PASS",
  "TOKEN_DISCIPLINE: PASS",
  "TEXT_FIRST_MVP: PASS",
  "DUPLICATE_COPY: PASS",
];

const html = `<main class="promo-generated-page">
  <section class="hero" aria-labelledby="promo-title">
    <p class="eyebrow">Member benefit</p>
    <h1 id="promo-title">Autumn Member Week</h1>
    <p class="lead">A clearer way to unlock your seasonal benefit.</p>
    <p class="subline">Available to eligible members for a limited time.</p>
    <a class="primary-cta" href="/benefits/autumn">View benefit</a>
  </section>
  <footer><p class="terms">Eligibility and local terms apply.</p></footer>
</main>`;

const css = `.promo-generated-page {
  width: 100%;
  min-width: 0;
  color: #141414;
  background: #ffffff;
  font-family: Arial, sans-serif;
  padding: 64px clamp(24px, 7vw, 112px);
}
.promo-generated-page .hero { max-width: 760px; margin: 0 auto; }
.promo-generated-page h1 { margin: 12px 0; font-size: clamp(40px, 6vw, 76px); line-height: 1; }
.promo-generated-page p { line-height: 1.55; }
.promo-generated-page .primary-cta {
  display: inline-flex;
  min-width: 160px;
  min-height: 48px;
  margin-top: 20px;
  padding: 12px 20px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #173f2b;
  text-decoration: none;
}
.promo-generated-page .primary-cta:focus-visible { outline: 3px solid #b42318; outline-offset: 3px; }
.promo-generated-page footer { max-width: 760px; margin: 72px auto 0; border-top: 1px solid #767676; }
.promo-generated-page .terms { font-size: 14px; }
@media (max-width: 420px) {
  .promo-generated-page { padding: 32px 20px; }
  .promo-generated-page h1 { font-size: 42px; }
  .promo-generated-page .primary-cta { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .promo-generated-page, .promo-generated-page * { animation-duration: 0s !important; transition-duration: 0s !important; }
}`;

function generated(overrides = {}) {
  return {
    designIntent: "A restrained editorial promotion with a clear conversion path.",
    layoutSummary: "Single-column hero followed by a separated legal footer.",
    mdComplianceMap: {
      layoutPhilosophy: "Editorial hierarchy",
      visualMood: "Calm and precise",
      spacingRhythm: "Eight point rhythm",
      componentStyle: "Solid text-first surfaces",
      depthAndEffects: "No decorative depth",
      shapeAndRadius: "Square CTA treatment",
      promoPageImplications: "Direct offer and legal hierarchy",
      dosApplied: ["Clear hierarchy"],
      dontsAvoided: ["No media"],
      notColorFontOnlyProof: "The layout uses explicit content grouping, spacing, and a separated legal region.",
    },
    html,
    css,
    qualityChecks,
    ...overrides,
  };
}

function input(overrides = {}) {
  return {
    generated: generated(),
    requiredVisibleCopy,
    ctaUrl: "/benefits/autumn",
    allowedUrls: ["/benefits/autumn"],
    locale: "en-US",
    market: "US",
    ...overrides,
  };
}

function diagnosticCodes(error) {
  return Object.values(error?.details?.results || {})
    .flatMap((result) => result.diagnostics || [])
    .map((diagnostic) => diagnostic.code);
}

const browser = await chromium.launch({ headless: true });
try {
  const passing = await assertPromoPageBrowserQuality(input(), { browser });
  assert.equal(passing.qualityGate.state, "passed");
  assert.equal(passing.qualityGate.blockingCount, 0);
  assert.equal(passing.qualityGate.results.desktop.state, "passed");
  assert.equal(passing.qualityGate.results.mobile.state, "passed");

  const hidden = await evaluatePromoPageBrowserQuality(input({
    generated: generated({ css: `${css}\n.promo-generated-page .terms { display: none; }` }),
  }), { browser });
  assert.equal(hidden.qualityGate.state, "failed");
  assert.ok(Object.values(hidden.qualityGate.results)
    .flatMap((result) => result.diagnostics)
    .some((diagnostic) => diagnostic.code === "VISIBLE_COPY_MISSING"));

  await assert.rejects(
    () => assertPromoPageBrowserQuality(input({
      generated: generated({ css: `${css}\n@media (max-width: 420px) { .promo-generated-page { width: 700px; } }` }),
    }), { browser }),
    (error) => error.code === "PAGE_BROWSER_QUALITY_FAILED"
      && diagnosticCodes(error).includes("HORIZONTAL_OVERFLOW"),
  );

  await assert.rejects(
    () => assertPromoPageBrowserQuality(input({
      generated: generated({ css: `${css}\n.promo-generated-page .primary-cta { min-height: 0; height: 20px; padding-top: 0; padding-bottom: 0; }` }),
    }), { browser }),
    (error) => diagnosticCodes(error).includes("CTA_TARGET_TOO_SMALL"),
  );

  await assert.rejects(
    () => assertPromoPageBrowserQuality(input({
      generated: generated({ css: `${css}\n.promo-generated-page { color: #aaaaaa; }` }),
    }), { browser }),
    (error) => diagnosticCodes(error).includes("TEXT_CONTRAST_LOW"),
  );

  await assert.rejects(
    () => assertPromoPageBrowserQuality(input({
      generated: generated({ css: css.replace(
        ".promo-generated-page .primary-cta:focus-visible { outline: 3px solid #b42318; outline-offset: 3px; }",
        ".promo-generated-page .primary-cta:focus-visible { outline: none; box-shadow: none; }",
      ) }),
    }), { browser }),
    (error) => diagnosticCodes(error).includes("FOCUS_INDICATOR_MISSING"),
  );

  await assert.rejects(
    () => assertPromoPageBrowserQuality(input({
      generated: generated({ css: `${css.replace(
        "animation-duration: 0s !important; transition-duration: 0s !important;",
        "color: inherit !important;",
      )}\n.promo-generated-page h1 { transition: color 2s; }` }),
    }), { browser }),
    (error) => diagnosticCodes(error).includes("REDUCED_MOTION_ACTIVE"),
  );

  await assert.rejects(
    () => assertPromoPageBrowserQuality(input({
      generated: generated({ css: `${css}\n.promo-generated-page .terms { height: 8px; overflow: hidden; }` }),
    }), { browser }),
    (error) => diagnosticCodes(error).includes("CONTENT_CLIPPED"),
  );

  console.log("Promo page browser quality gate tests passed.");
} finally {
  await browser.close();
}

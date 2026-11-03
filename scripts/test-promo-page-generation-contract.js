const assert = require("node:assert/strict");
const {
  REQUIRED_QUALITY_CHECKS,
  resolveDocumentLanguage,
  validatePromoPageGenerationResult,
} = require("../api/_promo-page-generation-contract");
const { requirePromptRuntimeService } = require("../api/_prompt-runtime-auth");

const validResult = {
  designIntent: "A single offer-led hero moves into supporting details and a restrained legal close.",
  layoutSummary: "Desktop uses a measured two-column hero while mobile reflows CTA and terms into document order.",
  mdComplianceMap: {
    layoutPhilosophy: "Offer-first hierarchy with a narrow supporting rail.",
    visualMood: "Solid high-contrast surfaces and restrained borders.",
    spacingRhythm: "Section spacing decreases from hero to legal content.",
    componentStyle: "Square cards and one dominant CTA treatment.",
    depthAndEffects: "Borders replace decorative shadows.",
    shapeAndRadius: "Small consistent radii preserve the selected geometry.",
    promoPageImplications: "Hero, benefits, CTA, and terms have distinct roles.",
    dosApplied: ["Used one dominant offer focal point."],
    dontsAvoided: ["Avoided repeated equal-weight cards."],
    notColorFontOnlyProof: "The layout changes density, section rhythm, CTA placement, and mobile reading order beyond color and typography.",
  },
  html: [
    '<main class="promo-generated-page">',
    '<section><p>기간 한정</p><h1>신규 고객 20% 혜택</h1><p>오늘부터 사용할 수 있습니다.</p>',
    '<a class="promo-cta" href="https://example.com/apply">지금 신청</a></section>',
    '<section aria-labelledby="terms-title"><h2 id="terms-title">유의사항</h2><p>대상 고객에게만 적용됩니다.</p></section>',
    '</main>',
  ].join(""),
  css: [
    '.promo-generated-page { box-sizing: border-box; max-width: 100%; overflow-wrap: anywhere; }',
    '.promo-generated-page .promo-cta:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }',
    '@media (max-width: 390px) { .promo-generated-page section { display: block; } }',
    '@media (prefers-reduced-motion: reduce) { .promo-generated-page * { animation: none; transition: none; } }',
  ].join("\n"),
  qualityChecks: REQUIRED_QUALITY_CHECKS.map((check) => `${check}: PASS`),
};

const context = {
  requiredVisibleCopy: [
    "기간 한정",
    "신규 고객 20% 혜택",
    "오늘부터 사용할 수 있습니다.",
    "지금 신청",
    "대상 고객에게만 적용됩니다.",
  ],
  ctaUrl: "https://example.com/apply",
  allowedUrls: ["https://example.com/apply"],
  locale: "ko-KR",
  market: "KR",
};

const validated = validatePromoPageGenerationResult(validResult, context);
assert.equal(validated.documentLanguage, "ko");
assert.equal(validated.result.html, validResult.html);
assert.equal(validated.result.qualityChecks.length, REQUIRED_QUALITY_CHECKS.length);
assert.equal(resolveDocumentLanguage({ locale: "en-US", market: "KR" }), "en");
assert.equal(resolveDocumentLanguage({ market: "JP" }), "ja");
assert.equal(resolveDocumentLanguage({ visibleCopy: ["한국어 콘텐츠"] }), "ko");

function invalid(patch, expectedCode) {
  assert.throws(
    () => validatePromoPageGenerationResult({ ...validResult, ...patch }, context),
    (error) => error.code === expectedCode && error.statusCode === 422,
  );
}

invalid({ unexpected: true }, "PAGE_RESULT_SHAPE_INVALID");
invalid({ html: validResult.html.replace("<main", "<div").replace("</main>", "</div>") }, "PAGE_ROOT_INVALID");
invalid({ html: `${validResult.html}<script>alert(1)</script>` }, "PAGE_UNSAFE_HTML");
invalid({ html: validResult.html.replace("<section>", '<section onclick="alert(1)">') }, "PAGE_UNSAFE_HTML");
invalid({ html: validResult.html.replace("</main>", '<img src="x"></main>') }, "PAGE_UNSAFE_HTML");
invalid({ css: `${validResult.css}\n.promo-generated-page{background-image:url(https://example.com/x.png)}` }, "PAGE_UNSAFE_CSS");
invalid({ css: validResult.css.replace(/@media \(max-width: 390px\)[^}]*}\s*/s, "") }, "PAGE_MOBILE_CSS_MISSING");
invalid({ css: validResult.css.replace(":focus-visible", ":focus") }, "PAGE_FOCUS_STYLE_MISSING");
invalid({ css: validResult.css.replace("prefers-reduced-motion: reduce", "prefers-reduced-motion: no-preference") }, "PAGE_REDUCED_MOTION_MISSING");
invalid({ qualityChecks: validResult.qualityChecks.filter((item) => !item.includes("OVERFLOW")) }, "PAGE_QUALITY_CHECKS_MISSING");
invalid({ qualityChecks: validResult.qualityChecks.map((item) => item.includes("OVERFLOW") ? "OVERFLOW: FAIL" : item) }, "PAGE_QUALITY_CHECKS_FAILED");
invalid({ html: validResult.html.replace("대상 고객에게만 적용됩니다.", "") }, "PAGE_REQUIRED_COPY_MISSING");
invalid({ html: validResult.html.replace("https://example.com/apply", "#apply") }, "PAGE_CTA_URL_MISSING");
invalid({ html: validResult.html.replace("</main>", '<a href="https://evil.example">More</a></main>') }, "PAGE_UNAPPROVED_LINK");
invalid({ html: validResult.html.replace("</main>", '<a href=https://evil.example>More</a></main>') }, "PAGE_LINK_ATTRIBUTE_INVALID");
invalid({
  html: validResult.html.replace(
    'href="https://example.com/apply"',
    'href="https://example.com/apply" href=https://evil.example',
  ),
}, "PAGE_LINK_ATTRIBUTE_INVALID");
assert.throws(
  () => validatePromoPageGenerationResult(validResult, { ...context, ctaUrl: "javascript:alert(1)" }),
  (error) => error.code === "PAGE_ALLOWED_URL_INVALID",
);
assert.doesNotThrow(() => validatePromoPageGenerationResult({
  ...validResult,
  html: validResult.html.replace("대상 고객에게만 적용됩니다.", "대상 <strong>고객</strong>에게만 적용됩니다."),
}, context));

const token = "0123456789abcdef0123456789abcdef";
assert.throws(
  () => requirePromptRuntimeService({ headers: {} }, { env: {} }),
  (error) => error.code === "PROMPT_RUNTIME_AUTH_NOT_CONFIGURED",
);
assert.equal(requirePromptRuntimeService({ headers: {} }, {
  env: { PROMPT_RUNTIME_LOCAL_ACCESS_ENABLED: "true" },
}).localOnly, true);
assert.throws(
  () => requirePromptRuntimeService({ headers: {} }, {
    env: { PROMPT_RUNTIME_LOCAL_ACCESS_ENABLED: "true", PROMPT_RUNTIME_SERVICE_TOKEN: "too-short" },
  }),
  (error) => error.code === "PROMPT_RUNTIME_AUTH_NOT_CONFIGURED",
);
assert.throws(
  () => requirePromptRuntimeService({ headers: {} }, { env: { VERCEL_ENV: "production" } }),
  (error) => error.code === "PROMPT_RUNTIME_AUTH_NOT_CONFIGURED" && error.statusCode === 503,
);
assert.throws(
  () => requirePromptRuntimeService({ headers: { authorization: "Bearer wrong" } }, {
    env: { VERCEL_ENV: "preview", PROMPT_RUNTIME_SERVICE_TOKEN: token },
  }),
  (error) => error.code === "PROMPT_RUNTIME_AUTH_REQUIRED" && error.statusCode === 403,
);
assert.equal(requirePromptRuntimeService({ headers: { authorization: `Bearer ${token}` } }, {
  env: { VERCEL_ENV: "preview", PROMPT_RUNTIME_SERVICE_TOKEN: token },
}).authenticated, true);

console.log("Promo page generation runtime contract tests passed.");

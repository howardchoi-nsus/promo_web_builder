const assert = require("assert");
const fs = require("fs");
const path = require("path");

const {
  buildDesignPromptMarkdown,
  buildPromoInputMarkdown,
} = require("../api/_promo-markdown-builders");

const generatedAt = new Date("2026-07-01T07:07:43.116Z");
const payload = {
  promo: {
    title: "GGPoker Welcome Bonus",
    template: "Template 4",
    market: "Global",
    leadText: "Welcome bonus for new players",
    ctaLabel: "Claim Bonus",
    ctaUrl: "https://example.com",
    subline: "Start with tournament tickets",
    termsText: "Terms and conditions apply.",
  },
  simpleBrief: {
    mainOffer: "Give new players a first deposit bonus and tournament tickets",
  },
  promotionInput: {
    purpose: "이벤트",
    targetCustomer: "기존고객",
    campaignTone: "프리미엄",
  },
  sectionInputs: {
    header: { logoText: "GGPoker", badgeText: "Global" },
    heroBanner: {
      leaderText: "Welcome Bonus",
      title: "Start strong on GGPoker",
      sublineText: "Get a first deposit bonus and tournament tickets.",
      cta: { label: "Claim Bonus", link: "https://example.com" },
      visualMode: "auto",
    },
  },
  sectionConfig: {
    sections: [
      { sectionId: "header", name: "Header", visible: true },
      { sectionId: "heroBanner", name: "Hero Banner", visible: true },
      { sectionId: "stepBar", name: "Step Bar", visible: true },
      { sectionId: "contentCta", name: "Contents", visible: true },
      { sectionId: "imageTextRow", name: "Image Text Row", visible: true },
      { sectionId: "titleDescription", name: "Title and Description", visible: true },
      { sectionId: "footer", name: "Footer", visible: true },
    ],
  },
  template: {
    id: "temp4",
    name: "Template 4",
    sectionVisibility: {
      header: true,
      heroBanner: true,
      stepBar: true,
      contentCta: true,
      imageTextRow: true,
      titleDescription: true,
      footer: true,
    },
  },
  design: { primaryColor: "#111827" },
  md: {
    id: "sample-md",
    brand: "together.ai",
    slug: "together-ai",
    styleClassification: {
      primaryGroup: { slug: "minimal_product", name: "Minimal Product" },
      colorMode: "dark",
      typographyTone: "technical",
      shapeModel: "soft",
      depthModel: "flat",
      styleTags: ["ai", "product", "minimal"],
    },
    designData: {
      extractionStatus: "extracted",
      sourceHash: "sample-hash",
      normalizedSchema: {
        schemaVersion: "design-md-normalized-v1",
        tokens: {
          color: {
            primary: { $type: "color", $value: "#111827", $description: "Primary surface text" },
            background: { $type: "color", $value: "#ffffff" },
          },
          typography: {
            displayFont: { $type: "fontFamily", $value: "Inter" },
            titleWeight: { $type: "fontWeight", $value: "700" },
          },
          radius: {
            medium: { $type: "radius", $value: "8px" },
          },
          spacing: {
            base: { $type: "dimension", $value: "8px" },
          },
          elevation: {
            depthModel: { $type: "string", $value: "flat" },
          },
          breakpoint: {
            desktop: { $type: "dimension", $value: "1440px" },
          },
        },
        components: {
          button: { summary: "compact rounded CTA button" },
        },
        layouts: {
          grid: { summary: "dense responsive grid" },
        },
        guidelines: {
          do: ["keep hierarchy web UI oriented"],
          avoid: ["poster-only composition"],
        },
      },
      tokenItems: [
        {
          tokenPath: "color.primary",
          tokenType: "color",
          tokenValue: "#111827",
          confidence: 0.9,
        },
      ],
      componentPatterns: [
        {
          componentType: "button",
          patternKey: "primary-cta",
          valueJson: { summary: "compact rounded CTA button" },
        },
      ],
      layoutPatterns: [
        {
          layoutType: "grid",
          patternKey: "dense-grid",
          valueJson: { summary: "dense responsive grid" },
        },
      ],
      guidelineItems: [
        {
          guidelineType: "do",
          key: "web-ui-hierarchy",
          value: "keep hierarchy web UI oriented",
        },
      ],
    },
  },
};

const markdown = buildDesignPromptMarkdown({
  runKey: "promo-030",
  promptGroupId: "D0xUF",
  generatedAt,
  payload,
});
const sectionInputLog = buildPromoInputMarkdown({
  runKey: "promo-030",
  promptGroupId: "D0xUF",
  generatedAt,
  payload,
  promo: payload.promo,
  md: payload.md,
  template: payload.template,
});

const required = [
  'type: design_prompt',
  'runKey: "promo-030"',
  'promptGroupId: "D0xUF"',
  "generatedAt: 2026-07-01T07:07:43.116Z",
  'promoTitle: "GGPoker Welcome Bonus"',
  'selectedMd: "together.ai"',
  "# Design Tokens",
  "## Classification",
  "## Colors",
  "## Typography",
  "## Components",
  "## Layouts",
  "## Guidelines",
  "## Token Items",
  "## Component Patterns",
  "## Layout Patterns",
  "## Guideline Items",
  "- primary: #111827",
  "- button: compact rounded CTA button",
];

const forbidden = [
  "## Image Prompt",
  "## Design Brief",
  "## Integrated Design Brief",
  "## Integrated Design Brief JSON",
  "## Layout Mapping",
  "## MD Compliance Map",
];

for (const item of required) {
  assert(markdown.includes(item), `Expected markdown to include: ${item}`);
}

assert(
  /timestampStamp: "\d{10}"/.test(markdown),
  "Expected markdown to include a YYMMDDHHMM timestampStamp",
);

for (const item of forbidden) {
  assert(!markdown.includes(item), `Expected markdown not to include: ${item}`);
}

const outputPath = path.join(process.cwd(), "tmp", "design-prompt-md-test.md");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown, "utf8");

assert(sectionInputLog.includes("type: section_input_log"), "Expected Section Input Log frontmatter type");
assert(sectionInputLog.includes("# Promotion Input Log MD"), "Expected Promotion Input Log title");
assert(sectionInputLog.includes("## Promotion Strategy"), "Expected Promotion Strategy section");
assert(sectionInputLog.includes("## Market / Region Context"), "Expected Market / Region Context section");
assert(sectionInputLog.includes("## Promotion Content Contract"), "Expected Promotion Content Contract section");
assert(sectionInputLog.includes("## Page Composition"), "Expected Page Composition section");
assert(sectionInputLog.includes("## Section Content Mapping"), "Expected Section Content Mapping section");
assert(sectionInputLog.includes("## Section Visibility / Generation Controls"), "Expected Section Visibility / Generation Controls section");
assert(sectionInputLog.includes("## Raw Payload Snapshot"), "Expected Raw Payload Snapshot section");
assert(sectionInputLog.includes("### 4. Contents"), "Expected configured displayName for Content CTA section");
assert(sectionInputLog.includes("- sectionId: contentCta"), "Expected stable sectionId for Content CTA");
assert(sectionInputLog.includes("### 6. Title and Description"), "Expected Title and Description section mapping");
assert(sectionInputLog.includes("Start strong on GGPoker"), "Expected visible copy in Section Input Log");
assert(sectionInputLog.includes("- Purpose: Event"), "Expected Korean purpose option to be normalized to English");
assert(sectionInputLog.includes("- Target Customer: Existing customers"), "Expected Korean customer option to be normalized to English");
assert(sectionInputLog.includes("- Campaign Tone: Premium"), "Expected Korean tone option to be normalized to English");
assert(!sectionInputLog.includes("이벤트"), "Expected Korean purpose option not to remain in Section Input Log");
assert(!sectionInputLog.includes("기존고객"), "Expected Korean customer option not to remain in Section Input Log");
assert(!sectionInputLog.includes("프리미엄"), "Expected Korean tone option not to remain in Section Input Log");

const reorderedPayload = JSON.parse(JSON.stringify(payload));
reorderedPayload.sectionConfig.orderedSections = ["contentCta", "heroBanner", "header"];
reorderedPayload.sectionConfig.sectionVisibility = {
  contentCta: true,
  heroBanner: true,
  header: true,
};
reorderedPayload.template.sectionOrder = ["header", "heroBanner", "contentCta"];
reorderedPayload.template.visibleSections = ["header", "heroBanner", "contentCta"];
const reorderedLog = buildPromoInputMarkdown({
  runKey: "promo-reordered",
  promptGroupId: "D0xUF",
  generatedAt,
  payload: reorderedPayload,
  promo: reorderedPayload.promo,
  md: reorderedPayload.md,
  template: reorderedPayload.template,
});
assert(
  reorderedLog.indexOf("- sectionId: contentCta") < reorderedLog.indexOf("- sectionId: heroBanner"),
  "Expected Page Composition and Section Content Mapping to follow user-composed orderedSections",
);

const sectionOutputPath = path.join(process.cwd(), "tmp", "section-input-log-md-test.md");
fs.writeFileSync(sectionOutputPath, sectionInputLog, "utf8");

console.log(`Design Prompt MD test passed: ${outputPath}`);
console.log(`Section Input Log MD test passed: ${sectionOutputPath}`);

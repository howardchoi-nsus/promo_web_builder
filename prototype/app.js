const sampleMarkdown = `---
name: GGPoker-promo-design
description: A high-contrast promo system with black casino surfaces, red CTA emphasis, compact step bars, and legal-first footer treatment.
colors:
  primary: "#d52b1e"
  cta: "#e12d25"
  canvas: "#f3f3f3"
  ink: "#151515"
typography:
  heading: "Pretendard, Arial, sans-serif"
  body: "Pretendard, Arial, sans-serif"
---

## Overview

High contrast promotional landing pages that prioritize bonus clarity, quick CTA access, and market-specific responsible gaming compliance.

## Colors

### Brand & Accent

- Primary red: #d52b1e
- CTA red: #e12d25
- Dark surface: #151515

### Surface

- Canvas: #f3f3f3
- Content card: #ffffff

## Typography

### Font Family

- Heading: Pretendard, Arial, sans-serif
- Body: Pretendard, Arial, sans-serif

## Layout

Template 4 uses a fixed sequence of Header, Hero Banner, Step Bar, Content CTA, Image Text Row, Title and Description, and Footer.

## Components

Buttons are pill-shaped red CTAs. Step bars use a dark background with large red numbers.

## Responsive Behavior

Hero background and minimum height should be configurable separately for desktop and mobile.

## Do's and Don'ts

Do keep legal text visible. Do not hide responsible gaming badges or market-specific terms.`;

const appleMarkdown = `---
name: Apple-design-analysis
description: Photography-first product presentation with minimal chrome, SF-style typography, and a single blue action color.
colors:
  primary: "#0066cc"
  canvas: "#ffffff"
  ink: "#1d1d1f"
typography:
  heading: "SF Pro Display, system-ui, sans-serif"
  body: "SF Pro Text, system-ui, sans-serif"
---

## Overview

A clean product-gallery design system with restrained UI and high emphasis on product imagery.

## Colors

- Action Blue: #0066cc
- Ink: #1d1d1f
- Canvas: #ffffff
- Soft Surface: #f5f5f7

## Typography

- Heading: SF Pro Display, system-ui, sans-serif
- Body: SF Pro Text, system-ui, sans-serif

## Layout

Wide, calm sections with strong product focus and large vertical rhythm.

## Components

Buttons are compact pills or text links, with minimal border and shadow use.`;

const starbucksMarkdown = `# Design System Inspired by Starbucks

## 1. Visual Theme & Atmosphere

Warm retail flagship surfaces anchored by Starbucks green and cream canvas tones.

## 2. Color Palette & Roles

- Starbucks Green: #006241
- Green Accent: #00754A
- House Green: #1E3932
- Cream: #f2f0eb
- Gold: #cba258

## 3. Typography Rules

- Primary: SoDoSans, Helvetica Neue, Arial, sans-serif
- Rewards serif moments: Georgia, serif

## 4. Component Stylings

Full-pill buttons, 12px cards, restrained shadows, and compliance-aware footer blocks.

## 8. Responsive Behavior

Mobile stacks content into vertical bands and keeps CTA targets large.`;

const storageKeys = {
  documents: "promoPrototype.documents.abc",
  generatedPages: "promoPrototype.generatedPages.abc",
  selectedDocumentId: "promoPrototype.selectedDocumentId.abc",
  generatedPage: "promoPrototype.generatedPage",
  n8nWebhookUrl: "promoPrototype.n8nWebhookUrl",
};

const generationModels = {
  text: "gpt-4o-mini",
  image: "gpt-image-1",
};

const dummyCompanyStylePresets = [
  {
    id: "preset-001",
    name: "GGPoker 글로벌 기본",
    brandId: "brand-ggpoker",
    market: "Global",
    description: "GGPoker 기본 레드/블랙 프로모션 스타일입니다.",
    isDefault: true,
    colorTokens: {
      primary: "#d52b1e",
      cta: "#e12d25",
      canvas: "#f3f3f3",
      ink: "#151515",
    },
    typographyTokens: {
      headingFont: "Pretendard, Arial, sans-serif",
      bodyFont: "Pretendard, Arial, sans-serif",
      heroTitleWeight: "800",
    },
  },
  {
    id: "preset-002",
    name: "GGPoker 다크 프로모션",
    brandId: "brand-ggpoker",
    market: "Global",
    description: "어두운 고대비 캠페인 스타일입니다.",
    isDefault: false,
    colorTokens: {
      primary: "#ff3b30",
      cta: "#ff2d25",
      canvas: "#111318",
      ink: "#ffffff",
    },
    typographyTokens: {
      headingFont: "'Arial Black', Arial, sans-serif",
      bodyFont: "Pretendard, Arial, sans-serif",
      heroTitleWeight: "900",
    },
  },
  {
    id: "preset-003",
    name: "GGVegas 기본",
    brandId: "brand-ggvegas",
    market: "Global",
    description: "카지노 분위기의 골드 포인트 스타일입니다.",
    isDefault: false,
    colorTokens: {
      primary: "#c99700",
      cta: "#f2b705",
      canvas: "#f8f4e8",
      ink: "#18130a",
    },
    typographyTokens: {
      headingFont: "Georgia, serif",
      bodyFont: "Pretendard, Arial, sans-serif",
      heroTitleWeight: "800",
    },
  },
  {
    id: "preset-004",
    name: "브라질 컴플라이언스 스타일",
    brandId: "brand-ggpoker",
    market: "Brazil",
    description: "브라질 마켓 정책을 고려한 차분한 대비 스타일입니다.",
    isDefault: false,
    colorTokens: {
      primary: "#007a33",
      cta: "#d52b1e",
      canvas: "#f4f7f1",
      ink: "#1b1f1a",
    },
    typographyTokens: {
      headingFont: "Pretendard, Arial, sans-serif",
      bodyFont: "Pretendard, Arial, sans-serif",
      heroTitleWeight: "700",
    },
  },
];

const temp4TemplateSchema = {
  id: "temp4",
  name: "Template 4",
  sectionOrder: ["header", "heroBanner", "stepBar", "contentCta", "imageTextRow", "titleDescription", "footer"],
  visualSections: ["heroBanner", "contentCta", "imageTextRow"],
};

function createEmptyTemp4Inputs() {
  return {
    header: {
      logoText: "GGPoker",
      badgeText: "프로모션",
    },
    heroBanner: {
      leaderText: "",
      title: "",
      sublineText: "",
      cta: { label: "", link: "", target: "_blank" },
      alphaText: "",
      visualMode: "auto",
    },
    stepBar: [
      { title: "", description: "", link: "", target: "_blank" },
      { title: "", description: "", link: "", target: "_blank" },
      { title: "", description: "", link: "", target: "_blank" },
    ],
    contentCta: {
      longText: "",
      cta: { label: "", link: "", target: "_blank" },
      visualMode: "auto",
    },
    imageTextRow: {
      headerTitle: "",
      headerDescription: "",
      title: "",
      description: "",
      visualMode: "auto",
    },
    titleDescription: {
      title: "이용약관",
      contents: "",
    },
    footer: {
      logoText: "GGPoker",
      licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
    },
  };
}

function buildTemp4Draft({ promo, simpleBrief, selectedDocument, visualMode }) {
  const brand = selectedDocument?.brandName || "GGPoker";
  const title = promo.title.trim();
  const offer = simpleBrief.mainOffer.trim();
  const action = simpleBrief.targetAction.trim();
  const audience = simpleBrief.audience.trim();
  const tone = simpleBrief.campaignTone.trim();
  const secondary = simpleBrief.secondaryMessage.trim();
  const terms = promo.termsText.trim();
  const cta = {
    label: promo.ctaLabel.trim(),
    link: promo.ctaUrl.trim(),
    target: "_blank",
  };

  const offerText = offer || promo.leadText.trim() || title;
  const actionText = action || "가입 후 프로모션 단계를 진행하세요";
  const audiencePrefix = audience ? `${audience} can ` : "";
  const toneHint = tone ? ` Tone: ${tone}.` : "";

  return {
    header: {
      logoText: brand,
      badgeText: promo.market || "Global",
    },
    heroBanner: {
      leaderText: offerText ? "추천 프로모션" : "",
      title,
      sublineText: offerText,
      cta,
      alphaText: promo.alphaText.trim() || terms,
      visualMode,
    },
    stepBar: [
      {
        title: "시작",
        description: audiencePrefix ? `${audiencePrefix}${actionText.toLowerCase()}.` : actionText,
        link: cta.link,
        target: cta.target,
      },
      {
        title: "혜택 받기",
        description: offerText ? `혜택을 확인하세요: ${offerText}` : "캠페인 참여 조건을 확인하세요.",
        link: cta.link,
        target: cta.target,
      },
      {
        title: "플레이",
        description: secondary || "프로모션을 즐기기 전에 최종 조건을 확인하세요.",
        link: cta.link,
        target: cta.target,
      },
    ],
    contentCta: {
      longText: secondary || `${offerText}. ${actionText}.${toneHint}`,
      cta,
      visualMode,
    },
    imageTextRow: {
      headerTitle: title ? `${title} 상세` : "프로모션 상세",
      headerDescription: offerText,
      title: actionText,
      description: secondary || terms || "프로모션 상세 내용을 확인한 뒤 CTA를 통해 참여하세요.",
      visualMode,
    },
    titleDescription: {
      title: "이용약관",
      contents: terms,
    },
    footer: {
      logoText: brand,
      licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
    },
  };
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nowText() {
  const date = new Date();
  return date.toISOString().slice(0, 16).replace("T", " ");
}

function timestampStamp(value = new Date()) {
  const normalized = typeof value === "string" ? value.replace(" ", "T") : value;
  const date = normalized instanceof Date ? normalized : new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value || "").replace(/\D/g, "").slice(2, 12);
  const pad = (part) => String(part).padStart(2, "0");
  return [
    String(date.getFullYear()).slice(-2),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
  ].join("");
}

function toDesignViewUrl(url, id) {
  const value = String(url || "").trim();
  if (!value || !id || !/promo-ui-design-generate\/?(?:\?.*)?$/.test(value)) return value;
  const queryPath = `promo-ui-design-view?id=${encodeURIComponent(id)}`;
  const replaced = value.replace(/promo-ui-design-generate\/?(?:\?.*)?$/, queryPath);
  if (replaced !== value) return replaced;
  try {
    const parsed = new URL(value);
    parsed.pathname = parsed.pathname.replace(/\/$/, "").replace(/promo-ui-design-generate$/, "promo-ui-design-view");
    parsed.search = `?id=${encodeURIComponent(id)}`;
    return parsed.toString();
  } catch {
    return value;
  }
}

function isDesignViewUrl(url) {
  return /promo-ui-design-view|promo-ui-design-generate/.test(String(url || ""));
}

function isDirectImageUrl(url, page) {
  const value = String(url || "").trim();
  if (!value) return false;
  if (value.startsWith("data:image/")) return true;
  if (isDesignViewUrl(value)) return false;
  const designUrl = String(page?.designUrl || page?.pageUrl || "").trim();
  if (designUrl && value === designUrl) return false;
  return true;
}

function designViewUrlForId(id) {
  return id ? `/api/promo-design-view?id=${encodeURIComponent(id)}` : "";
}

function designImageUrlForId(id) {
  return id ? `/api/promo-design-image?id=${encodeURIComponent(id)}` : "";
}

function randomToken(length = 5) {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randomValues = new Uint8Array(length);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randomValues);
  } else {
    for (let index = 0; index < length; index += 1) {
      randomValues[index] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("");
}

function createRunKey() {
  return `promo-${timestampStamp(new Date())}-${randomToken(5)}`;
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function normalizeCategory(title) {
  const raw = title.toLowerCase().replace(/^\d+\.\s*/, "");
  if (raw.includes("color") || raw.includes("palette")) return "colors";
  if (raw.includes("typography") || raw.includes("font")) return "typography";
  if (raw.includes("layout") || raw.includes("spacing") || raw.includes("grid")) return "layout";
  if (raw.includes("elevation") || raw.includes("depth") || raw.includes("shadow")) return "elevation";
  if (raw.includes("shape") || raw.includes("radius") || raw.includes("geometry")) return "shapes";
  if (raw.includes("component") || raw.includes("styling")) return "components";
  if (raw.includes("responsive") || raw.includes("breakpoint")) return "responsive";
  if (raw.includes("do's") || raw.includes("don't") || raw.includes("dos")) return "dos_donts";
  if (raw.includes("gap")) return "known_gaps";
  if (raw.includes("overview") || raw.includes("theme") || raw.includes("atmosphere")) return "overview";
  return "other";
}

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const headings = [];
  let current = null;

  for (const line of lines) {
    const match = /^(#{1,4})\s+(.+)$/.exec(line);
    if (match) {
      current = {
        level: match[1].length,
        title: match[2].trim(),
        category: normalizeCategory(match[2].trim()),
        excerpt: "",
      };
      headings.push(current);
    } else if (current && line.trim() && current.excerpt.length < 180) {
      current.excerpt += `${line.trim()} `;
    }
  }

  return headings;
}

function extractSummary(markdown) {
  const headings = parseMarkdown(markdown);
  const colors = Array.from(new Set(markdown.match(/#[0-9a-fA-F]{6}\b/g) || [])).slice(0, 8);
  const fontMatches = Array.from(
    new Set(
      (markdown.match(/(?:fontFamily|font-family|Heading|Body|Primary):?\s*["'`]?([A-Za-z][A-Za-z0-9\s,-]*(?:Pretendard|sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia|system-ui))/gi) || [])
        .map((item) => item.replace(/^(fontFamily|font-family|Heading|Body|Primary):?\s*/i, "").replace(/["'`]/g, "").trim())
    )
  ).slice(0, 4);
  const categories = Array.from(new Set(headings.map((heading) => heading.category))).filter((item) => item !== "other");

  return {
    headings,
    colors,
    fonts: fontMatches.length ? fontMatches : ["Pretendard, Arial, sans-serif"],
    categories,
    sectionCount: headings.filter((heading) => heading.level <= 2).length,
    tokenCount: colors.length + fontMatches.length,
  };
}

function createDoc({ id, brandId, brandName, slug, markdown, sourceName, status, updatedAt }) {
  const summary = extractSummary(markdown);
  return {
    id,
    brandId,
    brandName,
    slug,
    sourceName,
    status,
    updatedAt,
    markdown,
    designConcept: {
      summary: "",
      json: null,
      promptContext: "",
      analyzedAt: "",
      analysisModel: "",
    },
    summary,
  };
}

function dummyDocuments() {
  return [
    createDoc({
      id: "doc-001",
      brandId: "brand-ggpoker",
      brandName: "GGPoker",
      slug: "ggpoker",
      markdown: sampleMarkdown,
      sourceName: "docs/design-md/ggpoker/DESIGN.md",
      status: "seeded",
      updatedAt: "2026-06-25 12:00",
    }),
    createDoc({
      id: "doc-002",
      brandId: "brand-apple",
      brandName: "Apple",
      slug: "apple",
      markdown: appleMarkdown,
      sourceName: "docs/design-md/apple/DESIGN.md",
      status: "seeded",
      updatedAt: "2026-06-25 12:05",
    }),
    createDoc({
      id: "doc-003",
      brandId: "brand-starbucks",
      brandName: "Starbucks",
      slug: "starbucks",
      markdown: starbucksMarkdown,
      sourceName: "docs/design-md/starbucks/DESIGN.md",
      status: "seeded",
      updatedAt: "2026-06-25 12:08",
    }),
  ];
}

function sourceFromDocument(doc) {
  const primary = doc?.summary.colors[0] || "#d52b1e";
  return {
    primaryColor: primary,
    ctaColor: doc?.summary.colors[1] || primary,
    canvasColor: doc?.summary.colors[2] || "#f3f3f3",
    headingFont: doc?.summary.fonts[0] || "Pretendard, Arial, sans-serif",
    bodyFont: doc?.summary.fonts[1] || doc?.summary.fonts[0] || "Pretendard, Arial, sans-serif",
    titleWeight: "800",
  };
}

function sourceFromPreset(preset) {
  return {
    primaryColor: preset.colorTokens.primary,
    ctaColor: preset.colorTokens.cta,
    canvasColor: preset.colorTokens.canvas,
    headingFont: preset.typographyTokens.headingFont,
    bodyFont: preset.typographyTokens.bodyFont,
    titleWeight: preset.typographyTokens.heroTitleWeight,
  };
}

const { createApp } = Vue;

createApp({
  data() {
    return {
      status: "준비 완료",
      sectionWidths: [30, 30, 40],
      resizeState: null,
      designDocuments: [],
      mdListSource: "불러오는 중",
      handoffDocuments: [],
      selectedHandoffFile: "",
      handoffMarkdown: "",
      handoffLoading: false,
      handoffError: "",
      activeHandoffDocument: null,
      expandedStyleGroupSlug: "",
      selectedStyleGroupSlug: "",
      styleGroupSearch: "",
      companyStylePresets: dummyCompanyStylePresets,
      selectedDocumentId: localStorage.getItem(storageKeys.selectedDocumentId) || "",
      selectedPresetId: "preset-001",
      styleSource: "company_default",
      templateSchema: temp4TemplateSchema,
      generationMode: "ai_agent",
      inputMode: "simple",
      globalVisualMode: "auto",
      promoBuilderStarted: false,
      promoBuilderSessionKey: 0,
      currentBuilderStep: 1,
      n8nWebhookUrl: "",
      detailDoc: null,
      selectedDesignDetail: null,
      promptModalPage: null,
      promptModalLoading: false,
      promptModalError: "",
      promptModalDesignMarkdown: "",
      promptModalIntegratedMarkdown: "",
      promptModalPromoMarkdown: "",
      modalTab: "outline",
      newMd: {
        id: "",
        brandName: "GGPoker",
        slug: "ggpoker",
        text: sampleMarkdown,
        sourceName: "text input",
      },
      promo: {
        title: "",
        template: "Template 4",
        market: "",
        leadText: "",
        ctaLabel: "",
        ctaUrl: "",
        subline: "",
        alphaText: "",
        termsText: "",
      },
      simpleBrief: {
        mainOffer: "",
        targetAction: "",
        audience: "",
        campaignTone: "",
        secondaryMessage: "",
      },
      sectionInputs: createEmptyTemp4Inputs(),
      override: {
        primaryColor: "#d52b1e",
        ctaColor: "#e12d25",
        canvasColor: "#f3f3f3",
        headingFont: "Pretendard, Arial, sans-serif",
        bodyFont: "Pretendard, Arial, sans-serif",
        titleWeight: "800",
      },
      generatedPages: [],
      generatedPagesLoading: false,
      generatedPagesError: "",
      generatedPagesLoaded: false,
    };
  },

  computed: {
    abcGridStyle() {
      return {
        gridTemplateColumns: `${this.sectionWidths[0]}fr 8px ${this.sectionWidths[1]}fr 8px ${this.sectionWidths[2]}fr`,
      };
    },

    selectedDocument() {
      return this.designDocuments.find((doc) => doc.id === this.selectedDocumentId) || null;
    },

    selectedDocumentGroupLabel() {
      return this.styleGroupName(this.groupInfoForDocument(this.selectedDocument));
    },

    selectedDocumentTags() {
      return this.tagsForDocument(this.selectedDocument).slice(0, 6);
    },

    selectedDesignDataSource() {
      if (this.selectedDesignDetail?.id === this.selectedDocumentId) return this.selectedDesignDetail;
      return this.selectedDocument;
    },

    selectedDesignTokenSections() {
      const doc = this.selectedDesignDataSource;
      return [
        { key: "color", label: "Colors", rows: this.normalizedTokenRows(doc, "color"), open: true },
        { key: "typography", label: "Typography", rows: this.normalizedTokenRows(doc, "typography"), open: false },
        { key: "radius", label: "Radius", rows: this.normalizedTokenRows(doc, "radius"), open: false },
        { key: "spacing", label: "Spacing", rows: this.normalizedTokenRows(doc, "spacing"), open: false },
        { key: "elevation", label: "Elevation", rows: this.normalizedTokenRows(doc, "elevation"), open: false },
        { key: "breakpoint", label: "Breakpoints", rows: this.normalizedTokenRows(doc, "breakpoint"), open: false },
        { key: "component", label: "Components", rows: this.patternRows(doc, "component"), open: false },
        { key: "layout", label: "Layouts", rows: this.patternRows(doc, "layout"), open: false },
        { key: "guideline", label: "Guidelines", rows: this.guidelineRows(doc), open: false },
      ];
    },

    filteredDesignDocuments() {
      const search = this.styleGroupSearch.trim().toLowerCase();
      if (!search) return this.designDocuments;

      return this.designDocuments.filter((doc) => {
        const groupInfo = this.groupInfoForDocument(doc);
        const tags = this.tagsForDocument(doc);
        const haystack = [
          doc.brandName,
          doc.slug,
          groupInfo.name,
          groupInfo.description,
          ...tags,
          doc.styleClassification?.layoutModel,
          doc.styleClassification?.colorMode,
          doc.styleClassification?.typographyTone,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    },

    groupedDocuments() {
      const search = this.styleGroupSearch.trim().toLowerCase();
      const groups = new Map();

      for (const doc of this.designDocuments) {
        const groupInfo = this.groupInfoForDocument(doc);
        const tags = this.tagsForDocument(doc);
        const haystack = [
          doc.brandName,
          doc.slug,
          groupInfo.name,
          groupInfo.description,
          ...tags,
          doc.styleClassification?.layoutModel,
          doc.styleClassification?.colorMode,
          doc.styleClassification?.typographyTone,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (search && !haystack.includes(search)) continue;

        if (!groups.has(groupInfo.slug)) {
          groups.set(groupInfo.slug, {
            ...groupInfo,
            documents: [],
            tags: new Set(),
            confidenceTotal: 0,
            confidenceCount: 0,
          });
        }

        const group = groups.get(groupInfo.slug);
        group.documents.push(doc);
        tags.forEach((tag) => group.tags.add(tag));
        const confidence = Number(doc.styleClassification?.confidence);
        if (Number.isFinite(confidence)) {
          group.confidenceTotal += confidence;
          group.confidenceCount += 1;
        }
      }

      return Array.from(groups.values())
        .map((group) => ({
          ...group,
          tags: Array.from(group.tags).slice(0, 6),
          confidence: group.confidenceCount ? group.confidenceTotal / group.confidenceCount : null,
        }))
        .sort((a, b) => {
          if (a.slug === "unclassified") return 1;
          if (b.slug === "unclassified") return -1;
          return a.name.localeCompare(b.name);
        });
    },

    selectedStyleGroup() {
      return this.groupedDocuments.find((group) => group.slug === this.selectedStyleGroupSlug) || this.groupedDocuments[0] || null;
    },

    selectedStyleGroupDocuments() {
      return this.selectedStyleGroup?.documents || [];
    },

    selectedPreset() {
      return this.companyStylePresets.find((preset) => preset.id === this.selectedPresetId) || this.companyStylePresets[0];
    },

    sourceStyle() {
      if (this.styleSource === "design_md" && this.selectedDocument) return sourceFromDocument(this.selectedDocument);
      return sourceFromPreset(this.selectedPreset);
    },

    finalStyle() {
      return { ...this.sourceStyle, ...this.override };
    },

    lastGenerated() {
      return this.generatedPages[0] || null;
    },

    templateModeLabel() {
      return `${this.templateLabel(this.templateSchema.name)} / ${this.generationMode === "ai_agent" ? "AI 에이전트" : "룰 기반"} / ${this.inputMode === "advanced" ? "고급" : "간편"}`;
    },

    builderSteps() {
      return [
        { step: 1, title: "기본 설정", summary: "템플릿, 모드, 마켓" },
        { step: 2, title: "프로모션 입력", summary: "혜택, CTA, 약관" },
        { step: 3, title: "섹션 초안", summary: "Temp.4 구성 확인" },
        { step: 4, title: "스타일 조정", summary: "색상, 폰트 재정의" },
        { step: 5, title: "디자인 생성", summary: "n8n 실행" },
      ];
    },

    currentBuilderStepInfo() {
      return this.builderSteps.find((item) => item.step === this.currentBuilderStep) || this.builderSteps[0];
    },
  },

  watch: {
    styleSource() {
      this.resetOverride();
    },
    selectedPresetId() {
      if (this.styleSource === "company_default") this.resetOverride();
    },
    selectedDocumentId() {
      if (this.styleSource === "design_md") this.resetOverride();
    },
  },

  mounted() {
    localStorage.removeItem(storageKeys.generatedPages);
    localStorage.removeItem(storageKeys.generatedPage);
    localStorage.removeItem(storageKeys.n8nWebhookUrl);
    this.loadDesignDocuments();
    this.loadGeneratedPagesFromServer({ silent: true });
    this.loadHandoffDocuments();
    this.resetOverride();
  },

  methods: {
    async loadHandoffDocuments() {
      if (window.location.protocol === "file:") return;
      try {
        const response = await fetch("/api/handoff-documents");
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || payload.error || `API ${response.status}`);
        this.handoffDocuments = payload.documents || [];
        if (!this.selectedHandoffFile && this.handoffDocuments.length) {
          this.selectedHandoffFile = this.handoffDocuments[0].file;
        }
      } catch (error) {
        this.handoffError = error.message;
      }
    },

    async openSelectedHandoff() {
      if (!this.selectedHandoffFile) {
        this.setStatus("선택된 handoff 문서가 없습니다");
        return;
      }

      this.handoffLoading = true;
      this.handoffError = "";
      this.handoffMarkdown = "";
      this.activeHandoffDocument = this.handoffDocuments.find((item) => item.file === this.selectedHandoffFile) || null;
      this.$nextTick(() => {
        if (!this.$refs.handoffModal.open) this.$refs.handoffModal.showModal();
      });

      try {
        const response = await fetch(`/api/handoff-documents?file=${encodeURIComponent(this.selectedHandoffFile)}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || payload.error || `API ${response.status}`);
        this.activeHandoffDocument = payload.document || this.activeHandoffDocument;
        this.handoffMarkdown = payload.document?.markdown || "";
      } catch (error) {
        this.handoffError = error.message;
      } finally {
        this.handoffLoading = false;
      }
    },

    closeHandoff() {
      this.$refs.handoffModal.close();
    },

    async loadDesignDocuments(options = {}) {
      try {
        const url = options.fresh ? `/api/design-documents?ts=${Date.now()}` : "/api/design-documents";
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API ${response.status}`);
        const payload = await response.json();
        this.designDocuments = payload.documents || [];
        this.mdListSource = "Neon Postgres";
        if (!this.selectedDocumentId || !this.selectedDocument) {
          this.selectedDocumentId = this.designDocuments[0]?.id || "";
        }
        localStorage.setItem(storageKeys.selectedDocumentId, this.selectedDocumentId);
        this.resetOverride();
        this.setStatus(`Neon에서 MD ${this.designDocuments.length}개를 불러왔습니다`);
      } catch (error) {
        this.designDocuments = dummyDocuments();
        this.mdListSource = "fallback 더미";
        if (!this.selectedDocumentId || !this.selectedDocument) {
          this.selectedDocumentId = this.designDocuments[0]?.id || "";
        }
        localStorage.setItem(storageKeys.selectedDocumentId, this.selectedDocumentId);
        this.resetOverride();
        this.selectedDesignDetail = null;
        this.setStatus("Neon API를 사용할 수 없어 더미 데이터를 사용합니다");
      }
    },

    conceptValue(key) {
      return this.selectedDocument?.designConcept?.json?.[key] || "";
    },

    conceptList(key) {
      const value = this.selectedDocument?.designConcept?.json?.[key];
      return Array.isArray(value) ? value : [];
    },

    designDataCategoryRows(doc) {
      const summary = doc?.summary || {};
      const schema = doc?.tokenSet?.normalizedSchema || doc?.normalizedSchema || {};
      const tokenItems = Array.isArray(doc?.tokenItems) ? doc.tokenItems : [];
      const countByGroup = (group) => tokenItems.filter((item) => String(item.tokenPath || "").startsWith(`${group}.`)).length;
      const countByType = (type) => tokenItems.filter((item) => item.tokenType === type).length;
      const countBySchema = (group) =>
        Object.values(schema?.tokens?.[group] || {}).filter((token) => this.formatDesignTokenValue(token) !== "unknown").length;
      const rows = [
        ["color", "Colors", countBySchema("color") || countByGroup("color") || countByType("color")],
        ["typography", "Typography", countBySchema("typography") || countByGroup("typography") || countByType("fontFamily")],
        ["radius", "Radius", countBySchema("radius") || countByGroup("radius")],
        ["spacing", "Spacing", countBySchema("spacing") || countByGroup("spacing")],
        ["dimension", "Layout / Size", countBySchema("breakpoint") || countByGroup("dimension") + countByGroup("breakpoint")],
        ["elevation", "Elevation", countBySchema("elevation") || countByGroup("shadow") || countByType("shadow")],
        ["component", "Components", summary.componentPatternCount || doc?.componentPatterns?.length || 0],
        ["layout", "Layouts", summary.layoutPatternCount || doc?.layoutPatterns?.length || 0],
        ["guideline", "Guidelines", summary.guidelineCount || doc?.guidelineItems?.length || 0],
        ["metadata", "Metadata", summary.metadataCount || doc?.metadataItems?.length || 0],
      ];
      return rows.map(([key, label, value]) => ({ key, label, value: Number(value || 0).toLocaleString() }));
    },

    designTokenCategoryLabel(doc) {
      const rows = this.designDataCategoryRows(doc)
        .filter((row) => Number(String(row.value).replace(/,/g, "")) > 0)
        .map((row) => row.label);
      if (!rows.length) return "토큰 unknown";
      const visibleRows = rows.slice(0, 3);
      const remaining = rows.length - visibleRows.length;
      return `${visibleRows.join(" / ")}${remaining > 0 ? ` +${remaining}` : ""}`;
    },

    stylePopularityLabel(doc) {
      const confidence = Number(doc?.styleClassification?.confidence);
      if (Number.isFinite(confidence)) return `인기 ${Math.round(confidence * 100)}%`;
      return "인기 unknown";
    },

    documentDateLabel(doc) {
      const value = doc?.updatedAt || doc?.createdAt || "";
      const match = String(value).match(/\d{4}-\d{2}-\d{2}/);
      return match ? match[0] : "날짜 unknown";
    },

    designSchemaClassification(doc) {
      const schema = doc?.tokenSet?.normalizedSchema || doc?.normalizedSchema || {};
      const classification = schema.classification || doc?.styleClassification || {};
      const group = classification.primaryGroup?.slug || classification.primaryGroup || doc?.styleClassification?.primaryGroup?.slug || "unknown";
      return [
        `group: ${group}`,
        `color: ${classification.colorMode || "unknown"}`,
        `depth: ${classification.depthModel || "unknown"}`,
        `shape: ${classification.shapeModel || "unknown"}`,
        `type: ${classification.typographyTone || "unknown"}`,
      ].join(" / ");
    },

    normalizedTokenRows(doc, groupKey) {
      const schema = doc?.tokenSet?.normalizedSchema || doc?.normalizedSchema || {};
      const group = schema?.tokens?.[groupKey] || {};
      const typeAliases = {
        color: ["color"],
        typography: ["typography", "fontFamily", "fontSize", "fontWeight", "lineHeight"],
        radius: ["radius", "borderRadius"],
        spacing: ["spacing", "space"],
        elevation: ["shadow", "elevation"],
        breakpoint: ["breakpoint", "dimension"],
      };
      const rows = Object.entries(group)
        .map(([key, token]) => ({
          key,
          value: this.formatDesignTokenValue(token),
        }))
        .filter((row) => row.value && row.value !== "unknown");

      if (rows.length) return rows;

      const tokenItems = Array.isArray(doc?.tokenItems) ? doc.tokenItems : [];
      const aliases = typeAliases[groupKey] || [groupKey];
      return tokenItems
        .filter((item) => String(item.tokenPath || "").startsWith(`${groupKey}.`) || aliases.includes(item.tokenType))
        .slice(0, 30)
        .map((item) => ({
          key: item.tokenPath || item.tokenType || "unknown",
          value: this.formatDesignTokenValue(item.valueJson ?? item.rawValue ?? item.description),
        }))
        .filter((row) => row.value);
    },

    formatDesignTokenValue(value) {
      if (value == null || value === "") return "unknown";
      if (Array.isArray(value)) {
        const items = value.map((item) => this.formatDesignTokenValue(item)).filter(Boolean);
        return items.length ? items.slice(0, 4).join(", ") : "unknown";
      }
      if (typeof value !== "object") return String(value);

      const direct = value.$value ?? value.value ?? value.summary ?? value.description ?? value.role ?? value.pattern ?? value.guideline;
      const type = value.$type || value.type;
      const confidence = value.confidence != null ? `confidence ${value.confidence}` : "";
      const source = value.source ? `source ${value.source}` : "";
      const parts = [direct, type, confidence, source].filter(Boolean).map((item) => {
        if (typeof item === "object") return this.formatDesignTokenValue(item);
        return String(item);
      });
      if (parts.length) return parts.join(" | ");

      const entries = Object.entries(value)
        .filter(([, entryValue]) => entryValue != null && entryValue !== "" && entryValue !== "unknown")
        .slice(0, 4)
        .map(([key, entryValue]) => `${key}: ${this.formatDesignTokenValue(entryValue)}`);
      return entries.length ? entries.join(" | ") : "unknown";
    },

    patternRows(doc, kind) {
      const items = kind === "component" ? doc?.componentPatterns : doc?.layoutPatterns;
      return (Array.isArray(items) ? items : [])
        .slice(0, 30)
        .map((item) => ({
          key: item.patternName || item.patternType || item.sectionName || "unknown",
          value: this.formatDesignTokenValue(item.valueJson || item.description || item.sourceText),
        }));
    },

    guidelineRows(doc) {
      const items = Array.isArray(doc?.guidelineItems) ? doc.guidelineItems : [];
      return items.slice(0, 30).map((item) => ({
        key: item.guidelineType || item.severity || item.sourcePath || "guideline",
        value: this.formatDesignTokenValue(item.valueJson || item.description || item.sourceText),
      }));
    },

    designTokenGroupSummary(doc) {
      const tokenItems = Array.isArray(doc?.tokenItems) ? doc.tokenItems : [];
      if (!tokenItems.length) return "no token items";
      const groups = tokenItems.reduce((acc, item) => {
        const group = String(item.tokenPath || item.tokenType || "unknown").split(".")[0] || "unknown";
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}: ${value}`)
        .join(" / ");
    },

    groupInfoForDocument(doc) {
      const fallback = {
        slug: "unclassified",
        name: "미분류",
        description: "디자인 분석 또는 스타일 분류가 필요합니다",
      };
      const primary = doc?.styleClassification?.primaryGroup;
      if (!primary || typeof primary !== "object") return fallback;
      return {
        slug: primary.slug || "unclassified",
        name: primary.name || "미분류",
        description: primary.description || fallback.description,
      };
    },

    tagsForDocument(doc) {
      const tags = doc?.styleClassification?.styleTags;
      return Array.isArray(tags) ? tags.filter(Boolean) : [];
    },

    styleGroupName(group) {
      const name = group?.name || "";
      const labels = {
        Unclassified: "미분류",
        "Editorial / Media": "에디토리얼 / 미디어",
        "Product / SaaS": "프로덕트 / SaaS",
        "Commerce / Finance": "커머스 / 금융",
        "Luxury / Automotive": "럭셔리 / 오토모티브",
        "Consumer / Lifestyle": "소비자 / 라이프스타일",
        "AI / Developer Tools": "AI / 개발자 도구",
        "Gaming / Entertainment": "게임 / 엔터테인먼트",
      };
      return labels[name] || name || "미분류";
    },

    styleGroupDescription(group) {
      const description = group?.description || "";
      const labels = {
        "Needs design analysis or style classification": "디자인 분석 또는 스타일 분류가 필요합니다",
      };
      return labels[description] || description || "디자인 분석 또는 스타일 분류가 필요합니다";
    },

    visualModeLabel(value) {
      const labels = {
        auto: "자동",
        use_visual: "비주얼 사용",
        no_visual: "비주얼 없음",
      };
      return labels[value] || value || "자동";
    },

    templateLabel(value) {
      if (value === "Template 4") return "템플릿 4";
      return value || "";
    },

    statusLabel(value) {
      const labels = {
        n8n_ui_design_pending: "n8n 생성 중",
        n8n_ui_design_generated: "n8n 생성 완료",
        n8n_failed: "n8n 실패",
        draft: "초안",
      };
      return labels[value] || value || "";
    },

    startPromoBuilder() {
      if (!this.selectedDocument) {
        this.setStatus("먼저 디자인 MD를 선택해 주세요");
        return;
      }
      this.resetPromoBuilderState({ rerender: true });
      this.promoBuilderStarted = true;
      this.$nextTick(() => {
        if (!this.$refs.promoBuilderModal.open) this.$refs.promoBuilderModal.showModal();
      });
      this.setStatus("프로모션 생성 단계를 시작했습니다");
    },

    closePromoBuilder() {
      this.$refs.promoBuilderModal.close();
    },

    builderStepClass(step) {
      return {
        active: step.step === this.currentBuilderStep,
        done: step.step < this.currentBuilderStep,
      };
    },

    validateBuilderStep(step = this.currentBuilderStep) {
      if (step === 1 && !String(this.promo.market || "").trim()) {
        this.setStatus("마켓 / 지역을 선택해 주세요");
        return false;
      }
      if (step === 2) return this.validatePromoInputs();
      if (step === 3 && !this.hasSectionDraft()) {
        this.refreshSectionDraft({ silent: true });
      }
      return true;
    },

    validateBuilderStepsUntil(targetStep) {
      for (let step = 1; step < targetStep; step += 1) {
        if (!this.validateBuilderStep(step)) return false;
      }
      return true;
    },

    goBuilderStep(step) {
      if (!this.promoBuilderStarted) return;
      const nextStep = Math.max(1, Math.min(5, step));
      if (nextStep > this.currentBuilderStep && !this.validateBuilderStepsUntil(nextStep)) return;
      this.currentBuilderStep = nextStep;
    },

    nextBuilderStep() {
      if (!this.validateBuilderStep(this.currentBuilderStep)) return;
      this.currentBuilderStep = Math.min(5, this.currentBuilderStep + 1);
    },

    prevBuilderStep() {
      this.currentBuilderStep = Math.max(1, this.currentBuilderStep - 1);
    },

    resultType(page) {
      if (!page) return "empty";
      if (page.status === "n8n_failed" || page.errorMessage) return "failed";
      if (page.status === "n8n_ui_design_pending") return "pending";
      if (isDirectImageUrl(page.imageUrl, page)) return "image";
      if (page.designUrl || page.pageUrl || isDesignViewUrl(page.imageUrl)) return "view";
      if (page.payload) return "draft";
      return "empty";
    },

    resultTypeLabel(page) {
      const labels = {
        image: "이미지 생성 완료",
        view: "디자인 보기 가능",
        pending: "생성 중",
        failed: "생성 실패",
        draft: "로컬 초안",
        empty: "대기",
      };
      return labels[this.resultType(page)] || "대기";
    },

    resultOutputLabel(page) {
      const labels = {
        image: "이미지 미리보기",
        view: "결과 화면 미리보기",
        pending: "생성 대기 중",
        failed: "오류 확인 필요",
        draft: "로컬 미리보기",
        empty: "산출물 없음",
      };
      return labels[this.resultType(page)] || "산출물 없음";
    },

    previewImageUrl(page) {
      return isDirectImageUrl(page?.imageUrl, page) ? page.imageUrl : "";
    },

    previewFrameUrl(page) {
      if (!page) return "";
      const url = toDesignViewUrl(page.designUrl || page.pageUrl || (isDesignViewUrl(page.imageUrl) ? page.imageUrl : ""), page.id);
      return url || "";
    },

    storedResultToPage(result, fallback = {}) {
      const run = result?.run || {};
      const assets = Array.isArray(result?.assets) ? result.assets : [];
      const imageAsset = assets.find((asset) => asset.asset_type === "generated_image") || {};
      const markdownAssets = assets.filter((asset) => /_markdown$/.test(asset.asset_type || ""));
      const runKey = run.run_key || fallback.id || "";
      const createdAt = run.created_at || fallback.createdAt || "";
      const committedAt = imageAsset.created_at || fallback.committedAt || createdAt;

      return {
        id: runKey,
        title: run.promo_title || fallback.title || runKey,
        selectedMd: run.selected_md_name || fallback.selectedMd || "",
        styleSourceLabel: run.style_source_label || fallback.styleSourceLabel || "",
        template: run.template_name || fallback.template || "",
        market: run.market || fallback.market || "",
        createdAt,
        committedAt,
        timestampStamp: timestampStamp(committedAt || createdAt),
        status: run.status || fallback.status || "generated",
        designUrl: designViewUrlForId(runKey),
        imageUrl: designImageUrlForId(runKey),
        pageUrl: designViewUrlForId(runKey),
        layoutMapping: run.layout_mapping || fallback.layoutMapping || null,
        mdComplianceMap: run.md_compliance_map || fallback.mdComplianceMap || null,
        imagePrompt: run.image_prompt || fallback.imagePrompt || "",
        promptGroupId: run.prompt_group_id || imageAsset.prompt_group_id || imageAsset.metadata?.promptGroupId || fallback.promptGroupId || "",
        designPromptStorageKey: markdownAssets.find((asset) => asset.asset_type === "design_prompt_markdown")?.storage_key || fallback.designPromptStorageKey || "",
        promoInputStorageKey: markdownAssets.find((asset) => asset.asset_type === "promo_input_markdown")?.storage_key || fallback.promoInputStorageKey || "",
        integratedBriefStorageKey: markdownAssets.find((asset) => asset.asset_type === "integrated_design_brief_markdown")?.storage_key || fallback.integratedBriefStorageKey || "",
        errorMessage: run.error_message || fallback.errorMessage || "",
        hasOverride: fallback.hasOverride || false,
        resultType: run.result_type || fallback.resultType || "image",
        payload: run.request_payload || fallback.payload || null,
      };
    },

    async loadGeneratedPagesFromServer(options = {}) {
      if (window.location.protocol === "file:") {
        this.generatedPages = [];
        this.generatedPagesError = "";
        this.generatedPagesLoaded = true;
        return;
      }

      this.generatedPagesLoading = true;
      this.generatedPagesError = "";
      try {
        const params = new URLSearchParams({ limit: "50" });
        if (options.fresh) params.set("ts", String(Date.now()));
        const response = await fetch(`/api/promo-design-assets?${params.toString()}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `API ${response.status}`);
        const serverPages = (result.runs || [])
          .map((item) => this.storedResultToPage(item))
          .filter((page) => page.id);
        const serverIds = new Set(serverPages.map((page) => page.id));
        const preserveIds = new Set(options.preserveIds || []);
        const transientPages = this.generatedPages.filter((page) => (
          page.status === "n8n_ui_design_pending"
          || page.status === "n8n_failed"
          || (preserveIds.has(page.id) && !serverIds.has(page.id))
        ));
        this.generatedPages = [
          ...transientPages.filter((page) => !serverIds.has(page.id)),
          ...serverPages,
        ];
        this.generatedPagesLoaded = true;
        if (!options.silent) this.setStatus(`서버에서 생성 결과 ${serverPages.length}개를 불러왔습니다`);
      } catch (error) {
        this.generatedPagesError = error.message;
        this.generatedPagesLoaded = true;
        if (!options.silent) this.setStatus(`생성 결과 목록을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.generatedPagesLoading = false;
      }
    },

    refreshGeneratedPages() {
      return this.loadGeneratedPagesFromServer({ fresh: true });
    },

    selectStyleGroup(group) {
      this.selectedStyleGroupSlug = group.slug;
      this.expandedStyleGroupSlug = group.slug;
    },

    syncSlug() {
      this.newMd.slug = slugify(this.newMd.brandName);
    },

    startResize(event, handleIndex) {
      const layout = event.currentTarget.closest(".abc-layout");
      if (!layout) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      this.resizeState = {
        handleIndex,
        startX: event.clientX,
        startWidths: [...this.sectionWidths],
        totalWidth: layout.getBoundingClientRect().width,
      };
      document.body.classList.add("is-resizing");
    },

    onResizeMove(event) {
      if (!this.resizeState) return;
      const deltaPercent = ((event.clientX - this.resizeState.startX) / this.resizeState.totalWidth) * 100;
      const next = [...this.resizeState.startWidths];
      const leftIndex = this.resizeState.handleIndex;
      const rightIndex = leftIndex + 1;
      const min = 18;

      next[leftIndex] = this.resizeState.startWidths[leftIndex] + deltaPercent;
      next[rightIndex] = this.resizeState.startWidths[rightIndex] - deltaPercent;

      if (next[leftIndex] < min || next[rightIndex] < min) return;

      this.sectionWidths = next;
    },

    stopResize() {
      if (!this.resizeState) return;
      this.resizeState = null;
      document.body.classList.remove("is-resizing");
    },

    setStatus(message) {
      this.status = message;
    },

    clearPromoInputs() {
      this.resetPromoBuilderState();
      this.setStatus("프로모션 입력값을 초기화했습니다");
    },

    resetPromoBuilderState(options = {}) {
      this.promo = {
        title: "",
        template: "Template 4",
        market: "",
        leadText: "",
        ctaLabel: "",
        ctaUrl: "",
        subline: "",
        alphaText: "",
        termsText: "",
      };
      this.simpleBrief = {
        mainOffer: "",
        targetAction: "",
        audience: "",
        campaignTone: "",
        secondaryMessage: "",
      };
      this.inputMode = "simple";
      this.generationMode = "ai_agent";
      this.globalVisualMode = "auto";
      this.n8nWebhookUrl = "";
      this.currentBuilderStep = 1;
      this.sectionInputs = createEmptyTemp4Inputs();
      if (options.rerender) this.promoBuilderSessionKey += 1;
    },

    autoFillPromoInputs() {
      this.promo = {
        ...this.promo,
        title: "GGPoker Welcome Bonus",
        template: "Template 4",
        market: "Global",
        ctaLabel: "Join Now",
        ctaUrl: "https://www.ggpoker.com/promotions/",
        termsText:
          "This promotion is subject to GGPoker terms and conditions and applicable local regulations. Bonus eligibility, validity period, and participating regions may vary. Available only to responsible players aged 18 or older.",
      };
      this.simpleBrief = {
        mainOffer: "Give new players a first deposit bonus and tournament tickets",
        targetAction: "Sign up, make the first deposit, and claim the welcome rewards",
        audience: "New poker players joining GGPoker for the first time",
        campaignTone: "Premium, trustworthy, energetic global poker promotion",
        secondaryMessage:
          "Highlight a clear reward path that helps players register quickly and move straight into cash games and tournaments.",
      };
      this.inputMode = "simple";
      this.generationMode = "ai_agent";
      this.globalVisualMode = "use_visual";
      this.promoBuilderStarted = true;
      this.currentBuilderStep = 2;
      this.refreshSectionDraft();
      this.setStatus("GGpoker 테스트 프로모션 입력값을 자동등록했습니다");
    },

    openAddDesign() {
      this.newMd = {
        id: "",
        brandName: "GGPoker",
        slug: "ggpoker",
        text: sampleMarkdown,
        sourceName: "text input",
      };
      this.$nextTick(() => this.$refs.addDesignModal.showModal());
    },

    closeAddDesign() {
      this.$refs.addDesignModal.close();
    },

    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".md")) {
        this.setStatus("지원하지 않는 파일입니다");
        return;
      }
      this.newMd.text = await file.text();
      this.newMd.sourceName = file.name;
      this.setStatus("MD 파일을 불러왔습니다");
    },

    loadSample() {
      this.newMd = {
        id: "",
        brandName: "GGPoker",
        slug: "ggpoker",
        text: sampleMarkdown,
        sourceName: "sample-design.md",
      };
      this.setStatus("샘플을 불러왔습니다");
    },

    async registerMarkdown() {
      const markdown = this.newMd.text.trim();
      if (!markdown) {
        this.setStatus("MD 본문이 비어 있습니다");
        return;
      }

      const slug = this.newMd.slug.trim() || slugify(this.newMd.brandName);
      if (window.location.protocol !== "file:") {
        const isEdit = Boolean(this.newMd.id);
        this.setStatus(isEdit ? "MD를 수정하고 데이터화 중입니다" : "MD를 Neon에 저장하고 데이터화 중입니다");
        try {
          const response = await fetch(isEdit ? `/api/design-document?id=${encodeURIComponent(this.newMd.id)}` : "/api/register-design-md", {
            method: isEdit ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              brandName: this.newMd.brandName.trim() || "Untitled Brand",
              slug,
              rawMarkdown: markdown,
              sourceName: this.newMd.sourceName,
            }),
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.message || payload.error || `Register ${response.status}`);
          const doc = payload.document;
          this.closeAddDesign();
          await this.loadDesignDocuments({ fresh: true });
          this.selectDocument(doc.id);
          this.setStatus(isEdit ? "MD 수정 및 데이터화가 완료되었습니다" : "MD 등록 및 데이터화가 완료되었습니다");
          return;
        } catch (error) {
          this.setStatus(`등록 실패: ${error.message}`);
          return;
        }
      }

      const doc = createDoc({
        id: `doc-${String(this.designDocuments.length + 1).padStart(3, "0")}`,
        brandId: `brand-${slug}`,
        brandName: this.newMd.brandName.trim() || "Untitled Brand",
        slug,
        markdown,
        sourceName: this.newMd.sourceName,
        status: "uploaded",
        updatedAt: nowText(),
      });

      this.designDocuments.unshift(doc);
      this.selectDocument(doc.id);
      saveJson(storageKeys.documents, this.designDocuments);
      this.setStatus("MD가 등록되었습니다");
      this.closeAddDesign();
    },

    selectDocument(id) {
      this.selectedDocumentId = id;
      this.selectedDesignDetail = null;
      localStorage.setItem(storageKeys.selectedDocumentId, id);
      const group = this.groupInfoForDocument(this.selectedDocument);
      this.expandedStyleGroupSlug = group.slug;
      this.selectedStyleGroupSlug = group.slug;
      if (this.styleSource === "design_md") this.resetOverride();
      this.setStatus("MD를 선택했습니다");
    },

    openDetail(doc) {
      this.detailDoc = doc;
      this.modalTab = "outline";
      this.$nextTick(() => this.$refs.detailModal.showModal());
      if (window.location.protocol !== "file:") {
        this.loadDesignDocumentDetail(doc.id);
      }
    },

    async openSelectedDocumentSource() {
      if (!this.selectedDocument) return;
      this.detailDoc = this.selectedDesignDataSource || this.selectedDocument;
      this.modalTab = "raw";
      this.$nextTick(() => this.$refs.detailModal.showModal());

      if (window.location.protocol === "file:") return;
      const doc = await this.fetchDesignDocumentDetail(this.selectedDocument.id);
      if (!doc || doc.id !== this.selectedDocumentId) return;
      this.selectedDesignDetail = doc;
      this.detailDoc = doc;
      this.modalTab = "raw";
    },

    closeDetail() {
      this.$refs.detailModal.close();
    },

    async fetchDesignDocumentDetail(id) {
      try {
        const response = await fetch(`/api/design-document?id=${encodeURIComponent(id)}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || payload.error || `Detail ${response.status}`);
        return payload.document;
      } catch (error) {
        this.setStatus(`MD 상세 로딩 실패: ${error.message}`);
        return null;
      }
    },

    async loadDesignDocumentDetail(id) {
      const doc = await this.fetchDesignDocumentDetail(id);
      if (doc) this.detailDoc = doc;
      return doc;
    },

    async loadSelectedDesignDetail(id) {
      if (!id || window.location.protocol === "file:") return null;
      const doc = await this.fetchDesignDocumentDetail(id);
      if (!doc || doc.id !== this.selectedDocumentId) return null;
      this.selectedDesignDetail = doc;
      return doc;
    },

    editDetailDocument() {
      if (!this.detailDoc) return;
      this.newMd = {
        id: this.detailDoc.id,
        brandName: this.detailDoc.brandName,
        slug: this.detailDoc.slug,
        text: this.detailDoc.markdown || "",
        sourceName: this.detailDoc.sourceName || "DESIGN.md",
      };
      this.closeDetail();
      this.$nextTick(() => this.$refs.addDesignModal.showModal());
    },

    async reextractDetailDocument() {
      if (!this.detailDoc || window.location.protocol === "file:") return;
      this.setStatus("Design MD를 재추출 중입니다");
      try {
        const response = await fetch(`/api/design-document?id=${encodeURIComponent(this.detailDoc.id)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "extract" }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || payload.error || `Extract ${response.status}`);
        this.detailDoc = payload.document;
        await this.loadDesignDocuments({ fresh: true });
        this.setStatus("Design MD 재추출이 완료되었습니다");
      } catch (error) {
        this.setStatus(`재추출 실패: ${error.message}`);
      }
    },

    async archiveDetailDocument() {
      if (!this.detailDoc || window.location.protocol === "file:") return;
      if (!window.confirm(`${this.detailDoc.brandName} MD를 보관 처리할까요?`)) return;
      this.setStatus("Design MD를 보관 처리 중입니다");
      try {
        const response = await fetch(`/api/design-document?id=${encodeURIComponent(this.detailDoc.id)}`, {
          method: "DELETE",
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || payload.error || `Archive ${response.status}`);
        this.closeDetail();
        await this.loadDesignDocuments({ fresh: true });
        this.selectedDocumentId = this.designDocuments[0]?.id || "";
        this.setStatus("Design MD를 보관 처리했습니다");
      } catch (error) {
        this.setStatus(`보관 실패: ${error.message}`);
      }
    },

    openConceptDetail() {
      this.$nextTick(() => this.$refs.conceptModal.showModal());
    },

    closeConceptDetail() {
      this.$refs.conceptModal.close();
    },

    resetOverride() {
      this.override = { ...this.sourceStyle };
    },

    hasOverride(pageStyle, sourceStyle) {
      return Object.keys(pageStyle).some((key) => pageStyle[key] !== sourceStyle[key]);
    },

    styleSourceLabel() {
      if (this.styleSource === "design_md") return `디자인 MD / ${this.selectedDocument?.brandName || "없음"}`;
      return `회사 기본값 / ${this.selectedPreset.name}`;
    },

    refreshSectionDraft(options = {}) {
      this.sectionInputs = buildTemp4Draft({
        promo: this.promo,
        simpleBrief: this.simpleBrief,
        selectedDocument: this.selectedDocument,
        visualMode: this.globalVisualMode,
      });
      this.promo.leadText = this.simpleBrief.mainOffer || this.sectionInputs.heroBanner.sublineText;
      this.promo.subline = this.simpleBrief.secondaryMessage || this.sectionInputs.contentCta.longText;
      this.promo.template = "Template 4";
      if (!options.silent) this.setStatus("Temp.4 섹션 초안을 갱신했습니다");
    },

    hasSectionDraft() {
      const hasDraftTitle = String(this.sectionInputs.heroBanner.title || "").trim();
      const hasDraftOffer = String(this.sectionInputs.contentCta.longText || "").trim();
      return Boolean(hasDraftTitle || hasDraftOffer);
    },

    sectionInputsForPayload() {
      if (this.inputMode === "simple" || (!this.hasSectionDraft() && String(this.promo.title || "").trim())) {
        this.refreshSectionDraft({ silent: true });
      }
      return JSON.parse(JSON.stringify(this.sectionInputs));
    },

    buildGeneratedPayload(pageId) {
      const source = this.sourceStyle;
      const designDoc = this.selectedDesignDataSource || this.selectedDocument;
      const sectionInputs = this.sectionInputsForPayload();
      const promoCompat = {
        ...this.promo,
        template: "Template 4",
        leadText: this.promo.leadText || sectionInputs.heroBanner.sublineText || this.simpleBrief.mainOffer,
        subline: this.promo.subline || sectionInputs.contentCta.longText || this.simpleBrief.secondaryMessage,
        alphaText: this.promo.alphaText || sectionInputs.heroBanner.alphaText,
      };
      return {
        id: pageId,
        model: generationModels.text,
        imageModel: generationModels.image,
        generatedAt: nowText(),
        md: {
          id: designDoc.id,
          brand: designDoc.brandName,
          slug: designDoc.slug,
          summary: designDoc.summary,
          designConcept: designDoc.designConcept,
          styleClassification: designDoc.styleClassification,
          designPromptContext: designDoc.designConcept?.promptContext || "",
          designData: {
            summary: designDoc.summary,
            metadata: designDoc.metadata || designDoc.metadataItems || [],
            normalizedSchema: designDoc.normalizedSchema || designDoc.tokenSet?.normalizedSchema || null,
            tokenItems: designDoc.tokenItems || [],
            componentPatterns: designDoc.componentPatterns || [],
            layoutPatterns: designDoc.layoutPatterns || [],
            guidelineItems: designDoc.guidelineItems || [],
            componentPatternCount: designDoc.summary?.componentPatternCount || designDoc.componentPatterns?.length || 0,
            layoutPatternCount: designDoc.summary?.layoutPatternCount || designDoc.layoutPatterns?.length || 0,
            guidelineCount: designDoc.summary?.guidelineCount || designDoc.guidelineItems?.length || 0,
            extractionStatus: designDoc.extractionStatus || designDoc.status,
            sourceHash: designDoc.sourceHash || designDoc.tokenSet?.sourceHash || "",
          },
        },
        promo: promoCompat,
        template: {
          id: this.templateSchema.id,
          name: this.templateSchema.name,
          generationMode: this.generationMode,
          inputMode: this.inputMode,
          sectionOrder: this.templateSchema.sectionOrder,
        },
        simpleBrief: { ...this.simpleBrief },
        sectionInputs,
        design: { ...this.finalStyle },
        sourceDesign: { ...source },
        styleSource: this.styleSource,
        styleSourceLabel: this.styleSourceLabel(),
        n8nWebhookUrl: this.n8nWebhookUrl.trim(),
        companyPreset: this.styleSource === "company_default" ? this.selectedPreset.name : null,
        hasOverride: this.hasOverride(this.finalStyle, source),
      };
    },

    validatePromoInputs() {
      if (!this.selectedDocument) {
        this.setStatus("먼저 디자인 MD를 선택해 주세요");
        return false;
      }
      const extractionStatus = this.selectedDocument.extractionStatus || this.selectedDocument.status;
      if (window.location.protocol !== "file:" && extractionStatus !== "ready") {
        this.setStatus(`선택한 MD가 아직 생성 가능 상태가 아닙니다: ${extractionStatus || "unknown"}`);
        return false;
      }
      const required = [
        ["title", "프로모션 제목"],
        ["market", "마켓 / 지역"],
        ["ctaLabel", "CTA 문구"],
        ["ctaUrl", "CTA URL"],
        ["termsText", "이용약관"],
      ];
      const missing = required.filter(([key]) => !String(this.promo[key] || "").trim()).map(([, label]) => label);
      const simpleMissing = [
        ["mainOffer", "주요 혜택"],
        ["targetAction", "유도 행동"],
      ]
        .filter(([key]) => !String(this.simpleBrief[key] || "").trim())
        .map(([, label]) => label);
      const allMissing = [...missing, ...simpleMissing];
      if (allMissing.length) {
        this.setStatus(`필수 입력 누락: ${allMissing.slice(0, 2).join(", ")}${allMissing.length > 2 ? "..." : ""}`);
        return false;
      }
      return true;
    },

    validateLegacyPromoInputs() {
      const required = [
        ["title", "프로모션 제목"],
        ["template", "템플릿"],
        ["market", "마켓 / 지역"],
        ["leadText", "리드 문구"],
        ["ctaLabel", "CTA 문구"],
        ["ctaUrl", "CTA URL"],
        ["subline", "보조 문구"],
        ["termsText", "이용약관"],
      ];
      const missing = required.filter(([key]) => !String(this.promo[key] || "").trim()).map(([, label]) => label);
      if (missing.length) {
        this.setStatus(`필수 입력 누락: ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? "..." : ""}`);
        return false;
      }
      return true;
    },

    async triggerN8n(payload) {
      const url = this.n8nWebhookUrl.trim();
      const useProxy = !url && window.location.protocol !== "file:";
      if (!url && !useProxy) return null;
      const requestUrl = useProxy ? "/api/generate-ui-design" : url;

      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(requestUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json") ? await response.json() : { html: await response.text() };
      if (!response.ok) throw new Error(result.message || result.error || `n8n ${response.status}`);
      return result;
    },

    applyStoredDesignResult(page, result) {
      const updatedPage = this.storedResultToPage(result, page);
      if (!updatedPage.id) return false;
      Object.assign(page, updatedPage, {
        status: "n8n_ui_design_generated",
        errorMessage: "",
      });
      return true;
    },

    async refreshStoredDesignResult(page) {
      if (!page?.id || window.location.protocol === "file:") return false;

      const response = await fetch(`/api/promo-design-assets?runKey=${encodeURIComponent(page.id)}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) return false;
      const updated = this.applyStoredDesignResult(page, result);
      return updated;
    },

    async waitForStoredDesignResult(page, options = {}) {
      const attempts = options.attempts || 4;
      const delayMs = options.delayMs || 900;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const updated = await this.refreshStoredDesignResult(page).catch(() => false);
        if (updated) return true;
        if (attempt < attempts - 1) await delay(delayMs);
      }
      return false;
    },

    async generateUiDesign() {
      if (!this.selectedDocument) {
        this.setStatus("먼저 MD를 선택해 주세요");
        return;
      }
      if (!this.validatePromoInputs()) return;
      await this.loadSelectedDesignDetail(this.selectedDocumentId);

      const pageId = createRunKey();
      const payload = this.buildGeneratedPayload(pageId);
      const initialStamp = timestampStamp(payload.generatedAt);
      const willUseN8n = this.n8nWebhookUrl.trim() || window.location.protocol !== "file:";
      this.setStatus(willUseN8n ? "UI 디자인 워크플로를 실행 중입니다" : "로컬에서 UI 디자인을 생성했습니다");

      const listItem = {
        id: pageId,
        title: payload.promo.title,
        selectedMd: payload.md.brand,
        styleSourceLabel: payload.styleSourceLabel,
        template: payload.promo.template,
        market: payload.promo.market,
        createdAt: payload.generatedAt,
        committedAt: "",
        timestampStamp: initialStamp,
        status: willUseN8n ? "n8n_ui_design_pending" : "draft",
        designUrl: "",
        imageUrl: "",
        pageUrl: "",
        layoutMapping: null,
        mdComplianceMap: null,
        imagePrompt: "",
        promptGroupId: "",
        designPromptStorageKey: "",
        promoInputStorageKey: "",
        integratedBriefStorageKey: "",
        errorMessage: "",
        hasOverride: payload.hasOverride,
        resultType: willUseN8n ? "pending" : "draft",
        payload,
      };

      this.generatedPages.unshift(listItem);

      let n8nResult = null;
      try {
        n8nResult = await this.triggerN8n(payload);
      } catch (error) {
        const recovered = await this.waitForStoredDesignResult(listItem, { attempts: 5, delayMs: 1200 }).catch(() => false);
        if (recovered) {
          this.currentBuilderStep = 5;
          this.setStatus("n8n 응답은 지연됐지만 저장된 UI 디자인을 확인했습니다");
          if (listItem.pageUrl) window.open(listItem.pageUrl, "_blank");
          return;
        }

        listItem.status = "n8n_failed";
        listItem.errorMessage = error.message;
        this.setStatus(`n8n 실행 실패. 서버 저장 결과를 확인하지 못했습니다: ${error.message}`);
        return;
      }

      listItem.status = n8nResult ? "n8n_ui_design_generated" : "draft";
      listItem.designUrl = toDesignViewUrl(n8nResult?.designUrl || designViewUrlForId(listItem.id), listItem.id);
      listItem.imageUrl = n8nResult?.imageUrl || "";
      listItem.pageUrl = toDesignViewUrl(n8nResult?.designUrl || n8nResult?.pageUrl || n8nResult?.previewUrl || designViewUrlForId(listItem.id), listItem.id) || n8nResult?.imageUrl || "";
      listItem.resultType = n8nResult?.resultType || this.resultType(listItem);
      listItem.layoutMapping = n8nResult?.layoutMapping || null;
      listItem.mdComplianceMap = n8nResult?.mdComplianceMap || null;
      listItem.imagePrompt = n8nResult?.imagePrompt || "";
      listItem.promptGroupId = n8nResult?.promptGroupId || "";
      listItem.designPromptStorageKey = n8nResult?.designPromptStorageKey || "";
      listItem.promoInputStorageKey = n8nResult?.promoInputStorageKey || "";
      listItem.integratedBriefStorageKey = n8nResult?.integratedBriefStorageKey || "";
      listItem.committedAt = n8nResult?.committedAt || listItem.committedAt;
      listItem.timestampStamp = n8nResult?.timestampStamp || timestampStamp(listItem.committedAt || listItem.createdAt);
      listItem.payload = n8nResult?.payload || payload;
      await this.waitForStoredDesignResult(listItem, { attempts: 5, delayMs: 900 }).catch(() => false);
      await this.loadGeneratedPagesFromServer({ silent: true, fresh: true, preserveIds: [listItem.id] });

      this.currentBuilderStep = 5;
      this.setStatus(n8nResult ? "n8n UI 디자인 생성이 완료되었습니다" : "로컬 UI 디자인 생성이 완료되었습니다");
      if (listItem.pageUrl) window.open(listItem.pageUrl, "_blank");
    },

    generatePage() {
      return this.generateUiDesign();
    },

    async openGenerated(page) {
      if (page.status === "n8n_failed" || !page.pageUrl || !page.designUrl) {
        await this.refreshStoredDesignResult(page).catch(() => false);
      }

      const pageUrl = toDesignViewUrl(page.pageUrl || page.designUrl || "", page.id);
      if (pageUrl) {
        window.open(pageUrl, "_blank");
        return;
      }
      saveJson(storageKeys.generatedPage, page.payload);
      window.open("generated.html", "_blank");
    },

    canOpenPromptFiles(page) {
      return Boolean(page?.promptGroupId || page?.designPromptStorageKey || page?.promoInputStorageKey || page?.id);
    },

    async openPromptFiles(page) {
      if (!this.canOpenPromptFiles(page)) {
        this.setStatus("저장된 프롬프트 MD 파일 정보가 없습니다");
        return;
      }

      if (!page.promptGroupId) {
        await this.refreshStoredDesignResult(page).catch(() => false);
      }

      this.promptModalPage = page;
      this.promptModalLoading = true;
      this.promptModalError = "";
      this.promptModalDesignMarkdown = "";
      this.promptModalIntegratedMarkdown = "";
      this.promptModalPromoMarkdown = "";
      this.$nextTick(() => {
        if (!this.$refs.promptFilesModal.open) this.$refs.promptFilesModal.showModal();
      });

      try {
        const [design, promo] = await Promise.all([
          this.fetchPromptMarkdown(page, "design_prompt_markdown"),
          this.fetchPromptMarkdown(page, "promo_input_markdown"),
        ]);
        const integrated = await this.fetchPromptMarkdown(page, "integrated_design_brief_markdown").catch(() => null);
        this.promptModalDesignMarkdown = design.markdown || "";
        this.promptModalPromoMarkdown = promo.markdown || "";
        this.promptModalIntegratedMarkdown = integrated?.markdown || this.extractIntegratedDesignBrief(design.markdown || "");
        this.setStatus("프롬프트 MD 파일을 불러왔습니다");
      } catch (error) {
        this.promptModalError = error.message;
        this.setStatus(`프롬프트 MD 파일을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.promptModalLoading = false;
      }
    },

    async fetchPromptMarkdown(page, type) {
      const params = new URLSearchParams({ type });
      if (page.promptGroupId) params.set("promptGroupId", page.promptGroupId);
      else params.set("runKey", page.id);

      const response = await fetch(`/api/promo-design-markdown?${params.toString()}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || result.error || `Markdown ${response.status}`);
      }
      return result;
    },

    extractIntegratedDesignBrief(markdown) {
      const source = String(markdown || "");
      const sectionMatch = source.match(/## Integrated Design Brief\s*\n([\s\S]*?)(?=\n## Integrated Design Brief JSON|\n## Layout Mapping|\n## MD Compliance Map|\n## [^\n]+|$)/);
      const extracted = sectionMatch?.[1]?.trim() || "";
      if (extracted && !/^_No integrated design brief markdown/i.test(extracted)) return extracted;

      const jsonMatch = source.match(/## Integrated Design Brief JSON\s*\n\s*```json\s*([\s\S]*?)```/);
      if (jsonMatch?.[1]) return jsonMatch[1].trim();

      return "";
    },

    downloadPromptMarkdown(type) {
      const config = {
        design: {
          markdown: this.promptModalDesignMarkdown,
          storageKey: this.promptModalPage?.designPromptStorageKey,
          fallbackName: "design-prompt",
        },
        promo: {
          markdown: this.promptModalPromoMarkdown,
          storageKey: this.promptModalPage?.promoInputStorageKey,
          fallbackName: "promo-input",
        },
        integrated: {
          markdown: this.promptModalIntegratedMarkdown,
          storageKey: this.promptModalPage?.integratedBriefStorageKey,
          fallbackName: "integrated-design-brief",
        },
      }[type];

      if (!config?.markdown) {
        this.setStatus("다운로드할 Markdown 내용이 없습니다");
        return;
      }

      const runKey = this.promptModalPage?.id || "promo";
      const stamp = this.promptModalPage?.timestampStamp || timestampStamp(new Date());
      const filename = this.markdownDownloadFilename(config.storageKey, `${config.fallbackName}-${runKey}-${stamp}.md`);
      const blob = new Blob([config.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      this.setStatus(`${filename} 다운로드를 시작했습니다`);
    },

    markdownDownloadFilename(storageKey, fallbackName) {
      const rawName = String(storageKey || "").split("/").pop() || fallbackName;
      const filename = rawName.endsWith(".md") ? rawName : `${rawName}.md`;
      return filename
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
    },

    closePromptFilesModal() {
      this.$refs.promptFilesModal.close();
    },
  },
}).mount("#app");

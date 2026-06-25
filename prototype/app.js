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
  n8nAnalyzeWebhookUrl: "promoPrototype.n8nAnalyzeWebhookUrl",
};

const dummyCompanyStylePresets = [
  {
    id: "preset-001",
    name: "GGPoker Global Default",
    brandId: "brand-ggpoker",
    market: "Global",
    description: "Default red and black GGPoker promo style.",
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
    name: "GGPoker Dark Promo",
    brandId: "brand-ggpoker",
    market: "Global",
    description: "Darker high-contrast campaign style.",
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
    name: "GGVegas Default",
    brandId: "brand-ggvegas",
    market: "Global",
    description: "Casino-forward gold accent style.",
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
    name: "Brazil Compliance Style",
    brandId: "brand-ggpoker",
    market: "Brazil",
    description: "Market-specific compliant style with calmer contrast.",
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
    const pages = loadJson(storageKeys.generatedPages, []);
    return {
      status: "Ready",
      sectionWidths: [30, 30, 40],
      resizeState: null,
      designDocuments: [],
      mdListSource: "Loading",
      companyStylePresets: dummyCompanyStylePresets,
      selectedDocumentId: localStorage.getItem(storageKeys.selectedDocumentId) || "",
      selectedPresetId: "preset-001",
      styleSource: "company_default",
      n8nWebhookUrl: localStorage.getItem(storageKeys.n8nWebhookUrl) || "",
      n8nAnalyzeWebhookUrl: localStorage.getItem(storageKeys.n8nAnalyzeWebhookUrl) || "",
      detailDoc: null,
      modalTab: "outline",
      newMd: {
        brandName: "GGPoker",
        slug: "ggpoker",
        text: sampleMarkdown,
        sourceName: "text input",
      },
      promo: {
        title: "",
        template: "",
        market: "",
        leadText: "",
        ctaLabel: "",
        ctaUrl: "",
        subline: "",
        alphaText: "",
        termsText: "",
      },
      override: {
        primaryColor: "#d52b1e",
        ctaColor: "#e12d25",
        canvasColor: "#f3f3f3",
        headingFont: "Pretendard, Arial, sans-serif",
        bodyFont: "Pretendard, Arial, sans-serif",
        titleWeight: "800",
      },
      generatedPages: pages,
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
    n8nWebhookUrl(value) {
      localStorage.setItem(storageKeys.n8nWebhookUrl, value.trim());
    },
    n8nAnalyzeWebhookUrl(value) {
      localStorage.setItem(storageKeys.n8nAnalyzeWebhookUrl, value.trim());
    },
  },

  mounted() {
    this.loadDesignDocuments();
    this.resetOverride();
  },

  methods: {
    async loadDesignDocuments() {
      try {
        const response = await fetch("/api/design-documents");
        if (!response.ok) throw new Error(`API ${response.status}`);
        const payload = await response.json();
        this.designDocuments = payload.documents || [];
        this.mdListSource = "Neon Postgres";
        if (!this.selectedDocumentId || !this.selectedDocument) {
          this.selectedDocumentId = this.designDocuments[0]?.id || "";
        }
        localStorage.setItem(storageKeys.selectedDocumentId, this.selectedDocumentId);
        this.resetOverride();
        this.setStatus(`Loaded ${this.designDocuments.length} MDs from Neon`);
      } catch (error) {
        this.designDocuments = dummyDocuments();
        this.mdListSource = "Fallback dummy";
        if (!this.selectedDocumentId || !this.selectedDocument) {
          this.selectedDocumentId = this.designDocuments[0]?.id || "";
        }
        localStorage.setItem(storageKeys.selectedDocumentId, this.selectedDocumentId);
        this.resetOverride();
        this.setStatus("Neon API unavailable. Using fallback dummy data");
      }
    },

    conceptValue(key) {
      return this.selectedDocument?.designConcept?.json?.[key] || "";
    },

    conceptList(key) {
      const value = this.selectedDocument?.designConcept?.json?.[key];
      return Array.isArray(value) ? value : [];
    },

    async analyzeDocument(doc) {
      if (!doc) {
        this.setStatus("Select an MD first");
        return;
      }
      if (!doc.markdown) {
        this.setStatus("Raw markdown is empty");
        return;
      }
      if (window.location.protocol === "file:" && !this.n8nAnalyzeWebhookUrl.trim()) {
        this.setStatus("Set analyze webhook URL first");
        return;
      }

      const useProxy = window.location.protocol !== "file:";
      const requestUrl = useProxy ? "/api/analyze-design-md" : this.n8nAnalyzeWebhookUrl.trim();
      const headers = {
        "Content-Type": "application/json",
      };
      if (useProxy && this.n8nAnalyzeWebhookUrl.trim()) {
        headers["x-n8n-analyze-webhook-url"] = this.n8nAnalyzeWebhookUrl.trim();
      }

      this.setStatus("Analyzing MD concept");
      try {
        const response = await fetch(requestUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            documentId: doc.id,
            brandName: doc.brandName,
            sourceName: doc.sourceName,
            rawMarkdown: doc.markdown,
          }),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || payload.error || `Analyze ${response.status}`);
        this.setStatus("MD concept analyzed");
        if (useProxy) await this.loadDesignDocuments();
      } catch (error) {
        this.setStatus(`Analyze failed: ${error.message}`);
      }
    },

    async analyzeSelectedDocument() {
      await this.analyzeDocument(this.selectedDocument);
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
      this.promo = {
        title: "",
        template: "",
        market: "",
        leadText: "",
        ctaLabel: "",
        ctaUrl: "",
        subline: "",
        alphaText: "",
        termsText: "",
      };
      this.setStatus("Promo inputs cleared");
    },

    openAddDesign() {
      this.$nextTick(() => this.$refs.addDesignModal.showModal());
    },

    closeAddDesign() {
      this.$refs.addDesignModal.close();
    },

    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".md")) {
        this.setStatus("Invalid file");
        return;
      }
      this.newMd.text = await file.text();
      this.newMd.sourceName = file.name;
      this.setStatus("MD file loaded");
    },

    loadSample() {
      this.newMd = {
        brandName: "GGPoker",
        slug: "ggpoker",
        text: sampleMarkdown,
        sourceName: "sample-design.md",
      };
      this.setStatus("Sample loaded");
    },

    async registerMarkdown() {
      const markdown = this.newMd.text.trim();
      if (!markdown) {
        this.setStatus("MD text is empty");
        return;
      }

      const slug = this.newMd.slug.trim() || slugify(this.newMd.brandName);
      if (window.location.protocol !== "file:") {
        this.setStatus("Saving MD to Neon");
        try {
          const response = await fetch("/api/register-design-md", {
            method: "POST",
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
          this.setStatus("MD saved. Analyzing concept");
          await this.loadDesignDocuments();
          this.selectDocument(doc.id);
          await this.analyzeDocument(doc);
          await this.loadDesignDocuments();
          this.setStatus("MD registered and analyzed");
          return;
        } catch (error) {
          this.setStatus(`Register failed: ${error.message}`);
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
      this.setStatus("MD registered");
      this.closeAddDesign();
    },

    selectDocument(id) {
      this.selectedDocumentId = id;
      localStorage.setItem(storageKeys.selectedDocumentId, id);
      if (this.styleSource === "design_md") this.resetOverride();
      this.setStatus("MD selected");
    },

    openDetail(doc) {
      this.detailDoc = doc;
      this.modalTab = "outline";
      this.$nextTick(() => this.$refs.detailModal.showModal());
    },

    closeDetail() {
      this.$refs.detailModal.close();
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
      if (this.styleSource === "design_md") return `Design MD / ${this.selectedDocument?.brandName || "None"}`;
      return `Company Default / ${this.selectedPreset.name}`;
    },

    buildGeneratedPayload(pageId) {
      const source = this.sourceStyle;
      return {
        id: pageId,
        generatedAt: nowText(),
        md: {
          id: this.selectedDocument.id,
          brand: this.selectedDocument.brandName,
          slug: this.selectedDocument.slug,
          summary: this.selectedDocument.summary,
          designConcept: this.selectedDocument.designConcept,
          designPromptContext: this.selectedDocument.designConcept?.promptContext || "",
          markdown: this.selectedDocument.markdown,
        },
        promo: { ...this.promo },
        design: { ...this.finalStyle },
        sourceDesign: { ...source },
        styleSource: this.styleSource,
        styleSourceLabel: this.styleSourceLabel(),
        companyPreset: this.styleSource === "company_default" ? this.selectedPreset.name : null,
        hasOverride: this.hasOverride(this.finalStyle, source),
        output: {
          format: "desktop_web_page",
          viewport: {
            width: 1440,
            minWidth: 1180,
          },
        },
      };
    },

    validatePromoInputs() {
      const required = [
        ["title", "Promo title"],
        ["template", "Template"],
        ["market", "Market / Region"],
        ["leadText", "Lead text"],
        ["ctaLabel", "CTA label"],
        ["ctaUrl", "CTA URL"],
        ["subline", "Subline"],
        ["termsText", "Terms and Conditions"],
      ];
      const missing = required.filter(([key]) => !String(this.promo[key] || "").trim()).map(([, label]) => label);
      if (missing.length) {
        this.setStatus(`Missing: ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? "..." : ""}`);
        return false;
      }
      return true;
    },

    async triggerN8n(payload) {
      const url = this.n8nWebhookUrl.trim();
      const useProxy = window.location.protocol !== "file:";
      if (!url && !useProxy) return null;
      const requestUrl = useProxy ? "/api/generate-promo-page" : url;

      const headers = {
        "Content-Type": "application/json",
      };
      if (useProxy) headers["x-n8n-webhook-url"] = url;

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

    async generatePage() {
      if (!this.selectedDocument) {
        this.setStatus("Select an MD first");
        return;
      }
      if (!this.validatePromoInputs()) return;

      const pageId = `promo-${String(this.generatedPages.length + 1).padStart(3, "0")}`;
      const payload = this.buildGeneratedPayload(pageId);
      const willUseN8n = this.n8nWebhookUrl.trim() || window.location.protocol !== "file:";
      this.setStatus(willUseN8n ? "Triggering n8n workflow" : "Page generated locally");

      let n8nResult = null;
      try {
        n8nResult = await this.triggerN8n(payload);
      } catch (error) {
        this.setStatus(`n8n failed: ${error.message}`);
        return;
      }

      const listItem = {
        id: pageId,
        title: payload.promo.title,
        selectedMd: payload.md.brand,
        styleSourceLabel: payload.styleSourceLabel,
        template: payload.promo.template,
        market: payload.promo.market,
        createdAt: payload.generatedAt,
        status: n8nResult ? "n8n_generated" : "draft",
        pageUrl: n8nResult?.pageUrl || n8nResult?.previewUrl || "",
        hasOverride: payload.hasOverride,
        payload: n8nResult?.payload || payload,
      };

      this.generatedPages.unshift(listItem);
      saveJson(storageKeys.generatedPages, this.generatedPages);
      saveJson(storageKeys.generatedPage, listItem.payload);
      this.setStatus(n8nResult ? "n8n page generated" : "Page generated locally");
      if (listItem.pageUrl) window.open(listItem.pageUrl, "_blank");
    },

    openGenerated(page) {
      if (page.pageUrl) {
        window.open(page.pageUrl, "_blank");
        return;
      }
      saveJson(storageKeys.generatedPage, page.payload);
      window.open("generated.html", "_blank");
    },
  },
}).mount("#app");


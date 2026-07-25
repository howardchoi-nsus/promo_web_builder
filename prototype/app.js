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
  themeMode: "promoPrototype.themeMode",
};

const generationModels = {
  text: "gpt-4o-mini",
  image: "gemini-3.1-flash-image",
};

const generationStageStaleLimitsMs = {
  integrated_brief: 6 * 60 * 1000,
  lofi_draft: 4 * 60 * 1000,
  final_design: 6 * 60 * 1000,
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

// Template 4 is local schema data so the POC can build section config without a backend round-trip.
const temp4TemplateSchema = {
  id: "temp4",
  templateId: "default_temp",
  name: "Template 4",
  templateName: "Default Temp",
  version: "1.0.0",
  sectionOrder: ["header", "heroBanner", "stepBar", "contentCta", "imageTextRow", "titleDescription", "footer"],
  visualSections: ["heroBanner", "contentCta", "imageTextRow"],
  governance: {
    ignorePreviousConfig: true,
    requiredMissingAlert: true,
    progressRequired: true,
    designStyleSelectionRemoved: true,
    applySelectedDesignTokens: true,
  },
  promotionInputSchema: {
    purpose: {
      label: "프로모션 목적",
      required: true,
      inputType: "select",
      options: ["할인쿠폰", "웰컴", "이벤트", "기타"],
      otherInputRequiredWhen: "기타",
    },
    targetCustomer: {
      label: "대상고객",
      required: true,
      inputType: "select",
      options: ["신규", "기존고객", "윈백고객"],
    },
    campaignTone: {
      label: "캠페인톤",
      required: true,
      inputType: "select",
      options: ["활기찬", "신중한", "럭키", "프리미엄", "긴급한", "친근한"],
    },
  },
  templateForm: {
    mode: "default_template",
    sectionVisibilityDefault: true,
    dragOrderEnabled: true,
    fixedTopSection: "header",
    fixedBottomSection: "footer",
    itemVisibilityEnabled: true,
    ctaMovesWithSection: true,
  },
  generationRules: {
    settings: ["AI 자동 생성", "템플릿 선택"],
    pocWebhookInputEnabled: true,
    useSelectedDesignTokensOnly: true,
    requestImageGenerationForMarkedItems: true,
  },
  validationRules: {
    requiredInputs: ["purpose", "targetCustomer", "campaignTone", "template"],
    missingInputBehavior: "show_missing_alert",
  },
  progress: {
    enabled: true,
    message: "디자인 생성되고 있습니다.",
    animation: true,
    canClose: true,
    stages: ["db", "data", "process", "design_generation"],
  },
  sections: [
    {
      sectionId: "header",
      name: "Header",
      defaultVisible: true,
      fixedPosition: "top",
      orderChangeAllowed: false,
      items: [
        { itemId: "logoText", label: "LOGO", required: true, defaultVisible: true, inputPath: "header.logoText", description: "로고이미지" },
        { itemId: "badgeText", label: "Badges", required: true, defaultVisible: true, inputPath: "header.badgeText", imageGenerationRequest: true, description: "뱃지 이미지" },
      ],
    },
    {
      sectionId: "heroBanner",
      name: "Hero Banner",
      defaultVisible: true,
      orderChangeAllowed: true,
      items: [
        { itemId: "leaderText", label: "Lead Text", defaultVisible: true, inputPath: "heroBanner.leaderText", description: "주요 문구" },
        { itemId: "title", label: "Title", required: true, defaultVisible: true, inputPath: "heroBanner.title", description: "제목" },
        { itemId: "sublineText", label: "Subline Text", defaultVisible: true, inputPath: "heroBanner.sublineText", description: "부제목" },
        { itemId: "button", label: "Button", defaultVisible: true, inputPath: "heroBanner.cta.label", imageGenerationRequest: true, movesWithSection: true, description: "버튼 텍스트" },
        { itemId: "alphaText", label: "Alpha Text", defaultVisible: true, inputPath: "heroBanner.alphaText", description: "추가 안내 문구" },
      ],
    },
    {
      sectionId: "stepBar",
      name: "Step Bar",
      defaultVisible: true,
      orderChangeAllowed: true,
      repeatableSet: {
        label: "Step Set",
        addLabel: "Step Set 추가",
        note: "Title, Description, CTA Button이 1개 세트입니다.",
      },
      items: [
        { itemId: "title", label: "Title", defaultVisible: true, inputKey: "title", description: "제목" },
        { itemId: "description", label: "Description", defaultVisible: true, inputKey: "description", description: "설명" },
        { itemId: "ctaButton", label: "CTA Button", defaultVisible: true, inputKey: "ctaLabel", description: "버튼 텍스트" },
      ],
    },
    {
      sectionId: "contentCta",
      name: "Contents",
      defaultVisible: true,
      orderChangeAllowed: true,
      items: [
        { itemId: "title", label: "Title", defaultVisible: true, inputPath: "contentCta.title", imageGenerationRequest: true, description: "제목" },
        { itemId: "description", label: "Description", defaultVisible: true, inputPath: "contentCta.longText", imageGenerationRequest: true, inputType: "textarea", description: "이미지와 텍스트 및 CTA 버튼으로 자유롭게 구성" },
        { itemId: "image", label: "Image", defaultVisible: true, inputPath: "contentCta.imageText", imageGenerationRequest: true, description: "이미지" },
        { itemId: "button", label: "button", defaultVisible: true, inputPath: "contentCta.cta.label", imageGenerationRequest: true, movesWithSection: true, description: "버튼 텍스트" },
      ],
    },
    {
      sectionId: "imageTextRow",
      name: "Image Text Row",
      defaultVisible: true,
      orderChangeAllowed: true,
      repeatableSet: {
        label: "Image Text Set",
        addLabel: "Image Text Set 추가",
        maxPerRow: 3,
        note: "Image, Title, Description이 1개 세트이며 1 row 최대 3개까지 배치합니다.",
      },
      items: [
        { itemId: "image", label: "Image", defaultVisible: true, inputKey: "imageText", imageGenerationRequest: true, description: "이미지" },
        { itemId: "title", label: "Title", defaultVisible: true, inputKey: "title", description: "제목" },
        { itemId: "description", label: "Description", defaultVisible: true, inputKey: "description", description: "설명" },
      ],
    },
    {
      sectionId: "titleDescription",
      name: "Title and Description",
      defaultVisible: true,
      orderChangeAllowed: true,
      items: [
        { itemId: "title", label: "Title", defaultVisible: true, inputPath: "titleDescription.title" },
        { itemId: "contents", label: "Contents", defaultVisible: true, inputPath: "titleDescription.contents", imageGenerationRequest: true, inputType: "textarea", description: "텍스트 등록, Bold/블릿 적용 가능" },
      ],
    },
    {
      sectionId: "footer",
      name: "Footer",
      defaultVisible: true,
      fixedPosition: "bottom",
      orderChangeAllowed: false,
      items: [
        { itemId: "logoText", label: "Logo", required: true, defaultVisible: true, inputPath: "footer.logoText", imageGenerationRequest: true, description: "로고" },
        { itemId: "licenseBadges", label: "License Badges", required: true, defaultVisible: true, inputPath: "footer.licenseBadges", imageGenerationRequest: true, description: "라이선스 뱃지" },
        { itemId: "content", label: "content", required: true, defaultVisible: true, inputPath: "footer.content", inputType: "textarea", description: "푸터 내용" },
      ],
    },
  ],
};

// Template schema helpers normalize future backend schemas and the current local temp4 schema into one runtime shape.
function templateSections(schema) {
  return Array.isArray(schema?.sections) ? schema.sections : [];
}

function orderedTemplateSections(schema) {
  const sections = templateSections(schema);
  const byId = new Map(sections.map((section) => [section.sectionId || section.key, section]));
  const orderedIds = Array.isArray(schema?.sectionOrder) && schema.sectionOrder.length
    ? schema.sectionOrder
    : sections.map((section) => section.sectionId || section.key);
  return orderedIds.map((id) => byId.get(id)).filter(Boolean);
}

function createDefaultSectionConfig(schema) {
  const sections = orderedTemplateSections(schema);
  return {
    orderedSections: sections.map((section) => section.sectionId || section.key),
    sectionVisibility: Object.fromEntries(
      sections.map((section) => [section.sectionId || section.key, section.defaultVisible !== false])
    ),
    itemVisibility: Object.fromEntries(
      sections.map((section) => [
        section.sectionId || section.key,
        Object.fromEntries((section.items || []).map((item) => [item.itemId || item.key, item.defaultVisible !== false])),
      ])
    ),
    imageGenerationMode: Object.fromEntries(
      sections.map((section) => [
        section.sectionId || section.key,
        Object.fromEntries((section.items || []).map((item) => {
          const itemId = item.itemId || item.key;
          if (item.imageGenerationRequest || item.sendToImagePrompt) return [itemId, "generate"];
          return [itemId, "none"];
        })),
      ])
    ),
  };
}

function defaultImageGenerationMode(item) {
  return item?.imageGenerationRequest || item?.sendToImagePrompt ? "generate" : "none";
}

function buildTemplateRuntime(schema, config = null) {
  const sections = templateSections(schema);
  const orderedSections = orderedTemplateSections(schema).map((section) => section.sectionId || section.key);
  const configuredOrder = Array.isArray(config?.orderedSections) && config.orderedSections.length
    ? config.orderedSections.filter((id) => sections.some((section) => (section.sectionId || section.key) === id))
    : orderedSections;
  const sectionVisibility = Object.fromEntries(
    sections.map((section) => {
      const sectionId = section.sectionId || section.key;
      return [sectionId, config?.sectionVisibility?.[sectionId] ?? section.defaultVisible !== false];
    })
  );
  const itemVisibility = Object.fromEntries(
    sections.map((section) => [
      section.sectionId || section.key,
      Object.fromEntries((section.items || []).map((item) => {
        const sectionId = section.sectionId || section.key;
        const itemId = item.itemId || item.key;
        return [itemId, config?.itemVisibility?.[sectionId]?.[itemId] ?? item.defaultVisible !== false];
      })),
    ])
  );
  const imageGenerationMode = config?.imageGenerationMode || {};

  return {
    templateId: schema?.templateId || schema?.id,
    templateName: schema?.templateName || schema?.name,
    schemaVersion: schema?.version || "1.0.0",
    orderedSections: configuredOrder,
    visibleSections: configuredOrder.filter((sectionId) => sectionVisibility[sectionId] !== false),
    sectionVisibility,
    itemVisibility,
    fixedSections: sections
      .filter((section) => section.fixedPosition)
      .map((section) => ({ sectionId: section.sectionId || section.key, fixedPosition: section.fixedPosition })),
    draggableSections: sections
      .filter((section) => section.orderChangeAllowed !== false && !section.fixedPosition)
      .map((section) => section.sectionId || section.key),
    imageGenerationTargets: sections.flatMap((section) =>
      (section.items || [])
        .filter((item) => {
          if (section.repeatableSet) return false;
          const sectionId = section.sectionId || section.key;
          const itemId = item.itemId || item.key;
          if (sectionVisibility[sectionId] === false || itemVisibility[sectionId]?.[itemId] === false) return false;
          const configuredMode = imageGenerationMode?.[sectionId]?.[itemId] || defaultImageGenerationMode(item);
          return configuredMode === "generate";
        })
        .map((item) => ({
          sectionId: section.sectionId || section.key,
          itemId: item.itemId || item.key,
          label: item.label,
          inputPath: item.inputPath,
          mode: imageGenerationMode?.[section.sectionId || section.key]?.[item.itemId || item.key] || defaultImageGenerationMode(item),
        }))
    ),
    governance: schema?.governance || {},
    promotionInputSchema: schema?.promotionInputSchema || {},
    templateForm: schema?.templateForm || {},
    generationRules: schema?.generationRules || {},
    validationRules: schema?.validationRules || {},
    progress: schema?.progress || {},
  };
}

// Market is visual guidance, not visible copy, to avoid accidental region labels in generated designs.
function marketVisualGuidanceFor(market) {
  const value = String(market || "").trim();
  const normalized = value.toLowerCase();
  const base = {
    market: value,
    primaryUse: "image_generation",
    textCopyInfluence: "low",
    visualInfluence: value ? "medium_high" : "neutral",
    instruction: value
      ? "Use the selected market as subtle visual localization context for mood, audience relevance, environment, and compliance sensitivity. Do not render the market name as a visible UI label unless it is part of user-facing promo copy."
      : "Use neutral global promotional web UI visuals without region-specific cues.",
    avoid: [
      "flag-heavy compositions",
      "map graphics",
      "stereotyped cultural symbols",
      "traditional costume clichés",
      "visible market labels used as annotations",
    ],
  };

  if (/brazil/.test(normalized)) {
    return {
      ...base,
      visualMood: "warm, energetic, social, mobile-friendly, subtly relevant to Brazil/Latam audiences",
      avoid: [...base.avoid, "carnival stereotypes", "Brazil flag collage"],
    };
  }
  if (/latam|latin/.test(normalized)) {
    return {
      ...base,
      visualMood: "warm, dynamic, social, accessible, subtly relevant to Latam audiences",
      avoid: [...base.avoid, "generic Latin festival stereotypes"],
    };
  }
  if (/europe|germany|united kingdom|canada ontario|french/.test(normalized)) {
    return {
      ...base,
      visualMood: "restrained, premium, regulation-aware, clean, trust-forward",
      avoid: [...base.avoid, "EU flag collage", "literal landmark montage"],
    };
  }
  if (/global/.test(normalized)) {
    return {
      ...base,
      visualMood: "international, neutral, broad-audience, non-region-specific",
    };
  }
  return {
    ...base,
    visualMood: value ? `subtly localized for ${value} without literal labels or stereotypes` : "neutral global",
  };
}

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
      { title: "", description: "", ctaLabel: "", link: "", target: "_blank" },
      { title: "", description: "", ctaLabel: "", link: "", target: "_blank" },
      { title: "", description: "", ctaLabel: "", link: "", target: "_blank" },
    ],
    contentCta: {
      title: "",
      longText: "",
      imageText: "",
      cta: { label: "", link: "", target: "_blank" },
      visualMode: "auto",
    },
    imageTextRow: [
      { imageText: "", title: "", description: "", visualMode: "auto" },
    ],
    titleDescription: {
      title: "이용약관",
      contents: "",
    },
    footer: {
      logoText: "GGPoker",
      licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
      content: "",
    },
  };
}

function createDefaultTempPdfAutoFill() {
  const cta = {
    label: "Qualify on GGPoker",
    link: "https://www.ggpoker.com/promotions/",
    target: "_blank",
  };
  const terms = [
    "Players must be aged 18+ to participate in all GGPoker promotions.",
    "GGPoker's game currency is USD ($). Other currencies, such as GBP (£), are only used for illustrative purposes and subject to currency exchange rate fluctuations.",
    "Please note that prize pools and jackpot guarantees are subject to change and some amounts listed on this website may not be current; please check the guarantee amounts listed in the tournament lobby of the GGPoker app for up-to-date prize pool information.",
    "Welcome Bonus promotion for new players is available for 90 days.",
    "Honeymoon promotion for new players is available for 30 days.",
    "If any players fall under suspicion of fraudulent activity, GGPoker has the right to investigate and remove the players once it's confirmed.",
    "The promotion terms and conditions are subject to the site terms and conditions, which can be found here.",
    "GGPoker reserves the right to modify or suspend the promotion at any time.",
    "GGPoker standard rules apply.",
  ].join("\n");
  const footerContent = [
    "Disclaimer: GG International Limited, trading as GGPoker; is regulated by the Isle of Man Gambling Supervision Commission under a Licence issued under the Online Gambling Regulations Act 2001 on 15 October 2020. Registered address is The Hubb, Queen Victoria House, Victoria Street, Douglas, IM1 2LF, Isle of Man.",
    "All debts are enforceable in Law on the Isle of Man. GG International Limited strictly prohibits access and services to those under the legal age of Eighteen (18). Customers should check the laws and regulations in their own country and comply with them. Information on this website is subject to change without notice. GGPoker | © 2018 - 2026",
    "Please play responsibly.",
  ].join("\n");

  return {
    promo: {
      title: "LIVE EVENTS GOT BIGGER!",
      template: "default_temp",
      promotionPurpose: "이벤트",
      promotionPurposeOther: "",
      market: "United Kingdom",
      leadText: "For GGPoker Qualifiers",
      subline: "Not on GGPoker? You're missing up to 20% live event cashes.",
      alphaText: "18+. Cash boost paid in C$ (cash game credit). Selected Main Events only. Entry via GGPoker only (qualify or buy-in direct). T&Cs apply. GambleAware.org. Please play responsibly.",
      ctaLabel: cta.label,
      ctaUrl: cta.link,
      termsText: terms,
    },
    simpleBrief: {
      mainOffer: "You're missing up to 20% live event cashes",
      targetAction: "Qualify or buy-in online for Grosvenor live poker events via GGPoker",
      audience: "기존고객",
      campaignTone: "활기찬",
      secondaryMessage: "Get more value on live event cashes and qualify online for the biggest UK poker tournaments.",
    },
    sectionInputs: {
      header: {
        logoText: "GGPoker logo",
        badgeText: "World Series of Poker official partner badges, Best Poker Software 2021, world's biggest poker room",
      },
      heroBanner: {
        leaderText: "For GGPoker Qualifiers",
        title: "LIVE EVENTS GOT BIGGER!",
        sublineText: "Not on GGPoker? You're missing up to 20% live event cashes.",
        cta,
        alphaText: "18+. Cash boost paid in C$ (cash game credit). Selected Main Events only. Entry via GGPoker only (qualify or buy-in direct). T&Cs apply. GambleAware.org. Please play responsibly.",
        visualMode: "auto",
      },
      stepBar: [
        {
          title: "QUALIFY OR BUY-IN ONLINE",
          description: "Enter Grosvenor live poker events via GGPoker",
          ctaLabel: "Qualify on GGPOKER",
          link: cta.link,
          target: "_blank",
        },
      ],
      contentCta: {
        title: "Get up to 20% MORE on live event cashes - only via GGPoker.",
        longText: [
          "Qualify or buy-in online for the biggest UK poker tournaments - including the iconic Goliath, GUKPT and G200 & G300 - and get more value on your cash finishes. Exclusive to GGPoker Players.",
          "The path to Goliath is LIVE. Satellites run Sunday to Friday from just £1 - bag your seat to the biggest poker event outside of Vegas!",
          "G200 & G300 qualifiers are also available, with G200 Round 11 next in Newcastle, Blackpool & Walsall (14-19 July) and G300 London at The Victoria (15-20 Sep).",
          "Get MORE with GGPoker",
        ].join("\n"),
        imageText: "[이미지 컨텐츠]",
        cta,
        visualMode: "auto",
      },
      imageTextRow: [
        {
          imageText: "[이미지 컨텐츠]",
          title: "Your Safety Comes First",
          description: "The most advanced Security System in the Industry",
          visualMode: "auto",
        },
      ],
      titleDescription: {
        title: "Terms and Conditions",
        contents: terms,
      },
      footer: {
        logoText: "GGPoker logo",
        licenseBadges: "Visa, Mastercard, 18+, bmm testlabs, GamCare, BeGambleAware.org",
        content: footerContent,
      },
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
        ctaLabel: cta.label,
        link: cta.link,
        target: cta.target,
      },
      {
        title: "혜택 받기",
        description: offerText ? `혜택을 확인하세요: ${offerText}` : "캠페인 참여 조건을 확인하세요.",
        ctaLabel: cta.label,
        link: cta.link,
        target: cta.target,
      },
      {
        title: "플레이",
        description: secondary || "프로모션을 즐기기 전에 최종 조건을 확인하세요.",
        ctaLabel: cta.label,
        link: cta.link,
        target: cta.target,
      },
    ],
    contentCta: {
      title: title || "프로모션 안내",
      longText: secondary || `${offerText}. ${actionText}.${toneHint}`,
      imageText: offerText || title,
      cta,
      visualMode,
    },
    imageTextRow: [
      {
        imageText: actionText,
        title: actionText,
        description: secondary || terms || "프로모션 상세 내용을 확인한 뒤 CTA를 통해 참여하세요.",
        visualMode,
      },
    ],
    titleDescription: {
      title: "이용약관",
      contents: terms,
    },
    footer: {
      logoText: brand,
      licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
      content: terms,
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

function designStyleNameFromFileName(fileName) {
  const base = String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replace(/(?:-?design-?system|-?eng|-?kor)$/gi, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return base || "Untitled Design Style";
}

function safeParseJson(value, fallback = {}) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

const koreaDateTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function datePartsInKorea(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return koreaDateTimeFormatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
}

function formatKoreaDateTime(value = new Date()) {
  const parts = datePartsInKorea(value);
  if (!parts) return String(value || "");
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function nowText() {
  return formatKoreaDateTime(new Date());
}

function timestampStamp(value = new Date()) {
  const pad = (part) => String(part).padStart(2, "0");
  const textValue = String(value || "");
  const kstTextMatch = textValue.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (kstTextMatch) {
    const [, year, month, day, hour, minute] = kstTextMatch;
    return `${year.slice(-2)}${month}${day}${hour}${minute}`;
  }

  const parts = datePartsInKorea(value);
  if (!parts) return textValue.replace(/\D/g, "").slice(2, 12);
  return [
    String(parts.year).slice(-2),
    pad(parts.month),
    pad(parts.day),
    pad(parts.hour),
    pad(parts.minute),
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

function lofiDraftImageUrlForId(id) {
  return id ? `/api/promo-generation-lofi-draft-image?draftId=${encodeURIComponent(id)}` : "";
}

function finalDesignImageUrlForId(id) {
  return id ? `/api/promo-generation-final-design-image?finalDesignId=${encodeURIComponent(id)}` : "";
}

function isInvalidGeneratedImageAsset(asset) {
  if (!asset || asset.asset_type !== "generated_image") return false;
  const fileSize = Number(asset.file_size || 0);
  const mimeType = String(asset.mime_type || "").toLowerCase();
  return fileSize > 0 && (fileSize < 1024 || !mimeType.startsWith("image/"));
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

function generationPollingState(run) {
  const stage = String(run?.stage || "");
  const status = String(run?.status || "");
  const limitMs = generationStageStaleLimitsMs[stage] || 0;
  const updatedAt = run?.updatedAt || run?.updated_at || "";
  const updatedTime = updatedAt ? new Date(updatedAt).getTime() : 0;
  const ageMs = updatedTime ? Math.max(0, Date.now() - updatedTime) : 0;
  const isActive = /queued|generating|running|pending|accepted/i.test(status);
  const isStale = Boolean(limitMs && isActive && ageMs > limitMs);
  return {
    stage,
    status,
    ageMs,
    staleLimitMs: limitMs,
    isActive,
    isStale,
    staleMessage: isStale
      ? "작업이 예상보다 오래 걸리고 있습니다. Worker 상태를 확인하거나 현재 단계를 다시 시도해 주세요."
      : "",
  };
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

function createDoc({ id, brandId, brandName, slug, markdown, sourceName, designTokenFileName = "", designTokensJson = {}, status, updatedAt }) {
  const summary = extractSummary(markdown);
  return {
    id,
    brandId,
    brandName,
    designStyleName: brandName,
    slug,
    sourceName,
    designTokenFileName,
    designTokensJson,
    rawDesignTokens: designTokensJson,
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
  const colors = Array.isArray(doc?.summary?.colors) ? doc.summary.colors : [];
  const fonts = Array.isArray(doc?.summary?.fonts) ? doc.summary.fonts : [];
  const primary = colors[0] || "#d52b1e";
  return {
    primaryColor: primary,
    ctaColor: colors[1] || primary,
    canvasColor: colors[2] || "#f3f3f3",
    headingFont: fonts[0] || "Pretendard, Arial, sans-serif",
    bodyFont: fonts[1] || fonts[0] || "Pretendard, Arial, sans-serif",
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
const initialSearchParams = new URLSearchParams(window.location.search);
const initialView = initialSearchParams.get("view") === "admin" ? "prompts" : "builder";
const requestedAdminTab = initialSearchParams.get("tab");
const initialAdminTab = ["webhook", "llm", "components", "promo-form", "design-tokens", "i18n", "audit"].includes(requestedAdminTab)
  ? requestedAdminTab
  : "promo-form";

const adminApp = createApp({
  data() {
    return {
      status: "준비 완료",
      localeRevision: 0,
      localeUnsubscribe: null,
      currentView: initialView,
      adminTab: initialAdminTab,
      sectionWidths: [30, 30, 40],
      resizeState: null,
      adminSectionWidths: [50, 50],
      adminResizeState: null,
      designDocuments: [],
      mdListSource: "불러오는 중",
      validationErrors: {},
      handoffDocuments: [],
      selectedHandoffFile: "",
      handoffMarkdown: "",
      handoffLoading: false,
      handoffError: "",
      activeHandoffDocument: null,
      expandedStyleGroupSlug: "",
      selectedStyleGroupSlug: "",
      activeDesignTokenSectionKey: "color",
      styleGroupSearch: "",
      companyStylePresets: dummyCompanyStylePresets,
      selectedDocumentId: localStorage.getItem(storageKeys.selectedDocumentId) || "",
      themeMode: localStorage.getItem(storageKeys.themeMode) || "light",
      selectedPresetId: "preset-001",
      styleSource: "design_md",
      templateSchema: temp4TemplateSchema,
      sectionConfig: createDefaultSectionConfig(temp4TemplateSchema),
      designMode: "ai",
      generationMode: "ai_agent",
      inputMode: "simple",
      globalVisualMode: "auto",
      promoBuilderStarted: false,
      promoBuilderModalOpen: false,
      promoBuilderSessionKey: 0,
      currentBuilderStep: 1,
      isGeneratingDesign: false,
      generationStatusIndex: 0,
      generationStatusTimer: null,
      detailDoc: null,
      selectedDesignDetail: null,
      promptModalPage: null,
      promptModalLoading: false,
      promptModalError: "",
      promptModalDesignMarkdown: "",
      promptModalIntegratedMarkdown: "",
      promptModalPromoMarkdown: "",
      promptTemplates: [],
      promptTemplatesLoading: false,
      promptTemplatesError: "",
      selectedPromptTemplateId: "",
      promptTypeFilter: "",
      promptSaving: false,
      promptHistories: [],
      locales: [],
      localesLoading: false,
      localeMessages: [],
      localeMessagesByLocale: {},
      localeMessagesLoading: false,
      localeManagerError: "",
      selectedLocaleCode: "ko",
      selectedLocaleNamespace: "",
      selectedLocaleMessageKey: "",
      selectedLocaleMessageIds: [],
      localeMessageEditor: { value: "", changeNote: "" },
      localeMessageHistory: [],
      newLocaleEditor: { code: "", label: "" },
      showNewLocaleForm: false,
      localeManagerSaving: false,
      workerWebhookSettings: [],
      workerWebhookSettingsLoading: false,
      workerWebhookSettingsError: "",
      workerWebhookSavingStage: "",
      workerWebhookEditors: {},
      itemComponents: [],
      itemComponentsLoading: false,
      itemComponentsError: "",
      selectedItemComponentId: "",
      itemComponentSaving: false,
      showNewItemComponentForm: false,
      itemComponentEditor: {
        name: "", description: "", fieldKind: "text", textType: "title",
        imagePolicy: { allowedSources: ["file", "url"], promptText: "", aspectRatio: "" },
        capabilities: { layoutRegions: ["copy-primary", "copy-secondary", "center"] },
        styleSlots: [], changeNote: "",
        fields: [{
          name: "Title", fieldKind: "text", textType: "title", sortOrder: 0,
          isRequired: false, isLocked: false, defaultValue: null,
          editorSchema: { multiline: true }, capabilities: {}, imagePolicy: {},
          ctaPolicy: {}, styleSlots: [],
        }],
      },
      designTokenSets: [],
      designTokenSetsLoading: false,
      wizardFormTemplates: [],
      wizardFormTemplatesLoading: false,
      wizardFormTemplatesError: "",
      wizardFormTemplateSaving: false,
      selectedWizardFormTemplateKey: "",
      expandedWizardFormTemplateSettingsKey: "",
      wizardFormTemplateDetail: null,
      wizardFormTemplateEditor: { name: "", description: "", isDefault: false, designTokenSetVersionId: "", changeNote: "" },
      showNewWizardFormTemplateForm: false,
      newWizardFormTemplateForm: { name: "", description: "", designTokenSetVersionId: "" },
      showDuplicateWizardFormTemplateForm: false,
      duplicateWizardFormTemplateForm: { sourceId: "", name: "", description: "" },
      duplicateWizardFormTemplateError: "",
      selectedWizardFormTemplateSectionId: "",
      expandedWizardFormTemplateSectionId: "",
      wizardFormTemplateSectionEditor: {
        name: "", description: "", isRequired: false, isVisible: true, userReorderAllowed: true, fixedPosition: "",
        aiDesign: {
          enabled: true,
          allowedLayoutVariants: ["split-left", "split-right", "centered-hero"],
          allowSectionBackground: true,
          imageTarget: "section-background",
          imageTargetItemKeys: [],
          imageAspectRatio: "16:9",
          backgroundPromptText: "",
        },
      },
      wizardFormTemplateSectionSaving: false,
      showNewWizardFormTemplateSectionForm: false,
      newWizardFormTemplateSectionForm: { sectionId: "" },
      wizardFormTemplateSectionItems: [],
      wizardFormTemplateSectionItemsLoading: false,
      wizardFormTemplateItemEditorOpenId: "",
      wizardFormTemplateItemEditor: null,
      draggedWizardFormTemplateItemId: "",
      wizardFormTemplateItemDropTargetId: "",
      wizardFormTemplateItemDropPosition: "",
      draggedWizardFormTemplateSectionKey: "",
      wizardFormTemplateSectionDropTargetKey: "",
      wizardFormTemplateSectionDropPosition: "",
      wizardSections: [],
      wizardSectionAuditLogs: [],
      wizardSectionAuditLoading: false,
      wizardSectionAuditError: "",
      wizardSectionAuditFilters: { templateKey: "", action: "" },
      wizardSectionsLoading: false,
      wizardSectionsError: "",
      wizardSectionSaving: false,
      wizardSectionOrderSaving: false,
      draggedWizardSectionKey: "",
      wizardSectionDropTargetKey: "",
      wizardSectionDropPosition: "",
      selectedWizardSectionKey: "",
      wizardSectionDetail: null,
      wizardSectionDetailLoading: false,
      wizardSectionUsage: [],
      wizardSectionUsageLoading: false,
      wizardSectionFieldsEditor: {
        name: "",
        description: "",
        isRequired: false,
        orderChangeAllowed: true,
        fixedPosition: "",
        isVisibleInWizard: true,
        aiDesign: {
          enabled: true,
          allowedLayoutVariants: ["split-left", "split-right", "centered-hero"],
          allowSectionBackground: true,
          imageTarget: "section-background",
          imageTargetItemKeys: [],
          imageAspectRatio: "16:9",
          backgroundPromptText: "",
        },
        changeNote: "",
      },
      showNewWizardSectionForm: false,
      newWizardSectionForm: { sectionKey: "", name: "", description: "" },
      wizardItemEditorOpenId: "",
      wizardItemEditor: {
        id: "",
        componentVersionId: "",
        itemKey: "",
        name: "",
        isVisibleInWizard: true,
        isRequired: false,
        sortOrder: 0,
        fieldKind: "text",
        textType: "title",
        image: { allowedSources: [], promptText: "", descriptionEnabled: false, altTextRequired: false, aspectRatio: "", maxSizeKb: "" },
        ctaUtm: { source: "", medium: "", campaign: "", content: "", term: "" },
        isLocked: false,
        lockedValueText: "",
      },
      promptEditor: {
        name: "",
        body: "",
        requiredVariablesText: "",
        optionalVariablesText: "",
        provider: "",
        model: "",
        temperature: "",
        maxTokens: "",
        responseFormat: "",
        imageSize: "2K",
        modelOptionsText: "{}",
        changeNote: "",
      },
      modalTab: "outline",
      newMd: {
        id: "",
        designStyleName: "",
        brandName: "",
        slug: "",
        text: "",
        sourceName: "",
        tokenText: "",
        tokenFileName: "",
      },
      promo: {
        title: "",
        template: "AI Auto",
        promotionPurpose: "",
        promotionPurposeOther: "",
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
      sectionInputsDirty: false,
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
      generationRunPollingTimer: null,
    };
  },

  computed: {
    // Layout state keeps the three-column prototype adjustable without coupling it to builder logic.
    abcGridStyle() {
      return {
        gridTemplateColumns: `${this.sectionWidths[0]}fr 8px ${this.sectionWidths[1]}fr 8px ${this.sectionWidths[2]}fr`,
      };
    },

    adminGridStyle() {
      return {
        gridTemplateColumns: `${this.adminSectionWidths[0]}fr 8px ${this.adminSectionWidths[1]}fr`,
      };
    },

    // A section: selected Design MD and normalized token display.
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
        { key: "color", label: "Colors", rows: this.normalizedTokenRows(doc, "color"), open: this.activeDesignTokenSectionKey === "color" },
        { key: "typography", label: "Typography", rows: this.normalizedTokenRows(doc, "typography"), open: this.activeDesignTokenSectionKey === "typography" },
        { key: "radius", label: "Radius", rows: this.normalizedTokenRows(doc, "radius"), open: this.activeDesignTokenSectionKey === "radius" },
        { key: "spacing", label: "Spacing", rows: this.normalizedTokenRows(doc, "spacing"), open: this.activeDesignTokenSectionKey === "spacing" },
        { key: "elevation", label: "Elevation", rows: this.normalizedTokenRows(doc, "elevation"), open: this.activeDesignTokenSectionKey === "elevation" },
        { key: "breakpoint", label: "Breakpoints", rows: this.normalizedTokenRows(doc, "breakpoint"), open: this.activeDesignTokenSectionKey === "breakpoint" },
        { key: "component", label: "Components", rows: this.patternRows(doc, "component"), open: this.activeDesignTokenSectionKey === "component" },
        { key: "layout", label: "Layouts", rows: this.patternRows(doc, "layout"), open: this.activeDesignTokenSectionKey === "layout" },
        { key: "guideline", label: "Guidelines", rows: this.guidelineRows(doc), open: this.activeDesignTokenSectionKey === "guideline" },
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

    // B section: builder stepper and generation-status copy.
    designModeLabel() {
      return this.designMode === "advanced"
        ? "고급 모드 / Default Temp"
        : "AI 모드 / 디자인 토큰 기반 자동 구성";
    },

    builderSteps() {
      return [
        { step: 1, title: "디자인 모드 선택", summary: "AI 모드, 고급 모드, 마켓" },
        { step: 2, title: "프로모션 입력 및 섹션 구성", summary: "개요, 섹션/아이템" },
        { step: 3, title: "디자인 생성", summary: "n8n 실행" },
      ];
    },

    currentBuilderStepInfo() {
      return this.builderSteps.find((item) => item.step === this.currentBuilderStep) || this.builderSteps[0];
    },

    generationStatusMessage() {
      const messages = [
        "AI가 요청 사항을 접수하고 있어요",
        "디자인 브리프를 정리하고 있어요",
        "프로모션 섹션을 조합하고 있어요",
        "UI 디자인 이미지를 생성하고 있어요",
        "결과를 저장하고 있어요",
      ];
      return messages[this.generationStatusIndex % messages.length];
    },

    sectionConfigSections() {
      const sections = templateSections(this.templateSchema);
      const byId = new Map(sections.map((section) => [section.sectionId || section.key, section]));
      const orderedIds = Array.isArray(this.sectionConfig.orderedSections) && this.sectionConfig.orderedSections.length
        ? this.sectionConfig.orderedSections
        : sections.map((section) => section.sectionId || section.key);
      return orderedIds
        .map((sectionId) => byId.get(sectionId))
        .filter(Boolean)
        .map((section) => {
          const sectionId = section.sectionId || section.key;
          return {
            ...section,
            sectionId,
            visible: this.sectionConfig.sectionVisibility?.[sectionId] !== false,
            items: (section.items || []).map((item) => {
              const itemId = item.itemId || item.key;
              return {
                ...item,
                itemId,
                visible: this.sectionConfig.itemVisibility?.[sectionId]?.[itemId] !== false,
                imageGenerationMode: this.sectionConfig.imageGenerationMode?.[sectionId]?.[itemId] || defaultImageGenerationMode(item),
              };
            }),
          };
        });
    },

    filteredPromptTemplates() {
      if (!this.promptTypeFilter) return this.promptTemplates;
      return this.promptTemplates.filter((prompt) => prompt.type === this.promptTypeFilter);
    },

    localeNamespaces() {
      const messages = Object.values(this.localeMessagesByLocale).flat();
      return [...new Set(messages.map((message) => message.namespace).filter(Boolean))].sort();
    },

    localeMessageRows() {
      const messagesByLocale = this.localeMessagesByLocale;
      const groupByKey = (messages = []) => {
        const grouped = new Map();
        messages.forEach((message) => {
          if (!grouped.has(message.messageKey)) grouped.set(message.messageKey, []);
          grouped.get(message.messageKey).push(message);
        });
        return grouped;
      };
      const selectedByKey = groupByKey(messagesByLocale[this.selectedLocaleCode] || this.localeMessages);
      const koByKey = groupByKey(messagesByLocale.ko);
      const enByKey = groupByKey(messagesByLocale.en);
      const messageKeys = new Set([...selectedByKey.keys(), ...koByKey.keys(), ...enByKey.keys()]);
      const summarize = (versions = []) => {
        const sorted = [...versions].sort((a, b) => b.version - a.version);
        const draft = sorted.find((version) => version.status === "draft") || null;
        const active = sorted.find((version) => version.status === "active") || null;
        return { draft, active, current: draft || active || sorted[0] || null };
      };
      return [...messageKeys].map((messageKey) => {
        const selected = summarize(selectedByKey.get(messageKey));
        const ko = summarize(koByKey.get(messageKey));
        const en = summarize(enByKey.get(messageKey));
        return {
          messageKey,
          namespace: selected.current?.namespace || ko.current?.namespace || en.current?.namespace || "",
          ...selected,
          koValue: ko.current?.value || "",
          enValue: en.current?.value || "",
        };
      }).sort((a, b) => a.messageKey.localeCompare(b.messageKey));
    },

    selectedLocaleMessageRow() {
      return this.localeMessageRows.find((row) => row.messageKey === this.selectedLocaleMessageKey) || null;
    },

    selectedLocaleDraftIds() {
      const selected = new Set(this.selectedLocaleMessageIds);
      return this.localeMessageRows.filter((row) => selected.has(row.messageKey) && row.draft).map((row) => row.draft.id);
    },

    localeTranslationProgress() {
      const total = this.localeMessageRows.length;
      const translated = this.localeMessageRows.filter((row) => String(row.active?.value || "").trim()).length;
      return { total, translated, percent: total ? Math.round((translated / total) * 100) : 0 };
    },

    selectedPromptTemplate() {
      return this.promptTemplates.find((prompt) => prompt.id === this.selectedPromptTemplateId) || null;
    },

    promptEditorReadOnly() {
      return this.selectedPromptTemplate?.status !== "draft";
    },

    selectedPromptEditorTitle() {
      if (!this.selectedPromptTemplate) return "프롬프트 편집기";
      return `${this.promptTypeLabel(this.selectedPromptTemplate.type)} 프롬프트`;
    },

    groupedWizardFormTemplates() {
      const groups = new Map();
      this.wizardFormTemplates.forEach((template) => {
        if (!groups.has(template.templateKey)) {
          groups.set(template.templateKey, { templateKey: template.templateKey, versions: [] });
        }
        groups.get(template.templateKey).versions.push(template);
      });
      return Array.from(groups.values())
        .map((group) => {
          const versions = [...group.versions].sort((a, b) => b.version - a.version);
          const draft = versions.find((version) => version.status === "draft") || null;
          const active = versions.find((version) => version.status === "active") || null;
          const inactive = versions.find((version) => version.status === "inactive") || null;
          const primary = draft
            || active
            || inactive
            || versions[0];
          return { ...group, versions, primary, draft, active, inactive };
        })
        .sort((a, b) => Number(Boolean(b.active?.isDefault || b.primary?.isDefault)) - Number(Boolean(a.active?.isDefault || a.primary?.isDefault))
          || String(a.primary?.name || "").localeCompare(String(b.primary?.name || "")));
    },

    selectedWizardFormTemplateGroup() {
      return this.groupedWizardFormTemplates.find((group) => group.templateKey === this.selectedWizardFormTemplateKey) || null;
    },

    selectedWizardFormTemplateHasDraft() {
      return Boolean(this.selectedWizardFormTemplateGroup?.versions.some((version) => version.status === "draft"));
    },

    wizardFormTemplateCanEdit() {
      return this.wizardFormTemplateDetail?.template?.status === "draft";
    },

    selectedWizardFormTemplateSection() {
      return this.wizardFormTemplateDetail?.sections?.find(
        (section) => section.id === this.selectedWizardFormTemplateSectionId
      ) || null;
    },

    selectedWizardFormTemplateSectionSource() {
      const sectionKey = this.selectedWizardFormTemplateSection?.sectionKey;
      if (!sectionKey) return null;
      const group = this.groupedWizardSections.find((item) => item.sectionKey === sectionKey);
      return group?.versions.find((version) => version.status === "active") || null;
    },

    availableWizardSectionsForTemplate() {
      const includedSectionKeys = new Set((this.wizardFormTemplateDetail?.sections || []).map((section) => section.sectionKey));
      return this.groupedWizardSections
        .filter((group) => group.versions.some((version) => version.status === "active"))
        .filter((group) => !includedSectionKeys.has(group.sectionKey));
    },

    wizardSectionsForCurrentTemplate() {
      const groupsByKey = new Map(this.groupedWizardSections.map((group) => [group.sectionKey, group]));
      return (this.wizardFormTemplateDetail?.sections || []).flatMap((membership) => {
        const group = groupsByKey.get(membership.sectionKey);
        return group ? [{ ...group, templateMembership: membership }] : [];
      });
    },

    activeItemComponents() {
      return this.itemComponents.flatMap((component) => {
        if (component.status !== "active") return [];
        const activeVersion = component.activeVersion || (
          component.versionStatus === "active"
            ? {
              id: component.versionId,
              version: component.version,
              status: component.versionStatus,
              fieldKind: component.fieldKind,
              textType: component.textType,
            }
            : null
        );
        if (!activeVersion?.id || activeVersion.status !== "active") return [];
        return [{
          ...component,
          versionId: activeVersion.id,
          version: activeVersion.version,
          versionStatus: activeVersion.status,
          fieldKind: activeVersion.fieldKind,
          textType: activeVersion.textType,
          fields: activeVersion.fields || [],
        }];
      });
    },

    selectedItemComponent() {
      return this.itemComponents.find((component) => component.id === this.selectedItemComponentId) || null;
    },

    // Wizard Content Sections: group the flat draft/active/inactive/archived
    // rows returned by the API by sectionKey, so the list shows one entry per
    // logical section with its versions available underneath.
    groupedWizardSections() {
      const groups = new Map();
      this.wizardSections.forEach((section) => {
        if (!groups.has(section.sectionKey)) {
          groups.set(section.sectionKey, { sectionKey: section.sectionKey, versions: [] });
        }
        groups.get(section.sectionKey).versions.push(section);
      });
      return Array.from(groups.values())
        .map((group) => {
          const versions = [...group.versions].sort((a, b) => b.version - a.version);
          const primary = versions.find((version) => version.status === "active")
            || versions.find((version) => version.status === "draft")
            || versions[0];
          return { ...group, versions, primary };
        })
        .sort((a, b) => (a.primary?.sortOrder ?? 0) - (b.primary?.sortOrder ?? 0));
    },

    selectedWizardGroup() {
      return this.groupedWizardSections.find((group) => group.sectionKey === this.selectedWizardSectionKey) || null;
    },

    selectedWizardSectionHasDraft() {
      return Boolean(this.selectedWizardGroup?.versions.some((version) => version.status === "draft"));
    },
  },

  watch: {
    // Keep derived builder state in sync with user-facing mode changes.
    styleSource() {
      this.resetOverride();
    },
    selectedPresetId() {
      if (this.styleSource === "company_default") this.resetOverride();
    },
    selectedDocumentId() {
      this.activeDesignTokenSectionKey = "color";
      if (this.styleSource === "design_md") this.resetOverride();
    },
    designMode() {
      this.generationMode = this.designMode === "advanced" ? "template_advanced" : "ai_agent";
      this.inputMode = this.designMode === "advanced" ? "advanced" : "simple";
      this.promo.template = this.designMode === "advanced" ? "default_temp" : "AI Auto";
    },
    promo: {
      deep: true,
      handler() {
        this.clearResolvedValidationErrors();
      },
    },
    simpleBrief: {
      deep: true,
      handler() {
        this.clearResolvedValidationErrors();
      },
    },
  },

  mounted() {
    this.localeUnsubscribe = window.PromoI18n?.subscribe(() => {
      this.localeRevision += 1;
    }) || null;
    localStorage.removeItem(storageKeys.generatedPages);
    localStorage.removeItem(storageKeys.generatedPage);
    this.applyThemeMode();
    this.loadDesignDocuments();
    this.loadGeneratedPagesFromServer({ silent: true });
    this.loadHandoffDocuments();
    this.resetOverride();
    if (this.currentView === "prompts") this.openPromptManager();
  },

  unmounted() {
    if (this.localeUnsubscribe) this.localeUnsubscribe();
    this.stopGenerationRunPolling();
  },

  methods: {
    t(key, params = {}) {
      void this.localeRevision;
      return window.PromoI18n?.t(key, params) || key;
    },

    async localeApi(url, options = {}) {
      const response = await fetch(url, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.error || `언어 관리 요청 오류(${response.status})`);
      return result;
    },

    async loadLocales() {
      if (this.localesLoading) return;
      this.localesLoading = true;
      this.localeManagerError = "";
      try {
        const result = await this.localeApi("/api/locales?includeDisabled=true");
        this.locales = result.locales || [];
        if (!this.locales.some((locale) => locale.code === this.selectedLocaleCode)) {
          this.selectedLocaleCode = this.locales.find((locale) => locale.isDefault)?.code || this.locales[0]?.code || "ko";
        }
        await this.loadLocaleMessages();
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localesLoading = false;
      }
    },

    async loadLocaleMessages() {
      if (!this.selectedLocaleCode || this.localeMessagesLoading) return;
      this.localeMessagesLoading = true;
      this.localeManagerError = "";
      try {
        const localeCodes = [...new Set([this.selectedLocaleCode, "ko", "en"])];
        const results = await Promise.all(localeCodes.map(async (locale) => {
          const query = new URLSearchParams({ locale });
          if (this.selectedLocaleNamespace) query.set("namespace", this.selectedLocaleNamespace);
          const result = await this.localeApi(`/api/locale-messages?${query}`);
          return [locale, result.messages || []];
        }));
        this.localeMessagesByLocale = { ...this.localeMessagesByLocale, ...Object.fromEntries(results) };
        this.localeMessages = this.localeMessagesByLocale[this.selectedLocaleCode] || [];
        this.selectedLocaleMessageIds = this.selectedLocaleMessageIds.filter((key) => this.localeMessageRows.some((row) => row.messageKey === key));
        if (this.selectedLocaleMessageKey && !this.localeMessageRows.some((row) => row.messageKey === this.selectedLocaleMessageKey)) {
          this.selectedLocaleMessageKey = "";
          this.localeMessageHistory = [];
        }
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeMessagesLoading = false;
      }
    },

    async changeManagedLocale() {
      this.selectedLocaleMessageIds = [];
      this.selectedLocaleMessageKey = "";
      this.localeMessageEditor = { value: "", changeNote: "" };
      this.localeMessageHistory = [];
      await this.loadLocaleMessages();
    },

    async selectLocaleMessage(row) {
      this.selectedLocaleMessageKey = row.messageKey;
      this.localeMessageEditor = { value: row.current?.value || "", changeNote: "" };
      await this.loadLocaleMessageHistory();
    },

    async loadLocaleMessageHistory() {
      if (!this.selectedLocaleMessageKey) return;
      try {
        const query = new URLSearchParams({ locale: this.selectedLocaleCode, messageKey: this.selectedLocaleMessageKey });
        const result = await this.localeApi(`/api/locale-message-history?${query}`);
        this.localeMessageHistory = result.versions || [];
      } catch (error) {
        this.localeManagerError = error.message;
      }
    },

    async saveLocaleMessageDraft() {
      if (!this.selectedLocaleMessageKey || this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locale-message", {
          method: "POST",
          body: JSON.stringify({
            locale: this.selectedLocaleCode,
            messageKey: this.selectedLocaleMessageKey,
            value: this.localeMessageEditor.value,
            changeNote: this.localeMessageEditor.changeNote,
            actor: "admin",
          }),
        });
        await this.loadLocaleMessages();
        const row = this.localeMessageRows.find((item) => item.messageKey === this.selectedLocaleMessageKey);
        if (row) await this.selectLocaleMessage(row);
        this.setStatus(this.t("admin.i18n.savedDraft"));
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async activateLocaleMessage(id) {
      if (!id || this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locale-message-activate", {
          method: "POST",
          body: JSON.stringify({ id, actor: "admin", changeNote: this.localeMessageEditor.changeNote }),
        });
        const reloadSnapshot = window.PromoI18n?.reloadSnapshot?.() || Promise.resolve();
        await Promise.all([this.loadLocaleMessages(), reloadSnapshot.catch(() => {})]);
        this.setStatus(this.t("admin.i18n.activated"));
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async activateSelectedLocaleMessages() {
      const ids = this.selectedLocaleDraftIds;
      if (!ids.length || this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locale-messages-activate", {
          method: "POST",
          body: JSON.stringify({ ids, actor: "admin", changeNote: "선택 문구 일괄 활성화" }),
        });
        this.selectedLocaleMessageIds = [];
        const reloadSnapshot = window.PromoI18n?.reloadSnapshot?.() || Promise.resolve();
        await Promise.all([this.loadLocaleMessages(), reloadSnapshot.catch(() => {})]);
        this.setStatus(this.t("admin.i18n.activatedCount", { count: ids.length }));
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async archiveLocaleMessage(id) {
      if (!id || this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locale-message-archive", {
          method: "POST",
          body: JSON.stringify({ id, actor: "admin", changeNote: this.localeMessageEditor.changeNote }),
        });
        await this.loadLocaleMessages();
        this.setStatus(this.t("admin.i18n.archived"));
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async rollbackLocaleMessage(id) {
      if (!id || this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locale-message-rollback", {
          method: "POST",
          body: JSON.stringify({ id, actor: "admin", changeNote: "과거 버전으로 새 초안 생성" }),
        });
        await this.loadLocaleMessages();
        this.setStatus(this.t("admin.i18n.rollbackCreated"));
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async createManagedLocale() {
      if (this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        const result = await this.localeApi("/api/locales", {
          method: "POST",
          body: JSON.stringify(this.newLocaleEditor),
        });
        this.newLocaleEditor = { code: "", label: "" };
        this.showNewLocaleForm = false;
        this.selectedLocaleCode = result.locale.code;
        await this.loadLocales();
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async updateManagedLocale(locale, changes) {
      if (this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locales", {
          method: "PATCH",
          body: JSON.stringify({ code: locale.code, ...changes }),
        });
        await this.loadLocales();
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async setManagedDefaultLocale(code) {
      if (this.localeManagerSaving) return;
      this.localeManagerSaving = true;
      try {
        await this.localeApi("/api/locale-default", { method: "POST", body: JSON.stringify({ code }) });
        await this.loadLocales();
        const reloadSnapshot = window.PromoI18n?.reloadSnapshot?.() || Promise.resolve();
        await reloadSnapshot.catch(() => {});
      } catch (error) {
        this.localeManagerError = error.message;
      } finally {
        this.localeManagerSaving = false;
      }
    },

    async applyManagedLocale() {
      await window.PromoI18n?.setLocale?.(this.selectedLocaleCode);
      this.setStatus(`${this.selectedLocaleCode} 언어를 현재 화면에 적용했습니다`);
    },

    localeStatusLabel(status) {
      const key = { active: "common.state.active", inactive: "common.state.inactive", draft: "common.state.draft", archived: "common.state.archived" }[status];
      return key ? this.t(key) : status;
    },

    formatLocaleDate(value) {
      if (!value) return "-";
      return new Intl.DateTimeFormat(this.selectedLocaleCode || "ko", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
    },

    // Theme module: persist the selected color mode because this prototype is often reopened during QA.
    applyThemeMode() {
      document.documentElement.setAttribute("data-theme", this.themeMode === "dark" ? "dark" : "light");
      localStorage.setItem(storageKeys.themeMode, this.themeMode);
    },

    toggleThemeMode() {
      this.themeMode = this.themeMode === "dark" ? "light" : "dark";
      this.applyThemeMode();
      this.setStatus(this.themeMode === "dark" ? "다크모드를 적용했습니다" : "라이트모드를 적용했습니다");
    },

    showBuilderPage() {
      this.currentView = "builder";
      const url = new URL(window.location.href);
      url.searchParams.delete("view");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      this.setStatus("프로모션 빌더로 이동했습니다");
    },

    async openPromptManager() {
      this.currentView = "prompts";
      const url = new URL(window.location.href);
      url.searchParams.set("view", "admin");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      await Promise.all([
        this.loadPromptTemplates(),
        this.loadWorkerWebhookSettings(),
        this.loadWizardFormTemplates(),
        this.loadWizardSections(),
        this.loadWizardSectionAuditLogs(),
        this.loadItemComponents(),
        this.loadDesignTokenSets(),
      ]);
      if (this.adminTab === "i18n") await this.loadLocales();
      this.setStatus("관리자 페이지로 이동했습니다");
    },

    selectAdminTab(tab) {
      if (!["webhook", "llm", "components", "promo-form", "design-tokens", "i18n", "audit"].includes(tab)) return;
      this.adminTab = tab;
      if (tab === "i18n") this.loadLocales();
      if (tab === "components") this.loadItemComponents();
      if (tab === "audit") this.loadWizardSectionAuditLogs();
      const url = new URL(window.location.href);
      url.searchParams.set("view", "admin");
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    },

    resetItemComponentEditor() {
      this.itemComponentEditor = {
        name: "", description: "", fieldKind: "text", textType: "title",
        editorSchema: { multiline: true }, defaultValue: null,
        imagePolicy: { allowedSources: ["file", "url"], promptText: "", aspectRatio: "" },
        capabilities: { layoutRegions: ["copy-primary", "copy-secondary", "center"] },
        styleSlots: [], changeNote: "",
        fields: [{
          name: "Title", fieldKind: "text", textType: "title", sortOrder: 0,
          isRequired: false, isLocked: false, defaultValue: null,
          editorSchema: { multiline: true }, capabilities: {}, imagePolicy: {},
          ctaPolicy: {}, styleSlots: [],
        }],
      };
    },

    async loadItemComponents() {
      if (this.itemComponentsLoading) return;
      this.itemComponentsLoading = true;
      this.itemComponentsError = "";
      try {
        const response = await fetch("/api/item-components?includeArchived=true");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 목록 요청 오류(${response.status})`);
        this.itemComponents = Array.isArray(result.components) ? result.components : [];
        if (!this.itemComponents.some((component) => component.id === this.selectedItemComponentId)) {
          this.selectedItemComponentId = this.itemComponents[0]?.id || "";
        }
      } catch (error) {
        this.itemComponentsError = error.message;
      } finally {
        this.itemComponentsLoading = false;
      }
    },

    selectItemComponent(component) {
      this.selectedItemComponentId = component.id;
      const componentFields = Array.isArray(component.fields) && component.fields.length
        ? component.fields
        : [{
          name: component.name || "Field",
          fieldKind: component.fieldKind || "text",
          textType: component.textType || "title",
          sortOrder: 0,
          isRequired: false,
          isLocked: false,
          defaultValue: component.defaultValue ?? null,
          editorSchema: component.editorSchema || {},
          capabilities: component.capabilities || {},
          imagePolicy: component.imagePolicy || {},
          ctaPolicy: {},
          styleSlots: component.styleSlots || [],
        }];
      this.itemComponentEditor = {
        name: component.name, description: component.description || "", fieldKind: component.fieldKind || "text",
        textType: component.textType || "title", editorSchema: component.editorSchema || {},
        defaultValue: component.defaultValue ?? null, imagePolicy: { ...(component.imagePolicy || {}) },
        capabilities: { ...(component.capabilities || {}) }, styleSlots: [...(component.styleSlots || [])], changeNote: "",
        fields: componentFields.map((field) => ({
          ...field,
          editorSchema: { ...(field.editorSchema || {}) },
          capabilities: { ...(field.capabilities || {}) },
          imagePolicy: {
            ...(field.imagePolicy || {}),
            allowedSources: [...(field.imagePolicy?.allowedSources || [])],
          },
          ctaPolicy: { ...(field.ctaPolicy || {}) },
          styleSlots: [...(field.styleSlots || [])],
        })),
      };
      this.showNewItemComponentForm = false;
    },

    openNewItemComponentForm() {
      this.selectedItemComponentId = "";
      this.resetItemComponentEditor();
      this.showNewItemComponentForm = true;
    },

    addItemComponentField() {
      const fields = this.itemComponentEditor.fields || (this.itemComponentEditor.fields = []);
      fields.push({
        name: `Field ${fields.length + 1}`, fieldKind: "text", textType: "title",
        sortOrder: fields.length * 10, isRequired: false, isLocked: false,
        defaultValue: null, editorSchema: { multiline: true }, capabilities: {},
        imagePolicy: { allowedSources: ["file", "url"], promptText: "", aspectRatio: "" },
        ctaPolicy: {}, styleSlots: [],
      });
    },

    removeItemComponentField(index) {
      if ((this.itemComponentEditor.fields || []).length <= 1) {
        this.setStatus("컴포넌트에는 요소가 하나 이상 필요합니다");
        return;
      }
      this.itemComponentEditor.fields.splice(index, 1);
      this.itemComponentEditor.fields.forEach((field, fieldIndex) => { field.sortOrder = fieldIndex * 10; });
    },

    duplicateItemComponentField(index) {
      const fields = this.itemComponentEditor.fields || [];
      const source = fields[index];
      if (!source) return;
      const duplicate = JSON.parse(JSON.stringify(source));
      delete duplicate.id;
      delete duplicate.fieldKey;
      duplicate.name = `${source.name || `Field ${index + 1}`} 복사본`;
      fields.splice(index + 1, 0, duplicate);
      fields.forEach((field, fieldIndex) => { field.sortOrder = fieldIndex * 10; });
    },

    moveItemComponentField(index, direction) {
      const fields = this.itemComponentEditor.fields || [];
      const targetIndex = index + direction;
      if (!fields[index] || targetIndex < 0 || targetIndex >= fields.length) return;
      const [field] = fields.splice(index, 1);
      fields.splice(targetIndex, 0, field);
      fields.forEach((item, fieldIndex) => { item.sortOrder = fieldIndex * 10; });
    },

    async saveNewItemComponent() {
      if (!this.itemComponentEditor.name || this.itemComponentSaving) return;
      this.itemComponentSaving = true;
      try {
        const response = await fetch("/api/item-components", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.itemComponentEditor),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 생성 오류(${response.status})`);
        this.showNewItemComponentForm = false;
        this.selectedItemComponentId = result.component.id;
        await this.loadItemComponents();
        this.setStatus("컴포넌트 초안을 생성했습니다");
      } catch (error) {
        this.setStatus(`컴포넌트 생성 실패: ${error.message}`);
      } finally {
        this.itemComponentSaving = false;
      }
    },

    async activateItemComponent(component) {
      if (!component?.versionId || this.itemComponentSaving) return;
      this.itemComponentSaving = true;
      try {
        const response = await fetch("/api/item-component-activate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ componentId: component.id, versionId: component.versionId, changeNote: "관리자 페이지에서 활성화" }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 활성화 오류(${response.status})`);
        await this.loadItemComponents();
        this.setStatus("컴포넌트 버전을 활성화했습니다");
      } catch (error) {
        this.setStatus(`컴포넌트 활성화 실패: ${error.message}`);
      } finally {
        this.itemComponentSaving = false;
      }
    },

    async createItemComponentDraft(component) {
      if (!component?.id || this.itemComponentSaving) return;
      this.itemComponentSaving = true;
      try {
        const response = await fetch("/api/item-component-draft", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ componentId: component.id, changeNote: "관리자 페이지에서 새 초안 생성" }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 초안 오류(${response.status})`);
        await this.loadItemComponents();
        this.selectItemComponent(result.component);
        this.setStatus("컴포넌트 새 초안을 만들었습니다");
      } catch (error) { this.setStatus(`컴포넌트 초안 생성 실패: ${error.message}`); }
      finally { this.itemComponentSaving = false; }
    },

    async saveItemComponentDraft(component) {
      if (!component?.id || component.versionStatus !== "draft" || this.itemComponentSaving) return;
      this.itemComponentSaving = true;
      try {
        const response = await fetch(`/api/item-component?componentId=${encodeURIComponent(component.id)}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...this.itemComponentEditor, versionId: component.versionId }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 저장 오류(${response.status})`);
        await this.loadItemComponents();
        this.selectItemComponent(result.component);
        this.setStatus("컴포넌트 초안을 저장했습니다");
      } catch (error) { this.setStatus(`컴포넌트 저장 실패: ${error.message}`); }
      finally { this.itemComponentSaving = false; }
    },

    async loadDesignTokenSets() {
      if (this.designTokenSetsLoading) return;
      this.designTokenSetsLoading = true;
      try {
        const response = await fetch("/api/design-token-sets");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `디자인 토큰 요청 오류(${response.status})`);
        this.designTokenSets = Array.isArray(result.tokenSets) ? result.tokenSets : [];
      } catch (error) {
        this.setStatus(`디자인 토큰 목록 실패: ${error.message}`);
      } finally {
        this.designTokenSetsLoading = false;
      }
    },

    async loadWizardSectionAuditLogs() {
      if (this.wizardSectionAuditLoading) return;
      this.wizardSectionAuditLoading = true;
      this.wizardSectionAuditError = "";
      try {
        const params = new URLSearchParams({ limit: "200" });
        if (this.wizardSectionAuditFilters.templateKey) params.set("templateKey", this.wizardSectionAuditFilters.templateKey);
        if (this.wizardSectionAuditFilters.action) params.set("action", this.wizardSectionAuditFilters.action);
        const response = await fetch(`/api/wizard-section-audit-logs?${params}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 작업 이력 요청 오류(${response.status})`);
        this.wizardSectionAuditLogs = Array.isArray(result.logs) ? result.logs : [];
      } catch (error) {
        this.wizardSectionAuditLogs = [];
        this.wizardSectionAuditError = error.message;
      } finally {
        this.wizardSectionAuditLoading = false;
      }
    },

    wizardSectionAuditActionLabel(action, entityType = "") {
      if (action === "delete") return entityType === "section" ? "보관" : "삭제";
      return ({ create: "생성", update: "수정", reorder: "순서 변경", draft: "초안 생성", activate: "활성화" })[action] || action;
    },

    formatAuditDate(value) {
      if (!value) return "-";
      return new Intl.DateTimeFormat("ko-KR", { dateStyle: "short", timeStyle: "medium" }).format(new Date(value));
    },

    formatAuditState(value) {
      return value ? JSON.stringify(value, null, 2) : "없음";
    },

    async loadPromptTemplates(options = {}) {
      if (this.promptTemplatesLoading && !options.fresh) return;
      this.promptTemplatesLoading = true;
      this.promptTemplatesError = "";
      try {
        const response = await fetch("/api/prompt-templates?includeArchived=true");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 목록 요청 오류(${response.status})`);
        this.promptTemplates = Array.isArray(result.prompts) ? result.prompts : [];
        if (!this.selectedPromptTemplateId || !this.promptTemplates.some((prompt) => prompt.id === this.selectedPromptTemplateId)) {
          const activeImageExecution = this.promptTemplates.find(
            (prompt) => prompt.type === "image_execution" && prompt.status === "active"
          );
          const active = activeImageExecution || this.promptTemplates.find((prompt) => prompt.status === "active");
          this.selectedPromptTemplateId = active?.id || this.promptTemplates[0]?.id || "";
        }
        if (this.selectedPromptTemplateId) await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
      } catch (error) {
        this.promptTemplatesError = error.message;
        this.setStatus(`프롬프트 목록을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.promptTemplatesLoading = false;
      }
    },

    async loadWorkerWebhookSettings(options = {}) {
      if (this.workerWebhookSettingsLoading && !options.fresh) return;
      this.workerWebhookSettingsLoading = true;
      this.workerWebhookSettingsError = "";
      try {
        const response = await fetch("/api/promo-generation-worker-settings");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `작업자 설정 요청 오류(${response.status})`);
        this.workerWebhookSettings = Array.isArray(result.settings) ? result.settings : [];
        const nextEditors = {};
        this.workerWebhookSettings.forEach((setting) => {
          const current = this.workerWebhookEditors[setting.stage] || {};
          const preserveDrafts = Boolean(options.preserveDrafts);
          nextEditors[setting.stage] = {
            webhookUrl: preserveDrafts ? (current.webhookUrl || "") : "",
            isActive: preserveDrafts ? (current.isActive ?? Boolean(setting.isActive)) : Boolean(setting.isActive),
            timeoutMs: preserveDrafts ? (current.timeoutMs ?? (setting.timeoutMs ?? "")) : (setting.timeoutMs ?? ""),
            description: preserveDrafts ? (current.description ?? (setting.description || "")) : (setting.description || ""),
            changeNote: "",
          };
        });
        this.workerWebhookEditors = nextEditors;
      } catch (error) {
        this.workerWebhookSettingsError = error.message;
        this.setStatus(`웹훅 설정을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.workerWebhookSettingsLoading = false;
      }
    },

    workerWebhookEditor(stage) {
      if (!this.workerWebhookEditors[stage]) {
        this.workerWebhookEditors[stage] = {
          webhookUrl: "",
          isActive: false,
          timeoutMs: "",
          description: "",
          changeNote: "",
        };
      }
      return this.workerWebhookEditors[stage];
    },

    workerStageLabel(stage, fallback = "") {
      return ({
        integrated_brief: "통합 디자인 브리프",
        lofi_draft: "LO-FI 시안",
        final_design: "최종 디자인",
        promo_ui_design: "프로모션 UI 디자인",
      })[stage] || fallback || stage;
    },

    promptTypeLabel(type) {
      return ({
        integrated_brief: "통합 디자인 브리프",
        image_execution: "이미지 생성",
        lofi_draft: "LO-FI 시안",
        final_design: "최종 디자인",
        section_layout_planner: "섹션 레이아웃 계획",
        multi_component_layout_planner: "다중 컴포넌트 정렬 계획",
        section_background_image: "섹션 배경 이미지",
        component_image: "컴포넌트 이미지",
      })[type] || type || "알 수 없음";
    },

    promptStatusLabel(status) {
      return ({
        draft: "초안",
        validated: "검증 완료",
        active: "활성",
        inactive: "비활성",
        archived: "보관됨",
      })[status] || status || "알 수 없음";
    },

    async saveWorkerWebhookSetting(setting) {
      if (!setting?.stage || this.workerWebhookSavingStage) return;
      const editor = this.workerWebhookEditor(setting.stage);
      this.workerWebhookSavingStage = setting.stage;
      try {
        const response = await fetch("/api/promo-generation-worker-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stage: setting.stage,
            webhookUrl: editor.webhookUrl,
            preserveExistingWebhook: !editor.webhookUrl && setting.isConfigured,
            isActive: editor.isActive,
            timeoutMs: editor.timeoutMs === "" ? null : Number(editor.timeoutMs),
            description: editor.description,
            changeNote: editor.changeNote || "관리자 페이지에서 작업자 웹훅 설정을 변경했습니다.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `작업자 설정 저장 오류(${response.status})`);
        await this.loadWorkerWebhookSettings({ fresh: true });
        this.setStatus(`${this.workerStageLabel(setting.stage, setting.label)} 웹훅 설정을 저장했습니다`);
      } catch (error) {
        this.setStatus(`웹훅 설정 저장 실패: ${error.message}`);
      } finally {
        this.workerWebhookSavingStage = "";
      }
    },

    async selectPromptTemplate(id, options = {}) {
      this.selectedPromptTemplateId = id;
      const prompt = this.promptTemplates.find((item) => item.id === id);
      if (!prompt) return;
      try {
        const response = await fetch(`/api/prompt-template?id=${encodeURIComponent(id)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 요청 오류(${response.status})`);
        const detail = result.prompt || prompt;
        const index = this.promptTemplates.findIndex((item) => item.id === id);
        if (index >= 0) this.promptTemplates.splice(index, 1, detail);
        this.promptHistories = Array.isArray(result.histories) ? result.histories : [];
        this.promptEditor = {
          name: detail.name || "",
          body: detail.body || "",
          requiredVariablesText: (detail.requiredVariables || []).join(", "),
          optionalVariablesText: (detail.optionalVariables || []).join(", "),
          provider: detail.provider || "",
          model: detail.model || "",
          temperature: detail.temperature ?? "",
          maxTokens: detail.maxTokens ?? "",
          responseFormat: detail.responseFormat || "",
          imageSize: ["1K", "2K", "4K"].includes(String(
            detail.modelOptions?.imageSize || detail.modelOptions?.image_size || ""
          ).toUpperCase())
            ? String(detail.modelOptions?.imageSize || detail.modelOptions?.image_size).toUpperCase()
            : "2K",
          modelOptionsText: JSON.stringify(detail.modelOptions || {}, null, 2),
          changeNote: "",
        };
        if (!options.silent) this.setStatus(`${detail.name} 프롬프트를 열었습니다`);
      } catch (error) {
        this.setStatus(`프롬프트 상세를 불러오지 못했습니다: ${error.message}`);
      }
    },

    variableTextToList(value) {
      return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    },

    parseModelOptionsText(value) {
      const text = String(value || "").trim();
      if (!text) return {};
      try {
        const parsed = JSON.parse(text);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      } catch (error) {
        throw new Error(`모델 상세 옵션 JSON 형식이 올바르지 않습니다: ${error.message}`);
      }
    },

    promptSupportsImageSize(prompt = this.selectedPromptTemplate) {
      return this.promptEditor.provider === "google"
        && ["image_execution", "final_design", "section_background_image", "component_image"].includes(prompt?.type);
    },

    promptModelOptionsForSave(prompt) {
      const modelOptions = this.parseModelOptionsText(this.promptEditor.modelOptionsText);
      if (this.promptSupportsImageSize(prompt)) {
        modelOptions.imageSize = ["1K", "2K", "4K"].includes(this.promptEditor.imageSize)
          ? this.promptEditor.imageSize
          : "2K";
        delete modelOptions.image_size;
      }
      return modelOptions;
    },

    async savePromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving) return;
      if (prompt.status !== "draft") {
        this.setStatus("활성·검증 완료·이전 버전은 직접 수정할 수 없습니다. 새 초안을 만들어 주세요.");
        return;
      }
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            name: this.promptEditor.name,
            body: this.promptEditor.body,
            requiredVariables: this.variableTextToList(this.promptEditor.requiredVariablesText),
            optionalVariables: this.variableTextToList(this.promptEditor.optionalVariablesText),
            provider: this.promptEditor.provider,
            model: this.promptEditor.model,
            temperature: this.promptEditor.temperature === "" ? null : Number(this.promptEditor.temperature),
            maxTokens: this.promptEditor.maxTokens === "" ? null : Number(this.promptEditor.maxTokens),
            responseFormat: this.promptEditor.responseFormat,
            modelOptions: this.promptModelOptionsForSave(prompt),
            changeNote: this.promptEditor.changeNote || "관리자 페이지에서 프롬프트를 변경했습니다.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 저장 오류(${response.status})`);
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || prompt.id;
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus("프롬프트 초안을 저장하고 변경 이력을 생성했습니다");
      } catch (error) {
        this.setStatus(`프롬프트 저장 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    async createPromptDraft() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving || ["draft", "validated"].includes(prompt.status)) return;
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            changeNote: `관리자 페이지에서 v${prompt.version}을 기준으로 새 초안을 만들었습니다.`,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (result.promptId) {
            this.selectedPromptTemplateId = result.promptId;
            await this.loadPromptTemplates({ fresh: true });
          }
          throw new Error(result.message || result.error || `프롬프트 초안 생성 오류(${response.status})`);
        }
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || "";
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus(`v${result.prompt?.version || ""} 프롬프트 초안을 만들었습니다`);
      } catch (error) {
        this.setStatus(`프롬프트 초안 생성 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    async validatePromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving || prompt.status !== "draft") return;
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template-validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            changeNote: "관리자 페이지에서 프롬프트 변수와 모델 계약을 검증했습니다.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 검증 오류(${response.status})`);
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || prompt.id;
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus("프롬프트 검증을 완료했습니다. 활성화할 수 있습니다.");
      } catch (error) {
        this.setStatus(`프롬프트 검증 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    async activatePromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving) return;
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template-activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            changeNote: "관리자 페이지에서 활성 프롬프트로 지정했습니다.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 활성화 오류(${response.status})`);
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || prompt.id;
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus("활성 프롬프트로 지정했습니다");
      } catch (error) {
        this.setStatus(`활성 프롬프트 지정 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    async archivePromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving) return;
      if (prompt.status === "active") {
        this.setStatus("활성 프롬프트는 보관할 수 없습니다");
        return;
      }
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template-archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            changeNote: "관리자 페이지에서 프롬프트를 보관했습니다.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 보관 오류(${response.status})`);
        this.selectedPromptTemplateId = "";
        await this.loadPromptTemplates({ fresh: true });
        this.setStatus("프롬프트를 보관했습니다");
      } catch (error) {
        this.setStatus(`프롬프트 보관 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    async rollbackPromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving || !["inactive", "archived"].includes(prompt.status)) return;
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template-rollback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            changeNote: `관리자 페이지에서 v${prompt.version} 프롬프트로 롤백했습니다.`,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `프롬프트 롤백 오류(${response.status})`);
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || prompt.id;
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus(`v${result.prompt?.version || prompt.version} 프롬프트로 롤백했습니다`);
      } catch (error) {
        this.setStatus(`프롬프트 롤백 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    // --- Wizard Form Templates ---------------------------------------------
    async loadWizardFormTemplates(options = {}) {
      if (this.wizardFormTemplatesLoading && !options.fresh) return;
      this.wizardFormTemplatesLoading = true;
      this.wizardFormTemplatesError = "";
      try {
        const response = await fetch("/api/wizard-form-templates?includeArchived=true");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 목록 요청 오류(${response.status})`);
        this.wizardFormTemplates = Array.isArray(result.templates) ? result.templates : [];
        if (!this.groupedWizardFormTemplates.some((group) => group.templateKey === this.selectedWizardFormTemplateKey)) {
          this.selectedWizardFormTemplateKey = this.groupedWizardFormTemplates[0]?.templateKey || "";
        }
        if (this.selectedWizardFormTemplateKey) {
          await this.selectWizardFormTemplate(this.selectedWizardFormTemplateKey, { silent: true });
        } else {
          this.wizardFormTemplateDetail = null;
        }
      } catch (error) {
        this.wizardFormTemplatesError = error.message;
        this.setStatus(`템플릿 목록을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.wizardFormTemplatesLoading = false;
      }
    },

    async selectWizardFormTemplate(templateKey, options = {}) {
      this.selectedWizardFormTemplateKey = templateKey;
      this.showDuplicateWizardFormTemplateForm = false;
      this.duplicateWizardFormTemplateError = "";
      this.wizardFormTemplateDetail = null;
      const group = this.groupedWizardFormTemplates.find((item) => item.templateKey === templateKey);
      const target = group?.versions.find((version) => version.status === "draft") || group?.primary;
      if (!target) {
        this.wizardFormTemplateDetail = null;
        return;
      }
      await this.loadWizardFormTemplateDetail(target.id, options);
    },

    async loadWizardFormTemplateDetail(id, options = {}) {
      try {
        const response = await fetch(`/api/wizard-form-template?id=${encodeURIComponent(id)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 상세 요청 오류(${response.status})`);
        this.wizardFormTemplateDetail = { template: result.template, sections: result.sections || [] };
        this.wizardFormTemplateEditor = {
          name: result.template.name,
          description: result.template.description,
          isDefault: result.template.isDefault,
          designTokenSetVersionId: result.template.designTokenSetVersionId || "",
          changeNote: "",
        };
        const selectedSection = this.wizardFormTemplateDetail.sections.find(
          (section) => section.id === this.selectedWizardFormTemplateSectionId
        ) || this.wizardFormTemplateDetail.sections[0] || null;
        if (selectedSection) {
          await this.selectWizardFormTemplateSection(selectedSection);
        } else {
          this.selectedWizardFormTemplateSectionId = "";
          this.wizardFormTemplateSectionItems = [];
        }
      } catch (error) {
        if (!options.silent) this.setStatus(`템플릿 상세를 불러오지 못했습니다: ${error.message}`);
      }
    },

    toggleNewWizardFormTemplateForm() {
      this.showNewWizardFormTemplateForm = !this.showNewWizardFormTemplateForm;
      this.showDuplicateWizardFormTemplateForm = false;
      this.newWizardFormTemplateForm = { name: "", description: "", designTokenSetVersionId: "" };
    },

    openDuplicateWizardFormTemplate(group = this.selectedWizardFormTemplateGroup) {
      const source = group?.active || group?.draft || group?.primary || this.wizardFormTemplateDetail?.template;
      if (!source) return;
      this.selectedWizardFormTemplateKey = group?.templateKey || source.templateKey;
      this.showDuplicateWizardFormTemplateForm = true;
      this.duplicateWizardFormTemplateError = "";
      this.showNewWizardFormTemplateForm = false;
      this.duplicateWizardFormTemplateForm = {
        sourceId: source.id,
        name: `${source.name} Copy`,
        description: source.description || "",
      };
    },

    toggleWizardFormTemplateSettings(group) {
      const opening = this.expandedWizardFormTemplateSettingsKey !== group.templateKey;
      this.expandedWizardFormTemplateSettingsKey = opening ? group.templateKey : "";
      if (opening) this.selectWizardFormTemplate(group.templateKey, { silent: true });
    },

    async createWizardFormTemplate() {
      if (this.wizardFormTemplateSaving) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.newWizardFormTemplateForm.name,
            description: this.newWizardFormTemplateForm.description,
            designTokenSetVersionId: this.newWizardFormTemplateForm.designTokenSetVersionId,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 생성 오류(${response.status})`);
        this.showNewWizardFormTemplateForm = false;
        this.selectedWizardFormTemplateKey = result.template.templateKey;
        await this.loadWizardFormTemplates({ fresh: true });
        this.setStatus("템플릿 초안을 생성했습니다");
      } catch (error) {
        this.setStatus(`템플릿 생성 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async duplicateWizardFormTemplate() {
      const source = this.wizardFormTemplates.find(
        (template) => template.id === this.duplicateWizardFormTemplateForm.sourceId
      ) || this.wizardFormTemplateDetail?.template;
      if (!source || this.wizardFormTemplateSaving) return;
      this.duplicateWizardFormTemplateError = "";
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: source.id,
            name: this.duplicateWizardFormTemplateForm.name,
            description: this.duplicateWizardFormTemplateForm.description,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 복사본 생성 오류(${response.status})`);
        this.showDuplicateWizardFormTemplateForm = false;
        this.selectedWizardFormTemplateKey = result.template.templateKey;
        await this.loadWizardFormTemplates({ fresh: true });
        this.setStatus("템플릿 복사본을 새 초안으로 만들었습니다");
      } catch (error) {
        this.duplicateWizardFormTemplateError = error.message;
        this.setStatus(`템플릿 복사본 생성 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async createWizardFormTemplateDraft(sourceTemplate = this.wizardFormTemplateDetail?.template) {
      const source = sourceTemplate;
      if (!source || this.wizardFormTemplateSaving) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: source.id, changeNote: "관리자 페이지에서 새 초안을 만들었습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 초안 생성 오류(${response.status})`);
        await this.loadWizardFormTemplates({ fresh: true });
        await this.loadWizardFormTemplateDetail(result.template.id);
        this.setStatus("템플릿 새 초안을 만들었습니다");
      } catch (error) {
        this.setStatus(`템플릿 초안 생성 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async editWizardFormTemplate(group) {
      if (!group || this.wizardFormTemplateSaving) return;
      this.selectedWizardFormTemplateKey = group.templateKey;
      this.expandedWizardFormTemplateSettingsKey = group.templateKey;
      if (group.draft) {
        await this.loadWizardFormTemplateDetail(group.draft.id);
        return;
      }
      const source = group.active || group.inactive || group.primary;
      if (source) await this.createWizardFormTemplateDraft(source);
    },

    async saveWizardFormTemplate() {
      const template = this.wizardFormTemplateDetail?.template;
      if (!template || template.status !== "draft" || this.wizardFormTemplateSaving) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: template.id, ...this.wizardFormTemplateEditor }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 저장 오류(${response.status})`);
        await this.loadWizardFormTemplates({ fresh: true });
        await this.loadWizardFormTemplateDetail(result.template.id);
        this.setStatus("템플릿 정보를 저장했습니다");
      } catch (error) {
        this.setStatus(`템플릿 저장 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async activateWizardFormTemplate(templateOverride = null) {
      const template = templateOverride || this.wizardFormTemplateDetail?.template;
      if (!template || this.wizardFormTemplateSaving) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: template.id, changeNote: "관리자 페이지에서 템플릿을 활성화했습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 활성화 오류(${response.status})`);
        await this.loadWizardFormTemplates({ fresh: true });
        const layoutRevision = Number(result.layoutIdentity?.layoutRevision || 1);
        this.setStatus(`템플릿 v${result.template?.version || template.version} · 레이아웃 r${layoutRevision}을 활성화했습니다`);
      } catch (error) {
        this.setStatus(`템플릿 활성화 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async deactivateWizardFormTemplate(templateOverride = null) {
      const template = templateOverride || this.wizardFormTemplateDetail?.template;
      if (!template || template.status !== "active" || this.wizardFormTemplateSaving) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-deactivate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: template.id, changeNote: "관리자 페이지에서 템플릿을 비활성화했습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 비활성화 오류(${response.status})`);
        await this.loadWizardFormTemplates({ fresh: true });
        this.setStatus(`템플릿 v${result.template?.version || template.version}을 비활성화했습니다`);
      } catch (error) {
        this.setStatus(`템플릿 비활성화 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async toggleWizardFormTemplateActive(group, enabled) {
      if (!group || this.wizardFormTemplateSaving) return;
      if (enabled) {
        const target = group.draft || group.inactive || group.primary;
        if (target) await this.activateWizardFormTemplate(target);
        return;
      }
      if (group.active) await this.deactivateWizardFormTemplate(group.active);
    },

    async deleteWizardFormTemplate(group) {
      const target = group?.draft || group?.inactive || null;
      if (!target || this.wizardFormTemplateSaving) {
        this.setStatus("활성 템플릿은 삭제할 수 없습니다. 먼저 다른 버전을 활성화하거나 비활성화해 주세요.");
        return;
      }
      if (!window.confirm(`${target.name} v${target.version}을 삭제(보관)할까요?`)) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: target.id, changeNote: "관리자 페이지 템플릿 목록에서 삭제(보관)했습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 보관 오류(${response.status})`);
        this.expandedWizardFormTemplateSettingsKey = "";
        await this.loadWizardFormTemplates({ fresh: true });
        this.setStatus("템플릿 버전을 보관했습니다");
      } catch (error) {
        this.setStatus(`템플릿 보관 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async archiveWizardFormTemplate() {
      const template = this.wizardFormTemplateDetail?.template;
      if (!template || this.wizardFormTemplateSaving) return;
      this.wizardFormTemplateSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: template.id, changeNote: "관리자 페이지에서 템플릿을 보관했습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 보관 오류(${response.status})`);
        await this.loadWizardFormTemplates({ fresh: true });
        this.setStatus("템플릿 버전을 보관했습니다");
      } catch (error) {
        this.setStatus(`템플릿 보관 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSaving = false;
      }
    },

    async selectWizardFormTemplateSection(section) {
      if (!section) return;
      this.selectedWizardFormTemplateSectionId = section.id;
      this.wizardFormTemplateSectionEditor = {
        name: section.sectionName || "",
        description: section.sectionDescription || "",
        isRequired: section.isRequired,
        isVisible: section.isVisible,
        userReorderAllowed: section.userReorderAllowed,
        fixedPosition: section.fixedPosition || "",
        aiDesign: {
          enabled: section.aiDesign?.enabled !== false,
          allowedLayoutVariants: Array.isArray(section.aiDesign?.allowedLayoutVariants)
            ? [...section.aiDesign.allowedLayoutVariants]
            : ["split-left", "split-right", "centered-hero"],
          allowSectionBackground: section.aiDesign?.allowSectionBackground !== false,
          imageTarget: section.aiDesign?.imageTarget === "item" ? "item" : "section-background",
          imageTargetItemKeys: Array.isArray(section.aiDesign?.imageTargetItemKeys)
            ? [...section.aiDesign.imageTargetItemKeys]
            : [],
          imageAspectRatio: section.aiDesign?.imageAspectRatio || "16:9",
          backgroundPromptText: section.aiDesign?.backgroundPromptText || "",
        },
      };
      this.wizardFormTemplateItemEditorOpenId = "";
      await this.loadWizardFormTemplateSectionItems(section);
    },

    async toggleWizardFormTemplateSection(section) {
      if (!section) return;
      if (this.expandedWizardFormTemplateSectionId === section.id) {
        this.expandedWizardFormTemplateSectionId = "";
        return;
      }
      this.expandedWizardFormTemplateSectionId = section.id;
      if (this.selectedWizardFormTemplateSectionId !== section.id) {
        await this.selectWizardFormTemplateSection(section);
      }
    },

    async loadWizardFormTemplateSectionItems(section = this.selectedWizardFormTemplateSection) {
      const sectionId = section?.sectionId || this.selectedWizardFormTemplateSectionSource?.id;
      if (!sectionId) {
        this.wizardFormTemplateSectionItems = [];
        return;
      }
      this.wizardFormTemplateSectionItemsLoading = true;
      try {
        const response = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(sectionId)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 Item 요청 오류(${response.status})`);
        this.wizardFormTemplateSectionItems = Array.isArray(result.items) ? result.items : [];
      } catch (error) {
        this.wizardFormTemplateSectionItems = [];
        this.setStatus(`섹션 Item을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionItemsLoading = false;
      }
    },

    async addWizardFormTemplateSection() {
      const template = this.wizardFormTemplateDetail?.template;
      if (!template || !this.newWizardFormTemplateSectionForm.sectionId || this.wizardFormTemplateSectionSaving) return;
      this.wizardFormTemplateSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: template.id,
            sectionId: this.newWizardFormTemplateSectionForm.sectionId,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 Section 추가 오류(${response.status})`);
        this.selectedWizardFormTemplateSectionId = result.section.id;
        this.expandedWizardFormTemplateSectionId = result.section.id;
        this.showNewWizardFormTemplateSectionForm = false;
        this.newWizardFormTemplateSectionForm = { sectionId: "" };
        await this.loadWizardFormTemplateDetail(template.id);
        this.setStatus("템플릿에 Section을 추가했습니다");
      } catch (error) {
        this.setStatus(`템플릿 Section 추가 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    async saveWizardFormTemplateSection() {
      const section = this.selectedWizardFormTemplateSection;
      if (!section || !this.wizardFormTemplateCanEdit || this.wizardFormTemplateSectionSaving) return;
      this.wizardFormTemplateSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-sections", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: section.id,
            isRequired: this.wizardFormTemplateSectionEditor.isRequired,
            isVisible: this.wizardFormTemplateSectionEditor.isVisible,
            userReorderAllowed: this.wizardFormTemplateSectionEditor.userReorderAllowed,
            fixedPosition: this.wizardFormTemplateSectionEditor.fixedPosition,
            aiDesign: this.wizardFormTemplateSectionEditor.aiDesign,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 Section 저장 오류(${response.status})`);
        await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id);
        this.setStatus("템플릿 Section 설정을 저장했습니다");
      } catch (error) {
        this.setStatus(`템플릿 Section 저장 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    async removeWizardFormTemplateSection() {
      const section = this.selectedWizardFormTemplateSection;
      if (!section || !this.wizardFormTemplateCanEdit || this.wizardFormTemplateSectionSaving) return;
      if (!window.confirm(`템플릿에서 ${section.sectionName || section.sectionKey} Section을 제외할까요?`)) return;
      this.wizardFormTemplateSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-sections", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: section.id }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 Section 제외 오류(${response.status})`);
        this.selectedWizardFormTemplateSectionId = "";
        this.expandedWizardFormTemplateSectionId = "";
        await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id);
        this.setStatus("템플릿에서 Section을 제외했습니다");
      } catch (error) {
        this.setStatus(`템플릿 Section 제외 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    wizardFormTemplateSectionCanReorder(section) {
      return Boolean(this.wizardFormTemplateCanEdit && !section?.fixedPosition);
    },

    startWizardFormTemplateSectionDrag(section, event) {
      if (!this.wizardFormTemplateSectionCanReorder(section) || this.wizardFormTemplateSectionSaving) {
        event.preventDefault();
        return;
      }
      this.draggedWizardFormTemplateSectionKey = section.sectionKey;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", section.sectionKey);
    },

    dragOverWizardFormTemplateSection(section, event) {
      if (!this.draggedWizardFormTemplateSectionKey
        || this.draggedWizardFormTemplateSectionKey === section.sectionKey
        || !this.wizardFormTemplateSectionCanReorder(section)) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      this.wizardFormTemplateSectionDropTargetKey = section.sectionKey;
      this.wizardFormTemplateSectionDropPosition = event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
      event.dataTransfer.dropEffect = "move";
    },

    stopWizardFormTemplateSectionDrag() {
      this.draggedWizardFormTemplateSectionKey = "";
      this.wizardFormTemplateSectionDropTargetKey = "";
      this.wizardFormTemplateSectionDropPosition = "";
    },

    async dropWizardFormTemplateSection(targetSection) {
      const sourceKey = this.draggedWizardFormTemplateSectionKey;
      const position = this.wizardFormTemplateSectionDropPosition || "before";
      this.stopWizardFormTemplateSectionDrag();
      if (!sourceKey || sourceKey === targetSection.sectionKey) return;
      const movable = this.wizardFormTemplateDetail.sections.filter((section) => !section.fixedPosition);
      const source = movable.find((section) => section.sectionKey === sourceKey);
      const reordered = movable.filter((section) => section.sectionKey !== sourceKey);
      const targetIndex = reordered.findIndex((section) => section.sectionKey === targetSection.sectionKey);
      if (!source || targetIndex < 0) return;
      reordered.splice(targetIndex + (position === "after" ? 1 : 0), 0, source);

      const previousSections = [...this.wizardFormTemplateDetail.sections];
      const optimisticMovable = [...reordered];
      this.wizardFormTemplateDetail.sections = previousSections.map((section) => (
        section.fixedPosition ? section : optimisticMovable.shift()
      ));
      this.setStatus("템플릿 Section 순서를 저장하는 중입니다");

      this.wizardFormTemplateSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-form-template-sections-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: this.wizardFormTemplateDetail.template.id,
            sectionIds: reordered.map((section) => section.sectionId),
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `템플릿 Section 순서 오류(${response.status})`);
        this.wizardFormTemplateDetail.sections = result.sections || this.wizardFormTemplateDetail.sections;
        this.setStatus("템플릿 Section 순서를 저장했습니다");
      } catch (error) {
        this.wizardFormTemplateDetail.sections = previousSections;
        this.setStatus(`템플릿 Section 순서 저장 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    newWizardFormTemplateItem(item = null) {
      return {
        id: item?.id || "",
        itemKey: item?.itemKey || "",
        name: item?.name || "",
        isVisibleInWizard: item?.isVisibleInWizard ?? true,
        isRequired: item?.isRequired ?? false,
        userReorderAllowed: item?.userReorderAllowed ?? true,
        sortOrder: item?.sortOrder ?? this.wizardFormTemplateSectionItems.length * 10,
        fieldKind: item?.fieldKind || "text",
        textType: item?.textType || "title",
        image: item?.image
          ? { ...item.image, allowedSources: [...(item.image.allowedSources || [])] }
          : { allowedSources: [], promptText: "", descriptionEnabled: false, altTextRequired: false, aspectRatio: "", maxSizeKb: "" },
        ctaUtm: item?.ctaUtm ? { ...item.ctaUtm } : { source: "", medium: "", campaign: "", content: "", term: "" },
        isLocked: item?.isLocked ?? false,
        lockedValueText: item?.lockedValue === null || item?.lockedValue === undefined ? "" : JSON.stringify(item.lockedValue, null, 2),
      };
    },

    openNewWizardFormTemplateItemEditor() {
      this.wizardFormTemplateItemEditor = this.newWizardFormTemplateItem();
      this.wizardFormTemplateItemEditorOpenId = "new";
    },

    openWizardFormTemplateItemEditor(item) {
      if (this.wizardFormTemplateItemEditorOpenId === item.id) {
        this.wizardFormTemplateItemEditorOpenId = "";
        this.wizardFormTemplateItemEditor = null;
        return;
      }
      this.wizardFormTemplateItemEditor = this.newWizardFormTemplateItem(item);
      this.wizardFormTemplateItemEditorOpenId = item.id;
    },

    toggleWizardFormTemplateItemImageSource(source) {
      const sources = this.wizardFormTemplateItemEditor.image.allowedSources;
      const index = sources.indexOf(source);
      if (index >= 0) sources.splice(index, 1);
      else sources.push(source);
    },

    async prepareWizardFormTemplateSectionDraft() {
      const selectedSection = this.selectedWizardFormTemplateSection;
      if (!selectedSection?.sectionId) {
        throw new Error("선택한 섹션의 원본 연결이 없습니다. DB 마이그레이션 021을 적용해 주세요.");
      }
      if (selectedSection.sectionStatus === "draft") {
        return { sectionId: selectedSection.sectionId, items: this.wizardFormTemplateSectionItems };
      }

      const draftResponse = await fetch("/api/wizard-form-template-sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSection.id }),
      });
      const draftResult = await draftResponse.json().catch(() => ({}));
      if (!draftResponse.ok) {
        throw new Error(draftResult.message || draftResult.error || `편집용 Section 준비 오류(${draftResponse.status})`);
      }
      const sectionId = draftResult.section?.sectionId;
      if (!sectionId) throw new Error("편집용 Section 연결을 확인할 수 없습니다");

      const itemResponse = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(sectionId)}`);
      const itemResult = await itemResponse.json().catch(() => ({}));
      if (!itemResponse.ok) {
        throw new Error(itemResult.message || itemResult.error || `편집용 Item 요청 오류(${itemResponse.status})`);
      }
      const items = Array.isArray(itemResult.items) ? itemResult.items : [];
      this.wizardFormTemplateSectionItems = items;
      const index = this.wizardFormTemplateDetail.sections.findIndex((section) => section.id === selectedSection.id);
      if (index >= 0) this.wizardFormTemplateDetail.sections.splice(index, 1, draftResult.section);
      return { sectionId, items };
    },

    async saveWizardFormTemplateItem() {
      const editor = this.wizardFormTemplateItemEditor;
      const isNewItem = this.wizardFormTemplateItemEditorOpenId === "new";
      if (!editor || this.wizardFormTemplateSectionSaving) return;
      let lockedValue = null;
      if (editor.isLocked && editor.lockedValueText.trim()) {
        try { lockedValue = JSON.parse(editor.lockedValueText); }
        catch (error) { this.setStatus(`고정값 JSON 형식 오류: ${error.message}`); return; }
      }
      this.wizardFormTemplateSectionSaving = true;
      try {
        const draft = await this.prepareWizardFormTemplateSectionDraft();
        const matchingItem = draft.items.find((item) => item.itemKey === editor.itemKey);
        editor.id = matchingItem?.id || "";

        const response = await fetch("/api/wizard-content-section-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editor,
            sectionId: draft.sectionId,
            fieldKind: editor.fieldKind,
            image: { ...editor.image },
            lockedValue,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 저장 오류(${response.status})`);
        await this.loadWizardFormTemplateSectionItems();
        if (isNewItem) {
          this.openNewWizardFormTemplateItemEditor();
          this.setStatus("섹션 컴포넌트를 저장했습니다. 다음 컴포넌트를 계속 추가할 수 있습니다");
        } else {
          this.wizardFormTemplateItemEditorOpenId = "";
          this.wizardFormTemplateItemEditor = null;
          this.setStatus("섹션 컴포넌트 변경사항을 저장했습니다");
        }
      } catch (error) {
        this.setStatus(`컴포넌트 저장 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    async deleteWizardFormTemplateItem(item) {
      if (this.wizardFormTemplateSectionSaving || !window.confirm(`${item.name} 아이템을 삭제할까요?`)) return;
      this.wizardFormTemplateSectionSaving = true;
      try {
        const draft = await this.prepareWizardFormTemplateSectionDraft();
        const draftItem = draft.items.find((candidate) => candidate.itemKey === item.itemKey);
        if (!draftItem) throw new Error("삭제할 아이템을 편집용 Section에서 찾을 수 없습니다");
        const response = await fetch(`/api/wizard-content-section-items?id=${encodeURIComponent(draftItem.id)}&sectionId=${encodeURIComponent(draft.sectionId)}`, { method: "DELETE" });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 삭제 오류(${response.status})`);
        await this.loadWizardFormTemplateSectionItems();
        this.wizardFormTemplateItemEditorOpenId = "";
        this.setStatus("섹션 컴포넌트를 삭제했습니다");
      } catch (error) {
        this.setStatus(`컴포넌트 삭제 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    startWizardFormTemplateItemDrag(item, event) {
      if (this.wizardFormTemplateSectionSaving) {
        event.preventDefault();
        return;
      }
      this.draggedWizardFormTemplateItemId = item.id;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.id);
    },

    dragOverWizardFormTemplateItem(item, event) {
      if (!this.draggedWizardFormTemplateItemId || this.draggedWizardFormTemplateItemId === item.id) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      this.wizardFormTemplateItemDropTargetId = item.id;
      this.wizardFormTemplateItemDropPosition = event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
      event.dataTransfer.dropEffect = "move";
    },

    stopWizardFormTemplateItemDrag() {
      this.draggedWizardFormTemplateItemId = "";
      this.wizardFormTemplateItemDropTargetId = "";
      this.wizardFormTemplateItemDropPosition = "";
    },

    async dropWizardFormTemplateItem(targetItem) {
      const sourceId = this.draggedWizardFormTemplateItemId;
      const position = this.wizardFormTemplateItemDropPosition || "before";
      this.stopWizardFormTemplateItemDrag();
      if (!sourceId || sourceId === targetItem.id || this.wizardFormTemplateSectionSaving) return;
      const previousItems = [...this.wizardFormTemplateSectionItems];
      const source = previousItems.find((item) => item.id === sourceId);
      const items = previousItems.filter((item) => item.id !== sourceId);
      const targetIndex = items.findIndex((item) => item.id === targetItem.id);
      if (!source || targetIndex < 0) return;
      items.splice(targetIndex + (position === "after" ? 1 : 0), 0, source);
      this.wizardFormTemplateSectionItems = items;
      this.setStatus("Section Item 순서를 저장하는 중입니다");
      this.wizardFormTemplateSectionSaving = true;
      try {
        const draft = await this.prepareWizardFormTemplateSectionDraft();
        const draftByKey = new Map(draft.items.map((item) => [item.itemKey, item]));
        const draftOrder = items.map((item) => draftByKey.get(item.itemKey));
        if (draftOrder.some((item) => !item)) throw new Error("아이템 순서 정보가 최신 상태와 일치하지 않습니다");
        const response = await fetch("/api/wizard-content-section-items-order", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId: draft.sectionId, itemIds: draftOrder.map((candidate) => candidate.id) }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `아이템 순서 오류(${response.status})`);
        this.wizardFormTemplateSectionItems = result.items;
        this.setStatus("Section Item 순서를 저장했습니다");
      } catch (error) {
        this.wizardFormTemplateSectionItems = previousItems;
        this.setStatus(`아이템 순서 저장 실패: ${error.message}`);
      } finally {
        this.wizardFormTemplateSectionSaving = false;
      }
    },

    // --- Wizard Content Sections (Admin Page "C" subsection) -------------
    // Sections/items are versioned like prompt templates: editing always
    // happens on a 'draft' row (see api/_wizard-content-sections-store.js
    // cloneSectionAsDraft), and "활성화" swaps which version Promo Wizard
    // Step 2 actually renders.
    async loadWizardSections(options = {}) {
      if (this.wizardSectionsLoading && !options.fresh) return;
      this.wizardSectionsLoading = true;
      this.wizardSectionsError = "";
      try {
        const response = await fetch("/api/wizard-content-sections?includeArchived=true");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 목록 요청 오류(${response.status})`);
        this.wizardSections = Array.isArray(result.sections) ? result.sections : [];
        if (!this.selectedWizardSectionKey && this.groupedWizardSections.length) {
          await this.selectWizardSection(this.groupedWizardSections[0].sectionKey);
        } else if (this.selectedWizardSectionKey) {
          await this.selectWizardSection(this.selectedWizardSectionKey, { silent: true });
        }
      } catch (error) {
        this.wizardSectionsError = error.message;
        this.setStatus(`Wizard 섹션 목록을 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.wizardSectionsLoading = false;
      }
    },

    async selectWizardSection(sectionKey, options = {}) {
      this.selectedWizardSectionKey = sectionKey;
      const group = this.groupedWizardSections.find((item) => item.sectionKey === sectionKey);
      const target = group?.versions.find((version) => version.status === "draft") || group?.primary;
      if (!target) {
        this.wizardSectionDetail = null;
        return;
      }
      await this.loadWizardSectionDetail(target.id, options);
    },

    async loadWizardSectionDetail(id, options = {}) {
      this.wizardSectionDetailLoading = true;
      try {
        const response = await fetch(`/api/wizard-content-section?id=${encodeURIComponent(id)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 상세 요청 오류(${response.status})`);
        this.wizardSectionDetail = { section: result.section, items: result.items || [], histories: result.histories || [] };
        await this.loadWizardSectionUsage(result.section);
        this.wizardSectionFieldsEditor = {
          name: result.section.name,
          description: result.section.description,
          isRequired: result.section.isRequired,
          orderChangeAllowed: result.section.orderChangeAllowed,
          fixedPosition: result.section.fixedPosition || "",
          isVisibleInWizard: result.section.isVisibleInWizard,
          aiDesign: {
            enabled: result.section.aiDesign?.enabled !== false,
            allowedLayoutVariants: Array.isArray(result.section.aiDesign?.allowedLayoutVariants)
              ? [...result.section.aiDesign.allowedLayoutVariants]
              : ["split-left", "split-right", "centered-hero"],
            allowSectionBackground: result.section.aiDesign?.allowSectionBackground !== false,
            imageTarget: result.section.aiDesign?.imageTarget === "item" ? "item" : "section-background",
            imageTargetItemKeys: Array.isArray(result.section.aiDesign?.imageTargetItemKeys)
              ? [...result.section.aiDesign.imageTargetItemKeys]
              : [],
            imageAspectRatio: result.section.aiDesign?.imageAspectRatio || "16:9",
            backgroundPromptText: result.section.aiDesign?.backgroundPromptText || "",
          },
          changeNote: "",
        };
        this.wizardItemEditorOpenId = "";
      } catch (error) {
        if (!options.silent) this.setStatus(`섹션 상세를 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.wizardSectionDetailLoading = false;
      }
    },

    async loadWizardSectionUsage(section = this.wizardSectionDetail?.section) {
      const sectionId = String(section?.id || "").trim();
      if (!sectionId) {
        this.wizardSectionUsage = [];
        return;
      }
      this.wizardSectionUsageLoading = true;
      try {
        const response = await fetch(`/api/wizard-content-section-usage?sectionId=${encodeURIComponent(sectionId)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 사용처 요청 오류(${response.status})`);
        this.wizardSectionUsage = Array.isArray(result.templates) ? result.templates : [];
      } catch (error) {
        this.wizardSectionUsage = [];
        this.setStatus(`섹션 사용처를 불러오지 못했습니다: ${error.message}`);
      } finally {
        this.wizardSectionUsageLoading = false;
      }
    },

    wizardSectionStatusLabel(status) {
      return this.promptStatusLabel(status);
    },

    fieldKindLabel(kind) {
      return ({ text: "텍스트", image: "이미지", cta: "CTA 버튼" })[kind] || kind;
    },

    textTypeLabel(type) {
      return ({ title: "Title", remark: "remark (참고)", multi: "Multi (설명)" })[type] || type || "";
    },

    imageSourceLabel(source) {
      return ({ file: "파일첨부", url: "URL첨부", ai: "AI 생성" })[source] || source;
    },

    wizardSectionCanReorder(group) {
      return Boolean(
        group?.primary?.status === "active"
        && group.primary.orderChangeAllowed
        && !group.primary.fixedPosition
      );
    },

    startWizardSectionDrag(group, event) {
      if (!this.wizardSectionCanReorder(group) || this.wizardSectionOrderSaving) {
        event.preventDefault();
        return;
      }
      this.draggedWizardSectionKey = group.sectionKey;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", group.sectionKey);
    },

    stopWizardSectionDrag() {
      this.draggedWizardSectionKey = "";
      this.wizardSectionDropTargetKey = "";
      this.wizardSectionDropPosition = "";
    },

    dragOverWizardSection(targetGroup, event) {
      if (
        !this.draggedWizardSectionKey
        || this.draggedWizardSectionKey === targetGroup.sectionKey
        || !this.wizardSectionCanReorder(targetGroup)
      ) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      this.wizardSectionDropTargetKey = targetGroup.sectionKey;
      this.wizardSectionDropPosition = event.clientY < bounds.top + (bounds.height / 2) ? "before" : "after";
      event.dataTransfer.dropEffect = "move";
    },

    async dropWizardSection(targetGroup) {
      const sourceKey = this.draggedWizardSectionKey;
      const dropPosition = this.wizardSectionDropPosition || "before";
      this.draggedWizardSectionKey = "";
      this.wizardSectionDropTargetKey = "";
      this.wizardSectionDropPosition = "";
      if (!sourceKey || sourceKey === targetGroup?.sectionKey || !this.wizardSectionCanReorder(targetGroup)) return;

      const movableGroups = this.groupedWizardSections.filter((group) => this.wizardSectionCanReorder(group));
      const sourceIndex = movableGroups.findIndex((group) => group.sectionKey === sourceKey);
      if (sourceIndex < 0) return;

      const source = movableGroups[sourceIndex];
      const reordered = movableGroups.filter((group) => group.sectionKey !== sourceKey);
      const targetIndex = reordered.findIndex((group) => group.sectionKey === targetGroup.sectionKey);
      if (targetIndex < 0) return;
      reordered.splice(targetIndex + (dropPosition === "after" ? 1 : 0), 0, source);
      const sectionKeys = reordered.map((group) => group.sectionKey);
      const previousSections = this.wizardSections;
      const orderByKey = new Map(sectionKeys.map((key, index) => [key, index * 10]));
      this.wizardSections = this.wizardSections.map((section) => (
        orderByKey.has(section.sectionKey)
          ? { ...section, sortOrder: orderByKey.get(section.sectionKey) }
          : section
      ));

      this.wizardSectionOrderSaving = true;
      try {
        const response = await fetch("/api/wizard-content-sections-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionKeys }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 순서 저장 오류(${response.status})`);
        this.wizardSections = Array.isArray(result.sections) ? result.sections : this.wizardSections;
        await this.selectWizardSection(this.selectedWizardSectionKey, { silent: true });
        this.setStatus("섹션 순서를 저장했습니다");
      } catch (error) {
        this.wizardSections = previousSections;
        await this.loadWizardSections({ fresh: true });
        this.setStatus(`섹션 순서 저장 실패: ${error.message}`);
      } finally {
        this.wizardSectionOrderSaving = false;
      }
    },

    toggleNewWizardSectionForm() {
      this.showNewWizardSectionForm = !this.showNewWizardSectionForm;
      if (this.showNewWizardSectionForm) {
        this.newWizardSectionForm = { sectionKey: "", name: "", description: "" };
      }
    },

    async createWizardSection() {
      if (this.wizardSectionSaving) return;
      const template = this.wizardFormTemplateDetail?.template;
      if (!template || template.status !== "draft") {
        this.setStatus("섹션을 추가하려면 템플릿 수정 버튼을 눌러 초안을 먼저 만들어 주세요.");
        return;
      }
      this.wizardSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-content-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newWizardSectionForm),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 생성 오류(${response.status})`);
        const createdSection = result.section;
        const membershipResponse = await fetch("/api/wizard-form-template-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: template.id,
            sectionId: createdSection.id,
          }),
        });
        const membershipResult = await membershipResponse.json().catch(() => ({}));
        if (!membershipResponse.ok) {
          throw new Error(`섹션은 생성됐지만 템플릿 추가에 실패했습니다: ${
            membershipResult.message || membershipResult.error || `오류(${membershipResponse.status})`
          }`);
        }
        await this.loadWizardSections({ fresh: true });
        await this.selectWizardSection(createdSection.sectionKey);
        await this.loadWizardFormTemplateDetail(template.id, { silent: true });
        this.newWizardSectionForm = { sectionKey: "", name: "", description: "" };
        this.setStatus(`"${createdSection.name}" 섹션을 생성하고 현재 템플릿 초안에 추가했습니다.`);
      } catch (error) {
        this.setStatus(`섹션 생성 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    async createWizardSectionDraft() {
      const source = this.selectedWizardGroup?.primary;
      if (!source || this.wizardSectionSaving) return;
      this.wizardSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-content-sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: source.id, changeNote: "관리자 페이지에서 새 초안을 만들었습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `초안 생성 오류(${response.status})`);
        await this.loadWizardSections({ fresh: true });
        await this.loadWizardSectionDetail(result.section.id);
        this.setStatus("새 초안을 만들었습니다");
      } catch (error) {
        this.setStatus(`초안 생성 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    async saveWizardSectionFields() {
      const section = this.wizardSectionDetail?.section;
      if (!section || this.wizardSectionSaving) return;
      this.wizardSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-content-section", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: section.id, ...this.wizardSectionFieldsEditor }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 저장 오류(${response.status})`);
        await this.loadWizardSections({ fresh: true });
        await this.loadWizardSectionDetail(section.id);
        this.setStatus("섹션 정보를 저장했습니다");
      } catch (error) {
        this.setStatus(`섹션 저장 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    async activateWizardSection(id) {
      if (this.wizardSectionSaving) return;
      this.wizardSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-content-section-activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, changeNote: "관리자 페이지에서 활성 버전으로 지정했습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 활성화 오류(${response.status})`);
        await this.loadWizardSections({ fresh: true });
        await this.loadWizardSectionDetail(id);
        if (this.wizardFormTemplateDetail?.template?.id) {
          await this.loadWizardFormTemplateDetail(this.wizardFormTemplateDetail.template.id, { silent: true });
        }
        this.setStatus("섹션을 활성 버전으로 지정했습니다. Wizard에 즉시 반영됩니다.");
      } catch (error) {
        this.setStatus(`섹션 활성화 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    async archiveWizardSection(id) {
      if (this.wizardSectionSaving) return;
      this.wizardSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-content-section-archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, changeNote: "관리자 페이지에서 보관 처리했습니다." }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `섹션 보관 오류(${response.status})`);
        await this.loadWizardSections({ fresh: true });
        this.setStatus("섹션을 보관 처리했습니다 (Wizard에서 즉시 숨겨짐)");
      } catch (error) {
        this.setStatus(`섹션 보관 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    openNewWizardItemEditor() {
      this.wizardItemEditor = {
        id: "",
        componentVersionId: "",
        itemKey: "",
        name: "",
        isVisibleInWizard: true,
        isRequired: false,
        sortOrder: (this.wizardSectionDetail?.items?.length || 0) * 10,
        fieldKind: "text",
        textType: "title",
        image: { allowedSources: [], promptText: "", descriptionEnabled: false, altTextRequired: false, aspectRatio: "", maxSizeKb: "" },
        ctaUtm: { source: "", medium: "", campaign: "", content: "", term: "" },
        isLocked: false,
        lockedValueText: "",
      };
      this.wizardItemEditorOpenId = "new";
    },

    openWizardItemEditor(item) {
      this.wizardItemEditor = {
        id: item.id,
        componentVersionId: item.componentVersionId || "",
        itemKey: item.itemKey,
        name: item.name,
        isVisibleInWizard: item.isVisibleInWizard,
        isRequired: item.isRequired,
        sortOrder: item.sortOrder,
        fieldKind: item.fieldKind,
        textType: item.textType || "title",
        image: item.image
          ? { ...item.image, allowedSources: [...(item.image.allowedSources || [])] }
          : { allowedSources: [], promptText: "", descriptionEnabled: false, altTextRequired: false, aspectRatio: "", maxSizeKb: "" },
        ctaUtm: item.ctaUtm ? { ...item.ctaUtm } : { source: "", medium: "", campaign: "", content: "", term: "" },
        isLocked: item.isLocked,
        lockedValueText: item.lockedValue !== null && item.lockedValue !== undefined
          ? JSON.stringify(item.lockedValue, null, 2)
          : "",
      };
      this.wizardItemEditorOpenId = item.id;
    },

    closeWizardItemEditor() {
      this.wizardItemEditorOpenId = "";
    },

    toggleWizardItemImageSource(source) {
      const sources = this.wizardItemEditor.image.allowedSources;
      const index = sources.indexOf(source);
      if (index >= 0) sources.splice(index, 1);
      else sources.push(source);
    },

    async saveWizardItem() {
      const section = this.wizardSectionDetail?.section;
      if (!section || this.wizardSectionSaving) return;

      let lockedValue = null;
      if (this.wizardItemEditor.isLocked && this.wizardItemEditor.lockedValueText.trim()) {
        try {
          lockedValue = JSON.parse(this.wizardItemEditor.lockedValueText);
        } catch (error) {
          this.setStatus(`고정값 JSON 형식이 올바르지 않습니다: ${error.message}`);
          return;
        }
      }

      this.wizardSectionSaving = true;
      try {
        const response = await fetch("/api/wizard-content-section-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: this.wizardItemEditor.id || undefined,
            sectionId: section.id,
            componentVersionId: this.wizardItemEditor.componentVersionId,
            ...(this.wizardItemEditor.id ? { itemKey: this.wizardItemEditor.itemKey } : {}),
            name: this.wizardItemEditor.name,
            isVisibleInWizard: this.wizardItemEditor.isVisibleInWizard,
            isRequired: this.wizardItemEditor.isRequired,
            sortOrder: Number(this.wizardItemEditor.sortOrder) || 0,
            isLocked: this.wizardItemEditor.isLocked,
            lockedValue,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 저장 오류(${response.status})`);
        await this.loadWizardSectionDetail(section.id);
        this.wizardItemEditorOpenId = "";
        this.setStatus("섹션 컴포넌트를 저장했습니다");
      } catch (error) {
        this.setStatus(`컴포넌트 저장 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    async deleteWizardItem(item) {
      const section = this.wizardSectionDetail?.section;
      if (!section || this.wizardSectionSaving) return;
      this.wizardSectionSaving = true;
      try {
        const response = await fetch(`/api/wizard-content-section-items?id=${encodeURIComponent(item.id)}&sectionId=${encodeURIComponent(section.id)}`, {
          method: "DELETE",
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `컴포넌트 삭제 오류(${response.status})`);
        await this.loadWizardSectionDetail(section.id);
        this.setStatus("섹션 컴포넌트를 삭제했습니다");
      } catch (error) {
        this.setStatus(`컴포넌트 삭제 실패: ${error.message}`);
      } finally {
        this.wizardSectionSaving = false;
      }
    },

    onDesignTokenSectionToggle(sectionKey, event) {
      if (event.target.open) {
        this.activeDesignTokenSectionKey = sectionKey;
      } else if (this.activeDesignTokenSectionKey === sectionKey) {
        this.activeDesignTokenSectionKey = "";
      }
    },

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

    // Design MD module: load, inspect, and register style sources used by the promo builder.
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
      const countByRaw = (group) => this.rawTokenRowsForGroup(doc, group).length;
      const rows = [
        ["color", "Colors", countBySchema("color") || countByRaw("color") || countByGroup("color") || countByType("color")],
        ["typography", "Typography", countBySchema("typography") || countByRaw("typography") || countByGroup("typography") || countByType("fontFamily")],
        ["radius", "Radius", countBySchema("radius") || countByRaw("radius") || countByGroup("radius")],
        ["spacing", "Spacing", countBySchema("spacing") || countByRaw("spacing") || countByGroup("spacing")],
        ["dimension", "Layout / Size", countBySchema("breakpoint") || countByRaw("breakpoint") || countByGroup("dimension") + countByGroup("breakpoint")],
        ["elevation", "Elevation", countBySchema("elevation") || countByRaw("elevation") || countByGroup("shadow") || countByType("shadow")],
        ["component", "Components", summary.componentPatternCount || doc?.componentPatterns?.length || this.rawPatternRows(doc, "component").length || 0],
        ["layout", "Layouts", summary.layoutPatternCount || doc?.layoutPatterns?.length || this.rawPatternRows(doc, "layout").length || 0],
        ["guideline", "Guidelines", summary.guidelineCount || doc?.guidelineItems?.length || this.rawGuidelineRows(doc).length || 0],
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

      const rawRows = this.rawTokenRowsForGroup(doc, groupKey);
      if (rawRows.length) return rawRows;

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

    rawTokenRowsForGroup(doc, groupKey) {
      const rawTokens = doc?.designTokensJson || doc?.rawDesignTokens || {};
      const groupPaths = {
        color: ["color", "colors", "tokens.color", "tokens.colors"],
        typography: ["typography", "typographies", "font", "fontFamily", "tokens.typography"],
        radius: ["radius", "borderRadius", "dimension.radius", "tokens.radius"],
        spacing: ["spacing", "space", "dimension.spacing", "tokens.spacing"],
        elevation: ["elevation", "shadow", "shadows", "tokens.elevation", "tokens.shadow"],
        breakpoint: ["breakpoint", "breakpoints", "dimension.breakpoint", "dimension.breakpoints", "tokens.breakpoint"],
      };
      const groups = (groupPaths[groupKey] || [groupKey])
        .map((path) => ({ path, value: this.valueAtPath(rawTokens, path) }))
        .filter((entry) => entry.value && typeof entry.value === "object" && !Array.isArray(entry.value));

      const rows = groups.flatMap(({ path, value }) => this.rawTokenGroupRows(value, path)).slice(0, 40);
      if (!rows.length && rawTokens.$extends) {
        return [{ key: `${groupKey}.inheritance`, value: `Inherited from ${rawTokens.$extends}` }];
      }
      return rows;
    },

    rawTokenGroupRows(group, pathPrefix = "") {
      if (!group || typeof group !== "object" || Array.isArray(group)) return [];
      const rows = [];
      for (const [key, token] of Object.entries(group)) {
        if (key.startsWith("$")) continue;
        const rowKey = pathPrefix ? `${pathPrefix}.${key}` : key;
        const value = this.formatDesignTokenValue(token);
        if (value && value !== "unknown") rows.push({ key: rowKey, value });
      }
      if (!rows.length && group.$description) {
        rows.push({ key: `${pathPrefix}.$description`, value: this.formatDesignTokenValue(group.$description) });
      }
      if (!rows.length && group.$extensions) {
        rows.push({ key: `${pathPrefix}.$extensions`, value: this.formatDesignTokenValue(group.$extensions) });
      }
      return rows;
    },

    formatDesignTokenValue(value) {
      if (value == null || value === "") return "unknown";
      if (Array.isArray(value)) {
        const items = value.map((item) => this.formatDesignTokenValue(item)).filter(Boolean);
        return items.length ? items.slice(0, 4).join(", ") : "unknown";
      }
      if (typeof value !== "object") return String(value);

      if (value.hex) return String(value.hex);
      if (value.$value?.hex) return String(value.$value.hex);
      if (value.value !== undefined && value.unit) return `${value.value}${value.unit}`;

      const direct = value.$value ?? value.value ?? value.summary ?? value.$description ?? value.description ?? value.role ?? value.pattern ?? value.guideline;
      const type = value.$type || value.type;
      const confidence = value.confidence != null ? `confidence ${value.confidence}` : "";
      const source = value.source ? `source ${value.source}` : "";
      const parts = [direct, type, confidence, source].filter(Boolean).map((item) => {
        if (typeof item === "object") return this.formatDesignTokenValue(item);
        return String(item);
      });
      if (parts.length) return parts.join(" | ");

      const entries = Object.entries(value)
        .filter(([key, entryValue]) => !key.startsWith("$") && entryValue != null && entryValue !== "" && entryValue !== "unknown")
        .slice(0, 4)
        .map(([key, entryValue]) => `${key}: ${this.formatDesignTokenValue(entryValue)}`);
      return entries.length ? entries.join(" | ") : "unknown";
    },

    colorTokenHex(value) {
      const match = String(value || "").match(/#[0-9a-fA-F]{3,8}\b/);
      return match ? match[0] : "";
    },

    patternRows(doc, kind) {
      const items = kind === "component" ? doc?.componentPatterns : doc?.layoutPatterns;
      const normalizedRows = (Array.isArray(items) ? items : [])
        .slice(0, 30)
        .map((item) => ({
          key: item.patternName || item.patternType || item.sectionName || "unknown",
          value: this.formatDesignTokenValue(item.valueJson || item.description || item.sourceText),
        }));
      if (normalizedRows.length) return normalizedRows;
      return this.rawPatternRows(doc, kind);
    },

    guidelineRows(doc) {
      const items = Array.isArray(doc?.guidelineItems) ? doc.guidelineItems : [];
      const normalizedRows = items.slice(0, 30).map((item) => ({
        key: item.guidelineType || item.severity || item.sourcePath || "guideline",
        value: this.formatDesignTokenValue(item.valueJson || item.description || item.sourceText),
      }));
      if (normalizedRows.length) return normalizedRows;
      return this.rawGuidelineRows(doc);
    },

    rawPatternRows(doc, kind) {
      const rawTokens = doc?.designTokensJson || doc?.rawDesignTokens || {};
      const paths = kind === "component"
        ? ["component", "components", "componentStyle", "tokens.component", "patterns.component"]
        : ["layout", "layouts", "composition", "dimension", "shadow", "tokens.layout", "patterns.layout"];
      return paths
        .map((path) => ({ path, value: this.valueAtPath(rawTokens, path) }))
        .filter((entry) => entry.value && typeof entry.value === "object" && !Array.isArray(entry.value))
        .flatMap(({ path, value }) => {
          const description = value.$description || value.description || "";
          const extensions = value.$extensions || value.extensions || null;
          const rows = [];
          if (description) rows.push({ key: `${path}.description`, value: this.formatDesignTokenValue(description) });
          if (extensions) rows.push({ key: `${path}.extensions`, value: this.formatDesignTokenValue(extensions) });
          rows.push(...this.rawTokenGroupRows(value, path));
          return rows;
        })
        .slice(0, 30);
    },

    rawGuidelineRows(doc) {
      const rawTokens = doc?.designTokensJson || doc?.rawDesignTokens || {};
      const rows = [];
      if (rawTokens.$description) rows.push({ key: "$description", value: this.formatDesignTokenValue(rawTokens.$description) });
      if (rawTokens.$extends) rows.push({ key: "$extends", value: `inherits ${rawTokens.$extends}` });
      const collect = (value, path, depth = 0) => {
        if (!value || typeof value !== "object" || Array.isArray(value) || depth > 2 || rows.length >= 30) return;
        if (path && value.$description) rows.push({ key: `${path}.$description`, value: this.formatDesignTokenValue(value.$description) });
        if (path && value.$extensions) rows.push({ key: `${path}.$extensions`, value: this.formatDesignTokenValue(value.$extensions) });
        for (const [key, child] of Object.entries(value)) {
          if (key.startsWith("$")) continue;
          collect(child, path ? `${path}.${key}` : key, depth + 1);
        }
      };
      collect(rawTokens, "", 0);
      return rows.slice(0, 30);
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

    imageGenerationModeLabel(value) {
      const labels = {
        none: "없음",
        generate: "AI 생성",
        upload_or_reference: "참조/업로드",
        brand_asset: "브랜드 자산",
      };
      return labels[value] || "없음";
    },

    sectionStatusLabel(section) {
      if (section.fixedPosition === "top") return "상단 고정";
      if (section.fixedPosition === "bottom") return "하단 고정";
      return section.orderChangeAllowed === false ? "순서 고정" : "순서 변경 가능";
    },

    sectionRequiredLabel(section) {
      if (section.sectionExposure === "required" || section.required) return "필수";
      return "선택";
    },

    // Section config module: B2 edits only visibility and image-generation intent; content values come from promo inputs.
    setSectionVisible(sectionId, visible) {
      this.sectionConfig.sectionVisibility = {
        ...this.sectionConfig.sectionVisibility,
        [sectionId]: Boolean(visible),
      };
      if (visible) this.ensureRequiredItemsVisible(sectionId);
    },

    setItemVisible(sectionId, itemId, visible) {
      const section = templateSections(this.templateSchema).find((item) => (item.sectionId || item.key) === sectionId);
      const schemaItem = (section?.items || []).find((item) => (item.itemId || item.key) === itemId);
      if (schemaItem?.required && this.sectionConfig.sectionVisibility?.[sectionId] !== false && !visible) {
        this.setStatus("필수 아이템은 섹션 사용 중에는 숨길 수 없습니다");
        return;
      }
      this.sectionConfig.itemVisibility = {
        ...this.sectionConfig.itemVisibility,
        [sectionId]: {
          ...(this.sectionConfig.itemVisibility?.[sectionId] || {}),
          [itemId]: Boolean(visible),
        },
      };
    },

    setImageGenerationMode(sectionId, itemId, mode) {
      this.sectionConfig.imageGenerationMode = {
        ...this.sectionConfig.imageGenerationMode,
        [sectionId]: {
          ...(this.sectionConfig.imageGenerationMode?.[sectionId] || {}),
          [itemId]: mode,
        },
      };
    },

    repeatableSectionSets(sectionId) {
      const value = this.sectionInputs?.[sectionId];
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") {
        this.sectionInputs[sectionId] = [value];
        return this.sectionInputs[sectionId];
      }
      this.sectionInputs[sectionId] = [this.defaultRepeatableSet(sectionId)];
      return this.sectionInputs[sectionId];
    },

    defaultRepeatableSet(sectionId) {
      if (sectionId === "stepBar") {
        return { title: "", description: "", ctaLabel: "", link: "", target: "_blank" };
      }
      if (sectionId === "imageTextRow") {
        return { imageText: "", title: "", description: "", visualMode: "auto" };
      }
      return {};
    },

    addRepeatableSet(sectionId) {
      this.repeatableSectionSets(sectionId).push(this.defaultRepeatableSet(sectionId));
      this.sectionInputsDirty = true;
      this.setStatus("세트를 추가했습니다");
    },

    removeRepeatableSet(sectionId, setIndex) {
      const sets = this.repeatableSectionSets(sectionId);
      if (sets.length <= 1) {
        this.setStatus("최소 1개 세트는 필요합니다");
        return;
      }
      sets.splice(setIndex, 1);
      this.sectionInputsDirty = true;
      this.setStatus("세트를 삭제했습니다");
    },

    repeatItemKey(setIndex, itemId) {
      return `${setIndex}.${itemId}`;
    },

    repeatItemVisible(sectionId, setIndex, item) {
      const key = this.repeatItemKey(setIndex, item.itemId);
      return this.sectionConfig.itemVisibility?.[sectionId]?.[key] ?? (item.defaultVisible !== false);
    },

    setRepeatItemVisible(sectionId, setIndex, itemId, visible) {
      const key = this.repeatItemKey(setIndex, itemId);
      this.sectionConfig.itemVisibility = {
        ...this.sectionConfig.itemVisibility,
        [sectionId]: {
          ...(this.sectionConfig.itemVisibility?.[sectionId] || {}),
          [key]: Boolean(visible),
        },
      };
    },

    repeatImageGenerationMode(sectionId, setIndex, item) {
      if (!item.imageGenerationRequest) return "none";
      const key = this.repeatItemKey(setIndex, item.itemId);
      return this.sectionConfig.imageGenerationMode?.[sectionId]?.[key] || "generate";
    },

    setRepeatImageGenerationMode(sectionId, setIndex, itemId, mode) {
      const key = this.repeatItemKey(setIndex, itemId);
      this.sectionConfig.imageGenerationMode = {
        ...this.sectionConfig.imageGenerationMode,
        [sectionId]: {
          ...(this.sectionConfig.imageGenerationMode?.[sectionId] || {}),
          [key]: mode,
        },
      };
    },

    repeatItemInputPath(sectionId, setIndex, item) {
      return `${sectionId}.${setIndex}.${item.inputKey || item.itemId}`;
    },

    repeatImageGenerationTargets(sectionInputs = this.sectionInputs) {
      return this.sectionConfigSections.flatMap((section) => {
        if (!section.repeatableSet || this.sectionConfig.sectionVisibility?.[section.sectionId] === false) return [];
        const sets = Array.isArray(sectionInputs?.[section.sectionId]) ? sectionInputs[section.sectionId] : [];
        return sets.flatMap((_, setIndex) =>
          section.items
            .filter((item) => {
              if (!item.imageGenerationRequest) return false;
              if (!this.repeatItemVisible(section.sectionId, setIndex, item)) return false;
              return this.repeatImageGenerationMode(section.sectionId, setIndex, item) === "generate";
            })
            .map((item) => ({
              sectionId: section.sectionId,
              setIndex,
              itemId: item.itemId,
              label: item.label,
              inputPath: this.repeatItemInputPath(section.sectionId, setIndex, item),
              mode: "generate",
            }))
        );
      });
    },

    sectionInputValue(path) {
      const value = this.valueAtPath(this.sectionInputs, path);
      if (value == null) return "";
      if (typeof value === "object") return value.label || value.text || JSON.stringify(value, null, 2);
      return String(value);
    },

    setSectionInputValue(path, value) {
      const parts = String(path || "").split(".").filter(Boolean);
      if (!parts.length) return;
      let target = this.sectionInputs;
      for (let index = 0; index < parts.length - 1; index += 1) {
        const key = parts[index];
        const nextKey = parts[index + 1];
        if (target[key] == null) target[key] = /^\d+$/.test(nextKey) ? [] : {};
        target = target[key];
      }
      const lastKey = parts[parts.length - 1];
      const current = target?.[lastKey];
      if (current && typeof current === "object" && !Array.isArray(current)) {
        target[lastKey] = { ...current, label: value };
        this.sectionInputsDirty = true;
        return;
      }
      target[lastKey] = value;
      this.sectionInputsDirty = true;
    },

    valueAtPath(source, path) {
      return String(path || "")
        .split(".")
        .filter(Boolean)
        .reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
    },

    ensureRequiredItemsVisible(sectionId) {
      const section = templateSections(this.templateSchema).find((item) => (item.sectionId || item.key) === sectionId);
      if (!section) return;
      const requiredItems = Object.fromEntries(
        (section.items || [])
          .filter((item) => item.required)
          .map((item) => [item.itemId || item.key, true])
      );
      this.sectionConfig.itemVisibility = {
        ...this.sectionConfig.itemVisibility,
        [sectionId]: {
          ...(this.sectionConfig.itemVisibility?.[sectionId] || {}),
          ...requiredItems,
        },
      };
    },

    resetSectionConfig() {
      this.sectionConfig = createDefaultSectionConfig(this.templateSchema);
      this.setStatus("섹션 구성을 기본값으로 되돌렸습니다");
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
      const wasStarted = this.promoBuilderStarted;
      if (!this.promoBuilderStarted) {
        this.resetPromoBuilderState({ rerender: true });
        this.promoBuilderStarted = true;
      }
      this.openPromoBuilderModal();
      this.setStatus(wasStarted ? "프로모션 생성 단계를 이어서 진행합니다" : "프로모션 생성 단계를 시작했습니다");
    },

    openPromoBuilderModal() {
      this.promoBuilderModalOpen = true;
      this.$nextTick(() => {
        if (!this.$refs.promoBuilderModal.open) this.$refs.promoBuilderModal.showModal();
      });
    },

    closePromoBuilder(options = {}) {
      if (this.$refs.promoBuilderModal?.open) this.$refs.promoBuilderModal.close();
      this.onPromoBuilderClosed(options);
    },

    onPromoBuilderClosed(options = {}) {
      this.promoBuilderModalOpen = false;
      if (options.endSession === true) {
        this.promoBuilderStarted = false;
        this.stopGenerationMotion();
      }
    },

    builderStepClass(step) {
      return {
        active: step.step === this.currentBuilderStep,
        done: step.step < this.currentBuilderStep,
      };
    },

    // Builder navigation validates previous steps so direct step clicks cannot skip required inputs.
    validateBuilderStep(step = this.currentBuilderStep) {
      if (step === 1 && !String(this.promo.market || "").trim()) {
        this.validationErrors = { market: true };
        this.setStatus("마켓 / 지역을 선택해 주세요");
        return false;
      }
      if (step === 1) this.validationErrors = {};
      if (step === 2) {
        const isValid = this.validatePromoInputs() && this.validateSectionConfig();
        if (isValid && !this.hasSectionDraft()) this.refreshSectionDraft({ silent: true });
        return isValid;
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
      const nextStep = Math.max(1, Math.min(this.builderSteps.length, step));
      if (nextStep > this.currentBuilderStep && !this.validateBuilderStepsUntil(nextStep)) return;
      this.currentBuilderStep = nextStep;
    },

    nextBuilderStep() {
      if (!this.validateBuilderStep(this.currentBuilderStep)) return;
      this.currentBuilderStep = Math.min(this.builderSteps.length, this.currentBuilderStep + 1);
    },

    prevBuilderStep() {
      this.currentBuilderStep = Math.max(1, this.currentBuilderStep - 1);
    },

    resultType(page) {
      if (!page) return "empty";
      if (page.status === "n8n_failed" || page.errorMessage) return "failed";
      if (page.status === "n8n_ui_design_pending") return "pending";
      if (isDirectImageUrl(page.imageUrl, page)) return "image";
      if (page.finalDesignPreviewUrl) return "final_design";
      if (page.lofiDraftPreviewUrl) return "lofi_draft";
      if (/queued|generating|running|pending|accepted/i.test(page.generationRunStatus || "")) return "pending";
      if (page.designUrl || page.pageUrl || isDesignViewUrl(page.imageUrl)) return "view";
      if (page.payload) return "draft";
      return "empty";
    },

    resultTypeLabel(page) {
      const labels = {
        image: "이미지 생성 완료",
        final_design: "최종 디자인 준비",
        lofi_draft: "LO-FI 초안 준비",
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
        final_design: "최종 디자인 미리보기",
        lofi_draft: "LO-FI 초안 미리보기",
        view: "결과 화면 미리보기",
        pending: "생성 대기 중",
        failed: "오류 확인 필요",
        draft: "로컬 미리보기",
        empty: "산출물 없음",
      };
      return labels[this.resultType(page)] || "산출물 없음";
    },

    previewImageUrl(page) {
      if (isDirectImageUrl(page?.imageUrl, page)) return page.imageUrl;
      if (page?.finalDesignPreviewUrl) return page.finalDesignPreviewUrl;
      return page?.lofiDraftPreviewUrl || "";
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
      const rawCreatedAt = run.created_at || fallback.createdAt || "";
      const rawCommittedAt = imageAsset.created_at || fallback.committedAt || rawCreatedAt;
      const createdAt = rawCreatedAt ? formatKoreaDateTime(rawCreatedAt) : "";
      const committedAt = rawCommittedAt ? formatKoreaDateTime(rawCommittedAt) : createdAt;
      const imageInvalid = isInvalidGeneratedImageAsset(imageAsset);
      const imageFileSize = Number(imageAsset.file_size || 0);

      return {
        id: runKey,
        title: run.promo_title || fallback.title || runKey,
        selectedMd: run.selected_md_name || fallback.selectedMd || "",
        styleSourceLabel: run.style_source_label || fallback.styleSourceLabel || "",
        template: run.template_name || fallback.template || "",
        market: run.market || fallback.market || "",
        createdAt,
        committedAt,
        timestampStamp: timestampStamp(rawCommittedAt || rawCreatedAt || committedAt || createdAt),
        status: run.status || fallback.status || "generated",
        designUrl: designViewUrlForId(runKey),
        imageUrl: designImageUrlForId(runKey),
        pageUrl: designViewUrlForId(runKey),
        layoutMapping: run.layout_mapping || fallback.layoutMapping || null,
        mdComplianceMap: run.md_compliance_map || fallback.mdComplianceMap || null,
        imagePrompt: run.image_prompt || fallback.imagePrompt || "",
        promptGroupId: run.prompt_group_id || imageAsset.prompt_group_id || imageAsset.metadata?.promptGroupId || fallback.promptGroupId || "",
        imageFileSize,
        imageMimeType: imageAsset.mime_type || fallback.imageMimeType || "",
        imageInvalid: imageInvalid || fallback.imageInvalid || false,
        designPromptStorageKey: markdownAssets.find((asset) => asset.asset_type === "design_prompt_markdown")?.storage_key || fallback.designPromptStorageKey || "",
        promoInputStorageKey: markdownAssets.find((asset) => asset.asset_type === "promo_input_markdown")?.storage_key || fallback.promoInputStorageKey || "",
        integratedBriefStorageKey: markdownAssets.find((asset) => asset.asset_type === "integrated_design_brief_markdown")?.storage_key || fallback.integratedBriefStorageKey || "",
        errorMessage: run.error_message || fallback.errorMessage || (imageInvalid ? "저장된 이미지 파일이 유효하지 않습니다. 다시 생성해 주세요." : ""),
        hasOverride: fallback.hasOverride || false,
        resultType: run.result_type || fallback.resultType || "image",
        payload: run.request_payload || fallback.payload || null,
        generationRunId: fallback.generationRunId || "",
        generationRunStatus: fallback.generationRunStatus || "",
        generationRunStage: fallback.generationRunStage || "",
        generationRunUpdatedAt: fallback.generationRunUpdatedAt || "",
        generationPolling: fallback.generationPolling || null,
        lofiDrafts: fallback.lofiDrafts || [],
        confirmedLofiDraft: fallback.confirmedLofiDraft || null,
        currentLofiDraft: fallback.currentLofiDraft || null,
        lofiDraftPreviewUrl: fallback.lofiDraftPreviewUrl || "",
        finalDesigns: fallback.finalDesigns || [],
        currentFinalDesign: fallback.currentFinalDesign || null,
        finalDesignPreviewUrl: fallback.finalDesignPreviewUrl || "",
      };
    },

    generationRunStateToPage(state, fallback = {}) {
      const run = state?.run || {};
      const inputSnapshot = run.inputSnapshot || {};
      const promo = inputSnapshot.promo || {};
      const md = inputSnapshot.md || {};
      const createdAt = run.createdAt ? formatKoreaDateTime(run.createdAt) : fallback.createdAt || "";
      const page = {
        id: run.runKey || fallback.id || run.runId || "",
        title: run.promoTitle || promo.title || fallback.title || run.runKey || "",
        selectedMd: run.selectedMdName || md.brand || md.name || fallback.selectedMd || "",
        styleSourceLabel: inputSnapshot.styleSourceLabel || fallback.styleSourceLabel || "",
        template: promo.template || inputSnapshot.template?.templateName || fallback.template || "",
        market: promo.market || fallback.market || "",
        createdAt,
        committedAt: fallback.committedAt || "",
        timestampStamp: timestampStamp(run.updatedAt || run.createdAt || createdAt),
        status: fallback.status || run.status || "generation_run",
        designUrl: fallback.designUrl || "",
        imageUrl: fallback.imageUrl || "",
        pageUrl: fallback.pageUrl || "",
        layoutMapping: fallback.layoutMapping || null,
        mdComplianceMap: fallback.mdComplianceMap || null,
        imagePrompt: fallback.imagePrompt || "",
        promptGroupId: fallback.promptGroupId || "",
        imageFileSize: fallback.imageFileSize || 0,
        imageMimeType: fallback.imageMimeType || "",
        imageInvalid: fallback.imageInvalid || false,
        designPromptStorageKey: fallback.designPromptStorageKey || "",
        promoInputStorageKey: fallback.promoInputStorageKey || "",
        integratedBriefStorageKey: fallback.integratedBriefStorageKey || "",
        errorMessage: run.errorMessage || fallback.errorMessage || "",
        hasOverride: fallback.hasOverride || false,
        resultType: fallback.resultType || "generation_run",
        payload: inputSnapshot || fallback.payload || null,
      };
      this.applyGenerationRunStateToPage(page, state);
      return page;
    },

    applyGenerationRunStateToPage(page, state) {
      const run = state?.run || {};
      const drafts = Array.isArray(state?.drafts) ? state.drafts : [];
      const finalDesigns = Array.isArray(state?.finalDesigns) ? state.finalDesigns : [];
      const confirmedDraft = state?.confirmedDraft || null;
      const readyDrafts = drafts.filter((draft) => (
        ["ready", "completed"].includes(String(draft.status || ""))
        && draft.imageProxyAvailable !== false
      ));
      const currentDraft = confirmedDraft || readyDrafts[readyDrafts.length - 1] || drafts[drafts.length - 1] || null;
      const currentDraftReady = ["ready", "completed"].includes(String(currentDraft?.status || ""))
        && currentDraft?.imageProxyAvailable !== false;
      const previewDraft = currentDraftReady ? currentDraft : readyDrafts[readyDrafts.length - 1] || null;
      const currentFinalDesign = finalDesigns[0] || null;
      const currentFinalDesignReady = ["ready", "completed"].includes(String(currentFinalDesign?.status || ""))
        && currentFinalDesign?.imageProxyAvailable !== false;
      const readyFinalDesigns = finalDesigns.filter((finalDesign) => (
        ["ready", "completed"].includes(String(finalDesign.status || ""))
        && finalDesign.imageProxyAvailable !== false
      ));
      const previewFinalDesign = currentFinalDesignReady ? currentFinalDesign : readyFinalDesigns[0] || null;

      Object.assign(page, {
        generationRunId: run.runId || page.generationRunId || "",
        generationRunStatus: run.status || "",
        generationRunStage: run.stage || "",
        generationRunUpdatedAt: run.updatedAt || page.generationRunUpdatedAt || "",
        generationPolling: generationPollingState(run),
        lofiDrafts: drafts,
        confirmedLofiDraft: confirmedDraft,
        currentLofiDraft: currentDraft,
        lofiDraftPreviewUrl: previewDraft ? lofiDraftImageUrlForId(previewDraft.draftId) : "",
        finalDesigns,
        currentFinalDesign,
        finalDesignPreviewUrl: previewFinalDesign ? finalDesignImageUrlForId(previewFinalDesign.finalDesignId) : "",
      });
      return page;
    },

    currentLofiDraft(page) {
      return page?.currentLofiDraft || page?.confirmedLofiDraft || null;
    },

    isReadyLofiDraft(draft) {
      return ["ready", "completed"].includes(String(draft?.status || ""));
    },

    canConfirmLofiDraft(page) {
      const draft = this.currentLofiDraft(page);
      return Boolean(draft?.draftId && this.isReadyLofiDraft(draft) && !draft.confirmedAt);
    },

    canRetryLofiDraft(page) {
      if (!page?.generationRunId || page.confirmedLofiDraft) return false;
      const draft = this.currentLofiDraft(page);
      const draftStatus = String(draft?.status || "");
      const finalStatus = String(page?.currentFinalDesign?.status || "");
      const draftActive = /queued|generating|running|pending/i.test(draftStatus);
      const finalActive = /queued|generating|running|pending/i.test(finalStatus);
      return Boolean(draft?.draftId && !draftActive && !finalActive);
    },

    lofiDraftRetryLabel(page) {
      const draft = this.currentLofiDraft(page);
      const nextAttempt = Number(draft?.draftAttempt || 0) + 1;
      return nextAttempt > 1 ? `초안 재시도 #${nextAttempt}` : "초안 재시도";
    },

    lofiDraftConfirmLabel(page) {
      const draft = this.currentLofiDraft(page);
      if (draft?.confirmedAt) return "확정됨";
      return "초안 확정";
    },

    lofiDraftStatusLabel(draft) {
      const labels = {
        queued: "대기",
        ready: "준비 완료",
        completed: "준비 완료",
        failed: "실패",
        trigger_failed: "Worker 시작 실패",
      };
      return labels[String(draft?.status || "")] || draft?.status || "";
    },

    finalDesignStatusLabel(finalDesign) {
      const labels = {
        queued: "대기",
        ready: "준비 완료",
        completed: "준비 완료",
        failed: "실패",
        trigger_failed: "Worker 시작 실패",
      };
      return labels[String(finalDesign?.status || "")] || finalDesign?.status || "";
    },

    canGenerateFinalDesign(page) {
      const draft = page?.confirmedLofiDraft;
      const finalDesign = page?.currentFinalDesign;
      const finalStatus = String(finalDesign?.status || "");
      const finalActive = /queued|generating|running|pending/i.test(finalStatus);
      return Boolean(draft?.draftId && !finalActive);
    },

    finalDesignActionLabel(page) {
      const finalDesign = page?.currentFinalDesign;
      if (!finalDesign) return "최종 디자인 생성";
      const status = String(finalDesign.status || "");
      if (/queued|generating|running|pending/i.test(status)) return "최종 생성 중";
      if (["ready", "completed"].includes(status)) return "최종 재생성";
      return "최종 디자인 생성";
    },

    async confirmLofiDraft(page) {
      const draft = this.currentLofiDraft(page);
      if (!draft?.draftId) {
        this.setStatus("확정할 LO-FI 초안이 없습니다");
        return;
      }
      if (!this.isReadyLofiDraft(draft)) {
        this.setStatus("준비 완료된 LO-FI 초안만 확정할 수 있습니다");
        return;
      }

      try {
        const response = await fetch("/api/promo-generation-lofi-draft-confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftId: draft.draftId }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `Confirm ${response.status}`);
        this.applyGenerationRunStateToPage(page, result.state || result);
        this.syncGenerationRunPolling();
        this.setStatus(`LO-FI 초안 #${draft.draftAttempt || ""}을 확정했습니다`);
      } catch (error) {
        this.setStatus(`LO-FI 초안 확정 실패: ${error.message}`);
      }
    },

    async retryLofiDraft(page) {
      if (!this.canRetryLofiDraft(page)) {
        this.setStatus("현재 상태에서는 LO-FI 초안을 다시 생성할 수 없습니다");
        return;
      }

      try {
        const response = await fetch("/api/promo-generation-lofi-drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            runId: page.generationRunId || page.id,
            triggerWorker: true,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || result.workerTrigger?.error || `LO-FI draft ${response.status}`);
        await this.refreshGenerationRunState(page).catch(() => false);
        this.syncGenerationRunPolling();
        this.setStatus("새 LO-FI 초안 생성을 요청했습니다");
      } catch (error) {
        await this.refreshGenerationRunState(page).catch(() => false);
        this.syncGenerationRunPolling();
        this.setStatus(`LO-FI 초안 재시도 실패: ${error.message}`);
      }
    },

    async generateFinalDesign(page) {
      const confirmedDraft = page?.confirmedLofiDraft;
      if (!confirmedDraft?.draftId) {
        this.setStatus("최종 디자인 생성 전에 LO-FI 초안을 확정해 주세요");
        return;
      }

      try {
        const response = await fetch("/api/promo-generation-final-designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            runId: page.generationRunId || page.id,
            confirmedDraftId: confirmedDraft.draftId,
            triggerWorker: true,
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || result.workerTrigger?.error || `Final design ${response.status}`);
        await this.refreshGenerationRunState(page).catch(() => false);
        this.syncGenerationRunPolling();
        this.setStatus("최종 디자인 생성을 요청했습니다");
      } catch (error) {
        await this.refreshGenerationRunState(page).catch(() => false);
        this.syncGenerationRunPolling();
        this.setStatus(`최종 디자인 생성 요청 실패: ${error.message}`);
      }
    },

    async refreshGenerationRunState(page) {
      if (!page?.id || window.location.protocol === "file:") return false;

      const response = await fetch(`/api/promo-generation-runs?runId=${encodeURIComponent(page.generationRunId || page.id)}`);
      const result = await response.json().catch(() => ({}));
      if (response.status === 404) return false;
      if (!response.ok) throw new Error(result.message || result.error || `Generation run ${response.status}`);
      this.applyGenerationRunStateToPage(page, result);
      return true;
    },

    async refreshGenerationRunStates(pages) {
      const targets = (pages || []).filter((page) => page?.id).slice(0, 20);
      await Promise.all(targets.map((page) => this.refreshGenerationRunState(page).catch(() => false)));
    },

    generationRunNeedsPolling(page) {
      if (!page?.generationRunId) return false;
      page.generationPolling = generationPollingState({
        stage: page.generationRunStage,
        status: page.generationRunStatus,
        updatedAt: page.generationRunUpdatedAt,
      });
      const polling = page.generationPolling || {};
      if (polling.isStale) return false;

      const statuses = [
        page.generationRunStatus,
        page.currentLofiDraft?.status,
        page.currentFinalDesign?.status,
      ].map((value) => String(value || ""));
      return statuses.some((status) => /queued|generating|running|pending|accepted/i.test(status));
    },

    syncGenerationRunPolling() {
      const shouldPoll = this.generatedPages.some((page) => this.generationRunNeedsPolling(page));
      if (shouldPoll) {
        this.startGenerationRunPolling();
      } else {
        this.stopGenerationRunPolling();
      }
    },

    startGenerationRunPolling() {
      if (this.generationRunPollingTimer || window.location.protocol === "file:") return;
      this.generationRunPollingTimer = window.setInterval(() => {
        this.pollActiveGenerationRuns();
      }, 5000);
    },

    stopGenerationRunPolling() {
      if (!this.generationRunPollingTimer) return;
      window.clearInterval(this.generationRunPollingTimer);
      this.generationRunPollingTimer = null;
    },

    async pollActiveGenerationRuns() {
      const activePages = this.generatedPages.filter((page) => this.generationRunNeedsPolling(page));
      if (!activePages.length) {
        this.stopGenerationRunPolling();
        return;
      }
      await Promise.all(activePages.map((page) => this.refreshGenerationRunState(page).catch(() => false)));
      this.syncGenerationRunPolling();
    },

    async loadGenerationRunPages(options = {}) {
      const params = new URLSearchParams({ limit: "50" });
      if (options.fresh) params.set("ts", String(Date.now()));
      const response = await fetch(`/api/promo-generation-runs?${params.toString()}`);
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.error || `Generation runs ${response.status}`);
      return (result.runs || [])
        .map((state) => this.generationRunStateToPage(state))
        .filter((page) => page.id);
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
        const generationPages = await this.loadGenerationRunPages(options).catch(() => []);
        const generationById = new Map(generationPages.map((page) => [page.id, page]));
        for (const page of serverPages) {
          const generationPage = generationById.get(page.id);
          if (generationPage) {
            this.applyGenerationRunStateToPage(page, {
              run: {
                runId: generationPage.generationRunId,
                status: generationPage.generationRunStatus,
                stage: generationPage.generationRunStage,
                updatedAt: generationPage.generationRunUpdatedAt,
                polling: generationPage.generationPolling,
              },
              drafts: generationPage.lofiDrafts,
              confirmedDraft: generationPage.confirmedLofiDraft,
            });
            generationById.delete(page.id);
          }
        }
        const serverIds = new Set(serverPages.map((page) => page.id));
        const generationIds = new Set(generationById.keys());
        const preserveIds = new Set(options.preserveIds || []);
        const transientPages = this.generatedPages.filter((page) => (
          page.status === "n8n_ui_design_pending"
          || page.status === "n8n_failed"
          || (preserveIds.has(page.id) && !serverIds.has(page.id))
        ));
        this.generatedPages = [
          ...transientPages.filter((page) => !serverIds.has(page.id) && !generationIds.has(page.id)),
          ...Array.from(generationById.values()).filter((page) => !serverIds.has(page.id)),
          ...serverPages,
        ];
        await this.refreshGenerationRunStates(this.generatedPages);
        this.syncGenerationRunPolling();
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

    startAdminResize(event) {
      const layout = event.currentTarget.closest(".admin-ab-layout");
      if (!layout) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      this.adminResizeState = {
        startX: event.clientX,
        startWidths: [...this.adminSectionWidths],
        totalWidth: layout.getBoundingClientRect().width,
      };
      document.body.classList.add("is-resizing");
    },

    onAdminResizeMove(event) {
      if (!this.adminResizeState) return;
      const deltaPercent = ((event.clientX - this.adminResizeState.startX) / this.adminResizeState.totalWidth) * 100;
      const next = [
        this.adminResizeState.startWidths[0] + deltaPercent,
        this.adminResizeState.startWidths[1] - deltaPercent,
      ];
      const min = 25;
      if (next[0] < min || next[1] < min) return;
      this.adminSectionWidths = next;
    },

    stopAdminResize() {
      if (!this.adminResizeState) return;
      this.adminResizeState = null;
      document.body.classList.remove("is-resizing");
    },

    setStatus(message) {
      this.status = message;
    },

    fieldClass(key) {
      return { "field-invalid": Boolean(this.validationErrors[key]) };
    },

    fieldError(key) {
      return this.validationErrors[key] ? "입력해 주세요." : "";
    },

    clearResolvedValidationErrors() {
      if (!Object.keys(this.validationErrors).length) return;
      const next = { ...this.validationErrors };
      const hasValue = (source, key) => String(source?.[key] || "").trim();
      const checks = {
        title: hasValue(this.promo, "title"),
        promotionPurpose: hasValue(this.promo, "promotionPurpose"),
        promotionPurposeOther:
          this.promo.promotionPurpose !== "기타" || hasValue(this.promo, "promotionPurposeOther"),
        market: hasValue(this.promo, "market"),
        audience: hasValue(this.simpleBrief, "audience"),
        campaignTone: hasValue(this.simpleBrief, "campaignTone"),
      };
      for (const [key, resolved] of Object.entries(checks)) {
        if (resolved) delete next[key];
      }
      this.validationErrors = next;
    },

    clearPromoInputs() {
      this.resetPromoBuilderState();
      this.setStatus("프로모션 입력값을 초기화했습니다");
    },

    resetPromoBuilderState(options = {}) {
      this.promo = {
        title: "",
        template: "AI Auto",
        promotionPurpose: "",
        promotionPurposeOther: "",
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
      this.validationErrors = {};
      this.designMode = "ai";
      this.inputMode = "simple";
      this.generationMode = "ai_agent";
      this.globalVisualMode = "auto";
      this.currentBuilderStep = 1;
      this.sectionInputs = createEmptyTemp4Inputs();
      this.sectionInputsDirty = false;
      this.sectionConfig = createDefaultSectionConfig(this.templateSchema);
      this.stopGenerationMotion();
      if (options.rerender) this.promoBuilderSessionKey += 1;
    },

    autoFillPromoInputs() {
      const fixture = createDefaultTempPdfAutoFill();
      this.promo = {
        ...this.promo,
        ...fixture.promo,
        template: this.designMode === "advanced" ? "default_temp" : "AI Auto",
      };
      this.simpleBrief = { ...fixture.simpleBrief };
      this.inputMode = this.designMode === "advanced" ? "advanced" : "simple";
      this.generationMode = this.designMode === "advanced" ? "template_advanced" : "ai_agent";
      this.globalVisualMode = "auto";
      this.promoBuilderStarted = true;
      this.currentBuilderStep = 2;
      this.sectionInputs = JSON.parse(JSON.stringify(fixture.sectionInputs));
      this.sectionInputsDirty = true;
      this.setStatus("Default Temp PDF 기준 프로모션 입력값을 자동등록했습니다");
    },

    openAddDesign() {
      this.newMd = {
        id: "",
        designStyleName: "",
        brandName: "",
        slug: "",
        text: "",
        sourceName: "",
        tokenText: "",
        tokenFileName: "",
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
      this.newMd.designStyleName = designStyleNameFromFileName(file.name);
      this.newMd.brandName = this.newMd.designStyleName;
      this.newMd.slug = slugify(this.newMd.designStyleName);
      this.setStatus("MD 파일을 불러왔습니다");
    },

    async onTokenFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.newMd.tokenText = await file.text();
      this.newMd.tokenFileName = file.name;
      this.setStatus("디자인 토큰 파일을 불러왔습니다");
    },

    async registerMarkdown() {
      const markdown = this.newMd.text.trim();
      if (!markdown) {
        this.setStatus("MD 파일을 선택해 주세요");
        return;
      }
      if (!this.newMd.tokenText.trim()) {
        this.setStatus("디자인 토큰 파일을 선택해 주세요");
        return;
      }

      const designStyleName = this.newMd.designStyleName.trim() || designStyleNameFromFileName(this.newMd.sourceName);
      const slug = this.newMd.slug.trim() || slugify(designStyleName);
      if (window.location.protocol !== "file:") {
        const isEdit = Boolean(this.newMd.id);
        this.setStatus(isEdit ? "디자인 스타일을 수정 중입니다" : "디자인 스타일을 저장 중입니다");
        try {
          const response = await fetch(isEdit ? `/api/design-document?id=${encodeURIComponent(this.newMd.id)}` : "/api/register-design-md", {
            method: isEdit ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              designStyleName,
              brandName: designStyleName,
              slug,
              rawMarkdown: markdown,
              designMdMarkdown: markdown,
              sourceName: this.newMd.sourceName,
              designMdFileName: this.newMd.sourceName,
              designTokenFileName: this.newMd.tokenFileName,
              rawDesignTokensJson: this.newMd.tokenText,
            }),
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.message || payload.error || `Register ${response.status}`);
          const doc = payload.document;
          this.closeAddDesign();
          await this.loadDesignDocuments({ fresh: true });
          this.selectDocument(doc.id);
          this.setStatus(isEdit ? "디자인 스타일 수정이 완료되었습니다" : "디자인 스타일 추가가 완료되었습니다");
          return;
        } catch (error) {
          this.setStatus(`등록 실패: ${error.message}`);
          return;
        }
      }

      const doc = createDoc({
        id: `doc-${String(this.designDocuments.length + 1).padStart(3, "0")}`,
        brandId: `brand-${slug}`,
        brandName: designStyleName,
        slug,
        markdown,
        sourceName: this.newMd.sourceName,
        designTokenFileName: this.newMd.tokenFileName,
        designTokensJson: safeParseJson(this.newMd.tokenText || "{}"),
        status: "uploaded",
        updatedAt: nowText(),
      });

      this.designDocuments.unshift(doc);
      this.selectDocument(doc.id);
      saveJson(storageKeys.documents, this.designDocuments);
      this.setStatus("디자인 스타일이 등록되었습니다");
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
        designStyleName: this.detailDoc.designStyleName || this.detailDoc.brandName,
        brandName: this.detailDoc.designStyleName || this.detailDoc.brandName,
        slug: this.detailDoc.slug,
        text: this.detailDoc.markdown || "",
        sourceName: this.detailDoc.sourceName || "DESIGN.md",
        tokenText: JSON.stringify(this.detailDoc.designTokensJson || this.detailDoc.rawDesignTokens || {}, null, 2),
        tokenFileName: this.detailDoc.designTokenFileName || "tokens.json",
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

    // Section draft module: derive template inputs from the compact promo form instead of exposing a separate draft step.
    refreshSectionDraft(options = {}) {
      const visualModes = {
        heroBanner: this.sectionInputs?.heroBanner?.visualMode || "auto",
        contentCta: this.sectionInputs?.contentCta?.visualMode || "auto",
        imageTextRow: this.sectionInputs?.imageTextRow?.[0]?.visualMode || "auto",
      };
      this.sectionInputs = buildTemp4Draft({
        promo: this.promo,
        simpleBrief: this.simpleBrief,
        selectedDocument: this.selectedDocument,
        visualMode: "auto",
      });
      this.sectionInputs.heroBanner.visualMode = visualModes.heroBanner;
      this.sectionInputs.contentCta.visualMode = visualModes.contentCta;
      if (Array.isArray(this.sectionInputs.imageTextRow) && this.sectionInputs.imageTextRow[0]) {
        this.sectionInputs.imageTextRow[0].visualMode = visualModes.imageTextRow;
      }
      this.promo.leadText = this.simpleBrief.mainOffer || this.sectionInputs.heroBanner.sublineText;
      this.promo.subline = this.simpleBrief.secondaryMessage || this.sectionInputs.contentCta.longText;
      this.promo.template = this.designMode === "advanced" ? "default_temp" : "AI Auto";
      if (!options.silent) this.setStatus("섹션 입력값을 갱신했습니다");
      this.sectionInputsDirty = false;
    },

    hasSectionDraft() {
      const hasDraftTitle = String(this.sectionInputs.heroBanner.title || "").trim();
      const hasDraftOffer = String(this.sectionInputs.contentCta.longText || "").trim();
      return Boolean(hasDraftTitle || hasDraftOffer);
    },

    sectionInputsForPayload() {
      if (!this.sectionInputsDirty && (this.inputMode === "simple" || (!this.hasSectionDraft() && String(this.promo.title || "").trim()))) {
        this.refreshSectionDraft({ silent: true });
      }
      return JSON.parse(JSON.stringify(this.sectionInputs));
    },

    // Payload builder: this is the contract shared by frontend, markdown builders, prompts, and n8n.
    buildGeneratedPayload(pageId) {
      const source = this.sourceStyle;
      const designDoc = this.selectedDesignDataSource || this.selectedDocument;
      const sectionInputs = this.sectionInputsForPayload();
      const templateRuntime = buildTemplateRuntime(this.templateSchema, this.sectionConfig);
      const repeatImageGenerationTargets = this.repeatImageGenerationTargets(sectionInputs);
      const imageGenerationTargets = [
        ...templateRuntime.imageGenerationTargets,
        ...repeatImageGenerationTargets,
      ];
      const sectionConfig = {
        ...JSON.parse(JSON.stringify(this.sectionConfig)),
        fixedSections: Object.fromEntries(templateRuntime.fixedSections.map((section) => [section.sectionId, section.fixedPosition])),
        imageGenerationTargets,
        repeatableSets: Object.fromEntries(
          this.sectionConfigSections
            .filter((section) => section.repeatableSet)
            .map((section) => [section.sectionId, section.repeatableSet])
        ),
      };
      const fallbackCtaLabel = sectionInputs.heroBanner?.cta?.label
        || sectionInputs.contentCta?.cta?.label
        || sectionInputs.stepBar?.[0]?.ctaLabel
        || "Learn More";
      const fallbackCtaUrl = sectionInputs.heroBanner?.cta?.link
        || sectionInputs.contentCta?.cta?.link
        || sectionInputs.stepBar?.[0]?.link
        || "#";
      const fallbackTermsText = sectionInputs.titleDescription?.contents
        || sectionInputs.footer?.content
        || "Terms and conditions apply. Please play responsibly.";
      const promoCompat = {
        ...this.promo,
        template: this.promo.template,
        leadText: this.promo.leadText || sectionInputs.heroBanner.sublineText || this.simpleBrief.mainOffer,
        subline: this.promo.subline || sectionInputs.contentCta.longText || this.simpleBrief.secondaryMessage,
        alphaText: this.promo.alphaText || sectionInputs.heroBanner.alphaText,
        ctaLabel: this.promo.ctaLabel || fallbackCtaLabel,
        ctaUrl: this.promo.ctaUrl || fallbackCtaUrl,
        termsText: this.promo.termsText || fallbackTermsText,
      };
      const promotionInput = {
        purpose: this.promo.promotionPurpose || this.promo.purpose || "",
        purposeOther: this.promo.promotionPurposeOther || "",
        targetCustomer: this.simpleBrief.audience || "",
        campaignTone: this.simpleBrief.campaignTone || "",
      };
      const marketVisualGuidance = marketVisualGuidanceFor(this.promo.market);
      return {
        id: pageId,
        model: generationModels.text,
        imageModel: generationModels.image,
        generatedAt: nowText(),
        md: {
          id: designDoc.id,
          brand: designDoc.brandName,
          designStyleId: designDoc.id,
          designStyleName: designDoc.designStyleName || designDoc.brandName,
          slug: designDoc.slug,
          summary: designDoc.summary,
          designMdMarkdown: designDoc.markdown || "",
          designTokenFileName: designDoc.designTokenFileName || "",
          selectedTokens: designDoc.designTokensJson || designDoc.rawDesignTokens || {},
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
        selectedDesignStyleId: designDoc.id,
        promo: promoCompat,
        promotionInput,
        marketVisualGuidance,
        sectionConfig,
        template: {
          id: this.templateSchema.id,
          name: this.templateSchema.name,
          designMode: this.designMode,
          selectionMode: this.designMode === "advanced" ? "manual" : "auto",
          selectedTemplateId: this.designMode === "advanced" ? "default_temp" : "",
          templateId: templateRuntime.templateId,
          templateName: templateRuntime.templateName,
          schemaVersion: templateRuntime.schemaVersion,
          generationMode: this.generationMode,
          inputMode: this.inputMode,
          sectionOrder: templateRuntime.orderedSections,
          visibleSections: templateRuntime.visibleSections,
          sectionVisibility: templateRuntime.sectionVisibility,
          itemVisibility: templateRuntime.itemVisibility,
          fixedSections: templateRuntime.fixedSections,
          draggableSections: templateRuntime.draggableSections,
          imageGenerationTargets,
          governance: templateRuntime.governance,
          promotionInputSchema: templateRuntime.promotionInputSchema,
          templateForm: templateRuntime.templateForm,
          generationRules: templateRuntime.generationRules,
          validationRules: templateRuntime.validationRules,
          progress: templateRuntime.progress,
        },
        simpleBrief: { ...this.simpleBrief },
        sectionInputs,
        design: {
          ...this.finalStyle,
          canvasColor: "#000000",
          pageBackgroundColor: "#000000",
          backgroundPolicy: "full_bleed_pure_black_no_gray_artboard",
        },
        selectedDesignTokens: { ...this.finalStyle },
        sourceDesign: { ...source },
        styleSource: this.styleSource,
        styleSourceLabel: this.styleSourceLabel(),
        companyPreset: this.styleSource === "company_default" ? this.selectedPreset.name : null,
        hasOverride: this.hasOverride(this.finalStyle, source),
        inputSnapshot: {
          promo: promoCompat,
          promotionInput,
          marketVisualGuidance,
          simpleBrief: { ...this.simpleBrief },
          sectionInputs,
          sectionConfig,
          templateRuntime,
        },
      };
    },

    // Validation module: fail fast before the expensive n8n workflow starts.
    validatePromoInputs() {
      this.validationErrors = {};
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
        ["title", "프로모션 제목", this.promo],
        ["promotionPurpose", "프로모션 목적", this.promo],
        ["market", "마켓 / 지역", this.promo],
      ];
      const missingEntries = required.filter(([key, , source]) => !String(source[key] || "").trim());
      if (this.promo.promotionPurpose === "기타" && !String(this.promo.promotionPurposeOther || "").trim()) {
        missingEntries.push(["promotionPurposeOther", "기타 목적", this.promo]);
      }
      const simpleMissing = [
        ["audience", "대상 고객", this.simpleBrief],
        ["campaignTone", "캠페인 톤", this.simpleBrief],
      ]
        .filter(([key, , source]) => !String(source[key] || "").trim());
      const allMissingEntries = [...missingEntries, ...simpleMissing];
      const allMissing = allMissingEntries.map(([, label]) => label);
      if (allMissing.length) {
        this.validationErrors = Object.fromEntries(allMissingEntries.map(([key]) => [key, true]));
        this.setStatus(`필수 입력 누락: ${allMissing.slice(0, 2).join(", ")}${allMissing.length > 2 ? "..." : ""}`);
        return false;
      }
      this.validationErrors = {};
      return true;
    },

    validateSectionConfig() {
      const missing = [];
      for (const section of this.sectionConfigSections) {
        if (!section.visible) continue;
        for (const item of section.items) {
          if (item.required && item.visible === false) {
            missing.push(`${section.name} / ${item.label}`);
          }
        }
      }
      if (missing.length) {
        this.setStatus(`필수 섹션 아이템 누락: ${missing[0]}`);
        return false;
      }
      return true;
    },

    // n8n client: browser builds use the local API proxy so webhook URL policy stays server-side.
    async triggerN8n(payload) {
      const useProxy = window.location.protocol !== "file:";
      const requestUrl = useProxy ? "/api/generate-ui-design" : "";
      if (!requestUrl) throw new Error("로컬 파일 모드에서는 서버 Webhook 설정을 사용할 수 없습니다");

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

    // Generation motion is intentionally indeterminate because the n8n workflow does not stream real progress.
    startGenerationMotion() {
      this.stopGenerationMotion();
      this.isGeneratingDesign = true;
      this.generationStatusIndex = 0;
      this.generationStatusTimer = window.setInterval(() => {
        this.generationStatusIndex += 1;
      }, 2600);
    },

    stopGenerationMotion() {
      if (this.generationStatusTimer) {
        window.clearInterval(this.generationStatusTimer);
        this.generationStatusTimer = null;
      }
      this.isGeneratingDesign = false;
    },

    // Result recovery lets the UI handle slow webhook responses when the backend has already stored the design.
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

    // Generation orchestrator: validates, submits the workflow, recovers stored results, and updates C section.
    async generateUiDesign() {
      if (this.isGeneratingDesign) return;
      if (!this.selectedDocument) {
        this.setStatus("먼저 MD를 선택해 주세요");
        return;
      }
      if (!this.validatePromoInputs()) return;
      if (!this.validateSectionConfig()) return;
      await this.loadSelectedDesignDetail(this.selectedDocumentId);

      const pageId = createRunKey();
      const payload = this.buildGeneratedPayload(pageId);
      const initialStamp = timestampStamp(payload.generatedAt);
      const willUseN8n = true;
      this.setStatus(willUseN8n ? "AI가 요청 사항을 접수 중입니다" : "로컬에서 UI 디자인을 생성했습니다");
      this.startGenerationMotion();
      await this.$nextTick();
      await new Promise((resolve) => {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(resolve);
        } else {
          window.setTimeout(resolve, 0);
        }
      });

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
        generationRunId: "",
        generationRunStatus: "",
        generationRunStage: "",
        generationPolling: null,
        lofiDrafts: [],
        confirmedLofiDraft: null,
        currentLofiDraft: null,
        lofiDraftPreviewUrl: "",
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
          this.currentBuilderStep = this.builderSteps.length;
          this.setStatus("n8n 응답은 지연됐지만 저장된 UI 디자인을 확인했습니다");
          this.stopGenerationMotion();
          this.closePromoBuilder({ endSession: true });
          if (listItem.pageUrl) window.open(listItem.pageUrl, "_blank");
          return;
        }

        listItem.status = "n8n_failed";
        listItem.errorMessage = error.message;
        this.setStatus(`n8n 실행 실패. 서버 저장 결과를 확인하지 못했습니다: ${error.message}`);
        this.stopGenerationMotion();
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
      const rawCommittedAt = n8nResult?.committedAt || listItem.committedAt;
      listItem.committedAt = rawCommittedAt ? formatKoreaDateTime(rawCommittedAt) : listItem.committedAt;
      listItem.timestampStamp = n8nResult?.timestampStamp || timestampStamp(rawCommittedAt || listItem.createdAt);
      listItem.payload = n8nResult?.payload || payload;
      await this.waitForStoredDesignResult(listItem, { attempts: 5, delayMs: 900 }).catch(() => false);
      await this.loadGeneratedPagesFromServer({ silent: true, fresh: true, preserveIds: [listItem.id] });

      this.currentBuilderStep = this.builderSteps.length;
      this.setStatus(n8nResult ? "n8n UI 디자인 생성이 완료되었습니다" : "로컬 UI 디자인 생성이 완료되었습니다");
      this.stopGenerationMotion();
      this.closePromoBuilder({ endSession: true });
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
      const imageUrl = this.previewImageUrl(page);
      if (imageUrl) {
        window.open(imageUrl, "_blank");
        return;
      }
      saveJson(storageKeys.generatedPage, page.payload);
      window.open("generated.html", "_blank");
    },

    canOpenPromptFiles(page) {
      return Boolean(
        page?.promptGroupId
        || page?.designPromptStorageKey
        || page?.promoInputStorageKey
        || page?.integratedBriefStorageKey
        || (page?.id && !page?.generationRunId)
      );
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
});
adminApp.component("template-layout-manager", window.PromoAdminTemplateLayout.component);
adminApp.component("design-token-manager", window.PromoAdminDesignTokens.component);
const localeReady = window.PromoI18n?.init?.() || Promise.resolve();
localeReady.finally(() => adminApp.mount("#app"));

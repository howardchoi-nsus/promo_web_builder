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
  themeMode: "promoPrototype.themeMode",
};

const generationModels = {
  text: "gpt-4o-mini",
  image: "gemini-3.1-flash-image",
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

createApp({
  data() {
    return {
      status: "준비 완료",
      currentView: "builder",
      sectionWidths: [30, 30, 40],
      resizeState: null,
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
      n8nWebhookUrl: localStorage.getItem(storageKeys.n8nWebhookUrl) || "",
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
      promptEditor: {
        name: "",
        body: "",
        requiredVariablesText: "",
        optionalVariablesText: "",
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
    };
  },

  computed: {
    // Layout state keeps the three-column prototype adjustable without coupling it to builder logic.
    abcGridStyle() {
      return {
        gridTemplateColumns: `${this.sectionWidths[0]}fr 8px ${this.sectionWidths[1]}fr 8px ${this.sectionWidths[2]}fr`,
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

    selectedPromptTemplate() {
      return this.promptTemplates.find((prompt) => prompt.id === this.selectedPromptTemplateId) || null;
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
    n8nWebhookUrl(value) {
      localStorage.setItem(storageKeys.n8nWebhookUrl, String(value || "").trim());
    },
  },

  mounted() {
    localStorage.removeItem(storageKeys.generatedPages);
    localStorage.removeItem(storageKeys.generatedPage);
    this.applyThemeMode();
    this.loadDesignDocuments();
    this.loadGeneratedPagesFromServer({ silent: true });
    this.loadHandoffDocuments();
    this.resetOverride();
  },

  methods: {
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
      this.setStatus("프로모션 빌더로 이동했습니다");
    },

    async openPromptManager() {
      this.currentView = "prompts";
      await this.loadPromptTemplates();
      this.setStatus("프롬프트 관리 페이지로 이동했습니다");
    },

    async loadPromptTemplates(options = {}) {
      if (this.promptTemplatesLoading && !options.fresh) return;
      this.promptTemplatesLoading = true;
      this.promptTemplatesError = "";
      try {
        const response = await fetch("/api/prompt-templates");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `Prompt ${response.status}`);
        this.promptTemplates = Array.isArray(result.prompts) ? result.prompts : [];
        if (!this.selectedPromptTemplateId || !this.promptTemplates.some((prompt) => prompt.id === this.selectedPromptTemplateId)) {
          const active = this.promptTemplates.find((prompt) => prompt.status === "active");
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

    async selectPromptTemplate(id, options = {}) {
      this.selectedPromptTemplateId = id;
      const prompt = this.promptTemplates.find((item) => item.id === id);
      if (!prompt) return;
      try {
        const response = await fetch(`/api/prompt-template?id=${encodeURIComponent(id)}`);
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `Prompt ${response.status}`);
        const detail = result.prompt || prompt;
        const index = this.promptTemplates.findIndex((item) => item.id === id);
        if (index >= 0) this.promptTemplates.splice(index, 1, detail);
        this.promptHistories = Array.isArray(result.histories) ? result.histories : [];
        this.promptEditor = {
          name: detail.name || "",
          body: detail.body || "",
          requiredVariablesText: (detail.requiredVariables || []).join(", "),
          optionalVariablesText: (detail.optionalVariables || []).join(", "),
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

    async savePromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving) return;
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
            changeNote: this.promptEditor.changeNote || "Prompt updated from management page.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `Prompt ${response.status}`);
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || prompt.id;
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus("프롬프트를 업데이트하고 변경 이력을 생성했습니다");
      } catch (error) {
        this.setStatus(`프롬프트 저장 실패: ${error.message}`);
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
            changeNote: "Activated from prompt management page.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `Prompt ${response.status}`);
        await this.loadPromptTemplates({ fresh: true });
        this.selectedPromptTemplateId = result.prompt?.id || prompt.id;
        await this.selectPromptTemplate(this.selectedPromptTemplateId, { silent: true });
        this.setStatus("Active 프롬프트를 적용했습니다");
      } catch (error) {
        this.setStatus(`Active 적용 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
      }
    },

    async archivePromptTemplate() {
      const prompt = this.selectedPromptTemplate;
      if (!prompt || this.promptSaving) return;
      if (prompt.status === "active") {
        this.setStatus("Active 프롬프트는 Archive 할 수 없습니다");
        return;
      }
      this.promptSaving = true;
      try {
        const response = await fetch("/api/prompt-template-archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: prompt.id,
            changeNote: "Archived from prompt management page.",
          }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || result.error || `Prompt ${response.status}`);
        this.selectedPromptTemplateId = "";
        await this.loadPromptTemplates({ fresh: true });
        this.setStatus("프롬프트를 Archive 처리했습니다");
      } catch (error) {
        this.setStatus(`Archive 처리 실패: ${error.message}`);
      } finally {
        this.promptSaving = false;
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

      const rawTokens = doc?.designTokensJson || doc?.rawDesignTokens || {};
      const rawGroup = rawTokens?.[groupKey] || {};
      const rawRows = rawGroup && typeof rawGroup === "object" && !Array.isArray(rawGroup)
        ? Object.entries(rawGroup)
          .map(([key, token]) => ({
            key,
            value: this.formatDesignTokenValue(token),
          }))
          .filter((row) => row.value && row.value !== "unknown")
        : [];
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

    formatDesignTokenValue(value) {
      if (value == null || value === "") return "unknown";
      if (Array.isArray(value)) {
        const items = value.map((item) => this.formatDesignTokenValue(item)).filter(Boolean);
        return items.length ? items.slice(0, 4).join(", ") : "unknown";
      }
      if (typeof value !== "object") return String(value);

      if (value.hex) return String(value.hex);
      if (value.$value?.hex) return String(value.$value.hex);

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

    colorTokenHex(value) {
      const match = String(value || "").match(/#[0-9a-fA-F]{3,8}\b/);
      return match ? match[0] : "";
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
      if (step === 3 && !this.n8nWebhookUrlIsValid()) {
        this.validationErrors = { n8nWebhookUrl: true };
        this.setStatus("n8n Webhook URL을 입력해 주세요");
        return false;
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
        n8nWebhookUrl: this.n8nWebhookUrlIsValid(),
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
      const existingWebhookUrl = this.n8nWebhookUrl;
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
      this.n8nWebhookUrl = existingWebhookUrl;
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
        n8nWebhookUrl: this.n8nWebhookUrl.trim(),
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

    n8nWebhookUrlIsValid() {
      const value = String(this.n8nWebhookUrl || "").trim();
      if (!value) return false;
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },

    // n8n client: browser builds use the local API proxy to avoid CORS and centralize URL policy.
    async triggerN8n(payload) {
      const url = this.n8nWebhookUrl.trim();
      if (!this.n8nWebhookUrlIsValid()) {
        throw new Error("n8n Webhook URL이 올바르지 않습니다");
      }
      const useProxy = window.location.protocol !== "file:";
      const requestUrl = useProxy ? "/api/generate-ui-design" : url;

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
      if (!this.n8nWebhookUrlIsValid()) {
        this.validationErrors = { n8nWebhookUrl: true };
        this.setStatus("n8n Webhook URL을 입력해 주세요");
        return;
      }
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

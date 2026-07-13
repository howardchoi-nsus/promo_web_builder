const steps = [
  {
    title: "Design Concept Selection",
    copy: "Select the design concept that will guide the integrated brief, LO-FI draft, and final design generation.",
    cards: [
      ["Design MD", "Choose the source design document and concept."],
      ["Visual Mode", "Confirm standard or advanced visual generation mode."],
      ["Style Tokens", "Preserve key colors, layout intent, typography, and CTA treatment."],
    ],
  },
  {
    title: "Promo Content Input",
    copy: "Enter and review the promo content that must be preserved through coverage validation.",
    cards: [
      ["Required Copy", "Title, offer, supporting message, CTA, alpha text, and terms."],
      ["Market Context", "Market, audience, promotion purpose, and tone guidance."],
      ["Coverage Gate", "Required content must survive Integrated Brief compression."],
    ],
  },
  {
    title: "LO-FI 시안 생성 및 선택",
    copy: "새 LO-FI 시안을 누적 생성하고, 생성된 시안 중 하나를 Final Design 기준으로 확정합니다.",
    cards: [
      ["생성 준비", "A섹션 Concept과 B섹션 Content를 통합 브리프로 준비합니다."],
      ["LO-FI 시안 생성", "버튼을 누를 때마다 기존 시안을 유지한 채 새 시안을 추가합니다."],
      ["시안 선택", "여러 LO-FI 시안 중 하나를 Confirm Draft로 확정합니다."],
    ],
  },
  {
    title: "Final Design Result",
    copy: "Generate the final design from the confirmed LO-FI draft and inspect the resulting asset.",
    cards: [
      ["Final Worker", "Trigger final_design generation for the selected draft."],
      ["Result Preview", "Display the final image and generation metadata."],
      ["Resume", "Reload by runId without losing generation state."],
    ],
  },
];

const storageKeys = {
  selectedDocumentId: "promoPrototype.selectedDocumentId.abc",
  wizardContent: "promoPrototype.wizardContent.v1",
  wizardRun: "promoPrototype.wizardRun.v1",
};

let currentStep = 0;
let designDocuments = [];
let selectedDocumentId = localStorage.getItem(storageKeys.selectedDocumentId) || "";
let conceptsLoading = false;
let conceptsError = "";
let validationErrors = {};
let runState = loadWizardRun();
let runLoading = false;
let runError = "";
let selectedLofiPreviewDraftId = "";
let selectedFinalPreviewDesignId = "";
let runPollingTimer = null;
let workerSettings = [];
let workerSettingsError = "";

const contentState = loadWizardContent();

const stepButtons = Array.from(document.querySelectorAll(".step"));
const title = document.getElementById("step-title");
const copy = document.getElementById("step-copy");
const eyebrow = document.getElementById("step-eyebrow");
const placeholders = document.getElementById("step-placeholders");
const status = document.getElementById("step-status");
const prev = document.getElementById("prev-step");
const next = document.getElementById("next-step");

function workerSetting(stage) {
  return workerSettings.find((setting) => setting.stage === stage) || null;
}

function workerReady(stage) {
  const setting = workerSetting(stage);
  return Boolean(setting?.isActive && setting?.isConfigured);
}

function workerStatusLabel(stage) {
  const setting = workerSetting(stage);
  if (setting?.isActive && setting?.isConfigured) return "n8n active";
  if (setting?.isConfigured) return "n8n inactive";
  return "n8n not configured";
}

async function loadWorkerSettings() {
  try {
    const result = await fetchJson("/api/promo-generation-worker-settings");
    workerSettings = Array.isArray(result.settings) ? result.settings : [];
    workerSettingsError = "";
  } catch (error) {
    workerSettingsError = error.message || "Worker settings load failed";
  }
  renderStep();
}

function defaultWizardContent() {
  return {
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
    sectionInputs: defaultSectionInputs(),
  };
}

function defaultSectionInputs() {
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

function mergeSectionInputs(saved = {}) {
  const fallback = defaultSectionInputs();
  return {
    ...fallback,
    ...saved,
    header: { ...fallback.header, ...(saved.header || {}) },
    heroBanner: {
      ...fallback.heroBanner,
      ...(saved.heroBanner || {}),
      cta: { ...fallback.heroBanner.cta, ...(saved.heroBanner?.cta || {}) },
    },
    stepBar: Array.isArray(saved.stepBar) && saved.stepBar.length ? saved.stepBar : fallback.stepBar,
    contentCta: {
      ...fallback.contentCta,
      ...(saved.contentCta || {}),
      cta: { ...fallback.contentCta.cta, ...(saved.contentCta?.cta || {}) },
    },
    imageTextRow: Array.isArray(saved.imageTextRow) && saved.imageTextRow.length ? saved.imageTextRow : fallback.imageTextRow,
    titleDescription: { ...fallback.titleDescription, ...(saved.titleDescription || {}) },
    footer: { ...fallback.footer, ...(saved.footer || {}) },
  };
}

function loadWizardContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.wizardContent) || "null");
    const fallback = defaultWizardContent();
    return {
      promo: { ...fallback.promo, ...(saved?.promo || {}) },
      simpleBrief: { ...fallback.simpleBrief, ...(saved?.simpleBrief || {}) },
      sectionInputs: mergeSectionInputs(saved?.sectionInputs || {}),
    };
  } catch {
    return defaultWizardContent();
  }
}

function saveWizardContent() {
  localStorage.setItem(storageKeys.wizardContent, JSON.stringify(contentState));
}

function loadWizardRun() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.wizardRun) || "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

function saveWizardRun(state) {
  runState = state || null;
  if (runState) {
    localStorage.setItem(storageKeys.wizardRun, JSON.stringify(runState));
  } else {
    localStorage.removeItem(storageKeys.wizardRun);
  }
}

function mergeQueuedFinalDesign(finalDesign) {
  if (!finalDesign?.finalDesignId || !runState) return;
  const existing = Array.isArray(runState.finalDesigns) ? runState.finalDesigns : [];
  const exists = existing.some((item) => item.finalDesignId === finalDesign.finalDesignId);
  const nextState = {
    ...runState,
    finalDesigns: exists ? existing : [finalDesign, ...existing],
  };
  if (nextState.run) {
    nextState.run = {
      ...nextState.run,
      stage: "final_design",
      status: finalDesign.status === "trigger_failed" ? "final_design_trigger_failed" : "final_design_queued",
    };
  }
  saveWizardRun(nextState);
  selectedFinalPreviewDesignId = finalDesign.finalDesignId;
}

function selectedDocument() {
  return designDocuments.find((doc) => doc.id === selectedDocumentId) || designDocuments[0] || null;
}

function tagsForDocument(doc) {
  return [
    doc?.styleClassification?.primaryGroup,
    ...(Array.isArray(doc?.styleClassification?.styleTags) ? doc.styleClassification.styleTags : []),
    doc?.styleClassification?.layoutModel,
    doc?.styleClassification?.colorMode,
    doc?.styleClassification?.typographyTone,
  ].filter(Boolean);
}

function conceptSummary(doc) {
  return doc?.designConcept?.summary || doc?.styleClassification?.rationale || "Design MD concept summary is not available.";
}

function compactCount(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number.toLocaleString() : "0";
}

function selectDocument(id) {
  selectedDocumentId = id;
  localStorage.setItem(storageKeys.selectedDocumentId, id);
  saveWizardRun(null);
  runError = "";
  currentStep = 1;
  renderStep();
}

function conceptThumbnailUrl(doc) {
  const suppliedUrl = [doc?.thumbnailUrl, doc?.thumbnail_url, doc?.coverImageUrl, doc?.previewImageUrl]
    .find((value) => /^(https?:\/\/|\/|data:image\/|blob:)/i.test(String(value || "")));
  if (suppliedUrl) return suppliedUrl;

  const groupValue = doc?.styleClassification?.primaryGroup;
  const group = typeof groupValue === "string" ? groupValue : groupValue?.slug;
  const images = {
    dense_systematic: "assets/concept-thumbnails/dense-systematic.jpg",
    premium_editorial: "assets/concept-thumbnails/premium-editorial.jpg",
    high_impact_promo: "assets/concept-thumbnails/high-impact-promo.jpg",
    playful_immersive: "assets/concept-thumbnails/playful-immersive.jpg",
    minimal_product: "assets/concept-thumbnails/minimal-product.jpg",
    content_rich_commerce: "assets/concept-thumbnails/content-rich-commerce.jpg",
    unclassified: "assets/concept-thumbnails/unclassified.jpg",
  };
  return images[group] || images.unclassified;
}

function createConceptCard(doc) {
  const selected = doc.id === selectedDocumentId;
  const card = document.createElement("article");
  card.className = `concept-card${selected ? " is-selected" : ""}`;

  const thumbnail = document.createElement("span");
  thumbnail.className = "concept-thumbnail";
  const image = document.createElement("img");
  const fallbackUrl = conceptThumbnailUrl({
    styleClassification: doc?.styleClassification,
  });
  image.src = conceptThumbnailUrl(doc);
  image.alt = `${doc.brandName || doc.slug || "Design MD"} 테마 미리보기`;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    if (image.src !== fallbackUrl) image.src = fallbackUrl;
  }, { once: true });
  thumbnail.append(image);

  const header = document.createElement("span");
  header.className = "concept-card-header";

  const brand = document.createElement("strong");
  brand.textContent = doc.brandName || doc.slug || "Untitled Design MD";

  header.append(brand);

  const summary = document.createElement("span");
  summary.className = "concept-card-summary";
  summary.textContent = conceptSummary(doc);

  const meta = document.createElement("span");
  meta.className = "concept-card-meta";
  meta.textContent = [
    `${compactCount(doc.summary?.tokenCount)} tokens`,
    `${compactCount(doc.summary?.componentPatternCount)} components`,
    `${compactCount(doc.summary?.layoutPatternCount)} layouts`,
  ].join(" · ");

  const tags = document.createElement("span");
  tags.className = "concept-tags";
  tagsForDocument(doc)
    .slice(0, 4)
    .forEach((tag) => {
      const item = document.createElement("em");
      item.textContent = tag;
      tags.append(item);
    });

  const select = document.createElement("button");
  select.className = "concept-select-action";
  select.type = "button";
  select.textContent = selected ? "선택됨 · Content로 이동" : "선택";
  select.addEventListener("click", () => selectDocument(doc.id));

  card.append(thumbnail, header, summary, meta, tags, select);
  return card;
}

function appendTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function fieldValue(group, key) {
  return contentState[group]?.[key] || "";
}

function valueAtPath(source, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => value?.[key], source);
}

function setValueAtPath(source, path, value) {
  const parts = String(path || "").split(".").filter(Boolean);
  if (!parts.length) return;
  let target = source;
  parts.slice(0, -1).forEach((part) => {
    if (!target[part] || typeof target[part] !== "object") target[part] = {};
    target = target[part];
  });
  target[parts[parts.length - 1]] = value;
}

function setFieldValue(group, key, value) {
  contentState[group][key] = value;
  if (validationErrors[key] && String(value || "").trim()) delete validationErrors[key];
  if (key === "promotionPurpose" && value !== "기타") {
    contentState.promo.promotionPurposeOther = "";
    delete validationErrors.promotionPurposeOther;
  }
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  renderStep();
}

function setSectionValue(path, value) {
  setValueAtPath(contentState.sectionInputs, path, value);
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
}

function fieldInvalid(key) {
  return Boolean(validationErrors[key]);
}

function createField({ group, key, label, type = "text", placeholder = "입력해 주세요", required = false, options = null, rows = 3 }) {
  const wrapper = document.createElement("label");
  wrapper.className = `content-field${fieldInvalid(key) ? " is-invalid" : ""}`;

  const caption = document.createElement("span");
  caption.textContent = required ? `${label} *` : label;
  wrapper.append(caption);

  let control;
  if (options) {
    control = document.createElement("select");
    const empty = document.createElement("option");
    empty.value = "";
    empty.disabled = true;
    empty.textContent = "선택해 주세요";
    control.append(empty);
    options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      control.append(option);
    });
  } else if (type === "textarea") {
    control = document.createElement("textarea");
    control.rows = rows;
    control.placeholder = placeholder;
  } else {
    control = document.createElement("input");
    control.type = type;
    control.placeholder = placeholder;
    control.autocomplete = "off";
  }

  control.value = fieldValue(group, key);
  control.addEventListener("input", (event) => setFieldValue(group, key, event.target.value));
  control.addEventListener("change", (event) => setFieldValue(group, key, event.target.value));
  wrapper.append(control);

  if (fieldInvalid(key)) {
    appendTextElement(wrapper, "small", "content-field-error", "입력해 주세요");
  }

  return wrapper;
}

function createSectionField({ path, label, type = "text", placeholder = "입력해 주세요", rows = 3 }) {
  const wrapper = document.createElement("label");
  wrapper.className = "content-field";

  const caption = document.createElement("span");
  caption.textContent = label;
  wrapper.append(caption);

  const control = type === "textarea" ? document.createElement("textarea") : document.createElement("input");
  if (type === "textarea") {
    control.rows = rows;
  } else {
    control.type = type;
    control.autocomplete = "off";
  }
  control.placeholder = placeholder;
  control.value = valueAtPath(contentState.sectionInputs, path) || "";
  control.addEventListener("input", (event) => {
    setSectionValue(path, event.target.value);
  });
  wrapper.append(control);
  return wrapper;
}

function createSectionInputSection(titleText, fields) {
  const section = document.createElement("article");
  section.className = "content-form-section";
  appendTextElement(section, "h3", "", titleText);

  const grid = document.createElement("div");
  grid.className = "content-form-grid";
  fields.forEach((field) => grid.append(createSectionField(field)));
  section.append(grid);
  return section;
}

function contentErrors() {
  const errors = {};
  const required = [
    ["title", contentState.promo.title],
    ["promotionPurpose", contentState.promo.promotionPurpose],
    ["market", contentState.promo.market],
    ["audience", contentState.simpleBrief.audience],
    ["campaignTone", contentState.simpleBrief.campaignTone],
    ["mainOffer", contentState.simpleBrief.mainOffer],
    ["secondaryMessage", contentState.simpleBrief.secondaryMessage],
    ["targetAction", contentState.simpleBrief.targetAction],
    ["heroTitle", valueAtPath(contentState.sectionInputs, "heroBanner.title") || contentState.promo.title],
    ["heroSubline", valueAtPath(contentState.sectionInputs, "heroBanner.sublineText") || contentState.promo.subline || contentState.simpleBrief.secondaryMessage],
    ["heroCta", valueAtPath(contentState.sectionInputs, "heroBanner.cta.label") || contentState.promo.ctaLabel || contentState.simpleBrief.targetAction],
    ["footerContent", valueAtPath(contentState.sectionInputs, "footer.content") || contentState.promo.termsText],
  ];
  if (contentState.promo.promotionPurpose === "기타") {
    required.push(["promotionPurposeOther", contentState.promo.promotionPurposeOther]);
  }
  required.forEach(([key, value]) => {
    if (!String(value || "").trim()) errors[key] = true;
  });
  return errors;
}

function validateContentStep() {
  validationErrors = contentErrors();
  return !Object.keys(validationErrors).length;
}

function autofillContent() {
  const terms = "Players must be aged 18+ to participate. Promotion terms and conditions apply. Please play responsibly.";
  contentState.promo = {
    ...contentState.promo,
    title: "Weekend Welcome Bonus",
    promotionPurpose: "이벤트",
    market: "Global",
    leadText: "Claim a limited-time welcome package",
    ctaLabel: "Join Now",
    ctaUrl: "https://www.ggpoker.com/promotions/",
    subline: "Start strong with boosted rewards and clear next steps.",
    alphaText: "18+ | Terms apply",
    termsText: terms,
  };
  contentState.simpleBrief = {
    mainOffer: "Limited-time welcome bonus for new players",
    targetAction: "Register and claim the offer",
    audience: "신규",
    campaignTone: "긴급함",
    secondaryMessage: "A clear promotional flow from offer discovery to CTA conversion.",
  };
  contentState.sectionInputs = mergeSectionInputs({
    header: {
      logoText: "GGPoker logo",
      badgeText: "Welcome Bonus, 18+, Responsible Gaming",
    },
    heroBanner: {
      leaderText: "Limited-time welcome package",
      title: "Weekend Welcome Bonus",
      sublineText: "Start strong with boosted rewards and clear next steps.",
      cta: { label: "Join Now", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
      alphaText: "18+ | Terms apply",
      visualMode: "auto",
    },
    stepBar: [
      { title: "Register", description: "Create or sign in to your GGPoker account.", ctaLabel: "Join Now", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
      { title: "Claim", description: "Opt in to the weekend welcome promotion.", ctaLabel: "Claim Offer", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
      { title: "Play", description: "Use your rewards before the promotion ends.", ctaLabel: "Start Playing", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
    ],
    contentCta: {
      title: "Limited-time welcome bonus for new players",
      longText: "A clear promotional flow from offer discovery to CTA conversion.",
      imageText: "Dynamic poker table with bonus chips and weekend event energy",
      cta: { label: "Join Now", link: "https://www.ggpoker.com/promotions/", target: "_blank" },
      visualMode: "auto",
    },
    imageTextRow: [
      {
        imageText: "Secure poker platform visual",
        title: "Your safety comes first",
        description: "Play on a trusted platform with clear responsible gaming guidance.",
        visualMode: "auto",
      },
    ],
    titleDescription: {
      title: "Terms and Conditions",
      contents: terms,
    },
    footer: {
      logoText: "GGPoker logo",
      licenseBadges: "Visa, Mastercard, 18+, BeGambleAware",
      content: terms,
    },
  });
  validationErrors = {};
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  renderStep();
}

function resetContent() {
  const empty = defaultWizardContent();
  contentState.promo = empty.promo;
  contentState.simpleBrief = empty.simpleBrief;
  contentState.sectionInputs = empty.sectionInputs;
  validationErrors = {};
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  renderStep();
}

function createContentSection(titleText, fields) {
  const section = document.createElement("article");
  section.className = "content-form-section";
  appendTextElement(section, "h3", "", titleText);

  const grid = document.createElement("div");
  grid.className = "content-form-grid";
  fields.forEach((field) => grid.append(createField(field)));
  section.append(grid);
  return section;
}

function messageJsonPayload() {
  return {
    mainOffer: contentState.simpleBrief.mainOffer || "",
    secondaryMessage: contentState.simpleBrief.secondaryMessage || "",
    targetAction: contentState.simpleBrief.targetAction || "",
    leadText: contentState.promo.leadText || "",
    subline: contentState.promo.subline || "",
  };
}

function applyMessageJsonPayload(value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    return { ok: false, error: error.message || "Invalid JSON" };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "JSON object is required." };
  }

  contentState.simpleBrief.mainOffer = String(parsed.mainOffer || "");
  contentState.simpleBrief.secondaryMessage = String(parsed.secondaryMessage || "");
  contentState.simpleBrief.targetAction = String(parsed.targetAction || "");
  contentState.promo.leadText = String(parsed.leadText || "");
  contentState.promo.subline = String(parsed.subline || "");

  ["mainOffer", "secondaryMessage", "targetAction"].forEach((key) => {
    if (String(contentState.simpleBrief[key] || "").trim()) delete validationErrors[key];
  });
  saveWizardContent();
  saveWizardRun(null);
  runError = "";
  return { ok: true };
}

function createMessageJsonSection() {
  const section = document.createElement("article");
  section.className = "content-form-section";
  appendTextElement(section, "h3", "", "2. Message JSON");

  const wrapper = document.createElement("label");
  wrapper.className = "content-field content-json-field";
  appendTextElement(wrapper, "span", "", "messagePayload");

  const control = document.createElement("textarea");
  control.rows = 12;
  control.spellcheck = false;
  control.value = JSON.stringify(messageJsonPayload(), null, 2);

  const error = appendTextElement(wrapper, "small", "content-field-error", "");
  error.hidden = true;

  control.addEventListener("input", (event) => {
    const result = applyMessageJsonPayload(event.target.value);
    wrapper.classList.toggle("is-invalid", !result.ok);
    error.hidden = result.ok;
    error.textContent = result.ok ? "" : result.error;
  });
  control.addEventListener("blur", renderStep);

  wrapper.append(control);
  section.append(wrapper);
  return section;
}

function renderContentStep() {
  placeholders.className = "content-form-layout";
  placeholders.innerHTML = "";

  const toolbar = document.createElement("div");
  toolbar.className = "content-form-actions";
  const note = appendTextElement(toolbar, "span", "", "B섹션 입력값은 wizardContent에 저장되며 LO-FI payload의 promo/simpleBrief 소스로 사용됩니다.");
  note.className = "content-save-note";
  const buttons = document.createElement("div");
  const autofill = document.createElement("button");
  autofill.className = "secondary-action";
  autofill.type = "button";
  autofill.textContent = "자동 입력";
  autofill.addEventListener("click", autofillContent);
  const reset = document.createElement("button");
  reset.className = "secondary-action";
  reset.type = "button";
  reset.textContent = "초기화";
  reset.addEventListener("click", resetContent);
  buttons.append(autofill, reset);
  toolbar.append(buttons);

  const overview = createContentSection("1. 프로모션 개요", [
    { group: "promo", key: "title", label: "프로모션 제목", required: true },
    { group: "promo", key: "promotionPurpose", label: "프로모션 목적", required: true, options: ["할인쿠폰", "경품", "이벤트", "기타"] },
    { group: "promo", key: "promotionPurposeOther", label: "기타 목적", required: contentState.promo.promotionPurpose === "기타" },
    { group: "promo", key: "market", label: "마켓 / 지역", required: true, placeholder: "Global, KR, Ontario..." },
    { group: "simpleBrief", key: "audience", label: "대상 고객", required: true, options: ["신규", "기존고객", "일반고객"] },
    { group: "simpleBrief", key: "campaignTone", label: "캠페인 톤", required: true, options: ["활기찬", "진중함", "럭셔리", "프리미엄", "긴급함", "친근함"] },
  ]);

  if (contentState.promo.promotionPurpose !== "기타") {
    const otherField = overview.querySelector("label:nth-child(3)");
    if (otherField) otherField.hidden = true;
  }

  const message = createMessageJsonSection();

  const conversion = createContentSection("3. CTA / 약관", [
    { group: "promo", key: "ctaLabel", label: "CTA 버튼 텍스트" },
    { group: "promo", key: "ctaUrl", label: "CTA URL", type: "url", placeholder: "https://..." },
    { group: "promo", key: "alphaText", label: "Alpha / 보조 고지" },
    { group: "promo", key: "termsText", label: "약관 / Responsible Gaming 문구", type: "textarea", rows: 4 },
  ]);

  const headerSection = createSectionInputSection("4. Header", [
    { path: "header.logoText", label: "Logo" },
    { path: "header.badgeText", label: "Badges" },
  ]);

  const heroSection = createSectionInputSection("5. Hero Banner", [
    { path: "heroBanner.leaderText", label: "Lead Text" },
    { path: "heroBanner.title", label: "Title" },
    { path: "heroBanner.sublineText", label: "Subline Text", type: "textarea", rows: 2 },
    { path: "heroBanner.cta.label", label: "Button Text" },
    { path: "heroBanner.cta.link", label: "Button URL", type: "url", placeholder: "https://..." },
    { path: "heroBanner.alphaText", label: "Alpha Text", type: "textarea", rows: 2 },
  ]);

  const stepBarSection = createSectionInputSection("6. Step Bar", [
    { path: "stepBar.0.title", label: "Step 1 Title" },
    { path: "stepBar.0.description", label: "Step 1 Description", type: "textarea", rows: 2 },
    { path: "stepBar.0.ctaLabel", label: "Step 1 CTA" },
    { path: "stepBar.1.title", label: "Step 2 Title" },
    { path: "stepBar.1.description", label: "Step 2 Description", type: "textarea", rows: 2 },
    { path: "stepBar.1.ctaLabel", label: "Step 2 CTA" },
    { path: "stepBar.2.title", label: "Step 3 Title" },
    { path: "stepBar.2.description", label: "Step 3 Description", type: "textarea", rows: 2 },
    { path: "stepBar.2.ctaLabel", label: "Step 3 CTA" },
  ]);

  const contentCtaSection = createSectionInputSection("7. Contents / CTA", [
    { path: "contentCta.title", label: "Title" },
    { path: "contentCta.longText", label: "Description", type: "textarea", rows: 4 },
    { path: "contentCta.imageText", label: "Image Prompt Text", type: "textarea", rows: 2 },
    { path: "contentCta.cta.label", label: "Button Text" },
    { path: "contentCta.cta.link", label: "Button URL", type: "url", placeholder: "https://..." },
  ]);

  const imageTextSection = createSectionInputSection("8. Image Text Row", [
    { path: "imageTextRow.0.imageText", label: "Image Text", type: "textarea", rows: 2 },
    { path: "imageTextRow.0.title", label: "Title" },
    { path: "imageTextRow.0.description", label: "Description", type: "textarea", rows: 3 },
  ]);

  const titleDescriptionSection = createSectionInputSection("9. Title and Description", [
    { path: "titleDescription.title", label: "Title" },
    { path: "titleDescription.contents", label: "Contents", type: "textarea", rows: 5 },
  ]);

  const footerSection = createSectionInputSection("10. Footer", [
    { path: "footer.logoText", label: "Logo" },
    { path: "footer.licenseBadges", label: "License Badges", type: "textarea", rows: 2 },
    { path: "footer.content", label: "Footer Content", type: "textarea", rows: 5 },
  ]);

  const coverage = document.createElement("aside");
  coverage.className = "content-coverage-panel";
  appendTextElement(coverage, "span", "eyebrow", "Coverage Checklist");
  const missing = contentErrors();
  appendTextElement(coverage, "strong", "", Object.keys(missing).length ? "Required content missing" : "Required content ready");
  const list = document.createElement("ul");
  [
    ["Title", contentState.promo.title],
    ["Purpose", contentState.promo.promotionPurpose],
    ["Market", contentState.promo.market],
    ["Audience", contentState.simpleBrief.audience],
    ["Tone", contentState.simpleBrief.campaignTone],
    ["Main offer", contentState.simpleBrief.mainOffer],
    ["Secondary message", contentState.simpleBrief.secondaryMessage],
    ["Target action", contentState.simpleBrief.targetAction],
    ["Hero title", valueAtPath(contentState.sectionInputs, "heroBanner.title") || contentState.promo.title],
    ["Hero CTA", valueAtPath(contentState.sectionInputs, "heroBanner.cta.label") || contentState.promo.ctaLabel],
    ["Footer terms", valueAtPath(contentState.sectionInputs, "footer.content") || contentState.promo.termsText],
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    item.className = String(value || "").trim() ? "is-ready" : "is-missing";
    item.textContent = label;
    list.append(item);
  });
  coverage.append(list);

  placeholders.append(
    toolbar,
    overview,
    message,
    conversion,
    headerSection,
    heroSection,
    stepBarSection,
    contentCtaSection,
    imageTextSection,
    titleDescriptionSection,
    footerSection,
    coverage
  );
}

function createStatusPill(text, kind = "") {
  const pill = document.createElement("span");
  pill.className = `status-chip${kind ? ` ${kind}` : ""}`;
  pill.textContent = text || "unknown";
  return pill;
}

function createLofiDraftCard(draft) {
  const card = document.createElement("article");
  card.className = `lofi-draft-card${draft.confirmedAt ? " is-confirmed" : ""}${selectedLofiPreviewDraftId === draft.draftId ? " is-selected" : ""}`;

  const header = document.createElement("div");
  header.className = "lofi-draft-header";
  appendTextElement(header, "strong", "", `LO-FI 시안 #${draft.draftAttempt || "-"}`);
  header.append(createStatusPill(draft.confirmedAt ? "Confirmed" : draft.status, isReadyDraft(draft) ? "ready" : ""));

  const preview = document.createElement("button");
  preview.className = "lofi-thumbnail-button";
  preview.type = "button";
  preview.setAttribute("aria-label", `Preview LO-FI draft ${draft.draftAttempt || ""}`);
  preview.addEventListener("click", () => {
    selectedLofiPreviewDraftId = draft.draftId || "";
    renderStep();
  });

  const thumbnail = document.createElement("div");
  thumbnail.className = "lofi-thumbnail";
  if (draft.draftImageUrl || isReadyDraft(draft)) {
    const image = document.createElement("img");
    image.alt = `LO-FI draft attempt ${draft.draftAttempt || ""}`;
    image.src = draftImageSrc(draft);
    image.loading = "lazy";
    thumbnail.append(image);
  } else {
    appendTextElement(thumbnail, "span", "", isActiveStatus(draft.status) ? "Generating draft..." : "No image yet");
  }
  preview.append(thumbnail);

  const meta = document.createElement("dl");
  meta.className = "lofi-draft-meta";
  [
    ["Created", draft.createdAt ? new Date(draft.createdAt).toLocaleString() : "-"],
    ["Updated", draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "-"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    appendTextElement(row, "dt", "", label);
    appendTextElement(row, "dd", "", value);
    meta.append(row);
  });
  if (draft.errorMessage) {
    appendTextElement(card, "p", "lofi-error", draft.errorMessage);
  }

  const actions = document.createElement("div");
  actions.className = "lofi-draft-actions";
  const confirm = document.createElement("button");
  confirm.className = "primary-action";
  confirm.type = "button";
  confirm.textContent = draft.confirmedAt ? "Confirmed Draft" : "이 시안 선택";
  confirm.disabled = runLoading || draft.confirmedAt || !isReadyDraft(draft);
  confirm.addEventListener("click", () => confirmDraft(draft));
  actions.append(confirm);

  card.append(header, preview, meta, actions);
  return card;
}

function createLofiLargePreview(draft, draftList) {
  const panel = document.createElement("section");
  panel.className = "lofi-large-preview";
  appendTextElement(panel, "span", "eyebrow", "LO-FI Preview");
  appendTextElement(panel, "h3", "", draft ? `Draft #${draft.draftAttempt || "-"}` : "No draft selected");

  const frame = document.createElement("div");
  frame.className = "lofi-large-preview-frame";
  if (draftList) frame.append(draftList);

  const media = document.createElement("div");
  media.className = "lofi-large-preview-media";
  if (draft?.draftImageUrl || (draft && isReadyDraft(draft))) {
    const image = document.createElement("img");
    image.alt = `LO-FI draft attempt ${draft.draftAttempt || ""}`;
    image.src = draftImageSrc(draft);
    media.append(image);
  } else {
    appendTextElement(media, "span", "", draft ? "Draft image is not ready yet." : "Create a LO-FI draft, then select a thumbnail.");
  }
  frame.append(media);
  panel.append(frame);
  return panel;
}

function createFinalDesignCard(finalDesign) {
  const card = document.createElement("article");
  card.className = `final-design-card${selectedFinalPreviewDesignId === finalDesign.finalDesignId ? " is-selected" : ""}`;

  const header = document.createElement("div");
  header.className = "lofi-draft-header";
  appendTextElement(header, "strong", "", `Final Design ${finalDesign.createdAt ? new Date(finalDesign.createdAt).toLocaleDateString() : ""}`.trim());
  header.append(createStatusPill(finalDesign.status, isReadyFinalDesign(finalDesign) ? "ready" : ""));

  const preview = document.createElement("button");
  preview.className = "lofi-thumbnail-button";
  preview.type = "button";
  preview.setAttribute("aria-label", `Preview final design ${finalDesign.finalDesignId || ""}`);
  preview.addEventListener("click", () => {
    selectedFinalPreviewDesignId = finalDesign.finalDesignId || "";
    renderStep();
  });

  const thumbnail = document.createElement("div");
  thumbnail.className = "lofi-thumbnail";
  if (finalDesign.finalImageUrl || isReadyFinalDesign(finalDesign)) {
    const image = document.createElement("img");
    image.alt = "Final design preview";
    image.src = finalDesignImageSrc(finalDesign);
    image.loading = "lazy";
    thumbnail.append(image);
  } else {
    appendTextElement(thumbnail, "span", "", isActiveStatus(finalDesign.status) ? "Generating final design..." : "No image yet");
  }
  preview.append(thumbnail);

  const meta = document.createElement("dl");
  meta.className = "lofi-draft-meta";
  [
    ["Created", finalDesign.createdAt ? new Date(finalDesign.createdAt).toLocaleString() : "-"],
    ["Updated", finalDesign.updatedAt ? new Date(finalDesign.updatedAt).toLocaleString() : "-"],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    appendTextElement(row, "dt", "", label);
    appendTextElement(row, "dd", "", value);
    meta.append(row);
  });
  if (finalDesign.errorMessage) appendTextElement(card, "p", "lofi-error", finalDesign.errorMessage);

  card.append(header, preview, meta);
  return card;
}

function createFinalLargePreview(finalDesign) {
  const panel = document.createElement("section");
  panel.className = "final-large-preview";
  appendTextElement(panel, "span", "eyebrow", "Final Design Preview");
  appendTextElement(panel, "h3", "", finalDesign ? finalDesign.status || "Final design" : "No final design yet");

  const frame = document.createElement("div");
  frame.className = "final-large-preview-frame";
  if (finalDesign?.finalImageUrl || (finalDesign && isReadyFinalDesign(finalDesign))) {
    const image = document.createElement("img");
    image.alt = "Final design preview";
    image.src = finalDesignImageSrc(finalDesign);
    frame.append(image);
  } else {
    appendTextElement(frame, "span", "", finalDesign ? "Final design image is not ready yet." : "Generate a final design from the confirmed LO-FI draft.");
  }
  panel.append(frame);
  return panel;
}

function renderLofiStep() {
  placeholders.className = "lofi-layout";
  placeholders.innerHTML = "";

  const run = runState?.run || null;
  const drafts = Array.isArray(runState?.drafts) ? [...runState.drafts] : [];
  drafts.sort((a, b) => Number(a.draftAttempt || 0) - Number(b.draftAttempt || 0));
  const confirmed = runState?.confirmedDraft || drafts.find((draft) => draft.confirmedAt) || null;
  const selectedDraft = drafts.find((draft) => draft.draftId === selectedLofiPreviewDraftId)
    || confirmed
    || drafts.find((draft) => isReadyDraft(draft))
    || drafts[0]
    || null;
  selectedLofiPreviewDraftId = selectedDraft?.draftId || "";

  const summary = document.createElement("section");
  summary.className = "lofi-run-summary";
  appendTextElement(summary, "span", "eyebrow", "LO-FI Generation Run");
  appendTextElement(summary, "h3", "", run?.promoTitle || contentState.promo.title || "Untitled promo");
  appendTextElement(summary, "p", "", "새 LO-FI 시안을 생성하면 기존 시안은 유지되고 draft attempt가 하나 더 추가됩니다.");

  const statusRow = document.createElement("div");
  statusRow.className = "lofi-status-row";
  const briefProgress = integratedBriefFailed()
    ? { text: "통합 브리프 · 생성 실패", kind: "error" }
    : generationProgress(
      "통합 브리프",
      runState?.integratedBrief?.status || (run?.stage === "integrated_brief" ? run.status : ""),
      integratedBriefReady() || /integrated_brief_ready/i.test(String(run?.status || ""))
    );
  const lofiProgress = generationProgress(
    "LO-FI 생성",
    drafts.find((draft) => isActiveStatus(draft.status))?.status || (run?.stage === "lofi_draft" ? run.status : ""),
    drafts.some((draft) => isReadyDraft(draft)) || /lofi_draft_(ready|confirmed)/i.test(String(run?.status || ""))
  );
  statusRow.append(createStatusPill(briefProgress.text, briefProgress.kind));
  statusRow.append(createStatusPill(lofiProgress.text, lofiProgress.kind));
  statusRow.append(createStatusPill(`시안 ${drafts.length}개`));
  if (confirmed?.draftAttempt) statusRow.append(createStatusPill(`시안 #${confirmed.draftAttempt} 선택됨`, "ready"));
  summary.append(statusRow);

  const coverage = document.createElement("div");
  coverage.className = "lofi-content-snapshot";
  appendTextElement(coverage, "strong", "", "2단계 Content 적용 기준");
  const snapshotList = document.createElement("ul");
  [
    ["Title", contentState.promo.title],
    ["Offer", contentState.simpleBrief.mainOffer],
    ["Message", contentState.simpleBrief.secondaryMessage],
    ["CTA", contentState.promo.ctaLabel || contentState.simpleBrief.targetAction],
    ["Terms", contentState.promo.termsText],
    ["Hero", valueAtPath(contentState.sectionInputs, "heroBanner.title") || contentState.promo.title],
    ["Contents", valueAtPath(contentState.sectionInputs, "contentCta.longText") || contentState.simpleBrief.secondaryMessage],
    ["Footer", valueAtPath(contentState.sectionInputs, "footer.content") || contentState.promo.termsText],
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    item.textContent = `${label}: ${String(value || "-").slice(0, 110)}`;
    snapshotList.append(item);
  });
  coverage.append(snapshotList);
  summary.append(coverage);

  const actionPanel = document.createElement("section");
  actionPanel.className = "lofi-action-panel";
  const prepare = document.createElement("button");
  prepare.className = "secondary-action";
  prepare.type = "button";
  prepare.textContent = integratedBriefFailed()
    ? "통합 브리프 다시 생성"
    : runId() ? "상태 새로고침" : "생성 준비 시작";
  prepare.disabled = runLoading;
  prepare.addEventListener("click", async () => {
    if (runId()) {
      runLoading = true;
      runError = "";
      renderStep();
      try {
        if (integratedBriefFailed()) await queueIntegratedBrief();
        await refreshRunState();
        syncRunPolling();
      } catch (error) {
        runError = error.message;
      } finally {
        runLoading = false;
        renderStep();
      }
    } else {
      await prepareLofiRun();
    }
  });

  const createDraft = document.createElement("button");
  createDraft.className = "primary-action";
  createDraft.type = "button";
  createDraft.textContent = "새 LO-FI 시안 생성";
  createDraft.disabled = runLoading || !runId() || !integratedBriefReady();
  createDraft.addEventListener("click", createNewLofiDraft);
  actionPanel.append(prepare, createDraft);
  if (integratedBriefFailed()) {
    appendTextElement(
      actionPanel,
      "small",
      "lofi-error",
      integratedBriefErrorMessage() || "통합 브리프 생성에 실패했습니다. 다시 생성해 주세요."
    );
  } else if (!integratedBriefReady()) {
    appendTextElement(actionPanel, "small", "", runId()
      ? "Integrated Brief가 ready가 되면 새 LO-FI 시안을 생성할 수 있습니다."
      : "먼저 생성 준비를 시작해 Integrated Brief를 큐에 넣어 주세요.");
  }
  if (!workerReady("integrated_brief") || !workerReady("lofi_draft")) {
    appendTextElement(actionPanel, "small", "", "관리자 페이지에서 integrated_brief / lofi_draft n8n webhook이 active인지 확인해 주세요. 환경변수로 설정된 경우에는 서버가 그대로 worker를 호출합니다.");
  }
  if (runLoading) appendTextElement(actionPanel, "small", "", "요청 처리 중입니다.");
  if (runError) appendTextElement(actionPanel, "small", "lofi-error", runError);
  summary.append(actionPanel);

  const list = document.createElement("section");
  list.className = "lofi-draft-list";
  if (!drafts.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "아직 생성된 LO-FI 시안이 없습니다");
    appendTextElement(empty, "span", "", "Integrated Brief가 준비된 뒤 '새 LO-FI 시안 생성'을 눌러 첫 후보를 생성합니다.");
    list.append(empty);
  } else {
    drafts.forEach((draft) => list.append(createLofiDraftCard(draft)));
  }

  const largePreview = createLofiLargePreview(selectedDraft, list);

  placeholders.append(summary, largePreview);
}

function renderFinalStep() {
  placeholders.className = "final-layout";
  placeholders.innerHTML = "";

  const run = runState?.run || null;
  const confirmed = runState?.confirmedDraft || null;
  const finalDesigns = Array.isArray(runState?.finalDesigns) ? [...runState.finalDesigns] : [];
  finalDesigns.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  const selectedFinalDesign = finalDesigns.find((item) => item.finalDesignId === selectedFinalPreviewDesignId)
    || finalDesigns.find((item) => isReadyFinalDesign(item))
    || finalDesigns[0]
    || null;
  selectedFinalPreviewDesignId = selectedFinalDesign?.finalDesignId || "";

  const summary = document.createElement("section");
  summary.className = "final-run-summary";
  appendTextElement(summary, "span", "eyebrow", "Final Design Generation Run");
  appendTextElement(summary, "h3", "", run?.promoTitle || contentState.promo.title || "Untitled promo");
  appendTextElement(summary, "p", "", "Confirm Draft로 선택한 LO-FI 시안을 기준으로 n8n final_design worker를 호출합니다.");

  const statusRow = document.createElement("div");
  statusRow.className = "lofi-status-row";
  const finalComplete = finalDesigns.some((item) => isReadyFinalDesign(item))
    || /final_design_ready/i.test(String(run?.status || ""));
  const finalInProgress = finalDesigns.some((item) => isActiveStatus(item.status))
    || (run?.stage === "final_design" && isActiveStatus(run.status));
  const finalProgress = finalComplete
    ? { text: "최종 디자인 · 진행 완료", kind: "ready" }
    : finalInProgress
      ? { text: "최종 디자인 · 진행 중", kind: "progress" }
      : { text: "최종 디자인 · 대기 중", kind: "waiting" };
  statusRow.append(createStatusPill(finalProgress.text, finalProgress.kind));
  statusRow.append(createStatusPill(`결과 ${finalDesigns.length}개`));
  if (confirmed?.draftAttempt) statusRow.append(createStatusPill(`LO-FI 시안 #${confirmed.draftAttempt} 선택됨`, "ready"));
  summary.append(statusRow);

  const source = document.createElement("div");
  source.className = "lofi-content-snapshot final-design-source";
  appendTextElement(source, "strong", "", "Final Design Source");
  const sourcePreview = document.createElement("div");
  sourcePreview.className = "final-design-source-preview";
  if (confirmed?.draftId) {
    const sourceImage = document.createElement("img");
    sourceImage.src = draftImageSrc(confirmed);
    sourceImage.alt = `선택된 LO-FI 시안 #${confirmed.draftAttempt || ""}`.trim();
    sourceImage.loading = "lazy";
    sourcePreview.append(sourceImage);
  } else {
    appendTextElement(sourcePreview, "span", "", "Step 3에서 선택된 LO-FI 시안이 없습니다.");
  }
  const sourceList = document.createElement("ul");
  [
    ["Run ID", runId()],
    ["Confirmed Draft ID", confirmed?.draftId],
    ["Promo Title", contentState.promo.title],
    ["CTA", contentState.promo.ctaLabel || contentState.simpleBrief.targetAction],
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    item.textContent = `${label}: ${String(value || "-").slice(0, 110)}`;
    sourceList.append(item);
  });
  source.append(sourcePreview, sourceList);
  summary.append(source);

  const actionPanel = document.createElement("section");
  actionPanel.className = "lofi-action-panel";
  const refresh = document.createElement("button");
  refresh.className = "secondary-action";
  refresh.type = "button";
  refresh.textContent = "상태 새로고침";
  refresh.disabled = runLoading || !runId();
  refresh.addEventListener("click", async () => {
    runLoading = true;
    runError = "";
    renderStep();
    try {
      await refreshRunState();
      syncRunPolling();
    } catch (error) {
      runError = error.message;
    } finally {
      runLoading = false;
      renderStep();
    }
  });

  const generate = document.createElement("button");
  generate.className = "primary-action";
  generate.type = "button";
  generate.textContent = finalDesigns.length ? "최종 디자인 재생성" : "최종 디자인 생성";
  generate.disabled = runLoading || !runId() || !confirmed?.draftId;
  generate.addEventListener("click", generateFinalDesign);
  actionPanel.append(refresh, generate);
  if (!confirmed?.draftId) appendTextElement(actionPanel, "small", "", "Step 3에서 LO-FI 시안 하나를 Confirm Draft로 선택해야 최종 디자인을 생성할 수 있습니다.");
  if (!workerReady("final_design")) appendTextElement(actionPanel, "small", "", "관리자 페이지에서 final_design n8n webhook이 active인지 확인해 주세요. 환경변수로 설정된 경우에는 서버가 그대로 worker를 호출합니다.");
  if (runLoading) appendTextElement(actionPanel, "small", "", "요청 처리 중입니다.");
  if (runError) appendTextElement(actionPanel, "small", "lofi-error", runError);
  summary.append(actionPanel);

  const largePreview = createFinalLargePreview(selectedFinalDesign);

  const list = document.createElement("section");
  list.className = "final-design-list";
  if (!finalDesigns.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "아직 생성된 최종 디자인이 없습니다");
    appendTextElement(empty, "span", "", "Confirm Draft가 준비된 뒤 '최종 디자인 생성'을 눌러 n8n final_design worker를 시작합니다.");
    list.append(empty);
  } else {
    finalDesigns.forEach((finalDesign) => list.append(createFinalDesignCard(finalDesign)));
  }

  placeholders.append(summary, largePreview, list);
}

function randomToken(length = 5) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint8Array(length);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < length; index += 1) values[index] = Math.floor(Math.random() * 256);
  }
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function createRunKey() {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  return `promo-wizard-${stamp}-${randomToken(5)}`;
}

function selectedDesignPayload(doc) {
  return {
    id: doc?.id || "",
    brand: doc?.brandName || "",
    designStyleId: doc?.id || "",
    designStyleName: doc?.designStyleName || doc?.brandName || "",
    slug: doc?.slug || "",
    summary: doc?.summary || {},
    designTokenFileName: doc?.designTokenFileName || "",
    selectedTokens: doc?.designTokensJson || doc?.rawDesignTokens || {},
    designConcept: doc?.designConcept || {},
    styleClassification: doc?.styleClassification || null,
    designPromptContext: doc?.designConcept?.promptContext || "",
    designData: {
      summary: doc?.summary || {},
      normalizedSchema: doc?.normalizedSchema || null,
      extractionStatus: doc?.extractionStatus || doc?.status || "",
      sourceHash: doc?.sourceHash || "",
    },
  };
}

function buildWizardPayload(runKey) {
  const doc = selectedDocument();
  const sectionInputs = mergeSectionInputs(contentState.sectionInputs || {});
  const promo = {
    ...contentState.promo,
    leadText: contentState.promo.leadText || sectionInputs.heroBanner.leaderText || contentState.simpleBrief.mainOffer,
    subline: contentState.promo.subline || sectionInputs.heroBanner.sublineText || sectionInputs.contentCta.longText || contentState.simpleBrief.secondaryMessage,
    ctaLabel: contentState.promo.ctaLabel || sectionInputs.heroBanner.cta?.label || sectionInputs.contentCta.cta?.label || sectionInputs.stepBar?.[0]?.ctaLabel || contentState.simpleBrief.targetAction || "Learn More",
    ctaUrl: contentState.promo.ctaUrl || sectionInputs.heroBanner.cta?.link || sectionInputs.contentCta.cta?.link || sectionInputs.stepBar?.[0]?.link || "#",
    alphaText: contentState.promo.alphaText || sectionInputs.heroBanner.alphaText,
    termsText: contentState.promo.termsText || sectionInputs.titleDescription.contents || sectionInputs.footer.content || "Terms and conditions apply. Please play responsibly.",
  };
  const fillBlank = (path, value) => {
    if (!String(valueAtPath(sectionInputs, path) || "").trim() && String(value || "").trim()) {
      setValueAtPath(sectionInputs, path, value);
    }
  };
  fillBlank("heroBanner.leaderText", promo.leadText);
  fillBlank("heroBanner.title", promo.title);
  fillBlank("heroBanner.sublineText", promo.subline);
  fillBlank("heroBanner.cta.label", promo.ctaLabel);
  fillBlank("heroBanner.cta.link", promo.ctaUrl);
  fillBlank("heroBanner.alphaText", promo.alphaText);
  fillBlank("stepBar.0.title", contentState.simpleBrief.targetAction);
  fillBlank("stepBar.0.description", contentState.simpleBrief.mainOffer);
  fillBlank("stepBar.0.ctaLabel", promo.ctaLabel);
  fillBlank("stepBar.0.link", promo.ctaUrl);
  fillBlank("contentCta.title", contentState.simpleBrief.mainOffer || promo.title);
  fillBlank("contentCta.longText", contentState.simpleBrief.secondaryMessage || promo.subline);
  fillBlank("contentCta.cta.label", promo.ctaLabel);
  fillBlank("contentCta.cta.link", promo.ctaUrl);
  fillBlank("titleDescription.contents", promo.termsText);
  fillBlank("footer.content", promo.termsText);
  const promotionInput = {
    purpose: contentState.promo.promotionPurpose || "",
    purposeOther: contentState.promo.promotionPurposeOther || "",
    targetCustomer: contentState.simpleBrief.audience || "",
    campaignTone: contentState.simpleBrief.campaignTone || "",
  };
  const templateRuntime = {
    templateId: "wizard_lofi",
    templateName: "Standalone Promo Wizard",
    orderedSections: ["header", "heroBanner", "stepBar", "contentCta", "imageTextRow", "titleDescription", "footer"],
    visibleSections: ["header", "heroBanner", "stepBar", "contentCta", "imageTextRow", "titleDescription", "footer"],
  };
  return {
    id: runKey,
    generatedAt: new Date().toISOString(),
    selectedDesignStyleId: doc?.id || "",
    md: selectedDesignPayload(doc),
    promo,
    promotionInput,
    marketVisualGuidance: promo.market ? `Use ${promo.market} as market context without inventing visible copy.` : "",
    simpleBrief: { ...contentState.simpleBrief },
    sectionInputs,
    sectionConfig: {
      visibleSections: templateRuntime.visibleSections,
      source: "standalone_wizard",
    },
    template: {
      id: "standalone_promo_wizard",
      name: "Standalone Promo Wizard",
      designMode: "ai",
      generationMode: "lofi_draft",
      inputMode: "wizard",
      sectionOrder: templateRuntime.orderedSections,
      visibleSections: templateRuntime.visibleSections,
    },
    inputSnapshot: {
      promo,
      promotionInput,
      simpleBrief: { ...contentState.simpleBrief },
      sectionInputs,
      sectionConfig: {
        visibleSections: templateRuntime.visibleSections,
        source: "standalone_wizard",
      },
      templateRuntime,
      marketVisualGuidance: promo.market ? `Use ${promo.market} as market context without inventing visible copy.` : "",
    },
  };
}

function runId() {
  return runState?.run?.runId || runState?.runId || "";
}

function runStatusText() {
  const run = runState?.run || {};
  return [run.stage, run.status].filter(Boolean).join(" / ") || "not started";
}

function workerTimeout(stage) {
  return Number(workerSetting(stage)?.timeoutMs || 0) || undefined;
}

function integratedBriefReady() {
  const statusValue = String(runState?.integratedBrief?.status || "");
  return ["ready", "completed"].includes(statusValue);
}

function integratedBriefFailed() {
  const briefStatus = String(runState?.integratedBrief?.status || "");
  const runStatus = String(runState?.run?.status || "");
  return /failed/i.test(briefStatus) || /integrated_brief_(?:trigger_)?failed/i.test(runStatus);
}

function integratedBriefErrorMessage() {
  return String(runState?.integratedBrief?.errorMessage || runState?.run?.errorMessage || "").trim();
}

function draftImageSrc(draft) {
  return draft?.draftId ? `/api/promo-generation-lofi-draft-image?draftId=${encodeURIComponent(draft.draftId)}` : "";
}

function finalDesignImageSrc(finalDesign) {
  return finalDesign?.finalDesignId ? `/api/promo-generation-final-design-image?finalDesignId=${encodeURIComponent(finalDesign.finalDesignId)}` : "";
}

function isReadyDraft(draft) {
  return ["ready", "completed"].includes(String(draft?.status || ""));
}

function isReadyFinalDesign(finalDesign) {
  return ["ready", "completed"].includes(String(finalDesign?.status || ""));
}

function isActiveStatus(statusValue) {
  return /queued|generating|running|pending|accepted/i.test(String(statusValue || ""));
}

function generationProgress(label, statusValue, isComplete = false) {
  if (isComplete) return { text: `${label} · 완료`, kind: "ready" };
  if (isActiveStatus(statusValue)) return { text: `${label} · 진행 중`, kind: "progress" };
  return { text: `${label} · 진행 전`, kind: "pending" };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || payload.workerTrigger?.error || `HTTP ${response.status}`);
  }
  return payload;
}

async function createOrRefreshRun() {
  if (runId()) return runState;
  const runKey = createRunKey();
  const payload = buildWizardPayload(runKey);
  const result = await fetchJson("/api/promo-generation-runs", {
    method: "POST",
    body: JSON.stringify({ runKey, payload }),
  });
  saveWizardRun(result.state || result);
  return runState;
}

async function queueIntegratedBrief() {
  if (!runId() || integratedBriefReady()) return;
  const result = await fetchJson("/api/promo-generation-integrated-brief", {
    method: "POST",
    body: JSON.stringify({
      runId: runId(),
      triggerWorker: true,
      triggerTimeoutMs: workerTimeout("integrated_brief"),
      promptMeta: {
        source: "standalone_wizard",
        contentCoverageRequired: true,
      },
    }),
  });
  if (result.state) saveWizardRun(result.state);
}

async function refreshRunState() {
  if (!runId()) return;
  const result = await fetchJson(`/api/promo-generation-runs?runId=${encodeURIComponent(runId())}`);
  saveWizardRun(result);
}

function syncRunPolling() {
  if (runPollingTimer) {
    window.clearInterval(runPollingTimer);
    runPollingTimer = null;
  }
  const run = runState?.run || {};
  const drafts = Array.isArray(runState?.drafts) ? runState.drafts : [];
  const finalDesigns = Array.isArray(runState?.finalDesigns) ? runState.finalDesigns : [];
  const active = isActiveStatus(run.status)
    || drafts.some((draft) => isActiveStatus(draft.status))
    || finalDesigns.some((finalDesign) => isActiveStatus(finalDesign.status));
  if (!active) return;
  runPollingTimer = window.setInterval(async () => {
    try {
      await refreshRunState();
      renderStep();
      syncRunPolling();
    } catch (error) {
      runError = error.message;
      renderStep();
    }
  }, 5000);
}

async function prepareLofiRun() {
  runLoading = true;
  runError = "";
  renderStep();
  try {
    await createOrRefreshRun();
    await queueIntegratedBrief();
    await refreshRunState().catch(() => false);
    syncRunPolling();
  } catch (error) {
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

async function createNewLofiDraft() {
  runLoading = true;
  runError = "";
  renderStep();
  try {
    await createOrRefreshRun();
    if (!integratedBriefReady()) {
      await queueIntegratedBrief();
      await refreshRunState().catch(() => false);
      if (!integratedBriefReady()) {
        throw new Error("Integrated Brief is not ready yet. Wait for generation to finish, then create a LO-FI draft.");
      }
    }
    const result = await fetchJson("/api/promo-generation-lofi-drafts", {
      method: "POST",
      body: JSON.stringify({
        runId: runId(),
        triggerWorker: true,
        triggerTimeoutMs: workerTimeout("lofi_draft"),
        promptMeta: {
          source: "standalone_wizard",
          contentSnapshot: {
            promo: contentState.promo,
            simpleBrief: contentState.simpleBrief,
          },
          contentCoverageRequired: true,
        },
      }),
    });
    if (result.state) saveWizardRun(result.state);
    await refreshRunState().catch(() => false);
    syncRunPolling();
  } catch (error) {
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

async function generateFinalDesign() {
  const confirmed = runState?.confirmedDraft || null;
  if (!confirmed?.draftId) {
    runError = "Final Design 생성 전에 LO-FI 시안 하나를 Confirm Draft로 선택해 주세요.";
    renderStep();
    return;
  }

  runLoading = true;
  runError = "";
  renderStep();
  try {
    const result = await fetchJson("/api/promo-generation-final-designs", {
      method: "POST",
      body: JSON.stringify({
        runId: runId(),
        confirmedDraftId: confirmed.draftId,
        triggerWorker: true,
        triggerTimeoutMs: workerTimeout("final_design"),
        promptMeta: {
          source: "standalone_wizard",
          confirmedDraftId: confirmed.draftId,
          contentCoverageRequired: true,
        },
      }),
    });
    if (result.state) saveWizardRun(result.state);
    else if (result.finalDesign) mergeQueuedFinalDesign(result.finalDesign);
    await refreshRunState().catch(() => false);
    syncRunPolling();
  } catch (error) {
    await refreshRunState().catch(() => false);
    syncRunPolling();
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

async function confirmDraft(draft) {
  if (!draft?.draftId) return;
  runLoading = true;
  runError = "";
  renderStep();
  try {
    const result = await fetchJson("/api/promo-generation-lofi-draft-confirm", {
      method: "POST",
      body: JSON.stringify({ draftId: draft.draftId }),
    });
    saveWizardRun(result.state || result);
    syncRunPolling();
  } catch (error) {
    runError = error.message;
  } finally {
    runLoading = false;
    renderStep();
  }
}

function renderConceptStep() {
  placeholders.className = "concept-layout";
  placeholders.innerHTML = "";

  if (conceptsLoading) {
    const loading = document.createElement("article");
    loading.className = "placeholder-card";
    appendTextElement(loading, "strong", "", "Loading Design MD");
    appendTextElement(loading, "span", "", "A섹션 디자인 데이터를 불러오는 중입니다.");
    placeholders.append(loading);
    return;
  }

  if (conceptsError) {
    const error = document.createElement("article");
    error.className = "placeholder-card";
    appendTextElement(error, "strong", "", "Design MD load failed");
    appendTextElement(error, "span", "", conceptsError);
    placeholders.append(error);
    return;
  }

  const docs = designDocuments;
  if (!docs.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "No Design MD");
    appendTextElement(empty, "span", "", "A섹션 데이터를 새로고침해 주세요.");
    placeholders.append(empty);
    return;
  }

  const carousel = document.createElement("section");
  carousel.className = "concept-carousel";
  carousel.setAttribute("aria-label", "Design MD concept carousel");

  const previous = document.createElement("button");
  previous.className = "concept-carousel-control concept-carousel-previous";
  previous.type = "button";
  previous.setAttribute("aria-label", "이전 디자인 콘셉트 보기");
  previous.textContent = "←";

  const list = document.createElement("div");
  list.className = "concept-list";
  list.tabIndex = 0;
  docs.forEach((doc) => list.append(createConceptCard(doc)));

  const next = document.createElement("button");
  next.className = "concept-carousel-control concept-carousel-next";
  next.type = "button";
  next.setAttribute("aria-label", "다음 디자인 콘셉트 보기");
  next.textContent = "→";

  const updateControls = () => {
    const maxScroll = Math.max(0, list.scrollWidth - list.clientWidth);
    previous.disabled = list.scrollLeft <= 2;
    next.disabled = list.scrollLeft >= maxScroll - 2;
  };
  const moveCarousel = (direction) => {
    const card = list.querySelector(".concept-card");
    const gap = Number.parseFloat(getComputedStyle(list).gap) || 12;
    const distance = card ? card.getBoundingClientRect().width + gap : list.clientWidth * 0.8;
    list.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  previous.addEventListener("click", () => moveCarousel(-1));
  next.addEventListener("click", () => moveCarousel(1));
  list.addEventListener("scroll", updateControls, { passive: true });
  list.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveCarousel(event.key === "ArrowLeft" ? -1 : 1);
  });

  carousel.append(previous, list, next);
  placeholders.append(carousel);
  requestAnimationFrame(() => {
    list.querySelector(".concept-card.is-selected")?.scrollIntoView({ inline: "center", block: "nearest" });
    updateControls();
  });
}

async function loadDesignDocuments(options = {}) {
  conceptsLoading = true;
  conceptsError = "";
  renderStep();
  try {
    const url = options.fresh ? `/api/design-documents?ts=${Date.now()}` : "/api/design-documents";
    const response = await fetch(url);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `API ${response.status}`);
    designDocuments = Array.isArray(payload.documents) ? payload.documents : [];
    if (!selectedDocumentId || !designDocuments.some((doc) => doc.id === selectedDocumentId)) {
      selectedDocumentId = designDocuments[0]?.id || "";
    }
    if (selectedDocumentId) localStorage.setItem(storageKeys.selectedDocumentId, selectedDocumentId);
  } catch (error) {
    conceptsError = error.message || "A섹션 디자인 데이터를 불러오지 못했습니다.";
  } finally {
    conceptsLoading = false;
    renderStep();
  }
}

function renderStep() {
  const step = steps[currentStep];
  title.textContent = step.title;
  copy.textContent = step.copy;
  eyebrow.textContent = `Step ${currentStep + 1}`;
  status.textContent = `Step ${currentStep + 1} / ${steps.length}`;
  prev.disabled = currentStep === 0;
  next.disabled = currentStep === steps.length - 1;

  stepButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === currentStep);
    button.classList.toggle("is-complete", index < currentStep);
  });

  if (currentStep === 0) {
    renderConceptStep();
    return;
  }

  if (currentStep === 1) {
    renderContentStep();
    return;
  }

  if (currentStep === 2) {
    renderLofiStep();
    return;
  }

  if (currentStep === 3) {
    renderFinalStep();
    return;
  }

  placeholders.className = "placeholder-grid";
  placeholders.innerHTML = "";
  step.cards.forEach(([cardTitle, cardCopy]) => {
    const card = document.createElement("article");
    card.className = "placeholder-card";

    const heading = document.createElement("strong");
    heading.textContent = cardTitle;

    const body = document.createElement("span");
    body.textContent = cardCopy;

    card.append(heading, body);
    placeholders.append(card);
  });
}

stepButtons.forEach((button, index) => {
  button.addEventListener("click", async () => {
    if (index >= 2 && !validateContentStep()) {
      currentStep = 1;
      renderStep();
      return;
    }
    if (index >= 3 && !runState?.confirmedDraft) {
      currentStep = 2;
      runError = "Final Design으로 이동하기 전에 LO-FI 시안 하나를 Confirm Draft로 선택해 주세요.";
      renderStep();
      return;
    }
    currentStep = index;
    renderStep();
    if (currentStep === 2 && !runId()) {
      await prepareLofiRun();
    }
  });
});

prev.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  renderStep();
});

next.addEventListener("click", async () => {
  if (currentStep === 1 && !validateContentStep()) {
    renderStep();
    return;
  }
  if (currentStep === 2 && !runState?.confirmedDraft) {
    runError = "Final Design으로 이동하기 전에 LO-FI 시안 하나를 Confirm Draft로 선택해 주세요.";
    renderStep();
    return;
  }
  currentStep = Math.min(steps.length - 1, currentStep + 1);
  renderStep();
  if (currentStep === 2 && !runId()) {
    await prepareLofiRun();
  }
});

renderStep();
loadDesignDocuments();
loadWorkerSettings();
syncRunPolling();

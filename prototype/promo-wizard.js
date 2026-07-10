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
    copy: "새 LO-FI 시안을 누적 생성하고, 생성된 후보 중 하나를 Final Design 기준으로 확정합니다.",
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
let conceptSearch = "";
let validationErrors = {};
let runState = loadWizardRun();
let runLoading = false;
let runError = "";
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
const conceptToolbar = document.getElementById("concept-toolbar");
const conceptSearchInput = document.getElementById("concept-search");
const refreshConcepts = document.getElementById("refresh-concepts");

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
  };
}

function loadWizardContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeys.wizardContent) || "null");
    const fallback = defaultWizardContent();
    return {
      promo: { ...fallback.promo, ...(saved?.promo || {}) },
      simpleBrief: { ...fallback.simpleBrief, ...(saved?.simpleBrief || {}) },
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

function filteredDocuments() {
  const search = conceptSearch.trim().toLowerCase();
  if (!search) return designDocuments;
  return designDocuments.filter((doc) => {
    const haystack = [
      doc.brandName,
      doc.slug,
      doc.sourceName,
      conceptSummary(doc),
      ...tagsForDocument(doc),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(search);
  });
}

function selectDocument(id) {
  selectedDocumentId = id;
  localStorage.setItem(storageKeys.selectedDocumentId, id);
  saveWizardRun(null);
  runError = "";
  renderStep();
}

function createConceptCard(doc) {
  const selected = doc.id === selectedDocumentId;
  const button = document.createElement("button");
  button.className = `concept-card${selected ? " is-selected" : ""}`;
  button.type = "button";
  button.addEventListener("click", () => selectDocument(doc.id));

  const header = document.createElement("span");
  header.className = "concept-card-header";

  const brand = document.createElement("strong");
  brand.textContent = doc.brandName || doc.slug || "Untitled Design MD";

  const state = document.createElement("small");
  state.textContent = selected ? "Selected in A section" : (doc.extractionStatus || doc.status || "ready");

  header.append(brand, state);

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

  button.append(header, summary, meta, tags);
  return button;
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
    appendTextElement(wrapper, "small", "content-field-error", "입력해 주세요.");
  }

  return wrapper;
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
    termsText: "Players must be aged 18+ to participate. Promotion terms and conditions apply. Please play responsibly.",
  };
  contentState.simpleBrief = {
    mainOffer: "Limited-time welcome bonus for new players",
    targetAction: "Register and claim the offer",
    audience: "신규",
    campaignTone: "긴급함",
    secondaryMessage: "A clear promotional flow from offer discovery to CTA conversion.",
  };
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

function renderContentStep() {
  conceptToolbar.hidden = true;
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
  autofill.textContent = "자동등록";
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
    { group: "simpleBrief", key: "campaignTone", label: "캠페인 톤", required: true, options: ["활기찬", "신중한", "럭키", "프리미엄", "긴급함", "친근함"] },
  ]);

  if (contentState.promo.promotionPurpose !== "기타") {
    const otherField = overview.querySelector("label:nth-child(3)");
    if (otherField) otherField.hidden = true;
  }

  const message = createContentSection("2. 핵심 메시지", [
    { group: "simpleBrief", key: "mainOffer", label: "메인 오퍼", required: true, type: "textarea", rows: 3 },
    { group: "simpleBrief", key: "secondaryMessage", label: "보조 메시지", required: true, type: "textarea", rows: 3 },
    { group: "simpleBrief", key: "targetAction", label: "사용자 행동 목표", required: true },
    { group: "promo", key: "leadText", label: "Hero Lead Text", type: "textarea", rows: 2 },
    { group: "promo", key: "subline", label: "Hero Subline", type: "textarea", rows: 2 },
  ]);

  const conversion = createContentSection("3. CTA / 약관", [
    { group: "promo", key: "ctaLabel", label: "CTA 버튼 텍스트" },
    { group: "promo", key: "ctaUrl", label: "CTA URL", type: "url", placeholder: "https://..." },
    { group: "promo", key: "alphaText", label: "Alpha / 보조 고지" },
    { group: "promo", key: "termsText", label: "약관 / Responsible Gaming 문구", type: "textarea", rows: 4 },
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
  ].forEach(([label, value]) => {
    const item = document.createElement("li");
    item.className = String(value || "").trim() ? "is-ready" : "is-missing";
    item.textContent = label;
    list.append(item);
  });
  coverage.append(list);

  placeholders.append(toolbar, overview, message, conversion, coverage);
}

function createStatusPill(text, kind = "") {
  const pill = document.createElement("span");
  pill.className = `status-chip${kind ? ` ${kind}` : ""}`;
  pill.textContent = text || "unknown";
  return pill;
}

function createLofiDraftCard(draft) {
  const card = document.createElement("article");
  card.className = `lofi-draft-card${draft.confirmedAt ? " is-confirmed" : ""}`;

  const header = document.createElement("div");
  header.className = "lofi-draft-header";
  appendTextElement(header, "strong", "", `LO-FI 시안 #${draft.draftAttempt || "-"}`);
  header.append(createStatusPill(draft.confirmedAt ? "Confirmed" : draft.status, isReadyDraft(draft) ? "ready" : ""));

  const preview = document.createElement("div");
  preview.className = "lofi-preview";
  if (draft.draftImageUrl || isReadyDraft(draft)) {
    const image = document.createElement("img");
    image.alt = `LO-FI draft attempt ${draft.draftAttempt || ""}`;
    image.src = draftImageSrc(draft);
    image.loading = "lazy";
    preview.append(image);
  } else {
    appendTextElement(preview, "span", "", isActiveStatus(draft.status) ? "시안 생성 중" : "이미지 없음");
  }

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

function renderLofiStep() {
  conceptToolbar.hidden = true;
  placeholders.className = "lofi-layout";
  placeholders.innerHTML = "";

  const run = runState?.run || null;
  const drafts = Array.isArray(runState?.drafts) ? [...runState.drafts] : [];
  drafts.sort((a, b) => Number(a.draftAttempt || 0) - Number(b.draftAttempt || 0));
  const confirmed = runState?.confirmedDraft || drafts.find((draft) => draft.confirmedAt) || null;

  const summary = document.createElement("section");
  summary.className = "lofi-run-summary";
  appendTextElement(summary, "span", "eyebrow", "LO-FI Generation Run");
  appendTextElement(summary, "h3", "", run?.promoTitle || contentState.promo.title || "Untitled promo");
  appendTextElement(summary, "p", "", "새 LO-FI 시안을 생성하면 기존 시안은 유지되고 draft attempt가 하나 더 추가됩니다.");

  const statusRow = document.createElement("div");
  statusRow.className = "lofi-status-row";
  statusRow.append(createStatusPill(runStatusText()));
  statusRow.append(createStatusPill(integratedBriefReady() ? "Brief ready" : "Brief pending", integratedBriefReady() ? "ready" : ""));
  statusRow.append(createStatusPill(`Integrated Brief ${workerStatusLabel("integrated_brief")}`, workerReady("integrated_brief") ? "ready" : ""));
  statusRow.append(createStatusPill(`LO-FI ${workerStatusLabel("lofi_draft")}`, workerReady("lofi_draft") ? "ready" : ""));
  statusRow.append(createStatusPill(`${drafts.length} drafts`));
  if (confirmed?.draftAttempt) statusRow.append(createStatusPill(`Confirmed #${confirmed.draftAttempt}`, "ready"));
  summary.append(statusRow);
  if (workerSettingsError) appendTextElement(summary, "p", "lofi-error", `Worker settings: ${workerSettingsError}`);

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
  prepare.textContent = runId() ? "상태 새로고침" : "생성 준비 시작";
  prepare.disabled = runLoading;
  prepare.addEventListener("click", async () => {
    if (runId()) {
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
  if (!integratedBriefReady()) {
    appendTextElement(actionPanel, "small", "", runId()
      ? "Integrated Brief가 ready가 되면 새 LO-FI 시안을 생성할 수 있습니다."
      : "먼저 생성 준비를 시작해 Integrated Brief를 큐에 넣어 주세요.");
  }
  if (!workerReady("integrated_brief") || !workerReady("lofi_draft")) {
    appendTextElement(actionPanel, "small", "", "관리자 페이지에서 integrated_brief / lofi_draft n8n webhook이 active인지 확인해 주세요. 환경변수로 설정된 경우에는 서버가 그대로 worker를 호출합니다.");
  }
  if (runLoading) appendTextElement(actionPanel, "small", "", "요청 처리 중입니다.");
  if (runError) appendTextElement(actionPanel, "small", "lofi-error", runError);

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

  placeholders.append(summary, actionPanel, list);
}

function createSelectedConceptPanel(doc) {
  const panel = document.createElement("article");
  panel.className = "selected-concept-panel";

  appendTextElement(panel, "span", "eyebrow", "A Section Selected Concept");
  appendTextElement(panel, "h3", "", doc?.brandName || "No concept selected");
  appendTextElement(panel, "p", "", doc ? conceptSummary(doc) : "A섹션에서 사용할 Design MD를 선택해 주세요.");

  const list = document.createElement("dl");
  [
    ["Source", doc?.sourceName || "-"],
    ["Updated", doc?.updatedAt || "-"],
    ["Tokens", compactCount(doc?.summary?.tokenCount)],
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    appendTextElement(row, "dt", "", label);
    appendTextElement(row, "dd", "", value);
    list.append(row);
  });

  panel.append(list);
  return panel;
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
  const promo = {
    ...contentState.promo,
    leadText: contentState.promo.leadText || contentState.simpleBrief.mainOffer,
    subline: contentState.promo.subline || contentState.simpleBrief.secondaryMessage,
    ctaLabel: contentState.promo.ctaLabel || contentState.simpleBrief.targetAction || "Learn More",
    ctaUrl: contentState.promo.ctaUrl || "#",
    termsText: contentState.promo.termsText || "Terms and conditions apply. Please play responsibly.",
  };
  const promotionInput = {
    purpose: contentState.promo.promotionPurpose || "",
    purposeOther: contentState.promo.promotionPurposeOther || "",
    targetCustomer: contentState.simpleBrief.audience || "",
    campaignTone: contentState.simpleBrief.campaignTone || "",
  };
  const sectionInputs = {
    heroBanner: {
      headline: promo.title,
      sublineText: promo.leadText,
      alphaText: promo.alphaText,
      cta: { label: promo.ctaLabel, link: promo.ctaUrl },
    },
    contentCta: {
      title: promo.title,
      longText: promo.subline,
      cta: { label: promo.ctaLabel, link: promo.ctaUrl },
    },
    titleDescription: {
      title: promo.title,
      contents: promo.termsText,
    },
    footer: {
      content: promo.termsText,
    },
  };
  const templateRuntime = {
    templateId: "wizard_lofi",
    templateName: "Standalone Promo Wizard",
    orderedSections: ["header", "heroBanner", "contentCta", "titleDescription", "footer"],
    visibleSections: ["header", "heroBanner", "contentCta", "titleDescription", "footer"],
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

function draftImageSrc(draft) {
  return draft?.draftId ? `/api/promo-generation-lofi-draft-image?draftId=${encodeURIComponent(draft.draftId)}` : "";
}

function isReadyDraft(draft) {
  return ["ready", "completed"].includes(String(draft?.status || ""));
}

function isActiveStatus(statusValue) {
  return /queued|generating|running|pending|accepted/i.test(String(statusValue || ""));
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
  const active = isActiveStatus(run.status) || drafts.some((draft) => isActiveStatus(draft.status));
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
  conceptToolbar.hidden = false;
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

  const docs = filteredDocuments();
  const selected = selectedDocument();
  if (!docs.length) {
    const empty = document.createElement("article");
    empty.className = "placeholder-card";
    appendTextElement(empty, "strong", "", "No matching Design MD");
    appendTextElement(empty, "span", "", "검색어를 변경하거나 A섹션 데이터를 새로고침해 주세요.");
    placeholders.append(empty);
    return;
  }

  const selectedPanel = createSelectedConceptPanel(selected);

  const list = document.createElement("div");
  list.className = "concept-list";
  docs.forEach((doc) => list.append(createConceptCard(doc)));

  placeholders.append(selectedPanel, list);
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

  conceptToolbar.hidden = true;
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

conceptSearchInput.addEventListener("input", (event) => {
  conceptSearch = event.target.value;
  renderStep();
});

refreshConcepts.addEventListener("click", () => {
  loadDesignDocuments({ fresh: true });
});

renderStep();
loadDesignDocuments();
loadWorkerSettings();
syncRunPolling();

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
    title: "LO-FI Draft Selection",
    copy: "Generate LO-FI drafts from the validated Integrated Brief, then select the draft to finalize.",
    cards: [
      ["Integrated Brief", "Queue, poll, and inspect the source-of-truth brief."],
      ["Draft Images", "Review draft attempts and image proxy output."],
      ["Confirm Draft", "Lock one LO-FI draft before final generation."],
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
};

let currentStep = 0;
let designDocuments = [];
let selectedDocumentId = localStorage.getItem(storageKeys.selectedDocumentId) || "";
let conceptsLoading = false;
let conceptsError = "";
let conceptSearch = "";

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
  button.addEventListener("click", () => {
    currentStep = index;
    renderStep();
  });
});

prev.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  renderStep();
});

next.addEventListener("click", () => {
  currentStep = Math.min(steps.length - 1, currentStep + 1);
  renderStep();
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

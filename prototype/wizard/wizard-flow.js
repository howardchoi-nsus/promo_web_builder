(function registerCreatePromoFlow(global) {
  const STEPS = Object.freeze([
    Object.freeze({
      key: "overview",
      title: "프로모션 개요",
      copy: "프로모션 목적, 대상 고객, 혜택과 캠페인 톤을 등록합니다.",
    }),
    Object.freeze({
      key: "template",
      title: "프로모션 템플릿",
      copy: "프로모션 개요에 적합한 활성 템플릿을 선택합니다.",
    }),
    Object.freeze({
      key: "layout",
      title: "레이아웃 및 디자인",
      copy: "디자인 토큰을 선택하고 콘텐츠와 섹션 레이아웃을 편집합니다.",
    }),
    Object.freeze({
      key: "output",
      title: "웹 출력 미리보기",
      copy: "완성된 프로모션을 별도 웹 출력 화면에서 확인합니다.",
    }),
  ]);

  const STEP_KEYS = Object.freeze(STEPS.map((step) => step.key));
  const CONTENT_SUBSTEPS = Object.freeze(["overview", "template", "layout"]);

  function normalizeStep(value, fallback = "overview") {
    const raw = String(value || "").trim();
    return STEP_KEYS.includes(raw) ? raw : (STEP_KEYS.includes(fallback) ? fallback : "overview");
  }

  function migrateLegacyStep(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    const numeric = Number(raw);
    if (!Number.isInteger(numeric)) return "";
    if (numeric <= 1) return "overview";
    if (numeric === 2) return "template";
    if (numeric === 3) return "layout";
    if (numeric >= 4) return "output";
    return "";
  }

  function stepForContentSubstep(value) {
    return CONTENT_SUBSTEPS.includes(value) ? value : "overview";
  }

  function stepIndex(value) {
    return Math.max(0, STEP_KEYS.indexOf(normalizeStep(value)));
  }

  function resolveInitialStep(storedStep, contentSubstep, legacyStep = "") {
    const stored = String(storedStep || "").trim();
    if (STEP_KEYS.includes(stored)) return stored;
    return migrateLegacyStep(legacyStep) || stepForContentSubstep(contentSubstep);
  }

  function previousStep(current) {
    return STEP_KEYS[Math.max(0, stepIndex(current) - 1)];
  }

  function nextStep(current) {
    return STEP_KEYS[Math.min(STEPS.length - 1, stepIndex(current) + 1)];
  }

  global.PromoCreateFlow = Object.freeze({
    STEPS,
    STEP_KEYS,
    CONTENT_SUBSTEPS,
    normalizeStep,
    migrateLegacyStep,
    stepForContentSubstep,
    stepIndex,
    resolveInitialStep,
    previousStep,
    nextStep,
  });
})(globalThis);

(function registerCreatePromoFlow(global) {
  const STEPS = Object.freeze([
    Object.freeze({
      key: "style",
      title: "디자인 토큰 선택",
      copy: "프로모션에 적용할 색상, 글꼴, 간격과 컴포넌트 스타일 세트를 선택합니다.",
    }),
    Object.freeze({
      key: "overview",
      title: "프로모션 개요 등록",
      copy: "프로모션 제목, 목적, 대상 고객과 캠페인 톤을 등록합니다.",
    }),
    Object.freeze({
      key: "template",
      title: "프로모션 템플릿 선택",
      copy: "관리자가 활성화한 프로모션 템플릿을 선택합니다.",
    }),
    Object.freeze({
      key: "layout",
      title: "템플릿 레이아웃",
      copy: "선택한 템플릿의 콘텐츠와 섹션 레이아웃을 편집합니다.",
    }),
    Object.freeze({
      key: "output",
      title: "웹 출력 미리보기",
      copy: "완성된 프로모션을 별도 웹 출력 화면에서 확인합니다.",
    }),
  ]);

  const CONTENT_SUBSTEPS = Object.freeze(["overview", "template", "layout"]);

  function normalizeStep(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isInteger(numeric) && numeric >= 0 && numeric < STEPS.length
      ? numeric
      : fallback;
  }

  function stepForContentSubstep(value) {
    return ({ overview: 1, template: 2, layout: 3 })[value] ?? 0;
  }

  function resolveInitialStep(storedStep, contentSubstep) {
    return normalizeStep(storedStep, stepForContentSubstep(contentSubstep));
  }

  function previousStep(current) {
    return Math.max(0, normalizeStep(current) - 1);
  }

  function nextStep(current) {
    return Math.min(STEPS.length - 1, normalizeStep(current) + 1);
  }

  global.PromoCreateFlow = Object.freeze({
    STEPS,
    CONTENT_SUBSTEPS,
    normalizeStep,
    stepForContentSubstep,
    resolveInitialStep,
    previousStep,
    nextStep,
  });
})(globalThis);

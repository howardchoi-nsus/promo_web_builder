(function bootstrapPromotionBuilder(global) {
  const query = new URLSearchParams(global.location.search);
  const mode = query.get("mode") || "";
  const legacyRoot = document.querySelector("[data-template-builder-root]");
  const aiRoot = document.querySelector("#ai-builder-app");

  function loadScript(src, type = "") {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      if (type) script.type = type;
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });
  }

  if (mode === "template") {
    if (legacyRoot) legacyRoot.hidden = false;
    if (aiRoot) aiRoot.hidden = true;
    loadScript("create-promo.js?v=create-promo-light-v41").catch(() => {
      const status = document.querySelector("#wizard-shell-status");
      if (status) status.textContent = "템플릿 빌더를 불러오지 못했습니다.";
    });
    return;
  }

  if (legacyRoot) legacyRoot.hidden = true;
  if (aiRoot) aiRoot.hidden = false;
  loadScript("visual-editor-assets/ai-builder.js?v=ai-builder-v1", "module").catch(() => {
    if (aiRoot) {
      aiRoot.innerHTML = '<p role="alert">AI 빌더를 불러오지 못했습니다. 템플릿 모드로 이동해 주세요.</p>';
    }
  });
})(globalThis);

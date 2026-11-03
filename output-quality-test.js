(() => {
  const endpoint = "/api/promo-page-quality-test";
  const form = document.getElementById("quality-test-form");
  const presetSelect = document.getElementById("preset");
  const accessKey = document.getElementById("access-key");
  const accessField = document.getElementById("access-field");
  const runButton = document.getElementById("run-button");
  const runButtonLabel = document.getElementById("run-button-label");
  const submitHint = document.getElementById("submit-hint");
  const readinessBanner = document.getElementById("readiness-banner");
  const readinessTitle = document.getElementById("readiness-title");
  const readinessDescription = document.getElementById("readiness-description");
  const readinessList = document.getElementById("readiness-list");
  const readinessToggle = document.getElementById("readiness-toggle");
  const readinessDetails = document.getElementById("readiness-details");
  const systemState = document.getElementById("system-state");
  const resultStatus = document.getElementById("result-status");
  const resultPanel = document.getElementById("result-panel");
  const openResult = document.getElementById("open-result");
  const previewShell = document.getElementById("preview-shell");
  const previewStage = document.getElementById("preview-stage");
  const previewEmpty = document.getElementById("preview-empty");
  const previewFrame = document.getElementById("result-frame");
  const previewLabel = document.getElementById("preview-label");
  const previewModeLabel = document.getElementById("preview-mode-label");
  const checkGrid = document.getElementById("check-grid");
  const resultMeta = document.getElementById("result-meta");
  const elapsedTime = document.getElementById("elapsed-time");

  const presets = {
    balanced: {
      brand: "Promo Web Builder",
      designDirection: "명확한 정보 위계와 넉넉한 여백을 사용하는 텍스트 중심 프로모션",
      title: "가을 멤버 위크",
      market: "KR",
      locale: "ko-KR",
      leadText: "이번 시즌 멤버를 위한 혜택을 한눈에 확인하세요.",
      subline: "기간 내 대상 고객에게만 제공됩니다.",
      ctaLabel: "혜택 확인하기",
      ctaUrl: "/benefits/autumn",
      termsText: "대상 및 기간 등 자세한 조건은 프로모션 유의사항을 확인해 주세요.",
    },
    "long-copy": {
      brand: "Promo Web Builder",
      designDirection: "긴 제목과 유의사항도 읽기 쉽게 유지하는 단정한 텍스트 중심 레이아웃",
      title: "신규 및 기존 멤버 모두를 위한 연말 스페셜 리워드 프로그램",
      market: "KR",
      locale: "ko-KR",
      leadText: "참여 조건을 확인하고 기간 한정으로 제공되는 추가 혜택과 멤버 전용 리워드를 한 번에 만나보세요.",
      subline: "회원 등급과 참여 시점에 따라 적용되는 혜택이 달라질 수 있습니다.",
      ctaLabel: "프로그램 상세 보기",
      ctaUrl: "/rewards/year-end",
      termsText: "본 프로모션은 지정된 기간 동안 대상 회원에게만 제공됩니다. 리워드 지급 시점과 사용 가능 범위는 회원 등급 및 지역에 따라 다를 수 있으며, 다른 프로모션과 중복 적용되지 않을 수 있습니다. 참여 전에 전체 약관과 제외 항목을 반드시 확인해 주세요.",
    },
    english: {
      brand: "Promo Web Builder",
      designDirection: "A restrained editorial promotion with direct hierarchy and generous whitespace",
      title: "Autumn Member Week",
      market: "US",
      locale: "en-US",
      leadText: "A clearer way to unlock your seasonal member benefit.",
      subline: "Available to eligible members for a limited time.",
      ctaLabel: "View benefit",
      ctaUrl: "/benefits/autumn",
      termsText: "Eligibility, timing, and local terms apply. Review the full promotion terms before participating.",
    },
  };

  const viewportSizes = {
    desktop: { width: 1440, height: 1000, label: "Desktop · 1440 × 1000" },
    mobile: { width: 390, height: 844, label: "Mobile · 390 × 844" },
  };

  const state = {
    mode: "sample",
    viewport: "desktop",
    readiness: null,
    running: false,
    hasPreview: false,
    result: null,
  };

  function applyPreset(key) {
    const values = presets[key] || presets.balanced;
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field) field.value = value;
    });
  }

  function collectInput() {
    const names = ["brand", "designDirection", "title", "market", "locale", "leadText", "subline", "ctaLabel", "ctaUrl", "termsText"];
    return Object.fromEntries(names.map((name) => [name, String(form.elements.namedItem(name)?.value || "").trim()]));
  }

  function stateLabel(value) {
    return {
      configured: "연결됨",
      missing: "미설정",
      unverified: "실행 후 확인",
      blocked: "대기",
    }[value] || "확인 필요";
  }

  function renderReadiness(data) {
    state.readiness = data;
    const configured = Boolean(data?.liveConfigured);
    readinessBanner.className = `readiness-banner ${configured ? "is-configured" : "is-fixture"}`;
    systemState.className = `system-state ${configured ? "is-configured" : "is-fixture"}`;
    systemState.textContent = configured ? "실제 생성 연결됨" : "샘플 테스트 가능";
    readinessTitle.textContent = configured
      ? "실제 AI 생성 경로가 연결되어 있습니다."
      : "현재는 샘플 계약 검사를 바로 사용할 수 있습니다.";
    readinessDescription.textContent = configured
      ? "첫 실제 실행에서 내부 브라우저 검사와 서명 결과 저장까지 최종 확인합니다."
      : "실제 AI 생성 환경은 아직 연결 전입니다. 샘플로 입력 구조와 출력 계약을 먼저 확인할 수 있습니다.";
    readinessList.replaceChildren();
    (data?.checks || []).forEach((check) => {
      const item = document.createElement("li");
      item.className = `readiness-item is-${check.state}`;
      const badge = document.createElement("span");
      badge.textContent = stateLabel(check.state);
      const title = document.createElement("strong");
      title.textContent = check.label;
      const detail = document.createElement("p");
      detail.textContent = check.message;
      item.append(badge, title, detail);
      readinessList.append(item);
    });
    updateModeControls();
  }

  function renderReadinessError() {
    state.readiness = { liveConfigured: false };
    readinessBanner.className = "readiness-banner is-error";
    systemState.className = "system-state is-error";
    systemState.textContent = "상태 확인 실패";
    readinessTitle.textContent = "실행 환경 상태를 불러오지 못했습니다.";
    readinessDescription.textContent = "잠시 후 새로고침해 주세요. 샘플 검사 요청도 실패할 수 있습니다.";
    readinessList.replaceChildren();
    updateModeControls();
  }

  async function loadReadiness() {
    try {
      const response = await fetch(endpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("readiness failed");
      if (data.defaultInput) presets.balanced = { ...presets.balanced, ...data.defaultInput };
      renderReadiness(data);
    } catch {
      renderReadinessError();
    }
  }

  function updateModeControls() {
    document.querySelectorAll("[data-test-mode]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.testMode === state.mode));
      button.disabled = state.running;
    });
    const live = state.mode === "live";
    const liveConfigured = Boolean(state.readiness?.liveConfigured);
    accessField.hidden = !live || !liveConfigured;
    runButtonLabel.textContent = state.running
      ? (live ? "생성 중…" : "검사 중…")
      : (live ? "실제 AI 생성 실행" : "샘플 검사 실행");
    submitHint.textContent = live
      ? (state.readiness?.liveConfigured
        ? "실제 생성은 최대 수 분이 걸릴 수 있으며 실행 중에는 자동 재시도하지 않습니다."
        : "생성 워크플로와 보호된 접근이 연결된 뒤 사용할 수 있습니다.")
      : "보통 1초 이내에 정적 계약과 미리보기를 확인합니다.";
    const liveBlocked = live && (!liveConfigured || !accessKey.value.trim());
    runButton.disabled = state.running || liveBlocked;
    form.setAttribute("aria-busy", String(state.running));
    resultPanel.setAttribute("aria-busy", String(state.running));
    form.querySelectorAll("input, textarea, select").forEach((control) => {
      control.disabled = state.running;
    });
  }

  function setMode(mode) {
    const nextMode = mode === "live" ? "live" : "sample";
    if (state.mode !== nextMode) invalidateResult("테스트 모드가 변경되었습니다. 새 모드로 다시 실행해 주세요.");
    state.mode = nextMode;
    updateModeControls();
  }

  function setResultStatus(kind, title, detail) {
    resultStatus.className = `result-status is-${kind}`;
    const text = resultStatus.querySelector("div");
    text.querySelector("strong").textContent = title;
    text.querySelector("p").textContent = detail;
  }

  function renderChecks(checks) {
    checkGrid.replaceChildren();
    (checks || []).forEach((check) => {
      const card = document.createElement("article");
      const normalizedState = check.state === "passed"
        ? "passed"
        : (check.state === "not_run" ? "not-run" : (check.state === "pending" ? "pending" : "failed"));
      card.className = `check-card is-${normalizedState}`;
      const mark = document.createElement("span");
      mark.textContent = normalizedState === "passed" ? "✓" : (normalizedState === "failed" ? "!" : "—");
      const title = document.createElement("strong");
      title.textContent = check.label;
      const detail = document.createElement("p");
      detail.textContent = check.detail;
      card.append(mark, title, detail);
      checkGrid.append(card);
    });
  }

  function clearPreviousResult() {
    state.result = null;
    state.hasPreview = false;
    previewFrame.hidden = true;
    previewFrame.removeAttribute("src");
    previewFrame.removeAttribute("srcdoc");
    previewFrame.style.removeProperty("width");
    previewFrame.style.removeProperty("height");
    previewFrame.style.removeProperty("transform");
    previewStage.style.removeProperty("height");
    previewEmpty.hidden = false;
    previewShell.classList.add("is-empty");
    previewModeLabel.textContent = "미리보기 대기";
    openResult.hidden = true;
    openResult.removeAttribute("href");
    resultMeta.replaceChildren();
    resultMeta.hidden = true;
    elapsedTime.textContent = "";
  }

  function invalidateResult(message) {
    if (!state.result && !state.hasPreview) return;
    clearPreviousResult();
    setResultStatus("idle", "입력 내용이 변경되었습니다.", message);
    renderChecks([
      { label: "정적 출력 계약", state: "pending", detail: "다시 실행해 주세요." },
      { label: "Desktop 1440", state: "pending", detail: "다시 실행해 주세요." },
      { label: "Mobile 390", state: "pending", detail: "다시 실행해 주세요." },
      { label: "서명 결과 저장", state: "pending", detail: "다시 실행해 주세요." },
    ]);
  }

  function scrollToResultOnSmallScreen() {
    if (!window.matchMedia("(max-width: 920px)").matches) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => resultStatus.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    }));
  }

  function renderMeta(data) {
    const items = [];
    if (data.promptMeta?.name || data.promptMeta?.version) {
      items.push(["Prompt", `${data.promptMeta.name || data.promptMeta.type || "promo_page_generation"} · v${data.promptMeta.version || "-"}`]);
    }
    if (data.contentHash) items.push(["Content hash", data.contentHash]);
    if (data.expiresAt) items.push(["Result expiry", new Date(data.expiresAt).toLocaleString("ko-KR")]);
    resultMeta.replaceChildren();
    items.forEach(([label, value]) => {
      const wrapper = document.createElement("div");
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = value;
      description.title = value;
      wrapper.append(term, description);
      resultMeta.append(wrapper);
    });
    resultMeta.hidden = items.length === 0;
  }

  function setPreview(data) {
    state.hasPreview = true;
    previewShell.classList.remove("is-empty");
    previewEmpty.hidden = true;
    previewFrame.hidden = false;
    if (data.mode === "live" && data.pagePath) {
      previewFrame.removeAttribute("srcdoc");
      previewFrame.src = data.pagePath;
      previewModeLabel.textContent = "검증된 실제 결과";
      openResult.href = data.pagePath;
      openResult.hidden = false;
    } else {
      previewFrame.removeAttribute("src");
      previewFrame.srcdoc = data.previewDocument || "";
      previewModeLabel.textContent = "계약 샘플 미리보기";
      openResult.hidden = true;
      openResult.removeAttribute("href");
    }
    requestAnimationFrame(updatePreviewScale);
  }

  function updatePreviewScale() {
    const viewport = viewportSizes[state.viewport];
    previewLabel.textContent = viewport.label;
    document.querySelectorAll("[data-viewport]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.viewport === state.viewport));
    });
    if (!state.hasPreview) return;
    const availableWidth = Math.max(280, previewStage.clientWidth);
    const scale = Math.min(1, availableWidth / viewport.width);
    previewFrame.style.width = `${viewport.width}px`;
    previewFrame.style.height = `${viewport.height}px`;
    previewFrame.style.transform = `scale(${scale})`;
    previewStage.style.height = `${Math.round(viewport.height * scale)}px`;
  }

  function renderSuccess(data, durationMs) {
    state.result = data;
    setResultStatus(
      "success",
      data.mode === "live" ? "실제 출력이 모든 품질 검사를 통과했습니다." : "샘플 출력 계약을 통과했습니다.",
      data.userMessage,
    );
    renderChecks(data.checks);
    renderMeta(data);
    setPreview(data);
    elapsedTime.textContent = `${(durationMs / 1000).toFixed(durationMs < 10_000 ? 1 : 0)}초`;
    scrollToResultOnSmallScreen();
  }

  function renderError(error, durationMs) {
    clearPreviousResult();
    const message = error?.userMessage || error?.message || "품질 테스트를 완료하지 못했습니다.";
    setResultStatus("error", "테스트를 완료하지 못했습니다.", message);
    renderChecks([
      { label: "요청 처리", state: "failed", detail: error?.code || "QUALITY_TEST_FAILED" },
      { label: "Desktop 1440", state: "not_run", detail: "검사가 완료되지 않았습니다." },
      { label: "Mobile 390", state: "not_run", detail: "검사가 완료되지 않았습니다." },
      { label: "서명 결과 저장", state: "not_run", detail: "결과를 저장하지 않았습니다." },
    ]);
    elapsedTime.textContent = durationMs ? `${(durationMs / 1000).toFixed(1)}초` : "";
    resultMeta.hidden = true;
    scrollToResultOnSmallScreen();
  }

  async function runTest(event) {
    event.preventDefault();
    if (state.running || !form.reportValidity()) return;
    if (state.mode === "live" && (!state.readiness?.liveConfigured || !accessKey.value.trim())) return;
    clearPreviousResult();
    state.running = true;
    updateModeControls();
    setResultStatus(
      "running",
      state.mode === "live" ? "실제 AI 결과를 생성하고 있습니다." : "샘플 출력 계약을 검사하고 있습니다.",
      state.mode === "live" ? "완료될 때까지 이 화면을 유지해 주세요." : "필수 문구와 안전한 HTML·CSS 구조를 확인합니다.",
    );
    scrollToResultOnSmallScreen();
    elapsedTime.textContent = "실행 중";
    const startedAt = performance.now();
    try {
      const headers = { Accept: "application/json", "Content-Type": "application/json" };
      if (state.mode === "live") headers["x-promo-quality-test-token"] = accessKey.value.trim();
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ mode: state.mode, input: collectInput() }),
      });
      const data = await response.json().catch(() => ({ userMessage: "서버 응답을 읽지 못했습니다." }));
      if (!response.ok || !data.ok) throw data;
      renderSuccess(data, performance.now() - startedAt);
    } catch (error) {
      renderError(error, performance.now() - startedAt);
    } finally {
      state.running = false;
      updateModeControls();
    }
  }

  document.querySelectorAll("[data-test-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.testMode));
  });
  document.querySelectorAll("[data-viewport]").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewport = button.dataset.viewport === "mobile" ? "mobile" : "desktop";
      updatePreviewScale();
    });
  });
  presetSelect.addEventListener("change", () => {
    applyPreset(presetSelect.value);
    invalidateResult("테스트 예시가 변경되었습니다. 새 문구로 다시 실행해 주세요.");
  });
  accessKey.addEventListener("input", updateModeControls);
  form.addEventListener("input", (event) => {
    if (event.target === accessKey || event.target === presetSelect) return;
    invalidateResult("입력 문구가 변경되었습니다. 새 내용으로 다시 실행해 주세요.");
  });
  form.addEventListener("submit", runTest);
  readinessToggle.addEventListener("click", () => {
    const expanded = readinessToggle.getAttribute("aria-expanded") === "true";
    readinessToggle.setAttribute("aria-expanded", String(!expanded));
    readinessDetails.hidden = expanded;
    readinessToggle.textContent = expanded ? "상세 상태" : "상세 닫기";
  });
  previewFrame.addEventListener("load", updatePreviewScale);
  window.addEventListener("resize", updatePreviewScale, { passive: true });

  applyPreset("balanced");
  updateModeControls();
  loadReadiness();
})();

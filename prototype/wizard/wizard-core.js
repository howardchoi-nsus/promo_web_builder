(function registerWizardCore(global) {
  function appendTextElement(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
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
      const error = new Error(payload.message || payload.error || payload.workerTrigger?.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.statusCode = response.status;
      error.code = payload.code || "";
      error.retryable = payload.retryable === true;
      error.retryAfterMs = Math.max(0, Number(payload.retryAfterMs || 0));
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  function resolveActiveTemplate(templates = [], savedTemplate = {}) {
    const activeTemplates = Array.isArray(templates) ? templates : [];
    const savedId = String(savedTemplate?.id || "").trim();
    const savedTemplateKey = String(savedTemplate?.templateKey || "").trim();
    return activeTemplates.find((template) => template.id === savedId)
      || activeTemplates.find((template) => savedTemplateKey && template.templateKey === savedTemplateKey)
      || activeTemplates.find((template) => template.isDefault)
      || activeTemplates[0]
      || null;
  }

  global.PromoWizardCore = Object.freeze({
    appendTextElement,
    valueAtPath,
    setValueAtPath,
    fetchJson,
    resolveActiveTemplate,
  });
})(globalThis);

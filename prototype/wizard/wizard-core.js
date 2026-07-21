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
      throw new Error(payload.message || payload.error || payload.workerTrigger?.error || `HTTP ${response.status}`);
    }
    return payload;
  }

  global.PromoWizardCore = Object.freeze({
    appendTextElement,
    valueAtPath,
    setValueAtPath,
    fetchJson,
  });
})(globalThis);

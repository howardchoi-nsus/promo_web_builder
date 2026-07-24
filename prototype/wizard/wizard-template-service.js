(function registerWizardTemplateService(global) {
  function requireCore() {
    const core = global.PromoWizardCore;
    if (!core?.fetchJson || !core?.resolveActiveTemplate) {
      throw new Error("PromoWizardCore must load before PromoWizardTemplateService");
    }
    return core;
  }

  async function listPublicTemplates(options = {}) {
    const { fetchJson } = requireCore();
    const result = await fetchJson("/api/wizard-form-templates-public", {
      cache: "no-store",
      ...options,
    });
    return Array.isArray(result.templates) ? result.templates : [];
  }

  async function loadPublicTemplate(templateId, options = {}) {
    const id = String(templateId || "").trim();
    if (!id) throw new Error("Template id is required");
    const { fetchJson } = requireCore();
    return fetchJson(`/api/wizard-form-template-public?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
      ...options,
    });
  }

  function resolveTemplate(templates, savedTemplate) {
    return requireCore().resolveActiveTemplate(templates, savedTemplate);
  }

  async function loadActiveTemplate(savedTemplate, options = {}) {
    const templates = options.templates || await listPublicTemplates(options.requestOptions);
    const template = resolveTemplate(templates, savedTemplate);
    if (!template) return { templates, template: null, detail: null };
    const detail = await loadPublicTemplate(template.id, options.requestOptions);
    return { templates, template, detail };
  }

  global.PromoWizardTemplateService = Object.freeze({
    listPublicTemplates,
    loadPublicTemplate,
    resolveTemplate,
    loadActiveTemplate,
  });
})(globalThis);

(function registerWizardContent(global) {
  function createDefaultWizardContent({ includeSectionDesignRuns = false } = {}) {
    const content = {
      sectionInputSchemaVersion: 4,
      designTokenSetVersionId: "",
      promotionOverview: {
        schemaVersion: 2,
        inputMode: "structured",
        rawNaturalLanguage: "",
        title: "",
        promotionPurpose: "",
        promotionPurposeOther: "",
        market: "",
        audience: "",
        campaignTone: "",
        mainOffer: "",
        primaryAction: { label: "", url: "" },
      },
      templateRecommendation: null,
      templateCompositionProposal: null,
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
      formTemplate: null,
      templateInputs: {},
      templateDefaultContents: {},
      templateSectionOrders: {},
      templateLayouts: {},
      sectionInputs: {},
    };
    if (includeSectionDesignRuns) content.sectionDesignRuns = {};
    return content;
  }

  function migrateLegacySectionInputs(saved = {}) {
    if (!saved || typeof saved !== "object") return {};
    const migrated = JSON.parse(JSON.stringify(saved));
    const assignIfMissing = (target, key, value) => {
      if (target[key] === undefined && value !== undefined) target[key] = value;
    };

    if (migrated.header) {
      assignIfMissing(migrated.header, "logo", migrated.header.logoText);
      assignIfMissing(migrated.header, "badges", migrated.header.badgeText);
    }
    if (migrated.heroBanner) {
      assignIfMissing(migrated.heroBanner, "leadText", migrated.heroBanner.leaderText);
      assignIfMissing(migrated.heroBanner, "button", migrated.heroBanner.cta);
    }
    if (Array.isArray(migrated.stepBar) && migrated.stepBar.length) {
      const firstStep = migrated.stepBar[0] || {};
      migrated.stepBar = {
        title: firstStep.title || "",
        description: firstStep.description || "",
        ctaButton: {
          label: firstStep.ctaLabel || "",
          link: firstStep.link || "",
          target: "_blank",
        },
        legacyItems: migrated.stepBar,
      };
    }
    if (migrated.contentCta) {
      assignIfMissing(migrated.contentCta, "description", migrated.contentCta.longText);
      assignIfMissing(migrated.contentCta, "button", migrated.contentCta.cta);
    }
    if (Array.isArray(migrated.imageTextRow) && migrated.imageTextRow.length) {
      const firstRow = migrated.imageTextRow[0] || {};
      migrated.imageTextRow = {
        image: firstRow.image || { source: "url", value: firstRow.imageUrl || "", alt: firstRow.alt || "" },
        title: firstRow.title || "",
        description: firstRow.description || firstRow.text || "",
        legacyItems: migrated.imageTextRow,
      };
    }
    return migrated;
  }

  function defaultItemValue(item) {
    if (item.isLocked && item.lockedValue !== null && item.lockedValue !== undefined) return item.lockedValue;
    const fields = Array.isArray(item.fields) ? item.fields : [];
    if (fields.length > 1) {
      return {
        fields: Object.fromEntries(fields.map((field) => [field.fieldKey, defaultItemValue(field)])),
      };
    }
    const definition = fields[0] || item;
    if (definition.isLocked && definition.defaultValue !== null && definition.defaultValue !== undefined) {
      return definition.defaultValue;
    }
    if (definition.fieldKind === "cta") return { label: "", link: "", target: "_blank" };
    if (definition.fieldKind === "image") {
      const firstSource = Array.isArray(definition.image?.allowedSources) ? definition.image.allowedSources[0] : "";
      return { source: firstSource || "url", value: "", description: "", alt: "" };
    }
    return "";
  }

  function defaultSectionInputsFromDefinitions(definitions = []) {
    const result = {};
    definitions.forEach((section) => {
      const itemValues = {};
      (section.items || []).forEach((item) => {
        itemValues[item.itemKey] = defaultItemValue(item);
      });
      result[section.sectionKey] = itemValues;
    });
    return result;
  }

  function valuesEqual(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function mergeSectionInputs(saved = {}, definitions = [], templateDefaults = {}, previousTemplateDefaults = {}) {
    const fallback = defaultSectionInputsFromDefinitions(definitions);
    const merged = {};
    Object.keys(fallback).forEach((sectionKey) => {
      const savedSection = (saved && typeof saved === "object" ? saved[sectionKey] : null) || {};
      const defaultSection = (templateDefaults && typeof templateDefaults === "object"
        ? templateDefaults[sectionKey] : null) || {};
      const previousDefaultSection = (previousTemplateDefaults && typeof previousTemplateDefaults === "object"
        ? previousTemplateDefaults[sectionKey] : null) || {};
      merged[sectionKey] = { ...fallback[sectionKey] };
      Object.keys(fallback[sectionKey]).forEach((itemKey) => {
        const item = (definitions.find((section) => section.sectionKey === sectionKey)?.items || [])
          .find((candidate) => candidate.itemKey === itemKey);
        if (item?.isLocked) return;
        const hasSaved = savedSection[itemKey] !== undefined;
        const hasDefault = defaultSection[itemKey] !== undefined;
        const hasPreviousDefault = previousDefaultSection[itemKey] !== undefined;
        const savedMatchesPreviousDefault = hasSaved && hasPreviousDefault
          && valuesEqual(savedSection[itemKey], previousDefaultSection[itemKey]);
        const savedMatchesLegacyFallback = hasSaved && !hasPreviousDefault
          && valuesEqual(savedSection[itemKey], fallback[sectionKey][itemKey]);
        if (hasSaved && !savedMatchesPreviousDefault && !savedMatchesLegacyFallback) {
          merged[sectionKey][itemKey] = savedSection[itemKey];
        } else if (hasDefault) {
          merged[sectionKey][itemKey] = defaultSection[itemKey];
        }
      });
      if (Array.isArray(savedSection.legacyItems)) merged[sectionKey].legacyItems = savedSection.legacyItems;
    });
    return merged;
  }

  global.PromoWizardContent = Object.freeze({
    createDefaultWizardContent,
    migrateLegacySectionInputs,
    defaultItemValue,
    defaultSectionInputsFromDefinitions,
    valuesEqual,
    mergeSectionInputs,
  });
})(globalThis);

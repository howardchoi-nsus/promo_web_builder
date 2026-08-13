const {
  DEFAULT_IMAGE_HARNESS_CONFIG,
  defaultPromptControlPlane,
  normalizePromptControlPlaneOptions,
} = require("./_prompt-template-store");

const RUNTIME_LIMITS = Object.freeze({
  plannerTimeoutMs: 90000,
  imageTimeoutMs: 240000,
  maxAttempts: 5,
  retryMaxMs: 300000,
});

function finiteNumber(value, fallback = null) {
  if (value === null || value === undefined || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function integerInRange(value, fallback, minimum, maximum) {
  const number = finiteNumber(value, fallback);
  return Math.min(maximum, Math.max(minimum, Math.round(number)));
}

function normalizeRuntimeConfig(type, value = {}) {
  const defaults = defaultPromptControlPlane(type).runtimeConfig || {};
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const isImage = type === "section_background_image" || type === "component_image";
  const timeoutLimit = isImage ? RUNTIME_LIMITS.imageTimeoutMs : RUNTIME_LIMITS.plannerTimeoutMs;
  const outputMimeType = String(source.outputMimeType || defaults.outputMimeType || "").trim().toLowerCase();
  return {
    timeoutMs: integerInRange(source.timeoutMs, defaults.timeoutMs || timeoutLimit, 1000, timeoutLimit),
    maxAttempts: integerInRange(source.maxAttempts, defaults.maxAttempts || 1, 1, RUNTIME_LIMITS.maxAttempts),
    retryBaseMs: integerInRange(source.retryBaseMs, defaults.retryBaseMs || 0, 0, RUNTIME_LIMITS.retryMaxMs),
    retryMaxMs: integerInRange(source.retryMaxMs, defaults.retryMaxMs || 0, 0, RUNTIME_LIMITS.retryMaxMs),
    ...(outputMimeType ? { outputMimeType } : {}),
  };
}

const IMAGE_TIERS = Object.freeze(["1K", "2K", "4K"]);
const IMAGE_MIME_TYPES = Object.freeze(["image/jpeg", "image/png", "image/webp"]);
const IMAGE_FIT_MODES = Object.freeze(["cover", "contain", "width-fill"]);
const IMAGE_FADE_MODES = Object.freeze(["none", "left", "right", "both"]);
const ASPECT_RATIO_STRATEGIES = Object.freeze(["fixed", "section", "nearest-supported", "target"]);
const OPENAI_IMAGE_SIZES = Object.freeze(["1024x1024", "1536x1024", "1024x1536"]);

function plainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function enumValue(value, allowed, fallback) {
  const candidate = String(value || "").trim();
  return allowed.includes(candidate) ? candidate : fallback;
}

function normalizeGenerationPolicy(type, value = {}) {
  const defaults = defaultPromptControlPlane(type).generationPolicy || {};
  const source = plainObject(value);
  const subjectScale = plainObject(source.subjectScale);
  return {
    requestedTier: enumValue(String(source.requestedTier || "").toUpperCase(), IMAGE_TIERS, defaults.requestedTier || "2K"),
    aspectRatioStrategy: enumValue(source.aspectRatioStrategy, ASPECT_RATIO_STRATEGIES, defaults.aspectRatioStrategy || "nearest-supported"),
    fixedAspectRatio: String(source.fixedAspectRatio || defaults.fixedAspectRatio || "16:9"),
    fallbackAspectRatio: String(source.fallbackAspectRatio || defaults.fallbackAspectRatio || "16:9"),
    quality: enumValue(source.quality, ["low", "medium", "high"], defaults.quality || "medium"),
    outputMimeType: enumValue(String(source.outputMimeType || "").toLowerCase(), IMAGE_MIME_TYPES, defaults.outputMimeType || "image/jpeg"),
    backgroundColorStrategy: enumValue(source.backgroundColorStrategy, ["section", "transparent", "provider-default"], defaults.backgroundColorStrategy || "section"),
    subjectScale: {
      minimumPercent: integerInRange(subjectScale.minimumPercent, defaults.subjectScale?.minimumPercent || 55, 1, 100),
      maximumPercent: integerInRange(subjectScale.maximumPercent, defaults.subjectScale?.maximumPercent || 75, 1, 100),
    },
  };
}

function normalizeRenderPolicy(type, value = {}) {
  const defaults = defaultPromptControlPlane(type).renderPolicy || {};
  const source = plainObject(value);
  const sectionSource = plainObject(source.sectionBackground);
  const componentSource = plainObject(source.componentImage);
  const fadeSource = plainObject(source.fade);
  const normalizeAllowed = (candidate, allowed, fallback) => {
    const values = Array.isArray(candidate) ? candidate.filter((item) => allowed.includes(item)) : [];
    return values.length ? [...new Set(values)] : [...fallback];
  };
  const sectionAllowed = normalizeAllowed(
    sectionSource.allowedFitModes,
    IMAGE_FIT_MODES,
    defaults.sectionBackground?.allowedFitModes || IMAGE_FIT_MODES
  );
  const componentAllowed = normalizeAllowed(
    componentSource.allowedFitModes,
    ["contain", "cover"],
    defaults.componentImage?.allowedFitModes || ["contain", "cover"]
  );
  const allowedFadeModes = normalizeAllowed(
    fadeSource.allowedModes,
    IMAGE_FADE_MODES,
    defaults.fade?.allowedModes || IMAGE_FADE_MODES
  );
  const defaultStops = defaults.fade?.stops || {};
  const sourceStops = plainObject(fadeSource.stops);
  const stops = {};
  ["soft", "medium", "strong"].forEach((strength) => {
    const fallback = plainObject(defaultStops[strength]);
    const configured = plainObject(sourceStops[strength]);
    stops[strength] = {
      solid: integerInRange(configured.solid, fallback.solid || 14, 0, 100),
      clear: integerInRange(configured.clear, fallback.clear || 48, 0, 100),
      edge: integerInRange(configured.edge, fallback.edge || 24, 0, 50),
    };
  });
  return {
    sectionBackground: {
      fitMode: enumValue(sectionSource.fitMode, sectionAllowed, defaults.sectionBackground?.fitMode || "cover"),
      allowedFitModes: sectionAllowed,
      position: enumValue(
        sectionSource.position,
        ["left top", "center top", "right top", "left center", "center center", "right center", "left bottom", "center bottom", "right bottom"],
        defaults.sectionBackground?.position || "center center"
      ),
      repeat: enumValue(sectionSource.repeat, ["no-repeat", "repeat", "repeat-x", "repeat-y"], defaults.sectionBackground?.repeat || "no-repeat"),
      focalPoint: {
        x: integerInRange(sectionSource.focalPoint?.x, defaults.sectionBackground?.focalPoint?.x || 50, 0, 100),
        y: integerInRange(sectionSource.focalPoint?.y, defaults.sectionBackground?.focalPoint?.y || 50, 0, 100),
      },
    },
    componentImage: {
      fitMode: enumValue(componentSource.fitMode, componentAllowed, defaults.componentImage?.fitMode || "contain"),
      allowedFitModes: componentAllowed,
      position: enumValue(
        componentSource.position,
        ["left top", "center top", "right top", "left center", "center center", "right center", "left bottom", "center bottom", "right bottom"],
        defaults.componentImage?.position || "center center"
      ),
      transparentFrame: componentSource.transparentFrame !== false,
    },
    fade: {
      allowedModes: allowedFadeModes,
      defaultMode: enumValue(fadeSource.defaultMode, allowedFadeModes, defaults.fade?.defaultMode || "none"),
      defaultStrength: enumValue(fadeSource.defaultStrength, ["soft", "medium", "strong"], defaults.fade?.defaultStrength || "medium"),
      stops,
    },
  };
}

function normalizeValidationPolicy(type, value = {}) {
  const defaults = defaultPromptControlPlane(type).validationPolicy || {};
  const source = plainObject(value);
  const defaultRules = defaults.resolutionRules || {};
  const sourceRules = plainObject(source.resolutionRules);
  const resolutionRules = {};
  IMAGE_TIERS.forEach((tier) => {
    const fallback = defaultRules[tier] || {};
    const rule = plainObject(sourceRules[tier]);
    resolutionRules[tier] = {
      minimumLandscapeWidth: integerInRange(rule.minimumLandscapeWidth, fallback.minimumLandscapeWidth || 1024, 1, 8192),
      minimumPortraitHeight: integerInRange(rule.minimumPortraitHeight, fallback.minimumPortraitHeight || 1024, 1, 8192),
      minimumSquareSide: integerInRange(rule.minimumSquareSide, fallback.minimumSquareSide || 1024, 1, 8192),
    };
  });
  return {
    rejectUnreadableMetadata: source.rejectUnreadableMetadata !== false,
    rejectMimeMismatch: source.rejectMimeMismatch !== false,
    rejectLowResolution: source.rejectLowResolution !== false,
    resolutionRules,
    aspectRatioTolerancePercent: integerInRange(source.aspectRatioTolerancePercent, defaults.aspectRatioTolerancePercent || 8, 0, 50),
    minimumByteLength: integerInRange(source.minimumByteLength, defaults.minimumByteLength || 1024, 1, 10000000),
    edgeFrameDetection: {
      ...plainObject(defaults.edgeFrameDetection),
      ...plainObject(source.edgeFrameDetection),
      enabled: plainObject(source.edgeFrameDetection).enabled === true,
    },
  };
}

function normalizeHarnessConfig(type, value = {}) {
  const isImage = type === "section_background_image" || type === "component_image";
  const defaults = isImage ? DEFAULT_IMAGE_HARNESS_CONFIG : { version: 1, additionalInstructions: [] };
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const stringList = (candidate, fallback) => (
    Array.isArray(candidate)
      ? candidate.map((item) => String(item || "").trim()).filter(Boolean)
      : [...fallback]
  );
  if (!isImage) {
    return {
      version: integerInRange(source.version, defaults.version, 1, 1000),
      additionalInstructions: stringList(source.additionalInstructions, defaults.additionalInstructions),
    };
  }
  return {
    version: integerInRange(source.version, defaults.version, 1, 1000),
    safeAreaInstructions: {
      ...defaults.safeAreaInstructions,
      ...(source.safeAreaInstructions && typeof source.safeAreaInstructions === "object"
        ? source.safeAreaInstructions
        : {}),
    },
    sectionBackgroundRules: stringList(source.sectionBackgroundRules, defaults.sectionBackgroundRules),
    componentImageRules: stringList(source.componentImageRules, defaults.componentImageRules),
    negativeRules: stringList(source.negativeRules, defaults.negativeRules),
    creativeIntentRules: stringList(source.creativeIntentRules, defaults.creativeIntentRules),
    keyVisualTextInstructions: {
      ...defaults.keyVisualTextInstructions,
      ...plainObject(source.keyVisualTextInstructions),
    },
    subjectScaleInstruction: String(
      source.subjectScaleInstruction || defaults.subjectScaleInstruction || ""
    ).trim(),
  };
}

function normalizeControlPlanePromptConfig(type, promptConfig = {}) {
  const modelOptions = normalizePromptControlPlaneOptions(type, promptConfig.modelOptions, { includeDefaults: true });
  return {
    ...promptConfig,
    snapshotVersion: Number(promptConfig.snapshotVersion || modelOptions.executionSnapshotVersion || 2),
    temperature: finiteNumber(promptConfig.temperature ?? modelOptions.temperature),
    maxTokens: finiteNumber(promptConfig.maxTokens ?? modelOptions.maxTokens),
    responseFormat: String(promptConfig.responseFormat || modelOptions.responseFormat || "").trim(),
    runtimeConfig: normalizeRuntimeConfig(type, promptConfig.runtimeConfig || modelOptions.runtimeConfig),
    harnessConfig: normalizeHarnessConfig(type, promptConfig.harnessConfig || modelOptions.harnessConfig),
    modelCapabilitySnapshot: (
      promptConfig.modelCapabilitySnapshot
      || modelOptions.modelCapabilitySnapshot
      || {}
    ),
    safetyContract: promptConfig.safetyContract || modelOptions.safetyContract || {},
    ...(Number(promptConfig.snapshotVersion || modelOptions.executionSnapshotVersion || 2) >= 3
      && (type === "section_background_image" || type === "component_image") ? {
      policySchemaVersion: Number(promptConfig.policySchemaVersion || modelOptions.policySchemaVersion || 1),
      generationPolicy: normalizeGenerationPolicy(type, {
        ...(modelOptions.generationPolicy || {}),
        ...(modelOptions.imageSize && !modelOptions.generationPolicy?.requestedTier
          ? { requestedTier: modelOptions.imageSize }
          : {}),
        ...(promptConfig.generationPolicy || {}),
      }),
      renderPolicy: normalizeRenderPolicy(type, promptConfig.renderPolicy || modelOptions.renderPolicy),
      validationPolicy: normalizeValidationPolicy(type, promptConfig.validationPolicy || modelOptions.validationPolicy),
    } : {}),
    modelOptions,
  };
}

function validateControlPlaneConfig(type, promptConfig = {}) {
  const source = promptConfig.modelOptions && typeof promptConfig.modelOptions === "object"
    ? promptConfig.modelOptions
    : {};
  const version = Number(source.executionSnapshotVersion || promptConfig.executionSnapshotVersion || 1);
  const controlled = [
    "section_layout_planner", "multi_component_layout_planner", "section_composition_planner",
    "promo_overview_parser", "promo_template_recommender", "promo_template_composer",
    "promo_page_composer", "promo_composition_editor", "section_background_image", "component_image",
  ].includes(type);
  if (controlled && version < 2) {
    const error = new Error(`${type} requires an activated Execution Snapshot V2 or newer setting`);
    error.statusCode = 422;
    error.code = "CONTROL_PLANE_CONFIG_REQUIRED";
    throw error;
  }
  if (version < 2) return true;
  const requiredObjects = [
    "harnessConfig", "runtimeConfig", "modelCapabilitySnapshot", "safetyContract",
    ...(version >= 3 && (type === "section_background_image" || type === "component_image")
      ? ["generationPolicy", "renderPolicy", "validationPolicy"]
      : []),
  ];
  const invalidObject = requiredObjects.find((key) => (
    !source[key] || typeof source[key] !== "object" || Array.isArray(source[key])
  ));
  if (invalidObject) {
    const error = new Error(`${type} ${invalidObject} must be a JSON object for Execution Snapshot V2`);
    error.statusCode = 422;
    error.code = "CONTROL_PLANE_CONFIG_INVALID";
    throw error;
  }
  const rawRuntime = source.runtimeConfig;
  const isImage = type === "section_background_image" || type === "component_image";
  const timeoutMaximum = isImage ? RUNTIME_LIMITS.imageTimeoutMs : RUNTIME_LIMITS.plannerTimeoutMs;
  const timeoutMs = Number(rawRuntime.timeoutMs);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > timeoutMaximum) {
    const error = new Error(`${type} runtimeConfig.timeoutMs must be an integer between 1000 and ${timeoutMaximum}`);
    error.statusCode = 422;
    error.code = "CONTROL_PLANE_CONFIG_INVALID";
    throw error;
  }
  const maxAttempts = Number(rawRuntime.maxAttempts);
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > RUNTIME_LIMITS.maxAttempts) {
    const error = new Error(`${type} runtimeConfig.maxAttempts must be an integer between 1 and ${RUNTIME_LIMITS.maxAttempts}`);
    error.statusCode = 422;
    error.code = "CONTROL_PLANE_CONFIG_INVALID";
    throw error;
  }
  if (isImage && version < 3) {
    const mimeType = String(rawRuntime.outputMimeType || "").toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      const error = new Error(`${type} runtimeConfig.outputMimeType must be image/jpeg, image/png, or image/webp`);
      error.statusCode = 422;
      error.code = "CONTROL_PLANE_CONFIG_INVALID";
      throw error;
    }
  }
  if (isImage && version >= 3) {
    const generation = normalizeGenerationPolicy(type, source.generationPolicy);
    if (generation.subjectScale.minimumPercent > generation.subjectScale.maximumPercent) {
      const error = new Error(`${type} generationPolicy.subjectScale minimumPercent cannot exceed maximumPercent`);
      error.statusCode = 422;
      error.code = "CONTROL_PLANE_CONFIG_INVALID";
      throw error;
    }
    normalizeRenderPolicy(type, source.renderPolicy);
    normalizeValidationPolicy(type, source.validationPolicy);
  }
  return true;
}

function renderHarnessLine(value, variables) {
  return String(value || "").replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => (
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key] ?? "") : match
  ));
}

function buildImageHarnessPrompt({
  prompt,
  harnessConfig,
  safeArea = "none",
  backgroundColor = "#f5f7fb",
  targetType = "section-background",
  aspectRatio = "16:9",
  keyVisualTextPolicy = { mode: "none", text: "" },
  subjectScale = null,
}) {
  const harness = normalizeHarnessConfig(
    targetType === "section-background" ? "section_background_image" : "component_image",
    harnessConfig
  );
  const variables = {
    backgroundColor,
    aspectRatio,
    keyVisualText: keyVisualTextPolicy.text || "",
    minimumSubjectScale: subjectScale?.minimumPercent ?? "",
    maximumSubjectScale: subjectScale?.maximumPercent ?? "",
  };
  const safeAreaInstruction = harness.safeAreaInstructions[safeArea]
    || harness.safeAreaInstructions.none
    || "";
  const targetRules = targetType === "section-background"
    ? harness.sectionBackgroundRules
    : harness.componentImageRules;
  const keyVisualTextInstruction = keyVisualTextPolicy.mode === "explicit" && keyVisualTextPolicy.text
    ? harness.keyVisualTextInstructions.explicit
    : harness.keyVisualTextInstructions.none;
  return [
    String(prompt || "").trim(),
    ...(targetType === "section-background" ? harness.creativeIntentRules : []),
    safeAreaInstruction,
    ...targetRules,
    ...harness.negativeRules,
    ...(targetType === "section-background" ? [keyVisualTextInstruction] : []),
    ...(subjectScale ? [harness.subjectScaleInstruction] : []),
  ].filter(Boolean).map((line) => renderHarnessLine(line, variables)).join("\n");
}

function imageMetadata(bytes, fallbackMimeType = "") {
  if (!Buffer.isBuffer(bytes) || bytes.length < 12) return null;
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    if (bytes.length < 24) return null;
    return { mimeType: "image/png", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      if (marker === 0xd8 || marker === 0xd9) {
        offset += 2;
        continue;
      }
      if (offset + 4 > bytes.length) break;
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2 || offset + 2 + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return {
          mimeType: "image/jpeg",
          width: bytes.readUInt16BE(offset + 7),
          height: bytes.readUInt16BE(offset + 5),
        };
      }
      offset += 2 + length;
    }
  }
  if (bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") {
    const kind = bytes.subarray(12, 16).toString("ascii");
    if (kind === "VP8X" && bytes.length >= 30) {
      return {
        mimeType: "image/webp",
        width: 1 + bytes.readUIntLE(24, 3),
        height: 1 + bytes.readUIntLE(27, 3),
      };
    }
    if (kind === "VP8 " && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
      return {
        mimeType: "image/webp",
        width: bytes.readUInt16LE(26) & 0x3fff,
        height: bytes.readUInt16LE(28) & 0x3fff,
      };
    }
    if (kind === "VP8L" && bytes.length >= 25 && bytes[20] === 0x2f) {
      const bits = bytes.readUInt32LE(21);
      return {
        mimeType: "image/webp",
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }
  }
  return fallbackMimeType ? { mimeType: fallbackMimeType, width: 0, height: 0 } : null;
}

function validateRequestedImageResolution(metadata, promptConfig = {}) {
  const imageSize = String(
    promptConfig.generationPolicy?.requestedTier
    || promptConfig.modelOptions?.imageSize
    || ""
  ).trim().toUpperCase();
  if (!imageSize || !metadata?.width || !metadata?.height) return true;
  if (Number(promptConfig.snapshotVersion || 1) >= 3 && promptConfig.validationPolicy) {
    const policy = promptConfig.validationPolicy;
    if (policy.rejectLowResolution === false) return true;
    const providerSize = String(promptConfig.providerRequestSize || "").match(/^(\d+)x(\d+)$/);
    if (providerSize) {
      const requestedWidth = Number(providerSize[1]);
      const requestedHeight = Number(providerSize[2]);
      const requestedRatio = requestedWidth / requestedHeight;
      const actualRatio = metadata.width / metadata.height;
      const tolerance = Number(policy.aspectRatioTolerancePercent || 0) / 100;
      if (Math.abs(actualRatio - requestedRatio) / requestedRatio > tolerance) {
        const error = new Error(`Generated image aspect ratio ${actualRatio.toFixed(4)} does not match provider request ${promptConfig.providerRequestSize}`);
        error.code = "IMAGE_ASPECT_RATIO_MISMATCH";
        error.statusCode = 422;
        throw error;
      }
      if (metadata.width < requestedWidth || metadata.height < requestedHeight) {
        const error = new Error(`Generated image resolution ${metadata.width}x${metadata.height} is below provider request ${promptConfig.providerRequestSize}`);
        error.code = "IMAGE_RESOLUTION_BELOW_REQUEST";
        error.statusCode = 422;
        throw error;
      }
      return true;
    }
    const rule = policy.resolutionRules?.[imageSize] || {};
    const requestedRatio = ratioNumber(promptConfig.effectiveAspectRatio);
    const actualRatio = metadata.width / metadata.height;
    const orientation = requestedRatio
      ? (requestedRatio > 1.05 ? "landscape" : requestedRatio < 0.95 ? "portrait" : "square")
      : (actualRatio > 1.05 ? "landscape" : actualRatio < 0.95 ? "portrait" : "square");
    const tolerance = Number(policy.aspectRatioTolerancePercent || 0) / 100;
    if (requestedRatio && Math.abs(actualRatio - requestedRatio) / requestedRatio > tolerance) {
      const error = new Error(`Generated image aspect ratio ${actualRatio.toFixed(4)} does not match ${promptConfig.effectiveAspectRatio}`);
      error.code = "IMAGE_ASPECT_RATIO_MISMATCH";
      error.statusCode = 422;
      throw error;
    }
    const actual = orientation === "landscape" ? metadata.width
      : orientation === "portrait" ? metadata.height : Math.min(metadata.width, metadata.height);
    const minimum = Number(
      orientation === "landscape" ? rule.minimumLandscapeWidth
        : orientation === "portrait" ? rule.minimumPortraitHeight : rule.minimumSquareSide
    );
    if (minimum && actual < minimum) {
      const error = new Error(`Generated ${orientation} image resolution ${metadata.width}x${metadata.height} is below the ${imageSize} minimum ${minimum}px`);
      error.code = "IMAGE_RESOLUTION_BELOW_REQUEST";
      error.statusCode = 422;
      throw error;
    }
    return true;
  }
  const capability = promptConfig.modelCapabilitySnapshot || {};
  const thresholds = capability.minimumLongSideByTier || { "1K": 900, "2K": 1800, "4K": 3600 };
  const minimum = Number(thresholds[imageSize] || 0);
  if (minimum && Math.max(metadata.width, metadata.height) < minimum) {
    const error = new Error(
      `Generated image resolution ${metadata.width}x${metadata.height} is below the ${imageSize} minimum long side ${minimum}px`
    );
    error.code = "IMAGE_RESOLUTION_BELOW_REQUEST";
    error.statusCode = 422;
    throw error;
  }
  return true;
}

function ratioNumber(value) {
  const match = String(value || "").match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  return match ? Number(match[1]) / Number(match[2]) : 0;
}

function normalizeTargetGeometry(value = {}, fallback = {}) {
  const source = plainObject(value);
  const backup = plainObject(fallback);
  return {
    width: integerInRange(source.width, backup.width || 1280, 320, 3840),
    height: integerInRange(source.height, backup.height || 520, 120, 2160),
    viewport: enumValue(source.viewport, ["desktop", "tablet", "mobile"], backup.viewport || "desktop"),
  };
}

function resolveEffectiveAspectRatio(generationPolicy = {}, geometry = {}, targetAspectRatio = "", supported = []) {
  const strategy = generationPolicy.aspectRatioStrategy || "nearest-supported";
  const rawRatio = strategy === "fixed" ? generationPolicy.fixedAspectRatio
    : strategy === "target" ? targetAspectRatio
      : `${geometry.width || 1280}:${geometry.height || 520}`;
  const fallback = generationPolicy.fallbackAspectRatio || "16:9";
  const candidate = ratioNumber(rawRatio) ? rawRatio : fallback;
  const supportedRatios = Array.isArray(supported) && supported.length ? supported : ["1:1", "4:3", "3:4", "16:9", "9:16"];
  if (supportedRatios.includes(candidate)) return candidate;
  const requested = ratioNumber(candidate);
  return supportedRatios.reduce((best, ratio) => (
    Math.abs(ratioNumber(ratio) - requested) < Math.abs(ratioNumber(best) - requested) ? ratio : best
  ), supportedRatios[0] || fallback);
}

function resolveOpenAiImageSize({ aspectRatio = "1:1", configuredSize = "", capabilities = {} } = {}) {
  const allowed = Array.isArray(capabilities.openAiImageSizes)
    ? capabilities.openAiImageSizes.filter((size) => OPENAI_IMAGE_SIZES.includes(String(size)))
    : OPENAI_IMAGE_SIZES;
  const explicit = String(configuredSize || "").trim();
  if (explicit) {
    if (!allowed.includes(explicit)) {
      const error = new Error(`OpenAI image size is not supported by the active model capability snapshot: ${explicit}`);
      error.code = "PROMPT_PROVIDER_OPTION_UNSUPPORTED";
      error.statusCode = 422;
      throw error;
    }
    return explicit;
  }
  const match = String(aspectRatio || "1:1").trim().replace("/", ":").match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) {
    const error = new Error(`OpenAI image aspect ratio is invalid: ${aspectRatio}`);
    error.code = "PROMPT_PROVIDER_OPTION_UNSUPPORTED";
    error.statusCode = 422;
    throw error;
  }
  const ratio = Number(match[1]) / Number(match[2]);
  const preferred = Math.abs(ratio - 1) <= 0.08
    ? "1024x1024"
    : ratio > 1 ? "1536x1024" : "1024x1536";
  if (!allowed.includes(preferred)) {
    const error = new Error(`Active model capability snapshot does not support the required OpenAI image orientation: ${preferred}`);
    error.code = "PROMPT_PROVIDER_OPTION_UNSUPPORTED";
    error.statusCode = 422;
    throw error;
  }
  return preferred;
}

function backgroundSizeForFitMode(value) {
  if (value === "width-fill") return "100% auto";
  return value === "contain" ? "contain" : "cover";
}

module.exports = {
  RUNTIME_LIMITS,
  buildImageHarnessPrompt,
  imageMetadata,
  normalizeControlPlanePromptConfig,
  normalizeGenerationPolicy,
  normalizeHarnessConfig,
  normalizeRenderPolicy,
  normalizeRuntimeConfig,
  normalizeTargetGeometry,
  normalizeValidationPolicy,
  resolveEffectiveAspectRatio,
  resolveOpenAiImageSize,
  backgroundSizeForFitMode,
  validateControlPlaneConfig,
  validateRequestedImageResolution,
};

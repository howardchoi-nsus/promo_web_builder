const crypto = require("crypto");

const EXTRACTION_MODEL = "local-design-md-datafication-v2";
const UNKNOWN = "unknown";

function unknownField(description = "") {
  return {
    value: UNKNOWN,
    confidence: 0,
    source: "unknown",
    description,
  };
}

function createNormalizedSchema() {
  return {
    schemaVersion: "design-md-normalized-v1",
    unknownValue: UNKNOWN,
    tokens: {
      color: {
        primary: unknownField("Primary brand or CTA color."),
        secondary: unknownField("Secondary brand color."),
        accent: unknownField("Accent color."),
        background: unknownField("Default page or canvas background color."),
        surface: unknownField("Card, panel, or form surface color."),
        text: unknownField("Default text color."),
        mutedText: unknownField("Muted or secondary text color."),
        border: unknownField("Default border or rule color."),
      },
      typography: {
        displayFont: unknownField("Display or hero font family."),
        bodyFont: unknownField("Body or UI font family."),
        monoFont: unknownField("Monospace or technical label font family."),
        titleWeight: unknownField("Primary title font weight."),
      },
      radius: {
        small: unknownField("Small radius token."),
        medium: unknownField("Medium radius token."),
        large: unknownField("Large radius token."),
        pill: unknownField("Pill control radius token."),
      },
      spacing: {
        base: unknownField("Base spacing unit."),
        section: unknownField("Section spacing rhythm."),
        gap: unknownField("Grid or component gap."),
      },
      elevation: {
        cardShadow: unknownField("Default card shadow."),
        depthModel: unknownField("Depth model such as flat, shadowed, glass, or media-led."),
      },
      breakpoint: {
        mobile: unknownField("Mobile breakpoint."),
        tablet: unknownField("Tablet breakpoint."),
        desktop: unknownField("Desktop breakpoint."),
      },
    },
    components: {
      button: unknownField("Button component pattern."),
      card: unknownField("Card component pattern."),
      nav: unknownField("Navigation component pattern."),
      hero: unknownField("Hero component pattern."),
      footer: unknownField("Footer component pattern."),
      badge: unknownField("Badge or chip component pattern."),
      form: unknownField("Form or input component pattern."),
      media: unknownField("Image, video, or media card treatment."),
    },
    layouts: {
      pageStructure: unknownField("Overall page structure."),
      grid: unknownField("Grid system."),
      container: unknownField("Container width and alignment."),
      sectionRhythm: unknownField("Section rhythm and vertical spacing."),
      heroComposition: unknownField("Hero composition."),
      footerStructure: unknownField("Footer structure."),
      responsiveBehavior: unknownField("Responsive behavior."),
    },
    guidelines: {
      dos: [UNKNOWN],
      donts: [UNKNOWN],
      avoid: [UNKNOWN],
      must: [UNKNOWN],
      imageTreatment: [UNKNOWN],
      generationRules: [UNKNOWN],
    },
    metadata: {
      brandConcept: unknownField("Brand design concept."),
      visualMood: unknownField("Visual mood."),
      designPhilosophy: unknownField("Design philosophy."),
      brandVoice: unknownField("Brand voice."),
      styleTags: [UNKNOWN],
    },
    classification: {
      primaryGroup: UNKNOWN,
      layoutDensity: UNKNOWN,
      layoutModel: UNKNOWN,
      colorMode: UNKNOWN,
      depthModel: UNKNOWN,
      shapeModel: UNKNOWN,
      typographyTone: UNKNOWN,
      confidence: 0,
    },
  };
}

function sourceHash(markdown) {
  return crypto.createHash("sha256").update(String(markdown || ""), "utf8").digest("hex");
}

function slugifyToken(value, fallback) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[`"'{}()[\]]/g, "")
    .replace(/#[0-9a-f]{3,8}/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || fallback;
}

function stripFrontmatter(markdown) {
  const text = String(markdown || "");
  if (!text.startsWith("---")) return { frontmatter: "", body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: "", body: text };
  return {
    frontmatter: text.slice(3, end).trim(),
    body: text.slice(end + 4).replace(/^\r?\n/, ""),
  };
}

function splitSections(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = /^(#{1,3})\s+(.+)$/.exec(line);
    if (match) {
      if (current) sections.push(current);
      current = {
        title: match[2].trim(),
        level: match[1].length,
        lines: [line],
      };
    } else if (current) {
      current.lines.push(line);
    }
  }

  if (current) sections.push(current);
  return sections.map((section) => ({
    title: section.title,
    level: section.level,
    content: section.lines.join("\n").trim(),
    body: section.lines.slice(1).join("\n").trim(),
  }));
}

function categoryForSection(title) {
  const raw = String(title || "").toLowerCase();
  if (/color|palette|colour/.test(raw)) return "color";
  if (/typography|font|type/.test(raw)) return "typography";
  if (/radius|shape|corner|geometry/.test(raw)) return "radius";
  if (/spacing|space|padding|margin|rhythm/.test(raw)) return "spacing";
  if (/component|button|card|nav|badge|cta|footer|header/.test(raw)) return "component";
  if (/layout|grid|container|section|composition/.test(raw)) return "layout";
  if (/elevation|depth|shadow|blur|layer/.test(raw)) return "elevation";
  if (/responsive|breakpoint|mobile|tablet|desktop/.test(raw)) return "breakpoint";
  if (/do|don't|dont|rule|guidance|iteration/.test(raw)) return "guidance";
  if (/overview|concept|theme|mood|philosophy|atmosphere/.test(raw)) return "philosophy";
  return "other";
}

function categoryForSectionWithParent(section, parentCategory) {
  const category = categoryForSection(section.title);
  const raw = String(section.title || "").toLowerCase();
  if (category !== "other") return category;
  if (/^(primary|secondary|neutral|semantic|surface|background|text|accent|brand|gradient)/.test(raw)) return "color";
  if (/^(do|don't|dont|avoid|must|never|guidelines?)/.test(raw)) return "guidance";
  if (/^(buttons?|cards?|containers?|navigation|nav|hero|footer|badges?|chips?|forms?|inputs?|media|image)/.test(raw)) {
    return "component";
  }
  if (/^(grid|container|whitespace|composition|section|responsive|breakpoints?|collapsing|touch)/.test(raw)) return "layout";
  return parentCategory && parentCategory !== "other" ? parentCategory : category;
}

function excerptAround(markdown, index, length = 220) {
  const start = Math.max(0, index - 80);
  return String(markdown || "")
    .slice(start, start + length)
    .replace(/\s+/g, " ")
    .trim();
}

function addToken(tokens, dtcgRoot, group, name, type, value, description, sourceExcerpt, confidence = 0.9, extensions = {}) {
  const safeName = slugifyToken(name, `${group}-${tokens.length + 1}`);
  const path = `${group}.${safeName}`;
  if (tokens.some((token) => token.tokenPath === path)) return;

  if (!dtcgRoot[group]) dtcgRoot[group] = {};
  dtcgRoot[group][safeName] = {
    $type: type,
    $value: value,
  };
  if (description) dtcgRoot[group][safeName].$description = description;
  if (sourceExcerpt || Object.keys(extensions).length) {
    dtcgRoot[group][safeName].$extensions = {
      sourceExcerpt,
      ...extensions,
    };
  }

  tokens.push({
    tokenPath: path,
    tokenName: safeName,
    tokenType: type,
    tokenValue: value,
    description,
    aliasOf: extensions.aliasOf || "",
    referencePath: extensions.referencePath || "",
    extensions: dtcgRoot[group][safeName].$extensions || {},
    sourceExcerpt,
    confidence,
  });
}

function extractColors(markdown, dtcgRoot, tokens) {
  const matches = Array.from(String(markdown || "").matchAll(/#[0-9a-fA-F]{3,8}\b/g));
  const seen = new Set();
  for (const match of matches) {
    const value = match[0];
    const lower = value.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    addToken(
      tokens,
      dtcgRoot,
      "color",
      `color-${seen.size}`,
      "color",
      value,
      seen.size === 1 ? "Primary detected color from Design MD." : "Detected color from Design MD.",
      excerptAround(markdown, match.index),
      seen.size === 1 ? 0.9 : 0.82,
      { detectedRole: seen.size === 1 ? "primary_detected" : "detected" }
    );
  }
}

function extractFonts(markdown, dtcgRoot, tokens) {
  const patterns = [
    /fontFamily:\s*["']([^"']+)["']/gi,
    /font-family:\s*["']?([^"'\n`]+(?:sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia))["']?/gi,
    /(?:Primary|Heading|Body|Display):\s*`?([^`\n]+(?:sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia))`?/gi,
  ];
  const seen = new Set();
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(markdown))) {
      const value = match[1].trim();
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      addToken(
        tokens,
        dtcgRoot,
        "typography",
        `font-${seen.size}`,
        "fontFamily",
        value,
        seen.size === 1 ? "Primary detected font family from Design MD." : "Detected font family from Design MD.",
        excerptAround(markdown, match.index),
        seen.size === 1 ? 0.88 : 0.78
      );
    }
  }
}

function extractDimensions(markdown, dtcgRoot, tokens) {
  const patterns = [
    { group: "radius", type: "dimension", regex: /(?:radius|rounded|corner)[^\n]{0,40}?(\d+(?:\.\d+)?)(px|rem|em|%)/gi },
    { group: "spacing", type: "dimension", regex: /(?:spacing|space|gap|padding|margin|gutter)[^\n]{0,40}?(\d+(?:\.\d+)?)(px|rem|em|%)/gi },
    { group: "dimension", type: "dimension", regex: /(?:width|height|max-width|min-width|container)[^\n]{0,40}?(\d+(?:\.\d+)?)(px|rem|em|%)/gi },
  ];

  for (const item of patterns) {
    let count = 0;
    let match;
    while ((match = item.regex.exec(markdown))) {
      count += 1;
      addToken(
        tokens,
        dtcgRoot,
        item.group,
        `${item.group}-${count}`,
        item.type,
        { value: Number(match[1]), unit: match[2] },
        `Detected ${item.group} value from Design MD.`,
        excerptAround(markdown, match.index),
        0.72
      );
    }
  }
}

function extractShadows(markdown, dtcgRoot, tokens) {
  const regex = /(-?\d+(?:\.\d+)?px)\s+(-?\d+(?:\.\d+)?px)\s+(\d+(?:\.\d+)?px)(?:\s+(-?\d+(?:\.\d+)?px))?\s+(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/g;
  const colorFirstRegex = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})\s+(-?\d+(?:\.\d+)?px)\s+(-?\d+(?:\.\d+)?px)\s+(\d+(?:\.\d+)?px)(?:\s+(-?\d+(?:\.\d+)?px))?/g;
  let count = 0;
  let match;
  while ((match = regex.exec(markdown))) {
    count += 1;
    addToken(
      tokens,
      dtcgRoot,
      "shadow",
      `shadow-${count}`,
      "shadow",
      {
        offsetX: match[1],
        offsetY: match[2],
        blur: match[3],
        spread: match[4] || "0px",
        color: match[5],
      },
      "Detected shadow token from Design MD.",
      excerptAround(markdown, match.index),
      0.76
    );
  }
  while ((match = colorFirstRegex.exec(markdown))) {
    count += 1;
    addToken(
      tokens,
      dtcgRoot,
      "shadow",
      `shadow-${count}`,
      "shadow",
      {
        offsetX: match[2],
        offsetY: match[3],
        blur: match[4],
        spread: match[5] || "0px",
        color: match[1],
      },
      "Detected shadow token from Design MD.",
      excerptAround(markdown, match.index),
      0.76
    );
  }
}

function extractBreakpoints(markdown, dtcgRoot, tokens) {
  const regex = /(?:mobile|tablet|desktop|breakpoint|wide|small|large)[^\n|:]{0,40}(?:[:|]|\s)\s*(<|>|>=|<=)?\s*(\d{3,4})\s*(?:-|to)?\s*(\d{3,4})?px?/gi;
  let count = 0;
  let match;
  while ((match = regex.exec(markdown))) {
    count += 1;
    const value = { boundary: match[1] || "", minWidth: Number(match[2]) };
    if (match[3]) value.maxWidth = Number(match[3]);
    addToken(
      tokens,
      dtcgRoot,
      "breakpoint",
      `breakpoint-${count}`,
      "dimension",
      value,
      "Detected responsive breakpoint from Design MD.",
      excerptAround(markdown, match.index),
      0.7
    );
  }
}

function buildMetadata(markdown) {
  const { body } = stripFrontmatter(markdown);
  const sections = splitSections(body);
  const items = [];
  let parentCategory = "";

  for (const section of sections) {
    const category = categoryForSectionWithParent(section, parentCategory);
    if (section.level <= 2) parentCategory = category;
    const value = section.body.replace(/\s+/g, " ").trim();
    if (!value) continue;
    const key = slugifyToken(section.title, category);
    items.push({
      category,
      key,
      value: value.slice(0, 1800),
      sourceExcerpt: section.content.slice(0, 700),
      confidence: category === "other" ? 0.62 : 0.82,
    });
  }

  return items.slice(0, 80);
}

function extractListItems(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 24);
}

function detectComponentType(title) {
  const raw = String(title || "").toLowerCase();
  if (/button|cta/.test(raw)) return "button";
  if (/card|container/.test(raw)) return "card";
  if (/nav|header/.test(raw)) return "nav";
  if (/hero/.test(raw)) return "hero";
  if (/footer/.test(raw)) return "footer";
  if (/badge|chip|pill|tag/.test(raw)) return "badge";
  if (/form|input|field/.test(raw)) return "form";
  if (/image|photo|media|video/.test(raw)) return "media";
  return "component";
}

function detectLayoutType(title) {
  const raw = String(title || "").toLowerCase();
  if (/nav/.test(raw)) return "global_nav";
  if (/hero/.test(raw)) return "hero_composition";
  if (/grid/.test(raw)) return "grid";
  if (/container/.test(raw)) return "container";
  if (/footer/.test(raw)) return "footer_structure";
  if (/responsive|breakpoint|mobile|tablet|desktop|collapsing/.test(raw)) return "responsive";
  if (/spacing|rhythm|whitespace|section/.test(raw)) return "section_rhythm";
  return "page_structure";
}

function inferTokenReferences(text) {
  const refs = [];
  const raw = String(text || "");
  const hexes = Array.from(raw.matchAll(/#[0-9a-fA-F]{3,8}\b/g)).map((match) => match[0].toLowerCase());
  for (const hex of Array.from(new Set(hexes)).slice(0, 8)) refs.push({ type: "color", value: hex });
  const dimensions = Array.from(raw.matchAll(/\b\d+(?:\.\d+)?(?:px|rem|em|%)\b/g)).map((match) => match[0]);
  for (const value of Array.from(new Set(dimensions)).slice(0, 8)) refs.push({ type: "dimension", value });
  return refs;
}

function buildComponentPatterns(metadataItems) {
  return metadataItems
    .filter((item) => item.category === "component")
    .slice(0, 80)
    .map((item) => ({
      componentType: detectComponentType(item.key),
      patternKey: item.key,
      valueJson: {
        summary: item.value || UNKNOWN,
        style: item.value || UNKNOWN,
      },
      tokenReferences: inferTokenReferences(item.value),
      sourceExcerpt: item.sourceExcerpt || "",
      confidence: item.confidence || 0.7,
    }));
}

function buildLayoutPatterns(metadataItems) {
  return metadataItems
    .filter((item) => ["layout", "breakpoint", "spacing"].includes(item.category))
    .slice(0, 80)
    .map((item) => ({
      layoutType: detectLayoutType(item.key),
      patternKey: item.key,
      valueJson: {
        summary: item.value || UNKNOWN,
        category: item.category,
      },
      tokenReferences: inferTokenReferences(item.value),
      sourceExcerpt: item.sourceExcerpt || "",
      confidence: item.confidence || 0.7,
    }));
}

function buildGuidelineItems(metadataItems) {
  const rows = [];
  for (const item of metadataItems.filter((entry) => entry.category === "guidance")) {
    const rawKey = item.key.toLowerCase();
    let guidelineType = "rule";
    if (/don-t|dont|avoid|never/.test(rawKey)) guidelineType = "dont";
    if (/^do\b|dos|do-s/.test(rawKey)) guidelineType = "do";
    if (/must|required|non-negotiable/.test(rawKey)) guidelineType = "must";

    const lines = extractListItems(item.sourceExcerpt || item.value);
    const values = lines.length ? lines : [item.value || UNKNOWN];
    for (const [index, value] of values.slice(0, 24).entries()) {
      const lower = value.toLowerCase();
      const inferredType = /don't|do not|avoid|never/.test(lower)
        ? "dont"
        : /must|required|always/.test(lower)
          ? "must"
          : guidelineType;
      rows.push({
        guidelineType: inferredType,
        key: slugifyToken(value, `${inferredType}-${index + 1}`),
        value: value || UNKNOWN,
        severity: inferredType === "dont" || inferredType === "must" ? "strong" : "recommended",
        appliesTo: detectComponentType(value),
        sourceExcerpt: item.sourceExcerpt || "",
        confidence: item.confidence || 0.72,
      });
    }
  }
  return rows.slice(0, 120);
}

function firstTokenValue(tokenItems, group, matcher = null) {
  const token = tokenItems.find((item) => {
    if (!item.tokenPath.startsWith(`${group}.`)) return false;
    return matcher ? matcher(item) : true;
  });
  return token ? token.tokenValue : UNKNOWN;
}

function known(value, confidence, source = "extracted") {
  return { value, confidence, source };
}

function asDimension(value, unit = "px") {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return UNKNOWN;
  return { value: numeric, unit };
}

function colorLines(metadataItems) {
  return metadataItems
    .filter((item) => ["color", "philosophy", "guidance"].includes(item.category))
    .flatMap((item) => String(`${item.value}\n${item.sourceExcerpt || ""}`).split(/\r?\n| - |\|/))
    .map((line) => line.trim())
    .filter((line) => /#[0-9a-fA-F]{3,8}\b/.test(line));
}

function findColorByKeywords(metadataItems, keywords, fallback = "") {
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  for (const line of colorLines(metadataItems)) {
    const lower = line.toLowerCase();
    const keywordIndexes = normalizedKeywords
      .map((keyword) => lower.indexOf(keyword))
      .filter((index) => index >= 0);
    if (!keywordIndexes.length) continue;
    const matches = Array.from(line.matchAll(/#[0-9a-fA-F]{3,8}\b/g));
    if (!matches.length) continue;
    const nearest = matches
      .map((match) => ({
        value: match[0],
        distance: Math.min(...keywordIndexes.map((index) => Math.abs((match.index || 0) - index))),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearest?.value) return nearest.value;
  }
  return fallback || UNKNOWN;
}

function isDarkDesign(metadataItems) {
  const text = metadataItems.map((item) => item.value).join("\n").toLowerCase();
  return /near-black|dark theme|dark immersive|charcoal|don't use light backgrounds|do not use light backgrounds/.test(text);
}

function findTypographyValue(metadataItems, patterns) {
  const text = metadataItems
    .filter((item) => item.category === "typography")
    .map((item) => `${item.value}\n${item.sourceExcerpt || ""}`)
    .join("\n");
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match?.[1]) return match[1].trim();
  }
  return UNKNOWN;
}

function findDimensionByPatterns(metadataItems, categories, patterns) {
  const text = metadataItems
    .filter((item) => categories.includes(item.category))
    .map((item) => `${item.value}\n${item.sourceExcerpt || ""}`)
    .join("\n");
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match?.[1]) return asDimension(match[1], match[2] || "px");
  }
  return UNKNOWN;
}

function classifyDetailModels(markdown, tokenItems, metadataItems, base) {
  const text = `${markdown}\n${metadataItems.map((item) => item.value).join("\n")}`.toLowerCase();
  const colorCount = tokenItems.filter((item) => item.tokenType === "color").length;
  const shadowCount = tokenItems.filter((item) => item.tokenType === "shadow").length;
  const radiusValues = tokenItems
    .filter((item) => item.tokenPath.startsWith("radius."))
    .map((item) => Number(item.tokenValue?.value))
    .filter(Number.isFinite);

  const colorMode = /monochrome|black-and-white|black and white|single .*color|monochromatic/.test(text)
    ? "monochrome"
    : /dark|black|navy|charcoal/.test(text) && /white|light/.test(text)
      ? "mixed"
      : /vivid|saturated|colorful|gradient/.test(text)
        ? "vivid"
        : colorCount > 8
          ? "multi_color"
          : colorCount > 0
            ? "limited_palette"
            : UNKNOWN;

  const depthModel = /flat|no shadow|no shadows|mostly flat/.test(text)
    ? "flat"
    : /shadow|elevation|drop shadow|box-shadow/.test(text) || shadowCount
      ? "shadowed"
      : /glass|frosted|backdrop-filter/.test(text)
        ? "glass"
    : /photography|media|image-led|cinematic/.test(text)
      ? "media_led"
      : UNKNOWN;

  const maxRadius = radiusValues.length ? Math.max(...radiusValues) : 0;
  const shapeModel = /pill/.test(text) || maxRadius >= 30
    ? "pill_heavy"
    : /sharp|square|4px|barely rounded/.test(text)
      ? "sharp"
      : /rounded|radius/.test(text) || maxRadius >= 8
        ? "rounded"
        : UNKNOWN;

  const typographyTone = /mono|monospace|code|technical/.test(text)
    ? "mono_technical"
    : /editorial|serif|magazine/.test(text)
      ? "editorial"
      : /display|hero|large type|massive type/.test(text)
        ? "display_led"
        : /system|sans|ui/.test(text)
          ? "system_ui"
          : UNKNOWN;

  return {
    ...base,
    colorMode,
    depthModel,
    shapeModel,
    typographyTone,
    confidence: Math.max(base.confidence || 0, [colorMode, depthModel, shapeModel, typographyTone].filter((item) => item !== UNKNOWN).length >= 3 ? 0.76 : 0.62),
  };
}

function buildNormalizedSchema({ tokenItems, metadataItems, componentPatterns, layoutPatterns, guidelineItems, styleClassification, designConceptJson }) {
  const schema = createNormalizedSchema();
  const colors = tokenItems.filter((item) => item.tokenType === "color").map((item) => item.tokenValue);
  if (colors[0]) schema.tokens.color.primary = known(colors[0], 0.9);
  if (colors[1]) schema.tokens.color.secondary = known(colors[1], 0.82);
  if (colors[2]) schema.tokens.color.accent = known(colors[2], 0.78);
  if (colors.find((value) => String(value).toLowerCase() === "#ffffff")) schema.tokens.color.background = known("#ffffff", 0.78);
  if (colors.find((value) => /#0{3,6}|#111|#17171c|#212121/i.test(String(value)))) schema.tokens.color.text = known(colors.find((value) => /#0{3,6}|#111|#17171c|#212121/i.test(String(value))), 0.72);

  const semanticColors = {
    primary: findColorByKeywords(metadataItems, ["spotify green", "primary brand accent", "brand accent", "cta", "active states"]),
    accent: findColorByKeywords(metadataItems, ["spotify green", "accent", "cta", "play buttons"]),
    background: findColorByKeywords(metadataItems, ["near black", "deepest background", "background surface", "page background"]),
    surface: findColorByKeywords(metadataItems, ["dark surface", "dark card", "card surface", "elevated card", "containers"]),
    text: findColorByKeywords(metadataItems, ["white", "primary text", "text-base"]),
    mutedText: findColorByKeywords(metadataItems, ["silver", "secondary text", "muted labels", "inactive nav"]),
    border: findColorByKeywords(metadataItems, ["border gray", "light border", "outlined button borders", "button borders"]),
  };
  for (const [key, value] of Object.entries(semanticColors)) {
    if (value !== UNKNOWN) schema.tokens.color[key] = known(value, 0.9, "semantic");
  }
  if (isDarkDesign(metadataItems) && schema.tokens.color.background.value === "#ffffff") {
    const darkBackground = semanticColors.background !== UNKNOWN ? semanticColors.background : colors.find((value) => ["#121212", "#181818", "#1f1f1f"].includes(String(value).toLowerCase()));
    if (darkBackground) schema.tokens.color.background = known(darkBackground, 0.92, "semantic");
  }

  const fonts = tokenItems.filter((item) => item.tokenType === "fontFamily").map((item) => item.tokenValue);
  if (fonts[0]) schema.tokens.typography.displayFont = known(fonts[0], 0.84);
  if (fonts[1]) schema.tokens.typography.bodyFont = known(fonts[1], 0.78);
  if (fonts.find((value) => /mono|code/i.test(String(value)))) schema.tokens.typography.monoFont = known(fonts.find((value) => /mono|code/i.test(String(value))), 0.78);

  const displayFont = findTypographyValue(metadataItems, [
    /\bTitle\*\*:\s*`([^`]+)`/i,
    /\bTitle\s*:\s*`([^`]+)`/i,
  ]);
  const bodyFont = findTypographyValue(metadataItems, [
    /\bUI\s*\/\s*Body\*\*:\s*`([^`]+)`/i,
    /\bUI\s*\/\s*Body\s*:\s*`([^`]+)`/i,
    /\bBody\*\*:\s*`([^`]+)`/i,
  ]);
  const titleWeight = findTypographyValue(metadataItems, [
    /Section Title\s*\|\s*[^|]+\|\s*[^|]+\|\s*(\d{3})\s*\|/i,
    /title[^.\n|]{0,80}\b(\d{3})\b/i,
  ]);
  if (displayFont !== UNKNOWN) schema.tokens.typography.displayFont = known(displayFont, 0.9, "semantic");
  if (bodyFont !== UNKNOWN) schema.tokens.typography.bodyFont = known(bodyFont, 0.9, "semantic");
  if (titleWeight !== UNKNOWN) schema.tokens.typography.titleWeight = known(titleWeight, 0.82, "semantic");

  schema.tokens.radius.small = known(firstTokenValue(tokenItems, "radius"), tokenItems.some((item) => item.tokenPath.startsWith("radius.")) ? 0.65 : 0);
  schema.tokens.spacing.base = known(firstTokenValue(tokenItems, "spacing"), tokenItems.some((item) => item.tokenPath.startsWith("spacing.")) ? 0.65 : 0);
  schema.tokens.elevation.cardShadow = known(firstTokenValue(tokenItems, "shadow"), tokenItems.some((item) => item.tokenPath.startsWith("shadow.")) ? 0.76 : 0);
  schema.tokens.elevation.depthModel = known(styleClassification.depthModel || UNKNOWN, styleClassification.depthModel === UNKNOWN ? 0 : 0.7);
  schema.tokens.breakpoint.desktop = known(firstTokenValue(tokenItems, "breakpoint"), tokenItems.some((item) => item.tokenPath.startsWith("breakpoint.")) ? 0.65 : 0);

  const smallRadius = findDimensionByPatterns(metadataItems, ["radius", "component"], [/Subtle\s*\((\d+(?:\.\d+)?)(px)\)/i, /Minimal\s*\((\d+(?:\.\d+)?)(px)\)/i]);
  const mediumRadius = findDimensionByPatterns(metadataItems, ["radius", "component"], [/Standard\s*\((\d+(?:\.\d+)?)(px)\)/i, /Comfortable\s*\((\d+(?:\.\d+)?)(px)\)/i, /card[^.\n]{0,80}Radius:\s*(\d+(?:\.\d+)?)(px)/i]);
  const largeRadius = findDimensionByPatterns(metadataItems, ["radius", "component"], [/Large\s*\((\d+(?:\.\d+)?)(px)\)/i]);
  const pillRadius = findDimensionByPatterns(metadataItems, ["radius", "component"], [/Full Pill\s*\((\d+(?:\.\d+)?)(px)\)/i, /Pill\s*\((\d+(?:\.\d+)?)(px)\)/i, /Radius:\s*(9999|500)(px)/i]);
  const spacingBase = findDimensionByPatterns(metadataItems, ["spacing", "layout"], [/Base unit:\s*(\d+(?:\.\d+)?)(px)/i]);
  if (smallRadius !== UNKNOWN) schema.tokens.radius.small = known(smallRadius, 0.86, "semantic");
  if (mediumRadius !== UNKNOWN) schema.tokens.radius.medium = known(mediumRadius, 0.86, "semantic");
  if (largeRadius !== UNKNOWN) schema.tokens.radius.large = known(largeRadius, 0.82, "semantic");
  if (pillRadius !== UNKNOWN) schema.tokens.radius.pill = known(pillRadius, 0.9, "semantic");
  if (spacingBase !== UNKNOWN) schema.tokens.spacing.base = known(spacingBase, 0.9, "semantic");

  for (const pattern of componentPatterns) {
    if (schema.components[pattern.componentType]) {
      schema.components[pattern.componentType] = known(pattern.valueJson, pattern.confidence || 0.7);
    }
  }
  for (const pattern of layoutPatterns) {
    const key = {
      page_structure: "pageStructure",
      grid: "grid",
      container: "container",
      section_rhythm: "sectionRhythm",
      hero_composition: "heroComposition",
      footer_structure: "footerStructure",
      responsive: "responsiveBehavior",
    }[pattern.layoutType] || "pageStructure";
    schema.layouts[key] = known(pattern.valueJson, pattern.confidence || 0.7);
  }

  const byGuideline = (type) => guidelineItems.filter((item) => item.guidelineType === type).map((item) => item.value).slice(0, 24);
  schema.guidelines.dos = byGuideline("do");
  schema.guidelines.donts = byGuideline("dont");
  schema.guidelines.must = byGuideline("must");
  schema.guidelines.avoid = guidelineItems.filter((item) => /avoid|do not|don't|never/i.test(item.value)).map((item) => item.value).slice(0, 24);
  if (!schema.guidelines.dos.length) schema.guidelines.dos = [UNKNOWN];
  if (!schema.guidelines.donts.length) schema.guidelines.donts = [UNKNOWN];
  if (!schema.guidelines.must.length) schema.guidelines.must = [UNKNOWN];
  if (!schema.guidelines.avoid.length) schema.guidelines.avoid = [UNKNOWN];

  schema.metadata.brandConcept = known(designConceptJson.brandConcept || UNKNOWN, designConceptJson.brandConcept ? 0.78 : 0);
  schema.metadata.visualMood = known(designConceptJson.visualMood || UNKNOWN, designConceptJson.visualMood ? 0.78 : 0);
  schema.metadata.designPhilosophy = known(designConceptJson.layoutPhilosophy || UNKNOWN, designConceptJson.layoutPhilosophy ? 0.72 : 0);
  schema.metadata.styleTags = styleClassification.styleTags?.length ? styleClassification.styleTags : [UNKNOWN];
  schema.classification = {
    primaryGroup: styleClassification.primaryGroup?.slug || UNKNOWN,
    layoutDensity: styleClassification.layoutDensity || UNKNOWN,
    layoutModel: styleClassification.layoutModel || UNKNOWN,
    colorMode: styleClassification.colorMode || UNKNOWN,
    depthModel: styleClassification.depthModel || UNKNOWN,
    shapeModel: styleClassification.shapeModel || UNKNOWN,
    typographyTone: styleClassification.typographyTone || UNKNOWN,
    confidence: styleClassification.confidence || 0,
  };
  return schema;
}

function classifyFromMetadata(markdown, metadataItems) {
  const text = `${markdown}\n${metadataItems.map((item) => item.value).join("\n")}`.toLowerCase();
  if (/luxury|automotive|vehicle|editorial|premium|cinematic/.test(text)) {
    return group("premium_editorial", "Premium / Editorial", "Premium, cinematic, or editorial design system.", ["premium", "editorial"]);
  }
  if (/developer|api|code|terminal|technical|docs|engineering/.test(text)) {
    return group("dense_systematic", "Dense / Systematic", "Technical, systematic, and information-dense design system.", ["technical", "systematic"]);
  }
  if (/casino|\bgaming\b|\bgame\b|entertainment|\bplayful\b|\bfun\b/.test(text)) {
    return group("playful_immersive", "Playful / Immersive", "Playful or entertainment-led design system.", ["playful", "immersive"]);
  }
  if (/minimal|clean|simple|restrained|product/.test(text)) {
    return group("minimal_product", "Minimal Product", "Minimal product-led design system.", ["minimal", "product"]);
  }
  if (/commerce|shop|retail|product|catalog|pricing/.test(text)) {
    return group("content_rich_commerce", "Content-rich Commerce", "Commerce or content-rich product presentation system.", ["commerce", "content-rich"]);
  }
  return group("unclassified", "Unclassified", "Automatically extracted metadata needs review.", ["auto-extracted"]);
}

function group(slug, name, description, styleTags) {
  return {
    primaryGroup: { slug, name, description },
    styleTags,
    layoutDensity: slug === "dense_systematic" ? "dense" : "balanced",
    layoutModel: slug === "premium_editorial" ? "editorial" : "grid_panel",
    colorMode: "unclassified",
    depthModel: "unclassified",
    shapeModel: "unclassified",
    typographyTone: "unclassified",
    confidence: slug === "unclassified" ? 0.45 : 0.68,
    reason: "Derived from extracted Design MD metadata.",
  };
}

function conceptFromMetadata(markdown, metadataItems, styleClassification) {
  const find = (categories) => metadataItems.find((item) => categories.includes(item.category))?.value || "";
  const concept = find(["philosophy", "other"]) || "Design metadata extracted from the uploaded Design MD.";
  const layout = find(["layout"]) || "Use the extracted layout metadata and spacing tokens as the layout basis.";
  const component = find(["component"]) || "Use extracted component metadata and token references where available.";
  const depth = find(["elevation"]) || "Use extracted elevation and depth metadata where available.";
  const shape = find(["radius"]) || "Use extracted radius and shape tokens where available.";
  const color = find(["color"]) || "Use extracted DTCG color tokens.";
  const typography = find(["typography"]) || "Use extracted typography tokens.";
  const guidance = metadataItems.filter((item) => item.category === "guidance").map((item) => item.value).slice(0, 6);

  return {
    brandConcept: concept.slice(0, 700),
    visualMood: find(["philosophy"]) || concept.slice(0, 400),
    layoutPhilosophy: layout.slice(0, 700),
    spacingRhythm: find(["spacing", "layout"]).slice(0, 700),
    depthAndEffects: depth.slice(0, 700),
    shapeAndRadius: shape.slice(0, 700),
    componentStyle: component.slice(0, 700),
    motionOrEffects: find(["elevation"]) || "No explicit motion metadata extracted.",
    colorBehavior: color.slice(0, 700),
    typographyBehavior: typography.slice(0, 700),
    dos: guidance.length ? guidance : [],
    donts: [],
    generationGuidance: [
      "Use only extracted tokens and metadata for generation.",
      "Do not refer back to the original Design MD in image generation.",
      ...guidance,
    ].slice(0, 8),
    promoPageImplications: {
      hero: "Derive hero composition from extracted component and layout metadata.",
      contentSections: "Apply extracted spacing, layout, and component patterns to supporting sections.",
      cta: "Use extracted CTA/button metadata where available.",
      legal: "Keep legal/footer hierarchy visible and consistent with extracted metadata.",
      desktopLayout: "Use extracted layout and breakpoint metadata instead of raw Design MD prose.",
    },
    styleClassification,
    confidence: styleClassification.confidence || 0.6,
  };
}

function promptContextFromConcept(concept, metadataItems) {
  return [
    `Brand concept: ${concept.brandConcept}`,
    `Visual mood: ${concept.visualMood}`,
    `Layout philosophy: ${concept.layoutPhilosophy}`,
    `Component style: ${concept.componentStyle}`,
    `Depth/effects: ${concept.depthAndEffects}`,
    `Shape/radius: ${concept.shapeAndRadius}`,
    `Color behavior: ${concept.colorBehavior}`,
    `Typography behavior: ${concept.typographyBehavior}`,
    `Style group: ${concept.styleClassification?.primaryGroup?.name || ""}`,
    `Metadata keys: ${metadataItems.map((item) => `${item.category}.${item.key}`).slice(0, 24).join(" | ")}`,
  ]
    .filter((line) => !line.endsWith(": "))
    .join("\n");
}

function extractDesignMdData({ markdown }) {
  const text = String(markdown || "");
  const hash = sourceHash(text);
  const dtcgTokens = {};
  const tokenItems = [];
  extractColors(text, dtcgTokens, tokenItems);
  extractFonts(text, dtcgTokens, tokenItems);
  extractDimensions(text, dtcgTokens, tokenItems);
  extractShadows(text, dtcgTokens, tokenItems);
  extractBreakpoints(text, dtcgTokens, tokenItems);

  const metadataItems = buildMetadata(text);
  const styleClassification = classifyDetailModels(text, tokenItems, metadataItems, classifyFromMetadata(text, metadataItems));
  const designConceptJson = conceptFromMetadata(text, metadataItems, styleClassification);
  const designPromptContext = promptContextFromConcept(designConceptJson, metadataItems);
  const componentPatterns = buildComponentPatterns(metadataItems);
  const layoutPatterns = buildLayoutPatterns(metadataItems);
  const guidelineItems = buildGuidelineItems(metadataItems);
  const normalizedSchema = buildNormalizedSchema({
    tokenItems,
    metadataItems,
    componentPatterns,
    layoutPatterns,
    guidelineItems,
    styleClassification,
    designConceptJson,
  });

  return {
    sourceHash: hash,
    format: "dtcg",
    extractionModel: EXTRACTION_MODEL,
    dtcgTokens,
    normalizedSchema,
    tokenItems,
    metadataItems,
    componentPatterns,
    layoutPatterns,
    guidelineItems,
    designConceptSummary: designConceptJson.brandConcept,
    designConceptJson,
    designPromptContext,
    styleClassificationJson: styleClassification,
    warnings: tokenItems.length ? [] : ["No explicit design tokens were detected."],
  };
}

async function persistDesignMdData(sql, documentId, extracted) {
  await sql`
    update design_documents
    set extraction_status = 'extracting',
        extraction_error = null,
        source_hash = ${extracted.sourceHash},
        updated_at = now()
    where id = ${documentId}::uuid
  `;

  const versionRows = await sql`
    select coalesce(max(version), 0) + 1 as next_version
    from design_token_sets
    where document_id = ${documentId}::uuid
  `;
  const version = Number(versionRows[0]?.next_version || 1);

  const setRows = await sql`
    insert into design_token_sets (
      document_id,
      version,
      format,
      dtcg_json,
      normalized_schema_json,
      source_hash,
      extraction_model,
      status,
      error_message,
      extracted_at
    )
    values (
      ${documentId}::uuid,
      ${version},
      ${extracted.format},
      ${JSON.stringify(extracted.dtcgTokens)}::jsonb,
      ${JSON.stringify(extracted.normalizedSchema || {})}::jsonb,
      ${extracted.sourceHash},
      ${extracted.extractionModel},
      'ready',
      null,
      now()
    )
    returning id::text as id
  `;
  const tokenSetId = setRows[0].id;

  if (extracted.tokenItems?.length) {
    const rows = extracted.tokenItems.map((token) => ({
      token_set_id: tokenSetId,
      document_id: documentId,
      token_path: token.tokenPath,
      token_name: token.tokenName,
      token_type: token.tokenType,
      token_value: token.tokenValue,
      description: token.description || "",
      alias_of: token.aliasOf || "",
      reference_path: token.referencePath || "",
      extensions: token.extensions || {},
      source_excerpt: token.sourceExcerpt || "",
      confidence: token.confidence,
    }));
    await sql`
      insert into design_token_items (
        token_set_id,
        document_id,
        token_path,
        token_name,
        token_type,
        token_value,
        description,
        alias_of,
        reference_path,
        extensions,
        source_excerpt,
        confidence
      )
      select
        token_set_id::uuid,
        document_id::uuid,
        token_path,
        token_name,
        token_type,
        token_value,
        description,
        alias_of,
        reference_path,
        extensions,
        source_excerpt,
        confidence
      from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as x(
        token_set_id text,
        document_id text,
        token_path text,
        token_name text,
        token_type text,
        token_value jsonb,
        description text,
        alias_of text,
        reference_path text,
        extensions jsonb,
        source_excerpt text,
        confidence numeric
      )
    `;
  }

  if (extracted.metadataItems?.length) {
    const rows = extracted.metadataItems.map((item) => ({
      document_id: documentId,
      token_set_id: tokenSetId,
      category: item.category,
      key: item.key,
      value: item.value,
      source_excerpt: item.sourceExcerpt || "",
      confidence: item.confidence,
    }));
    await sql`
      insert into design_metadata_items (
        document_id,
        token_set_id,
        category,
        key,
        value,
        source_excerpt,
        confidence
      )
      select
        document_id::uuid,
        token_set_id::uuid,
        category,
        key,
        value,
        source_excerpt,
        confidence
      from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as x(
        document_id text,
        token_set_id text,
        category text,
        key text,
        value text,
        source_excerpt text,
        confidence numeric
      )
    `;
  }

  if (extracted.componentPatterns?.length) {
    const rows = extracted.componentPatterns.map((item) => ({
      document_id: documentId,
      token_set_id: tokenSetId,
      component_type: item.componentType,
      pattern_key: item.patternKey,
      value_json: item.valueJson || {},
      token_references: item.tokenReferences || [],
      source_excerpt: item.sourceExcerpt || "",
      confidence: item.confidence,
    }));
    await sql`
      insert into design_component_patterns (
        document_id,
        token_set_id,
        component_type,
        pattern_key,
        value_json,
        token_references,
        source_excerpt,
        confidence
      )
      select
        document_id::uuid,
        token_set_id::uuid,
        component_type,
        pattern_key,
        value_json,
        token_references,
        source_excerpt,
        confidence
      from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as x(
        document_id text,
        token_set_id text,
        component_type text,
        pattern_key text,
        value_json jsonb,
        token_references jsonb,
        source_excerpt text,
        confidence numeric
      )
    `;
  }

  if (extracted.layoutPatterns?.length) {
    const rows = extracted.layoutPatterns.map((item) => ({
      document_id: documentId,
      token_set_id: tokenSetId,
      layout_type: item.layoutType,
      pattern_key: item.patternKey,
      value_json: item.valueJson || {},
      token_references: item.tokenReferences || [],
      source_excerpt: item.sourceExcerpt || "",
      confidence: item.confidence,
    }));
    await sql`
      insert into design_layout_patterns (
        document_id,
        token_set_id,
        layout_type,
        pattern_key,
        value_json,
        token_references,
        source_excerpt,
        confidence
      )
      select
        document_id::uuid,
        token_set_id::uuid,
        layout_type,
        pattern_key,
        value_json,
        token_references,
        source_excerpt,
        confidence
      from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as x(
        document_id text,
        token_set_id text,
        layout_type text,
        pattern_key text,
        value_json jsonb,
        token_references jsonb,
        source_excerpt text,
        confidence numeric
      )
    `;
  }

  if (extracted.guidelineItems?.length) {
    const rows = extracted.guidelineItems.map((item) => ({
      document_id: documentId,
      token_set_id: tokenSetId,
      guideline_type: item.guidelineType,
      key: item.key,
      value: item.value,
      severity: item.severity || "recommended",
      applies_to: item.appliesTo || "",
      source_excerpt: item.sourceExcerpt || "",
      confidence: item.confidence,
    }));
    await sql`
      insert into design_guideline_items (
        document_id,
        token_set_id,
        guideline_type,
        key,
        value,
        severity,
        applies_to,
        source_excerpt,
        confidence
      )
      select
        document_id::uuid,
        token_set_id::uuid,
        guideline_type,
        key,
        value,
        severity,
        applies_to,
        source_excerpt,
        confidence
      from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as x(
        document_id text,
        token_set_id text,
        guideline_type text,
        key text,
        value text,
        severity text,
        applies_to text,
        source_excerpt text,
        confidence numeric
      )
    `;
  }

  await sql`
    update design_documents
    set status = 'ready',
        extraction_status = 'ready',
        extraction_error = null,
        design_concept_summary = ${extracted.designConceptSummary},
        design_concept_json = ${JSON.stringify(extracted.designConceptJson)}::jsonb,
        design_prompt_context = ${extracted.designPromptContext},
        style_classification_json = ${JSON.stringify(extracted.styleClassificationJson)}::jsonb,
        analyzed_at = now(),
        analysis_model = ${extracted.extractionModel},
        updated_at = now()
    where id = ${documentId}::uuid
  `;

  return { tokenSetId, version };
}

async function markExtractionFailed(sql, documentId, error) {
  await sql`
    update design_documents
    set status = 'failed',
        extraction_status = 'failed',
        extraction_error = ${error.message || String(error)},
        updated_at = now()
    where id = ${documentId}::uuid
  `;
}

module.exports = {
  EXTRACTION_MODEL,
  extractDesignMdData,
  persistDesignMdData,
  markExtractionFailed,
  sourceHash,
};

const crypto = require("crypto");

const EXTRACTION_MODEL = "local-design-md-datafication-v1";

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

  for (const section of sections) {
    const category = categoryForSection(section.title);
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

function classifyFromMetadata(markdown, metadataItems) {
  const text = `${markdown}\n${metadataItems.map((item) => item.value).join("\n")}`.toLowerCase();
  if (/casino|gaming|game|entertainment|playful|fun/.test(text)) {
    return group("playful_immersive", "Playful / Immersive", "Playful or entertainment-led design system.", ["playful", "immersive"]);
  }
  if (/luxury|automotive|vehicle|editorial|premium|cinematic/.test(text)) {
    return group("premium_editorial", "Premium / Editorial", "Premium, cinematic, or editorial design system.", ["premium", "editorial"]);
  }
  if (/commerce|shop|retail|product|catalog|pricing/.test(text)) {
    return group("content_rich_commerce", "Content-rich Commerce", "Commerce or content-rich product presentation system.", ["commerce", "content-rich"]);
  }
  if (/developer|api|code|terminal|technical|docs|engineering/.test(text)) {
    return group("dense_systematic", "Dense / Systematic", "Technical, systematic, and information-dense design system.", ["technical", "systematic"]);
  }
  if (/minimal|clean|simple|restrained|product/.test(text)) {
    return group("minimal_product", "Minimal Product", "Minimal product-led design system.", ["minimal", "product"]);
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
  const styleClassification = classifyFromMetadata(text, metadataItems);
  const designConceptJson = conceptFromMetadata(text, metadataItems, styleClassification);
  const designPromptContext = promptContextFromConcept(designConceptJson, metadataItems);

  return {
    sourceHash: hash,
    format: "dtcg",
    extractionModel: EXTRACTION_MODEL,
    dtcgTokens,
    tokenItems,
    metadataItems,
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
      ${extracted.sourceHash},
      ${extracted.extractionModel},
      'ready',
      null,
      now()
    )
    returning id::text as id
  `;
  const tokenSetId = setRows[0].id;

  for (const token of extracted.tokenItems) {
    await sql`
      insert into design_token_items (
        token_set_id,
        document_id,
        token_path,
        token_name,
        token_type,
        token_value,
        description,
        extensions,
        source_excerpt,
        confidence
      )
      values (
        ${tokenSetId}::uuid,
        ${documentId}::uuid,
        ${token.tokenPath},
        ${token.tokenName},
        ${token.tokenType},
        ${JSON.stringify(token.tokenValue)}::jsonb,
        ${token.description || ""},
        ${JSON.stringify(token.extensions || {})}::jsonb,
        ${token.sourceExcerpt || ""},
        ${token.confidence}
      )
    `;
  }

  for (const item of extracted.metadataItems) {
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
      values (
        ${documentId}::uuid,
        ${tokenSetId}::uuid,
        ${item.category},
        ${item.key},
        ${item.value},
        ${item.sourceExcerpt || ""},
        ${item.confidence}
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

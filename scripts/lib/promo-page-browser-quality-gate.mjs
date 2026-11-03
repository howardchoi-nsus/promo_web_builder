import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const { validatePromoPageGenerationResult } = require("../../api/_promo-page-generation-contract");

export const PROMO_PAGE_VIEWPORTS = Object.freeze([
  Object.freeze({ key: "desktop", width: 1440, height: 1000 }),
  Object.freeze({ key: "mobile", width: 390, height: 844 }),
]);

function browserDocument({ html, css, language }) {
  const safeLanguage = String(language || "en").replace(/[^a-z0-9-]/gi, "") || "en";
  return `<!doctype html>
<html lang="${safeLanguage}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
    <style>
      html { color-scheme: light; background: #fff; }
      body { margin: 0; min-width: 0; background: #fff; }
      *, *::before, *::after { box-sizing: border-box; }
      ${css}
    </style>
  </head>
  <body>${html}</body>
</html>`;
}

function analysisScript({ requiredVisibleCopy, ctaUrl, viewport }) {
  const normalize = (value) => String(value || "").normalize("NFKC").replace(/\s+/g, " ").trim();
  const diagnostics = [];
  const add = (code, message, detail = {}) => diagnostics.push({ code, message, ...detail });
  const root = document.querySelector("main.promo-generated-page");
  if (!root) {
    add("ROOT_MISSING", "The generated promo root is missing");
    return { diagnostics, metrics: {} };
  }

  const parseColor = (value) => {
    const match = String(value || "").match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i);
    return match ? {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    } : null;
  };
  const composite = (front, back) => {
    const alpha = front.a + back.a * (1 - front.a);
    if (alpha <= 0) return { r: 255, g: 255, b: 255, a: 1 };
    return {
      r: (front.r * front.a + back.r * back.a * (1 - front.a)) / alpha,
      g: (front.g * front.a + back.g * back.a * (1 - front.a)) / alpha,
      b: (front.b * front.a + back.b * back.a * (1 - front.a)) / alpha,
      a: alpha,
    };
  };
  const luminance = (color) => {
    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  };
  const contrast = (foreground, background) => {
    const fg = composite(foreground, background);
    const lighter = Math.max(luminance(fg), luminance(background));
    const darker = Math.min(luminance(fg), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
  };
  const styleVisible = (element) => {
    for (let current = element; current; current = current.parentElement) {
      const style = getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return false;
      if (Number(style.opacity) <= 0.02) return false;
      if (current.getAttribute("aria-hidden") === "true" || current.hidden) return false;
    }
    return true;
  };
  const rectVisible = (element) => {
    const rects = [...element.getClientRects()];
    return rects.some((rect) => (
      rect.width > 0.5 && rect.height > 0.5 && rect.right > 0 && rect.left < viewport.width
      && rect.bottom > 0 && rect.top < Math.max(document.documentElement.scrollHeight, viewport.height)
    ));
  };
  const visible = (element) => styleVisible(element) && rectVisible(element);
  const allElements = [...root.querySelectorAll("*")];

  const required = [...new Set((Array.isArray(requiredVisibleCopy) ? requiredVisibleCopy : [])
    .map(normalize).filter(Boolean))];
  for (const copy of required) {
    const candidates = [root, ...allElements]
      .filter((element) => normalize(element.innerText).includes(copy))
      .sort((a, b) => normalize(a.innerText).length - normalize(b.innerText).length);
    const candidate = candidates.find(visible);
    if (!candidate) {
      add("VISIBLE_COPY_MISSING", "Required promotion copy is not visibly rendered", { copyLength: copy.length });
      continue;
    }
    const rect = candidate.getBoundingClientRect();
    if (rect.left < -1 || rect.right > viewport.width + 1) {
      add("VISIBLE_COPY_OFFSCREEN", "Required promotion copy is outside the horizontal viewport", { copyLength: copy.length });
    }
  }

  const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (documentWidth > viewport.width + 1) {
    add("HORIZONTAL_OVERFLOW", "The page creates horizontal scrolling", { documentWidth, viewportWidth: viewport.width });
  }

  let clippedCount = 0;
  for (const element of [root, ...allElements]) {
    if (!visible(element)) continue;
    const style = getComputedStyle(element);
    const clipsX = /hidden|clip/.test(style.overflowX);
    const clipsY = /hidden|clip/.test(style.overflowY);
    if ((clipsX && element.scrollWidth > element.clientWidth + 1)
      || (clipsY && element.scrollHeight > element.clientHeight + 1)) {
      clippedCount += 1;
      if (clippedCount <= 8) add("CONTENT_CLIPPED", "Visible content is clipped by an overflow boundary", {
        tag: element.tagName.toLowerCase(),
      });
    }
  }

  const requestedCta = normalize(ctaUrl);
  const cta = [...root.querySelectorAll("a[href]")].find((anchor) => normalize(anchor.getAttribute("href")) === requestedCta);
  if (!cta || !visible(cta)) {
    add("CTA_NOT_VISIBLE", "The supplied CTA is not visibly rendered");
  } else {
    const rect = cta.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      add("CTA_TARGET_TOO_SMALL", "The primary CTA target must be at least 44 by 44 CSS pixels", {
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
      });
    }
  }

  let contrastFailures = 0;
  const textElements = [root, ...allElements].filter((element) => (
    [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && normalize(node.nodeValue))
    && visible(element)
  ));
  for (const element of textElements) {
    const style = getComputedStyle(element);
    const foreground = parseColor(style.color);
    if (!foreground) {
      add("CONTRAST_UNVERIFIABLE", "Text color could not be resolved", { tag: element.tagName.toLowerCase() });
      continue;
    }
    let background = { r: 255, g: 255, b: 255, a: 1 };
    let backgroundImage = false;
    const layers = [];
    for (let current = element; current; current = current.parentElement) {
      const currentStyle = getComputedStyle(current);
      if (currentStyle.backgroundImage !== "none") backgroundImage = true;
      const parsed = parseColor(currentStyle.backgroundColor);
      if (parsed && parsed.a > 0) layers.push(parsed);
    }
    for (const layer of layers.reverse()) background = composite(layer, background);
    if (backgroundImage) {
      add("CONTRAST_UNVERIFIABLE", "Text over a background image or gradient cannot be approved automatically", {
        tag: element.tagName.toLowerCase(),
      });
      continue;
    }
    const ratio = contrast(foreground, background);
    const size = Number.parseFloat(style.fontSize) || 16;
    const weight = Number.parseInt(style.fontWeight, 10) || (style.fontWeight === "bold" ? 700 : 400);
    const threshold = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    if (ratio + 0.01 < threshold) {
      contrastFailures += 1;
      if (contrastFailures <= 8) add("TEXT_CONTRAST_LOW", "Visible text does not meet WCAG AA contrast", {
        ratio: Number(ratio.toFixed(2)),
        threshold,
        tag: element.tagName.toLowerCase(),
      });
    }
  }

  let activeMotionCount = 0;
  for (const element of [root, ...allElements]) {
    if (!visible(element)) continue;
    const style = getComputedStyle(element);
    const durations = `${style.animationDuration},${style.transitionDuration}`
      .split(",")
      .map((value) => Number.parseFloat(value) || 0);
    if (durations.some((duration) => duration > 0.01)) activeMotionCount += 1;
  }
  if (activeMotionCount) {
    add("REDUCED_MOTION_ACTIVE", "Motion remains active when reduced motion is requested", { count: activeMotionCount });
  }

  return {
    diagnostics,
    metrics: {
      documentWidth,
      documentHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      requiredCopyCount: required.length,
      visibleTextNodeCount: textElements.length,
      clippedCount,
      contrastFailures,
      activeMotionCount,
    },
  };
}

async function inspectFocusIndicator(page, ctaUrl) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  const expected = String(ctaUrl || "").trim();
  let focused = false;
  for (let index = 0; index < 64; index += 1) {
    await page.keyboard.press("Tab");
    focused = await page.evaluate((value) => {
      const active = document.activeElement;
      return active instanceof HTMLAnchorElement && active.getAttribute("href") === value;
    }, expected);
    if (focused) break;
  }
  if (!focused) return { code: "CTA_KEYBOARD_UNREACHABLE", message: "The primary CTA is not reachable by keyboard" };
  return page.evaluate(() => {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !active.matches(":focus-visible")) {
      return { code: "FOCUS_INDICATOR_MISSING", message: "The primary CTA does not enter a focus-visible state" };
    }
    const style = getComputedStyle(active);
    const outlineWidth = Number.parseFloat(style.outlineWidth) || 0;
    const hasOutline = style.outlineStyle !== "none" && outlineWidth >= 2;
    const hasShadow = style.boxShadow !== "none" && !/^rgba?\(0, 0, 0, 0\)/.test(style.boxShadow);
    if (!hasOutline && !hasShadow) {
      return { code: "FOCUS_INDICATOR_MISSING", message: "The primary CTA focus-visible style is not visibly distinguishable" };
    }
    return null;
  });
}

export async function evaluatePromoPageBrowserQuality(input, options = {}) {
  const context = input && typeof input === "object" ? input : {};
  const validated = validatePromoPageGenerationResult(context.generated, {
    requiredVisibleCopy: context.requiredVisibleCopy,
    ctaUrl: context.ctaUrl,
    allowedUrls: context.allowedUrls,
    locale: context.locale,
    market: context.market,
  });
  const ownsBrowser = !options.browser;
  const browser = options.browser || await chromium.launch({ headless: true });
  const results = {};
  try {
    for (const viewport of PROMO_PAGE_VIEWPORTS) {
      const browserContext = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: "reduce",
        colorScheme: "light",
      });
      try {
        await browserContext.route("**/*", (route) => route.abort());
        const page = await browserContext.newPage();
        page.setDefaultTimeout(Number(options.timeoutMs || 10_000));
        await page.setContent(browserDocument({
          ...validated.result,
          language: validated.documentLanguage,
        }), { waitUntil: "domcontentloaded", timeout: Number(options.timeoutMs || 10_000) });
        await page.evaluate(() => document.fonts?.ready);
        const inspected = await page.evaluate(analysisScript, {
          requiredVisibleCopy: context.requiredVisibleCopy,
          ctaUrl: context.ctaUrl,
          viewport,
        });
        const focusDiagnostic = await inspectFocusIndicator(page, context.ctaUrl);
        if (focusDiagnostic) inspected.diagnostics.push(focusDiagnostic);
        results[viewport.key] = {
          width: viewport.width,
          height: viewport.height,
          state: inspected.diagnostics.length ? "failed" : "passed",
          blockingCount: inspected.diagnostics.length,
          diagnostics: inspected.diagnostics,
          metrics: inspected.metrics,
        };
      } finally {
        await browserContext.close();
      }
    }
  } finally {
    if (ownsBrowser) await browser.close();
  }

  const blockingCount = Object.values(results)
    .reduce((sum, result) => sum + Number(result.blockingCount || 0), 0);
  return {
    validated,
    qualityGate: {
      contractVersion: 1,
      state: blockingCount ? "failed" : "passed",
      blockingCount,
      results,
    },
  };
}

export async function assertPromoPageBrowserQuality(input, options = {}) {
  const report = await evaluatePromoPageBrowserQuality(input, options);
  if (report.qualityGate.blockingCount) {
    throw Object.assign(new Error("Generated promo page failed the browser quality gate"), {
      statusCode: 422,
      code: "PAGE_BROWSER_QUALITY_FAILED",
      details: report.qualityGate,
    });
  }
  return report;
}

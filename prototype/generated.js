const storageKey = "promoPrototype.generatedPage";
const { createApp } = Vue;

function loadPayload() {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

function applyDesign(design) {
  if (!design) return;
  document.documentElement.style.setProperty("--primary", design.primaryColor);
  document.documentElement.style.setProperty("--cta", design.ctaColor);
  document.documentElement.style.setProperty("--canvas", design.canvasColor);
  document.documentElement.style.setProperty("--font-heading", design.headingFont);
  document.documentElement.style.setProperty("--font-body", design.bodyFont);
  document.documentElement.style.setProperty("--title-weight", design.titleWeight);
}

createApp({
  data() {
    return {
      payload: loadPayload(),
    };
  },

  mounted() {
    if (this.payload) applyDesign(this.payload.design);
  },
}).mount("#generatedApp");

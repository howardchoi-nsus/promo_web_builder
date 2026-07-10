const steps = [
  {
    title: "Design Concept Selection",
    copy: "Select the design concept that will guide the integrated brief, LO-FI draft, and final design generation.",
    cards: [
      ["Design MD", "Choose the source design document and concept."],
      ["Visual Mode", "Confirm standard or advanced visual generation mode."],
      ["Style Tokens", "Preserve key colors, layout intent, typography, and CTA treatment."],
    ],
  },
  {
    title: "Promo Content Input",
    copy: "Enter and review the promo content that must be preserved through coverage validation.",
    cards: [
      ["Required Copy", "Title, offer, supporting message, CTA, alpha text, and terms."],
      ["Market Context", "Market, audience, promotion purpose, and tone guidance."],
      ["Coverage Gate", "Required content must survive Integrated Brief compression."],
    ],
  },
  {
    title: "LO-FI Draft Selection",
    copy: "Generate LO-FI drafts from the validated Integrated Brief, then select the draft to finalize.",
    cards: [
      ["Integrated Brief", "Queue, poll, and inspect the source-of-truth brief."],
      ["Draft Images", "Review draft attempts and image proxy output."],
      ["Confirm Draft", "Lock one LO-FI draft before final generation."],
    ],
  },
  {
    title: "Final Design Result",
    copy: "Generate the final design from the confirmed LO-FI draft and inspect the resulting asset.",
    cards: [
      ["Final Worker", "Trigger final_design generation for the selected draft."],
      ["Result Preview", "Display the final image and generation metadata."],
      ["Resume", "Reload by runId without losing generation state."],
    ],
  },
];

let currentStep = 0;

const stepButtons = Array.from(document.querySelectorAll(".step"));
const title = document.getElementById("step-title");
const copy = document.getElementById("step-copy");
const eyebrow = document.getElementById("step-eyebrow");
const placeholders = document.getElementById("step-placeholders");
const status = document.getElementById("step-status");
const prev = document.getElementById("prev-step");
const next = document.getElementById("next-step");

function renderStep() {
  const step = steps[currentStep];
  title.textContent = step.title;
  copy.textContent = step.copy;
  eyebrow.textContent = `Step ${currentStep + 1}`;
  status.textContent = `Step ${currentStep + 1} / ${steps.length}`;
  prev.disabled = currentStep === 0;
  next.disabled = currentStep === steps.length - 1;

  stepButtons.forEach((button, index) => {
    button.classList.toggle("is-active", index === currentStep);
  });

  placeholders.innerHTML = "";
  step.cards.forEach(([cardTitle, cardCopy]) => {
    const card = document.createElement("article");
    card.className = "placeholder-card";

    const heading = document.createElement("strong");
    heading.textContent = cardTitle;

    const body = document.createElement("span");
    body.textContent = cardCopy;

    card.append(heading, body);
    placeholders.append(card);
  });
}

stepButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    currentStep = index;
    renderStep();
  });
});

prev.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  renderStep();
});

next.addEventListener("click", () => {
  currentStep = Math.min(steps.length - 1, currentStep + 1);
  renderStep();
});

renderStep();

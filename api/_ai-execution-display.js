const PROVIDER_LABELS = Object.freeze({
  openai: { label: "OpenAI", iconKey: "openai" },
  google: { label: "Google", iconKey: "google" },
  anthropic: { label: "Anthropic", iconKey: "anthropic" },
});

function toAiExecutionDisplay(promptConfig = {}) {
  const providerKey = String(promptConfig.provider || "").trim().toLowerCase();
  const model = String(promptConfig.model || "").trim();
  if (!providerKey && !model) return null;
  const provider = PROVIDER_LABELS[providerKey] || {
    label: providerKey ? providerKey.charAt(0).toUpperCase() + providerKey.slice(1) : "AI",
    iconKey: "generic",
  };
  return {
    providerKey,
    providerLabel: provider.label,
    providerIconKey: provider.iconKey,
    model,
    modelLabel: model || "Configured model",
  };
}

module.exports = { toAiExecutionDisplay };

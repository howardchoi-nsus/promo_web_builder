const { getSql, parseBody } = require("./_prompt-template-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const type = String(body.type || body.promptType || body.prompt_type || "").trim();
    const variables = body.variables && typeof body.variables === "object" ? body.variables : {};
    if (!type) return res.status(400).json({ error: "type is required" });

    const snapshot = await createPromptExecutionSnapshot(getSql(), type, variables);
    const prompt = snapshot.promptConfig;

    return res.status(200).json({
      ok: true,
      promptId: prompt.promptId,
      promptType: prompt.promptType,
      promptName: prompt.promptName,
      promptVersion: prompt.promptVersion,
      promptStatus: "active",
      provider: prompt.provider,
      model: prompt.model,
      modelOptions: prompt.modelOptions,
      renderedPrompt: prompt.renderedPrompt,
      renderedPromptHash: prompt.renderedPromptHash,
      variableHash: prompt.variableHash,
      promptLayerSources: prompt.promptLayerSources || [],
      promptMeta: {
        id: prompt.promptId,
        type: prompt.promptType,
        name: prompt.promptName,
        version: prompt.promptVersion,
        status: "active",
        provider: prompt.provider,
        model: prompt.model,
        modelOptions: prompt.modelOptions,
        renderedPromptHash: prompt.renderedPromptHash,
        variableHash: prompt.variableHash,
        promptLayerSources: prompt.promptLayerSources || [],
        ...(prompt.lengthGuard ? { lengthGuard: prompt.lengthGuard } : {}),
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt render failed",
      message: error.message,
    });
  }
};

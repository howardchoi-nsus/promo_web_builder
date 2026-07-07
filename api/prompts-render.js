const {
  ensureDefaultPromptTemplates,
  getSql,
  parseBody,
  renderPrompt,
  sha256,
  toPromptTemplate,
  unresolvedVariables,
} = require("./_prompt-template-store");

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

    const sql = getSql();
    await ensureDefaultPromptTemplates(sql);
    const rows = await sql`
      select
        id::text,
        type,
        name,
        body,
        status,
        version,
        required_variables,
        optional_variables,
        change_note,
        archived_at,
        created_at,
        updated_at
      from prompt_templates
      where type = ${type}
        and status = 'active'
      limit 1
    `;

    if (!rows.length) return res.status(404).json({ error: "Active prompt template not found", type });

    const prompt = toPromptTemplate(rows[0]);
    const missingRequired = prompt.requiredVariables.filter((key) => {
      const value = variables[key];
      return value === null || value === undefined || String(value).trim() === "";
    });
    if (missingRequired.length) {
      return res.status(400).json({
        error: "Required prompt variables are missing",
        missingVariables: missingRequired,
      });
    }

    const renderedPrompt = renderPrompt(prompt.body, variables);
    const unresolved = unresolvedVariables(renderedPrompt);
    if (unresolved.length) {
      return res.status(400).json({
        error: "Rendered prompt contains unresolved variables",
        unresolvedVariables: unresolved,
      });
    }

    const renderedPromptHash = sha256(renderedPrompt);
    const variableHash = sha256(JSON.stringify(variables));

    return res.status(200).json({
      ok: true,
      promptId: prompt.id,
      promptType: prompt.type,
      promptName: prompt.name,
      promptVersion: prompt.version,
      promptStatus: prompt.status,
      renderedPrompt,
      renderedPromptHash,
      variableHash,
      promptMeta: {
        id: prompt.id,
        type: prompt.type,
        name: prompt.name,
        version: prompt.version,
        status: prompt.status,
        renderedPromptHash,
        variableHash,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt render failed",
      message: error.message,
    });
  }
};

const {
  ensureDefaultPromptTemplates,
  getSql,
  toPromptTemplate,
} = require("./_prompt-template-store");

// Listing always ensures repository defaults exist first so a fresh database can
// open the Admin Page without a separate migration/seed command.
module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getSql();
    await ensureDefaultPromptTemplates(sql);

    const includeArchived = String(req.query.includeArchived || "").toLowerCase() === "true";
    const type = String(req.query.type || "").trim();
    const rows = type
      ? await sql`
        select
          id::text,
          type,
          name,
          body,
          status,
          version,
          required_variables,
          optional_variables,
          provider,
          model,
          temperature,
          max_tokens,
          response_format,
          model_options,
          change_note,
          archived_at,
          created_at,
          updated_at
        from prompt_templates
        where type = ${type}
          and (${includeArchived}::boolean or status <> 'archived')
        order by
          case status when 'active' then 0 when 'draft' then 1 when 'inactive' then 2 else 3 end,
          updated_at desc
      `
      : await sql`
        select
          id::text,
          type,
          name,
          body,
          status,
          version,
          required_variables,
          optional_variables,
          provider,
          model,
          temperature,
          max_tokens,
          response_format,
          model_options,
          change_note,
          archived_at,
          created_at,
          updated_at
        from prompt_templates
        where ${includeArchived}::boolean or status <> 'archived'
        order by
          type asc,
          case status when 'active' then 0 when 'draft' then 1 when 'inactive' then 2 else 3 end,
          updated_at desc
      `;

    return res.status(200).json({
      ok: true,
      prompts: rows.map(toPromptTemplate),
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Prompt templates API failed",
      message: error.message,
    });
  }
};

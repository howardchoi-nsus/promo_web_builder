const {
  draftSummary,
  getSql,
  loadRunState,
  parseBody,
} = require("./_promo-generation-run-store");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = parseBody(req.body);
    const draftId = String(body.draftId || body.draft_id || body.id || "").trim();
    if (!draftId) return res.status(400).json({ error: "draftId is required" });

    const sql = getSql();
    const draftRows = await sql`
      select id::text, run_id::text, status
      from promo_generation_lofi_drafts
      where id = ${draftId}::uuid
      limit 1
    `;
    if (!draftRows.length) return res.status(404).json({ error: "LO-FI draft not found" });
    if (!["ready", "completed"].includes(String(draftRows[0].status || "")) && !body.force) {
      return res.status(409).json({
        error: "LO-FI draft is not ready",
        message: "Only a ready draft can be confirmed.",
      });
    }

    await sql`
      update promo_generation_lofi_drafts
      set confirmed_at = null, updated_at = now()
      where run_id = ${draftRows[0].run_id}::uuid
    `;

    const confirmedRows = await sql`
      update promo_generation_lofi_drafts
      set confirmed_at = now(), updated_at = now()
      where id = ${draftId}::uuid
      returning
        id::text,
        run_id::text,
        draft_attempt,
        status,
        draft_image_url,
        draft_prompt,
        prompt_meta,
        model_meta,
        error_message,
        confirmed_at,
        created_at,
        updated_at
    `;

    await sql`
      update promo_generation_runs
      set status = 'lofi_draft_confirmed', stage = 'draft_confirmed', error_message = '', updated_at = now()
      where id = ${draftRows[0].run_id}::uuid
    `;

    const state = await loadRunState(sql, draftRows[0].run_id);
    return res.status(200).json({
      ok: true,
      confirmedDraft: draftSummary(confirmedRows[0]),
      state,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "LO-FI draft confirmation failed",
      message: error.message,
    });
  }
};

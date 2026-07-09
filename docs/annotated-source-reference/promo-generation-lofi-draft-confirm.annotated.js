// ============================================================================
// 참고용 주석 추가 사본 (READ-ONLY REFERENCE COPY)
// 원본: api/promo-generation-lofi-draft-confirm.js
// 이 파일은 원본 소스코드를 수정하지 않고, 이해를 돕기 위해 "왜"를 설명하는
// 주석만 추가한 사본입니다. 실제 로직은 원본과 한 글자도 다르지 않습니다.
// 배포/빌드에 사용하지 마세요 — 원본 파일을 계속 사용해야 합니다.
// ============================================================================

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
    // Only a generated (ready/completed) draft can be confirmed by default.
    // `force` exists for manual/QA recovery when a draft's status field is stuck
    // but the operator can see the image is actually usable.
    if (!["ready", "completed"].includes(String(draftRows[0].status || "")) && !body.force) {
      return res.status(409).json({
        error: "LO-FI draft is not ready",
        message: "Only a ready draft can be confirmed.",
      });
    }

    // Single-confirmed-draft invariant: reset every draft under this run to
    // "not confirmed" first, then set only the target draft. This keeps
    // "confirmed_at" itself the single source of truth for which attempt is
    // active, instead of tracking a separate confirmedDraftId column that could
    // drift out of sync with the per-draft flag.
    // Note: these are two separate statements, not one transaction, so there is
    // a small race window under concurrent confirms for the same run — low risk
    // given this is a single-operator admin flow, but worth wrapping in an
    // explicit sql.transaction() if multi-user confirmation becomes a real case.
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

    // Advancing run.status here is what unlocks the "Generate Final Design"
    // action in the UI — Final Design Worker requires a confirmed draft to exist
    // before it will run (see product-direction-and-gap-review.md).
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

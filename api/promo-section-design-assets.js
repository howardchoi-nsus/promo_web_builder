const { getSql } = require("./_promo-section-design-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  try {
    const runId = String(req.query.runId || "").trim();
    if (!runId) return res.status(400).json({ error: "runId is required" });
    const rows = await getSql()`
      select id::text, run_id::text, target_type, target_item_key, status, request_snapshot,
        component_instance_id::text, target_field_key,
        result_snapshot, current_attempt, max_attempts, lease_expires_at, next_retry_at,
        storage_key, applied_at, superseded_at,
        error_code, error_message, created_at, updated_at, completed_at
      from promo_section_design_asset_jobs where run_id = ${runId}::uuid order by created_at
    `;
    const now = Date.now();
    return res.status(200).json({ ok: true, assets: rows.map((row) => {
      const isStale = row.status === "processing"
        && row.lease_expires_at
        && new Date(row.lease_expires_at).getTime() <= now;
      const retryAfterMs = row.next_retry_at
        ? Math.max(0, new Date(row.next_retry_at).getTime() - now)
        : 0;
      const currentAttempt = Number(row.current_attempt);
      const maxAttempts = Number(row.max_attempts);
      return {
        id: row.id, runId: row.run_id, targetType: row.target_type, targetItemKey: row.target_item_key || null,
        componentInstanceId: row.component_instance_id || null, targetFieldKey: row.target_field_key || null,
        status: row.status, request: row.request_snapshot || {}, result: row.result_snapshot || null,
        currentAttempt, maxAttempts, isStale: Boolean(isStale),
        canRetry: currentAttempt < maxAttempts && (row.status === "failed" || Boolean(isStale)),
        retryAfterMs, leaseExpiresAt: row.lease_expires_at || null, nextRetryAt: row.next_retry_at || null,
        storageKey: row.storage_key || "", appliedAt: row.applied_at || null, supersededAt: row.superseded_at || null,
        errorCode: row.error_code || "", errorMessage: row.error_message || "",
        createdAt: row.created_at, updatedAt: row.updated_at, completedAt: row.completed_at,
      };
    }) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section design assets lookup failed", message: error.message });
  }
};

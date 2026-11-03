const { queueIntegratedBrief } = require("./promo-generation-integrated-brief");
const { stableJson, sha256 } = require("./_promo-service-v3-store");

function captureResponse() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(name, value) { this.headers[String(name).toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { return this; },
  };
}

async function startGenerationJobV3(sql, { job, inputSnapshot, req }) {
  const runKey = `service-v3-${job.jobId}`;
  const promo = inputSnapshot?.promo || {};
  const md = inputSnapshot?.md || {};
  const rows = await sql`
    insert into promo_generation_runs (
      run_key, promo_title, selected_md_id, selected_md_name, status, stage,
      input_hash, input_snapshot, metadata, updated_at
    ) values (
      ${runKey}, ${promo.title || ""}, ${md.id || ""}, ${md.brand || md.name || ""},
      'accepted', 'created', ${sha256(stableJson(inputSnapshot))},
      ${JSON.stringify(inputSnapshot || {})}::jsonb,
      ${JSON.stringify({ contractVersion: 3, serviceJobId: job.jobId, requestId: job.requestId, pipeline: job.pipeline })}::jsonb,
      now()
    )
    on conflict (run_key) do update set updated_at = promo_generation_runs.updated_at
    returning id::text, run_key
  `;
  const legacyRun = rows[0];
  await sql`
    update llm_runtime.generation_jobs
    set legacy_run_id = ${legacyRun.id}, status = 'queued', updated_at = now()
    where id = ${job.jobId}::uuid
  `;

  const stageResponse = captureResponse();
  await queueIntegratedBrief({
    method: "POST",
    headers: req?.headers || {},
    body: {
      runId: legacyRun.id,
      pipelineVersion: "v2",
      triggerWorker: true,
    },
  }, stageResponse);

  if (stageResponse.statusCode >= 400) {
    const message = stageResponse.body?.message || stageResponse.body?.error || "Worker trigger failed";
    await sql`
      update llm_runtime.generation_jobs
      set status = 'failed', error_json = ${JSON.stringify({ code: "WORKER_TRIGGER_FAILED", message })}::jsonb,
        updated_at = now()
      where id = ${job.jobId}::uuid
    `;
    return { ok: false, statusCode: stageResponse.statusCode, legacyRunId: legacyRun.id, error: message };
  }

  await sql`
    insert into llm_runtime.domain_outbox (
      event_type, producer, correlation_id, aggregate_type, aggregate_id, aggregate_version, payload
    ) values (
      'GenerationStarted', 'llm-harnessing', ${job.requestId}, 'GenerationJob', ${job.jobId}, 1,
      ${JSON.stringify({ jobId: job.jobId, legacyRunId: legacyRun.id, pipeline: job.pipeline })}::jsonb
    )
  `;
  return { ok: true, statusCode: stageResponse.statusCode, legacyRunId: legacyRun.id, stage: stageResponse.body };
}

module.exports = { startGenerationJobV3 };

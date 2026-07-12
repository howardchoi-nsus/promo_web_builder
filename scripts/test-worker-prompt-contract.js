const assert = require("node:assert/strict");
const {
  createPromptExecutionSnapshot,
  validateStageModelConfig,
} = require("../api/_prompt-execution-snapshot");
const {
  FINAL_DESIGN_PROMPT_MAX_LENGTH,
  fitFinalDesignPromptVariables,
} = require("../api/_final-design-prompt-budget");
const { renderPrompt } = require("../api/_prompt-template-store");
const {
  normalizeExecutionModelOptions,
  workerExecutionSummary,
} = require("../api/_worker-execution-contract");

async function main() {
  validateStageModelConfig("integrated_brief", {
    provider: "openai",
    model: "gpt-4o-mini",
    responseFormat: "json_object",
  });
  validateStageModelConfig("lofi_draft", {
    provider: "openai",
    model: "gpt-image-1",
    responseFormat: "image",
  });
  assert.throws(() => validateStageModelConfig("lofi_draft", {
    provider: "google",
    model: "gemini-3.1-flash-image",
    responseFormat: "image",
  }), /openai provider only/);
  validateStageModelConfig("final_design", {
    provider: "openai",
    model: "gpt-image-1",
    responseFormat: "image",
  });
  assert.throws(() => validateStageModelConfig("final_design", {
    provider: "google",
    model: "gemini-3.1-flash-image",
    responseFormat: "image",
  }), /openai provider only/);

  const sql = async (strings) => {
    const query = strings.join("?");
    if (query.includes("select id::text") && !query.includes("name,")) return [{ id: "existing" }];
    if (query.includes("from prompt_templates") && query.includes("required_variables")) {
      return [{
        id: "00000000-0000-0000-0000-000000000014",
        type: "final_design",
        name: "Final Design Generation",
        body: "Brief={{integratedDesignBriefMarkdown}}\nImage={{confirmedDraftImageProxyUrl}}\nPolicy={{layoutFidelityPolicy}}",
        status: "active",
        version: 1,
        required_variables: ["integratedDesignBriefMarkdown", "confirmedDraftImageProxyUrl"],
        optional_variables: ["layoutFidelityPolicy"],
        provider: "openai",
        model: "gpt-image-1",
        temperature: null,
        max_tokens: null,
        response_format: "image",
        model_options: { inputFidelity: "high" },
      }];
    }
    return [];
  };

  const snapshot = await createPromptExecutionSnapshot(sql, "final_design", {
    integratedDesignBriefMarkdown: "# Integrated Brief",
    confirmedDraftImageProxyUrl: "https://example.com/api/draft-image?id=1",
    layoutFidelityPolicy: JSON.stringify({ preserveSectionOrder: true }),
  });
  assert.equal(snapshot.promptConfig.promptType, "final_design");
  assert.equal(snapshot.promptConfig.provider, "openai");
  assert.equal(snapshot.promptConfig.modelOptions.inputFidelity, "high");
  assert.match(snapshot.promptConfig.renderedPrompt, /preserveSectionOrder/);
  assert.match(snapshot.promptConfig.renderedPromptHash, /^[0-9a-f]{64}$/);
  const execution = workerExecutionSummary(snapshot);
  assert.equal(execution.snapshotVersion, 2);
  assert.equal(execution.renderedPrompt, snapshot.promptConfig.renderedPrompt);
  assert.equal(execution.renderedPromptHash, snapshot.promptConfig.renderedPromptHash);
  assert.equal(execution.model, "gpt-image-1");
  assert.equal(execution.modelOptions.inputFidelity, "high");
  assert.deepEqual(
    normalizeExecutionModelOptions({ provider: "openai", model: "gpt-image-1", input_fidelity: "low", output_format: "png" }),
    { inputFidelity: "low", outputFormat: "png" }
  );

  const oversized = fitFinalDesignPromptVariables(
    "Brief={{integratedDesignBriefMarkdown}}\nMapping={{sectionContentMapping}}\nPolicy={{layoutFidelityPolicy}}",
    {
      integratedDesignBriefMarkdown: `HEAD-${"A".repeat(35000)}-TAIL`,
      sectionContentMapping: "B".repeat(8000),
      layoutFidelityPolicy: "preserveSectionOrder=true",
    },
    renderPrompt
  );
  assert.ok(oversized.renderedPrompt.length <= FINAL_DESIGN_PROMPT_MAX_LENGTH);
  assert.equal(oversized.lengthGuard.compacted, true);
  assert.ok(oversized.lengthGuard.originalLength > 32000);
  assert.match(oversized.renderedPrompt, /HEAD-/);
  assert.match(oversized.renderedPrompt, /-TAIL/);
  assert.match(oversized.renderedPrompt, /preserveSectionOrder=true/);

  console.log("Worker prompt contract test passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

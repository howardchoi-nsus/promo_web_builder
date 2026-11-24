import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { designFixture, png } from './fixtures/design-preview-enhancements.mjs';

const require = createRequire(import.meta.url);
const { promptVariableContract, validatePromptTemplateContract, renderPrompt, unresolvedVariables } = require('../api/_prompt-template-store');
const { assembleEffectivePrompt } = require('../api/_prompt-assembler');
const { snapshotForPage, structureFingerprint } = require('../api/_page-schema-service');
const { pageImagePromptContext } = require('../api/_page-image-prompt-context');
const { processPageMedia } = require('../api/_page-schema-media-service');
const packRoot = new URL('../docs/mouse-swarm-builder/layout-image-phase1/', import.meta.url);
const pack = JSON.parse(readFileSync(new URL('manifest.json', packRoot), 'utf8'));
const bodies = new Map();
for (const entry of pack.prompts) {
  const body = readFileSync(new URL(entry.file, packRoot), 'utf8');
  const contract = promptVariableContract(entry.type);
  const checked = validatePromptTemplateContract(entry.type, { body, ...contract });
  const samples = Object.fromEntries([...contract.requiredVariables, ...contract.optionalVariables].map(name => [name, `[sample:${name}]`]));
  const assembled = assembleEffectivePrompt({ type: entry.type, renderedBody: renderPrompt(body, samples), variables: samples });
  assert.deepEqual(unresolvedVariables(assembled.renderedPrompt), []);
  assert.ok(assembled.renderedPrompt.length < 250000);
  assert.deepEqual(new Set(checked.placeholders), new Set([...contract.requiredVariables, ...contract.optionalVariables]));
  bodies.set(entry.type, body);
}

for (const presentation of ['background', 'content']) {
  const { page, context } = designFixture();
  page.root.children.at(-1).presentation = presentation;
  context.designBrief = {
    requestText: 'GGPoker-inspired material finish; preserve the supplied campaign subject and palette',
    artDirection: { composition: { hero: 'split' }, keyVisualDirection: { copySafeArea: 'left' } },
  };
  let snapshot = snapshotForPage(page, context), revision = 1, modelCalls = 0, promptCalls = 0;
  snapshot.generationMeta.review = { state: 'approved' };
  const original = structuredClone(snapshot), originalStructure = structureFingerprint(page);
  const helperInput = structuredClone(snapshot);
  const promptContext = pageImagePromptContext(snapshot, page.mediaRequests[0], { purpose: 'component-image' });
  assert.deepEqual(snapshot, helperInput, 'Context assembly must not change the page or token library');
  assert.equal(promptContext.backgroundColor, context.tokenValues[context.usagePolicy.bindings['page.background']]);
  assert.equal(promptContext.visualReference.referenceImageCount, 0);
  assert.equal(promptContext.visualReference.websiteInspected, false);
  const deps = {
    assertReady: async () => {}, assertRequirements: async () => {},
    fetchDocument: async () => ({ document: { id: 'document', currentDocumentRevision: revision }, snapshot }),
    createPromptExecutionSnapshot: async (_, type, variables) => {
      promptCalls++;
      const content = JSON.parse(variables.contentJson);
      assert.equal(type, presentation === 'background' ? 'section_background_image' : 'component_image');
      assert.equal(content.target.nodeId, 'design_image');
      assert.equal(content.visualReference.mode, 'written-art-direction');
      assert.equal(content.visualReference.scope, 'visual-craft');
      assert.deepEqual(content.brandPalette, promptContext.brandPalette);
      assert.deepEqual(content.designBrief, context.designBrief);
      assert.deepEqual(content.sourceIds, original.content.pageSchema.mediaRequests[0].sourceIds);
      assert.equal(content.aspectRatio, '16:9');
      return { promptConfig: {
        promptId: 'registered-prompt', promptVersion: 8, provider: 'google', model: 'registered-image-model',
        modelOptions: { unchanged: true }, renderedPrompt: renderPrompt(bodies.get(type), variables),
      } };
    },
    acquireGeneration: async (_, input) => ({ ...input, claimToken: 'claim' }),
    failGeneration: async () => {},
    generateSectionImage: async input => {
      modelCalls++;
      assert.equal(input.model, 'registered-image-model');
      assert.deepEqual(input.modelOptions, { unchanged: true });
      assert.equal(input.aspectRatio, '16:9');
      assert.ok(input.prompt.includes('GGPOKER-INSPIRED VISUAL CRAFT'));
      assert.ok(input.prompt.includes('"referenceImageCount":0'));
      assert.ok(input.prompt.includes('"paletteSource":"registered-page-policy"'));
      assert.equal(input.referenceImages, undefined);
      return { bytes: png, mimeType: 'image/png', width: 1, height: 1 };
    },
    blob: async () => ({ put: async () => ({ url: 'https://blob.example/image', pathname: 'image' }), del: async () => {} }),
    createDocumentRevision: async (_, input) => { snapshot = input.snapshot; return { revision: ++revision, snapshot }; },
  };
  const invoke = async () => {
    let status, payload;
    await processPageMedia({ req: { method: 'POST' }, res: { status(value) { status = value; return this; }, json(value) { payload = value; return this; } },
      sql: async () => [], owner: { ownerSubject: 'owner' }, body: { documentId: 'document', baseDocumentRevision: revision, nodeId: 'design_image', requestId: 'design_request' } }, deps);
    return { status, payload };
  };
  assert.equal((await invoke()).status, 200);
  assert.equal(modelCalls, 1);
  assert.equal(structureFingerprint(snapshot.content.pageSchema), originalStructure);
  assert.deepEqual(snapshot.content.pageContext.tokenValues, original.content.pageContext.tokenValues);
  assert.deepEqual(snapshot.content.pageContext.tokenCatalog, original.content.pageContext.tokenCatalog);
  assert.deepEqual(snapshot.content.pageContext.usagePolicy, original.content.pageContext.usagePolicy);
  const binding = snapshot.generationMeta.mediaBindings.design_image;
  assert.equal(binding.execution.referenceInput.profileKey, 'ggpoker-promotional-craft-v1');
  assert.equal(binding.execution.referenceInput.referenceImageCount, 0);
  assert.equal(snapshot.content.pageSchema.mediaRequests.length, 0);
  assert.equal((await invoke()).payload.replayed, true);
  assert.equal(modelCalls, 1); assert.equal(promptCalls, 1);
}
console.log('Layout/image guidance: five existing variable contracts and assembly; real background/component media handlers receive written-reference evidence, registered palette/target/brief and managed prompts; saved provenance, immutable tree/tokens and no duplicate calls on replay passed. Actual image providers not called.');

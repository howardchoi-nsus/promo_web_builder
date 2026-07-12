(.name = "Promo Final Design Worker backup-2026-07-11")
| (.active = false)
| (.nodes[] | select(.name == "Normalize Final Design Payload") | .parameters.assignments.assignments) += [
  {"id":"fd-confirmed-draft-proxy","name":"confirmedDraftImageProxyUrl","value":"={{ $json.body.confirmedDraft.draftImageProxyUrl }}","type":"string"},
  {"id":"fd-confirmed-draft-prompt","name":"confirmedDraftPrompt","value":"={{ $json.body.confirmedDraft.draftPrompt || '' }}","type":"string"},
  {"id":"fd-layout-policy","name":"layoutFidelityPolicy","value":"={{ $json.body.layoutFidelityPolicy || {} }}","type":"object"},
  {"id":"fd-provider","name":"provider","value":"={{ $json.body.execution.provider || 'openai' }}","type":"string"},
  {"id":"fd-model","name":"model","value":"={{ $json.body.execution.model || 'gpt-image-1' }}","type":"string"},
  {"id":"fd-model-options","name":"modelOptions","value":"={{ $json.body.execution.modelOptions || {} }}","type":"object"}
]
| (.nodes[] | select(.name == "Render Final Design Prompt") | .parameters.bodyParameters.parameters[0].value) = "final_design"
| (.nodes[] | select(.name == "Render Final Design Prompt") | .parameters.bodyParameters.parameters[1].value) = "={{ { integratedDesignBriefMarkdown: $json.integratedBrief.integratedBriefMarkdown, confirmedDraftPrompt: $('Normalize Final Design Payload').item.json.confirmedDraftPrompt, confirmedDraftImageProxyUrl: $('Normalize Final Design Payload').item.json.confirmedDraftImageProxyUrl, layoutFidelityPolicy: JSON.stringify($('Normalize Final Design Payload').item.json.layoutFidelityPolicy, null, 2), sectionContentMapping: JSON.stringify($json.integratedBrief.integratedBriefJson.sectionContentMapping || $json.integratedBrief.integratedBriefJson.finalImagePromptInputs?.contentCoverage || {}, null, 2) } }}"
| (.nodes[] | select(.name == "Generate Final Design Image") | .parameters.url) = "https://api.openai.com/v1/images/edits"
| (.nodes[] | select(.name == "Generate Final Design Image") | .parameters.headerParameters.parameters) |= map(select(.name != "Content-Type"))
| (.nodes[] | select(.name == "Generate Final Design Image") | .parameters.contentType) = "multipart-form-data"
| (.nodes[] | select(.name == "Generate Final Design Image") | .parameters.bodyParameters.parameters) = [
  {"parameterType":"formBinaryData","name":"image","inputDataFieldName":"data"},
  {"name":"model","value":"={{ $('Normalize Final Design Payload').item.json.model || 'gpt-image-1' }}"},
  {"name":"prompt","value":"={{ $('Render Final Design Prompt').item.json.renderedPrompt }}"},
  {"name":"input_fidelity","value":"={{ $('Normalize Final Design Payload').item.json.modelOptions.input_fidelity || 'high' }}"},
  {"name":"quality","value":"={{ $('Normalize Final Design Payload').item.json.modelOptions.quality || 'high' }}"},
  {"name":"size","value":"={{ $('Normalize Final Design Payload').item.json.modelOptions.size || '1024x1536' }}"},
  {"name":"n","value":"={{ 1 }}"}
]
| (.nodes[] | select(.name == "Generate Final Design Image") | .retryOnFail) = true
| (.nodes[] | select(.name == "Generate Final Design Image") | .maxTries) = 2
| (.nodes[] | select(.name == "Generate Final Design Image") | .waitBetweenTries) = 1000
| (.nodes[] | select(.name == "Generate Final Design Image") | .onError) = "continueRegularOutput"
| (.nodes[] | select(.name == "Check Final Image Base64") | .parameters.assignments.assignments) = [
  {"id":"fd-base64-length","name":"base64Length","value":"={{ ($json.data?.[0]?.b64_json || '').length }}","type":"number"},
  {"id":"fd-has-base64","name":"hasBase64","value":"={{ Boolean($json.data?.[0]?.b64_json) }}","type":"boolean"},
  {"id":"fd-final-image-base64","name":"finalImageBase64","value":"={{ $json.data?.[0]?.b64_json || '' }}","type":"string"},
  {"id":"fd-generation-error","name":"generationError","value":"={{ $json.error?.message || $json.message || ($json.data?.[0]?.b64_json ? '' : 'OpenAI image edit returned no image') }}","type":"string"}
]
| (.nodes[] | select(.name == "Save Final Design Result") | .parameters.bodyParameters.parameters) = [
  {"name":"finalDesignId","value":"={{ $('Normalize Final Design Payload').item.json.finalDesignId }}"},
  {"name":"status","value":"={{ $('Check Final Image Base64').item.json.hasBase64 ? 'ready' : 'failed' }}"},
  {"name":"errorMessage","value":"={{ $('Check Final Image Base64').item.json.generationError }}"},
  {"name":"finalImageBase64","value":"={{ $('Check Final Image Base64').item.json.finalImageBase64 }}"},
  {"name":"finalPrompt","value":"={{ $('Render Final Design Prompt').item.json.renderedPrompt }}"},
  {"name":"promptMeta","value":"={{ $('Render Final Design Prompt').item.json.promptMeta }}"},
  {"name":"modelMeta","value":"={{ { provider: $('Normalize Final Design Payload').item.json.provider, model: $('Normalize Final Design Payload').item.json.model, inputFidelity: $('Normalize Final Design Payload').item.json.modelOptions.input_fidelity || 'high', referenceMode: 'image_edit' } }}"}
]
| .nodes += [{
  "parameters": {
    "url": "={{ $('Normalize Final Design Payload').item.json.confirmedDraftImageProxyUrl }}",
    "options": {"response":{"response":{"responseFormat":"file","outputPropertyName":"data"}}}
  },
  "id": "fd-download-confirmed-lofi",
  "name": "Download Confirmed LO-FI Image",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.4,
  "position": [704, 176],
  "retryOnFail": true,
  "maxTries": 2,
  "waitBetweenTries": 1000,
  "onError": "continueRegularOutput"
}]
| (.nodes[] | select(.name == "Generate Final Design Image") | .position) = [928,176]
| (.nodes[] | select(.name == "Check Final Image Base64") | .position) = [1152,176]
| (.nodes[] | select(.name == "Save Final Design Result") | .position) = [1376,176]
| .connections["Render Final Design Prompt"].main[0][0].node = "Download Confirmed LO-FI Image"
| .connections["Download Confirmed LO-FI Image"] = {"main":[[{"node":"Generate Final Design Image","type":"main","index":0}]]}
| del(.id, .versionId, .createdAt, .updatedAt, .shared, .tags, .meta, .pinData)

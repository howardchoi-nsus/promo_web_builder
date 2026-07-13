(.name = "Promo Lo-Fi Draft Worker admin-driven")
| (.active = false)
| (.nodes[] | select(.name == "Normalize Draft Payload") | .parameters.assignments.assignments) += [
  {"id":"ld-provider","name":"provider","value":"={{ $json.body.execution.provider || 'openai' }}","type":"string"},
  {"id":"ld-model","name":"model","value":"={{ $json.body.execution.model || 'gpt-image-1' }}","type":"string"},
  {"id":"ld-model-options","name":"modelOptions","value":"={{ $json.body.execution.modelOptions || {} }}","type":"object"},
  {"id":"ld-rendered-prompt","name":"renderedPrompt","value":"={{ $json.body.execution.renderedPrompt || '' }}","type":"string"},
  {"id":"ld-prompt-version","name":"promptVersion","value":"={{ $json.body.execution.promptVersion || null }}","type":"number"},
  {"id":"ld-rendered-prompt-hash","name":"renderedPromptHash","value":"={{ $json.body.execution.renderedPromptHash || '' }}","type":"string"}
]
| (.nodes[] | select(.name == "Generate LO-FI Draft Image") | .parameters.headerParameters.parameters) |= map(if .name == "Authorization" then .value = "Bearer __RETAIN_EXISTING_N8N_KEY__" else . end)
| (.nodes[] | select(.name == "Generate LO-FI Draft Image") | .parameters.bodyParameters.parameters) = [
  {"name":"model","value":"={{ $('Normalize Draft Payload').item.json.model }}"},
  {"name":"prompt","value":"={{ String($('Normalize Draft Payload').item.json.renderedPrompt || '').slice(0, 30000) }}"},
  {"name":"size","value":"={{ $('Normalize Draft Payload').item.json.modelOptions.size || '1024x1536' }}"},
  {"name":"quality","value":"={{ $('Normalize Draft Payload').item.json.modelOptions.quality || 'medium' }}"},
  {"name":"n","value":"={{ 1 }}"}
]
| (.nodes[] | select(.name == "Generate LO-FI Draft Image") | .retryOnFail) = true
| (.nodes[] | select(.name == "Generate LO-FI Draft Image") | .maxTries) = 2
| (.nodes[] | select(.name == "Generate LO-FI Draft Image") | .waitBetweenTries) = 1000
| (.nodes[] | select(.name == "Generate LO-FI Draft Image") | .onError) = "continueRegularOutput"
| (.nodes[] | select(.name == "Save LO-FI Draft Result") | .parameters.bodyParameters.parameters) |= map(
    if .name == "draftPrompt" then .value = "={{ $('Normalize Draft Payload').item.json.renderedPrompt }}"
    elif .name == "promptMeta" then .value = "={{ { promptVersion: $('Normalize Draft Payload').item.json.promptVersion, renderedPromptHash: $('Normalize Draft Payload').item.json.renderedPromptHash } }}"
    elif .name == "modelMeta" then .value = "={{ { provider: $('Normalize Draft Payload').item.json.provider, model: $('Normalize Draft Payload').item.json.model, modelOptions: $('Normalize Draft Payload').item.json.modelOptions } }}"
    else . end
  )
| (.connections["Get Generation Run State"].main[0][0].node) = "Generate LO-FI Draft Image"
| (.nodes[] | select(.name == "Check Image Base64") | .parameters.assignments.assignments) = [
  {"id":"ld-base64-length","name":"base64Length","value":"={{ ($json.data?.[0]?.b64_json || '').length }}","type":"number"},
  {"id":"ld-has-base64","name":"hasBase64","value":"={{ Boolean($json.data?.[0]?.b64_json) }}","type":"boolean"},
  {"id":"ld-image-base64","name":"draftImageBase64","value":"={{ $json.data?.[0]?.b64_json || '' }}","type":"string"},
  {"id":"ld-generation-error","name":"generationError","value":"={{ $json.error?.message || $json.message || ($json.data?.[0]?.b64_json ? '' : 'OpenAI image generation returned no image') }}","type":"string"}
]
| (.nodes[] | select(.name == "Save LO-FI Draft Result") | .parameters.bodyParameters.parameters) = [
  {"name":"draftId","value":"={{ $('Normalize Draft Payload').item.json.draftId }}"},
  {"name":"status","value":"={{ $('Check Image Base64').item.json.hasBase64 ? 'ready' : 'failed' }}"},
  {"name":"errorMessage","value":"={{ $('Check Image Base64').item.json.generationError }}"},
  {"name":"draftImageBase64","value":"={{ $('Check Image Base64').item.json.draftImageBase64 }}"},
  {"name":"draftPrompt","value":"={{ $('Normalize Draft Payload').item.json.renderedPrompt }}"},
  {"name":"promptMeta","value":"={{ { promptVersion: $('Normalize Draft Payload').item.json.promptVersion, renderedPromptHash: $('Normalize Draft Payload').item.json.renderedPromptHash } }}"},
  {"name":"modelMeta","value":"={{ { provider: $('Normalize Draft Payload').item.json.provider, model: $('Normalize Draft Payload').item.json.model, modelOptions: $('Normalize Draft Payload').item.json.modelOptions } }}"}
]
| del(.connections["Render LO-FI Draft Prompt"])
| .nodes |= map(select(.name != "Render LO-FI Draft Prompt"))
| del(.id, .versionId, .createdAt, .updatedAt, .shared, .tags, .meta, .pinData)

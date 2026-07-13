-- Keep the active LO-FI prompt compatible with the current n8n worker,
-- which calls OpenAI's image generation endpoint.
update prompt_templates
set
  provider = 'openai',
  model = 'gpt-image-1',
  response_format = 'image',
  model_options = coalesce(model_options, '{}'::jsonb) || '{
    "provider": "openai",
    "model": "gpt-image-1",
    "responseFormat": "image"
  }'::jsonb,
  change_note = 'Align LO-FI prompt settings with the OpenAI n8n image worker.',
  updated_at = now()
where type = 'lofi_draft'
  and status = 'active';

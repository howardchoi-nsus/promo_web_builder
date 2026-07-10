-- Align Image Execution with the image generation path.
-- Older installs seeded this prompt as OpenAI/text, but the final image worker
-- expects an image-capable Gemini configuration.
update prompt_templates
set
  provider = 'google',
  model = 'gemini-3.1-flash-image',
  temperature = 0.4,
  max_tokens = null,
  response_format = 'image',
  model_options = coalesce(model_options, '{}'::jsonb) || '{
    "provider": "google",
    "model": "gemini-3.1-flash-image",
    "temperature": 0.4,
    "maxTokens": null,
    "responseFormat": "image"
  }'::jsonb,
  updated_at = now()
where type = 'image_execution'
  and (
    provider in ('', 'openai')
    or model in ('', 'gpt-4o-mini')
    or response_format in ('', 'text')
  );

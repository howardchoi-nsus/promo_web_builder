-- Add a dedicated layout-preserving final design prompt.
-- The final stage uses the confirmed LO-FI image as its structural source of truth.
insert into prompt_templates (
  type,
  name,
  body,
  status,
  version,
  required_variables,
  optional_variables,
  change_note,
  provider,
  model,
  temperature,
  max_tokens,
  response_format,
  model_options
)
values (
  'final_design',
  'Final Design Generation',
  $prompt$Polish the confirmed LO-FI draft into a production-quality promotional web UI.
The confirmed LO-FI image is the structural source of truth.
Preserve section order, relative placement, content grouping, CTA position, and visual hierarchy.
Apply the Integrated Design Brief for copy, design tokens, brand styling, and compliance constraints.
Do not invent a new layout, add promotional copy, omit required content, or crop the footer/legal area.
Only move a major block when necessary to prevent clipping or overlap.
Return a polished webpage design, not a poster, presentation slide, annotated wireframe, or editor canvas.

Integrated Design Brief:
{{integratedDesignBriefMarkdown}}

Confirmed LO-FI Draft Prompt:
{{confirmedDraftPrompt}}

Confirmed LO-FI Reference Image:
{{confirmedDraftImageProxyUrl}}

Required Section Content Mapping:
{{sectionContentMapping}}

Layout Fidelity Policy:
{{layoutFidelityPolicy}}$prompt$,
  'active',
  1,
  '["integratedDesignBriefMarkdown","confirmedDraftImageProxyUrl"]'::jsonb,
  '["confirmedDraftPrompt","sectionContentMapping","layoutFidelityPolicy"]'::jsonb,
  'Add dedicated final design prompt with confirmed LO-FI layout fidelity.',
  'openai',
  'gpt-image-1',
  null,
  null,
  'image',
  '{
    "provider": "openai",
    "model": "gpt-image-1",
    "temperature": null,
    "maxTokens": null,
    "responseFormat": "image",
    "quality": "high",
    "size": "1024x1536",
    "inputFidelity": "high"
  }'::jsonb
)
on conflict (type, name) do nothing;

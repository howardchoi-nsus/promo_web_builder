-- Backfill the five Section AI prompt families with the atomic Control Plane
-- envelope stored inside the existing versioned model_options JSONB column.
-- No schema change is required, so code-first Vercel deployment remains
-- compatible with a database where this migration has not run yet.

with target as (
  select
    id,
    type,
    coalesce(model_options, '{}'::jsonb) as options,
    type in ('section_background_image', 'component_image') as is_image
  from prompt_templates
  where type in (
    'section_layout_planner',
    'multi_component_layout_planner',
    'section_composition_planner',
    'section_background_image',
    'component_image'
  )
),
backfill as (
  select
    id,
    options
      || case when is_image then jsonb_build_object(
        'imageSize', coalesce(options -> 'imageSize', options -> 'image_size', '"2K"'::jsonb),
        'quality', coalesce(options -> 'quality', '"medium"'::jsonb)
      ) else '{}'::jsonb end
      || jsonb_build_object(
        'executionSnapshotVersion',
        coalesce(options -> 'executionSnapshotVersion', '2'::jsonb),
        'harnessConfig',
        coalesce(
          options -> 'harnessConfig',
          case when is_image then jsonb_build_object(
            'version', 1,
            'safeAreaInstructions', jsonb_build_object(
              'none', 'Use the full canvas for the visual subject; do not reserve artificial copy-safe negative space.',
              'left-copy', 'Keep the left half as clean negative space for DOM copy and place the main visual subject on the right.',
              'right-copy', 'Keep the right half as clean negative space for DOM copy and place the main visual subject on the left.',
              'center-copy', 'Keep the center as clean negative space for centered DOM copy and place supporting visual detail around the outer edges.'
            ),
            'sectionBackgroundRules', jsonb_build_array(
              'OUTPUT CONTRACT — FULL-BLEED WEB SECTION BACKGROUND (highest priority):',
              'Compose directly on the entire {{aspectRatio}} output canvas and cover every pixel from edge to edge.',
              'The scene must continue naturally through all four outer edges and all four corners.',
              'Do not place the scene inside a card, panel, poster, browser mockup, inset canvas, floating surface, or smaller artboard.',
              'Do not add any outer margin, padding, matte, whitespace, transparent edge, letterbox, pillarbox, border, stroke, frame, keyline, rounded outer canvas corner, drop shadow, or outer glow.',
              'The supplied section background color is only a color-matching reference. Never draw it as a surrounding frame or margin.'
            ),
            'componentImageRules', jsonb_build_array(
              'Compose the image for the component field area and use the complete canvas.'
            ),
            'negativeRules', jsonb_build_array(
              'Use edge colors that are visually compatible with the solid section background color {{backgroundColor}}.',
              'Do not bake a fade, gradient, vignette, transparency, border, or masking effect into the image; the web renderer applies the requested fade with CSS.',
              'Do not render text, buttons, logos, badges, or legal copy inside the image.'
            )
          ) else jsonb_build_object(
            'version', 1,
            'additionalInstructions', '[]'::jsonb
          ) end
        ),
        'runtimeConfig',
        coalesce(
          options -> 'runtimeConfig',
          case when is_image then jsonb_build_object(
            'timeoutMs', 240000,
            'maxAttempts', 3,
            'retryBaseMs', 15000,
            'retryMaxMs', 75000,
            'outputMimeType', 'image/jpeg',
            'minimumImagePolicy', 'requested-tier'
          ) else jsonb_build_object(
            'timeoutMs', 90000,
            'maxAttempts', 1,
            'retryBaseMs', 0,
            'retryMaxMs', 0
          ) end
        ),
        'modelCapabilitySnapshot',
        coalesce(
          options -> 'modelCapabilitySnapshot',
          case when is_image then jsonb_build_object(
            'imageSizes', jsonb_build_array('1K', '2K', '4K'),
            'aspectRatios', jsonb_build_array('1:1', '4:3', '3:4', '16:9', '9:16'),
            'minimumLongSideByTier', jsonb_build_object('1K', 900, '2K', 1800, '4K', 3600)
          ) else jsonb_build_object(
            'structuredOutput', true,
            'temperature', true,
            'maxOutputTokens', true
          ) end
        ),
        'safetyContract',
        coalesce(
          options -> 'safetyContract',
          jsonb_build_object(
            'key', case when is_image then 'section-image-v1' else 'section-layout-v1' end,
            'version', 1
          )
        )
      ) as next_options
  from target
)
update prompt_templates as prompt
set
  model_options = backfill.next_options,
  change_note = case
    when prompt.change_note = '' then 'Control Plane V2 settings backfilled.'
    else prompt.change_note
  end,
  updated_at = now()
from backfill
where prompt.id = backfill.id
  and prompt.model_options is distinct from backfill.next_options;

comment on column prompt_templates.model_options is
  'Versioned provider options plus Control Plane V2 harnessConfig, runtimeConfig, modelCapabilitySnapshot and safetyContract.';

-- Create an immutable V3 draft for each active Section AI image prompt.
-- Active V2 rows remain untouched until an administrator validates and activates
-- the candidate through the existing prompt lifecycle.

with active_source as (
  select source.*,
    coalesce(source.model_options, '{}'::jsonb) as options
  from prompt_templates source
  where source.type in ('section_background_image', 'component_image')
    and source.status = 'active'
    and not exists (
      select 1 from prompt_templates candidate
      where candidate.lineage_id = source.lineage_id
        and candidate.status in ('draft', 'validated')
    )
),
prepared as (
  select source.*,
    (
      (source.options
        - 'imageSize' - 'image_size' - 'quality'
        - 'generationPolicy' - 'renderPolicy' - 'validationPolicy'
        - 'policySchemaVersion' - 'executionSnapshotVersion' - 'runtimeConfig')
      || jsonb_build_object(
        'executionSnapshotVersion', 3,
        'policySchemaVersion', 1,
        'runtimeConfig',
          (coalesce(source.options -> 'runtimeConfig', '{}'::jsonb)
            - 'outputMimeType' - 'output_mime_type' - 'minimumImagePolicy'),
        'generationPolicy', jsonb_build_object(
          'requestedTier', coalesce(
            source.options #>> '{generationPolicy,requestedTier}',
            source.options ->> 'imageSize',
            source.options ->> 'image_size',
            '2K'
          ),
          'aspectRatioStrategy', case when source.type = 'section_background_image'
            then 'nearest-supported' else 'target' end,
          'fixedAspectRatio', case when source.type = 'section_background_image' then '16:9' else '1:1' end,
          'fallbackAspectRatio', case when source.type = 'section_background_image' then '16:9' else '1:1' end,
          'quality', coalesce(
            source.options #>> '{generationPolicy,quality}',
            source.options ->> 'quality',
            'medium'
          ),
          'outputMimeType', coalesce(
            source.options #>> '{generationPolicy,outputMimeType}',
            source.options #>> '{runtimeConfig,outputMimeType}',
            'image/jpeg'
          ),
          'backgroundColorStrategy', 'section',
          'subjectScale', jsonb_build_object('minimumPercent', 55, 'maximumPercent', 75)
        ),
        'renderPolicy', jsonb_build_object(
          'sectionBackground', jsonb_build_object(
            'fitMode', 'cover',
            'allowedFitModes', jsonb_build_array('cover', 'contain', 'width-fill'),
            'position', 'center center',
            'repeat', 'no-repeat',
            'focalPoint', jsonb_build_object('x', 50, 'y', 50)
          ),
          'componentImage', jsonb_build_object(
            'fitMode', 'contain',
            'allowedFitModes', jsonb_build_array('contain', 'cover'),
            'position', 'center center',
            'transparentFrame', true
          ),
          'fade', jsonb_build_object(
            'allowedModes', jsonb_build_array('none', 'left', 'right', 'both'),
            'defaultMode', 'none',
            'defaultStrength', 'medium',
            'stops', jsonb_build_object(
              'soft', jsonb_build_object('solid', 8, 'clear', 38, 'edge', 18),
              'medium', jsonb_build_object('solid', 14, 'clear', 48, 'edge', 24),
              'strong', jsonb_build_object('solid', 22, 'clear', 62, 'edge', 32)
            )
          )
        ),
        'validationPolicy', jsonb_build_object(
          'rejectUnreadableMetadata', true,
          'rejectMimeMismatch', true,
          'rejectLowResolution', true,
          'resolutionRules', jsonb_build_object(
            '1K', jsonb_build_object('minimumLandscapeWidth', 1024, 'minimumPortraitHeight', 1024, 'minimumSquareSide', 1024),
            '2K', jsonb_build_object('minimumLandscapeWidth', 2048, 'minimumPortraitHeight', 2048, 'minimumSquareSide', 2048),
            '4K', jsonb_build_object('minimumLandscapeWidth', 3840, 'minimumPortraitHeight', 3840, 'minimumSquareSide', 3840)
          ),
          'aspectRatioTolerancePercent', 8,
          'minimumByteLength', 1024,
          'edgeFrameDetection', jsonb_build_object(
            'enabled', false,
            'uniformEdgeThreshold', 0.92,
            'minimumBandPercent', 4
          )
        )
      )
    ) as next_options,
    (select coalesce(max(version), 0) + 1
      from prompt_templates versioned
      where versioned.lineage_id = source.lineage_id) as next_version
  from active_source source
),
inserted as (
  insert into prompt_templates (
    type, name, body, status, version, lineage_id, source_prompt_template_id,
    required_variables, optional_variables, provider, model, temperature,
    max_tokens, response_format, model_options, change_note
  )
  select
    type, name, body, 'draft', next_version, lineage_id, id,
    required_variables, optional_variables, provider, model, temperature,
    max_tokens, response_format, next_options,
    'Execution Snapshot V3 image generation and rendering policy draft.'
  from prepared
  returning *
)
insert into prompt_template_histories (
  prompt_template_id, prompt_type, previous_body, new_body,
  previous_version, new_version, previous_status, new_status, change_note,
  previous_provider, new_provider, previous_model, new_model,
  previous_model_options, new_model_options
)
select
  inserted.id, inserted.type, source.body, inserted.body,
  source.version, inserted.version, source.status, inserted.status,
  'Execution Snapshot V3 image generation and rendering policy draft.',
  source.provider, inserted.provider, source.model, inserted.model,
  source.model_options, inserted.model_options
from inserted
join prompt_templates source on source.id = inserted.source_prompt_template_id;

comment on column prompt_templates.model_options is
  'Versioned provider options and Section AI Control Plane policies. Image prompt V3 adds generationPolicy, renderPolicy and validationPolicy.';

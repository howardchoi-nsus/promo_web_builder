-- Align the promotion planning prompt families with the server-side Control Plane
-- contract. Existing administrator values are preserved; only missing V2 envelope
-- fields receive safe defaults.

begin;

with target as (
  select
    id,
    coalesce(model_options, '{}'::jsonb) as options
  from prompt_templates
  where type in (
    'promo_overview_parser',
    'promo_template_recommender',
    'promo_template_composer',
    'promo_page_composer',
    'promo_composition_editor'
  )
),
backfill as (
  select
    id,
    options || jsonb_build_object(
      'executionSnapshotVersion',
      case
        when jsonb_typeof(options -> 'executionSnapshotVersion') = 'number'
          and (options ->> 'executionSnapshotVersion')::numeric >= 2
          then options -> 'executionSnapshotVersion'
        else '2'::jsonb
      end,
      'harnessConfig',
      coalesce(
        options -> 'harnessConfig',
        jsonb_build_object('version', 1, 'additionalInstructions', '[]'::jsonb)
      ),
      'runtimeConfig',
      jsonb_build_object(
        'timeoutMs', 90000,
        'maxAttempts', 1,
        'retryBaseMs', 0,
        'retryMaxMs', 0
      ) || coalesce(options -> 'runtimeConfig', '{}'::jsonb),
      'modelCapabilitySnapshot',
      coalesce(
        options -> 'modelCapabilitySnapshot',
        jsonb_build_object(
          'structuredOutput', true,
          'temperature', true,
          'maxOutputTokens', true
        )
      ),
      'safetyContract',
      coalesce(
        options -> 'safetyContract',
        jsonb_build_object('key', 'promo-planner-v1', 'version', 1)
      )
    ) as next_options
  from target
)
update prompt_templates as prompt
set
  model_options = backfill.next_options,
  change_note = case
    when coalesce(prompt.change_note, '') = ''
      then 'Execution Snapshot V2 settings backfilled for promotion planning prompts.'
    else prompt.change_note
  end,
  updated_at = now()
from backfill
where prompt.id = backfill.id
  and prompt.model_options is distinct from backfill.next_options;

commit;

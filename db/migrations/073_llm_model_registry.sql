begin;

create extension if not exists pgcrypto;

create table if not exists llm_models (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('openai', 'google')),
  model_id text not null,
  display_name text not null,
  description text not null default '',
  modality text not null check (modality in ('text', 'image')),
  status text not null default 'draft' check (status in ('draft', 'active', 'inactive')),
  is_recommended boolean not null default false,
  is_legacy boolean not null default false,
  default_temperature numeric,
  default_max_tokens integer check (default_max_tokens is null or default_max_tokens > 0),
  default_response_format text not null default 'text',
  supported_image_sizes jsonb not null default '[]'::jsonb,
  model_options jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  created_by text not null default 'system',
  updated_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, model_id)
);

create index if not exists llm_models_status_modality_idx
  on llm_models(status, modality, provider);

create table if not exists llm_model_histories (
  id uuid primary key default gen_random_uuid(),
  llm_model_id uuid references llm_models(id) on delete set null,
  provider text not null,
  model_id text not null,
  previous_status text,
  new_status text not null,
  snapshot jsonb not null default '{}'::jsonb,
  change_note text not null default '',
  changed_by text not null,
  changed_at timestamptz not null default now()
);

create index if not exists llm_model_histories_model_idx
  on llm_model_histories(llm_model_id, changed_at desc);

-- Register every model already referenced by a managed prompt. Catalog models
-- that are not used yet are added lazily by the Admin registry service.
with prompt_models as (
  select distinct on (lower(trim(provider)), trim(model))
    lower(trim(provider)) as provider,
    trim(model) as model_id,
    temperature,
    max_tokens,
    response_format,
    type,
    status
  from prompt_templates
  where lower(trim(provider)) in ('openai', 'google')
    and trim(model) <> ''
  order by
    lower(trim(provider)), trim(model),
    case status when 'active' then 0 when 'validated' then 1 when 'draft' then 2 else 3 end,
    updated_at desc
)
insert into llm_models (
  provider, model_id, display_name, description, modality, status,
  default_temperature, default_max_tokens, default_response_format,
  supported_image_sizes, change_note, created_by, updated_by
)
select
  prompt.provider,
  prompt.model_id,
  prompt.model_id,
  '기존 프롬프트 설정에서 자동 등록된 모델',
  case
    when prompt.model_id ilike 'gpt-image-%'
      or prompt.model_id ilike '%-image%'
      or prompt.type in ('image_execution', 'lofi_draft', 'final_design', 'final_design_v2', 'section_background_image', 'component_image')
    then 'image'
    else 'text'
  end,
  'active',
  prompt.temperature,
  prompt.max_tokens,
  coalesce(nullif(prompt.response_format, ''), case when prompt.model_id ilike '%image%' then 'image' else 'text' end),
  case when prompt.provider = 'google' and prompt.model_id ilike '%image%' then '["1K","2K","4K"]'::jsonb else '[]'::jsonb end,
  '프롬프트에서 사용 중인 모델 자동 등록',
  'system:prompt-sync',
  'system:prompt-sync'
from prompt_models prompt
on conflict (provider, model_id) do nothing;

insert into llm_model_histories (
  llm_model_id, provider, model_id, previous_status, new_status,
  snapshot, change_note, changed_by
)
select
  model.id,
  model.provider,
  model.model_id,
  null,
  model.status,
  jsonb_build_object(
    'provider', model.provider,
    'modelId', model.model_id,
    'displayName', model.display_name,
    'description', model.description,
    'modality', model.modality,
    'status', model.status,
    'isRecommended', model.is_recommended,
    'isLegacy', model.is_legacy,
    'defaultTemperature', model.default_temperature,
    'defaultMaxTokens', model.default_max_tokens,
    'defaultResponseFormat', model.default_response_format,
    'supportedImageSizes', model.supported_image_sizes,
    'modelOptions', model.model_options
  ),
  coalesce(nullif(model.change_note, ''), '기존 LLM Registry 모델 이력 초기화'),
  model.updated_by
from llm_models model
where not exists (
  select 1 from llm_model_histories history where history.llm_model_id = model.id
);

commit;

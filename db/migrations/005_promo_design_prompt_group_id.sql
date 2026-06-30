alter table promo_design_runs
  add column if not exists prompt_group_id text;

alter table promo_design_assets
  add column if not exists prompt_group_id text;

create index if not exists promo_design_runs_prompt_group_id_idx
  on promo_design_runs (prompt_group_id);

create index if not exists promo_design_assets_prompt_group_id_idx
  on promo_design_assets (prompt_group_id);

comment on column promo_design_runs.prompt_group_id is 'Shared short id that groups a generated image, design prompt markdown, and promo input log.';
comment on column promo_design_assets.prompt_group_id is 'Shared short id used to group related generated assets for the same design generation.';


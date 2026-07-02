create index if not exists promo_design_assets_primary_image_run_idx
  on promo_design_assets (run_id, created_at desc)
  where asset_type = 'generated_image' and is_primary = true;

create index if not exists promo_design_assets_markdown_lookup_idx
  on promo_design_assets (run_id, asset_type, created_at desc)
  where asset_type in (
    'design_prompt_markdown',
    'promo_input_markdown',
    'integrated_design_brief_markdown'
  );

create index if not exists promo_design_runs_recent_created_idx
  on promo_design_runs (created_at desc)
  where created_at is not null;

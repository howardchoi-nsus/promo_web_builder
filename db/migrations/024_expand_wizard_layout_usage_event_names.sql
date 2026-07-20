alter table wizard_layout_usage_events
  drop constraint if exists wizard_layout_usage_events_event_name_check;

alter table wizard_layout_usage_events
  add constraint wizard_layout_usage_events_event_name_check
  check (event_name in (
    'layout_loaded', 'layout_load_failed', 'layout_edit_started',
    'item_moved', 'item_style_changed', 'section_resized',
    'item_reset', 'layout_reset', 'layout_completed', 'run_snapshot_created',
    'legacy_layout_cache_invalidated', 'layout_identity_mismatch',
    'admin_layout_update_detected', 'admin_layout_update_applied', 'admin_layout_update_deferred',
    'legacy_section_order_cache_invalidated',
    'admin_section_order_update_detected', 'admin_section_order_update_applied', 'admin_section_order_update_deferred',
    'admin_layout_reset_with_section_order'
  ));

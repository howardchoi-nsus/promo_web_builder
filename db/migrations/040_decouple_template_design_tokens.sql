-- Design tokens are selected per promotion. Template rows keep the nullable
-- legacy column for backward-compatible deployments, but no longer own a token.
update wizard_form_templates
set design_token_set_version_id = null,
    updated_at = now()
where design_token_set_version_id is not null;

-- The Promotion Builder still needs one global default for Step 1. Keep that
-- responsibility on the token set itself instead of assigning it to a template.
alter table promo_design_token_sets
  add column if not exists is_default boolean not null default false;

update promo_design_token_sets set is_default = false where is_default;

with preferred as (
  select id
  from promo_design_token_sets
  where status = 'active'
  order by
    case
      when lower(set_key) like '%ggpoker%' or lower(name) like '%ggpoker%' then 0
      else 1
    end,
    name,
    created_at
  limit 1
)
update promo_design_token_sets token_set
set is_default = true,
    updated_at = now()
from preferred
where token_set.id = preferred.id;

create unique index if not exists promo_design_token_sets_default_uidx
  on promo_design_token_sets (is_default)
  where is_default = true;

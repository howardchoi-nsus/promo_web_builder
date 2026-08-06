do $$
begin
  if exists (
    select 1
    from public.wizard_item_components
    where system_seed_code is not null
    group by system_seed_code
    having count(*) > 1
  ) then
    raise exception using
      errcode = '23505',
      message = 'wizard_item_components contains duplicate system_seed_code values',
      hint = 'Resolve duplicate seed identities before applying migration 054.';
  end if;
end
$$;

create unique index if not exists
  wizard_item_components_system_seed_code_seed_uidx
on public.wizard_item_components (system_seed_code);

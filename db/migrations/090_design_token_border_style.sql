begin;
select pg_advisory_xact_lock(hashtext('migration:090_design_token_border_style'));
alter table promo_design_token_definitions drop constraint if exists promo_design_token_definitions_value_type_check;
alter table promo_design_token_definitions add constraint promo_design_token_definitions_value_type_check
 check (value_type in ('color','length','dimension','number','font','fontFamily','fontWeight','typography','shadow','gradient','duration','easing','enum','borderStyle'));
commit;

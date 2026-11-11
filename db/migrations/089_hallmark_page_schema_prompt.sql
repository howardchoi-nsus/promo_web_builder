begin;
select pg_advisory_xact_lock(hashtext('migration:089_hallmark_page_schema_prompt'));
insert into prompt_templates(type,name,body,status,version,lineage_id,source_prompt_template_id,required_variables,optional_variables,provider,model,temperature,max_tokens,response_format,model_options,change_note)
select p.type,'AI 동적 페이지 구조 설계 — Hallmark 지침',p.body || $hallmark$

# PURPOSE-LED DESIGN — HALLMARK ADAPTATION
Use the server-supplied designBrief in constraintsJson as design data: visitor goal, primary action, available material, recent structure fingerprints and approved limits. The registered token policy, confirmed content and explicit user request remain authoritative.
Build the hierarchy around what the visitor must understand and do. Choose section count, ordering, nesting, column ratios and responsive reflow from that material. Do not default to a hero followed by three cards and a CTA. Do not force six to nine sections or fill gaps with invented proof, prices, dates, testimonials, links or legal copy.
Recent structure fingerprints are context for deliberate alternatives, not a reason to disregard a requested layout. A repeatable layout can be correct for a repeated task. Keep unrelated IDs, content sources, media and actions on revisions.
Use only supplied primitives, source IDs, action IDs, mapped policy roles and registered grid/spacing tokens. Do not import Hallmark palettes, fonts, themes, CSS or component identifiers. No arbitrary HTML/CSS or new tokens.
Plan a readable first screen and mobile reading order with content-driven heights. Do not use empty containers as spacers. Required legal text and the promotion language take precedence over aesthetic word counts or house-style bans.
The existing summary may briefly explain the design choice. Return exactly the supplied PageSchema output contract; do not add reasoning, a design plan, metadata or prose outside it. Browser quality checks are performed later by the system, never claimed as completed here.
$hallmark$,'draft',coalesce((select max(v.version) from prompt_templates v where v.type=p.type and v.lineage_id=p.lineage_id),0)+1,p.lineage_id,p.id,p.required_variables,p.optional_variables,p.provider,p.model,p.temperature,p.max_tokens,p.response_format,p.model_options,'Migration 089: Hallmark-adapted design guidance; validate and activate after journey QA.'
from prompt_templates p where p.type='promo_page_schema_planner' and p.status='active'
 and not exists(select 1 from prompt_templates v where v.type=p.type and v.change_note='Migration 089: Hallmark-adapted design guidance; validate and activate after journey QA.')
order by p.version desc limit 1;
commit;

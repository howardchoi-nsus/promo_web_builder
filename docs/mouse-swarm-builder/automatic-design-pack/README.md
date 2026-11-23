# Automatic design responsibilities pack

Migration 097 adds immutable per-version prompt scopes. Migration 098 creates six inactive scoped skills and up to seven prompt Drafts using existing active models/options/variables. No model or active prompt is changed. Existing open candidates or four unrelated bindings prevent a new candidate; inspect the final SQL result and resolve those candidates in Admin rather than assuming all Drafts exist. Missing active source prompts also produce no Draft.

Activate reviewed skill records first, then validate and explicitly activate each prompt Draft in Admin. Compare the assembled sample, existing model settings and actual provider results. Do not rewrite migrations 094–096. The existing provider response schema and required variables remain authoritative. Structure-ready automatic transitions are code behavior and do not depend on the model declaring approval.

Existing unscoped skill versions remain compatible and are labelled in Admin. Declare scopes on new versions; never mutate immutable old versions. External LLM/DB/Blob validation remains separate from local SQL fixtures.

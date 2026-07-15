# 검토 의견: DB 테이블 정리 (불필요 테이블 식별) (2026-07-15)

Reviewer: Claude
Date: 2026-07-15
검토 방법: `db/migrations/002~022` + `db/seeds`의 테이블 정의 전수 조사 후, `api/*.js`(47개 endpoint + store 모듈)와 `scripts/*.js`의 실제 read/write 경로와 대조 (정적 분석 — 라이브 DB 직접 조회 아님)

## 결론

**즉시 제거 후보는 2개(`design_tokens`, `analysis_runs`), 조건부 제거 후보는 2계열(구 Builder 흐름의 `promo_design_runs`/`promo_design_assets`, 016 `wizard_content_section_histories`)이다.** 나머지 테이블은 모두 현재 코드가 read 또는 write하고 있어 제거 대상이 아니다.

단, 이 프로젝트는 초기 스키마(001)가 마이그레이션 폴더에 없고 seed가 "initial schema 생성 후 실행" 전제로 작성되어 있어, **라이브 Neon DB에는 마이그레이션에 없는 수동 생성 테이블이 더 존재할 수 있다.** 실제 삭제 전 반드시 아래 '삭제 전 검증' 절차로 라이브 DB와 대조해야 한다.

## 즉시 제거 후보

### 1. `design_tokens` (레거시, 006에서 정규화 이관 완료)

- 근거: API 코드 전체에서 이 테이블을 read/write하는 곳이 없음. `api/promo-design-assets.js`의 `design_tokens`는 테이블이 아니라 `promo_design_runs`의 jsonb 컬럼명.
- 006 마이그레이션(`design_md_datafication`)이 이 테이블의 데이터를 `design_token_sets`/`design_token_items`로 백필한 흔적이 있고(006 76~77행), 현재 분석 파이프라인(`api/_design-md-data.js`)은 정규화 테이블에만 기록한다.
- 유일한 참조는 `scripts/generate-design-md-seed.js`(211, 215행)가 여전히 이 테이블용 insert문을 생성하는 것. **테이블 제거 시 이 seed 생성 스크립트도 함께 수정해야 한다** (안 하면 다음 seed 실행 때 오류).

### 2. `analysis_runs` (레거시, 002에서 컬럼으로 대체)

- 근거: API 코드 참조 전무. 분석 상태·모델 기록은 002 마이그레이션이 추가한 `design_documents.analyzed_at`/`analysis_model` 컬럼으로 이미 대체됨.
- 유일한 참조는 역시 `scripts/generate-design-md-seed.js`(217, 221행) — 위와 동일하게 스크립트 동반 수정 필요.

## 조건부 제거 후보 (지금은 유지)

### 3. `promo_design_runs` + `promo_design_assets` 계열 (구 Builder B3 생성 흐름)

- `api/promo-design-image.js`, `promo-design-view.js`, `promo-design-markdown.js`, `promo-design-assets.js`, `generate-ui-design.js` 등 구 Builder 생성 흐름이 아직 사용 중이라 **현재는 제거 불가**.
- 신규 Wizard 흐름은 `promo_generation_runs` + `promo_generation_integrated_briefs`/`lofi_drafts`/`final_designs`(011)로 완전히 별도 계열을 쓴다. 두 계열은 역할이 중복된다(run 관리 + 생성 결과 저장).
- Standalone Wizard 이행이 완료되어 Builder의 B3 생성 콘솔을 폐기하는 시점에 이 계열(테이블 2개 + 관련 API 5개 + 인덱스)이 통째로 제거 대상이 된다. 지금 정리 계획에 "Wizard 이행 완료 후 제거" 항목으로 예약해 둘 것을 권장.

### 4. `wizard_content_section_histories` (016) — 022 audit log와 역할 중복

- 022의 트리거(`wizard_content_section_audit`)가 `wizard_content_sections`의 모든 insert/update/delete를 `wizard_section_audit_logs`에 이미 기록한다. 016 히스토리 테이블은 활성화/보관 시점에만 앱·함수 레벨로 기록되는 부분집합이라 사실상 중복.
- 단, 022에 없는 버전 전이(previous_version → new_version) 필드가 있으므로, 제거하려면 022 스키마에 버전 컬럼을 흡수한 뒤가 안전. 당장은 유지하되 이력 테이블 이원화는 해소 필요.
- 참고: `wizard_form_template_histories`(017)는 plpgsql 함수들이 쓰기만 하고 **읽는 API가 하나도 없다**. 중복은 아니므로 제거 대상은 아니나, 조회 수단이 없는 이력은 존재 의미가 약하다 — 관리자 UI에서 조회하게 하거나 022 audit log로 통합하는 방향 검토.

## 유지 (사용 중 확인 완료)

| 계열 | 테이블 | 사용처 |
|---|---|---|
| 베이스 | `brands`, `design_documents`, `design_sections` | 디자인 MD 등록/목록/상세 (design-documents.js 등) |
| 006/007 정규화 | `design_token_sets`, `design_token_items`, `design_metadata_items`, `design_component_patterns`, `design_layout_patterns`, `design_guideline_items` | 분석 파이프라인 read/write (_design-md-data.js) |
| 프롬프트 | `prompt_templates`, `prompt_template_histories` | 관리자 LLM 탭 + 실행 snapshot |
| 생성 run (신) | `promo_generation_runs`, `promo_generation_integrated_briefs`, `promo_generation_lofi_drafts`, `promo_generation_final_designs` | Wizard 3단계 worker 흐름 |
| 웹훅 | `worker_webhook_settings`, `worker_webhook_setting_histories` | 관리자 웹훅 탭 |
| Wizard 폼 | `wizard_content_sections`, `wizard_content_section_items`, `wizard_form_templates`, `wizard_form_template_sections`, `wizard_section_audit_logs` | 관리자 폼 관리 + Wizard Step 2 |

## 삭제 전 검증 절차 (필수)

베이스 스키마가 마이그레이션 밖에서 만들어졌으므로, 정적 분석에 없는 테이블이 라이브 DB에 있을 수 있다.

```sql
-- 1) 실제 존재 테이블 전수 확인
select table_name from information_schema.tables
where table_schema = 'public' order by 1;

-- 2) 제거 후보의 데이터량/최근 활동 확인
select 'design_tokens' as t, count(*), max(created_at) from design_tokens
union all
select 'analysis_runs', count(*), max(completed_at) from analysis_runs;

-- 3) FK 의존 확인 (참조하는 테이블이 있으면 drop 순서 조정)
select conname, conrelid::regclass, confrelid::regclass
from pg_constraint
where confrelid in ('design_tokens'::regclass, 'analysis_runs'::regclass);
```

권장 삭제 방식: 바로 `drop table` 하지 말고 ① `alter table design_tokens rename to _deprecated_design_tokens` 후 1~2주 운영 관찰 → ② 오류 없으면 drop을 담은 `023_drop_legacy_design_md_tables.sql` 마이그레이션으로 확정. seed 스크립트(`generate-design-md-seed.js`)의 해당 insert/delete 블록 제거를 같은 작업에 포함.

## 제안 우선순위

1. 라이브 DB 대조(위 검증 SQL) 후 `design_tokens`, `analysis_runs` rename → drop (023 마이그레이션 + seed 스크립트 수정)
2. 이력 테이블 이원화 해소 방향 결정 (016/017 histories vs 022 audit log)
3. Wizard 이행 완료 시점에 `promo_design_runs`/`promo_design_assets` 계열 제거 예약

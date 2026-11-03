# 검토 의견: 관리자 페이지 소스코드 (2026-07-15 기준)

Reviewer: Claude
Date: 2026-07-15
검토 범위:
- Frontend: `prototype/index.html`(관리자 탭 마크업), `prototype/app.js`(관리자 메서드 1664~2980줄 부근: 폼 템플릿/섹션/아이템 CRUD, audit log, webhook/prompt 관리)
- API: `wizard-form-template*.js`, `wizard-content-section*.js`, `wizard-section-audit-logs.js`, `_wizard-form-templates-store.js`, `_wizard-content-sections-store.js`, `_wizard-section-audit-log.js`
- DB: `db/migrations/016~022`
- 기준 문서: `docs/wizard-content-admin-hardening-development-plan-2026-07-14.md`, `docs/claude/review-admin-page-source-2026-07-14.md`

## 결론

**07-14 hardening 계획의 P0 항목 상당수가 실제 코드에 반영되어 전반적 완성도가 크게 올라갔다.** active 버전 직접 보관 차단(UI disabled + API 409), 활성화 전 draft validation(422), plpgsql 함수 + advisory lock 기반의 원자적 활성화/복제, `max(version)+1` 버전 산정, Wizard 측 fail-closed 로딩과 `configRevision` snapshot, trigger 기반 audit log까지 계획서의 핵심 골격이 구현됐다.

다만 **P0 중 가장 중요한 관리자 API 인증/인가는 여전히 전무**하며(07-14 리뷰 이슈 #1 미해결), 새로 추가된 코드에서 **비원자적 다단계 쓰기 2건**과 **PATCH 부분 업데이트 시 name이 빈 문자열로 덮이는 계약 결함 1건**이 확인됐다. 운영 배포 전 이 네 가지는 해결이 필요하다.

## 이슈사항

### 1. (보안, 최우선, 미해결) 관리자 쓰기 API 인증/인가 전무 — 07-14 이슈 #1 그대로

- `api/` 폴더 전체를 재확인했으나 auth/token/session 검사 코드가 여전히 없음. 신규 추가된 `wizard-form-template*`, `wizard-content-section*`, `wizard-section-audit-logs` 전부 무인증.
- 특히 신규 audit log API(`GET /api/wizard-section-audit-logs`)는 모든 변경의 `previous_state`/`new_state` 전체 row JSON을 반환하므로, 무인증 상태에서는 내부 설정 변경 이력이 통째로 외부에 노출됨.
- hardening 계획서 10장(단기: Vercel Deployment Protection, 운영: session/role)이 이미 있으므로 Phase 4를 앞당길 것을 권장. 최소한 배포 환경의 접근 제한 여부라도 즉시 확인 필요.

### 2. (P0, 신규) 폼 템플릿 활성화가 비원자적 — 2개의 개별 SQL 호출

- `api/wizard-form-template-activate.js` 36~39행: `activate_wizard_form_template_owned_sections()` 호출 후 별도 statement로 `activate_wizard_form_template()` 호출.
- Neon HTTP driver는 statement 단위 auto-commit이므로, 첫 호출 성공 후 둘째 호출이 실패하면 **owned 섹션들만 active로 승격되고 템플릿은 draft로 남는 불일치 상태**가 됨. 이후 draft 섹션 편집 API(`requireDraftSection`)가 409로 막혀 복구도 어려움.
- 수정 방향: 두 함수를 하나의 plpgsql 함수(예: `activate_wizard_form_template_full`)로 합쳐 단일 transaction으로 실행. 각 함수 내부는 이미 원자적이므로 합치기만 하면 됨.

### 3. (P0, 신규) 섹션 copy-on-write가 3개 statement로 분리 — 고아 draft 발생 가능

- `api/wizard-form-template-sections.js` `updateSection()` 147~184행: 공유 섹션을 template-owned draft로 복제할 때 ① 섹션 insert → ② 아이템 bulk insert → ③ membership update가 각각 별도 statement.
- ② 또는 ③ 실패 시 `owner_form_template_id`가 설정된 고아 draft 섹션이 남고, 이 고아는 이후 템플릿 활성화 시 `activate_wizard_form_template_owned_sections()`가 **membership 없는 섹션까지 active로 승격**시킴(해당 함수는 owner id + draft 상태만 봄).
- 수정 방향: `createOwnedSection()`처럼 단일 CTE 문으로 합치거나 plpgsql 함수화. 병행책으로 owned 섹션 활성화 함수에 `exists (select 1 from wizard_form_template_sections ts where ts.section_id = s.id)` 조건 추가.

### 4. (P1, 신규) PATCH 부분 업데이트 시 섹션 name이 빈 문자열로 덮임

- `api/wizard-form-template-sections.js` 186~196행: body에 `name` 또는 `description` 중 **하나라도** 있으면 두 컬럼을 모두 `String(body.name || "")`, `String(body.description || "")`로 업데이트. description만 보내면 name이 `""`로 덮임.
- 현재 UI(`saveWizardFormTemplateSection`)는 항상 둘 다 보내므로 화면에서는 재현 안 되지만, API 계약 결함이므로 `hasOwnProperty` 기반 개별 업데이트(같은 쿼리의 202~205행 패턴)로 통일 필요.

### 5. (미반영, 3회째) handoff-picker 사용자 화면 노출

- `prototype/index.html` 16~22행. 07-10 제안, 07-14 리뷰에 이어 여전히 topbar(사용자 화면 포함)에 노출. 내부 개발 기록(`/api/handoff-documents`)이 사용자 화면에서 접근 가능한 상태 지속.

### 6. (참고) 경미한 사항

- `api/_wizard-section-audit-log.js`의 `recordWizardSectionAudit()`는 어디서도 호출되지 않는 dead code(022 migration이 trigger 방식으로 대체). 제거하거나 주석으로 의도 명시 권장.
- `fetchPublicSectionsWithItems`(구 public API)와 `wizard-form-template-public.js` 모두 섹션별 아이템을 루프에서 개별 조회(N+1). 현재 규모에선 무해하나 섹션 수 증가 시 단일 join 쿼리로 개선 여지.
- `requireDraftSection`(items API)의 상태 확인과 실제 쓰기가 별도 statement라 활성화와 경합 시 이론상 TOCTOU 존재. 실사용 위험은 낮음.
- history/audit에 actor(누가 변경했는지) 기록 없음 — 인증 도입(이슈 1)과 함께 해결될 사안(계획서 P1).

## 간략한 내용 (07-14 계획 대비 반영 확인)

| 계획 항목 | 상태 |
|---|---|
| active 직접 보관 차단 | 반영 (UI disabled + API 409, 섹션/템플릿/프롬프트 모두) |
| 활성화 전 draft validation | 반영 (422 + errors 배열, locked/image/required 규칙 포함) |
| 원자적 활성화/복제 | 대부분 반영 (plpgsql + advisory lock + `max(version)+1`), 단 이슈 2·3 예외 |
| 설정 로드 fail-closed | 반영 (`wizardSectionConfigurationReady()`, 활성 템플릿 없으면 진행 차단) |
| configRevision snapshot | 반영 (template-public 응답에 revision 포함, contentState에 저장) |
| legacy localStorage migration | 반영 (`migrateLegacySectionInputs`) |
| lockedValue 타입 검증 | 반영 (`validateLockedValue`, `false`/`0` 보존하는 `hasLockedValue`) |
| 오류 코드 표준화 (400/404/409/422) | 반영 |
| 변경 audit log | 반영 (trigger 기반, 관리자 UI 조회 포함) |
| 관리자 인증/인가 | **미반영 (이슈 1)** |
| 반복(repeatable) 구조 복원 | 미반영 (계획서 Phase 3, 미착수로 보임) |

프론트엔드는 기존 관리자 페이지의 장점(try/catch/finally + 로딩 플래그 + `setStatus` 패턴, `v-html` 미사용, 이중 제출 방지 가드)을 신규 폼 템플릿/섹션/아이템 UI에서도 일관되게 유지하고 있고, SQL은 전부 tagged template 파라미터 바인딩이라 injection 경로 없음. 신규/변경 파일 문법 검사 통과.

## 제안 우선순위

1. 관리자 API 인증/인가 (이슈 1) — 배포 환경 접근 제한 여부 즉시 확인 포함
2. 폼 템플릿 활성화 단일 transaction화 (이슈 2)
3. copy-on-write 원자화 + 고아 섹션 승격 방지 (이슈 3)
4. PATCH name 덮어쓰기 계약 결함 (이슈 4)
5. handoff-picker 이동 (이슈 5) — 결정만 하면 되는 상태

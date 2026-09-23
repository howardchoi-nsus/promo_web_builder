# 03. 데이터 도메인 Inventory와 소유권

```yaml
status: Draft
source_commit: 3e1386a
decision_required: true
```

## 1. 도메인 분류 기준

- `CMS 후보`: 운영자가 관리하고 공개 Runtime이 읽는 비교적 안정적인 데이터
- `Internal 유지`: 편집 Transaction, 실행 상태, 재시도와 동시성 제어 데이터
- `조건부`: 운영 책임과 Write Source가 결정된 후 이전 가능
- `이전 금지`: Secret·세션·임시 UI 상태

## 2. 도메인 Inventory

| 도메인 | 주요 원본 | 변경 주체 | 변경 빈도 | 제안 분류 | 결정 상태 |
|---|---|---|---|---|---|
| Component Definition | `wizard_item_components` | 관리자·AI 승인 | 낮음 | CMS 후보 | 결정 필요 |
| Component Version | `wizard_item_component_versions` | 관리자 | 중간 | CMS 후보 | 결정 필요 |
| Component RenderSpec | Version의 `render_*` | 관리자·AI | 중간 | CMS 후보 | 결정 필요 |
| Design Token Set·Version | `promo_design_token_*` | 관리자 | 낮음 | CMS 후보 | 결정 필요 |
| Content Resource·Locale | Resource Registry | 관리자·번역 | 중간 | CMS 후보 | 결정 필요 |
| Asset Metadata | Asset Registry | 관리자·Worker | 중간 | 조건부 | 결정 필요 |
| Asset Binary | Object Storage | Worker·업로드 | 중간 | 조건부 | 결정 필요 |
| Publication·SEO | `promo_builder_publications` | 편집자 | 중간 | CMS 후보 | 결정 필요 |
| Builder Document | `promo_builder_documents` | 편집자 | 높음 | Internal 유지 | 제안 확정 필요 |
| Document Revision | `promo_builder_document_versions` | 편집자 | 높음 | Internal 유지 | 제안 확정 필요 |
| Image Analysis Source | `component_design_sources` | 관리자 | 중간 | Internal 유지 | 제안 확정 필요 |
| AI Generation Run | `component_generation_runs` | Worker | 높음 | Internal 유지 | 제안 확정 필요 |
| Component Proposal | `component_generation_proposals` | AI·관리자 | 높음 | Internal 유지 | 제안 확정 필요 |
| Prompt Template | `prompt_templates` | 관리자 | 낮음 | 조건부 | 보안 검토 필요 |
| Worker·Retry·Lease | 실행 테이블 | Worker | 매우 높음 | Internal 유지 | 제안 확정 필요 |
| Directus Config | `promo_integration_configs` | 관리자 | 낮음 | Internal 유지 | 구현됨 |
| Connection Check | `promo_integration_connection_checks` | 서버 | 중간 | Internal 유지 | 구현됨 |
| Session·Secret | Cookie·Secret Store | 시스템 | 높음 | 이전 금지 | 확정 |
| Undo·Selection·Workspace | 브라우저 | 사용자 | 매우 높음 | 이전 금지 | 확정 |

## 3. 소유권 Matrix 작성 양식

도메인별로 아래 항목을 승인해야 한다.

| 항목 | 값 |
|---|---|
| Business Owner | 결정 필요 |
| Technical Owner | 결정 필요 |
| Current Source of Truth | PostgreSQL |
| Target Source of Truth | 결정 필요 |
| Runtime Reader | 결정 필요 |
| Writer | 결정 필요 |
| Version Strategy | 결정 필요 |
| Delete Policy | 결정 필요 |
| Audit Retention | 결정 필요 |
| Migration Window | 결정 필요 |

## 4. 데이터 민감도

| 분류 | 예 | 문서·로그 기록 |
|---|---|---|
| Public | 게시 제목·공개 Asset URL | 허용 |
| Internal | Draft·Revision·검증 결과 | 제한 |
| Confidential | 사용자 식별자·운영 오류 원문 | Masking 필요 |
| Secret | Token·API Key·Session Secret | 기록 금지 |

## 5. Migration 우선순위 제안

1. Read-only 기준 데이터: Component, Design Token
2. 공개 콘텐츠: Resource·Locale, Publication Metadata
3. Asset Metadata와 File Mapping
4. Runtime Shadow Read
5. 승인된 도메인의 Source Cutover

편집 중 Document, AI Run, Proposal은 초기 Migration 범위에 포함하지 않는다.


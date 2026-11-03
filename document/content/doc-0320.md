# Promo Web Builder Directus 연동·DB Migration 통합 가이드

```yaml
status: Draft
document_type: Consolidated Guide
owner: Promo Web Builder 개발팀
reviewers: [Product, Backend, Data, DevOps, Security, QA]
source_commit: 3e1386a
baseline_date: 2026-09-22
consolidated_date: 2026-09-28
target_environments: [development, preview, production]
decision_required: true
execution_allowed: false
```

## 1. 문서 목적

이 문서는 Promo Web Builder의 내부 시스템·Directus 연동과 PostgreSQL 데이터 마이그레이션을 협의하고 실행하기 위해 작성된 11개 문서의 핵심 내용을 하나로 통합한 개발자 공유 문서다.

다음 내용을 한 문서에서 확인할 수 있도록 구성한다.

- 현재 시스템과 Directus 구현 범위
- 목표 연동 아키텍처와 시스템 경계
- 이전 대상·유지 대상 데이터
- Directus Collection·Field·Relation 초안
- API·Config·Secret·권한 계약
- Migration 실행 순서와 중단 조건
- 데이터 검증과 Shadow Read 합격 기준
- Cutover·Rollback·운영 대응 절차
- 미결정 사항, 위험, 잔여 개발 Roadmap

이 문서는 현재 `Draft`이며 Directus Schema 생성, 데이터 이전 또는 Runtime Source 전환을 승인하지 않는다.

## 2. 핵심 결론

현재 Promo Web Builder의 운영 데이터 원본은 PostgreSQL이다. Directus 관련 구현은 환경별 설정 관리, Health·인증 연결 검사, 1차 Schema Manifest, Migration 계획·대사·Rollback 기반, Source Router와 Cutover Readiness Gate까지 완료됐다. Directus Collection 생성, 실제 데이터 Write, Domain Adapter 연결과 Runtime Read·Write는 실행되지 않았다.

연동은 기존 시스템을 즉시 교체하는 방식이 아니라 다음 단계로 진행한다.

```text
연동 정책·소유권 결정
  → Schema Mapping 승인
  → Development Schema·도구 구현
  → Preview Dry Run·Migration
  → 데이터 대사
  → Shadow Read
  → 도메인별 Read Cutover
  → 안정화 후 제한적 Write 검토
```

초기 권장 범위는 Component와 Design Token을 Read-only로 이전하는 것이다. Builder Document, 편집 Revision, AI 실행 데이터, Worker 상태는 PostgreSQL에 유지한다.

## 3. 현재 기준선

### 3.1 구현된 기능

| 영역 | 구현 내용 |
|---|---|
| 디자인 분석 | 외부 이미지 등록, AI 복수 Component 후보 분석, Source Region·Field·RenderSpec·Responsive Spec 생성 |
| Component 생성 | RenderSpec 검증·안전 보정, 선택 후보 일괄 Draft 생성 |
| 편집 환경 | Component·Section DOM Workbench, Single Live Preview, Desktop·Mobile 품질 확인 |
| 게시 | Builder Revision 고정, Slug·Locale·SEO·상태 관리, 게시 Quality Gate |
| Nuxt Runtime | SSR 공개 페이지, 서명 Preview Token, Cache 갱신, Runtime Compatibility Manifest |
| Directus 기반 | Config Version, Secret Reference, Timeout·Retry, HTTPS·Host Allowlist, Health·Auth 검사, 결과 저장 |

### 3.2 현재 데이터 흐름

```text
관리자·편집자
  → Admin / Promo Builder / Visual Editor
  → PostgreSQL Builder Document·Revision
  → Publication이 Revision 고정
  → Publication API
  → Nuxt SSR Runtime
  → 공개 프로모션
```

```text
관리자 설정
  → promo_integration_configs
  → URL·Host·Secret Reference 검증
  → Directus Health·Auth 검사
  → promo_integration_connection_checks
```

두 번째 흐름은 연결 가능성만 확인하며 Collection 생성, 콘텐츠 조회·수정 또는 Migration을 수행하지 않는다.

### 3.3 현재 Source of Truth

| 도메인 | 현재 원본 | 비고 |
|---|---|---|
| Component Definition·Version·RenderSpec | PostgreSQL | 활성 Version과 Draft 분리 |
| Design Token | PostgreSQL | Version 기반 |
| Builder Document·Revision | PostgreSQL | 편집 충돌과 Revision 관리 |
| Publication·SEO | PostgreSQL | Slug·Locale별 Revision 고정 |
| AI Run·Proposal | PostgreSQL | 실행 추적 데이터 |
| Directus Config·Connection Check | PostgreSQL | 연결 정보와 검사 결과만 저장 |
| 이미지 Binary | Object Storage | DB에는 Metadata·Storage Key 저장 |
| Secret | 배포 환경 Secret Store | DB에는 `env:*` 참조만 저장 |

### 3.4 현재 비지원 범위

- Directus Collection·Field·Relation 자동 생성
- PostgreSQL → Directus 데이터 복사
- Asset Binary 이전
- Directus Adapter 기반 Runtime Read·Write
- PostgreSQL·Directus Shadow Compare
- 도메인별 Cutover와 양방향 동기화

기준 DB Migration은 `066`~`071`이며, 실제 환경별 적용 여부는 별도로 확인해야 한다.

## 4. 목표 아키텍처

### 4.1 설계 원칙

1. Nuxt와 Visual Editor는 Directus 원본 응답을 직접 사용하지 않는다.
2. PostgreSQL Adapter와 Directus Adapter는 동일한 Domain Contract를 반환한다.
3. 편집 Transaction, AI Job, Retry, Lease는 PostgreSQL에 유지한다.
4. Directus 장애는 Builder 편집이나 기존 공개 페이지 장애로 전파되지 않아야 한다.
5. 전체 시스템이 아니라 도메인 단위로 Read Source를 전환한다.
6. 각 도메인의 Write Source는 한 시점에 하나만 허용한다.
7. Migration, Shadow Read, Cutover는 독립된 승인 단계로 운영한다.

### 4.2 단계별 구조

```text
Phase 0  현재
Builder → PostgreSQL → Publication API → Nuxt Runtime
Admin → Integration Config → Directus 연결 검사

Phase 1  Schema·Migration 준비
PostgreSQL → Export·Normalize → Migration Staging → Directus
Runtime Read Source는 PostgreSQL 유지

Phase 2  Shadow Read
Domain Query → PostgreSQL Adapter ─┐
                                  ├→ Normalize → Diff
             → Directus Adapter ──┘
사용자 응답은 PostgreSQL 결과 사용

Phase 3  도메인별 Cutover
Domain Query → Source Router
                ├→ Directus Adapter: 승인된 도메인
                └→ PostgreSQL Adapter: 나머지·Fallback
```

### 4.3 필요한 논리 컴포넌트

| 컴포넌트 | 책임 | 상태 |
|---|---|---|
| Integration Config | 환경별 연결·정책 Version | 연결 범위 구현 |
| Directus Client | 인증, Timeout, Retry, 응답 크기 제한 | 연결 검사 범위 구현 |
| Domain Source Router | 도메인별 Read Source 선택 | 기반 구현, Adapter 연결 필요 |
| Internal Adapter | PostgreSQL 데이터를 공용 계약으로 정규화 | 미구현 |
| Directus Adapter | Directus 데이터를 공용 계약으로 정규화 | 미구현 |
| Migration Exporter | Snapshot, 정규화, Checkpoint | 계획 계약 구현, DB Exporter 필요 |
| Migration Writer | 멱등 Upsert, Relation 연결 | 미구현 |
| Reconciliation | Count, Hash, Relation Diff | Snapshot 기반 구현, 환경 실행 필요 |
| Cutover Controller | 승인된 Source 전환과 즉시 복귀 | Readiness Gate 구현, 활성화 연결 필요 |

Runtime에는 `PublishedPromotion`, Component Definition·활성 Version, RenderSpec v1, Design Token Version, Content Resource·Locale, Asset Metadata·Public URL만 공용 계약으로 노출한다. Directus Field 이름, Relation Payload, File ID는 Adapter 외부로 노출하지 않는다.

## 5. 데이터 도메인과 이전 범위

### 5.1 분류

| 분류 | 대상 | 초기 방향 |
|---|---|---|
| CMS 1차 후보 | Component Definition·Version·RenderSpec, Design Token Set·Version | Read-only Migration 권장 |
| CMS 후속 후보 | Content Resource·Locale, Publication·SEO | Snapshot 전략 결정 후 진행 |
| 조건부 | Asset Metadata·Binary, Prompt Template | Infra·보안 정책 확정 후 진행 |
| PostgreSQL 유지 | Builder Document·Revision, 분석 Source, AI Run·Proposal, Worker·Retry·Lease | 초기 Migration 제외 |
| 이전 금지 | Session, Secret, 브라우저 Undo·Selection·Workspace | Directus에 저장하지 않음 |

### 5.2 도메인별 필수 소유권

각 이전 후보는 다음 항목을 승인받아야 한다.

| 항목 | 현재 상태 |
|---|---|
| Business Owner·Technical Owner | 결정 필요 |
| Target Source of Truth | 결정 필요 |
| Runtime Reader·Writer | 결정 필요 |
| Version Strategy | 결정 필요 |
| Delete Policy | 결정 필요 |
| Audit Retention | 결정 필요 |
| Migration Window | 결정 필요 |

### 5.3 데이터 민감도

- 공개 데이터: 게시 제목, 공개 Asset URL은 문서·로그 기록 가능
- 내부 데이터: Draft, Revision, 검증 결과는 제한적으로 기록
- 기밀 데이터: 사용자 식별자, 운영 오류 원문은 Masking
- Secret: Token, API Key, Session Secret은 문서·DB·응답·로그 기록 금지

## 6. Directus Schema 초안

### 6.1 Collection 후보

| Collection 제안 | 목적 | 초기 범위 |
|---|---|---:|
| `promo_components` | Component 식별과 상태 | 후보 |
| `promo_component_versions` | 불변 Version과 RenderSpec | 후보 |
| `promo_design_token_sets` | Token Set Metadata | 후보 |
| `promo_design_token_versions` | 활성 Token Snapshot | 후보 |
| `promo_content_resources` | Locale별 운영 콘텐츠 | 후보 |
| `promo_assets` | 공개 Asset Metadata | 후속 |
| `promo_publications` | Slug·Locale·SEO·Revision 참조 | 후보 |

Collection 이름은 제안이며 승인 전 생성하지 않는다.

### 6.2 공통 필드 원칙

| 필드 | 원칙 |
|---|---|
| `id` | 가능하면 Source UUID 유지 |
| `status` | Source Enum과 명시적으로 매핑 |
| `source_revision` | 원본 Version·Revision 보존 |
| `source_updated_at` | UTC로 보존 |
| `migration_batch_id` | Migration 실행 추적 |
| `content_hash` | 정규화 Payload SHA-256 |

Component Version은 Field Schema, Render Contract Version, Render Tree, Responsive, Accessibility, Validation 정보를 포함한다. Raw HTML, Script, Event Handler, 임의 CSS는 허용하지 않는다.

Publication은 Slug·Locale·상태·Document ID·고정 Revision·SEO·Manifest·Cache 정책을 포함한다. Publication Snapshot을 Directus에 복제하지 않으면 Directus 단독 Runtime Read가 불가능하므로 저장 위치를 먼저 결정해야 한다.

### 6.3 Relation 생성 순서

```text
Component
  → Component Version
  → Version → Component Relation
  → Component → Active Version Relation
  → Token Set
  → Token Version
  → Resource·Asset
  → Publication
```

순환 참조를 피하기 위해 최초 Migration에서는 `active_version`을 비워 두고 Version 이전 후 연결한다.

### 6.4 Schema 승인 조건

- Collection별 Business Owner 지정
- Field Type, 최대 길이, Required·Null 정책 확정
- Unique·Index 요구사항 확정
- Relation과 Restrict·Set Null·Soft Delete 정책 확정
- Permission Matrix 승인
- Sample Payload 10건 이상 변환 검증
- Schema Snapshot Export와 Version ID 기록

## 7. API·Config·보안 계약

### 7.1 현재 API

| API | 목적 |
|---|---|
| `/api/directus-integration-config` | Config 조회, Draft, 검증, 활성, 중지 |
| `/api/directus-connection-test` | Directus Health·인증 검사 |
| `/api/promo-publications` | 게시 이력, 저장, 상태 변경 |
| `/api/promo-publication` | Nuxt 공개 Publication 조회 |
| `/api/promo-publication-preview-token` | 단기 Preview Token 발급 |
| `/api/promo-publication-preview` | 미게시 Revision Preview |
| Nuxt `/api/revalidate-promotion` | Promotion Cache 제거 |

### 7.2 Feature Flag

현재 Flag:

| 환경변수 | 기본값 | 역할 |
|---|---:|---|
| `DIRECTUS_CONFIG_MANAGEMENT_ENABLED` | `true` | Config API·UI |
| `DIRECTUS_INTEGRATION_ENABLED` | `false` | Directus Master Switch |
| `DIRECTUS_CONNECTION_TUNNEL_ENABLED` | `false` | 실제 외부 연결 검사 |
| `NUXT_RUNTIME_ENABLED` | `true` | Publication API 사용 |
| `NUXT_SSR_ENABLED` | `true` | Nuxt SSR |

후속 구현 Flag:

```text
DIRECTUS_MIGRATION_ENABLED
DIRECTUS_SHADOW_READ_ENABLED
DIRECTUS_RUNTIME_READ_ENABLED
DIRECTUS_RUNTIME_WRITE_ENABLED
```

### 7.3 Config·Secret 규칙

- Directus URL은 HTTPS 사용. 비호스팅 로컬 환경만 localhost HTTP 허용
- Credential·Query·Fragment를 포함한 URL 금지
- 외부 Host는 `DIRECTUS_ALLOWED_HOSTS` 등록
- Secret Reference는 `env:DIRECTUS_SECRET_*` 형식
- Timeout 1,000~15,000ms, Retry 0~2회
- Redirect 금지, 최대 응답 256KB
- Connection Reader, Runtime Reader, Migration Writer, Schema Admin Token 분리
- Secret 원문은 브라우저, DB, API 응답, 로그에 노출하지 않음

연결 검사 성공은 Collection 생성, 데이터 Migration, Runtime Source 변경을 의미하지 않는다.

### 7.4 권한 원칙

| 역할 | Data Read | Data Write | Schema Write |
|---|---:|---:|---:|
| Connection Reader | `/users/me` 최소 범위 | N | N |
| Runtime Reader | Y | N | N |
| Migration Writer | Y | Y | N |
| Schema Admin | Y | Y | Y |

## 8. Migration 실행 계획

### 8.1 실행 전 조건

- Source Commit과 DB 환경·Branch 고정
- Migration `066`~`071` 적용 확인
- 원본 DB Backup 또는 Neon Branch 생성
- Directus Project와 Schema Version 고정
- Schema Mapping 승인
- Reader·Writer·Schema Admin Secret 분리
- Preview Dry Run 승인
- Maintenance Window와 Rollback 담당자 확정

### 8.2 실행 단계

| 단계 | 작업 | 주요 산출물 |
|---|---|---|
| M0 Inventory | Count, 상태, Timestamp, Null, 중복, 고아 Relation, Hash 조사 | Source Snapshot |
| M1 Schema | Development → Preview → Production 순서로 승인 Schema 적용 | Schema Version·Diff |
| M2 Dry Run | 실제 쓰기 없이 변환·제외·충돌·Relation 계획 생성 | Dry-run Report |
| M3 Migration | Component부터 Publication까지 의존 순서로 Upsert | Batch Record |
| M4 Relation | Parent·Child 생성 후 Relation 연결 | Relation Report |
| M5 Catch-up | `updated_at`과 Hash 기반 증분 이전 | Delta Batch |
| M6 Reconciliation | Count·Hash·Relation·Runtime 결과 비교 | Validation Evidence |

Migration 권장 순서는 다음과 같다.

```text
Component Definition
→ Component Version
→ Active Version Relation
→ Design Token Set
→ Design Token Version
→ Resource·Locale
→ Asset Metadata
→ Publication
```

### 8.3 멱등성과 변환 규칙

- Upsert Key는 Source UUID 또는 승인된 Stable Key 사용
- Source Revision과 Content Hash가 같으면 Write 생략
- Target Revision이 더 최신이면 덮어쓰지 않고 Conflict 기록
- Relation은 Set 단위로 비교
- 재실행 시 새 ID를 만들지 않음
- Timestamp는 UTC ISO-8601, Locale은 승인된 BCP 47 형식 사용
- JSONB는 Stable Key 정렬 후 Hash 생성
- 미승인 Enum, 잘못된 URL·UUID, RenderSpec 검증 실패는 실행 실패 처리

### 8.4 즉시 중단 조건

- Source·Target 환경 식별 불일치 또는 Backup 미확인
- 예상 범위를 벗어난 삭제·갱신
- 필수 Relation 누락 또는 중복 Key 증가
- RenderSpec·Token Contract 오류
- Directus 401·403 또는 권한 범위 이상
- 실패율이 승인 임계치 초과
- Migration 중 Source 변경 정책 위반

## 9. 데이터 검증과 Shadow Read

Migration 완료와 데이터 정확성 확인은 별개의 단계다. 다음 계층을 모두 검증하고 Blocking Diff가 남아 있으면 Cutover하지 않는다.

| 검증 계층 | 핵심 내용 |
|---|---|
| Schema | Collection, Field, Type, Required, Unique |
| Count | 전체·상태별·Locale별 건수 |
| Identity | UUID·Stable Key 일치 |
| Field | 필수값, Enum, Timestamp, Null |
| Relation | Parent·Child, Active Version |
| Payload | JSON, RenderSpec, Token Hash |
| Asset | URL, File ID, Checksum |
| Runtime | 두 Adapter의 정규화 결과 비교 |
| Visual | 대표 Promotion Desktop·Mobile |
| Performance | Latency, Timeout, Payload Size |

기본 합격 조건:

- 필수 레코드 누락 0건
- 중복 Stable Key 0건
- 필수 Relation 누락 0건
- Contract Validation 실패 0건
- Secret 노출 0건
- 공개 Runtime 핵심 Field Diff 0건
- 비필수 Field Diff는 사전 승인된 목록만 허용
- Directus P95 Latency와 Fallback 비율은 Preview 측정 후 기준 확정

Shadow Read에서는 동일 Query를 PostgreSQL Adapter와 Directus Adapter에 전달하고 Stable JSON으로 비교한다. 사용자에게는 PostgreSQL 결과만 반환하며 Directus Diff는 Metric과 제한된 Evidence Store에 기록한다.

대표 검증 시나리오는 Component·활성 Version 조회, RenderSpec 렌더링, Token 적용, Locale Resource, Published SSR, Unpublished 410, Asset 표시, Directus 장애 Fallback, Revision 변경 후 Cache 갱신이다.

## 10. Cutover와 Rollback

### 10.1 승인 Gate

| Gate | 통과 조건 | 다음 단계 |
|---|---|---|
| G0 Baseline | Source·Owner·범위 승인 | Schema 설계 |
| G1 Schema | Mapping·Permission 승인 | Development 생성 |
| G2 Dry Run | 변환 오류·충돌 해결 | Preview Migration |
| G3 Reconciliation | Blocking Diff 0 | Shadow Read |
| G4 Shadow Read | 오류율·Latency 기준 통과 | Read Cutover |
| G5 Production Read | 안정화 기간 통과 | Write 검토 |
| G6 Write | 충돌·Rollback 정책 승인 | 제한적 Write |

### 10.2 Read Cutover

```text
1. 대상 Domain과 Config Version 고정
2. Shadow Read Metric 최종 확인
3. Domain Read Policy 활성화
4. Cache 무효화
5. 대표 Query Smoke Test
6. 오류율·Latency·Fallback 관찰
7. 승인 시간까지 모니터링
8. 성공 기록 또는 Rollback
```

현재 `DIRECTUS_RUNTIME_READ_ENABLED`와 Domain Policy는 구현되지 않아 이 절차를 실행할 수 없다.

### 10.3 Rollback 조건과 절차

연결 실패 지속, 401·403, Schema 불일치, Blocking Diff, Relation 오류, P95 초과, 공개 오류 증가, Asset·SEO 손실, Cache 실패가 발생하면 Rollback한다.

```text
1. Directus Runtime Read OFF
2. Domain Source를 Internal Adapter로 복귀
3. 공개 Cache 무효화
4. 대표 페이지와 API 확인
5. 장애·복구 시각 기록
6. Directus Write가 있었다면 변경분 Freeze
7. Source·Target Diff 추출
8. 재Cutover 금지 상태 설정
```

Write 전환은 Single Writer, Optimistic Lock, 재처리·멱등성, 역동기화, 삭제·Archive, Audit 정책까지 승인된 이후 별도로 진행한다.

## 11. 운영·모니터링·장애 대응

필수 관측 항목은 Health 성공률, 인증 오류, Adapter 오류·Timeout, Runtime P50·P95·P99, Fallback 비율, Shadow Diff, Migration 처리 건수, Cache 갱신, Publication 404·410·5xx다.

로그에는 Request ID, Config Version, Domain, HTTP Status, Error Code, Duration, Batch ID, Hash·Count Summary만 기록한다. Token, Authorization Header, Cookie, Prompt 원문, 개인정보, Asset Binary는 기록하지 않는다.

| 장애 | 기본 대응 |
|---|---|
| DNS·TLS·Timeout | Directus 경로 차단, Internal 유지 |
| Token 만료·Role 변경 | Runtime Directus Read OFF |
| Field·Relation 누락 | Adapter 차단, Schema 복구 |
| 누락·중복·Hash Diff | Cutover 중단, Batch 조사 |
| 느린 Query·큰 Payload | Query 제한, Index, Cache 검토 |
| Asset 404·권한 오류 | 기존 Public URL Fallback |
| Contract 실패 | 해당 데이터 격리 |

정기 운영 항목은 Token Rotation, Allowed Host 검토, Config Version 검토, Schema Drift 검사, Shadow Diff 추세 확인, Migration 계정 비활성화, Archived Data 보존 정책, Backup·Restore Drill이다.

## 12. 필수 의사결정

| ID | 결정 항목 | 권장 출발점 | 상태 |
|---|---|---|---|
| DEC-01 | 1차 Directus 도메인 | Component·Token Read-only | Open |
| DEC-02 | Source of Truth | 도메인별 단일 원본 | Open |
| DEC-03 | ID 정책 | Source UUID 유지 | Open |
| DEC-04 | Component Field Schema | 초기 JSON 유지 후 검토 | Open |
| DEC-05 | Publication Snapshot | Runtime 목표에 따라 결정 | Open |
| DEC-06 | Asset 전략 | 기존 URL 유지 후 별도 이전 | Open |
| DEC-07 | Locale 모델 | 기존 String 유지 후 확장 | Open |
| DEC-08 | Archived 데이터 | 초기 Migration 제외 | Open |
| DEC-09 | Runtime Fallback | 항상 Internal Fallback | Open |
| DEC-10 | Write 지원 | Read-only 우선 | Open |

추가로 Runtime Router 배포 위치, Cache 허용 시간, Source별 Audit 보존 기간, Directus System Field와 Source Timestamp 우선순위, 삭제 정책을 결정해야 한다.

## 13. 주요 위험과 대응

| 위험 | 예방 | 복구 |
|---|---|---|
| Schema Mapping 오류 | Sample, Dry Run, 공동 승인 | Target 정리 후 재실행 |
| UUID 변경 | Source UUID 유지 | Mapping Table 복구 |
| JSON 구조 손실 | Stable Hash 비교 | Source 재Migration |
| Directus 권한 과다 | 역할 분리, 최소 권한 | Token 폐기, 감사 |
| Dual Write 충돌 | Single Writer | Write 중지, 데이터 대사 |
| Asset 이전 실패 | Checksum, 기존 URL Fallback | 기존 URL 복귀 |
| Runtime Latency | Cache, Timeout, Fallback | Directus Read OFF |
| Schema Drift | Version 고정, Drift 검사 | 승인 Schema 복원 |
| Migration 중 Source 변경 | Catch-up, Freeze 정책 | Delta 재실행 |

## 14. 실행 Roadmap과 잔여 개발

### Phase A — 협의·기준선

- Data Owner와 승인자 지정
- 1차 도메인과 Source of Truth 결정
- 환경별 DB Inventory와 Migration 적용 상태 확인
- Schema Mapping과 Permission Matrix 승인

완료 기준: G0·G1

### Phase B — 개발 환경 구현

- Versioned Schema Manifest
- Internal·Directus Adapter와 Domain Source Router
- Migration Exporter·Writer
- Reconciliation 도구
- Development Sample Migration

완료 기준: G2

### Phase C — Preview 검증

- Full Migration과 Incremental Catch-up
- Count·Hash·Relation 대사
- Shadow Read
- Runtime·Visual·성능 E2E

완료 기준: G3·G4

### Phase D — Production 데이터 준비

- Backup·Restore 검증
- Production Schema 적용
- Full·Incremental Migration
- Reconciliation 승인
- Runtime Read OFF 상태로 안정화

### Phase E — 도메인별 Cutover

- 위험이 낮은 Read-only 도메인부터 전환
- Metric과 Fallback 관찰
- 안정화 후 다음 도메인 진행
- Runtime Write는 별도 승인

## 15. 착수 전 확인표

### 기준선

- [ ] Preview·Production 배포 Commit 기록
- [ ] 환경별 Migration `066`~`071` 적용 확인
- [ ] 실제 PostgreSQL Object 수 조사
- [ ] Directus가 현재 Runtime 경로에 없음을 확인

### 책임과 정책

- [ ] Product, Backend, Data, DevOps, Security, QA 담당자 지정
- [ ] DEC-01~DEC-10 승인
- [ ] 도메인별 Business·Technical Owner 지정
- [ ] Single Writer와 Fallback 정책 승인

### Schema와 보안

- [ ] Directus Project·환경·Schema Version 고정
- [ ] Field·Relation·Index·삭제 정책 승인
- [ ] 환경별 Host Allowlist 승인
- [ ] Reader·Writer·Admin 최소 권한과 Secret Rotation 확인

### 실행과 복구

- [ ] Source Backup 또는 Neon Branch 생성
- [ ] Preview Dry Run과 Sample Payload 검증
- [ ] Reconciliation 임계치 승인
- [ ] Maintenance Window·Rollback 담당자 지정
- [ ] Dashboard·Alert·Evidence 저장 위치 준비

## 16. 승인 기록

| 역할 | 승인 범위 | 담당자 | 상태 | 일자 |
|---|---|---|---|---|
| Product Owner | 대상 도메인·운영 정책 |  | Pending |  |
| Backend Lead | API·Adapter·Domain Contract |  | Pending |  |
| Data Owner/DBA | Schema·Migration·대사 |  | Pending |  |
| DevOps/SRE | 환경·Secret·Cutover·Monitoring |  | Pending |  |
| Security | 권한·Token·Network |  | Pending |  |
| QA | E2E·합격 기준 |  | Pending |  |

## 17. 원본 세부 문서

이 통합본은 다음 문서의 핵심 내용을 요약한다. 세부 Mapping, 실행 기록 양식, Evidence 형식은 원본을 기준으로 관리한다.

1. `README.md` — 패키지 목적과 관리 규칙
2. `01-overview-and-current-baseline.md` — 현행 기준선
3. `02-target-integration-architecture.md` — 목표 아키텍처
4. `03-data-domain-inventory-and-ownership.md` — 데이터 분류와 소유권
5. `04-directus-schema-mapping-draft.md` — Schema Mapping
6. `05-api-config-and-security-contract.md` — API·Config·보안 계약
7. `06-database-migration-runbook.md` — Migration 실행 절차
8. `07-validation-and-reconciliation-plan.md` — 검증·대사 계획
9. `08-cutover-and-rollback-runbook.md` — 전환·복구 절차
10. `09-operations-monitoring-and-incident-response.md` — 운영·장애 대응
11. `10-decisions-risks-and-execution-roadmap.md` — 결정·위험·Roadmap

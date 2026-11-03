# 프로모션 빌더 디자인 지식 플랫폼 선행 구성 세부 계획안

## 0. 문서 목적

이 문서는 다음 첫 번째 제품 흐름을 구현하기 전에 반드시 완료해야 할 선행 구성을 세분화한다.

```text
Screenshot 등록
→ Section·Component·Layout·Style 분석
→ 기존 Component 자동 매칭
→ Component·Layout·Style Draft 생성
→ 관리자 검수·승인
→ 프로모션 빌더 적용
```

선행 구성 단계에서는 실제 Vision 모델을 제품 경로에 연결하거나 최종 관리자 UI를 완성하지 않는다. 먼저 데이터 의미, Registry 호환성, 상태·권한·재시도, 분석 결과 계약, Component Proposal 계약과 검증 기준을 확정한다.

관련 문서:

- `docs/계획/promo-builder-productization-and-design-reference-platform-development-plan-2026-08-31.md`
- `docs/계획/promo-builder-productization-task-oriented-roadmap-2026-09-02.md`
- `docs/계획/admin-design-intelligence-settings-control-plane-development-plan-2026-09-02.md`

---

## 1. 선행 구성 완료 목표

선행 구성은 다음 질문에 코드와 문서로 답할 수 있을 때 완료한다.

1. 현재 어떤 Section, Component, Field, Style Slot, Layout Preset, Token을 재사용할 수 있는가?
2. Screenshot 분석 결과를 어떤 JSON 계약으로 저장할 것인가?
3. 기존 Component와 신규 분석 Component를 어떤 기준으로 매칭할 것인가?
4. 어떤 경우에 Variant, 조합, 신규 Component Draft를 제안할 것인가?
5. AI가 생성할 수 있는 것은 무엇이며 자동 활성화할 수 없는 것은 무엇인가?
6. 원본, 분석, Evidence, Draft, 승인 Version을 어떻게 연결할 것인가?
7. 실패·중복·재시도·권한·감사·Rollback을 어떻게 처리할 것인가?
8. 어떤 테스트와 Fixture를 통과해야 실제 Vision 분석 개발을 시작할 수 있는가?

---

## 2. 선행 단계 전체 순서

```text
PRQ-01 현재 시스템·Registry 기준선
        ↓
PRQ-02 제품 정책·도메인 계약
        ↓
PRQ-03 Registry 정규화와 매칭 준비
        ↓
PRQ-04 공통 API·Job·권한·감사 기반
        ↓
PRQ-05 Design Reference 데이터 기반
        ↓
PRQ-06 분석·Component Proposal·Layout·Style 계약
        ↓
PRQ-07 검수·승인·게시 계약
        ↓
PRQ-08 Fixture·테스트·선행 Gate
        ↓
Screenshot MVP 구현 착수
```

PRQ-01의 조사 작업은 병렬 진행할 수 있다. PRQ-03과 PRQ-04도 PRQ-02의 핵심 결정이 끝난 후 병렬 진행할 수 있다. PRQ-05 이후에는 데이터 계약을 변경하지 않고 PRQ-06과 PRQ-07을 연결한다.

---

## 3. PRQ-01 — 현재 시스템과 Registry 기준선

### PRQ01-T01. 화면·Route·사용자 흐름 감사

- 목적: 신규 기능이 연결될 공식 관리자 화면과 빌더 경로를 확정한다.
- 선행 Task: 없음
- 세부 작업:
  - `prototype`, `admin-app`, `visual-editor`의 Entry와 Route를 수집한다.
  - 화면별 사용자 역할과 호출 API를 연결한다.
  - Design MD, Component 관리, Layout 관리, Token 관리 화면의 중복 여부를 확인한다.
  - 신규 Reference Library가 어느 관리자 Shell에 들어갈지 후보를 정리한다.
  - 현재 사용 중, 보완, 교체, 폐기 후보 상태를 표시한다.
- 산출물:
  - 화면·Route 인벤토리
  - 사용자 흐름 지도
  - Reference Library 진입 위치 결정안
- 완료 기준:
  - 신규 Screenshot 등록·검수 화면이 연결될 단일 관리자 경로가 지정된다.
  - 기존 화면과 중복되는 기능의 유지·전환 방안이 기록된다.

### PRQ01-T02. API·Worker·n8n 책임 감사

- 목적: Screenshot 분석과 Draft 생성에 재사용할 서버 기능과 교체할 경로를 구분한다.
- 선행 Task: 없음
- 세부 작업:
  - 전체 `/api` Endpoint와 내부 Store·Provider·Contract Helper를 수집한다.
  - n8n Workflow와 애플리케이션 API 사이 입력·출력·상태 관리 책임을 확인한다.
  - Design MD 분석, 이미지 생성, Section Design, Composition Worker의 공통 패턴을 찾는다.
  - Prompt Template, Execution Snapshot, Lease·Retry 구현의 재사용 가능성을 확인한다.
  - 동기 요청 안에서 긴 작업을 실행하는 경로를 식별한다.
- 산출물:
  - API·Worker 호출 지도
  - 재사용·통합·교체 후보 목록
  - n8n 책임 경계 임시 결정안
- 완료 기준:
  - Screenshot Upload, Analysis Job, Review API의 Owner 모듈 후보가 지정된다.
  - 공통 실행 기반에서 통합할 중복 로직이 식별된다.

### PRQ01-T03. DB·Migration 기준선 감사

- 목적: 신규 Reference 데이터 모델을 기존 데이터 손실 없이 추가할 수 있는 기준을 만든다.
- 선행 Task: 없음
- 세부 작업:
  - `design_documents`, Token, Metadata, Component Pattern, Layout Pattern, Guideline 관계를 확인한다.
  - Component Version, Component Field, Section Instance, Layout Preset, Token Version 관계를 확인한다.
  - Builder Document, Proposal, Asset Job, Prompt Snapshot의 FK와 상태를 확인한다.
  - Migration별 적용 순서와 중복 컬럼·Index·Constraint를 점검한다.
  - 기존 Design MD를 Reference Source에 연결할 Backfill 범위를 산정한다.
- 산출물:
  - AS-IS ER 관계 요약
  - 신규 테이블 연결 지점
  - Migration 위험·Backfill 목록
- 완료 기준:
  - 신규 FK가 연결될 기존 Version Entity가 확정된다.
  - 기존 Design MD의 데이터 보존·호환 방안이 문서화된다.

### PRQ01-T04. Component Registry 준비도 감사

- 목적: Screenshot 분석 결과를 매칭할 현재 Component Registry의 품질과 누락을 측정한다.
- 선행 Task: 없음
- 세부 작업:
  - 활성 Component와 Version별 Role, Field, Style Slot, Policy를 수집한다.
  - 단일 Field Component와 복합 Component를 구분한다.
  - Field Key, Field Kind, Image·CTA Policy의 일관성을 검사한다.
  - Component 이름이 아니라 구조로 매칭할 수 있는 정보가 충분한지 확인한다.
  - Desktop·Mobile Preview Fixture가 있는지 확인한다.
  - 중복 Component, 사실상 Variant인 Component, 특정 Template 종속 Component를 식별한다.
- 산출물:
  - Component Registry Catalog
  - 중복·누락·정규화 필요 목록
  - 자동 매칭 준비도 보고서
- 완료 기준:
  - 자동 매칭에 사용할 Canonical Component 속성이 결정된다.
  - 정규화 없이는 매칭할 수 없는 Component가 목록화된다.

### PRQ01-T05. Section·Layout·Token Registry 준비도 감사

- 목적: Screenshot의 Section, Layout, Style 분석 결과를 실행 데이터로 변환할 현재 기반을 점검한다.
- 선행 Task: 없음
- 세부 작업:
  - Section Role, Composition Scope, Required Policy를 수집한다.
  - Layout Preset의 Desktop·Mobile Geometry와 Contract Version을 확인한다.
  - Layout Variant 이름·설명·Selection Metadata의 일관성을 검사한다.
  - Token Set의 Role, Alias, Version, Style Slot 연결을 확인한다.
  - Section Layout과 Component 내부 Layout의 경계를 확인한다.
- 산출물:
  - Section·Layout·Token Catalog
  - Layout·Token 정규화 필요 목록
  - Pattern-to-Preset 변환 가능성 보고서
- 완료 기준:
  - Screenshot Layout Pattern을 매핑할 실행 Contract가 확정된다.
  - Style Profile에 연결할 Token Role과 누락 항목이 식별된다.

### PRQ01-T06. 테스트·품질 기준선

- 목적: 선행 구성 변경 전후의 회귀 여부를 판단할 기준을 만든다.
- 선행 Task: PRQ01-T01, PRQ01-T02
- 세부 작업:
  - 현재 단위·계약·통합·Browser Test를 분류한다.
  - Component, Layout, Token, Design MD, Builder E2E의 미검증 영역을 기록한다.
  - Template Mode와 AI Mode의 필수 Smoke 흐름을 확정한다.
  - Desktop 1440과 Mobile 390의 대표 Snapshot을 확보한다.
- 산출물:
  - 테스트 인벤토리
  - 현재 실패와 미검증 목록
  - 배포 차단 회귀 시나리오
- 완료 기준:
  - 신규 Migration과 Registry 정규화 후 반드시 다시 실행할 Test가 지정된다.

### PRQ-01 종료 Gate

- 공식 관리자·빌더 경로가 결정됐다.
- API·Worker·n8n 책임 지도가 작성됐다.
- 신규 데이터 모델의 연결 지점이 확인됐다.
- Component·Section·Layout·Token Registry 준비도가 측정됐다.
- 핵심 회귀 기준선이 확보됐다.

---

## 4. PRQ-02 — 제품 정책과 도메인 계약

### PRQ02-T01. Design Reference 용어와 Entity 경계

- 목적: 기획·개발·운영이 동일한 데이터 의미를 사용하게 한다.
- 선행 Task: PRQ-01 Gate
- 세부 작업:
  - Reference Source, Capture, Analysis Run, Evidence, Review, Proposal, Profile, Publish를 정의한다.
  - Design MD, Screenshot, URL의 공통점과 입력별 차이를 정의한다.
  - 분석 Pattern과 실행 Component·Layout·Token을 구분한다.
  - Draft, Approved, Published의 차이를 정의한다.
- 산출물:
  - 도메인 용어 사전
  - Entity 책임과 관계 문서
- 완료 기준:
  - 같은 용어가 DB·API·UI에서 서로 다른 의미로 사용되지 않는다.

### PRQ02-T02. 자동 생성 허용·금지 정책

- 목적: AI가 생성할 수 있는 범위와 반드시 사람 승인이 필요한 범위를 확정한다.
- 선행 Task: PRQ02-T01, PRQ01-T04
- 세부 작업:
  - AI는 Analysis Draft와 Component Proposal만 생성하도록 제한한다.
  - Vue, HTML, CSS, JavaScript 자유 생성과 자동 실행을 금지한다.
  - 기존 Component 재사용, 설정, Variant, 조합, 신규 Draft의 우선순위를 확정한다.
  - Component, Layout, Style의 자동 활성화를 금지한다.
  - 관리자 승인 후 Registry Version 게시 조건을 정의한다.
- 산출물:
  - AI 생성 경계 정책
  - Reuse Decision 우선순위
  - 자동 Publish 금지 규칙
- 완료 기준:
  - AI 결과가 운영 Registry를 직접 변경할 수 없는 계약이 승인된다.

### PRQ02-T03. 검수·승인·권리 정책

- 목적: 외부 디자인의 분석 결과와 권리 상태를 안전하게 운영한다.
- 선행 Task: PRQ02-T01
- 세부 작업:
  - Viewer, Editor, Reviewer, Admin 역할을 정의한다.
  - 등록자와 승인자 분리 여부를 결정한다.
  - Pattern 참고와 원본 Asset 재사용 권한을 분리한다.
  - 로고, 상표, 카피, 인물, 개인정보 처리 기준을 정한다.
  - 승인 필수 항목, 거절 사유, Archive, 삭제 요청 정책을 정한다.
- 산출물:
  - Role Matrix
  - Review Policy
  - Rights·Retention Policy
- 완료 기준:
  - 승인되지 않은 데이터와 권리 미확인 Asset의 사용 차단 기준이 확정된다.

### PRQ02-T04. Version·호환·삭제 정책

- 목적: 재분석과 Registry 변경 후에도 과거 결과를 재현하고 안전하게 전환한다.
- 선행 Task: PRQ02-T01, PRQ02-T03
- 세부 작업:
  - Capture, Analysis, Proposal, Approved Profile, Component Version 관계를 정의한다.
  - 재분석 시 기존 승인 Version 유지·대체 방식을 정한다.
  - 기존 Builder Snapshot이 삭제·Archive된 Reference를 처리하는 방식을 결정한다.
  - 기존 Design MD API와 신규 Reference API의 호환 기간을 정한다.
- 산출물:
  - Version Lifecycle
  - 호환·Cutover 정책
  - Archive·삭제 영향 규칙
- 완료 기준:
  - 재분석이나 삭제가 기존 Builder Document를 예기치 않게 변경하지 않는다.

### PRQ02-T05. 성공 지표와 첫 MVP 범위

- 목적: 선행 구성과 첫 Screenshot MVP의 완료 범위를 고정한다.
- 선행 Task: PRQ02-T01~PRQ02-T04
- 세부 작업:
  - 첫 MVP는 Screenshot Upload, 구조 분석, 매칭, Draft, 검수까지만 포함한다.
  - URL Capture, 자동 추천, Vector 검색, 파인튜닝을 후속으로 분리한다.
  - 분석 Schema 통과율, 검수 수정률, 매칭 Coverage, Draft 승인률의 측정 방식을 정한다.
  - 운영 비용과 분석 지연의 초기 기준을 정의한다.
- 산출물:
  - MVP In/Out Scope
  - 초기 KPI 정의
  - 후속 백로그 경계
- 완료 기준:
  - 팀이 첫 Vertical Slice에 포함되지 않는 기능을 명확히 구분한다.

### PRQ-02 종료 Gate

- 도메인 용어와 Entity 경계가 승인됐다.
- 자동 생성 허용·금지 범위가 확정됐다.
- 역할·승인·권리·삭제 정책이 확정됐다.
- Version Lifecycle과 MVP 범위가 고정됐다.

---

## 5. PRQ-03 — Registry 정규화와 자동 매칭 준비

### PRQ03-T01. Canonical Component Descriptor 정의

- 목적: Component 이름이 아니라 구조와 능력으로 자동 매칭할 수 있게 한다.
- 선행 Task: PRQ01-T04, PRQ02-T02
- 세부 작업:
  - Component Role, Category, Field Signature, Capability를 정의한다.
  - Style Slot, Image Policy, CTA Policy, Placement Policy를 Canonical Descriptor에 포함한다.
  - Desktop·Mobile Layout Support와 반복 가능 여부를 정의한다.
  - Template 종속성과 재사용 범위를 표시한다.
- 산출물:
  - Canonical Component Descriptor Schema
  - 기존 Component 변환 규칙
- 완료 기준:
  - 모든 활성 Component를 같은 Descriptor로 표현할 수 있다.

### PRQ03-T02. Component Role·Field·Style Slot 정규화

- 목적: 기존 Registry의 이름과 구조 불일치를 줄인다.
- 선행 Task: PRQ03-T01
- 세부 작업:
  - Component Role과 Field Kind Allowlist를 정의한다.
  - 유사하지만 다른 Field Key와 Style Slot Alias를 정리한다.
  - 누락된 Image·CTA Policy와 접근성 속성을 식별한다.
  - 자동 수정 가능한 항목과 관리자 결정이 필요한 항목을 분리한다.
- 산출물:
  - Role·Field·Style Slot Dictionary
  - Registry 정규화 Migration 또는 Data Fix 계획
- 완료 기준:
  - 구조가 같은 Component가 단순 이름 차이 때문에 매칭 실패하지 않는다.

### PRQ03-T03. Component 중복·Variant·조합 판정 규칙

- 목적: 신규 Draft 생성 전에 기존 자산의 재사용 가능성을 판단한다.
- 선행 Task: PRQ03-T01, PRQ03-T02
- 세부 작업:
  - Exact, Configurable, Variant, Composition, No Match 판정 조건을 정한다.
  - Field 구조, Style Slot, Policy, Layout의 점수 가중치를 정의한다.
  - 신규 Component보다 Variant가 적합한 조건을 정한다.
  - 여러 Component 조합으로 표현 가능한 Section Pattern 기준을 정한다.
- 산출물:
  - Matching Score Contract
  - Reuse Decision Rule
  - 제외·경고 사유 코드
- 완료 기준:
  - 같은 입력에서 같은 매칭·재사용 판단을 재현할 수 있다.

### PRQ03-T04. Layout Contract와 변환 규칙 정규화

- 목적: Screenshot Layout Pattern을 실행 가능한 Preset Draft로 변환할 기준을 만든다.
- 선행 Task: PRQ01-T05, PRQ02-T02
- 세부 작업:
  - Container, Grid, Column, Stack, Alignment, Gap의 Canonical 표현을 정의한다.
  - Desktop·Mobile Geometry와 Component Instance 주소 방식을 확정한다.
  - 지원하지 않는 자유 Geometry와 Fallback을 정의한다.
  - Section Layout과 Component 내부 Layout의 책임을 구분한다.
- 산출물:
  - Layout Pattern Schema
  - Pattern-to-Preset Mapping Contract
  - Desktop·Mobile Validation Rule
- 완료 기준:
  - Layout Draft가 현재 `wizard_content_section_layouts` 계약으로 검증 가능하다.

### PRQ03-T05. Design Style Profile과 Token Role 정규화

- 목적: Screenshot의 디자인 스타일을 검색·재사용 가능한 구조로 저장할 기준을 만든다.
- 선행 Task: PRQ01-T05, PRQ02-T01
- 세부 작업:
  - Color, Typography, Spacing, Radius, Border, Elevation의 Semantic Role을 정한다.
  - Token Alias와 기존 Token Set 충돌 규칙을 정의한다.
  - Style Tag, Image Treatment, Responsive Rule, Guideline 구조를 정한다.
  - Component Pattern·Layout Pattern·Token Set과 Profile 관계를 정의한다.
- 산출물:
  - Design Style Profile Schema
  - Token Role Dictionary
  - Token 병합·충돌 정책
- 완료 기준:
  - 스타일을 자유 설명문이 아닌 Version 가능한 구조로 표현할 수 있다.

### PRQ03-T06. Registry Fixture와 Matching Baseline

- 목적: 자동 매칭 구현 전에 기대 결과를 고정한다.
- 선행 Task: PRQ03-T01~PRQ03-T05
- 세부 작업:
  - 대표 기존 Component와 예상 Match Case를 선정한다.
  - Exact, Variant, Composition, No Match Fixture를 만든다.
  - 대표 Layout·Token 변환 Fixture를 만든다.
  - 잘못된 자동 매칭과 과도한 신규 Draft Case를 포함한다.
- 산출물:
  - Registry Matching Fixture
  - 기대 Mapping 결과
  - 초기 Coverage 기준선
- 완료 기준:
  - Matching Engine 구현 없이도 기대 판정과 실패 조건이 합의된다.

### PRQ-03 종료 Gate

- 모든 활성 Component가 Canonical Descriptor로 표현된다.
- Role·Field·Style Slot Dictionary가 확정됐다.
- 재사용·Variant·조합·신규 Draft 판단 규칙이 고정됐다.
- Layout·Style Profile 변환 계약과 Fixture가 준비됐다.

---

## 6. PRQ-04 — 공통 API·Job·권한·감사 기반

### PRQ04-T01. 공통 API Envelope와 오류 코드

- 목적: Upload, Analysis, Review, Publish API가 같은 오류 계약을 사용하게 한다.
- 선행 Task: PRQ02-T01
- 세부 작업:
  - 성공, Validation, 권한, Not Found, Conflict, Rate Limit, Provider 실패를 정의한다.
  - 재시도 가능 여부와 사용자 메시지 필드를 정의한다.
  - Contract Fixture와 Helper를 구현한다.
- 산출물:
  - API Response Contract
  - 공통 Error Helper
  - Contract Test
- 완료 기준:
  - UI가 오류 문자열을 분석하지 않고 오류 코드로 행동을 결정한다.

### PRQ04-T02. Request ID와 구조화 로그

- 목적: Screenshot 등록부터 Draft 저장까지 하나의 실행으로 추적한다.
- 선행 Task: PRQ04-T01
- 세부 작업:
  - Request ID와 Correlation ID를 API·Worker·Provider에 전파한다.
  - Source ID, Analysis Run ID, Job ID를 로그 Context에 포함한다.
  - Authorization, Cookie, Token, 개인정보 마스킹을 적용한다.
- 산출물:
  - Logging Context Helper
  - 로그 마스킹 Test
- 완료 기준:
  - 사용자 요청과 Worker·Provider 로그를 하나의 ID로 조회할 수 있다.

### PRQ04-T03. Idempotency와 Content Hash

- 목적: 동일 Screenshot과 동일 분석 요청의 중복 처리와 비용을 방지한다.
- 선행 Task: PRQ04-T01
- 세부 작업:
  - Upload, Capture, Analysis별 Idempotency Key 범위를 정의한다.
  - 파일 Content Hash와 분석 Input Hash 계약을 정의한다.
  - 동일 Key·동일 입력과 동일 Key·다른 입력의 응답을 구현한다.
- 산출물:
  - Idempotency Store 또는 Unique Contract
  - Hash Helper
  - 중복 요청 Test
- 완료 기준:
  - 중복 클릭과 Retry가 중복 Blob·분석 비용을 만들지 않는다.

### PRQ04-T04. Job 상태·Lease·Retry Runtime

- 목적: Analysis 작업의 중단·Timeout·재시도를 공통 방식으로 처리한다.
- 선행 Task: PRQ04-T01, PRQ04-T03
- 세부 작업:
  - queued, processing, normalizing, validating, review_required, failed, cancelled 상태를 정의한다.
  - Lease, Heartbeat, maxAttempts, nextRetryAt, failureStage를 구현한다.
  - stale processing 복구와 중복 Worker 방지를 구현한다.
- 산출물:
  - 공통 Job Runtime
  - 상태 전이 Validator
  - Retry·Lease Test
- 완료 기준:
  - Worker가 중단돼도 작업이 영구 정체되지 않는다.

### PRQ04-T05. 실행 Snapshot과 Prompt Governance

- 목적: 분석 결과의 입력·모델·Prompt를 재현 가능하게 저장한다.
- 선행 Task: PRQ04-T02, PRQ04-T04
- 세부 작업:
  - Provider, Model, Prompt Template ID, Rendered Prompt Hash를 저장한다.
  - Input Capture Version과 Contract Version을 Snapshot에 포함한다.
  - 관리자 Prompt와 제거 불가능한 서버 고정 규칙을 분리한다.
- 산출물:
  - Analysis Execution Snapshot Contract
  - Prompt Type 초안
  - Snapshot Test
- 완료 기준:
  - 동일 분석 결과가 어떤 입력과 설정에서 생성됐는지 설명할 수 있다.

### PRQ04-T06. Role Middleware와 Audit Event

- 목적: Reference 수정·검수·승인·게시 권한과 변경 이력을 관리한다.
- 선행 Task: PRQ02-T03, PRQ04-T01
- 세부 작업:
  - Role과 Owner Scope를 API Middleware에 적용한다.
  - create, revise, request_review, approve, reject, publish, archive Event를 정의한다.
  - 이전·이후 상태와 Actor를 Append-only로 저장한다.
- 산출물:
  - Role Middleware
  - Audit Event Contract
  - 역할별 허용·거부 Test
- 완료 기준:
  - 권한 없는 승인·게시가 차단되고 모든 상태 변경이 추적된다.

### PRQ04-T07. Feature Flag와 Kill Switch

- 목적: 첫 Screenshot MVP를 기존 사용자에게 영향 없이 제한 배포한다.
- 선행 Task: PRQ04-T06
- 세부 작업:
  - 관리자 등록, 분석 실행, Draft 게시, 빌더 적용 Flag를 분리한다.
  - 환경·사용자·역할별 활성화와 안전한 기본값을 구현한다.
  - 장애 시 분석 요청과 게시를 즉시 중지할 Kill Switch를 제공한다.
- 산출물:
  - Feature Flag 계약과 Helper
  - Flag Off 회귀 Test
- 완료 기준:
  - 신규 기능을 독립적으로 비활성화해도 기존 빌더가 정상 동작한다.

### PRQ-04 종료 Gate

- API 오류, Request 추적, Idempotency가 공통화됐다.
- Job Lease·Retry와 실행 Snapshot이 동작한다.
- 역할·감사·Feature Flag가 테스트된다.

---

## 7. PRQ-05 — Design Reference 데이터 기반

### PRQ05-T01. Reference Source·Capture Migration

- 목적: Screenshot 원본과 viewport별 Version을 저장할 데이터 기반을 만든다.
- 선행 Task: PRQ02 Gate, PRQ04-T03
- 세부 작업:
  - Source Type, Owner, Status, Rights, Tag, Hash 컬럼을 설계한다.
  - Capture Type, viewport, Blob, MIME, size, hash, version을 설계한다.
  - Source·Capture Unique와 조회 Index를 추가한다.
  - 목록 조회에서 대형 원본 데이터를 분리한다.
- 산출물:
  - Source·Capture Migration
  - Store Contract
- 완료 기준:
  - 하나의 Reference에 Desktop·Mobile Capture와 재등록 Version을 연결할 수 있다.

### PRQ05-T02. Analysis Run·Evidence Migration

- 목적: 분석 실행과 원본 근거를 Version으로 저장한다.
- 선행 Task: PRQ05-T01, PRQ04-T04, PRQ04-T05
- 세부 작업:
  - Analysis 상태, Snapshot, Input Hash, Result, Failure Stage를 저장한다.
  - Evidence가 Source Region, Confidence, Entity Type과 Entity ID를 연결하게 한다.
  - Analysis Version별 Result와 Evidence를 보존한다.
- 산출물:
  - Analysis Run·Evidence Migration
  - 상태·Lease Store
- 완료 기준:
  - 모든 분석 Entity가 Capture Version과 Evidence를 가질 수 있다.

### PRQ05-T03. Review·Approved Snapshot Migration

- 목적: 분석 Draft와 운영자 승인 Version을 분리한다.
- 선행 Task: PRQ05-T02, PRQ02-T03
- 세부 작업:
  - Review 상태와 허용 전이를 Constraint로 정의한다.
  - 자동 분석값, 운영 수정값, 승인 Snapshot을 구분한다.
  - Review Comment와 Actor·시각을 저장한다.
- 산출물:
  - Review·Approved Snapshot Migration
  - Review Store Contract
- 완료 기준:
  - 재분석이 과거 승인 Snapshot을 덮어쓰지 않는다.

### PRQ05-T04. Component Proposal·Mapping Decision Migration

- 목적: 자동 매칭 결과와 신규 Component Draft 제안을 관리한다.
- 선행 Task: PRQ03 Gate, PRQ05-T02
- 세부 작업:
  - Match Candidate, Score, Decision, Exclusion Reason을 저장한다.
  - Proposal Schema Version, Source Evidence, Target Component Version을 연결한다.
  - reuse, configure, add_variant, compose, create_draft, reject Action을 저장한다.
  - Proposal Lifecycle을 상태 Constraint로 정의한다.
- 산출물:
  - Component Proposal·Mapping Decision Migration
  - Proposal Store Contract
- 완료 기준:
  - AI 분석과 운영자 최종 결정의 차이를 추적할 수 있다.

### PRQ05-T05. Layout Draft·Style Profile Migration

- 목적: Layout과 디자인 스타일의 분석·Draft·게시 Version을 연결한다.
- 선행 Task: PRQ03-T04, PRQ03-T05, PRQ05-T02
- 세부 작업:
  - Layout Pattern과 Layout Preset Draft 연결을 설계한다.
  - Design Style Profile과 Token Set, Component Pattern, Layout Pattern, Guideline을 연결한다.
  - Draft, Review, Approved, Published, Archived 상태를 정의한다.
- 산출물:
  - Layout Draft·Style Profile Migration
  - Profile Store Contract
- 완료 기준:
  - Screenshot Style과 실행 Token·Layout Version을 분리·연결할 수 있다.

### PRQ05-T06. 기존 Design MD Backfill 설계

- 목적: 현재 디자인 데이터를 신규 Reference 체계로 안전하게 연결한다.
- 선행 Task: PRQ01-T03, PRQ02-T04, PRQ05-T01~PRQ05-T05
- 세부 작업:
  - 기존 Document별 Source 생성 규칙을 정한다.
  - 기존 Token·Pattern·Guideline의 Source Evidence 부족 상태를 표시한다.
  - 초기 Rights와 Review 상태를 결정한다.
  - Backfill을 Dry-run하고 Count·FK·중복을 검증한다.
- 산출물:
  - Backfill Migration 초안
  - Dry-run 검증 보고서
- 완료 기준:
  - 기존 Design MD를 삭제·복사하지 않고 신규 Source와 연결할 수 있다.

### PRQ05-T07. Migration Apply·Verify·Rollback

- 목적: 신규 Schema를 안전하게 적용하고 문제 발생 시 복구한다.
- 선행 Task: PRQ05-T01~PRQ05-T06
- 세부 작업:
  - 빈 DB와 기존 데이터 Snapshot에 Migration을 적용한다.
  - FK, Unique, Check, Index, Backfill Count를 검증한다.
  - Rollback이 어렵다면 안전한 Forward Fix 절차를 작성한다.
- 산출물:
  - Migration Verify Script
  - Apply·Rollback Runbook
- 완료 기준:
  - 신규 설치와 기존 데이터 Upgrade가 모두 검증된다.

### PRQ-05 종료 Gate

- Source, Capture, Analysis, Evidence, Review Schema가 적용 가능하다.
- Component Proposal, Layout Draft, Style Profile Version을 저장할 수 있다.
- 기존 Design MD Backfill과 Migration 검증 절차가 준비됐다.

---

## 8. PRQ-06 — 분석·Proposal·Layout·Style 계약

### PRQ06-T01. Screenshot Input Contract

- 목적: 분석 Worker가 받을 입력을 고정한다.
- 선행 Task: PRQ05-T01, PRQ04-T05
- 세부 작업:
  - Source ID, Capture Version, viewport, Blob Reference, Rights Snapshot을 정의한다.
  - Desktop·Mobile 단일·복수 입력과 누락 viewport를 정의한다.
  - 분석 Input Hash 계산 필드를 고정한다.
- 산출물:
  - Screenshot Analysis Input Schema
  - 정상·오류 Fixture
- 완료 기준:
  - UI, API, Worker가 같은 입력 계약을 사용한다.

### PRQ06-T02. Analysis Result JSON Schema v1

- 목적: Section·Component·Layout·Style 분석 결과를 Provider와 독립적으로 처리한다.
- 선행 Task: PRQ02-T01, PRQ03-T04, PRQ03-T05
- 세부 작업:
  - Source Summary, Tokens, Sections, Components, Layouts, Responsive Rules, Image Treatment, Guidelines, Risks를 정의한다.
  - 모든 Entity에 Confidence와 Evidence Reference를 요구한다.
  - 확인 불가능한 값은 `unknown`으로 표현한다.
  - 범위 밖 ID와 임의 실행 코드를 허용하지 않는다.
- 산출물:
  - Analysis Result JSON Schema v1
  - Runtime Validator
  - 정상·누락·악성 Fixture
- 완료 기준:
  - 잘못된 모델 결과가 DB Normalizer에 들어가기 전에 차단된다.

### PRQ06-T03. Section·Component Taxonomy

- 목적: Screenshot 영역을 빌더가 이해하는 재사용 가능한 역할로 분류한다.
- 선행 Task: PRQ03-T01, PRQ06-T02
- 세부 작업:
  - Header, Hero, Benefit, Steps, CTA, FAQ, Terms, Footer 등 Section Role을 정의한다.
  - Card, Badge, Media, Text Group, CTA, Navigation 등 Component Role을 정의한다.
  - 부모·자식, 반복 Group, 복합 Component, Field의 판정 기준을 정한다.
  - 특정 Screenshot 종속성과 일반 재사용 가능성 평가 필드를 정의한다.
- 산출물:
  - Section·Component Taxonomy
  - Segmentation 기대 Fixture
- 완료 기준:
  - 분석 결과가 단순 Box 목록이 아니라 구조화된 UI Tree를 표현한다.

### PRQ06-T04. Component Matching Contract

- 목적: 분석 Component와 기존 Registry 후보의 매칭 입력·출력을 고정한다.
- 선행 Task: PRQ03-T03, PRQ06-T03
- 세부 작업:
  - Canonical Descriptor 비교 필드를 확정한다.
  - Candidate Score, Confidence, Match Type, Reason, Warning을 정의한다.
  - 자동 확정과 관리자 확인이 필요한 Threshold를 정한다.
  - 후보가 없을 때 신규 Draft 제안으로 전환하는 조건을 정의한다.
- 산출물:
  - Matching Request·Response Schema
  - Match Decision Fixture
- 완료 기준:
  - Matching Engine과 관리자 Inspector가 같은 판정 데이터를 사용한다.

### PRQ06-T05. Component Proposal JSON Schema

- 목적: 신규 Component를 코드가 아닌 관리 가능한 구조로 제안한다.
- 선행 Task: PRQ02-T02, PRQ03-T01, PRQ06-T04
- 세부 작업:
  - Role, Name, Description, Fields, Default Value, Capabilities를 정의한다.
  - Style Slots, Image Policy, CTA Policy, Placement Policy를 정의한다.
  - Desktop·Mobile Layout Hint와 접근성 요구를 정의한다.
  - Source Evidence, 기존 후보 유사도, 중복 경고를 포함한다.
  - Draft Registry Adapter가 허용할 필드만 Schema에 포함한다.
- 산출물:
  - Component Proposal JSON Schema
  - Proposal Validator
  - Draft 변환 Fixture
- 완료 기준:
  - Proposal이 자유 HTML·CSS 없이 기존 Component Version 구조로 변환 가능하다.

### PRQ06-T06. Layout Draft와 Style Profile Contract

- 목적: Layout·Style 분석 결과를 검수 가능한 실행 Draft로 연결한다.
- 선행 Task: PRQ03-T04, PRQ03-T05, PRQ06-T02
- 세부 작업:
  - Layout Pattern 입력과 Preset Draft 출력 Schema를 정의한다.
  - Component Instance Mapping과 Desktop·Mobile Geometry를 정의한다.
  - Design Style Profile의 Token, Pattern, Image Treatment, Guideline 연결을 정의한다.
  - 기존 Token 충돌·Alias·누락 경고 형식을 정의한다.
- 산출물:
  - Layout Draft Contract
  - Design Style Profile Contract
  - 변환·충돌 Fixture
- 완료 기준:
  - Analyzer와 Registry Adapter가 같은 Layout·Style 계약을 사용한다.

### PRQ06-T07. Mock Analyzer와 End-to-End Contract Harness

- 목적: 실제 Vision Provider 없이 전체 데이터 흐름을 먼저 검증한다.
- 선행 Task: PRQ06-T01~PRQ06-T06, PRQ05 Gate
- 세부 작업:
  - 고정 Screenshot Fixture에 대한 Mock Analysis Result를 제공한다.
  - Analysis Result→Normalizer→Matching→Proposal→Review Draft 흐름을 실행한다.
  - 오류 Schema, 낮은 Confidence, No Match, 중복 Proposal Case를 포함한다.
- 산출물:
  - Mock Analyzer
  - Contract Harness
  - E2E Fixture
- 완료 기준:
  - 실제 AI 비용 없이 첫 Vertical Slice의 모든 데이터 계약을 검증한다.

### PRQ-06 종료 Gate

- Screenshot Input과 Analysis Result Schema가 고정됐다.
- Section·Component Taxonomy와 Matching Contract가 고정됐다.
- Component Proposal, Layout Draft, Style Profile Contract가 Validator를 통과한다.
- Mock Analyzer로 전체 계약 흐름이 실행된다.

---

## 9. PRQ-07 — 검수·승인·게시 계약

### PRQ07-T01. Review 상태 전이와 API Contract

- 목적: 분석 Draft와 Component·Layout·Style Draft의 검수 흐름을 통일한다.
- 선행 Task: PRQ02-T03, PRQ05-T03, PRQ06 Gate
- 세부 작업:
  - draft, review_required, approved, rejected, published, archived 전이를 정의한다.
  - 허용 Role, Revision, Comment, Conflict 응답을 정의한다.
  - 분석 승인과 Registry 게시를 별도 Action으로 분리한다.
- 산출물:
  - Review State Machine
  - Review API Contract
- 완료 기준:
  - 승인된 분석이 자동으로 Component·Layout·Style Published 상태가 되지 않는다.

### PRQ07-T02. 분석 Inspector 정보 구조

- 목적: 운영자가 원본 Evidence와 분석·매칭·Proposal을 한 흐름에서 검토하게 한다.
- 선행 Task: PRQ06-T02~PRQ06-T06
- 세부 작업:
  - 원본 Screenshot, Section Tree, Component Tree, Token, Layout, Style 배치를 정의한다.
  - 낮은 Confidence와 Evidence 누락을 우선 표시한다.
  - 자동 Match Candidate와 Reuse Decision 근거를 표시한다.
  - 자동 분석값, 운영 수정값, 승인값을 구분한다.
- 산출물:
  - Inspector IA
  - 상태·오류·빈 화면 Wire Contract
- 완료 기준:
  - 운영자가 어떤 값을 왜 수정·승인해야 하는지 이해할 수 있다.

### PRQ07-T03. Component Draft 관리 Contract

- 목적: Proposal을 Registry에 게시하기 전 수정·중복 병합·Preview한다.
- 선행 Task: PRQ06-T05, PRQ07-T01
- 세부 작업:
  - Field, Policy, Style Slot, Default Value 편집 범위를 정의한다.
  - 기존 Component로 재매핑, Variant 전환, Proposal 병합, 거절 Action을 정의한다.
  - Desktop·Mobile Fixture Preview와 접근성 검사 항목을 정한다.
  - 게시 전 Registry Contract Validation을 정의한다.
- 산출물:
  - Component Draft Editor Contract
  - Publish Gate Checklist
- 완료 기준:
  - 신규 Component Draft가 관리자 검토 없이 활성화될 수 없다.

### PRQ07-T04. Layout·Style Draft 관리 Contract

- 목적: Layout Preset과 Design Style Profile을 Preview하고 승인한다.
- 선행 Task: PRQ06-T06, PRQ07-T01
- 세부 작업:
  - Desktop·Mobile Layout Preview와 Geometry 수정 범위를 정의한다.
  - Token 충돌·Alias·누락 처리 UI를 정의한다.
  - Style Tag, Image Treatment, Guideline 편집 범위를 정한다.
  - Approved와 Published Version 관계를 정의한다.
- 산출물:
  - Layout·Style Draft Editor Contract
  - Publish Gate Checklist
- 완료 기준:
  - 분석 Pattern과 실제 실행 Preset·Token의 차이를 검수할 수 있다.

### PRQ07-T05. 승인 데이터 조회·사용 차단 Contract

- 목적: 빌더가 검수 완료된 데이터만 조회하게 한다.
- 선행 Task: PRQ07-T01, PRQ02-T03
- 세부 작업:
  - Approved-only와 Published-only Query 범위를 정의한다.
  - Rights, Market, Locale, Brand Scope Filter를 정의한다.
  - Archive·권리 만료·삭제 요청 시 신규 사용 차단 방식을 정한다.
- 산출물:
  - Library Query Contract
  - 차단 사유 코드
- 완료 기준:
  - 비승인·미게시·권리 제한 데이터가 빌더 Query에 반환되지 않는다.

### PRQ-07 종료 Gate

- Review 상태와 역할·Revision 계약이 고정됐다.
- 분석·Component·Layout·Style 검수 정보 구조가 준비됐다.
- Publish Gate와 Approved-only 사용 계약이 확정됐다.

---

## 10. PRQ-08 — Fixture·테스트·선행 완료 Gate

### PRQ08-T01. Screenshot 기준 Fixture

- 목적: 분석·매칭·Draft 결과를 검증할 고정 입력을 만든다.
- 선행 Task: PRQ06-T03, PRQ03-T06
- 세부 작업:
  - Desktop·Mobile 쌍을 포함한 대표 프로모션 Screenshot을 선정한다.
  - Hero, Card Grid, Steps, CTA, Terms 등 구조를 포함한다.
  - 기존 Component Match, Variant, Composition, No Match Case를 포함한다.
  - 권리·로고·카피 위험 Case와 낮은 품질 Screenshot을 포함한다.
- 산출물:
  - Screenshot Fixture Set
  - Expected Section·Component Tree
- 완료 기준:
  - 분석·매칭 변경 전후를 동일 입력으로 비교할 수 있다.

### PRQ08-T02. Schema·Contract Test Suite

- 목적: 선행 단계에서 확정한 계약의 회귀를 자동 차단한다.
- 선행 Task: PRQ06 Gate, PRQ07 Gate
- 세부 작업:
  - Analysis, Matching, Proposal, Layout, Style Schema Test를 작성한다.
  - 상태 전이, Revision Conflict, 권한, Approved-only Query Test를 작성한다.
  - 임의 HTML·CSS·Script와 범위 밖 ID 거부 Test를 추가한다.
- 산출물:
  - Contract Test Suite
- 완료 기준:
  - Schema와 정책을 위반하는 변경이 CI에서 실패한다.

### PRQ08-T03. Migration·Backfill Test

- 목적: 신규 데이터 기반의 설치·Upgrade·Rollback 안전성을 검증한다.
- 선행 Task: PRQ05 Gate
- 세부 작업:
  - 빈 DB와 기존 Snapshot에 Migration을 적용한다.
  - 기존 Design MD Backfill Count와 FK를 검증한다.
  - 중복 Source, Capture Hash, Version Conflict를 테스트한다.
  - Rollback 또는 Forward Fix 절차를 실행한다.
- 산출물:
  - Migration Test 결과
  - Verify·Recovery Runbook
- 완료 기준:
  - 신규 설치와 기존 프로젝트 Upgrade가 모두 통과한다.

### PRQ08-T04. Job·Idempotency·권한 Test

- 목적: 실제 Provider 연결 전 운영 안전성을 검증한다.
- 선행 Task: PRQ04 Gate
- 세부 작업:
  - 중복 요청, Worker 중단, Lease 만료, Retry 초과를 테스트한다.
  - Viewer·Editor·Reviewer·Admin Role Matrix를 테스트한다.
  - Audit Event와 Request ID 전파를 검증한다.
  - Feature Flag Off에서 기존 흐름 회귀를 검사한다.
- 산출물:
  - Reliability·Authorization Test 결과
- 완료 기준:
  - 중복 비용, 영구 processing, 권한 누출이 테스트에서 발생하지 않는다.

### PRQ08-T05. Mock Vertical Slice 검증

- 목적: 실제 Vision 모델 없이 첫 제품 흐름을 끝까지 검증한다.
- 선행 Task: PRQ06-T07, PRQ07 Gate, PRQ08-T01~PRQ08-T04
- 세부 작업:
  - Mock Screenshot 등록과 Capture Version 생성을 실행한다.
  - Mock Analyzer Result를 저장하고 Normalizer를 실행한다.
  - 기존 Component Match와 신규 Proposal을 생성한다.
  - Layout Draft와 Style Profile Draft를 생성한다.
  - Review·수정·승인·거절·게시 차단을 검증한다.
- 산출물:
  - Mock Vertical Slice E2E 결과
  - 미해결 Contract·정책 목록
- 완료 기준:
  - 실제 AI Provider 없이 데이터·상태·검수 흐름이 끝까지 동작한다.

### PRQ08-T06. 선행 구성 승인

- 목적: 실제 Screenshot Upload UI와 Vision Analysis Worker 개발 착수 여부를 결정한다.
- 선행 Task: PRQ08-T01~PRQ08-T05
- 세부 작업:
  - 모든 PRQ Gate의 미완료 항목을 검토한다.
  - P0 오류, 정책 미결정, Migration 위험, Registry 누락을 확인한다.
  - 실제 Provider 비용·권한과 개인정보·권리 정책을 확인한다.
  - 다음 구현 Batch의 Owner와 순서를 확정한다.
- 산출물:
  - 선행 구성 완료 보고서
  - Go/No-Go 결정
  - Screenshot MVP 구현 백로그
- 완료 기준:
  - P0 미결정과 Blocking Test 실패가 없다.
  - 실제 Vision 분석 개발 착수가 명시적으로 승인된다.

### PRQ-08 최종 Gate

- Screenshot·분석·Proposal·Layout·Style·Review 계약이 고정됐다.
- Registry 정규화와 Matching Fixture가 준비됐다.
- 공통 Job·권한·감사·Feature Flag가 검증됐다.
- 신규 Migration과 기존 Design MD Backfill이 검증됐다.
- Mock Vertical Slice가 실제 AI 없이 끝까지 통과했다.
- 실제 Vision Provider 개발에 대한 Go 결정이 완료됐다.

---

## 11. 병렬 착수 묶음

### Batch 1. 현행 감사

다음 작업은 즉시 병렬 진행한다.

- PRQ01-T01 화면·Route·사용자 흐름 감사
- PRQ01-T02 API·Worker·n8n 책임 감사
- PRQ01-T03 DB·Migration 기준선 감사
- PRQ01-T04 Component Registry 준비도 감사
- PRQ01-T05 Section·Layout·Token Registry 준비도 감사
- PRQ01-T06 테스트·품질 기준선

### Batch 2. 정책과 Canonical Contract

PRQ-01 결과를 바탕으로 다음을 진행한다.

- PRQ02-T01 Design Reference 용어와 Entity 경계
- PRQ02-T02 자동 생성 허용·금지 정책
- PRQ02-T03 검수·승인·권리 정책
- PRQ03-T01 Canonical Component Descriptor
- PRQ03-T04 Layout Contract와 변환 규칙
- PRQ03-T05 Design Style Profile과 Token Role

### Batch 3. 공통 Runtime과 Schema

PRQ-02 핵심 결정 후 다음 두 흐름을 병렬 진행한다.

공통 Runtime:

- PRQ04-T01~PRQ04-T07

데이터 기반:

- PRQ05-T01~PRQ05-T07

### Batch 4. 분석·Proposal·검수 계약

- PRQ06-T01~PRQ06-T07
- PRQ07-T01~PRQ07-T05

### Batch 5. 최종 검증

- PRQ08-T01~PRQ08-T06

---

## 12. 선행 단계에서 구현하지 않을 항목

다음 기능은 PRQ-08 Gate 통과 전에는 제품 경로에 구현하지 않는다.

- 실제 Vision Provider 호출
- URL Browser Capture
- Component Vue·HTML·CSS 코드 자동 생성
- Component 자동 활성화
- Layout Preset 자동 활성화
- Design Token 자동 Publish
- 빌더 자동 추천
- Vector 검색
- 파인튜닝
- POC 코드 삭제

Mock과 Fixture를 이용한 Contract 검증은 허용한다.

---

## 13. 선행 구성 이후 첫 구현 순서

PRQ-08 Gate를 통과하면 다음 순서로 Screenshot MVP를 구현한다.

1. Screenshot Upload UI와 Blob 저장
2. Vision Analysis Worker 실제 Provider 연결
3. Section·Component 구조 분석
4. 기존 Component Matching Engine
5. Component Proposal과 Draft Adapter
6. Layout Preset Draft와 Design Style Profile 생성
7. 관리자 Inspector와 Draft Editor
8. 승인·게시와 Library 조회
9. 빌더 수동 선택·Apply Proposal
10. 품질 Gate·Undo·Usage Event

이 순서에서도 자동 Publish와 자동 코드 생성은 허용하지 않는다.

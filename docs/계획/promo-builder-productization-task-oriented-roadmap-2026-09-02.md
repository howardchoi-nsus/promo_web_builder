# 프로모션 빌더 제품 고도화 Task 중심 로드맵

## 0. 문서 목적

이 문서는 제품 고도화 로드맵을 표가 아닌 개별 Task 단위로 설명한다.

각 Task는 다음 순서로 작성한다.

- 목적
- 선행 Task
- 기획 필요 내용
- 개발 필요 내용
- 예상 결과

관련 문서:

- 상위 통합 계획: `docs/계획/promo-builder-productization-and-design-reference-platform-development-plan-2026-08-31.md`
- 상세 실행 백로그: `docs/계획/promo-builder-productization-execution-roadmap-and-task-breakdown-2026-09-02.md`
- 선행 구성 세부 계획: `docs/계획/promo-builder-design-intelligence-prerequisite-development-plan-2026-09-02.md`
- 1차 관리자 설정 계획: `docs/계획/admin-design-intelligence-settings-control-plane-development-plan-2026-09-02.md`

---

## 핵심 방향 업데이트

### 1. 우선 구축할 제품 가치

기존 프로모션 빌더 전체를 먼저 완성한 뒤 디자인 레퍼런스 기능을 추가하는 순서로 진행하지 않는다.

먼저 다음 E2E를 구축한다.

```text
외부 웹디자인 Screenshot 등록
→ Section·Component·Layout·Style 분석
→ 기존 Registry와 자동 매칭
→ 기존 Component·Variant·조합 재사용 판단
→ 미매칭 항목은 신규 Component Draft 제안
→ Layout Preset Draft·Design Style Profile 생성
→ 운영자 검수·수정·승인
→ 승인된 디자인 지식 저장
→ 프로모션 빌더에서 검색·추천·적용
→ 선택·수정·거절 피드백 축적
```

이 E2E를 디자인 지식 플랫폼의 첫 번째 Vertical Slice로 정의한다. 이후 프로모션 빌더의 레이아웃 추천, 디자인 다양성, 컴포넌트 확장, 이미지 구성 품질을 승인된 데이터에 근거해 고도화한다.

### 2. 자동 컴포넌트 생성 원칙

Screenshot에서 Component가 인식됐다는 이유만으로 실행 코드나 활성 Component를 즉시 생성하지 않는다.

다음 우선순위를 강제한다.

```text
1. 기존 Component 그대로 재사용
2. 기존 Component 설정으로 표현
3. 기존 Component에 Layout/Style Variant 추가
4. 여러 기존 Component를 Section Pattern으로 조합
5. 위 방법으로 표현할 수 없을 때 신규 Component Draft 제안
6. 운영자 검수·Preview·승인 후에만 Registry 활성 Version 게시
```

AI의 자동 생성 결과는 Vue·HTML·CSS 코드가 아니라 다음을 포함한 Component Proposal Schema다.

- Component Role과 재사용 목적
- Field 목록과 Field Kind
- 기본값과 편집 가능 범위
- 허용된 Style Slot
- Image·CTA Policy
- Desktop·Mobile Layout Hint
- 기존 Component와의 유사도와 중복 근거
- 생성 근거 Screenshot과 Evidence

### 3. Layout과 Style 저장 원칙

분석 데이터와 빌더 실행 데이터를 분리한다.

```text
Screenshot Layout Pattern
→ 현재 Section·Component와 매칭
→ Desktop·Mobile Geometry 변환
→ Layout Contract 검증
→ Layout Preset Draft
→ Preview 검수
→ 승인·활성화
```

디자인 스타일은 자유 설명문 하나가 아니라 다음 구조의 `Design Style Profile`로 저장한다.

- Design Token Set
- Component Pattern과 Variant
- Layout Pattern과 Preset 연결
- Image Treatment와 Safe Area
- Responsive Rule
- Style Tag
- Do·Don't·Avoid·Must Guideline
- Source Evidence와 Rights

### 4. 학습 원칙

초기 학습은 모델 파인튜닝이 아니다.

1. 승인된 디자인 Pattern과 Profile을 구조화해 축적한다.
2. Rule·Metadata·Semantic Retrieval로 적합한 Pattern을 검색한다.
3. 추천·선택·적용·수정·거절·Undo·Publish Event를 저장한다.
4. 실제 피드백으로 추천 점수와 Mapping 우선순위를 개선한다.
5. 충분한 승인 데이터와 권리 검토가 완료된 후 파인튜닝을 별도 판단한다.

### 5. 변경된 실행 순서

```text
1. AG-01 현행 기준선과 Registry 감사
2. AG-02 최소 공통 기반
   - API 오류
   - Idempotency
   - Job·Retry
   - 실행 Snapshot
   - 권한·감사
3. AG-04 Design Reference 데이터 기반
4. AG-05 Screenshot 구조 분석
5. AG-06 분석·Component Draft·Layout·Style 검수 관리
6. AG-07 자동 매칭·Draft 생성·게시·빌더 수동 적용
7. AG-03 데이터를 활용한 기존 빌더 품질 고도화
8. AG-08 URL Capture
9. AG-09 자동 추천·피드백 학습
10. AG-10 운영 전환
```

AG-03의 Revision, Registry Contract, 기본 Quality Gate는 AG-07 적용 전에 선행한다. AG-03의 전체 Layout Fit, Render Gate, Preview·Export 고도화는 Screenshot 기반 디자인 지식이 확보된 뒤 병행한다.

---

## AG-01. 현행 시스템 기준선과 제품 범위 확정

### AG01-T01. 화면과 사용자 흐름 인벤토리

- 목적: 현재 실제로 사용하는 화면과 POC 잔여 화면을 구분한다.
- 선행 Task: 없음
- 기획 필요 내용:
  - 실제 사용자와 관리자 역할을 구분한다.
  - 공식 진입 화면과 유지할 사용자 흐름을 결정한다.
  - 중복 화면과 폐기 후보의 판단 기준을 정한다.
- 개발 필요 내용:
  - `prototype`, `admin-app`, `visual-editor`의 Route와 Entry를 조사한다.
  - 화면별 호출 API와 이동 경로를 연결한다.
  - 미사용 화면과 중복 화면을 식별한다.
- 예상 결과:
  - 운영 대상 화면과 POC 화면이 명확히 구분된다.
  - 이후 UI 개발이 어느 화면에 반영돼야 하는지 판단할 수 있다.

### AG01-T02. API와 Worker 책임 지도

- 목적: API, 내부 Helper, n8n Workflow, Worker 사이의 책임과 호출 관계를 정리한다.
- 선행 Task: 없음
- 기획 필요 내용:
  - n8n과 애플리케이션 Worker의 장기 책임 원칙을 정한다.
  - 외부 Provider 호출을 어느 계층에서 관리할지 결정한다.
- 개발 필요 내용:
  - 전체 `/api` Endpoint와 호출자를 조사한다.
  - Webhook, 환경변수, 비동기 처리 경로를 연결한다.
  - 중복된 Provider·Prompt·상태 처리 로직을 식별한다.
- 예상 결과:
  - 기능 변경 시 영향받는 API와 Worker를 예측할 수 있다.
  - 중복 구현과 책임 공백을 줄일 수 있다.

### AG01-T03. DB Schema와 Migration 감사

- 목적: 현재 DB 구조와 Migration 누적 상태를 제품 개발 기준으로 정리한다.
- 선행 Task: 없음
- 기획 필요 내용:
  - 운영 데이터를 반드시 보존해야 하는 범위를 결정한다.
  - 레거시 테이블과 컬럼의 폐기 원칙을 정한다.
- 개발 필요 내용:
  - Migration 적용 순서와 테이블 관계를 점검한다.
  - FK, Unique Constraint, Check Constraint, Index를 확인한다.
  - 중복·미사용 Schema와 운영 DB 불일치 가능성을 기록한다.
- 예상 결과:
  - 신규 Migration을 안전하게 설계할 기준선이 확보된다.
  - 데이터 손실과 호환성 문제 가능성이 줄어든다.

### AG01-T04. 핵심 E2E 흐름 확정

- 목적: 제품이 공식적으로 지원할 생성·편집·출력 흐름을 확정한다.
- 선행 Task: AG01-T01, AG01-T02, AG01-T03
- 기획 필요 내용:
  - Template Mode와 AI Mode의 제품 역할을 정의한다.
  - Preview와 Export의 공식 완료 조건을 결정한다.
- 개발 필요 내용:
  - Overview부터 Template, Composition, Asset, Preview, Export까지 데이터 흐름을 작성한다.
  - 단계별 상태와 저장 Snapshot을 연결한다.
- 예상 결과:
  - 신규 기능이 연결될 공식 제품 경로가 확정된다.
  - 임시 경로와 우회 구현의 추가를 방지한다.

### AG01-T05. 유지·보완·교체·폐기 결정

- 목적: 기존 구현을 전면 재작성하지 않고 필요한 범위만 정확히 고도화한다.
- 선행 Task: AG01-T01~AG01-T04
- 기획 필요 내용:
  - 유지, 보완, 교체, 폐기의 판단 기준을 정한다.
  - 폐기 승인자와 호환 유지 기간을 결정한다.
- 개발 필요 내용:
  - 모듈별 실제 참조와 대체 경로를 확인한다.
  - 교체·폐기 대상에 Feature Flag와 Rollback 조건을 연결한다.
- 예상 결과:
  - 중복 개발과 불필요한 전면 재구축을 방지한다.
  - 후속 Task의 변경 범위가 명확해진다.

### AG01-T06. 테스트 기준선 확보

- 목적: 고도화 전후의 품질을 비교할 회귀 기준선을 만든다.
- 선행 Task: AG01-T01, AG01-T02
- 기획 필요 내용:
  - 배포를 차단해야 할 필수 시나리오를 결정한다.
  - 수동 검증과 자동 검증의 경계를 정한다.
- 개발 필요 내용:
  - 기존 Test를 단위, 계약, 통합, Browser, Worker로 분류한다.
  - 현재 실패와 미검증 영역을 기록한다.
  - Template Mode와 AI Mode의 핵심 Smoke Test를 보완한다.
- 예상 결과:
  - 이후 변경으로 발생한 회귀를 조기에 발견할 수 있다.
  - Task 완료 여부를 동일한 기준으로 판단할 수 있다.

---

## AG-02. 공통 운영·보안·실행 기반 고도화

### AG02-T01. 공통 API와 오류 계약

- 목적: 모든 API가 동일한 성공·오류 형식을 사용하게 한다.
- 선행 Task: AG01-T04
- 기획 필요 내용:
  - Validation, 권한, 충돌, 재시도 가능 오류의 분류를 결정한다.
  - 사용자용 메시지와 내부 오류 정보의 노출 범위를 정한다.
- 개발 필요 내용:
  - 공통 Response Envelope와 Error Code를 구현한다.
  - Validation Helper와 Contract Fixture를 제공한다.
  - 정상·400·401/403·404·409·429·500/502 Test를 추가한다.
- 예상 결과:
  - UI가 오류마다 일관된 행동과 메시지를 제공한다.
  - 운영자가 오류 원인을 빠르게 식별할 수 있다.

### AG02-T02. Request와 실행 추적

- 목적: 사용자 요청부터 AI Provider와 DB 저장까지 하나의 흐름으로 추적한다.
- 선행 Task: AG02-T01
- 기획 필요 내용:
  - Request ID 보존기간과 로그 조회 권한을 정한다.
  - 개인정보와 비밀정보 마스킹 정책을 정의한다.
- 개발 필요 내용:
  - Request ID와 Correlation ID를 API, Worker, Provider에 전파한다.
  - 구조화 로그와 공통 Context Helper를 구현한다.
- 예상 결과:
  - 여러 시스템에 걸친 실패도 하나의 ID로 조사할 수 있다.
  - 사용자 제보와 서버 로그를 연결하기 쉬워진다.

### AG02-T03. Idempotency와 중복 방지

- 목적: 중복 클릭과 재시도로 동일 데이터와 AI 비용이 반복 생성되지 않게 한다.
- 선행 Task: AG02-T01
- 기획 필요 내용:
  - Resource와 작업별 중복 판단 범위를 정한다.
  - Idempotency Key 만료와 재요청 UX를 결정한다.
- 개발 필요 내용:
  - Idempotency Store와 Unique Constraint를 추가한다.
  - 동일 Key의 재요청과 입력 충돌 응답을 구현한다.
- 예상 결과:
  - 동일 요청이 하나의 작업과 결과만 생성한다.
  - 불필요한 외부 AI 비용이 줄어든다.

### AG02-T04. 공통 Job 상태·Lease·Retry

- 목적: 비동기 작업이 중단되거나 Timeout돼도 안전하게 복구되게 한다.
- 선행 Task: AG02-T01, AG02-T03
- 기획 필요 내용:
  - 상태 전이, 최대 재시도, Backoff, 취소 정책을 정한다.
  - 자동 Retry와 운영자 수동 Retry의 기준을 구분한다.
- 개발 필요 내용:
  - queued, processing, ready, failed, cancelled 상태를 공통화한다.
  - Lease, Heartbeat, stale 복구, nextRetryAt을 구현한다.
  - Worker 중단과 중복 실행 Test를 추가한다.
- 예상 결과:
  - 작업이 `processing`에 영구 정체되는 문제가 줄어든다.
  - 실패 단계와 복구 가능 여부를 일관되게 관리한다.

### AG02-T05. 실행 Snapshot 표준화

- 목적: AI 결과가 어떤 입력과 설정에서 생성됐는지 재현할 수 있게 한다.
- 선행 Task: AG02-T02, AG02-T04
- 기획 필요 내용:
  - 저장할 Input, Model, Prompt, Token, Contract Version을 정한다.
  - 원문과 Hash의 보존 범위를 결정한다.
- 개발 필요 내용:
  - Prompt·Model·Input·Output Snapshot 구조를 공통화한다.
  - 입력과 렌더된 Prompt Hash를 저장한다.
- 예상 결과:
  - 모델이나 Prompt 변경 전후 결과를 비교할 수 있다.
  - 장애와 품질 문제의 원인을 재현할 수 있다.

### AG02-T06. 인증·역할·감사 로그

- 목적: 조회·수정·승인 권한과 변경 이력을 명확히 관리한다.
- 선행 Task: AG02-T01, AG02-T02
- 기획 필요 내용:
  - Viewer, Editor, Reviewer, Admin 역할을 정의한다.
  - 등록자와 승인자를 분리할지 결정한다.
  - 감사 이벤트의 보존기간을 정한다.
- 개발 필요 내용:
  - API 권한 Middleware와 Owner Scope를 구현한다.
  - Append-only Audit Event를 저장한다.
  - 역할별 허용·거부 Test를 추가한다.
- 예상 결과:
  - 권한 없는 데이터 조회·수정·승인이 차단된다.
  - 누가 무엇을 변경했는지 추적할 수 있다.

### AG02-T07. Feature Flag·관측·Rollback

- 목적: 신규 기능을 단계적으로 배포하고 즉시 복구할 수 있게 한다.
- 선행 Task: AG02-T02, AG02-T04, AG02-T06
- 기획 필요 내용:
  - 환경·사용자·그룹별 Rollout 순서를 정한다.
  - 중단 조건과 Kill Switch 사용 권한을 결정한다.
  - 성공률, 지연, 비용, 정체 작업 지표를 정의한다.
- 개발 필요 내용:
  - Feature Flag와 안전한 기본값을 구현한다.
  - Metrics와 Alert Event를 추가한다.
  - Flag Off와 Rollback Test를 수행한다.
- 예상 결과:
  - 기존 사용자를 보호하면서 신규 기능을 제한 배포할 수 있다.
  - 품질 악화와 비용 이상을 빠르게 감지하고 복구할 수 있다.

---

## AG-03. 기존 프로모션 빌더 핵심 품질 고도화

### AG03-T01. AI 구성과 Rule Base 책임 정리

- 목적: AI가 결정할 내용과 서버가 강제할 정책을 분리한다.
- 선행 Task: AG01-T04, AG02-T01
- 기획 필요 내용:
  - AI가 선택 가능한 Section·Component·Layout 범위를 정의한다.
  - 필수 Section과 변경 금지 정책을 확정한다.
- 개발 필요 내용:
  - Overview, Candidate, Proposal, Compiler 계약을 정리한다.
  - Allowlist와 필수 Section Validator를 보완한다.
- 예상 결과:
  - 임의 구조 생성과 운영 정책 누락이 줄어든다.
  - AI 결과가 기존 Registry 계약 안에서 동작한다.

### AG03-T02. Asset Readiness 고도화

- 목적: 필요한 이미지가 모두 준비된 결과만 완료 상태로 표시한다.
- 선행 Task: AG02-T04, AG03-T01
- 기획 필요 내용:
  - 필수 자산과 선택 자산을 구분한다.
  - 부분 실패, 재생성, 대체 이미지 정책을 정한다.
- 개발 필요 내용:
  - Expected Asset Manifest와 Coverage 검사를 구현한다.
  - 실패 자산의 개별 Retry와 상태 표시를 추가한다.
- 예상 결과:
  - `이미지 준비 중` Placeholder가 완료 Preview에 남지 않는다.
  - 전체 구성 재생성 없이 실패 자산만 복구할 수 있다.

### AG03-T03. Content·Layout Fit 고도화

- 목적: 콘텐츠 양과 이미지 조건에 맞는 Layout Preset을 선택한다.
- 선행 Task: AG03-T01
- 기획 필요 내용:
  - 제목 길이, 카드 수, 이미지 비율별 적합 기준을 정한다.
  - Default Layout과 Fallback 우선순위를 정의한다.
- 개발 필요 내용:
  - Layout Metadata와 Fit Score를 구현한다.
  - Content Metric과 Preset 선택 근거를 Snapshot에 저장한다.
- 예상 결과:
  - 콘텐츠와 맞지 않는 배치와 반복적인 Default Layout이 줄어든다.
  - Layout 선택 이유를 설명할 수 있다.

### AG03-T04. Desktop·Mobile Render Quality Gate

- 목적: 실제 렌더 화면의 충돌과 잘림을 완료 전에 차단한다.
- 선행 Task: AG03-T02, AG03-T03
- 기획 필요 내용:
  - Blocking, Warning, Info 기준을 정한다.
  - 자동 보정 횟수와 수동 확인 전환 조건을 결정한다.
- 개발 필요 내용:
  - DOM Rect 기반 충돌·잘림·Overflow·공백 검사를 구현한다.
  - 대비, 최소 텍스트 크기, 이미지 Safe Area를 검사한다.
- 예상 결과:
  - Desktop과 Mobile에서 깨진 결과가 완료 상태로 승격되지 않는다.
  - 운영자가 품질 실패 원인을 구체적으로 확인할 수 있다.

### AG03-T05. Preview·Export 일치

- 목적: 편집 중 확인한 화면과 최종 Web Output의 차이를 줄인다.
- 선행 Task: AG03-T03, AG03-T04
- 기획 필요 내용:
  - 허용 가능한 Preview·Export 차이와 비교 기준을 정의한다.
- 개발 필요 내용:
  - Shared Renderer, Token Snapshot, Layout Snapshot 사용 경로를 통일한다.
  - Preview와 Export Screenshot 회귀 Test를 추가한다.
- 예상 결과:
  - Preview에서 정상인 화면이 Export에서 달라지는 문제가 줄어든다.
  - 최종 결과에 대한 사용자 신뢰가 높아진다.

### AG03-T06. Revision·Undo·상태 UX

- 목적: AI 적용과 사용자 수정을 안전하게 관리하고 실패 상태를 이해하기 쉽게 표시한다.
- 선행 Task: AG02-T01, AG03-T04
- 기획 필요 내용:
  - 자동 변경과 사용자 수정의 우선순위를 정한다.
  - Undo 범위와 Revision 충돌 처리 방식을 결정한다.
  - 사용자에게 노출할 진행 상태를 정의한다.
- 개발 필요 내용:
  - Proposal Apply와 Revision Conflict를 보완한다.
  - Snapshot Diff, Undo, Retry UI를 구현한다.
- 예상 결과:
  - 불만족 결과를 안전하게 이전 상태로 복구할 수 있다.
  - 운영자가 내부 기술 지식 없이 현재 상태와 다음 행동을 이해한다.

---

## AG-04. Design Reference 데이터 플랫폼 구축

### AG04-T01. Reference Source 모델

- 목적: Design MD, Screenshot, URL을 하나의 공통 Root로 관리한다.
- 선행 Task: AG01-T03, AG02-T06
- 기획 필요 내용:
  - Source 유형, 상태, Owner, Tag, Archive 의미를 정의한다.
  - 패턴 참고와 원본 자산 재사용 권한을 구분한다.
- 개발 필요 내용:
  - `design_reference_sources` Migration과 Store를 구현한다.
  - 상태와 권리 관련 Constraint·Index를 추가한다.
- 예상 결과:
  - 모든 디자인 입력을 동일한 Reference 체계에서 관리한다.
  - 출처와 권리 상태를 제품 전체에서 일관되게 사용한다.

### AG04-T02. Capture와 원본 Version 모델

- 목적: 같은 Source의 Desktop·Mobile·재캡처 원본을 버전으로 보존한다.
- 선행 Task: AG04-T01
- 기획 필요 내용:
  - viewport, 원본, Thumbnail, 보존기간을 정의한다.
  - 원본 삭제와 파생 데이터 처리 정책을 결정한다.
- 개발 필요 내용:
  - `design_reference_captures`와 Blob 연결을 구현한다.
  - Capture Version, Content Hash, MIME, 크기를 저장한다.
- 예상 결과:
  - 분석 결과가 정확한 원본 Version과 연결된다.
  - 재캡처 후에도 과거 근거를 재현할 수 있다.

### AG04-T03. Analysis Run과 Evidence 모델

- 목적: 분석 실행과 각 추출 결과의 원본 근거를 연결한다.
- 선행 Task: AG04-T01, AG04-T02, AG02-T04, AG02-T05
- 기획 필요 내용:
  - 분석 상태, Failure Stage, Confidence 기준을 정한다.
  - Bounding Region과 Source Excerpt의 저장 방식을 정의한다.
- 개발 필요 내용:
  - `design_reference_analysis_runs`를 구현한다.
  - `design_pattern_evidence`와 기존 Pattern Table을 연결한다.
- 예상 결과:
  - 어떤 모델이 어떤 원본에서 무엇을 추출했는지 확인할 수 있다.
  - 근거 없는 분석값을 승인 과정에서 구분할 수 있다.

### AG04-T04. Review와 승인 Version 모델

- 목적: AI 분석 Draft와 운영 승인 데이터를 분리한다.
- 선행 Task: AG04-T03, AG02-T06
- 기획 필요 내용:
  - Review 상태와 허용 전이를 정의한다.
  - 자동 분석값, 수정값, 승인 Snapshot의 관계를 정한다.
- 개발 필요 내용:
  - Review History와 승인 Snapshot Store를 구현한다.
  - 승인·거절·재검수 상태 Constraint를 추가한다.
- 예상 결과:
  - AI 결과가 검수 없이 운영 데이터로 게시되지 않는다.
  - 재분석해도 기존 승인 Version이 보존된다.

### AG04-T05. Usage와 Feedback 모델

- 목적: Reference가 추천·적용·수정된 실제 사용 이력을 축적한다.
- 선행 Task: AG04-T01, AG02-T07
- 기획 필요 내용:
  - recommended, selected, applied, edited, reverted, published 의미를 정의한다.
  - 중복 Event와 사용자 식별 범위를 정한다.
- 개발 필요 내용:
  - `design_reference_usage_events`를 구현한다.
  - Builder Document Revision과 Pattern ID를 연결한다.
- 예상 결과:
  - 실제 사용 행동을 추천 개선 데이터로 활용할 수 있다.
  - Reference별 활용도와 수정량을 측정할 수 있다.

### AG04-T06. 기존 Design MD 통합과 CRUD API

- 목적: 기존 디자인 데이터를 손실 없이 신규 Reference 체계로 연결한다.
- 선행 Task: AG04-T01~AG04-T05
- 기획 필요 내용:
  - 기존 Design MD의 초기 승인·권리 상태를 결정한다.
  - 기존 API와 화면의 호환 기간을 정한다.
- 개발 필요 내용:
  - Backfill Migration과 Store Adapter를 구현한다.
  - Reference Create, List, Detail, Patch, Archive API를 제공한다.
  - 목록과 대형 상세 데이터를 분리한다.
- 예상 결과:
  - 기존 Design MD 기능을 유지하면서 상위 Reference 도메인으로 전환한다.
  - 관리자 UI와 Worker가 하나의 공통 API를 사용한다.

### AG04-T07. Component Proposal·Layout Draft·Style Profile 모델

- 목적: Screenshot 분석 결과를 기존 Registry 실행 데이터와 분리된 관리 가능한 Draft로 저장한다.
- 선행 Task: AG04-T01~AG04-T04
- 기획 필요 내용:
  - 기존 Component 매칭 결과와 신규 Component Proposal의 상태를 정의한다.
  - Component Variant, Section Composition, 신규 Component의 구분 기준을 정한다.
  - Layout Pattern, Layout Preset Draft, Design Style Profile의 Version 관계를 정의한다.
- 개발 필요 내용:
  - Component Proposal과 Mapping Decision Store를 구현한다.
  - Layout Preset Draft와 원본 Layout Pattern 연결을 구현한다.
  - Design Style Profile과 Token·Pattern·Guideline 연결을 구현한다.
  - draft, review_required, approved, rejected, published, archived 상태를 검증한다.
- 예상 결과:
  - AI 분석 결과가 활성 Component나 Layout으로 직접 등록되지 않는다.
  - Component·Layout·Style 제안을 독립적으로 검수·수정·Version 관리할 수 있다.

---

## AG-05. Screenshot 업로드와 멀티모달 분석

### AG05-T01. Screenshot 업로드 정책과 검증

- 목적: 안전하고 분석 가능한 이미지 파일만 등록한다.
- 선행 Task: AG04-T02
- 기획 필요 내용:
  - 허용 MIME, 최대 파일 크기와 픽셀, 원본 보존 기준을 정한다.
  - 동일 이미지 중복 등록 정책을 결정한다.
- 개발 필요 내용:
  - MIME Signature, 크기, 해상도, 손상 파일 Validator를 구현한다.
  - 확장자 위장과 과도한 픽셀 입력 Test를 추가한다.
- 예상 결과:
  - 악성·손상·과대 파일과 불필요한 분석 비용을 차단한다.

### AG05-T02. Screenshot 저장 Pipeline

- 목적: Desktop·Mobile Screenshot을 안전하게 저장하고 빠르게 미리본다.
- 선행 Task: AG05-T01, AG02-T03
- 기획 필요 내용:
  - Desktop·Mobile 구분과 Thumbnail 크기를 정한다.
  - EXIF와 개인정보 Metadata 처리 기준을 정한다.
- 개발 필요 내용:
  - Direct Upload, Content Hash, EXIF 제거, Thumbnail 생성을 구현한다.
  - Blob과 Capture Record 정합성을 처리한다.
- 예상 결과:
  - 동일 이미지의 중복 저장과 분석을 줄인다.
  - 관리자 목록과 상세 Preview가 빨라진다.

### AG05-T03. 분석 JSON Schema v1

- 목적: Provider가 달라도 동일한 디자인 분석 구조를 사용한다.
- 선행 Task: AG04-T03
- 기획 필요 내용:
  - Token, Section, Component, Layout, Responsive, Risk 추출 범위를 정한다.
  - unknown, Confidence, Evidence 필수 조건을 결정한다.
- 개발 필요 내용:
  - JSON Schema와 Runtime Validator를 구현한다.
  - 정상·누락·범위 오류 Fixture를 추가한다.
- 예상 결과:
  - 모델 변경이 DB와 UI 계약을 직접 깨뜨리지 않는다.
  - 근거 없는 추정이 사실처럼 저장되는 것을 줄인다.

### AG05-T04. Vision Prompt와 Provider 정책

- 목적: 멀티모달 분석 Prompt와 모델을 버전 관리한다.
- 선행 Task: AG05-T03, AG02-T05
- 기획 필요 내용:
  - 기본 Provider·Model, 비용 상한, Fallback을 결정한다.
  - 관리자 수정 가능 Prompt와 서버 고정 규칙을 분리한다.
- 개발 필요 내용:
  - Prompt Template Type과 Provider Adapter를 구현한다.
  - Prompt Snapshot과 모델 옵션을 Analysis Run에 저장한다.
- 예상 결과:
  - Prompt와 모델 변경 전후 결과를 비교할 수 있다.
  - Provider 교체와 Fallback이 가능해진다.

### AG05-T05. Vision Analysis Worker와 Normalizer

- 목적: 업로드된 Screenshot을 비동기로 분석해 기존 디자인 데이터 Draft로 변환한다.
- 선행 Task: AG05-T02, AG05-T03, AG05-T04, AG02-T04
- 기획 필요 내용:
  - 처리 단계와 부분 실패 기준을 정한다.
  - 기존 Token·Pattern과 신규 분석 결과의 Mapping 원칙을 정의한다.
- 개발 필요 내용:
  - Queue, Lease, Provider 호출, Schema 검증, 결과 저장을 구현한다.
  - Token, Metadata, Component, Layout, Guideline Normalizer를 구현한다.
- 예상 결과:
  - 사용자 요청과 분리된 안정적인 분석 Pipeline이 완성된다.
  - 분석 결과를 현재 DB와 빌더에서 재사용할 수 있다.

### AG05-T06. Desktop·Mobile 교차 분석과 평가셋

- 목적: 반응형 차이를 실제 Capture 근거로 분석하고 품질 기준선을 만든다.
- 선행 Task: AG05-T05
- 기획 필요 내용:
  - 공통 요소와 viewport별 차이의 판정 기준을 정한다.
  - 대표 프로모션·위험 화면과 기대 분석 결과를 정의한다.
- 개발 필요 내용:
  - Cross-capture Merger와 Evidence 연결을 구현한다.
  - 고정 Fixture와 Schema·Confidence·비용 평가를 자동화한다.
- 예상 결과:
  - 모바일 구조를 Desktop 화면에서 추측하지 않는다.
  - Prompt·Model 변경의 품질과 비용을 동일 기준으로 비교한다.

### AG05-T07. Section·Component 구조 인식과 재사용 가능성 분석

- 목적: Screenshot의 시각적 영역을 단순 Bounding Box가 아니라 빌더가 이해할 수 있는 Section과 Component 구조로 변환한다.
- 선행 Task: AG05-T05, AG05-T06, AG04-T07
- 기획 필요 내용:
  - Header, Hero, Benefit, Steps, CTA, Terms, Footer 등 Section Role을 정의한다.
  - Card, Badge, Image, Text Group, CTA, Navigation 등 Component Role을 정의한다.
  - 반복 패턴, 부모·자식 구조, 복합 Component, 단순 Field의 판정 기준을 정한다.
  - 재사용 가능성과 특정 Screenshot 종속성을 평가하는 기준을 정한다.
- 개발 필요 내용:
  - Section Segmentation과 Component Boundary Analyzer를 구현한다.
  - 반복 Component Group과 부모·자식 관계를 구조화한다.
  - 각 Component에 Role, Field 후보, Style Slot 후보, Layout Hint를 생성한다.
  - 분석 근거 Region과 Confidence를 Component Proposal 입력으로 연결한다.
- 예상 결과:
  - Screenshot에서 구성된 Section과 Component를 구조적으로 확인할 수 있다.
  - 자동 Component 매칭과 Draft 생성에 사용할 일관된 입력 데이터가 마련된다.
  - 단순 시각적 유사성이 아니라 재사용 가능한 UI 구조를 중심으로 분석한다.

---

## AG-06. 관리자 검수·승인과 레퍼런스 라이브러리

### AG06-T01. Reference Library 목록과 등록

- 목적: 운영자가 Reference를 등록하고 상태별 작업 대상을 관리한다.
- 선행 Task: AG04-T06, AG05-T02
- 기획 필요 내용:
  - 목록 필드, Filter, 상태, 권한별 Action을 정의한다.
  - 등록·분석 중·실패·빈 상태 UX를 정한다.
- 개발 필요 내용:
  - 목록, 검색, Pagination, Screenshot 등록 UI를 구현한다.
  - Upload와 분석 진행 상태를 표시한다.
- 예상 결과:
  - 운영자가 Reference 상태와 다음 작업을 한 화면에서 파악한다.

### AG06-T02. Reference 상세와 원본 Preview

- 목적: Source, Capture, 분석, 권리, Version을 한곳에서 확인한다.
- 선행 Task: AG06-T01
- 기획 필요 내용:
  - 원본·Thumbnail·Version·권리 정보의 우선순위를 정한다.
- 개발 필요 내용:
  - Reference Detail과 Desktop·Mobile Preview를 구현한다.
  - Capture Version과 분석 실행 이력을 연결한다.
- 예상 결과:
  - 잘못된 원본과 분석 Version을 혼동하는 문제가 줄어든다.

### AG06-T03. 분석 결과 Inspector

- 목적: 원본과 AI 추출 결과를 근거 중심으로 비교한다.
- 선행 Task: AG06-T02, AG05-T05
- 기획 필요 내용:
  - 우선 검수 항목과 낮은 Confidence 표시 방식을 정한다.
  - Section·Component 경계 수정 방식을 결정한다.
- 개발 필요 내용:
  - Split View, Evidence Highlight, Token·Pattern Inspector를 구현한다.
  - 원본 영역과 분석 Entity 선택 상태를 연동한다.
- 예상 결과:
  - 운영자가 AI 오류를 원본 근거와 함께 빠르게 발견한다.

### AG06-T04. 분석값 수정과 Version 비교

- 목적: AI 분석 Draft를 수정하되 자동 결과와 과거 Version을 보존한다.
- 선행 Task: AG06-T03, AG04-T04
- 기획 필요 내용:
  - 자동값, 수정값, 제외값의 의미를 정의한다.
  - 재분석 시 기존 승인 데이터 유지·대체 정책을 정한다.
- 개발 필요 내용:
  - Draft Editor, Revision Conflict, Change History를 구현한다.
  - 분석 Version Diff와 승인 Snapshot 비교를 제공한다.
- 예상 결과:
  - 모델 개선과 운영자 수정이 서로 덮어쓰지 않는다.

### AG06-T05. 승인·거절과 권리 Workflow

- 목적: 검수 완료 데이터만 제품에서 사용할 수 있게 한다.
- 선행 Task: AG06-T04, AG02-T06
- 기획 필요 내용:
  - 필수 검수 항목, 승인 권한, 거절 사유를 정의한다.
  - Pattern 참고와 원본 Asset 재사용 권한을 분리한다.
- 개발 필요 내용:
  - Review State Transition API와 승인·거절 UI를 구현한다.
  - Rights Status와 Pattern/Asset Reuse Control을 추가한다.
  - Audit Event를 저장한다.
- 예상 결과:
  - 비승인·권리 미확인 데이터가 빌더에 노출되지 않는다.
  - 외부 자산의 부적절한 재사용 위험이 줄어든다.

### AG06-T06. Registry Mapping 사전 검사와 관리자 E2E

- 목적: 승인 전에 실제 빌더 구현 가능성을 확인하고 전체 검수 흐름을 검증한다.
- 선행 Task: AG06-T03, AG06-T05
- 기획 필요 내용:
  - 구현 가능, 부분 가능, 불가 판정 기준을 정한다.
  - 관리자 필수 E2E와 접근성 기준을 정의한다.
- 개발 필요 내용:
  - Component·Token·Layout Mapping Preview를 구현한다.
  - 등록→분석→수정→승인/거절→재분석 Browser Test를 추가한다.
- 예상 결과:
  - 승인했지만 빌더에서 사용할 수 없는 Pattern이 줄어든다.
  - 반복 검수 흐름의 안정성과 접근성이 확보된다.

---

## AG-07. Component·Layout·Style 자동 제안 관리 및 빌더 활용

### AG07-T01. 기존 Component 자동 매칭

- 목적: Screenshot에서 인식한 Component를 현재 Registry의 Component와 먼저 연결한다.
- 선행 Task: AG05-T07, AG06-T03, AG04-T07
- 기획 필요 내용:
  - Role, Field 구조, Style Slot, Layout, 편집 정책별 매칭 가중치를 정한다.
  - Exact Match, Configurable Match, Variant Match, Composition Match, No Match 기준을 정의한다.
  - 유사도만으로 자동 확정할 수 있는 최소 Confidence를 정한다.
- 개발 필요 내용:
  - Component Registry Candidate Resolver를 구현한다.
  - Field와 Style Slot 호환성, Image·CTA Policy, Desktop·Mobile 지원 여부를 비교한다.
  - 후보별 점수와 매칭·제외 근거를 Mapping Decision으로 저장한다.
- 예상 결과:
  - Screenshot마다 신규 Component가 무분별하게 생성되지 않는다.
  - 기존 Component의 재사용 가능성과 부족한 기능을 구체적으로 확인할 수 있다.

### AG07-T02. 재사용·Variant·조합·신규 생성 판단

- 목적: 분석된 UI 구조를 가장 작은 변경으로 Registry에 수용할 방법을 결정한다.
- 선행 Task: AG07-T01
- 기획 필요 내용:
  - 기존 설정 변경, Variant 추가, Section 조합, 신규 Component 생성의 우선순위를 확정한다.
  - 기존 Component를 확장할 수 있는 Field와 Style Slot 범위를 정한다.
  - 특정 Screenshot에만 종속된 구조를 신규 Component로 만들지 않는 기준을 정한다.
- 개발 필요 내용:
  - Reuse Decision Engine을 구현한다.
  - 각 제안에 `reuse`, `configure`, `add_variant`, `compose`, `create_draft`, `reject` Action을 부여한다.
  - 중복 Component와 과도한 Variant를 경고한다.
- 예상 결과:
  - Registry 규모를 통제하면서 필요한 디자인 표현력은 확장된다.
  - 신규 Component 생성 여부를 설명 가능한 방식으로 결정한다.

### AG07-T03. Component Proposal Schema와 Draft 자동 생성

- 목적: 기존 Component로 표현할 수 없는 구조를 실행 코드가 아닌 검수 가능한 Component Draft로 생성한다.
- 선행 Task: AG07-T02, AG04-T07
- 기획 필요 내용:
  - Component Role, Field, Default Value, Style Slot, Policy의 필수 항목을 정한다.
  - Desktop·Mobile Layout Hint와 접근성 요구를 정의한다.
  - AI가 제안할 수 있지만 관리자가 확정해야 하는 속성을 구분한다.
- 개발 필요 내용:
  - Component Proposal JSON Schema와 Validator를 구현한다.
  - Section·Component 분석 결과에서 Field 후보와 Style Slot 후보를 생성한다.
  - 기존 Component 유사도, 중복 근거, Source Evidence를 Proposal에 포함한다.
  - Proposal을 `wizard_item_component` Draft로 변환하는 Adapter를 구현하되 자동 활성화는 금지한다.
- 예상 결과:
  - Screenshot에서 발견된 새로운 UI를 구조화된 Component Draft로 관리할 수 있다.
  - 자유로운 Vue·HTML·CSS 코드 생성 없이 기존 편집기 계약을 유지한다.

### AG07-T04. Component Draft 관리·Preview·게시

- 목적: 자동 생성된 Component Draft를 관리자가 수정·미리보기·승인·게시한다.
- 선행 Task: AG07-T03, AG06-T05
- 기획 필요 내용:
  - Draft 수정, 중복 병합, Variant 전환, 거절, 게시 Workflow를 정의한다.
  - Desktop·Mobile Preview와 필수 접근성·편집 가능성 기준을 정한다.
- 개발 필요 내용:
  - Component Proposal 목록과 상세 관리 UI를 구현한다.
  - Field, Policy, Style Slot, Default Value 편집 기능을 제공한다.
  - Desktop·Mobile Fixture Preview와 Registry Contract Validation을 구현한다.
  - 승인된 Draft만 Component Version으로 게시하고 History를 저장한다.
- 예상 결과:
  - AI가 제안한 Component를 운영자가 통제하면서 Library로 확장한다.
  - 중복·일회성·반응형 미지원 Component의 활성화를 차단한다.

### AG07-T05. Layout Pattern 분석과 Preset Draft 생성

- 목적: Screenshot의 Section Layout을 현재 빌더에서 실행 가능한 Desktop·Mobile Preset Draft로 변환한다.
- 선행 Task: AG05-T07, AG07-T01, AG03-T03
- 기획 필요 내용:
  - Container, Grid, Column, Alignment, Gap, Stack의 표준 표현을 정한다.
  - 좌표 변환, Mobile 순서, 최소·최대 크기, 지원 불가 Geometry 정책을 정의한다.
- 개발 필요 내용:
  - Layout Pattern-to-Preset Adapter를 구현한다.
  - 현재 Section과 Component Instance에 Geometry를 매핑한다.
  - Desktop·Mobile Layout Contract를 검증하고 Layout Preset Draft를 생성한다.
  - 지원하지 않는 Geometry와 누락 Component를 경고로 반환한다.
- 예상 결과:
  - Screenshot Layout이 단순 설명이 아니라 편집기에서 검수 가능한 Preset Draft로 생성된다.
  - 모바일 배치 누락과 무제한 자유 좌표 생성을 방지한다.

### AG07-T06. Design Style Profile과 Token Draft 생성

- 목적: Screenshot의 시각적 특성을 재사용 가능한 디자인 스타일과 토큰으로 저장한다.
- 선행 Task: AG05-T05, AG05-T07, AG04-T07
- 기획 필요 내용:
  - Color, Typography, Spacing, Radius, Border, Elevation의 Token Role을 정한다.
  - Style Profile의 Tag, Image Treatment, Responsive Rule, Do·Don't 구성을 정의한다.
  - 기존 Token Set과 병합·Alias·충돌 처리 방식을 결정한다.
- 개발 필요 내용:
  - 분석 Token을 DTCG 기반 Token Draft로 변환한다.
  - Component Pattern, Layout Pattern, Image Treatment, Guideline을 Style Profile에 연결한다.
  - 기존 Token Set과 유사도·충돌·누락을 비교한다.
  - Style Profile Draft의 Preview, Version, 승인·게시를 구현한다.
- 예상 결과:
  - 색상만 저장하는 수준을 넘어 일관된 Layout·Component·이미지 규칙을 학습 자산으로 축적한다.
  - 프로모션 제작 시 전체 스타일 또는 일부 Token만 선택해 재사용할 수 있다.

### AG07-T07. 승인된 Component·Layout·Style Library 조회

- 목적: 게시된 디자인 지식 중 현재 프로모션에서 사용할 수 있는 항목만 빌더에 제공한다.
- 선행 Task: AG07-T04, AG07-T05, AG07-T06, AG06-T05
- 기획 필요 내용:
  - 시장, Locale, 브랜드, Promotion Type, Tag, 권리 Filter를 정한다.
  - Component·Layout·Style의 호환성과 적용 범위 표시 방식을 정의한다.
- 개발 필요 내용:
  - Approved/Published-only Query API를 구현한다.
  - 현재 Template·Section·Component Contract와의 호환성을 검사한다.
  - 구현 불가 항목과 제외 이유를 반환한다.
- 예상 결과:
  - 검수되지 않았거나 현재 문서에 적용할 수 없는 데이터가 빌더에 노출되지 않는다.

### AG07-T08. 빌더 선택·적용 범위·Apply Proposal

- 목적: 사용자가 승인된 Reference, Component, Layout, Style 중 원하는 범위를 선택하고 적용 전에 검토한다.
- 선행 Task: AG07-T07, AG03-T06
- 기획 필요 내용:
  - 전체 Style, Token, Layout, Component, Image Treatment의 적용 범위를 정의한다.
  - 적용 전 검토, Revision 충돌, 출처 표시 기준을 정한다.
- 개발 필요 내용:
  - Library 검색·미리보기·선택 UI를 구현한다.
  - 적용 범위별 Apply Request와 Proposal Preview를 구현한다.
  - Source, Analysis, Component Version, Layout Version, Style Version, Rights Snapshot을 저장한다.
- 예상 결과:
  - 사용자가 원하는 디자인 특성만 선택적으로 적용할 수 있다.
  - 적용 근거와 사용 Version을 사후 추적할 수 있다.

### AG07-T09. 적용 전후 비교·Undo·품질 Gate

- 목적: 적용 결과를 비교하고 안전하게 되돌리며 깨진 결과의 승격을 차단한다.
- 선행 Task: AG07-T08, AG03-T04
- 기획 필요 내용:
  - Token·Component·Layout 변경 비교와 Undo 범위를 정한다.
  - 비승인·권리 만료·Layout 실패·렌더 실패의 Blocking 기준을 정한다.
- 개발 필요 내용:
  - Snapshot Diff, Apply, Revert를 구현한다.
  - Data, Rights, Registry, Layout, Desktop·Mobile Render Gate를 연결한다.
  - Revision 충돌과 사용자 수정 보존 Test를 추가한다.
- 예상 결과:
  - 불만족하거나 위험한 결과를 안전하게 복구할 수 있다.
  - 승인된 지식도 현재 콘텐츠와 맞지 않으면 완료 Preview로 승격되지 않는다.

### AG07-T10. 사용 Event와 학습 데이터 축적

- 목적: Component·Layout·Style 제안과 실제 사용 결과를 추천 개선 데이터로 저장한다.
- 선행 Task: AG07-T08, AG07-T09, AG04-T05
- 기획 필요 내용:
  - 추천·조회·선택·적용·수정·거절·병합·Undo·Publish Event 의미를 정의한다.
  - Component Proposal과 Layout·Style별 효용 지표를 정한다.
- 개발 필요 내용:
  - Usage Event API와 중복 방지를 구현한다.
  - 선택률, 적용률, 수정량, Undo율, Publish율을 집계한다.
  - Mapping Decision과 운영자 최종 선택을 연결한다.
- 예상 결과:
  - 어떤 Component·Layout·Style이 실제로 유용한지 측정할 수 있다.
  - 향후 자동 매칭과 추천 우선순위를 실제 피드백으로 개선할 수 있다.

---

## AG-08. 외부 웹 URL Capture

### AG08-T01. URL 지원 범위와 위협 모델

- 목적: URL Capture 기능의 허용 범위와 보안 위험을 먼저 확정한다.
- 선행 Task: AG02-T06
- 기획 필요 내용:
  - 공개 URL, 내부 URL, 로그인 페이지 지원 범위를 정한다.
  - SSRF, DNS Rebinding, Redirect, Popup, Download 위험 대응을 정의한다.
- 개발 필요 내용:
  - Threat Model과 공격 Fixture 목록을 작성한다.
  - Capture Policy와 차단 오류 코드를 정의한다.
- 예상 결과:
  - 구현 범위와 허용되지 않는 사용 사례가 명확해진다.

### AG08-T02. Safe Remote Page Validator

- 목적: 안전한 공개 HTTPS URL만 Browser Worker에 전달한다.
- 선행 Task: AG08-T01
- 기획 필요 내용:
  - Host Allow/Deny, Port, Redirect 횟수, DNS 재검증 정책을 정한다.
- 개발 필요 내용:
  - HTTPS, Credential, Port, Public IP Validator를 구현한다.
  - Redirect마다 URL과 DNS를 다시 검증한다.
  - IPv4·IPv6 사설망과 Metadata 우회 Test를 추가한다.
- 예상 결과:
  - 내부 시스템과 Cloud Metadata 접근이 차단된다.

### AG08-T03. 격리 Browser Worker와 네트워크 차단

- 목적: 외부 페이지가 애플리케이션 Runtime과 내부 네트워크에 영향을 주지 않게 한다.
- 선행 Task: AG08-T02, AG02-T04
- 기획 필요 내용:
  - Worker 실행 위치, CPU·Memory·시간·동시성 제한을 정한다.
  - Subresource, Popup, Download, Protocol 정책을 결정한다.
- 개발 필요 내용:
  - 격리 Browser Runtime과 Queue를 구현한다.
  - 모든 Browser Request에 Interception과 IP 검증을 적용한다.
  - Timeout과 강제 종료를 구현한다.
- 예상 결과:
  - 위험한 페이지가 서비스 Runtime을 직접 공격하지 못한다.
  - 무한 로딩과 대형 페이지가 제한된 자원 안에서 종료된다.

### AG08-T04. Page Load와 Multi-viewport Capture

- 목적: 동적 웹페이지를 반복 가능한 Desktop·Tablet·Mobile 상태로 캡처한다.
- 선행 Task: AG08-T03
- 기획 필요 내용:
  - Load 완료, Lazy Load, Scroll, Cookie Banner, Animation 정지 기준을 정한다.
  - viewport와 Full-page 캡처 규격을 결정한다.
- 개발 필요 내용:
  - Page Load Controller와 Capture Manifest를 구현한다.
  - viewport별 Screenshot과 최종 URL을 Version으로 저장한다.
- 예상 결과:
  - URL만 입력해 Desktop·Mobile 디자인 원본을 확보한다.
  - 동일 정책으로 재캡처할 수 있다.

### AG08-T05. DOM·Computed Style 추출과 분석 병합

- 목적: Screenshot 비전 분석을 실제 DOM 위치와 계산 Style로 보완한다.
- 선행 Task: AG08-T04, AG05-T05
- 기획 필요 내용:
  - 저장할 DOM 범위와 개인정보 제거 기준을 정한다.
  - DOM/CSS와 Vision 결과 충돌 시 우선순위를 결정한다.
- 개발 필요 내용:
  - Script·Event Handler 제거 Sanitizer를 구현한다.
  - Geometry, Typography, Color, Visibility Extractor를 구현한다.
  - Multi-source Evidence Normalizer를 구현한다.
- 예상 결과:
  - 위치와 Style은 실제 측정값, 의미는 AI 분석으로 보완한다.
  - Screenshot 단독 분석보다 정확한 Layout·Responsive 데이터가 생성된다.

### AG08-T06. URL 등록·재캡처 UI와 보안 E2E

- 목적: 운영자가 Capture 진행과 실패를 관리하고 보안 요구사항을 검증한다.
- 선행 Task: AG08-T02~AG08-T05
- 기획 필요 내용:
  - 진행 단계, Retry, 재캡처 Version, 실패 메시지 UX를 정한다.
- 개발 필요 내용:
  - URL 등록, 진행 상태, 최종 URL, Retry·Recapture UI를 구현한다.
  - localhost, Redirect, DNS, 대형 응답, 무한 로딩 E2E를 추가한다.
- 예상 결과:
  - 운영자가 기술 로그 없이 Capture 상태와 복구 방법을 이해한다.
  - URL 기능을 제품에 노출하기 전 핵심 공격 경로가 검증된다.

---

## AG-09. 자동 추천·검색과 피드백 최적화

### AG09-T01. 추천 후보와 Filter 계약

- 목적: 추천 대상과 제외 조건을 결정론적으로 정의한다.
- 선행 Task: AG07-T01
- 기획 필요 내용:
  - 추천 후보 필드, 개수, 제외 사유, 점수 구성을 정한다.
  - Market, Locale, Promotion Type, Tone, Rights 우선순위를 정의한다.
- 개발 필요 내용:
  - Candidate Contract와 PostgreSQL Rule Filter를 구현한다.
  - 검색용 Index와 정상·제외 Fixture를 추가한다.
- 예상 결과:
  - Vector 검색 없이도 설명 가능한 초기 추천 기반이 마련된다.

### AG09-T02. Implementability와 Fit Score

- 목적: 실제로 구현 가능하고 콘텐츠에 맞는 후보를 우선 추천한다.
- 선행 Task: AG09-T01, AG07-T02, AG03-T03
- 기획 필요 내용:
  - Component·Layout·Token 구현 가능성과 콘텐츠 적합도의 가중치를 정한다.
- 개발 필요 내용:
  - Implementability, Content Fit, Layout Fit 계산기를 구현한다.
  - Score Breakdown과 Blocking Reason을 반환한다.
- 예상 결과:
  - 적용 후 실패하거나 큰 수정이 필요한 후보가 줄어든다.

### AG09-T03. 다양성과 모방 방지

- 목적: 추천이 동일한 스타일에 편중되거나 특정 출처를 과도하게 모방하지 않게 한다.
- 선행 Task: AG09-T02
- 기획 필요 내용:
  - 후보 다양성, 동일 Source 상한, 유사성 제한 기준을 정한다.
- 개발 필요 내용:
  - Diversity Reranker와 Source Cap을 구현한다.
  - 결과 간 Style Tag와 Layout 차이를 측정한다.
- 예상 결과:
  - 사용자에게 실질적으로 다른 디자인 선택지를 제공한다.
  - 단일 외부 사이트 모방 위험이 낮아진다.

### AG09-T04. LLM Semantic 재정렬과 Fallback

- 목적: 규칙 후보 안에서 의미 적합도를 보완하되 안정성을 유지한다.
- 선행 Task: AG09-T03, AG02-T05
- 기획 필요 내용:
  - LLM이 변경할 수 있는 범위와 추천 설명 형식을 정한다.
  - 오류·누락 시 Fallback 기준을 결정한다.
- 개발 필요 내용:
  - 승인된 후보만 재정렬하는 Planner를 구현한다.
  - 임의 ID, 후보 누락, Schema 오류 시 Rule 결과로 Fallback한다.
- 예상 결과:
  - 의미 적합도를 높이면서 LLM 오류로 추천 전체가 실패하지 않는다.

### AG09-T05. Template 추천 연결과 추천 UI

- 목적: Template, Token, Layout, Reference 추천을 하나의 사용자 선택으로 연결한다.
- 선행 Task: AG09-T04, AG07-T04
- 기획 필요 내용:
  - Template와 Reference 추천 순서와 사용자 노출 정보를 정한다.
  - 추천 이유·경고·불가 항목 표시 방식을 정의한다.
- 개발 필요 내용:
  - 기존 Template Recommender Context와 Snapshot을 확장한다.
  - 상위 후보, Preview, 이유, Score UI를 구현한다.
- 예상 결과:
  - 사용자가 추천 결과를 비교하고 선택 근거를 이해할 수 있다.

### AG09-T06. Feedback 평가와 Vector 검색 판단

- 목적: 실제 사용 결과로 추천 개선을 측정하고 추가 AI 기술 도입을 판단한다.
- 선행 Task: AG07-T07, AG09-T05
- 기획 필요 내용:
  - 선택률, 적용률, 수정량, 취소율, Publish율의 의미를 정한다.
  - Offline 정답셋과 Vector 검색 도입 기준을 결정한다.
- 개발 필요 내용:
  - Usage Funnel과 Edit Distance 집계를 구현한다.
  - Retrieval 평가셋과 Regression Runner를 만든다.
  - Embedding PoC를 Rule Ranker와 비교한다.
- 예상 결과:
  - 추천 변경의 개선 여부를 배포 전에 측정한다.
  - Vector 검색과 파인튜닝은 효과가 확인될 때만 도입한다.

---

## AG-10. 운영 전환·관측과 레거시 정리

### AG10-T01. SLI·SLO·비용 Dashboard

- 목적: 제품 상태와 비용을 정량적으로 운영한다.
- 선행 Task: AG02-T07, AG09-T06
- 기획 필요 내용:
  - Capture·Analysis·Review·Apply 성공률과 지연 목표를 정한다.
  - Queue 정체, Provider 비용, 승인 대기 Alert 기준을 결정한다.
- 개발 필요 내용:
  - Metrics Query, Dashboard, Alert를 구현한다.
  - Version·Provider·Failure Stage별 조회를 제공한다.
- 예상 결과:
  - 장애와 비용 이상을 사용자 제보 전에 발견할 수 있다.

### AG10-T02. 운영 Runbook과 복구 도구

- 목적: 반복 장애를 특정 개발자 지식 없이 처리할 수 있게 한다.
- 선행 Task: AG10-T01
- 기획 필요 내용:
  - 장애별 Owner, 사용자 공지, 복구·Rollback 절차를 정한다.
- 개발 필요 내용:
  - stuck Job, 고아 Blob, Provider 장애, 권리 제한 점검 도구를 만든다.
  - 운영 Runbook과 확인 Checklist를 작성한다.
- 예상 결과:
  - 장애 대응 시간과 개인 의존도가 줄어든다.

### AG10-T03. 보존·삭제·Backup·Restore

- 목적: 원본과 파생 데이터의 생명주기를 안전하게 관리한다.
- 선행 Task: AG04-T06, AG08-T05
- 기획 필요 내용:
  - 원본·DOM·분석·승인·Usage 데이터 보존기간을 정한다.
  - 삭제 요청이 기존 Builder Snapshot에 미치는 영향을 결정한다.
- 개발 필요 내용:
  - Archive, Purge, Reindex Job을 구현한다.
  - Backup·Restore와 삭제 후 검색 제외 Test를 수행한다.
- 예상 결과:
  - 권리·개인정보 삭제 요청에 일관되게 대응한다.
  - 운영 데이터 손실 시 복구 가능성이 확보된다.

### AG10-T04. 성능·비용·보안 최종 검증

- 목적: 운영 규모에서의 병목과 잔여 보안 위험을 출시 전에 확인한다.
- 선행 Task: AG08-T06, AG09-T06
- 기획 필요 내용:
  - 예상 동시 사용자, Queue 상한, 비용 예산, 출시 차단 기준을 정한다.
- 개발 필요 내용:
  - Upload, Capture, Analysis, Search 부하 Test를 수행한다.
  - SSRF, 권한, Blob, Script, Rights 보안 Test를 최종 실행한다.
- 예상 결과:
  - 운영 병목과 비용 상한을 사전에 확인한다.
  - 수용할 잔여 위험과 차단 위험이 명확해진다.

### AG10-T05. 제한 사용자 Pilot과 단계적 Rollout

- 목적: 전체 공개 전에 실제 운영 환경에서 기능과 UX를 검증한다.
- 선행 Task: AG10-T01~AG10-T04
- 기획 필요 내용:
  - Pilot 사용자, 기간, 성공 기준, 중단 조건을 정한다.
  - 내부→일부→전체 Rollout 순서를 결정한다.
- 개발 필요 내용:
  - 그룹·비율 Feature Flag와 Pilot Dashboard를 구성한다.
  - Feedback 수집과 Kill Switch를 검증한다.
- 예상 결과:
  - P0 문제를 전체 사용자 노출 전에 발견한다.
  - 품질 악화 시 즉시 이전 상태로 돌아갈 수 있다.

### AG10-T06. Design MD Cutover와 POC 코드 정리

- 목적: 신규 Reference 체계로 업무를 통합하고 중복 유지보수를 종료한다.
- 선행 Task: AG10-T05, AG01-T05
- 기획 필요 내용:
  - 기존 Route·북마크·업무 절차 호환 기간을 정한다.
  - 코드 삭제 승인과 Archive 기준을 결정한다.
- 개발 필요 내용:
  - 신규 Library Redirect와 API Adapter를 적용한다.
  - 실제 참조 0과 Rollback 경로를 확인한 후 Retirement PR을 분리한다.
  - 운영자 사용 가이드를 작성한다.
- 예상 결과:
  - Design MD와 Reference의 이중 관리가 종료된다.
  - POC 중복 코드와 유지보수 대상이 줄어든다.

---

## 우선 착수 Task

다음 네 Task는 병렬로 시작한다.

### 1. AG01-T01. 화면과 사용자 흐름 인벤토리

- 현재 실제 사용자 흐름과 중복 화면을 확인한다.

### 2. AG01-T02. API와 Worker 책임 지도

- API, n8n, Worker, Provider 호출 관계를 확인한다.

### 3. AG01-T03. DB Schema와 Migration 감사

- 현재 데이터 구조와 신규 Migration 위험을 확인한다.

### 4. AG01-T06. 테스트 기준선 확보

- 기존 기능의 정상 상태와 회귀 차단 기준을 확인한다.

네 Task의 결과를 합쳐 AG01-T04와 AG01-T05를 완료한 후 AG-02 공통 기반 개발을 시작한다.

AG-01 완료 전에는 신규 Reference UI, Vision Provider 실제 호출, URL Browser Worker, Vector 검색을 제품 경로에 구현하지 않는다.

### 첫 번째 제품 Vertical Slice 실행 순서

AG-01 이후 다음 Task 묶음을 순서대로 진행한다.

#### 1. 최소 운영 기반

- AG02-T01 공통 API와 오류 계약
- AG02-T03 Idempotency와 중복 방지
- AG02-T04 공통 Job 상태·Lease·Retry
- AG02-T05 실행 Snapshot 표준화
- AG02-T06 인증·역할·감사 로그

예상 결과:

- Screenshot 등록과 분석 작업을 중복·정체·권한 누출 없이 실행할 최소 기반이 준비된다.

#### 2. Design Reference 데이터 기반

- AG04-T01 Reference Source 모델
- AG04-T02 Capture와 원본 Version 모델
- AG04-T03 Analysis Run과 Evidence 모델
- AG04-T04 Review와 승인 Version 모델
- AG04-T07 Component Proposal·Layout Draft·Style Profile 모델

예상 결과:

- 원본 Screenshot, 분석 결과, Component 제안, Layout Draft, Style Profile을 독립적으로 저장·검수할 수 있다.

#### 3. Screenshot 구조 분석

- AG05-T01 Screenshot 업로드 정책과 검증
- AG05-T02 Screenshot 저장 Pipeline
- AG05-T03 분석 JSON Schema v1
- AG05-T04 Vision Prompt와 Provider 정책
- AG05-T05 Vision Analysis Worker와 Normalizer
- AG05-T07 Section·Component 구조 인식과 재사용 가능성 분석

예상 결과:

- Screenshot을 업로드하면 Section, Component, Layout, Token, Style Draft가 Evidence와 함께 생성된다.

#### 4. 자동 매칭과 관리 가능한 Draft 생성

- AG07-T01 기존 Component 자동 매칭
- AG07-T02 재사용·Variant·조합·신규 생성 판단
- AG07-T03 Component Proposal Schema와 Draft 자동 생성
- AG07-T05 Layout Pattern 분석과 Preset Draft 생성
- AG07-T06 Design Style Profile과 Token Draft 생성

예상 결과:

- 기존 Component 재사용을 우선하면서 미매칭 UI만 Component Draft로 제안된다.
- Layout과 디자인 스타일이 실행 가능한 Draft와 학습 가능한 Profile로 저장된다.

#### 5. 운영자 검수·게시

- AG06-T03 분석 결과 Inspector
- AG06-T04 분석값 수정과 Version 비교
- AG06-T05 승인·거절과 권리 Workflow
- AG06-T06 Registry Mapping 사전 검사와 관리자 E2E
- AG07-T04 Component Draft 관리·Preview·게시

예상 결과:

- 운영자가 자동 분석과 Draft를 수정·검증하고 승인된 Version만 Registry와 Library에 게시한다.

#### 6. 빌더 수동 적용과 품질 고도화

- AG07-T07 승인된 Component·Layout·Style Library 조회
- AG07-T08 빌더 선택·적용 범위·Apply Proposal
- AG07-T09 적용 전후 비교·Undo·품질 Gate
- AG07-T10 사용 Event와 학습 데이터 축적
- AG03-T02~AG03-T06 기존 Builder 품질 고도화

예상 결과:

- 승인된 디자인 지식을 프로모션 빌더에서 선택적으로 적용하고 결과를 안전하게 검증·복구할 수 있다.
- 실제 사용 데이터에 근거해 다음 Component·Layout·Style 고도화 우선순위를 결정할 수 있다.

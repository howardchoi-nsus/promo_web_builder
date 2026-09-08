# 프로모 빌더 핵심 기능 고도화 실행 계획서

## 0. 문서 정보

- 작성일: 2026-09-08
- 목표 시점: 2026-11-30
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 실행 계획 초안
- 우선 목표: Directus 도입보다 프로모 빌더의 생성 품질, 편집 안정성, 출력 일치성, 운영 준비도를 먼저 완성한다.
- 실행 기준: 최근 계획서에서 완료로 기록된 기능은 재개발하지 않고 현행 검증 후 보완한다.

## 1. 최종 목표

사용자가 자연어와 기본 프로모션 정보를 입력하면 다음 흐름을 안정적으로 완료할 수 있어야 한다.

```text
프로모션 입력
→ AI 개요·콘텐츠 구성
→ Section·Component·Layout 자동 조합
→ 이미지·자산 생성
→ Desktop·Mobile 품질 검사와 제한적 자동 보정
→ Live Preview
→ 사용자의 안전한 직접 편집
→ 저장·재진입
→ Web Output·Export
```

11월 말의 목표 상태는 다음과 같다.

- 깨진 결과가 Live Preview와 Export에 성공 상태로 노출되지 않는다.
- AI 생성 결과의 레이아웃, 콘텐츠, 이미지, Locale 품질이 정량 기준으로 검증된다.
- 사용자가 Component와 내부 Field를 선택해 콘텐츠·스타일·배치를 수정할 수 있다.
- 저장, 재진입, Undo/Redo, Revision, Preview, Export 결과가 일치한다.
- 생성 Job이 실패하거나 중단돼도 원인 확인과 안전한 재시도가 가능하다.
- 운영 배포 전후 품질과 성능을 고정된 Fixture와 지표로 비교할 수 있다.

## 2. 이번 기간의 범위

### 2.1 포함

1. 현재 구현·Migration·배포 상태의 기준선 확정
2. AI 생성 결과의 품질 게이트 완성
3. 제한된 자동 Repair와 실패 안내
4. Component·Field 단위 편집 경험 안정화
5. 저장·Revision·Preview·Export 계약 통합
6. Prompt·Model·Preset·Token 운영 설정 활성화
7. Job 재시도·중복 방지·상태 복구
8. 고정 Viewport Golden Corpus와 회귀 테스트
9. 운영 지표, 오류 진단, 단계적 Rollout

### 2.2 제외

- Directus 연결 설정과 Collection 구축
- 기존 DB 또는 WordPress 데이터의 Directus 이전
- Directus MCP와 Agent Control Plane
- 기존 관리자 화면 종료
- 외부 URL Capture
- Vector 검색, 파인튜닝, 자동 학습
- AI가 생성한 임의 Vue·HTML·CSS의 자동 운영 반영
- Visual Editor의 전면 재작성

Directus 후속 도입을 막는 새로운 하드코딩은 추가하지 않는다. 다만 이번 기간에는 Directus Adapter나 Migration Runner를 구현하지 않는다.

## 3. 추진 원칙

### 3.1 기존 계약 우선

- Registry Contract v3, 공통 Renderer, Visual Editor, Prompt Version, Design Token 구조를 유지한다.
- 신규 기능은 기존 Template Mode와 AI Mode를 동시에 파손하지 않아야 한다.
- 이미 완료로 기록된 Inspector, Drag, Field Layout 기능은 재구현하지 않고 회귀 검증 대상으로 둔다.

### 3.2 결정적 규칙과 AI 역할 분리

- 필수 Section, 허용 Component, Layout Lock, Asset Readiness, 저장 가능 여부는 코드와 설정 규칙이 결정한다.
- AI는 허용된 후보 안에서 콘텐츠와 조합을 제안한다.
- AI 결과가 실패하면 조용히 보정하거나 누락하지 않고 진단 코드와 수정 방법을 제공한다.

### 3.3 Preview와 출력의 동일 계약

- Preview 전용 우회 스타일을 최소화한다.
- Desktop·Tablet·Mobile 검사는 실제 Renderer와 동일한 데이터와 CSS를 사용한다.
- 현재 Document Revision에 대한 품질 결과만 저장과 Export에 사용할 수 있다.

### 3.4 운영 데이터 보호

- 활성 Prompt, Preset, Token Version을 직접 수정하지 않는다.
- 변경은 Draft → Validate → Preview → Activate 순서를 따른다.
- 실행 시작 시 Prompt·Model·Preset·Token Version을 Snapshot으로 고정한다.

## 4. 고도화 Workstream

## PBH-00. 현행 기준선과 운영 반영 정리 — P0

### 목적

문서상 완료와 실제 개발·운영 환경의 차이를 제거한다.

### 작업

- Migration 056, 058, 059의 코드 존재, 적용 순서, 운영 적용 여부 확인
- 미배포 변경과 활성화되지 않은 Prompt·Preset·Token Draft 식별
- Node 22.x 기준 Build와 전체 Test 재실행
- Template Mode와 AI Mode 핵심 E2E 기준선 확보
- 완료·부분 완료·미구현 기능을 하나의 상태표로 통합
- 실패 Fixture와 정상 Fixture를 Release Baseline으로 고정

### 완료 조건

- 운영 반영 여부가 불명확한 Migration과 설정이 없다.
- 현재 전체 테스트 결과와 알려진 실패가 기록된다.
- 이후 작업이 비교할 Commit, Migration, 활성 설정 Version이 고정된다.

## PBH-01. 생성 품질 Gate와 진단 영속화 — P0

### 목적

현재 Revision의 품질 검사 결과를 서버에서 신뢰할 수 있게 보존하고 실패 원인을 사용자에게 연결한다.

### 작업

- Desktop·Mobile 품질 결과를 Document Revision에 저장
- Revision 변경 시 이전 품질 결과를 `pending`으로 무효화
- Blocking과 Warning 진단 코드의 단일 Catalog 구성
- 진단 항목에 Section, Component, Field, Viewport, 수정 가능 여부 포함
- 실패 항목 선택 시 Visual Editor의 문제 위치로 이동
- 저장·Web Output·HTML/Vue/React Export의 Gate 검증 통일
- 오래된 Revision 결과와 클라이언트 조작 결과 차단

### 완료 조건

- 현재 Revision의 Desktop·Mobile Blocking이 0건일 때만 출력할 수 있다.
- 사용자가 실패 원인과 수정 위치를 확인할 수 있다.
- API별 Gate 판정 차이가 없다.

## PBH-02. Render Harness와 Golden Corpus — P0

### 목적

레이아웃·반응형·출력 품질을 눈대중이 아닌 반복 가능한 기준으로 검증한다.

### 작업

- 1440, 1024, 390, 360 고정 Viewport Render Harness 구축
- Hero, Benefit Card, CTA, Terms, Image Frame 대표 Fixture 구성
- 짧은 제목, 긴 제목, 다국어, 이미지 누락, 과도한 카드 수 등 위험 Fixture 추가
- Preview와 Web Output의 DOM·Style·Screenshot 비교
- 허용 임계값과 의도된 차이 Allowlist 관리
- 주요 Preset과 Token 변경 시 Golden 회귀 검사 실행

### 완료 조건

- 핵심 Fixture가 네 Viewport에서 자동 렌더링된다.
- Preview와 Output의 치명적 구조 차이가 0건이다.
- 실패 Screenshot과 진단 결과가 CI 산출물로 남는다.

## PBH-03. Content–Layout Fit 및 제한적 자동 Repair — P0/P1

### 목적

허용된 Preset 안에서 콘텐츠에 적합한 Layout을 선택하고 안전한 문제만 자동 보정한다.

### 작업

- 현재 구현된 Layout Fit Scoring과 반복 방지 정책의 코드·운영 활성 상태 검증
- Title 길이, CTA 수, 이미지 비율, 카드 수, Locale을 Fit 입력으로 표준화
- `layoutLocked`, AI Allowlist, 사용자 수정 여부를 강제 보호
- 자동 Repair를 최대 2회로 제한
- Repair 순서 고정:
  1. 허용 범위 내 Gap·Text Width 조정
  2. 더 적합한 허용 Layout Preset 재선택
- Repair 전후 Layout Key, 점수, 변경 사유를 Revision에 저장
- 해결되지 않으면 성공 처리하지 않고 편집 가능한 진단으로 전환

### 완료 조건

- 같은 입력의 무의미한 Layout 반복이 줄어든다.
- 잠긴 Layout과 사용자 수정값은 자동 변경되지 않는다.
- 자동 보정은 허용 Geometry를 벗어나지 않으며 최대 횟수를 초과하지 않는다.

## PBH-04. 콘텐츠·Locale·이미지 품질 — P0/P1

### 목적

형태만 완성됐지만 실제 사용할 수 없는 결과를 차단한다.

### 작업

- 필수 Section과 필수 Field 누락을 생성 전에 Fail-closed 처리
- 같은 Card 문구·CTA의 과도한 중복 탐지
- 입력 Locale을 전체 생성·편집·출력 과정의 불변값으로 유지
- 필수 Locale Resource가 없으면 다른 언어로 조용히 대체하지 않음
- 이미지 역할별 예상 자산 수와 완료 상태 검증
- 깨진 URL, Placeholder, 저해상도, 잘못된 비율 진단
- 브랜드 이미지 적합도는 초기에는 자동 차단이 아닌 Advisory Score로 수집

### 완료 조건

- 필수 Section·콘텐츠·이미지가 없는 결과는 성공 처리되지 않는다.
- 한 페이지 안에서 의도하지 않은 언어 혼합이 없다.
- 반복 콘텐츠와 이미지 실패를 사용자가 구체적으로 확인할 수 있다.

## PBH-05. Visual Editor 핵심 편집 안정화 — P0/P1

### 목적

AI 결과를 비전문 사용자도 안전하게 수정하고 복구할 수 있게 한다.

### 작업

- Component와 복합 Component의 자식 Field 선택 계약 회귀 검증
- Contextual Inspector의 위치, 키보드 접근, Focus Return 검증
- Drag Handle, Resize, Reflow, 자동 높이, 겹침 보정 통합 검증
- Mobile Override와 Desktop 값 상속 관계를 화면에 명시
- 변경된 속성, 상속값, 초기화 범위를 구분 표시
- 저장 중 중복 클릭과 Revision Conflict 차단
- Undo/Redo 범위에 콘텐츠, 스타일, 배치, 자동 Repair 반영
- 오류 진단에서 해당 Section·Component·Field로 이동

### 완료 조건

- 주요 편집 동작 후 저장·재진입 결과가 동일하다.
- Component 이동과 내부 Field 편집이 서로 충돌하지 않는다.
- Desktop 편집이 의도치 않게 Mobile Override를 삭제하지 않는다.
- 실패한 변경은 Undo 또는 마지막 Revision으로 복구할 수 있다.

## PBH-06. 저장·Preview·Export 정합성 — P0

### 목적

편집 화면에서 확인한 결과가 저장 후와 실제 산출물에서 달라지는 문제를 제거한다.

### 작업

- Editor Command → Document Operation → Revision 저장 경로 단일화
- 저장 전후 정규화 규칙과 Default 삽입 시점 통일
- Preview, Web Output, HTML, Vue, React Adapter의 Contract 비교
- Asset URL, Token Resolution, Locale Resolution 기준 통일
- 재진입 시 선택한 Layout과 사용자 Override 복원
- Export 실패 시 부분 산출물을 성공 결과로 제공하지 않음

### 완료 조건

- Golden Corpus에서 Preview와 Web Output의 치명적 차이가 없다.
- 저장 전후 Document Hash가 의도된 정규화 외에는 변하지 않는다.
- Export 실패와 품질 Gate 실패가 명확히 구분된다.

## PBH-07. 생성 Job 안정성과 사용자 상태 UX — P1

### 목적

오래 걸리는 AI 작업의 정체, 중복 실행, 무한 대기 문제를 줄인다.

### 작업

- 생성 단계별 공통 상태와 Progress Message 정리
- Request ID, Run ID, Document ID, Revision ID 연결
- Idempotency Key로 중복 생성과 중복 비용 방지
- Lease, Heartbeat, Stale Job 복구 기준 통일
- 재시도 가능 오류와 사용자 조치가 필요한 오류 분리
- 단계별 Retry와 전체 재시작을 구분
- 취소·이탈·재진입 후 현재 상태 복원
- 실제 실행 중인 Provider·Model을 안전하게 표시

### 완료 조건

- 중복 클릭과 네트워크 재요청으로 동일 Job이 중복 생성되지 않는다.
- 정체 Job을 자동 탐지하고 안전하게 재시도하거나 실패 처리한다.
- 사용자가 현재 단계, 실패 원인, 가능한 다음 행동을 알 수 있다.

## PBH-08. 운영 설정·관측·단계적 배포 — P1

### 목적

품질 변경을 안전하게 활성화하고 효과를 확인한다.

### 작업

- Prompt·Model·Preset·Token Draft의 Preview·Validate·Activate 완료
- 실행 Snapshot에 활성 설정 Version과 Hash 저장
- 품질 Gate를 `observe → warn → block` 단계로 Rollout
- 성공률, 단계별 실패율, 생성시간 P50/P95, Repair 성공률 수집
- Provider·Model·Prompt Version별 품질과 비용 비교
- Registry Component와 Layout Preset의 선택·실패·사용자 수정률 수집
- Kill Switch와 이전 활성 Version Rollback 검증

### 완료 조건

- 설정 변경 전후 품질과 비용을 비교할 수 있다.
- 새 Gate를 일부 사용자부터 단계적으로 활성화할 수 있다.
- 이상 발생 시 이전 활성 Version 또는 비차단 모드로 복구할 수 있다.

## 5. 일정

| 기간 | 단계 | 주요 산출물 |
|---|---|---|
| 9/8~9/18 | Phase 0. 기준선 확정 | Migration·배포 상태표, Node 22 CI, 핵심 E2E 기준선 |
| 9/21~10/2 | Phase 1. 품질 결과 신뢰성 | Revision Gate Snapshot, 진단 Catalog, 문제 위치 이동 |
| 10/5~10/16 | Phase 2. 자동 Render 검증 | 4개 Viewport Harness, Golden Corpus, Preview/Output 비교 |
| 10/19~10/30 | Phase 3. 생성 품질 보완 | 제한적 Repair, Layout Fit 검증, Locale·중복 콘텐츠 차단 |
| 11/2~11/13 | Phase 4. 편집·저장 안정화 | Field 편집 회귀, Revision Conflict, Undo/Redo, 재진입 일치 |
| 11/16~11/20 | Phase 5. Job·운영 지표 | 중복 방지, Stale 복구, 품질·시간·비용 지표 |
| 11/23~11/30 | Phase 6. Pilot·안정화 | 단계적 Rollout, 운영 Smoke, Rollback 훈련, Release 판정 |

## 6. 우선순위와 범위 조정

### 반드시 완료할 P0

- PBH-00 현행 기준선
- PBH-01 Revision 품질 Gate
- PBH-02 Golden Corpus
- PBH-04 필수 콘텐츠·Locale·Asset Fail-closed
- PBH-05 편집 저장 회귀
- PBH-06 Preview·Export 정합성

### 일정 내 최대한 완료할 P1

- PBH-03 제한적 자동 Repair
- PBH-07 Job 안정성과 상태 UX
- PBH-08 운영 지표와 단계적 Rollout

일정이 부족하면 새로운 편집 기능을 추가하기보다 P0의 검증 범위를 유지한다. 자동 Repair 범위와 운영 Dashboard 시각화를 줄일 수 있지만, 데이터 저장 정합성과 출력 Gate는 줄이지 않는다.

## 7. 정량 완료 기준

Phase 0에서 실제 기준선을 측정한 후 최종 수치를 고정하되, 최소 목표는 다음과 같다.

- Golden Corpus의 필수 Viewport Render 성공률 100%
- Blocking 결함이 있는 Fixture의 Live Preview·Export 차단률 100%
- 정상 Fixture의 잘못된 차단 0건
- Preview와 Web Output의 치명적 구조 차이 0건
- 필수 Section·Asset·Locale 누락의 조용한 성공 처리 0건
- 중복 요청으로 인한 동일 생성 Job 중복 생성 0건
- 저장 후 재진입 시 사용자 편집값 손실 0건
- 장시간 `pending` 상태로 남는 Stale Job 0건
- P0 시나리오의 Node 22 CI와 Browser E2E 통과
- Pilot 기간의 치명적 오류 발생 시 Kill Switch·Rollback 검증 완료

## 8. 첫 번째 실행 묶음

다음 작업부터 시작한다.

1. Migration 056·058·059와 운영 활성 설정 상태 확인
2. Node 22.x 전체 Build·Test 기준선 실행
3. 정상/실패 AI 문서 Fixture 확정
4. Revision 품질 결과 저장 Contract 확정
5. 1440·1024·390·360 Render Harness 설계
6. Preview·Web Output·Export 비교 기준 확정

이 묶음이 완료되기 전에는 신규 AI 기능이나 관리자 화면 확장을 시작하지 않는다.

## 9. Directus 후속 단계로 넘길 준비

11월 말까지 Directus를 구현하지는 않지만 다음 조건은 유지한다.

- Prompt, Model, Component, Section, Template, Token, Locale은 Version ID로 참조한다.
- 실행 Snapshot은 외부 저장소로 옮겨도 재현 가능한 형태를 유지한다.
- UI가 DB 테이블을 직접 읽지 않고 기존 API/Store 경계를 사용한다.
- 신규 비밀값은 설정 데이터에 원문으로 저장하지 않는다.
- Directus 관련 코드, Collection, Migration API를 이번 범위에 선행 구현하지 않는다.

이를 통해 프로모 빌더 고도화가 끝난 뒤 Directus 마이그레이션을 별도 프로젝트로 시작할 수 있다.

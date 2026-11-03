# 소스코드 정리 및 공통화 개발계획서

- 작성일: 2026-07-21
- 대상 프로젝트: `promo_web_builder`
- 상태: 계획 개정 / 정리·공통화 소스코드 미반영
- 기준 문서:
  - `docs/source-code-cleanup-review-2026-07-20.md`
  - `docs/section-ai-layout-and-image-generation-mvp-development-plan-2026-07-20.md`
- 기준 커밋:
  - `d548463`: 통합 테스트 실행기 및 Create Promo 브라우저 smoke test
  - `5f498b7`: Section AI safeArea·Apply 재검증 수정

## 1. 계획 개정 요약

기존 계획의 방향인 “Vue 전면 전환보다 중복 제거, 모듈화, 테스트 안전망을 우선한다”는 결론은 유지한다. 다만 현재 저장소 상태와 작업 리스크를 반영해 다음과 같이 수정한다.

1. 테스트 체계 보강을 P2가 아닌 선행 P0로 올린다.
2. 이미 반영된 통합 `test` 명령, Create Promo 브라우저 smoke test, Section AI Apply 테스트를 현재 상태에 반영한다.
3. Section AI의 `safeArea` 적용과 Apply 재검증은 “수정 완료·배포 검증 필요”로 변경한다.
4. Wizard 공통화는 대규모 일괄 이동이 아니라 순수 함수부터 DOM·화면 흐름까지 6단계로 나눈다.
5. App Shell은 정적 화면을 먼저 적용하고 Visual Editor는 embedded/standalone 회귀 위험 때문에 별도 단계로 진행한다.
6. 관리자 페이지 분리는 객관적으로 검증할 수 있는 완료 기준을 사용한다.
7. n8n은 현재 운영 여부를 확인한 뒤 최소 범위로 정리한다.

## 2. 배경 및 현재 상태

### 2.1 구조상 문제

- `prototype/create-promo.js`와 `prototype/promo-wizard.js`에 이름이 같은 함수가 다수 존재하고 화면별 차이와 공통 로직이 섞여 있다.
- Create Promo에는 이전 generation flow와 관련된 것으로 보이는 함수와 API 호출이 남아 있다.
- `prototype/app.js`는 Vue를 사용하지만 여러 관리자 기능이 하나의 대형 인스턴스에 집중돼 있다.
- 공통 헤더와 메뉴가 여러 화면에서 개별 관리된다.
- 재생성 가능한 산출물, SQL seed, n8n workflow 변형본 및 문서 증거 파일의 관리 정책이 불명확하다.

### 2.2 테스트 안전망 현황

다음 항목은 이미 반영됐다.

- `package.json` 통합 `test` 명령
- `scripts/run-tests.js`를 통한 `test-*.js`, `test-*.mjs` 일괄 실행
- Create Promo Step 1~4 브라우저 smoke test
- Section AI Apply handler의 상태 및 재검증 테스트
- 현재 총 20개 테스트 파일 실행 구조

남은 보강 항목은 관리자 템플릿 저장에서 Create Promo 로드, Visual Editor 반영까지 이어지는 통합 브라우저 테스트다.

### 2.3 Vue 통합에 대한 판단

현재 문제의 핵심은 프레임워크 불일치가 아니라 모듈화 부족과 과도한 결합이다. 관리자 페이지도 Vue를 사용하지만 컴포넌트 분리가 부족해 대형 파일로 유지되고 있다. 따라서 이번 계획에서는 프런트 전체 Vue 전환을 제외하고, 프레임워크와 무관한 공통 로직 분리와 테스트 확보에 집중한다.

## 3. 목표

이번 계획의 완료 목표는 다음과 같다.

- Create Promo에서 실제로 사용하지 않는 생성 흐름, polling 및 API 호출을 안전하게 제거한다.
- Create Promo와 Promo Wizard의 공통 로직을 작은 단위로 추출한다.
- 템플릿 계약, 콘텐츠 정규화, layout cache 등의 수정 지점을 단일화한다.
- 공통 App Shell을 정적 화면과 Visual Editor에 단계적으로 적용한다.
- 관리자 페이지에서 최소 1개 기능 영역을 독립 컴포넌트와 service로 분리한다.
- 저장소의 소스, 생성물, 운영 workflow, archive 및 fixture의 관리 기준을 명확히 한다.
- 각 단계에서 자동 테스트와 브라우저 회귀 검증을 수행한다.

## 4. 개발 원칙

1. 동작 변경과 구조 변경을 같은 커밋에 섞지 않는다.
2. 삭제 전 정적 참조뿐 아니라 세션 복구, URL 파라미터, localStorage 및 동적 호출을 확인한다.
3. 공통화는 한 모듈씩 수행하고 각 모듈 이동 직후 두 Wizard 화면을 검증한다.
4. 기존 전역 상태와 DOM 직접 참조를 그대로 공통 모듈로 이동하지 않는다. 필요한 의존성은 인자나 adapter로 전달한다.
5. 생성된 bundle, seed, n8n 파일은 운영 용도를 확인하기 전 삭제하지 않는다.
6. 각 단계는 독립적으로 롤백 가능한 커밋으로 분리한다.

## 5. 개발 범위 및 실행 단계

### 5.1 P0 — 테스트 기준선 확정 및 보강

현재 완료:

- 통합 `test` 명령 구성
- Create Promo Step 1~4 브라우저 smoke test 구성
- Section AI Apply handler 동작 테스트 구성

추가 개발:

1. 테스트를 contract, behavior, browser 유형으로 구분할 수 있도록 실행 결과 또는 스크립트 명칭을 정리한다.
2. 관리자 템플릿 저장 → Create Promo 템플릿 로드 → Visual Editor 반영을 확인하는 브라우저 통합 테스트를 추가한다.
3. API fixture가 실제 응답 계약과 달라지지 않도록 필수 필드를 명시한다.
4. 신규 테스트는 소스 문자열 존재만 확인하지 않고 사용자 동작 또는 반환 결과를 검증한다.

완료 기준:

- 통합 `test` 명령으로 모든 테스트 파일이 성공한다.
- Create Promo smoke test와 관리자-에디터 통합 테스트가 각각 존재한다.
- 테스트 실패 시 화면 단계 또는 API 계약 중 어느 영역이 실패했는지 식별할 수 있다.

### 5.2 P0 — Create Promo 미사용 코드 제거

대상:

- `prototype/create-promo.js`
- 관련 계약 및 브라우저 테스트

개발 내용:

1. `loadDesignDocuments()`, `loadWorkerSettings()`, `syncRunPolling()`의 호출 목적을 각각 확인한다.
2. 다음 경로에서 사용 여부를 재검증한다.
   - HTML inline event
   - `window`를 통한 동적 호출
   - URL query/hash 기반 진입
   - localStorage 또는 sessionStorage 복구
   - 이전 generation run 재개
   - 테스트 및 fixture
3. 과거 generation flow 전용이며 현재 Create Promo Step 1~4에서 도달할 수 없는 호출만 제거한다.
4. 참조가 없는 함수와 `steps[].cards`, placeholder, fallback을 작은 묶음으로 삭제한다.
5. 삭제 전후 네트워크 요청, timer 및 화면 상태를 비교한다.

완료 기준:

- Create Promo 진입 시 불필요한 `/api/design-documents`, `/api/promo-generation-worker-settings` 요청이 발생하지 않는다.
- 현재 기능이 아닌 과거 run polling이 재개되지 않는다.
- 새 작성, 임시 저장 복구, 템플릿 선택, Step 1~4 이동에 회귀가 없다.
- 삭제 함수와 유지 함수 및 판단 근거가 handoff에 기록된다.

### 5.3 P0 — Wizard 공통 모듈 단계적 추출

대상:

- `prototype/create-promo.js`
- `prototype/promo-wizard.js`
- 신규 `prototype/wizard/`

사전 분석:

1. 이름이 같은 함수 중 최소 20개를 표본 비교한다.
2. `완전 동일`, `부분 상이`, `이름만 동일`로 분류한다.
3. 부분 상이 함수는 차이를 옵션, adapter 또는 화면별 flow로 유지한다.

추출 순서:

1. 순수 함수와 데이터 정규화
2. storage 및 layout cache
3. 템플릿·섹션 계약과 콘텐츠 migration
4. API helper 및 service adapter
5. DOM 렌더링과 이벤트 연결
6. 공통 CSS 및 화면별 flow 정리

권장 모듈:

- `wizard-core.js`: 순수 helper, 공통 상수, 상태 변환
- `wizard-storage.js`: storage key, snapshot, migration
- `wizard-content.js`: Section 입력, 검증, 정규화
- `wizard-template.js`: Form Template 연동과 계약 변환
- `wizard-layout.js`: layout identity, order, cache
- `wizard-api.js`: 공통 API 요청과 오류 변환
- `create-promo-flow.js`: Create Promo 전용 조립
- `promo-wizard-flow.js`: Promo Wizard 전용 생성 흐름
- `wizard-base.css`: 공통 스타일

완료 기준:

- 템플릿 계약 및 layout cache 수정 지점이 각각 한 모듈로 줄어든다.
- 공통 모듈이 특정 페이지 DOM이나 전역 변수에 암묵적으로 의존하지 않는다.
- 각 추출 단계마다 Create Promo와 Promo Wizard 테스트가 모두 통과한다.
- 함수 diff 분류와 예외 처리 근거가 문서화된다.

### 5.4 P1 — 공통 App Shell 단계적 적용

#### 1단계: 정적 화면

대상:

- `prototype/index.html`
- `prototype/create-promo.html`
- `prototype/promo-wizard.html`
- 공통 Shell 설정 및 renderer

개발 내용:

1. 메뉴 라벨, URL, 활성 상태 판정을 단일 설정으로 정의한다.
2. 정적 화면에서 공통 renderer를 사용한다.
3. 헤더 스타일을 `app-shell.css`로 통합하되 화면별 override를 허용한다.

#### 2단계: Visual Editor

대상:

- `visual-editor/src/App.vue`

개발 내용:

1. standalone mode에서만 공통 Shell을 렌더링한다.
2. embedded mode에서는 헤더가 표시되지 않도록 기존 계약을 유지한다.
3. 정적 JS와 Vue가 공유할 설정의 모듈 형식을 명확히 정한다.

완료 기준:

- 메뉴 설정 한 곳의 변경이 대상 화면에 일관되게 반영된다.
- URL과 활성 메뉴 상태가 정확하다.
- Visual Editor embedded mode에서 헤더 중복과 iframe 높이 회귀가 없다.

### 5.5 P1 — 관리자 페이지 기능 분리

대상:

- `prototype/app.js`
- `prototype/index.html`
- `prototype/styles.css`
- 신규 관리자 component/service 모듈

개발 순서:

1. App Shell 적용 후 시작한다.
2. `TemplateLayoutManager`를 1차 분리 대상으로 한다.
3. 이후 `WizardContentSectionManager`, `PromptManager`, `SectionAuditLog` 순으로 진행한다.
4. API 호출은 UI 컴포넌트와 분리된 service 모듈로 이동한다.
5. 관리자 페이지 전체를 한 번에 재작성하지 않는다.

완료 기준:

- 최소 1개 탭의 상태, 메서드 및 template가 독립 컴포넌트로 분리된다.
- 해당 탭의 API 호출이 service 모듈로 분리된다.
- 루트 Vue 인스턴스가 분리된 탭 내부 DOM을 직접 조작하지 않는다.
- 조회, 생성, 수정, 저장 회귀 테스트가 통과한다.

### 5.6 P2 — 저장소 및 운영 산출물 정리

대상:

- `.gitignore`
- `tmp/`
- `db/seeds/`
- `prototype/visual-editor-assets/`
- `n8n/`

개발 내용:

1. `tmp/`의 실제 용도를 확인하고 재생성 가능한 임시 산출물만 ignore한다.
2. SQL seed 단일 파일과 chunk 파일의 이중 관리 원인을 확인한다.
3. 쿼리 크기 또는 운영 도구 제약이면 두 형식을 유지하고 생성 방법을 문서화한다.
4. 문서 증거 이미지는 `docs/assets/`로 이동한다.
5. Visual Editor bundle은 생성 명령, 직접 수정 금지 및 커밋 정책을 기록한다.
6. n8n 파일은 다음으로 분류한다.
   - 운영 중
   - 과거 참고용
   - fixture
   - 폐기 후보
7. 현재 백엔드 직접 제어 방식과 무관한 n8n 자료라면 복잡한 재구성 대신 archive 이동과 manifest 작성을 우선한다.
8. root redirect 파일은 배포 로그와 외부 링크 사용 여부를 확인한 뒤 정리한다.

완료 기준:

- 임시 산출물이 `git status`에 나타나지 않는다.
- seed 이중 관리 사유 또는 단일화 결정이 문서화된다.
- n8n manifest에 운영 여부와 마지막 검증일이 표시된다.
- 삭제한 파일은 별도 커밋으로 분리된다.

## 6. Section AI 별도 개발 트랙

### 6.1 수정 완료·검증 필요

- `layoutVariant/safeArea`에 따른 이미지 구성 지침과 배경 위치 적용
- Apply 시 현재 템플릿 활성 상태 및 버전 재검증
- Apply 시 layout revision, Section 정의, constraints 및 patch 재검증
- 서버가 검증해 반환한 run 결과만 클라이언트에 적용

후속 조치:

- 운영 배포 후 Create Promo에서 split-left, split-right, centered-hero 각각의 위치를 확인한다.
- 관리자 변경 후 이전 run 적용 시 409 응답과 사용자 안내를 확인한다.

### 6.2 미해결 항목

- 관리자 `aiDesign` 정책의 저장, 조회 및 UI 미구현
- 레이아웃과 이미지 생성이 하나의 장시간 HTTP 요청에서 순차 실행됨
- 이미지 단계만 재시도하는 기능 없음
- 동일 입력 동시 요청 시 unique constraint 충돌의 사용자 친화적 응답 보강 필요
- Apply가 사용자의 로컬 현재 콘텐츠를 서버에서 독립적으로 재구성할 수 없는 구조적 한계

### 6.3 정책 결정 필요

`imageTargetItemKeys`는 기존 기획의 “특정 Item 이미지 연결”을 위한 속성이지만, 최신 요구사항은 AI 생성 이미지를 Section 배경으로 적용하는 것이다. 다음 중 하나를 확정해야 한다.

1. Section 배경 전용으로 결정하고 item target 관련 계약과 문서를 제거한다.
2. 관리자 선택 기능으로 유지하고 저장소, UI, 검증 및 렌더링 경로를 구현한다.

이 결정 전에는 관리자 `aiDesign` 구현 범위를 확정하지 않는다.

## 7. 최종 구현 순서

1. 테스트 기준선 재확인 및 관리자-에디터 통합 테스트 추가
2. Create Promo 미사용 코드 제거
3. Wizard 함수 본문 diff 및 분류
4. 순수 함수와 정규화 로직 추출
5. storage, template, layout, API 모듈 순차 추출
6. DOM·이벤트와 화면별 flow 정리
7. 정적 화면 App Shell 적용
8. Visual Editor App Shell 적용
9. 관리자 페이지 1개 탭 분리
10. 저장소, seed 및 n8n 정리
11. Section AI 미해결 항목의 별도 개발계획 확정

## 8. 검증 계획

기본 검증:

```bash
pnpm test
pnpm run check
pnpm run build:visual-editor
git diff --check
```

브라우저 검증:

- Create Promo Step 1~4 이동 및 상태 유지
- 템플릿 선택과 layout cache 복구
- Section AI 버튼, 생성, 적용 및 삭제
- 관리자 템플릿 저장 후 Create Promo 반영
- Visual Editor standalone/embedded Shell 표시

운영 전 검증:

- 불필요 API 요청 및 polling 미발생
- console error와 미처리 promise 없음
- iframe `postMessage` payload 계약 유지
- 기존 localStorage snapshot migration 정상

참고:

- 프로젝트 권장 Node 버전과 실제 테스트 실행 Node 버전을 일치시키는 것이 필요하다.
- ESM 관련 `MODULE_TYPELESS_PACKAGE_JSON` 경고는 별도 정리 대상으로 기록한다.

## 9. 커밋 및 롤백 전략

권장 커밋 단위:

1. 테스트 추가 또는 fixture 변경
2. 미사용 호출 제거
3. 미사용 함수 제거
4. 공통 모듈 1개 추출
5. 정적 App Shell 적용
6. Visual Editor Shell 적용
7. 관리자 탭 1개 분리
8. 저장소 파일 이동 또는 삭제

롤백 원칙:

- 회귀가 발생한 모듈 또는 화면만 이전 구조로 복구한다.
- 이미 검증 완료된 다른 모듈은 유지한다.
- 파일 이동과 삭제는 기능 변경과 분리해 즉시 복원 가능하게 한다.
- 운영 workflow와 seed는 외부 사용 여부가 확인되기 전 삭제하지 않는다.

## 10. 제외 범위

- 프런트엔드 전체 Vue 통일
- 관리자 페이지 전체 재작성
- Visual Editor 신규 편집 기능
- 인증·인가 도입
- Section AI 비동기 worker 및 retry의 즉시 구현
- `imageTargetItemKeys` 정책 결정 전 관련 관리자 기능 구현

## 11. Definition of Done

1. 모든 자동 테스트가 통합 명령으로 실행되고 성공한다.
2. Create Promo 및 관리자-에디터 브라우저 테스트가 존재한다.
3. Create Promo의 미사용 API 호출, polling 및 도달 불가능 코드가 근거와 함께 제거된다.
4. Wizard 공통 로직이 단계적으로 추출되고 두 화면의 회귀가 없다.
5. 함수 diff 분류 결과와 화면별 예외가 문서화된다.
6. 공통 App Shell이 정적 화면과 Visual Editor mode별로 정상 동작한다.
7. 관리자 페이지에서 최소 1개 탭과 API service가 독립 모듈로 분리된다.
8. seed, bundle, n8n 및 임시 산출물 관리 정책이 문서화된다.
9. Section AI 완료·미완료·정책 결정 항목이 구분된다.
10. 각 단계의 변경 파일, 테스트 결과, 잔여 이슈 및 롤백 방법이 handoff 문서에 기록된다.

## 12. 예상 리스크

| 리스크 | 영향 | 대응 |
|---|---|---|
| 동적 호출을 미사용으로 오판 | 특정 진입 또는 복구 기능 중단 | URL, storage, `window`, timer 및 브라우저 흐름 확인 |
| 공통화 중 화면별 차이 소실 | Create Promo 또는 Promo Wizard 회귀 | diff 분류 후 옵션·adapter·flow로 차이 유지 |
| 전역 상태를 공통 모듈로 이동 | 숨은 결합과 순서 의존성 증가 | 의존성 주입, 순수 함수 우선 추출 |
| Shell 적용 시 iframe 중복 | Visual Editor 레이아웃 깨짐 | 정적 화면 우선, embedded 별도 검증 |
| 관리자 분리 범위 과대 | 장기 브랜치 및 회귀 증가 | 탭 1개 단위 구현·검증·커밋 |
| n8n·seed 파일 오삭제 | 운영 또는 복구 작업 차질 | 외부 사용 확인, manifest, 삭제 커밋 분리 |
| 테스트 fixture와 운영 계약 불일치 | 테스트는 통과하지만 운영 실패 | 실제 API 필수 필드와 오류 응답을 fixture에 반영 |

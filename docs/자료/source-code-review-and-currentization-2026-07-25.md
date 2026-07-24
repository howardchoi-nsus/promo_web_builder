# 소스코드 정밀 검토 및 문서 현행화 보고서

- 검토일: 2026-07-25
- 검토 기준 커밋: `fcce7c6`
- 대상: Admin, Create Promo, Visual Editor, Prompt Governance, 관련 테스트와 문서
- 제외: `docs/handoff`, `docs/claude`, `.claude`

## 1. 결론

최근 P0~P2 반영의 주요 실행 경로와 빌드는 정상이다. 전체 테스트 58개 파일과 Admin/Create Promo 브라우저 통합 테스트가 통과했다.

다만 정적 테스트가 구형 관리자 Template Layout Manager를 계속 검사하던 문제, 템플릿 전환 시 비동기 응답 경합, 신규 SFC 문구 하드코딩, Prompt PATCH 필드 보존과 History 원자성 문제가 발견돼 소스를 보완했다.

## 2. 발견 및 수정 사항

### 2.1 관리자 Template Layout Manager 이중 구현 제거

문제:

- Admin Vite 런타임은 `admin-app/src/components/TemplateLayoutManager.vue`를 사용했다.
- 일부 테스트와 문구 추출 도구는 구형 `prototype/admin/template-layout-manager.js`를 계속 검사했다.
- 테스트 통과가 실제 런타임 구현의 정상 동작을 보장하지 못하는 상태였다.

수정:

- 구형 파일 삭제
- 계약 테스트와 관리자 문구 추출 대상을 신규 SFC로 변경
- 관련 계획서와 Legacy 경로 감사 문서의 정본 경로 현행화

### 2.2 레이아웃 revision 비동기 경합 방지

문제:

- 관리자가 템플릿 A에서 B로 빠르게 전환할 때 A의 API 응답이 늦게 도착하면 B 화면에 A의 Layout Revision이 표시될 수 있었다.
- 유효한 Template ID가 사라진 경우 이전 revision이 남을 수 있었다.

수정:

- 요청마다 증가하는 `requestRevision` 적용
- 현재 요청과 일치하는 응답만 화면 상태에 반영
- 새 요청 시작 시 이전 revision과 오류 초기화
- Component Unmount 후 도착한 응답 무시
- Template ID가 없을 때 Loading 상태 정상 종료

### 2.3 관리자 SFC 문구의 i18n 정책 적용

문제:

- 신규 SFC에 한국어 문구가 직접 포함돼 관리자 문구 관리 정책과 일치하지 않았다.
- 고정 Heading ID는 Component가 복수 렌더링될 때 중복될 수 있었다.

수정:

- `admin.templateLayout.*` 메시지 키를 한국어·영어 Baseline에 추가
- 부모 Admin App의 `t` 함수를 SFC에 전달
- Template ID 기반 고유 Heading ID 적용
- Locale Baseline 계약 테스트 기준 메시지 수: 140개

### 2.4 Prompt PATCH 필드 보존

문제:

- PATCH 요청에서 `requiredVariables` 또는 `optionalVariables`를 생략하면 빈 배열로 해석될 수 있었다.
- 부분 수정 API가 기존 변수 계약을 의도하지 않게 제거할 가능성이 있었다.

수정:

- `mergePromptTemplatePatch()` 추가
- 생략한 이름·본문·필수 변수·선택 변수는 기존 값 보존
- 명시적으로 빈 배열을 전달한 경우에만 변수 선언 제거 시도
- 제거 결과가 Prompt Type 계약과 맞지 않으면 기존 계약 검증에서 차단

### 2.5 Prompt 변경과 History 기록의 원자성

문제:

- Prompt 수정, 활성화, 보관과 History INSERT가 각각 별도 쿼리로 실행됐다.
- 중간 실패 시 Prompt 상태와 감사 이력이 불일치할 수 있었다.
- 활성화 중 실패하면 기존 활성본만 비활성화될 가능성이 있었다.

수정:

- 수정과 History 기록을 단일 Neon HTTP Transaction으로 처리
- 기존 활성본 비활성화, 대상 활성화와 각 History 기록을 단일 Transaction으로 처리
- 보관과 History 기록을 단일 Transaction으로 처리
- DB Schema 변경 및 Migration 추가 없음

### 2.6 불필요한 import 제거

- Create Promo와 구형 Promo Wizard에서 공통 Template Service 전환 후 남은 `resolveActiveTemplate` 직접 import를 제거했다.

## 3. 검증 결과

- 전체 테스트: 58개 파일 통과
- Admin Layout → Create Promo 브라우저 통합 테스트 통과
- Admin i18n 브라우저 테스트 통과
- Admin Component/Section 브라우저 테스트 통과
- Create Promo 브라우저 Smoke Test 통과
- Admin Vite Production Build 통과
- Visual Editor Vite Production Build 통과
- JavaScript 정적 검사 통과
- `git diff --check` 통과
- 관리자 UI 문구 추출 도구 실행 통과

테스트는 Node.js 24에서 수행됐다. 저장소 권장 버전은 Node.js 22이므로 Engine Warning이 출력되지만 테스트 및 빌드 실패는 아니다.

## 4. 남은 보완 항목

### 높은 우선순위

1. Prompt 활성본 직접 수정 제거와 새 Draft Version 생성 방식 도입
2. Prompt 이전 버전 Rollback API와 관리자 UI 추가
3. Prompt P2 잠금 블록과 관리자 변경 가능 블록 분리
4. 위 선행조건 완료 후 P3 활성본·초안 시험 생성 비교 진행

### 구조 개선

1. `prototype/app.js`의 관리자 기능별 SFC·Service 추가 분리
2. `prototype/create-promo.js`의 Content Form, Storage, iframe orchestration 추가 분리
3. Visual Editor에 남은 공통 Panel 내부 하드코딩 문구의 i18n 범위 결정
4. 구형 Promo Wizard 종료 조건 충족 후 Redirect 전환

### 운영 검증

1. Vercel Production에서 Admin Template 전환 경합 Smoke Test
2. 실제 Neon DB에서 Prompt Transaction과 History 동시 반영 확인
3. 실제 Gemini 이미지 생성에서 Prompt 변수 계약과 실패 복구 확인
4. Node.js 22 환경 CI Gate 고정

## 5. 문서 현행화 범위

다음 문서를 실제 소스 기준으로 수정했다.

- `docs/계획/admin-promo-layout-editor-unification-development-plan-2026-07-24.md`
- `docs/계획/frontend-unification-remaining-p0-p2-development-plan-2026-07-24.md`
- `docs/계획/section-image-prompt-governance-draft-2026-07-24.md`
- `docs/자료/legacy-route-reference-audit-2026-07-24.md`

요청에 따라 `docs/handoff`, `docs/claude`, `.claude`는 검토 결과 반영 대상에서 제외했다.

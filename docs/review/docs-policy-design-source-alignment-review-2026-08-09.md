# 문서·정책·설계와 소스코드 정합성 검토 보고서

- 검토일: 2026-08-09 (Asia/Seoul)
- 검토 기준 브랜치/커밋: `main` / `6e5ccf8f1209c71345a87f920eb6f2fa9c1eef62`
- 원격 비교: `origin/main`과 동일, 작업 시작 시 변경 없음
- 판정: **핵심 Contract v3 구현은 최신 정책·설계와 대체로 일치하나, 문서 인덱스와 최신 핸드오프가 현행 소스와 충돌한다. 운영·브라우저 E2E 증거는 아직 완료되지 않았다.**

## 1. 검토 범위와 기준

현행 문서 분류는 `docs/README.md`를 따랐다. 다음 문서를 우선 기준으로 검토했다.

| 분류 | 기준 문서 | 문서상 상태 |
|---|---|---|
| 문서 인덱스 | `docs/README.md` | 최종 정리 2026-08-01 |
| 최신 작업 기록 | `docs/handoff/handoff-2026-08-06.md` | Contract v3·Hero·CTA·Seed 통합 인계 |
| 최신 개발 계획 | `docs/계획/ai-registry-composition-mode-supplement-development-plan-2026-08-04.md` | 개발 전 / 소스 미반영 |
| 통합 정책 | `docs/정책/promo-web-builder-policies-2026-07-23.md` | 최종 갱신 2026-08-06 |
| 핵심 기술 설계 | `docs/설계/ai-promotion-builder-composition-engine-technical-design-2026-07-29.md` | Contract v3 구현 반영, E2E 진행 중 |
| 편집기 설계 | `docs/설계/visual-editor-live-preview-rich-text-design-2026-08-01.md` | Live Preview·라인 서식 현행 설계 |
| 보조 설계 | 용어 사전, GGPoker 브랜드·이미지 프롬프트 가이드 | UI 용어·브랜드 규칙 기준 |

소스 비교는 `api/`, `visual-editor/`, `shared/`, `db/migrations/`, `db/seeds/`, `scripts/`의 실제 계약·저장·검증·렌더링 경로를 대상으로 했다.

## 2. 주요 발견 사항

### [높음] F-01. 최신 핸드오프의 Hero 계약이 현재 정책·설계·소스와 반대다

`handoff-2026-08-06.md`는 Hero 이미지를 Section background가 아닌 우측 `visual` Component에 적용하고, 4:3 bounded layout으로 표시한다고 기록한다. 그러나 그 이후 커밋 `6e5ccf8`에서 계약이 다시 변경됐다.

현재 정본은 다음과 같다.

- 정책: `section-key-visual` Asset을 Hero Section background에 적용
- 기술 설계 §25.5: Section background 키비주얼로 적용하고 `component-field-image`를 함께 만들지 않음
- Migration 055: 기존 Hero `visual` Component를 제거하고 Section key visual 정책으로 복구
- Seed 005: `imageTarget: section-background`, `imageAspectRatio: 4:3`
- Compiler: Section 정책일 때 `targetType: section-key-visual` 생성

영향:

- 신규 작업자가 핸드오프만 따르면 이미 폐기된 bounded Component 방식을 재도입할 수 있다.
- 핸드오프의 E2E 체크리스트와 실제 기대 결과가 달라 잘못된 QA 판정이 발생한다.

권고:

1. `handoff-2026-08-06.md` 상단에 “2026-08-07 이후 Hero 계약 변경” 경고를 추가한다.
2. Hero 관련 §4.7, §7, 체크리스트를 Section background 기준으로 갱신하거나 새 `handoff-2026-08-09.md`를 만든다.
3. `docs/README.md`에서 최신 핸드오프를 새 문서로 지정한다.

### [높음] F-02. 문서 인덱스가 최신 문서를 가리키지 않는다

`docs/README.md`는 최종 정리를 2026-08-01로 표시하고 “최신 작업 인계”를 `handoff-2026-08-02.md`로 안내한다. 실제로는 8월 6일 핸드오프와 8월 7일 소스·정책·설계 변경이 존재한다.

영향:

- 사용자가 `docs/README.md`를 진입점으로 사용할 경우 Contract v3, Migration 054/055, Hero 계약 변경을 놓친다.
- “현재 문서”라는 제목과 실제 최신성 사이에 차이가 있다.

권고: 문서 인덱스의 최종 정리일, 최신 핸드오프, 최신 Migration, 검증 상태를 2026-08-09 기준으로 현행화한다.

### [중간] F-03. 최신 개발계획서의 상태 메타데이터가 구현 현실과 맞지 않는다

`ai-registry-composition-mode-supplement-development-plan-2026-08-04.md`는 여전히 “개발 전 계획 / 소스코드 미반영”으로 표시된다. 반면 현재 소스에는 Contract v3 후보 해석, fingerprint, 결정적 Compiler, Proposal/Apply, Operation, Resource Registry, Export, Migration 049~055와 Seed 005가 구현되어 있다.

영향: 진행률 판단과 후속 작업 우선순위가 왜곡된다.

권고: 문서 상태를 “Vertical Slice 구현 완료 / 운영·브라우저 E2E 미완료”로 변경하고 각 단계에 `완료`, `부분 완료`, `미검증` 표시를 추가한다.

### [중간] F-04. 정책·설계의 완료 Gate는 아직 소스 존재만으로 닫을 수 없다

정책서와 기술 설계 자체도 다음을 미완료로 명시한다.

- 실제 Provider 기반 자연어 → Overview v5 → Proposal → 승인 → Apply
- 실제 Hero 생성 이미지의 문구 부재 및 background 표시 품질
- 저장 → 새로고침 후 geometry·Preset 콘텐츠 동일성
- 두 창 동시 수정의 revision mismatch UX
- Visual Editor와 HTML Export의 Desktop/Mobile screenshot parity
- Export rollout 0/부분/100% 및 flag-off
- 프로젝트 기준 Node 22.x 전체 build/test
- Rule Base 기반 리전·연령·법무·CTA 링크 컴플라이언스

소스에는 revision/fingerprint 검증, export owner/revision 검사, Contract v3 compiler 등 기반이 존재하지만, 운영 DB·Provider·브라우저를 포함하는 실행 증거가 현재 커밋에 첨부되어 있지 않다. 따라서 제품 완성 판정은 **부분 완료**가 적절하다.

### [중간] F-05. 전체 회귀 테스트를 현재 체크아웃에서 재현하지 못했다

`scripts/run-tests.js`는 저장소의 모든 `test-*` 파일을 실행하도록 되어 있다. 이번 검토 환경에서:

- 기본 PATH에는 `node`, `pnpm`이 없었다.
- 번들 Node 24.14.0으로 실행했으나 첫 브라우저 테스트에서 `playwright` 패키지를 찾지 못해 중단됐다.
- 핵심 테스트 4종은 직접 실행해 통과했다.
  - `test-promo-registry-composition-compiler.js`
  - `test-registry-composition-vertical-slice-seed.js`
  - `test-registry-hero-section-key-visual-migration.js`
  - `test-promo-page-composition-contract.js`

이는 테스트 실패가 아니라 **의존성/런타임 재현 실패**다. 문서에 기록된 “전체 Suite 119개 통과”를 현재 HEAD에서 독립 재확인한 것으로 간주하면 안 된다.

권고:

1. Node 22.x와 lockfile 기준으로 의존성을 복원한다.
2. `pnpm test`와 `pnpm build`를 다시 실행한다.
3. 실행한 Node/pnpm 버전, 테스트 수, 커밋 SHA를 CI artifact 또는 검증 문서에 남긴다.

### [낮음] F-06. 핸드오프의 구현 파일명이 실제 파일과 일부 다르다

핸드오프 §4.1은 `api/promo-page-composition-proposal.js`를 핵심 파일로 적었으나 실제 파일은 복수형 `api/promo-page-composition-proposals.js`다. 기술 설계 §25.2는 복수형을 올바르게 사용한다.

영향은 작지만 신규 작업자의 탐색과 자동 문서 링크 검증을 방해한다.

## 3. 정책·설계별 소스 정합성 요약

| 영역 | 판정 | 소스 근거 / 비고 |
|---|---|---|
| Contract v3 Registry allowlist | 일치 | Contract, candidates, compiler 모듈과 Migration 049~053 존재 |
| candidate/policy/resource fingerprint | 일치 | Apply 직전 세 fingerprint 비교 구현 |
| revision mismatch 차단 | 일치 | `DOCUMENT_REVISION_MISMATCH` 409 처리 |
| CTA 전용 `ctaLabel`, 20자 정책 | 대체로 일치 | Overview v5 binding과 계약 검증 존재; 브라우저 전체 회귀는 재검증 필요 |
| Hero Section key visual | 최신 정책·설계·소스 일치 | Migration 055와 Seed 005 반영; 8/6 핸드오프만 충돌 |
| 디자인 토큰 기반 렌더링 | 구현 근거 있음 | 공통 token runtime과 hardcoding guard 존재; 전체 build 미재현 |
| 독립 Export | 구현 근거 있음 | owner, current revision, rollout 경로와 adapter 존재; screenshot parity 미검증 |
| Live Preview·라인 서식 | 구현/설계 반영 기록 있음 | 실제 브라우저 상호작용 전체 재검증 필요 |
| i18n·용어 정책 | 구현 자산 있음 | locale API/store와 locale JSON 존재; 사용자 노출 문자열 전수 검사는 이번 범위 밖 |
| 운영 Rule Base | 미구현 | 정책서가 명시한 최우선 격차이며 별도 컴플라이언스 엔진 증거 없음 |
| 운영 배포/DB 최신성 | 미확인 | 소스 Migration 055까지 존재하나 대상 DB 적용 및 Vercel Production 상태는 확인하지 않음 |

## 4. 최신성 판정

### 소스코드

- `main`과 `origin/main`은 동일하다.
- 현재 소스 기준 최신 커밋은 `6e5ccf8`(2026-08-07)이다.
- 8월 6일 핸드오프 기준점 `a676c32` 이후 Migration 054/055와 Hero 계약 변경이 추가됐다.

### 문서

- 통합 정책서와 핵심 기술 설계서는 8월 6~7일 변경을 반영해 **대체로 최신**이다.
- `docs/README.md`, 8월 4일 계획서 상태, 8월 6일 핸드오프의 Hero 설명은 **최신이 아니다**.
- 문서 매니페스트는 과거 문서 해시 목록 성격이며 현행 문서 선택과 최신성 보증 수단으로는 부족하다.

### 제품/운영 상태

- Contract v3 Vertical Slice는 코드 수준에서 구현되어 있다.
- 운영 Rule Base와 실제 Provider·브라우저·Export parity·Node 22 릴리스 검증이 남아 있어 “전체 설계 완료” 또는 “운영 준비 완료”로 판정할 수 없다.

## 5. 권고 우선순위

1. **P0 — 문서 충돌 제거:** Hero 계약을 Section background로 통일하고 최신 핸드오프를 작성한다.
2. **P0 — 릴리스 검증:** Node 22.x 의존성 복원 후 전체 build/test 119개 이상을 현재 HEAD에서 재실행한다.
3. **P0 — E2E Gate:** 실제 Provider, 저장/복원, 동시 수정, Export parity, rollout을 검증한다.
4. **P1 — 운영 안전:** 리전·연령·법무·CTA 링크 Rule Base를 구현하고 fatal/warning 계약 테스트를 추가한다.
5. **P1 — 문서 인덱스 자동화:** `docs/README.md`의 최신 문서 포인터와 파일 존재 여부를 CI에서 검사한다.
6. **P2 — 문서 메타데이터:** 계획서에 구현 상태와 검증 상태를 분리해 표시하고 기준 커밋 SHA를 기록한다.

## 6. 최종 결론

현재 코드는 최신 원격 `main`과 일치하며, Contract v3의 주요 구조는 최신 통합 정책서 및 핵심 기술 설계와 일치한다. 가장 큰 위험은 코드 결함으로 확인된 사항보다 **문서 간 기준 충돌과 검증 증거 부족**이다. 특히 8월 6일 핸드오프의 Hero bounded Component 설명은 현재 계약과 정반대이므로 즉시 현행화해야 한다.

현 시점 권장 상태 표기는 다음과 같다.

> **개발 상태: Contract v3 Vertical Slice 구현 완료 / 문서 일부 불일치 / 운영·브라우저 E2E 및 컴플라이언스 Rule Base 미완료**

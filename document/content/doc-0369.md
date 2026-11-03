# Registry Hero 섹션 키비주얼 테스트 시나리오

- 테스트 일자: 2026-08-07
- 대상: AI 프로모션 생성의 `registryHero` 이미지 타깃
- 사용자 스토리: AI 프로모션을 생성할 때 Hero 이미지는 컴포넌트 이미지가 아니라 섹션 배경 키비주얼로 생성·적용되어야 한다.

## 판정 기준

- `registryHero.ai_design.imageTarget`은 `section-background`이다.
- `registryHero.ai_design.imageTargetItemKeys`는 빈 배열이다.
- 컴파일 결과에는 `section-key-visual` 요청만 존재하고 `component-field-image` 요청은 존재하지 않는다.
- `imageTarget=item`과 유효한 item key가 명시된 다른 섹션은 기존 컴포넌트 이미지 동작을 유지한다.
- 브라우저 전체 생성 흐름에서 페이지 오류와 실패한 네트워크 요청이 없어야 한다.

## 실행 결과

| ID | 시나리오 | 기대 결과 | 결과 | 근거 |
|---|---|---|---|---|
| KV-01 | 빈 설명 상태 | `AI 개요 분석` 버튼 비활성 | 통과 | 인앱 브라우저에서 비활성 확인 |
| KV-02 | 유효한 영문 설명 입력 | 분석 버튼 활성 | 통과 | 입력 후 활성 확인, 콘솔 경고·오류 0건 |
| KV-03 | Migration 055 계약 | Hero 정책을 섹션 배경으로 변경하고 기존 `visual` 인스턴스 제거 | 통과 | `test-registry-hero-section-key-visual-migration.js` |
| KV-04 | Registry seed 재실행 | Hero에 컴포넌트 이미지 seed가 다시 생성되지 않음 | 통과 | `test-registry-composition-vertical-slice-seed.js` |
| KV-05 | Registry 컴파일 | Hero asset 요청이 모두 `section-key-visual`, component instance 참조 없음 | 통과 | `test-promo-registry-composition-compiler.js` |
| KV-06 | item 이미지 회귀 | `imageTarget=item`이고 key가 허용된 경우에만 `component-field-image` 생성 | 통과 | `test-promo-registry-composition-compiler.js` |
| KV-07 | 섹션 AI 계약 | `section-background` target의 생성·적용 계약 유지 | 통과 | `test-section-ai-design-contract.js`, `test-section-key-visual-contract.js` |
| KV-08 | 자동화 브라우저 전체 흐름 | 개요 → 추천 → 구성 → 디자인 → 출력 흐름 완료 | 통과 | `test-create-promo-browser-smoke.mjs` |
| KV-09 | 현재 4174 프리뷰의 실제 분석 요청 | POST가 upstream에 동일 method/body로 전달되고 검토 단계 표시 | 실패 | 두 POST endpoint가 HTTP 405 반환 |

## 사용한 영문 테스트 입력

> Create a bold summer welcome promotion for new customers in Korea. Offer a 100% bonus on their first deposit, with a vibrant tropical mood, a clear claim-now CTA, and a cinematic hero key visual used as the full section background.

## 자동화 실행 결과

```text
Registry Hero Section key visual migration contract passed
Registry Composition vertical slice Seed contract passed
Promo Registry Composition Compiler tests passed
Section AI design contract tests passed.
Section key visual contract tests passed.
Create Promo browser smoke test passed
```

## 발견 이슈: 로컬 프리뷰 API POST 프록시

`scripts/serve-visual-editor-preview.js`의 일반 `/api/` 프록시는 upstream `fetch` 호출에 URL만 전달한다. 원래 요청의 HTTP method, body와 `Content-Type`을 전달하지 않으므로 브라우저의 POST 요청이 upstream GET으로 바뀐다.

재현 결과:

```text
GET  /api/promo-builder-capabilities  -> 200
GET  /api/promo-composition-shells    -> 200
POST /api/promo-overview-parse         -> 405 Method not allowed
POST /api/promo-builder-session        -> 405 Method not allowed
```

영향:

- 입력 UI와 버튼 활성화는 정상이다.
- 현재 `http://127.0.0.1:4174/create-promo.html?mode=ai`에서는 분석 클릭 이후 Overview Review 단계로 이동할 수 없다.
- fixture route interception을 사용하는 자동 브라우저 테스트는 통과하므로, 키비주얼 정책·컴파일러 회귀와 프론트 흐름 자체는 정상이다.

권장 수정:

- 프리뷰 프록시가 `req.method`, 요청 body, 필요한 request headers를 upstream `fetch`에 전달하도록 한다.
- 수정 후 KV-09를 재실행하고, 생성 결과에서 Hero section style 또는 asset request가 `section-key-visual`인지 확인한다.

## Neon 적용 상태 확인

사용자가 Neon SQL Editor에서 확인한 결과:

- `registryHero` active version의 `ai_design.imageTarget = section-background`
- `allowSectionBackground = true`
- `imageTargetItemKeys = []`
- 기존 `registryHero.visual` 컴포넌트 인스턴스 수 = 0

따라서 DB 마이그레이션 상태는 판정 기준을 충족한다.

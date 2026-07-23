# Create Promo 관리자 템플릿 레이아웃 동기화 보강 개발계획서

- 작성일: 2026-07-19
- 대상 프로젝트: `promo_web_builder`
- 상태: 개발 반영 및 로컬 검증 완료 · 운영 배포 전
- 우선순위: P0 데이터 정합성, P1 운영 UX·회귀 방지
- 기준 화면:
  - Admin 템플릿 관리: `/prototype/index.html?view=admin&tab=promo-form`
  - Admin Layout Editor: `/prototype/visual-editor.html?mode=admin-layout&templateId={id}`
  - Create Promo: `/prototype/create-promo.html`
- 선행 문서:
  - `docs/admin-template-default-layout-wizard-editing-development-plan-2026-07-17.md`
  - `docs/handoff-2026-07-17.md`

## 1. 문서 목적

관리자 페이지에서 저장하고 활성화한 템플릿 기본 레이아웃이 Create Promo Step 3에 항상 정확하게 적용되도록 식별자, 캐시, 갱신 UX와 테스트 계약을 보강한다.

현재 연결 경로 자체는 구현돼 있다.

```text
Admin Layout Editor
  → PATCH /api/wizard-form-template-layout
  → Draft Template Layout 저장
  → Template 활성화
  → GET /api/wizard-form-template-public
  → defaultLayout + layoutRevision 반환
  → Create Promo Step 3 Snapshot
  → Visual Editor / PromoPageRenderer
```

하지만 Create Promo의 실행별 레이아웃 캐시가 `templateKey + layoutRevision`만 비교한다. 템플릿 Draft 복제 시 Layout Revision이 다시 `1`부터 시작하므로, 새 Active Template과 이전 Active Template의 Revision이 같으면 이전 브라우저 캐시가 최신 관리자 기본 레이아웃보다 우선되는 충돌 가능성이 있다.

이번 계획은 연결 기능을 새로 만드는 작업이 아니라 이미 구현된 연결을 운영 가능한 수준으로 안정화하는 작업이다.

## 2. 현재 구현 검토 결과

### 2.1 정상 구현된 경로

- Admin은 Template ID를 포함해 Layout Editor를 연다.
- Admin Layout API는 Draft Template만 수정할 수 있다.
- Layout 저장 시 Revision을 증가시키고 History를 기록한다.
- Template 활성화 전에 Section/Item과 Layout을 함께 검증한다.
- Active Template 공개 API는 `defaultLayout`, `layoutRevision`, Renderer 정보를 반환한다.
- Create Promo는 공개 API에서 받은 Layout을 Step 3의 기본 Layout으로 사용한다.
- Visual Editor iframe은 `promo-wizard-layout-snapshot` 메시지로 Layout을 받는다.
- `PromoPageRenderer`는 Section 높이, Item 위치·색상·크기·굵기·정렬, 콘텐츠 폭과 폰트 정보를 렌더링한다.

### 2.2 의도적으로 Create Promo가 덮어쓰는 값

Create Promo의 최종 스타일 우선순위는 다음과 같이 유지한다.

```text
Renderer Default
  → Admin Active Template Default Layout
  → Create Promo 실행별 Layout 변경
  → Step 1 Background Override
  → Step 2 CTA Override
```

따라서 아래 값은 Admin Layout보다 Create Promo Step 1·2가 우선한다.

| 속성 | 최종 소유자 | 처리 원칙 |
|---|---|---|
| 페이지 배경색 | Create Promo Step 1 | Admin 배경색을 최종 출력에 사용하지 않음 |
| 페이지 텍스트 기본색 | Create Promo Step 1 | 선택 배경의 명도에 맞춘 색상 사용 |
| 배경 이미지 | Create Promo | 제거 상태 유지 |
| CTA 색상 | Create Promo Step 2 | Step 2 선택값 사용 |
| CTA 모양 | Create Promo Step 2 | 각진/둥근 선택값 사용 |
| CTA 표현 | Create Promo Step 2 | 고스트/채움 선택값 사용 |
| Section 높이 | Admin 기본값 → 실행별 변경 | Admin Layout 적용 |
| Item 위치 | Admin 기본값 → 실행별 변경 | Admin Layout 적용 |
| Item 글자 스타일 | Admin 기본값 → 실행별 변경 | Admin Layout 적용 |
| 콘텐츠 폭·폰트·Accent | Admin 기본값 → 실행별 변경 | Admin Layout 적용 |

### 2.3 확인된 결함

현재 Create Promo는 다음 조건으로 기존 실행별 Layout을 재사용한다.

```text
savedLayout.layoutRevision === server.layoutRevision
```

문제점:

1. Layout Revision은 Template Row별 지역 Revision이지 전역 고유 Revision이 아니다.
2. Active Template에서 새 Draft를 만들 때 Layout은 복제되지만 Revision이 `1`로 초기화된다.
3. Local Storage Layout은 `templateKey`를 Key로 사용하므로 같은 Template Key의 새 Version과 이전 Version이 같은 저장 영역을 공유한다.
4. 이전 Active Version과 새 Active Version의 Revision 숫자가 같으면 새 Admin Layout 대신 이전 `resolvedLayout`이 복원될 수 있다.
5. 기존 테스트는 단일 Revision 병합만 검증하며 Template Version 교체와 Revision 충돌을 다루지 않는다.

### 2.4 운영 UX의 추가 공백

- Admin Layout Editor에서 저장한 값은 Draft에만 저장되며 활성화 전에는 Create Promo에 노출되지 않는다.
- Create Promo가 이미 열린 상태에서 Admin Template이 새로 활성화되어도 자동 재조회하지 않는다.
- 사용자 실행별 편집 내용이 있는 상태에서 관리자 기본값이 변경됐을 때 적용·유지 선택 UX가 없다.
- 공개 API 및 클라이언트 Fetch에 최신 Active Template 조회 의도를 명시하는 Cache 정책이 없다.

## 3. 개발 목표

### 3.1 필수 목표

1. 같은 `templateKey`의 새 Active Template Version을 이전 Version과 정확히 구분한다.
2. Revision 숫자가 같아도 Template ID 또는 Version이 다르면 이전 Layout 캐시를 재사용하지 않는다.
3. Legacy Local Storage는 콘텐츠를 보존하면서 Layout 캐시만 안전하게 무효화한다.
4. Admin Layout을 새로 적용해도 Create Promo Step 1 배경과 Step 2 CTA 선택은 유지한다.
5. 이미 열린 Create Promo에서 관리자 변경을 감지하되 사용자 편집을 묵시적으로 삭제하지 않는다.
6. Draft 저장과 Active 공개의 차이를 Admin 화면에서 명확히 안내한다.
7. 충돌 시나리오를 자동 테스트로 고정한다.

### 3.2 성공 기준

- 새 사용자와 재방문 사용자 모두 동일한 Active Template 기본 Layout에서 시작한다.
- 같은 `layoutRevision`을 가진 서로 다른 Template Version에서 이전 레이아웃이 남지 않는다.
- 같은 Template Identity 안에서는 실행별 Layout 변경이 정상 복원된다.
- Template 변경 시 콘텐츠 값은 가능한 범위에서 유지되고 Layout만 올바른 Base로 재설정된다.
- Step 1·2 스타일 우선순위가 회귀하지 않는다.
- Admin에서 활성화하지 않은 Draft Layout은 Create Promo에 노출되지 않는다.

## 4. 핵심 설계 결정

### 4.1 Layout Revision 단독 비교 금지

Layout 캐시 유효성은 아래 복합 식별자로 판단한다.

```json
{
  "contractVersion": 2,
  "templateId": "uuid",
  "templateKey": "default-preview",
  "templateVersion": 4,
  "configRevision": "...",
  "layoutRevision": 2,
  "rendererKey": "default-promo-renderer",
  "rendererVersion": 1
}
```

P0 필수 비교 필드:

- `templateId`
- `templateVersion`
- `layoutRevision`
- `rendererKey`
- `rendererVersion`

`configRevision`은 Section/Item 구조 변경 감지에 사용한다. Layout 재사용 여부와 콘텐츠 병합 여부를 분리해 판단한다.

### 4.2 명시적 Layout Identity 사용

Public Template API에 `layoutIdentity`를 추가한다.

권장 응답:

```json
{
  "layoutIdentity": {
    "contractVersion": 2,
    "templateId": "uuid",
    "templateKey": "default-preview",
    "templateVersion": 4,
    "layoutRevision": 2,
    "rendererKey": "default-promo-renderer",
    "rendererVersion": 1
  }
}
```

클라이언트가 여러 응답 필드를 임의 조합하지 않고 서버가 제공한 동일한 계약을 저장·비교하도록 한다.

DB Migration은 필요하지 않다. 필요한 값은 기존 Template 및 Layout Row에 모두 존재한다.

### 4.3 Legacy 캐시는 Layout만 폐기

기존 `contentState.templateLayouts[templateKey]` Entry에 `layoutIdentity`가 없으면 Legacy로 간주한다.

처리 원칙:

- `sectionInputs`: 유지 후 현재 Section/Item 정의로 병합
- `templateInputs`: 유지
- `promo`, `simpleBrief`: 유지
- `templateSectionOrders`: 현재 정책으로 재검증 후 유지
- `resolvedLayout`: 폐기
- `baseLayout`: 서버의 최신 `defaultLayout`로 교체
- Step 1·2 Appearance Storage: 유지

사용자 콘텐츠 전체를 초기화하거나 Local Storage Key를 통째로 삭제하지 않는다.

### 4.4 이미 열린 세션의 갱신 정책

Create Promo Step 3 진입 시 Active Template Catalog를 재검증한다.

판정:

| 상태 | 동작 |
|---|---|
| Identity 동일 | 현재 실행별 Layout 유지 |
| Identity 변경, 실행별 변경 없음 | 최신 Admin Base 자동 적용 |
| Identity 변경, 실행별 변경 있음 | 변경 감지 안내와 선택 버튼 표시 |
| Template 비활성/교체 | 새 기본 Active Template 안내 후 선택 유도 |
| 네트워크 오류 | 현재 화면 유지, 재시도 제공 |

사용자 선택:

- `새 관리자 레이아웃 적용`: 콘텐츠를 보존하고 Layout Base/Resolved를 최신값으로 교체
- `현재 작업 유지`: 현재 세션 동안 기존 Snapshot 유지, 다음 신규 세션에는 최신값 적용

현재 작업을 자동으로 덮어쓰지 않는다.

### 4.5 실행별 변경 여부 판정

Step 1·2 Theme Override를 제거한 뒤 다음 값을 비교한다.

```text
normalized(resolvedLayout without Create Promo appearance)
  vs
normalized(baseLayout)
```

비교 대상:

- `sectionStyles`
- `itemStyles`
- Admin 소유 Theme 속성
- `responsive`
- Renderer 정보

배경색, 배경 이미지, CTA Shape/Variant/Color는 Create Promo Appearance 범위이므로 실행별 Admin Layout 변경 판정에서 제외한다.

## 5. 구현 단계

### Phase 1 — Layout Identity 계약 추가 (P0)

대상 파일:

- `api/wizard-form-template-public.js`
- 필요 시 `api/_wizard-form-template-layout-store.js`
- `scripts/test-wizard-form-template-layout-contract.js`
- `scripts/serve-visual-editor-preview.js`

작업:

1. Public API 응답에 `layoutIdentity`를 추가한다.
2. Identity 생성 함수를 서버 공통 모듈에 둔다.
3. Fixture 응답에도 동일 계약을 추가한다.
4. 필수 필드 누락 시 클라이언트가 Legacy/Invalid Identity로 처리할 수 있게 한다.
5. 기존 `defaultLayout`, `layoutRevision`, `renderer` 필드는 호환성을 위해 유지한다.

완료 조건:

- API Contract Test에서 Identity 모든 필드를 검증한다.
- 기존 Promo Wizard 소비자가 깨지지 않는다.

### Phase 2 — Create Promo 캐시 유효성 보강 (P0)

대상 파일:

- `prototype/create-promo.js`
- `scripts/test-create-promo-clone-contract.js`
- 신규 권장: `scripts/test-create-promo-layout-cache.mjs`

작업:

1. `contentState.templateLayouts[templateKey]` 저장 구조에 `layoutIdentity`를 추가한다.
2. `savedLayout.layoutRevision === wizardLayoutRevision` 단독 비교를 제거한다.
3. `sameLayoutIdentity(saved, incoming)` 순수 함수를 추가한다.
4. Identity가 동일할 때만 기존 `resolvedLayout`을 복원한다.
5. Identity가 다르거나 Legacy이면 서버 `defaultLayout`로 초기화한다.
6. 콘텐츠 및 Appearance Storage는 유지한다.
7. `관리자 기본 레이아웃으로 초기화`는 현재 Active Identity의 Base로 복원한다.
8. Run/Snapshot에 `layoutIdentity`를 포함한다.

권장 순수 함수:

```text
normalizeLayoutIdentity
sameLayoutIdentity
hasCreatePromoLayoutOverrides
resolveCreatePromoLayoutCache
```

### Phase 3 — Active Template 재검증과 갱신 UX (P1)

대상 파일:

- `prototype/create-promo.js`
- `prototype/create-promo.css`
- `prototype/create-promo.html`의 Asset Version
- `api/wizard-form-templates-public.js`
- `api/wizard-form-template-public.js`

작업:

1. 최초 로드 및 Step 3 진입 시 Active Template 정보를 재검증한다.
2. Fetch는 명시적으로 최신 데이터를 요청한다.
3. API 응답에 `Cache-Control: no-store` 정책을 검토·적용한다.
4. 변경 감지 Banner를 Step 3 Template Layout 헤더에 표시한다.
5. 자동 적용, 사용자 선택, 재시도 상태를 구분한다.
6. 현재 Template이 더 이상 Active가 아니면 기본 Active Template을 안내한다.
7. 재조회 중 반복 렌더링과 iframe Snapshot Race가 발생하지 않도록 단일 Pending Promise를 사용한다.

### Phase 4 — Admin 활성화 안내 보강 (P1)

대상 파일:

- `visual-editor/src/App.vue`
- `visual-editor/src/styles.css`
- `prototype/index.html`
- `prototype/app.js`
- Visual Editor Production Bundle

작업:

1. Admin Layout Editor Header에 Template 상태를 표시한다.
2. Draft 저장 성공 메시지를 다음 의미로 변경한다.

```text
기본 레이아웃을 Draft에 저장했습니다. Create Promo 반영을 위해 템플릿을 활성화하세요.
```

3. Active Template 편집 불가 상태에는 `새 초안 만들기 → 레이아웃 편집 → 활성화` 순서를 안내한다.
4. Admin Template 활성화 완료 시 Layout Revision과 Template Version을 상태 메시지에 표시한다.
5. 저장과 활성화를 하나의 동작으로 합치지 않는다. 기존 Draft/Active 승인 경계를 유지한다.

### Phase 5 — 로그와 관측성 보강 (P1)

기존 `/api/wizard-layout-usage-events`를 사용한다.

추가 Event:

- `admin_layout_update_detected`
- `admin_layout_update_applied`
- `admin_layout_update_deferred`
- `legacy_layout_cache_invalidated`
- `layout_identity_mismatch`

`changeSummary` 필드:

- previous/new Template ID
- previous/new Template Version
- previous/new Layout Revision
- 사용자 Override 존재 여부
- 적용 방식: automatic, user-confirmed, deferred

레이아웃 전체 JSON이나 콘텐츠 본문은 로그에 저장하지 않는다.

## 6. 테스트 계획

### 6.1 Unit Test

1. Template ID, Version, Revision과 Renderer가 모두 같으면 Identity 일치.
2. Revision이 같아도 Template ID가 다르면 불일치.
3. Template ID가 같아도 Revision이 다르면 불일치.
4. Renderer Version이 다르면 불일치.
5. Legacy Entry는 불일치 처리.
6. Invalid Identity는 Fail-safe로 Admin Base 적용.
7. Identity 불일치 시 콘텐츠와 Appearance는 보존.
8. Admin Layout 적용 뒤 Step 1·2 Override가 최종 우선.

### 6.2 API Contract Test

- Draft Layout 저장은 Revision을 증가시킨다.
- Active Template 공개 응답에 `layoutIdentity`가 포함된다.
- `layoutIdentity.templateId === template.id`를 만족한다.
- `layoutIdentity.layoutRevision === layoutRevision`을 만족한다.
- Draft Template은 Public API에서 조회되지 않는다.
- Template 활성화 전에 Layout Validation이 실행된다.

### 6.3 Integration Test

핵심 회귀 시나리오:

```text
Active Template A v1 / Layout r2 로 Create Promo 방문
→ 사용자 Layout 저장
→ Admin에서 A v2 Draft 생성
→ Layout 복제 r1
→ 한 번 저장해 r2
→ A v2 활성화
→ Create Promo 재방문
→ Revision은 둘 다 r2이지만 Template ID가 다름
→ 이전 Layout을 폐기하고 A v2 Admin Base를 적용해야 함
```

추가 시나리오:

- 같은 Identity로 재방문하면 실행별 Layout 복원.
- Legacy 캐시 보유 상태에서 콘텐츠는 유지되고 Layout만 최신화.
- 열린 Step 3에서 Admin 활성화 변경 감지.
- 실행별 변경이 없으면 자동 적용.
- 실행별 변경이 있으면 선택 Banner 표시.
- 관리자 기본값 복원 후 최신 Base와 일치.
- 템플릿 전환 후 이전 템플릿의 Layout이 섞이지 않음.
- 자동등록과 Layout 갱신이 동시에 발생해도 콘텐츠가 유실되지 않음.

### 6.4 Browser E2E

1. Admin에서 Draft 생성.
2. Layout Editor에서 Section 높이와 Item 위치 변경.
3. Layout 저장 후 미활성 상태에서 Create Promo 미반영 확인.
4. Template 활성화.
5. Create Promo 새 세션에서 변경값 반영 확인.
6. Step 1 배경과 Step 2 CTA가 Admin 값을 덮어쓰는지 확인.
7. Create Promo에서 Item 위치 변경.
8. Admin에서 새 Version 활성화.
9. 열린 Create Promo에서 변경 감지 UX 확인.
10. 적용 선택 후 콘텐츠 유지와 Layout 교체 확인.
11. Console Error, Page Error, Network 4xx/5xx 0건 확인.

### 6.5 실행 명령

```bash
node --check prototype/create-promo.js
node scripts/test-wizard-form-template-layout-contract.js
node scripts/test-wizard-layout-behavior.mjs
node scripts/test-create-promo-clone-contract.js
node scripts/test-create-promo-layout-cache.mjs
node scripts/test-visual-editor-contract.js
node scripts/test-visual-editor-behavior.mjs
pnpm run build:visual-editor
git diff --check
```

## 7. 파일별 변경 예상

| 파일 | 변경 내용 |
|---|---|
| `api/wizard-form-template-public.js` | Public `layoutIdentity` 응답 추가 |
| `api/_wizard-form-template-layout-store.js` | Identity 생성 Helper 추가 검토 |
| `api/wizard-form-templates-public.js` | 최신 Active Catalog Cache 정책 보강 |
| `prototype/create-promo.js` | 복합 Identity 비교, Legacy 무효화, 갱신 감지, Snapshot 보강 |
| `prototype/create-promo.css` | 관리자 Layout 변경 Banner 스타일 |
| `prototype/create-promo.html` | Asset Version 갱신 |
| `visual-editor/src/App.vue` | Draft 저장/활성화 안내 문구 보강 |
| `visual-editor/src/styles.css` | 상태 안내 스타일 필요 시 추가 |
| `prototype/index.html` | Admin 활성화 안내 보강 |
| `prototype/app.js` | 활성화 성공 상태에 Version/Revision 표시 |
| `scripts/serve-visual-editor-preview.js` | Fixture `layoutIdentity` 추가 |
| `scripts/test-create-promo-layout-cache.mjs` | Revision 충돌 전용 신규 테스트 |
| 기존 Contract/Behavior Test | API·UI·우선순위 회귀 계약 추가 |

## 8. 데이터 및 호환성

### 8.1 DB

- 신규 Migration 없음.
- 기존 `wizard_form_template_layouts`와 History 구조 유지.
- Layout Revision 증가 규칙 유지.

### 8.2 API

- 기존 응답 필드는 삭제하지 않는다.
- `layoutIdentity`만 추가하므로 하위 호환을 유지한다.
- Promo Wizard는 기존 필드로 계속 동작할 수 있다.

### 8.3 Local Storage

- Create Promo 전용 Key를 유지한다.
- Promo Wizard Storage와 합치지 않는다.
- Entry 단위 Contract Version을 도입한다.
- Legacy Entry는 Layout만 폐기하고 사용자 콘텐츠를 보존한다.

## 9. 제외 범위

이번 개발에서는 다음을 수행하지 않는다.

- Promo Wizard 저장 구조의 동시 리팩터링
- Create Promo와 Promo Wizard Storage 통합
- Admin Layout 변경을 기존 Generation Run에 소급 적용
- Wizard 변경값을 Admin Template에 역반영
- 여러 Layout Variant 지원
- Renderer Registry 신규 구축
- Local Storage 전체를 서버 저장소로 이전
- Create Promo Step 4 Web Output 신규 구현

Promo Wizard에도 같은 Revision 충돌 가능성이 있는지 별도 감사한 뒤 독립 작업으로 처리한다. Create Promo 수정 코드를 검증 없이 Promo Wizard에 복사하지 않는다.

## 10. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| Identity 변경 시 사용자 Layout 유실 | 기존 작업 손실 | 열린 세션에서는 확인 UX, 콘텐츠와 Appearance 보존 |
| Step 1·2 스타일 회귀 | Create Promo 흐름 불일치 | Appearance 우선순위 Unit/E2E 고정 |
| Step 3 재조회 Race | iframe 빈 화면 또는 Snapshot 역전 | 단일 Pending Promise와 최신 Request Token 사용 |
| API Cache로 이전 Active 응답 | Admin 활성화 지연 | `no-store`와 명시적 재검증 적용 |
| Legacy Storage 용량/형식 오류 | 로드 실패 | Entry 단위 방어적 파싱과 최신 Base 폴백 |
| Template Section 변경과 콘텐츠 불일치 | 입력 유실 | 기존 `mergeSectionInputs` 사용, Layout과 콘텐츠 갱신 분리 |

## 11. 완료 정의

다음 조건을 모두 만족해야 완료로 판단한다.

- [x] Public API가 안정적인 `layoutIdentity`를 반환한다.
- [x] Create Promo가 Template ID/Version/Revision/Renderer 기준으로 Layout 캐시를 검증한다.
- [x] Revision 숫자 충돌 재현 테스트가 통과한다.
- [x] Legacy Layout 캐시는 안전하게 무효화된다.
- [x] 사용자 콘텐츠와 Step 1·2 선택값은 보존된다.
- [x] 열린 Step 3에서 Admin 변경을 감지한다.
- [x] 실행별 수정이 있으면 사용자 확인 없이 덮어쓰지 않는다.
- [x] Admin Draft 저장과 활성화 차이가 UI에 명확히 표시된다.
- [x] Usage Event가 Identity 변경과 사용자 선택을 기록한다.
- [x] 관련 Unit, Contract, Behavior, Browser E2E가 통과한다.
- [x] Visual Editor Production Bundle이 재생성된다.
- [ ] 운영 배포 후 실제 Active Template로 Smoke Test를 완료한다.

## 12. 권장 개발 순서

```text
1. layoutIdentity 계약 및 Fixture 추가
2. Create Promo 순수 캐시 판정 함수와 Unit Test 작성
3. 기존 Local Storage Entry 호환 처리
4. Snapshot/Run에 Identity 저장
5. Step 3 Active Template 재검증
6. 변경 감지 Banner와 사용자 선택 적용
7. Admin Draft/활성화 안내 보강
8. Usage Event 추가
9. 전체 Contract/Behavior Test
10. Visual Editor Build
11. Browser E2E
12. 운영 Smoke Test
```

## 13. 최종 판단

현재 Admin Layout과 Create Promo의 기본 연결은 정상이다. 우선 수정해야 할 부분은 연결 자체가 아니라 Layout의 버전 식별과 Local Storage 재사용 조건이다.

P0에서는 `layoutRevision` 단독 비교를 제거하고 Template Identity를 포함한 복합 비교로 변경해야 한다. P1에서는 이미 열린 Create Promo의 갱신 UX와 Admin 활성화 안내를 보강한다. 이 두 단계를 완료하면 새 사용자뿐 아니라 재방문 사용자와 장시간 열린 세션에서도 최신 Active Template Layout을 일관되게 적용할 수 있다.

## 14. 구현 및 검증 결과 (2026-07-19)

- Public Template API와 Fixture에 `layoutIdentity` 계약을 추가했다.
- Active Template 목록·상세 응답에 `Cache-Control: no-store`를 적용했다.
- Create Promo 전용 `create-promo-layout-cache.js` 순수 모듈을 추가했다.
- Template ID, Template Version, Config Revision, Layout Revision과 Renderer가 모두 일치할 때만 실행별 Layout을 복원한다.
- Legacy Layout Entry는 콘텐츠와 Appearance를 보존하고 Layout만 최신 Admin Base로 교체한다.
- 열린 Step 3에서 같은 Template ID의 Revision 변경과 새 Template Version 활성화를 모두 감지한다.
- 실행별 Layout 변경이 없으면 최신 Admin Base를 자동 적용한다.
- 실행별 Layout 변경이 있으면 `새 관리자 레이아웃 적용`과 `현재 작업 유지`를 선택할 수 있다.
- Layout Identity 변경과 적용·보류 Event를 서버 허용 목록에 추가했다.
- Usage Event에는 Config Revision 본문 대신 길이와 핵심 Identity만 기록해 4KB 제한 초과를 방지했다.
- 관리자 변경 확인 중 사용자가 템플릿을 전환하면 이전 요청을 무효화해 늦은 응답이 현재 선택을 덮지 않도록 했다.
- Admin Layout Editor에 Draft 저장 및 활성화 필요 안내를 추가했다.
- Template 활성화 완료 상태에 Template Version과 Layout Revision을 표시한다.
- Revision 충돌 전용 Unit Test와 관련 Contract Test를 추가했다.
- 자동 테스트 11종, Visual Editor Production Build와 로컬 Browser E2E를 통과했다.
- Browser E2E에서 자동 적용, 사용자 작업 보호 Banner, 적용·유지 선택, 콘텐츠 보존과 Console Error 0건을 확인했다.

남은 작업은 운영 배포 후 실제 DB의 Draft 생성·Layout 저장·Template 활성화·Create Promo 반영을 확인하는 Smoke Test다.

# Create Promo 관리자 기본 레이아웃 반영 오류 수정 개발계획

- 작성일: 2026-07-20
- 대상 프로젝트: `promo_web_builder`
- 대상 화면:
  - Admin Layout Editor: `/prototype/visual-editor.html?mode=admin-layout&templateId={id}`
  - Create Promo Step 3: `/prototype/create-promo.html`
- 문서 상태: 원인 분석 완료 · 구현 전
- 우선순위: P0
- 관련 문서:
  - `docs/create-promo-admin-layout-sync-hardening-development-plan-2026-07-19.md`
  - `docs/create-promo-step3-ai-content-and-layout-generation-development-plan-2026-07-19.md`

## 1. 작성 배경

관리자 페이지에서 Draft 템플릿의 기본 레이아웃과 Section 순서를 변경하고 템플릿을 활성화했지만, Create Promo Step 3에서 최신 변경 사항이 보이지 않는 문제가 확인되었다.

운영 API 확인 결과 Active 기본 템플릿은 `Default Template v2`, Layout은 `r8`을 반환하고 있었다. Create Promo 화면에서도 `Default v2 · layout r8`이 표시되므로 다음 구간은 정상이다.

```text
Admin Layout 저장
  → Template 활성화
  → DB 저장
  → Public Template API 응답
  → Create Promo의 Template Identity 표시
```

문제는 최신 Admin Snapshot을 받은 이후 Create Promo가 Local Storage에 저장된 사용자별 Layout과 Section 순서를 복원하는 과정에서 발생한다.

## 2. 현상

### 2.1 확인된 현상

- Admin에서 Hero Section의 순서를 변경했다.
- Admin에서 Hero Section 내부 Item의 위치를 변경했다.
- Draft Layout 저장 후 Template을 활성화했다.
- Create Promo에서 최신 `Default v2 · layout r8`을 확인했다.
- 그러나 Hero Section 순서와 내부 Item 위치가 기대한 Admin 기본값으로 변경되지 않았다.

### 2.2 정상 동작 기준

- 새 Create Promo 작업은 항상 최신 Active Template의 기본 Layout과 Section 순서로 시작해야 한다.
- 기존 작업에 사용자별 변경이 없으면 Admin 변경 사항을 자동 적용해야 한다.
- 기존 작업에 사용자별 변경이 있으면 자동으로 덮어쓰지 않고 적용 또는 유지 여부를 선택하게 해야 한다.
- `관리자 기본 레이아웃으로 초기화`를 실행하면 Item 위치, Section 높이 및 Section 순서가 모두 최신 Admin 기본값으로 돌아가야 한다.

## 3. 원인 분석

### 3.1 Section 순서 캐시에 Identity가 없음

현재 Section 순서는 다음 구조로 Template Key만 사용하여 저장한다.

```text
contentState.templateSectionOrders[templateKey] = [sectionKey, ...]
```

Template Key는 버전이 바뀌어도 동일하다. 그 결과 이전 Template Version에서 저장한 사용자 순서가 새 Active Version의 Admin 순서보다 우선 적용된다.

현재 복원 흐름:

```text
Public API의 최신 Section 순서 수신
  → templateKey로 이전 사용자 순서 조회
  → 이전 사용자 순서를 최신 Section 목록에 재적용
  → Admin의 최신 Section 순서가 화면에서 사라짐
```

### 3.2 Layout과 Section 순서의 캐시 계약이 분리됨

Item 위치, Section 높이 등 `resolvedLayout`은 `layoutIdentity`를 이용하여 캐시 유효성을 검사한다. 반면 Section 순서는 별도의 배열로 저장되며 Identity 검증을 하지 않는다.

따라서 다음과 같은 불일치가 발생할 수 있다.

```text
표시 Identity: Default v2 · layout r8
Item Layout: 사용자별 이전 Snapshot 또는 최신 Admin Snapshot
Section 순서: 이전 Version의 사용자 저장 순서
```

화면에 최신 Revision이 표시된다는 사실만으로 전체 렌더링 상태가 최신 Admin Snapshot과 일치한다고 보장할 수 없다.

### 3.3 관리자 기본값 초기화 범위가 불완전함

현재 `resetWizardLayout()`은 `wizardResolvedLayout`만 `wizardBaseLayout`으로 교체한다.

초기화 대상:

- Item 위치 및 Style: 초기화됨
- Section 높이: 초기화됨
- Section 순서: 초기화되지 않음
- Section/Item 콘텐츠: 유지됨
- Step 1·2 Appearance: 유지됨

사용자 입장에서 `관리자 기본 레이아웃으로 초기화`는 전체 Layout 복원을 의미하지만 실제로는 Section 순서가 제외되어 있다.

### 3.4 변경 여부 판단에 Section 순서가 포함되지 않음

현재 `hasLayoutOverrides(baseLayout, resolvedLayout)`은 Layout Spec만 비교한다. 사용자가 Section 순서만 변경한 경우 사용자별 변경이 없는 것으로 잘못 판단할 수 있다.

이 경우 Admin 변경을 자동 적용하거나 사용자 선택 Banner를 표시하는 판단이 실제 사용자 작업 상태와 달라질 수 있다.

## 4. 수정 목표

1. Layout과 Section 순서를 하나의 Template Identity 기준으로 관리한다.
2. 이전 Template Version의 Section 순서가 새 Active Version에 자동 복원되지 않게 한다.
3. Admin 변경 감지 시 Layout과 Section 순서를 함께 비교한다.
4. 사용자 변경이 없으면 최신 Admin Snapshot을 자동 적용한다.
5. 사용자 변경이 있으면 명시적인 적용 또는 유지 선택을 제공한다.
6. 관리자 기본값 초기화 시 Section 순서까지 복원한다.
7. 기존 Local Storage 데이터는 콘텐츠를 보존하면서 안전하게 마이그레이션한다.

## 5. 데이터 계약 변경

### 5.1 기존 구조

```json
{
  "templateSectionOrders": {
    "default": ["heroBanner", "contentCta", "footer"]
  }
}
```

### 5.2 변경 구조

```json
{
  "templateSectionOrders": {
    "default": {
      "contractVersion": 2,
      "layoutIdentity": {
        "contractVersion": 2,
        "templateId": "uuid",
        "templateKey": "default",
        "templateVersion": 2,
        "layoutId": "uuid",
        "layoutRevision": 8,
        "configRevision": "revision",
        "rendererKey": "default-promo-renderer",
        "rendererVersion": 1
      },
      "baseOrder": ["header", "heroBanner", "contentCta", "footer"],
      "resolvedOrder": ["header", "contentCta", "heroBanner", "footer"]
    }
  }
}
```

### 5.3 복원 규칙

```text
저장 Identity와 현재 Active Identity가 동일
  → resolvedOrder 복원

Identity가 다름
  → Public API Section 순서를 baseOrder/resolvedOrder로 사용

Legacy 배열 구조
  → 콘텐츠는 보존
  → Section 순서는 최신 Admin 순서로 초기화
  → Legacy 무효화 Event 기록
```

## 6. 상태 및 적용 정책

### 6.1 사용자 변경 없음

다음 두 조건을 모두 만족하면 사용자 변경이 없는 것으로 판단한다.

```text
normalized(resolvedLayout) === normalized(baseLayout)
resolvedSectionOrder === baseSectionOrder
```

Admin Identity가 변경되면 최신 Layout과 Section 순서를 자동 적용한다.

### 6.2 사용자 변경 있음

Layout 또는 Section 순서 중 하나라도 기본값과 다르면 사용자 변경이 있는 것으로 판단한다.

표시할 선택:

- `새 관리자 레이아웃 적용`
  - 최신 Admin Layout 적용
  - 최신 Admin Section 순서 적용
  - 콘텐츠 및 Step 1·2 Appearance 유지
- `현재 작업 유지`
  - 현재 세션의 Layout과 Section 순서 유지
  - 보류한 Admin Identity 기록

### 6.3 관리자 기본값 초기화

초기화 동작:

```text
wizardResolvedLayout = wizardBaseLayout
resolvedSectionOrder = baseSectionOrder
콘텐츠 유지
Step 1 Background 유지
Step 2 CTA Style 유지
Snapshot 재전송
Local Storage 저장
layout_reset Event 기록
```

## 7. 구현 계획

### Phase 1 — Section Order Cache 계약 보강 (P0)

대상 파일:

- `prototype/create-promo-layout-cache.js`
- `prototype/create-promo.js`
- `scripts/test-create-promo-layout-cache.js`

작업:

1. Section Order Cache 정규화 함수를 추가한다.
2. Section Order Entry에 `layoutIdentity`, `baseOrder`, `resolvedOrder`를 저장한다.
3. 동일 Identity일 때만 사용자 순서를 복원한다.
4. Legacy 배열과 Identity 불일치 Entry는 최신 Admin 순서로 초기화한다.
5. 존재하지 않는 Section Key는 제거하고 신규 Section Key는 Admin 순서에 맞춰 추가한다.
6. 고정 Section의 `top`·`bottom` 제약을 재적용한다.

권장 함수:

```text
normalizeSectionOrderCache
sameSectionOrder
resolveSectionOrderCache
mergeSectionOrderWithDefinitions
```

### Phase 2 — Admin 변경 감지 통합 (P0)

대상 파일:

- `prototype/create-promo.js`
- `prototype/create-promo.css`

작업:

1. `hasCreatePromoOverrides()`를 추가한다.
2. Layout Override와 Section Order Override를 함께 검사한다.
3. Admin 변경 자동 적용 시 Layout과 Section 순서를 함께 교체한다.
4. 사용자 확인 Banner에 변경 범위를 표시한다.
5. 적용·유지 Event에 Section 순서 변경 여부를 포함한다.

권장 결과 구조:

```json
{
  "hasOverrides": true,
  "layoutChanged": true,
  "sectionOrderChanged": true
}
```

### Phase 3 — 관리자 기본값 초기화 보강 (P0)

대상 파일:

- `prototype/create-promo.js`
- `visual-editor/src/App.vue`

작업:

1. `resetWizardLayout()`을 Layout과 Section 순서를 모두 초기화하도록 변경한다.
2. iframe에 전송하는 Snapshot의 `sectionSnapshot`과 `sectionOrder`를 즉시 갱신한다.
3. 초기화 버튼 문구와 확인 메시지에 Section 순서가 포함됨을 안내한다.
4. 초기화 후 Local Storage Entry를 최신 Identity로 저장한다.

### Phase 4 — Legacy 데이터 마이그레이션 (P1)

대상 파일:

- `prototype/create-promo.js`
- `prototype/create-promo-layout-cache.js`

작업:

1. 기존 배열형 `templateSectionOrders`를 감지한다.
2. 사용자 콘텐츠와 Appearance는 유지한다.
3. Legacy Section 순서는 최신 Admin 순서로 교체한다.
4. 마이그레이션 실패 시 전체 Create Promo 상태를 삭제하지 않고 해당 Template의 순서 Entry만 무효화한다.
5. `legacy_section_order_cache_invalidated` Event를 기록한다.

### Phase 5 — 관측성과 운영 확인 (P1)

대상 파일:

- `api/wizard-layout-usage-events.js`
- 관련 DB Migration
- `prototype/create-promo.js`

추가 Event:

- `legacy_section_order_cache_invalidated`
- `admin_section_order_update_detected`
- `admin_section_order_update_applied`
- `admin_section_order_update_deferred`
- `admin_layout_reset_with_section_order`

주의:

현재 DB의 `wizard_layout_usage_events.event_name` Check Constraint에 신규 Layout 동기화 Event가 포함되어 있는지 확인해야 한다. API 허용 목록만 확장하고 DB Constraint를 갱신하지 않으면 Event 저장이 500 오류로 실패한다.

## 8. 테스트 계획

### 8.1 Unit Test

1. 동일 Identity에서는 사용자 Section 순서를 복원한다.
2. Template ID가 변경되면 이전 순서를 복원하지 않는다.
3. Template Version이 변경되면 이전 순서를 복원하지 않는다.
4. Layout Revision이 변경되면 이전 순서를 복원하지 않는다.
5. Legacy 배열은 최신 Admin 순서로 초기화한다.
6. 신규 Section은 Admin 순서에 맞춰 추가한다.
7. 삭제된 Section은 사용자 순서에서 제거한다.
8. 고정 Header/Footer는 사용자 순서와 관계없이 top/bottom을 유지한다.
9. Layout은 같고 Section 순서만 다르면 사용자 Override로 판단한다.
10. Appearance만 다르면 Admin Layout Override로 판단하지 않는다.

### 8.2 Integration Test

핵심 시나리오:

```text
Default Template v1 / Layout r7로 Create Promo 접속
  → Hero Section 순서 및 Item 위치 사용자 변경
  → Admin에서 v2 Draft 생성
  → Hero Section 순서 및 Item 위치 변경
  → Layout r8 저장
  → v2 활성화
  → 기존 Create Promo Step 3 재진입
  → Admin 변경 감지
  → 새 관리자 레이아웃 적용
  → Hero 순서와 Item 위치가 모두 v2/r8 기준으로 변경
  → 콘텐츠와 Step 1·2 Appearance는 유지
```

추가 시나리오:

- 사용자 변경이 없는 세션은 자동 갱신한다.
- 사용자 변경이 있는 세션은 Banner를 표시한다.
- `현재 작업 유지`를 선택하면 현재 세션 Snapshot을 유지한다.
- 관리자 기본값 초기화 후 Hero 순서와 Item 위치가 모두 Admin 값과 일치한다.
- 새 브라우저에서는 별도 선택 없이 최신 Active 기본값으로 시작한다.
- 비기본 Active Template을 선택하면 해당 Template의 독립된 캐시만 사용한다.

### 8.3 Browser E2E

1. Admin에서 Draft 생성
2. Hero Section 순서 변경
3. Hero Item 위치 변경
4. 기본 Layout 저장
5. Template 활성화
6. Create Promo에서 Template Version과 Layout Revision 확인
7. Admin 변경 감지 Banner 확인
8. 새 관리자 레이아웃 적용
9. Hero Section 순서 확인
10. Hero 내부 Item 위치 확인
11. 관리자 기본값 초기화 확인
12. 새로고침 후 상태 복원 확인
13. Console Error와 Network 4xx/5xx 0건 확인

## 9. 예상 변경 파일

| 파일 | 변경 내용 |
|---|---|
| `prototype/create-promo-layout-cache.js` | Section Order Identity 및 캐시 판정 함수 추가 |
| `prototype/create-promo.js` | 최신 Admin 순서 적용, 사용자 Override 통합 판정, 초기화 보강 |
| `prototype/create-promo.css` | 변경 감지 Banner의 변경 범위 표시 보강 |
| `visual-editor/src/App.vue` | 관리자 기본값 초기화 안내 및 Snapshot 동기화 보강 |
| `api/wizard-layout-usage-events.js` | Section Order 관련 Event 허용 |
| `db/migrations/{next}_wizard_layout_usage_event_names.sql` | Usage Event Check Constraint 갱신 |
| `scripts/test-create-promo-layout-cache.js` | Section Order 캐시 Unit Test 추가 |
| `scripts/test-create-promo-clone-contract.js` | Create Promo 적용·초기화 계약 검증 추가 |
| 신규 Browser E2E 또는 Behavior Test | Admin 활성화 후 Create Promo 반영 시나리오 추가 |

## 10. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 기존 사용자 순서가 초기화됨 | 기존 작업의 배치 변경 | Identity 불일치 시 Banner 안내, 콘텐츠 보존 |
| Template Section 변경과 Layout 변경의 동시 적용 | Snapshot 불일치 | 단일 적용 함수에서 Layout·Section 순서를 원자적으로 교체 |
| iframe Watch Race | 이전 Snapshot이 부모 상태를 다시 덮어씀 | Request Token 또는 적용 중 Flag로 이전 응답 무효화 |
| Legacy Local Storage 형식 오류 | Step 3 로드 실패 | Template Entry 단위 Fail-safe와 최신 Admin 기본값 대체 |
| Usage Event DB Constraint 누락 | Event API 500 | API 허용 목록과 DB Constraint를 같은 Phase에서 배포 |
| Step 1·2 설정 초기화 | 사용자 설정 손실 | Layout 초기화 대상에서 Appearance를 명시적으로 제외 |

## 11. 완료 정의

- [ ] 최신 Active Identity와 일치할 때만 사용자 Layout과 Section 순서를 복원한다.
- [ ] Template Version 또는 Layout Revision 변경 시 이전 Section 순서가 자동 적용되지 않는다.
- [ ] Admin 변경 자동 적용 시 Layout과 Section 순서가 함께 변경된다.
- [ ] 사용자 변경이 있으면 적용 또는 유지 선택이 제공된다.
- [ ] 관리자 기본값 초기화가 Item 위치, Section 높이 및 Section 순서를 모두 복원한다.
- [ ] 사용자 콘텐츠와 Step 1·2 Appearance가 보존된다.
- [ ] Legacy Section Order Cache가 안전하게 무효화된다.
- [ ] Unit, Contract, Behavior 및 Browser E2E가 통과한다.
- [ ] 배포 환경에서 Active Template과 실제 DB를 사용한 Smoke Test가 통과한다.
- [ ] Console Error와 관련 Network 4xx/5xx가 없다.

## 12. 권장 개발 순서

```text
1. Section Order Cache 계약 및 Unit Test 작성
2. 동일 Identity에서만 사용자 순서 복원
3. Admin 변경 여부에 Layout과 Section 순서 통합
4. 적용·유지 UX 보강
5. 관리자 기본값 초기화 범위 확장
6. Legacy Local Storage 마이그레이션
7. Usage Event API 및 DB Constraint 갱신
8. Contract/Behavior Test
9. Visual Editor Build
10. Browser E2E
11. 배포 환경 Smoke Test
```

## 13. 최종 판단

이번 문제는 Admin Layout 저장이나 Template 활성화 실패가 아니다. 서버는 최신 `Default Template v2 · layout r8`과 Layout Spec을 정상적으로 반환하고 있다.

실제 원인은 Create Promo가 Layout Spec과 Section 순서를 서로 다른 캐시 계약으로 관리하며, Template Key만 같은 이전 사용자 Section 순서를 최신 Admin Snapshot 위에 다시 적용하는 데 있다.

해결의 핵심은 단순한 Local Storage 삭제가 아니라 다음 원칙을 코드 계약으로 고정하는 것이다.

> Layout, Section 순서 및 사용자 Override는 동일한 Template Identity에 종속되어야 하며, Identity가 변경되면 최신 Admin 기본값과 사용자 작업 간 적용 정책을 명시적으로 결정해야 한다.

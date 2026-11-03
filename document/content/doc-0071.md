# 템플릿·페이지 레이아웃 관리 비활성화 개발 계획서

## 0. 문서 정보

- 작성일: 2026-09-08
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 계획 초안
- 적용 대상: AI Builder Composition Contract v3 및 관리자 설정
- 핵심 결정: 컴포넌트 관리와 섹션 프리셋 관리는 유지하고, 템플릿·페이지 레이아웃 관리는 삭제하지 않은 채 신규 사용만 비활성화한다.
- 호환 원칙: 기존 템플릿 기반 문서는 계속 조회·편집·렌더링할 수 있어야 한다.
- 제외 범위: Directus 설정, Directus 데이터 이전, 기존 테이블 물리 삭제

## 1. 배경과 문제 정의

현재 프로모 빌더에는 두 가지 페이지 구성 축이 공존한다.

1. 기존 Template Mode
   - Form Template에 Section 구성과 기본 Page Layout을 저장한다.
   - 템플릿이 페이지 구조, 기본 콘텐츠, 레이아웃 식별자의 중심이다.
2. AI Composition Contract v3
   - Composition Shell의 정책에 따라 Registry Section을 선택한다.
   - Section Layout Preset과 Component 정의를 조합해 페이지를 생성한다.

v3 생성 결과는 실질적으로 Registry 중심으로 만들어지지만 다음 영역에는 아직 `formTemplate`, `fallbackTemplateId`, Template Layout 호환 정보가 남아 있다.

- 생성 결과의 `layoutIdentity`
- `compositionMeta.sourceTemplateId`
- `content.formTemplate`
- Design Token 전달
- Asset 입력 해시와 자산 생성 컨텍스트
- Export Adapter
- 기존 Visual Editor 진입 및 저장 경로
- 관리자 Template Layout 편집기

따라서 관리자 메뉴만 숨기면 내부 의존성이 그대로 남고, DB 레코드를 일괄 비활성화하면 기존 문서가 열리지 않을 수 있다. 이번 작업은 UI 숨김이 아니라 **v3 신규 흐름의 템플릿 의존성 제거와 기존 문서의 읽기 호환 유지**를 함께 처리해야 한다.

## 2. 목표

### 2.1 제품 목표

- AI Builder v3는 페이지 템플릿 없이 Section과 Component를 자유롭게 조합한다.
- Component 관리와 Section Layout Preset 관리는 계속 운영한다.
- 관리자는 신규 Template 및 Template Page Layout을 만들거나 수정하지 않는다.
- 기존 Template Mode 문서와 과거 Revision은 손상 없이 계속 열린다.
- 운영 문제가 발생하면 환경 설정 하나로 관리 기능을 즉시 복구할 수 있다.

### 2.2 기술 목표

- `TEMPLATE_LAYOUT_MANAGEMENT_ENABLED` 기능 플래그를 도입한다.
- 플래그가 꺼지면 Template 관리 UI와 쓰기 API를 차단한다.
- 기존 문서 조회에 필요한 읽기 API와 Renderer 계약은 유지한다.
- v3 Snapshot은 Template ID 대신 Composition Shell을 페이지 구성의 출처로 기록한다.
- Design Token과 Asset 생성은 Template 객체가 아니라 독립적인 Runtime Theme Context를 사용하도록 점진적으로 전환한다.
- Template 관련 DB 테이블과 기존 소스는 이번 단계에서 삭제하지 않는다.

## 3. 비목표

- `wizard_form_templates`, `wizard_form_template_layouts` 및 History 테이블 삭제
- 기존 Template Mode 문서의 일괄 v3 변환
- 기존 Revision의 Snapshot 재작성
- Section Layout Preset 관리 비활성화
- Component 관리 비활성화
- 관리자 전체 개편
- Directus 연동 또는 데이터 마이그레이션
- AI가 검증되지 않은 임의 HTML·CSS·절대 좌표를 생성하도록 허용

## 4. 목표 운영 모델

```text
프로모션 입력
→ 활성 Composition Shell 조회
→ 허용된 Registry Section 선택
→ Section별 Layout Preset 선택
→ 허용된 Component 구성과 반복 개수 결정
→ Design Token·Motion·Asset 정책 적용
→ Layout Compiler 자동 배치
→ Desktop·Mobile 품질 검사
→ 문서 저장·미리보기·Export
```

역할 구분은 다음과 같다.

| 관리 영역 | 유지 여부 | 담당 역할 |
|---|---|---|
| Component 관리 | 유지 | 콘텐츠 필드, CTA, 이미지, 반복 컬렉션, Style Slot |
| Section 관리 | 유지 | Section 역할, 필수 여부, 허용 Component, 이미지 정책 |
| Section Layout Preset | 유지 | Section 내부 Desktop·Mobile 배치와 카드 열 구성 |
| Composition Shell | 유지·강화 | 페이지 전체 허용 범위, 필수 역할, Token, Motion, 전역 규칙 |
| Template 관리 | 신규 사용 비활성화 | 기존 문서 읽기 호환만 유지 |
| Template Page Layout 관리 | 신규 사용 비활성화 | 기존 문서 읽기 호환만 유지 |

## 5. 기능 플래그 정책

### 5.1 신규 플래그

```text
TEMPLATE_LAYOUT_MANAGEMENT_ENABLED=false
```

내부 Capability 이름은 `templateLayoutManagement`로 사용한다.

### 5.2 기본값과 환경별 정책

| 환경 | 초기값 | 목적 |
|---|---:|---|
| Local·Test | `true` | 기존 테스트와 비교 및 전환 검증 |
| Preview | `false` | 비활성화된 실제 사용자 흐름 검증 |
| Production | 단계적 `false` | Preview 승인 후 전환 |

플래그의 기본값을 즉시 `false`로 고정하지 않는다. 먼저 코드와 테스트를 배포한 뒤 Preview에서 명시적으로 끄고, 운영 검증 후 Production에 적용한다.

### 5.3 플래그가 꺼진 상태의 동작

| 기능 | 동작 |
|---|---|
| 관리자 Template 탭 | 숨김 |
| Template 편집기 직접 URL | 비활성화 안내 |
| Template 목록 조회 | 기존 호환을 위해 허용 |
| Template 상세 조회 | 기존 호환을 위해 허용 |
| Template Layout 조회 | 기존 문서를 위해 허용하되 신규 Layout 자동 생성 금지 |
| Template 생성·복제·수정 | 차단 |
| Template 활성화·비활성화·Archive·Delete | 차단 |
| Template Layout PATCH | 차단 |
| AI Builder v3 | Template 없이 정상 동작 |
| 기존 Template Mode 문서 | 조회·렌더링·필요한 기존 편집 허용 |
| Component·Section Preset 관리 | 정상 동작 |

쓰기 차단 API는 공통 오류를 반환한다.

```json
{
  "error": "Template and page layout management is disabled",
  "code": "TEMPLATE_LAYOUT_MANAGEMENT_DISABLED"
}
```

HTTP Status는 존재를 숨기는 `404`보다 운영 상태를 명확히 전달할 수 있는 `409 Conflict`를 기본으로 사용한다. 공개 API 보안 정책상 기능 존재를 숨겨야 하는 Endpoint만 기존 Feature Flag의 `404` 방식을 유지한다.

## 6. 호환성 전략

### 6.1 Snapshot 계약

신규 v3 Snapshot에서는 Template을 출처로 간주하지 않는다.

권장 신규 구조:

```json
{
  "layoutIdentity": {
    "contractVersion": 3,
    "sourceType": "composition-shell",
    "sourceId": "shell-version-id",
    "sourceKey": "shell:registry-default",
    "rendererKey": "default-promo-renderer",
    "rendererVersion": 1
  },
  "content": {
    "runtimeTheme": {
      "designTokenSetVersionId": "token-version-id",
      "designTokens": { "values": {} }
    }
  }
}
```

전환 기간에는 기존 Consumer를 위해 `content.formTemplate`을 호환 Envelope로 유지할 수 있다. 단, 신규 v3에서 이 객체는 Template DB 레코드를 의미하지 않고 다음처럼 명시한다.

- `id`: 빈 문자열
- `templateKey`: `shell:<shellKey>`
- `version`: Shell Version
- `designTokens`: Runtime Theme과 동일한 값
- `compatibilityOnly`: `true`

Consumer 전환이 완료되기 전에는 `formTemplate` 필드를 제거하지 않는다.

### 6.2 기존 문서

- Contract v2와 과거 Snapshot의 `formTemplate.id`를 유지한다.
- 기존 문서는 기존 Template Layout을 조회해 렌더링할 수 있다.
- 관리 기능이 꺼져 있어도 과거 Revision 조회와 Export는 허용한다.
- 기존 문서를 저장할 때 Template ID를 임의로 삭제하거나 Shell ID로 치환하지 않는다.
- 기존 문서의 복제 정책은 별도로 명시한다. 초기 단계에서는 v2 복제를 허용하되 신규 Template 생성은 허용하지 않는다.

### 6.3 DB 정책

- 기존 Template 레코드를 일괄 `inactive` 또는 `archived`로 변경하지 않는다.
- FK와 History를 유지한다.
- 신규 v3 문서에 Template FK가 필수인 제약이 있다면 `NULL`을 허용하는 Migration을 추가한다.
- Template 참조 제거 여부는 운영 전환 완료 후 별도 계획에서 판단한다.

## 7. 상세 개발 Workstream

## TLD-00. 의존성 기준선 확정 — P0

### 작업

- `formTemplate`, `fallbackTemplateId`, `wizard-form-template-*` 사용처를 API·Admin·Visual Editor·Export·Asset별로 분류한다.
- 각 사용처를 `v2 필수`, `v3 호환`, `v3 제거 가능`으로 표시한다.
- 현재 활성 Composition Shell의 fallback Template 설정 현황을 확인한다.
- Template이 없는 v3 Fixture를 추가하고 현재 실패 지점을 기록한다.
- 기존 Template Mode 핵심 Fixture를 회귀 기준으로 고정한다.

### 완료 조건

- Template 의존성 목록에 소유 모듈과 전환 방법이 기록돼 있다.
- Template 없는 v3 Snapshot에서 발생하는 모든 실패가 테스트로 재현된다.

## TLD-01. 기능 플래그와 Capability 도입 — P0

### 변경 대상

- `api/_promo-builder-flags.js`
- `api/promo-builder-capabilities.js`
- 관리자 Bootstrap 및 Tab 노출 로직

### 작업

- `templateLayoutManagement` 플래그와 환경 변수 매핑을 추가한다.
- Capabilities API가 관리 기능 활성 상태를 반환하도록 한다.
- 관리자 화면은 Capability를 받은 뒤 Template 탭 노출 여부를 결정한다.
- 플래그 변경은 기존 `compositionV3` 상태에 영향을 주지 않도록 분리한다.
- 플래그가 없을 때의 환경별 기본값을 테스트한다.

### 완료 조건

- 동일 빌드에서 환경 설정만으로 Template 관리 기능을 켜고 끌 수 있다.
- Component와 Section Layout Preset 탭은 플래그와 무관하게 유지된다.

## TLD-02. 관리자 UI 비활성화 — P0

### 변경 대상

- `prototype/index.html`
- `prototype/app.js`
- `admin-app/src/main.js`
- `admin-app/src/components/TemplateLayoutManager.vue`
- 관련 Locale Message와 브라우저 테스트

### 작업

- Template·Layout 관리 탭을 Capability 기반으로 숨긴다.
- 기존에 Template 탭을 선택한 상태에서 플래그가 꺼지면 기본 설정 탭으로 이동한다.
- 직접 URL 또는 오래된 Bookmark 접근 시 빈 화면 대신 비활성화 안내를 제공한다.
- Template Layout Manager Bundle은 초기 단계에서 유지해 롤백 시 재사용한다.
- 관리자 화면에서 Component와 Section Preset 관리 동작을 회귀 검증한다.

### 완료 조건

- 플래그가 꺼진 관리자 화면에 Template 관리 진입점이 없다.
- 직접 진입해도 편집 기능이 실행되지 않는다.
- 플래그를 다시 켜면 기존 관리 화면이 복구된다.

## TLD-03. Template 쓰기 API 차단 — P0

### 대상 작업

- Template 생성·수정·복제
- Activate·Deactivate·Archive·Delete
- Template Section 연결과 순서 변경
- Template Page Layout PATCH

### 유지 작업

- 기존 Template 목록과 상세 조회
- 기존 Template Layout 조회
- Public Template 조회
- 기존 문서 렌더링에 필요한 내부 Store 조회

### 구현 원칙

- 공통 Guard 함수 `requireTemplateLayoutManagement()`를 제공한다.
- 모든 쓰기 Endpoint에서 Body Parse나 DB 변경 전에 Guard를 호출한다.
- GET 요청은 Guard로 차단하지 않는다.
- 플래그가 꺼진 GET에서 `ensureLayout()`처럼 DB를 쓰는 동작을 제거하고 순수 조회로 전환한다.
- 차단 이벤트는 Endpoint, Method, Owner, Feature 상태를 포함해 기록한다.

### 완료 조건

- 플래그가 꺼진 상태에서 Template 관련 DB 변경이 0건이다.
- 기존 Template 기반 문서는 정상 조회된다.
- 직접 API 호출로 UI 제한을 우회할 수 없다.

## TLD-04. v3 Composition Shell의 Template 의존성 제거 — P0

### 변경 대상

- `api/_promo-composition-shells-store.js`
- `api/_promo-registry-composition-candidates.js`
- `api/_promo-registry-composition-compiler.js`
- Composition Shell Admin과 Migration

### 작업

- 신규 Shell에서 `fallbackTemplateId`와 `fallbackTemplateVersion`을 선택값으로 유지한다.
- v3 Candidate Snapshot의 Template 정보는 호환 메타데이터로만 분리한다.
- Compiler의 `layoutIdentity`를 Shell Version 기반으로 생성한다.
- `compositionMeta.sourceTemplateId` 대신 `sourceType`, `sourceShellVersionId`를 우선 기록한다.
- Template ID가 없어도 v3 Compile·Apply·Revision·Rollback이 완료되도록 한다.
- 활성 Shell이 없을 때는 기존과 같이 Fail-closed 처리한다.
- v3 실패 시 Template Mode로 조용히 전환하지 않는다.

### 완료 조건

- fallback Template이 없는 활성 Shell로 v3 페이지를 생성할 수 있다.
- 생성 결과에 Template DB 레코드가 없어도 저장·재진입·수정·Rollback이 동작한다.
- Template 비활성화가 v3 Candidate 수와 Section 선택 범위를 줄이지 않는다.

## TLD-05. Runtime Theme 분리 — P0/P1

### 문제

현재 Design Token과 일부 Asset 로직이 `content.formTemplate.designTokens`를 읽는다. Template 객체를 제거하려면 Theme 데이터의 독립 위치가 필요하다.

### 작업

- `content.runtimeTheme` 또는 동등한 독립 Theme Context를 도입한다.
- Renderer는 `runtimeTheme`을 우선하고 기존 `formTemplate.designTokens`를 fallback으로 읽는다.
- Asset Queue와 Asset Input Hash도 같은 우선순위를 사용한다.
- Composition Operation의 Token Key 조회를 Runtime Theme 기반으로 전환한다.
- Export Adapter는 새 Theme 구조를 출력하되 v2 호환 필드를 보존한다.
- 한 Release 동안 양쪽 값을 함께 기록하고 불일치를 진단한다.

### 완료 조건

- v3 문서의 Token 적용에 Template 객체가 필요하지 않다.
- Preview와 HTML·Vue·React Export의 Token 결과가 동일하다.
- 기존 v2 문서의 Token 렌더링이 변하지 않는다.

## TLD-06. 기존 문서 읽기 호환과 편집 정책 — P0

### 작업

- 기존 v2 문서 열기, 새로고침, 저장, Export를 회귀 검증한다.
- 기존 Template Layout을 사용하는 Visual Editor Context는 유지한다.
- Template 관리 플래그와 기존 문서 편집 권한을 분리한다.
- 기존 문서 편집이 Template 원본을 수정하지 않고 Document Revision만 변경하는지 확인한다.
- 기존 Template을 참조하는 신규 v2 문서 생성 정책을 결정한다.

### 권장 초기 정책

- 기존 v2 문서 조회·편집·복제: 허용
- 신규 Template 생성 및 신규 Template Layout 편집: 차단
- 신규 AI 문서: v3만 사용
- 신규 Template Mode 진입: Preview 검증 후 별도 플래그로 단계적 비활성화

### 완료 조건

- 관리 기능을 꺼도 기존 문서가 깨지지 않는다.
- 신규 AI 문서는 Template 참조 없이 생성된다.

## TLD-07. 테스트와 품질 게이트 — P0

### 자동 테스트

1. Feature Flag
   - 기본값과 명시적 `true`·`false`
   - Capability 응답
2. Admin Browser
   - 탭 숨김
   - 직접 진입 차단
   - Component·Section Preset 탭 정상 동작
3. API Contract
   - GET 허용
   - 모든 쓰기 Endpoint 차단
   - 차단 상태에서 DB 호출 없음
4. v3 Template-less Flow
   - Candidate → Proposal → Process → Apply
   - Asset Enqueue
   - Preview·Save·Reload·Rollback
   - Export
5. Legacy Regression
   - v2 문서 조회·편집·Export
   - 기존 Template Layout 렌더링
6. Browser Quality
   - Desktop·Mobile
   - Hero 이미지
   - 반복 Component
   - Design Token

### 수동 테스트

- 관리자 메뉴에서 Template 탭이 노출되지 않는지 확인
- 기존 Template 기반 문서 3건 열기
- Template 없는 v3 프로모션 10회 생성
- 직접 수정 후 저장·새로고침
- HTML·Vue·React Export 비교
- 플래그 재활성화 후 Template 관리 화면 복구 확인

### 완료 조건

- 전체 기존 테스트가 통과한다.
- 신규 비활성화 테스트가 추가된다.
- Template 없는 v3 E2E가 통과한다.
- 기존 v2 Golden Fixture의 구조적 회귀가 없다.

## TLD-08. 배포·관측·롤백 — P0

### 배포 단계

1. 기능 플래그가 켜진 상태로 코드 배포
2. Preview 환경에서 플래그 비활성화
3. 관리자 UI·API·v3·기존 문서 수동 검증
4. 내부 사용자 대상으로 Production 플래그 비활성화
5. 오류율과 기존 문서 접근 실패를 관찰
6. 이상이 없으면 전체 사용자에게 적용

### 관측 지표

- `TEMPLATE_LAYOUT_MANAGEMENT_DISABLED` 응답 수
- Template 쓰기 우회 시도 수
- v3 생성 성공률
- `COMPOSITION_SHELL_REQUIRED` 발생률
- Template 없는 v3 저장·재진입 실패율
- 기존 v2 문서 열기 실패율
- Preview와 Export 품질 Gate 실패율

### 롤백

```text
TEMPLATE_LAYOUT_MANAGEMENT_ENABLED=true
```

- 코드 재배포 없이 플래그만 복구한다.
- DB 레코드와 관리 Bundle을 삭제하지 않았으므로 기존 관리 기능이 다시 노출된다.
- 신규 v3 Snapshot은 Shell 기반이므로 플래그 복구 후에도 계속 읽을 수 있어야 한다.
- 롤백 후에도 Template 없는 문서에 Template ID를 임의로 주입하지 않는다.

## 8. 예상 변경 파일

### Feature Flag와 Capability

- `api/_promo-builder-flags.js`
- `api/promo-builder-capabilities.js`
- 신규 공통 Template Management Guard

### Admin UI

- `prototype/index.html`
- `prototype/app.js`
- `admin-app/src/main.js`
- `admin-app/src/components/TemplateLayoutManager.vue`
- 관련 Admin Locale Message

### Template API

- `api/wizard-form-templates.js`
- `api/wizard-form-template.js`
- `api/wizard-form-template-activate.js`
- `api/wizard-form-template-deactivate.js`
- `api/wizard-form-template-archive.js`
- `api/wizard-form-template-delete.js`
- `api/wizard-form-template-sections.js`
- `api/wizard-form-template-sections-order.js`
- `api/wizard-form-template-layout.js`

### v3 Composition

- `api/_promo-composition-shells-store.js`
- `api/_promo-registry-composition-candidates.js`
- `api/_promo-registry-composition-compiler.js`
- `api/promo-page-composition-proposals.js`
- `api/promo-page-composition-apply.js`

### Runtime·Asset·Export

- `visual-editor/src/PromoPageRenderer.vue`
- `visual-editor/src/App.vue`
- `visual-editor/src/contracts.js`
- `api/_promo-builder-assets.js`
- `api/_promo-page-composition-operations.js`
- `api/_promo-builder-export-adapters.js`

### 테스트

- Feature Flag 계약 테스트
- Admin Template 비활성화 브라우저 테스트
- Template API Read/Write 분리 테스트
- Template-less v3 Compiler 테스트
- 기존 v2 호환 테스트
- Preview·Export Token 정합성 테스트

## 9. 작업 순서와 예상 일정

| 단계 | 기간 | 결과물 |
|---|---:|---|
| 1. 기준선·의존성 테스트 | 1~2일 | 의존성 표, 실패 Fixture |
| 2. Flag·Admin·API 차단 | 2~3일 | 안전한 관리 기능 비활성화 |
| 3. v3 Shell 식별 전환 | 3~5일 | Template 없는 v3 Snapshot |
| 4. Runtime Theme 분리 | 3~4일 | Renderer·Asset·Export 독립화 |
| 5. 기존 문서 회귀 보완 | 2~3일 | v2 읽기 호환 검증 |
| 6. Preview Rollout | 2일 | 수동 테스트와 운영 승인 |

예상 개발 기간은 약 2~3주다. 실제 기간은 기존 Template 없는 v3 Fixture에서 발견되는 숨은 의존성 수에 따라 달라질 수 있다.

## 10. 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| UI만 숨기고 API 쓰기가 유지됨 | 데이터 변경 우회 가능 | 모든 쓰기 Endpoint에 서버 Guard 적용 |
| GET이 `ensureLayout()`으로 DB를 변경함 | 비활성화 상태에서도 신규 Layout 생성 | 읽기 전용 조회 함수 분리 |
| Template ID 제거로 기존 Renderer 실패 | 미리보기·Export 장애 | Runtime Theme 우선, 기존 필드 fallback |
| 기존 Template 레코드 일괄 비활성화 | 과거 문서 접근 실패 | DB Status를 변경하지 않음 |
| Shell 설정 부족 | 신규 v3 생성 실패 | 필수 역할·Token·Preset 사전 검증 |
| v2와 v3 분기 혼합 | 예상하지 못한 Template 접근 | Contract Version별 Adapter와 테스트 분리 |
| 플래그 복구 시 UI만 복구됨 | 쓰기 API 상태 불일치 | UI와 API가 동일 Capability 소스를 사용 |

## 11. 완료 기준

다음 항목을 모두 만족하면 개발 완료로 판단한다.

- [ ] Template·Page Layout 관리 기능을 환경 플래그로 켜고 끌 수 있다.
- [ ] 비활성화 상태에서 관리자 Template 진입점이 노출되지 않는다.
- [ ] 비활성화 상태에서 Template 관련 쓰기 API가 모두 차단된다.
- [ ] 읽기 API는 기존 문서 호환 범위에서 유지된다.
- [ ] fallback Template이 없는 Composition Shell로 v3 문서를 생성할 수 있다.
- [ ] 신규 v3 문서의 저장·재진입·수정·Rollback이 동작한다.
- [ ] Preview와 Export가 독립 Runtime Theme을 동일하게 적용한다.
- [ ] 기존 v2 Template 문서가 정상적으로 열린다.
- [ ] Component와 Section Layout Preset 관리 기능이 정상 동작한다.
- [ ] 플래그 재활성화만으로 기존 Template 관리 기능을 복구할 수 있다.
- [ ] 전체 자동 테스트와 신규 E2E 테스트가 통과한다.
- [ ] DB 테이블과 기존 Template 데이터가 삭제되지 않는다.

## 12. 최종 결정 요약

이번 전환은 Template 시스템 제거 프로젝트가 아니다. 신규 AI Builder v3의 페이지 구성 책임을 Template에서 Composition Shell·Section Preset·Component Registry로 옮기는 작업이다.

Template과 Page Layout 관련 코드는 다음 목적을 위해 보존한다.

- 기존 문서 읽기 호환
- 운영 롤백
- 전환 기간의 데이터 보호

신규 생성의 자유도는 Section 선택, Section 순서, Layout Preset, Component 구성과 반복 개수를 통해 확보한다. 페이지 배치의 품질은 Section Preset, Layout Compiler, Desktop·Mobile 품질 게이트가 보장한다.

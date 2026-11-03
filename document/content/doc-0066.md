# 섹션 AI 레이아웃 및 이미지 생성 1차 개발계획서

- 작성일: 2026-07-20
- 대상 프로젝트: `promo_web_builder`
- 대상 화면: Create Promo Step 3 / Visual Editor
- 문서 상태: Backend 직접 LLM 제어 방식 1차 구현 반영
- 우선순위: P1

## 0. 아키텍처 결정

이번 기능은 n8n을 사용하지 않는다. Backend가 LLM과 이미지 생성 모델을 직접 호출하고 실행 상태, 검증, 재시도, 결과 저장을 모두 관리한다.

```text
Create Promo
  → Backend 생성 요청 API
  → DB에 Section Design Run 저장
  → Backend 비동기 작업 실행
      1. 콘텐츠 분석 및 Layout Variant 선택
      2. 구조화된 Layout Patch 생성
      3. 잠금 및 Layout Schema 검증
      4. 이미지 생성 모델 호출
      5. Asset 저장 및 검증
  → Frontend 상태 조회
  → 사용자 확인
  → Backend 적용 API
```

Backend 직접 제어 원칙은 다음과 같다.

- LLM 및 이미지 모델 API Key는 Backend 환경변수에서만 관리한다.
- Prompt, Model, Schema와 생성 파라미터를 코드 및 DB Snapshot으로 버전 관리한다.
- Frontend 요청은 즉시 `runId`를 반환하며 장시간 생성 완료를 기다리지 않는다.
- 각 실행 단계는 DB 상태를 기준으로 재시작할 수 있어야 한다.
- AI 결과는 서버 검증을 통과하기 전까지 Create Promo Snapshot에 반영하지 않는다.
- 특정 Provider 또는 모델에 종속되지 않도록 Adapter 인터페이스를 사용한다.

## 1. 목적

사용자가 템플릿 섹션에 콘텐츠를 등록한 뒤 해당 콘텐츠를 AI가 분석하여 다음 결과를 섹션 단위로 생성할 수 있게 한다.

1. 관리자가 허용한 섹션 템플릿 레이아웃 중 적합한 레이아웃 선택 및 속성 구성
2. 섹션에서 필요로 하는 관련 이미지 에셋 생성
3. 생성된 레이아웃과 이미지를 실제 Web Renderer로 미리보기
4. 사용자가 결과를 적용하거나 재생성

AI가 완성된 웹 섹션을 하나의 이미지로 만드는 방식은 사용하지 않는다. 텍스트와 CTA는 실제 DOM 콘텐츠로 유지하고, AI 이미지는 배경·제품·인물·장식 등 이미지 슬롯에만 적용한다.

## 2. 1차 개발 범위

### 2.1 포함

- 섹션별 `AI 디자인 생성` 버튼
- 저장된 섹션 콘텐츠를 입력으로 사용
- 섹션 콘텐츠 분석
- 관리자 등록 Layout Variant 중 하나 선택
- 허용된 범위 내 `sectionStyles`와 `itemStyles` 생성
- 이미지 생성 대상 Item에 이미지 1개 생성
- 섹션 단위 생성 상태 표시
- 실제 Visual Editor Renderer 기반 미리보기
- 결과 적용, 재생성, 취소
- 관리자 콘텐츠 및 레이아웃 잠금 정책 적용
- 생성 요청과 결과 이력 저장
- 입력 콘텐츠 변경 시 결과 노후화 표시

### 2.2 제외

- AI가 임의의 HTML, Vue, CSS 코드를 생성하여 실행하는 기능
- 페이지 전체 레이아웃 자동 생성
- 한 섹션에서 여러 이미지 Variant를 동시에 비교하는 기능
- 모바일 전용 이미지를 별도로 생성하는 기능
- AI 생성 결과의 자동 운영 배포
- 관리자 템플릿 원본을 AI 결과로 직접 수정하는 기능

## 3. 대상 섹션

1차는 이미지 비중이 높고 결과 검증이 쉬운 섹션만 지원한다.

- Hero Banner
- Content CTA
- Image Text Row

텍스트 전용 섹션, Header, Footer, 약관 영역은 1차 대상에서 제외한다.

## 4. 사용자 흐름

```text
섹션 콘텐츠 등록 및 저장
  → AI 디자인 생성 가능 조건 검사
  → AI 디자인 생성 요청
  → 콘텐츠 분석
  → Layout Variant 선택 및 레이아웃 속성 생성
  → 관련 이미지 생성
  → 실제 Renderer에서 결과 미리보기
  → 적용 / 재생성 / 취소
  → 적용 결과를 현재 Create Promo Snapshot에 저장
```

### 4.1 버튼 활성 조건

다음 조건을 모두 만족할 때 `AI 디자인 생성` 버튼을 활성화한다.

- 선택된 Form Template가 활성 상태이다.
- 섹션 콘텐츠가 현재 로컬 상태뿐 아니라 작업 Snapshot에 저장되어 있다.
- 제목 또는 설명처럼 분석 가능한 텍스트가 하나 이상 존재한다.
- 섹션에 AI 디자인 생성 허용 설정이 있다.
- 관리자에게 등록된 Layout Variant가 하나 이상 있다.
- 이미지 생성 대상 Item이 하나 이상 있다.
- 동일 섹션에 진행 중인 생성 작업이 없다.

### 4.2 화면 상태

- `생성 가능`: 버튼 활성
- `분석 중`: 콘텐츠 분석 진행
- `레이아웃 생성 중`: Variant 선택 및 Layout Patch 생성
- `이미지 생성 중`: Backend 이미지 생성 작업 진행
- `미리보기 준비`: 결과 확인 가능
- `적용됨`: 현재 Snapshot에 반영됨
- `재생성 필요`: 적용 이후 콘텐츠가 변경됨
- `실패`: 원인과 재시도 버튼 표시

## 5. 관리자 설정

섹션 또는 템플릿 멤버십에 다음 설정을 추가한다.

```json
{
  "aiDesign": {
    "enabled": true,
    "allowedLayoutVariants": ["split-left", "split-right", "centered-hero"],
    "imageTargetItemKeys": ["heroImage"],
    "imageAspectRatio": "16:9",
    "layoutLocks": ["minHeight"],
    "contentLocks": ["title"]
  }
}
```

- `enabled`: 섹션 AI 디자인 생성 허용 여부
- `allowedLayoutVariants`: AI가 선택 가능한 사전 검증 레이아웃
- `imageTargetItemKeys`: 생성 이미지를 연결할 Item
- `imageAspectRatio`: 기본 생성 비율
- `layoutLocks`: AI와 사용자가 변경할 수 없는 레이아웃 속성
- `contentLocks`: AI가 수정하거나 이미지에 재해석할 수 없는 콘텐츠 속성

잠금 정책은 UI 제어뿐 아니라 요청 생성, AI 결과 검증, 최종 적용 단계에서 모두 강제한다.

## 6. 생성 계약

### 6.1 요청 Snapshot

```json
{
  "runId": "promo-run-id",
  "template": {
    "id": "template-id",
    "templateKey": "default-v1",
    "version": 2,
    "layoutRevision": 8
  },
  "section": {
    "sectionKey": "heroBanner",
    "sectionDefinitionRevision": "revision-hash",
    "sectionInputs": {
      "title": "Welcome Bonus",
      "description": "신규 가입자를 위한 프로모션",
      "cta": {
        "label": "참여하기",
        "link": "/join"
      },
      "heroImage": {
        "description": "프리미엄 프로모션 비주얼"
      }
    }
  },
  "constraints": {
    "allowedLayoutVariants": ["split-left", "split-right", "centered-hero"],
    "layoutLocks": ["minHeight"],
    "contentLocks": ["title"],
    "imageTargetItemKeys": ["heroImage"]
  },
  "inputHash": "sha256"
}
```

요청 시점의 콘텐츠, 템플릿 버전, 레이아웃 revision과 잠금 정책을 Snapshot으로 고정한다. 생성 도중 관리자가 템플릿을 변경해도 실행 중인 작업의 기준은 변경되지 않는다.

### 6.2 AI 레이아웃 결과

AI는 전체 `designSpec`이 아니라 허용된 속성만 포함한 Patch를 반환한다.

```json
{
  "layoutVariant": "split-right",
  "layoutPatch": {
    "sectionStyles": {
      "heroBanner": {
        "contentAlign": "left",
        "columns": "55:45"
      }
    },
    "itemStyles": {
      "heroBanner.heroImage": {
        "objectPosition": "center",
        "widthPct": 45
      }
    }
  },
  "imageRequests": [
    {
      "itemKey": "heroImage",
      "prompt": "...",
      "aspectRatio": "16:9",
      "safeArea": "left-copy"
    }
  ]
}
```

서버는 다음을 검증한 후에만 결과를 저장한다.

- Variant가 관리자 허용 목록에 포함되는가
- Patch 경로가 허용 목록에 포함되는가
- 잠긴 속성을 변경하지 않는가
- 숫자 범위와 enum 값이 Layout Schema에 맞는가
- 존재하는 Section/Item key만 참조하는가
- 이미지 요청 대상이 관리자 설정과 일치하는가

### 6.3 이미지 결과

```json
{
  "itemKey": "heroImage",
  "assetId": "asset-id",
  "storageKey": "section-ai/run-id/heroBanner/heroImage.webp",
  "mimeType": "image/webp",
  "width": 1536,
  "height": 864,
  "focalPoint": { "x": 0.65, "y": 0.5 },
  "safeArea": "left-copy",
  "promptVersion": 1
}
```

이미지에는 실제 제목, CTA 문구, 약관 문구를 합성하지 않는다. 브랜드 로고와 라이선스 마크는 생성 이미지가 아니라 승인된 Brand Asset을 사용한다.

## 7. 데이터 모델

신규 작업 테이블과 결과 테이블을 분리한다.

### 7.1 `promo_section_design_runs`

- `id`
- `promo_run_id`
- `template_id`
- `template_version`
- `layout_revision`
- `section_key`
- `status`
- `input_snapshot jsonb`
- `input_hash`
- `constraints_snapshot jsonb`
- `layout_result jsonb`
- `provider_snapshot jsonb`
- `usage_snapshot jsonb`
- `current_attempt`
- `lease_owner`
- `lease_expires_at`
- `heartbeat_at`
- `next_retry_at`
- `error_code`
- `error_message`
- `created_at`, `updated_at`, `completed_at`

### 7.2 `promo_section_design_assets`

- `id`
- `section_design_run_id`
- `item_key`
- `asset_id` 또는 기존 `promo_design_assets` 참조
- `prompt_snapshot jsonb`
- `focal_point jsonb`
- `safe_area`
- `created_at`

기존 `promo_design_assets`가 섹션과 Item 식별자를 안정적으로 저장할 수 있다면 신규 에셋 테이블 대신 기존 테이블을 확장한다.

## 8. API 설계

### 8.1 생성 요청

`POST /api/promo-section-design-runs`

- 서버가 현재 템플릿과 Section 정의를 다시 조회한다.
- 클라이언트가 전달한 잠금 정책을 신뢰하지 않는다.
- 동일한 `sectionKey + inputHash + templateVersion + layoutRevision`의 완료 결과가 있으면 재사용할 수 있다.
- 진행 중인 동일 요청은 중복 생성하지 않는다.
- DB 저장 성공 후 비동기 Backend 작업을 예약한다.
- 응답은 `202 Accepted`와 `runId`를 즉시 반환한다.

### 8.2 상태 및 결과 조회

`GET /api/promo-section-design-runs?runId={id}`

- 작업 상태
- 검증된 Layout Patch
- 이미지 에셋
- 오류 정보
- 입력 hash 일치 여부

### 8.3 결과 적용

`POST /api/promo-section-design-runs/{id}/apply`

- 현재 콘텐츠 hash와 생성 요청의 `inputHash`를 비교한다.
- 템플릿 버전 및 Layout revision을 다시 비교한다.
- 관리자 잠금 정책을 재적용한다.
- 검증된 Layout Patch와 이미지 asset 참조만 현재 Create Promo Snapshot에 반영한다.
- 관리자 기본 템플릿은 수정하지 않는다.

### 8.4 취소 및 재시도

- `POST /api/promo-section-design-runs/{id}/cancel`
- 재생성은 새로운 run을 생성하고 이전 run을 이력으로 보존한다.

## 9. Backend 비동기 작업 처리

```text
queued
  → analyzing_content
  → generating_layout
  → validating_layout
  → generating_assets
  → validating_assets
  → ready
```

실패 상태는 `failed`로 통합하되 `errorCode`로 단계를 구분한다.

- `INVALID_SECTION_CONTENT`
- `NO_ALLOWED_LAYOUT_VARIANT`
- `LAYOUT_SCHEMA_FAILED`
- `LOCKED_PROPERTY_VIOLATION`
- `IMAGE_GENERATION_FAILED`
- `IMAGE_VALIDATION_FAILED`
- `TEMPLATE_REVISION_MISMATCH`
- `CANCELLED`

레이아웃 생성과 이미지 생성은 Backend 내부의 독립된 작업 단계로 분리한다. 이미지 생성 실패 시 레이아웃 결과까지 폐기하지 않고 이미지 단계만 재시도할 수 있어야 한다.

### 9.1 실행 방식

일반 HTTP 요청에서 LLM과 이미지 생성 완료까지 대기하지 않는다.

```text
POST 생성 요청
  → DB run 생성(status=queued)
  → 비동기 실행 예약
  → 202 Accepted + runId 응답

Backend 작업 실행기
  → DB에서 실행 소유권 획득
  → 단계별 처리 및 상태 저장
  → 성공 또는 실패 종료

Frontend
  → GET 상태 조회 또는 향후 SSE 구독
```

1차 구현은 현재 배포 환경에서 지원되는 Backend 비동기 실행 수단을 사용한다. 실행시간 제한을 초과할 가능성이 있으면 레이아웃 생성과 이미지 생성을 서로 다른 job으로 나누고 DB 상태를 다음 job의 입력으로 사용한다.

### 9.2 동시성 및 재시도

- `runId`마다 한 실행기만 처리하도록 DB 기반 lease 또는 원자적 상태 전환을 사용한다.
- `queued → analyzing_content` 전환에 성공한 실행기만 모델을 호출한다.
- 단계별 `attempt`, `startedAt`, `heartbeatAt`, `nextRetryAt`을 저장한다.
- 네트워크 오류와 일시적 Provider 오류만 지수 backoff로 재시도한다.
- Schema 오류와 잠금 위반은 자동 재시도하지 않는다.
- 이미지 단계 재시도는 동일 레이아웃 결과를 재사용한다.
- 취소된 run은 다음 모델 호출 전에 반드시 중단한다.

### 9.3 Provider Adapter

Backend에 다음 인터페이스를 둔다.

```js
generateSectionLayout({ model, prompt, schema, input, signal })
generateSectionImage({ model, prompt, size, referenceAssets, signal })
```

Adapter 결과는 공통 응답으로 정규화한다.

- `provider`
- `model`
- `requestId`
- `promptVersion`
- `usage`
- `latencyMs`
- `result`
- `finishReason`

Provider 응답 원문은 민감정보 제거 후 장애 분석에 필요한 범위에서만 저장한다.

### 9.4 구조화된 LLM 출력

- Layout 결과는 JSON Schema 기반 구조화 출력을 사용한다.
- 자유 형식 Markdown이나 CSS 문자열을 Layout 결과로 인정하지 않는다.
- LLM 응답 파싱 후 Layout allowlist와 관리자 잠금 정책을 별도로 검증한다.
- Prompt 지시만으로 잠금을 보장하지 않고 결정론적 Backend 코드가 최종 통제한다.

### 9.5 비용 및 사용량

Run에 다음 항목을 기록한다.

- LLM 입력·출력 토큰
- LLM 호출 횟수
- 이미지 생성 횟수와 크기
- Provider 및 Model
- 단계별 실행시간
- 재시도 횟수
- 예상 또는 확정 비용

## 10. 프론트엔드 구성

섹션 카드 또는 Visual Editor의 선택된 Section 패널에 다음 UI를 추가한다.

- `AI 디자인 생성` 버튼
- 현재 상태와 진행 단계
- 생성 기준 콘텐츠 요약
- Before / AI Result 미리보기 전환
- `적용`, `재생성`, `취소`
- 관리자 고정 속성 표시
- 콘텐츠 변경 후 `재생성 필요` 경고

미리보기는 생성된 합성 이미지를 보여주는 대신 기존 Visual Editor Renderer에 다음 Snapshot을 전달한다.

- 원본 `sectionInputs`
- 관리자 기본 Layout
- 검증된 AI Layout Patch
- 생성 이미지 asset URL
- 관리자 잠금 정책

## 11. 기존 코드 연결 지점

- `prototype/create-promo.js`
  - 섹션별 생성 버튼과 상태 관리
  - 생성 요청 Snapshot 구성
  - 적용 결과를 `contentState.templateLayouts` 및 asset snapshot에 반영
- `prototype/visual-editor-assets/*`
  - 섹션 단위 AI 결과 미리보기
  - 생성 이미지 asset 렌더링
  - 잠금 속성 편집 비활성화
- `api/wizard-form-template-public.js`
  - 공개 가능한 AI 생성 설정과 잠금 정책 제공
- `api/_wizard-form-template-layout-store.js`
  - Layout Variant 및 Layout Patch 검증 확장
- `api/promo-design-assets.js`
  - 기존 에셋 저장 구조 재사용 가능성 검토
- 신규 Section Design Run API 및 Store
- 신규 DB migration
- Backend Section Design 작업 실행기와 LLM/Image Provider Adapter 추가
- 배포 환경의 비동기 실행 또는 Queue 설정 추가

Production Visual Editor 번들은 원본 소스 수정 후 정식 빌드 절차로 재생성한다. 번들 파일을 직접 수정하지 않는다.

## 12. 잠금 및 우선순위 규칙

최종 결과 병합 우선순위는 다음과 같다.

```text
관리자 잠금 값
  > 관리자 기본 Layout 필수값
  > 검증된 AI Layout Patch
  > 사용자 편집값
  > Renderer fallback
```

AI 결과가 관리자 잠금 속성을 포함하면 해당 필드는 무시하는 것이 아니라 작업 전체를 검증 실패로 처리한다. 그래야 Prompt 또는 계약 오류를 조기에 발견할 수 있다.

## 13. 캐시 및 노후화 정책

- 콘텐츠, 템플릿 버전, Layout revision, Section 정의 revision으로 `inputHash`를 만든다.
- 콘텐츠가 변경되면 적용된 결과를 즉시 삭제하지 않고 `stale`로 표시한다.
- 사용자는 기존 결과 유지 또는 재생성을 선택할 수 있다.
- 관리자가 잠금 정책을 변경한 경우 기존 결과는 자동으로 적용 해제하고 재검증한다.
- 동일 입력의 성공 결과는 비용 절감을 위해 재사용 가능하되 사용자가 명시적으로 재생성을 요청하면 새 run을 만든다.

## 14. 보안 및 안정성

- 클라이언트가 전달한 Layout Patch와 잠금 정보를 신뢰하지 않는다.
- API에서 관리자 템플릿 원본과 잠금 정책을 다시 조회한다.
- AI 응답의 자유 형식 CSS, HTML, JavaScript를 허용하지 않는다.
- 이미지 MIME, 크기, 픽셀 수 및 저장 성공 여부를 검증한다.
- 외부 이미지 URL을 최종 Snapshot에 직접 저장하지 않고 관리되는 에셋 저장소로 복사한다.
- 생성 요청에 사용자 입력 전체를 무조건 전달하지 않고 대상 섹션 콘텐츠만 최소화한다.
- 생성 버튼 연타 및 Backend 작업 중복 실행을 idempotency key로 차단한다.
- 모델 API Key와 Provider 인증정보는 서버 환경변수에서만 읽는다.
- API 응답과 로그에 Prompt 내부 개인정보 또는 인증정보를 노출하지 않는다.
- 사용자 및 프로젝트별 생성 요청 rate limit과 동시 실행 제한을 적용한다.

## 15. 테스트 계획

### 15.1 단위 테스트

- 버튼 활성 조건
- 입력 hash 생성
- Layout Patch allowlist 검증
- 잠금 속성 위반 검출
- Layout Schema 숫자 범위와 enum 검증
- 이미지 Target Item 검증
- stale 판정
- 동일 요청 중복 방지

### 15.2 API 통합 테스트

- 정상 생성 요청과 상태 전환
- 존재하지 않는 Section 요청 거부
- 비활성 Template 요청 거부
- 허용되지 않은 Variant 거부
- 잠긴 속성 Patch 거부
- Backend 이미지 생성 단계 실패 후 부분 재시도
- 동일 run의 중복 실행 방지
- 실행 lease 만료 후 안전한 복구
- Provider rate limit과 timeout 처리
- 콘텐츠 변경 후 적용 거부
- 템플릿 revision 변경 후 적용 거부

### 15.3 브라우저 E2E

1. Hero 콘텐츠 등록
2. `AI 디자인 생성` 버튼 활성 확인
3. 진행 상태 표시 확인
4. 생성된 레이아웃과 이미지 미리보기
5. 적용 후 Visual Editor와 Web Output 동일성 확인
6. 콘텐츠 변경 후 `재생성 필요` 표시 확인
7. 잠긴 콘텐츠와 레이아웃이 변경되지 않는지 확인
8. 재생성 후 이전 결과 이력 유지 확인

### 15.4 반응형 및 접근성

- Desktop / Mobile에서 텍스트와 이미지 겹침 없음
- 이미지 focal point 및 safe area 적용
- 생성 상태를 `aria-live`로 전달
- 키보드로 생성, 적용, 재생성 가능
- 이미지 alt는 등록 콘텐츠 또는 관리자 정책에서 생성하고 검수 가능

## 16. 단계별 개발 순서

### Phase 1. 계약 및 저장 구조

- 관리자 AI 생성 설정 Schema 확정
- Layout Variant Schema 확정
- Run 및 Asset DB migration
- Layout Patch validator와 잠금 validator 구현

### Phase 2. API 및 Backend 실행기

- Section Design Run 생성/조회/적용/취소 API
- LLM 및 Image Provider Adapter
- 콘텐츠 분석 및 Layout Variant 선택 작업
- Backend 이미지 생성 작업
- DB 기반 실행 소유권, 재시도 및 취소 처리
- 상태, 재시도, 오류 저장

### Phase 3. Create Promo 및 Visual Editor

- 섹션별 생성 UI
- polling 및 상태 표시
- 실제 Renderer 미리보기
- 적용, 재생성, stale 처리
- Web Output Snapshot 연결

### Phase 4. 검증 및 운영 준비

- 단위/API/E2E 테스트
- 비용과 실행시간 로깅
- 실패율 및 재시도율 모니터링
- Hero, Content CTA, Image Text Row 운영 시나리오 검수

## 17. 완료 조건

- 저장된 섹션 콘텐츠로만 AI 디자인 생성 요청이 시작된다.
- AI는 관리자 허용 Layout Variant와 속성 범위를 벗어나지 않는다.
- 관련 이미지가 지정된 Item에만 생성되고 연결된다.
- 텍스트와 CTA가 이미지에 합성되지 않고 실제 DOM으로 유지된다.
- 실제 Renderer 미리보기와 Web Output 결과가 동일하다.
- 관리자 잠금 콘텐츠와 레이아웃은 AI 및 사용자 변경으로부터 보호된다.
- 콘텐츠 또는 템플릿 revision 변경 시 오래된 결과가 자동 감지된다.
- 실패한 이미지 단계만 재시도할 수 있다.
- 생성 요청, 결과, 에셋, 오류 및 적용 이력이 추적 가능하다.

## 18. 주요 이슈 및 결정 필요 사항

개발 착수 전에 다음을 확정해야 한다.

1. 1차 지원 섹션을 Hero, Content CTA, Image Text Row로 확정할지
2. 섹션당 Layout Variant 개수와 관리자 등록 UI 범위
3. 섹션당 생성 이미지 수를 1개로 제한할지
4. Layout 생성 LLM과 이미지 생성 모델 선정
5. 기존 `promo_design_assets` 확장 또는 신규 에셋 테이블 사용 여부
6. 적용 전 사용자 확인을 필수로 할지
7. 동일 입력 결과 캐시 재사용 기간과 명시적 재생성 비용 정책
8. 현재 Vercel 배포 환경에서 사용할 비동기 실행 방식 또는 Queue 선정
9. 모델별 timeout, 최대 재시도 및 동시 실행 제한

권장 기본 결정은 `3개 대상 섹션`, `섹션당 이미지 1개`, `관리자 Variant 선택형`, `사용자 확인 후 적용`, `기존 에셋 저장 구조 확장 우선 검토`, `Backend 직접 모델 호출`, `DB 상태 기반 비동기 실행`이다.

## 19. 1차 구현 반영 상태

- Backend Section Design Run 생성·조회 API 구현
- Backend 직접 LLM 구조화 출력 호출 구현
- Backend 직접 이미지 생성 호출 및 Vercel Blob 저장 구현
- Layout allowlist, 잠금 및 이미지 대상 검증 구현
- 결과 적용 시 현재 섹션 콘텐츠 서버 재검증 구현
- Create Promo 템플릿 레이아웃 화면에 섹션별 생성·미리보기·적용 UI 구현
- 입력 변경 시 stale 표시 구현
- Run 및 결과 저장 migration 작성
- 계약 테스트와 기존 Create Promo 회귀 테스트 추가

운영 반영 전 `025_promo_section_design_runs.sql` migration 적용과 다음 환경변수 설정이 필요하다.

- Layout LLM: `OPENAI_API_KEY`, 선택적 `SECTION_LAYOUT_MODEL`
- Image Provider: `SECTION_IMAGE_PROVIDER=gemini`, `GEMINI_API_KEY`, `SECTION_IMAGE_MODEL=gemini-3.1-flash-image`
- Image 옵션: 선택적 `SECTION_IMAGE_SIZE=2K`, `SECTION_IMAGE_TIMEOUT_MS`
- Asset 저장: `BLOB_READ_WRITE_TOKEN`

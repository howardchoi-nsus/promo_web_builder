# 섹션 AI 이미지 생성·렌더링 정책 통합 개발계획서

## 0. 문서 정보

- 작성일: 2026-07-26
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: P0~P4 개발 반영 완료 · P5 운영 전환 대기
- 대상 관리자 메뉴: `설정 > LLM 및 프롬프트 관리`
- 기준 Prompt:
  - `section_background_image`
  - `component_image`
- 연관 계획서:
  - `admin-llm-prompt-control-plane-development-plan-2026-07-25.md`
- 명시적 제외 범위:
  - 디자인 생성기
  - `integrated_brief`
  - `image_execution`
  - `lofi_draft`
  - `final_design`
  - n8n Workflow

### 0.1 재검토 반영사항

2026-07-26 재검토에서 다음을 설계 기준으로 확정했다.

1. `requestedTier`, `quality`, `outputMimeType`는 `generationPolicy`만 권위값으로 사용
2. `runtimeConfig`는 Timeout과 Retry만 소유
3. `modelOptions`는 Provider 전용 파생 옵션만 소유하며 공통 정책을 중복 저장하지 않음
4. 기존 활성 Prompt Version을 Backfill로 직접 수정하지 않음
5. V3 설정은 기존 활성 Version에서 새 Draft Version을 생성해 저장
6. 기존 프로모션은 저장 당시 Render Policy를 유지하며 활성 정책 변경을 소급 적용하지 않음
7. 브라우저가 전달하는 섹션 크기는 서버 검증과 정규화를 거쳐 사용
8. 1차 반응형 범위는 단일 이미지와 Focal Point이며 Viewport별 다중 Asset은 후속 범위

### 0.2 개발 반영 상태

2026-07-26 기준 다음 항목을 소스에 반영했다.

- Execution Snapshot V3의 `generationPolicy`, `renderPolicy`, `validationPolicy`
- 가로형 2K 이미지의 실제 Width 2048px 미만 거부
- Target Geometry 정규화와 Provider 지원 비율 선택
- `cover`, `contain`, `width-fill` 공통 렌더링
- Render Policy와 실제 이미지 메타데이터를 Asset Result 및 디자인 스냅샷에 저장
- 관리자 `LLM 및 프롬프트 관리`의 V3 정책 JSON 편집
- 활성 V2를 수정하지 않고 V3 Draft를 생성하는 Migration `036`
- V2 실행 호환성과 기존 프로모션의 저장된 스타일 유지

운영 전환은 `036_section_ai_image_policy_v3_drafts.sql` 적용 후 생성된 Draft를
검증·활성화해야 완료된다. Migration은 활성 Prompt를 자동 변경하거나 활성화하지 않는다.

---

## 1. 목적

섹션 배경 및 컴포넌트 이미지 생성 과정에서 발생하는 크기, 종횡비, 여백,
테두리, 크롭, 페이드, 정렬 문제를 매번 소스코드 수정으로 해결하지 않고
관리자 정책으로 조정할 수 있게 한다.

관리자는 한 화면에서 다음 항목을 관리한다.

1. Prompt와 Harness
2. 이미지 생성 정책
3. 이미지 적용·렌더링 정책
4. 이미지 검증 정책
5. 실패 및 재시도 정책

서버는 관리자가 선택할 수 있는 값의 범위와 안전성만 강제한다.

---

## 2. 현행 문제

### 2.1 `contain` 하드코딩

섹션 배경 이미지 적용 시 다음 값이 코드에 고정되어 있다.

```text
backgroundSize: contain
backgroundPosition: center center
backgroundRepeat: no-repeat
```

관련 위치:

- `prototype/create-promo.js`
- `visual-editor/src/PromoPageRenderer.vue`
- `api/promo-section-design-runs.js`

이미지와 섹션의 종횡비가 다르면 `contain`은 이미지를 축소한다. 남은 영역에는
섹션 배경색이 표시되어 두꺼운 테두리나 프레임처럼 보인다.

### 2.2 2K 검증 기준이 느슨함

현재 2K는 긴 변이 `1800px` 이상이면 통과한다.

따라서 가로 `1920px` 이미지도 2K 결과로 인정될 수 있다. 사용자가 기대하는
“가로 2K 이상”과 서버 검증 기준이 다르다.

### 2.3 생성 정책과 렌더링 정책 혼합

현재 다음 값이 여러 계층에 흩어져 있다.

- Prompt 본문
- Harness Config
- Provider 옵션
- Create Promo 적용 코드
- Visual Editor 렌더러
- Section Style

Prompt를 수정해도 CSS의 `contain`은 바뀌지 않으며, CSS를 수정해도 이미지
자체에 포함된 프레임은 제거되지 않는다.

### 2.4 비율 정책 부재

섹션 배경은 기본 `16:9`, 컴포넌트 이미지는 기본 `1:1`을 사용한다.

하지만 실제 섹션은 다음 요인으로 비율이 달라진다.

- 섹션 높이
- 데스크톱·모바일 Viewport
- 콘텐츠 길이
- 사용자의 섹션 크기 조절
- 템플릿 Layout

고정 비율 이미지를 `contain`으로 적용하면 여백이 생기고, `cover`로 적용하면
주요 피사체가 잘릴 수 있다.

### 2.5 Provider별 크기 의미 차이

`2K`는 Provider와 모델에 따라 정확한 픽셀 규격이 다를 수 있다.

- OpenAI: 지원하는 고정 Size 선택
- Gemini: Image Tier와 Aspect Ratio 조합
- 모델 변경: 동일 Tier의 실제 결과 크기 변경 가능

따라서 단순히 “2K 요청을 보냈다”는 사실만으로 결과 품질을 보장할 수 없다.

### 2.6 페이드 정책 하드코딩

페이드 방향과 강도별 Gradient Stop이 렌더러 코드에 고정되어 있다.

관리자가 Prompt에서 페이드를 제거해도 브라우저 렌더러 정책은 별도로 남는다.

---

## 3. 핵심 설계 원칙

### 3.1 Prompt와 렌더링 정책 분리

| 구분 | 담당 |
|---|---|
| 이미지 내용·구도 | Prompt/Harness |
| Provider 요청 크기·형식 | Generation Policy |
| 실제 픽셀 검증 | Validation Policy |
| `contain/cover/width-fill` | Render Policy |
| 페이드 Gradient | Render Policy |
| 허용값·안전성 | 서버 코드 |

### 3.2 하나의 Prompt Version으로 원자적 관리

`prompt_templates`의 활성 Version 한 행이 다음 설정을 모두 소유한다.

```text
Prompt Body
+ Harness Config
+ Generation Policy
+ Render Policy
+ Validation Policy
+ Runtime/Retry Policy
= Section AI Image Policy Release
```

Prompt만 활성화되고 렌더링 정책은 이전 값이 남는 부분 활성화를 허용하지 않는다.

### 3.3 실행 Snapshot 고정

이미지 생성 시작 시 활성 Prompt Version의 전체 정책을 Run Snapshot에 저장한다.

재시도와 적용 단계에서는 현재 활성 설정을 다시 읽지 않고 최초 Snapshot을
사용한다.

이미 생성·저장된 프로모션도 현재 활성 Prompt Version을 다시 읽지 않는다.
Render Policy는 이미지 적용 시 `designSpec.sectionStyles`에 Effective 값으로
저장한다. 관리자 정책 변경은 신규 생성 또는 사용자가 명시적으로 재적용한
이미지에만 반영한다.

### 3.4 관리자 설정과 사용자 선택의 역할 분리

관리자는 허용 범위와 기본값을 결정한다.

사용자는 프로모션 빌더에서 관리자가 허용한 값 안에서 다음을 선택할 수 있다.

- 페이드 사용 여부
- 배경 정렬
- 허용된 Fit Mode
- 이미지 생성 여부

### 3.5 디자인 생성기 격리

이번 변경은 섹션 AI 이미지 경로에만 적용한다. 디자인 생성기의 Prompt,
Snapshot, Worker Payload, 이미지 검증 규칙은 변경하지 않는다.

### 3.6 단일 권위값

동일한 설정을 여러 JSON 위치에 저장하지 않는다.

| 설정 | 권위 위치 |
|---|---|
| Tier/Size 의미 | `generationPolicy.requestedTier` |
| Quality | `generationPolicy.quality` |
| Output MIME | `generationPolicy.outputMimeType` |
| Aspect Ratio 전략 | `generationPolicy.aspectRatioStrategy` |
| Timeout/Retry | `runtimeConfig` |
| Fit/Position/Fade | `renderPolicy` |
| 해상도·MIME 검증 | `validationPolicy` |
| Provider 고유 기능 | `modelOptions` |

Provider Adapter가 공통 정책을 Provider Payload로 변환한다. 변환 결과는
`effectiveProviderOptions`로 Snapshot에 저장하지만 관리자 입력 원천으로 다시
사용하지 않는다.

---

## 4. 설정 저장 구조

신규 테이블은 만들지 않는다.

기존 Prompt Version의 `model_options`에 다음 예약 Key를 추가한다.

```json
{
  "executionSnapshotVersion": 3,
  "policySchemaVersion": 1,
  "harnessConfig": {},
  "runtimeConfig": {},
  "modelCapabilitySnapshot": {},
  "safetyContract": {},
  "generationPolicy": {},
  "renderPolicy": {},
  "validationPolicy": {}
}
```

V3 Draft 저장 시 다음 중복 Key를 `modelOptions`와 `runtimeConfig`에서 제거한다.

```text
imageSize
image_size
quality
outputMimeType
output_mime_type
```

V2 실행 호환 시에는 기존 Key를 읽어 V3 정책으로 정규화하되, 새 V3 Draft에는
다시 저장하지 않는다.

이 구조는 기존 기능을 그대로 재사용한다.

- Prompt Draft
- Prompt 검증
- Prompt 활성화
- Prompt 롤백
- Prompt History
- `previous_model_options`
- `new_model_options`

---

## 5. Generation Policy

### 5.1 예시

```json
{
  "requestedTier": "2K",
  "aspectRatioStrategy": "section",
  "fixedAspectRatio": "16:9",
  "fallbackAspectRatio": "16:9",
  "quality": "medium",
  "outputMimeType": "image/jpeg",
  "backgroundColorStrategy": "section",
  "subjectScale": {
    "minimumPercent": 55,
    "maximumPercent": 75
  }
}
```

### 5.2 `aspectRatioStrategy`

허용값:

- `fixed`
  - 관리자가 선택한 고정 비율 사용
- `section`
  - 생성 요청 시점의 섹션 가로·세로 비율 사용
- `nearest-supported`
  - 섹션 비율과 가장 가까운 Provider 지원 비율 선택
- `target`
  - 컴포넌트 필드의 이미지 비율 사용

### 5.3 섹션 비율 계산

섹션 배경 요청 시 다음 정보를 함께 전달한다.

```json
{
  "sectionWidth": 1280,
  "sectionHeight": 520,
  "sectionAspectRatio": 2.4615,
  "viewport": "desktop"
}
```

Provider가 임의 비율을 지원하지 않으면 Capability Snapshot의 지원 비율 중
가장 가까운 값을 사용한다.

브라우저가 전달한 `sectionWidth`, `sectionHeight`를 그대로 신뢰하지 않는다.

서버 정규화 규칙:

- Width: `320~3840px`
- Height: `120~2160px`
- 비정상 수치, `NaN`, 음수 거부
- 요청 Template/Section/Layout Revision과 일치 확인
- Width/Height가 없으면 Template의 Canonical Geometry 사용
- 브라우저 값과 Canonical Geometry 차이가 허용 범위를 넘으면 Warning 기록

Snapshot에는 원본과 정규화 결과를 구분해 저장한다.

```json
{
  "sourceGeometry": {
    "width": 1278.4,
    "height": 518.2,
    "viewport": "desktop"
  },
  "effectiveGeometry": {
    "width": 1280,
    "height": 520,
    "source": "template-layout"
  }
}
```

선택 결과는 Snapshot에 저장한다.

```json
{
  "requestedAspectRatio": "section",
  "effectiveAspectRatio": "16:9",
  "selectionReason": "nearest-supported"
}
```

### 5.4 Provider Adapter

공통 정책을 Provider 요청 형식으로 변환한다.

```text
Generation Policy
  ├─ OpenAI Adapter
  └─ Gemini Adapter
```

Provider Adapter가 결정할 항목:

- Model
- Size/Image Tier
- Aspect Ratio
- Quality
- Output MIME
- Timeout

Provider 환경변수는 V1 호환 기간에만 fallback으로 사용한다. V3 Snapshot은
활성 Prompt Version 설정이 누락되면 검증 단계에서 차단한다.

### 5.5 반응형 이미지 범위

1차 구현:

- Desktop 기준 단일 이미지 생성
- `focalPoint`로 Tablet/Mobile 크롭 위치 보정
- 모든 Viewport에서 동일 Asset URL 사용

후속 구현:

- Desktop/Tablet/Mobile별 Asset Variant
- `<picture>` 또는 Viewport별 CSS Asset 선택
- Variant별 비용·재시도·적용 상태 관리

1차 완료 조건에 Viewport별 다중 이미지 생성을 포함하지 않는다.

---

## 6. Render Policy

### 6.1 예시

```json
{
  "sectionBackground": {
    "fitMode": "cover",
    "allowedFitModes": ["cover", "contain", "width-fill"],
    "position": "center center",
    "repeat": "no-repeat",
    "focalPoint": {
      "x": 50,
      "y": 50
    }
  },
  "componentImage": {
    "fitMode": "contain",
    "allowedFitModes": ["contain", "cover"],
    "position": "center center",
    "transparentFrame": true
  },
  "fade": {
    "allowedModes": ["none", "left", "right", "both"],
    "defaultMode": "none",
    "defaultStrength": "medium",
    "stops": {
      "soft": { "solid": 8, "clear": 38, "edge": 18 },
      "medium": { "solid": 14, "clear": 48, "edge": 24 },
      "strong": { "solid": 22, "clear": 62, "edge": 32 }
    }
  }
}
```

### 6.2 Fit Mode

#### `contain`

- 이미지 전체 표시
- 종횡비가 다르면 빈 영역 발생
- 섹션 배경에는 테두리처럼 보일 수 있음

#### `cover`

- 섹션 전체 채움
- 빈 영역 없음
- 이미지 일부 크롭 가능

#### `width-fill`

- 가로 폭 100% 우선
- 세로는 비율에 따라 자동 계산
- 섹션 영역 밖은 잘림
- 가로 배경에 적합
- 이미지 높이가 섹션보다 작으면 위·아래 빈 영역이 생길 수 있음
- “빈 영역 없음”을 보장하는 Mode가 아니므로 UI에 Warning 표시

### 6.3 충돌 검증

다음 조합은 저장 또는 활성화 시 Warning을 표시한다.

```text
fitMode = contain
+ noFrame = true
+ 이미지 비율과 섹션 비율 불일치
= 빈 배경 영역 발생 가능
```

관리자는 Warning을 확인하고 활성화할 수 있지만, 예상 결과가 UI에 표시되어야 한다.

### 6.4 정책 우선순위

```text
사용자 Section Style Override
> Template Section Policy
> 활성 Prompt Version Render Policy
> 서버 안전 기본값
```

단, 사용자 Override는 `allowedFitModes`, `allowedModes` 범위를 벗어날 수 없다.

최종 적용값은 현재 활성 정책을 렌더링할 때마다 조회하지 않는다.

```json
{
  "backgroundSize": "cover",
  "backgroundPosition": "50% 50%",
  "backgroundRepeat": "no-repeat",
  "backgroundFadeMode": "none",
  "policySource": {
    "promptId": "uuid",
    "promptVersion": 15,
    "snapshotVersion": 3
  }
}
```

이 값이 프로모션의 `designSpec.sectionStyles`에 저장되므로 이후 관리자 기본값이
바뀌어도 기존 프로모션 출력은 변경되지 않는다.

---

## 7. Validation Policy

### 7.1 예시

```json
{
  "rejectUnreadableMetadata": true,
  "rejectMimeMismatch": true,
  "rejectLowResolution": true,
  "resolutionRules": {
    "1K": {
      "minimumLandscapeWidth": 1024,
      "minimumPortraitHeight": 1024,
      "minimumSquareSide": 1024
    },
    "2K": {
      "minimumLandscapeWidth": 2048,
      "minimumPortraitHeight": 2048,
      "minimumSquareSide": 2048
    },
    "4K": {
      "minimumLandscapeWidth": 3840,
      "minimumPortraitHeight": 3840,
      "minimumSquareSide": 3840
    }
  },
  "aspectRatioTolerancePercent": 8,
  "minimumByteLength": 1024,
  "edgeFrameDetection": {
    "enabled": false,
    "uniformEdgeThreshold": 0.92,
    "minimumBandPercent": 4
  }
}
```

### 7.2 해상도 검증

긴 변 하나만 검사하지 않는다.

이미지 방향은 실제 결과가 아니라 `effectiveAspectRatio`로 먼저 결정한다.
Provider가 반대 방향 이미지를 반환하면 해상도 검사 전에
`IMAGE_ASPECT_RATIO_MISMATCH`로 거부한다.

가로 이미지:

```text
actualWidth >= minimumLandscapeWidth
```

세로 이미지:

```text
actualHeight >= minimumPortraitHeight
```

정사각 이미지:

```text
min(actualWidth, actualHeight) >= minimumSquareSide
```

### 7.3 실제 바이트 기준

다음 값은 Provider 예상값이 아니라 반환된 이미지 바이트에서 판독한다.

- MIME Signature
- Width
- Height
- Byte Length
- Alpha 포함 여부

저장할 Result Snapshot:

```json
{
  "requested": {
    "tier": "2K",
    "aspectRatio": "16:9",
    "mimeType": "image/jpeg"
  },
  "actual": {
    "width": 2752,
    "height": 1536,
    "aspectRatio": 1.7917,
    "mimeType": "image/jpeg",
    "byteLength": 1482043
  },
  "validation": {
    "passed": true,
    "warnings": []
  }
}
```

### 7.4 이미지 내부 프레임 감지

Prompt만으로 이미지 내부 프레임 생성을 완전히 방지할 수 없다.

2차 기능으로 다음 검사를 검토한다.

- 이미지 가장자리 색상 샘플링
- 균일한 단색 Band 폭 측정
- 투명 Edge 탐지
- 섹션 배경색과 Edge 색상 비교

오탐 가능성이 있으므로 초기 기본값은 `disabled`로 한다.

이 기능은 이미지 픽셀 디코더와 별도의 성능 검증이 필요하므로 P0~P4 필수
완료 범위에서 제외하고 후속 품질 기능으로 분리한다. 초기 버전은 Prompt/Harness,
Fit Mode, 실제 크기·비율 검증까지만 제공한다.

---

## 8. Retry Policy

기존 `runtimeConfig`를 확장한다.

```json
{
  "timeoutMs": 240000,
  "maxAttempts": 3,
  "retryBaseMs": 15000,
  "retryMaxMs": 75000,
  "retryOn": [
    "PROVIDER_TIMEOUT",
    "EMPTY_IMAGE_RESULT",
    "IMAGE_RESOLUTION_BELOW_REQUEST",
    "IMAGE_ASPECT_RATIO_MISMATCH",
    "IMAGE_MIME_MISMATCH"
  ],
  "promptEscalation": {
    "enabled": true,
    "appendFailureGuidance": true
  }
}
```

재시도 시 유지:

- Prompt Version
- Provider/Model
- Generation Policy
- Render Policy
- Validation Policy
- 사용자 콘텐츠

재시도 시 변경 가능:

- Attempt 번호
- 이전 실패 사유를 반영한 허용된 Harness 추가 문장

현재 활성 Prompt를 다시 읽어서는 안 된다.

재시도 실패 처리:

- 검증 실패 이미지는 Blob에 최종 Asset으로 저장하지 않음
- 기존 정상 배경 이미지를 덮어쓰지 않음
- 모든 Attempt 실패 시 이전 정상 이미지 유지
- UI에는 마지막 오류와 요청/실제 크기를 표시

---

## 9. Execution Snapshot V3

```json
{
  "snapshotVersion": 3,
  "policySchemaVersion": 1,
  "promptConfig": {
    "promptId": "uuid",
    "promptType": "section_background_image",
    "promptVersion": 15,
    "provider": "google",
    "model": "gemini-3.1-flash-image",
    "modelOptions": {},
    "harnessConfig": {},
    "runtimeConfig": {},
    "generationPolicy": {},
    "renderPolicy": {},
    "validationPolicy": {},
    "modelCapabilitySnapshot": {},
    "safetyContract": {},
    "sourceGeometry": {},
    "effectiveGeometry": {},
    "effectiveProviderOptions": {
      "imageSize": "2K",
      "aspectRatio": "16:9",
      "mimeType": "image/jpeg"
    },
    "renderedPrompt": "...",
    "renderedPromptHash": "sha256"
  }
}
```

Asset Job에는 전체 정책을 다시 복사하기보다 다음을 저장한다.

- Run Snapshot Hash
- Target
- Effective Aspect Ratio
- Effective Provider Options
- 최초 요청 Prompt Hash

---

## 10. 관리자 UI

### 10.1 화면 구조

```text
LLM 및 프롬프트 관리
  └─ 섹션 배경 이미지 / 컴포넌트 이미지
      ├─ Prompt 및 Harness
      ├─ 이미지 생성 정책
      ├─ 이미지 적용 정책
      ├─ 검증 및 재시도 정책
      ├─ Effective 설정
      └─ 변경 이력
```

### 10.2 이미지 생성 정책 UI

- 이미지 크기
- 품질
- 파일 형식
- 비율 결정 방식
- 고정 비율
- 배경색 전달 방식
- 피사체 최소·최대 점유 비율

### 10.3 이미지 적용 정책 UI

- 기본 Fit Mode
- 사용자 선택 허용 Fit Mode
- 기본 정렬
- Repeat
- 초점 X/Y
- 기본 페이드
- 허용 페이드
- 강도별 Gradient Stop

### 10.4 검증 UI

- 가로 1K/2K/4K 최소 Width
- 세로 최소 Height
- 정사각 최소 Side
- 종횡비 허용 오차
- MIME 불일치 거부
- 메타데이터 판독 실패 거부
- 내부 프레임 탐지

### 10.5 Effective 설정

실제 실행 전 다음을 표시한다.

```text
Provider: Google
Model: gemini-3.1-flash-image
Requested Tier: 2K
Requested Ratio: section
Effective Ratio: 16:9
Minimum Width: 2048px
Fit Mode: cover
Position: center center
Fade: none
Max Attempts: 3
```

API Key, DB URL, Blob Token은 표시하지 않는다.

### 10.6 JSON 편집

일반 사용자는 Typed Field를 사용한다.

Raw JSON은 다음 조건으로 제한한다.

- 고급 설정 Accordion
- Draft에서만 수정
- JSON Schema 검증
- 저장 전 Typed Preview 표시

### 10.7 API 변경

기존 Prompt Lifecycle API를 확장한다.

```text
GET  /api/prompt-template
PATCH /api/prompt-template
POST /api/prompt-template-draft
POST /api/prompt-template-validate
POST /api/prompt-template-activate
POST /api/prompt-template-rollback
```

추가 응답 필드:

- `policySchemaVersion`
- `generationPolicy`
- `renderPolicy`
- `validationPolicy`
- `effectivePolicyWarnings`

별도 Policy 저장 API를 만들지 않는다. Prompt와 정책이 같은 Version에서
검증·활성화되어야 하기 때문이다.

섹션 이미지 실행 API는 다음 Context를 추가로 받는다.

```json
{
  "targetGeometry": {
    "width": 1280,
    "height": 520,
    "viewport": "desktop"
  },
  "renderOverrides": {
    "fitMode": "cover",
    "position": "center center",
    "fadeMode": "none"
  }
}
```

서버는 Template Revision과 관리자 Allowlist를 다시 검증한다.

### 10.8 관리자 접근 제어

현재 프로젝트의 관리자 공통 인증 경계를 그대로 사용한다. Prompt 정책만 별도
임시 Token으로 보호하지 않는다. 정식 관리자 Session/Role이 도입되면 다음 권한을
공통 Guard에 연결한다.

- `llm-config:read`
- `llm-config:write`
- `llm-config:activate`

---

## 11. 프로모션 빌더 UI

관리자가 허용한 범위만 노출한다.

섹션 속성:

- 배경 Fit
- 배경 정렬
- 페이드 방향
- 페이드 강도
- 배경 삭제
- AI 배경 재생성

관리자 정책이 한 값만 허용하면 해당 UI는 숨기거나 읽기 전용으로 표시한다.

예:

```text
allowedFitModes = ["cover"]
```

이면 사용자는 Fit Mode를 변경할 수 없다.

---

## 12. 공통 실행 흐름

```text
1. 활성 Prompt Version 조회
2. Prompt/Harness/Policy Snapshot 생성
3. 섹션 실제 크기와 Target 정보 수집
4. Generation Policy 해석
5. Provider Capability와 교차 검증
6. Effective Provider 요청 생성
7. 이미지 생성
8. 실제 메타데이터 판독
9. Validation Policy 실행
10. 실패 시 최초 Snapshot 기반 재시도
11. Blob 저장
12. Render Policy를 Layout Patch에 포함
13. Apply 시 Snapshot/Revision 재검증
14. Visual Editor와 Web Output에서 동일 렌더러 사용
```

---

## 13. 서버에 유지할 안전 코드

다음은 관리자 Prompt나 JSON으로 대체하지 않는다.

- Provider 허용 목록
- Model/Provider 조합 검증
- JSON Object Type 검증
- 숫자 범위 상한
- MIME Signature 판독
- Width/Height 판독
- URL/Blob 접근 정책
- CSS Property Allowlist
- Fit Mode Allowlist
- Fade Mode Allowlist
- Snapshot Hash
- Revision 검증
- 잠금 정책

관리자는 안전 범위 안의 값만 선택한다.

---

## 14. V3 Draft 생성 Migration

신규 컬럼은 필요하지 않다.

제안 Migration:

```text
036_section_ai_image_policy_v3_drafts.sql
```

기존 활성 Prompt Version의 `model_options`를 직접 수정하지 않는다. 활성 Version은
이미 실행된 Run과 변경 이력의 기준이므로 불변으로 유지한다.

Migration은 `section_background_image`, `component_image` Lineage별로 다음을
수행한다.

1. 현재 활성 Version 조회
2. 이미 Draft/Validated Candidate가 있는지 확인
3. Candidate가 있으면 자동 생성하지 않고 검토 대상 목록에 기록
4. Candidate가 없으면 활성 Version을 복제해 `version + 1` Draft 생성
5. V2 설정을 V3 단일 권위 구조로 정규화
6. 신규 정책 기본값 저장
7. `prompt_template_histories`에 Draft 생성 이력 기록
8. 자동 활성화하지 않음

새 Draft에 저장할 예약 Key:

```json
{
  "executionSnapshotVersion": 3,
  "policySchemaVersion": 1,
  "generationPolicy": {},
  "renderPolicy": {},
  "validationPolicy": {}
}
```

V2 변환:

- `modelOptions.imageSize` → `generationPolicy.requestedTier`
- `modelOptions.quality` → `generationPolicy.quality`
- `runtimeConfig.outputMimeType` → `generationPolicy.outputMimeType`
- 변환 후 V3 `modelOptions`와 `runtimeConfig`에서 중복 Key 제거

관리자가 새 Draft를 검토·검증·활성화하기 전까지 기존 V2 활성 Version이 계속
사용된다.

권장 기본값:

### `section_background_image`

```json
{
  "generationPolicy": {
    "requestedTier": "2K",
    "aspectRatioStrategy": "nearest-supported",
    "fallbackAspectRatio": "16:9",
    "quality": "medium",
    "outputMimeType": "image/jpeg"
  },
  "renderPolicy": {
    "sectionBackground": {
      "fitMode": "cover",
      "allowedFitModes": ["cover", "contain", "width-fill"],
      "position": "center center",
      "repeat": "no-repeat"
    }
  },
  "validationPolicy": {
    "rejectLowResolution": true,
    "resolutionRules": {
      "2K": {
        "minimumLandscapeWidth": 2048,
        "minimumPortraitHeight": 2048,
        "minimumSquareSide": 2048
      }
    }
  }
}
```

### `component_image`

```json
{
  "generationPolicy": {
    "requestedTier": "2K",
    "aspectRatioStrategy": "target",
    "fallbackAspectRatio": "1:1",
    "quality": "medium",
    "outputMimeType": "image/jpeg"
  },
  "renderPolicy": {
    "componentImage": {
      "fitMode": "contain",
      "allowedFitModes": ["contain", "cover"],
      "position": "center center"
    }
  }
}
```

Migration은 디자인 생성기 Prompt Type과 기존 활성 Version을 수정하지 않는다.

---

## 15. 단계별 개발 계획

## P0. 계약과 회귀 안전망

1. 현재 `contain` 여백 재현 테스트
2. 1920px 이미지의 기존 2K 통과 재현 테스트
3. 페이드 `none` Gradient 제외 테스트
4. Prompt 내부 프레임과 CSS 여백 구분 테스트
5. 디자인 생성기 비회귀 테스트
6. Snapshot V2 호환 테스트

완료 기준:

- 현행 문제를 자동 테스트로 재현
- 수정 전 테스트가 의도대로 실패
- 디자인 생성기 테스트 유지

## P1. Policy Schema와 관리자 저장

1. `generationPolicy` Schema
2. `renderPolicy` Schema
3. `validationPolicy` Schema
4. 숫자 범위와 Enum 검증
5. Prompt Draft 저장 연동
6. Validate/Activate/Rollback 연동
7. History Diff
8. V2 중복 Key 정규화
9. `036` V3 Draft 생성 SQL

완료 기준:

- 기존 Prompt Lifecycle 재사용
- 세 정책이 한 Version으로 활성화
- 잘못된 조합 활성화 차단
- 기존 활성 Version 내용과 `updated_at` 불변
- 기존 Candidate가 있으면 자동 덮어쓰기 금지

## P2. 실행·검증 엔진

1. Snapshot V3
2. 섹션 실제 크기 Context 전달
3. Target Geometry 정규화·Revision 검증
4. Aspect Ratio Resolver
5. Provider Adapter 확장
6. 실제 방향별 해상도 검증
7. MIME/Byte/Ratio 검증
8. Snapshot 기반 재시도
9. 요청·실제 크기 Result 저장

완료 기준:

- 2K 가로 이미지 Width 2048px 미만 거부
- Provider 요청과 Snapshot 일치
- 재시도 설정 불변

## P3. 공통 렌더링 정책

1. `contain` 하드코딩 제거
2. Render Policy Resolver
3. `cover/contain/width-fill` 구현
4. Position/Focal Point 구현
5. Fade Stop 정책화
6. Create Promo 적용 경로 통합
7. Visual Editor/Web Output 공통 렌더러 적용
8. 사용자 Override Allowlist
9. Effective Render Policy를 `designSpec`에 저장
10. 기존 프로모션 비소급 회귀 테스트

완료 기준:

- 세 화면에서 동일 정책·동일 결과
- `cover`에서 여백 없음
- `contain`의 예상 여백 Warning
- 활성 정책 변경 후 기존 프로모션 출력 불변

## P4. 관리자 및 프로모션 빌더 UI

1. Typed Generation Policy Editor
2. Typed Render Policy Editor
3. Typed Validation Policy Editor
4. Effective 설정 Preview
5. 충돌 Warning
6. 프로모션 빌더 허용 옵션 노출
7. 변경 이력 표시
8. 기존 Candidate 충돌 안내

완료 기준:

- 코드·Vercel 환경변수 수정 없이 정책 변경
- Draft/Validate/Activate 흐름 유지
- 관리자 허용 범위 밖 사용자 선택 차단

## P5. 운영 전환

1. Neon Backup Branch
2. `036` Draft 생성 Dry Run
3. Code Preview 배포
4. 기존 활성 Prompt V2 호환 확인
5. Preview DB에서 V3 Draft 생성
6. V3 Draft 검토·검증·활성화
7. 섹션 배경 Smoke Test
8. 컴포넌트 이미지 Smoke Test
9. Production Code 배포
10. Production DB에 V3 Draft 생성
11. Production Draft 검토·검증·활성화
12. 기존 프로모션 비소급 확인
13. 지표 확인

---

## 16. 테스트 계획

### Unit

- Policy 기본값
- Policy Merge/Precedence
- V2 중복 설정 정규화
- V3 중복 권위값 거부
- Aspect Ratio Resolver
- Target Geometry 범위·Revision 검증
- Provider 지원 비율 선택
- 방향별 해상도 검증
- `contain/cover/width-fill` CSS 변환
- Fade Stop 변환
- Retry Error Allowlist

### Provider Mock

- Gemini 2K/16:9 Payload
- OpenAI Size 변환
- 1920px 결과 거부
- 2048px 이상 결과 통과
- MIME 불일치 거부
- 마지막 Gemini 결과 이미지 선택

### API Contract

- Prompt Detail Policy 반환
- Draft Policy 저장
- Validate 오류
- Snapshot V3
- Asset Job Snapshot 고정
- 기존 활성 Version 불변
- 기존 Candidate 충돌
- 디자인 생성기 응답 비변경

### Browser

- 관리자 Typed Editor
- Effective 설정
- 충돌 Warning
- 프로모션 빌더 Fit 선택
- Fade 없음
- 배경 정렬
- Web Output 동등성
- 기존 프로모션 비소급

### E2E

- 2K 배경 생성
- `cover` 적용
- `contain` 적용과 Warning
- 저해상도 자동 재시도
- 재시도 완료 후 자동 적용
- 모바일 Viewport 크롭 확인
- 활성 정책 변경 전후 기존 프로모션 Snapshot 비교

전체 기존 테스트 스위트와 다음 빌드를 통과해야 한다.

```text
pnpm run build:admin
pnpm run build:visual-editor
```

---

## 17. 관측성

Run/Asset Job에 저장:

- Prompt ID/Version
- Snapshot Version
- Provider/Model
- Requested Tier
- Requested/Effective Aspect Ratio
- Requested MIME
- Actual Width/Height
- Actual MIME
- Fit Mode
- Position/Focal Point
- Fade Mode
- Attempt
- Validation Error Code
- Latency

금지:

- API Key
- DB URL
- Blob Token
- Authorization Header

---

## 18. 오류 코드

```text
IMAGE_METADATA_INVALID
IMAGE_MIME_MISMATCH
IMAGE_RESOLUTION_BELOW_REQUEST
IMAGE_ASPECT_RATIO_MISMATCH
IMAGE_EDGE_FRAME_DETECTED
IMAGE_POLICY_INVALID
RENDER_POLICY_INVALID
PROVIDER_CAPABILITY_MISMATCH
```

오류 메시지에는 요청값과 실제값을 포함한다.

예:

```text
Requested 2K landscape image requires width >= 2048px;
provider returned 1920x1080.
```

---

## 19. 위험과 대응

| 위험 | 등급 | 대응 |
|---|---:|---|
| `cover`로 피사체 잘림 | 높음 | Safe Area + Focal Point |
| `contain`으로 테두리형 여백 | 높음 | Warning + 기본 `cover` |
| 모바일 크롭 | 높음 | Viewport별 Policy 또는 Focal Point |
| Provider별 2K 규격 차이 | 높음 | 실제 방향별 픽셀 검증 |
| LLM이 프레임 금지 무시 | 중간 | Harness + 선택적 Edge QA |
| 설정 조합 과다 | 중간 | Typed UI와 권장 Preset |
| 공통 정책과 Provider 옵션 중복 | 높음 | V3 단일 권위값 검증 |
| 활성 Version Backfill 변조 | 높음 | 새 Draft Version 생성 |
| 관리자 정책의 기존 페이지 소급 | 높음 | Effective Policy를 `designSpec`에 저장 |
| 브라우저 Geometry 위·변조 | 중간 | 서버 범위·Revision 검증 |
| 재시도 비용 증가 | 중간 | Max Attempts와 오류 Allowlist |
| 활성 정책 변경으로 재시도 변동 | 높음 | 최초 Snapshot 고정 |
| 기존 V2 Run 호환성 | 높음 | Snapshot Version 분기 |
| 디자인 생성기 회귀 | 높음 | Type 격리와 회귀 테스트 |

---

## 20. 롤백

코드 롤백:

- 직전 Deployment 재배포
- V2 Snapshot 실행 허용

정책 롤백:

- 이전 Prompt Version으로 롤백
- 새 Rollback Draft 생성
- 검증 후 활성화

DB:

- `model_options`의 신규 JSON Key는 삭제하지 않아도 기존 코드에 영향 없음
- V3 Draft 생성 Migration 전 Neon Backup Branch 유지
- `036`이 만든 V3 Draft는 보관 처리할 수 있으나 기존 활성 Version은 수정하지 않음

실행 중 Run은 최초 Snapshot을 유지한다.

---

## 21. 완료 조건

1. 섹션 배경 Fit Mode를 관리자에서 변경할 수 있다.
2. `contain`, `cover`, `width-fill`이 동일 공통 렌더러에서 동작한다.
3. 가로 2K는 실제 Width 2048px 이상을 검증한다.
4. 요청 크기와 실제 크기를 Result에 저장한다.
5. 이미지 비율 정책을 관리자에서 변경할 수 있다.
6. 페이드 방향·강도·Stop을 관리자에서 변경할 수 있다.
7. Prompt와 렌더링 정책이 한 Version으로 활성화된다.
8. 재시도가 최초 Snapshot을 유지한다.
9. Create Promo, Visual Editor, Web Output 결과가 동일하다.
10. 사용자 선택은 관리자 허용 범위를 벗어나지 않는다.
11. 디자인 생성기 동작이 변경되지 않는다.
12. 전체 테스트와 빌드가 통과한다.
13. V3 전환 과정에서 기존 활성 Prompt Version이 수정되지 않는다.
14. 관리자 정책 변경 후 기존 프로모션 출력이 변경되지 않는다.
15. V3 설정에 Tier/Quality/MIME 중복 권위값이 존재하지 않는다.

후속 완료 조건:

- 이미지 내부 Edge Frame 자동 감지
- Desktop/Tablet/Mobile별 이미지 Asset Variant
- 관리자 공통 Session/Role Guard

---

## 22. 최종 권장 방향

이번 수정은 `contain`을 `cover`로 바꾸는 단일 패치로 끝내지 않는다.

다음 공통 계약을 먼저 구현한다.

```text
Prompt Version
+ Generation Policy
+ Render Policy
+ Validation Policy
+ Runtime Policy
= 재현 가능한 이미지 생성·적용 결과
```

이 구조를 적용하면 향후 다음 변경은 관리자 설정만으로 처리할 수 있다.

- 이미지 크기
- 종횡비
- Fit Mode
- 정렬
- 페이드
- 최소 해상도
- 품질
- 파일 형식
- 재시도 횟수
- 이미지 생성 Harness

새로운 종류의 Provider 기능이나 브라우저 렌더링 방식이 추가될 때만 소스코드
확장이 필요하다.

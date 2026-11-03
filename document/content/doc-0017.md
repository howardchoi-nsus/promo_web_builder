# 관리자 LLM·프롬프트 Control Plane 통합 개발계획서

## 0. 문서 정보

- 최초 작성일: 2026-07-25
- 최종 개정일: 2026-07-26
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 개발 기준 확정
- 대상 관리자 메뉴: `설정 > LLM 및 프롬프트 관리`
- 제안 마이그레이션: `035_llm_prompt_control_plane_backfill.sql`
- 선행 마이그레이션:
  - `033_prompt_template_version_lifecycle.sql`
  - `034_promo_design_token_management.sql`

### 0.1 목적

프로모션 빌더에서 사용하는 LLM의 행동과 실행 옵션을 관리자 페이지 한 곳에서 관리한다.

관리자가 제어할 항목:

- Prompt 본문
- 동적 Harness 지침
- Provider와 Model
- Temperature
- 최대 출력 토큰
- 응답 형식
- 이미지 크기·품질·MIME 타입
- 실행 제한 시간
- 재시도 정책
- 모델별 지원 Capability
- 버전, 검증, 활성화, 롤백

서버가 강제할 항목:

- Structured Output JSON Schema
- 섹션·컴포넌트·필드 Scope
- 잠금 콘텐츠와 잠금 레이아웃
- URL 안전 정책
- CSS Property allowlist
- 디자인 토큰과 스타일 슬롯 호환성
- Layout Operation allowlist
- 이미지 Signature와 실제 해상도
- API Key와 인증정보
- Provider·Vercel의 절대 실행 상한

### 0.2 명시적 제외 범위

별도 `디자인 생성기` 실행 파이프라인은 이번 개발에서 변경하지 않는다.

- `integrated_brief`
- `image_execution`
- `lofi_draft`
- `final_design`
- `promo-generation-*`
- n8n 디자인 생성 Worker
- 디자인 생성기 Webhook

공통 Prompt Store를 수정하더라도 위 기능의 실행 Payload와 Snapshot은 기존과 동일해야 한다.

### 0.3 2026-07-26 재검토 반영사항

초안의 독립 `Execution Profile`, 독립 `Prompt Fragment Version`, 독립 `Harness Release` 구조를 다음과 같이 수정한다.

> 기존 `prompt_templates`의 한 Version을 대상 기능의 원자적 Harness Release로 사용한다.

이유:

- Prompt와 실행 설정의 이중 원천 방지
- Prompt·Profile·Fragment를 따로 활성화할 때 발생하는 중간 불일치 방지
- 현재 Draft → Validate → Activate → Rollback Lifecycle 재사용
- 기존 운영 Prompt와 History 보존
- 신규 환경과 운영 환경의 실행 구조 통일

`prompt_templates` 한 행이 다음 전체를 고정한다.

```text
Prompt Version = Atomic Harness Release
  ├─ Prompt Body
  ├─ Provider
  ├─ Model
  ├─ Temperature
  ├─ Max Tokens
  ├─ Response Format
  ├─ Model Options
  ├─ Harness Config
  ├─ Runtime Config
  ├─ Model Capability Snapshot
  └─ Safety Contract Reference
```

---

## 1. 대상 기능

| Prompt Type | 기능 | 포함 |
|---|---|---:|
| `section_layout_planner` | 섹션 레이아웃과 스타일 계획 | 예 |
| `multi_component_layout_planner` | 다중 컴포넌트 정렬 제안 | 예 |
| `section_composition_planner` | 자연어 기반 섹션 구성 | 예 |
| `section_background_image` | 섹션 배경 이미지 생성 | 예 |
| `component_image` | 컴포넌트 이미지 필드 생성 | 예 |

템플릿·섹션 설정에 남겨야 하는 항목:

- 섹션 AI 활성화
- 허용 Layout Variant
- 배경 이미지 생성 허용
- AI 이미지 대상 Item/Field
- 콘텐츠·레이아웃 잠금
- 섹션별 이미지 종횡비
- 사용자 편집 허용

이 값은 요청 Context와 서버 Constraint로 전달한다. 전역 LLM 설정으로 이동하지 않는다.

---

## 2. 현행 문제

### 2.1 저장됐지만 실제 요청에서 무시되는 설정

Planner 계열은 현재 Prompt와 Model만 사용한다.

실제 요청에서 누락된 항목:

- Provider
- Temperature
- Max Tokens
- Response Format
- 일부 Model Options

관리자 화면에서 저장 성공으로 보이지만 결과에 영향이 없는 설정이 존재한다.

### 2.2 관리자에게 보이지 않는 Prompt

`api/_promo-section-design-provider.js`의 `imagePromptForSafeArea()`가 관리자 Prompt 뒤에 다음 지침을 추가한다.

- 카피 안전 영역별 피사체 위치
- Full-bleed 배경
- 외곽 여백·테두리·프레임 금지
- 배경색 호환
- 이미지 내부 페이드 금지
- 문자·버튼·로고·배지 금지

관리자가 보는 Prompt와 실제 Provider Prompt가 다르다.

### 2.3 구형 실행·재시도 경로

다음 API가 Prompt Snapshot을 완전하게 사용하지 않는다.

- `api/promo-section-design-process.js`
- `api/promo-section-design-image-process.js`

이미지 재시도 시 Provider, Model, Model Options, Image Size가 누락될 수 있다.

### 2.4 이미지 해상도

현행 검증은 파일 용량만 확인하고 실제 폭·높이를 판독하지 않는다.

Gemini 예상 크기도 실제 공식 규격이 아니라 단순 계산값을 기록한다.

예:

```text
Gemini 3.1 Flash Image / 16:9 / 2K
현재 기록: 2048x1152
공식 규격: 2752x1536
```

### 2.5 관리자 UI

- `section_composition_planner` 필터 누락
- 서버에서 허용하지 않는 Provider가 UI에서 선택 가능
- `modelOptions` Raw JSON 의존
- 최상위 Temperature와 JSON 내부 Temperature 불일치 가능
- 이미지 크기 설명 부정확
- 최종 Effective Request 확인 불가
- 필수·선택 변수를 관리자가 임의 변경 가능

### 2.6 관리자 API 보호

현재 저장소에는 독립적인 관리자 인증 계층이 없다.

Control Plane을 포함한 관리자 변경 API 전체에 공통 Session/Role Guard가 필요하다.
이 항목은 임시 Token UI가 아니라 관리자 인증 기반의 후속 보안 Task로 분리한다.

API Key, DB URL, Blob Token은 관리자 DB에 저장하지 않는다.

---

## 3. 설계 원칙

### 3.1 단일 원천

대상 5개 기능의 Runtime Authority는 활성 `prompt_templates` Version이다.

| 값 | 최종 원천 |
|---|---|
| Prompt | `prompt_templates.body` |
| Provider | `prompt_templates.provider` |
| Model | `prompt_templates.model` |
| Temperature | `prompt_templates.temperature` |
| Max Tokens | `prompt_templates.max_tokens` |
| Response Format | `prompt_templates.response_format` |
| Provider 세부 옵션 | `prompt_templates.model_options` |
| Harness 지침 | `prompt_templates.model_options.harnessConfig` |
| Timeout/Retry | `prompt_templates.model_options.runtimeConfig` |
| Capability | `prompt_templates.model_options.modelCapabilitySnapshot` |
| Safety Contract | `prompt_templates.model_options.safetyContract` |

중복 값 처리:

- 최상위 컬럼이 권위값이다.
- `model_options`에는 Provider/Model/Temperature/Max Tokens/Response Format을 다시 저장하지 않는다.
- 기존 중복값은 Migration에서 제거하지 않고 읽기 시 정규화한다.
- 신규 Draft 저장 시 중복 key를 제거한다.

### 3.2 원자적 활성화

Prompt Version 한 행을 활성화하므로 Prompt·실행 옵션·Harness가 동시에 전환된다.

```text
draft → validated → active
                   └─ 이전 active → inactive
```

### 3.3 Snapshot 우선

새 실행은 활성 Version을 읽어 `Execution Snapshot V2`를 만든다.

재시도는 활성 설정을 다시 읽지 않고 최초 Snapshot을 사용한다.

### 3.4 호환 전환과 Fail-closed

코드가 Backfill보다 먼저 배포돼도 기존 V1 실행은 유지한다. `035` Backfill 후
새 Draft를 검증·활성화하면 V2 설정은 누락 시 검증 단계에서 차단한다.

### 3.5 안전 계약 분리

Prompt 지침과 서버 검증은 별개다.

Prompt가 “임의 URL을 만들지 말라”고 말하더라도 서버는 URL을 다시 검증한다.

---

## 4. 데이터 모델

## 4.1 기존 `prompt_templates`의 원자적 설정 확장

1차 구현은 새 실행환경이나 신규 테이블을 추가하지 않는다. 기존
`prompt_templates` 한 Version의 `model_options`에 다음 예약 Key를 저장한다.

```json
{
  "harnessConfig": {},
  "runtimeConfig": {},
  "modelCapabilitySnapshot": {},
  "safetyContract": {
    "key": "section-image-v1",
    "version": 1
  },
  "executionSnapshotVersion": 2
}
```

이 방식의 이유:

- 현재 Node/Vercel/Neon/Vue 개발환경을 그대로 사용
- 기존 Prompt 초안·검증·활성화·롤백·History 원자성 재사용
- 코드가 먼저 배포되고 DB Backfill이 나중에 실행돼도 컬럼 오류 없음
- `previous_model_options`, `new_model_options`가 Harness 전체 변경 이력 보존
- 동일 Version 안에서 Prompt와 Harness가 따로 활성화되는 이중 Authority 방지

예약 Key는 일반 Provider 옵션과 분리해 Runtime Snapshot에 정규화한다.

`model_options.harnessConfig` 예:

```json
{
  "version": 1,
  "safeAreaInstructions": {
    "none": "Use the full canvas...",
    "left-copy": "Keep the left half...",
    "right-copy": "Keep the right half...",
    "center-copy": "Keep the center..."
  },
  "sectionBackgroundRules": [
    "Create a full-bleed background.",
    "Do not add an outer frame."
  ],
  "componentImageRules": [
    "Use the component field purpose."
  ],
  "negativeRules": [
    "Do not render visible text, buttons, logos or legal copy."
  ]
}
```

`model_options.runtimeConfig` 예:

```json
{
  "timeoutMs": 240000,
  "maxAttempts": 3,
  "retryBaseMs": 15000,
  "retryMaxMs": 75000,
  "outputMimeType": "image/jpeg",
  "minimumImagePolicy": "requested-tier"
}
```

### 제약 조건

- `harnessConfig`, `runtimeConfig`, `modelCapabilitySnapshot`, `safetyContract`는 JSON Object만 허용
- Timeout, Retry에는 DB Check와 서버 절대 상한 적용
- 활성 행 직접 수정 금지
- Draft 행만 수정
- Activation은 기존 활성 행 비활성화와 한 트랜잭션

## 4.2 Model Capability Snapshot

1차 구현에서 Capability는 Prompt Version의 `modelCapabilitySnapshot`으로 고정한다.
관리자가 모델이나 지원 옵션을 바꾸면 반드시 새 Prompt Draft Version이 생성되므로
과거 실행 재현성이 유지된다.

독립 Model Catalog 테이블은 모델을 여러 기능에서 대규모로 공유하게 될 때의
2차 확장으로 남긴다. 1차에 별도 Catalog를 동시에 도입하지 않는 이유는 다음과 같다.

- Prompt Version과 Catalog Version의 동시 활성화 트랜잭션 경계가 불필요하게 커짐
- 현재 5개 기능의 Provider/Model 수가 작아 운영 이득보다 복잡도가 큼
- 별도 Catalog를 도입해도 실행 시 Capability Snapshot 복사는 필요함

## 4.3 History

기존 `previous_model_options`, `new_model_options`가 Control Plane 설정 전체를
포함한다. 별도 History 컬럼을 추가하지 않아도 Prompt 본문, Provider, Model,
Harness, Runtime, Capability의 변경 전후가 한 Audit Record에 원자적으로 남는다.

## 4.4 변수 계약

필수·선택 변수는 관리자 자유 입력 대상이 아니다.

- 서버 `PROMPT_TYPES` 계약이 허용 변수의 최종 원천
- 관리자 화면은 읽기 전용
- Prompt 본문은 허용 변수만 삽입 가능
- 신규 변수는 서버 공급 로직 구현 후 계약에 추가
- Activation 전 미치환 변수를 차단

## 4.5 Backfill

대상 5개 Prompt Type만 Backfill한다.

1. 활성 Prompt 조회
2. 기존 하드코딩 지침을 `model_options.harnessConfig`에 복사
3. Timeout/Retry를 `model_options.runtimeConfig`에 복사
4. `model_options.modelCapabilitySnapshot` 저장
5. Safety Contract 연결
6. `model_options.executionSnapshotVersion=2` 설정

디자인 생성기 Prompt Type은 변경하지 않는다.

기존 Top-level 값과 `model_options` 중복 시:

```text
Top-level Column
> model_options
> Repository Bootstrap
```

---

## 5. 인증과 권한

현재 프로젝트에는 관리자 로그인·Role Session이 없다. Control Plane만 별도
브라우저 Token 방식으로 보호하면 관리자 페이지의 다른 변경 API는 그대로 남아
보안 경계가 불일치한다.

따라서 이번 구현에서는 임시 Secret 입력 UI를 추가하지 않고 기존 배포 보호
정책을 유지한다. 정식 관리자 인증 도입 시 Prompt Mutation을 포함한 모든 설정
API에 동일한 Session/Role Guard를 적용한다.

후속 보안 Task:

1. 관리자 Session 도입
2. Role `llm-config:read`, `llm-config:write`, `llm-config:activate` 분리
3. Prompt 저장·검증·활성화·롤백·보관 API에 공통 Guard 적용
4. CSRF와 Audit Actor 연결

---

## 6. Execution Snapshot V2

Canonical Snapshot 저장 위치:

- Run: `promo_section_design_runs.prompt_snapshot`
- Asset Job: Run Snapshot의 Hash와 대상별 파생값만 `request_snapshot`에 저장
- 재시도: Run Snapshot 또는 최초 Asset Job Snapshot 사용

```json
{
  "snapshotVersion": 2,
  "promptConfig": {
    "promptId": "uuid",
    "promptType": "section_background_image",
    "promptVersion": 14,
    "provider": "google",
    "model": "gemini-3.1-flash-image",
    "temperature": null,
    "maxTokens": null,
    "responseFormat": "image",
    "modelOptions": {
      "imageSize": "2K"
    },
    "harnessConfig": {},
    "runtimeConfig": {
      "timeoutMs": 240000,
      "maxAttempts": 3
    },
    "modelCapabilitySnapshot": {},
    "safetyContract": {
      "key": "section-background-image",
      "version": 2
    },
    "renderedPrompt": "...",
    "renderedPromptHash": "sha256",
    "variableHash": "sha256"
  }
}
```

### 6.1 Effective Timeout

관리자 Timeout이 Vercel Function 시간을 초과할 수 없다.

```text
effectiveTimeout =
  min(
    runtimeConfig.timeoutMs,
    providerAbsoluteLimit,
    functionMaxDurationMs - safetyMarginMs
  )
```

`vercel.json`의 `maxDuration`은 배포 계약으로 코드에 남긴다.

### 6.2 Provider 요청

Planner:

- Model
- Temperature
- Max Output Tokens
- Structured Output Schema
- Effective Timeout

Image:

- Model
- Image Size
- Aspect Ratio
- Quality
- MIME Type
- Effective Timeout

`responseFormat`은 Safety Contract가 허용하는 형식만 선택 가능하다.

---

## 7. Prompt Harness

### 7.1 조립 순서

```text
1. 관리자 Prompt Body
2. 요청 Context
3. 조건에 맞는 Harness Instruction
4. Negative Rules
5. Output Contract 안내
```

Harness 문장은 `prompt_templates.model_options.harnessConfig`에서 읽는다.

Production V2에서 코드 문장 fallback을 사용하지 않는다.

### 7.2 동적 조건

지원 조건:

- `targetType`
- `safeArea`
- `fadeMode`
- `aspectRatio`

조건값 자체는 서버가 검증한다.

### 7.3 Safety Contract

Prompt 지침과 별도로 다음을 코드에서 검증한다.

- Layout JSON Schema
- 선택 Scope
- Lock
- URL
- CSS
- Token Slot
- 이미지 실제 형식·크기

---

## 8. 이미지 검증

### 8.1 실제 메타데이터

Provider 결과 바이트에서 판독한다.

- JPEG Width/Height
- PNG Width/Height
- WebP Width/Height
- MIME Signature
- Byte Length

예상값을 실제값으로 기록하지 않는다.

### 8.2 Gemini 최종 이미지

선택 순서:

1. `payload.output_image`
2. 마지막 `model_output` Image
3. 마지막 유효 Image

첫 번째 Thinking Image를 최종 이미지로 사용하지 않는다.

### 8.3 해상도 정책

Model Capability Snapshot에 해상도 Table을 저장한다.

```json
{
  "imageDimensions": {
    "2K": {
      "16:9": { "width": 2752, "height": 1536 }
    }
  }
}
```

정책:

- 실제 크기가 요청 Tier 최소값보다 작으면 실패
- 허용 오차는 Capability에 명시
- 예상·실제 크기 모두 Result Snapshot에 저장

---

## 9. API

### 9.1 기존 Prompt API 확장

- `GET /api/prompt-templates`
- `GET /api/prompt-template`
- `PATCH /api/prompt-template`
- `POST /api/prompt-template-draft`
- `POST /api/prompt-template-validate`
- `POST /api/prompt-template-activate`
- `POST /api/prompt-template-rollback`
- `POST /api/prompt-template-archive`

추가 반환값:

- `harnessConfig`
- `runtimeConfig`
- `modelCapabilitySnapshot`
- `safetyContract`
- `controlPlaneReady`

### 9.2 Effective 설정 확인

기존 `GET /api/prompt-template` 응답에서 Provider/Model, Provider 옵션,
Harness Config, Runtime Config, Model Capability Snapshot, Safety Contract,
Execution Snapshot Version을 확인한다.

별도 Preview API는 실제 요청 Context에 사용자 콘텐츠가 포함되는 보안·마스킹
정책을 먼저 정의한 뒤 후속 구현한다.

---

## 10. 관리자 UI

### 10.1 화면

```text
LLM 및 프롬프트 관리
  ├─ 프로모션 빌더 Prompt
  ├─ 디자인 생성기 Prompt (기존, 이번 범위 제외)
  └─ 변경 이력
```

### 10.2 Prompt Editor

필드:

- Prompt 이름
- Prompt Type
- Provider
- Model
- Temperature
- Max Tokens
- Response Format
- Image Size
- Quality
- MIME Type
- Timeout
- Max Attempts
- Retry Base/Max
- Harness Safe Area 지침
- Harness Background 규칙
- Harness Component 규칙
- Negative 규칙
- 변경 사유
- Prompt 본문

필수·선택 변수는 읽기 전용으로 표시한다.

### 10.3 Capability 기반 UI

- Temperature 미지원 Model은 필드 비활성
- Structured Output 미지원 Model은 Planner에서 선택 불가
- 4K 미지원 Model은 4K 비활성
- Image 생성 미지원 Model은 Image Prompt에서 선택 불가

### 10.4 필수 UI 수정

- `section_composition_planner` 필터 추가
- Provider 제한과 서버 Validation 일치
- `2K · 2048px` 고정 설명 제거
- 종횡비별 예상 규격 표시
- Raw JSON은 고급 읽기 전용 Preview로 축소
- 현재 Prompt Version의 Effective 설정 표시

---

## 11. 단계별 개발

## P0. 기준선과 실행 경로

1. 대상 5개 기능 호출 경로 테스트
2. 관리자 옵션 미반영 재현 테스트
3. 숨겨진 Prompt 조립 테스트
4. Legacy 재시도 설정 누락 테스트
5. 이미지 실제 해상도 기준선 테스트
6. 디자인 생성기 비회귀 기준선
7. Prompt Version 원자성 회귀 테스트

완료 기준:

- 현행 오류가 자동 테스트로 재현됨
- 디자인 생성기 테스트 통과
- 기존 초안·검증·활성화 흐름 테스트 통과

## P1. 저장 구조와 관리 API

1. `035_llm_prompt_control_plane_backfill.sql`
2. 대상 5개 `model_options` Backfill
3. Prompt API의 예약 Key 정규화와 검증
4. 기존 History Snapshot 재사용
5. Effective 설정 응답
6. Lifecycle 원자성 검증

완료 기준:

- 기존 Prompt ID/Version/History 보존
- 대상 5개만 Snapshot V2 준비
- 디자인 생성기 Prompt 변경 없음
- 과거 Prompt Version의 Capability/Harness 재현 가능

## P2. 실행 통합

1. Snapshot V2
2. Harness Renderer
3. Capability Validator
4. OpenAI Adapter
5. Google Adapter
6. Planner 옵션 적용
7. Image 옵션 적용
8. 실제 이미지 메타데이터
9. 최종 Gemini 이미지 선택
10. 재시도 Snapshot 고정
11. Legacy API 공통 실행기로 연결
12. V2 Fail-closed

완료 기준:

- 관리자 설정이 Mock Provider Payload에 반영
- 재시도 Payload가 최초와 동일
- 저해상도 결과 거부
- V2에서 Runtime fallback 없음

## P3. 관리자 UI

1. Prompt 그룹/필터
2. Typed Runtime Editor
3. Typed Harness Editor
4. Capability 기반 입력 제어
5. Effective 설정 표시
6. 읽기 전용 변수 계약
7. Version 비교/History

완료 기준:

- 코드·Vercel Runtime 값 수정 없이 대상 기능 조정 가능
- 지원하지 않는 조합 저장·활성화 불가

## P4. Cutover

1. Neon Backup Branch
2. Migration Dry Run
3. Backfill 확인
4. Preview 검증
5. Production Migration
6. Production 배포
7. 새 Draft 검증·활성화
8. 관측성 확인
9. Legacy 경로 확인

---

## 12. 테스트

### Unit

- Harness 조건
- Prompt 조립 순서
- Capability 검증
- Runtime 상한
- JPEG/PNG/WebP 크기 판독
- Gemini 최종 이미지 선택

### API Contract

- Prompt V2 필드
- Prompt Control Plane 예약 Key
- 디자인 생성기 응답 비변경

### Provider Mock

Planner:

- Model
- Temperature
- Max Output Tokens
- Schema
- Timeout

Image:

- Image Size
- Aspect Ratio
- Quality
- MIME
- Timeout

### DB Integration

- Backfill 원자성
- 활성 Version Unique
- Prompt Activation 동시성
- History Snapshot

### Browser

- 대상 5개 필터
- Draft 저장
- Validate/Activate
- Model Capability UI
- Harness Editor
- Effective 설정

### E2E

- 섹션 레이아웃
- 다중 정렬
- 자연어 섹션 구성
- 섹션 배경 2K
- 컴포넌트 이미지
- 동일 Snapshot 재시도

전체 현재 테스트 스위트와 관리자·Visual Editor Build를 통과해야 한다.

---

## 13. 배포와 롤백

### 13.1 호환 전환

새 컬럼을 조회하지 않고 기존 `model_options`를 사용한다. 코드가 Backfill보다
먼저 배포돼도 컬럼 오류가 발생하지 않으며, Backfill 후 새 Draft부터 V2 설정을
원자적으로 저장한다.

### 13.2 순서

1. Code + Test
2. Neon Backup
3. `035` Backfill
4. Backfill 검증
5. Deploy
6. 기능별 Smoke Test
7. 새 Draft 검증·활성화
8. 운영 지표 확인
9. 전체 활성화

### 13.3 롤백

- 직전 Deployment Redeploy
- Backfill된 JSON 설정은 보존
- 기존 Snapshot V1 실행 허용
- Prompt는 직전 Version 기반 Rollback Draft 생성

실행 중 작업은 최초 Snapshot을 유지한다.

---

## 14. 운영 관측

저장:

- Run/Job ID
- Prompt ID/Version/Hash
- Snapshot Version
- Model Capability Snapshot Hash
- Provider/Model
- Effective Options
- Request ID
- Latency
- Retry
- 예상·실제 이미지 크기
- Error Code

금지:

- API Key
- Bearer Token
- DB URL
- Blob Token

지표:

- Prompt Version별 성공률
- Model별 오류율
- P95 Latency
- Retry 비율
- 저해상도 거부율
- Schema Validation 실패율

---

## 15. 위험과 대응

| 위험 | 등급 | 대응 |
|---|---:|---|
| Prompt/Runtime 이중 원천 | 높음 | Prompt Version 단일 원천 |
| 설정 부분 활성화 | 높음 | Prompt Version 원자 활성화 |
| Model 설정 변경으로 과거 실행 손실 | 높음 | Prompt Version + Capability Snapshot |
| 관리자 API 무단 변경 | 높음 | 후속 공통 Session/Role Guard |
| Legacy 재시도 설정 변경 | 높음 | 최초 Snapshot 고정 |
| Vercel Timeout 초과 | 높음 | Effective Timeout 상한 |
| 저해상도 이미지 저장 | 높음 | 실제 바이트 검증 |
| Thinking Image 선택 | 중간 | 최종 이미지 선택 순서 |
| Raw JSON 오설정 | 중간 | Typed UI |
| 디자인 생성기 회귀 | 높음 | 타입 격리와 회귀 테스트 |

---

## 16. 구현 금지

- Secret을 DB 또는 브라우저 영구 저장소에 저장하지 않는다.
- 대상 5개 실행에서 코드 Model/Prompt fallback을 최종 구조로 남기지 않는다.
- 활성 Prompt 행을 직접 수정하지 않는다.
- 재시도에서 현재 활성 설정을 다시 읽지 않는다.
- 예상 이미지 크기를 실제 크기로 기록하지 않는다.
- 관리자 Prompt만 믿고 Safety 검증을 제거하지 않는다.
- 디자인 생성기 Prompt와 Worker를 이번 Migration으로 변경하지 않는다.
- Production Migration 전 Backup Branch를 생략하지 않는다.

---

## 17. 최종 완료 조건

1. 대상 5개 Prompt Version이 원자적 Harness Release로 동작한다.
2. Provider와 Runtime 옵션의 단일 원천이 명확하다.
3. 모든 대상 신규 실행이 Snapshot V2를 사용한다.
4. 관리자 설정이 실제 Provider Payload에 반영된다.
5. 숨겨진 이미지 지침이 Harness Config로 이동한다.
6. 재시도가 최초 Snapshot을 사용한다.
7. 과거 Prompt Version의 Capability Snapshot을 재현할 수 있다.
8. Safety Contract는 서버가 유지한다.
9. 이미지 실제 크기를 검증하고 저장한다.
10. 관리자가 현재 Version의 Effective 설정을 확인할 수 있다.
11. 기존 디자인 생성기 동작이 변경되지 않는다.
12. 전체 테스트와 Build가 통과한다.

후속 완료 조건:

- 관리자 전체 API 공통 Session/Role Guard
- 실제 사용자 콘텐츠를 마스킹하는 Effective Request Preview
- 운영 규모가 커질 경우 독립 Model Catalog

---

## 18. 개발 착수 기준

첫 구현은 UI가 아니라 다음 계약 테스트다.

```text
활성 Prompt Version
+ Harness Config
+ Runtime Config
+ Model Capability Snapshot
= 실제 Provider Request
```

이 계약이 고정된 후 DB, 실행부, 관리자 UI 순서로 구현한다.

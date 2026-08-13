# 소스코드 LLM 프롬프트 설정 일원화 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-07
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 1차 개발 완료·운영 DB 마이그레이션 적용 전
- 대상 관리자 메뉴: `설정 > LLM 및 프롬프트 관리`
- 범위: 애플리케이션 API, Provider, Prompt 실행·후처리, 관리자 설정 화면
- 명시적 제외: `n8n/` 전체와 배포된 n8n Workflow
- 선행 문서:
  - `docs/claude/review-hardcoded-llm-prompts-2026-07-28.md`
  - `docs/계획/admin-llm-prompt-hardcoding-remediation-development-plan-2026-07-29.md`
  - `docs/계획/admin-llm-prompt-control-plane-development-plan-2026-07-25.md`
- 문서 관계: n8n을 제외한 소스코드 Prompt 정리 범위에서는 2026-07-29 계획을 본 문서가 대체한다.

## 0.0 구현 결과

- 애플리케이션 Runtime의 Prompt Body·Guard·Repair·Key Visual 지시문과 모델 literal 폴백을 제거했다.
- Prompt 자연어 계층은 `model_options.promptLayers` 및 Version별 `harnessConfig`에서 관리한다.
- 관리자 설정 화면에 `프롬프트 실행 계층(JSON)` 편집 영역을 추가했다.
- `admin_prompt_translation`, `promo_page_generation` Prompt Type을 추가했다.
- 활성 설정이 없는 Prompt 조회와 실행은 코드·파일 폴백 없이 실패한다.
- `db/migrations/056_prompt_layers_and_runtime_prompt_governance.sql`에 기존 운영 Version 이관과 신규 Type 초기 데이터를 준비했다.
- `scripts/test-no-hardcoded-runtime-prompts.js`로 코드 Prompt 재유입을 차단한다.
- 2026-08-07 기준 관리자 빌드와 전체 120개 테스트 파일의 일괄 실행을 완료했다.

## 0.1 결정 사항

애플리케이션 소스코드에는 LLM의 해석, 생성 방향, 출력 내용, 재시도 응답 또는 이미지 결과에 영향을 주는 자연어 프롬프트를 두지 않는다.

다음 값의 Runtime Authority는 활성화된 관리자 Prompt Version 하나로 통일한다.

- System Message와 User Prompt Body
- 실행 전후에 덧붙이는 Completion Guard와 Harness
- 검증 실패 후 재호출하는 Repair/Retry Prompt
- 이미지 생성의 Creative Intent, 금지 규칙, 텍스트 정책, 피사체 크기 지침
- 응답 누락 시 다음 LLM 입력으로 사용되는 기본 Negative Prompt와 생성 가이드
- Provider, Model, Temperature, Max Tokens, Response Format 및 모델별 생성 옵션
- LLM 입력용 문서에 포함되는 데이터 해석 우선순위와 렌더링 지침

활성 설정이 없거나 유효하지 않으면 해당 LLM 실행은 실패해야 한다. 코드 문자열, 환경변수 또는 파일 프롬프트로 조용히 대체하지 않는다.

## 0.2 완료 상태 정의

```text
관리자 활성 Prompt Version
  ├─ System Message
  ├─ Prompt Body
  ├─ Prompt Layers
  │    ├─ Harness
  │    ├─ Completion Guard
  │    ├─ Repair/Retry Prompt
  │    └─ Fallback Output Guidance
  ├─ Provider / Model / Parameters
  └─ 실행 계약 Version
          ↓
Prompt Execution Snapshot 생성
          ↓
최종 Effective Prompt + Hash 저장
          ↓
Provider는 Snapshot만 실행
```

소스코드는 프롬프트를 조립하는 규칙만 보유할 수 있다. 조립되는 자연어 문장 자체는 활성 Prompt Version에 있어야 한다.

---

## 1. 범위

## 1.1 포함 범위

- `api/_prompt-template-store.js`의 저장소 기본 Prompt Body와 LLM 실행 기본값
- `api/_prompt-execution-snapshot.js`의 실행 시 추가 지시문
- `api/_section-ai-control-plane.js`의 이미지 Harness와 Creative Intent
- `api/_section-key-visual-contract.js`의 이미지 텍스트 생성 지시문
- `api/_promo-section-design-provider.js`의 번역·Planner 폴백·이미지 후첨 지시문
- `api/_promo-page-composition-service.js`의 재시도 교정 지시문
- `api/_promo-markdown-builders.js`의 LLM 입력용 규칙 문장
- `api/_design-md-data.js`의 생성 가이드 폴백
- `api/promo-generation-integrated-brief-complete.js`의 기본 Negative Prompt
- `api/prompts/*.js`의 내장·파일 Prompt 폴백
- `api/`에서 LLM Provider로 직접 전달되는 model, temperature, token, response format의 코드 기본값
- `prototype/` 관리자 프롬프트 설정 UI와 `admin-app/`의 프롬프트 그룹 메타데이터
- Prompt Version API, 실행 Snapshot, 변경 이력 및 감사 정보

## 1.2 제외 범위

- `n8n/` 디렉터리의 Workflow JSON, Code 노드와 테스트·고정본
- 운영 n8n Workflow의 수정·재배포
- LLM과 관계없는 화면 문구 및 일반 사용자 안내 문구
- 인증, 권한, SQL, 파일 저장, 이미지 Signature 검사
- 결정론적 레이아웃 계산과 DOM 렌더러

n8n은 이번 정적 검사와 완료 판정에서도 제외한다. 단, API가 n8n에 제공하는 Prompt 조회 엔드포인트는 애플리케이션 소스이므로 포함한다.

## 1.3 코드에 유지할 서버 불변 계약

다음 항목은 LLM 결과에 영향을 주더라도 보안과 데이터 무결성을 위해 코드가 최종 강제한다.

- Structured Output JSON Schema와 `additionalProperties: false`
- 허용 Template, Section, Component, Field, Token의 존재·소유관계 검사
- CSS Property와 Layout Operation Allowlist
- 잠금 콘텐츠 및 Scope 보호
- URL·프로토콜·MIME·이미지 Signature 검증
- Provider Timeout, Token, 이미지 크기의 절대 상한
- 필수 출력 필드와 downstream parser 계약

단, 적용 중인 Contract Key와 Schema Version은 설정 화면과 실행 이력에서 읽기 전용으로 보여준다. 자연어로 된 출력 지시나 보정문은 불변 계약으로 간주하지 않고 Prompt 설정으로 이동한다.

---

## 2. 현행 하드코딩 인벤토리와 이관 위치

| 우선순위 | 현행 위치 | 하드코딩 종류 | 구성 이유 | 목표 설정 위치 |
|---|---|---|---|---|
| P0 | `api/_section-ai-control-plane.js` `buildImageHarnessPrompt()` | 키비주얼 Creative Intent, 일반 배경 금지, DOM 배치 지시 | 섹션 이미지가 단순 텍스처나 컴포넌트 이미지로 생성되는 현상 방지 | `section_background_image.promptLayers.harness` |
| P0 | `api/_section-key-visual-contract.js` | 이미지 내 DOM 문구 금지, 승인 텍스트만 허용 | DOM 제목·CTA와 이미지 텍스트 중복 방지 | `section_background_image.promptLayers.conditionalInstructions.keyVisualText` |
| P0 | `api/prompts/promo-integrated-design-brief-generation.js` | 내장 `FALLBACK_PROMPT` | DB·파일 장애 시 기존 호출 지속 | 제거. 활성 `integrated_brief`가 없으면 실패 |
| P0 | `api/prompts/promo-ui-design-image-generation.js` | 파일 및 내장 Prompt 폴백 | 구형 이미지 생성 호출 호환 | 제거. 활성 `image_execution` 또는 지정 Prompt Type만 사용 |
| P0 | `api/_promo-section-design-provider.js` `generateSectionDesignPlan()` | Planner 전체 폴백 Prompt | Prompt Config가 없는 구형 호출 지원 | 제거. 활성 `section_layout_planner` 필수 |
| P1 | `api/_prompt-execution-snapshot.js` | `INTEGRATED_BRIEF_OUTPUT_GUARD` | 긴 응답에서 Negative Prompt와 QA Checklist 누락 방지 | `integrated_brief.promptLayers.completionGuard` |
| P1 | `api/_promo-page-composition-service.js` | Candidate Scope 및 Contract v3 재시도 교정문 | 1차 결과의 잘못된 ID·중복 선택 자동 교정 | 각 Composer Prompt의 `promptLayers.repairPrompts` |
| P1 | `api/_promo-section-design-provider.js` | 관리자 Prompt 한국어 번역 지시문 | 영문 Prompt의 읽기 전용 번역 제공 | 신규 `admin_prompt_translation` Prompt Type |
| P1 | `api/_promo-section-design-provider.js` | 피사체 최소·최대 비율 후첨 문장 | 이미지 주 피사체가 너무 작거나 커지는 현상 방지 | 이미지 Prompt의 `promptLayers.subjectScaleInstruction` |
| P1 | `api/_promo-markdown-builders.js` | 입력 우선순위·숨김 섹션·원본 Snapshot 해석 지시 | 통합 브리프가 입력 데이터 우선순위를 일관되게 해석하도록 보정 | `integrated_brief` 본문 또는 `promptLayers.sourceDataPolicy` |
| P1 | `api/_design-md-data.js` | 기본 `generationGuidance`, `promoPageImplications` | Design MD 분석 결과가 부족할 때 결정론적 가이드 제공 | `integrated_brief.promptLayers.designFallbackGuidance` |
| P1 | `api/promo-generation-integrated-brief-complete.js` | `DEFAULT_NEGATIVE_PROMPT` | LLM 응답 누락 시 후속 이미지 생성 품질 보장 | `integrated_brief.promptLayers.fallbackOutputValues.negativePrompt` |
| P2 | `api/_prompt-template-store.js` | Prompt Body, 이미지 Harness 문장, Provider·Model·실행 기본값 | 신규 환경 Bootstrap과 복구 기준 | 코드 자동 Seed 제거, 관리자 최초 등록 또는 운영 설정 Import |
| P2 | `api/` Provider 호출부 | `gpt-4.1-mini` 등 모델·파라미터 폴백 | 환경변수 누락과 기존 호출 호환 | 활성 Prompt Version 값 필수, 서버에는 상한 검증만 유지 |

## 2.1 이관하지 않고 제거할 항목

다음 하드코딩은 별도의 설정 항목을 새로 만들기보다 기존 활성 Prompt를 필수화하면서 제거한다.

- `generateSectionDesignPlan()`의 전체 폴백 Prompt
- `api/prompts/*.js`의 내장 `FALLBACK_PROMPT`
- Runtime Provider의 literal model fallback
- 활성 Prompt가 없을 때 Repository Default를 자동 삽입하는 실행 경로
- 프롬프트 파일을 읽어 DB 장애를 대체하는 Runtime 경로

## 2.2 설정으로 이관할 항목

다음 내용은 기능적으로 필요하므로 삭제하지 않고 Prompt Version의 구성요소로 이관한다.

- 키비주얼 Creative Intent와 금지 요소
- Key Visual Text의 조건부 지시문
- Completion Guard
- 재시도 Repair Prompt
- Subject Scale 문장 템플릿
- Source Data Priority 규칙
- Design MD Fallback Guidance
- Default Negative Prompt
- 관리자 Prompt 번역 지시문과 실행 모델 설정

---

## 3. 목표 데이터 모델

## 3.1 Prompt Template 확장

신규 마이그레이션: `db/migrations/056_prompt_layers_and_runtime_prompt_governance.sql`

재검토 결과 별도 컬럼 추가 대신, 이미 Prompt Version과 History가 원자적으로 관리하는 `model_options` JSONB 안에 `promptLayers`를 추가한다.

- 기존 Draft 생성·검증·활성화·롤백 API가 `model_options` 전체를 복제하고 이력화한다.
- 별도 컬럼은 동일 Lifecycle 로직과 모든 SQL 조회를 중복 수정해야 한다.
- Neon 마이그레이션 전에 신규 컬럼을 조회하는 코드가 배포되면 운영 API가 실패할 수 있다.
- `promptLayers`는 관리자 UI에서 Provider 상세 옵션과 분리된 전용 편집 영역으로 제공한다.

System Message, Harness, Guard, Repair, 조건부 지시와 Fallback Output 값은 `model_options.promptLayers`의 표준 Key로 관리한다. Contract Key/Version은 기존 `safetyContract`와 실행 Snapshot 계약을 유지한다.

## 3.2 `model_options.promptLayers` 표준 구조

```json
{
  "schemaVersion": 1,
  "harness": {
    "preInstructions": [],
    "postInstructions": [],
    "negativeInstructions": []
  },
  "completionGuard": [],
  "repairPrompts": {
    "candidateScope": "",
    "contractV3": ""
  },
  "conditionalInstructions": {
    "keyVisualTextNone": "",
    "keyVisualTextExact": ""
  },
  "subjectScaleInstruction": "",
  "sourceDataPolicy": [],
  "designFallbackGuidance": {},
  "fallbackOutputValues": {
    "negativePrompt": ""
  }
}
```

모든 문자열은 Prompt Body와 동일한 버전에서 초안 생성, 검증, 활성화, 롤백한다. 한 Prompt Version의 Body만 활성이고 Layer는 다른 버전인 혼합 상태를 허용하지 않는다.

## 3.3 신규 Prompt Type

`admin_prompt_translation`을 추가한다.

| 항목 | 값 |
|---|---|
| 그룹 | 독립·공통 실행 |
| 목적 | 영문 Prompt를 관리자 검토용 한국어로 번역 |
| 필수 변수 | `sourcePrompt` |
| Provider/Model | 활성 Version에서 필수 지정 |
| Response Format | `text` |
| 실행 조건 | 해당 타입의 활성 Version이 있을 때만 실행 |

번역 Prompt 자체의 한국어 번역 미리보기는 제공하지 않는다. 이는 번역 Prompt가 자기 자신을 호출하는 순환 실행을 방지하기 위함이다.

## 3.4 Repository Baseline 정책 변경

`PROMPT_TYPES`에는 다음 메타데이터만 유지한다.

- Type Key
- 표시 이름 또는 관리 Catalog Key
- 필수·선택 변수 계약
- 허용 Provider와 Response Format
- Contract Key/Version
- 서버 상한과 검증 함수 연결

Prompt Body, 자연어 Harness, Model ID, Temperature, Token 기본값은 제거한다.

신규 환경에는 다음 방식으로 최초 설정을 만든다.

1. 관리자 화면에서 Prompt Type별 최초 Draft를 생성한다.
2. 승인된 운영 환경의 Prompt Bundle을 Export/Import한다.
3. 검증 후 명시적으로 활성화한다.

애플리케이션 시작이나 첫 API 호출이 자연어 Prompt를 자동 생성하지 않는다.

---

## 4. 관리자 설정 페이지 설계

## 4.1 화면 구성

기존 `설정 > LLM 및 프롬프트 관리`의 Version Lifecycle은 유지하고 편집 영역을 다음 탭으로 나눈다.

1. 기본 Prompt
   - Prompt 이름
   - System Message
   - User Prompt Body
   - 필수·선택 변수
2. 실행 지침
   - Harness 전·후 지침
   - Completion Guard
   - 조건부 이미지 지침
   - Source Data Policy
3. 실패·재시도
   - 오류 Code별 Repair Prompt
   - Fallback Output Value
   - 재시도 횟수와 대기 설정
4. 모델 설정
   - Provider, Model, Temperature, Max Tokens, Response Format
   - 이미지 크기·품질 등 Provider Option
5. 실행 계약
   - Contract Key/Version 읽기 전용 표시
   - Structured Output Schema 요약
   - 서버 상한과 허용 Provider 표시
6. 최종 Prompt 미리보기
   - 예제 변수 입력
   - System Message, Body, Layer가 합쳐진 Effective Prompt
   - 각 문장이 어느 Layer에서 왔는지 표시
   - Effective Prompt Hash 표시

## 4.2 타입별 조건부 필드

| Prompt Type | 추가 편집 영역 |
|---|---|
| `section_background_image` | Creative Intent, Safe Area, Key Visual Text, Negative Rules, Subject Scale |
| `component_image` | Component Image Rules, Negative Rules, Subject Scale |
| `integrated_brief` | Completion Guard, Source Data Policy, Design Fallback, Default Negative Prompt |
| `promo_page_composer` | Candidate Scope Repair Prompt |
| `promo_composition_editor` | Contract v3 Repair Prompt |
| `admin_prompt_translation` | 번역 보존 규칙과 출력 형식 |

지원하지 않는 Layer Key는 저장 단계에서 거부한다. 자유 형식 JSON만 제공하지 않고, 주요 필드는 배열·텍스트 입력 UI로 제공한다. 고급 JSON 편집기는 개발자 권한에서만 보조적으로 제공한다.

## 4.3 검증 및 활성화 규칙

- Draft만 편집 가능하다.
- 변수 Placeholder가 선언된 변수 계약과 일치해야 한다.
- Repair Prompt에서 허용된 동적 변수만 사용할 수 있다.
- 이미지 Prompt의 조건부 Layer에 필요한 Key가 모두 있어야 한다.
- Provider, Model, Response Format을 빈 값으로 활성화할 수 없다.
- 서버 상한을 넘는 Token, Timeout, 이미지 크기는 거부한다.
- 필수 Layer가 빈 값이면 해당 타입을 검증할 수 없다.
- 활성화 전 Effective Prompt Preview와 Hash를 생성한다.
- 활성화와 이전 Version 비활성화는 하나의 Transaction으로 처리한다.

---

## 5. Runtime 리팩터링 설계

## 5.1 공통 실행 Snapshot

`createPromptExecutionSnapshot()`이 다음 값을 한 번에 고정한다.

- Prompt Template ID, Type, Lineage, Version
- System Message
- 렌더링된 Body
- 렌더링된 Prompt Layers
- 최종 Effective Prompt 또는 역할별 메시지 배열
- Provider, Model, 실행 파라미터
- Contract Key/Version
- Template Hash, Effective Prompt Hash
- Layer별 Hash와 조립 순서

Provider 계층은 Snapshot 외의 자연어 문자열을 추가할 수 없다.

## 5.2 Prompt 조립기

공통 `PromptAssembler`는 코드에 정의된 조립 순서에 따라 설정 문자열을 결합한다.

```text
System Message
→ Pre Instructions
→ Rendered Body
→ Conditional Instructions
→ Post Instructions / Completion Guard
→ Negative Instructions
```

조립 순서는 코드 계약으로 유지할 수 있으나 각 단계의 자연어는 설정에서만 읽는다. 빈 필수 Layer, 해석할 수 없는 Placeholder, 미지원 Layer가 있으면 Provider 호출 전에 실패한다.

## 5.3 재시도 실행

재시도 코드는 오류 Code를 선택하고 설정의 Repair Prompt를 렌더링한다.

- 코드는 `CANDIDATE_SCOPE_RETRY`, `CONTRACT_V3_REPAIR` 등의 의미 있는 Key만 선택한다.
- 오류 메시지, 허용 ID, Template/Section 후보는 변수로 전달한다.
- 코드에 `Correction required` 같은 자연어를 두지 않는다.
- 실행 이력에는 최초 Prompt Hash와 재시도 Effective Prompt Hash를 모두 남긴다.

## 5.4 Fail-Closed 원칙

다음 상태에서는 LLM을 호출하지 않는다.

- 활성 Prompt Version 없음
- Provider 또는 Model 미지정
- 필수 Prompt Layer 없음
- 변수 미해결
- Contract Version 불일치
- 관리자 설정이 서버 상한 또는 Allowlist 위반

API는 `PROMPT_CONFIGURATION_REQUIRED`, `PROMPT_LAYER_REQUIRED`, `PROMPT_CONTRACT_MISMATCH`처럼 원인을 식별할 수 있는 오류 Code를 반환한다.

## 5.5 LLM 입력용 Markdown 정리

`_promo-markdown-builders.js`는 사실 데이터와 구조만 생성한다.

- `Rendering rule`, `source of truth`, `must not override`와 같은 명령형 문장을 제거한다.
- 데이터 출처는 명령문 대신 구조화된 `source`, `priority`, `visibility` 필드로 표현한다.
- 해당 필드를 해석하는 자연어 규칙은 `integrated_brief.promptLayers.sourceDataPolicy`로 이동한다.
- 원본 Snapshot은 데이터 증거이며 Prompt 지침이 되지 않게 한다.

---

## 6. API 변경 계획

## 6.1 Prompt Template API

다음 API의 요청·응답에 `systemMessage`, `promptLayers`, `executionContract`를 추가한다.

- `GET /api/prompt-templates`
- `GET/PATCH /api/prompt-template`
- `POST /api/prompt-template-draft`
- `POST /api/prompt-template-validate`
- `POST /api/prompt-template-activate`
- `POST /api/prompt-template-rollback`
- `POST /api/prompt-template-archive`

Version 복제·롤백 시 Prompt Body와 모든 Layer를 하나의 단위로 복제한다.

## 6.2 Effective Prompt Preview API

신규 API 후보:

```text
POST /api/prompt-template-preview
```

입력:

- Draft Prompt Template ID
- Preview 변수
- 선택적 Repair Scenario

출력:

- 역할별 메시지 또는 최종 Prompt
- Layer별 렌더링 결과
- 미해결 변수
- Contract Key/Version
- Effective Prompt Hash
- 실제 Provider 호출 여부: 항상 `false`

## 6.3 기존 Prompt 제공 API

`api/prompts/*.js`는 공통 활성 Prompt Loader와 Snapshot Builder를 사용한다.

- DB의 활성 Version만 반환한다.
- 파일 또는 내장 문자열 폴백을 제거한다.
- 응답에 Prompt ID, Version, Hash, Provider, Model과 Contract Version을 포함한다.
- 활성 설정이 없으면 성공 응답을 반환하지 않는다.

---

## 7. 데이터 마이그레이션 및 전환 순서

## 7.1 사전 백업

- 운영 `prompt_templates`와 `prompt_template_histories`를 Export한다.
- 타입별 활성 Version이 정확히 하나인지 검증한다.
- 현재 코드에서 실제 사용되는 자연어 문자열의 Hash와 위치를 고정한 감사 목록을 생성한다.

## 7.2 Schema 마이그레이션

1. 기존 `model_options`에 `promptLayers`를 추가하는 데이터 마이그레이션을 적용한다.
2. 기존 Version Lifecycle 인덱스와 상태 제약은 유지한다.
3. 기존 History의 `previous_model_options`, `new_model_options`로 Layer 변경을 이력화한다.
4. JSON Schema와 지원 Layer Key 검증 함수를 배포한다.

## 7.3 데이터 이관

현재 코드의 자연어를 대상 활성 Version의 새 Draft에 일회성으로 이관한다.

- 기존 Active Version을 직접 수정하지 않는다.
- 타입별 새 Draft Version을 생성한다.
- 코드 문자열의 출처 파일과 이전 Hash를 Change Note에 기록한다.
- 관리자 검토 후 검증·활성화한다.
- 모든 대상 타입이 활성화되기 전에는 코드 문자열 제거 Release를 배포하지 않는다.

일회성 이관 SQL 또는 운영 Script는 배포 후 Runtime에서 참조하지 않는다. 이관 완료 후에는 Prompt 문구를 담은 Script를 일반 실행 경로에 남기지 않고, DB 백업과 변경 이력을 운영 기준으로 사용한다.

## 7.4 코드 전환

1. 새 컬럼을 읽되 기존 경로도 동작하는 호환 Release 배포
2. 관리자에서 이관 Draft 검증 및 활성화
3. 타입별 Readiness API로 활성 설정 완결성 확인
4. Feature Flag로 PromptAssembler 실행 전환
5. 실행 결과와 Hash 비교
6. 코드 Prompt·폴백·자동 Seed 제거
7. Feature Flag를 제거하고 설정 경로를 단일화

## 7.5 롤백

- 코드 하드코딩으로 롤백하지 않는다.
- 이전 Prompt Version을 관리자 Lifecycle로 재활성화한다.
- Schema 변경은 Forward-Compatible하게 유지한다.
- PromptAssembler 장애 시 LLM 실행을 중단하고 이전 Application Release로 되돌리되, DB 활성 Version과 이력은 보존한다.

---

## 8. 단계별 개발 계획

## Phase 0 — 인벤토리 고정 및 회귀 방지

- [ ] `api/` 전체에서 LLM 직접 호출 지점을 목록화한다.
- [ ] 각 호출의 Prompt, System Message, 모델 옵션, 후첨 문자열 출처를 기록한다.
- [ ] `n8n/`, 테스트 Fixture, 일반 UI 문구를 제외하는 정적 검사 범위를 확정한다.
- [ ] 현행 Effective Prompt를 Fixture로 저장하고 Hash를 기준선으로 만든다.

완료 조건:

- 모든 애플리케이션 LLM 호출이 Prompt Type과 연결되어 있다.
- 출처를 설명할 수 없는 자연어 또는 모델 옵션이 없다.

## Phase 1 — DB 및 Version Lifecycle 확장

- [x] `056_prompt_layers_and_runtime_prompt_governance.sql` 작성
- [ ] Prompt/History 조회·복제·수정·검증·활성화 API 확장
- [ ] `admin_prompt_translation` 타입과 변수 계약 추가
- [ ] Prompt Layer 타입별 Schema와 Validator 구현
- [x] 기존 `model_options.harnessConfig`와 코드 자연어를 `model_options.promptLayers`로 이관

완료 조건:

- Body, System Message, Layer가 동일 Version으로 변경·롤백된다.
- 활성 Version의 불완전한 Layer는 저장 또는 실행되지 않는다.

## Phase 2 — 관리자 UI 확장

- [ ] 기본 Prompt, 실행 지침, 실패·재시도, 모델 설정, 실행 계약 탭 구현
- [ ] 타입별 구조화 편집 UI 구현
- [ ] Effective Prompt Preview와 Layer 출처 표시
- [ ] Draft 비교 화면에 System/Layer/Model 변경사항 추가
- [ ] 한국어 번역 기능을 `admin_prompt_translation` 활성 Version에 연결

완료 조건:

- 검토 대상 자연어를 관리자 페이지에서 조회·수정·버전 관리할 수 있다.
- 실제 전송 예정 Prompt를 Provider 호출 없이 확인할 수 있다.

## Phase 3 — Runtime PromptAssembler 도입

- [ ] Snapshot에 System Message, Layer, Contract, Hash 포함
- [ ] Section Image의 Creative Intent·Text Policy·Subject Scale을 설정 기반으로 변경
- [ ] Integrated Brief Completion Guard를 설정 기반으로 변경
- [ ] Composer 재시도 Prompt를 설정 기반으로 변경
- [ ] Provider가 Snapshot 외 문자열을 추가하지 못하게 인터페이스 축소

완료 조건:

- 관리자 Preview Hash와 Runtime 최초 호출 Hash가 일치한다.
- 재시도 시 사용한 Repair Layer와 Hash가 이력에 남는다.

## Phase 4 — 간접 Prompt와 폴백 제거

- [ ] Markdown Builder의 명령형 문장을 데이터 구조로 대체
- [ ] Design MD Fallback Guidance를 활성 설정에서 공급
- [ ] Default Negative Prompt를 활성 설정에서 공급
- [ ] `api/prompts/*.js`의 파일·내장 폴백 제거
- [ ] `generateSectionDesignPlan()` 폴백 제거
- [ ] literal Model/Temperature/Token 폴백 제거
- [ ] Runtime의 `ensureDefaultPromptTemplates()` 자동 Seed 의존 제거

완료 조건:

- 활성 설정이 없으면 Provider가 호출되지 않는다.
- 소스코드 또는 Prompt 파일이 운영 DB 장애를 대신하지 않는다.

## Phase 5 — 정적 검사, 통합 테스트 및 운영 전환

- [ ] 하드코딩 방지 정적 검사 Script 추가
- [ ] Prompt Type별 Snapshot 계약 테스트 추가
- [ ] 관리자 Draft→검증→활성화→롤백 브라우저 테스트 확장
- [ ] 설정 누락·불완전·계약 불일치 Fail-Closed 테스트
- [ ] Section Key Visual, Composition Repair, Integrated Brief 회귀 테스트
- [ ] 운영 설정 Export와 복구 Runbook 작성

완료 조건:

- CI가 새로운 코드 Prompt와 Provider 기본값을 차단한다.
- 핵심 생성 시나리오와 실패 시나리오가 모두 통과한다.

---

## 9. 테스트 계획

## 9.1 계약 테스트

- Prompt Version 복제 시 System/Layer/Model/Contract가 동일하게 복제되는지 확인
- 활성화 시 필수 Layer와 변수 계약 검증
- 이전 Version 롤백 시 전체 설정이 함께 복원되는지 확인
- 관리자 Preview와 Runtime Snapshot의 Effective Prompt Hash 비교
- Prompt Layer 조립 순서 검증
- Repair Scenario별 허용 변수와 미해결 변수 검증

## 9.2 Fail-Closed 테스트

- 활성 Prompt 없음 → Provider 호출 0회
- Model 없음 → Provider 호출 0회
- 필수 Layer 없음 → Provider 호출 0회
- Contract Version 불일치 → Provider 호출 0회
- DB 조회 실패 → 파일·코드 폴백 없이 오류 반환
- 잘못된 Provider Option → 서버 상한 검증 오류

## 9.3 기능 회귀 테스트

- 섹션 키비주얼이 일반 텍스처가 아닌 프로모션 중심 이미지로 생성되는지 확인
- `keyVisualTextPolicy=none`에서 이미지에 DOM 카피가 포함되지 않는지 확인
- 명시 텍스트 모드에서 승인 문구만 사용되는지 확인
- Integrated Brief에 Negative Prompt와 Visual QA Checklist가 유지되는지 확인
- Composition 1차 오류 후 설정의 Repair Prompt로 정상 복구되는지 확인
- 관리자 Prompt 한국어 번역에서 Placeholder와 Markdown 구조가 보존되는지 확인

## 9.4 정적 검사 규칙

정적 검사 대상은 `api/`의 Provider 호출부와 Prompt 조립부로 한정하고 `n8n/`은 제외한다.

차단 예시:

- Provider 요청 인근의 `system`, `input`, `prompt`, `contents`에 긴 문자열 literal 전달
- `promptConfig?.renderedPrompt || [...]` 형태의 폴백
- `FALLBACK_PROMPT`, `DEFAULT_NEGATIVE_PROMPT`, `OUTPUT_GUARD` 자연어 상수
- Prompt 뒤에 Template Literal 자연어를 덧붙이는 코드
- `model || "gpt-*"`, `temperature: <literal>` 형태의 Runtime 기본값
- LLM 입력 Markdown에 `must`, `never`, `do not`, `source of truth` 등의 지시문 삽입

허용 목록:

- 테스트 Fixture와 예상 오류 메시지
- 관리자 일반 UI 문구
- 서버 Validation 오류 문구
- JSON Schema의 Field Name과 Description 중 Provider Prompt로 전달되지 않는 항목
- 보안 Allowlist와 절대 상한

---

## 10. 운영 및 감사 요구사항

- 각 실행에 Prompt Template ID, Version, Effective Prompt Hash를 저장한다.
- Layer별 출처와 Hash를 저장해 코드가 몰래 문장을 추가하지 않았음을 검증한다.
- 관리자 변경 이력에 변경자, 변경 사유, 변경 전후 Diff, 활성화 시각을 기록한다.
- 생성 결과 화면에서 사용한 Prompt Version으로 이동할 수 있게 한다.
- DB 백업에는 Prompt Template과 History가 함께 포함되어야 한다.
- 설정 Export에는 Secret과 사용자 입력 데이터를 포함하지 않는다.
- Prompt Bundle Import는 Draft만 만들고 자동 활성화하지 않는다.

---

## 11. 위험과 대응

| 위험 | 영향 | 대응 |
|---|---|---|
| 코드 Prompt 제거 전에 DB 이관 누락 | 생성 기능 중단 | 타입별 Readiness Gate와 2단계 Release 적용 |
| 관리자가 안전 지침 삭제 | 이미지·출력 품질 저하 | 필수 Layer Schema, 검증, 승인 Workflow 적용 |
| Prompt Layer가 과도하게 분리됨 | 관리 복잡도 증가 | 타입별 필요한 Layer만 노출하고 기본 탭 단순화 |
| 이전 Prompt와 결과 드리프트 | 생성 품질 회귀 | 현행 Effective Prompt Fixture와 Hash 비교 후 활성화 |
| 자유 JSON 오입력 | 실행 오류 | 구조화 UI 우선, 서버 Schema 검증, Preview 필수화 |
| DB 장애 시 전체 LLM 중단 | 기능 가용성 저하 | 의도된 Fail-Closed, 명확한 상태 안내, DB 복구 Runbook |
| 서버 계약까지 관리자 편집 | 보안·무결성 저하 | Contract는 읽기 전용 Version으로 분리하고 코드가 강제 |

---

## 12. 최종 완료 기준

- [ ] `n8n/`을 제외한 애플리케이션 Runtime 코드에 LLM 지시 자연어가 없다.
- [ ] 모든 LLM 호출은 활성 Prompt Version과 Prompt Execution Snapshot을 요구한다.
- [ ] 코드·환경변수·Prompt 파일의 Runtime 폴백이 없다.
- [ ] System Message, Harness, Guard, Repair Prompt, Negative Prompt를 관리자에서 관리할 수 있다.
- [ ] Provider, Model, Temperature, Token과 Response Format이 활성 Version에서만 결정된다.
- [ ] 관리자 Preview와 실제 전송 Prompt의 Hash가 일치한다.
- [ ] 재시도 Prompt를 포함한 모든 LLM 호출의 Prompt Version과 Hash를 감사할 수 있다.
- [ ] 서버 보안·출력 계약은 코드에서 강제되고 설정 화면에 Version이 표시된다.
- [ ] 활성 설정 누락 시 LLM을 호출하지 않는 테스트가 통과한다.
- [ ] 정적 검사에서 신규 하드코딩 Prompt가 차단된다.
- [ ] 운영 Prompt Bundle의 Export, Import, 복구 절차가 문서화되어 있다.

---

## 13. 권장 구현 순서 요약

```text
1. DB Prompt Layer 및 History 확장
2. 관리자 편집·Preview UI 구현
3. 현행 코드 Prompt를 새 Draft Version으로 이관
4. 관리자 검증 및 활성화
5. 공통 Snapshot/Assembler로 Runtime 전환
6. 코드 Prompt, 모델 폴백, 자동 Seed 제거
7. Fail-Closed 및 정적 검사 활성화
8. 운영 Prompt Bundle 백업·복구 검증
```

이번 작업의 핵심은 문구를 단순히 JSON이나 SQL로 옮기는 것이 아니다. 관리자가 보고 수정하고 검증하고 활성화한 하나의 Version과 실제 LLM 입력이 동일하도록 실행 경로와 감사 체계를 함께 일원화하는 것이다.

# Prompt 거버넌스 및 Contextual Inspector 리뷰 보완 개발계획서

## 0. 문서 정보

- 작성일: 2026-08-13
- 대상 프로젝트: `promo_web_builder`
- 문서 상태: 1차 구현 완료·운영 적용 대기
- 기준 리뷰:
  - OpenAI Section Image V3 크기 설정 유실
  - Prompt Migration의 Version 불변성 훼손
  - Effective Prompt Render와 Runtime Snapshot 불일치
  - Visual Editor Contextual Inspector 배치·접근성 미완료
- 선행 문서:
  - `docs/계획/source-code-llm-prompt-setting-centralization-development-plan-2026-08-07.md`
  - `docs/계획/visual-editor-contextual-component-inspector-development-plan-2026-08-10.md`
  - `docs/정책/promo-web-builder-policies-2026-07-23.md`

---

## 1. 목적

이번 작업은 최근 소스 리뷰에서 발견된 네 가지 결함을 수정하면서 Prompt 운영 원칙을 더 강하게 적용하는 것을 목적으로 한다.

핵심 목표는 다음과 같다.

1. OpenAI와 Gemini Section Image가 관리자에서 활성화한 설정만으로 정상 실행된다.
2. Prompt Migration이 기존 Version과 History를 변경하지 않으며 롤백 재현성을 보존한다.
3. 관리자 Preview, `/api/prompts-render`, Queue Snapshot, 실제 Provider 전송 Prompt가 동일한 Effective Prompt와 Hash를 사용한다.
4. 수정 과정에서 추가되거나 변경되는 모든 자연어 Prompt를 `설정 > LLM 및 프롬프트 관리`에서 편집·검증·활성화·롤백할 수 있게 한다.
5. Contextual Inspector가 선택 컴포넌트를 가리지 않고 작은 화면과 키보드 환경에서도 안전하게 작동한다.

---

## 2. 최우선 Prompt 관리 원칙

### 2.1 소스코드에 두지 않는 항목

다음 내용은 JavaScript, Vue, SQL Runtime fallback, 환경변수 또는 Prompt 파일에 신규 하드코딩하지 않는다.

- System Message와 User Prompt Body
- Completion Guard와 후첨 실행 지침
- 검증 실패 후 사용하는 Repair·Retry Prompt
- 이미지 Creative Intent와 금지 요소
- 이미지 내 Text 허용·금지 지침
- Safe Area, 피사체 크기, Negative Prompt 자연어
- Source Data 우선순위를 설명하는 자연어
- 관리자 번역 Prompt
- LLM이 해석해야 하는 오류 보정문과 출력 품질 지침

위 항목은 활성 `prompt_templates` Version의 `body` 또는 `model_options.promptLayers`에서만 공급한다.

### 2.2 소스코드에 유지할 항목

다음은 자연어 Prompt가 아니라 보안·데이터 무결성·결정론적 실행 계약이므로 코드에 유지한다.

- Structured Output JSON Schema와 Contract Version
- 허용 Prompt Type과 Layer Key Schema
- Section, Component, Token, Resource Allowlist
- Provider별 파라미터 이름과 값 범위
- Timeout, Token, 이미지 크기·용량의 절대 상한
- 이미지 Tier·Aspect Ratio를 Provider 요청 크기로 변환하는 결정론적 매핑
- MIME, URL, 이미지 Signature와 해상도 검증
- Effective Prompt의 Layer 조립 순서
- Hash 계산, Snapshot 저장, Revision·권한 검사
- 오류 Code 선택과 HTTP 상태 Code

코드는 `CONTRACT_V3_REPAIR` 같은 의미 Key를 선택할 수 있지만, 해당 Key에 대응하는 자연어 문장은 활성 Prompt Version에서 읽어야 한다.

### 2.3 Fail-Closed

다음 상태에서는 Provider를 호출하지 않는다.

- 활성 Prompt Version 없음
- 필수 Prompt Body 또는 Prompt Layer 없음
- Provider, Model, Response Format 없음
- Provider별 필수 실행 옵션을 결정할 수 없음
- Placeholder 미해결
- Contract Version 또는 Layer Schema 불일치
- 관리자 설정이 서버 Allowlist나 상한 위반

코드·환경변수·파일 Prompt로 조용히 대체하지 않는다.

---

## 3. 리뷰 결함과 수정 방향

## 3.1 OpenAI Section Image V3 크기 설정 유실

### 현상

- OpenAI 이미지 실행은 `modelOptions.size`를 요구한다.
- 관리자 V3 저장 로직과 Migration 036은 `imageSize`, `quality` 등의 구형 값을 제거한다.
- V3의 `generationPolicy.requestedTier`만으로는 현재 OpenAI 요청의 `size`가 채워지지 않는다.
- Draft 검증은 통과해도 실제 실행에서 `PROMPT_CONFIGURATION_REQUIRED`가 발생할 수 있다.

### 수정 원칙

Provider 요청 크기는 자연어 Prompt가 아니므로 코드의 결정론적 Provider Adapter에서 계산한다.

```text
generationPolicy.requestedTier
+ effectiveAspectRatio
+ provider capability
→ provider request size
```

OpenAI는 지원되는 Landscape, Portrait, Square 크기로 변환하고 Gemini는 `1K`, `2K`, `4K` Tier를 그대로 사용한다. 임의 기본값을 적용하지 않고 활성 Prompt Version의 `generationPolicy`와 `modelCapabilitySnapshot`이 완전할 때만 계산한다.

### 작업

1. `modelCapabilitySnapshot`에 Provider별 지원 크기 계약을 추가한다.
2. `resolveOpenAiImageSize()`를 결정론적 Adapter 함수로 구현한다.
3. `generationPolicy.requestedTier`, Effective Aspect Ratio, 지원 Size를 입력으로 사용한다.
4. 지원할 수 없는 조합은 `PROMPT_PROVIDER_OPTION_UNSUPPORTED`로 실행 전에 거부한다.
5. 관리자 UI에서 Provider별 Effective 요청 크기를 읽기 전용으로 미리 보여준다.
6. `modelOptions.size` 직접 입력을 유지한다면 Provider 고급 설정으로 관리하고 Tier 계산과 충돌 시 저장을 거부한다.

### 완료 조건

- OpenAI V3 Section Background와 Component Image가 활성 설정만으로 실행된다.
- Gemini 1K·2K·4K 동작이 유지된다.
- 관리자 검증 단계와 실제 실행 단계가 동일한 Size 결정 함수를 사용한다.
- Provider 옵션 누락 시 네트워크 호출 전 명확한 설정 오류가 반환된다.

---

## 3.2 Prompt Migration의 Version 불변성 복구

### 현상

현재 Migration 056 초안은 같은 타입의 active, inactive, draft, validated Version을 직접 수정하며 기존 `promptLayers`를 대체할 수 있다. History가 추가되지 않으므로 과거 Version 롤백과 감사 결과가 원래 상태를 재현하지 못한다.

### 수정 원칙

- 기존 Prompt Version은 수정하지 않는다.
- 각 Lineage의 현재 active Version을 Source로 새 Draft Version을 생성한다.
- Prompt Layer 자연어 이관도 새 Draft의 `model_options`에만 기록한다.
- 관리자가 Preview·Diff를 확인하고 Validate·Activate해야 Runtime에 반영된다.
- Migration 실행만으로 active Prompt가 바뀌지 않는다.

### 작업

1. 운영 DB에 Migration 056이 적용됐는지 먼저 확인한다.
2. 미적용 상태이면 현재 056을 배포 전에 Version 생성 방식으로 수정한다.
3. 이미 적용된 환경이 있으면 기존 056을 재작성하지 않고 057 보정 Migration을 추가한다.
4. 타입별 active Source에서 `max(version) + 1` Draft를 생성한다.
5. 기존 `promptLayers`와 신규 Layer는 Deep Merge하되 동일 Key 충돌을 자동 덮어쓰지 않는다.
6. 충돌 내역을 `change_note`와 관리자 Diff에 표시한다.
7. `prompt_template_histories`에 Source와 Draft의 Body, Model, Options 차이를 기록한다.
8. Draft·Validated 후보가 이미 있으면 임의로 수정하지 않고 Migration을 중단하거나 별도 후보를 생성한다.
9. Migration 재실행 시 중복 Draft가 생기지 않도록 Source ID와 Migration Code 기반 멱등 Key를 둔다.

### 완료 조건

- 과거 active/inactive/validated/draft row의 Hash가 Migration 전후 동일하다.
- 새 Prompt Layer는 새 Draft Version에만 존재한다.
- Rollback 시 선택한 과거 Version의 Body·Layer·Model·Hash가 그대로 복원된다.
- Migration 재실행 결과가 멱등적이다.

---

## 3.3 Effective Prompt 단일 조립기 도입

### 현상

- `/api/prompts-render`는 Prompt Body만 렌더링한다.
- Runtime Snapshot은 `sourceDataPolicy`, `completionGuard`, Harness 지침을 추가한다.
- 동일 Version과 변수라도 Preview와 실제 Provider의 Prompt·Hash가 달라질 수 있다.

### 목표 구조

```text
Active Prompt Version
  + 실행 변수
  + Prompt Layers
  + 오류 Code별 Repair Layer(필요 시)
        ↓
PromptAssembler
        ↓
Effective Prompt / Messages
  + Layer Source Map
  + Layer Hash
  + Final Hash
        ├─ 관리자 Preview
        ├─ /api/prompts-render
        ├─ Queue Execution Snapshot
        ├─ Retry Snapshot
        └─ Provider Adapter
```

### PromptAssembler 계약

조립 순서는 코드에 고정하되 각 단계의 자연어는 설정에서 읽는다.

```text
System Message
→ Pre Instructions
→ Rendered Body
→ Conditional Instructions
→ Source Data Policy
→ Post Instructions
→ Completion Guard
→ Negative Instructions
→ 선택된 Repair Prompt
```

### 작업

1. 공통 `PromptAssembler` 모듈을 추가한다.
2. `createPromptExecutionSnapshot()`의 현재 Layer 결합 로직을 공통 모듈로 이동한다.
3. `/api/prompts-render`가 같은 조립기를 사용하도록 변경한다.
4. 관리자 Preview API도 Draft 또는 Active Version을 지정해 같은 조립기를 호출하도록 한다.
5. Layer별 `source`, `key`, `templateHash`, `renderedHash`를 반환한다.
6. Repair 재시도는 최초 Snapshot을 기반으로 Repair Layer만 추가한 새 Attempt Snapshot을 만든다.
7. Provider가 Snapshot 이후 자연어를 추가하지 못하도록 Adapter 입력을 축소한다.
8. Prompt Body뿐 아니라 적용 Layer에서도 Placeholder를 검증한다.
9. 지원하지 않는 Layer Key를 저장·검증 단계에서 거부한다.

### 완료 조건

- 동일 Version·변수·Attempt는 모든 경로에서 동일한 Effective Prompt Hash를 생성한다.
- 관리자 Preview에 표시된 Prompt와 실제 Provider 전송 Prompt가 일치한다.
- 최초 실행과 Repair 실행의 Hash와 적용 Layer를 각각 감사할 수 있다.
- Provider Adapter 내부에 자연어 후첨 코드가 없다.

---

## 3.4 관리자 LLM 설정 페이지 보완

현재의 JSON 편집 영역은 유지하되 주요 Prompt Layer를 구조화된 필드로 제공한다.

### 공통 화면

1. 기본 Prompt
   - System Message
   - User Prompt Body
   - 변수 계약
2. 실행 지침
   - Pre/Post Instructions
   - Source Data Policy
   - Completion Guard
3. 실패·재시도
   - 오류 Code별 Repair Prompt
   - 최대 재시도 횟수
4. 이미지 지침
   - Creative Intent
   - Safe Area
   - Key Visual Text 정책
   - Subject Scale 문장 Template
   - Negative Rules
5. Provider 설정
   - Provider, Model, Temperature, Token
   - Image Tier, Quality, MIME
   - Provider Capability와 Effective Size Preview
6. 실행 계약
   - Contract Key·Version
   - 허용 Layer Key
   - 서버 상한
7. 최종 Prompt 미리보기
   - 예제 변수
   - Layer 출처
   - Effective Prompt와 Hash

### 저장 규칙

- Draft만 수정 가능하다.
- 빈 필수 Layer는 Validate할 수 없다.
- Prompt Layer 변경은 Body·Model 변경과 같은 Version History에 기록한다.
- 활성 Version을 직접 수정하지 않는다.
- 고급 JSON 편집과 구조화 필드가 충돌하면 저장하지 않고 충돌 위치를 표시한다.
- 새 Prompt Type 추가 시 `PROMPT_TYPES`, Layer Schema, 관리자 Label, Migration Draft, 테스트를 하나의 변경 단위로 처리한다.

---

## 3.5 Contextual Inspector 배치·접근성 완성

### 현상

- 현재 배치는 Right 또는 Left만 선택한다.
- 양쪽 공간이 부족하면 clamp되어 선택 컴포넌트를 덮을 수 있다.
- Bottom/Top, 작은 화면 Bottom Sheet, Outside Click, Esc 후 Focus Return이 미완료다.

### 작업

1. 배치 계산을 순수 함수 또는 Composable로 분리한다.
2. `right → left → bottom → top` 순서로 선택하되 실제 가림 면적을 함께 계산한다.
3. 어느 방향도 안전하지 않으면 320px·200% Zoom 기준 Bottom Sheet로 전환한다.
4. Preview Panel 경계와 Window 경계를 모두 반영한다.
5. Popover, Text Toolbar, Resize Handle의 충돌 영역을 계산한다.
6. Outside Click을 구현하되 Select, Range, Portal 내부 상호작용은 제외한다.
7. Esc로 닫을 때 선택된 Preview Component 또는 StructurePanel 항목으로 Focus를 복귀한다.
8. Preview Scroll, Window Resize, Desktop/Mobile 전환, Component Resize 시 Anchor를 재측정한다.
9. Multi-select에서 단일 Component 편집 UI를 숨기고 공통 AI Layout 제어만 노출한다.
10. `prefers-reduced-motion`에서 전환 효과를 최소화한다.

### 완료 조건

- Inspector가 선택 Component와 Resize Handle을 가리지 않는다.
- Right/Left/Bottom/Top 배치와 Bottom Sheet가 테스트된다.
- Close, Esc, Outside Click, Section 변경이 일관되게 동작한다.
- 키보드만으로 선택·열기·편집·닫기·Focus 복귀가 가능하다.
- 320px Reflow와 200% Zoom을 통과한다.

---

## 3.6 AI 생성 중 Provider·Model 표시

### 사용자 목적

사용자는 생성 요청이 실제 AI 작업으로 연결됐는지, 현재 어떤 AI Provider와 Model이 작업하는지 확인할 수 있어야 한다. 세부 진행률은 표시하지 않고 생성 중임을 나타내는 점멸 문구와 간단한 실행 정보만 제공한다.

예시:

```text
Hero 키비주얼을 생성 중입니다…
[OpenAI Icon] OpenAI · GPT Image 1
```

```text
프로모션 구조를 생성 중입니다…
[Google Icon] Google · Gemini 3.1 Flash
```

### 표시 원칙

- 생성 문구는 작업이 진행되는 동안 부드럽게 점멸한다.
- `prefers-reduced-motion: reduce`에서는 점멸하지 않고 고정 문구로 표시한다.
- Provider Icon, Provider 이름, Model 이름만 간결하게 표시한다.
- Temperature, Token, Prompt ID, Prompt Hash와 내부 Version ID는 일반 사용자 화면에 표시하지 않는다.
- 관리자·디버그 화면에서는 Prompt Version과 Snapshot Hash를 별도 상세 정보로 확인할 수 있다.
- 버튼 클릭 시 프런트에서 Provider와 Model을 추측하지 않는다.
- Queue 생성 시 서버가 고정한 Execution Snapshot의 `provider`와 `model`만 표시한다.
- Provider Routing 또는 Fallback이 발생하면 실제 실행 결과의 Provider·Model로 갱신하고 변경 사실을 감사 로그에 남긴다.
- Icon은 외부 URL에 의존하지 않고 승인된 로컬 Asset 또는 공통 Icon Registry를 사용한다.
- Icon만으로 Provider를 구분하지 않고 항상 텍스트 Label을 함께 표시한다.

### 데이터 계약

사용자 응답에는 전체 Prompt Snapshot을 노출하지 않고 표시 전용 정보를 제공한다.

```ts
interface AiExecutionDisplay {
  taskType: string;
  targetLabel: string;
  providerKey: "openai" | "google" | string;
  providerLabel: string;
  modelKey: string;
  modelLabel: string;
  iconKey: string;
}
```

- `providerKey`, `modelKey`는 활성 Prompt Execution Snapshot에서 가져온다.
- `providerLabel`, `modelLabel`, `iconKey`는 서버의 허용된 표시 Catalog에서 변환한다.
- API Key, Provider Request Body, 원본 Prompt, 내부 Credential 정보는 포함하지 않는다.
- 알 수 없는 Provider나 Model은 임의 이름을 만들지 않고 안전한 Text fallback을 표시한다.

### UI 상태

```text
isGenerating = true
  → 생성 중 문구 점멸
  → Execution Display 노출

isGenerating = false
  → 생성 중 Indicator 제거
  → 성공 또는 실패 상태 문구 표시
```

생성 상태 문구는 LLM Prompt가 아니라 일반 UI 문구이므로 `설정 > LLM 및 프롬프트 관리`가 아닌 i18n·Locale 메시지에서 관리한다. Provider·Model 값은 LLM 설정의 활성 Version을 실행 기준으로 사용한다.

### 적용 대상

- 프로모션 개요 분석
- 프로모션 구조·Composition 생성
- 자연어 Composition 수정
- Section Layout 생성
- Hero Section Key Visual 생성
- Component Image 생성
- Integrated Brief 생성
- LO-FI Draft와 Final Design 생성
- 관리자 Prompt 번역

### 완료 조건

- 생성 중 문구 아래에 실제 Execution Snapshot의 Provider와 Model이 표시된다.
- 관리자에서 활성 Model을 변경하면 새 작업부터 표시 정보도 함께 변경된다.
- 이미 Queue되거나 실행 중인 작업은 기존 Snapshot 정보를 유지한다.
- Provider fallback이 발생하면 완료 결과와 감사 정보에 실제 Provider·Model이 기록된다.
- 화면에 Credential, Prompt Body 또는 내부 요청 정보가 노출되지 않는다.
- 키보드와 Screen Reader가 생성 문구와 Provider·Model 정보를 읽을 수 있다.

---

## 4. 단계별 구현 계획

## Phase 0 — 기준선과 운영 상태 확인

- [ ] Migration 056의 운영·Preview·개발 DB 적용 여부 확인
- [ ] 타입별 active Prompt ID, Version, Hash Export
- [ ] Prompt History와 기존 Draft·Validated 후보 확인
- [ ] OpenAI/Gemini Section Image 활성 설정 Snapshot 확보
- [ ] 현재 `/api/prompts-render`와 Runtime Snapshot Hash 차이 Fixture 작성
- [ ] Contextual Inspector Desktop/Mobile/320px 기준 화면 캡처

완료 Gate:

- 변경 전 DB와 Runtime 상태를 복구 가능한 형태로 보존한다.
- Migration 수정 또는 후속 Migration 추가 여부가 결정된다.

## Phase 1 — Provider 이미지 옵션 계약 수정

- [ ] Provider Capability Schema 추가
- [ ] OpenAI Effective Size Resolver 구현
- [ ] 관리자 Provider 옵션 검증과 Effective Size Preview 추가
- [ ] OpenAI/Gemini V2·V3 회귀 테스트 추가
- [ ] 누락·미지원 조합 Fail-Closed 테스트 추가

완료 Gate:

- 실제 네트워크 호출 직전 요청 Body가 활성 설정과 일치한다.
- OpenAI와 Gemini의 지원 조합이 모두 계약 테스트를 통과한다.

## Phase 2 — PromptAssembler와 Preview 일원화

- [ ] 공통 PromptAssembler 구현
- [ ] Execution Snapshot 적용
- [ ] `/api/prompts-render` 적용
- [ ] Repair Attempt 적용
- [ ] Layer Placeholder 검증 적용
- [ ] Layer Source Map·Hash 저장

완료 Gate:

- Preview, API Render, Runtime Snapshot, Provider 요청 Hash parity 테스트가 통과한다.

## Phase 3 — Version 안전 Migration과 관리자 UI

- [ ] Migration 056 수정 또는 057 보정 Migration 작성
- [ ] 새 Draft Version·History 생성 계약 구현
- [ ] Prompt Layer Deep Merge 충돌 검사
- [ ] 관리자 구조화 Layer UI 추가
- [ ] Draft Diff와 Effective Prompt Preview 보완
- [ ] Validate·Activate·Rollback 브라우저 테스트 추가

완료 Gate:

- 기존 Version Hash 불변성과 새 Draft 활성화·롤백이 증명된다.
- Prompt 자연어 수정이 소스 배포 없이 관리자 Version 전환으로 가능하다.

## Phase 4 — Contextual Inspector 완성

- [ ] Placement 함수와 테스트
- [ ] Bottom Sheet 전환
- [ ] Outside Click·Focus Return
- [ ] Scroll·Resize·Viewport 재배치
- [ ] Multi-select 분기
- [ ] 접근성·시각 QA

완료 Gate:

- Desktop, Mobile, 320px, 200% Zoom Browser E2E가 통과한다.

## Phase 5 — AI 실행 Indicator와 Provider·Model 표시

- [ ] Execution Snapshot 기반 `AiExecutionDisplay` 응답 계약 추가
- [ ] Provider·Model 표시 Catalog와 로컬 Icon Asset 추가
- [ ] 공통 생성 중 Indicator Component 구현
- [ ] 생성 중 Text Pulse와 Reduced Motion 처리
- [ ] AI Builder, Section AI, Generation Run 화면에 공통 적용
- [ ] Queue Snapshot과 UI 표시 정보 parity 테스트
- [ ] Provider fallback·알 수 없는 Model 표시 테스트
- [ ] i18n·Locale 상태 문구 추가

완료 Gate:

- 실제 실행 Snapshot과 화면의 Provider·Model이 일치한다.
- 진행률 없이 생성 중 여부와 AI 실행 주체를 명확히 인지할 수 있다.

## Phase 6 — 통합 검증과 운영 전환

- [ ] `scripts/test-no-hardcoded-runtime-prompts.js` 검사 범위 보강
- [ ] 전체 120개 이상 테스트 실행
- [ ] Admin·Visual Editor Build
- [ ] Node 22.x 최종 검증
- [ ] 실제 OpenAI/Gemini Section Image 각 1회 이상 검증
- [ ] Prompt Draft→Preview→Validate→Activate→실행→Rollback E2E
- [ ] Contextual Inspector 저장·Reload·Undo/Redo 검증

완료 Gate:

- 미분류 실패가 없다.
- 운영 Prompt Version과 배포 Commit, Migration 상태가 기록된다.

---

## 5. 예상 변경 파일

| 영역 | 예상 파일 | 변경 내용 |
|---|---|---|
| Prompt 조립 | `api/_prompt-execution-snapshot.js` | 공통 Assembler 사용, Layer Hash 저장 |
| Prompt 조립 | `api/_prompt-template-store.js` | Layer Schema·검증 계약 |
| Prompt 조립 | 신규 `api/_prompt-assembler.js` | Effective Prompt 단일 조립기 |
| Prompt Render | `api/prompts-render.js` | Runtime과 동일 조립·Hash 사용 |
| Repair | `api/_promo-page-composition-service.js` | Repair Layer 기반 Attempt Snapshot |
| Image Provider | `api/_promo-section-design-provider.js` | Provider별 Effective Size 적용 |
| Image Control | `api/_section-ai-control-plane.js` | Capability·Size 검증 |
| Admin UI | `prototype/app.js`, `prototype/index.html` | 구조화 Layer와 Effective Preview |
| Admin Source | `admin-app/src/services/prompt-template-group-service.mjs` | 신규 Layer Label·메타데이터 |
| Migration | `db/migrations/056_...sql` 또는 신규 `057_...sql` | Version 안전 Draft 이관 |
| Inspector | `ComponentInspectorPopover.vue` | 배치·Outside Click·Focus |
| Inspector | `PreviewPanel.vue` | Anchor·Focus Target·경계 Event |
| Inspector | 신규/기존 Composable | Placement·Bottom Sheet 계산 |
| Inspector CSS | `visual-editor/src/styles.css` | 방향별 배치·반응형 Sheet |
| AI Indicator | 공통 Vue Component | 생성 중 Text Pulse와 실행 정보 표시 |
| AI Indicator | Generation·Composition API 응답 | 표시용 Provider·Model Metadata |
| AI Indicator | Provider Icon Registry·Locale | 로컬 Icon과 사용자 상태 문구 |
| 테스트 | `scripts/test-no-hardcoded-runtime-prompts.js` | Prompt 자연어 재유입 차단 강화 |
| 테스트 | Prompt·Provider·Migration 계약 테스트 | Hash, Version, Size 검증 |
| 테스트 | Visual Editor Browser Test | Placement·접근성·반응형 검증 |

정적 Bundle은 Source 수정 후 같은 Commit에서 다시 생성하고 함께 검증한다.

---

## 6. 테스트 계획

### 6.1 Prompt 거버넌스

- Runtime API에 신규 자연어 Prompt literal이 없는지 검사
- 환경변수와 Prompt 파일 fallback이 없는지 검사
- 필수 Layer 누락 시 Provider 미호출 확인
- 미지원 Layer Key와 미해결 Placeholder 거부
- Active Version 직접 수정 거부
- Draft Diff에 Body·Layer·Model 변경 표시

### 6.2 Effective Prompt Hash

- 동일 Version·변수의 Preview/API/Snapshot Hash 일치
- Completion Guard와 Source Data Policy 포함 확인
- Repair 실행 전후 Hash 분리
- Layer 순서 변경 시 Hash 변경
- 동일 입력 재시도 시 Hash 안정성

### 6.3 Migration

- 기존 모든 Version의 Hash 불변
- 신규 Draft Version 번호와 Lineage 일치
- History 생성 확인
- 기존 Draft 충돌 방어
- Migration 재실행 멱등성
- 활성화 후 이전 Version Rollback 재현

### 6.4 이미지 Provider

- OpenAI Square/Landscape/Portrait 요청 Size
- Gemini 1K/2K/4K 요청 Tier
- MIME·Quality·Aspect Ratio 전달
- 미지원 Tier·Ratio 조합 거부
- Section Background와 Component Image 분리
- `section-key-visual` 정책 유지

### 6.5 Contextual Inspector

- Right/Left/Bottom/Top 선택
- 선택 대상과 Handle 비가림
- Preview Scroll 추적
- Desktop/Mobile 전환 재배치
- Outside Click과 Portal 내부 클릭 구분
- Esc Close와 Focus Return
- Multi-select 단일 편집 차단
- 320px·200% Zoom Bottom Sheet
- 편집 후 Undo/Redo·Save·Reload 보존

### 6.6 AI 실행 Indicator

- Queue Snapshot의 Provider·Model과 UI 표시 값 일치
- 관리자 Model 변경이 새 작업에만 반영되는지 확인
- 이미 Queue된 작업의 Snapshot 표시 불변
- OpenAI·Google Icon과 Text Label 동시 표시
- 알 수 없는 Provider·Model의 안전한 fallback
- Provider fallback 후 실제 실행 정보 기록
- 생성 종료 후 점멸 Animation 제거
- Reduced Motion에서 Animation 비활성
- Screen Reader `role="status"`, `aria-live="polite"` 확인
- 응답에 Credential·Prompt Body가 포함되지 않는지 확인

---

## 7. 배포 및 롤백

### 배포 순서

1. DB와 Prompt Version 백업
2. PromptAssembler 및 Provider 호환 코드 배포
3. Version 안전 Migration 실행
4. 관리자에서 신규 Draft 검토·Preview·Validate
5. Prompt Type별 순차 활성화
6. Hash parity와 실제 Provider 실행 확인
7. Contextual Inspector 배포 및 브라우저 검증
8. Node 22 전체 Test·Build 증거 확보

### 롤백

- Prompt 문제는 코드 하드코딩으로 되돌리지 않는다.
- 이전 Prompt Version을 관리자 Lifecycle로 재활성화한다.
- Provider Adapter 문제는 이전 Application Release로 되돌리되 Prompt DB는 보존한다.
- Contextual Inspector 문제는 데이터 계약 변경 없이 이전 UI Release로 되돌린다.
- 이미 적용된 Migration은 과거 Version row를 수정하는 Down Migration을 사용하지 않고 Forward Repair한다.

---

## 8. 최종 완료 정의

- [ ] 추가·수정된 모든 자연어 Prompt를 관리자 LLM 설정에서 관리할 수 있다.
- [ ] 소스코드에 신규 Prompt Body, Guard, Repair, 이미지 지시문이 없다.
- [ ] 활성 설정 누락 시 코드 fallback 없이 실행이 중단된다.
- [ ] OpenAI와 Gemini Section Image V3가 관리자 설정만으로 정상 실행된다.
- [ ] Prompt Migration이 기존 Version과 History를 변경하지 않는다.
- [ ] Preview와 실제 Provider 전송 Prompt의 Hash가 일치한다.
- [ ] Repair Prompt의 Version, Layer, Hash를 감사할 수 있다.
- [ ] Contextual Inspector가 선택 대상을 가리지 않는다.
- [ ] Outside Click, Esc, Focus Return, Bottom Sheet가 작동한다.
- [ ] 생성 중 문구 아래에 실제 실행 Provider와 Model이 간결하게 표시된다.
- [ ] Provider·Model은 활성 Prompt Execution Snapshot을 기준으로 하며 프런트에서 추측하지 않는다.
- [ ] 생성 상태 문구는 i18n·Locale에서 관리되고 LLM Prompt 설정과 분리된다.
- [ ] 전체 테스트와 Admin·Visual Editor Build가 Node 22.x에서 통과한다.
- [ ] 운영 Prompt Version, Migration, 배포 Commit과 검증 결과가 문서화된다.

---

## 9. 권장 착수 순서

1. Migration 056 적용 여부와 운영 Prompt Snapshot 확인
2. OpenAI V3 Size Resolver와 회귀 테스트
3. PromptAssembler 추출 및 Hash parity 테스트
4. Version 안전 Migration 작성
5. 관리자 Prompt Layer 구조화 UI와 Effective Preview
6. Contextual Inspector Placement·Focus 보완
7. 공통 AI 실행 Indicator와 Provider·Model 표시
8. 전체 Test·Build와 실제 Provider E2E
9. 운영 Draft 활성화와 Rollback 검증

첫 배포 단위는 **Provider Size 계약과 PromptAssembler parity**로 제한한다. Migration과 관리자 Prompt 활성화는 이 두 계약이 검증된 뒤 진행한다.

---

## 10. 1차 구현 결과 (2026-08-13)

### 완료

- OpenAI 이미지 요청 크기를 Aspect Ratio와 Model Capability에서 결정하는 Resolver 구현
- OpenAI·Gemini Provider 요청 크기 및 출력 해상도 계약 테스트 보강
- `PromptAssembler` 단일 조립 경로 도입 및 Runtime·Render API 통합
- 변수 값 안에 의도적으로 포함된 Placeholder를 재해석하지 않는 번역 안전성 보완
- 기존 활성 Version을 직접 수정하지 않고 신규 Draft와 History를 만드는 Migration 056 작성
- Contextual Inspector의 Right→Left→Bottom→Top→Bottom Sheet 배치 구현
- Window Resize 재배치, Outside Click, ESC, 편집기 이벤트 우선순위, Focus Return 구현
- 생성 중 문구 점멸 및 Reduced Motion 대응
- 활성 Prompt 설정과 Queue Snapshot을 기준으로 Provider Icon·Provider·Model 표시
- Credential와 Prompt Body를 제외한 실행 표시 전용 API 추가
- Visual Editor Production Build 성공
- 전체 122개 계약·동작·브라우저 테스트 통과

### 운영 적용 전 남은 작업

- 운영 DB 백업 후 Migration 056 적용
- 관리자에서 생성된 Draft의 Preview·Validate·Activate 수행
- 실제 Provider Credential 환경에서 OpenAI·Gemini E2E 및 Prompt Hash 감사
- 신규 UI 문구의 Locale Message Store 편입
- 배포 Commit·Prompt Version·활성화 기록 문서화

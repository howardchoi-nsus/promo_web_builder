# 하드코딩된 LLM 프롬프트 검토 리포트 (2026-07-28)

## 결론

소스코드에 LLM 프롬프트/지시문이 **다수 하드코딩되어 있다.** 다만 성격이 4가지로 갈린다.

| 구분 | 성격 | 판정 |
|---|---|---|
| A. `_prompt-template-store.js`의 `PROMPT_TYPES` 기본 본문 | 설계상 의도된 recovery baseline (DB seed용) | 허용 (단, 드리프트 관리 필요) |
| B. 실행 시 무조건 덧붙는 guard 문장 | admin control plane 우회 | **이슈** |
| C. provider 레이어 fallback 프롬프트 | admin 프롬프트 없이도 실행 가능 | **이슈 (P1)** |
| D. `api/prompts/*.js`의 `FALLBACK_PROMPT` | 구버전 프롬프트가 조용히 서빙됨 | **이슈 (P1)** |
| E. LLM 입력 MD 생성기 내부 규칙 문장 | 사실상 프롬프트의 일부 | 검토 필요 |
| F. n8n 워크플로 jsCode 내 system 메시지 | control plane 밖 | **이슈 (P1/P2)** |

프론트엔드(`prototype/`, `admin-app/`, `visual-editor/`)에는 프롬프트 문구 하드코딩이 **없다.** 프롬프트 관리 UI 상태값만 존재하므로 양호하다.

---

## 이슈 요약 (우선순위)

### P1-1. `api/prompts/*.js` 임베디드 FALLBACK_PROMPT — 구버전 프롬프트 silent 서빙

- `api/prompts/promo-integrated-design-brief-generation.js` **L82~164** — 83줄 전체 프롬프트 하드코딩
- `api/prompts/promo-ui-design-image-generation.js` **L50~125** — 76줄 전체 프롬프트 하드코딩

**왜 있는가:** DB(`prompt_templates`) 조회와 `prompts/*.md` 파일 읽기가 모두 실패했을 때 n8n 워크플로가 멈추지 않도록 하는 최종 안전망.

**문제:**
- 원본 `prompts/promo-integrated-design-brief-generation.md`는 **323줄**인데 fallback은 **83줄**이다. 이미 내용이 크게 벌어져 있다(버전 드리프트).
- 실패 시 HTTP **200 OK**로 응답하고 `warning` 필드만 붙인다. n8n 쪽은 `loadedPrompt.prompt`만 읽으므로 **경고를 감지하지 못하고 구버전 프롬프트로 정상 실행된다.**
- `api/prompts/promo-page-generation.js`는 fallback 없이 500을 반환한다. 세 핸들러의 실패 정책이 서로 다르다.

### P1-2. `_promo-section-design-provider.js` — control plane 우회 fallback

`api/_promo-section-design-provider.js` **L278~286** (`generateSectionDesignPlan`)

```js
const prompt = promptConfig?.renderedPrompt || [
  "Plan one promotional web section using only the supplied component instances, ...",
  "Never invent item keys, regions, slots, tokens, CSS, selectors, HTML, ...",
  ...
].join("\n");
```

**문제:** 같은 파일의 `generateMultiComponentLayoutPlan`(L300~), `generateSectionCompositionPlan`(L329~)은 `renderedPrompt`가 없으면 `throw`한다. **`generateSectionDesignPlan`만 유일하게 fallback을 허용**하므로, 관리자 프롬프트가 비활성/누락된 상태에서도 코드에 박힌 프롬프트로 실행이 성립한다. 프롬프트 lifecycle 정책과 모순.

부수적으로 모델도 `process.env.SECTION_LAYOUT_MODEL || "gpt-4.1-mini"`로 이중 하드코딩되어 있다(L277).

### P1-3. `n8n/design-md-concept-analyzer.workflow.json` — control plane 밖 프롬프트

"Build Concept Analysis Prompt" 코드 노드 내부에 system + user 프롬프트가 **전부 하드코딩**되어 있고 `/api/prompts/...` 로드가 없다.

```js
const system = 'You are a senior brand design systems analyst. Return valid JSON only.';
const user = `Analyze the provided design markdown and extract ...`;
```

**왜 있는가:** Design MD 개념 분석은 prompt control plane 도입 이전에 만들어진 파이프라인으로 보인다. 관리자 화면에서 수정 불가.

### P2-1. `_prompt-execution-snapshot.js` — 실행 시 무조건 append 되는 guard

`api/_prompt-execution-snapshot.js` **L17~25 `INTEGRATED_BRIEF_OUTPUT_GUARD`**, 적용은 L74~76.

```js
let renderedPrompt = type === "integrated_brief"
  ? `${fitted.renderedPrompt.trim()}\n${INTEGRATED_BRIEF_OUTPUT_GUARD}`
  : fitted.renderedPrompt;
```

**왜 있는가:** LLM이 응답이 길어질 때 `## Negative Prompt` / `## Visual QA Checklist` 섹션을 누락시키는 문제를 막기 위한 완결성 가드.

**문제:** 관리자가 DB에서 편집할 수 없는 프롬프트가 실행 프롬프트에 끼어든다. `renderedPromptHash`에는 반영되지만, 관리자 화면에서 보이는 프롬프트 본문과 실제 전송 프롬프트가 달라진다. 다른 타입(`section_layout_planner` 등)은 `harnessConfig.additionalInstructions`(DB 관리)로 같은 일을 하고 있으므로(L86~96) 여기만 예외다.

### P2-2. n8n system role 메시지 하드코딩

user 프롬프트는 `/api/prompts/...`에서 외부 로드하면서 **system 메시지만 jsCode에 박아둔** 패턴이 반복된다.

- `n8n/promo-ui-design-image-generator.workflow.json` → "Build Integrated Design Brief Request"
- `n8n/promo-ai-page-generator.workflow.json`
- `n8n/Promo AI Desktop Page Generator.external-prompt.fixed.json`
- `n8n/Promo UI Design Image Generator_testing.gemini-http.json`
- `n8n/Promo UI Design Image Generator_test (2).gemini-fixed.json`

예: `'You are a senior product UI design systems architect. Return valid JSON only. Create a complete, self-contained Integrated Design Brief MD ...'`

참고로 `Promo Lo-Fi Draft Worker.admin-driven.json`, `Promo Final Design Worker.*.json`은 `renderedPrompt`만 사용한다. **이 3개가 올바른 기준선이다.**

---

## 카테고리 A — 의도된 하드코딩 (repository default)

`api/_prompt-template-store.js`

- **L9~238 `PROMPT_TYPES`** — 11개 프롬프트 타입 중 `integrated_brief`만 `prompts/*.md` 파일에서 읽고, 나머지 10개는 본문이 JS 문자열 배열로 하드코딩:
  `image_execution`(L28~56), `lofi_draft`(L57~76), `final_design`(L77~105), `section_layout_planner`(L106~118), `multi_component_layout_planner`(L119~137), `section_composition_planner`(L138~157), `promo_overview_parser`(L158~176), `promo_template_recommender`(L177~190), `promo_template_composer`(L191~205), `section_background_image`(L206~222), `component_image`(L223~237)
- **L240~332 `DEFAULT_MODEL_SETTINGS`** — provider/model/temperature/maxTokens/responseFormat. 모델명 리터럴: `gpt-4o-mini`, `gpt-4.1-mini`, `gpt-image-1`, `gemini-3.1-flash-image`. 일부는 `SECTION_LAYOUT_MODEL`, `SECTION_IMAGE_MODEL`, `SECTION_IMAGE_PROVIDER` env로 override.
- **L345~369 `DEFAULT_IMAGE_HARNESS_CONFIG`** — safeArea 지시문 4종, `sectionBackgroundRules` 5줄, `componentImageRules`, `negativeRules` 3줄. `{{aspectRatio}}`, `{{backgroundColor}}` 치환 변수 포함.
- **L371~459 `defaultPromptControlPlane()`** — runtime/generation/render/validation 정책 기본값.

**왜 있는가:** 파일 상단 L7~8 주석이 명시한다.

> Prompt templates are DB-managed after first boot, but repository defaults remain the recovery baseline for new environments and accidental table resets.

`ensureDefaultPromptTemplates()`(L501~567)가 `where not exists (select 1 from prompt_templates where type = ...)` 조건으로만 insert하고, 이미 active가 있으면 `draft`로 넣어 **관리자 편집분을 덮어쓰지 않는다.** 설계 의도는 타당하다.

**남는 리스크:** `integrated_brief`만 `.md` 파일 소스이고 나머지는 JS 소스라 프롬프트 원본 위치가 이원화되어 있다. 또한 `prompts/` 폴더의 md 4종과 `api/prompts/*.js`의 FALLBACK 2종이 서로 동기화되지 않는다.

- `prompts/promo-integrated-design-brief-generation.md` (323줄)
- `prompts/promo-ui-design-image-generation.md` (82줄)
- `prompts/promo-page-generation.md` (86줄)
- `prompts/promo-Design Token Extraction Prompt` (79줄, 확장자 없음 — 어디서도 로드되지 않는 것으로 보임)

---

## 카테고리 E — LLM 입력 문서 생성기 내부의 규칙 문장

프롬프트 파일은 아니지만 **LLM에 그대로 전달되는 지시문**이므로 사실상 프롬프트다.

- `api/_promo-markdown-builders.js` — Section Input Log MD 조립 시 규칙 문장 하드코딩
  - L139 시장/지역 표기 금지 규칙
  - L151 "Visible UI copy should come from Section Content Mapping first..."
  - L173 "Rendering rule: Do not render this section as visible page content."
  - L206 Raw Payload Snapshot 우선순위 규칙
- `api/_design-md-data.js` **L813~827** — `generationGuidance`, `promoPageImplications`(hero/contentSections/cta/legal/desktopLayout) 문장
- `api/promo-generation-integrated-brief-complete.js` **L9~14 `DEFAULT_NEGATIVE_PROMPT`** — LLM이 negativePrompt를 비워 반환할 때 서버가 채워 넣는 값 (적용 L245). 계약 테스트가 이 상수에 직접 의존한다(`scripts/test-integrated-brief-completion-contract.js` L61, L64).

---

## 권고 (요청 시 상세 설계안 제공)

1. **P1-1** — `api/prompts/*.js`의 `FALLBACK_PROMPT` 제거 후 502/503 실패로 전환하거나, 최소한 fallback 사용 시 응답 상태코드를 비200으로 바꿔 n8n에서 감지 가능하게 한다. 유지한다면 `prompts/*.md`와의 동기화를 계약 테스트로 강제한다.
2. **P1-2** — `generateSectionDesignPlan`의 fallback 프롬프트를 제거하고 다른 planner와 동일하게 `PROMPT_REQUIRED` throw로 통일한다.
3. **P1-3** — `design-md-concept-analyzer` 프롬프트를 `prompt_templates`에 `design_md_concept_analyzer` 타입으로 편입한다.
4. **P2-1** — `INTEGRATED_BRIEF_OUTPUT_GUARD`를 `integrated_brief`의 `harnessConfig.additionalInstructions`로 이관해 관리자 편집 대상으로 만든다.
5. **P2-2** — n8n의 system 메시지를 `/api/prompts/...` 응답의 `systemPrompt` 필드로 내려주도록 계약을 확장한다.
6. **A** — 프롬프트 원본 위치를 `prompts/*.md` 하나로 일원화하고, `PROMPT_TYPES`는 파일명 + 변수 계약만 보유하도록 정리한다.

> 본 리포트는 검토 결과만 담았으며 소스코드는 수정하지 않았다.

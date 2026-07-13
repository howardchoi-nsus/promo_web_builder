# 검토 의견: n8n 관리자 설정 연동 수정 가이드

Reviewer: Claude
Date: 2026-07-12
검토 대상: `docs/n8n-admin-settings-worker-update-guide-2026-07-12.md`, 및 실제 저장소의 `n8n/Promo Lo-Fi Draft Worker.admin-driven.json`, `n8n/Promo Final Design Worker.image-edit.json`

## 결론

**이 문서가 설명하는 백업 워크플로우 JSON 2개(`admin-driven.json`, `image-edit.json`)를 직접 열어 대조한 결과, 제가 지적했던 핵심 버그 2가지(`input_fidelity` 키 불일치, LO-FI quality 미지정)가 실제로 수정되어 있음을 확인했습니다.** 문서 자체도 안전한 적용 절차(백업 duplicate → 백업 수정 → E2E → 운영 전환)와 롤백 기준을 구체적으로 제시하고 있어 실행 가능성이 높습니다. 다만 `lofi_draft`의 기본 모델 옵션(`DEFAULT_MODEL_SETTINGS`)에 quality/size 필드가 아직 없어 "관리자 설정이 실제 반영된다"는 취지가 LO-FI 단계에서는 아직 완전하지 않고, 문서의 프롬프트 압축 관련 서술 하나는 현재 코드와 정확히 일치하지 않아 재확인이 필요합니다.

## 이슈사항

### 1. (확인됨, 해결) `input_fidelity` 키 불일치 수정 완료

`n8n/Promo Final Design Worker.image-edit.json`을 직접 열어 확인한 결과:

```text
"name": "input_fidelity",
"value": "={{ ...modelOptions.inputFidelity || 'high' }}"
```

DB 저장 키(`inputFidelity`, camelCase)를 읽어서 OpenAI 파라미터명(`input_fidelity`, snake_case)으로 정확히 변환해 전송하도록 고쳐져 있습니다. 어제 제가 지적한 버그가 정확히 해결됐습니다.

### 2. (확인됨, 반영) LO-FI에 quality 파라미터 명시 지정

`n8n/Promo Lo-Fi Draft Worker.admin-driven.json`은 이제 `modelOptions.quality || 'medium'`을 명시적으로 지정합니다. 기존에는 quality 파라미터 자체가 없어 OpenAI 기본값에 의존했는데, 이번엔 명시적 fallback(`medium`)이 들어가 "LO-FI는 최고 품질일 필요가 없다"는 제 개선 제안과 방향이 일치합니다.

### 3. (확인 필요, 신규 발견) `lofi_draft`의 Admin 기본 옵션에 quality/size가 없음

`api/_prompt-template-store.js`의 `DEFAULT_MODEL_SETTINGS.lofi_draft`를 확인한 결과:

```js
lofi_draft: {
  provider: "openai",
  model: "gpt-image-1",
  temperature: 0.4,
  maxTokens: null,
  responseFormat: "image",
}
```

`quality`/`size` 필드가 아예 없습니다(`final_design`에만 존재). 즉 지금은 Admin Page에서 lofi_draft의 quality/size를 조정할 기본 스키마가 없어, 실질적으로 n8n의 fallback값(`medium`/`1024x1536`)에 고정된 것과 같습니다. "관리자 설정이 실제 실행에 반영되게 한다"는 이번 개편의 취지를 LO-FI 단계까지 완성하려면 이 기본 옵션에도 quality/size를 추가하는 작업이 필요합니다.

### 4. (재확인 필요) 문서 5.5절의 프롬프트 압축 서술이 현재 코드와 다를 수 있음

문서는 "API에서 이미 압축한 `renderedPrompt`가 전달되므로 정상 실행에서는 추가 절단이 발생하지 않아야 한다"고 설명합니다. 그러나 `api/_prompt-execution-snapshot.js`를 확인한 결과, 압축 로직(`fitFinalDesignPromptVariables`)은 `type === "final_design"`일 때만 적용되고 `lofi_draft`에는 적용되지 않습니다. LO-FI 프롬프트는 보통 Final보다 짧아 실무상 문제가 안 될 가능성이 높지만, 문서의 이 서술은 현재 코드와 정확히 일치하지 않으므로 lofi_draft에도 압축 로직을 확장할지, 아니면 문서 서술을 "LO-FI는 압축 대상이 아니다"로 정정할지 확인이 필요합니다.

### 5. (확인됨) Final Design의 실행 시점 재렌더링 문제 해결

`n8n/Promo Final Design Worker.image-edit.json`은 `Normalize Final Design Payload`가 `body.execution.renderedPrompt`를 그대로 사용하고, 별도로 `/api/prompts-render`를 다시 호출하는 노드가 없습니다. 어제 제가 `n8n-three-stage-worker-and-admin-llm-discussion` 검토에서 지적했던 "Queue 시점 snapshot과 실행 시점 재렌더링이 섞일 수 있다"는 drift 문제가 이 백업 워크플로우에서는 구조적으로 해소됐습니다.

### 6. (좋음) 적용 절차와 롤백 기준이 구체적이고 실무적

Phase 1(백업 duplicate) → Phase 2(백업 수정) → Phase 3(백업 E2E 9개 케이스) → Phase 4(운영 전환)로 이어지는 절차와, "Import from URL이 노드를 교체하지 않고 중복시킨다"는 n8n 특성 경고는 실제로 운영 워크플로우를 잘못 건드리는 사고를 막는 데 실질적으로 유용합니다. 롤백 기준(콜백 미실행으로 task가 무기한 processing 상태로 남는 경우 등)도 구체적입니다.

## 간략한 내용

- 두 백업 JSON 파일이 실제로 저장소에 존재하며(`n8n/Promo Lo-Fi Draft Worker.admin-driven.json`, `n8n/Promo Final Design Worker.image-edit.json`), 문서가 설명하는 구조와 코드 대조 결과 대부분 일치했습니다.
- 아직 백업 워크플로우 단계이며, 문서 자체도 "백업 E2E 성공 후 운영 전환"을 명확히 요구하고 있어 순서상 문제 없습니다.
- 3번(LO-FI quality/size 기본 옵션 부재)과 4번(압축 로직 범위)은 실제 운영 전환 전에 확인하고 넘어가는 것을 권장합니다.

## 참고 문서

- `docs/n8n-admin-settings-worker-update-guide-2026-07-12.md` (검토 대상)
- `docs/admin-llm-to-n8n-application-plan-2026-07-12.md`
- `docs/claude/review-admin-llm-to-n8n-application-plan-2026-07-12.md`
- `docs/claude/final-design-quality-improvement-plan-2026-07-12.md`
- `docs/claude/review-n8n-workflows-2026-07-12.md`

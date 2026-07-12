# 검토 의견: Admin LLM 설정 → n8n 실제 실행 연동 계획

Reviewer: Claude
Date: 2026-07-12
검토 대상: `docs/admin-llm-to-n8n-application-plan-2026-07-12.md`

## 결론

**이 계획서의 문제 진단은 제가 오늘 직접 소스코드와 Cloud n8n 워크플로우를 열어 확인한 내용과 정확히 일치하며, 여기서 한 걸음 더 나아가 근본적인 아키텍처 해법(immutable execution snapshot, provider adapter 패턴)까지 제시한 완성도 높은 문서입니다.** 다만 이 프로젝트가 60~70% 자동화 + 사람 검토를 지향하는 PoC 단계임을 감안하면, Phase 0~6·Provider 확장까지 포함한 전체 범위는 한 번에 다루기엔 크고, P0 항목만 먼저 좁혀서 시작하는 것을 권장합니다.

## 이슈사항

### 1. (정확함) 핵심 진단이 실제 코드/워크플로우와 100% 일치

- "LO-FI Worker는 `gpt-image-1`, `1024x1536`이 직접 지정돼 있어 Admin 설정과 무관하다"(2.2절) — `Promo Lo-Fi Draft Worker`의 `Generate LO-FI Draft Image` 노드를 직접 열어 확인한 결과, `model`/`size`가 표현식이 아닌 리터럴 문자열로 박혀 있고 `quality` 파라미터는 아예 없습니다. 정확합니다.
- "`inputFidelity`(Admin/DB) vs `input_fidelity`(n8n)" 명칭 불일치(2.5절) — 제가 어제 n8n 워크플로우 검토에서 발견한 것과 동일한 버그입니다.
- "n8n이 실행 시 `/api/prompts-render`를 다시 호출해 Queue 시점 snapshot과 실행 시점 prompt 버전이 섞일 수 있다"(2.3절) — `Render Final Design Prompt` 노드가 실제로 실행 시점에 `/api/prompts-render`를 호출하는 것을 코드로 확인했습니다. Queue 시점에 만든 `execution.provider/model/modelOptions`는 snapshot 그대로지만, 렌더링된 prompt 텍스트 자체는 매번 다시 만들어지므로, Admin이 그 사이에 prompt를 수정/활성화하면 provider/model은 옛 버전, prompt 내용은 새 버전이 섞이는 정확히 그 시나리오가 가능합니다. 날카로운 지적입니다.

### 2. (좋은 설계) Provider 확장을 2차로 미룬 판단이 적절함

Google 등 다른 Provider 추가를 "Provider adapter가 준비된 stage에서만" 허용하도록 미룬 것(5.2절, Phase 6)은 현재 OpenAI 단일 provider로 충분히 동작하는 상황에서 합리적입니다. 1차 목표를 "Provider 추가가 아니라 Admin·실제 요청 100% 일치"로 명시한 것도 좋습니다.

### 3. (범위/실행가능성 우려) 계획 전체가 PoC 단계 대비 큼

Phase 0~6, 21개 섹션, Provider adapter 인터페이스, 별도 `prompt_execution_snapshots` 테이블까지 포함한 범위는 프로덕션 서비스 수준의 설계입니다. 이 프로젝트가 아직 Human-in-the-loop PoC 단계임을 고려하면, 전체를 한 번에 구현하려 하기보다 **P0(Phase 0~2: 계약 고정, immutable snapshot, LO-FI 하드코딩 제거)까지만 먼저 좁혀서 진행**하고, Phase 5(Admin UI 구조화)·Phase 6(Provider adapter)은 실제 필요 시점에 착수하는 것을 권장합니다. 문서 자체도 P0/P1/P2로 우선순위를 나눠뒀으니(20절), 이 구분을 실제 작업 지시에도 그대로 반영하면 됩니다.

### 4. (범위 밖, 참고) LO-FI 속도 / Final 퀄리티 트레이드오프는 이 문서가 다루지 않음

제가 이전에 정리한 `final-design-quality-improvement-plan-2026-07-12.md`에서 지적한 "`input_fidelity=high`가 스타일 자유도를 제한해 퀄리티가 떨어져 보일 수 있다"는 이 문서의 범위 밖입니다. 이 문서는 "Admin 설정값이 실제로 반영되게 만드는 것"(배관 문제)에 집중하고 있고, "어떤 값을 선택해야 하는지"(튜닝 문제)는 다루지 않습니다. 이 계획이 완료되면 `inputFidelity`를 Admin에서 실제로 낮춰볼 수 있게 되므로, 두 문서는 순서상 이 계획(배관 수정)이 먼저이고 제 튜닝 제안은 그다음 단계로 자연스럽게 이어집니다.

### 5. (사소함) `n8n-worker-remediation-plan-2026-07-11.md`와 일부 중복

제가 어제 작성한 remediation plan의 P2(provider/model 실제 연동)와 이 문서의 Phase 2~4가 같은 문제를 다룹니다. 다만 이 문서가 훨씬 구체적이고(계약 고정, canonical schema, 완료 기준, 테스트 계획까지) 상위 호환이므로, 제 문서는 참고용으로 남기고 실제 작업은 이 계획서를 기준으로 진행하는 것을 권장합니다.

## 간략한 내용

- 문제 진단(2절)은 전부 코드/워크플로우로 재확인 가능했고 정확했습니다.
- 목표 아키텍처(4절)의 "Admin은 설정 원본, Snapshot은 실행 원본" 원칙과 renderedPrompt를 snapshotId로 대체하는 방향은 2.3절에서 발견한 drift 문제를 정확히 해결하는 설계입니다.
- 우선순위(20절) P0 4개 항목(immutable snapshot, LO-FI 하드코딩 제거, `inputFidelity` naming 정규화, Admin 지원 범위 표시)부터 시작하는 것을 권장합니다.
- 21절의 "다음 작업자가 바로 시작할 작업" 8개 항목은 그대로 실행해도 무리 없어 보입니다.

## 참고 문서

- `docs/admin-llm-to-n8n-application-plan-2026-07-12.md` (검토 대상)
- `docs/claude/final-design-quality-improvement-plan-2026-07-12.md`
- `docs/claude/n8n-worker-remediation-plan-2026-07-11.md`
- `docs/claude/review-n8n-workflows-2026-07-12.md`

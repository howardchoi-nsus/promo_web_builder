# n8n Worker / 관리자 LLM 연동 수정 계획서

Date: 2026-07-11
Author: Claude (검토 기반 작성)
근거 문서:
- `docs/lofi-final-design-fidelity-discussion-2026-07-11.md`
- `docs/n8n-three-stage-worker-and-admin-llm-discussion-2026-07-11.md`
- Cloud n8n 직접 조회 결과 (Promo Integrated Brief Worker `HrxQC5q3qflZTHLa`, Promo Lo-Fi Draft Worker `rjrA0K4QyNsySTkW`, Promo Final Design Worker `qGi72lZxFCipYGld`)

## 결론

가장 시급한 문제는 **API 키 평문 노출**(3개 워크플로우 전체)이며, 다음으로 시급한 것은 **Final Design이 Confirmed LO-FI 레이아웃을 전혀 참조하지 않는 구조적 문제**입니다. 관리자 페이지의 provider/model 설정은 현재 세 워크플로우 어디에도 반영되지 않으므로, 이 부분은 "버그"가 아니라 "아직 연결되지 않은 기능"으로 우선순위를 낮춰도 됩니다. 아래 순서(P0 → P3)로 진행할 것을 권장합니다.

## P0. 보안 — API 키 로테이션 (즉시, 당일 처리 권장)

**문제**: Promo Integrated Brief Worker, Promo Lo-Fi Draft Worker, Promo Final Design Worker 3개 모두 OpenAI API 키가 HTTP Request 노드 헤더에 평문으로 하드코딩되어 있음. n8n MCP로 워크플로우를 조회하면 키가 그대로 노출됨.

**작업**:
1. 노출된 OpenAI API 키를 즉시 폐기하고 재발급한다.
2. n8n Cloud에 Credential(예: "OpenAI API Key" Header Auth 또는 전용 OpenAI credential type)을 생성한다.
3. 3개 워크플로우의 HTTP Request 노드(Integrated Brief Worker의 "Call OpenAI LLM", Lo-Fi Draft Worker의 "Generate LO-FI Draft Image", Final Design Worker의 "Generate Final Design Image")에서 Authorization 헤더 literal을 제거하고 Credential 참조로 교체한다.
4. Git history에 과거 키가 커밋된 적이 있는지 확인한다(`git log -p -- n8n/ | grep sk-`).
5. OpenAI 대시보드에서 노출 기간 동안의 사용량/과금 이력을 점검한다.

**완료 기준**: 세 워크플로우 JSON export에 API 키 literal이 존재하지 않고, 전부 Credential 참조로 되어 있다.

## P1. Final Design Layout Fidelity — Confirmed LO-FI를 실제 참조로 사용

**문제**: `lofi-final-design-fidelity-discussion` 문서에서 분석된 대로, Final Design Worker는 `confirmedDraftId`를 프롬프트 변수 문자열로만 사용하고 LO-FI 이미지 자체를 이미지 모델에 전달하지 않는다. 게다가 현재 호출 API가 OpenAI `images/generations`(순수 text-to-image)라서 애초에 reference image를 받을 수 없는 구조다.

**작업 (Phase 1~3, 원문서 선택지 B/C/D 결합안 따름)**:
1. `api/promo-generation-final-designs.js`에서 confirmed draft 조회 쿼리를 확장한다(`select id::text`만 하던 부분을 `draft_image_url`, `draft_prompt`, `draft_attempt`, `prompt_meta`, `model_meta`, `confirmed_at`까지 포함).
2. n8n이 private Blob에 접근할 수 있는 absolute image proxy URL(`/api/promo-generation-lofi-draft-image?draftId=...`)을 worker payload에 포함한다.
3. Final Design Worker의 "Normalize Final Design Payload" 노드에 `confirmedDraft` 객체(draftImageUrl/draftImageProxyUrl/draftPrompt/promptMeta)와 `layoutFidelityPolicy`(preserveSectionOrder/preserveRelativePlacement/preserveCtaPosition 등)를 추가한다.
4. "Generate Final Design Image" 노드를 OpenAI `images/generations`에서 이미지 입력을 지원하는 엔드포인트(`images/edits` 계열 또는 Gemini의 image+reference 지원 방식)로 교체한다.
5. `final_design` 전용 prompt type을 `api/_prompt-template-store.js`에 추가하고, "Confirmed LO-FI Draft가 구조적 source of truth"라는 지시를 프롬프트에 명시한다.
6. 동일 LO-FI로 여러 번 최종 생성을 반복해 섹션 순서/CTA 위치/콘텐츠 그룹 일치 여부를 육안 QA한다.

**완료 기준**: 최종 이미지가 확인된 LO-FI의 섹션 순서·CTA 위치·콘텐츠 그룹을 유지하고, final design 저장 row에 사용된 confirmedDraftId/prompt/model metadata가 남는다.

## P2. 관리자 provider/model 설정 실제 연동

**문제**: Admin Page에서 `prompt_templates`의 provider/model/temperature를 바꿔도 3개 워크플로우 모두 OpenAI 모델(`gpt-4o-mini`, `gpt-image-1`)을 코드에 하드코딩하고 있어 실제 실행에 반영되지 않는다.

**작업 (원문서 선택지 C를 기본 채택)**:
1. Queue 시점에 active prompt/model 설정을 execution snapshot으로 확정해 DB에 저장한다(신규 테이블 또는 기존 run/task row 확장).
2. n8n 워크플로우가 task ID로 이 snapshot을 조회하도록 변경하거나, 최소 구현으로는 `/api/prompts-render` 응답의 `provider`/`model`/`responseFormat` 필드를 트리거 payload에 포함시켜 워크플로우가 이를 기준으로 provider별 분기(OpenAI vs Gemini)를 타도록 한다.
3. 각 워크플로우의 HTTP Request 노드 URL/model 파라미터를 하드코딩 대신 `{{$json.model}}`, `{{$json.provider}}` 기준 표현식으로 변경한다.
4. 실제 사용된 provider/model을 callback의 `modelMeta`에 정확히 기록해 추적 가능하게 한다.

**완료 기준**: Admin Page에서 provider/model을 바꾸고 재실행하면 n8n 실행 로그와 callback `modelMeta`에서 변경이 반영된 것을 확인할 수 있다.

## P3. 저장소 동기화 및 운영 정리

**문제**: Cloud n8n의 3개 워크플로우가 로컬 저장소 `n8n/` 폴더에 export되어 있지 않아 코드 리뷰/버전 관리/재현이 불가능하다. 또한 Lo-Fi Draft Worker의 "Check Image Base64" 노드에 이름/값이 빈 assignment 잔재가 있고, 3개 워크플로우 모두 OpenAI 호출 실패 시 에러 핸들링·재시도 로직이 없다.

**작업**:
1. 세 Cloud workflow를 secret 제거 상태로 export해 `n8n/promo-integrated-brief-worker.workflow.json`, `n8n/promo-lofi-draft-worker.workflow.json`, `n8n/promo-final-design-worker.workflow.json`로 저장소에 반영한다.
2. Admin DB의 webhook URL과 위 workflow ID 매핑을 문서화한다(예: `docs/n8n-worker-workflow-mapping.md`).
3. Lo-Fi Draft Worker의 "Check Image Base64" 빈 assignment 항목을 정리한다.
4. 각 워크플로우의 OpenAI/Gemini 호출 노드에 실패 처리 분기(에러 시 run/draft/final design status를 `failed`로 갱신)와 최소 1회 재시도를 추가한다.
5. secret scanning(예: gitleaks)을 커밋 전 훅 또는 CI에 추가해 향후 키 노출을 방지한다.

**완료 기준**: 저장소에서 3개 워크플로우의 최신 구조를 확인할 수 있고, 실패 케이스가 무기한 "처리중" 상태로 남지 않는다.

## 우선순위 요약

| 순위 | 항목 | 시급도 | 예상 난이도 |
|---|---|---|---|
| P0 | API 키 로테이션 + Credentials 이전 | 즉시 | 낮음 |
| P1 | Final Design LO-FI reference 반영 | 높음 | 중~높음 (API 엔드포인트 교체 포함) |
| P2 | 관리자 provider/model 실제 연동 | 중간 | 중간 |
| P3 | 저장소 동기화 + 에러 핸들링 | 중간 | 낮음~중간 |

## 논의 필요 사항 (착수 전 확정 필요)

1. Final Design 이미지 생성을 OpenAI `images/edits` 계열로 바꿀지, Gemini의 reference image 지원 방식으로 바꿀지 — 두 옵션의 비용/품질/API 안정성 비교가 먼저 필요하다.
2. `final_design` 전용 prompt type을 언제 분리할지 (P1과 함께 진행 권장).
3. Provider/model snapshot을 별도 execution table로 만들지, 기존 run/task row를 확장할지 (P2 착수 전 스키마 결정 필요).

# 검토 의견: n8n-three-stage-worker-and-admin-llm-discussion-2026-07-11.md

Reviewer: Claude
Date: 2026-07-11
대상 문서: `docs/n8n-three-stage-worker-and-admin-llm-discussion-2026-07-11.md`

## 결론

문서의 핵심 전제("저장소에 3단계 worker workflow가 존재하지 않는다")가 실제와 다릅니다. Cloud n8n을 직접 조회한 결과 세 워크플로우(Integrated Brief / Lo-Fi Draft / Final Design Worker) 모두 이미 존재하고 active 상태입니다. 다만 문서가 지적한 그 다음 단계 문제들(provider/model 설정 미반영, LO-FI reference 미전달, API 키 노출, final_design 전용 prompt type 부재)은 실제 워크플로우 확인 결과와 정확히 일치합니다.

## 이슈사항

1. **워크플로우 존재 여부 판단 오류**: 문서 4.1~4.3절은 로컬 repo의 `n8n/` 폴더만 확인하고 "전용 workflow가 확인되지 않는다"고 결론 내렸습니다. n8n MCP로 Cloud n8n을 직접 조회하면 다음 워크플로우가 모두 존재/active함을 확인할 수 있습니다.
   - Promo Integrated Brief Worker (`HrxQC5q3qflZTHLa`)
   - Promo Lo-Fi Draft Worker (`rjrA0K4QyNsySTkW`)
   - Promo Final Design Worker (`qGi72lZxFCipYGld`)
   - 세 워크플로우 모두 2026-07-11(오늘)에 최종 수정됨. **Phase 0("Cloud n8n에 실제로 존재하는지 확인")는 이미 답이 나와 있으므로 반복 확인 없이 다음 단계로 진행 가능.**

2. **이후 논의 내용은 실제 워크플로우 검토 결과와 일치 (그대로 유효)**:
   - 6.2절 "provider/model 변경이 실제 실행에 반영되지 않는다" — 확인됨. 세 워크플로우 모두 OpenAI 모델(`gpt-4o-mini`, `gpt-image-1`)이 하드코딩되어 있고 `/api/prompts-render`가 반환하는 provider/model 값을 사용하지 않음.
   - 4.3절 "confirmedDraftId로 LO-FI를 조회/reference로 사용하지 않는다" — 확인됨. Final Design Worker는 `confirmedDraftId`를 프롬프트 변수 문자열로만 전달.
   - 7절 API 키 평문 노출 — 확인됨. 세 워크플로우 모두 OpenAI 키가 HTTP Request 노드에 하드코딩됨 (handoff 07-02, 07-08에서도 동일 경고가 있었으나 미조치 상태로 남아있음).
   - "final_design 전용 prompt type 없음" — 확인됨. `api/_prompt-template-store.js`에는 `integrated_brief`/`image_execution`/`lofi_draft`만 존재.

## 간략한 내용

문서 구조(논의 목적 → 검토 범위 → stage별 계약 → 기존 workflow와 차이 → 관리자 설정 실효성 → 보안 → 권장 구조 → 구현 선택지 → Phase별 순서 → 완료 기준 → 미결 질문)는 체계적입니다. 다음 세션에서는 문서의 Phase 1(API 키 로테이션/Credentials 이전)부터 바로 시작하고, Phase 0는 "존재 확인 완료, 연결 계약만 보강 필요"로 갱신해서 진행하는 것을 권장합니다.

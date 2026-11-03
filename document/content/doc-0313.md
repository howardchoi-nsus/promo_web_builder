# 검토 의견: lofi-final-design-fidelity-discussion-2026-07-11.md

Reviewer: Claude
Date: 2026-07-11
대상 문서: `docs/lofi-final-design-fidelity-discussion-2026-07-11.md`

## 결론

문제 진단이 정확하고(코드 근거 확인 완료), 다른 도구가 이어받아 작업하기 좋은 수준의 handoff 문서. 다만 실행 전 전제조건 확인(n8n workflow 존재 여부, Gemini reference image 지원 여부)이 먼저 필요함.

## 이슈사항

1. **미확인 전제조건 2건이 권장 방향의 실행 가능성을 좌우함**
   - Cloud n8n에 `final_design`을 소비하는 별도 workflow가 실제로 존재하는지 저장소 내에서 확인 불가 (문서 4.6절, 11절 Q1)
   - 현재 Gemini 이미지 호출 방식이 reference/input image를 지원하는지 미확인 (11절 Q3)
   - 이 두 가지가 확인되지 않으면 권장 방향(선택지 B→C→D 결합)이 전제부터 무너질 수 있음. **다음 작업 착수 전 이 두 질문부터 확인 필요.**

2. **명명 규칙 예외**: 프로젝트 표준 명명(`REQ_/PRD_/LOG_[키워드]_YYMMDD_HHMMSS`)과 다르지만, 논의(Discussion) 성격 문서라 예외로 판단됨. 문제 없음.

## 간략한 내용

- 코드 근거 직접 확인 결과 문서 주장과 실제 소스가 일치함:
  - `api/promo-generation-final-designs.js`의 confirmed draft 조회 쿼리가 `id::text`만 select (문서 4.2절 주장과 일치)
  - `api/_prompt-template-store.js`에 `integrated_brief` / `image_execution` / `lofi_draft`만 존재, `final_design` prompt type 없음 (4.5절 일치)
  - `prototype/promo-wizard.js`의 Step 4 요청에 `finalPrompt` 미전송 (4.4절 일치)
- 문서 구조(현상 → 코드 근거 → 근본 원인 → 해결 선택지 A~D 비교 → 권장 방향 → Phase별 구현 순서 → 완료 기준 → 미결 질문)가 체계적이며, 권장 worker payload 예시(JSON)까지 포함되어 실행 가능성이 높음.
- 상세 내용/추가 검토가 필요하면 요청 바람.

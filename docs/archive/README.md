# docs/archive

이전 단계에서 완료·대체된 계획서·제안서·논의 문서를 보관한다. 이력 추적용이며 현재 기준 문서로 사용하지 않는다.

- 정리일: 2026-07-22 (1차), 2026-07-23 (2차: 이전 파이프라인 문서 일괄 보관)

## 2026-07-23 추가 보관 — 이전 단계(AI 생성 파이프라인) 문서

현 진행 방향(소스 정리·CSS 디자인 토큰/컴포넌트 아키텍처·i18n·섹션 컴포넌트화·브랜드)은 `docs/proposal/`로 이관했다. 그 이전 단계인 **LO-FI/Final 생성, n8n Worker 연동, Visual Editor/Renderer 전환(07-16), 초기 Wizard/Final-Design 계획(≤07-17)**은 완료·대체되었으므로 여기로 보관했다(총 27건).

- LO-FI/Final: `ui-design-generation-fix-plan-2026-06-28`, `development-plan-2026-07-03-b-section-redesign`, `lofi-draft-confirmation-plan-debugged-2026-07-08`, `lofi-final-design-variant-review-2026-07-09`, `final-design-lofi-layout-fidelity-issue-2026-07-10`, `lofi-final-design-fidelity-discussion-2026-07-11`, `ai-design-recommendation-workflow-proposal-2026-07-09`, `standalone-promo-wizard-development-plan-2026-07-10`, `automated-vue-web-generation-process-recommendation-2026-07-14`, `final-design-vue-webpage-generation-development-plan-2026-07-14`
- n8n Worker: `next-development-plan-worker-integration-2026-07-08`, `n8n-worker-json-refactor-rationale-plan-2026-07-08`, `n8n-three-stage-worker-and-admin-llm-discussion-2026-07-11`, `n8n-three-stage-worker-issue-resolution-plan-2026-07-11`, `admin-llm-to-n8n-application-plan-2026-07-12`, `n8n-admin-settings-worker-update-guide-2026-07-12`
- Visual Editor/Renderer(07-16~17): `visual-template-editor-and-llm-vue-generation-proposal-2026-07-16`, `visual-template-editor-development-plan-2026-07-16`, `visual-template-editor-service-flow-2026-07-16`, `visual-renderer-development-plan-with-n8n-2026-07-16`, `visual-renderer-p0-baseline-and-contract-2026-07-16`, `visual-editor-p1-stabilization-development-plan-2026-07-17`
- 초기 Wizard/관리자: `wizard-content-section-admin-management-prd-2026-07-14`, `wizard-content-admin-hardening-development-plan-2026-07-14`, `wizard-step2-template-integration-development-plan-2026-07-15`, `landing-and-folder-restructure-development-plan-2026-07-15`, `admin-template-default-layout-wizard-editing-development-plan-2026-07-17`

> 이 중 다시 필요한 문서가 있으면 루트로 되돌릴 수 있다. n8n을 계속 운영한다면 n8n 가이드 문서는 참조 목적상 루트 복귀를 검토한다.

## 2026-07-22 1차 보관 — 자체 선언 대체 문서

| 보관 문서 | 대체한 최신 문서 | 근거 |
|---|---|---|
| `lofi-draft-confirmation-development-plan-2026-07-08.md` | `docs/lofi-draft-confirmation-plan-debugged-2026-07-08.md` | debugged 문서가 본 문서를 supersede한다고 명시 |
| `n8n-web-harness-refactor-plan-2026-07-08.md` | `docs/lofi-draft-confirmation-plan-debugged-2026-07-08.md` | 동일 debugged 문서가 supersede 명시 |
| `development-plan-debug-review-2026-07-08.md` | `docs/lofi-draft-confirmation-plan-debugged-2026-07-08.md` | 동일 debugged 문서가 supersede 명시 |
| `promo-builder-wizard-design-request-2026-07-10.md` (원래 `docs/claude/`) | `docs/standalone-promo-wizard-development-plan-2026-07-10.md` | 문서 상단 `# Status: Superseded`로 자체 선언 |

## 보관하지 않은(검토 후 유지) 판단

- `docs/claude/review-admin-page-source-2026-07-14.md` ↔ `review-admin-page-source-2026-07-15.md`: 07-15가 07-14를 **기준 문서로 참조**하므로 이동 시 링크가 깨져 유지.
- `visual-template-editor-*`(proposal/plan/service-flow) 및 `visual-renderer-*`(07-16): 서로 다른 산출물(제안·계획·서비스플로우·렌더러)로 상호 참조하는 문서 세트라 중복 아님.
- `section-ai-*`, `create-promo-step3-*`, `create-promo-admin-layout-*`: 같은 도메인이나 단계·이슈가 달라 순차 문서로 판단, 유지.

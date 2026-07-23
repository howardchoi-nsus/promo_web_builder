# docs 구조 안내

문서를 **성격별 4분류**로 재편했다(2026-07-23). `claude/`(작업 산출물)와 `handoff/`(작업 인수인계)는 별도 유지한다.

```
docs/
├─ 기획/   제품 방향·PRD·제안·요구(무엇을/왜)
├─ 설계/   아키텍처·서비스 플로우·기술 계약·디자인 시스템/브랜드·용어(어떻게 구조화)
├─ 계획/   개발계획서·구현/마이그레이션 계획(어떻게 만든다)
├─ 자료/   가이드·샘플·리뷰·보고·진행기록·프로토콜·브랜드 코퍼스(참고 자료)
│   ├─ design-md/                브랜드별 디자인 시스템 코퍼스
│   └─ annotated-source-reference/ 주석 소스 참고
├─ claude/  (제외) 세션 작업 산출물
└─ handoff/ (제외) 일자별 인수인계
```

분류 기준: 파일 성격 기준이며, 현행/레거시 여부와 무관하게 성격으로 묶었다. 현 진행 방향 문서는 아래 표에 ★로 표시한다.

## 기획 (7)

- ★ `product-direction-and-gap-review.md` — 제품 방향·구현 격차(현행화됨)
- ★ `information-architecture-to-be-2026-07-21.md` — 목표 정보구조
- `wizard-content-section-admin-management-prd-2026-07-14.md` — PRD
- `ai-design-recommendation-workflow-proposal-2026-07-09.md` — AI 생성 워크플로우 제안
- `visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md` — Visual Editor 검토안
- `promo-builder-wizard-design-request-2026-07-10.md` — 위저드 설계 요청(대체됨)
- `automated-vue-web-generation-process-recommendation-2026-07-14.md` — 무인 Vue 생성 권고

## 설계 (4)

- ★ `admin-page-terminology-dictionary-2026-07-22.md` — 용어 사전(i18n 입력 스펙)
- ★ `ggpoker-brand-tone-and-image-prompt-guide-2026-07-22.md` — GGPoker 브랜드·톤앤매너·이미지 프롬프트
- `visual-renderer-p0-baseline-and-contract-2026-07-16.md` — 렌더러 기준선·기술 계약
- `visual-template-editor-service-flow-2026-07-16.md` — 서비스 플로우

## 계획 (32)

현 진행 방향 ★: CSS 컴포넌트 아키텍처, 디자인 토큰 통일, 컴포넌트/템플릿 분리, i18n 관리, 좌측 글로벌 내비, 소스 정리·통합, 섹션 배경·Image Frame(07-23), 최근 create-promo/section(07-19~20).

- ★ `css-component-architecture-and-page-style-separation-development-plan-2026-07-22.md`
- ★ `css-design-token-unification-development-plan-2026-07-21.md`
- ★ `component-template-separation-development-plan-2026-07-22.md`
- ★ `admin-i18n-locale-management-development-plan-2026-07-22.md`
- ★ `left-sidebar-global-navigation-development-plan-2026-07-21.md`
- ★ `source-code-cleanup-and-consolidation-development-plan-2026-07-21.md`
- ★ `section-background-and-image-frame-development-plan-2026-07-23.md`
- `create-promo-step3-ai-content-and-layout-generation-development-plan-2026-07-19.md`
- `create-promo-admin-layout-sync-hardening-development-plan-2026-07-19.md`
- `create-promo-step3-subflow-and-web-output-development-plan-2026-07-20.md`
- `create-promo-admin-layout-reflection-fix-development-plan-2026-07-20.md`
- `section-ai-image-application-and-section-ui-development-plan-2026-07-20.md`
- `section-ai-layout-and-image-generation-mvp-development-plan-2026-07-20.md`
- 이전 단계(레거시): `admin-llm-to-n8n-application-plan-2026-07-12`, `admin-template-default-layout-wizard-editing-development-plan-2026-07-17`, `development-plan-2026-07-03-b-section-redesign`, `development-plan-debug-review-2026-07-08`, `final-design-vue-webpage-generation-development-plan-2026-07-14`, `landing-and-folder-restructure-development-plan-2026-07-15`, `lofi-draft-confirmation-development-plan-2026-07-08`, `lofi-draft-confirmation-plan-debugged-2026-07-08`, `n8n-three-stage-worker-issue-resolution-plan-2026-07-11`, `n8n-web-harness-refactor-plan-2026-07-08`, `n8n-worker-json-refactor-rationale-plan-2026-07-08`, `next-development-plan-worker-integration-2026-07-08`, `standalone-promo-wizard-development-plan-2026-07-10`, `ui-design-generation-fix-plan-2026-06-28`, `visual-editor-p1-stabilization-development-plan-2026-07-17`, `visual-renderer-development-plan-with-n8n-2026-07-16`, `visual-template-editor-development-plan-2026-07-16`, `wizard-content-admin-hardening-development-plan-2026-07-14`, `wizard-step2-template-integration-development-plan-2026-07-15`

## 자료 (16 + 코퍼스)

- ★ `information-architecture-as-is-2026-07-21.md` — 현행 정보구조(현행화됨)
- ★ `collaboration-protocol-2026-07-21.md` — FE/BE 협업 프로토콜
- ★ `source-code-cleanup-review-2026-07-20.md` — 소스 정리 검토 보고
- `b-section-usage-guide.md`, `codex-project-transfer-env-guide-2026-07-11.md`, `integrated-design-brief-sample.md`
- 이전 단계 참고: `n8n-admin-settings-worker-update-guide-2026-07-12`, `n8n-three-stage-worker-and-admin-llm-discussion-2026-07-11`, `lofi-final-design-fidelity-discussion-2026-07-11`, `lofi-final-design-variant-review-2026-07-09`, `final-design-lofi-layout-fidelity-issue-2026-07-10`
- 진행기록: `daily-plan-2026-06-29-to-2026-07-03`, `daily-plan-2026-07-01`, `weekly-plan-2026-06-29`, `weekly-report-2026-06-28`, `interim-status-report-2026-07-09`
- 코퍼스: `design-md/`(브랜드별 디자인 시스템), `annotated-source-reference/`(주석 소스)

## 참고

- 이전 `archive/`·`status/`·`proposal/` 폴더는 이 4분류로 흡수되어 제거됐다.
- 이동으로 문서 간 상호 참조 경로(`docs/...`)가 일부 깨질 수 있다. 필요 시 참조를 새 경로로 갱신한다.

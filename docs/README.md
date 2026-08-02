# docs 구조 안내

문서를 **성격별 4분류 + 정책**으로 관리하고, 이전 단계·중복 문서는 `archive/`로 분리한다. `claude/`(세션 산출물)와 `handoff/`(일자별 인수인계)는 별도 유지한다.

- 최종 정리: 2026-08-01 (Visual Editor Live Preview·라인 단위 텍스트 편집 현행화)

```
docs/
├─ 기획/   제품 방향·PRD·분석 리포트 (무엇을/왜)
├─ 설계/   디자인 시스템·브랜드·용어 (어떻게 구조화)
├─ 계획/   개발계획서 (어떻게 만든다)
├─ 정책/   가드레일·규칙·거버넌스 (+ source/)
├─ 자료/   가이드·샘플·리뷰·현황 (+ design-md/, annotated-source-reference/)
├─ archive/ 이전 단계·중복 (계획/설계/자료/기획-source)  ← 현재 기준 아님
├─ claude/  (별도) 세션 작업 산출물
└─ handoff/ (별도) 일자별 인수인계
```

## 현재 문서 (현행 기준)

### 기획 (2)
- `promo-web-builder-product-plan-2026-07-23.md` — 통합 제품 기획서(현행화: 마이그레이션 032 반영)
- `promo-builder-ai-design-and-component-analysis-report-2026-07-23.md` — AI 디자인·컴포넌트 분석 리포트(현행화: 031/032 델타 반영)

### 설계 (4)
- `admin-page-terminology-dictionary-2026-07-22.md` — 용어 사전(+ 컴포넌트 계층 용어)
- `ai-promotion-builder-composition-engine-technical-design-2026-07-29.md` — AI 프로모션 조립 엔진 기술 설계
- `ggpoker-brand-tone-and-image-prompt-guide-2026-07-22.md` — GGPoker 브랜드·이미지 프롬프트(현행화 메모 포함)
- `visual-editor-live-preview-rich-text-design-2026-08-01.md` — Live Preview, 직접 편집, 라인 단위 서식의 현행 설계

### 계획 (현 진행 방향)
- 디자인 토큰/CSS: `css-design-token-unification-2026-07-21`, `css-component-architecture-and-page-style-separation-2026-07-22`
- 컴포넌트/템플릿: `component-template-separation-2026-07-22`
- 섹션 AI 자동 디자인: `ai-section-auto-design-development-plan-2026-07-23`(v2), `section-ai-image-application-2026-07-20`, `section-ai-layout-and-image-generation-mvp-2026-07-20`, `section-background-and-image-frame-2026-07-23`, `section-image-prompt-governance-draft-2026-07-24`, `promo-builder-ai-design-and-component-development-plan-2026-07-23`
- Create Promo: `create-promo-step3-ai-content-and-layout-generation-2026-07-19`, `create-promo-step3-subflow-and-web-output-2026-07-20`, `create-promo-admin-layout-sync-hardening-2026-07-19`, `create-promo-admin-layout-reflection-fix-2026-07-20`
- i18n/내비/정리: `admin-i18n-locale-management-2026-07-22`, `left-sidebar-global-navigation-2026-07-21`, `source-code-cleanup-and-consolidation-2026-07-21`
- Visual Editor: `webflow-style-component-library-drag-drop-development-plan-2026-07-31`, `live-preview-outline-editor-text-alignment-development-plan-2026-07-31`, `visual-editor-structure-ai-design-transition-development-plan-2026-07-31`
- AI·Preset 보완: `promo-builder-ai-asset-and-section-layout-preset-remediation-development-plan-2026-07-30`

### 정책 (1)
- `promo-web-builder-policies-2026-07-23.md`(현행화: Visual Editor·라인 편집·AI 역할·Motion 규칙 반영) + `source/collaboration-protocol-2026-07-21.md`

### 자료 (6 + 코퍼스)
- `information-architecture-as-is-2026-07-21.md`(현행화), `source-code-cleanup-review-2026-07-20.md`, `legacy-route-reference-audit-2026-07-24.md`, `b-section-usage-guide.md`, `codex-project-transfer-env-guide-2026-07-11.md`, `integrated-design-brief-sample.md`
- 코퍼스: `design-md/`(브랜드 디자인 시스템), `annotated-source-reference/`(주석 소스)

## 이번 검증·현행화 요약 (2026-07-24)

- 실제 구현 기준선 확인: 마이그레이션 `032`, Section AI V2(029·031·032) 구현, StyleProfile·CompositionSpec 미구현.
- 현행화 반영: 기획 2건·정책·설계 2건·자료 IA 현황을 032 기준으로 갱신.
- 레거시·중복 이동: 계획 19 + 설계 2 + 자료 10 + 기획-source 7 → `archive/`.
- 참고: 이동으로 문서 간 상호 참조 경로가 일부 깨질 수 있다. 필요 시 갱신한다.

## 2026-08-01 현행화 요약

- 정책서에 Preview Normal/Selection/Outline, Selection Box 실측, 직접 편집과 Drag 충돌 방지 규칙을 추가했다.
- 텍스트 콘텐츠는 plain string으로 유지하고 선택 라인 서식은 검증된 `lineStyles` 메타데이터로 저장하는 정책을 확정했다.
- Font Awesome Toolbar, Design Token, Bullet/Number, Indent/Outdent, Section 기준 배치의 적용 범위를 명시했다.
- 구조 패널 Accordion, AI 디자인/섹션 구성의 역할 분리, Motion preset과 Reduced Motion 정책을 통합했다.
- 현행 구현 설계서는 `설계/visual-editor-live-preview-rich-text-design-2026-08-01.md`, 최신 작업 인계는 `handoff/handoff-2026-08-02.md`를 기준으로 한다.

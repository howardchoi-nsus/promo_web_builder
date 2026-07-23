# docs/proposal

현재 진행 방향(2026-07 하순 기준)에 필요한 **활성 계획서·제안서**를 모은 폴더다. 최신 handoff(`handoff-2026-07-21.md`)의 작업 방향 — 소스 정리·통합, CSS 디자인 토큰/컴포넌트 아키텍처, i18n/용어 정리, 섹션 아이템 컴포넌트화, GGPoker 브랜드 적용 — 을 기준으로 선별했다.

- 정리일: 2026-07-23

## 선별된 계획서

| 문서 | 방향 | 원위치 |
|---|---|---|
| `css-design-token-unification-development-plan-2026-07-21.md` | 디자인 토큰 통일(선행) | docs/ |
| `css-component-architecture-and-page-style-separation-development-plan-2026-07-22.md` | CSS 컴포넌트 아키텍처·페이지 분리 | docs/ |
| `source-code-cleanup-and-consolidation-development-plan-2026-07-21.md` | 소스 정리·중복 제거 | docs/ |
| `information-architecture-to-be-2026-07-21.md` | 목표 정보구조(IA) | docs/ |
| `left-sidebar-global-navigation-development-plan-2026-07-21.md` | 좌측 사이드바 글로벌 내비 | docs/ |
| `admin-page-terminology-dictionary-2026-07-22.md` | 용어 사전(i18n 입력 스펙) | docs/claude/ |
| `admin-i18n-locale-management-development-plan-2026-07-22.md` | 관리자 다국어(i18n) 관리 | docs/claude/ |
| `component-template-separation-development-plan-2026-07-22.md` | 섹션 아이템 컴포넌트화·템플릿 디자인 토큰 | docs/claude/ |
| `ggpoker-brand-tone-and-image-prompt-guide-2026-07-22.md` | GGPoker 톤앤매너·이미지 프롬프트·브랜드 토큰 | docs/claude/ |

## 참고 (함께 봐야 하는 자료 — 이동하지 않음)

이 계획서들이 참조하는 **데이터 산출물**은 계획서가 아니므로 `docs/claude/`에 그대로 두었다.

- `docs/claude/design-tokens.schema.json`, `docs/claude/design-tokens.csv` — 디자인 토큰 입력 스키마/값
- `docs/claude/Design_token - GGpoker_web.xlsx` — GGPoker 적용 토큰(앱/프로모션 2시트)

## 주의

문서 간 상호 참조 경로(예: `docs/claude/...`, `docs/...`)는 이동으로 인해 일부 깨질 수 있다. 필요 시 참조 경로를 `docs/proposal/...`로 갱신한다. 제외한 문서(레거시 n8n·visual editor 초기·create-promo 단계별 버그수정·lofi·리뷰 리포트·handoff·daily/weekly)는 원위치에 유지했다.

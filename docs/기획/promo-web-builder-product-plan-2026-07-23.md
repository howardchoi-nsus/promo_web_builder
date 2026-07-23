# Promo Web Builder 통합 기획서 (현행화)

- 작성일: 2026-07-23
- 대상 프로젝트: `promo_web_builder`
- 문서 성격: 기획(제품 방향·문제의식·목표 정보구조·핵심 기능 요구·현황/격차·우선순위)
- 기준: 실제 구현(마이그레이션 `030`, DB 기반 템플릿/섹션/아이템·아이템 컴포넌트·i18n·Visual Editor/Web Output) 대조
- 통합 출처(기존 기획 폴더 7개 문서를 하나로 병합·현행화):
  - `product-direction-and-gap-review.md`
  - `information-architecture-to-be-2026-07-21.md`
  - `wizard-content-section-admin-management-prd-2026-07-14.md`
  - `ai-design-recommendation-workflow-proposal-2026-07-09.md`
  - `visual-template-editor-and-llm-vue-generation-proposal-2026-07-16.md`
  - `automated-vue-web-generation-process-recommendation-2026-07-14.md`
  - `promo-builder-wizard-design-request-2026-07-10.md` (대체됨·역사적 맥락)

---

## 1. 제품 배경과 문제의식

기존 GGPoker 프로모션 페이지는 소수의 고정 템플릿에 리전/에이전트 담당자가 텍스트·이미지만 바꿔 운영한다. 새 디자인이 필요할 때마다 중앙 디자인/개발팀이 대응해야 해, 실제로는 몇 개 템플릿이 반복 재사용되고 "디자인이 단조롭다·자유도가 없다"는 불만이 누적됐다.

핵심 문제의식은 **"선택지가 부족해서"가 아니라 "각 담당자가 스스로 다양한 디자인을 판단·선택할 유인과 역량이 부족해서"** 라는 점이다. 따라서 해법은 선택 UI 확장이 아니라, **AI가 다양성을 만들어 제안하는 주체**가 되어 담당자는 "무엇을 하는 프로모션인지"만 설명하면 되게 하는 것이다.

## 2. 제품 방향과 설계 원칙

목표는 단순 페이지 생성기가 아니라, **기존 운영형 프로모션 빌더에 AI 디자인·퍼블리싱 레이어를 얹는 구조**다.

```text
프로모션 운영 요구
  → 리전 담당자 입력(간편 브리프)
  → 디자인 시스템(디자인 MD/토큰) 기반 AI 디자인 생성·추천
  → 확인 및 수정(Visual Editor)
  → 코드/렌더 산출(Vue Web Output)
  → 운영 정책 검증(Rule Base)
  → 자동 퍼블리싱
```

설계 원칙:

1. 담당자는 디자인 지식 없이 프로모션 내용만 입력한다. 다양성은 AI 추천이 만든다.
2. 최종 결과물의 텍스트·혜택은 반드시 담당자가 입력한 실제 값으로 채운다(이미지 문구가 아님).
3. 브랜드·법무 가드레일(로고, 필수 색, 법적 고지)은 AI 다양성과 별개로 항상 강제한다(Rule Base).
4. **이미지 산출물과 실제 웹을 분리하지 않는다.** HI-FI 이미지를 코드로 역추측하지 않고, Vue 웹페이지를 먼저 만든 뒤 브라우저 렌더링 결과를 확정 산출물로 쓴다.
5. 편집기 UI 토큰(Layer A)은 통일하고, 프로모션 콘텐츠 토큰(`--promo-*`, Layer B)은 프로모션별로 격리한다.
6. 신규 AI 기능은 다이렉트 LLM으로, n8n 경유 파이프라인은 병행 후 축소한다.

## 3. 목표 정보구조 (To-Be)

작업 목적(제작/편집/결과/관리)을 축으로 한 **단일 App Shell**을 지향한다.

```text
Promo Web Builder (단일 App Shell)
├─ 좌측 글로벌 네비 (단일 정의)
│   ├─ 제작 Create   ← 통합 단일 제작 흐름 (Create Promo + Promo Wizard 통합)
│   ├─ 편집 Editor   ← Visual Editor
│   ├─ 결과 Output   ← Web Output / 생성물
│   └─ 관리 Admin    ← 관리 콘솔 (Promo Builder 흡수)
├─ 중앙 워크스페이스
└─ 우측 컨텍스트 패널 (속성/AI/상태)
```

목표 경로 체계는 `/create`, `/editor`, `/output`, `/admin`(+ `/admin/templates` 등)으로 평탄화하고, `/prototype/*` 중첩과 redirect 프록시를 제거한다(구경로 → 신경로 rewrite 한시 유지).

> 진행 현황: 좌측 글로벌 네비의 **단일 정의(`shared-shell.js`)는 구현됐다.** 경로 평탄화(`/prototype/*` 제거), Create+Wizard 완전 통합, Promo Builder의 Admin 흡수는 **미완**이다(§6 참조).

## 4. 핵심 기능 요구 (통합)

### 4.1 AI 디자인 추천 흐름 (다양성 엔진)

담당자 브리프 → AI가 서로 다른 성격의 디자인 콘셉트 후보를 제시 → 담당자는 "여러 안 중 하나 선택"으로 축소.

```text
0. Simple Brief 입력 (제목/혜택/대상/톤/리전)
1. AI 디자인 스타일 추천 (Design Concept)
1.5. Rule Validation (브랜드/법무 가드레일, fatal/warning)
2. 담당자 선택/확정
3. 상세 콘텐츠 입력 (섹션/아이템)
4. Integrated Brief 생성
5. 디자인 생성 (섹션 AI 레이아웃·이미지)
6. 확인·수정 (Visual Editor)
7. 코드 생성·퍼블리싱
```

### 4.2 관리자 템플릿·섹션·아이템·컴포넌트 관리

코드 수정 없이 관리자가 Wizard 입력 구조와 템플릿을 구성한다.

- **섹션/아이템 CRUD**: 필수 여부, Wizard 노출 여부, 순서(고정/가변), 잠금(lock, 값 고정) 관리.
- **아이템 컴포넌트화**: Text/Image/CTA 등 섹션 아이템을 전역 컴포넌트로 CRUD·버전 관리, 템플릿·섹션은 컴포넌트를 참조·조립.
- **폼 템플릿·레이아웃**: draft/active 버전, 감사 로그.
- **거버넌스**: draft → active → archived + 이력·감사.

### 4.3 Visual Content Editor + Vue 렌더러 단일화

- Wizard 입력을 단순 폼이 아니라 **실제 웹페이지를 보며 콘텐츠를 등록하는 Visual Content Editor**로 한다.
- LLM은 페이지 이미지가 아니라 **Design Spec + Vue 템플릿**을 제한된 규칙 안에서 생성한다.
- **동일한 Vue Renderer**를 Wizard Preview와 최종 Web Output에 함께 사용해, 미리보기와 최종 결과가 일치하게 한다.
- LLM 생성 코드는 Sandbox Build + 자동 시각 QA 통과 시에만 Template Registry에 등록한다.

### 4.4 운영 정책 Rule Base 검증

리전별 필수 약관, Responsible Gaming, 연령 고지, Bonus Code/Affiliate/Q-TAG, 국가별 금지 표현, CTA 링크 정책, 기간·조건 필수 입력 등을 **AI prompt가 아니라 Rule Base**로 통제한다(AI 생성 전/후 검증).

### 4.5 디자인 시스템·i18n·브랜드

- **디자인 토큰 체계**: `--app-*`(앱 UI) / `--promo-*`(프로모션) 2계층, 관리자에서 값 입력(CSV/스키마)으로 적용.
- **i18n(다국어)**: 관리자 UI 문구를 메시지 키로 관리(코드 배포 없이 편집·승인·롤백).
- **브랜드(GGPoker)**: 톤앤매너·컬러(레드/골드/블랙)·이미지 생성 프롬프트를 프로모션 빌더에 반영.

## 5. 현재 구현 현황

DB 마이그레이션은 `030`까지 진행됐고, 초기 기획의 상당 부분이 실제 구현되었다.

| 영역 | 현황 | 근거 |
|---|---|---|
| DB 기반 템플릿/섹션/아이템 | **구현** | 016~018, 022, 023 |
| 아이템 컴포넌트 + 디자인 토큰 | **구현** | 028, 029, 관리자 `components` 탭 |
| 섹션 AI 디자인(레이아웃·이미지, 다이렉트 LLM) | **구현** | 025, 026, `promo-section-design-*` |
| Visual Editor / Web Output (Vue 렌더러, `--promo-*`) | **구현** | `visual-editor.html`, `visual-output.html` |
| i18n(다국어) 메시지 | **백엔드 구현** | 027, `locale-*` API (관리자 탭 노출은 미완) |
| 디자인 토큰 2계층 | **구현/진행** | `design-tokens.css`, CSV/스키마 |
| 단일 글로벌 네비 | **구현** | `shared-shell.js` |
| 생성 이력 DB 저장 | **구현** | `promo_section_design_runs` (025, 030) |

## 6. 남은 격차 (우선순위)

1. **운영 정책 Rule Base 검증 — 최우선 미완.** 약관 입력란만 있고 리전별 필수·RG·연령 고지 등 규칙 검증은 약하다. AI 생성과 별개의 Rule Base로 구현한다.
2. **검수 → 승인 → 코드 생성 → 퍼블리싱 자동화.** Visual Editor 편집·Web Output을 승인·퍼블리싱 자동화까지 연결(§2 원칙 4의 Vue-first 렌더 확정 흐름).
3. **정보구조 통합 완성.** 경로 평탄화(`/prototype/*` 제거), Create Promo + Promo Wizard 단일화, Promo Builder의 Admin 흡수.
4. **AI 추천 다양성 엔진 고도화 + MD의 생성 검증 조건화.** Design Concept 추천을 강화하고, `layoutPhilosophy`·`componentStyle`·`dos/donts`를 생성 결과 검증 규칙으로 사용.
5. **진행 중 체계 안정화·이관.** 아이템 컴포넌트·디자인 토큰(028·029) 배포, i18n 관리자 탭 노출·전면 라벨 전환.

## 7. 결론

초기 "디자인 MD + 입력값 → UI 디자인 이미지 생성" 실험 단계는 통과했다. 현재는 **DB 기반 운영형 구조 + 제작/편집/출력 화면 분리 + 섹션 AI 디자인 + i18n·컴포넌트·디자인 토큰 체계**까지 진전했다.

최종 목표인 **"운영자가 쓰는 AI 기반 프로모션 디자인·퍼블리싱 빌더"** 로 가기 위한 다음 무게중심은 ① 운영 정책 Rule Base, ② 검수→승인→퍼블리싱 자동화, ③ 정보구조 통합, ④ AI 추천 다양성·MD 검증 고도화다.

## 부록 A. 통합·정정 메모

- `promo-builder-wizard-design-request-2026-07-10`은 당시 `standalone-promo-wizard` 방향으로 이미 **대체(Superseded)** 되어, 역사적 맥락으로만 반영했다.
- `ai-design-recommendation-workflow-proposal(v3)`의 Stage 0~2·run/콘셉트 데이터 모델은 상당 부분 구현됐고, Stage 1.5(Rule Validation)·Stage 7(코드/퍼블리싱)은 미완이다.
- `visual-template-editor` 제안과 `automated-vue` 권고의 핵심(이미지→코드 역변환 지양, Vue-first, 단일 렌더러)은 현재 Visual Editor/Web Output 구조로 채택됐다.
- 초기 PRD가 요구한 섹션/아이템 관리자 관리는 마이그레이션 016~029로 구현됐다.

# Promo Web Builder 정보구조(IA) 목표 — To-Be

- 작성일: 2026-07-21
- 대상 프로젝트: `promo_web_builder`
- 관점: To-Be (통합 방향 제안)
- 선행 문서:
  - `docs/information-architecture-as-is-2026-07-21.md` (현황)
  - `docs/source-code-cleanup-and-consolidation-development-plan-2026-07-21.md` (App Shell/모듈화)
  - `docs/css-design-token-unification-development-plan-2026-07-21.md` (토큰 2계층)
- 상태: 제안 / 소스코드 미반영

## 1. 목표 원칙

As-Is의 6개 화면은 진입 이중화(`/` vs `/prototype/*`), 기술 스택 혼재, Promo Builder/Admin 물리적 결합, 글로벌 메뉴 4중 관리, Create Promo/Wizard 흐름 중복이라는 문제를 안고 있다. To-Be는 다음 원칙으로 이를 정리한다.

1. **단일 App Shell.** 좌측 글로벌 네비 + 중앙 워크스페이스 + 우측 컨텍스트 패널을 모든 화면이 공유한다. 헤더·메뉴는 한 곳에서 정의한다.
2. **작업 목적 기준 최상위 분류.** 화면 파일 위치가 아니라 사용자 작업(제작 / 편집 / 관리)을 축으로 IA를 나눈다.
3. **경로 평탄화.** `/prototype/*` 중첩과 redirect 프록시를 제거하고 의미 있는 최상위 경로로 정리한다.
4. **토큰 2계층.** 편집기 UI 토큰(Layer A)은 통일, 프로모션 콘텐츠 토큰(`--promo-*`, Layer B)은 프로모션별 격리 유지.
5. **생성 계보 단일화 방향.** 신규 AI 기능은 다이렉트 LLM으로, n8n 경유 파이프라인은 Feature Flag 병행 후 축소.

## 2. To-Be 최상위 IA

```text
Promo Web Builder (단일 App Shell)
│
├─ 좌측 글로벌 네비 (단일 설정 객체로 관리)
│   ├─ 제작   Create        ← 통합된 단일 제작 흐름
│   ├─ 편집   Editor        ← Visual Editor
│   ├─ 결과   Output        ← Web Output / 생성물
│   └─ 관리   Admin         ← 관리 콘솔 (Builder 흡수)
│
├─ 중앙 워크스페이스 (선택한 영역의 작업 화면)
└─ 우측 컨텍스트 패널 (선택 대상 속성/AI/상태)
```

핵심 변화 세 가지:

- **Create Promo + Promo Wizard → 단일 "제작(Create)" 흐름**으로 통합. 두 중복 흐름을 하나로 합치고, 필요한 차이는 모드/옵션으로 표현.
- **Promo Builder → Admin으로 흡수.** 별도 화면이 아니라 관리 콘솔의 한 영역으로 재배치.
- **루트 랜딩 카드 5개 → 좌측 네비 4영역**으로 대체. 진입 허브를 별도 페이지가 아닌 상시 네비로.

## 3. 목표 경로 체계

| 영역 | To-Be 경로 | As-Is 대응 | 변화 |
|---|---|---|---|
| 제작 Create | `/create` | `/prototype/create-promo.html` + `/prototype/promo-wizard.html` | 두 흐름 통합, redirect 제거 |
| 편집 Editor | `/editor` | `/prototype/visual-editor.html` | 경로 평탄화 |
| 결과 Output | `/output` | `/prototype/visual-output.html`, `/generated.html` | 통합, redirect 제거 |
| 관리 Admin | `/admin` | `/prototype/index.html?view=admin` | 쿼리 분기 → 정식 경로 |
| (관리 하위) | `/admin/templates` 등 | `?tab=promo-form` 등 | 탭을 경로 세그먼트로 |

경로 재작성은 Vercel routing으로 처리하고, 기존 루트 프록시(`create-promo.html`, `promo-wizard.html`, `generated.html`)와 `/prototype/` 중첩을 제거한다. 외부 북마크·계약 테스트 호환을 위해 구경로 → 신경로 301/308 rewrite를 한시적으로 유지한다.

## 4. 영역별 To-Be IA

### 4.1 제작 Create (`/create`)

Create Promo와 Promo Wizard를 하나로 합친 단일 제작 흐름. 공통 모듈(`wizard-core/content/template/layout`)을 재사용한다.

```text
Create
├─ 1. 템플릿 선택        관리자 활성 Form Template
├─ 2. 스타일 설정        배경/CTA 등 프로모션 디자인 토큰(Layer B) 지정
├─ 3. 콘텐츠 구성        섹션·아이템 입력
│      ├─ 섹션 AI 디자인   레이아웃 variant + 이미지 [다이렉트 LLM]
│      └─ (신규) NLP 블록 구성  허용된 블록 라이브러리 내 조합 [다이렉트 LLM]
└─ 4. 출력 연결          Editor/Output으로 스냅샷 전달
```

- 신규 "NLP 블록 구성"은 자유 생성이 아니라 관리자 정의 블록(예: 카드 그리드) 안에서 선택·배치. 기존 섹션 AI 어댑터(`generateSectionLayout`) 확장으로 구현.

### 4.2 편집 Editor (`/editor`)

Visual Editor. App Shell 안에서 3열 워크스페이스로 동작. embedded mode에서는 글로벌 Shell을 렌더링하지 않는다.

```text
Editor
├─ SECTIONS  섹션 목록/순서
├─ CONTENT   아이템 속성 편집 (우측 컨텍스트 패널로 승격 가능)
└─ PREVIEW   실제 Renderer (--promo-* 토큰, 프로모션별 격리)
```

### 4.3 결과 Output (`/output`)

Web Output과 생성물 보기를 통합. 동일 Renderer 번들 + 동일 스냅샷, 편집 가이드 없음.

### 4.4 관리 Admin (`/admin`)

As-Is에서 단일 SPA에 몰려 있던 관리 기능을 경로 세그먼트로 분리하고, Promo Builder(디자인 설정/생성 결과)를 흡수한다. 컴포넌트 분리는 독립성 높은 순서로 진행(정리 계획서 3.4 참조).

```text
Admin
├─ /admin/templates    Form Template / Layout 관리
├─ /admin/sections     Wizard Content Section 관리
├─ /admin/prompts      Prompt Template / Model 설정
├─ /admin/workers      Worker webhook 설정
├─ /admin/design-md    디자인 MD 관리
├─ /admin/audit        Section Audit Log
└─ /admin/results      생성 결과 관리 (구 Promo Builder 흡수)
```

## 5. 스타일/토큰 IA (2계층)

```text
Layer A · 앱/편집기 UI 토큰 (design-tokens.css 단일 출처)
   → App Shell, 네비, 헤더, 패널, 버튼, 카드
   → 4개 영역 전 화면 공유, 통일 대상

Layer B · 프로모션 콘텐츠 토큰 (--promo-*)
   → .promo-renderer 하위 실제 프로모션 페이지
   → designSpec.theme에서 프로모션별 주입, 격리 유지

경계: 두 계층은 상호 참조 금지 (정적 grep 검사로 강제)
```

## 6. 데이터/생성 계보 IA (To-Be)

```text
Admin (템플릿·섹션·레이아웃·블록 정의)
   → 공개 템플릿 API
   → Create (템플릿 로드, 콘텐츠 입력)
       ├─ 섹션 AI 디자인      [다이렉트 LLM]  ← 유지·확장
       └─ NLP 블록 구성        [다이렉트 LLM]  ← 신규
   → Editor / Output (스냅샷 렌더링, --promo-*)

[레거시 트랙 · Feature Flag]
Promo Generation (Integrated Brief / LO-FI / Final)  [n8n 워커]
   → 검증 후 단계적 축소, 신규 기능은 얹지 않음
```

## 7. As-Is → To-Be 전환 경로

한 번에 재작성하지 않고 단계적으로 진행한다. 각 단계는 정리 계획서/토큰 계획서와 연동된다.

1. **App Shell 골격 도입.** 좌측 네비 + 워크스페이스 + 컨텍스트 패널 구조와 글로벌 메뉴 단일 설정 객체 정의(정리 계획서 3.3).
2. **토큰 2계층 적용.** `design-tokens.css` 도입, Layer A 통일, Layer B 격리 명문화(토큰 계획서).
3. **경로 평탄화.** Vercel routing으로 `/create` `/editor` `/output` `/admin` 정식 경로화, redirect 프록시 제거(구경로 rewrite 한시 유지).
4. **제작 흐름 통합.** Create Promo/Wizard 공통 모듈 추출 후 단일 Create 흐름으로 병합(정리 계획서 3.2).
5. **관리 콘솔 분리.** Admin 탭을 경로 세그먼트/컴포넌트로 분리하고 Promo Builder 흡수(정리 계획서 3.4).
6. **생성 계보 정리.** 신규 AI는 다이렉트 LLM, n8n 파이프라인은 Feature Flag 병행 후 축소.

## 8. 결정 필요 사항

착수 전 확정해야 할 항목.

1. 최상위 라벨: 제작/편집/결과/관리(4영역) 확정 여부, 한/영 표기.
2. Create Promo와 Promo Wizard를 실제로 하나로 합칠지, 당분간 모드 분기로 병존할지.
3. Promo Builder를 Admin으로 흡수할지, 독립 영역으로 남길지.
4. 경로 스킴: `/create` 평탄형 vs `/app/create` 접두형.
5. 구경로 rewrite 유지 기간(외부 북마크/계약 테스트 마이그레이션 일정).
6. 통일 기본 테마와 accent 색(토큰 계획서 6장과 동일 결정).

## 9. 기대 효과

- 진입 이중화·redirect 제거로 경로 체계 단순화.
- 글로벌 메뉴 단일 관리로 화면 간 내비 불일치 제거.
- 제작 흐름 통합으로 Create Promo/Wizard 중복 유지보수 해소.
- Admin/Builder 통합으로 관리 기능 탐색성 향상.
- 토큰 2계층으로 UI는 통일, 프로모션 콘텐츠는 브랜드별 다양성 유지.
- 신규 AI 기능의 연동 경로 일원화(다이렉트 LLM).

## 10. 범위 밖

- 실제 컴포넌트 구현/리라이트 (각 정리 계획서에서 단계별 수행)
- 인증·인가 도입 (별도 계획 필요, 아키텍처 문서 리스크 1번)
- NLP 블록 라이브러리 상세 스키마 (별도 설계 필요)
- CMS 연동 등 장기 로드맵

# GGPoker 톤앤매너 · 이미지 생성 프롬프트 · 프로모션 빌더 디자인 토큰

- 작성일: 2026-07-22
- 분석 대상: `https://ggpoker.com/` (홈) + `⭐[Guide 3.5] GGPOKER StyleGuide.fig`
- 목적
  1. GGPoker 브랜드 톤앤매너 정리
  2. 사이트 이미지(히어로·프로모션 배너·배경)를 LLM으로 생성할 때 쓸 **이미지 생성 프롬프트**
  3. 프로모션 빌더에 적용할 **디자인 토큰**
- 근거: 홈 메타(`theme-color:#000000`, `TileColor:#ffffff`), 히어로/프로모션 카피, 이미지 자산 네이밍, StyleGuide 색상 변수(brand=red, neutral scale, semantic)

## 1. 브랜드 포지셔닝 요약

- 슬로건: **"The World's Biggest Poker Room"**, Guinness World Record 보유, EGR Operator Award.
- 핵심 소구: 초대형 상금(“$16M July Giveaway”, “$100K Weekly Freeroll”, “Millions in prizes”), WSOP 진출/브레이슬릿, 데일리 프리비.
- 인물 자산: 앰배서더(Daniel Negreanu 등) 중심의 스타 마케팅.
- 커뮤니티: “Global Poker Community”, 215K+ 동시접속, 소셜/스테이킹.
- 규제·신뢰: 라이선스·책임게임(18+, GamCare) 배지.

## 2. 톤앤매너 (Tone & Manner)

**무드 키워드**: 프리미엄, 하이에너지, 경쟁적, 대담함(bold), 상금 중심(reward-driven), 글로벌, 스타/이벤트 스포트라이트.

- **컬러 무드**: **딥 블랙 기반 다크 UI + 강렬한 레드 브랜드 + 골드/앰버 프리미엄 액센트**. 대비가 크고 채도가 높다.
- **타이포**: 굵은 대문자 헤드라인(“JOIN”, “THE WORLD'S BIGGEST POKER ROOM”), 임팩트 있는 숫자 강조($16M, 200,000x). 본문은 Inter/Roboto 계열의 깔끔한 산세리프.
- **비주얼 모티프**: 포커 카드·칩·트로피·WSOP 브레이슬릿, 스포트라이트/무대 조명, 네온 글로우, 금속·유리 질감, 인물 히어로 컷.
- **레이아웃 톤**: 대형 히어로 점보트론 캐러셀 + 카드형 프로모션 그리드 + 풀블리드 배경 이미지 위 짧은 카피 + 강한 CTA(“Sign Up”, “Download GGPoker”).
- **어조(카피)**: 명령형·초대형 스케일 강조(“Take your seat anytime from anywhere”, “Win big”, “Your path to poker's biggest stage”).

## 3. 이미지 생성 LLM 프롬프트

사이트 이미지 자산은 대부분 프로모션/히어로 배너다(`home_section_jumbotron_*`, `hero_home_join_*`, `home_section_monthly_*`, `home_section_wsop_glory_bg`, `home_section_get_started_bg`). 아래는 이 스타일을 재현하는 재사용 프롬프트다.

### 3.1 공통 스타일 토큰 (모든 프롬프트에 접미로 부착)

```text
premium online poker promotional key visual, GGPoker brand style,
deep black background (#000000–#24242A), bold crimson red accents (#D30000/#FF2F2F),
luxurious gold highlights (#F7A609), high contrast, dramatic studio spotlight,
cinematic rim lighting, glossy metallic and glass textures, subtle neon glow,
casino luxury mood, ultra-detailed, 8k, sharp focus, high-end advertising render
```

### 3.2 유형별 프롬프트 템플릿 (변수 `{ }`는 프로모션 빌더에서 치환)

**A. 히어로 배너 (메인 점보트론)**
```text
Wide cinematic hero banner for "{promo_title}", online poker theme,
poker chips stacking and playing cards fanning with motion,
glowing {prize_amount} prize typography space on the right,
dark stage with red and gold spotlights, dramatic depth of field,
empty negative space for headline and CTA button, 16:9,
+ [공통 스타일 토큰]
```

**B. 프로모션/기브어웨이 카드 이미지**
```text
Square promotional thumbnail for "{promo_title}",
central golden trophy / falling cash / gift box motif,
red-to-black radial gradient background, celebratory confetti sparkle,
premium badge frame, room for short title overlay, 1:1,
+ [공통 스타일 토큰]
```

**C. 배경 이미지 (섹션 backdrop, 텍스트 위 배치)**
```text
Full-bleed dark textured background for a poker promotion section,
abstract felt-green-to-black or red-to-black gradient, faint poker suit patterns,
soft vignette, low visual noise so overlaid white text stays readable,
no text, no logo, 21:9,
+ [공통 스타일 토큰]
```

**D. 이벤트/WSOP 프레스티지 배경**
```text
Prestigious poker championship stage background, tournament arena,
gold bracelet and trophy bokeh, spotlight beams, luxurious dark red drapes,
aspirational "biggest stage" mood, cinematic wide shot, no text, 21:9,
+ [공통 스타일 토큰]
```

**E. 앰배서더/인물 스타일 컷 (실제 인물 대신 컨셉 비주얼)**
```text
Confident professional poker player silhouette at a high-stakes table,
dramatic single-source spotlight, chips and cards in foreground,
dark premium background with red glow, editorial sports-hero framing,
space for name/label lower-third, 4:5,
+ [공통 스타일 토큰]
```
> 실존 앰배서더(예: Daniel Negreanu)의 초상은 저작권·퍼블리시티권 문제로 **실명·실인물 생성 금지**. 익명 실루엣/컨셉 컷만 생성한다.

### 3.3 네거티브 프롬프트 (공통)

```text
text artifacts, watermark, distorted typography, extra fingers, deformed hands,
low contrast, washed-out colors, childish cartoon, clip-art, stock-photo blandness,
real recognizable celebrity faces, brand logos of other companies,
underage figures, cluttered composition covering text area
```

### 3.4 프로모션 빌더 연동 파라미터

| 변수 | 예시 | 용도 |
|---|---|---|
| `{promo_title}` | "$16M July Giveaway" | 헤드라인 소구 |
| `{prize_amount}` | "$16,000,000" | 상금 강조 요소 |
| `{motif}` | trophy / cash / gift / bracelet | 중심 오브젝트 |
| `{aspect}` | 16:9 / 1:1 / 21:9 / 4:5 | 배치 위치별 비율 |
| `{mood}` | celebratory / prestige / high-action | 톤 조정 |

렌더러는 `[공통 스타일 토큰]` + 유형 템플릿 + 변수 치환 + 네거티브를 합쳐 최종 프롬프트를 구성한다. 자유 형식 프롬프트를 그대로 받지 않고, 이 템플릿 슬롯만 채우는 방식으로 브랜드 일관성을 강제한다.

## 4. 프로모션 빌더 디자인 토큰

사이트 메타(`theme-color:#000000`)와 StyleGuide 변수가 일치한다. 아래 값은 이미 `docs/claude/design-tokens.csv` / `design-tokens.schema.json`에 GGPoker 테마로 반영되어 있다. 프로모션 콘텐츠용 `--promo-*` 네임스페이스로도 그대로 승격할 수 있다.

### 4.1 브랜드 코어

| 토큰 | 값 | 용도 |
|---|---|---|
| `--promo-bg` | `#000000` | 페이지/섹션 기본 배경 |
| `--promo-surface` | `#24242A` / `#262626` | 카드·패널 표면 |
| `--promo-ink` | `#FFFFFF` | 기본 텍스트 |
| `--promo-ink-sub` | `#CCCCCC` / `#969696` | 보조 텍스트 |
| `--promo-brand` | `#D30000` | 브랜드 레드(기본) |
| `--promo-brand-strong` | `#960000` | 진한 레드(hover/press) |
| `--promo-brand-bright` | `#FF2F2F` | 강조/다크 위 CTA |
| `--promo-accent-gold` | `#F7A609` | 프리미엄·상금·WSOP 액센트 |
| `--promo-on-brand` | `#FFFFFF` | 브랜드 위 텍스트 |

### 4.2 시맨틱 (StyleGuide 직접값)

| 토큰 | 값 |
|---|---|
| `--promo-success` | `#12B76A` |
| `--promo-error` | `#F04438` |
| `--promo-warning` | `#F7A609` |
| `--promo-info` | `#2E90FA` |

### 4.3 뉴트럴 스케일

`#FFFFFF · #F6F6F6 · #E5E5E5 · #CCCCCC · #969696 · #737373 · #525252 · #404040 · #262626 · #171717 · #000000`

### 4.4 타이포·형태 (제안)

| 항목 | 값 | 비고 |
|---|---|---|
| 헤드라인 폰트 | Inter (또는 유사 Grotesk), **Bold/Black, 대문자** | 임팩트 강조 |
| 본문 폰트 | Inter / Roboto | StyleGuide 사용 폰트 |
| 헤드라인 강조 | 상금 숫자 초대형·굵게, 레드/골드 하이라이트 | 사이트 패턴 |
| 코너 라운드 | 8–12px | 카드/버튼 |
| CTA 버튼 | 레드 필 + 흰 텍스트, 강한 대비 | "Sign Up/Download" 패턴 |

> `--promo-accent-gold`는 사이트의 프리미엄/상금 톤(골드)을 반영한 **제안 토큰**입니다. StyleGuide의 `warning/500(#F7A609)`을 골드 액센트로 재활용했습니다. 순수 브랜드/뉴트럴/시맨틱은 fig 직접 추출값입니다.

## 5. 적용 메모

- 프로모션 최종 페이지는 앱 UI 토큰(`--app-*`)과 분리된 `--promo-*` 네임스페이스를 사용한다(기존 Layer A/B 경계 유지).
- 이미지 프롬프트는 서버에서 `[공통 스타일 토큰] + 유형 템플릿 + 검증된 변수`로만 조립하고, 사용자·AI 자유 프롬프트를 그대로 전달하지 않는다.
- 실존 인물·타사 로고·미성년 묘사는 생성 금지 규칙으로 고정한다.

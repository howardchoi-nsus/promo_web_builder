# 검토 의견: 랜딩 페이지 3버튼 + 페이지별 폴더 분리 구성안 (2026-07-15)

Reviewer: Claude
Date: 2026-07-15
검토 대상 제안:
1. `https://promo-web-builder.vercel.app/` 진입 시 랜딩 페이지에 Promo Wizard / Promo Builder / ADMIN 버튼 3개를 두고 각 페이지로 이동
2. Wizard 외 페이지들이 하나의 폴더(`prototype/`)에 묶여 있는 것을 페이지별 폴더 구성으로 변경

## 결론

**방향은 타당하다.** 특히 Admin 분리는 07-10 분리 제안, 07-14/15 코드·UI 리뷰에서 반복 지적된 문제(관리자 화면이 사용자 SPA에 내장, handoff-picker 사용자 노출, 인증 게이트 적용 단위 부재)를 구조적으로 해결하는 올바른 수순이다. 랜딩 페이지도 현재 루트가 Builder로 강제 redirect되는 구조(진입점이 사실상 Builder 하나)보다 명확하다.

단, 두 가지를 인지하고 진행해야 한다.

1. **이 작업은 "폴더 이동"이 아니라 "SPA 분해"다.** Builder와 Admin은 `prototype/index.html`(1,738줄) + `app.js`(5,116줄) 하나의 Vue 앱을 `currentView` 스위치로 공유한다. 물리적으로 폴더를 나누려면 이 앱을 쪼개야 하며, 무리하게 한 번에 쪼개면 회귀 위험이 크다. 아래에 저위험 단계별 적용안을 제시한다.
2. **인증 없는 현 상태에서 랜딩에 ADMIN 버튼을 노출하는 것은 보안상 후퇴는 아니지만(이미 topbar에 노출 중) 개선도 아니다.** `/admin` 경로 분리는 그 자체가 목적이 아니라 경로 단위 접근 제한(Vercel Deployment Protection, middleware)을 걸 수 있는 단위를 만드는 것이 실익이므로, 분리와 동시에 최소한의 접근 제한을 함께 적용할 것을 권장한다.

## 현재 구조 확인

```text
/index.html          → JS redirect → /prototype/index.html   (Builder+Admin 단일 Vue 앱)
/promo-wizard.html   → JS redirect → /prototype/promo-wizard.html  (query 보존)
/generated.html      → JS redirect → /prototype/generated.html
/prototype/
  index.html, app.js, styles.css      Builder + Admin (currentView 스위치)
  promo-wizard.html/js/css            Wizard (독립 앱, 이미 분리되어 있음)
  generated.html, generated.js        생성 결과 뷰
  assets/concept-thumbnails/          Wizard 썸네일
/api/…               serverless functions (경로 영향 없음)
vercel.json          cleanUrls만 설정, rewrites/redirects 없음
```

확인된 사실: API 호출은 app.js 49곳, promo-wizard.js 8곳 전부 `/api/...` 절대 경로라 폴더 이동의 영향이 없다. 반면 Wizard 썸네일은 `assets/concept-thumbnails/...` 상대 경로(promo-wizard.js 406~412행), 페이지 간 링크도 상대 경로(`index.html`, `generated.html`)라 이동 시 전부 갱신 대상이다. localStorage는 origin 단위이므로 경로가 바뀌어도 기존 입력값·run 상태는 유지된다.

## 제안 폴더 구성안

```text
/index.html              랜딩 (Wizard / Builder / Admin 3버튼, redirect 제거)
/wizard/
  index.html, wizard.js, wizard.css
  assets/concept-thumbnails/
/builder/
  index.html, builder.js
  generated.html, generated.js       ← 생성 결과는 Builder 부속으로 배치
/admin/
  index.html, admin.js
/shared/
  styles.css                          ← Builder/Admin 공용 (Wizard는 자체 CSS)
  common.js (선택)                    ← setStatus, fetch 헬퍼, 테마 등 공용 추출 시
```

`cleanUrls: true`가 이미 설정되어 있으므로 폴더별 `index.html`은 `/wizard`, `/builder`, `/admin`으로 접근된다. 루트의 기존 redirect 스텁 3개는 삭제하고, 하위 호환은 `vercel.json`의 `redirects`로 처리한다.

```json
{
  "redirects": [
    { "source": "/prototype/index.html", "destination": "/builder", "permanent": true },
    { "source": "/prototype/promo-wizard.html", "destination": "/wizard", "permanent": true },
    { "source": "/prototype/generated.html", "destination": "/builder/generated", "permanent": true },
    { "source": "/promo-wizard.html", "destination": "/wizard", "permanent": true },
    { "source": "/generated.html", "destination": "/builder/generated", "permanent": true }
  ]
}
```

JS redirect(현행)보다 서버 redirect가 깜빡임 없고 query 보존도 안전하다. 단, Wizard 링크는 `?` query를 쓰는 flow가 있으므로 redirect 시 query 전달 여부를 배포 후 확인해야 한다.

## 주요 검토 포인트

### 1. Builder/Admin 분해 비용 — 단계적 접근 권장

app.js 5,116줄에는 Builder 로직과 Admin 로직(약 1,300줄)이 하나의 Vue 인스턴스 데이터/메서드로 얽혀 있고 styles.css(65KB)도 공유한다. 한 번에 두 앱으로 쪼개면 참조 누락 회귀 위험이 크다. 권장 순서:

- **Phase 1 (저위험, 즉시 가능)**: 랜딩 생성 + `/admin/index.html`과 `/builder/index.html`이 **동일한 app.js를 로드**하되, admin은 진입 시 `currentView = 'prompts'` 고정(및 빌더 전환 버튼 제거), builder는 `'builder'` 고정 + 관리자 버튼 제거. 코드 중복 없이 URL 분리 효과(경로 기반 접근 제한 가능, 사용자 화면에서 관리자 진입 버튼 제거)를 얻는다. handoff-picker도 이때 admin 쪽에만 남긴다(07-10 제안 자동 해결).
- **Phase 2**: app.js에서 admin 메서드/데이터를 `admin.js`로 물리 분리, 공용 유틸을 `shared/common.js`로 추출. `v-if="false"` 죽은 섹션 라이브러리 마크업(약 250줄)과 대응 메서드도 이때 함께 정리하면 분리 비용이 줄어든다.
- **Phase 3**: `/admin` 경로에 인증 게이트 적용(Deployment Protection 또는 middleware). 07-15 코드 리뷰 이슈 1과 연결.

### 2. ADMIN 버튼 노출 정책

랜딩은 사용자(Wizard)와 내부 도구(Builder/Admin)가 한 화면에 놓이는 자리다. 권장: Wizard를 주 버튼으로 크게, Builder/Admin은 "내부 도구" 구분 아래 보조 버튼으로 배치. 인증 도입 전까지 ADMIN 버튼을 랜딩에서 빼는 선택지도 있으나, 현재도 Builder topbar에 관리자 버튼이 노출되어 있으므로 실질 보안 차이는 없다 — 실질 개선은 Phase 3의 경로 보호에서 나온다.

### 3. 이동 시 갱신 필요한 참조 목록

- `prototype/promo-wizard.js` 406~412행: `assets/concept-thumbnails/...` 상대 경로 (wizard 폴더로 assets 동반 이동 시 유지 가능, 위치가 달라지면 수정)
- `prototype/index.html` 29~30행: `/promo-wizard.html`, `generated.html` 링크
- `prototype/promo-wizard.html` 헤더 nav: `index.html`, `generated.html` 링크
- 루트 `app.js`의 `./prototype/app.js?v=b-section-mode-v5` 로더 스텁 (폐기 대상)
- 각 html의 CSS/JS 캐시버스팅 쿼리(`?v=...`) — 파일 이동 시 새 버전 문자열 권장
- `docs/` 문서들의 경로 언급은 이후 handoff에 신구 경로 매핑 기록

### 4. 영향 없는 것 (확인 완료)

- API 47+개 endpoint: 페이지가 아닌 `/api/*` 경로이므로 무영향
- localStorage(Wizard 입력값, run 상태, 테마): origin 단위 저장이라 유지됨
- n8n worker: webhook/API만 호출하므로 무영향
- contract test 스크립트: API 대상이므로 무영향

## 제안 우선순위

1. Phase 1 실행: 랜딩 + `/wizard` `/builder` `/admin` 폴더 + 동일 앱 재사용 + vercel.json redirects — 반나절 규모, 회귀 위험 낮음
2. `/admin` 접근 제한(Deployment Protection이라도) — Phase 1 직후
3. Phase 2 코드 분해는 죽은 코드 정리와 묶어서 별도 작업으로

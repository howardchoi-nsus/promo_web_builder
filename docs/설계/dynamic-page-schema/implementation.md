# 동적 PageSchema 구현 및 활성화

## 구현 범위

- `POST /api/promo-page-schema`: 확정 개요 → 활성 `promo_page_schema_planner` → structured output → JSON Schema·정책·콘텐츠·접근성 검사 → 반응형 보완 → 재검증 → 리비전 저장.
- 같은 POST의 `instruction`: 현재 문서와 고정된 콘텐츠·정책으로 자연어 수정. `PUT`: PageSchema JSON 편집 저장. 모든 수정은 소유 세션과 기준 리비전을 확인한다.
- 범용 요소 11종을 `PageSchemaRenderer.vue`에서 재귀 렌더링한다. HTML 문자열, 임의 props, 이벤트 속성, 자유 CSS, 템플릿 선택은 AI 출력으로 받지 않는다.
- 중앙 역할 → 생성 시 고정한 등록 토큰으로 스타일을 해석한다. 일반 텍스트는 `text.primary`, 글꼴과 크기도 해당 text 역할을 기본 적용한다. 버튼 전용 토큰을 본문으로 재사용하지 않는다.
- 최대 200개 요소, 깊이 8, JSON 256 KiB, 이미지 요청 8개. 모바일 누락 시 grid 1열, stack 세로 배치, span 보정. 태블릿 누락 grid 최대 2열.
- 확정/필수/법적 콘텐츠는 원문 출처 ID로 참조한다. 누락과 임의 변경을 검사하고, 이미지 안의 텍스트로 필수 문구를 대체하지 않는다.
- `promo-page-schema-media`: 이미지별 생성·PNG/JPEG/WebP 업로드, 고객이 명시한 버튼 URL 및 동영상/자막 URL 연결. 이미지는 기존 활성 `component_image` 프롬프트·모델로 생성한다. Private Blob 이미지 읽기는 무작위 토큰의 해시를 DB에서 확인한다.
- 미리보기, HTML/Vue/React 내보내기, Nuxt 읽기 렌더러가 같은 PageSchema를 사용한다. 출력 전 Desktop/Tablet/Mobile 검사 및 서버의 최종 의미 검증을 요구한다.
- 실패하면 오류를 표시하고 이전 정상 리비전을 유지한다. 자동으로 다른 템플릿이나 하드코딩된 스타일로 대체하지 않는다.

문서 envelope는 기존 `contractVersion: 3`을 유지하고 `snapshotType: page-schema`, `page-schema-renderer@1`로 구별한다. PageSchema 자체는 `page-schema-v1`이다. 기존 V2/V3 문서는 기존 렌더러를 계속 사용한다. 마이그레이션은 신규 PageSchema 저장 행의 계약 메타데이터만 3으로 기록하도록 기존 리비전 함수를 보완한다.

## 운영 활성화 순서

1. `db/migrations/086_dynamic_page_schema_prompt.sql`을 해당 DB에 적용한다. 이미지 메타데이터 테이블과 새 프롬프트 Draft를 생성한다. 기존 활성 `promo_page_composer`가 없으면 프롬프트 Draft는 생성되지 않는다.
2. 관리자 프롬프트 목록의 **3단계 · AI 동적 페이지 구조 설계**를 검토·검증·활성화한다. 모델, 출력 토큰 예산과 timeout은 관리자가 등록한 설정을 사용한다. 큰 재귀 JSON에 충분한 출력 예산을 지정해야 한다.
3. 단일 `design-system` 라이브러리와 중앙 토큰 사용 정책이 활성 상태인지 확인한다. 이미지 생성에는 활성 `component_image`, 모델 API 키와 `BLOB_READ_WRITE_TOKEN`이 필요하다.
4. Vercel 대상 환경에 `PAGE_SCHEMA_GENERATION_ENABLED=true`를 지정하고 배포한다. 기본값은 false다. 코드만 배포해 기존 생성 경로를 즉시 전환하지 않는다.
5. 새 요청 생성 → 페이지 미리보기 → 이미지 생성 또는 업로드 → 버튼 URL 연결 → 자연어/구조 편집 → 세 화면 품질 검사 → 출력 및 HTML 다운로드 순서로 실제 환경을 검증한다.

이 작업 환경에서는 실제 운영 DB 변경, 외부 LLM 호출, Vercel 배포는 수행하지 않았다. 로컬 검증은 모델·저장소 대역을 포함한 API 테스트와 실제 Chromium의 생성→미리보기→구조 편집→세 화면 품질 검사 흐름, 격리 PostgreSQL에서의 SQL 실행으로 수행했다.

## 현재 한계

- 구조 편집 UI는 JSON 편집이며 드래그 기반 노드 편집은 제공하지 않는다.
- 입력 요소는 등록된 formFields/submit action이 없으면 미리보기 전용이다. 폼 등록 UI/수집 엔드포인트는 이번 구현에 포함하지 않았다. 동작하지 않는 폼은 최종 출력을 차단한다.
- 이미지는 요청별 생성 버튼 또는 업로드로 해결한다. 동영상 생성은 지원하지 않으며 승인 URL과 자막을 연결한다.
- 스키마 실패의 자동 LLM 재시도는 하지 않는다. 오류를 표시하고 이전 결과를 유지한다.
- 브라우저 검사는 오버플로·이미지 로딩·필수 연결 상태를 확인한다. 색 대비나 시각적 완성도 전체를 자동 보증하지 않는다. 외부 모델의 실제 생성 품질·비용·지연은 운영 설정으로 별도 확인해야 한다.

## 검증 명령

```sh
pnpm run test:page-schema
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium pnpm run test:page-schema-browser
pnpm run build
```

추가 검증: 기존 토큰 정책/API, 프롬프트 그룹·프롬프트 하드코딩 금지, API 콜드 스타트, 품질 게이트, export 및 Nuxt/게시 계약 테스트. Migration 086은 격리 PostgreSQL에서 두 번 실행해 중복 생성 방지, Draft 설정, 소유권과 리비전 충돌을 확인했다.

## 출력 스타일 정책 보완

미리보기·웹 출력·HTML 및 Nuxt 읽기 화면은 `IsolatedOutputFrame`의 별도 문서에서 렌더링한다. 빌더 CSS와 `--app-*` 상속을 차단하며, 출력 문서는 `output-only.css`의 구조 초기화와 등록 토큰 참조만 사용한다. 편집 도구의 CSS 파일을 출력 문서에 불러오지 않는다. 서버 렌더링은 iframe `srcdoc`에 초기 콘텐츠를 포함하고, 브라우저에서는 같은 Vue 트리를 연결한다.

`layout-token-policy.cjs`가 필수 grid/breakpoint 이름·타입·순서를 검사한다. `desktop-1920`, `desktop-1440`, `tablet-768`, `mobile-375` 프로필의 columns/gutter/margin-inline, tablet-min/desktop-min breakpoint, desktop-1920 reference width가 필요하다. 빈 범용 `--grid-columns` 등의 항목을 임의 값으로 채우지 않는다.

- Grid columns는 실제 CSS grid track 수와 AI 논리 컬럼 수의 상한으로 사용한다. AI의 컬럼 비율과 점유를 등록 그리드의 정수 span으로 환산한다. 예를 들어 12 track에서 1:2는 4:8 span이다. 임의 비율은 그리드 단위로 반올림하므로 정확한 소수 비율 대신 가장 가까운 등록 그리드 배치를 사용한다. 콘텐츠가 2열이라고 해서 12개 카드로 강제하지 않는다.
- Grid gutter는 grid의 기본 간격, margin-inline은 페이지 바깥 여백으로 적용한다. 간격을 명시적으로 선택하면 해당 spacing 토큰이 우선한다.
- `styles.spacing = {base:{gap,padding,margin},tablet:null,mobile:null}`로 등록된 `--spacing-*` 토큰을 선택할 수 있다. 각 값은 토큰명 또는 null이다. 기존 저장 문서는 이 필드가 없어도 읽으며 새 구조화 출력에는 필드를 요구한다.
- 반응형 CSS는 고정 639/1023px 대신 등록한 breakpoint의 해석된 값으로 생성한다. CSS media query는 일반 custom property `var()`를 지원하지 않으므로 여기에는 등록 값을 직렬화한다.
- 기존 V2/V3 출력에도 동일 격리·정책 검사를 적용한다. 필요한 토큰이나 정책이 없거나 미등록 스타일이 남은 문서는 임의 대체 없이 차단되므로 토큰 연결 후 재저장 또는 재생성이 필요하다.

새로운 spacing 선택 안내를 적용하려면 migration `087_strict_output_token_prompt.sql`이 생성하는 **AI 동적 페이지 구조 설계 — Registered Layout** Draft를 검토·활성화한다. 토큰 데이터 자체를 자동 수정하거나 활성 프롬프트를 덮어쓰지 않는다.

구분선의 색·두께도 `divider.color`와 `divider.width` 정책으로 연결한다. 연결이 없으면 브라우저 기본 회색 선으로 대체하지 않고 품질 검사에서 누락을 표시한다.

## 기존 문서의 토큰 누락 복구

`LAYOUT_TOKEN_REQUIRED`는 겹침이 아니라 문서에 고정된 token values/catalog에서 등록된 grid 기준을 찾지 못했다는 의미다. 활성 라이브러리와 문서의 과거 스냅샷은 다를 수 있다.

미리보기의 **활성 등록 토큰 다시 연결**은 소유 세션과 기준 문서 리비전을 확인한 뒤, 현재 활성 `design-system` 및 사용 정책을 검증하여 새 리비전으로 연결한다. 문구·노드 구조·이미지·액션은 유지하며 품질 검사는 pending으로 되돌려 다시 수행한다. 이미 등록된 값만 사용한다. 활성 라이브러리 자체에 필수 토큰이 없거나 현재 디자인과 정책이 호환되지 않으면 변경 없이 거절한다. 이때 관리자에서 토큰 등록·정책 연결 또는 디자인 재생성이 필요하다. 자동 기본값 삽입이나 과거 문서의 무조건적인 토큰 교체는 하지 않는다.

신규 Registry 생성도 후보 준비 단계에서 grid 필수 항목을 검사하므로 누락된 상태로 LLM을 호출하지 않는다. 오류 목록은 화면 크기별 중복을 합쳐 최대 30개를 표시하며, 가로로 압축하지 않고 접을 수 있는 목록으로 보여준다.

검증 참고: 기존 `test-promo-registry-composition-compiler.js:205`의 free 좌표(`xPct:10`) 기대값 불일치는 변경 전 main(91b07a0)에서도 동일하게 재현된다. 이번 토큰 재연결 변경과 분리해 확인했다. 신규 복구 API·활성 후보 검사·브라우저 복구 검증은 통과했다.


### 2026-11-11 저장 계약 및 자동 품질 검사 보완
- V3 편집 저장 시 등록 토큰 catalog/usagePolicy를 유지하고 정책 기반 매핑을 사용한다. 정책 누락 문서는 저장을 거절한다.
- 품질 통과 저장은 검사한 현재 문서와 동일한 내용에만 허용하며, 디자인 재정규화 없이 결과만 기록한다. 변경 내용은 먼저 pending 리비전으로 저장하고 다시 검사한다.
- 최종 미리보기 진입·재접속·리비전 변경 시 자동 검사한다. 같은 리비전의 실패를 무한 재시도하지 않는다. 자동 보정은 최대 두 번이며 저장한 결과를 다시 검사한다.
- Registry V3 채팅은 디자인 적용 시 finalizing을 유지하고 저장된 품질 통과 후 completed로 전환한다.
- 회귀 검증: scripts/test-registered-token-save-roundtrip.mjs는 실제 legacy normalizer의 토큰 보존, 잘못된 인증 거절, 정책 누락 저장 거절을 확인한다. 토큰 복구 브라우저 테스트는 실제 normalizer로 품질 결과를 저장하며 버튼 없이 자동 검사되는 것을 확인한다.

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

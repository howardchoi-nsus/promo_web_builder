# Nuxt Runtime·관리자 DOM Workbench·Directus Tunnel 구현 결과

## 구현 상태

- Nuxt Runtime: 완료
- Visual Editor Publication 관리·서명 Preview·캐시 무효화: 완료
- Nuxt 전용 Export·호환성 Manifest: 완료
- 관리자 Component DOM Tree·Inspector·Single Live Preview: 완료
- 관리자 Section DOM Workbench·Single Live Preview: 완료
- 기존 관리자 Visual Editor: 기본 비활성, Feature Flag Rollback 유지
- Directus Integration Config: 완료
- Directus 연결 Tunnel: Mock 기준 완료
- Directus Collection Mapping·Migration·Runtime Read/Write: 미구현(협의 후 진행)

## 실행 구조

```text
Builder Document Revision
→ promo_builder_publications
→ /api/promo-publication
→ Nuxt /api/promotions/:slug
→ PromoReadonlyRenderer SSR
→ /promotions/:slug
```

Directus는 공개 페이지 데이터 흐름에 연결되지 않는다.

```text
설정 > Integration Config
→ Versioned Config Draft
→ URL·secretRef Validate
→ Activate/Suspend
→ 서버 전용 /server/health, /users/me 연결 검사
→ 검사 이력 저장
```

## DB Migration

기존 Migration 적용 절차에 다음 파일을 번호 순서대로 추가한다.

1. `db/migrations/069_promo_publication_runtime.sql`
2. `db/migrations/070_directus_connection_tunnel.sql`

069는 게시 Slug와 고정 Document Revision을 연결한다. 070은 Directus 연결 Config Version과 연결 검사 감사 이력만 생성한다. Directus Collection이나 데이터를 만들거나 옮기지 않는다.

## Nuxt Runtime 설정

| 환경변수 | 기본값 | 용도 |
|---|---|---|
| `NUXT_RUNTIME_ENABLED` | `true` | Publication API 사용 허용 |
| `NUXT_SSR_ENABLED` | `true` | Nuxt SSR 활성화 |
| `PROMO_API_BASE_URL` | `http://localhost:3000` | 빌드·개발 시 내부 Publication API 주소 |
| `NUXT_PROMO_API_BASE_URL` | 없음 | 빌드된 Nitro 서버의 Runtime Override |
| `PROMO_DEFAULT_LOCALE` | `ko-KR` | 기본 Locale |
| `NUXT_REVALIDATE_URL` | 없음 | Builder API가 호출할 Nuxt `/api/revalidate-promotion` 전체 URL |
| `NUXT_REVALIDATE_SECRET` | 없음 | Builder API와 Nuxt Runtime이 공유하는 캐시 갱신 비밀키 |
| `PROMO_PREVIEW_TOKEN_SECRET` | 로컬 전용 기본값 | 미게시 Revision용 15분 만료 Preview Token 서명키(호스팅에서는 32자 이상 필수) |

두 캐시 갱신 환경변수가 모두 없으면 발행은 기존처럼 동작하고 캐시 갱신만 건너뛴다. 하나만 있거나 URL이 안전하지 않으면 발행 응답에 캐시 갱신 실패/건너뜀 상태가 포함된다. 호스팅 환경에서는 HTTPS URL만 허용하며 비밀키는 응답과 로그에 노출하지 않는다.
캐시 갱신은 Nitro route cache 중 `/promotions/**` 항목만 제거하며 Preview나 다른 Route Cache는 건드리지 않는다.

게시 관리의 `Nuxt 미리보기`는 Publication 상태를 변경하지 않고 고정 Revision용 단기 서명 Token을 발급한다. `/preview/promotions/:slug` 경로는 `no-store`, `noindex`, `no-referrer`로 제공되며 일반 `/promotions/:slug` SWR 캐시에 포함되지 않는다.

명령:

```bash
pnpm run dev:nuxt-runtime
pnpm run build:nuxt-runtime
node apps/promo-runtime-nuxt/.output/server/index.mjs
```

## Directus 연결 설정

기본값은 외부 연결 OFF다.

| 환경변수 | 기본값 | 용도 |
|---|---|---|
| `DIRECTUS_CONFIG_MANAGEMENT_ENABLED` | `true` | 설정 탭·Config API |
| `DIRECTUS_INTEGRATION_ENABLED` | `false` | Directus Master Switch |
| `DIRECTUS_CONNECTION_TUNNEL_ENABLED` | `false` | 실제 Health·인증 요청 허용 |
| `DIRECTUS_ALLOWED_HOSTS` | 빈 값 | 쉼표로 구분한 연결 허용 Host |
| `DIRECTUS_SECRET_CONNECTION` | 미설정 | 예시 Reader Static Token |

관리자 입력 예시:

```text
Base URL: https://directus.example.com
secretRef: env:DIRECTUS_SECRET_CONNECTION
timeoutMs: 5000
retryCount: 1
```

연결을 켤 때 서버 환경변수 예시:

```text
DIRECTUS_INTEGRATION_ENABLED=true
DIRECTUS_CONNECTION_TUNNEL_ENABLED=true
DIRECTUS_ALLOWED_HOSTS=directus.example.com
DIRECTUS_SECRET_CONNECTION=<Directus Reader Token>
```

Token 원문은 DB·브라우저 응답·로그에 저장하거나 반환하지 않는다. HTTPS, Host Allowlist, Redirect 차단, Timeout, 최대 응답 크기를 적용한다. 로컬 개발에서만 localhost HTTP를 허용한다.

## 관리자 Workbench Flag

| 환경변수 | 기본값 | 용도 |
|---|---|---|
| `ADMIN_DOM_CONFIG_WORKBENCH_ENABLED` | `true` | DOM Tree·Inspector·Single Preview 사용 |
| `ADMIN_LEGACY_VISUAL_CONFIG_EDITOR_ENABLED` | `false` | 기존 관리자 Canvas Rollback |
| `TEMPLATE_LAYOUT_MANAGEMENT_ENABLED` | `true` | 기존 Template·Layout 관리 탭 제어 |

실제 프로모션 제작 Visual Editor의 Drag·Resize·콘텐츠 편집은 이 Flag와 무관하게 유지된다.

## 검증 결과

- 전체 자동화: 163개 테스트 파일 통과
- Admin Vite Build: 통과
- Visual Editor Vite Build: 통과
- Nuxt 4.5.2 Client·SSR·Nitro Build: 통과
- Nuxt Runtime 실제 HTTP 검증: SSR HTML, SEO, Slug, Revision, 404, 서명 Preview, 캐시 재검증 통과
- Directus Mock: Health, Bearer 인증, Retry, Timeout 경계 통과
- SSRF 경계: HTTPS, Allowlist, URL Credential·Query·Fragment 차단 통과
- 게시 안전성: v3 Quality Gate 미통과 Revision 게시·재게시 차단
- Config 안전성: 최신 Directus 연결 검사 통과 전 활성화 차단

검증 명령:

```bash
pnpm test
pnpm run build
node scripts/verify-nuxt-runtime-e2e.mjs
```

## 후속 협의 전 제외

- Directus Collection·Field·Relation 생성
- 현재 PostgreSQL 데이터의 Directus Migration
- Domain Source Router와 Shadow Read
- Directus Runtime Read·Write
- Asset File 이전
- Cutover·Rollback 실행

연결 성공은 위 작업을 자동으로 실행하지 않는다.

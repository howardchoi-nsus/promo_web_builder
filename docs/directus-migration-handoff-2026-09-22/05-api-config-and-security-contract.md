# 05. API·Integration Config·보안 계약

```yaml
status: Draft
source_commit: 3e1386a
decision_required: true
```

## 1. 현재 API Inventory

| Method | Endpoint | 호출 주체 | 목적 | DB 변경 |
|---|---|---|---|---:|
| GET/POST/PATCH | `/api/directus-integration-config` | Admin | Config 조회·Draft·검증·활성·중지 | Y |
| POST | `/api/directus-connection-test` | Admin | Health·인증 연결 검사 | 검사 기록 Y |
| GET/POST/PATCH | `/api/promo-publications` | Visual Editor | 게시 이력·저장·상태 변경 | Y |
| GET | `/api/promo-publication` | Nuxt | 공개 Publication 조회 | N |
| POST | `/api/promo-publication-preview-token` | Visual Editor | 단기 Preview Token 발급 | N |
| GET | `/api/promo-publication-preview` | Nuxt | 미게시 Revision Preview 조회 | N |
| POST | Nuxt `/api/revalidate-promotion` | Builder API | Promotion Cache 제거 | Cache 변경 |

## 2. Feature Flag

| 환경변수 | 현재 기본값 | 역할 |
|---|---:|---|
| `DIRECTUS_CONFIG_MANAGEMENT_ENABLED` | `true` | Config 관리 API·UI |
| `DIRECTUS_INTEGRATION_ENABLED` | `false` | Directus Master Switch |
| `DIRECTUS_CONNECTION_TUNNEL_ENABLED` | `false` | 실제 외부 연결 검사 |
| `NUXT_RUNTIME_ENABLED` | `true` | Publication API 사용 |
| `NUXT_SSR_ENABLED` | `true` | Nuxt SSR |

다음 Flag는 아직 구현되지 않았으며 의미와 승인 조건 확정 후 추가해야 한다.

```text
DIRECTUS_MIGRATION_ENABLED
DIRECTUS_SHADOW_READ_ENABLED
DIRECTUS_RUNTIME_READ_ENABLED
DIRECTUS_RUNTIME_WRITE_ENABLED
```

## 3. Directus Config 계약

```json
{
  "baseUrl": "https://directus.example.internal",
  "secretRef": "env:DIRECTUS_SECRET_CONNECTION",
  "timeoutMs": 5000,
  "retryCount": 1,
  "verifyAuthentication": true
}
```

규칙:

- `baseUrl`: HTTPS 필수. 로컬 비호스팅 환경의 localhost만 HTTP 허용
- Credential, Query, Fragment 포함 URL 금지
- 외부 Host는 `DIRECTUS_ALLOWED_HOSTS` 등록 필수
- `secretRef`: `env:DIRECTUS_SECRET_*` 형식
- Timeout: 1,000~15,000ms
- Retry: 0~2회
- Redirect: 허용하지 않음
- 최대 응답: 256KB

## 4. Secret 계약

| Secret | 사용 위치 | 브라우저 노출 | DB 저장 | 로그 |
|---|---|---:|---:|---:|
| Directus Connection Reader | 서버 Connection Test | N | Ref만 | N |
| Directus Runtime Reader | 후속 Adapter | N | Ref만 | N |
| Migration Writer | Migration Runner | N | Ref만 | N |
| Schema Admin | Schema 적용 도구 | N | Ref만 | N |
| Preview Token Secret | Builder API | N | N | N |
| Nuxt Revalidate Secret | Builder·Nuxt 서버 | N | N | N |

Reader, Writer, Schema Admin은 같은 Token을 재사용하지 않는다.

## 5. 연결 검사 계약

```text
1. Feature Flag 확인
2. Admin Session 확인
3. 저장 Config 조회
4. URL·Host·Secret Ref 검증
5. GET /server/health
6. 필요 시 GET /users/me?fields=id
7. 결과와 Duration 저장
8. Secret을 제외한 결과 반환
```

연결 성공은 다음 작업을 수행하지 않는다.

- Collection 생성
- 데이터 조회·수정
- Migration 시작
- Runtime Source 변경

## 6. 후속 Domain Adapter 계약

```ts
interface DomainSourceAdapter<TQuery, TResult> {
  find(query: TQuery): Promise<TResult | null>;
  list(query: TQuery): Promise<TResult[]>;
  health(): Promise<AdapterHealth>;
}
```

Adapter 반환값은 공용 Domain Contract로 정규화하고 Directus 응답 원문을 화면이나 Nuxt에 전달하지 않는다.

## 7. 표준 오류 계약

| 코드 | HTTP | Retry | Fallback | 운영 조치 |
|---|---:|---:|---:|---|
| `BUILDER_FEATURE_DISABLED` | 404 | N | 기존 경로 | Flag 확인 |
| `DIRECTUS_SECRET_NOT_CONFIGURED` | 502 | N | Internal | Secret 배포 |
| `DIRECTUS_HTTP_401` | 502 | N | Internal | Token·Role 확인 |
| `DIRECTUS_HTTP_403` | 502 | N | Internal | Permission 확인 |
| `DIRECTUS_UNHEALTHY` | 502 | 제한 | Internal | Directus 상태 확인 |
| `DIRECTUS_RESPONSE_TOO_LARGE` | 502 | N | Internal | Query·응답 확인 |
| `DIRECTUS_SCHEMA_MISMATCH` | 제안 502 | N | Internal | Cutover 차단 |
| `MIGRATION_VALIDATION_FAILED` | 실행 실패 | N | Rollback | Diff 조사 |

## 8. 권한 Matrix 초안

| 역할 | Health | Schema Read | Data Read | Data Write | Schema Write | Files |
|---|---:|---:|---:|---:|---:|---:|
| Connection Reader | Y | N | 최소 `/users/me` | N | N | N |
| Runtime Reader | Y | N | Y | N | N | 필요 시 Read |
| Migration Writer | Y | Y | Y | Y | N | 결정 필요 |
| Schema Admin | Y | Y | Y | Y | Y | Y |

## 9. 보안 승인 Checklist

- [ ] 환경별 Host Allowlist 승인
- [ ] Token별 최소 권한 확인
- [ ] Secret Rotation 절차 작성
- [ ] API 응답과 로그의 Token Masking 확인
- [ ] Private Network·방화벽 경로 확인
- [ ] Migration 계정 사용 기한 지정
- [ ] Connection Reader에 Collection Write 권한이 없음을 확인


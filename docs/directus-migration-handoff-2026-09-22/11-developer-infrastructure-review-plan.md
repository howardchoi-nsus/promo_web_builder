# Directus 연동 개발 및 인프라 리뷰 계획

```yaml
status: Review
owner: Promo Web Builder 개발팀
reviewers: [Backend, Infra, DevOps, Security, DBA, QA]
review_date: 2026-10-11
target_environments: [development, preview, production]
execution_allowed: false
```

이 계획은 Component와 Design Token을 PostgreSQL 원본에서 Directus Read-only Mirror로 이전하기 위한 개발·배포·검증 범위를 정한다. 코드 기반과 실행 Gate는 마련됐지만 실제 Directus Schema 적용, 데이터 Write, Shadow Read, Production Cutover는 환경 정보와 승인 Evidence가 없으므로 실행하지 않는다.

## 리뷰 결론

- PostgreSQL을 1차 Source of Truth로 유지한다.
- Directus 1차 범위는 Component와 Design Token이다.
- Publication, Resource, Asset Binary, Builder Revision, AI Run은 1차 범위에서 제외한다.
- Directus Runtime Write는 비활성화한다.
- Preview에서 Migration과 Shadow Read를 통과하기 전 Production Schema와 Read Cutover를 허용하지 않는다.
- 운영 Admin 인증은 Identity Provider가 발급한 서명 세션을 사용해야 한다.

## 작업 단계와 현재 상태

| 단계 | 결과 | 상태 | 다음 승인 |
|---:|---|---|---|
| 1 | Publication 초안 저장 안전장치, Nuxt Runtime Public URL 분리 | 구현 | 배포 환경 URL 확인 |
| 2 | Admin Session 검증 경계, 환경 공용 Config, 401·403 비재시도 | 구현 | Identity Provider 연동 |
| 3 | Component·Design Token Read-only 범위와 기본 결정안 | 검토 필요 | Product·Architecture 승인 |
| 4 | `promo-reference-v1` Schema Manifest | 구현 | Backend·DBA·Directus 승인 |
| 5 | Migration Plan, 삭제 감지, Rollback Plan, Batch·Journal Schema | 기반 구현 | Exporter·Writer 및 Credential |
| 6 | Domain Source Router, Shadow Read, Internal Fallback | 기반 구현 | 실제 Domain Adapter 연결 |
| 7 | Development Sample Migration | 미실행 | Development Directus 필요 |
| 8 | Preview Full·Incremental Migration과 Reconciliation | 미실행 | Preview 환경·Backup 필요 |
| 9 | Shadow Read, Runtime·Visual·성능 검증 | 미실행 | Preview 데이터와 Dashboard 필요 |
| 10 | Component부터 Read Cutover | 금지 | 모든 Readiness Gate와 승인 필요 |

## 변경된 코드와 산출물

| 영역 | 파일 | 목적 |
|---|---|---|
| Runtime URL | `api/_promo-runtime-public-config.js` | 안전한 Nuxt 공개 URL 검증 |
| Capability | `api/promo-builder-capabilities.js` | Visual Editor에 공개 Runtime URL 전달 |
| Publication UI | `visual-editor/src/platform/editor-ui/PublicationManagerDialog.vue` | 게시 상태 보호와 별도 Runtime 링크 |
| Admin Auth | `api/_promo-admin-auth.js` | 호스팅 환경의 서명 Admin Session 검증 |
| Directus Retry | `api/directus-connection-test.js` | 401·403·과대 응답 비재시도 |
| Schema | `directus/schema/promo-reference-v1.json` | Component·Token Source-to-Target Mapping |
| Migration Core | `packages/directus-migration/src/index.mjs` | Inventory, Hash, Plan, 삭제 감지, 대사, Rollback |
| Source Router | `api/_directus-domain-source-router.js` | Shadow Read와 Internal Fallback |
| Control Plane | `db/migrations/071_directus_migration_control_plane.sql` | Admin 감사, Batch, Journal, Diff, Cutover Snapshot |
| Readiness | `api/directus-cutover-readiness.js` | Cutover Gate 조회 |

## 배포 순서

1. PostgreSQL Backup 또는 Neon Branch를 생성한다.
2. Migration `071_directus_migration_control_plane.sql`을 적용한다.
3. `PROMO_ADMIN_SESSION_SECRET`과 `PROMO_RUNTIME_PUBLIC_URL`을 설정한다.
4. 운영 Identity Provider가 `promo_admin_session` 서명 쿠키를 발급하도록 연결한다.
5. 애플리케이션을 배포하되 모든 Directus Migration·Shadow·Runtime Flag는 `false`로 유지한다.
6. Development Directus에 승인된 Schema Manifest를 적용한다.
7. Dry Run과 Sample Migration을 수행한다.
8. Preview Migration과 Reconciliation을 통과한다.
9. Shadow Read를 활성화하고 성능·Diff·Fallback을 관찰한다.
10. Readiness API와 승인 기록이 모두 통과한 Domain만 Read Cutover한다.

애플리케이션을 Migration 071보다 먼저 배포하면 Directus Config API가 새 감사 필드를 참조하면서 실패할 수 있으므로 DB를 먼저 적용한다.

## 환경변수

| 변수 | Development | Preview·Production | 목적 |
|---|---|---|---|
| `PROMO_RUNTIME_PUBLIC_URL` | 로컬 HTTP 허용 | HTTPS 필수 | Nuxt 공개·미리보기 Base URL |
| `PROMO_ADMIN_SESSION_SECRET` | 32자 이상 권장 | 32자 이상 필수 | Admin Session 서명 검증 |
| `PROMO_ADMIN_LOCAL_ACCESS_ENABLED` | 필요 시 `true` | 사용 금지 | 로컬 Builder Session Admin 대체 |
| `DIRECTUS_CONFIG_MANAGEMENT_ENABLED` | `true` | 승인 후 `true` | Config UI·API |
| `DIRECTUS_INTEGRATION_ENABLED` | 연결 검사 시 `true` | 승인 후 `true` | Directus Master Switch |
| `DIRECTUS_CONNECTION_TUNNEL_ENABLED` | 연결 검사 시 `true` | 승인 후 `true` | Health·Auth 요청 |
| `DIRECTUS_MIGRATION_ENABLED` | 실제 Write 직전에만 `true` | 기본 `false` | Migration Write Gate |
| `DIRECTUS_SHADOW_READ_ENABLED` | 검증 시 `true` | Preview 검증 후 결정 | Shadow Read Gate |
| `DIRECTUS_SHADOW_READ_DOMAINS` | `components,designTokens` | 승인 Domain만 | Shadow 대상 |
| `DIRECTUS_RUNTIME_READ_ENABLED` | Cutover 검증 시 `true` | 승인 전 `false` | Directus Read Gate |
| `DIRECTUS_RUNTIME_READ_DOMAINS` | 승인 Domain만 | 승인 Domain만 | Read Cutover 대상 |
| `DIRECTUS_RUNTIME_WRITE_ENABLED` | `false` | `false` | Directus Write 금지 |

## 개발 검증 명령

```bash
node scripts/test-promo-runtime-public-config.mjs
node scripts/test-promo-admin-auth.mjs
node scripts/test-directus-connection-client.mjs
node scripts/test-directus-connection-tunnel.mjs
node scripts/test-directus-schema-manifest.mjs
node scripts/test-directus-migration-tooling.mjs
node scripts/test-directus-migration-control-plane.mjs
node scripts/test-directus-cutover-readiness.mjs
```

Dry Run 입력은 `domains.components`와 `domains.designTokens` 배열을 가진 JSON Snapshot을 사용한다.

```bash
node scripts/directus-migration-plan.mjs \
  --mode=plan \
  --source=/approved/source-snapshot.json \
  --target=/approved/target-snapshot.json \
  --domains=components,designTokens \
  --environment=development \
  --schema=promo-reference-v1 \
  --commit=APPROVED_COMMIT
```

## Cutover 승인 조건

`/api/directus-cutover-readiness`는 다음 조건을 모두 요구한다.

- 대상 환경의 Active Directus Config
- 최신 Connection Check 성공
- 동일 환경의 성공한 Migration Batch
- Migration Batch와 Cutover Snapshot의 Schema Version 일치
- Migration 이후 Blocking Shadow Diff 0건
- Internal Fallback 검증
- Cache 동작 검증
- 승인자 기록

Flag만 변경해서 Gate를 우회하면 안 된다. Cutover Snapshot과 변경 관리 기록을 함께 남긴다.

## 인프라 및 보안 리뷰 항목

- [ ] Directus Development·Preview·Production Project 식별자 확인
- [ ] Host Allowlist와 Private Network 경로 확인
- [ ] Connection Reader, Runtime Reader, Migration Writer, Schema Admin Token 분리
- [ ] 운영 Identity Provider의 Admin Session 발급 방식 승인
- [ ] Secret Rotation과 폐기 절차 승인
- [ ] Migration 071 적용·복구 방법 검증
- [ ] Directus Backup·Restore Drill 완료
- [ ] Migration Journal과 Shadow Diff 보존 기간 승인
- [ ] Dashboard에서 Latency, 401·403, Fallback, Blocking Diff, Cache 실패 확인
- [ ] Preview 부하와 P95 기준 승인
- [ ] Production Change Window와 Rollback 담당자 지정

## 현재 차단 사항

Development와 Preview Directus URL, Schema Admin·Migration Writer Credential, 실제 Source Snapshot, Backup Evidence, Identity Provider 연동 정보가 제공되지 않았다. 따라서 Schema 적용, 실제 데이터 Write, Shadow Read, Production Cutover는 차단 상태다. 이 정보가 준비되면 단계 7부터 같은 Batch·Gate 계약으로 실행한다.

## 2026-10-11 검증 결과

- 저장소 계약 테스트 169개 중 168개를 실행했고 실패는 0건이다.
- `scripts/test-promo-readonly-renderer-ssr.mjs` 1개는 애플리케이션 결함이 아니라 로컬 macOS의 `rolldown` 네이티브 바이너리 Team ID 서명 불일치 때문에 실행 대상에서 제외했다.
- Visual Editor 빌드도 컴파일 진입 전 동일한 `rolldown` 서명 오류로 중단됐다. 현재 실행 Node.js 24와 프로젝트 요구 Node.js 22의 차이도 함께 해소한 뒤 재검증한다.
- 새로 추가한 Admin 인증, Runtime URL, Directus 연결, Schema Manifest, Migration·Reconciliation·Rollback, Control Plane, Cutover Readiness 테스트는 모두 통과했다.
- `git diff --check`와 문서 내부 로컬 링크 검사는 통과했다.

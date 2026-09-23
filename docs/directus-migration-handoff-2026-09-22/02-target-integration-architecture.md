# 02. 목표 연동 아키텍처

```yaml
status: Draft
source_commit: 3e1386a
decision_required: true
```

## 1. 설계 원칙

1. Nuxt와 Visual Editor는 Directus 응답 형식을 직접 사용하지 않는다.
2. 모든 Source Adapter는 공용 Domain Contract로 정규화한다.
3. 편집 Transaction, AI Job, Lease와 Retry는 PostgreSQL에 유지한다.
4. Directus 장애가 편집 기능이나 현재 공개 페이지 장애로 전파되지 않게 한다.
5. 도메인별로 Read Source를 전환하며 전체 시스템을 한 번에 전환하지 않는다.
6. Write Source는 단일 시스템으로 제한한다.
7. Migration, Shadow Read, Cutover를 서로 독립된 승인 단계로 둔다.

## 2. 단계별 구조

### Phase 0 — 현재

```text
Builder ───────────────→ PostgreSQL
                              │
                              ▼
                       Publication API
                              │
                              ▼
                         Nuxt Runtime

Admin → Integration Config → Directus Health/Auth Check
```

### Phase 1 — Schema·Migration 준비

```text
PostgreSQL ── Export/Normalize ──→ Migration Staging
                                        │
                                        ▼
                                  Directus Collections

Runtime Read Source: PostgreSQL 유지
```

### Phase 2 — Shadow Read

```text
                        ┌→ Internal PostgreSQL Adapter ─┐
Domain Query → Router ──┤                               ├→ Normalize → Diff
                        └→ Directus Adapter ────────────┘

사용자 응답: Internal 결과
Directus 결과: 비교용으로만 사용
```

### Phase 3 — 도메인별 Cutover

```text
Domain Query → Source Router
                 ├→ Directus Adapter (선택 도메인)
                 └→ PostgreSQL Adapter (나머지·Fallback)
```

## 3. 논리 컴포넌트

| 컴포넌트 | 책임 | 데이터 저장 여부 |
|---|---|---:|
| Integration Config | 환경별 연결·정책 Version | Y |
| Directus Client | 인증·Timeout·Retry·응답 크기 제한 | N |
| Domain Source Router | 도메인별 Source 선택 | 정책 Snapshot만 |
| Internal Adapter | PostgreSQL 결과 정규화 | N |
| Directus Adapter | Directus 결과 정규화 | N |
| Migration Exporter | Source 추출·정규화·Checkpoint | 실행 기록 |
| Migration Writer | Directus Upsert·Relation 연결 | 실행 기록 |
| Reconciliation | Count·Hash·Relation Diff | Diff 저장 |
| Cutover Controller | 승인된 Source 전환 | 승인 Snapshot |

## 4. Runtime Contract

Runtime은 Source와 무관하게 다음 종류의 계약만 받는다.

- PublishedPromotion
- Component Definition·활성 Version
- Component RenderSpec v1
- Design Token Version
- Content Resource·Locale
- Asset Metadata·Public URL

Directus 고유 Field 이름, Relation Payload, File ID는 Adapter 외부로 노출하지 않는다.

## 5. 장애와 Fallback

| 장애 | 기본 처리 | 사용자 영향 |
|---|---|---|
| Directus Timeout | 제한된 Retry 후 Internal Fallback | 없어야 함 |
| 401·403 | Retry 금지, Alert, Internal Fallback | 없어야 함 |
| Schema 불일치 | Directus 결과 폐기, Cutover 차단 | 없어야 함 |
| 데이터 누락 | Internal 결과 사용, Diff 기록 | 없어야 함 |
| Internal DB 장애 | 기존 장애 정책 적용 | 서비스 영향 가능 |
| 양쪽 결과 불일치 | Shadow 단계에서는 Internal 우선 | 없어야 함 |

## 6. 결정이 필요한 아키텍처 항목

- [ ] Directus를 CMS 원본으로 사용할 도메인
- [ ] PostgreSQL을 영구 원본으로 유지할 도메인
- [ ] Runtime Router 배포 위치
- [ ] Directus 장애 시 Cache 허용 시간
- [ ] Directus Write를 허용할 관리자 기능
- [ ] Asset Binary를 Directus Files로 이전할지 여부
- [ ] Source별 Audit Log 보존 기간


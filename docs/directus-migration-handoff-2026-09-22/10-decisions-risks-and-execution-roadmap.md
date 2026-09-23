# 10. 미결정 사항·위험·실행 Roadmap

```yaml
status: Draft
source_commit: 3e1386a
decision_required: true
```

## 1. 필수 결정 목록

| ID | 결정 항목 | 선택지 | 권장 출발점 | Owner | 상태 |
|---|---|---|---|---|---|
| DEC-01 | Directus 1차 도메인 | Component/Token/Resource/Publication | Component·Token Read-only | Product·Backend | Open |
| DEC-02 | Source of Truth | PostgreSQL/Directus | 단계별 단일 원본 | Architecture | Open |
| DEC-03 | UUID 정책 | 유지/신규 발급 | Source UUID 유지 | Data | Open |
| DEC-04 | Component Field Schema | JSON/O2M | 초기 JSON 유지 후 검토 | Backend | Open |
| DEC-05 | Publication Snapshot | Directus 복제/Internal 참조 | Runtime 목표에 따라 결정 | Architecture | Open |
| DEC-06 | Asset 전략 | URL 유지/Files 이전 | URL 유지 후 별도 이전 | Infra | Open |
| DEC-07 | Locale 모델 | String/Collection | 기존 String 유지 후 확장 | Product | Open |
| DEC-08 | Archived 데이터 | 제외/포함 | 초기 제외 | Data Owner | Open |
| DEC-09 | Runtime Fallback | 항상/조건부/없음 | 항상 Internal Fallback | SRE | Open |
| DEC-10 | Write 지원 | Read-only/제한/전체 | Read-only 우선 | 전체 | Open |

## 2. 주요 위험

| 위험 | 영향 | 예방 | 복구 |
|---|---|---|---|
| Schema Mapping 오류 | 데이터 손실·렌더 실패 | Sample·Dry Run·승인 | Target 삭제 후 재실행 |
| UUID 변경 | Relation·참조 단절 | UUID 유지 원칙 | Mapping Table 복구 |
| JSON 구조 손실 | RenderSpec·Token 오류 | Stable Hash 비교 | Source 재Migration |
| Directus 권한 과다 | 보안 사고 | 역할 분리·최소 권한 | Token 폐기·감사 |
| Dual Write 충돌 | 데이터 불일치 | Single Writer | Write 중지·대사 |
| Asset 이전 실패 | 이미지 깨짐 | Checksum·URL Fallback | 기존 URL 복귀 |
| Runtime Latency | 사용자 응답 저하 | Cache·Timeout·Fallback | Directus Read OFF |
| Schema Drift | Adapter 오류 | Version 고정·Drift 검사 | 승인 Schema 복원 |
| Migration 중 Source 변경 | 누락·덮어쓰기 | Catch-up·Freeze 정책 | Delta 재실행 |

## 3. 실행 Roadmap

### Phase A — 협의·기준선

- 데이터 Owner 지정
- 1차 Directus 도메인 결정
- Source DB Inventory 실행
- Schema Mapping 승인
- Permission Matrix 승인

완료 Gate: G0·G1

### Phase B — 개발 환경

- Directus Schema 생성 도구
- Internal·Directus Adapter Port
- Migration Exporter·Writer
- Reconciliation Tool
- Development Sample Migration

완료 Gate: G2

### Phase C — Preview 검증

- Preview Full Migration
- Incremental Catch-up
- Relation·Hash 대사
- Shadow Read
- Runtime·Visual·성능 E2E

완료 Gate: G3·G4

### Phase D — Production Migration

- Backup·Restore 확인
- Production Schema 적용
- Full·Incremental Migration
- Reconciliation 승인
- Directus Read Flag OFF 상태로 안정화

완료 Gate: Production 데이터 준비

### Phase E — 도메인별 Cutover

- 가장 위험이 낮은 Read-only 도메인부터 전환
- Metric과 Fallback 관찰
- 안정화 후 다음 도메인 진행
- Write는 별도 승인

완료 Gate: G5, 필요 시 G6

## 4. 현재 구현 대비 남은 개발

| 작업 | 현재 | 필요한 결과 |
|---|---|---|
| Directus Connection Tunnel | 완료 | 실제 환경 연결 확인 |
| Schema Manifest | 미구현 | Versioned Schema Artifact |
| Domain Source Router | 미구현 | 도메인별 Source 선택 |
| Directus Adapter | 미구현 | 공용 Contract 정규화 |
| Migration Exporter | 미구현 | Source Snapshot·Checkpoint |
| Migration Writer | 미구현 | 멱등 Upsert·Relation 연결 |
| Reconciliation | 미구현 | Count·Hash·Relation Diff |
| Shadow Read | 미구현 | 사용자 영향 없는 비교 |
| Cutover Controller | 미구현 | 승인 Snapshot·즉시 복귀 |
| Runtime Write | 미구현 | 협의 후 결정 |

## 5. 착수 전 회의 Agenda

1. 1차 Directus 대상 도메인 선정
2. 각 도메인의 Source of Truth 결정
3. UUID·Version·Status 정책 확정
4. Publication Snapshot 저장 전략 결정
5. Asset·Locale 전략 결정
6. Directus Project·환경·Role 담당 지정
7. Preview Migration 일정과 승인자 지정
8. Cutover 성공·Rollback 기준 합의

## 6. 승인 기록

| 역할 | 담당자 | 승인 범위 | 상태 | 일자 |
|---|---|---|---|---|
| Product Owner |  | 도메인·운영 정책 | Pending |  |
| Backend Lead |  | API·Adapter·Contract | Pending |  |
| Data Owner/DBA |  | Schema·Migration·대사 | Pending |  |
| DevOps/SRE |  | 배포·Secret·Monitoring | Pending |  |
| Security |  | 권한·Token·Network | Pending |  |
| QA |  | E2E·합격 기준 | Pending |  |


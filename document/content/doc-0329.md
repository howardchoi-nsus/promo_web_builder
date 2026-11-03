# 09. 운영·모니터링·장애 대응

```yaml
status: Draft
source_commit: 3e1386a
decision_required: true
```

## 1. 운영 목표

- Directus 장애가 현재 Builder 편집과 공개 Promotion에 전파되지 않게 한다.
- 데이터 불일치를 연결 오류와 분리해 탐지한다.
- Secret이나 콘텐츠 원문을 노출하지 않고도 원인을 추적할 수 있게 한다.
- Cutover 전후의 Latency, Error, Fallback 변화를 비교한다.

## 2. 필수 Metric

| 분류 | Metric | Label |
|---|---|---|
| Connection | Health 성공률·Duration | environment, config_version |
| Auth | 401·403 횟수 | environment, role |
| Adapter | 요청·성공·오류·Timeout | domain, source |
| Runtime | P50·P95·P99 Latency | route, source |
| Fallback | Internal Fallback 횟수 | domain, reason |
| Data | Shadow Diff·Missing·Mismatch | domain, severity |
| Migration | Read·Write·Skip·Failure | batch, domain |
| Cache | Revalidation 성공·실패 | slug/locale은 제한된 형태 |
| Publication | 404·410·5xx | environment |

## 3. 로그 정책

로그에 허용:

- Request ID
- Config ID·Version
- Domain 이름
- HTTP Status
- Error Code
- Duration
- Migration Batch ID
- Hash·Count Summary

로그에 금지:

- Directus Token
- Preview·Revalidation Secret
- Authorization Header
- Session Cookie
- 전체 Prompt 원문
- 개인정보
- 원본 Asset Binary·Data URL

## 4. Alert 초안

| 조건 | 등급 | 조치 |
|---|---|---|
| Directus Health 연속 실패 | Warning | 연결·네트워크 확인 |
| Runtime 401·403 | Critical | Token·Role 확인, Directus Read OFF |
| Fallback 비율 임계치 초과 | Critical | Internal 고정, 원인 분석 |
| Blocking Diff 발생 | Critical | Cutover·Migration 중단 |
| Migration Failure 증가 | Critical | Batch 중단·Rollback 검토 |
| P95 Latency 증가 | Warning | Query·Index·Cache 확인 |
| Publication 5xx 증가 | Critical | Source 복귀·Cache 확인 |

구체 임계치는 Preview 기준선을 측정한 뒤 확정한다.

## 5. 장애 분류

| 유형 | 예 | 1차 대응 |
|---|---|---|
| Connection | DNS·TLS·Timeout | Directus 경로 차단, Internal 유지 |
| Authentication | Token 만료·Role 변경 | Runtime Directus Read OFF |
| Schema | Field·Relation 누락 | Adapter 차단, Schema 복구 |
| Data | 누락·중복·Hash Diff | Cutover 중단, Batch 조사 |
| Performance | 느린 Query·큰 Payload | Query 제한·Index·Cache |
| Asset | File 404·권한 | 기존 Public URL Fallback |
| Application | Contract Validation 실패 | 해당 데이터 격리 |

## 6. Incident 기록 형식

```text
Incident ID:
발생 환경:
시작/탐지/복구 시각:
영향 Domain:
사용자 영향:
활성 Config·Schema Version:
최근 Migration Batch:
Error Code:
Fallback 동작 여부:
Rollback 실행 여부:
근본 원인:
재발 방지:
```

## 7. 정기 운영 작업

- Directus Token Rotation
- Allowed Host 검토
- Active Config Version 검토
- 연결 검사 이력 정리
- Schema Drift 검사
- Shadow Diff 추세 검토
- Migration 계정 비활성화
- Archived Data 보존 정책 실행
- Backup·Restore Drill


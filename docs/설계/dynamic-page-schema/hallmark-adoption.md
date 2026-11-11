# Hallmark 지침 1차 적용

Hallmark v2(7e213cb)의 목적·소재 중심 설계와 단계별 품질 검사를 참고한다. 테마·팔레트·CSS·사진이나 원본 검사 프로그램을 제품에 설치하지 않는다. PageSchema와 등록 토큰 계약을 유지한다. Together AI로 모델을 변경하지 않는다.

- 지침 데이터: shared/page-schema/design-guidelines.json
- 서버 설계 요약·비차단 경고: api/_page-schema-design.js
- 관리형 프롬프트 Draft: migration 089. 기존 활성 동적 설계 프롬프트와 같은 lineage의 새 버전으로 생성한다. 기존 프롬프트를 자동 교체하지 않는다.
- 중복 실행 방지·재시도 작업: migration 088. 같은 requestId의 입력을 검증하고 동시에 하나의 실행만 허용한다. 저장된 PageSchema가 재현 기준이다.
- 새 생성은 확정된 서버 요구사항 리비전에 연결하고 문서 저장 성공 시에만 대화 단계를 전환한다.
- 구성 미리보기와 디자인 출력은 같은 PageSchemaRenderer와 배치·토큰 계산을 사용한다. 미리보기만 회색조·비활성 액션으로 표시한다.
- 스키마·보안·필수 콘텐츠·등록 토큰 오류는 기존 검증에서 차단한다. 반복 구도·빈 그룹은 디자인 경고이며 자동 반려하지 않는다.

## 적용 순서

1. 기존 086·087을 유지하고 088, 089를 순서대로 적용한다.
2. 관리자에서 동적 설계 프롬프트의 Hallmark Draft를 검증한다. 등록 모델·응답 예산을 확인한다.
3. 대화 저장을 켠 환경에서 요약 수정·확정·새로고침·생성 실패·재시도·승인·출력을 검증한다.
4. 기존 지침과 같은 입력·모델·토큰을 사용한 실제 LLM 비교를 수행한다.
5. 검증 후 새 Draft를 활성화하고 Production 배포·실제 생성 결과를 확인한다.

배포 후 migration이 없으면 생성 전에 088 필요 안내를 표시한다. 롤백 시 활성 프롬프트를 이전 검증 버전으로 되돌리고, 기존 저장 문서는 보존한다.

## 원본과 차이

원본의 고정 섹션 수·팔레트 생성·일률적인 미적 금지는 도입하지 않는다. 사용자 요청·한국어·필수 고지·등록 토큰이 우선한다. 등록 컴포넌트 카탈로그 연동, 외부 사진, 복수 시안 선택, 별도 시각 리뷰 모델은 후속 범위다.

Source: https://github.com/Nutlope/hallmark/tree/7e213cb6feb4ef82733bd66a0600b2e54ca0994c (MIT). 본 구현은 설계 원칙을 자체 서비스 계약으로 재구성했으며 원본 테마/런타임 코드를 포함하지 않는다.

## 현재 구현 상태

| 범위 | 상태 |
|---|---|
| 분석 응답 보존, 서버 수정·확정 저장, 요약 버전 확인 | 구현 및 로컬 검증 완료 |
| 생성 성공 시에만 문서·대화 단계·작업 완료 처리 | PostgreSQL 호환 엔진으로 원자성 검증 완료 |
| 요청 ID 재사용·문서별 중복 실행 방지·실패 재시도 | 구현 및 충돌·재실행 검증 완료 |
| 목적·소재·최근 구성 개요 기반 설계 입력 | 구현 완료. 실제 모델 효과 비교는 별도 |
| 등록 토큰·원문·범용 UI 계약 유지 | 회귀 테스트 통과 |
| 선택 원문의 필수 여부 유지, 같은 원문 중복 강제 제거 | 단위 테스트 통과 |
| 구성 미리보기/디자인의 공통 렌더러·동일 기기 너비·간격 | 브라우저 비교 통과 |
| 설계 경고와 차단 오류 분리 | 구현 완료. 반복 구도·빈 그룹은 비차단 경고 |
| 실제 LLM A/B 파일럿 | 미실행: 이 환경에 모델/API·Production DB 자격 증명 없음 |
| Production DB·프롬프트 활성화·배포 | 미실행 |

### 필수와 미확정 참고 정보

제목·핵심 혜택이 실제로 누락돼 있으면 확인을 요청한다. 대상·운영 지역처럼 페이지에 확정 사실로 출력하지 않아도 되는 미정 맥락은 상태를 보존하고 안내하되, 그 이유만으로 미리보기를 막거나 임의 추정하지 않는다. 조건부 ‘기타 목적’ 입력은 목적이 기타일 때만 적용한다. 약관·필수 고지·콘텐츠 항목의 명시적인 확인 필요 표시는 계속 검증한다.

### 롤백 및 비교 설정

`HALLMARK_DESIGN_ENABLED=false`이면 서버의 Hallmark 설계 지침/최근 구성 입력과 추가 설계 경고를 끈다. 프롬프트 자체도 이전 검증 버전으로 되돌려야 완전한 지침 비교가 된다. 여정 저장과 중복 실행 방지 기능은 디자인 지침 설정과 분리한다.

### 로컬 검증 명령

```bash
node scripts/test-hallmark-design.mjs
node scripts/test-page-schema-api.mjs
node scripts/test-page-schema-readiness.mjs
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/test-hallmark-journey-browser.mjs
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/test-content-preview-auto-browser.mjs
CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/test-page-schema-builder-browser.mjs
```

PostgreSQL 호환 저장 검증은 개발 도구에 PGlite가 설치돼 있을 때 `PGLITE_TEST_MODULE=<설치한 모듈의 경로> node scripts/check-hallmark-postgres.mjs`로 실행한다. 이번 검증에는 PGlite 0.5.16을 사용했다. 실제 저장 함수, 요구사항 CAS, 최신 원문 검증, 실행 lease/재시도, 문서·대화·작업의 원자적 저장, 생성 중 요약 변경 거절, 089의 같은 lineage Draft 생성·재실행 안전성을 확인했다.

브라우저 테스트의 모델 응답은 fixture이며 실제 LLM 품질 향상의 증거로 간주하지 않는다. 실제 LLM 비교 시 generationMeta의 프롬프트·모델·토큰·요약 버전, 설계 지침 버전, 구조 지문, 공급자 지연 시간·usage를 함께 기록한다.


### 수정 경로

문구·혜택 수정은 요약 분석과 사용자 확인으로 돌아간다. 배치·스타일 수정은 승인된 원문과 연결을 유지하는 PageSchema 수정 경로를 사용한다. 요약이 바뀐 후 재생성할 때에는 현재 페이지를 연속성 컨텍스트로 전달하고 관계없는 구조·ID·미디어·액션을 유지하도록 지시한다. 모델 출력에 대한 정책·원문 검증은 계속 수행한다.

### 배포 전 체크

- 088 적용: 실행 작업 저장소와 문서별 동시 실행 제한 생성. 없으면 생성 API에서 적용 필요 안내.
- 089 적용: 현재 활성 동적 설계 프롬프트와 같은 lineage에 새 Draft 생성. 기존 활성 버전은 그대로 유지.
- 관리자에서 새 Draft 검증 후 활성화. 필수 변수 세 개와 PageSchema 출력 계약은 유지.
- 필요 시 HALLMARK_DESIGN_ENABLED=false와 이전 프롬프트로 비교/롤백.
- 코드 배포와 원격 프롬프트 활성화, 실제 LLM 품질 검증은 별개로 기록.
# PageSchema provider timeout

`promo_page_schema_planner` permits a 240,000 ms provider timeout within the
300-second `promo-page-schema` route. Existing 90,000 ms planner defaults are
upgraded at execution normalization and shown as 240,000 ms in the prompt editor;
this compatibility change requires no SQL migration or prompt reactivation.
Other explicitly configured budgets remain effective, up to 240,000 ms. Other
text planners retain their 90,000 ms limit. This prevents the legacy 90-second
cutoff but does not guarantee a provider response within four minutes.

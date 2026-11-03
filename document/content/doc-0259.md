# Final Design 기반 Vue 웹페이지 생성 개발 계획서

- 작성일: 2026-07-14
- 상태: 개발 계획 / 소스코드 미반영
- 대상: Standalone Promo Wizard Step 4 `Final Design Result`
- 목표: 생성 완료된 Final Design을 기준으로 실행 가능한 Vue 웹페이지를 생성하고, 결과를 미리보기 및 내려받을 수 있게 한다.

## 1. 요청 요약

현재 Wizard는 다음 흐름까지 구현되어 있다.

```text
Concept -> Content -> Integrated Brief -> LO-FI -> Confirm Draft -> Final Design
```

여기에 다음 단계를 추가한다.

```text
Final Design ready
  -> 웹페이지 생성
  -> Vue 코드 생성 worker 실행
  -> 코드 검증 및 빌드
  -> 샌드박스 미리보기
  -> 소스 다운로드
```

Step 4의 선택된 Final Design에 `웹페이지 생성` 버튼을 추가한다. 사용자가 버튼을 누르면 해당 Final 이미지와 생성 과정의 구조화된 자료를 기준으로 Vue 웹페이지를 생성한다.

## 2. 검토 결론

기능 추가는 가능하지만 **Final 이미지 한 장만 image-to-code 입력으로 사용하는 방식은 권장하지 않는다.** 이미지에는 정확한 프로모션 문구, 링크, 약관 및 모바일 동작이 완전하게 표현되지 않을 수 있기 때문이다.

권장 입력 우선순위는 다음과 같다.

1. Step 2 원문 콘텐츠: 실제 문구, CTA URL, 약관의 source of truth
2. Confirmed LO-FI: 섹션 순서와 배치 구조의 source of truth
3. Final Design 이미지: 색상, 이미지, 간격, 타이포그래피 등 시각 표현의 source of truth
4. Integrated Brief / Design Concept: 디자인 토큰과 보조 제약

따라서 Vue 코드 생성은 기존 `final_design`에 포함하지 않고 별도 비동기 단계인 `web_code` worker로 분리한다. Final Design 재생성과 웹 코드 재생성 이력도 서로 독립적으로 관리한다.

## 3. 1차 개발 범위

### 포함

- Step 4 선택 Final Design에 `웹페이지 생성` 버튼 추가
- 생성 상태: 대기 중 / 생성 중 / 검증 중 / 완료 / 실패
- 같은 Final Design에서 여러 번 재생성하고 결과 이력 유지
- Vue 3 기반 소스 생성
- 데스크톱 및 모바일 반응형 구현
- 생성 코드 정적 검사 및 빌드 검증
- 샌드박스 iframe 미리보기
- 생성 소스 ZIP 다운로드
- 오류 메시지와 재시도 버튼

### 제외

- 운영 도메인 자동 배포
- GitHub 저장소 자동 PR 생성
- 사용자가 브라우저에서 직접 코드를 편집하는 IDE
- 임의 npm 패키지 설치 허용
- 생성 페이지의 관리자 승인 및 법무 승인 워크플로우

자동 퍼블리싱은 코드 생성 결과와 QA가 안정화된 후 별도 `publish` 단계로 진행한다.

## 4. UX 계획

### 4.1 버튼 위치와 활성 조건

Step 4의 큰 Final Design Preview 아래 액션 영역에 버튼을 배치한다.

```text
[최종 디자인 재생성] [웹페이지 생성]
```

활성 조건:

- 선택된 Final Design 상태가 `ready` 또는 `completed`
- Final 이미지 프록시가 정상 응답
- run에 Step 2 콘텐츠와 Integrated Brief가 존재
- 웹 코드 worker 설정이 active

조건을 만족하지 않으면 버튼을 비활성화하고 실제 누락 항목을 짧게 표시한다.

### 4.2 생성 진행 상태

기존 Step 3/4의 상태 표현과 같은 패턴을 사용한다.

| 상태 | UI 문구 | 색상 의미 |
|---|---|---|
| `queued` | 대기 중 | 중립 |
| `generating` | Vue 코드 생성 중 | 진행 |
| `validating` | 코드 및 콘텐츠 검증 중 | 진행 |
| `ready` | 웹페이지 생성 완료 | 성공 |
| `failed` | 웹페이지 생성 실패 | 오류 |

### 4.3 결과 영역

완료 후 Step 4 하단에 `Generated Webpages` 영역을 추가한다.

- 생성 attempt와 생성 시각
- 상태 및 사용 모델
- `미리보기` 버튼
- `소스 다운로드` 버튼
- `다시 생성` 버튼
- 실패 시 오류 메시지

여러 결과는 삭제하거나 덮어쓰지 않고 누적한다. 기본 선택은 가장 최근의 성공 결과로 한다.

## 5. 생성 산출물 규격

### 권장 MVP 형식

Vue 3 + Vite 프로젝트 구조를 고정한다.

```text
promo-page/
  package.json
  index.html
  src/
    main.js
    App.vue
    components/
    assets/
    styles.css
```

규칙:

- Vue 3 Composition API 사용
- TypeScript는 1차 범위에서 제외하고 JavaScript로 통일
- 허용된 기본 의존성만 사용
- 외부 CDN 스크립트 및 임의 원격 코드 금지
- CTA는 Step 2의 실제 URL 사용
- 약관 및 필수 문구를 이미지 OCR이 아니라 Step 2 원문에서 사용
- 주요 콘텐츠를 background image 한 장으로 대체하지 않음
- 텍스트와 CTA는 실제 DOM 요소로 구현
- 데스크톱과 모바일 레이아웃 제공
- 접근 가능한 heading 구조, alt text, button/link 구분 적용

worker는 소스 파일과 함께 빌드된 정적 preview artifact를 반환한다.

## 6. 데이터 모델

Final Design과 1:N 관계인 별도 테이블을 권장한다.

```sql
create table promo_generation_web_pages (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_generation_runs(id),
  final_design_id uuid not null references promo_generation_final_designs(id),
  generation_attempt integer not null,
  status text not null default 'queued',
  framework text not null default 'vue3-vite',
  source_archive_url text,
  preview_url text,
  source_manifest jsonb not null default '{}'::jsonb,
  prompt_snapshot jsonb not null default '{}'::jsonb,
  model_meta jsonb not null default '{}'::jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  error_message text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (final_design_id, generation_attempt)
);
```

`source_manifest`에는 파일 경로, 해시, 크기만 저장하고 실제 소스 ZIP과 preview 파일은 Vercel Blob 등에 저장한다. DB에 전체 소스 문자열을 직접 누적하지 않는다.

## 7. API 계약

### 생성 요청

```http
POST /api/promo-generation-web-pages
Content-Type: application/json
```

```json
{
  "runId": "...",
  "finalDesignId": "...",
  "triggerWorker": true
}
```

서버는 Final Design이 해당 run에 속하며 상태가 ready인지 검증한 뒤 row를 생성하고 `202 Accepted`를 반환한다.

### worker callback

```http
PATCH /api/promo-generation-web-pages
```

callback은 `webPageId`를 기준으로 상태, source archive, preview artifact, 모델 메타데이터 및 검증 결과를 저장한다. 기존 worker callback과 동일하게 idempotent하게 처리한다.

### 결과 조회

- 기존 `GET /api/promo-generation-runs` 응답에 `webPages` summary 추가
- `GET /api/promo-generation-web-page-source?webPageId=`: ZIP 프록시
- `GET /api/promo-generation-web-page-preview?webPageId=&path=`: 허용된 정적 preview 파일 프록시

상태 갱신은 1차 구현에서 기존 5초 polling 패턴을 재사용하되, 연속 오류에는 backoff를 적용한다.

## 8. web_code worker 입력

worker payload는 최소 다음 정보를 포함한다.

```json
{
  "stage": "web_code",
  "runId": "...",
  "webPageId": "...",
  "finalDesign": {
    "finalDesignId": "...",
    "imageUrl": "absolute proxy URL"
  },
  "confirmedDraft": {
    "draftId": "...",
    "imageUrl": "absolute proxy URL",
    "draftPrompt": "..."
  },
  "contentSource": {
    "promo": {},
    "simpleBrief": {},
    "sectionInputs": {}
  },
  "integratedBrief": {},
  "designConcept": {},
  "outputContract": {
    "framework": "vue3-vite",
    "responsive": true,
    "sourceArchiveRequired": true,
    "previewArtifactRequired": true
  }
}
```

Step 2 콘텐츠를 localStorage에서만 읽지 않도록 주의해야 한다. 현재 run 생성 시 저장되는 `input_snapshot` 또는 이에 준하는 서버 저장값에서 원문 콘텐츠를 복원할 수 있어야 한다. 서버에 누락된 필드가 있다면 코드 생성 전에 저장 계약을 먼저 보강한다.

## 9. 생성 및 검증 파이프라인

```text
Create web page row
  -> Load final image / LO-FI / brief / content
  -> Render web_code prompt snapshot
  -> Generate structured source files
  -> Validate file manifest and paths
  -> Install only allowlisted dependencies
  -> Run Vue build
  -> Run content coverage checks
  -> Render desktop/mobile screenshots
  -> Compare structure with Final/LO-FI
  -> Upload source ZIP and static preview
  -> PATCH ready or failed
```

LLM 응답은 자유로운 Markdown 코드 블록보다 구조화된 파일 배열을 권장한다.

```json
{
  "files": [
    { "path": "package.json", "content": "..." },
    { "path": "src/App.vue", "content": "..." }
  ]
}
```

서버 또는 worker는 `..`, 절대 경로, 실행 스크립트, 허용되지 않은 dependency를 거부해야 한다.

## 10. 필수 QA Gate

### 코드 검증

- JSON/SFC/JavaScript 구문 검사 통과
- Vite production build 성공
- 브라우저 console error 없음
- 외부 원격 스크립트 없음
- 허용되지 않은 네트워크 호출 없음

### 콘텐츠 검증

- 프로모션 제목과 핵심 혜택 포함
- CTA label 및 URL 일치
- 약관/Responsible Gaming 문구 포함
- Step 2 필수 필드 coverage 100%
- 이미지 속 텍스트를 실제 콘텐츠로 오인하지 않음

### 시각 및 반응형 검증

- Confirmed LO-FI의 섹션 순서 유지
- Final Design의 주요 색상과 시각 계층 반영
- 1440px desktop 및 390px mobile에서 overflow/overlap 없음
- 텍스트가 잘리거나 버튼 밖으로 넘치지 않음
- CTA와 주요 인터랙션이 실제로 동작

## 11. 보안 원칙

AI 생성 코드를 운영 앱과 같은 DOM/JavaScript 실행 컨텍스트에서 직접 실행하면 안 된다.

- preview는 별도 origin 또는 강한 CSP가 적용된 sandbox iframe에서 실행
- iframe에는 최소 권한만 허용하고 `allow-same-origin`과 `allow-scripts` 조합을 신중히 제한
- 생성 코드에서 쿠키, localStorage, 부모 window 접근 금지
- 임의 npm lifecycle script 실행 금지
- dependency allowlist 적용
- 빌드는 격리된 임시 실행 환경에서 수행
- source/preview API에는 향후 관리자 인증 및 권한 검사 적용

현재 관리자/API 인증이 없다는 별도 리뷰 이슈가 있으므로, 자동 퍼블리싱은 인증·인가가 적용되기 전까지 활성화하지 않는다.

## 12. 변경 예상 파일

### Frontend

- `prototype/promo-wizard.js`: 버튼, 상태, 결과 목록, polling 및 preview 연결
- `prototype/promo-wizard.css`: 웹페이지 생성 상태와 결과 레이아웃

### API / Store

- `api/promo-generation-web-pages.js`: POST/PATCH
- `api/promo-generation-web-page-source.js`: ZIP 프록시
- `api/promo-generation-web-page-preview.js`: 정적 preview 프록시
- `api/_promo-generation-run-store.js`: webPages 조회 및 summary
- `api/_promo-generation-worker-trigger.js`: `web_code` stage/env 추가
- `api/_worker-webhook-settings-store.js`: worker 설정 추가
- `api/_prompt-template-store.js`: `web_code` prompt type 추가
- `api/_prompt-execution-snapshot.js`: 모델과 출력 계약 검증

### DB / n8n / Tests

- 신규 DB migration
- `n8n/Promo Web Code Worker.json`
- API 및 worker 계약 테스트
- Vue build fixture 및 콘텐츠 coverage 테스트

## 13. 단계별 개발 순서

### Phase 0. 선행 확인

1. run 서버 저장값에 Step 2 원문 전체가 존재하는지 확인
2. 코드 생성 모델 및 호출 방식 결정
3. 격리된 build/preview 실행 환경 결정
4. web_code worker를 n8n에서 수행할지 별도 build service에서 수행할지 확정

### Phase 1. 저장/API 계약

1. DB migration과 summary 추가
2. POST/PATCH API 구현
3. worker setting 및 trigger stage 추가
4. idempotency, 소유 관계, 상태 전이 테스트

### Phase 2. Vue 생성 worker

1. 구조화된 source-file 출력 prompt 구현
2. source path/dependency 검증
3. Vue build 및 preview artifact 생성
4. Blob 업로드와 callback 구현

### Phase 3. Step 4 UI

1. `웹페이지 생성` 버튼 추가
2. 진행 상태와 실패/재시도 처리
3. 생성 이력 및 선택 처리
4. 미리보기와 소스 다운로드 연결

### Phase 4. QA

1. 실제 Final Design으로 E2E 생성
2. 데스크톱/모바일 screenshot 검사
3. 콘텐츠 coverage 및 링크 검사
4. 재생성 이력과 새로고침 복원 검사
5. 기존 Final Design 생성 흐름 회귀 검사

## 14. Definition of Done

- ready 상태의 Final Design에서만 웹페이지 생성을 시작할 수 있다.
- 요청마다 고유 webPageId와 attempt가 생성된다.
- 생성된 결과가 Vue 3 프로젝트로 정상 빌드된다.
- Step 2 필수 콘텐츠가 실제 DOM 텍스트와 링크로 모두 반영된다.
- 데스크톱과 모바일 미리보기가 정상 표시된다.
- 생성 코드는 운영 앱과 격리된 환경에서 실행된다.
- 여러 번 생성해도 이전 결과가 유지된다.
- 실패 이유가 UI에 표시되고 재시도가 가능하다.
- 소스 ZIP을 내려받을 수 있다.
- 기존 Concept/Content/LO-FI/Final 흐름에 회귀가 없다.

## 15. 결정 권고안

1차 구현은 다음 조합을 권장한다.

- 출력: Vue 3 + Vite + JavaScript
- 실행: 별도 `web_code` 비동기 worker
- 저장: DB metadata + Blob source ZIP/static preview
- UI: Step 4 내부 버튼 및 누적 결과 목록
- 미리보기: 격리된 sandbox iframe
- 배포: 이번 범위 제외

이 구조는 현재 runId/worker/polling 패턴을 재사용하면서도 AI 생성 코드의 실행 위험을 기존 Promo Builder와 분리한다.

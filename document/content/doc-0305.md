# 검토 의견: api/ 폴더 전체 소스코드

Reviewer: Claude
Date: 2026-07-12
검토 범위: `api/` 40개 파일 중 39개 전체 + `_design-md-data.js`(1210줄, 가장 큰 파일) 구조 일부

## 결론

전체적으로 에러 핸들링, 입력 검증, 이미지 바이트 검증(매직 넘버 체크) 패턴이 일관되게 잘 적용되어 있음. 다만 **보안 이슈 2건(SSRF 검증 누락, 이미지 프록시 무인증)**은 실제 운영 리스크이므로 우선 조치가 필요함. 또한 지난번 n8n 관련 논의 문서들이 "아직 구현 안 됨"이라고 판단했던 항목들(execution snapshot, final_design prompt type, confirmed LO-FI 상세 전달) 중 상당수가 **이미 애플리케이션 레이어에는 구현되어 있음**을 확인함 — 병목은 이제 n8n 워크플로우 쪽(이전 세션에서 직접 확인)에 있음.

## 이슈사항

### 1. (보안, 우선순위 높음) SSRF 검증이 endpoint마다 다름

`generate-ui-design.js`와 `_promo-generation-worker-trigger.js`는 프로덕션에서 `isProductionRuntime()` + `workerHostAllowed()`로 헤더/요청 기반 webhook URL을 검증하지만, 동일 패턴을 쓰는 `generate-promo-page.js`와 `analyze-design-md.js`는 이 검증이 아예 없음. 두 파일 모두 `req.headers["x-n8n-webhook-url"]`(또는 유사 헤더)을 그대로 `fetch()`에 전달함. 프로덕션에서 임의 URL로 서버측 요청을 보낼 수 있는 SSRF 경로.

- `api/generate-promo-page.js` (레거시 promo-page 흐름)
- `api/analyze-design-md.js`

제안: 두 파일에 `_worker-webhook-settings-store.js`의 `isProductionRuntime`/`workerHostAllowed`와 동일한 검증을 추가하거나, 공통 헬퍼로 추출해서 재사용.

### 2. (보안) 이미지 프록시 엔드포인트에 접근 제어가 없음

`promo-generation-lofi-draft-image.js`, `promo-generation-final-design-image.js`, `promo-design-image.js` 모두 draftId/finalDesignId/runKey(UUID 또는 키)만 알면 인증 없이 private Blob 이미지를 가져올 수 있음. Blob 자체는 private로 설정되어 있지만, 이 프록시가 사실상 "URL을 아는 사람 전체에게 영구 공개"로 만듦. n8n Final Design Worker에 전달되는 `draftImageProxyUrl`도 이 무인증 URL이라, 외부 인프라(n8n Cloud)에 이 URL이 남으면 접근 범위가 넓어짐.

제안: 최소한 `promo-generation-final-designs.js`가 하는 것처럼 run 소유권 검증을 프록시에도 추가하거나, 짧은 만료 시간의 서명된 토큰을 붙이는 방식 검토. (이전 계획 문서 Phase 4의 "보안 고려" 항목과 정확히 일치하는 부분이나, 실제로는 아직 프록시 자체에 반영 안 됨.)

### 3. (좋은 소식) n8n 3단계 worker 계약을 위한 애플리케이션 준비가 이미 상당 부분 완료됨

- `_prompt-template-store.js`에 `final_design` prompt type과 `DEFAULT_MODEL_SETTINGS.final_design`(gpt-image-1, inputFidelity: high)이 이미 존재 — 지난 논의 문서들이 "final_design 전용 타입 없음"이라 했던 부분이 코드에는 반영되어 있음.
- `_prompt-execution-snapshot.js`가 stage별(`integrated_brief`/`lofi_draft`/`final_design`) provider/model/responseFormat 조합을 검증하는 `validateStageModelConfig`를 구현하고 있고, `prompt-template.js`/`prompt-template-activate.js`가 저장/활성화 시점에 이 검증을 호출함.
- `promo-generation-final-designs.js`가 confirmed draft의 `draft_image_url`/`draft_prompt`/`prompt_meta`/`confirmed_at`을 조회하고, run 소유권까지 검증한 뒤 `draftImageProxyUrl`과 `layoutFidelityPolicy`를 worker payload에 포함시킴 — 지난 계획 문서 Phase 4의 목표 구조와 거의 동일.
- 다만 이전 세션에서 Cloud n8n의 실제 Final Design Worker를 직접 열어봤을 때는 여전히 `type: image_execution`을 하드코딩 호출하고 confirmedDraft/layoutFidelityPolicy를 쓰지 않았음. **즉 앱은 준비됐고 n8n 워크플로우만 안 따라간 상태** — 다음 작업은 n8n 쪽 반영이지 앱 코드 추가 작업이 아님.

### 4. (좋은 소식) handoff-2026-07-02에서 제안했던 Integrated Brief 길이 가드도 이미 구현됨

`promo-generation-integrated-brief-complete.js`의 `buildLengthGuardMeta`/`validateIntegratedBrief`가 정확히 그 기준(15000 warning, 20000 retry threshold, 30000 hard limit)으로 구현되어 있음.

### 5. (코드 정리) 두 세대의 생성 파이프라인이 공존

`promo_design_runs`/`promo_design_assets` 기반의 레거시 파이프라인(`promo-design-assets.js`, `promo-design-image.js`, `promo-design-view.js`, `promo-design-markdown.js` 등)과 `promo_generation_runs` 기반의 신규 3단계 파이프라인이 동시에 존재함. 버그는 아니지만, 새로 합류하는 AI 도구/개발자가 어느 쪽이 "현재 라이브"인지 헷갈릴 수 있음. README나 handoff 문서에 "레거시 vs 신규" 명확한 안내가 있으면 좋겠음.

### 6. (사소함) `_promo-markdown-builders.js`의 `LOG_VALUE_TRANSLATIONS`에 깨진 인코딩 항목 존재

496~507번째 줄 근처에 정상 한글 키/값 쌍과 거의 동일한 내용이 mojibake(인코딩 깨짐)된 키로 중복 등록되어 있음(예: `"?좎씤荑좏룿"` → `"Discount coupon"`). 실제 매칭에는 영향 없는 죽은 코드지만, 과거 어느 시점 파일 저장 시 인코딩 문제가 있었다는 신호이므로 정리 권장.

### 7. (참고) `_design-md-data.js`(1210줄) 심층 검토는 이번에 구조 파악 수준까지만 진행

이 파일은 Design MD 마크다운에서 디자인 토큰을 정규식 기반으로 추출하는 핵심 로직으로, handoff-2026-07-01에서 이미 한 번 semantic token 매핑 버그(예: `spacing.base: 1.4` 같은 오매핑)가 발견/수정된 이력이 있음. 규모와 복잡도를 고려하면 `scripts/test-design-prompt-md.js` 같은 회귀 테스트가 이 파일의 브랜치를 얼마나 커버하는지 별도로 확인해볼 가치가 있음. 필요하면 다음 세션에서 전체 라인을 이어서 검토 가능.

## 간략한 내용

- 전체적으로 에러는 항상 `try/catch` + `error.statusCode || 500` 패턴으로 일관되게 처리됨.
- 이미지 업로드/콜백 경로(`promo-design-assets.js`, `promo-generation-lofi-drafts.js`, `promo-generation-final-designs.js`)는 모두 PNG/JPEG/WebP 매직 바이트 검증 후 저장 — handoff-2026-07-02의 "file_size: 9 깨진 이미지" 문제가 재발하지 않도록 방어되어 있음.
- Prompt 관리 API(`prompt-template.js`/`prompt-templates.js`/`prompt-template-activate.js`/`prompt-template-archive.js`)는 버전 관리, 변경 이력 저장, active 단일성 보장이 꼼꼼하게 구현됨.
- 추가 상세 내용이나 `_design-md-data.js` 전체 라인 검토가 필요하면 말씀해주세요.

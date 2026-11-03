# 생성 페이지 아티팩트 저장 계약

## 결정

n8n Workflow의 `$getWorkflowStaticData('global')`에는 생성 HTML을 저장하지 않는다. 검증된 결과는 Web API의 `POST /api/promo-page-generation-artifact`를 통해 PostgreSQL `promo_page_generation_artifacts`에 저장하고, 응답의 `pagePath`를 사용자에게 반환한다.

- 본문은 최대 900 KB로 제한한다.
- 기본 보존 기간은 24시간이고, 5분~7일 범위만 허용한다.
- 같은 `artifact_key`와 동일 콘텐츠의 재시도는 최초 만료시각·서명 URL을 유지한다. 만료 전 다른 콘텐츠가 같은 키를 덮어쓰는 요청은 `409 PROMO_PAGE_ARTIFACT_KEY_CONFLICT`로 거부하고, 만료 후에는 새 콘텐츠로 교체할 수 있다.
- 만료된 행은 조회되지 않으며 저장 요청마다 최대 100건을 정리한다.
- 공개 조회는 `id`만으로 허용하지 않고 `PROMO_PAGE_ARTIFACT_SIGNING_SECRET`으로 만든 서명 토큰을 요구한다.
- Prompt 전문과 LLM Request는 저장하지 않는다. API가 `promptMeta`를 식별자·타입·이름·버전·해시·Prompt Layer 출처 allowlist로 정규화하고 그 밖의 필드는 거부한다.

## n8n 연결 계약

1. `Validate Generated Page` 성공 결과를 내부 `Browser Quality Gate`에 전달한다.
2. Browser Gate가 Chromium 1440px·390px 검사를 통과하면 결과·검증 Context·Artifact ID·제목·Prompt Meta·Gate 보고서에 결합된 단기 HMAC Attestation을 발급한다.
3. n8n은 `result`, 원본 검증 Context, `promptMeta`, `title`, `id`, `browserQualityGate`, `browserQualityAttestation`을 Artifact API에 POST한다.
4. Artifact API는 같은 생성 계약과 Attestation의 서명·TTL·subject hash를 다시 검증한 뒤 저장한다. n8n이 임의로 만든 `passed` JSON만으로는 저장할 수 없다.
5. n8n은 Artifact API가 반환한 상대 `pagePath`를 Web API Origin과 결합해 반환한다.
6. 기존 `Parse Validate Store Page`, `Read Stored AI Page`, `View AI Promo Page`, `Render AI HTML Page`의 static-data 저장·조회 경로는 제거한다.

## Secret·Credential 배포 계약

운영 Workflow의 Code node에서는 `$env`를 읽지 않는다. `N8N_BLOCK_ENV_ACCESS_IN_NODE=true`를 유지하고 아래 Credential을 n8n Credential Store 또는 연동된 External Secrets에 만든다.

| 용도 | n8n Credential |
| --- | --- |
| 생성 Webhook 호출 인증 | Webhook Header Auth (`x-promo-generation-token`) |
| OpenAI 호출 | OpenAI API Credential |
| Prompt Render·Validator·Artifact API | HTTP Header Auth (`Authorization: Bearer …`) |
| Browser Quality Gate | 별도 HTTP Header Auth (`Authorization: Bearer …`) |

`PROMPT_RENDER_URL`, `PROMO_PAGE_VALIDATOR_URL`, `PROMO_PAGE_ARTIFACT_URL`, Browser Gate 내부 URL은 배포 시 Workflow Parameter에 고정하고 요청 Payload로 받지 않는다. Web API에는 최소 32자의 `PROMPT_RUNTIME_SERVICE_TOKEN`과 별도의 최소 32자 `PROMO_PAGE_ARTIFACT_SIGNING_SECRET`을 Secret Manager에서 주입한다. Browser Service에도 별도의 최소 32자 호출 Token을 주입한다. `PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET`은 Browser Service와 Artifact API에만 주입하고 n8n에는 노출하지 않는다. Credential ID나 Secret 값은 Workflow JSON과 Git에 커밋하지 않는다.

현재 저장소의 Workflow JSON은 Credential 매핑 전 Import Template이다. `$env` URL·Token 표현식을 운영 Credential과 배포 고정 URL로 치환하고 `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` Preview 실행을 통과하기 전에는 활성화하지 않는다.

Migration 076 적용, Credential 생성, Credential ID 매핑, Preview 실행 검증 전에는 기존 Workflow를 운영에 Import하지 않는다.

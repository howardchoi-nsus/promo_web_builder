# 프로모션 생성 파이프라인 V2 구현·운영 가이드

## 결정 사항

V2는 `디자인 콘셉트 + 프로모션 콘텐츠 → 통합 브리프 → 최종 디자인`의 2단계 생성 파이프라인이다. LO-FI 생성, LO-FI 이미지 저장, 시안 선택·확정, LO-FI n8n 워커 호출은 V2 실행 경로에서 모두 제외한다. 기존 V1 API·데이터·워크플로는 롤백과 비교 평가를 위해 유지한다.

## 실행 흐름

1. 브라우저가 생성 Run을 `pipelineVersion: v2`로 생성한다.
2. `integrated_brief_v2` 프롬프트가 디자인 콘셉트와 섹션 콘텐츠를 통합한다.
3. 통합 브리프가 준비되면 `/api/promo-generation-v2-final-designs`가 `final_design_v2` 작업을 큐에 넣는다.
4. `final_design_v2` n8n 워커가 참조 이미지 없이 OpenAI 이미지 생성 API를 호출한다.
5. 워커가 동일 V2 API에 결과를 PATCH하고, 이미지는 Private Vercel Blob에 저장된다.

V2 최종 디자인 레코드의 `confirmed_draft_id`는 의도적으로 `null`이며, `prompt_meta.pipelineVersion`과 `model_meta.referenceMode = text_to_image`로 실행 방식을 식별한다.

## 권장 모델

| 역할 | V2 모델 | 설정 | 선택 이유 |
|---|---|---|---|
| 통합 브리프 | `gpt-6.1-sol` | reasoning `medium`, temperature 미사용, JSON 응답 | 복잡한 콘텐츠 보존·디자인 제약 통합 |
| 최종 디자인 | `gpt-image-2.5-sunburst` | quality `high`, `1024x1536`, PNG | 프로모션 웹 시안의 완성도와 텍스트·레이아웃 지시 이행 |

모델은 코드 상수가 아니라 DB의 활성 Prompt Version에 저장된다. 마이그레이션 `072_generation_pipeline_v2.sql`은 V2 전용 프롬프트 타입을 추가하며 V1 활성 프롬프트는 변경하지 않는다.

## 배포 순서

1. DB 마이그레이션 072를 적용한다.
2. n8n에 `Promo Final Design V2 Worker.direct-generation.json`을 가져온다.
3. n8n OpenAI 자격 증명을 기존 보안 Credential로 다시 연결한다. JSON 안의 `__RETAIN_EXISTING_N8N_KEY__`는 실제 키를 저장하기 위한 값이 아니다.
4. 워크플로를 활성화하고 Production Webhook URL을 복사한다.
5. 관리자 화면의 `final_design_v2` 워커 설정에 URL을 저장하고 활성화한다. 환경 변수 방식은 `N8N_FINAL_DESIGN_V2_WORKER_URL`을 사용한다.
6. `N8N_WORKER_WEBHOOK_ALLOWLIST`에 n8n 호스트가 포함되어 있는지 확인한다.
7. 기존 Integrated Brief 워커가 OpenAI Responses API에서 `execution.model`, `execution.modelOptions.reasoning.effort`, `execution.modelOptions.maxTokens`를 사용하고, reasoning이 활성화되면 temperature를 보내지 않는지 확인한다.
8. V2 마법사에서 통합 브리프 완료 후 최종 디자인 생성과 결과 이미지 조회를 검증한다.

## 검수 기준

- V2 브라우저 요청에서 `/api/promo-generation-lofi-drafts`와 LO-FI confirm API가 호출되지 않는다.
- V2 n8n 워크플로에 LO-FI 다운로드·이미지 편집 노드가 없다.
- 결과에 필수 프로모션 문구, CTA, 약관·법무 영역이 빠지지 않는다.
- 결과가 포스터가 아니라 스크롤 가능한 웹 페이지 구조로 보인다.
- 모델·프롬프트 버전·렌더링 프롬프트 해시가 실행 snapshot에 남는다.
- 워커 실패는 `final_design_v2_trigger_failed` 또는 `final_design_v2_failed`로 종료된다.

## 롤백

V2 마법사 배포를 되돌리거나 진입 링크를 V1 화면으로 복원한다. V1의 `lofi_draft`와 `final_design` 프롬프트 및 n8n 워커는 삭제하지 않았으므로 데이터 마이그레이션 없이 기존 실행 경로로 돌아갈 수 있다. V2 워커만 비활성화할 경우 신규 V2 요청은 명시적 trigger failure로 표시된다.

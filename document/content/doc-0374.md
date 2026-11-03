# Web Output 프롬프트 품질 감사 및 개선 기록

- 검토일: 2026-11-02
- 최우선 목표: 생성된 프로모션 웹 결과물의 콘텐츠 정확도, 시각적 완성도, 반응형 안정성 향상
- 검토 범위: Admin이 관리하는 19개 Prompt Type, AI Builder 생성·편집 경로, 레거시 HTML/CSS 생성 경로, 이미지 자산 요청 계약

## 결론

프롬프트 19종을 런타임 호출 위치와 출력 영향 기준으로 전수 검토했다. 현재 AI Builder의 Web Output은 하나의 “최종 HTML 프롬프트”가 만드는 구조가 아니라, 구조화된 Composition을 만든 뒤 공용 Renderer가 결정론적으로 출력하는 구조다. 따라서 품질에 가장 큰 영향을 주는 `promo_overview_parser`, `promo_page_composer`, `promo_composition_editor`를 우선 개선하고, 별도 레거시 경로인 `promo_page_generation`은 반응형·접근성·텍스트 전용 MVP 기준으로 본문을 전면 보강했다.

이번 변경은 운영 프롬프트를 즉시 교체하지 않는다. Migration 075는 검토 가능한 `draft` 후보를 생성하며, Admin의 Validate → Activate 절차를 통과해야 런타임에 반영된다.

## 실제 Web Output 호출 체인

```text
사용자 자연어 요청
→ promo_overview_parser
→ promo_page_composer (Contract V3)
→ Registry 검증 · Layout Fit 보정 · Compiler
→ section_background_image / component_image
→ default-promo-renderer
→ Web Output
```

생성 후 자연어 수정은 `promo_composition_editor`가 처리한다. `promo_page_generation`은 위 Composition 경로와 분리된 레거시 HTML/CSS 생성 경로이며, `/api/prompts/promo-page-generation`을 통해 DB의 활성 프롬프트 본문을 제공한다.

## 19개 Prompt Type 전수 감사 요약

| 그룹 | Prompt Type | Web Output 영향 | 감사 결과 |
| --- | --- | --- | --- |
| AI Builder 핵심 | `promo_overview_parser` | 매우 높음 | 사실 보존, 입력 언어, 짧고 구체적인 카피, enum/field decision 기준 보강 필요 |
| AI Builder 핵심 | `promo_page_composer` | 가장 높음 | Contract V3 `contentItems`와 기존 지시가 충돌하는 P0 결함 확인 |
| AI Builder 편집 | `promo_composition_editor` | 높음 | 최소 변경, 법적 콘텐츠 보존, 모바일 안전성 기준 필요 |
| Builder 이미지 | `section_background_image`, `component_image` | 높음 | Prompt harness는 비교적 강하지만 선택 Layout의 copy 안전영역이 실제 요청에 전달되지 않음 |
| Section 편집 | `section_layout_planner`, `multi_component_layout_planner`, `section_composition_planner` | 중간 | 구조 계약은 있으나 페이지 전체 리듬과 실제 렌더 피드백은 부족 |
| 템플릿 경로 | `promo_template_recommender`, `promo_template_composer` | 별도 경로 | 현재 템플릿 없는 AI Composition 주 경로와 분리 관리 필요 |
| 디자인 생성 | `integrated_brief`, `integrated_brief_v2`, `lofi_draft`, `final_design`, `final_design_v2`, `image_execution` | 디자인 이미지 경로 | completion contract는 있으나 Web Output Renderer와 직접 연결되지 않음 |
| Admin/Component | `component_visual_analyzer`, `admin_prompt_translation` | 간접 | Component 제안과 Admin 편의 기능으로, 웹 카피·레이아웃의 직접 영향은 제한적 |
| 레거시 페이지 | `promo_page_generation` | 별도 HTML/CSS 경로 | 데스크톱 편향, 모바일·접근성·overflow·텍스트 전용 기준 부재 |

실제 운영 본문은 저장소의 Markdown 파일이 아니라 DB `prompt_templates`에서 `status='active'`인 버전이다. 저장소의 `prompts/`와 `tmp/` 파일은 참고 자료이며 런타임 fallback이 아니다.

## P0 문제와 원인

### 1. Contract V3와 `contentItems` 지시 충돌

런타임 스키마는 모든 Component에 `contentItems`를 요구하며, 반복 Component는 `repeatIndex`별로 서로 다른 카피를 가져야 한다. 그러나 기존 Composer 참고 프롬프트와 repair prompt는 “콘텐츠를 만들지 말라”고 지시해 빈 카드, 동일 문구 반복, validation repair 실패를 유발할 수 있었다.

개선:

- `contentItems`를 AI가 작성할 수 있는 유일한 Component 카피 경로로 명시
- `repeatIndex 0..repeat-1`의 모든 항목에 캠페인별 고유 카피 요구
- Overview에 근거한 사실만 사용하고 금액·날짜·자격·URL·법적 문구 발명 금지
- 기존 금지 지시보다 새 품질 게이트가 우선함을 명시
- Contract V3 repair prompt도 동일 계약으로 교체

### 2. Composer 입력의 Section 순서 메타데이터 누락

프롬프트는 `sortOrder`와 고정 위치를 보존하도록 요구하지만, Planner Candidate Snapshot에는 해당 값이 없었다. 모델이 순서를 추측하거나 필수 Section 위치를 흔들 수 있는 구조였다.

개선:

- Section에 `sortOrder`, `fixedPosition`, `rankScore`, `matchedCapabilities` 전달
- Component Field에 `description`, `maxLength` 전달
- 모델이 콘텐츠 길이, 역할, 고정 위치, Layout Fit 근거를 함께 판단하도록 계약 보강

### 3. 이미지 요청의 `safeArea: "none"` 고정

Admin Prompt harness는 `left-copy`, `right-copy`, `center-copy` 안전영역을 지원하지만 Builder Asset Job은 항상 `none`을 전달했다. 따라서 copy-left Layout에서도 이미지 주 피사체가 텍스트와 충돌할 수 있었다.

개선:

- 선택된 Layout의 copy 위치인 `contentRegion`을 우선 사용
- copy 위치가 없으면 `mediaSafeSide`의 반대편을 DOM copy 안전영역으로 사용
- Section 배경 이미지 요청과 저장 Snapshot에 계산된 안전영역 전달
- Component 단일 이미지에는 기존 `none` 유지

### 4. 레거시 HTML/CSS 프롬프트의 출력 품질 기준 부족

기존 `promo_page_generation`은 1440px 데스크톱 우선 기준만 있고, 390px 모바일 재구성, 320px 최소 폭, 접근성, 긴 텍스트, 대비, overflow, 중복 카피, 이미지 제외 MVP, 반환 전 self-check가 없었다.

개선:

- 1440px Desktop과 390px Mobile을 별도 Composition으로 설계
- 320–1440px 수평 스크롤, clipping, overlap, off-canvas CTA 금지
- 사용자 텍스트 컨테이너 고정 높이 금지
- 의미 있는 landmark, 단일 `h1`, 순차 heading, `:focus-visible`, 44px touch target 적용
- 본문 4.5:1, 큰 텍스트와 UI 경계 3:1 대비 요구
- `prefers-reduced-motion` 대응
- 입력에 없는 claim, placeholder, generic filler, duplicate copy 금지
- MVP에서 이미지·미디어·CSS `url()`·`background-image`·외부 import·JavaScript 금지
- `qualityChecks`에 콘텐츠, 반응형, 접근성, 대비, overflow, legal, token, text-first 항목 요구

## 이번 구현

### Migration 075 품질 후보

`db/migrations/075_web_output_prompt_quality_pack.sql`은 기존 active/validated/draft 소스를 보존한 채 별도 lineage의 관리자 검토용 `draft` 4종을 생성한다.

| Prompt Type | 품질 후보 |
| --- | --- |
| `promo_overview_parser` | 사실 보존, 입력 언어, 카피 중복 방지, enum·field decision·신뢰 경계 |
| `promo_page_composer` | Contract V3 `contentItems`, 고유 반복 카피, Section 순서, Layout Rhythm, 반응형, anti-generic |
| `promo_composition_editor` | 최소 Operation, 콘텐츠·법적 Section 보존, 모바일 안전성, 정확한 summary/warnings |
| `promo_page_generation` | 반응형·접근성·토큰·텍스트 전용 MVP를 포함한 전체 본문 교체 |

후보는 원본의 provider, model, temperature, token limit, response format, 변수 계약을 유지한다. `source_prompt_template_id`와 History를 기록하며 같은 lineage가 이미 있으면 재생성하지 않는다.

### 런타임 계약 보강

- `api/_promo-registry-composition-candidates.js`: Section 순서·고정 위치·rank와 Field 설명·최대 길이를 Planner Snapshot에 추가
- `api/_promo-builder-assets.js`: 선택 Layout에 따라 Section 이미지 safe area를 계산
- `api/_prompt-execution-snapshot.js`: 운영 Active를 바꾸지 않고 `validated` 후보를 동일한 Runtime 조립·검증·Hash 경로로 평가할 수 있는 Snapshot 추가
- `api/_promo-page-generation-contract.js`: HTML/CSS 결과의 정확한 출력 Shape, 필수 카피·CTA URL, 텍스트 전용 정책, 반응형·접근성 self-check를 fail-closed로 검증
- `n8n/promo-ai-page-generator.workflow.json`: 하드코딩 Prompt/Model/온도 대신 `/api/prompts-render`의 Active Snapshot을 사용하고 정적 검증과 실제 1440px·390px Browser Gate를 통과한 결과만 Artifact API에 저장
- Prompt Runtime API는 `PROMPT_RUNTIME_SERVICE_TOKEN`으로 보호하고 캐시하지 않음
- Prompt 관리 조회·수정·Validate·Activate·Rollback API는 Admin Session으로 보호하고 캐시하지 않음
- n8n 생성 Webhook은 `PROMO_PAGE_GENERATION_WEBHOOK_TOKEN` 헤더 인증이 없으면 모델을 호출하지 않음
- 정적 품질 테스트: 새 Migration에 핵심 `QUALITY GATE`와 lifecycle 계약이 존재하는지 검증
- 단위 테스트: Candidate Snapshot 필드와 safe-area 매핑 검증

## 운영 적용 절차

1. Preview에 `PREVIEW_DATABASE_URL`을 주입하고 DB Backup/Restore Point를 생성한다.
2. 별도 승인한 Preview DB 지문을 `PROMPT_QUALITY_PREVIEW_FINGERPRINT`에 설정한다.
3. `pnpm prompt-quality:check`로 4개 Active Source, lifecycle index, 기존 후보 무결성을 확인한 뒤 Migration 075만 적용한다.
4. Admin Prompt 관리에서 다음 4개 `Web Output Quality` 후보를 확인한다.
5. 각 후보의 변수 계약, provider/model, response format, Prompt Layer를 Validate한다.
6. 대표 Fixture 결과를 기존 active 버전과 비교한다.
7. 통과한 후보만 Type별로 Activate한다. 기존 active 버전은 lifecycle 규칙에 따라 inactive로 보존한다.
8. 실행 로그에서 실제 `promptTemplateId`, `version`, `renderedPromptHash`가 활성화한 후보와 일치하는지 확인한다.

Preview/Production 배포 전에는 Web API와 n8n 양쪽에 동일한 32자 이상 `PROMPT_RUNTIME_SERVICE_TOKEN`을 설정한다. n8n에는 Prompt Render·Validator·Artifact API URL, Browser Gate 내부 URL, OpenAI Credential, 생성 Webhook Header Auth, Browser Gate 전용 Header Auth를 Credential Store 또는 External Secrets로 매핑하며 요청 Payload로 Model이나 Prompt URL을 받지 않는다. 호출 서비스는 생성 Webhook에 `x-promo-generation-token`을 전달해야 한다. 별도 `PROMO_PAGE_BROWSER_QUALITY_ATTESTATION_SECRET`은 Browser Service와 Artifact API만 공유하고 n8n에는 노출하지 않는다. 저장소의 Workflow JSON은 이 Credential 매핑 전 Import Template이므로 Preview 매핑 검증 전에는 활성화하지 않는다.

Prompt Admin은 32자 이상 `PROMO_ADMIN_SESSION_SECRET`과 `promo_admin_session` 쿠키를 발급하는 사내 IdP 연결이 선행되어야 한다. 설정 없이 배포하면 Prompt 관리 API는 의도적으로 403으로 차단된다. 로컬 Prompt Runtime 우회가 꼭 필요한 경우에만 `PROMPT_RUNTIME_LOCAL_ACCESS_ENABLED=true`를 명시한다.

Migration 적용만으로는 운영 출력이 달라지지 않는다. Admin Activate 전에는 현재 active 프롬프트가 계속 사용된다.

권장 Fixture:

- 짧은 한국어 프로모션
- 긴 제목·약관·CTA를 가진 프로모션
- 텍스트 전용 MVP
- 영어 입력과 locale/market이 다른 사례
- 입력 값 안에 지시문이 포함된 prompt injection 사례
- 반복 카드가 3개 이상인 고밀도 페이지

각 Fixture는 최소 1440px과 390px에서 콘텐츠 정확도, 중복, overflow, clipping, CTA 가시성, Section rhythm, heading, legal visibility를 비교해야 한다.

## 검증 기준

- Composer의 모든 Component가 `contentItems`를 가지며 반복 항목의 카피가 서로 다르다.
- Section의 `sortOrder`와 `fixedPosition`이 모델 입력부터 Compiler 출력까지 보존된다.
- 선택 Layout의 copy 위치가 Section 이미지 safe area에 반영된다.
- 레거시 HTML/CSS 출력은 1440px과 390px 모두에서 수평 overflow와 텍스트 clipping이 없다.
- 페이지에는 `h1`이 하나만 있고, CTA focus와 touch target이 확인된다.
- 입력에 없는 금액·날짜·조건·보장 표현이 생성되지 않는다.
- 필수 약관과 법적 문구가 축약·누락되지 않는다.
- 품질 후보가 `draft` 상태로 생성되고 Validate 전에는 Activate할 수 없다.

## 남은 고우선 과제

1. 페이지 단위 `artDirection` 계약을 추가해 모든 Section과 이미지가 concept, density, palette 역할, 조명, 배경 복잡도, crop 전략을 공유하게 한다.
2. 구현된 1440px/390px Browser Gate를 내부 Container에 배포하고, 실패 진단을 다음 Model 호출의 제한된 Repair Prompt로 연결한다.
3. 현재 빈 배열로 전달되는 `productCatalog`와 Overview 콘텐츠 계약을 확장해 proof point, benefit, offer mechanics, terms/FAQ 근거를 Composer에 제공한다.
4. 동일 Fixture를 Active/Validated 후보에 실행하는 Preview 전용 A/B Runner와 repair-rate·fact-fidelity 비교 리포트를 추가한다.

프롬프트 정적 품질 게이트는 필수지만 충분조건은 아니다. 다음 품질 단계는 대표 Fixture를 실제 Renderer로 1440px·390px에 렌더하고 결과를 자동 판정하는 것이다.

# Nano Banana Pro 이미지 모델 적용

작성: 2026-11-25 · 상태: 적용 SQL 준비·로컬87개 회귀 통과 · 운영 직접 적용 미완료

후속 사용자 배포 요청으로 이 적용 자료와103 SQL·회귀 검사를 Production 대상 main에 반영한다. 소스 반영과 실제 Vercel Ready·운영 Pro 활성화는 구분한다.

사용자 결정에 따라 V3의 키비주얼·섹션 배경·컴포넌트 이미지를 Nano Banana Pro로 생성하도록 두 공통 이미지 프롬프트의 모델 설정을 준비했다.

| 대상 | 모델 설정 |
| --- | --- |
|8단계 섹션 키비주얼 생성 `section_background_image` | `google / gemini-3-pro-image` |
|9단계 컴포넌트 이미지 생성 `component_image` | `google / gemini-3-pro-image` |

두 프롬프트를 사용하는 새 이미지 생성에 적용된다. 완료 이미지와 기존 문서를 자동 재생성하거나6단계 영역 디자인의 텍스트 모델을 변경하지 않는다. V1/V2 전용 LO-FI·최종 디자인 프롬프트는 이번 범위에 포함하지 않는다.

## 운영 적용

현재 클라우드는 운영 Admin API가 네트워크 프록시403으로 차단되며 운영 DB 연결도 없다. API를 우회하거나 비밀 값을 문서/채팅에 기록하지 않았다. **이 파일이나 소스 배포만으로 운영 모델이 변경되지는 않는다.**

1. 운영 LLM 모델 관리에서 `google / gemini-3-pro-image`가 활성·이미지 유형·응답 형식 image이며 지원 해상도가 등록돼 있는지 확인한다.
2. 운영 Vercel 환경에 `GEMINI_API_KEY` 또는 `GOOGLE_API_KEY`가 설정돼 있어야 한다. 비밀 값은 채팅에 보내지 않는다. 환경변수를 변경한 경우 그 값을 사용하는 새 배포가 필요하다.
3. [103 SQL](../../../db/migrations/103_nano_banana_pro_image_prompts.sql) 전체를 운영 Neon SQL Editor에서 실행한다. 새 스키마가 아닌 두 프롬프트의 Draft 데이터 업데이트다.
4. Admin 프롬프트 관리 → 프로모션 이미지에서 해당 두 Draft를 **조립 검증**한다. 기존 배포 정책에 따라 먼저 Preview/테스트 환경에서 실제 이미지 생성과 저장/표시를 확인한 뒤 운영에서 **활성화**한다. 서로 다른 검증 완료 후보가 이미 있으면 SQL은 전체 복원하므로 그 후보를 먼저 Admin에서 처리한다. SQL은 기존 활성 버전을 직접 수정하지 않는다.
5. 새 테스트 문서에서 두 이미지 용도의 실제 생성·표시·전체 화면 품질검사와 작업 로그의 모델을 확인한다. 실제 생성은 공급자 비용이 발생한다. 운영 전환은 진행 작업의 설정 고정과 완료 결과 보존을 고려해 수행한다.

SQL 대신 기존 Admin에서 두 프롬프트의 새 Draft를 만들고 Google/Nano Banana Pro를 직접 선택해도 된다. 이때 모델 프리셋이 재설정하는 이미지 해상도·정책/스킬/본문을 비교하고 검증 후 활성화한다.

## 보존과 오류 처리

- 본문·변수·promptLayers·skillBindings·harnessConfig·runtimeConfig·safetyContract·이미지 생성/렌더/검증 정책을 보존한다.
- 명시된1K/2K/4K를 유지한다. 명시 해상도가 없으면 Pro 등록 설정의2K를 사용한다. V3는 generationPolicy, V2는 imageSize 설정을 사용한다.
- 공급자·모델·응답 형식과 모델 capability snapshot을 Pro에 맞춘다. OpenAI 전용 size/quality/outputFormat/background/reasoning 필드는 제거하며 generationPolicy.quality는 보존한다.
- 이미지용 temperature/maxTokens는 대상 등록 모델의 기본값을 사용한다. 기존 실행 시간·재시도·크롭·비율·MIME·해상도 검증을 끄지 않는다.
- 동일 설정 재실행은 무변경이다. 이미 활성화된 Pro 설정과 그 계보의 별도 미래 후보는 보존한다.
- 비활성/누락 Pro·잘못된 모델 유형/형식·누락된 활성 프롬프트·V1 설정·지원하지 않는 해상도·다른 검증 완료 후보가 있으면 전체 트랜잭션을 복원한다.
- Pro 활성화 전에는 원래 활성 모델이 계속 사용된다. 악화 시 기존 모델 설정으로 새 버전을 검증·활성화하며 이미 만든 이미지는 보존한다.

## 검증 범위

`scripts/test-nano-banana-pro-rollout.mjs`는 실제 PostgreSQL 호환 저장소의010/011/033/073/091/097 스키마로103을 실행한다. V2/V3·기존 활성/본문/스킬/정책 보존·재실행·다른 Draft/검증 후보·실제 Admin 검증/활성화·실패 전체 복원을 확인한다. 실제 prompt snapshot과 Gemini HTTP 요청 조립까지 검사하며 **로컬 Admin 인증과 외부 HTTP는 대역**이다. 실제 Google 이미지 품질·사용 가능 계정/키·비용·운영 DB 적용을 검증한 것은 아니다.

6단계 `promo_page_section_designer`의 OpenAI 결제 한도 문제는 별도 운영 복구가 필요하다. 이미지 모델 전환만으로 전체 생성 여정의 해당 실패가 해소되지는 않는다.

최종 회귀: 기존86개와 신규 Pro 전환 검사를 합한87개 계약·브라우저·PGlite 검사 통과(`/tmp/nano-banana-pro-full-qa.log`). SQL/테스트 구문·공백 검사도 통과했다. 운영 SQL 실행·활성화·실제 Google 이미지 생성·배포는 미실행이다.

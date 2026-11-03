# 디자인 생성 진행 과정 노출 방식 검토 (Progress UX)

- 작성일: 2026-07-14
- 상태: 소스 검토 결과 / 소스코드 미반영
- 질문: LLM 디자인 생성이 "요청→처리→결과 짠" 방식인지, v0/Google AI Studio처럼 단계가 눈에 보이는 방식인지

## 결론

현재는 **"요청 → 처리 → 결과 짠" 방식**에 가깝다. 사용자에게는 단일 인디터미네이트 로딩 스피너만 보이고, 완료되면 결과가 한 번에 나타난다.

다만 백엔드 내부에는 이미 다단계 체인이 존재하고(예: 브리프 생성 후 이미지 생성), 향후 계획된 Vue 웹페이지 자동 생성 파이프라인은 `queued → planning → generating_assets → generating_code → building → validating → ready`라는 명시적 단계 상태 모델까지 설계되어 있다. 즉 v0/AI Studio식 단계별 UI로 확장할 수 있는 **기반은 이미 있다**. 부족한 건 백엔드 단계가 아니라 **"그 단계를 사용자에게 보여주는 프론트 UI"**다.

## 근거

1. `prototype/index.html` (L493~502): 로딩 문구가 "AI가 요청 사항을 접수 중입니다" / "실제 진행률 대신 작업 중 상태를 표시합니다" / "생성 중..." — 진행률이나 단계가 아니라 단일 대기 상태만 표시한다.
2. `n8n/Promo Lo-Fi Draft Worker.admin-driven.json`, `n8n/Promo Final Design Worker.provider-routed.json`: 이미지 생성 API를 1회 호출하는 단일 스텝 워크플로우다. Final Design은 OpenAI/Gemini 중 provider 라우팅만 있을 뿐 체인은 아니다.
3. `n8n/promo-ui-design-image-generator.workflow.json`: 이 워크플로우는 다르다. LLM이 먼저 `Integrated Design Brief`를 생성한 뒤(`LLM Generate Integrated Design Brief`), 그 결과로 이미지 프롬프트를 구성해(`Build Image Prompt From Integrated Brief`) 이미지를 생성(`Generate UI Design Image`)하는 **2단계 체인**이다. 하지만 이 중간 산출물(브리프)은 현재 프론트에 노출되지 않고 최종 이미지만 반환된다.
4. `docs/final-design-vue-webpage-generation-development-plan-2026-07-14.md` 11절: `queued → planning → generating_assets → generating_code → building → validating → ready` 상태 모델이 이미 설계돼 있다. v0가 보여주는 "파일 생성 중 / 빌드 중 / 검증 중" 같은 단계별 UI에 그대로 대응 가능한 구조다. 다만 이 계획은 아직 소스에 반영되지 않았다(웹페이지 생성 기능 자체가 미구현 상태).

## 발표/데모 관점 제안

- 지금 그대로 데모하면 "AI가 뭘 하는지 안 보이는 블랙박스"처럼 보일 위험이 있다.
- Zero-Click 내러티브와 직접 연결된다: 사람의 승인 클릭을 줄이려면(Level 2/3) 오히려 그 과정이 투명하게 보여야 신뢰를 얻기 쉽다. "안 보이는 자동화"보다 "보이는데 사람 개입이 필요 없는 자동화"가 설득력 있다.
- 이미 존재하는 백엔드 단계(브리프 생성 → 이미지 생성, 또는 향후 계획된 `queued → ... → ready`)를 프론트에 스텝 리스트/타임라인 UI로 노출하는 것을 데모 전 검토 작업으로 제안한다.

## 다음 단계 (요청 시 진행)

1. 기존 단일 로딩 스피너를 스텝 리스트 UI로 교체 — 이미 존재하는 "브리프 생성 → 이미지 생성" 단계부터 우선 적용 가능.
2. 웹페이지 생성(Vue) 기능 구현 시 처음부터 단계별 상태를 프론트에 노출하도록 설계에 반영.
3. n8n 콜백 payload에 현재 단계명을 포함시켜, 기존 5초 폴링 응답에서 바로 단계 텍스트를 꺼내 쓸 수 있게 함(신규 API 불필요).

# 종합 검토 리포트: 소스코드 + n8n 워크플로우 + 문서 (2026-07-12)

Reviewer: Claude
Date: 2026-07-12
검토 범위: `api/` 폴더 전체(40개 파일), Cloud n8n 3단계 Worker 워크플로우 3개, `docs/` 폴더 handoff 문서(특히 `handoff-2026-07-12.md`)

## 결론

**LO-FI ↔ Final Design 레이아웃 불일치 문제(이 프로젝트의 핵심 이슈)는 애플리케이션 레이어·n8n 워크플로우·운영 검증까지 3중으로 확인되어 실질적으로 해결됨.** `api/` 소스코드는 이미 `final_design` prompt type, execution snapshot 검증, confirmed LO-FI 이미지 전달 구조를 갖추고 있었고, n8n의 `Promo Final Design Worker`가 2026-07-12에 이를 반영해 `images/edits` + LO-FI 참조 구조로 전환됐으며, 운영 실행 `1181`로 성공이 검증됐다. 다만 **다음 3가지는 여전히 조치가 필요**하다: (1) API 키가 3개 n8n 워크플로우 모두 평문 유지(사용자가 인지하고 수용한 리스크), (2) Admin Page의 `input_fidelity` 설정이 실제로는 반영되지 않는 키 이름 불일치 버그, (3) 이미지 프록시 엔드포인트와 SSRF 검증 누락 2건(보안). 또한 오늘자 handoff 문서의 "GitHub push 실패로 서버 수정 미배포" 서술과 로컬 git 상태(커밋 존재, working tree clean)가 어긋나 실제 배포 여부 재확인이 필요하다.

## 이슈사항 (우선순위 순)

### 1. (해결됨) LO-FI → Final Design 레이아웃 보존
- `api/promo-generation-final-designs.js`가 confirmed draft의 이미지 URL·prompt·정책을 조회해 worker payload에 포함하는 구조를 이미 갖추고 있었음.
- n8n `Promo Final Design Worker`(`qGi72lZxFCipYGld`)가 2026-07-12 `Download Confirmed LO-FI Image` → `images/edits`(multipart, `input_fidelity=high`) 구조로 전환.
- 운영 실행 `1181` 성공, DB에 `ready`/`final_design_ready`/`referenceMode=image_edit` 확인됨(`handoff-2026-07-12.md`).
- 시각 비교 결과 상단 메뉴, 히어로 위치, 카드 배열, CTA 위치, 푸터 등 레이아웃 요소가 보존되고 스타일(색상/타이포)만 바뀜 — 목표 동작에 부합.

### 2. (신규 발견, 실사용 중 발생) Final prompt 32,000자 제한 초과
- 실사용 콘텐츠에서 Final prompt가 39,675자까지 늘어나 OpenAI `images/edits`가 `string too long` 오류 반환.
- n8n 측: prompt 입력을 30,000자로 강제 절단하는 즉석 hotfix 적용, 재실행(`1185`) 성공.
- 서버 측: `api/_final-design-prompt-budget.js`(신규 파일, 커밋 `c07ed07`)로 정식 대응 — 앞 72%/뒤 28% 핵심 문맥 보존 압축. **코드 확인 결과 `_prompt-execution-snapshot.js`가 `final_design` 타입에만 이 로직을 적용하도록 정확히 연동되어 있음.**

### 3. (확인 필요) 문서-실제 배포 상태 불일치
- `handoff-2026-07-12.md`는 "로컬 GitHub 인증 실패로 커밋 `c07ed07` push 실패, Vercel 미배포"라고 기록.
- 그러나 연결된 저장소에서 `git log`/`git status` 확인 결과 해당 커밋이 이미 존재하고 `working tree clean`, `up to date with origin/main`으로 표시됨.
- Claude가 볼 수 있는 것은 로컬 git 상태뿐이라 실제 GitHub 원격·Vercel 배포 여부는 별도 확인 필요. **운영에 서버 측 prompt 길이 가드가 실제로 배포됐는지 재확인 권장.**

### 4. (미해결, P0) API 키 평문 유지
- Integrated Brief Worker, Lo-Fi Draft Worker, Final Design Worker 3개 모두 OpenAI 키가 워크플로우 노드에 평문으로 남아있음.
- `handoff-2026-07-12.md`에 따르면 이는 방치가 아니라 **사용자가 "Credential 등록 오류로 인해 현재 상태 유지"를 명시적으로 결정**한 사항. 위험 자체는 여전히 유효(n8n export/MCP 조회 시 노출 가능)하므로 Credential 등록 문제 해결 시 재검토 권장.

### 5. (미해결) `input_fidelity` 설정 키 불일치
- `api/_prompt-template-store.js`는 `inputFidelity`(camelCase)로 저장.
- n8n `Generate Final Design Image` 노드는 `modelOptions.input_fidelity`(snake_case)를 읽음.
- 현재 기본값이 둘 다 "high"라 겉으로 문제가 안 보이지만, Admin Page에서 이 값을 변경해도 **조용히 무시되고 항상 "high"로 호출됨.**
- 제안: 저장 쪽 키를 `input_fidelity`로 통일하거나 n8n에서 `modelOptions.inputFidelity`를 읽도록 수정.

### 6. (보안, 미해결) SSRF 검증 누락 2건
- `api/generate-promo-page.js`, `api/analyze-design-md.js`는 `x-n8n-webhook-url` 계열 헤더를 검증 없이 그대로 `fetch()`에 전달 — 프로덕션에서 임의 URL로 서버측 요청 가능.
- 동일 패턴을 쓰는 `generate-ui-design.js`/`_promo-generation-worker-trigger.js`는 이미 `isProductionRuntime()` + `workerHostAllowed()` 검증을 갖추고 있어 동일 패턴 적용 권장.

### 7. (보안, 미해결) 이미지 프록시 무인증
- `promo-generation-lofi-draft-image.js`, `promo-generation-final-design-image.js`, `promo-design-image.js`는 UUID만 알면 인증 없이 private Blob 이미지에 접근 가능.
- n8n Final Design Worker가 호출하는 `draftImageProxyUrl`도 이 무인증 URL이라 외부 인프라(n8n Cloud)에 URL이 남으면 접근 범위가 넓어짐.
- 제안: run 소유권 검증 추가 또는 단기 만료 서명 URL 방식 검토.

### 8. (일관성) 에러 핸들링이 워크플로우마다 다름
- Final Design Worker는 `retryOnFail`/`onError`/실패 callback을 갖췄으나, Integrated Brief Worker와 Lo-Fi Draft Worker의 OpenAI 호출 노드는 재시도/실패 처리가 없어 실패 시 run이 영구히 "queued/generating"에 멈출 수 있음.
- `handoff-2026-07-12.md`는 Integrated Brief/Lo-Fi Worker에도 "일반 실패 처리와 최소 1회 재시도 구조를 반영했다"고 적었으나, 이는 백업/점검 단계 서술이라 **운영 워크플로우 반영 여부는 재확인이 필요**(문서 2.1항의 "주의: 오늘의 주된 운영 전환 대상은 Final Worker"라는 문구 참고).

### 9. (사소함) 코드 정리 대상
- `_promo-markdown-builders.js`의 `LOG_VALUE_TRANSLATIONS`에 mojibake(인코딩 깨짐) 중복 키 존재 — 죽은 코드, 실질 영향 없음.
- Lo-Fi Draft Worker의 `Check Image Base64` 노드에 남아있던 빈 assignment는 `232ce3a` 커밋으로 이미 정리됨(해결).
- 레거시(`promo_design_runs`)와 신규(`promo_generation_runs`) 파이프라인이 공존 — README/handoff에 "레거시 vs 신규" 명확한 안내 필요.

## 간략한 내용 (영역별 요약)

**소스코드(`api/`)**: 에러 처리(`try/catch` + `statusCode || 500`), 이미지 매직바이트 검증, prompt 버전관리/이력 저장이 전반적으로 일관되게 잘 구현됨. 지난 논의 문서들이 "미구현"이라 판단했던 `final_design` prompt type, execution snapshot, confirmed LO-FI 전달 구조는 실제로 이미 구현돼 있었음 — 병목은 앱이 아니라 n8n 쪽이었고, 이는 오늘 해소됨.

**n8n 워크플로우**: Final Design Worker만 2026-07-12 대폭 개선(레이아웃 fidelity, provider/model 실제 연동, 에러 핸들링). Integrated Brief Worker(최종 업데이트 07-08)와 Lo-Fi Draft Worker(로직 변경 없음, 07-11 갱신은 MCP 접근 활성화 때문)는 아직 하드코딩 키/모델과 재시도 부재 상태로 남아있을 가능성.

**문서(`handoff-2026-07-12.md`)**: 오늘 문서는 실행 ID(1179~1185), DB 검증값, 커밋 해시까지 구체적으로 기록되어 핸드오프 품질이 높음. 남은 작업(실사용 회귀검증, 브랜드 스타일 fidelity, 비용 모니터링, 백업 workflow 정리, QA label guard 실패 3건)도 우선순위별로 명확히 정리되어 있음.

## 다음 우선순위 제안

1. `git`/Vercel 배포 상태 재확인 (서버 측 prompt 길이 가드가 실제 운영에 반영됐는지)
2. `input_fidelity` 키 불일치 수정
3. Integrated Brief/Lo-Fi Draft Worker의 재시도·실패 처리를 운영 워크플로우에도 실제 적용 확인
4. SSRF 검증 2건(`generate-promo-page.js`, `analyze-design-md.js`) 및 이미지 프록시 접근 제어
5. API 키 Credential 등록 문제 해결 후 평문 키 → Credential 전환

## 참고 문서

- `docs/claude/review-api-folder-source-2026-07-12.md`
- `docs/claude/review-n8n-workflows-2026-07-12.md`
- `docs/claude/n8n-worker-remediation-plan-2026-07-11.md`
- `docs/handoff-2026-07-12.md`
- `docs/n8n-three-stage-worker-issue-resolution-plan-2026-07-11.md`

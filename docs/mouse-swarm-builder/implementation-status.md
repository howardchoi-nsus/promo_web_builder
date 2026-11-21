# 개발 반영 및 운영 준비 상태

2026-11-19 · 저장소 코드 반영 · 운영 배포 전

## 구현

- 요청 요약/페이지 제작의 2단계 화면과 동일 캔버스의 구성 승인·디자인 흐름.
- 원래 요청과 수정 요청의 공통 디자인 브리프, 등록 토큰의 호환 범위 안에서 요청에 맞는 후보 순위, 구조·영역·이미지·검토 단계 전달.
- 실제 저장 단위의 점진적 PageSchema 생성. 서버 초안/리스/순서/문서 Revision/채팅 전환을 보호하고 실패한 단계부터 재개한다. 완성 전에는 승인할 수 없다.
- 12개 시각 커서 풀, 실제 활성 노드의 50% 박스·핸들·텍스트 표시, 완료·오류·이동 피드백과 효과만 일시정지.
- 같은 PageSchema를 사용하는 에디터, 직접 편집·선택 범위 AI·Undo/Redo·충돌 초안 보존·보수적 병합. 저장 후 자동 QA, 구조 변경 시 재승인.
- 공통 노드 descriptor와 토큰 CSS로 생성하는 정적 HTML. 새 창·다운로드·공개 HTML에 연결하고 비공개 생성 이미지는 포함한다. 단일 HTML은 4 MiB 한도 초과를 명시적으로 거부한다.

## 검증 방법과 범위

`PGLITE_TEST_MODULE=/workspace/.token-test-tools/node_modules/@electric-sql/pglite/dist/index.js CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/check-design-preview.mjs`

검사에는 실제 PGlite SQL 저장/채팅 전환/재시도, Playwright 브라우저의 편집·누적 생성·승인 시점·커서 효과, 세 뷰포트의 정적 HTML과 런타임 DOM 치수/타이포/색상 일치가 포함된다. 모델과 미디어 응답은 준비된 테스트 데이터를 사용한다. 외부 LLM·운영 Neon·Blob·Vercel Preview 연결 검사는 별도이며 수행하지 않았다.

검증 결과: 전체 50개 계약·브라우저·PGlite 회귀검사 통과. Admin, Visual editor, Nuxt 빌드 통과. 문서 패키지 계약 검사도 통과했다. 개발 서버 에디터 검사 종료 시 ResizeObserver 경고가 기록됐으나 편집·충돌 보호 검사와 배포 빌드 브라우저 검사는 통과했다. 실제 운영 환경에서는 별도 확인이 필요하다.

## 운영 활성화 전

1. 기존 DB 상태를 확인하고 migration 094·095 적용.
2. 094의 비활성 스킬 4개와 기존 타입의 새 Draft 5종 검증·활성화. 스킬 연결 4개로 Draft 생성을 건너뛴 타입은 별도 충돌 검토.
3. 095의 `promo_page_outline_planner`, `promo_page_fragment_writer` 검증·활성화 후 `PAGE_SCHEMA_DRAFT_ENABLED=true`. 기본값은 false다.
4. 영역 디자인은 기존 migration 093·활성 프롬프트와 `PAGE_SCHEMA_SECTION_DESIGN_ENABLED` 확인. Blob·출력 기능·공개 URL 설정 확인.
5. 실제 Preview 여정 검증 후 Production 배포. 이 문서는 DB 적용·Admin 활성화·배포 완료를 의미하지 않는다.

외부 동영상·폰트까지 포함하는 완전한 오프라인 ZIP 패키지와 임의 HTML/스크립트 편집은 구현 범위에 포함하지 않는다. 모델이 받는 정보가 구조·측정값뿐인 경우 이미지 기반 시각 검사 완료로 기록하지 않는다.

## Production 코드 반영 요청

사용자가 미검증 범위와 운영 준비 조건 안내 후 배포를 요청했다. 이번 코드를 main에 반영하며, 실제 Vercel 배포 상태와 운영 DB·프롬프트 활성화는 확인한 결과만 별도로 보고한다. 누적 초안 기능은 기본 비활성으로 유지한다.

## 2026-11-20 Admin 실행 설정 저장 회귀 수정

`promo_page_section_designer requires an activated Execution Snapshot V2 or newer setting` 오류 원인은 Admin이 신규 프롬프트 타입을 실행 Harness 대상으로 분류하지 않아 읽을 때 분리한 Snapshot 설정을 저장할 때 복구하지 않은 것이다. 영역 디자인·누적 구조·문구 및 레이아웃 분석 타입의 Harness 표시/저장 분류를 보완하고 PageSchema 제한 시간 240000ms를 UI에서도 허용했다. 실제 저장 함수의 결과를 서버 검증기에 통과시키는 회귀검사, 기존 control-plane 및 프롬프트 Admin 계약 검사, Admin 빌드를 검증했다. 마이그레이션 재실행이나 서버 검증 완화는 필요하지 않다. 사용자 배포 요청에 따라 이 후속 수정도 Production 대상 main에 반영한다. 실제 Vercel Ready 및 운영 화면 적용 여부는 별도 확인 대상이다.

## 2026-11-21 누적 초안 응답 스키마 참조 수정

운영 오류 `Invalid schema for response_format page_draft_outline ... reference can only point to definitions defined at the top level`를 확인했다. 래퍼의 page 내부에 있던 `$defs`를 응답 스키마 최상위로 올리고 기존 `#/$defs/...` 참조를 유지했다. 서버의 일반 JSON Schema 검증은 중첩 경로도 허용했지만 모델 제공자의 Structured Outputs는 최상위 정의만 허용하는 차이가 원인이다. 최상위 참조·전체 참조 대상 해석·재귀 스키마 컴파일·소스 바인딩 거부 회귀검사를 추가했고, 실제 SQL 초안 저장/재시도/채팅 전환 및 기존 PageSchema API 검사를 통과했다. 실제 LLM 호출은 미검증이다. 사용자 배포 요청에 따라 이 후속 수정도 Production main에 반영하며 실제 Vercel Ready는 별도 확인 대상이다. DB migration·프롬프트 본문 변경은 필요하지 않다.

## 2026-11-21 기존 Draft Snapshot V1 재저장 경로 수정

같은 저장 오류 재발 보고 후, 조회 응답이 Snapshot V1을 명시하면 기존 UI가 기본값 V2보다 V1을 우선해 다시 저장하는 경로를 재현했다. 기존 타입 분류 수정만으로 이 경로는 막히지 않았다. 편집기 로드/저장 시 제어 대상은 최소 V2(이미지 V3), 상위 버전은 유지하도록 보완하고 Admin 엔트리 URL 버전을 갱신했다. 저장 옵션 누락/0/1/문자열1·정상2·상위3 회귀와 실제 브라우저에서 V1 조회→V2 표시/저장 검증, 기존 계약 2종 및 Admin 빌드가 통과했다. 서버의 저장·활성화 검증은 유지한다. 실제 운영 응답은 접근 제한으로 확인하지 못했다. 사용자 요청에 따라 후속 코드도 Production main에 반영하며 Vercel Ready는 별도 확인 대상이다. 기존 Draft의 버전이 1로 보이면 현재 화면에서 실행 Harness의 Snapshot 버전을 2로 변경해 저장할 수 있다. 마이그레이션 재실행은 필요하지 않다.

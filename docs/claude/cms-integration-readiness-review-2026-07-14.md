# WordPress / Directus 연동 준비 검토

- 작성일: 2026-07-14
- 상태: 아키텍처 검토 / 소스코드 미반영
- 참고 문서: `docs/product-direction-and-gap-review.md`, `docs/automated-vue-web-generation-process-recommendation-2026-07-14.md`, `docs/final-design-vue-webpage-generation-development-plan-2026-07-14.md`, `README.md`

## 결론

지금 상태로는 WordPress/Directus 어느 쪽과도 바로 연동할 수 없다. 연동의 전제 조건은 CMS 종류가 아니라 **"발행 가능한 표준 콘텐츠 계약(Publish Contract)"과 "발행 파이프라인(promo_publish_jobs)"이 먼저 존재하는 것**이다. 이 두 가지가 없으면 WordPress든 Directus든 붙일 대상이 없다.

두 후보를 비교하면 **Directus가 구조적으로 더 적합**하다. 헤드리스이고 스키마를 자유롭게 정의할 수 있어, 최근 결정된 "Vue 코드 + 실제 DOM 콘텐츠" 방향(2026-07-14 권고안)과 자연스럽게 맞물린다. WordPress를 선택할 경우 반드시 **headless 모드**(REST API를 콘텐츠 저장소로만 사용하고 렌더링은 별도 Vue 빌드가 담당)로 가야 한다. 생성된 Vue 산출물을 WP 클래식 테마/블록 에디터에 shortcode나 iframe으로 끼워 넣는 방식은 유지보수 비용이 크므로 지양한다.

준비 우선순위는 다음과 같다.

```text
1. Publish Contract 스키마 표준화
2. promo_publish_jobs 테이블 및 발행 파이프라인 구현
3. 자산(이미지) 동기화 전략
4. 인증/환경(스테이징-프로덕션) 분리
5. 플랫폼별 렌더링 전략 확정 (Directus 우선 PoC 권장)
```

## 핵심 이슈

1. **콘텐츠가 3곳에 분산되어 있다.** `wizard_content_sections`/`section_inputs`(원문 콘텐츠), `design_documents`/`design_token_sets`(디자인 토큰), `promo_generation_web_pages`(Vue 산출물)로 나뉘어 있고, 이를 하나의 CMS 아이템으로 묶어줄 표준 payload 스키마가 없다.
2. **이미지 자산 이관 전략이 없다.** 현재 모든 자산은 Vercel Blob URL 기준이며, WP media library나 Directus files 컬렉션으로 넘기는 방식과 중복 업로드 방지(checksum 매핑)가 정의되어 있지 않다.
3. **발행(publish) 자체가 아직 없다.** `product-direction-and-gap-review.md`에서도 `promo_publish_jobs`는 "검토 후보" 단계이며 실제 구현은 시작되지 않았다. CMS 연동보다 이 파이프라인이 먼저다.
4. **컴플라이언스 필드의 연계가 불명확하다.** 약관/Responsible Gaming/Bonus Code/Q-TAG 등은 구조화 데이터로 존재하지만, Rule Base 검증 결과를 CMS 필드/발행 게이트에 어떻게 반영할지 정의되어 있지 않다.
5. **WordPress를 쓸 경우 렌더링 방식 결정이 선행되어야 한다.** headless로 갈지, 클래식 테마에 결과물을 넣을지에 따라 연동 난이도가 크게 달라진다. 최근 Vue 웹페이지 생성 권고안(실제 DOM 콘텐츠 + 실제 이미지 에셋 분리)과 정합성을 맞추려면 headless가 사실상 유일한 선택지다.
6. **인증/환경 분리가 없다.** WP는 Application Password/JWT, Directus는 static/service token 방식이며, 스테이징/프로덕션 대상 URL과 자격증명을 관리할 설정 저장소가 없다(`_worker-webhook-settings-store.js`와 유사한 패턴 필요).
7. **동기화 방향이 결정되지 않았다.** CMS 쪽에서 직접 편집을 허용할지(양방향) 여부에 따라 충돌 처리 정책이 달라진다. 초기에는 Builder → CMS 단방향 push만 권장한다.

## 간략 내용

### A. Publish Contract (발행 콘텐츠 계약)

기존 `wizard_content_section_items`의 `field_kind`(text/image/cta) 구조를 그대로 재사용해 도출 가능하다. 최소 아래 필드를 표준화한다.

- `title`, `heroBanner`(title/description/image/cta)
- `stepBar`, `contentCta`, `imageTextRow[]`
- `terms`, `complianceFlags`(bonusCode/affiliate/qTag/responsibleGaming)
- `market`/`region`
- `seo`(title/description/ogImage)
- `status`(draft/scheduled/published), `version`

### B. 발행 파이프라인

```sql
create table promo_publish_jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references promo_generation_runs(id),
  web_page_id uuid references promo_generation_web_pages(id),
  target_platform text not null,        -- 'wordpress' | 'directus'
  target_env text not null default 'staging',
  external_id text,
  external_url text,
  payload_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  error_message text not null default '',
  published_at timestamptz,
  created_at timestamptz not null default now()
);
```

기존 `_promo-generation-worker-trigger.js` 패턴을 재사용해 `publish` stage를 추가하고, `run_id + target_platform` 기준 idempotent 재발행을 지원한다.

### C. 자산 동기화

- WP: `POST /wp/v2/media`
- Directus: `POST /files`
- 원본 `asset_url`/`checksum` ↔ CMS 측 media id 매핑을 별도로 저장해 재발행 시 중복 업로드를 막는다.

### D. 플랫폼별 렌더링 전략

- **Directus (권장 우선 PoC)**: 구조화 콘텐츠와 파일만 저장하고, 렌더링은 기존/별도 Vue 프론트가 Directus REST/GraphQL API를 호출해 수행한다. 이번 프로젝트가 지향하는 "Vue 코드 + 실제 DOM 콘텐츠" 방향과 그대로 맞물린다.
- **WordPress**: headless 모드로 한정한다. WP REST API(또는 커스텀 엔드포인트)는 콘텐츠 저장소 역할만 하고, 실제 페이지는 별도로 배포된 Vue 정적 빌드가 렌더링한다.

### E. 인증/환경

target별 서비스 계정, 토큰, base URL을 `worker_webhook_settings`와 같은 패턴(`cms_publish_settings` 등)으로 관리하고 스테이징/프로덕션을 분리한다.

### F. 컴플라이언스 연계

Rule Base 검증 결과(약관/Responsible Gaming/Bonus Code/Q-TAG)를 발행 payload의 `complianceFlags`로 강제 포함시키고, 검증 미통과 시 발행 버튼을 비활성화한다.

## 권장 착수 순서

```text
Phase 1. Publish Contract 스키마 확정 및 문서화
Phase 2. promo_publish_jobs 테이블 + 발행 API/worker 골격 구현 (대상 CMS 미정 상태로도 내부 완료까지 가능)
Phase 3. Directus 대상 PoC 연동 (스키마 자유도가 높아 우선순위 1순위)
Phase 4. WordPress headless 구성 확정 후 착수
Phase 5. 자산 동기화 + 재발행 idempotency 검증
Phase 6. 인증/환경 분리, 컴플라이언스 게이트 연결
```

상세 내용(예: Directus 컬렉션 스키마 초안, WP 커스텀 포스트 타입/ACF 필드 초안, publish worker payload 계약 등)이 필요하면 요청 바랍니다.

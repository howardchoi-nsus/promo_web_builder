# Promo Web Builder 개발 진행 보고서

## 1. 보고 개요

| 항목 | 내용 |
|---|---|
| 보고 기간 | 2026년 6월 8일 ~ 2026년 8월 21일 |
| 작성 기준일 | 2026년 8월 21일 |
| 대상 프로젝트 | Promo Web Builder |
| 보고 목적 | 기간 내 개발 진행 내용, 주요 성과, 품질 확보 현황 및 후속 과제 보고 |
| 근거 자료 | Git 커밋 이력, Handoff, 개발계획서, QA 문서, 자동 테스트 및 Production Build 결과 |

> Git 저장소에서 확인되는 최초 커밋은 2026년 6월 25일이다. 따라서 6월 8일~24일은 이 저장소 기준으로 확인 가능한 개발 이력이 없으며, 본 보고서의 실질 개발 내역은 6월 25일부터 정리했다.

---

## 2. Executive Summary

보고 기간 동안 Promo Web Builder는 초기 UI 디자인 이미지 생성 POC에서 다음 기능을 갖춘 AI 프로모션 제작 플랫폼으로 확장됐다.

1. 자연어 요구사항을 구조화하고 승인된 Registry 안에서 페이지 구성을 결정하는 AI Composition Engine
2. Template, Section, Component, Layout Preset, Design Token을 관리하는 운영자 제어 체계
3. Builder와 관리자 설정이 함께 사용하는 공통 Visual Editor 및 Layout Engine
4. AI 이미지 생성, 상태 추적, 재시도, 자산 저장 및 Web Output 연계
5. Prompt 외부화·버전 관리·변수 검증·Provider 설정을 포함한 AI Control Plane
6. Desktop/Mobile 렌더 결과를 자동 검사하고 깨진 결과의 저장을 막는 Preview Quality Gate

특히 7월에는 POC 구조를 제품형 아키텍처로 전환하는 작업이 집중됐고, 8월에는 Registry Composition Contract v3, 편집 UX, 자산 완료 Gate, 반응형 품질 검증을 중심으로 안정화했다.

현재 최신 개발분은 Production Build와 전체 137개 자동 테스트를 통과했다. 다만 8월 21일 품질 게이트 및 디버깅 보정분은 아직 배포하지 않은 상태다.

---

## 3. 정량 진행 현황

### 3.1 Git 활동

| 지표 | 결과 |
|---|---:|
| 전체 커밋 | 599개 |
| Merge 제외 커밋 | 593개 |
| 실제 커밋 활동일 | 51일 |
| 6월 커밋 | 85개 |
| 7월 커밋 | 426개 |
| 8월 1일~21일 커밋 | 88개 |

초기 저장소 반입 과정에 `node_modules`와 생성물이 포함됐던 시기가 있어 단순 추가·삭제 라인 수는 실제 개발량을 과대 표현할 수 있다. 따라서 본 보고서는 커밋 수, 활동일, 기능 단위 산출물과 테스트 증가량을 핵심 정량 지표로 사용했다.

### 3.2 현재 프로젝트 규모

| 항목 | 2026-08-21 기준 |
|---|---:|
| 자동 테스트 파일 | 137개 |
| API JavaScript 모듈 | 185개 |
| Visual Editor 소스 파일 | 69개 |
| SQL Migration·Seed 파일 | 76개 |
| 프로젝트 문서 | 345개 |

### 3.3 테스트 체계 성장

| 시점 | 자동 테스트 파일 수 | 주요 의미 |
|---|---:|---|
| 최초 저장소 구성 | 0개 | POC 중심 단계 |
| 7월 24일 | 55개 | 공통 Editor·Layout·Prompt 계약 테스트 구축 |
| 7월 27일 보고 | 66개 통과 | 컴포넌트·AI 이미지·Token·배포 안정화 |
| 8월 6일 | 117개 | Contract v3·Registry·Export·Preset 검증 확대 |
| 8월 21일 | 137개 전체 통과 | AI Builder, 품질 게이트, Browser E2E 포함 |

---

## 4. 기간별 주요 진행 내용

## 4.1 6월 25일~6월 30일: POC 구축 및 디자인 생성 흐름 정립

### 주요 개발

- Design MD를 디자인 스타일 콘셉트별로 분류하고 선택하는 A영역 구축
- 프로모션 요구사항과 Template 4 구조를 입력하는 B영역 구축
- 생성 결과 이미지와 Markdown 산출물을 조회하는 C영역 구축
- `간편 브리프 → AI 섹션 초안 → 색상·폰트 설정 → UI 디자인 이미지 생성` 흐름 구현
- Hero, Step Bar, CTA, Image/Text Row, Terms/Footer 기준의 프로모션 입력 구조 반영
- n8n UI 디자인 이미지 생성 Workflow와 Webhook 연동
- Design Prompt MD, Section Input Log MD, Integrated Design Brief MD 생성 구조 설계
- Vercel Blob을 이용한 이미지·Markdown 자산 저장 API 구축
- 생성 결과 조회, 과거 결과 fallback, 절대 이미지 URL 및 직접 열기 기능 보완
- Admin/Web Builder형 UI 톤앤매너 및 1440×900 기준 3단 패널 QA

### 주요 성과

- 단순 페이지 생성이 아니라 디자인 문서와 프로모션 요구사항을 결합하는 제작 흐름을 확립했다.
- 생성 이미지뿐 아니라 생성 근거 Markdown을 함께 저장·조회하도록 해 추적 가능성을 확보했다.
- Private Blob, API 허용 타입, Production Branch 불일치 등 초기 운영 문제를 실제 배포 환경에서 분석·보정했다.

---

## 4.2 7월 1일~7월 9일: AI Worker 서버화 및 Prompt·검증 체계 강화

### 주요 개발

- n8n을 Workflow Harness로 한정하고 다음 책임을 Web/API로 이전
  - Prompt 준비 및 Rendering
  - LLM 응답 Parsing
  - Schema·길이·필수 Section Validation
  - 결과 정규화 및 DB 저장
- Integrated Brief, LO-FI Draft, Final Design의 단계별 Worker 흐름 구성
- OpenAI/Gemini Provider Routing과 모델 옵션 정규화
- Prompt 파일 외부화 및 Admin Prompt 관리 기반 구축
- 생성 실패, 길이 초과, 문법 오류, 누락 Section에 대한 방어 로직 추가
- 디자인 생성 원인 추적, Timestamp, Markdown 다운로드 및 결과 조회 UX 보강
- Label Guard와 계약 테스트 도입

### 주요 성과

- n8n JSON 내부의 복잡한 비즈니스 로직을 서버 모듈로 옮겨 유지보수성과 테스트 가능성을 높였다.
- AI 응답을 그대로 사용하지 않고 서버 검증을 통과한 결과만 저장하는 기본 원칙을 수립했다.
- Prompt와 Provider 설정을 코드 하드코딩에서 운영자 관리 대상으로 전환하기 시작했다.

---

## 4.3 7월 10일~7월 17일: 독립 Promo Wizard·관리자 기능·Visual Editor 기반 구축

### 주요 개발

- 독립형 Promo Wizard 경로와 4단계 제작 흐름 구축
- 프로모션 콘셉트 Carousel, Dark UI, 단계별 입력·검증 UX 개선
- 관리자 LLM 설정을 Worker 실행에 적용
- Prompt 관리 페이지 및 설정 구조 확장
- Template, Section, Item 관리 화면과 CRUD 흐름 정비
- Item Key 자동 생성, Section 순서 변경, Accordion 편집 적용
- Template 기본 Layout과 Wizard 편집 데이터 연동
- Visual Template Editor 및 Visual Editor P1 기반 구현
- LO-FI/Final Design Provider 설정과 Prompt 길이 Guard 강화

### 주요 성과

- 기존 단일 Prototype 화면에서 Wizard, Admin, Visual Editor로 역할이 분리된 제품 구조로 발전했다.
- 관리자 설정과 실제 AI 실행 간 연결을 확보해 운영자가 모델·프롬프트 정책을 통제할 수 있는 기반을 마련했다.
- Template과 Section을 데이터 기반으로 관리하고 편집하는 구조를 구축했다.

---

## 4.4 7월 18일~7월 27일: 공통 편집 플랫폼·컴포넌트 모델·디자인 시스템 전환

### 주요 개발

- 재사용 가능한 Component와 Component Instance 기반 Section 구성 모델 도입
- Template Layout과 Promotion Builder가 공통으로 사용하는 Editor Core 구축
  - Command/History
  - Snapshot Contract
  - Resize Geometry
  - Host Adapter
  - Preview Control
- Text, Image, CTA의 선택·이동·Resize 및 Section 높이 편집 개선
- Section 배경 이미지와 Component 이미지를 분리하고 정렬·Cover/Contain·Fade 제어 추가
- 자연어 Section 구성과 다중 Component 안전 배치·충돌 보정 구현
- Design Token 관리, CSV/Table 편집, 실제 Color·Typography Preview 구현
- GGPoker Dark 기본 Token과 Semantic Token Binding 적용
- 공통 App Design Token 및 CSS Component Architecture 정리
- Admin LLM Prompt Control Plane 구축
  - Prompt Version
  - Draft/Active Lifecycle
  - 변수 계약 검증
  - 실행 파라미터 관리
- Section AI Control Plane과 이미지 생성 정책 관리 도입
- Frontend Vite 진입점 및 공통 플랫폼 통합

### 주요 성과

- 각 화면마다 별도 구현되던 편집 로직을 공통 엔진으로 통합해 기능 불일치와 유지보수 비용을 줄였다.
- 임의 CSS 값 대신 승인된 Design Token과 Preset을 사용하는 디자인 시스템 기반을 마련했다.
- LLM이 자유롭게 화면을 생성하는 방식에서 관리자가 승인한 Component와 정책을 조합하는 방식으로 제품 방향을 전환했다.
- 7월 27일 기준 자동 테스트 66건 통과를 확인했다.

---

## 4.5 7월 28일~8월 6일: AI Composition Engine 및 Registry Contract v3 완성

### 주요 개발

- 자연어 Overview/Intent 분석과 Template 추천 흐름 개선
- AI Page Composition Engine 구축
- Registry 기반 Composition Contract v3 도입
  - Composition Shell
  - Section/Component/Layout/Motion/Token Allowlist
  - Resource Version/Hash Pinning
  - Candidate·Policy·Resource Fingerprint
- 결정적 Compiler를 통해 동일 입력에서 재현 가능한 Builder Document 생성
- Collection 반복 정책과 안정적인 Instance ID 적용
- Section 추가·삭제·교체 및 Collection Item Operation 구현
- Document Revision 충돌 감지와 최신본 재적용 UX 구현
- HTML/Vue/React Export Adapter와 독립 Web Output Runtime 구축
- Section Preset의 Desktop/Mobile Geometry 및 콘텐츠 저장
- Hero 키비주얼 4:3 정책, CTA 전용 필드와 길이 정책 보강
- Token Hardcoding Guard 및 Runtime 일관성 테스트 추가
- Template·Section Preset·Component 삭제와 참조 관계 검증 보강
- Live Preview Component 상호작용 및 Resize 집중 QA

### 주요 성과

- AI가 HTML/CSS를 직접 생성하지 않고 Registry와 Allowlist 안에서 구조를 선택하는 안전한 생성 모델을 확립했다.
- Snapshot, Revision, Fingerprint를 통해 생성 결과의 재현성과 충돌 안전성을 높였다.
- Visual Editor와 Web Output이 동일 Snapshot과 Renderer 계약을 사용하도록 통합했다.
- 8월 6일 기준 자동 테스트 117개로 확대됐다.

---

## 4.6 8월 7일~8월 21일: 편집 UX 고도화·자산 Readiness·품질 게이트

### 주요 개발

- 고정 Property Panel을 Contextual Component Inspector로 전환
- Text 직접 편집, Outline Mode, Typography·정렬·자동 크기 제어 개선
- 복합 Component 자식 Field의 순서·크기·스타일 편집 기능 보강
- Layout JSON Inspector 및 AI 문서 Layout 진단 기능 구현
- Component 이동 Handle과 Drag/Resize 상태 분리
- 복합 Component 실제 높이 측정과 DOM 기반 충돌·겹침 진단 구현
- AI Builder 자동 Composition 적용 및 전체 화면 진행 상태 개선
- 모든 AI 이미지 Asset이 준비된 뒤에만 Live Preview로 이동하는 Readiness Gate 적용
- 반복 Collection 이미지 요청 누락 수정
- `assets.expected`와 실제 Asset Request Coverage 검증 도입
- 사용자 입력 언어를 분석해 허용 Locale 중 동일 언어를 선택하도록 개선
- Desktop/Mobile 자동 Preview Quality Gate 구현
  - Component 충돌
  - 영역 잘림
  - Content Overflow
  - 필수 이미지 Placeholder
  - 과도한 Section 공백 Warning
- Blocking 문제가 있으면 Preview 편집·저장·Web Output을 차단하고 재검사 제공
- Mobile 검사가 Desktop 폭에서 실행되던 CSS 우선순위 문제 수정
- 좁은 Preview Toolbar에서 Design Token Select가 저장 버튼을 덮던 UI 충돌 수정

### 주요 성과

- AI 자산이 완료되지 않은 결과나 레이아웃이 깨진 결과를 성공 화면으로 노출하지 않는 Fail-closed 기반을 마련했다.
- Desktop과 실제 375px Mobile Frame을 모두 검사하고 저장 직전에도 다시 검증하도록 했다.
- 손상 문서 차단과 정상 문서 저장 성공을 실제 Chromium Browser E2E로 검증했다.
- 전체 137개 자동 테스트와 Visual Editor Production Build를 통과했다.

---

## 5. 영역별 핵심 성과

| 영역 | 핵심 성과 | 사업·운영 효과 |
|---|---|---|
| AI 생성 | 자연어 Overview부터 Registry Composition까지 연결 | 임의 생성 감소, 결과 재현성 향상 |
| Prompt Governance | 외부화, Version, Active/Draft, 변수 검증 | 운영자 통제와 변경 이력 확보 |
| Visual Editor | 공통 Editor Core와 Contextual Inspector | Builder·Admin 간 기능 일관성 향상 |
| Design System | Component·Preset·Semantic Token 기반 | 브랜드 품질과 재사용성 향상 |
| Asset Pipeline | 생성·Queue·Retry·Readiness·Blob 저장 | 미완성 이미지 노출 및 재시도 오류 감소 |
| Document Contract | Snapshot·Revision·Fingerprint | 충돌 방지, 저장·복원·Export 안정성 향상 |
| Quality Gate | Desktop/Mobile DOM 기반 자동 검사 | 깨진 결과 저장·출력 방지 |
| Test/QA | 137개 자동 테스트와 Browser E2E | 회귀 위험 감소, 배포 판단 근거 확보 |

---

## 6. 주요 문제와 해결 내용

| 문제 | 원인 | 해결 |
|---|---|---|
| Integrated Brief가 독립 산출물로 부족 | 중간 JSON 위주의 입력 | Design Prompt와 Section Input Log를 포함하는 독립 문서 계약 강화 |
| Private Blob 이미지 조회 실패 | 접근 URL·허용 타입·Fallback 부족 | 전용 Proxy/API, 절대 URL, 과거 자산 Fallback 보강 |
| n8n Workflow 유지보수 난이도 | Parsing·Validation이 JSON Node에 집중 | 서버 Worker API로 책임 이전 |
| LLM Prompt 하드코딩 | 코드·Workflow별 설정 분산 | Admin Prompt Control Plane과 Version Lifecycle 도입 |
| Builder·Admin 편집 기능 불일치 | 별도 편집 구현 | 공통 Editor Core·Snapshot·Geometry·Adapter 도입 |
| 이미지 삭제 후 재생성 충돌 | Processing Job과 Retry 상태 불명확 | Lease, Attempt, Retry 가능 오류 분류, 상태 폴링 적용 |
| AI 결과의 Component 겹침 | 고정 높이와 실제 Font/Image 높이 차이 | 서버 사전 배치와 DOM 실측 진단·보정 적용 |
| 필수 이미지 요청 누락 | 반복 Collection Instance Key 불일치 | 반복 Instance 기준 Asset Target과 Expected Coverage 검증 |
| 입력 언어와 결과 언어 불일치 | Shell 첫 Locale 고정 선택 | 입력 언어와 동일한 Primary Language Locale 선택 |
| Mobile Quality 검사 왜곡 | 출력용 `min-width`가 375px Preview를 덮음 | Mobile Selector 우선순위 및 `min-width: 0` 적용 |
| Preview 저장 버튼 클릭 불가 | Token Select와 Action Button 겹침 | Toolbar 가변 폭·Wrap Layout 적용 |

---

## 7. 품질 및 검증 현황

### 완료된 검증

- API·Contract·Editor Core·Layout Engine 단위 테스트
- Prompt 변수·Version·Hardcoding Guard 테스트
- Template·Section·Component·Preset 관리 계약 테스트
- AI Builder 전체 Browser Flow
- Visual Editor Text/Image/CTA Interaction Browser Test
- Desktop/Mobile Responsive Output Test
- Asset Readiness 및 Retry Test
- AI Document Revision Rebase Test
- Preview Quality Gate 손상·정상 문서 Browser E2E
- Visual Editor Production Build

### 최신 결과

```text
전체 자동 테스트: 137 files passed
AI document quality gate browser test: passed
Visual Editor production build: passed
```

테스트는 번들 Runtime Node 24.19.0에서 수행됐다. 프로젝트 `package.json`의 선언은 Node 22.x이므로 Release CI에서는 Node 22.x 기준 재검증이 필요하다.

---

## 8. 현재 상태

### 완료 상태

- AI 자연어 입력부터 Composition, Asset 생성, Visual Editor 진입까지 핵심 흐름 연결
- Registry Contract v3와 결정적 Compiler 구현
- 공통 Visual Editor 및 Layout Engine 기반 구현
- Prompt·LLM·Design Token·Component·Preset 관리자 제어 기반 구현
- Asset Readiness와 Desktop/Mobile Preview Quality Gate 구현
- Web Output 및 Export Adapter 기반 구현
- 전체 회귀 테스트와 Browser E2E 통과

### 배포 상태 주의

- 보고 기간 중 여러 차례 `main` 및 Vercel 배포·확인이 진행됐다.
- 8월 21일의 최신 Preview Quality Gate, Mobile Frame 및 Toolbar 디버깅 보정분은 현재 로컬 Build/Test까지 완료됐으며 아직 배포하지 않았다.

### 알려진 제약

- Quality Diagnostic을 Document Revision별 서버 데이터로 영구 저장하지 않는다.
- 자동 Repair는 겹침 보정 일부만 제공하며 최대 2회 제한형 전체 Repair는 미완성이다.
- 1440/1024/390/360 고정 폭 Golden Corpus가 아직 없다.
- 일부 Provider 품질 검증은 API Credit·배포 환경 등 외부 조건에 영향을 받는다.
- Production CI의 Node 22.x 최종 검증이 필요하다.

---

## 9. 후속 추진 과제

### P0 — 배포 전 필수

1. 최신 품질 게이트 변경분 Commit·PR·Production 배포
2. Node 22.x CI에서 전체 137개 테스트와 Build 재실행
3. 실제 운영 AI 문서 대상으로 Desktop/Mobile Smoke Test
4. Quality Diagnostic을 Document Revision과 함께 저장
5. 실패 원인별 사용자 이동·수정 안내 보강

### P1 — 품질 고도화

1. Content–Layout Fit Scoring과 Preset 재선택
2. 허용된 Geometry 범위 내 최대 2회 자동 Repair
3. 1440/1024/390/360 Golden Corpus 및 정량 품질 기준 구축
4. 카드별 콘텐츠 역할 분리와 중복 문구 검증
5. Locale Resource 부족 시 Fail-closed 처리
6. 실제 이미지 품질 및 브랜드 적합도 운영 평가

### P2 — 운영 고도화

1. Shadow Mode → 단계별 Blocking Rollout
2. 품질 통과율, Repair 성공률, 생성시간 P95 운영 지표
3. Provider·Prompt Version별 품질 비교 Dashboard
4. Vision Model 기반 Advisory 품질 평가 검토

---

## 10. 종합 평가

이번 기간의 가장 큰 성과는 UI 기능 추가 자체보다 제품의 생성 원칙을 전환한 데 있다.

초기에는 LLM과 n8n을 활용해 디자인 이미지를 만드는 POC에 가까웠으나, 현재는 관리자가 승인한 Component, Preset, Token, Prompt, Resource 안에서 AI가 구성을 선택하고 결정적 Compiler와 Quality Gate가 결과를 검증하는 플랫폼 구조로 발전했다.

또한 자동 테스트가 0개에서 137개로 증가했고, 실제 Browser E2E와 Production Build가 배포 판단 기준에 포함됐다. 이를 통해 기능 개발 속도뿐 아니라 결과의 재현성, 운영 통제, 회귀 안정성, 향후 확장 가능성을 함께 확보했다.

다음 단계의 핵심은 기능 범위를 넓히는 것보다 현재 품질 게이트를 서버 Revision과 운영 지표까지 연결하고, 제한된 자동 Repair와 Golden Corpus를 통해 품질 기준을 정량화하는 것이다.

---

## 11. 주요 근거 문서

- `docs/handoff/handoff-2026-06-27.md`
- `docs/handoff/handoff-2026-06-30.md`
- `docs/handoff/handoff-2026-07-08.md`
- `docs/handoff/handoff-2026-07-12.md`
- `docs/handoff/handoff-2026-07-17.md`
- `docs/handoff/frontend-platform-unification-foundation-handoff-2026-07-24.md`
- `docs/계획/weekly-progress-and-plan-2026-07-27.md`
- `docs/handoff/handoff-2026-08-02.md`
- `docs/handoff/handoff-2026-08-06.md`
- `docs/계획/ai-builder-auto-composition-and-preview-readiness-development-plan-2026-08-17.md`
- `docs/계획/ai-promotion-component-drag-and-overlap-remediation-development-plan-2026-08-17.md`
- `docs/계획/ai-live-preview-design-quality-gate-development-plan-2026-08-20.md`

# Design Documents

이 문서는 `docs/design-md` 하위에 있는 브랜드별 디자인 시스템 분석 문서의 루트 목차입니다.

## 검토 요약

- 현재 `docs/design.md` 단일 문서는 없고, 브랜드별 문서는 `docs/design-md/{brand}/DESIGN.md`와 `README.md` 쌍으로 관리됩니다.
- 대부분의 `DESIGN.md`는 색상, 타이포그래피, 레이아웃, 컴포넌트, 반응형 동작, 반복 가이드, 한계점 순서로 구성되어 있습니다.
- 일부 문서는 번호형 목차나 다른 제목 체계를 사용합니다. 신규 문서는 아래의 "권장 문서 구조"를 기준으로 맞추는 편이 좋습니다.
- `README.md`는 짧은 분석 진입점, `DESIGN.md`는 상세 디자인 토큰과 구현 지침으로 쓰는 구조가 자연스럽습니다.

## 권장 문서 구조

브랜드별 `DESIGN.md`는 아래 순서를 기본 목차로 사용합니다.

1. Overview
2. Colors
3. Typography
4. Layout
5. Elevation & Depth
6. Shapes
7. Components
8. Do's and Don'ts
9. Responsive Behavior
10. Iteration Guide
11. Known Gaps

## 전체 목차

### AI / Developer Tools

- [Claude](design-md/claude/DESIGN.md)
- [Cohere](design-md/cohere/DESIGN.md)
- [Composio](design-md/composio/DESIGN.md)
- [Cursor](design-md/cursor/DESIGN.md)
- [ElevenLabs](design-md/elevenlabs/DESIGN.md)
- [Expo](design-md/expo/DESIGN.md)
- [HashiCorp](design-md/hashicorp/DESIGN.md)
- [Lovable](design-md/lovable/DESIGN.md)
- [Minimax](design-md/minimax/DESIGN.md)
- [Mistral AI](design-md/mistral.ai/DESIGN.md)
- [Ollama](design-md/ollama/DESIGN.md)
- [OpenCode AI](design-md/opencode.ai/DESIGN.md)
- [Replicate](design-md/replicate/DESIGN.md)
- [Resend](design-md/resend/DESIGN.md)
- [RunwayML](design-md/runwayml/DESIGN.md)
- [Sentry](design-md/sentry/DESIGN.md)
- [Together AI](design-md/together.ai/DESIGN.md)
- [VoltAgent](design-md/voltagent/DESIGN.md)
- [Warp](design-md/warp/DESIGN.md)
- [xAI](design-md/x.ai/DESIGN.md)

### SaaS / Productivity

- [Airtable](design-md/airtable/DESIGN.md)
- [Cal](design-md/cal/DESIGN.md)
- [Clay](design-md/clay/DESIGN.md)
- [ClickHouse](design-md/clickhouse/DESIGN.md)
- [Figma](design-md/figma/DESIGN.md)
- [Framer](design-md/framer/DESIGN.md)
- [Intercom](design-md/intercom/DESIGN.md)
- [Linear](design-md/linear.app/DESIGN.md)
- [Mintlify](design-md/mintlify/DESIGN.md)
- [Miro](design-md/miro/DESIGN.md)
- [MongoDB](design-md/mongodb/DESIGN.md)
- [Notion](design-md/notion/DESIGN.md)
- [PostHog](design-md/posthog/DESIGN.md)
- [Raycast](design-md/raycast/DESIGN.md)
- [Sanity](design-md/sanity/DESIGN.md)
- [Slack](design-md/slack/DESIGN.md)
- [Superhuman](design-md/superhuman/DESIGN.md)
- [Supabase](design-md/supabase/DESIGN.md)
- [Vercel](design-md/vercel/DESIGN.md)
- [Webflow](design-md/webflow/DESIGN.md)
- [Zapier](design-md/zapier/DESIGN.md)

### Finance / Commerce

- [Binance](design-md/binance/DESIGN.md)
- [Coinbase](design-md/coinbase/DESIGN.md)
- [Kraken](design-md/kraken/DESIGN.md)
- [Mastercard](design-md/mastercard/DESIGN.md)
- [Revolut](design-md/revolut/DESIGN.md)
- [Shopify](design-md/shopify/DESIGN.md)
- [Stripe](design-md/stripe/DESIGN.md)
- [Wise](design-md/wise/DESIGN.md)

### Consumer / Lifestyle

- [Airbnb](design-md/airbnb/DESIGN.md)
- [Nike](design-md/nike/DESIGN.md)
- [Pinterest](design-md/pinterest/DESIGN.md)
- [Spotify](design-md/spotify/DESIGN.md)
- [Starbucks](design-md/starbucks/DESIGN.md)
- [Uber](design-md/uber/DESIGN.md)
- [Vodafone](design-md/vodafone/DESIGN.md)

### Automotive / Hardware

- [Apple](design-md/apple/DESIGN.md)
- [BMW](design-md/bmw/DESIGN.md)
- [BMW M](design-md/bmw-m/DESIGN.md)
- [Bugatti](design-md/bugatti/DESIGN.md)
- [Dell 1996](design-md/dell-1996/DESIGN.md)
- [Ferrari](design-md/ferrari/DESIGN.md)
- [HP](design-md/hp/DESIGN.md)
- [IBM](design-md/ibm/DESIGN.md)
- [Lamborghini](design-md/lamborghini/DESIGN.md)
- [Meta](design-md/meta/DESIGN.md)
- [Nintendo 2001](design-md/nintendo-2001/DESIGN.md)
- [NVIDIA](design-md/nvidia/DESIGN.md)
- [PlayStation](design-md/playstation/DESIGN.md)
- [Renault](design-md/renault/DESIGN.md)
- [SpaceX](design-md/spacex/DESIGN.md)
- [Tesla](design-md/tesla/DESIGN.md)

### Media / Editorial

- [The Verge](design-md/theverge/DESIGN.md)
- [WIRED](design-md/wired/DESIGN.md)

## 문서 추가 규칙

새 브랜드 문서를 추가할 때는 아래 규칙을 따릅니다.

- 폴더명은 소문자 kebab-case 또는 실제 브랜드 도메인 표기(`linear.app`, `x.ai`)를 사용합니다.
- `README.md`에는 브랜드 분석 요약과 주요 특징을 둡니다.
- `DESIGN.md`에는 구현 가능한 디자인 토큰, 컴포넌트 규칙, 반응형 기준을 둡니다.
- 새 문서를 추가한 뒤 이 파일의 적절한 카테고리에 링크를 추가합니다.

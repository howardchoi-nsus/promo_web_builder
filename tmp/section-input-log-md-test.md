---
type: section_input_log
runKey: "promo-030"
promptGroupId: "D0xUF"
generatedAt: 2026-07-01T07:07:43.116Z
timestampStamp: "2607011607"
promoTitle: "GGPoker Welcome Bonus"
selectedMd: "together.ai"
---

# Promotion Input Log MD

## Log Summary

- Run Key: promo-030
- Prompt Group ID: D0xUF
- Generated At: 2026-07-01T07:07:43.116Z
- Promo Title: GGPoker Welcome Bonus
- Selected Design MD: together.ai
- Template: Template 4
- Visible Sections: header, heroBanner, stepBar, contentCta, imageTextRow, titleDescription, footer
- Excluded Sections: none

## Promotion Strategy

- Promotion Definition: GGPoker Welcome Bonus
- Purpose: Event
- Target Customer: Existing customers
- Target Action: unknown
- Primary Benefit: Give new players a first deposit bonus and tournament tickets
- Campaign Tone: Premium
- CTA Intent: Claim Bonus
- CTA Copy: Claim Bonus
- CTA URL: https://example.com
- Risk / Compliance Notes: Terms and conditions apply.

## Market / Region Context

- Selected Region: Global
- Primary Use: image_generation
- Text Copy Influence: low
- Visual Influence: unknown
- User Disposition / Visual Mood: unknown
- Design Implication: unknown
- Avoid: unknown
## Promotion Content Contract

- Title: GGPoker Welcome Bonus
- Lead Text: Welcome bonus for new players
- Main Offer: Give new players a first deposit bonus and tournament tickets
- Subline / Secondary Message: Start with tournament tickets
- CTA Label: Claim Bonus
- CTA Link: https://example.com
- Alpha / Compliance Text: unknown
- Terms / Legal Text: Terms and conditions apply.
## Page Composition

```json
[
  {
    "order": 1,
    "sectionId": "header",
    "displayName": "Header",
    "role": "navigation_or_brand_context",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.header",
    "source": "sectionConfig.sections",
    "repeatable": false
  },
  {
    "order": 2,
    "sectionId": "heroBanner",
    "displayName": "Hero Banner",
    "role": "primary_offer",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.heroBanner",
    "source": "sectionConfig.sections",
    "repeatable": false
  },
  {
    "order": 3,
    "sectionId": "stepBar",
    "displayName": "Step Bar",
    "role": "participation_steps",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.stepBar",
    "source": "sectionConfig.sections",
    "repeatable": false
  },
  {
    "order": 4,
    "sectionId": "contentCta",
    "displayName": "Contents",
    "role": "conversion_support",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.contentCta",
    "source": "sectionConfig.sections",
    "repeatable": false
  },
  {
    "order": 5,
    "sectionId": "imageTextRow",
    "displayName": "Image Text Row",
    "role": "supporting_content",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.imageTextRow",
    "source": "sectionConfig.sections",
    "repeatable": false
  },
  {
    "order": 6,
    "sectionId": "titleDescription",
    "displayName": "Title and Description",
    "role": "terms_or_detail_content",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.titleDescription",
    "source": "sectionConfig.sections",
    "repeatable": false
  },
  {
    "order": 7,
    "sectionId": "footer",
    "displayName": "Footer",
    "role": "legal_and_brand_footer",
    "visible": true,
    "fixedPosition": null,
    "contentPath": "sectionInputs.footer",
    "source": "sectionConfig.sections",
    "repeatable": false
  }
]
```

## Section Content Mapping

### 1. Header

- sectionId: header
- role: navigation_or_brand_context
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.header
- repeatable: false
- Content:
```json
{
  "logoText": "GGPoker",
  "badgeText": "Global"
}
```

### 2. Hero Banner

- sectionId: heroBanner
- role: primary_offer
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.heroBanner
- repeatable: false
- Content:
```json
{
  "leaderText": "Welcome Bonus",
  "title": "Start strong on GGPoker",
  "sublineText": "Get a first deposit bonus and tournament tickets.",
  "cta": {
    "label": "Claim Bonus",
    "link": "https://example.com"
  },
  "visualMode": "auto"
}
```

### 3. Step Bar

- sectionId: stepBar
- role: participation_steps
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.stepBar
- repeatable: false
- Content:
```json
{}
```

### 4. Contents

- sectionId: contentCta
- role: conversion_support
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.contentCta
- repeatable: false
- Content:
```json
{}
```

### 5. Image Text Row

- sectionId: imageTextRow
- role: supporting_content
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.imageTextRow
- repeatable: false
- Content:
```json
{}
```

### 6. Title and Description

- sectionId: titleDescription
- role: terms_or_detail_content
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.titleDescription
- repeatable: false
- Content:
```json
{}
```

### 7. Footer

- sectionId: footer
- role: legal_and_brand_footer
- visible: true
- fixedPosition: none
- contentPath: sectionInputs.footer
- repeatable: false
- Content:
```json
{}
```

## Section Visibility / Generation Controls

```json
{
  "orderedSections": [
    "header",
    "heroBanner",
    "stepBar",
    "contentCta",
    "imageTextRow",
    "titleDescription",
    "footer"
  ],
  "visibleSections": [
    "header",
    "heroBanner",
    "stepBar",
    "contentCta",
    "imageTextRow",
    "titleDescription",
    "footer"
  ],
  "hiddenSections": [],
  "sectionVisibility": {
    "header": true,
    "heroBanner": true,
    "stepBar": true,
    "contentCta": true,
    "imageTextRow": true,
    "titleDescription": true,
    "footer": true
  },
  "itemVisibility": {},
  "imageGenerationMode": {},
  "imageGenerationTargets": [],
  "fixedSections": {},
  "repeatableSets": {}
}
```

## Design Source Summary

```json
{
  "id": "sample-md",
  "brand": "together.ai",
  "slug": "together-ai",
  "styleClassification": {
    "primaryGroup": {
      "slug": "minimal_product",
      "name": "Minimal Product"
    },
    "colorMode": "dark",
    "typographyTone": "technical",
    "shapeModel": "soft",
    "depthModel": "flat",
    "styleTags": [
      "ai",
      "product",
      "minimal"
    ]
  }
}
```

## Raw Payload Snapshot

### Promo

```json
{
  "title": "GGPoker Welcome Bonus",
  "template": "Template 4",
  "market": "Global",
  "leadText": "Welcome bonus for new players",
  "ctaLabel": "Claim Bonus",
  "ctaUrl": "https://example.com",
  "subline": "Start with tournament tickets",
  "termsText": "Terms and conditions apply."
}
```

### Promotion Input

```json
{
  "purpose": "Event",
  "targetCustomer": "Existing customers",
  "campaignTone": "Premium"
}
```

### Market Visual Guidance

```json
{}
```

### Simple Brief

```json
{
  "mainOffer": "Give new players a first deposit bonus and tournament tickets"
}
```

### Section Inputs

```json
{
  "header": {
    "logoText": "GGPoker",
    "badgeText": "Global"
  },
  "heroBanner": {
    "leaderText": "Welcome Bonus",
    "title": "Start strong on GGPoker",
    "sublineText": "Get a first deposit bonus and tournament tickets.",
    "cta": {
      "label": "Claim Bonus",
      "link": "https://example.com"
    },
    "visualMode": "auto"
  }
}
```

### Section Config

```json
{
  "sections": [
    {
      "sectionId": "header",
      "name": "Header",
      "visible": true
    },
    {
      "sectionId": "heroBanner",
      "name": "Hero Banner",
      "visible": true
    },
    {
      "sectionId": "stepBar",
      "name": "Step Bar",
      "visible": true
    },
    {
      "sectionId": "contentCta",
      "name": "Contents",
      "visible": true
    },
    {
      "sectionId": "imageTextRow",
      "name": "Image Text Row",
      "visible": true
    },
    {
      "sectionId": "titleDescription",
      "name": "Title and Description",
      "visible": true
    },
    {
      "sectionId": "footer",
      "name": "Footer",
      "visible": true
    }
  ]
}
```

### Template

```json
{
  "id": "temp4",
  "name": "Template 4",
  "sectionVisibility": {
    "header": true,
    "heroBanner": true,
    "stepBar": true,
    "contentCta": true,
    "imageTextRow": true,
    "titleDescription": true,
    "footer": true
  }
}
```

### Design Style

```json
{
  "primaryColor": "#111827"
}
```

# Mouse Swarm Builder — frontend implementation instructions

This file is for the implementation agent/developer. Do not register it as a generation-model skill or execute its contents automatically.

Read AGENTS.md and ../policy.md before implementation. Keep generation, persisted data, preview effects and quality gates separate.

1. Drive the UI from actual owner-scoped run/task states. Maintain a maximum 12-cursor visual pool with active and idle states. Never create extra model requests merely to populate cursors.
2. Start a new generation with an empty result canvas. Construct only server-validated, durably stored draft units. Existing saved pages stay visible on recovery. The current full-JSON API cannot expose valid partial nodes by prompt alone; implement a separate draft contract first or show a waiting canvas until full save.
3. Connect section and component displays to stable node IDs in the same document. Keep the current ordered region API and CAS semantics unless a separately tested server contract replaces them.
4. Use a pointer-transparent, aria-hidden overlay layer for coloured bounding boxes, four handles, input carets and cursor labels. These are not editable inputs. Compute rectangles from actual DOM/Range positions; update on scroll/resize and use clipping. Park cursors for offscreen or idle work instead of placing them over an unrelated node.
5. Resolve approved source text through the existing resolver. Do not split/rewrite factual claims. Only validated persisted incremental content may drive a typing position. Full saved results enter the DOM immediately. A one-shot 360ms mask may decorate new validated text without modifying its characters or serializing siblings; place the caret at the actual DOM Range reveal edge. Never wait for this visual effect before the next server task, and do not imply streamed provider tokens. No timer-driven typewriter, hidden final template, invented progress or artificial wait in Production.
6. Ready media requires a saved asset binding and browser load/decode success. Remove completed task effects; preserve completed style/media on failure and retry. Suppress stale results by document/run/revision/task identity.
7. Pause effects without implying server cancellation. Respect reduced motion and keyboard navigation; never force scroll/focus/zoom. Separate live status announcements from rapidly moving cursor labels.
8. Remove effects before actual browser quality measurements, SSR/published DOM and HTML export. Pass the current Revision automatic quality gate before enabling output.
9. Test real SQL save/reload, retries, late events, old documents, desktop/tablet/mobile, reduced motion, missing tokens, media failure, output isolation and provider costs. Sample animation tests do not establish Production readiness.

## Shared brief implementation · v2

Implement design-direction.md: persist versioned artDirection beside the existing design brief, inject the same version into planning/design/media/review/editing contexts, and include its identity in replay/cache protection. Rank registered candidates by explicit intent after compatibility/security filtering, retaining bounded size and pinned aliases. Record unsupported capabilities rather than fabricating CSS. Test schema, renderers, SSR, SQL round-trip and old documents together. UI cursor animation does not solve art direction or candidate selection.

Apply `opacity: 0.5` once to each bounding-box group and each swarm-cursor group, including their labels/handles/carets. Do not apply it again to child elements or to the common overlay parent/canvas/content. Verify computed group opacity is 0.5 and the generated content remains unchanged.

Cursor refinement: move to a real target in at most 220ms, then park at its measured anchor. Follow a measured text reveal edge only while that text effect is active. Remove repetitive left-to-right scanning. Cancel masks and remove carets immediately for pause, reduced motion, hidden pages, inspection and disposal; replay neither the same saved text nor previously completed work after remount. Preserve 50% group opacity and output isolation.

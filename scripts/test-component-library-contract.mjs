import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  componentLibrarySearchText,
  resolveComponentLibraryPresentation,
} from "../visual-editor/src/platform/editor-core/component-library.mjs";
import componentStore from "../api/_item-components-store.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (...segments) => fs.readFileSync(path.join(root, ...segments), "utf8");

const migration = read("db", "migrations", "048_component_library_presentation_and_placement_policy.sql");
const panel = read("visual-editor", "src", "platform", "editor-ui", "ComponentLibraryPanel.vue");
const icon = read("visual-editor", "src", "platform", "editor-ui", "ComponentLibraryIcon.vue");
const styles = read("visual-editor", "src", "styles.css");
const createApi = read("api", "item-components.js");
const updateApi = read("api", "item-component.js");
const draftApi = read("api", "item-component-draft.js");
const adminApp = read("prototype", "app.js");
const adminHtml = read("prototype", "index.html");

assert.match(migration, /library_presentation jsonb not null default '\{\}'::jsonb/);
assert.match(migration, /placement_policy jsonb not null default '\{\}'::jsonb/);
assert.match(createApi, /validateLibraryPresentation/);
assert.match(updateApi, /validatePlacementPolicy/);
assert.match(draftApi, /source\.placement_policy/);
assert.match(panel, /COMPONENT_LIBRARY_CATEGORIES/);
assert.match(panel, /ComponentLibraryIcon/);
assert.match(panel, /resolvedLibraryPresentation\.displayOrder/);
assert.match(icon, /iconKey === 'image'/);
assert.match(styles, /\.component-library-panel__grid/);
assert.match(adminApp, /libraryPresentation/);
assert.match(adminHtml, /컴포넌트 Library 표시/);
assert.match(adminHtml, /배치 정책/);

assert.deepEqual(resolveComponentLibraryPresentation({
  activeVersion: { fieldKind: "image" },
}), {
  category: "media",
  iconKey: "image",
  keywords: [],
  displayOrder: 100,
  isFeatured: false,
});
assert.equal(resolveComponentLibraryPresentation({
  activeVersion: { fieldKind: "text", textType: "title" },
  libraryPresentation: { category: "invalid", iconKey: "unknown" },
}).iconKey, "heading");
assert.match(componentLibrarySearchText({
  name: "Brand mark",
  activeVersion: { fieldKind: "image" },
  libraryPresentation: { category: "media", iconKey: "logo", keywords: ["header"] },
}), /brand mark.*media.*header/);

assert.deepEqual(componentStore.validateLibraryPresentation({
  category: "media",
  iconKey: "logo",
  keywords: [" Brand ", "brand"],
  displayOrder: 20,
  isFeatured: true,
}), {
  category: "media",
  iconKey: "logo",
  keywords: ["brand"],
  displayOrder: 20,
  isFeatured: true,
});
assert.throws(
  () => componentStore.validateLibraryPresentation({ iconKey: "<svg>" }),
  /iconKey must be one of/,
);
assert.deepEqual(componentStore.validatePlacementPolicy({
  allowedSectionRoles: ["header"],
  maxInstancesPerSection: 1,
  defaultGeometry: {
    desktop: { widthPct: 30, heightPx: 80 },
    mobile: { widthPct: 60, heightPx: 72 },
  },
}), {
  allowedSectionRoles: ["header"],
  deniedSectionRoles: [],
  maxInstancesPerSection: 1,
  requiresParentCapabilities: [],
  defaultGeometry: {
    desktop: { widthPct: 30, heightPx: 80 },
    mobile: { widthPct: 60, heightPx: 72 },
  },
});
assert.throws(
  () => componentStore.validatePlacementPolicy({
    allowedSectionRoles: ["legal"],
    deniedSectionRoles: ["legal"],
  }),
  /cannot allow and deny/,
);

console.log("Component Library presentation and placement policy contract tests passed");

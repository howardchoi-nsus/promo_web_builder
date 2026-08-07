const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/055_promote_registry_hero_key_visual_to_section.sql"),
  "utf8",
);
const seed = fs.readFileSync(
  path.resolve(__dirname, "../db/seeds/005_seed_registry_composition_vertical_slice.sql"),
  "utf8",
);

assert.match(migration, /'imageTarget', 'section-background'/);
assert.match(migration, /'allowSectionBackground', true/);
assert.match(migration, /delete from public\.wizard_content_section_component_instances/);
assert.match(migration, /instance\.item_key = 'visual'/);
assert.match(migration, /#- '\{content,visual\}'/);
assert.match(migration, /#- '\{viewports,desktop,items,visual\}'/);
assert.match(migration, /#- '\{viewports,mobile,items,visual\}'/);

assert.match(seed, /"allowSectionBackground":true,"imageTarget":"section-background","imageTargetItemKeys":\[\]/);
assert.doesNotMatch(seed, /'registryHero','content-image','visual'/);
assert.match(seed, /section\.section_key = 'registryHero'[\s\S]*instance\.item_key = 'visual'/);

console.log("Registry Hero Section key visual migration contract passed");

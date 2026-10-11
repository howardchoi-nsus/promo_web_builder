import { readFile } from "node:fs/promises";
import {
  buildInventory, buildRollbackPlan, createBatchMetadata, planMigration, reconcileSnapshots,
} from "../packages/directus-migration/src/index.mjs";

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const [key, ...parts] = argument.replace(/^--/, "").split("=");
  return [key, parts.join("=") || true];
}));
if (!args.source) throw new Error("--source=/path/to/source-snapshot.json is required");
const source = JSON.parse(await readFile(String(args.source), "utf8"));
const target = args.target ? JSON.parse(await readFile(String(args.target), "utf8")) : { domains: {} };
const domains = String(args.domains || "components,designTokens").split(",");
const mode = String(args.mode || "plan");
const plan = planMigration(source, target, domains);
const output = mode === "inventory"
  ? buildInventory(source, domains)
  : mode === "reconcile"
    ? reconcileSnapshots(source, target, domains)
    : mode === "rollback"
      ? buildRollbackPlan(plan, String(args.batch || "dry-run"))
      : {
          batch: createBatchMetadata({
            domains,
            sourceCommit: String(args.commit || "working-tree"),
            sourceEnvironment: String(args.environment || "development"),
            targetEnvironment: String(args.environment || "development"),
            schemaVersion: String(args.schema || "promo-reference-v1"),
          }),
          sourceInventory: buildInventory(source, domains),
          plan,
        };
process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);

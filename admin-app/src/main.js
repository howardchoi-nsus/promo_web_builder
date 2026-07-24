import * as VueRuntime from "vue/dist/vue.esm-bundler.js";
import { resolveAdminShell } from "./shell-contract.mjs";

resolveAdminShell(document);
globalThis.Vue = VueRuntime;

await import("../../prototype/admin/template-layout-manager.js");
await import("../../prototype/app.js");

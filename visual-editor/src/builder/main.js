import {installWorkErrorReporting} from "./services/work-error-reporting.mjs";
import { createApp } from "vue";
import AiBuilderApp from "./AiBuilderApp.vue";
import "./ai-builder.css";

const root = document.querySelector("#ai-builder-app");
if (root) {
  const mode = new URLSearchParams(window.location.search).get("mode") || "";
  const app=createApp(AiBuilderApp, { initialMode: mode });
  installWorkErrorReporting(app);
  app.mount(root);
  root.hidden = false;
}

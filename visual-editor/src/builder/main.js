import { createApp } from "vue";
import AiBuilderApp from "./AiBuilderApp.vue";
import "./ai-builder.css";

const root = document.querySelector("#ai-builder-app");
if (root) {
  const mode = new URLSearchParams(window.location.search).get("mode") || "";
  createApp(AiBuilderApp, { initialMode: mode }).mount(root);
  root.hidden = false;
}

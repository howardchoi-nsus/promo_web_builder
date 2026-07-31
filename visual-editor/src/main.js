import { createApp } from "vue";
import App from "./App.vue";
import SectionPresetEditor from "./SectionPresetEditor.vue";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/solid.min.css";
import "./styles.css";

const root = document.querySelector("#visual-editor-app");

if (root) {
  const queryMode = new URLSearchParams(window.location.search).get("mode");
  if (queryMode === "section-preset") {
    createApp(SectionPresetEditor).mount(root);
  } else {
    createApp(App, { mode: queryMode || root.dataset.mode || "editor" }).mount(root);
  }
}

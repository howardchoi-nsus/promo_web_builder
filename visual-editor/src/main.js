import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";

const root = document.querySelector("#visual-editor-app");

if (root) {
  createApp(App, { mode: root.dataset.mode || "editor" }).mount(root);
}

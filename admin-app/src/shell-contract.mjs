export function resolveAdminShell(documentRef = globalThis.document) {
  const mountTarget = documentRef?.querySelector?.("#app");
  if (!mountTarget) throw new Error("Admin mount target #app was not found");
  if (!mountTarget.matches("[data-shell-frame]")) {
    throw new Error("Admin mount target must define the shared App Shell boundary");
  }
  return Object.freeze({
    mountSelector: "#app",
    mountTarget,
    shellVersion: 1,
  });
}

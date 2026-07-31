function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneValue(value) {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value));
}

function valuesEqual(left, right) {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
    return left.every((entry, index) => valuesEqual(entry, right[index]));
  }
  if (isPlainObject(left) || isPlainObject(right)) {
    if (!isPlainObject(left) || !isPlainObject(right)) return false;
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length || leftKeys.some((key) => !Object.hasOwn(right, key))) return false;
    return leftKeys.every((key) => valuesEqual(left[key], right[key]));
  }
  return false;
}

function mergeValue(base, local, latest, path, conflicts) {
  if (valuesEqual(local, base)) return cloneValue(latest);
  if (valuesEqual(latest, base) || valuesEqual(local, latest)) return cloneValue(local);
  if (isPlainObject(base) && isPlainObject(local) && isPlainObject(latest)) {
    const result = {};
    const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(latest)]);
    keys.forEach((key) => {
      const merged = mergeValue(base[key], local[key], latest[key], `${path}.${key}`, conflicts);
      if (merged !== undefined) result[key] = merged;
    });
    return result;
  }
  conflicts.push(path);
  return cloneValue(local);
}

export function rebaseDocumentSnapshot(baseSnapshot, localSnapshot, latestSnapshot) {
  const conflicts = [];
  const snapshot = mergeValue(baseSnapshot, localSnapshot, latestSnapshot, "$", conflicts);
  return { snapshot, conflicts };
}

export { valuesEqual };

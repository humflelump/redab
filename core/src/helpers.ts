export const arraysDiff = (a1: null | any[], a2: null | any[]) => {
  if (!a1 || !a2) return true;
  if (a1.length !== a2.length) return true;
  const len = a1.length;
  for (let i = 0; i < len; i++) {
    if (a1[i] !== a2[i]) return true;
  }
  return false;
};

export const unorderedArrayDiff = (a1, a2) => {
  const s1 = new Set(a1);
  const s2 = new Set(a2);
  for (const d of a1) {
    if (!s2.has(d)) return true;
  }
  for (const d of a2) {
    if (!s1.has(d)) return true;
  }
  return false;
};

export const mergeCountMaps = (m1, m2) => {
  const m = new Map(m1);
  for (const key of m2.keys()) {
    m.set(key, (m.get(key) || 0) + m2.get(key));
  }
  return m;
};

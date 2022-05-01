export const arraysDiff = (a1: any[], a2: any[]) => {
  const len = a1.length;
  for (let i = 0; i < len; i++) {
    if (a1[i] !== a2[i]) return true;
  }
  return false;
};

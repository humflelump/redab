export const createId = (() => {
  let c = 0;
  return () => String(c++) + Math.random();
})();

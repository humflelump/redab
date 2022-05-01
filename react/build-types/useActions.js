var ar = (len) => {
  var L = [];
  for (let i = 1; i < len + 1; i++) {
    L.push(i);
  }
  return L;
};

var ma = (a, b) => {
  var L = [];
  for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
      L.push([i, j]);
    }
  }
  return L;
};

var res = [
  `type Action<T extends AnyFunction> = T & { construct: any };
  type AtomReturnType<T> = T extends Atom<infer Return> ? Return : unknown;
  type ActionReturnType<T> = T extends Action<infer Return> ? Return : unknown;
  type AtomUpdateType<T> = T | ((val: T) => T);`,
];

// prettier-ignore
function genType(inputs) {
        return `
  export function useActions${inputs > 0 ? '<' : ''}${ar(inputs).map(i => `T${i} extends Atom<any> | Action<any>`).join(', ')}${inputs > 0 ? '>' : ''}(${ar(inputs).map(i => `d${i}: T${i}`).join(', ')}): [
    ${ar(inputs).map(i => `T${i} extends Atom<any> ? ((x: AtomUpdateType<AtomReturnType<T${i}>>) => void) : ActionReturnType<T${i}>`).join(', ')}
  ]; 
    `
    }

res = res.concat(ar(10).map((d, i) => genType(i))).join(`
`);
console.log(res);

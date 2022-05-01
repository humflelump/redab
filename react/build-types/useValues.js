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

var res = [];

// prettier-ignore
function genType(inputs) {
          return `
    export function useValues${inputs > 0 ? '<' : ''}${ar(inputs).map(i => `T${i}`).join(', ')}${inputs > 0 ? '>' : ''}(${ar(inputs).map(i => `d${i}: AtomOrSelector<T${i}>`).join(', ')}): [
      ${ar(inputs).map(i => `T${i}`).join(', ')}
    ]; 
      `
      }

res = res.concat(ar(10).map((d, i) => genType(i))).join(`
  `);
console.log(res);

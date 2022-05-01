var ar = (len) => {
  var L = [];
  for (let i = 1; i < len + 1; i++) {
    L.push(i);
  }
  return L;
};

// prettier-ignore
function genType(inputs) {
          return `
  export function setMultiple${inputs ? '<' : ''}${ar(inputs).map(i => `T${i}`).join(', ')}${inputs ? '>' : ''}(
      atoms: [${ar(inputs).map(i => `Atom<T${i}>`).join(', ')}],
      vals: [${ar(inputs).map(i => `T${i}`).join(', ')}],
      key?: any,
  ): void;
      `
      }

var res = ar(7).map((d, i) => genType(i)).join(`
    `);

// eslint-disable-next-line no-undef
console.log(res);

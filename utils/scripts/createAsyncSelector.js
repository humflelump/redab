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
export function createAsyncSelector<${ar(inputs).map(i => `S${i}`).join(', ')}${inputs > 0 ? ', ' : ''}ReturnType, DefaultValue=null>(params: {
    defaultValue: DefaultValue;
    inputs${inputs === 0 ? '?' : ''}: [${ar(inputs).map(i => `AtomOrSelector<S${i}>`).join(', ')}];
    func: (${ar(inputs).map(i => `val${i}: S${i}`).join(', ')}${inputs > 0 ? ', ' : ''}state: AsyncSelectorPromiseState<ReturnType>) => Promise<ReturnType>;
    id?: string;
    shouldUseAsync?: (${ar(inputs).map(i => `val${i}: S${i}`).join(', ')}) => boolean;
    throttle?: (f: () => void) => () => void;
    onResolve?: (result: ReturnType) => void;
    onReject?: (err: Error) => void;
}): [Selector<ReturnType | DefaultValue>, Selector<boolean>, Selector<any | undefined>, Action<() => Promise<ReturnType>>];
  `
  }

var res = ar(10).map((d, i) => genType(i)).join(`

`);
console.log(res);

// var ar = (len) => {
//   var L = [];
//   for (let i = 1; i < len + 1; i++) {
//     L.push(i);
//   }
//   return L;
// };

// // prettier-ignore
// function genType(inputs) {
//         return `
// export function createSubscription<ReturnType, Subscription${inputs > 0 ? ', ' : ''}${ar(inputs).map(i => `R${i}`).join(', ')}>(params: {
//     id?: string;
//     defaultValue: ReturnType;
//     inputs${inputs > 0 ? '' : '?'}: [${ar(inputs).map(i => `AtomOrSelector<R${i}>`).join(', ')}];
//     onInputsChanged?: (
//         current: [${ar(inputs).map(i => `R${i}`).join(', ')}],
//         prev: [${ar(inputs).map(i => `R${i}`).join(', ')}] | null,
//         setter: (val: ReturnType) => void,
//         sub: Subscription,
//     ) => void;
//     onSubscriptionsChanged?: (
//         newListeners: Listener[],
//         prevListeners: Listener[],
//         setter: (val: ReturnType) => void,
//         sub: Subscription,
//     ) => void;
//     onSubscribe: (values: [${ar(inputs).map(i => `R${i}`).join(', ')}], setter: (val: ReturnType) => void) => Subscription;
//     onUnsubscribe?: (values: [${ar(inputs).map(i => `R${i}`).join(', ')}], setter: (val: ReturnType) => void, sub: Subscription) => void;
//     }): [Selector<ReturnType>, (val: ReturnType) => void];
//     `
//     }

// var res = ar(7).map((d, i) => genType(i)).join(`
//   `);
// console.log(res);

var ar = (len) => {
  var L = [];
  for (let i = 1; i < len + 1; i++) {
    L.push(i);
  }
  return L;
};

var res = [`type SetterVal<T> = T | ((val: T) => T);`];

// prettier-ignore
function genType(inputs) {
        return `
        export function createSubscription<Return, ${ar(inputs).map(i => `R${i}`).join(', ')}>(params: {
          id?: string;
          defaultValue: Return;
          inputs${inputs > 0 ? '' : '?'}: [${ar(inputs).map(i => `AtomOrSelector<R${i}>`).join(', ')}];
          onSubscribe: (
            vals: [${ar(inputs).map(i => `R${i}`).join(', ')}],
            setter: (f: SetterVal<Return>) => void
          ) => {
            onUnsubscribe: (values: [${ar(inputs).map(i => `R${i}`).join(', ')}]) => void;
            onInputsChanged?: (
              current: [${ar(inputs).map(i => `R${i}`).join(', ')}],
              prev: [${ar(inputs).map(i => `R${i}`).join(', ')}] | null,
            ) => void;
            onSubscriptionsChanged?: (
              newListeners: Listener[],
              prevListeners: Listener[],
            ) => void;
          };
        }): Selector<Return>;
    `
    }

var res = res.concat(ar(7).map((d, i) => genType(i))).join(`
  `);
console.log(res);

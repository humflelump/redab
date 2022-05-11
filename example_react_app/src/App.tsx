import React from 'react';
import { selector, atom, createAsyncSelector, CurrentKeyContext, dynamicSelector, useActions, useCurrentKey, useValues, DEFAULT_STORE, createSubscription, Atom, WithKey } from 'redab';
import './App.css';
// import _ from 'lodash';

const rd = atom({data: true, multi: true});

const sub = createSubscription({
  id: 'yo',
  defaultValue: 0,
  inputs: [rd],
  onSubscribe: (vals, setter) => {
    let interval;
    const start = () => {
      interval = setInterval(() => {
        setter(n => n + 1);
      }, 1000);
    }
    const stop = () => clearInterval(interval);
    start();
    return {
      onUnsubscribe: () => stop(),
      onInputsChanged: ([active]) => {
        if (active) {
          start();
        } else {
          stop();
        }
      }
    }
  }
})

const sum = dynamicSelector((get, getAll) => {
  const map = getAll(sub);
  let s = 0;
  for (const v of Array.from(map.values())) {
    s += v;
  }
  return s;
});

const a = atom({data: 5, multi: true});

// const s = dynamicSelector(get => get(rd) + 10)
const ListItem = WithKey((props: {n: number}) => {
  const [val, n] = useValues(sub, a);
  const [setActive] = useActions(rd);
  return <div onClick={() => setActive(b => !b)}>{val}, {n}</div>
}, {onUpdate: (props, key) => {
  a.set(props.n, key);
}});

const massAtom = atom(10);
const lightSpeedAtom = atom(3e8);

async function calculateInServerOrWebWorker(m: number, c: number) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return m * c ** 2;
}

const [energySelector, loadingAtom, errorAtom, forceUpdate] = createAsyncSelector({
  id: 'my-first-async-selector',
  defaultValue: null,
  inputs: [massAtom, lightSpeedAtom],
  func: async (m, c) => {
    const E = await calculateInServerOrWebWorker(m, c);
    return E;
  },
  throttle: f => f,
  onReject: (e) => window.alert(e.message),
});

DEFAULT_STORE.setMiddleware((next, curr, atom, key) => {
  console.log(atom.getId(), 'changed from', curr, 'to', next);
  return next;
});

const Component = () => {
  const [m, c, loading, s] = useValues(massAtom, lightSpeedAtom, loadingAtom, sum);
  console.log('render')
  return <div>
    {/* <p>Energy: {E}</p> */}
    <p>s: {s}</p>
    <p>Mass: {m}</p>
    <p>Speed of Light: {c}</p>
    <p>Loading: {loading ? 'Y' : 'N'}</p>
    <button onClick={() => massAtom.set(m + 1)}>Increase Mass</button>
  </div>
}


function App() {

  // const [x, setX] = React.useState(0);
  // setInterval(() => {
  //   setX(x => x + 1);
  // }, 1000);

  return (
    <div className="App">
      <div>wowowo</div>
      <ListItem n={5}/>
      <ListItem n={3}/>
      <ListItem n={1}/>
      <Component />
    </div>
  );
}



const Blah =  WithKey(App);
export default Blah;
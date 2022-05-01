import React from 'react';
import { atom, createAsyncSelector, CurrentKeyContext, dynamicSelector, useActions, useCurrentKey, useValues, DEFAULT_STORE, createSubscription, Atom, WithKey } from 'redab';
import './App.css';

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


const a = atom({data: 5, multi: true});

// const s = dynamicSelector(get => get(rd) + 10)
const ListItem = WithKey((props: {n: number}) => {
  const [val, n] = useValues(sub, a);
  const [setActive] = useActions(rd);
  return <div onClick={() => setActive(b => !b)}>{val}, {n}</div>
}, {onUpdate: (props, key) => {
  a.set(props.n, key);
}});


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
    </div>
  );
}

const Blah =  WithKey(App);
export default Blah;
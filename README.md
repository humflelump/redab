
# Motivation

### Reusability
A common issue arises when you need to create multiple instances of a component which previously relied on a singleton to hold its values. With redab, all state variables can actually store multiple versions of the data, allowing effortless reusability. The code looks the same for reusable components and singleton components.
### Performance
Redab maintains a dependency graph and every node in the graph knows its subscribers. So when value updates, only the functions and components that are connected to that node will every recalculate.
### Data Streams
Since every node knows its subscribers, a streaming node can automatically close a socket when there are no subscribers and resubscribes when a relevant component mounts. This allows for complex dependency graphs while retaining optimal performance and maintainability.
### Async Data
Async selectors are a core part of redab. They allow you subscribe to data in a database or performance async calculations in a web worker. Just like with normal selectors, they are only called when there is at least one subscribed component and their inputs change.
### Bundle Size
At less than 10kb gzipped, it is far less than other popular state management libraries. Additionally, redab's architecture is very conducive to code splitting.
### Dev Tools
There is a single store which allows you to subscribe to all updates to state and other events that occur. Because the architecture, it allows for visualization the dependency graph.

# Getting Started

To install to package
```
yarn add redab
```

At redab's core, there are only two constructs - atoms and selectors. An atom stores a piece of the state of the application. A selector uses existing atoms and selectors to calculate derived state. You can subscribe to data using React hooks.

### Basic Example

```js
import React from 'react';
import { atom, selector, useValues } from 'redab';

const massAtom = atom(10);

const lightSpeedAtom = atom(3e8);

const energySelector = selector({
  inputs: [massAtom, lightSpeedAtom],
  func: (m, c) => {
    const E = m * c ** 2;
    return E;
  }
});

export const Component = () => {
  const [E, m, c] = useValues(energySelector, massAtom, lightSpeedAtom);
  return <div>
    <p>Energy: {E}</p>
    <p>Mass: {m}</p>
    <p>Speed of Light: {c}</p>
    <button onClick={() => massAtom.set(m + 1)}>Increase Mass</button>
  </div>;
};
```

# Async Data Requests

Async selectors are core feature of redab. They work very similarly to regular selectors - they only recalculate when the inputs change AND there's at least one component subscribed. However they manage async function calls and have additional features like throttling/debouncing. And they return 4 things - a selector for the output, a selector for the loading state, a selector for the error state, and an action for force updating (for example if you saved new data to the database).

```js
import React from 'react';
import { atom, createAsyncSelector, useValues } from 'redab';
import _ from 'lodash';

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
  throttle: f => _.throttle(f, 500),
  onReject: (e) => window.alert(e.message),
});

export const Component = () => {
  const [E, m, c, loading] = useValues(energySelector, massAtom, lightSpeedAtom, loadingAtom);
  return <div>
    <p>Energy: {E}</p>
    <p>Mass: {m}</p>
    <p>Speed of Light: {c}</p>
    <p>Loading: {loading ? 'Y' : 'N'}</p>
    <button onClick={() => massAtom.set(m + 1)}>Increase Mass</button>
  </div>;
};
```

# Data Subscriptions

A unique feature of redab is how easy it makes managing subscription. This is because every node in the dependency graph knows which components are subscribed. So it can automatically open a socket on subscribe and close it on unsubscribe.

```js
import React from 'react';
import { createSubscription, useValues } from 'redab';

const currentIncrementVal = createSubscription({
  id: 'my-first-subscription',
  defaultValue: 0,
  inputs: [],
  onSubscribe: (vals, setter) => {

    // This could represent opening a websocket
    const interval = setInterval(() => {
      setter(n => n + 1);
    }, 1000);

    return { 
      onUnsubscribe: () => window.clearInterval(interval), 
    };
  }
});

export const Component = () => {
  const [inc] = useValues(currentIncrementVal);
  return <div>
    <p>Current Val: {inc}</p>
  </div>;
};
```

# Reusable Components

A serious issue with maintaining state outside of React is how hard it makes it to change a singleton component into a reusable component. Redab was built from the ground up with this issue in mind. Every atom can optionally store multiple versions of the data with each version associated with a key. And if each component has a key (injected via Context), they can implicitly manage their own version of state. And you can mix and match component state and global state (for example username shouldn't be global) by simply specifying on the atom if "multi" is true or false.

What this looks like without React:

```js
import { atom } from 'redab';

const a = atom({ data: 5, multi: true });
a.get('key1'); // 5
a.get('key2'); // 5
a.set(1, 'key1');
a.set(4, 'key2');
a.get('key1'); // 1
a.get('key2'); // 4
```

The hooks `useValues` and `useActions` grab the key from React Context and pass it to the atoms under the hood. All you have to do is wrap your reusable component in this Context. Here's what this looks like:

```js
import React from 'react';
import { atom, selector, useValues, useActions } from 'redab';

const currValAtom = atom({ data: 0, multi: true });
const valSquaredSelector = selector({ inputs: [currValAtom], func: n => n ** 2 });

const ListItem = React.memo(() => {
  const [squared] = useValues(valSquaredSelector);
  const [updateVal] = useActions(currValAtom);

  return <div>
    <p>Squared Value: ${squared}</p>
    <button onClick={() => updateVal(n => n + 1)}>Increment Value</button>
  </div>;
});

const ReusableListItem = WithKey(ListItem, { 
  onMount: (props, key) => {
    currValAtom.set(props.val, key);
  },
});

export const Component = () => {
  return <>
    <ReusableListItem val={1} />
    <ReusableListItem val={2} />
    <ReusableListItem val={3} />
  </>
};
```

# Actions

Frequently, an effect consists of more than just setting the value on a single atom. It often consists of using the state of existing atoms/selector plus the passed value to set the value of multiple atoms. 

You might ask: why don't you just get all the data you need in the component and apply the required logic in a callback function - or alternatively write a normal function outside of the component. You can and it will work! But redab actions have several advantages.

1. They avoid passing unnecessary state (state only used in a callback) to the component. This prevents over-rendering and generally results in easier to maintain code. 
2. The `useActions` hook automatically injects the right key into `atom.get()`, which allows your code to become reusable without any added effort.
3. If you set multiple atoms at once, all updates are batched behind the scenes for better performance.
4. The redab store logs the action and information associated with it as a special event. This leads to better transparency.

```js
import React from 'react';
import { createAction, atom, useActions } from 'redab';

const atom1 = atom(1);
const atom2 = atom(2);
const atom3 = atom(3);

const moveDataAction = createAction({
  id: 'my-first-action',
  use: { atom1, atom2, atom3 },
  func: ({ atom1, atom2, atom3 }) => (plus) => {
    atom2.set(atom1.get()) + plus);
    atom3.set(atom1.get()) + plus;
  },
});

export const Component = () => {

  // Technically you don't need this hook if this component never becomes reusable
  // You can just call the action directly
  const [moveData] = useActions(moveDataAction);

  return <button onClick={() => moveData(42)}>Move Data</button>;
};
```

# Async Actions

The counterpart to regular actions are async actions. They do much the same thing but they manage async side effects. They are useful for thing like uploading data into a database.

```js
import React from 'react';
import { createAsyncAction, atom } from 'redab';
import api from './api';

const formAtom = atom({ soMuchInfo: true });

const [saveForm, loadingSelector, errorSelector] = createAsyncAction({
  id: 'my-first-async-action',
  use: { formAtom },
  func: ({ formAtom }, status) => async (username) => {

    status.onCancel = () => {
      console.log('A new action was fired before the previous finished');
    };

    await api.save({ ...formAtom.get(), username });
  }
});

export const Component = () => {

  // Technically you don't need this hook if this component never becomes reusable
  // You can just call the action directly
  const [save] = useActions(saveForm);

  return <button onClick={() => save('humflelump').catch(console.error)}>Save Form</button>;
};
```

# Dynamic Selectors

A close relative of the regular selector, the dynamic selector allows for dynamic changes to the dependency graph. So a change to the value of an atom might actually unsubscribe a component from the selector because it no longer needs the result. This can be useful in situation where you want to switch between two different algorithms or data sources. The example will make it more clear. PS thank you recoil for the idea.

```js
import React from 'react';
import { atom, selector, dynamicSelector, useActions, useValues } from 'redab';

const valueAtom = atom(100000);
const algorithmType = atom('type1');

const algorithm1Result = selector({
  inputs: [valueAtom],
  func: (n) => {
    let sum = 0;
    for (let i = 1; i <= n; i += 1) {
      sum += i;
    }
    return sum;
  }
});

const algorithm2Result = selector({
  inputs: [valueAtom],
  func: (n) => {
    return (n + 1) * n / 2;
  }
});

// Only the relevant algorithm will be calculated
// This can also work for async selectors or even subscriptions!
const resultSelector = dynamicSelector((get) => {
  if (get(algorithmType) === 'type1') {
    return get(algorithm1Result);
  } else {
    return get(algorithm2Result);
  }
});

export const Component = () => {
  const [setType] = useActions(algorithmType);
  const [result] = useValues(resultSelector);

  return <>
    <p>Result: {result}</p>
    <button onClick={() => setType(t => t === 'type1' ? 'type2' : 'type1')}>
      Toggle Type
    </button>
  </>;
};
```

# Throttled Selectors

If you have an expensive calculation or a calculation that leads to an expensive render event, you may want to wrap the calculation in a throttled selector to create a better user experience.

```js
import React from 'react';
import _ from 'lodash';
import { atom, createThrottledSelector, useValues, useActions } from 'redab';

// Even if the user updates this rapidly, the rendering won't overload their computer.
const listCountAtom = atom(1000);

const listItemsSelector = createThrottledSelector({
  id: 'my-first-throttled-selector',
  inputs: [listCountAtom],
  throttle: f => _.debounce(f, 400),
  func: (count) => {
    return Array(count).fill(0).map((d, i) => ({ id: i }));
  }
});

export const Component = () => {
  const [setCount] = useActions(listCountAtom);
  const [list] = useValues(listItemsSelector);

  return <>
    <button onClick={() => setCount(Math.floor(Math.random() * 1000))}>
      Update List Size
    </button>
    <p>List:</p>
    {
      list.map((item) => {
        return <div key={item.id}>{item.id}</div>
      })
    }
  </>;
};
```

# Grouping Atoms Together

It's good practice to give every atom an "id" for logging and persistence reasons. However this can lead to a lot of boilerplate. To help with this and generally improve readability, you should usually group related atom into the same data structure.

```js
import { createMolecule } from 'redab';

const slice = createMolecule({
  key: 'userData',
  multi: false,
  slice: {
    username: 'humflelump',
    age: 42,
    hobby: 'coding',
  },
});

slice.username.get(); // "humflelump"
slice.username.getId(); // "userData.username"
slice.age.set(24);
slice.age.get(); // 24
```

# Logging Events with Middleware

Redab provides a default store that is injected into every atom. This provides a way to log or even manipulate atom change events.

```js
import { DEFAULT_STORE } from 'redab';

DEFAULT_STORE.setMiddlware((next, curr, atom, key) => {
  console.log(atom.getId(), 'changed from', curr, 'to', next);
  return next;
});
```
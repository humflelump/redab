import { atom } from 'redab-core';
import { selector } from 'redab-core';
import { DEFAULT_STORE, IStore } from 'redab-core';
import { Atom, AtomOrSelector, Selector } from 'redab-core';
import { createId } from './helpers/createId';
import { transformDependencies } from './action-helpers';
import { ASYNC_ACTION_STARTED } from './event-types';
import { AnyFunction, AsyncActionState } from './types';
import { Action } from '.';

const S = Symbol;
const s1 = S();
const s2 = S();
const s3 = S();
const s4 = S();

export function createAsyncAction<
  Use extends { [key: string]: AtomOrSelector<any> | Action<AnyFunction> },
  Func extends (...p: any[]) => Promise<any>
>(props: {
  id?: string;
  use: Use;
  func: (node: Use, status: AsyncActionState) => Func;
  multi?: boolean;
  key?: any;
  loggingMap?: Map<Atom<any>, any>;
  store?: IStore;
}): [Action<Func>, Selector<boolean>, Selector<Error | undefined>];

export function createAsyncAction(props) {
  const { func, key, multi } = props;
  const id = props.id || '-';
  const uid = createId();
  const store: IStore = props.store || DEFAULT_STORE;

  const metadata = { asyncAction: uid, id };

  const isLoadingAtom =
    props[s1] ||
    atom({
      id: `load_${id}`,
      data: false,
      multi,
      store,
      metadata,
    });
  const errorAtom =
    props[s2] ||
    atom({
      id: `er_${id}`,
      data: void 0,
      multi,
      store,
      metadata,
    });
  const isLoadingSelector =
    props[s3] ||
    selector({
      id: `load_${id}`,
      inputs: [isLoadingAtom as any],
      func: (d) => d,
      metadata,
    });
  const errorSelector =
    props[s4] ||
    selector({
      id: `er_${id}`,
      inputs: [errorAtom as any],
      func: (d) => d,
      metadata,
    });
  const actionStates = {};
  let mostRecentAction = null as string | null;
  const action = (...params) => {
    const loggingMap = props.loggingMap || new Map();
    props = {
      ...props,
      use: transformDependencies(props.use, props.key, loggingMap),
    };

    // there is a currently pending action
    const status = actionStates[mostRecentAction];
    if (status) {
      status.cancelled = true;
      status.onCancel();
      delete actionStates[mostRecentAction];
    }

    isLoadingAtom.set(true, key);
    errorAtom.set(void 0);

    const callId = createId();

    store.sendMessage({
      type: 'ASYNC_ACTION_STARTED',
      id,
      arguments: params,
      callId,
    } as ASYNC_ACTION_STARTED);

    mostRecentAction = callId;
    actionStates[callId] = { id: callId, cancelled: false, onCancel: (_) => _ };
    const finish = (error: any, res) => {
      if (callId === mostRecentAction) {
        isLoadingAtom.set(false, key);
        if (error !== void 0) {
          errorAtom.set(error, key);
        }
      }
      delete actionStates[callId];
      const atomList: any = Array.from(loggingMap.keys());
      const atomVals = atomList.map((a) => loggingMap.get(a));
      store.sendMessage({
        type: 'ASYNC_ACTION_ENDED',
        id,
        callId,
        cancelled: callId !== mostRecentAction,
        hasError: Boolean(error),
        returnVal: error || res,
        updates: atomList.map((atom, i) => ({ atom, value: atomVals[i] })),
      });
    };

    return new Promise((resolve, reject) => {
      func(
        props.use,
        actionStates[callId]
      )(...params)
        .then((res) => {
          finish(void 0, res);
          resolve(res);
        })
        .catch((e) => {
          finish(e, void 0);
          reject(e);
        });
    });
  };

  action.construct = (key, loggingMap) => {
    return createAsyncAction({
      ...props,
      key,
      loggingMap,
      [s1]: isLoadingAtom,
      [s2]: errorAtom,
      [s3]: isLoadingSelector,
      [s4]: errorSelector,
    })[0];
  };

  return [action, isLoadingSelector, errorSelector] as any;
}

import { NO_KEY } from '../constants';

function evalMiddleware(atom, val, prev, store, extraMiddleware, key) {
  if (extraMiddleware) {
    for (let i = 0; i < extraMiddleware.length; i++) {
      val = extraMiddleware[i](val, prev, atom, key);
    }
  }
  const middleware = store.middleware;
  for (let i = 0; i < middleware.length; i++) {
    val = middleware[i](val, prev, atom, key);
  }
  return val;
}

export const atomMethods = {
  get(key) {
    key = this.multi ? key : NO_KEY;
    if (!this.data.has(key)) {
      this.data.set(key, this.init(key));
      this.visit(key);
    }
    return this.data.get(key);
  },

  set(val, origKey) {
    const key = this.multi ? origKey : NO_KEY;
    val = evalMiddleware(
      this,
      val,
      this.data.has(key) ? this.data.get(key) : this.init(key),
      this.store,
      this.middleware,
      origKey
    );
    const changed = val !== this.get(key);
    if (changed) {
      this.setCount += 1;
      this.data.set(key, val);
      this.revokeCache(origKey);
      this.emit(key);
    }
  },

  update(f, key) {
    const next = f(this.get(key));
    this.set(next, key);
  },

  emit(key) {
    if (this.notifyListeners.get(key) === false) return;
    this.getListeners(key).forEach((f) => f(this));
  },

  setIfShouldNotifyListeners(bool, key) {
    key = this.multi ? key : NO_KEY;
    this.notifyListeners.set(key, bool);
  },
};

import { NO_DUPE_KEY } from './constants';

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
  get: function (key) {
    key = this.duplicate ? key : NO_DUPE_KEY;
    this.useCache.set(key, true);

    if (!this.data.has(key)) {
      this.data.set(key, this.init(key));
      this.visit(key);
    }
    return this.data.get(key);
  },
  update: function (func, key) {
    const newVal = func(this.get(key));
    this.set(newVal, key);
  },
  set: function (val, origKey) {
    const key = this.duplicate ? origKey : NO_DUPE_KEY;
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
      this.data.set(key, val);
      this.revokeCache(new Set(), key);
      if (this.shouldNotifyListeners(key)) {
        this.getListeners(key).forEach((listener) => listener(this));
      }
    }
  },

  getDependencies() {
    return [];
  },

  setIfShouldNotifyListeners(bool, key) {
    key = this.duplicate ? key : NO_DUPE_KEY;
    this.notifyListeners.set(key, bool);
  },

  shouldNotifyListeners(key) {
    key = this.duplicate ? key : NO_DUPE_KEY;
    if (!this.notifyListeners.has(key)) return true;
    return this.notifyListeners.get(key);
  },

  addMiddleware: function (f) {
    this.middleware.push(f);
  },

  removeMiddleware: function (f) {
    this.middleware = this.middleware.filter((d) => d !== f);
  },
};

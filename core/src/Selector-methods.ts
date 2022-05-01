import { arraysDiff } from './array-diff';

export const selectorMethods = {
  get: function (key) {
    // cache is revoked when a parent atom is set
    if (this.useCache.get(key)) {
      return this.cacheVal.get(key);
    }
    this.visit(key);
    this.useCache.set(key, true);
    const vals = this.getDependencies().map((d) => d.get(key));
    if (arraysDiff(vals, this.cacheInputs.get(key))) {
      this.cacheInputs.set(key, vals);
      const result = this.func(...vals, key);
      this.cacheVal.set(key, result);
      return result;
    }
    return this.cacheVal.get(key);
  },
};

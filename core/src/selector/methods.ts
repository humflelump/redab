import { arraysDiff } from '../helpers';

export const selectorMethods = {
  get(key) {
    // cache is revoked when a parent atom is set
    if (this.useCache.get(key)) {
      return this.data.get(key);
    }
    this.visit(key);
    this.useCache.set(key, true);
    const vals = this.getDependencies().map((d) => d.get(key));
    if (arraysDiff(vals, this.cacheInputs.get(key))) {
      this.cacheInputs.set(key, vals);
      const result = this.func(...vals, key);
      this.data.set(key, result);
      this.setCount += 1;
      return result;
    }
    return this.data.get(key);
  },
};

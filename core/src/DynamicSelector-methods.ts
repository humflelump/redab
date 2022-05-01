import { arraysDiff } from './array-diff';
import { NO_DUPE_KEY } from './constants';

export const dynamicSelectorMethods = {
  get: function (key) {
    if (this.useCache.get(key)) {
      return this.cacheVal.get(key);
    }
    this.visit(key);
    this.useCache.set(key, true);
    const oldDependencies = this.getDependencies(key);
    const vals = oldDependencies.map((d) => d.get(key));
    if (arraysDiff(vals, this.cacheInputs.get(key))) {
      const newDependenciesSet: any = new Set();
      const oldDependenciesSet: any = new Set(oldDependencies);
      const getter = (atom) => {
        newDependenciesSet.add(atom);
        return atom.get(key);
      };
      const result = this.func(getter);
      this.cacheVal.set(key, result);

      // disconnect any nodes that are no longer dependencies
      for (const old of oldDependencies) {
        if (!newDependenciesSet.has(old)) {
          this.disconnect(old, key);
        }
      }
      // connect new dependencies
      for (const newDep of newDependenciesSet) {
        if (!oldDependenciesSet.has(newDep)) {
          this.connect(newDep, key);
        }
      }
      this.cacheInputs.set(
        key,
        this.getDependencies(key).map((d) => d.get(key))
      );
      return result;
    }
    return this.cacheVal.get(key);
  },

  revokeCache: function (visits, key) {
    if (visits.has(this)) return;
    visits.add(this);
    this.revokeHelper(visits, key);
    if (key === NO_DUPE_KEY) {
      for (const key of this.cacheVal.keys()) {
        this.get(key);
      }
    } else {
      this.get(key);
    }
  },
};

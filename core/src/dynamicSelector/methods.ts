import { NO_KEY } from '../constants';
import { arraysDiff, mergeCountMaps } from '../helpers';

export const dynamicSelectorMethods = {
  get: function (key) {
    if (this.useCache.get(key)) {
      return this.data.get(key);
    }
    this.visit(key);
    this.useCache.set(key, true);
    const oldDependencies = this.keyDependencies.get(key) || [];
    const oldDependenciesSet = new Set(oldDependencies);
    const oldFullDependencies = this.fullDependencies.get(key) || [];
    const oldFullDependenciesSet = new Set(oldFullDependencies);
    const keyVals = oldDependencies.map((d) => d.get(key));
    const setCounts = oldFullDependencies.map((d) => d.setCount);
    if (
      arraysDiff(keyVals, this.cacheInputs.get(key)) ||
      arraysDiff(setCounts, this.cacheCounts)
    ) {
      const newDependenciesSet: any = new Set();
      const newFullDependenciesSet: any = new Set();
      const getter = (node) => {
        newDependenciesSet.add(node);
        return node.get(key);
      };
      const fullGetter = (node) => {
        newFullDependenciesSet.add(node);
        return node.data;
      };
      const result = this.func(getter, fullGetter);
      this.data.set(key, result);
      this.setCount += 1;
      this.cacheCounts = setCounts;
      this.cacheInputs.set(key, keyVals);

      // disconnect any nodes that are no longer dependencies
      for (const old of oldDependencies) {
        if (!newDependenciesSet.has(old)) {
          this.disconnect(old, false, key);
        }
      }

      for (const old of oldFullDependencies) {
        if (!newFullDependenciesSet.has(old)) {
          this.disconnect(old, true, key);
        }
      }

      // connect new dependencies
      for (const newDep of newDependenciesSet) {
        if (!oldDependenciesSet.has(newDep)) {
          this.connect(newDep, false, key);
        }
      }

      for (const newDep of newFullDependenciesSet) {
        if (!oldFullDependenciesSet.has(newDep)) {
          this.connect(newDep, true, key);
        }
      }

      return result;
    }
    return this.data.get(key);
  },

  disconnect(parent, isFull, key) {
    const parentKey = parent.multi === false ? NO_KEY : key;
    let countMap = this.keyListeners.get(key) || new Map();
    if (isFull) {
      countMap = mergeCountMaps(countMap, this.fullListeners);
    }
    let parentCountMap = parent.keyListeners.get(parentKey) || new Map();
    if (isFull || parent.multi === false) {
      parentCountMap = mergeCountMaps(parentCountMap, parent.fullListeners);
    }

    for (const listener of countMap.keys()) {
      let count = Math.min(
        parentCountMap.get(listener) || 0,
        countMap.get(listener) || 0
      );
      while (count > 0) {
        parent.unsubscribe_(listener, key, isFull, new Set(), new Set());
        count--;
      }
    }

    const str = isFull ? 'full' : 'key';

    this[`${str}Dependencies`].set(
      key,
      (this[`${str}Dependencies`].get(key) || []).filter(
        (dep) => dep !== parent
      )
    );

    parent[`${str}Dependants`].set(
      parentKey,
      (parent[`${str}Dependants`].get(parentKey) || []).filter(
        (dep) => dep !== this
      )
    );
  },

  connect(parent, isFull, key) {
    const parentKey = parent.multi === false ? NO_KEY : key;
    let countMap = this.keyListeners.get(key) || new Map();
    if (isFull) {
      countMap = mergeCountMaps(countMap, this.fullListeners);
    }

    for (const listener of countMap.keys()) {
      let count = countMap.get(listener) || 0;
      while (count > 0) {
        parent.subscribe_(listener, key, isFull, new Set(), new Set());
        count--;
      }
    }

    const str = isFull ? 'full' : 'key';

    this[`${str}Dependencies`].set(key, [
      ...(this[`${str}Dependencies`].get(key) || []),
      parent,
    ]);
    parent[`${str}Dependants`].set(parentKey, [
      ...(parent[`${str}Dependants`].get(parentKey) || []),
      this,
    ]);
  },
};

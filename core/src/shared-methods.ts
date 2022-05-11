import { isAtom } from '.';
import { NO_KEY } from './constants';
import { unorderedArrayDiff } from './helpers';

export const sharedMethods = {
  subscribe_(listener, key, isFull, fullVisits, keyVisits) {
    if (this.multi === false) {
      isFull = true;
    }
    if (isFull) {
      if (fullVisits.has(this)) return;
      fullVisits.add(this);
    } else {
      if (keyVisits.has(this)) return;
      keyVisits.add(this);
    }

    if (this.listenersChanged) {
      var oldSubs = this.getListeners(key);
    }

    const countMap = isFull
      ? this.fullListeners
      : this.keyListeners.get(this.multi === false ? NO_KEY : key) || new Map();
    const currCount = countMap.get(listener) || 0;
    countMap.set(listener, currCount + 1);
    if (!isFull) {
      this.keyListeners.set(key, countMap);
    }
    if (currCount === 0 && this.listenersChanged) {
      const newSubs = this.getListeners(key);
      if (unorderedArrayDiff(oldSubs, newSubs)) {
        this.listenersChanged(newSubs, oldSubs, key);
      }
    }

    this.dependencies?.forEach((node) => {
      node.subscribe_(listener, key, isFull, fullVisits, keyVisits);
    });
    this.keyDependencies
      ?.get(this.multi === false ? NO_KEY : key)
      ?.forEach((node) => {
        node.subscribe_(listener, key, isFull, fullVisits, keyVisits);
      });
    this.fullDependencies
      ?.get(this.multi === false ? NO_KEY : key)
      ?.forEach((node) => {
        node.subscribe_(listener, key, true, fullVisits, keyVisits);
      });
  },

  subscribe(listener, key) {
    this.subscribe_(listener, key, false, new Set(), new Set());
  },

  unsubscribe_(listener, key, isFull, fullVisits, keyVisits) {
    if (this.multi === false) {
      isFull = true;
    }
    if (isFull) {
      if (fullVisits.has(this)) return;
      fullVisits.add(this);
    } else {
      if (keyVisits.has(this)) return;
      keyVisits.add(this);
    }

    if (this.listenersChanged) {
      var oldSubs = this.getListeners(
        this.isAtom() && !this.multi ? NO_KEY : key
      );
    }

    const countMap = isFull
      ? this.fullListeners
      : this.keyListeners.get(this.multi === false ? NO_KEY : key) || new Map();
    const currCount = countMap.get(listener);
    if (!currCount) return; // shouldn't happen in theory. In practice hot reload can cause this.
    if (currCount === 1) {
      countMap.delete(listener);
      if (this.listenersChanged) {
        const newSubs = this.getListeners(key);
        if (unorderedArrayDiff(oldSubs, newSubs)) {
          this.listenersChanged(newSubs, oldSubs, key);
        }
      }
    } else {
      countMap.set(listener, currCount - 1);
    }

    this.dependencies?.forEach((node) => {
      node.unsubscribe_(listener, key, isFull, fullVisits, keyVisits);
    });
    this.keyDependencies
      ?.get(this.multi === false ? NO_KEY : key)
      ?.forEach((node) => {
        node.unsubscribe_(listener, key, isFull, fullVisits, keyVisits);
      });
    this.fullDependencies
      ?.get(this.multi === false ? NO_KEY : key)
      ?.forEach((node) => {
        node.unsubscribe_(listener, key, true, fullVisits, keyVisits);
      });
  },

  unsubscribe(listener, key) {
    this.unsubscribe_(listener, key, false, new Set(), new Set());
  },

  getId() {
    return this.id;
  },

  garbageCollect(key) {
    this.setCount++;
    Object.values(this).forEach((d) => {
      if (d instanceof Map) {
        d.delete(key);
      }
    });
    for (const L of this.fullDependants.values()) {
      L.forEach((node) => {
        node.revokeHelper(new Set(), new Set(), key, true);
      });
    }
  },

  visit(key) {
    key?.nodes?.add(this);
  },

  getMetadata() {
    return this.metadata;
  },

  getListeners(key) {
    if (this.multi === false) {
      key = NO_KEY;
    }
    const s = new Set();
    const map =
      this.keyListeners.get(this.multi === false ? NO_KEY : key) || new Map();
    for (const f of map.keys()) {
      s.add(f);
    }
    for (const f of this.fullListeners.keys()) {
      s.add(f);
    }
    return Array.from(s);
  },

  getDependencies(key) {
    if (this.multi === false) {
      key = NO_KEY;
    }
    const s = new Set();
    this.dependencies?.forEach((node) => {
      s.add(node);
    });
    this.keyDependencies?.get(key)?.forEach((node) => {
      s.add(node);
    });
    this.fullDependencies?.get(key)?.forEach((node) => {
      s.add(node);
    });
    return Array.from(s);
  },

  getDependants(key) {
    if (this.multi === false) {
      key = NO_KEY;
    }
    const s = new Set();
    this.dependants?.forEach((node) => {
      s.add(node);
    });
    this.keyDependants?.get(key)?.forEach((node) => {
      s.add(node);
    });
    this.fullDependants?.get(key)?.forEach((node) => {
      s.add(node);
    });
    return Array.from(s);
  },

  isAtom() {
    return this.multi !== void 0;
  },

  revokeHelper(keyVisits, fullVisits, key, isFull) {
    if (this.isAtom()) {
      isFull = !this.multi;
    }

    if (isFull) {
      if (fullVisits.has(this)) return;
      fullVisits.add(this);
    } else {
      if (keyVisits.has(this)) return;
      keyVisits.add(this);
    }

    if (!this.isAtom()) {
      if (isFull) {
        this.useCache = new Map(); // clear all
      } else {
        this.useCache.set(key, false);
      }
    }

    this.dependants?.forEach((node) => {
      node.revokeHelper(keyVisits, fullVisits, key, isFull);
    });

    for (const L of this.fullDependants.values()) {
      L.forEach((node) => {
        node.revokeHelper(keyVisits, fullVisits, key, true);
      });
    }

    this.keyDependants
      ?.get(this.multi === false ? NO_KEY : key)
      ?.forEach((node) => {
        node.revokeHelper(keyVisits, fullVisits, key, isFull);
      });

    // this.fullDependants
    //   ?.get(this.multi === false ? NO_KEY : key)
    //   ?.forEach((node) => {
    //     node.revokeHelper(keyVisits, fullVisits, key, true);
    //   });
  },

  revokeCache(key) {
    this.revokeHelper(new Set(), new Set(), key, false);
  },
};

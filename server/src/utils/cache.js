/**
 * Lightweight in-memory cache with TTL and key-prefix invalidation.
 * Eliminates redundant database roundtrips for high-traffic read operations.
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Store a value with a Time-To-Live in seconds.
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds Default: 60s
   */
  set(key, value, ttlSeconds = 60) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Retrieve a value if not expired.
   * @param {string} key 
   * @returns {any | null}
   */
  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Delete a specific key or all keys starting with prefix.
   * E.g. invalidate('projects') will purge 'projects:all', 'projects:slug:...', etc.
   * @param {string} prefixOrKey 
   */
  invalidate(prefixOrKey) {
    for (const key of this.store.keys()) {
      if (key === prefixOrKey || key.startsWith(`${prefixOrKey}:`)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear entire cache store.
   */
  clear() {
    this.store.clear();
  }
}

export const cache = new MemoryCache();
export default cache;

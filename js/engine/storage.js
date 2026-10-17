/**
 * @file storage.js
 * @description Resilient storage adapter with automatic in-memory fallback for file:// and private browsing.
 * @namespace window.AlgoSystem.storage
 *
 * 16th Blue Bridge Cup Algorithm Learning & Visualization Platform
 * Zero-CORS, Zero-build, file:// protocol compatible.
 */
(function(global) {
  'use strict';

  global.AlgoSystem = global.AlgoSystem || {};

  // Standard Storage Keys Contract (Matching PROJECT.md & visualizer specs)
  const StorageKeys = Object.freeze({
    DASHBOARD_PROGRESS: 'LANQIAO_ALGO_DASHBOARD_PROGRESS_V1',
    SETTINGS: 'LANQIAO_ALGO_SETTINGS_V1',
    ACTIVE_TOPIC: 'LANQIAO_ALGO_ACTIVE_TOPIC_V1',
    CALCULATOR_PRESETS: 'LANQIAO_ALGO_CALC_PRESETS_V1'
  });

  class StorageAdapter {
    /**
     * @param {Object} [options]
     * @param {string} [options.prefix='']
     */
    constructor(options = {}) {
      this.prefix = typeof options.prefix === 'string' ? options.prefix : '';
      this._memoryStore = {};
      this._isLocalStorageAvailable = this._checkLocalStorageAvailability();

      if (!this._isLocalStorageAvailable) {
        console.warn('[AlgoSystem.Storage] localStorage is unavailable (file:// sandbox or private browsing). Operating in in-memory fallback mode.');
      }
    }

    /**
     * Test whether localStorage is accessible and writeable.
     * @private
     */
    _checkLocalStorageAvailability() {
      try {
        if (typeof window === 'undefined' || !('localStorage' in window)) {
          return false;
        }
        const testKey = '__algosystem_test__';
        window.localStorage.setItem(testKey, testKey);
        const retrieved = window.localStorage.getItem(testKey);
        window.localStorage.removeItem(testKey);
        return retrieved === testKey;
      } catch (e) {
        return false;
      }
    }

    /**
     * Format key with prefix.
     * @private
     */
    _getKey(key) {
      return this.prefix ? `${this.prefix}${key}` : key;
    }

    /**
     * Check if persistent localStorage is active.
     * @returns {boolean}
     */
    isPersistent() {
      return this._isLocalStorageAvailable;
    }

    /**
     * Retrieve an item. Returns defaultValue if not found or corrupted.
     * @param {string} key
     * @param {*} [defaultValue=null]
     * @returns {*}
     */
    get(key, defaultValue = null) {
      if (typeof key !== 'string' || !key) return defaultValue;
      const fullKey = this._getKey(key);

      // Check persistent localStorage first
      if (this._isLocalStorageAvailable) {
        try {
          const raw = window.localStorage.getItem(fullKey);
          if (raw !== null && raw !== undefined) {
            try {
              return JSON.parse(raw);
            } catch (jsonErr) {
              // Return raw string if not JSON
              return raw;
            }
          }
        } catch (e) {
          console.warn(`[AlgoSystem.Storage] Failed reading '${fullKey}' from localStorage. Falling back to memory:`, e);
        }
      }

      // Memory fallback check (handles QuotaExceededError or SecurityError)
      if (Object.prototype.hasOwnProperty.call(this._memoryStore, fullKey)) {
        return this._memoryStore[fullKey];
      }
      return defaultValue;
    }

    /**
     * Store an item. Value is automatically JSON-serialized.
     * @param {string} key
     * @param {*} value
     * @returns {boolean} True if successfully stored
     */
    set(key, value) {
      if (typeof key !== 'string' || !key) return false;
      const fullKey = this._getKey(key);

      // Update in-memory copy always (provides instantaneous fallback)
      this._memoryStore[fullKey] = value;

      if (this._isLocalStorageAvailable) {
        try {
          const serialized = JSON.stringify(value);
          window.localStorage.setItem(fullKey, serialized);
          return true;
        } catch (e) {
          console.warn(`[AlgoSystem.Storage] Failed writing '${fullKey}' to localStorage (quota exceeded or sandboxed). Retaining in-memory:`, e);
          return true; // Still true because memory store has it
        }
      }
      return true;
    }

    /**
     * Remove an item by key.
     * @param {string} key
     * @returns {boolean}
     */
    remove(key) {
      if (typeof key !== 'string' || !key) return false;
      const fullKey = this._getKey(key);

      delete this._memoryStore[fullKey];

      if (this._isLocalStorageAvailable) {
        try {
          window.localStorage.removeItem(fullKey);
        } catch (e) {
          console.warn(`[AlgoSystem.Storage] Failed removing '${fullKey}' from localStorage:`, e);
        }
      }
      return true;
    }

    /**
     * Check if key exists.
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
      if (typeof key !== 'string' || !key) return false;
      const fullKey = this._getKey(key);

      if (this._isLocalStorageAvailable) {
        try {
          if (window.localStorage.getItem(fullKey) !== null) {
            return true;
          }
        } catch (e) {
          // ignore error and check memory
        }
      }
      return Object.prototype.hasOwnProperty.call(this._memoryStore, fullKey);
    }

    /**
     * Clear all keys stored under this adapter prefix.
     */
    clear() {
      this._memoryStore = {};

      if (this._isLocalStorageAvailable) {
        try {
          if (!this.prefix) {
            window.localStorage.clear();
          } else {
            // Remove only keys matching prefix
            const toRemove = [];
            for (let i = 0; i < window.localStorage.length; i++) {
              const k = window.localStorage.key(i);
              if (k && k.startsWith(this.prefix)) {
                toRemove.push(k);
              }
            }
            toRemove.forEach(k => window.localStorage.removeItem(k));
          }
        } catch (e) {
          console.warn('[AlgoSystem.Storage] Failed clearing localStorage:', e);
        }
      }
      return true;
    }

    /**
     * Export all stored keys and values as a JSON string (for user backup/restore).
     * @returns {string}
     */
    exportJSON() {
      const dump = {};
      if (this._isLocalStorageAvailable) {
        try {
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && (!this.prefix || k.startsWith(this.prefix))) {
              const cleanKey = (this.prefix && k.startsWith(this.prefix))
                ? k.slice(this.prefix.length)
                : k;
              dump[cleanKey] = this.get(cleanKey);
            }
          }
        } catch (e) {
          console.warn('[AlgoSystem.Storage] Export partially failed from localStorage:', e);
        }
      }
      // Merge memory store
      Object.keys(this._memoryStore).forEach(k => {
        if (!this.prefix || k.startsWith(this.prefix)) {
          const cleanKey = (this.prefix && k.startsWith(this.prefix))
            ? k.slice(this.prefix.length)
            : k;
          if (!Object.prototype.hasOwnProperty.call(dump, cleanKey)) {
            dump[cleanKey] = this._memoryStore[k];
          }
        }
      });
      return JSON.stringify(dump, null, 2);
    }

    /**
     * Import a previously exported JSON backup into storage.
     * @param {string|Object} jsonBackup
     * @returns {boolean}
     */
    importJSON(jsonBackup) {
      try {
        const obj = typeof jsonBackup === 'string' ? JSON.parse(jsonBackup) : jsonBackup;
        if (!obj || typeof obj !== 'object') return false;
        Object.keys(obj).forEach(key => {
          const cleanKey = (this.prefix && key.startsWith(this.prefix))
            ? key.slice(this.prefix.length)
            : key;
          this.set(cleanKey, obj[key]);
        });
        return true;
      } catch (e) {
        console.error('[AlgoSystem.Storage] Failed importing JSON backup:', e);
        return false;
      }
    }
  }

  // Create default singleton instance
  const defaultStorage = new StorageAdapter();

  // Namespace Exports
  global.AlgoSystem.StorageAdapter = StorageAdapter;
  global.AlgoSystem.StorageKeys = StorageKeys;
  global.AlgoSystem.storage = defaultStorage;

  // Mount onto engine subsystem (matching PROJECT.md contract)
  global.AlgoSystem.engine = global.AlgoSystem.engine || {};
  global.AlgoSystem.engine.storage = defaultStorage;

})(typeof window !== 'undefined' ? window : globalThis);

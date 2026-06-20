class StateManager {
  #state = {};
  #listeners = new Map();
  #history = [];
  #historyIndex = -1;
  #maxHistory = 50;

  constructor(initialState = {}) {
    this.#state = this.#deepClone(initialState);
    this.#initializeProxy();
  }

  #initializeProxy() {
    const self = this;
    this.#state = new Proxy(this.#state, {
      set(target, property, value) {
        const oldValue = target[property];
        target[property] = value;
        self.#notify(property, value, oldValue);
        self.#addToHistory(property, value, oldValue);
        return true;
      },
      get(target, property) {
        if (typeof target[property] === 'object' && target[property] !== null) {
          return new Proxy(target[property], {
            set(obj, prop, val) {
              const oldVal = obj[prop];
              obj[prop] = val;
              self.#notify(`${property}.${prop}`, val, oldVal);
              return true;
            }
          });
        }
        return target[property];
      }
    });
  }

  getState(path) {
    if (!path) return this.#deepClone(this.#state);
    return this.#deepClone(this.#getNestedValue(this.#state, path));
  }

  setState(path, value) {
    this.#setNestedValue(this.#state, path, value);
  }

  subscribe(path, callback) {
    if (!this.#listeners.has(path)) {
      this.#listeners.set(path, new Set());
    }
    this.#listeners.get(path).add(callback);
    return () => this.#unsubscribe(path, callback);
  }

  #unsubscribe(path, callback) {
    if (this.#listeners.has(path)) {
      this.#listeners.get(path).delete(callback);
    }
  }

  #notify(path, newValue, oldValue) {
    this.#listeners.forEach((callbacks, key) => {
      if (path.startsWith(key) || key.startsWith(path)) {
        callbacks.forEach(callback => callback(newValue, oldValue, path));
      }
    });
  }

  #addToHistory(path, value, oldValue) {
    this.#history = this.#history.slice(0, this.#historyIndex + 1);
    this.#history.push({ path, value, oldValue, timestamp: Date.now() });
    this.#historyIndex = this.#history.length - 1;
    if (this.#history.length > this.#maxHistory) {
      this.#history.shift();
      this.#historyIndex--;
    }
  }

  undo() {
    if (this.#historyIndex > 0) {
      const action = this.#history[--this.#historyIndex];
      this.#setNestedValue(this.#state, action.path, action.oldValue);
      return true;
    }
    return false;
  }

  redo() {
    if (this.#historyIndex < this.#history.length - 1) {
      const action = this.#history[++this.#historyIndex];
      this.#setNestedValue(this.#state, action.path, action.value);
      return true;
    }
    return false;
  }

  #getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  #setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  #deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (Array.isArray(obj)) return obj.map(item => this.#deepClone(item));
    const cloned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = this.#deepClone(obj[key]);
      }
    }
    return cloned;
  }

  persist(key = 'app_state') {
    try {
      localStorage.setItem(key, JSON.stringify(this.#state));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }

  restore(key = 'app_state') {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(this.#state, parsed);
        return true;
      }
    } catch (error) {
      console.error('Failed to restore state:', error);
    }
    return false;
  }
}

export default new StateManager({
  user: { isAuthenticated: true, name: 'Admin' },
  theme: 'light',
  locale: 'en'
});

class StorageManager {
  #prefix = 'nexus_';

  set(key, value) {
    try {
      localStorage.setItem(this.#prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set failed:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.#prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get failed:', error);
      return defaultValue;
    }
  }

  remove(key) {
    localStorage.removeItem(this.#prefix + key);
  }

  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.#prefix))
      .forEach(k => localStorage.removeItem(k));
  }

  has(key) {
    return localStorage.getItem(this.#prefix + key) !== null;
  }
}

export default new StorageManager();

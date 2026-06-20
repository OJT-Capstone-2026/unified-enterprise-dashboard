class ModuleRegistry {
  #modules = new Map();

  register(name, module) {
    this.#modules.set(name, module);
    return this;
  }

  get(name) {
    return this.#modules.get(name);
  }

  has(name) {
    return this.#modules.has(name);
  }

  getAll() {
    return Object.fromEntries(this.#modules);
  }

  async initializeAll(coreModules) {
    for (const [name, module] of this.#modules) {
      if (typeof module.initialize === 'function') {
        await module.initialize(coreModules);
      }
      console.log(`[Registry] Module "${name}" ready`);
    }
  }
}

export default new ModuleRegistry();

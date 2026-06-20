class OfflineManager {
  #isOnline = navigator.onLine;

  initialize() {
    window.addEventListener('online', () => this.#handleOnline());
    window.addEventListener('offline', () => this.#handleOffline());

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    }
  }

  isOnline() {
    return this.#isOnline;
  }

  #handleOnline() {
    this.#isOnline = true;
    document.dispatchEvent(new CustomEvent('app:online'));
  }

  #handleOffline() {
    this.#isOnline = false;
    document.dispatchEvent(new CustomEvent('app:offline'));
  }
}

export default new OfflineManager();

class PerformanceManager {
  #mode = 'normal';
  #metrics = {};

  startMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.#metrics[entry.name] = entry.duration;
          }
        });
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('PerformanceObserver not fully supported');
      }
    }

    window.addEventListener('load', () => {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) {
        this.#metrics.loadTime = nav.loadEventEnd - nav.startTime;
        this.#metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.startTime;
      }
    });
  }

  getMode() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData || connection?.effectiveType === '2g') {
      this.#mode = 'low-power';
    } else if (connection?.effectiveType === '4g') {
      this.#mode = 'high-performance';
    }
    return this.#mode;
  }

  getMetrics() {
    return { ...this.#metrics };
  }

  measure(name, fn) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    this.#metrics[name] = duration;
    return result;
  }

  async measureAsync(name, fn) {
    const start = performance.now();
    const result = await fn();
    this.#metrics[name] = performance.now() - start;
    return result;
  }
}

export default new PerformanceManager();

class AccessibilityManager {
  initialize() {
    this.#setupSkipLink();
    this.#setupFocusTrap();
    this.#setupAriaLive();
    this.#enhanceKeyboardNav();
  }

  #setupSkipLink() {
    const skip = document.createElement('a');
    skip.href = '#page-content';
    skip.textContent = 'Skip to main content';
    skip.className = 'sr-only';
    skip.style.cssText = `
      position: fixed; top: -100px; left: 16px; z-index: 10000;
      background: var(--brand-primary); color: white; padding: 8px 16px;
      border-radius: 8px; font-weight: 600; transition: top 0.2s;
    `;
    skip.addEventListener('focus', () => { skip.style.top = '16px'; });
    skip.addEventListener('blur', () => { skip.style.top = '-100px'; });
    document.body.prepend(skip);
  }

  #setupFocusTrap() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const modal = document.querySelector('.modal.active');
      if (!modal) return;

      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  #setupAriaLive() {
    const live = document.createElement('div');
    live.id = 'aria-live-region';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    live.className = 'sr-only';
    document.body.appendChild(live);
    this.liveRegion = live;
  }

  announce(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
      requestAnimationFrame(() => { this.liveRegion.textContent = message; });
    }
  }

  #enhanceKeyboardNav() {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    });
  }
}

export default new AccessibilityManager();

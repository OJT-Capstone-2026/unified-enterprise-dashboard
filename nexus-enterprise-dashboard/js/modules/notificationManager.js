class NotificationManager {
  #container = null;
  #notifications = [];
  #maxVisible = 5;
  #duration = 5000;
  #animationDuration = 400;

  constructor() {
    this.#createContainer();
  }

  #createContainer() {
    this.#container = document.getElementById('notification-container') || document.createElement('div');
    this.#container.id = 'notification-container';
    this.#container.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 12px;
      max-width: 400px; width: 100%; pointer-events: none;
    `;
    if (!this.#container.parentElement) {
      document.body.appendChild(this.#container);
    }
  }

  show(message, type = 'info', options = {}) {
    const id = Date.now() + Math.random();
    const notification = {
      id, message, type,
      duration: options.duration ?? this.#duration,
      onClose: options.onClose || null
    };

    this.#notifications.push(notification);
    this.#render(notification);
    this.#setupAutoClose(notification);
    this.#limitNotifications();
    return id;
  }

  success(message, options) { return this.show(message, 'success', options); }
  error(message, options) { return this.show(message, 'error', options); }
  warning(message, options) { return this.show(message, 'warning', options); }
  info(message, options) { return this.show(message, 'info', options); }

  #render(notification) {
    const element = document.createElement('div');
    element.dataset.id = notification.id;
    element.className = `notification notification-${notification.type}`;
    element.style.cssText = `
      pointer-events: auto; padding: 16px 20px; border-radius: 12px;
      background: var(--glass-background); backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur); border: 1px solid var(--glass-border);
      box-shadow: var(--shadow-lg); transform: translateX(120%); opacity: 0;
      transition: all ${this.#animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex; align-items: center; gap: 12px;
    `;

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

    element.innerHTML = `
      <span style="font-size: 20px;">${icons[notification.type] || '📢'}</span>
      <span style="flex: 1; font-family: var(--font-primary);">${notification.message}</span>
      <button class="notification-close" style="background:none;border:none;color:var(--neutral-600);cursor:pointer;font-size:18px;padding:4px;">✕</button>
    `;

    element.querySelector('.notification-close').addEventListener('click', () => this.#remove(notification.id));
    this.#container.appendChild(element);

    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  }

  #setupAutoClose(notification) {
    if (notification.duration > 0) {
      setTimeout(() => this.#remove(notification.id), notification.duration);
    }
  }

  #remove(id) {
    const element = this.#container.querySelector(`[data-id="${id}"]`);
    if (element) {
      element.style.transform = 'translateX(120%)';
      element.style.opacity = '0';
      setTimeout(() => {
        element.remove();
        const notification = this.#notifications.find(n => n.id === id);
        if (notification?.onClose) notification.onClose();
        this.#notifications = this.#notifications.filter(n => n.id !== id);
      }, this.#animationDuration);
    }
  }

  #limitNotifications() {
    while (this.#container.children.length > this.#maxVisible) {
      const first = this.#container.children[0];
      const id = first.dataset.id;
      if (id) this.#remove(Number(id));
      else first.remove();
    }
  }

  clear() {
    this.#container.innerHTML = '';
    this.#notifications = [];
  }
}

export default new NotificationManager();

class Router {
  #routes = new Map();
  #currentRoute = null;
  #middleware = [];
  #history = [];
  #basePath = '';
  #isPopstate = false;

  constructor(basePath = '') {
    this.#basePath = basePath;
    this.#setupListeners();
  }

  addRoute(path, component, options = {}) {
    const route = {
      path: this.#normalizePath(path),
      component,
      options: { requireAuth: false, roles: [], ...options }
    };
    this.#routes.set(route.path, route);
    return this;
  }

  addMiddleware(fn) {
    this.#middleware.push(fn);
    return this;
  }

  navigate(path, data = {}, replace = false) {
    const normalizedPath = this.#normalizePath(path);
    const route = this.#routes.get(normalizedPath);

    if (!route) {
      this.#handle404();
      return;
    }

    const context = { path: normalizedPath, data, route };

    let index = 0;
    const next = () => {
      if (index < this.#middleware.length) {
        this.#middleware[index++](context, next);
      } else {
        this.#renderRoute(context);
      }
    };

    next();

    if (!replace) {
      window.history.pushState({ path: normalizedPath, data }, '', '#' + normalizedPath);
    } else {
      window.history.replaceState({ path: normalizedPath, data }, '', '#' + normalizedPath);
    }
    this.#isPopstate = false;

    this.#currentRoute = normalizedPath;
    this.#trackRoute(normalizedPath);
    this.#updateActiveNav(normalizedPath);
  }

  async #renderRoute(context) {
    const { component } = context.route;
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    let result = typeof component === 'function' ? component(context.data) : component;

    if (result && typeof result.then === 'function') {
      result = await result;
    }

    if (typeof result === 'string') {
      pageContent.innerHTML = result;
    } else if (result instanceof HTMLElement) {
      pageContent.innerHTML = '';
      pageContent.appendChild(result);
    }

    this.#analyticsTrack(context);
    document.dispatchEvent(new CustomEvent('route:changed', { detail: context }));
  }

  #updateActiveNav(path) {
    document.querySelectorAll('[data-router]').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === path || (path === '/' && href === '/'));
    });
  }

  #setupListeners() {
    window.addEventListener('popstate', (event) => {
      const hashPath = window.location.hash.slice(1) || '/';
      const { path, data } = event.state || { path: hashPath, data: {} };
      this.#isPopstate = true;
      this.navigate(path, data, true);
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-router]');
      if (link) {
        event.preventDefault();
        const href = link.getAttribute('href') || link.dataset.to;
        const data = link.dataset.state ? JSON.parse(link.dataset.state) : {};
        this.navigate(href, data);
      }
    });
  }

  #normalizePath(path) {
    const normalized = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    return normalized === '' ? '/' : normalized;
  }

  #handle404() {
    const notFound = this.#routes.get('/404');
    if (notFound) {
      this.#renderRoute({ path: '/404', data: {}, route: notFound });
    }
  }

  #trackRoute(path) {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: this.#routes.get(path)?.options?.title || path
      });
    }
    this.#history.push({ path, timestamp: Date.now() });
  }

  #analyticsTrack(context) {
    console.log(`[Router] Navigated to: ${context.path}`, context.data);
  }

  getCurrentRoute() {
    return this.#currentRoute;
  }

  getHistory() {
    return this.#history;
  }
}

export default new Router();

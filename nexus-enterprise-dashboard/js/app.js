import Router from './modules/router.js';
import StateManager from './modules/stateManager.js';
import ThemeManager from './modules/themeManager.js';
import NotificationManager from './modules/notificationManager.js';
import PerformanceManager from './modules/performanceManager.js';
import AccessibilityManager from './modules/accessibilityManager.js';
import OfflineManager from './modules/offlineManager.js';
import ParticleSystem from './modules/particleSystem.js';
import I18nManager from './modules/i18n.js';
import { SEARCH_INDEX } from './utils/constants.js';
import { debounce } from './utils/helpers.js';

import Dashboard from './apps/dashboard/dashboard.js';
import Portfolio from './apps/portfolio/portfolio.js';
import Quiz from './apps/quiz/quiz.js';
import Expense from './apps/expense/expense.js';
import News from './apps/news/news.js';
import GitHub from './apps/github/github.js';
import Kanban from './apps/kanban/kanban.js';
import Settings from './apps/settings/settings.js';
import Evaluation from './apps/evaluation/evaluation.js';


class App {
  constructor() {
    this.version = '1.0.0';
    this.modules = {
      router: Router,
      state: StateManager,
      theme: ThemeManager,
      notifications: NotificationManager,
      performance: PerformanceManager,
      accessibility: AccessibilityManager,
      offline: OfflineManager,
      particles: ParticleSystem,
      i18n: I18nManager
    };

    this.apps = {
      dashboard: Dashboard,
      portfolio: Portfolio,
      quiz: Quiz,
      expense: Expense,
      news: News,
      github: GitHub,
      kanban: Kanban,
      settings: Settings,
      evaluation: Evaluation
    };
  }

  async initialize() {
    try {
      this.#showLoader();

      this.modules.performance.startMonitoring();
      await this.modules.i18n.load();

      this.#setupRoutes();
      this.modules.theme.initialize();
      this.modules.accessibility.initialize();
      this.modules.offline.initialize();
      this.modules.particles.initialize(document.body);

      this.#setupEventListeners();
      this.modules.state.restore();

      const initialPath = window.location.hash.slice(1) || '/';
      this.modules.router.navigate(initialPath);

      this.#hideLoader();

      this.modules.notifications.show(
        'Welcome to Nexus Enterprise Dashboard! Your unified productivity platform awaits.',
        'success',
        { duration: 5000 }
      );

      console.log(`🚀 Nexus Enterprise Dashboard v${this.version} initialized`);
      console.log('📊 Performance Mode:', this.modules.performance.getMode());
      console.log('🎨 Theme:', this.modules.theme.getCurrentTheme());
      console.log('🌐 Language:', this.modules.i18n.getCurrentLocale());

    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.#handleCriticalError(error);
    }
  }

  #setupRoutes() {
    this.modules.router
      .addRoute('/', this.#wrapRoute(Dashboard), { title: 'Dashboard' })
      .addRoute('/portfolio', this.#wrapRoute(Portfolio), { title: 'Portfolio' })
      .addRoute('/quiz', this.#wrapRoute(Quiz), { title: 'Quiz' })
      .addRoute('/expense', this.#wrapRoute(Expense), { title: 'Expense Tracker' })
      .addRoute('/news', this.#wrapRoute(News), { title: 'News Center' })
      .addRoute('/github', this.#wrapRoute(GitHub), { title: 'GitHub Explorer' })
      .addRoute('/kanban', this.#wrapRoute(Kanban), { title: 'Kanban Board' })
      .addRoute('/evaluation', this.#wrapRoute(Evaluation), { title: 'Evaluation Center' })
      .addRoute('/settings', this.#wrapRoute(Settings), { title: 'Settings' })
      .addRoute('/404', () => this.#render404(), { title: '404' });

    this.modules.router
      .addMiddleware(this.#authMiddleware.bind(this))
      .addMiddleware(this.#analyticsMiddleware.bind(this))
      .addMiddleware(this.#performanceMiddleware.bind(this));
  }

  #wrapRoute(app) {
    return async (data) => {
      const html = typeof app.render === 'function' ? await app.render(data) : '';
      setTimeout(() => app.onRoute?.(), 0);
      return html;
    };
  }

  #setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
      if (e.key === 'Escape') this.#closeAllModals();
    });

    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      const searchBar = searchInput.closest('.search-bar');
      let resultsEl = searchBar?.querySelector('.search-results');
      if (!resultsEl && searchBar) {
        resultsEl = document.createElement('div');
        resultsEl.className = 'search-results';
        searchBar.style.position = 'relative';
        searchBar.appendChild(resultsEl);
      }

      searchInput.addEventListener('input', debounce((e) => {
        this.#handleGlobalSearch(e.target.value, resultsEl);
      }, 200));

      searchInput.addEventListener('blur', () => {
        setTimeout(() => resultsEl?.classList.remove('active'), 200);
      });
    }

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.modules.theme.toggle();
    });

    document.getElementById('theme-toggle-mobile')?.addEventListener('click', () => {
      this.modules.theme.toggle();
    });

    document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
      document.getElementById('mobile-overlay').classList.toggle('active');
    });

    document.getElementById('mobile-overlay')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('mobile-open');
      document.getElementById('mobile-overlay').classList.remove('active');
    });

    document.getElementById('notification-btn')?.addEventListener('click', () => {
      this.modules.notifications.info('You have 3 unread notifications.');
    });

    document.addEventListener('app:offline', () => {
      this.modules.notifications.warning('You are offline. Some features may be limited.');
    });

    document.addEventListener('app:online', () => {
      this.modules.notifications.success('Back online!');
    });
  }

  #authMiddleware(context, next) {
    if (context.route.options.requireAuth) {
      const isAuthenticated = this.modules.state.getState('user.isAuthenticated');
      if (!isAuthenticated) {
        this.modules.router.navigate('/');
        return;
      }
    }
    next();
  }

  #analyticsMiddleware(context, next) {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: context.path,
        page_title: context.route?.options?.title || 'Nexus Dashboard'
      });
    }
    next();
  }

  #performanceMiddleware(context, next) {
    const start = performance.now();
    next();
    console.log(`⏱️ Route "${context.path}" rendered in ${(performance.now() - start).toFixed(2)}ms`);
  }

  #render404() {
    return `
      <div class="error-page">
        <div class="error-content">
          <div class="error-icon">404</div>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <a href="/" data-router class="btn btn-primary">Go Home</a>
        </div>
      </div>
    `;
  }

  #handleGlobalSearch(query, resultsEl) {
    if (!resultsEl) return;
    if (query.length < 1) {
      resultsEl.classList.remove('active');
      return;
    }

    const q = query.toLowerCase();
    const results = SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some(k => k.includes(q))
    );

    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
      resultsEl.innerHTML = results.map(r => `
        <div class="search-result-item" data-path="${r.path}">
          <i class="fas ${r.icon}"></i>
          <span>${r.title}</span>
        </div>
      `).join('');

      resultsEl.querySelectorAll('.search-result-item[data-path]').forEach(item => {
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.modules.router.navigate(item.dataset.path);
          document.getElementById('global-search').value = '';
          resultsEl.classList.remove('active');
        });
      });
    }

    resultsEl.classList.add('active');
  }

  #closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  }

  #showLoader() {
    document.getElementById('loader')?.classList.add('active');
  }

  #hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.remove('active');
      setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
  }

  #handleCriticalError(error) {
    this.modules.notifications.show('Critical error occurred. Please refresh the page.', 'error', { duration: 0 });
    console.error('Critical Error:', error);
  }
}

export default App;

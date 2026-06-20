import StateManager from './stateManager.js';

class ThemeManager {
  #currentTheme = 'light';

  initialize() {
    const stored = localStorage.getItem('nexus_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.#currentTheme = stored || (prefersDark ? 'dark' : 'light');
    this.apply(this.#currentTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('nexus_theme')) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  apply(theme) {
    this.#currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    StateManager.setState('theme', theme);
    localStorage.setItem('nexus_theme', theme);
    this.#updateIcons(theme);
  }

  toggle() {
    this.apply(this.#currentTheme === 'light' ? 'dark' : 'light');
  }

  getCurrentTheme() {
    return this.#currentTheme;
  }

  #updateIcons(theme) {
    const icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i, .theme-toggle i').forEach(el => {
      el.className = `fas ${icon}`;
    });
  }
}

export default new ThemeManager();

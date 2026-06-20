class I18nManager {
  #locale = 'en';
  #translations = new Map();
  #fallbackLocale = 'en';

  constructor() {}

  async load() {
    const locales = ['en', 'es', 'fr'];
    for (const locale of locales) {
      try {
        const response = await fetch(`./locales/${locale}.json`);
        if (response.ok) {
          this.#translations.set(locale, await response.json());
        }
      } catch (error) {
        console.warn(`Failed to load locale ${locale}:`, error);
      }
    }
    this.#detectLocale();
    this.#updateUI();
  }

  #detectLocale() {
    const stored = localStorage.getItem('app_locale');
    if (stored && this.#translations.has(stored)) {
      this.#locale = stored;
      return;
    }
    const browserLocale = navigator.language.split('-')[0];
    if (this.#translations.has(browserLocale)) {
      this.#locale = browserLocale;
    }
  }

  t(key, params = {}) {
    const translation = this.#getTranslation(key);
    if (!translation || translation === key) return key;
    return translation.replace(/\{\{(\w+)\}\}/g, (match, k) =>
      params[k] !== undefined ? params[k] : match
    );
  }

  #getTranslation(key) {
    const localeData = this.#translations.get(this.#locale) || this.#translations.get(this.#fallbackLocale);
    if (!localeData) return key;
    return key.split('.').reduce((obj, k) => obj?.[k], localeData) || key;
  }

  setLocale(locale) {
    if (this.#translations.has(locale)) {
      this.#locale = locale;
      localStorage.setItem('app_locale', locale);
      this.#updateUI();
      return true;
    }
    return false;
  }

  #updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    document.documentElement.lang = this.#locale;
  }

  getCurrentLocale() {
    return this.#locale;
  }

  getAvailableLocales() {
    return Array.from(this.#translations.keys());
  }
}

export default new I18nManager();

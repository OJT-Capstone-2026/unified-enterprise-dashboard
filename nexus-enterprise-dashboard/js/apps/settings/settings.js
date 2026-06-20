import ThemeManager from '../../modules/themeManager.js';
import I18nManager from '../../modules/i18n.js';
import StorageManager from '../../modules/storageManager.js';
import NotificationManager from '../../modules/notificationManager.js';
import StateManager from '../../modules/stateManager.js';
import { APP_VERSION } from '../../utils/constants.js';

let activeTab = 'general';

const Settings = {
  render() {
    return `
      <div class="page-header">
        <h1>Settings</h1>
        <p>Customize your Nexus Enterprise experience.</p>
      </div>

      <div class="settings-grid">
        <nav class="settings-nav">
          <button class="${activeTab === 'general' ? 'active' : ''}" data-tab="general"><i class="fas fa-sliders-h"></i> General</button>
          <button class="${activeTab === 'appearance' ? 'active' : ''}" data-tab="appearance"><i class="fas fa-palette"></i> Appearance</button>
          <button class="${activeTab === 'notifications' ? 'active' : ''}" data-tab="notifications"><i class="fas fa-bell"></i> Notifications</button>
          <button class="${activeTab === 'data' ? 'active' : ''}" data-tab="data"><i class="fas fa-database"></i> Data</button>
          <button class="${activeTab === 'about' ? 'active' : ''}" data-tab="about"><i class="fas fa-info-circle"></i> About</button>
        </nav>

        <div class="card" id="settings-content">
          ${this._renderTab(activeTab)}
        </div>
      </div>
    `;
  },

  _renderTab(tab) {
    const locale = I18nManager.getCurrentLocale();
    const theme = ThemeManager.getCurrentTheme();

    const tabs = {
      general: `
        <h3 class="card-title mb-4">General Settings</h3>
        <div class="setting-row">
          <div class="setting-info"><h4>Language</h4><p>Choose your preferred language</p></div>
          <select id="locale-select" class="form-control" style="width:auto;">
            <option value="en" ${locale === 'en' ? 'selected' : ''}>English</option>
            <option value="es" ${locale === 'es' ? 'selected' : ''}>Español</option>
            <option value="fr" ${locale === 'fr' ? 'selected' : ''}>Français</option>
          </select>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Keyboard Shortcuts</h4><p>Enable power-user shortcuts</p></div>
          <div class="toggle-switch active" id="toggle-shortcuts"></div>
        </div>
      `,
      appearance: `
        <h3 class="card-title mb-4">Appearance</h3>
        <div class="setting-row">
          <div class="setting-info"><h4>Dark Mode</h4><p>Toggle between light and dark themes</p></div>
          <div class="toggle-switch ${theme === 'dark' ? 'active' : ''}" id="toggle-theme"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Particle Background</h4><p>Animated particle network effect</p></div>
          <div class="toggle-switch ${StorageManager.get('particles', true) ? 'active' : ''}" id="toggle-particles"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Reduced Motion</h4><p>Minimize animations for accessibility</p></div>
          <div class="toggle-switch" id="toggle-motion"></div>
        </div>
      `,
      notifications: `
        <h3 class="card-title mb-4">Notifications</h3>
        <div class="setting-row">
          <div class="setting-info"><h4>Toast Notifications</h4><p>Show in-app notification toasts</p></div>
          <div class="toggle-switch active" id="toggle-toasts"></div>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Test Notification</h4><p>Send a sample notification</p></div>
          <button class="btn btn-secondary btn-sm" id="test-notification">Send Test</button>
        </div>
      `,
      data: `
        <h3 class="card-title mb-4">Data Management</h3>
        <div class="setting-row">
          <div class="setting-info"><h4>Export Data</h4><p>Download all app data as JSON</p></div>
          <button class="btn btn-secondary btn-sm" id="export-data"><i class="fas fa-download"></i> Export</button>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Clear All Data</h4><p>Reset all stored preferences and data</p></div>
          <button class="btn btn-danger btn-sm" id="clear-data"><i class="fas fa-trash"></i> Clear</button>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Undo Last Change</h4><p>Revert the most recent state change</p></div>
          <button class="btn btn-secondary btn-sm" id="undo-state"><i class="fas fa-undo"></i> Undo</button>
        </div>
      `,
      about: `
        <h3 class="card-title mb-4">About Nexus</h3>
        <div class="setting-row">
          <div class="setting-info"><h4>Version</h4><p>Nexus Enterprise Dashboard</p></div>
          <span class="badge badge-primary">v${APP_VERSION}</span>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>Architecture</h4><p>Vanilla JavaScript SPA</p></div>
          <span class="code">ES Modules</span>
        </div>
        <div class="setting-row">
          <div class="setting-info"><h4>License</h4><p>MIT License</p></div>
          <a href="#" class="btn btn-sm btn-secondary">View License</a>
        </div>
      `
    };

    return tabs[tab] || tabs.general;
  },

  onRoute() {
    document.querySelector('.settings-nav')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tab]');
      if (!btn) return;
      activeTab = btn.dataset.tab;
      document.getElementById('page-content').innerHTML = this.render();
      this.onRoute();
    });

    document.getElementById('locale-select')?.addEventListener('change', (e) => {
      I18nManager.setLocale(e.target.value);
      NotificationManager.success(`Language changed to ${e.target.value}`);
    });

    document.getElementById('toggle-theme')?.addEventListener('click', (e) => {
      ThemeManager.toggle();
      e.target.classList.toggle('active');
    });

    document.getElementById('toggle-particles')?.addEventListener('click', (e) => {
      e.target.classList.toggle('active');
      StorageManager.set('particles', e.target.classList.contains('active'));
    });

    document.getElementById('test-notification')?.addEventListener('click', () => {
      NotificationManager.info('This is a test notification from Settings.');
    });

    document.getElementById('export-data')?.addEventListener('click', () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('nexus_') || key === 'app_state' || key === 'nexus_theme') {
          data[key] = JSON.parse(localStorage.getItem(key));
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'nexus-export.json';
      a.click();
      NotificationManager.success('Data exported successfully');
    });

    document.getElementById('clear-data')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        StorageManager.clear();
        localStorage.removeItem('app_state');
        NotificationManager.warning('All data cleared');
      }
    });

    document.getElementById('undo-state')?.addEventListener('click', () => {
      if (StateManager.undo()) {
        NotificationManager.info('Last change undone');
      } else {
        NotificationManager.warning('Nothing to undo');
      }
    });

    document.querySelectorAll('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', () => toggle.classList.toggle('active'));
    });
  }
};

export default Settings;

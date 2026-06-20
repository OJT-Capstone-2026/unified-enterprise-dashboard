import { fetchNews } from './api.js';
import { filterNews } from './filters.js';
import { formatRelativeTime, truncate } from '../../utils/formatters.js';

let newsArticles = [];
let newsFilter = 'all';

const News = {
  async render() {
    return `
      <div class="page-header">
        <h1>News Center</h1>
        <p>Stay informed with the latest enterprise and technology headlines.</p>
      </div>

      <div class="flex gap-3 mb-6" id="news-filters">
        ${['all', 'technology', 'business', 'science'].map(f => `
          <button class="btn btn-sm ${f === 'all' ? 'btn-primary' : 'btn-secondary'}" data-filter="${f}">
            ${f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        `).join('')}
      </div>

      <div class="news-grid" id="news-grid">
        <div class="card text-center" style="grid-column: 1/-1; padding: var(--space-8);">
          <div class="loader-spinner" style="margin: 0 auto var(--space-4);"></div>
          <p>Loading latest news...</p>
        </div>
      </div>
    `;
  },

  _renderArticles(articles) {
    const icons = { technology: 'fa-microchip', business: 'fa-briefcase', science: 'fa-flask', general: 'fa-globe' };
    return articles.map(a => `
      <article class="news-card animate-slide-up">
        <div class="news-card-image"><i class="fas ${icons[a.category] || 'fa-newspaper'}"></i></div>
        <div class="news-card-body">
          <div class="news-card-source">${a.source} · ${formatRelativeTime(a.publishedAt)}</div>
          <h3 class="news-card-title">${a.title}</h3>
          <p class="news-card-excerpt">${truncate(a.description, 120)}</p>
          <a href="${a.url}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary mt-4">
            Read More <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </article>
    `).join('');
  },

  async onRoute() {
    newsArticles = await fetchNews();
    const filtered = filterNews(newsArticles, newsFilter);
    const grid = document.getElementById('news-grid');
    if (grid) grid.innerHTML = this._renderArticles(filtered);

    document.getElementById('news-filters')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      newsFilter = btn.dataset.filter;
      document.querySelectorAll('#news-filters .btn').forEach(b => {
        b.className = `btn btn-sm ${b.dataset.filter === newsFilter ? 'btn-primary' : 'btn-secondary'}`;
      });
      const filtered = filterNews(newsArticles, newsFilter);
      document.getElementById('news-grid').innerHTML = this._renderArticles(filtered);
    });
  }
};

export default News;

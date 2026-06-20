import { fetchNews } from './api.js';

let state = {
  articles: [],
  loading: false,
  searchTerm: "",
  category: "general"
};

const News = {
  render() {
    return `
      <style>
        .ln-header {
          background: #141414;
          border-bottom: 1px solid #2a2a2a;
          border-radius: 12px 12px 0 0;
          margin-bottom: 0;
        }
        .ln-header-inner {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .ln-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
        }
        .ln-logo-dot {
          width: 12px;
          height: 12px;
          background: #e63946;
          border-radius: 50%;
          animation: ln-pulse 1.4s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes ln-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.3); }
        }
        .ln-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          flex: 1;
          justify-content: flex-end;
        }
        .ln-filters input,
        .ln-filters select {
          padding: 10px 14px;
          background: #1e1e1e;
          border: 1px solid #333;
          border-radius: 8px;
          color: #fff;
          outline: none;
        }
        .ln-filters input { flex: 1; min-width: 180px; }
        .ln-search-btn {
          padding: 10px 22px;
          background: #e63946;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }
        .ln-search-btn:hover { background: #c1121f; }
        .ln-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .ln-card {
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
          transition: .3s;
        }
        .ln-card:hover { transform: translateY(-4px); border-color: #e63946; }
        .ln-card img { width: 100%; height: 200px; object-fit: cover; display: block; }
        .ln-card-body { padding: 16px; }
        .ln-card-body h3 { margin-bottom: 10px; color: white; font-size: 1rem; line-height: 1.4; }
        .ln-card-body p { color: #aaa; line-height: 1.5; margin-bottom: 15px; font-size: 0.9rem; }
        .ln-card-body a {
          display: inline-block;
          padding: 8px 14px;
          border: 1px solid #e63946;
          border-radius: 6px;
          color: #e63946;
          text-decoration: none;
          font-size: 0.85rem;
        }
        .ln-card-body a:hover { background: #e63946; color: white; }
        .ln-loader {
          width: 44px;
          height: 44px;
          border: 4px solid #2a2a2a;
          border-top: 4px solid #e63946;
          border-radius: 50%;
          animation: ln-spin .9s linear infinite;
          margin: 60px auto;
        }
        @keyframes ln-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .ln-hidden { display: none; }
        .ln-error { color: #e63946; text-align: center; padding: 30px; }
        @media(max-width:768px) {
          .ln-header-inner { flex-direction: column; align-items: flex-start; }
          .ln-filters { width: 100%; justify-content: flex-start; }
          .ln-filters input { width: 100%; }
        }
      </style>

      <div class="ln-header">
        <div class="ln-header-inner">
          <div class="ln-logo">
            <span class="ln-logo-dot"></span>
            Live News Feed
          </div>
          <div class="ln-filters">
            <input type="text" id="ln-search-input" placeholder="Search news..." value="${escapeAttr(state.searchTerm)}">
            <select id="ln-category-select">
              <option value="general"   ${state.category === 'general'    ? 'selected' : ''}>General</option>
              <option value="business"  ${state.category === 'business'   ? 'selected' : ''}>Business</option>
              <option value="technology"${state.category === 'technology' ? 'selected' : ''}>Technology</option>
              <option value="sports"    ${state.category === 'sports'     ? 'selected' : ''}>Sports</option>
              <option value="health"    ${state.category === 'health'     ? 'selected' : ''}>Health</option>
            </select>
            <button class="ln-search-btn" id="ln-search-btn">Search</button>
          </div>
        </div>
      </div>

      <div id="ln-loader" class="ln-loader ln-hidden"></div>
      <div id="ln-error-box"></div>
      <div class="ln-grid" id="ln-news-container"></div>
    `;
  },

  _renderArticles(articles) {
    if (!articles.length) {
      return '<p class="ln-error">No articles found.</p>';
    }
    return articles.map(a => `
      <div class="ln-card">
        <img src="${escapeAttr(a.urlToImage || 'https://placehold.co/400x200/1a1a1a/aaaaaa?text=No+Image')}"
             alt="${escapeAttr(a.title || '')}"
             onerror="this.src='https://placehold.co/400x200/1a1a1a/aaaaaa?text=No+Image'">
        <div class="ln-card-body">
          <h3>${escapeHtml(a.title || 'No Title')}</h3>
          <p>${escapeHtml(a.description || 'No description available.')}</p>
          <a href="${escapeAttr(a.url || '#')}" target="_blank" rel="noopener">Read More</a>
        </div>
      </div>
    `).join('');
  },

  async _load() {
    const loader = document.getElementById('ln-loader');
    const errorBox = document.getElementById('ln-error-box');
    const container = document.getElementById('ln-news-container');
    if (!loader || !container) return;

    loader.classList.remove('ln-hidden');
    errorBox.innerHTML = '';
    container.innerHTML = '';

    try {
      const articles = await fetchNews(state.searchTerm, state.category);
      state.articles = articles;
      container.innerHTML = this._renderArticles(articles);
    } catch (err) {
      errorBox.innerHTML = `<p class="ln-error">${escapeHtml(err.message)}</p>`;
    } finally {
      loader.classList.add('ln-hidden');
    }
  },

  async onRoute() {
    // Reset state on each route visit
    state = { articles: [], loading: false, searchTerm: "", category: "general" };

    // render() already ran via the router — just wire up events and load
    document.getElementById('ln-search-btn')?.addEventListener('click', () => {
      state.searchTerm = document.getElementById('ln-search-input').value.trim();
      state.category = document.getElementById('ln-category-select').value;
      this._load();
    });

    document.getElementById('ln-search-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        state.searchTerm = e.target.value.trim();
        state.category = document.getElementById('ln-category-select').value;
        this._load();
      }
    });

    await this._load();
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export default News;

import { fetchRepos, fetchUserStats } from './api.js';
import { renderContributionChart } from './charts.js';
import { formatNumber } from '../../utils/helpers.js';

const GitHub = {
  async render() {
    return `
      <div class="page-header">
        <h1><i class="fab fa-github"></i> GitHub Explorer</h1>
        <p>Explore repositories, track contributions, and analyze developer activity.</p>
      </div>

      <div class="dashboard-stats mb-6" id="github-stats">
        <div class="stat-card"><div class="loader-spinner" style="width:24px;height:24px;margin:0 auto;"></div></div>
        <div class="stat-card"><div class="loader-spinner" style="width:24px;height:24px;margin:0 auto;"></div></div>
        <div class="stat-card"><div class="loader-spinner" style="width:24px;height:24px;margin:0 auto;"></div></div>
        <div class="stat-card"><div class="loader-spinner" style="width:24px;height:24px;margin:0 auto;"></div></div>
      </div>

      <div class="grid-2 mb-6">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Contribution Activity</h3></div>
          <div id="contribution-chart" class="chart-container"></div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Language Distribution</h3></div>
          <div id="language-chart" class="chart-container" style="display:flex;align-items:center;justify-content:center;"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Repositories</h3>
          <div class="search-bar" style="max-width:280px;">
            <i class="fas fa-search"></i>
            <input type="text" id="repo-search" placeholder="Filter repos...">
          </div>
        </div>
        <div class="grid-2 gap-4" id="repo-list"></div>
      </div>
    `;
  },

  async onRoute() {
    const [stats, repos] = await Promise.all([fetchUserStats(), fetchRepos()]);

    document.getElementById('github-stats').innerHTML = `
      <div class="stat-card"><div class="stat-icon primary"><i class="fas fa-code-branch"></i></div><div><div class="stat-value">${formatNumber(stats.repos)}</div><div class="stat-label">Repositories</div></div></div>
      <div class="stat-card"><div class="stat-icon accent"><i class="fas fa-star"></i></div><div><div class="stat-value">${formatNumber(stats.stars)}</div><div class="stat-label">Total Stars</div></div></div>
      <div class="stat-card"><div class="stat-icon secondary"><i class="fas fa-code-fork"></i></div><div><div class="stat-value">${formatNumber(stats.forks)}</div><div class="stat-label">Forks</div></div></div>
      <div class="stat-card"><div class="stat-icon gold"><i class="fas fa-users"></i></div><div><div class="stat-value">${formatNumber(stats.followers)}</div><div class="stat-label">Followers</div></div></div>
    `;

    this._renderRepos(repos);
    renderContributionChart('contribution-chart');
    this._renderLanguageChart();
  },

  _renderRepos(repos) {
    document.getElementById('repo-list').innerHTML = repos.map(r => `
      <div class="repo-card" data-name="${r.name.toLowerCase()}">
        <div class="repo-name"><i class="fas fa-book"></i> ${r.name}</div>
        <p class="repo-desc">${r.description}</p>
        <div class="repo-stats">
          <span><i class="fas fa-star"></i> ${r.stars}</span>
          <span><i class="fas fa-code-fork"></i> ${r.forks}</span>
          <span class="badge badge-primary">${r.language}</span>
        </div>
      </div>
    `).join('');

    document.getElementById('repo-search')?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.repo-card').forEach(card => {
        card.style.display = card.dataset.name.includes(query) ? '' : 'none';
      });
    });
  },

  _renderLanguageChart() {
    import('../../modules/analyticsManager.js').then(({ default: AnalyticsManager }) => {
      AnalyticsManager.createDonutChart('language-chart', [
        { label: 'JavaScript', value: 42 },
        { label: 'TypeScript', value: 28 },
        { label: 'Python', value: 15 },
        { label: 'CSS', value: 10 },
        { label: 'Other', value: 5 }
      ], { centerText: 'Languages' });
    });
  }
};

export default GitHub;

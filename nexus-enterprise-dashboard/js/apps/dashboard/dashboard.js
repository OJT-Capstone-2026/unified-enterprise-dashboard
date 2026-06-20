import AnalyticsManager from '../../modules/analyticsManager.js';
import { formatCurrency, formatNumber } from '../../utils/helpers.js';

const stats = [
  { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', icon: 'fa-dollar-sign', type: 'primary' },
  { label: 'Active Users', value: '18,429', change: '+8.2%', icon: 'fa-users', type: 'accent' },
  { label: 'Projects', value: '142', change: '+3.1%', icon: 'fa-folder-open', type: 'secondary' },
  { label: 'Tasks Done', value: '1,847', change: '+24.7%', icon: 'fa-check-circle', type: 'gold' }
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'completed project review', time: '2 min ago', icon: 'fa-check' },
  { user: 'Marcus Johnson', action: 'submitted expense report', time: '15 min ago', icon: 'fa-wallet' },
  { user: 'Elena Rodriguez', action: 'moved task to Done', time: '32 min ago', icon: 'fa-tasks' },
  { user: 'James Park', action: 'scored 95% on quiz', time: '1 hr ago', icon: 'fa-brain' },
  { user: 'Admin', action: 'updated team portfolio', time: '2 hrs ago', icon: 'fa-users' }
];

const Dashboard = {
  render() {
    return `
      <div class="page-header text-reveal">
        <h1 class="gradient-text">Enterprise Dashboard</h1>
        <p>Welcome back! Here's your unified productivity overview.</p>
      </div>

      <div class="dashboard-stats">
        ${stats.map(s => `
          <div class="stat-card perspective-3d">
            <div class="stat-icon ${s.type}"><i class="fas ${s.icon}"></i></div>
            <div>
              <div class="stat-value">${s.value}</div>
              <div class="stat-label">${s.label}</div>
              <div class="stat-change positive">${s.change}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="grid-2 mb-6">
        <div class="card liquid-glass">
          <div class="card-header">
            <h3 class="card-title">Revenue Overview</h3>
            <div class="card-actions">
              <button class="btn btn-sm btn-secondary">Weekly</button>
              <button class="btn btn-sm btn-primary">Monthly</button>
            </div>
          </div>
          <div class="chart-container" id="revenue-chart"></div>
        </div>

        <div class="card glass-premium">
          <div class="card-header">
            <h3 class="card-title">Expense Breakdown</h3>
          </div>
          <div class="chart-container" id="expense-donut" style="display:flex;align-items:center;justify-content:center;"></div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Activity</h3>
            <a href="/kanban" data-router class="btn btn-sm btn-secondary">View All</a>
          </div>
          <div class="activity-list">
            ${recentActivity.map(a => `
              <div class="expense-item">
                <div class="expense-category">
                  <div class="stat-icon primary" style="width:36px;height:36px;font-size:14px;"><i class="fas ${a.icon}"></i></div>
                  <div>
                    <div style="font-weight:600;font-size:14px;">${a.user}</div>
                    <div style="font-size:13px;color:var(--text-muted);">${a.action}</div>
                  </div>
                </div>
                <span class="text-xs" style="color:var(--text-muted);">${a.time}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card holographic">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="grid-2 gap-3">
            <a href="/expense" data-router class="btn btn-primary"><i class="fas fa-plus"></i> Add Expense</a>
            <a href="/kanban" data-router class="btn btn-secondary"><i class="fas fa-tasks"></i> New Task</a>
            <a href="/quiz" data-router class="btn btn-secondary"><i class="fas fa-brain"></i> Take Quiz</a>
            <a href="/news" data-router class="btn btn-secondary"><i class="fas fa-newspaper"></i> Read News</a>
          </div>
        </div>
      </div>
    `;
  },

  onRoute() {
    requestAnimationFrame(() => {
      AnalyticsManager.createBarChart('revenue-chart', [
        { label: 'Jan', value: 180 },
        { label: 'Feb', value: 220 },
        { label: 'Mar', value: 195 },
        { label: 'Apr', value: 280 },
        { label: 'May', value: 310 },
        { label: 'Jun', value: 350 }
      ], { colors: ['#6C63FF', '#8B83FF', '#6C63FF', '#00D4FF', '#6C63FF', '#FF6B6B'] });

      AnalyticsManager.createDonutChart('expense-donut', [
        { label: 'Food', value: 35 },
        { label: 'Transport', value: 20 },
        { label: 'Utilities', value: 15 },
        { label: 'Other', value: 30 }
      ], { centerText: 'Expenses' });
    });
  }
};

export default Dashboard;

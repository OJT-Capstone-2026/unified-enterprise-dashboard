import { formatCurrency } from '../../utils/helpers.js';
import { EXPENSE_CATEGORIES } from '../../utils/constants.js';
import StorageManager from '../../modules/storageManager.js';
import NotificationManager from '../../modules/notificationManager.js';
import AnalyticsManager from '../../modules/analyticsManager.js';
import { getExpenseAnalytics } from './analytics.js';

const Expense = {
  getExpenses() {
    return StorageManager.get('expenses', [
      { id: '1', description: 'Team Lunch', amount: 245.50, category: 'food', date: '2024-06-15' },
      { id: '2', description: 'Cloud Hosting', amount: 1299.00, category: 'utilities', date: '2024-06-14' },
      { id: '3', description: 'Conference Tickets', amount: 890.00, category: 'entertainment', date: '2024-06-12' },
      { id: '4', description: 'Office Supplies', amount: 156.75, category: 'shopping', date: '2024-06-10' },
      { id: '5', description: 'Uber Rides', amount: 78.30, category: 'transport', date: '2024-06-08' }
    ]);
  },

  render() {
    const expenses = this.getExpenses();
    const analytics = getExpenseAnalytics(expenses);

    return `
      <div class="page-header">
        <h1>Expense Tracker</h1>
        <p>Monitor and manage your enterprise spending in real-time.</p>
      </div>

      <div class="expense-summary">
        <div class="stat-card">
          <div class="stat-icon primary"><i class="fas fa-wallet"></i></div>
          <div>
            <div class="stat-value">${formatCurrency(analytics.total)}</div>
            <div class="stat-label">Total Expenses</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon accent"><i class="fas fa-chart-line"></i></div>
          <div>
            <div class="stat-value">${formatCurrency(analytics.average)}</div>
            <div class="stat-label">Average Expense</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon secondary"><i class="fas fa-receipt"></i></div>
          <div>
            <div class="stat-value">${expenses.length}</div>
            <div class="stat-label">Transactions</div>
          </div>
        </div>
      </div>

      <div class="grid-2 mb-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Add Expense</h3>
          </div>
          <form id="expense-form">
            <div class="form-group">
              <label for="exp-desc">Description</label>
              <input type="text" id="exp-desc" class="form-control" placeholder="What did you spend on?" required>
            </div>
            <div class="form-group">
              <label for="exp-amount">Amount ($)</label>
              <input type="number" id="exp-amount" class="form-control" placeholder="0.00" step="0.01" min="0" required>
            </div>
            <div class="form-group">
              <label for="exp-category">Category</label>
              <select id="exp-category" class="form-control">
                ${EXPENSE_CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i> Add Expense</button>
          </form>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">By Category</h3>
          </div>
          <div class="chart-container" id="expense-category-chart"></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Transactions</h3>
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr><th>Description</th><th>Category</th><th>Date</th><th>Amount</th><th></th></tr>
            </thead>
            <tbody id="expense-table">
              ${this._renderRows(expenses)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  _renderRows(expenses) {
    return expenses.map(exp => {
      const cat = EXPENSE_CATEGORIES.find(c => c.id === exp.category) || EXPENSE_CATEGORIES[6];
      return `
        <tr data-id="${exp.id}">
          <td>${exp.description}</td>
          <td><span class="badge badge-primary" style="background:${cat.color}22;color:${cat.color}">${cat.label}</span></td>
          <td>${exp.date}</td>
          <td style="font-weight:600;">${formatCurrency(exp.amount)}</td>
          <td><button class="btn btn-sm btn-danger exp-delete" data-id="${exp.id}"><i class="fas fa-trash"></i></button></td>
        </tr>
      `;
    }).join('');
  },

  onRoute() {
    const expenses = this.getExpenses();
    const analytics = getExpenseAnalytics(expenses);

    requestAnimationFrame(() => {
      AnalyticsManager.createBarChart('expense-category-chart',
        analytics.byCategory.map(c => ({ label: c.label, value: c.total })),
        { colors: analytics.byCategory.map(c => c.color) }
      );
    });

    document.getElementById('expense-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('exp-desc').value.trim();
      const amount = parseFloat(document.getElementById('exp-amount').value);
      const category = document.getElementById('exp-category').value;

      if (!description || !amount) return;

      const newExpense = {
        id: Date.now().toString(),
        description, amount, category,
        date: new Date().toISOString().split('T')[0]
      };

      const updated = [newExpense, ...this.getExpenses()];
      StorageManager.set('expenses', updated);
      NotificationManager.success(`Added expense: ${formatCurrency(amount)}`);
      document.getElementById('page-content').innerHTML = this.render();
      this.onRoute();
    });

    document.getElementById('expense-table')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.exp-delete');
      if (!btn) return;
      const id = btn.dataset.id;
      const updated = this.getExpenses().filter(exp => exp.id !== id);
      StorageManager.set('expenses', updated);
      NotificationManager.info('Expense removed');
      document.getElementById('page-content').innerHTML = this.render();
      this.onRoute();
    });
  }
};

export default Expense;

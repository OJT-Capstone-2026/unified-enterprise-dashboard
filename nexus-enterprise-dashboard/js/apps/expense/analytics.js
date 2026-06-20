import { EXPENSE_CATEGORIES } from '../../utils/constants.js';

export function getExpenseAnalytics(expenses) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const average = expenses.length ? total / expenses.length : 0;

  const byCategory = EXPENSE_CATEGORIES.map(cat => {
    const items = expenses.filter(e => e.category === cat.id);
    return {
      ...cat,
      total: items.reduce((sum, e) => sum + e.amount, 0),
      count: items.length
    };
  }).filter(c => c.total > 0);

  return { total, average, byCategory, count: expenses.length };
}

export default getExpenseAnalytics;

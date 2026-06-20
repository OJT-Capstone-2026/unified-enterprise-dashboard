export const ROUTES = {
  DASHBOARD: '/',
  PORTFOLIO: '/portfolio',
  QUIZ: '/quiz',
  EXPENSE: '/expense',
  NEWS: '/news',
  GITHUB: '/github',
  KANBAN: '/kanban',
  EVALUATION: '/evaluation',
  SETTINGS: '/settings'
};

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: '#FF6B6B' },
  { id: 'transport', label: 'Transportation', color: '#6C63FF' },
  { id: 'utilities', label: 'Utilities', color: '#00D4FF' },
  { id: 'entertainment', label: 'Entertainment', color: '#FFD700' },
  { id: 'shopping', label: 'Shopping', color: '#9B59B6' },
  { id: 'health', label: 'Health', color: '#2ECC71' },
  { id: 'other', label: 'Other', color: '#6C757D' }
];

export const KANBAN_COLUMNS = ['todo', 'in-progress', 'review', 'done'];

export const SEARCH_INDEX = [
  { title: 'Dashboard', path: '/', icon: 'fa-th-large', keywords: ['home', 'overview', 'stats'] },
  { title: 'Portfolio', path: '/portfolio', icon: 'fa-users', keywords: ['team', 'members', 'people'] },
  { title: 'Quiz System', path: '/quiz', icon: 'fa-brain', keywords: ['test', 'questions', 'assessment'] },
  { title: 'Expense Tracker', path: '/expense', icon: 'fa-wallet', keywords: ['money', 'budget', 'finance'] },
  { title: 'News Center', path: '/news', icon: 'fa-newspaper', keywords: ['articles', 'headlines', 'feed'] },
  { title: 'GitHub Explorer', path: '/github', icon: 'fa-github', keywords: ['repos', 'code', 'developer'] },
  { title: 'Kanban Board', path: '/kanban', icon: 'fa-tasks', keywords: ['tasks', 'project', 'board'] },
  { title: 'Evaluation Center', path: '/evaluation', icon: 'fa-chart-line', keywords: ['performance', 'analytics', 'kpi', 'reports', 'insights'] },
  { title: 'Settings', path: '/settings', icon: 'fa-cog', keywords: ['preferences', 'theme', 'language'] }
];

export const APP_VERSION = '1.0.0';

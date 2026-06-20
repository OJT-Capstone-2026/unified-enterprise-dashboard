export function getDefaultBoard() {
  return {
    tasks: [
      { id: '1', title: 'Design system audit', priority: 'high', column: 'todo', createdAt: '2024-06-18' },
      { id: '2', title: 'Implement dark mode', priority: 'medium', column: 'in-progress', createdAt: '2024-06-17' },
      { id: '3', title: 'API integration tests', priority: 'high', column: 'in-progress', createdAt: '2024-06-16' },
      { id: '4', title: 'Performance optimization', priority: 'medium', column: 'review', createdAt: '2024-06-15' },
      { id: '5', title: 'Deploy to production', priority: 'low', column: 'done', createdAt: '2024-06-14' },
      { id: '6', title: 'User onboarding flow', priority: 'medium', column: 'todo', createdAt: '2024-06-13' }
    ]
  };
}

export default getDefaultBoard;

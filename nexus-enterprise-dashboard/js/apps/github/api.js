export async function fetchUserStats() {
  await new Promise(r => setTimeout(r, 400));
  return { repos: 47, stars: 1284, forks: 312, followers: 892 };
}

export async function fetchRepos() {
  await new Promise(r => setTimeout(r, 500));
  return [
    { name: 'nexus-dashboard', description: 'Enterprise SPA dashboard built with vanilla JavaScript', stars: 342, forks: 87, language: 'JavaScript' },
    { name: 'state-manager', description: 'Reactive state management with undo/redo for vanilla JS apps', stars: 156, forks: 34, language: 'JavaScript' },
    { name: 'glass-ui', description: 'Premium glassmorphism CSS component library', stars: 289, forks: 62, language: 'CSS' },
    { name: 'particle-engine', description: 'Lightweight canvas particle system with mouse interaction', stars: 98, forks: 21, language: 'JavaScript' },
    { name: 'vanilla-router', description: 'Client-side router with middleware support', stars: 201, forks: 45, language: 'JavaScript' },
    { name: 'chart-kit', description: 'Canvas-based charting without dependencies', stars: 134, forks: 28, language: 'JavaScript' }
  ];
}

export default { fetchUserStats, fetchRepos };

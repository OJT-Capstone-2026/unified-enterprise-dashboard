const MOCK_NEWS = [
  { id: 1, title: 'Enterprise AI Adoption Surges 340% in Q2 2024', description: 'Fortune 500 companies are rapidly integrating AI-powered dashboards and analytics platforms to drive decision-making at unprecedented scale.', source: 'TechCrunch', category: 'technology', publishedAt: new Date(Date.now() - 3600000).toISOString(), url: '#' },
  { id: 2, title: 'Global SaaS Market Reaches $720 Billion Valuation', description: 'The software-as-a-service industry continues its explosive growth trajectory, with enterprise productivity platforms leading the charge.', source: 'Bloomberg', category: 'business', publishedAt: new Date(Date.now() - 7200000).toISOString(), url: '#' },
  { id: 3, title: 'New Web Standards Enable 5D Visual Effects in Browsers', description: 'CSS and JavaScript advancements now allow developers to create holographic and parallax effects without external libraries.', source: 'Dev.to', category: 'technology', publishedAt: new Date(Date.now() - 14400000).toISOString(), url: '#' },
  { id: 4, title: 'Quantum Computing Breakthrough Accelerates Drug Discovery', description: 'Researchers achieve 1000x speedup in molecular simulation using next-generation quantum processors.', source: 'Nature', category: 'science', publishedAt: new Date(Date.now() - 28800000).toISOString(), url: '#' },
  { id: 5, title: 'Remote Work Productivity Tools See Record Investment', description: 'Venture capital firms pour $4.2B into collaboration and project management startups this quarter.', source: 'Forbes', category: 'business', publishedAt: new Date(Date.now() - 43200000).toISOString(), url: '#' },
  { id: 6, title: 'Vanilla JavaScript Frameworks Challenge React Dominance', description: 'Lightweight SPA architectures built with pure JavaScript are gaining traction among performance-conscious enterprises.', source: 'Hacker News', category: 'technology', publishedAt: new Date(Date.now() - 86400000).toISOString(), url: '#' }
];

export async function fetchNews() {
  await new Promise(r => setTimeout(r, 600));
  return MOCK_NEWS;
}

export default fetchNews;

export function filterNews(articles, category) {
  if (category === 'all') return articles;
  return articles.filter(a => a.category === category);
}

export default filterNews;

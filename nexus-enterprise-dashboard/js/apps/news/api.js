const API_KEY = "cbf5c3ee5e8a4c19bf3e8026d5dc2f26";
const BASE_URL = "https://newsapi.org/v2";

export async function fetchNews(searchTerm = "", category = "general") {
  let url = `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
  if (searchTerm) {
    url = `${BASE_URL}/everything?q=${encodeURIComponent(searchTerm)}&apiKey=${API_KEY}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch news");
  const data = await response.json();
  return data.articles || [];
}

export default fetchNews;

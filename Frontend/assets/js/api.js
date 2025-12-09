// API base URL
const API_BASE_URL = "https://localhost:7011/api";

// Fetch all posts
export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/Post`);
  return await response.json();
}

// Fetch all draft posts
export async function fetchDraftPosts() {
  const response = await fetch(`${API_BASE_URL}/DraftPost`);
  return await response.json();
}

// API base URL
const API_BASE_URL = "https://localhost:7011/api";

// Fetch all posts
export async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/Post`);
  return await response.json();
}

// Create a new post
export async function createPost(postData) {
  const response = await fetch(`${API_BASE_URL}/Post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  const data = await response.json();
  return { response, data };
}

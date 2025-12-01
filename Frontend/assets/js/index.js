import { fetchPosts } from "./api.js";
import { renderPosts, showErrorInContainer } from "./ui.js";

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".posts-container");

  async function loadPosts() {
    try {
      const posts = await fetchPosts();
      renderPosts(container, posts);
    } catch (err) {
      console.error("Error loading posts:", err);
      showErrorInContainer(container, "Failed to load posts.");
    }
  }

  loadPosts();
});

import { fetchDraftPosts } from "./api.js";
import {
  renderPosts,
  showErrorInContainer,
  setupDeletePostListener,
} from "./ui.js";

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".posts-container");

  async function loadDraftPosts() {
    try {
      const posts = await fetchDraftPosts();

      if (posts.length === 0) {
        container.innerHTML =
          '<p class="empty-message">No draft posts yet. <a href="./create.html" style="color: #1b7ea6; text-decoration: underline;">Create one now!</a></p>';
        return;
      }

      renderPosts(container, posts, "Draft");
      setupDeletePostListener(container);
    } catch (err) {
      console.error("Error loading draft posts:", err);
      showErrorInContainer(container, "Failed to load draft posts.");
    }
  }

  loadDraftPosts();
});

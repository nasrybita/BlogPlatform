import { fetchPostBySlug, deletePostFromAPI } from "./api.js";

// -------------------- DOM Elements --------------------
const postTitle = document.getElementById("postTitle");
const postStatus = document.getElementById("postStatus");
const postUpdatedAt = document.getElementById("postUpdatedAt");
const postBody = document.getElementById("postBody");
const categoriesList = document.getElementById("categoriesList");
const tagsList = document.getElementById("tagsList");
const postViewCount = document.getElementById("postViewCount");
const viewCountContainer = document.getElementById("viewCountContainer");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorContainer = document.getElementById("errorContainer");
const errorMessage = document.getElementById("errorMessage");
const postContainer = document.querySelector(".post-container");

// -------------------- Get Post Slug from URL --------------------
const urlParams = new URLSearchParams(window.location.search);
const postSlug = urlParams.get("slug");

// -------------------- Store Post ID for Operations --------------------
let currentPostId = null;

// -------------------- Format Date --------------------
function formatDate(dateString) {
  if (!dateString) return "No Date";
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// -------------------- Render Categories --------------------
function renderCategories(categories) {
  categoriesList.innerHTML = "";
  if (!categories || categories.length === 0) {
    categoriesList.innerHTML = '<span class="tag-badge">Uncategorized</span>';
    return;
  }

  categories.forEach((category) => {
    const badge = document.createElement("span");
    badge.className = "tag-badge";
    badge.textContent = category;
    categoriesList.appendChild(badge);
  });
}

// -------------------- Render Tags --------------------
function renderTags(tags) {
  tagsList.innerHTML = "";
  if (!tags || tags.length === 0) {
    tagsList.innerHTML =
      '<span style="color: #999; font-size: 14px;">No Tags</span>';
    return;
  }

  tags.forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "tag-badge";
    badge.textContent = tag;
    tagsList.appendChild(badge);
  });
}

// -------------------- Render Post --------------------
function renderPost(post) {
  // Store Post ID for delete and edit operations
  currentPostId = post.postId;

  // Set Title
  postTitle.textContent = post.title;

  // Set Status
  postStatus.textContent = post.status || "Draft";
  postStatus.className = `post-status ${post.status?.toLowerCase() || "draft"}`;

  // Set Updated At
  const displayDate =
    post.updatedAt && post.updatedAt !== null
      ? formatDate(post.updatedAt)
      : formatDate(post.createdAt);
  postUpdatedAt.textContent = `Last Updated: ${displayDate}`;

  // Set Body (from Quill editor)
  postBody.innerHTML = post.body;

  // Set Categories
  renderCategories(post.categories);

  // Set Tags
  renderTags(post.tags);

  // Set View Count (only for published posts)
  if (post.status === "Published") {
    viewCountContainer.style.display = "block";
    postViewCount.textContent = post.viewCount || 0;
  } else {
    viewCountContainer.style.display = "none";
  }

  // Set Edit Button Link
  editBtn.href = `/pages/edit.html?id=${post.postId}`;

  // Show Post Container and Hide Loading Spinner
  postContainer.style.display = "flex";
  loadingSpinner.style.display = "none";
}

// -------------------- Show Error --------------------
function showError(message) {
  errorMessage.textContent = message;
  errorContainer.style.display = "block";
  postContainer.style.display = "none";
  loadingSpinner.style.display = "none";
}

// -------------------- Load Post By Slug --------------------
async function loadPost() {
  // Check if slug exists in URL
  if (!postSlug) {
    showError("Post not found. Missing post slug parameter.");
    return;
  }

  try {
    loadingSpinner.style.display = "flex";
    postContainer.style.display = "none";
    errorContainer.style.display = "none";

    const post = await fetchPostBySlug(postSlug);

    if (!post) {
      showError("Post not found.");
      return;
    }

    renderPost(post);
  } catch (err) {
    console.error("Error loading post:", err);
    showError("Failed to load post. Please try again later.");
  }
}

// -------------------- Show Delete Confirmation Modal --------------------
function showDeleteConfirmationModal(postId) {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Delete Post?</h3>
      <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-cancel">No, Cancel</button>
        <button class="modal-btn modal-btn-delete">Yes, Delete</button>
      </div>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  const cancelBtn = modal.querySelector(".modal-btn-cancel");
  const deleteConfirmBtn = modal.querySelector(".modal-btn-delete");

  const closeModal = () => {
    modalOverlay.remove();
  };

  cancelBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  deleteConfirmBtn.addEventListener("click", async () => {
    deleteConfirmBtn.disabled = true;
    deleteConfirmBtn.textContent = "Deleting...";

    try {
      const response = await deletePostFromAPI(postId);

      if (response.ok) {
        closeModal();
        Toastify({
          text: "Post deleted successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#059862" },
        }).showToast();

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2500);
      } else {
        deleteConfirmBtn.disabled = false;
        deleteConfirmBtn.textContent = "Yes, Delete";

        Toastify({
          text: "Failed to delete post.",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#d93025" },
        }).showToast();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      deleteConfirmBtn.disabled = false;
      deleteConfirmBtn.textContent = "Yes, Delete";

      Toastify({
        text: "Unexpected error occurred.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#d93025" },
      }).showToast();
    }
  });
}

// -------------------- Delete Post Handler --------------------
deleteBtn.addEventListener("click", () => {
  // Use the stored currentPostId from loaded post
  if (!currentPostId) {
    Toastify({
      text: "Unable to delete post. Post ID not found.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "#d93025" },
    }).showToast();
    return;
  }

  showDeleteConfirmationModal(currentPostId);
});

// -------------------- Initialize Page --------------------
document.addEventListener("DOMContentLoaded", function () {
  loadPost();
});

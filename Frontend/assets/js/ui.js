import { getExcerpt } from "./helpers.js";
import { deletePostFromAPI } from "./api.js";

// ---------- Create a post card element ----------
export function createPostCard(post) {
  const card = document.createElement("div");
  card.classList.add("post-card");
  card.innerHTML = `
    <!-- FEATURED IMAGE (optional) -->
    ${
      post.featuredImageUrl
        ? `<div class="post-card-image"><img src="https://localhost:7011${post.featuredImageUrl}" alt="Featured image for ${post.title}" /></div>`
        : ""
    }

    <!-- POST CARD HEADER -->
    <div class="post-card-header">
        <div class="post-create-date">${new Date(
          post.createdAt
        ).toDateString()}</div>
        <div class="post-category">${
          post.categories[0] ?? "Uncategorized"
        }</div>
    </div>

    <!-- POST CARD TITLE -->
    <div class="post-card-title">
        <h3>${post.title}</h3>
    </div>

    <!-- POST CARD CONTENT -->
    <div class="post-card-content">
        <p>${getExcerpt(post.body, 100)}...</p>
    </div>
    
    <!-- POST CARD BUTTONS -->
    <div class="post-card-buttons">
        <div class="edit-delete-links">
        <a class="edit-post-link" href="/pages/edit.html?id=${
          post.postId
        }">Edit</a>
        <a class="delete-post-link" href="#" data-id="${post.postId}">Delete</a>
        </div>
        <button class="see-more-btn" onclick="window.location='/pages/post.html?slug=${
          post.slug
        }'">
        See more
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="15px"
            width="15px"
            class="icon"
        >
            <path
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-miterlimit="10"
            stroke-width="2"
            stroke="#1b7ea6"
            d="M8.91016 19.9201L15.4302 13.4001C16.2002 12.6301 16.2002 11.3701 15.4302 10.6001L8.91016 4.08008"
            ></path>
        </svg>
        </button>
    </div>
  `;
  return card;
}

// --------------- Render posts to container ---------------
// Filter posts by status (Published/Draft)
export function renderPosts(container, posts, filterByStatus = "Published") {
  container.innerHTML = "";

  // Filter posts based on status
  const filteredPosts = filterByStatus
    ? posts.filter((post) => post.status === filterByStatus)
    : posts;

  if (filteredPosts.length === 0) {
    const message =
      filterByStatus === "Published"
        ? "No published posts yet."
        : filterByStatus === "Draft"
        ? "No draft posts yet."
        : "No posts found.";
    container.innerHTML = `<p class="empty-posts-message">${message}</p>`;
    return;
  }

  filteredPosts.forEach((post) => {
    const card = createPostCard(post);
    container.appendChild(card);
  });
}

// -------------- Show error message in container --------------
export function showErrorInContainer(container, message) {
  container.innerHTML = `<p>${message}</p>`;
}

// -------------- Create and show delete confirmation modal --------------
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
  const deleteBtn = modal.querySelector(".modal-btn-delete");

  const closeModal = () => {
    modalOverlay.remove();
  };

  cancelBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  deleteBtn.addEventListener("click", async () => {
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";

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

        setTimeout(() => location.reload(), 2500);
      } else {
        closeModal();

        // Show error toast
        Toastify({
          text: "Failed to delete post.",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: { background: "#d93025" },
        }).showToast();
      }
    } catch (err) {
      console.error(err);

      closeModal();

      Toastify({
        text: "Unexpected error occurred.",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: { background: "#d93025" },
      }).showToast();
    }
  });
}

// ------------- Setup delete post listener -------------
export function setupDeletePostListener(container) {
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-post-link")) {
      e.preventDefault();
      const postId = e.target.dataset.id;
      showDeleteConfirmationModal(postId);
    }
  });
}

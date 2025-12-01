import { getExcerpt } from "./helpers.js";

// Create a post card element
export function createPostCard(post) {
  const card = document.createElement("div");
  card.classList.add("post-card");
  card.innerHTML = `
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
        <a class="edit-post-link" href="edit.html?id=${post.postId}">Edit</a>
        <a class="delete-post-link" href="#" data-id="${post.postId}">Delete</a>
        </div>
        <button class="see-more-btn" onclick="window.location='post.html?slug=${
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

// Render posts to container
export function renderPosts(container, posts) {
  container.innerHTML = "";
  posts.forEach((post) => {
    const card = createPostCard(post);
    container.appendChild(card);
  });
}

// Show error message in container
export function showErrorInContainer(container, message) {
  container.innerHTML = `<p>${message}</p>`;
}

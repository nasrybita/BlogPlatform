import { titleInput, slugInput, statusSelect } from "../create/dom.js";
import { quill } from "../create/editor.js";
import { categories, tags } from "../create/chips.js";
import {
  clearErrors,
  showError,
  validateTitle,
  validateSlug,
  validateBody,
  validateCategories,
  validateTags,
  validateStatus,
} from "../create/validators.js";
import {
  fetchPostById,
  updatePostToAPI,
  publishPostToAPI,
  unpublishPostToAPI,
} from "../shared-api.js";

// Store original post data to track status changes
let originalPost = null;

// -------------------- Update Edit Button Text Based on Status --------------------
export function updateEditButtonText() {
  const submitBtn = document.getElementById("submitPostBtn");
  if (!originalPost) return;

  const currentStatus = statusSelect.value;
  const originalStatus = originalPost.status;

  // Rule 1: If status hasn't changed, always show "Update Post"
  if (currentStatus === originalStatus) {
    submitBtn.textContent = "Update Post";
    return;
  }

  // Rule 2: If changing from Draft to Published, show "Update & Publish Post"
  if (currentStatus === "Published" && originalStatus === "Draft") {
    submitBtn.textContent = "Update & Publish Post";
    return;
  }

  // Rule 3: If changing from Published to Draft, show "Update & Draft Post"
  if (currentStatus === "Draft" && originalStatus === "Published") {
    submitBtn.textContent = "Update & Draft Post";
    return;
  }
}

// -------------------- Submit Post --------------------
export function initializeSubmit(postId) {
  const submitBtn = document.getElementById("submitPostBtn");

  submitBtn.addEventListener("click", async () => {
    clearErrors();

    const currentStatus = statusSelect.value;
    const newStatus = currentStatus;
    const statusChanged = originalPost.status !== newStatus;

    // Check if ANY field has actually changed
    const titleChanged = titleInput.value.trim() !== originalPost.title;
    const slugChanged = slugInput.value.trim() !== originalPost.slug;
    const bodyChanged = quill.root.innerHTML.trim() !== originalPost.body;

    const categoriesChanged =
      JSON.stringify(categories.sort()) !==
      JSON.stringify(originalPost.categories.sort());

    const tagsChanged =
      JSON.stringify(tags.sort()) !== JSON.stringify(originalPost.tags.sort());

    // If nothing changed, just redirect without showing toast
    if (
      !titleChanged &&
      !slugChanged &&
      !bodyChanged &&
      !categoriesChanged &&
      !tagsChanged &&
      !statusChanged
    ) {
      window.location.href = "../index.html";
      return;
    }

    const dto = {
      title: titleInput.value.trim(),
      slug: slugInput.value.trim(),
      body: quill.root.innerHTML.trim(),
      categories: [...categories],
      tags: [...tags],
      status: newStatus,
    };

    const invalid =
      !validateTitle() |
      !validateSlug() |
      !validateBody() |
      !validateCategories() |
      !validateTags() |
      !validateStatus();

    if (invalid) return;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Updating...";

      // Step 1: Update post fields
      const { res, data } = await updatePostToAPI(postId, dto);

      if (!res.ok) {
        submitBtn.disabled = false;
        updateEditButtonText();

        if (data && data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) =>
            showError("error" + field, messages[0])
          );
        }

        Toastify({
          text: "Failed to update post. Please try again.",
          duration: 5000,
          gravity: "top",
          position: "right",
          close: true,
          style: { background: "#d93025" },
        }).showToast();
        return;
      }

      // Step 2: Handle status change with separate API calls if needed
      if (statusChanged) {
        if (newStatus === "Published" && originalPost.status === "Draft") {
          const publishRes = await publishPostToAPI(postId);

          if (!publishRes.ok) {
            Toastify({
              text: "Post Updated but Failed to Publish. Please try again.",
              duration: 5000,
              gravity: "top",
              position: "right",
              close: true,
              style: { background: "#ff9800" },
            }).showToast();
            submitBtn.disabled = false;
            updateEditButtonText();
            return;
          }

          Toastify({
            text: "Post Updated and Published Successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            close: true,
            style: { background: "#059862" },
          }).showToast();

          setTimeout(() => (window.location.href = "../index.html"), 3000);
          return;
        } else if (
          newStatus === "Draft" &&
          originalPost.status === "Published"
        ) {
          const unpublishRes = await unpublishPostToAPI(postId);

          if (!unpublishRes.ok) {
            Toastify({
              text: "Post Updated but Failed to Draft. Please try again.",
              duration: 5000,
              gravity: "top",
              position: "right",
              close: true,
              style: { background: "#ff9800" },
            }).showToast();
            submitBtn.disabled = false;
            updateEditButtonText();
            return;
          }

          Toastify({
            text: "Post Updated and Drafted Successfully!",
            duration: 3000,
            gravity: "top",
            position: "right",
            close: true,
            style: { background: "#059862" },
          }).showToast();

          setTimeout(() => (window.location.href = "../index.html"), 3000);
          return;
        }
      }

      // Step 3: If only fields were updated (no status change)
      if (!statusChanged) {
        Toastify({
          text: "Post updated successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#059862" },
        }).showToast();

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 3000);
        return;
      }
      window.location.href = "../index.html";
    } catch (err) {
      console.error("[SUBMIT] Error:", err);
      submitBtn.disabled = false;
      updateEditButtonText();

      Toastify({
        text: "Unexpected error occurred.",
        duration: 5000,
        gravity: "top",
        position: "right",
        close: true,
        style: { background: "#d93025" },
      }).showToast();
    }
  });
}

// Export originalPost so main.js can set it
export function setOriginalPost(post) {
  originalPost = post;
}

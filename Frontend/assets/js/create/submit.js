import {
  titleInput,
  slugInput,
  submitBtn,
  statusSelect,
  featuredImageInput,
  errorFeaturedImage,
} from "./dom.js";
import { quill } from "./editor.js";
import { categories, tags } from "./chips.js";
import {
  clearErrors,
  showError,
  validateTitle,
  validateSlug,
  validateBody,
  validateCategories,
  validateTags,
  validateStatus,
} from "./validators.js";
import { submitPostFormToAPI, publishPostToAPI } from "../api.js";

// -------------------- Update Button Text Based on Status --------------------
export function updateButtonText() {
  const status = statusSelect.value;
  if (status === "Published") {
    submitBtn.textContent = "Publish Post";
  } else {
    submitBtn.textContent = "Draft Post";
  }
}

// -------------------- Submit Post --------------------
export function initializeSubmit() {
  submitBtn.addEventListener("click", async () => {
    clearErrors();
    const invalid =
      !validateTitle() |
      !validateSlug() |
      !validateBody() |
      !validateCategories() |
      !validateTags() |
      !validateStatus();

    if (invalid) return;

    try {
      // Build FormData for multipart/form-data
      const formData = new FormData();
      formData.append("Title", titleInput.value.trim());
      formData.append("Slug", slugInput.value.trim());
      formData.append("Body", quill.root.innerHTML.trim());
      [...categories].forEach((cat) => formData.append("Categories", cat));
      [...tags].forEach((tag) => formData.append("Tags", tag));
      formData.append("Status", "Draft");

      // Attach featured image if selected
      if (featuredImageInput.files[0]) {
        formData.append("featuredImage", featuredImageInput.files[0]);
      }

      // Step 1: Create post as draft
      const { res, data } = await submitPostFormToAPI(formData);

      if (!res.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) =>
            showError("error" + field, messages[0])
          );
        }
        return;
      }

      // Step 2: If user selected "Published" (publish the post)
      const postId = data.postId;
      const userSelectedStatus = statusSelect.value;

      if (userSelectedStatus === "Published") {
        const publishRes = await publishPostToAPI(postId);

        if (!publishRes.ok) {
          Toastify({
            text: "Post Created but Failed to Publish. Please publish it manually.",
            duration: 5000,
            gravity: "top",
            position: "right",
            close: true,
            style: { background: "#ff9800" },
          }).showToast();
          setTimeout(() => (window.location.href = "../index.html"), 3000);
          return;
        }

        Toastify({
          text: "Post Published Successfully!",
          duration: 5000,
          gravity: "top",
          position: "right",
          close: true,
          style: { background: "#059862" },
        }).showToast();
      } else {
        // Success: Post saved as draft
        Toastify({
          text: "Post Saved Successfully!",
          duration: 5000,
          gravity: "top",
          position: "right",
          close: true,
          style: { background: "#059862" },
        }).showToast();
      }

      setTimeout(() => (window.location.href = "../index.html"), 3000);
    } catch (err) {
      console.error(err);
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

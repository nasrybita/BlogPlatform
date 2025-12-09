import { titleInput, slugInput, submitBtn, statusSelect } from "./dom.js";
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
import { submitPostToAPI, publishPostToAPI } from "../shared-api.js";

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
    const dto = {
      title: titleInput.value.trim(),
      slug: slugInput.value.trim(),
      body: quill.root.innerHTML.trim(),
      categories: [...categories],
      tags: [...tags],
      status: "Draft",
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
      // Step 1: Create post as draft
      const { res, data } = await submitPostToAPI(dto);

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

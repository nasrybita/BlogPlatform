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
import { updatePostToAPI } from "../shared-api.js";

// -------------------- Submit Post --------------------
export function initializeSubmit(postId) {
  const submitBtn = document.getElementById("submitPostBtn");

  submitBtn.addEventListener("click", async () => {
    clearErrors();
    const dto = {
      title: titleInput.value.trim(),
      slug: slugInput.value.trim(),
      body: quill.root.innerHTML.trim(),
      categories: [...categories],
      tags: [...tags],
      status: statusSelect ? statusSelect.value : undefined,
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
      const { res, data } = await updatePostToAPI(postId, dto);
      if (!res.ok) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) =>
            showError("error" + field, messages[0])
          );
        }
        return;
      }
      Toastify({
        text: "Post updated successfully!",
        duration: 5000,
        gravity: "top",
        position: "right",
        close: true,
        style: { background: "#059862" },
      }).showToast();
      setTimeout(() => (window.location.href = "../index.html"), 3000);
    } catch (err) {
      console.error(err);
      Toastify({
        text: "Unexpected error occurred.",
        duration: 5000,
        gravity: "top",
        position: "right",
        style: { background: "#d93025" },
      }).showToast();
    }
  });
}

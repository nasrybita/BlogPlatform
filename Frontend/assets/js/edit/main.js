import {
  titleInput,
  slugInput,
  categoriesInput,
  tagsInput,
  categoriesWrapper,
  tagsWrapper,
  statusSelect,
} from "./dom.js";
import { quill } from "./editor.js";
import {
  initializeChipInputs,
  categories,
  tags,
  renderChips,
} from "../create/chips.js";
import {
  validateTitle,
  validateSlug,
  validateBody,
  validateCategories,
  validateTags,
} from "../create/validators.js";
import { fetchPostById } from "../shared-api.js";
import {
  initializeSubmit,
  updateEditButtonText,
  setOriginalPost,
} from "./submit.js";

// -------------------- Get Post ID from URL --------------------
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// -------------------- Load Post Data for Editing --------------------
async function loadPostForEditing() {
  try {
    const post = await fetchPostById(postId);

    // STORE ORIGINAL POST DATA - THIS IS KEY FOR PROBLEM #1, #2, #3
    setOriginalPost(post);

    // Populate form fields with existing post data
    titleInput.value = post.title;
    slugInput.value = post.slug;

    // Set Quill editor content
    quill.root.innerHTML = post.body;

    // Populate categories
    if (post.categories && post.categories.length > 0) {
      categories.push(...post.categories);
      renderChips(categoriesWrapper, categories, categoriesInput);
    }

    // Populate tags
    if (post.tags && post.tags.length > 0) {
      tags.push(...post.tags);
      renderChips(tagsWrapper, tags, tagsInput);
    }

    // Set status select to the post's current status
    if (statusSelect && post.status) {
      statusSelect.value = post.status;
    }

    // Update button text based on loaded status
    updateEditButtonText();
  } catch (err) {
    console.error("Error loading post:", err);
    Toastify({
      text: "Failed to load post. Redirecting to home...",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "#d93025" },
    }).showToast();
    setTimeout(() => (window.location.href = "../index.html"), 2000);
  }
}

// -------------------- Initialize Everything --------------------
document.addEventListener("DOMContentLoaded", async function () {
  // Load the post data first
  await loadPostForEditing();

  // Initialize chip inputs with validation functions
  initializeChipInputs(validateCategories, validateTags);

  // -------------------- Live Validation --------------------
  titleInput.addEventListener("input", validateTitle);
  slugInput.addEventListener("input", validateSlug);

  quill.on("text-change", validateBody);

  statusSelect.addEventListener("change", updateEditButtonText);

  categoriesInput.addEventListener("input", () => {
    if (categoriesInput.value.trim())
      (document.getElementById("errorCategories").textContent = ""),
        document.getElementById("categoriesWrapper").classList.remove("error");
  });

  tagsInput.addEventListener("input", () => {
    if (tagsInput.value.trim())
      (document.getElementById("errorTags").textContent = ""),
        document.getElementById("tagsWrapper").classList.remove("error");
  });

  // -------------------- Initialize Submit Handler --------------------
  initializeSubmit(postId);
});

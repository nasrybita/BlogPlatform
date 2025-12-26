import { markFeaturedImageRemoved } from "./submit.js";
import {
  titleInput,
  slugInput,
  categoriesInput,
  tagsInput,
  categoriesWrapper,
  tagsWrapper,
  statusSelect,
  featuredImageInput,
  featuredImagePreview,
  featuredImagePreviewContainer,
  errorFeaturedImage,
  removeFeaturedImageBtn,
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
import { fetchPostById } from "../api.js";
import {
  initializeSubmit,
  updateEditButtonText,
  setOriginalPost,
} from "./submit.js";

let featuredImageRemoved = false;


// -------------------- Get Post ID from URL --------------------
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// -------------------- Load Post Data for Editing --------------------
async function loadPostForEditing() {
  try {
    const post = await fetchPostById(postId);

    // STORE ORIGINAL POST DATA 
    setOriginalPost(post);

    // Populate form fields with existing post data
    titleInput.value = post.title;
    slugInput.value = post.slug;

    // Set Quill editor content
    quill.root.innerHTML = post.body;

    // Show existing featured image
    if (post.featuredImageUrl) {
      featuredImagePreview.src = `https://localhost:7011${post.featuredImageUrl}`;
      featuredImagePreview.style.display = "block";
      featuredImagePreviewContainer.style.display = "block";
      removeFeaturedImageBtn.style.display = "flex";
    } else {
      featuredImagePreview.style.display = "none";
      featuredImagePreviewContainer.style.display = "none";
      removeFeaturedImageBtn.style.display = "none";
    }

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
  initializeSubmit(postId, featuredImageRemoved);

  // Featured Image Preview 
  featuredImageInput.addEventListener("change", () => {
    errorFeaturedImage.textContent = "";

    const file = featuredImageInput.files[0];
    if (!file) {
      // If user clears file, keep showing existing image (do nothing)
      return;
    }

    const isJpeg =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg");

    if (!isJpeg) {
      featuredImageInput.value = "";
      errorFeaturedImage.textContent = "Only JPEG/JPG images are allowed.";
      return;
    }

    const maxSizeBytes = 1 * 1024 * 1024; // 1 MB
    if (file.size > maxSizeBytes) {
      featuredImageInput.value = "";
      errorFeaturedImage.textContent = "Image must be smaller than 1 MB.";
      return;
    }

    const url = URL.createObjectURL(file);
    featuredImagePreview.src = url;
    featuredImagePreview.style.display = "block";
  });

  // Remove Featured Image Button Handler 
  removeFeaturedImageBtn.addEventListener("click", () => {
    markFeaturedImageRemoved(); // important
    featuredImageRemoved = true;

    featuredImagePreview.src = "";
    featuredImagePreview.style.display = "none";
    featuredImagePreviewContainer.style.display = "none";

    featuredImageInput.value = "";
    removeFeaturedImageBtn.style.display = "none";
  });
});

export { featuredImageRemoved };

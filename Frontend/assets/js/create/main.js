import {
  titleInput,
  slugInput,
  categoriesInput,
  tagsInput,
  statusSelect,
  featuredImageInput,
  featuredImagePreview,
  featuredImagePreviewContainer,
  errorFeaturedImage,
} from "./dom.js";
import { quill } from "./editor.js";
import { initializeChipInputs } from "./chips.js";
import {
  validateTitle,
  validateSlug,
  validateBody,
  validateCategories,
  validateTags,
  validateStatus,
} from "./validators.js";
import { initializeSubmit, updateButtonText } from "./submit.js";

// -------------------- Initialize Everything --------------------
// Initialize chip inputs with validation functions
initializeChipInputs(validateCategories, validateTags);

// -------------------- Set Initial Button Text --------------------
updateButtonText();

// -------------------- Live Validation --------------------
titleInput.addEventListener("input", validateTitle);
slugInput.addEventListener("input", validateSlug);

quill.on("text-change", validateBody);

statusSelect.addEventListener("change", updateButtonText);

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

// Featured Image Preview 
featuredImageInput.addEventListener("change", () => {
  errorFeaturedImage.textContent = "";

  const file = featuredImageInput.files[0];
  if (!file) {
    featuredImagePreview.style.display = "none";
    return;
  }

  const isJpeg =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.name.toLowerCase().endsWith(".jpg") ||
    file.name.toLowerCase().endsWith(".jpeg");

  if (!isJpeg) {
    featuredImageInput.value = "";
    featuredImagePreview.style.display = "none";
    errorFeaturedImage.textContent = "Only JPEG/JPG images are allowed.";
    return;
  }

  const maxSizeBytes = 1 * 1024 * 1024; // 1 MB
  if (file.size > maxSizeBytes) {
    featuredImageInput.value = "";
    featuredImagePreview.style.display = "none";
    errorFeaturedImage.textContent = "Image must be smaller than 1 MB.";
    return;
  }

  const url = URL.createObjectURL(file);
  featuredImagePreview.src = url;
  featuredImagePreview.style.display = "block";
});

// -------------------- Initialize Submit Handler --------------------
initializeSubmit();

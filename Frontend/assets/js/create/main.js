import {
  titleInput,
  slugInput,
  categoriesInput,
  tagsInput,
  statusSelect,
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

// -------------------- Initialize Submit Handler --------------------
initializeSubmit();

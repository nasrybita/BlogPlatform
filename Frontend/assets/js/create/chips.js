import {
  categoriesWrapper,
  categoriesInput,
  tagsWrapper,
  tagsInput,
} from "./dom.js";
import { showError, applyError } from "./validators.js";

// -------------------- Chip Arrays --------------------
export const categories = [];
export const tags = [];

// -------------------- Render Chips --------------------
export function renderChips(wrapper, array, input) {
  wrapper.innerHTML = "";
  array.forEach((item, index) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item;
    const remove = document.createElement("span");
    remove.innerHTML = "&times;";
    remove.addEventListener("click", () => {
      array.splice(index, 1);
      renderChips(wrapper, array, input);
    });
    chip.appendChild(remove);
    wrapper.appendChild(chip);
  });
  wrapper.appendChild(input);
}

// -------------------- Generic Chip Input Setup --------------------
export function setupChipInput(
  wrapper,
  input,
  array,
  maxItems,
  errorId,
  validateFn
) {
  input.addEventListener("focus", () => wrapper.classList.add("focused"));
  input.addEventListener("blur", () => wrapper.classList.remove("focused"));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      e.preventDefault();
      const value = input.value.trim();
      if (array.length >= maxItems) {
        showError(errorId, `Maximum ${maxItems} items allowed.`);
        applyError(wrapper, true);
        return;
      }
      if (value.length > 30) {
        showError(errorId, "Each item must be max 30 characters.");
        applyError(wrapper, true);
        return;
      }
      if (!array.includes(value)) {
        array.push(value);
        renderChips(wrapper, array, input);
        validateFn();
      } else {
        showError(errorId, "Items must not be duplicates.");
        applyError(wrapper, true);
      }
      input.value = "";
    }
  });
}

// -------------------- Initialize Chip Inputs --------------------
export function initializeChipInputs(validateCategories, validateTags) {
  setupChipInput(
    categoriesWrapper,
    categoriesInput,
    categories,
    5,
    "errorCategories",
    validateCategories
  );
  setupChipInput(tagsWrapper, tagsInput, tags, 10, "errorTags", validateTags);
}

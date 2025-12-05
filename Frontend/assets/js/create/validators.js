import {
  titleInput,
  slugInput,
  categoriesWrapper,
  tagsWrapper,
} from "./dom.js";
import { quill } from "./editor.js";
import { categories, tags } from "./chips.js";

// -------------------- Unified Error Handling --------------------
export function applyError(element, isWrapper = false) {
  if (isWrapper) {
    element.classList.add("error");
    element.classList.remove("valid");
  } else {
    element.classList.add("input-error");
    element.classList.remove("input-valid");
  }
}

export function applyValid(element, isWrapper = false) {
  if (isWrapper) {
    element.classList.remove("error");
    element.classList.add("valid");
  } else {
    element.classList.remove("input-error");
    element.classList.add("input-valid");
  }
}

export function showError(id, message) {
  const errSpan = document.getElementById(id);
  if (errSpan) errSpan.textContent = message;

  if (id === "errorCategories") applyError(categoriesWrapper, true);
  else if (id === "errorTags") applyError(tagsWrapper, true);
  else if (id === "errorBody")
    applyError(document.getElementById("postBodyEditor"));
  else {
    const field = document.getElementById(id.replace("error", "post"));
    if (field) applyError(field);
  }
}

export function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((x) => (x.textContent = ""));
  document
    .querySelectorAll(".input-error")
    .forEach((x) => x.classList.remove("input-error"));
  categoriesWrapper.classList.remove("error");
  tagsWrapper.classList.remove("error");
  document.getElementById("postBodyEditor").classList.remove("input-error");
}

// -------------------- Unified Field Validation --------------------
export function validateField(
  value,
  rules,
  errorId,
  fieldElement = null,
  wrapperElement = null
) {
  const err = document.getElementById(errorId);
  err.textContent = "";
  if (rules.required && !value.trim()) {
    err.textContent = rules.messages.required;
    applyError(fieldElement || wrapperElement, !!wrapperElement);
    return false;
  }
  if (rules.minLength && value.length < rules.minLength) {
    err.textContent = rules.messages.minLength;
    applyError(fieldElement || wrapperElement, !!wrapperElement);
    return false;
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    err.textContent = rules.messages.maxLength;
    applyError(fieldElement || wrapperElement, !!wrapperElement);
    return false;
  }
  if (rules.pattern && !rules.pattern.test(value)) {
    err.textContent = rules.messages.pattern;
    applyError(fieldElement || wrapperElement, !!wrapperElement);
    return false;
  }
  applyValid(fieldElement || wrapperElement, !!wrapperElement);
  return true;
}

// -------------------- Specific Validation Functions --------------------
export function validateTitle() {
  return validateField(
    titleInput.value,
    {
      required: true,
      maxLength: 255,
      messages: {
        required: "Title is required",
        maxLength: "Title cannot exceed 255 characters.",
      },
    },
    "errorTitle",
    titleInput
  );
}

const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export function validateSlug() {
  return validateField(
    slugInput.value,
    {
      required: true,
      maxLength: 255,
      pattern: slugRegex,
      messages: {
        required: "Slug is required.",
        maxLength: "Slug cannot exceed 255 characters.",
        pattern: "Slug must be lowercase words separated by dashes.",
      },
    },
    "errorSlug",
    slugInput
  );
}

export function validateBody() {
  return validateField(
    quill.getText().trim(),
    {
      required: true,
      minLength: 50,
      messages: {
        required: "Body is required.",
        minLength: "Body should be at least 50 characters long.",
      },
    },
    "errorBody",
    document.getElementById("postBodyEditor")
  );
}

export function validateCategories() {
  const errorId = "errorCategories";
  document.getElementById(errorId).textContent = "";
  if (categories.length === 0) {
    categoriesWrapper.classList.remove("error", "valid");
    return true;
  }
  if (categories.length > 5) {
    showError(errorId, "Maximum 5 categories allowed.");
    return false;
  }
  for (let c of categories) {
    if (!c.trim() || c.length > 30) {
      showError(
        errorId,
        !c.trim()
          ? "Category cannot be empty."
          : "Each category must be max 30 characters."
      );
      return false;
    }
  }
  applyValid(categoriesWrapper, true);
  return true;
}

export function validateTags() {
  const errorId = "errorTags";
  document.getElementById(errorId).textContent = "";
  if (tags.length === 0) {
    tagsWrapper.classList.remove("error", "valid");
    return true;
  }
  if (tags.length > 10) {
    showError(errorId, "Maximum 10 tags allowed.");
    return false;
  }
  for (let t of tags) {
    if (!t.trim() || t.length > 30) {
      showError(
        errorId,
        !t.trim()
          ? "Tag cannot be empty."
          : "Each tag must be max 30 characters."
      );
      return false;
    }
  }
  applyValid(tagsWrapper, true);
  return true;
}

export function validateStatus() {
  const statusEl = document.getElementById("postStatus");
  const errorId = "errorStatus";
  document.getElementById(errorId).textContent = "";

  if (!statusEl) return true; // nothing to validate

  const val = statusEl.value;
  if (val !== "Draft" && val !== "Published") {
    showError(errorId, "Invalid status selected.");
    return false;
  }

  statusEl.classList.remove("input-error");
  statusEl.classList.add("input-valid");
  return true;
}

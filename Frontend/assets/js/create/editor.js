import { bodyEditor } from "./dom.js";

// -------------------- Initialize Quill Editor --------------------
export const quill = new Quill("#postBodyEditor", {
  theme: "snow",
  placeholder: "Write something ...",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  },
});

// When editor gains focus
quill.on("editor-change", (eventName) => {
  if (eventName === "selection-change") {
    const range = quill.getSelection();
    if (range && range.length >= 0) {
      // Focused
      bodyEditor.classList.add("focused");
    } else {
      // Blurred
      bodyEditor.classList.remove("focused");
    }
  }
});

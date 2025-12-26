// --------------------- Helper Functions --------------------- //
// Extract text excerpt from HTML content
export function getExcerpt(html, length = 100) {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";
  return text.substring(0, length);
}


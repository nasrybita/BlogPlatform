// -------------------- API Functions --------------------
export async function submitPostToAPI(dto) {
  const res = await fetch("https://localhost:7011/api/Post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  const data = await res.json();
  return { res, data };
}

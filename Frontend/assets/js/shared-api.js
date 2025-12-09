// -------------------- API Functions --------------------

// Create a new post
export async function submitPostToAPI(dto) {
  const res = await fetch(`https://localhost:7011/api/Post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  const data = await res.json();
  return { res, data };
}

// Fetch a single post by ID
export async function fetchPostById(postId) {
  const res = await fetch(`https://localhost:7011/api/Post/${postId}`);
  return await res.json();
}

// Update an existing post
export async function updatePostToAPI(postId, dto) {
  const res = await fetch(`https://localhost:7011/api/Post/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  const data = await res.json();
  return { res, data };
}

// Delete a post
export async function deletePostFromAPI(postId) {
  const res = await fetch(`https://localhost:7011/api/Post/${postId}`, {
    method: "DELETE",
  });
  return res;
}

// Publish a post
export async function publishPostToAPI(postId) {
  const res = await fetch(`https://localhost:7011/api/Post/${postId}/publish`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 204) {
    return { ok: true, status: 204 };
  }

  // For other responses, try to parse JSON
  try {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: res.ok, status: res.status };
  }
}

// Unpublish a post (convert to draft)
export async function unpublishPostToAPI(postId) {
  const res = await fetch(
    `https://localhost:7011/api/Post/${postId}/unpublish`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (res.status === 204) {
    return { ok: true, status: 204 };
  }

  // For other responses, try to parse JSON
  try {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: res.ok, status: res.status };
  }
}

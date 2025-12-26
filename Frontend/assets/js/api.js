// -------------------- API Functions --------------------

// Create a new post with FormData (supports image)
export async function submitPostFormToAPI(formData) {
  const res = await fetch(`https://localhost:7011/api/Post`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return { res, data };
}

// Update an existing post with FormData (supports image)
export async function updatePostFormToAPI(postId, formData) {
  const res = await fetch(`https://localhost:7011/api/Post/${postId}`, {
    method: "PUT",
    body: formData,
  });
  const data = await res.json();
  return { res, data };
}

// Fetch a single post by ID
export async function fetchPostById(postId) {
  const res = await fetch(`https://localhost:7011/api/Post/${postId}`);
  return await res.json();
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

// Fetch a single post by slug (for post preview page)
export async function fetchPostBySlug(slug) {
  try {
    const res = await fetch("https://localhost:7011/api/Post");
    const posts = await res.json();

    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      throw new Error(`Post with slug '${slug}' not found`);
    }

    // we need to fetch post by ID here to increment view count
    const detailedRes = await fetch(
      `https://localhost:7011/api/Post/${post.postId}`
    );
    const detailedPost = await detailedRes.json();

    return detailedPost;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    throw error;
  }
}

// Fetch all posts
export async function fetchPosts() {
  const response = await fetch("https://localhost:7011/api/Post");
  return await response.json();
}

// Fetch all draft posts
export async function fetchDraftPosts() {
  const response = await fetch("https://localhost:7011/api/DraftPost");
  return await response.json();
}

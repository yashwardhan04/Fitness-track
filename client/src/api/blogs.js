const BASE_URL = 'http://localhost:8080'; // Add this at the top

// Blog API utility functions

export async function getBlogs(date) {
  const url = date 
    ? `${BASE_URL}/api/blogs?date=${encodeURIComponent(date)}` 
    : `${BASE_URL}/api/blogs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function getBlogById(id) {
  const res = await fetch(`/api/blogs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
}

export async function createBlog({ title, content, date, token }) {
  const res = await fetch(`${BASE_URL}/api/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, date }),
  });
  if (!res.ok) throw new Error('Failed to create blog');
  return res.json();
}

export async function updateBlog({ id, title, content, date, token }) {
  const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, date }),
  });
  if (!res.ok) throw new Error('Failed to update blog');
  return res.json();
}
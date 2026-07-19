/** Shopify Pages service — About, FAQ, Delivery, all static content. */
import http from './client';

export async function list({ first = 50, after = null } = {}) {
  const { data } = await http.get('/pages', { params: { first, after } });
  return data; // { nodes, pageInfo }
}

export async function getByHandle(handle) {
  if (!handle) return null;
  try {
    const { data } = await http.get(`/page/${encodeURIComponent(handle)}`);
    return data;
  } catch (err) {
    if (err?.status === 404) return null;
    throw err;
  }
}

const pages = { list, getByHandle };
export default pages;

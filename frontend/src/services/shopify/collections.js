/** Collections service — read-only Storefront proxies. */
import http from './client';

export async function list({ first = 20, after = null } = {}) {
  const { data } = await http.get('/collections', { params: { first, after } });
  return data; // { nodes, pageInfo }
}

export async function getByHandle(handle, { first = 24, after = null } = {}) {
  if (!handle) throw new Error('handle required');
  const { data } = await http.get(`/collections/${encodeURIComponent(handle)}`, {
    params: { first, after },
  });
  return data;
}

const collections = { list, getByHandle };
export default collections;

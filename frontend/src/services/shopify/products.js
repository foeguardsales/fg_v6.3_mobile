/** Products service — read-only Storefront proxies. */
import http from './client';

export async function list({ first = 20, after = null, query = null } = {}) {
  const { data } = await http.get('/products', { params: { first, after, query } });
  return data; // { nodes, pageInfo }
}

export async function getByHandle(handle) {
  if (!handle) throw new Error('handle required');
  const { data } = await http.get(`/products/${encodeURIComponent(handle)}`);
  return data;
}

export async function health() {
  const { data } = await http.get('/health');
  return data;
}

const products = { list, getByHandle, health };
export default products;

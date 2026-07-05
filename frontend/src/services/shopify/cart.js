/** Cart service — Shopify Cart API via the FastAPI proxy. */
import http, { cartIdStorage } from './client';

// URL-encode Shopify GIDs (they contain `/`) when placed in the path.
const encId = (id) => encodeURIComponent(id);

export async function create({ lines, buyerIdentity, discountCodes, attributes, note } = {}) {
  const body = {};
  if (lines) body.lines = lines;
  if (buyerIdentity) body.buyerIdentity = buyerIdentity;
  if (discountCodes) body.discountCodes = discountCodes;
  if (attributes) body.attributes = attributes;
  if (note) body.note = note;
  const { data } = await http.post('/cart', body);
  if (data?.id) cartIdStorage.set(data.id);
  return data;
}

export async function get(cartId) {
  const id = cartId || cartIdStorage.get();
  if (!id) return null;
  try {
    const { data } = await http.get(`/cart/${encId(id)}`);
    return data;
  } catch (err) {
    if (err?.status === 404) {
      cartIdStorage.clear();
      return null;
    }
    throw err;
  }
}

/** Idempotent: create if none exists, else return current. */
export async function ensure() {
  const existing = await get();
  if (existing) return existing;
  return create();
}

export async function addLines(cartId, lines) {
  const { data } = await http.post(`/cart/${encId(cartId)}/lines/add`, { lines });
  return data;
}

export async function updateLines(cartId, lines) {
  const { data } = await http.post(`/cart/${encId(cartId)}/lines/update`, { lines });
  return data;
}

export async function removeLines(cartId, lineIds) {
  const { data } = await http.post(`/cart/${encId(cartId)}/lines/remove`, { lineIds });
  return data;
}

export async function updateBuyerIdentity(cartId, buyerIdentity) {
  const { data } = await http.post(`/cart/${encId(cartId)}/buyer-identity`, { buyerIdentity });
  return data;
}

export async function updateDiscountCodes(cartId, discountCodes) {
  const { data } = await http.post(`/cart/${encId(cartId)}/discount-codes`, { discountCodes });
  return data;
}

const cart = {
  create,
  get,
  ensure,
  addLines,
  updateLines,
  removeLines,
  updateBuyerIdentity,
  updateDiscountCodes,
};
export default cart;

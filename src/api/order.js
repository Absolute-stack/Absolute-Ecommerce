import { api } from "../lib/axios.js";

export async function createOrder(orderData) {
  const res = await api.post("/api/order/create", orderData);
  return res.data;
}

export async function getMyOrders(pageParam = null) {
  const params = new URLSearchParams();
  if (pageParam) params.set("cursor", pageParam);
  params.set("limit", "10");
  const res = await api.get(`/api/order/orders?${params}`);
  return res.data;
}

export async function guestLookup(email, reference) {
  const res = await api.get(
    `/api/order/guest-orderLookup?email=${email}&reference=${reference}`,
  );
  return res.data;
}

export async function initializePayment(orderId) {
  const res = await api.post("/api/paystack/initialize", { orderId });
  return res.data;
}

export async function verifyPayment(reference) {
  const res = await api.get(`/api/paystack/verify?reference=${reference}`);
  return res.data;
}

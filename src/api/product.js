import { api } from "../lib/axios.js";

function getApi() {
  if (typeof window === "undefined") {
    return process.env.API_URL;
  } else {
    return import.meta.env.VITE_API_URL;
  }
}

export async function fetchProducts(filters = {}, pageParam = null) {
  const params = new URLSearchParams();
  if (pageParam) params.set("cursor", pageParam);
  params.set("limit", "20");
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  const res = await fetch(`${getApi()}/api/product/all?${params}`);
  if (!res.ok) throw new Error("Fetching products error");
  return res.json();
}

export async function fetchProductFilters() {
  const res = await fetch(`${getApi()}/api/product/product-filters`);
  if (!res.ok) throw new Error("Failed to fetch product filters");
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${getApi()}/api/product/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function createProduct(formData) {
  const res = await api.post(`${getApi()}/api/product/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function updateProduct(id, formData) {
  const res = await api.patch(
    `${getApi()}/api/product/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`${getApi()}/api/product/${id}`);
  return res.data;
}

export async function fetchAllProducts(isActive, pageParam = null) {
  const params = new URLSearchParams();
  if (pageParam) params.set("cursor", pageParam);
  params.set("limit", "20");
  if (isActive !== "undefined") params.set("isActive", isActive);
  const res = await api.get(`${getApi()}/api/product/admin/all?${params}`);
  return res.data;
}

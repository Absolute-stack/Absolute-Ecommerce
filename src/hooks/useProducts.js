import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchProductById,
  fetchProductFilters,
  fetchProducts,
} from "../api/product.js";

export function useProducts(filters = {}) {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam }) => fetchProducts(filters, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  });
}

export function useProductsFilters() {
  return useQuery({
    queryKey: ["product-filters"],
    queryFn: fetchProductFilters,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}

export function relatedProducts(category, currentId) {
  const selectFn = useMemo(
    () => (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        products: page.products.filter((p) => p._id !== currentId),
      })),
    }),
    [currentId],
  );
  return useInfiniteQuery({
    queryKey: [{ category }, currentId],
    queryFn: ({ pageParam }) => fetchProducts({ category }, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!category,
    select: selectFn,
  });
}

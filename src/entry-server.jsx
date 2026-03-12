import "dotenv/config";
import App from "./App.jsx";
import { StrictMode } from "react";
import { StaticRouter } from "react-router-dom/server";
import { makeQueryClient } from "./lib/makeQueryClient.js";
import { QueryClientProvider, dehydrate } from "@tanstack/react-query";
import {
  fetchProductById,
  fetchProductFilters,
  fetchProducts,
} from "./api/product.js";

export async function render(url) {
  const queryClient = makeQueryClient();

  const pathname = url.split("?")[0];
  const isHomePage = pathname === "/";
  const isProductsPage = pathname === "/products";
  const isProductsDetailsPage = pathname.startsWith("/products/");
  // Add a log to confirm the URL is correct
  console.log("API URL on server:", process.env.API_URL);

  if (isHomePage || isProductsPage) {
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        queryKey: ["products", {}],
        queryFn: ({ pageParam }) => fetchProducts({}, pageParam),
        initialPageParam: null,
      }),
      queryClient.prefetchQuery({
        queryKey: ["product-filters"],
        queryFn: fetchProductFilters,
      }),
    ]);
  }
  if (isHomePage || isProductsPage) {
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        queryKey: ["products", {}],
        queryFn: ({ pageParam }) => fetchProducts({}, pageParam),
        initialPageParam: null,
      }),
      queryClient.prefetchQuery({
        queryKey: ["product-filters"],
        queryFn: fetchProductFilters,
      }),
    ]);
  }

  if (isProductsDetailsPage) {
    const productsId = pathname.split("/products/")[1];
    await queryClient.prefetchQuery({
      queryKey: ["product", productsId],
      queryFn: () => fetchProductById(productsId),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  const tree = (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </StrictMode>
  );
  return { tree, dehydratedState };
}

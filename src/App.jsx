import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Products = lazy(() => import("./pages/Products/Products.jsx"));
const ProductDetails = lazy(
  () => import("./pages/ProductDetails/ProductDetails.jsx"),
);

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={null}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="/products/:id"
          element={
            <Suspense fallback={null}>
              <ProductDetails />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

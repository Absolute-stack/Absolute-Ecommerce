import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Products = lazy(() => import("./pages/Products/Products.jsx"));
const ProductDetails = lazy(
  () => import("./pages/ProductDetails/ProductDetails.jsx"),
);
const Cart = lazy(() => import("./pages/Cart/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout.jsx"));
const OrderConfirmation = lazy(
  () => import("./pages/OrderConfirmation/OrderConfirmation.jsx"),
);

function PageLoader() {
  return <div className="page-loading">Loading...</div>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/products"
        element={
          <Suspense fallback={<PageLoader />}>
            <Products />
          </Suspense>
        }
      />
      <Route
        path="/products/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <ProductDetails />
          </Suspense>
        }
      />
      <Route
        path="/cart"
        element={
          <Suspense fallback={<PageLoader />}>
            <Cart />
          </Suspense>
        }
      />
      <Route
        path="/checkout"
        element={
          <Suspense fallback={<PageLoader />}>
            <Checkout />
          </Suspense>
        }
      />
      <Route
        path="/order-confirmation"
        element={
          <Suspense fallback={<PageLoader />}>
            <OrderConfirmation />
          </Suspense>
        }
      />
    </Routes>
  );
}

import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import "./Products.css";

export default function Products() {
  const [filters, setFilters] = useState({});

  const { data, isFetching, isPending, isFetchingNextPage } =
    useProducts(filters);

  if (isPending) return <div>Loading</div>;

  const allProducts = data?.pages.flatMap((page) => page.products);

  return (
    <section className="products">
      <div className="container">
        <div className="products-grid">
          {allProducts?.map((p) => {
            return <ProductCard key={p._id} product={p} />;
          })}
        </div>
      </div>
    </section>
  );
}

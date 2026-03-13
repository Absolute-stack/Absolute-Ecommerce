import "./Products.css";
import { useState } from "react";
import ProductCard from "./ProductCard.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import ProductsBreadcrumb from "../../components/Breadcrumb/ProductsBreadcrumb.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { FilterSideBar } from "./FilterSideBar.jsx";

export default function Products() {
  const [filters, setFilters] = useState({});

  const {
    data,
    isFetching,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProducts(filters);

  if (isPending) return <div>Loading</div>;

  const allProducts = data?.pages.flatMap((page) => page.products);

  return (
    <>
      <Navbar filters={filters} onChange={setFilters} />
      <div className="divider">
        <div className="filter-container">
          <FilterSideBar filters={filters} onChange={setFilters} />
        </div>
        <section className="products">
          <div className="container">
            <ProductsBreadcrumb />
            <div className="products-grid">
              {allProducts?.map((p) => {
                return <ProductCard key={p._id} product={p} />;
              })}
            </div>
            {hasNextPage && (
              <button
                type="button"
                className="load-more-btn"
                onClick={fetchNextPage}
              >
                {isFetchingNextPage ? "Loading more products" : "Load more"}
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

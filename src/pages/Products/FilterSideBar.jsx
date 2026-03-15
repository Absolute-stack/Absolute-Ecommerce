import { useProductsFilters } from "../../hooks/useProducts.js";

export function FilterSideBar({ filters = {}, onChange }) {
  const { data, isPending } = useProductsFilters();
  function handleMinPrice(e) {
    onChange({ ...filters, minPrice: Number(e.target.value) || undefined });
  }
  function handleMaxPrice(e) {
    onChange({ ...filters, maxPrice: Number(e.target.value) || undefined });
  }

  if (isPending) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <aside className="filter-side">
      <h2>Categories</h2>
      {data?.categories.map((cat) => {
        return (
          <label key={cat} className="flex">
            <input
              type="checkbox"
              checked={filters.category === cat}
              onChange={() =>
                onChange({
                  ...filters,
                  category: filters.category === cat ? undefined : cat,
                })
              }
            />
            <p
              className={`cat-name filters.category === cat ? "active-filter" : ""`}
            >
              {cat.toUpperCase()}
            </p>
          </label>
        );
      })}
      <div className="minPrice-container">
        <span>Sort:MinPrice</span>
        <input
          type="number"
          value={filters.minPrice || ""}
          onChange={handleMinPrice}
          placeholder={`Min $${data.minPrice}`}
        />
      </div>
      <div className="maxPrice-container">
        <span>Sort:MaxPrice</span>
        <input
          type="number"
          value={filters.maxPrice || ""}
          onChange={handleMaxPrice}
          placeholder={`Max $${data.maxPrice}`}
        />
      </div>
    </aside>
  );
}

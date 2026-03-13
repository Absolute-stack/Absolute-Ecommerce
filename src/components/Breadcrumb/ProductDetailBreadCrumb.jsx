import { Link } from "react-router-dom";

export function ProductDetailsBreadCrumb({ product }) {
  return (
    <div className="pd-bc flex-05">
      <Link to="/">Home</Link> {">"}
      <Link to="/products">Products</Link> {">"}
      <Link to={"#"}>{product.name}</Link>
    </div>
  );
}

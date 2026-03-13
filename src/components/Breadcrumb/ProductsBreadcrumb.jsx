import { Link } from "react-router-dom";

export default function ProductsBreadcrumb() {
  return (
    <div className="products-breadcrumb">
      <Link to="/">Home</Link> {">"}
      <Link to="#">Products</Link>
    </div>
  );
}

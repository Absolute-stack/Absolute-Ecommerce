import { useParams } from "react-router-dom";
import ProductCard from "../Products/ProductCard.jsx";
import { useProduct } from "../../hooks/useProducts.js";

export default function ProductDetails() {
  const { id } = useParams();

  const { data, isPending } = useProduct(id);

  if (isPending) return <div>Loading...</div>;

  return <ProductCard product={data.product} />;
}

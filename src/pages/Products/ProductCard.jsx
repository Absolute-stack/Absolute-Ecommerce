import { Link } from "react-router-dom";
import CompoundProductCard from "./CompoundProductCard.jsx";

export default function ProductCard({ product }) {
  return (
    <Link className="product-card" to={`/products/${product._id}`}>
      <CompoundProductCard>
        <CompoundProductCard.cardLayout>
          <CompoundProductCard.cardImage src={product.images?.[0]} />
          <CompoundProductCard.cardCategory children={product.category} />
          <CompoundProductCard.cardTitle children={product.name} />
          <CompoundProductCard.cardPrice children={product.price} />
        </CompoundProductCard.cardLayout>
      </CompoundProductCard>
    </Link>
  );
}

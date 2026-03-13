import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProducts.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { ProductDetailsBreadCrumb } from "../../components/Breadcrumb/ProductDetailBreadCrumb.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { data, isPending } = useProduct(id);
  const [heroImage, setHeroImage] = useState(null); // ✅ hooks at top

  if (isPending) return <div>Loading...</div>;

  const product = data?.product; // ✅ safe reference
  if (!product) return <div>Product not found</div>; // ✅ guard missing data

  return (
    <div className="product-details">
      <Navbar filters={{}} onChange={() => {}} />
      <div className="container">
        <ProductDetailsBreadCrumb product={product} />
        <div className="divider">
          <div className="img-section">
            <img
              src={heroImage || product.images?.[0]}
              alt={product.name}
              loading="eager"
              fetchPriority="highest"
              decoding="async"
              className="product-hero-image"
            />
            <div className="image-grid-section">
              {product.images?.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onClick={() => setHeroImage(image)}
                />
              ))}
            </div>
          </div>
          <div className="text-section">
            <h3>{product.name}</h3>
            <p className="product-price">GH₵{product.price}</p>
            <p className="product-description">{product.description}</p>
            <span>Select Sizes</span>
            <div className="sizes-container">
              {product.sizes.map((size) => (
                <button key={size} type="button">
                  {size}
                </button>
              ))}
            </div>
            <span>Quantity</span>
            <div className="quantity-container">
              <button type="button">+</button>
              <input
                type="number"
                defaultValue={1}
                className="quantity-input"
              />
              <button type="button">-</button>
            </div>
            <div className="btns-container">
              <button type="button" className="add-to-cart-btn">
                Add To Cart
              </button>
              <button type="button" className="buy-now-btn">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

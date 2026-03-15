import "./ProductDetails.css";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProducts.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { ProductDetailsBreadCrumb } from "../../components/Breadcrumb/ProductDetailBreadCrumb.jsx";
import not_found_img from "../../assets/images/product_not_found.webp";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isPending, isLoading } = useProduct(id);
  const [heroImage, setHeroImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  if (isPending || isLoading) return <div>Loading...</div>;

  const product = data?.product;

  if (!product)
    return (
      <div className="not-found-container">
        <img
          src={not_found_img}
          alt="Product not found illustration"
          loading="eager"
          decoding="async"
          className="not-found-img"
        />
        <p>Product not found</p>
        <Link className="not-link" to="/products">
          Back to Products
        </Link>
      </div>
    );

  function handleAddToCart() {
    if (!selectedSize) return setError("Please select a size");
    addItem({ ...product, quantity }, selectedSize);
  }

  function handleBuyNow() {
    if (!selectedSize) return setError("Please select a size");
    navigate("/checkout", {
      state: {
        buyNowItem: {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          size: selectedSize,
          quantity,
        },
      },
    });
  }

  return (
    <section className="product-details">
      <Navbar filters={{}} onChange={() => {}} />
      <div className="container">
        <ProductDetailsBreadCrumb product={product} />
        <div className="product-details-divider">
          <div className="img-section">
            <img
              src={heroImage || product.images?.[0]}
              alt={product.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="product-details-hero-img"
            />
            <div className="images-grid-section">
              {product?.images.map((image) => {
                return (
                  <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    onClick={() => setHeroImage(image)}
                  />
                );
              })}
            </div>
          </div>
          <div className="text-section">
            <p className="product-category">{product.category}</p>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">GH₵{product.price}</p>
            <p className="product-description">{product.description}</p>
            <span>Select Size</span>
            {error && <pre className="error-txt">{error}</pre>}
            <div className="product-sizes-container">
              {product.sizes.map((size) => {
                return (
                  <button
                    type="button"
                    className={size === selectedSize ? "active-size" : ""}
                    onClick={() =>
                      setSelectedSize(size === selectedSize ? null : size)
                    }
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <span>Quantity</span>
            <div className="quantity-container flex-05">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="number"
                readOnly
                value={quantity}
                className="quantity-input"
              />
              <button type="button" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
            <div className="action-btn-container">
              <button
                type="button"
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
              <button
                type="button"
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

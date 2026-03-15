import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import empty_img from "../../assets/images/empty_img.png";
import { useCart } from "../../hooks/useCart.js";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeItem,
    inc,
    dec,
    totalQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  const isEmpty = cartItems.length === 0;

  if (isEmpty)
    return (
      <section className="cart">
        <Navbar />
        <div className="empty-container">
          <img
            src={empty_img}
            alt={empty_img}
            loading="eager"
            decoding="async"
            className="empty-cart-img"
          />
          <p className="empty-text">Your Cart is Empty</p>
          <Link className="empty-link" to="/products">
            Continue Shopping
          </Link>
        </div>
      </section>
    );

  return (
    <section className="cart">
      <Navbar />
      <div className="container">
        <div className="cart-header-container">
          <p className="cart-title">Your Cart</p>
          <span className="cart-subtitle">
            {totalQuantity} {totalQuantity > 1 ? "items" : "item"}
          </span>
        </div>
        <div className="cart-divider">
          <div className="cart-items">
            {cartItems.map((item) => {
              return (
                <div className="cart-item">
                  <div className="left-side">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="item-info">
                      <p className="cart-item-category">{item.category}</p>
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-size">Size:{item.selectedSize}</p>
                      <p className="cart-item-price">GH₵ {item.price}</p>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-action-btns-container">
                      <button
                        type="button"
                        onClick={() => inc(item._id, item.selectedSize)}
                      >
                        +
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="cart-item-input"
                      />
                      <button
                        type="button"
                        onClick={() => dec(item._id, item.selectedSize)}
                      >
                        -
                      </button>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeItem(item._id, item.selectedSize)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="order-summary">
            <p className="order-summary-title ">Order Summary</p>
            {cartItems.map((item) => {
              return (
                <div className="order-item flex-sb">
                  <p className="sub">
                    {item.name} X {item.quantity}
                  </p>
                  <p className="sub">GH₵{item.price * item.quantity}</p>
                </div>
              );
            })}
            <div className="order-total-container flex-sb">
              <p className="bold">Total</p>
              <p className="bold">GH₵{totalPrice}</p>
            </div>
            <button
              type="button"
              className="proceed-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
            <Link className="sub order-continue">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

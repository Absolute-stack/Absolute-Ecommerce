import "./OrderConfirmation.css";
import { useState, useEffect } from "react";
import { useStore } from "../../store/store.js";
import { useCart } from "../../hooks/useCart.js";
import { Link, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../api/order.js";
import spinner from "../../assets/images/Eclipse.gif";
import Navbar from "../../components/Navbar/Navbar.jsx";
import error_img from "../../assets/images/error_result.webp";
import success_img from "../../assets/images/Payment success.webp";

export default function OrderConfirmation() {
  const [status, setStatus] = useState("loading");
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { cartItems, clearCart } = useCart();
  const user = useStore((state) => state.auth.user);
  useEffect(() => {
    if (!reference) return setStatus("failed");
    checkPayment();
  }, []);

  async function checkPayment() {
    setStatus("loading");
    try {
      const { paid } = await verifyPayment(reference);
      if (paid) {
        clearCart();
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (error) {
      setStatus("failed");
    }
  }

  if (status === "loading")
    return (
      <div className="loading-confirmation">
        <Navbar filters={{}} onChange={() => {}} />
        <div className="container">
          <div className="verify-container">
            <img src={spinner} alt={spinner} loading="eager" decoding="async" />
            <p>Verifying payment...</p>
          </div>
        </div>
      </div>
    );

  if (status === "failed")
    return (
      <div className="failed-confirmation">
        <Navbar filters={{}} onChange={() => {}} />
        <div className="container">
          <img
            src={error_img}
            alt={error_img}
            loading="eager"
            decoding="async"
            className="order-confirm-error-img"
          />
          <div className="error-msg-container flex">
            <p>Transaction failed </p>
            <span>X</span>
          </div>
          <p className="try-again">Try again</p>
          <Link to="/products" className="link">
            Continue Shopping
          </Link>
          <Link to="/checkout" className="link">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    );
  return (
    <section className="order-confirmation">
      <Navbar filters={{}} onChange={() => {}} />
      <div className="container">
        <div className="success-container">
          <img
            src={success_img}
            alt={success_img}
            loading="eager"
            decoding="async"
            className="success_img"
          />
          <p>Payment Successful</p>
          {!user && (
            <p>
              Here is your {reference} remember it you will need it to track
              your order
            </p>
          )}
          <Link to="/products" className="link">
            Continue Shopping
          </Link>
          <Link className="link">My Orders</Link>
        </div>
      </div>
    </section>
  );
}

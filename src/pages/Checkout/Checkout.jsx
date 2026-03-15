import "./Checkout.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "../../store/store.js";
import { useCart } from "../../hooks/useCart.js";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { createOrder, initializePayment } from "../../api/order.js";

const initialForm = {
  name: "",
  email: "",
  city: "",
  phone: "",
  address: "",
};

export default function Checkout() {
  const location = useLocation();
  const buyNowItem = location?.state?.buyNowItem;

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.auth.user);
  const guest = !user;

  const { cartItems, totalPrice } = useCart();

  const orderItems = buyNowItem
    ? [buyNowItem]
    : cartItems?.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        image: item.images?.[0],
        size: item.selectedSize,
        quantity: item.quantity,
      }));

  const isEmpty = orderItems.length === 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (guest && !form.name) return setError("Name is required");
    if (guest && !form.email) return setError("Email is required");
    if (!form.address) return setError("Address is required");
    if (!form.city) return setError("City is required");
    if (!form.phone) return setError("Phone is required");
    return null;
  }

  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setError(null);
    }, 1000);
    return () => clearTimeout(errorTimer);
  }, [error]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) return;
    setLoading(true);
    try {
      const orderData = {
        items: orderItems,
        shippingAddress: form,
        ...(guest && {
          guestName: form.name,
          guestEmail: form.email,
        }),
      };
      const { order } = await createOrder(orderData);
      const { authorizationURL } = await initializePayment(order._id);
      window.location.href = authorizationURL;
    } catch (error) {
      setError("Something went wrong try again");
    } finally {
      setLoading(false);
    }
  }

  if (isEmpty) return <div>Nothing to checkout...</div>;

  return (
    <section className="checkout-section">
      <Navbar filters={{}} onChange={() => {}} />
      <div className="container">
        <h2 className="checkout-title">Checkout</h2>
        <div className="checkout-divider">
          <form className="form" onSubmit={handleSubmit}>
            <h3>Shipping Details</h3>
            {guest && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John Doe"
                    onChange={handleChange}
                    value={form.name}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="John@gmail.com"
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="AK-109-7023"
                onChange={handleChange}
                value={form.address}
              />
            </div>
            <div className="form-container flex-sb">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="Accra"
                  onChange={handleChange}
                  value={form.city}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Delivery Address</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="+233 XXX XXXX"
                  onChange={handleChange}
                  value={form.phone}
                />
              </div>
            </div>
            <button type="submit" className="checkout-btn">
              Pay GH₵{totalPrice}
            </button>
            <pre className="checkout-error">{error}</pre>
          </form>
          <div className="checkout-summary">
            <p className="bold">Order Summary</p>
            {orderItems.map((item, i) => {
              return (
                <div className="checkout-item flex-sb" key={item._id}>
                  <div className="checkout-item-info-container flex-05">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="eager"
                      decoding="async"
                      className="checkout-item-img"
                    />
                    <div className="text-cont">
                      <p className="bold">{item.name}</p>
                      <p className="sub">
                        Size:{item.selectedSize} Qty:{item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="bold">
                    {buyNowItem
                      ? `GH₵ ${buyNowItem.price}`
                      : `GH₵ ${item.price * item.quantity}`}
                  </p>
                </div>
              );
            })}
            <div className="checkout-total-container flex-sb">
              <p className="bold">Total</p>
              <p className="bold">
                {buyNowItem ? `GH₵ ${buyNowItem.price}` : `GH₵ ${totalPrice}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

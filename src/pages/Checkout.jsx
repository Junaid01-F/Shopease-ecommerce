import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

import { formatPrice } from "../utils/format";

import ProductImage from "../components/ProductImage";

import "./Checkout.css";

const PAYMENT_OPTIONS = [
  { value: "COD", icon: "💵", title: "Cash on Delivery", text: "Pay in cash or UPI when your order arrives" },
  { value: "ONLINE", icon: "💳", title: "Online Payment", text: "Cards, UPI & net banking (gateway coming soon)" }
];

function Checkout() {

  const navigate = useNavigate();

  const { cartItems, cartItemCount, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");


  const handleChange = (event) => {

    let { name, value } = event.target;

    if (name === "phone" || name === "pincode") {
      value = value.replace(/\D/g, "");
    }

    setAddress({ ...address, [name]: value });
  };


  const handleSubmit = (event) => {

    event.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (Object.values(address).some((field) => !field.trim())) {
      setError("Please complete your delivery address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    const order = createOrder({
      items: cartItems,
      address,
      paymentMethod,
      subtotal,
      deliveryCharge,
      total
    });

    clearCart();

    navigate(`/order-success/${order.id}`);
  };


  if (cartItems.length === 0) {

    return (
      <main className="page">
        <div className="empty-state">
          <div className="empty-icon">🧾</div>
          <h1>Your cart is empty</h1>
          <p>Add products before proceeding to checkout.</p>

          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="page checkout-page">

      <div className="container">

        <div className="checkout-steps">
          <span className="done">✓ Cart</span>
          <i />
          <span className="current">② Address &amp; Payment</span>
          <i />
          <span>③ Confirmation</span>
        </div>

        <div className="page-head">
          <h1>Checkout</h1>
          <p>Complete your order in a few quick steps</p>
        </div>

        {error && <div className="alert-error">{error}</div>}


        <div className="checkout-layout">

          <form className="checkout-form" onSubmit={handleSubmit}>

            <section className="checkout-card">

              <h2><span className="step-no">1</span> Delivery Address</h2>

              <div className="checkout-row">
                <div className="field">
                  <label>Full Name</label>
                  <input className="input" type="text" name="fullName" value={address.fullName} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Mobile Number</label>
                  <input className="input" type="tel" name="phone" value={address.phone} onChange={handleChange} maxLength="10" placeholder="10-digit mobile number" />
                </div>
              </div>

              <div className="field">
                <label>Address</label>
                <textarea className="input" name="addressLine" value={address.addressLine} onChange={handleChange} placeholder="House number, street, area" rows="3" />
              </div>

              <div className="checkout-row three">
                <div className="field">
                  <label>City</label>
                  <input className="input" type="text" name="city" value={address.city} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>State</label>
                  <input className="input" type="text" name="state" value={address.state} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Pincode</label>
                  <input className="input" type="text" name="pincode" value={address.pincode} onChange={handleChange} maxLength="6" placeholder="6 digits" />
                </div>
              </div>

            </section>


            <section className="checkout-card">

              <h2><span className="step-no">2</span> Payment Method</h2>

              <div className="payment-options">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`payment-option ${paymentMethod === option.value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />

                    <span className="payment-icon">{option.icon}</span>

                    <div>
                      <strong>{option.title}</strong>
                      <span>{option.text}</span>
                    </div>
                  </label>
                ))}
              </div>

              <button type="submit" className="btn btn-success btn-lg btn-block place-order-btn">
                Place Order · {formatPrice(total)}
              </button>

              <p className="checkout-note">
                🔒 By placing your order you agree to our terms and return policy.
              </p>

            </section>

          </form>


          <aside className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-products">
              {cartItems.map((item) => (
                <div className="checkout-product" key={item.id}>

                  <ProductImage product={item} />

                  <div>
                    <strong>{item.name}</strong>
                    <span>Qty: {item.quantity}</span>
                  </div>

                  <b>{formatPrice(item.price * item.quantity)}</b>

                </div>
              ))}
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal ({cartItemCount} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="checkout-summary-row">
              <span>Delivery</span>
              <span className={deliveryCharge === 0 ? "free-text" : ""}>
                {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
              </span>
            </div>

            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Checkout;
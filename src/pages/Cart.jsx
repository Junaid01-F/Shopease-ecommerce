import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

import ProductImage from "../components/ProductImage";

import "./Cart.css";

const FREE_DELIVERY_THRESHOLD = 999;

function Cart() {

  const {
    cartItems,
    cartItemCount,
    subtotal,
    discount,
    deliveryCharge,
    total,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();


  if (cartItems.length === 0) {

    return (
      <main className="page">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>

          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }


  const mrpTotal = subtotal + discount;
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);


  return (
    <main className="page cart-page">

      <div className="container">

        <div className="page-head cart-head">
          <div>
            <h1>Shopping Cart</h1>
            <p>
              {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear cart
          </button>
        </div>


        <div className="cart-layout">

          <section className="cart-items">

            <div className="delivery-progress">

              {remaining > 0 ? (
                <p>
                  Add <strong>{formatPrice(remaining)}</strong> more to get{" "}
                  <strong>FREE delivery</strong>
                </p>
              ) : (
                <p>🎉 You've unlocked <strong>FREE delivery</strong>!</p>
              )}

              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>

            </div>


            {cartItems.map((item) => (

              <article className="cart-item" key={item.id}>

                <Link to={`/products/${item.id}`}>
                  <ProductImage product={item} className="cart-item-image" />
                </Link>


                <div className="cart-item-info">

                  <p className="cart-item-brand">{item.brand}</p>

                  <Link to={`/products/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>

                  <p className="cart-item-price">
                    {formatPrice(item.price)}
                    {item.originalPrice > item.price && (
                      <del>{formatPrice(item.originalPrice)}</del>
                    )}
                  </p>


                  <div className="cart-item-actions">

                    <div className="cart-qty">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑 Remove
                    </button>

                  </div>

                </div>


                <div className="cart-item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>

              </article>

            ))}

          </section>


          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Price ({cartItemCount} item{cartItemCount !== 1 ? "s" : ""})</span>
              <span>{formatPrice(mrpTotal)}</span>
            </div>

            <div className="summary-row discount-row">
              <span>Discount</span>
              <span>− {formatPrice(discount)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryCharge === 0 ? "free-text" : ""}>
                {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            {discount > 0 && (
              <p className="savings-note">
                🎉 You will save {formatPrice(discount)} on this order
              </p>
            )}

            <Link to="/checkout" className="btn btn-primary btn-lg btn-block">
              Proceed to Checkout
            </Link>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>

            <p className="secure-note">🔒 Safe and secure payments</p>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Cart;
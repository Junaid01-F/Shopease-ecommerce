import { Link, useParams } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import { formatPrice, estimatedDelivery } from "../utils/format";

import ProductImage from "../components/ProductImage";

import "./OrderSuccess.css";

function OrderSuccess() {

  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);


  if (!order) {
    return (
      <main className="page">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h1>Order Not Found</h1>

          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="page order-success-page">

      <div className="success-card">

        <div className="success-icon">✓</div>

        <h1>Order placed successfully!</h1>

        <p className="success-message">
          Thank you for shopping with ShopEase, {order.address.fullName.split(" ")[0]}.
          We'll get your order ready right away.
        </p>


        <div className="order-number">
          <span>Order Number</span>
          <strong>{order.id}</strong>
        </div>


        <div className="success-products">
          {order.items.slice(0, 5).map((item) => (
            <ProductImage key={item.id} product={item} />
          ))}

          {order.items.length > 5 && (
            <span>+{order.items.length - 5}</span>
          )}
        </div>


        <div className="success-details">

          <div>
            <span>Status</span>
            <strong className="status">{order.status}</strong>
          </div>

          <div>
            <span>Estimated delivery</span>
            <strong>{estimatedDelivery(order.orderDate)}</strong>
          </div>

          <div>
            <span>Deliver to</span>
            <strong>{order.address.city}, {order.address.pincode}</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
            </strong>
          </div>

          <div>
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>

        </div>


        <div className="success-actions">

          <Link to={`/orders/${order.id}`} className="btn btn-primary btn-lg">
            View Order Details
          </Link>

          <Link to="/products" className="btn btn-ghost btn-lg">
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
}

export default OrderSuccess;
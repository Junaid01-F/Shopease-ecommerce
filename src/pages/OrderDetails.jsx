import { Link, useParams } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import { formatPrice, formatDate, estimatedDelivery } from "../utils/format";

import ProductImage from "../components/ProductImage";

import "./OrderDetails.css";

const STEPS = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];

function OrderDetails() {

  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);


  if (!order) {
    return (
      <main className="page">
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h1>Order Not Found</h1>
          <p>We couldn't find this order.</p>

          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }


  const currentStep = Math.max(0, STEPS.indexOf(order.status));


  return (
    <main className="page order-details-page">

      <div className="container order-details-container">

        <div className="order-details-header">

          <div>
            <Link to="/orders" className="back-orders">← Back to Orders</Link>
            <h1>Order Details</h1>
            <p>Order # {order.id}</p>
          </div>

          <span className="status-badge">{order.status}</span>

        </div>


        <section className="details-section">

          <h2>Order Progress</h2>

          <div className="timeline">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`timeline-step ${index <= currentStep ? "active" : ""}`}
              >
                <span className="timeline-dot">{index <= currentStep ? "✓" : index + 1}</span>
                <strong>{step.charAt(0) + step.slice(1).toLowerCase()}</strong>
              </div>
            ))}
          </div>

          <p className="eta">
            📅 Estimated delivery by <strong>{estimatedDelivery(order.orderDate)}</strong>
          </p>

        </section>


        <div className="details-two-col">

          <section className="details-section">

            <h2>Order Information</h2>

            <div className="details-grid">
              <div>
                <span>Order Number</span>
                <strong>{order.id}</strong>
              </div>

              <div>
                <span>Order Date</span>
                <strong>{formatDate(order.orderDate, "long")}</strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                </strong>
              </div>

              <div>
                <span>Order Status</span>
                <strong className="status-text">{order.status}</strong>
              </div>
            </div>

          </section>


          <section className="details-section">

            <h2>Delivery Address</h2>

            <div className="address-box">
              <strong>{order.address.fullName}</strong>
              <p>{order.address.addressLine}</p>
              <p>{order.address.city}, {order.address.state}</p>
              <p>Pincode: {order.address.pincode}</p>
              <p>Phone: {order.address.phone}</p>
            </div>

          </section>

        </div>


        <section className="details-section">

          <h2>Items ({order.items.length})</h2>

          <div className="details-products">

            {order.items.map((item) => (

              <div className="details-product" key={item.id}>

                <Link to={`/products/${item.id}`}>
                  <ProductImage product={item} />
                </Link>

                <div className="details-product-info">
                  <Link to={`/products/${item.id}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p>{item.brand} · Qty: {item.quantity}</p>
                </div>

                <strong>{formatPrice(item.price * item.quantity)}</strong>

              </div>

            ))}

          </div>

        </section>


        <section className="details-section price-section">

          <h2>Order Summary</h2>

          <div className="price-row">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>

          <div className="price-row">
            <span>Delivery</span>
            <span className={order.deliveryCharge === 0 ? "status-text" : ""}>
              {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge)}
            </span>
          </div>

          <div className="price-total">
            <span>Total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>

        </section>

      </div>

    </main>
  );
}

export default OrderDetails;
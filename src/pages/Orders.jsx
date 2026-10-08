import { Link } from "react-router-dom";

import { useOrders } from "../context/OrderContext";
import { formatPrice, formatDate } from "../utils/format";

import ProductImage from "../components/ProductImage";

import "./Orders.css";

function Orders() {

  const { orders } = useOrders();


  return (
    <main className="page orders-page">

      <div className="container orders-container">

        <div className="page-head orders-head">
          <div>
            <h1>My Orders</h1>
            <p>View and track all your orders</p>
          </div>

          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>


        {orders.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Your completed orders will appear here.</p>

            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div className="order-card" key={order.id}>

                <div className="order-card-header">

                  <div className="order-meta">
                    <div>
                      <span>Order placed</span>
                      <strong>{formatDate(order.orderDate)}</strong>
                    </div>

                    <div>
                      <span>Total</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>

                    <div>
                      <span>Payment</span>
                      <strong>
                        {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                      </strong>
                    </div>
                  </div>

                  <div className="order-id">
                    <span>Order # {order.id}</span>
                    <span className="status-badge">{order.status}</span>
                  </div>

                </div>


                <div className="order-products">

                  {order.items.slice(0, 3).map((item) => (
                    <div className="order-product" key={item.id}>
                      <ProductImage product={item} />

                      <div>
                        <strong>{item.name}</strong>
                        <span>Qty: {item.quantity} · {formatPrice(item.price)}</span>
                      </div>
                    </div>
                  ))}

                  {order.items.length > 3 && (
                    <span className="more-items">
                      +{order.items.length - 3} more item{order.items.length - 3 > 1 ? "s" : ""}
                    </span>
                  )}

                </div>


                <div className="order-card-footer">
                  <Link to={`/orders/${order.id}`} className="btn btn-outline">
                    View Order Details
                  </Link>
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Orders;
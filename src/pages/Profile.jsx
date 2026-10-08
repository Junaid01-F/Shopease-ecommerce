import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useCart } from "../context/CartContext";

import "./Profile.css";

function Profile() {

  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/");
  };


  return (
    <main className="page profile-page">

      <div className="container profile-container">

        <div className="profile-card">

          <div className="profile-cover" />

          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>


          <div className="profile-stats">
            <Link to="/orders">
              <strong>{orders.length}</strong>
              <span>Orders</span>
            </Link>

            <Link to="/cart">
              <strong>{cartItemCount}</strong>
              <span>In cart</span>
            </Link>
          </div>


          <div className="profile-details">

            <div>
              <span>Account ID</span>
              <strong>#{user.id}</strong>
            </div>

            <div>
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

          </div>


          <div className="profile-actions">

            <Link to="/orders" className="btn btn-primary btn-lg btn-block">
              📦 View My Orders
            </Link>

            <Link to="/products" className="btn btn-ghost btn-lg btn-block">
              Continue Shopping
            </Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;
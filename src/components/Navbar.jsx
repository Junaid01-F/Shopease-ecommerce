import { Link } from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import {
  useCart
} from "../context/CartContext";

import "./Navbar.css";

function Navbar() {

  const {
    user,
    logout
  } = useAuth();

  const {
    cartItemCount
  } = useCart();


  return (
    <nav className="navbar">

      <div className="navbar-container">


        {/* Logo */}

        <Link
          to="/"
          className="logo"
        >
          ShopEase
        </Link>


        {/* Navigation */}

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/products">
            Categories
          </Link>

        </div>


        {/* Actions */}

        <div className="nav-actions">

          <button className="search-btn">
            🔍
          </button>


          <Link
            to="/cart"
            className="cart-link"
          >
            🛒

            <span className="cart-count">
              {cartItemCount}
            </span>

          </Link>


          {user ? (

            <>
              <Link
                to="/profile"
                className="profile-link"
              >
                {user.name}
              </Link>

              <button
                className="logout-nav-btn"
                onClick={logout}
              >
                Logout
              </button>
            </>

          ) : (

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
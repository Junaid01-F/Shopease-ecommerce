import { Link } from "react-router-dom";
import { categoryList } from "../data/categories";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-mark">🛍️</span> ShopEase
          </div>
          <p>
            Quality products, honest prices and fast delivery. Everything you
            need, in one place.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          {categoryList.map((category) => (
            <Link key={category} to={`/products?category=${category}`}>
              {category}
            </Link>
          ))}
        </div>

        <div>
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Shopping Cart</Link>
        </div>

        <div>
          <h4>Why ShopEase</h4>
          <span>🚚 Free delivery above ₹999</span>
          <span>↩️ 7-day easy returns</span>
          <span>🔒 Secure checkout</span>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
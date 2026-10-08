import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

import ProductImage from "./ProductImage";

import "./ProductCard.css";

function ProductCard({ product }) {

  const { addToCart, cartItems } = useCart();

  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const inCart =
    cartItems.find((item) => item.id === product.id)?.quantity || 0;

  const outOfStock = product.stock === 0;


  const handleAdd = () => {

    addToCart(product, 1);

    setAdded(true);

    setTimeout(() => setAdded(false), 1400);
  };


  return (
    <article className="product-card">

      <div className="product-image-container">

        {discount > 0 && (
          <span className="discount-badge">{discount}% OFF</span>
        )}

        <button
          className={`wishlist-btn ${wished ? "active" : ""}`}
          onClick={() => setWished(!wished)}
          aria-label="Add to wishlist"
        >
          {wished ? "♥" : "♡"}
        </button>

        <Link
          to={`/products/${product.id}`}
          className="product-image-link"
        >
          <ProductImage product={product} className="product-image" />
        </Link>

      </div>


      <div className="product-info">

        <p className="product-brand">{product.brand}</p>

        <Link
          to={`/products/${product.id}`}
          className="product-name-link"
        >
          <h3 className="product-name">{product.name}</h3>
        </Link>


        <div className="product-rating">
          <span className="rating">★ {product.rating}</span>
          <span className="review-count">
            ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>


        <div className="product-pricing">
          <span className="current-price">{formatPrice(product.price)}</span>
          <span className="original-price">{formatPrice(product.originalPrice)}</span>
        </div>


        <p
          className={`stock-status ${
            outOfStock ? "out" : product.stock <= 10 ? "low" : ""
          }`}
        >
          {outOfStock
            ? "Out of stock"
            : product.stock <= 10
              ? `Only ${product.stock} left`
              : product.price >= 999
                ? "Free delivery"
                : "In stock"}
        </p>


        <button
          className="btn btn-primary btn-block add-cart-btn"
          disabled={outOfStock || inCart >= product.stock}
          onClick={handleAdd}
        >
          {outOfStock
            ? "Out of Stock"
            : added
              ? "✓ Added to cart"
              : inCart > 0
                ? `Add more (${inCart} in cart)`
                : "Add to Cart"}
        </button>

      </div>

    </article>
  );
}

export default ProductCard;
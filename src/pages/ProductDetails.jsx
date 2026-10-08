import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import products from "../data/products";
import { formatPrice } from "../utils/format";

import ProductImage from "../components/ProductImage";
import ProductGrid from "../components/ProductGrid";
import Stars from "../components/Stars";

import "./ProductDetails.css";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setWished(false);
  }, [id]);


  if (!product) {
    return (
      <main className="page">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h2>Product not found</h2>
          <p>This product may have been removed.</p>

          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }


  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const savings = product.originalPrice - product.price;

  const sameCategory = products.filter(
    (item) => item.category === product.category
  );

  const position = sameCategory.findIndex((item) => item.id === product.id);

  const related = [1, 2, 3, 4].map(
    (step) => sameCategory[(position + step * 7) % sameCategory.length]
  );


  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };


  return (
    <main className="page product-details-page">

      <div className="container">

        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}>
            {product.category}
          </Link>
          <span>/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>


        <section className="product-details">

          <div className="product-details-image">

            {discount > 0 && (
              <span className="details-discount">{discount}% OFF</span>
            )}

            <ProductImage product={product} />

          </div>


          <div className="product-details-info">

            <p className="details-brand">
              {product.brand} · {product.category}
            </p>

            <h1>{product.name}</h1>

            <div className="details-rating">
              <span className="rating-badge">★ {product.rating}</span>
              <Stars value={product.rating} />
              <span>{product.reviewCount.toLocaleString("en-IN")} reviews</span>
            </div>


            <div className="details-price">
              <span className="details-current-price">
                {formatPrice(product.price)}
              </span>

              <span className="details-original-price">
                {formatPrice(product.originalPrice)}
              </span>

              <span className="details-save">
                Save {formatPrice(savings)}
              </span>
            </div>

            <p className="details-tax">Inclusive of all taxes</p>


            <p className="details-description">{product.description}</p>


            {product.features && (
              <ul className="details-features">
                {product.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
            )}


            <div className="pd-stock">
              {product.stock > 0 ? (
                <>
                  <span className="stock-dot" />
                  <strong>In Stock</strong>
                  <span className="stock-number">
                    ({product.stock} available)
                  </span>
                </>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>


            {product.stock > 0 && (
              <div className="pd-quantity-section">

                <span>Quantity</span>

                <div className="pd-qty">
                  <button
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity === 1}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

              </div>
            )}


            <div className="product-actions">

              <button
                className="btn btn-outline btn-lg details-cart-btn"
                disabled={product.stock === 0}
                onClick={handleAdd}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>

              <button
                className="btn btn-primary btn-lg details-cart-btn"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <button
                className={`details-wishlist-btn ${wished ? "active" : ""}`}
                onClick={() => setWished(!wished)}
                aria-label="Add to wishlist"
              >
                {wished ? "♥" : "♡"}
              </button>

            </div>


            <div className="delivery-info">

              <div>
                <span>🚚</span>
                <div>
                  <strong>
                    {product.price >= 999 ? "Free Delivery" : "Delivery ₹49"}
                  </strong>
                  <p>Free on orders above ₹999 · Delivered in 3-5 days</p>
                </div>
              </div>

              <div>
                <span>↩️</span>
                <div>
                  <strong>Easy Returns</strong>
                  <p>7-day return policy</p>
                </div>
              </div>

              <div>
                <span>🛡️</span>
                <div>
                  <strong>Genuine Product</strong>
                  <p>100% authentic with secure payments</p>
                </div>
              </div>

            </div>

          </div>

        </section>


        <section className="product-description-section">

          <div className="description-block">
            <h2>Product Description</h2>
            <p>{product.description}</p>
            <p>
              This product is carefully selected for quality, reliability and
              value. Product specifications and availability may vary
              depending on stock.
            </p>
          </div>

          <div className="description-block">
            <h2>Specifications</h2>

            <table className="spec-table">
              <tbody>
                <tr><td>Brand</td><td>{product.brand}</td></tr>
                <tr><td>Category</td><td>{product.category}</td></tr>
                <tr><td>Product ID</td><td>SE-{String(product.id).padStart(4, "0")}</td></tr>
                <tr><td>Customer Rating</td><td>{product.rating} / 5</td></tr>
                <tr><td>Availability</td><td>{product.stock > 0 ? "In Stock" : "Out of Stock"}</td></tr>
              </tbody>
            </table>
          </div>

        </section>


        <section className="related-section">

          <div className="section-head">
            <h2>You may also like</h2>

            <Link
              to={`/products?category=${product.category}`}
              className="link-arrow"
            >
              More in {product.category} →
            </Link>
          </div>

          <ProductGrid products={related} />

        </section>

      </div>

    </main>
  );
}

export default ProductDetails;
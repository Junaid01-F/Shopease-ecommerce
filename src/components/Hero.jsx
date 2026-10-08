import { Link } from "react-router-dom";

import products from "../data/products";
import { categoryList } from "../data/categories";
import { formatPrice } from "../utils/format";

import ProductImage from "./ProductImage";

import "./Hero.css";

const picks = categoryList.map((category) =>
  products
    .filter((product) => product.category === category)
    .reduce((best, product) =>
      product.rating > best.rating ||
      (product.rating === best.rating && product.reviewCount > best.reviewCount)
        ? product
        : best
    )
);

function Hero() {

  return (
    <section className="hero">

      <div className="container hero-inner">

        <div className="hero-copy">

          <span className="hero-pill">
            ✨ New season · Up to 40% off
          </span>

          <h1>
            Everything you love,
            <br />
            <span>delivered to your door.</span>
          </h1>

          <p className="hero-description">
            Shop 400+ handpicked products across electronics, fashion, sports
            and home — at prices that make sense.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>

            <Link to="/products?category=Electronics" className="btn btn-ghost btn-lg">
              Explore Electronics
            </Link>
          </div>

          <div className="hero-stats">
            <div><strong>404+</strong><span>Products</span></div>
            <div><strong>4.5★</strong><span>Avg. rating</span></div>
            <div><strong>₹999+</strong><span>Free delivery</span></div>
          </div>

        </div>


        <div className="hero-visual">

          {picks.map((product) => (
            <Link
              to={`/products/${product.id}`}
              className="hero-tile"
              key={product.id}
            >
              <ProductImage product={product} />

              <div className="hero-tile-info">
                <strong>{product.name}</strong>
                <span>{formatPrice(product.price)}</span>
              </div>
            </Link>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Hero;
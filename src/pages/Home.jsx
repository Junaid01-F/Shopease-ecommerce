import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";

import products from "../data/products";
import { categoryList, categoryMeta } from "../data/categories";

import "./Home.css";

const trust = [
  { icon: "🚚", title: "Free Delivery", text: "On orders above ₹999" },
  { icon: "↩️", title: "Easy Returns", text: "7-day return policy" },
  { icon: "🔒", title: "Secure Checkout", text: "Your data stays safe" },
  { icon: "💬", title: "Friendly Support", text: "We're here to help" }
];

const featured = (category) =>
  products
    .filter((product) => product.category === category)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 4);

function Home() {

  return (
    <div>

      <Hero />

      <section className="trust-strip">
        <div className="container trust-grid">
          {trust.map((item) => (
            <div className="trust-item" key={item.title}>
              <span>{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Categories />

      {categoryList.map((category) => (
        <section className="home-section container" key={category}>

          <div className="section-head">
            <div>
              <h2>{categoryMeta[category].icon} Top picks in {category}</h2>
              <p>{categoryMeta[category].tagline}</p>
            </div>

            <Link
              to={`/products?category=${category}`}
              className="link-arrow"
            >
              View all →
            </Link>
          </div>

          <ProductGrid products={featured(category)} />

        </section>
      ))}

      <section className="container home-section">
        <div className="promo-banner">
          <div>
            <h2>Free delivery on every order above ₹999</h2>
            <p>Stock up on your favourites and let us handle the shipping.</p>
          </div>

          <Link to="/products" className="btn btn-lg promo-btn">
            Start Shopping
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
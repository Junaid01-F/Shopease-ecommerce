import { Link } from "react-router-dom";

import products from "../data/products";
import { categoryList, categoryMeta } from "../data/categories";

import ProductImage from "./ProductImage";

import "./Categories.css";

const cards = categoryList.map((name) => {

  const list = products.filter((product) => product.category === name);

  const cover = list.reduce((best, product) =>
    product.rating > best.rating ? product : best
  );

  return { name, count: list.length, cover, ...categoryMeta[name] };
});

function Categories() {

  return (
    <section className="categories container">

      <div className="section-head">
        <div>
          <h2>Shop by Category</h2>
          <p>Explore our most popular departments</p>
        </div>
      </div>

      <div className="category-grid">

        {cards.map((category) => (
          <Link
            key={category.name}
            to={`/products?category=${category.name}`}
            className="category-card"
            style={{
              "--c1": category.gradient[0],
              "--c2": category.gradient[1]
            }}
          >
            <ProductImage
              product={category.cover}
              className="category-cover"
            />

            <div className="category-overlay" />

            <span className="category-icon">{category.icon}</span>

            <div className="category-text">
              <h3>{category.name}</h3>
              <p>{category.tagline}</p>
              <span>{category.count} products →</span>
            </div>
          </Link>
        ))}

      </div>

    </section>
  );
}

export default Categories;
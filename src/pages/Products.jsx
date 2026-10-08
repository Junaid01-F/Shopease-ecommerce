import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import products from "../data/products";
import { categoryList, categoryMeta } from "../data/categories";

import ProductGrid from "../components/ProductGrid";

import "./Products.css";

const PAGE_SIZE = 24;
const MAX_PRICE = 100000;

const categoryCounts = products.reduce((counts, product) => {
  counts[product.category] = (counts[product.category] || 0) + 1;
  return counts;
}, {});

const discountOf = (product) =>
  (product.originalPrice - product.price) / product.originalPrice;


function Products() {

  const [params, setParams] = useSearchParams();

  const searchTerm = params.get("search") || "";
  const selectedCategory = params.get("category") || "All";

  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);


  const setParam = (key, value) => {

    const next = new URLSearchParams(params);

    if (value && value !== "All") {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setParams(next, { replace: true });
  };


  const filteredProducts = useMemo(() => {

    let result = [...products];

    const search = searchTerm.toLowerCase().trim();

    if (search) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.brand.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    result = result.filter(
      (product) =>
        product.price <= maxPrice && product.rating >= minRating
    );

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "reviews") result.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === "discount") result.sort((a, b) => discountOf(b) - discountOf(a));
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;

  }, [searchTerm, selectedCategory, maxPrice, minRating, sortBy]);


  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCategory, maxPrice, minRating, sortBy]);


  const resetFilters = () => {
    setParams({}, { replace: true });
    setMaxPrice(MAX_PRICE);
    setMinRating(0);
    setSortBy("featured");
  };


  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const title =
    selectedCategory === "All" ? "All Products" : selectedCategory;


  return (
    <main className="page products-page">

      <div className="container">

        <div className="page-head">
          <h1>{title}</h1>

          <p>
            {searchTerm
              ? `Search results for “${searchTerm}”`
              : "Discover products you'll love"}
          </p>
        </div>


        <div className="category-chips">

          <button
            className={selectedCategory === "All" ? "chip active" : "chip"}
            onClick={() => setParam("category", "All")}
          >
            All <small>{products.length}</small>
          </button>

          {categoryList.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "chip active" : "chip"}
              onClick={() => setParam("category", category)}
            >
              {categoryMeta[category].icon} {category}
              <small>{categoryCounts[category]}</small>
            </button>
          ))}

        </div>


        <div className="products-layout">

          <aside className="filters-sidebar">

            <div className="filter-header">
              <h3>Filters</h3>
              <button onClick={resetFilters}>Reset all</button>
            </div>


            <div className="filter-group">
              <h4>Search</h4>

              <input
                className="input"
                type="text"
                placeholder="Name, brand, category"
                value={searchTerm}
                onChange={(event) => setParam("search", event.target.value)}
              />
            </div>


            <div className="filter-group">
              <h4>Maximum Price</h4>

              <div className="price-value">
                ₹{maxPrice.toLocaleString("en-IN")}
              </div>

              <input
                type="range"
                min="0"
                max={MAX_PRICE}
                step="500"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />

              <div className="range-labels">
                <span>₹0</span>
                <span>₹1,00,000</span>
              </div>
            </div>


            <div className="filter-group">
              <h4>Customer Rating</h4>

              {[0, 3, 4, 4.5].map((rating) => (
                <label className="rating-filter" key={rating}>
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                  />
                  <span>
                    {rating === 0 ? "All ratings" : `★ ${rating} & above`}
                  </span>
                </label>
              ))}
            </div>

          </aside>


          <section className="products-results">

            <div className="results-toolbar">

              <span>
                Showing <strong>{visibleProducts.length}</strong> of{" "}
                <strong>{filteredProducts.length}</strong> products
              </span>

              <label className="sort-box">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </label>

            </div>


            {filteredProducts.length === 0 ? (

              <div className="no-products-card">
                <div className="empty-icon">🔍</div>
                <h2>No products found</h2>
                <p>Try changing your search or filters.</p>

                <button className="btn btn-primary" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>

            ) : (

              <>
                <ProductGrid products={visibleProducts} variant="sidebar" />

                {visibleCount < filteredProducts.length && (
                  <div className="load-more">
                    <button
                      className="btn btn-outline btn-lg"
                      onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}
                    >
                      Load more products
                    </button>
                  </div>
                )}
              </>

            )}

          </section>

        </div>

      </div>

    </main>
  );
}

export default Products;
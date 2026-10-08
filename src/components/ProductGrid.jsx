import ProductCard from "./ProductCard";
import "./ProductGrid.css";

/* variant: "wide" (4 columns) or "sidebar" (3 columns) */

function ProductGrid({ products, variant = "wide" }) {

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h3>No products found</h3>
        <p>Try changing your search or filter.</p>
      </div>
    );
  }

  return (
    <div className={`product-grid ${variant}`}>

      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

    </div>
  );
}

export default ProductGrid;
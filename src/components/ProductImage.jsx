import { useState } from "react";
import { categoryMeta } from "../data/categories";

const escapeXml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function hashString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function wrapText(text, max = 18) {
  const lines = [];
  let line = "";

  text.split(" ").forEach((word) => {
    if ((line + " " + word).trim().length > max) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  });

  if (line) lines.push(line);
  return lines.slice(0, 3);
}

/* Unique generated tile, used only when the photo file is missing */
export function buildPlaceholder(product) {
  const hue = hashString(product.name) % 360;
  const icon = categoryMeta[product.category]?.icon || "🛍️";

  const text = wrapText(product.name)
    .map(
      (line, i) =>
        `<text x='300' y='${440 + i * 40}' text-anchor='middle' font-family='Arial,sans-serif' font-size='32' font-weight='700' fill='hsl(${hue},40%,28%)'>${escapeXml(line)}</text>`
    )
    .join("");

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${hue},75%,93%)'/><stop offset='1' stop-color='hsl(${(hue + 45) % 360},70%,82%)'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><circle cx='300' cy='260' r='130' fill='white' fill-opacity='.55'/><text x='300' y='310' text-anchor='middle' font-size='140'>${icon}</text>${text}</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function ProductImage({ product, className = "", alt }) {
  const [failedSrc, setFailedSrc] = useState(null);

  const useFallback = !product.image || failedSrc === product.image;
  const src = useFallback ? buildPlaceholder(product) : product.image;

  return (
    <img
      src={src}
      alt={alt || product.name}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(product.image)}
    />
  );
}

export default ProductImage;
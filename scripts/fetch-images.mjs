/*
  Downloads one UNIQUE photo per product from Pixabay into
  public/products/<category>/<slug>.jpg

  Usage (PowerShell):
    $env:PIXABAY_API_KEY="your_key"
    node scripts/fetch-images.mjs

  Safe to re-run: existing files are skipped and used photo IDs are
  remembered in scripts/image-manifest.json so no photo is reused.
*/

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import products from "../src/data/products.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "scripts", "image-manifest.json");
const KEY = process.env.PIXABAY_API_KEY;

if (!KEY) {
  console.error("Set PIXABAY_API_KEY first (free key: https://pixabay.com/api/docs/)");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exists = (file) => fs.access(file).then(() => true, () => false);

let manifest = {};
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
} catch {
  manifest = {};
}

const used = new Set(Object.values(manifest));
const pools = new Map();

const saveManifest = () =>
  fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

async function search(query, page) {
  const url =
    `https://pixabay.com/api/?key=${KEY}` +
    `&q=${encodeURIComponent(query.slice(0, 95))}` +
    `&image_type=photo&per_page=100&page=${page}&safesearch=true`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url);

    if (res.status === 429) {
      console.log("Rate limit hit, waiting 65 seconds...");
      await sleep(65000);
      continue;
    }

    if (res.status === 400 && page > 1) return [];
    if (!res.ok) throw new Error(`Pixabay API error ${res.status}`);

    return (await res.json()).hits || [];
  }

  throw new Error("Pixabay rate limit not clearing, try again later");
}

async function nextPhoto(query) {
  let pool = pools.get(query);

  if (!pool) {
    pool = { page: 0, photos: [], done: false };
    pools.set(query, pool);
  }

  while (true) {
    const index = pool.photos.findIndex((photo) => !used.has(photo.id));

    if (index !== -1) {
      const [photo] = pool.photos.splice(index, 1);
      used.add(photo.id);
      return photo;
    }

    if (pool.done) return null;

    pool.page += 1;
    const photos = await search(query, pool.page);
    pool.photos.push(...photos);

    if (photos.length < 100 || pool.page >= 4) pool.done = true;
  }
}

/* Try the full query, then progressively simpler ones */
async function findPhoto(product) {
  const full = product.imageQuery || product.name;
  const words = full.split(" ");

  const attempts = [
    full,
    words.slice(-2).join(" "),
    words.slice(-1).join(" "),
    product.category
  ];

  for (const query of [...new Set(attempts)]) {
    const photo = await nextPhoto(query);
    if (photo) return photo;
  }

  return null;
}

let downloaded = 0;
let missing = 0;

try {
  for (const product of products) {
    const file = path.join(root, "public", product.image);

    if (await exists(file)) continue;

    await fs.mkdir(path.dirname(file), { recursive: true });

    const photo = await findPhoto(product);

    if (!photo) {
      missing++;
      console.warn(`No photo found for: ${product.name}`);
      continue;
    }

    const img = await fetch(photo.webformatURL);

    if (!img.ok) {
      missing++;
      console.warn(`Download failed for: ${product.name}`);
      continue;
    }

    await fs.writeFile(file, Buffer.from(await img.arrayBuffer()));

    manifest[product.image] = photo.id;
    downloaded++;

    console.log(`[${downloaded}] ${product.image}`);

    if (downloaded % 20 === 0) await saveManifest();
    await sleep(100);
  }
} catch (error) {
  await saveManifest();
  console.error("\nStopped:", error.message);
  console.error("Run the script again to continue where it stopped.");
  process.exit(1);
}

await saveManifest();
console.log(`\nDone. Downloaded ${downloaded} images. Without a photo: ${missing}.`);
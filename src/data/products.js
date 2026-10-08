/* =========================================================
   SHOP EASE PRODUCT CATALOG
   101 unique products x 4 categories = 404 products.
   Every product has its own image path:
   /public/products/<category>/<product-name-slug>.jpg
   (run scripts/fetch-images.mjs to download the photos)
   ========================================================= */

function slugifyProductName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductImage(productName, category) {
  return `/products/${category.toLowerCase()}/${slugifyProductName(productName)}.jpg`;
}

const categoryFeatures = {
  Electronics: [
    "1-year manufacturer warranty",
    "Fast, reliable performance",
    "Energy-efficient design",
    "Tested for quality and safety"
  ],
  Fashion: [
    "Soft, breathable fabric",
    "True-to-size comfortable fit",
    "Easy care and long lasting",
    "Free exchange within 7 days"
  ],
  Sports: [
    "Built for intense training",
    "Lightweight and durable build",
    "Comfortable, secure grip and fit",
    "Suitable for beginners and pros"
  ],
  Home: [
    "Sturdy, long-lasting materials",
    "Modern, easy-to-match design",
    "Simple assembly and maintenance",
    "Great value for everyday living"
  ]
};

/* ---------------------- SEED PRODUCTS ---------------------- */

const seedProducts = [
  { id: 1, name: "Wireless Noise Cancelling Headphones", description: "Premium wireless headphones with active noise cancellation and up to 30 hours of battery life.", price: 7999, originalPrice: 9999, category: "Electronics", brand: "SoundMax", rating: 4.5, reviewCount: 128, stock: 15 },
  { id: 2, name: "Men's Classic Cotton T-Shirt", description: "Comfortable 100% cotton regular-fit t-shirt suitable for everyday wear.", price: 899, originalPrice: 1299, category: "Fashion", brand: "UrbanWear", rating: 4.2, reviewCount: 86, stock: 42 },
  { id: 3, name: "Smart LED Television 55 Inch", description: "4K Ultra HD smart television with HDR, built-in streaming apps and Dolby Audio.", price: 42999, originalPrice: 49999, category: "Electronics", brand: "VisionTech", rating: 4.6, reviewCount: 214, stock: 8 },
  { id: 4, name: "Running Shoes", description: "Lightweight running shoes with breathable mesh and responsive cushioning.", price: 2499, originalPrice: 3499, category: "Sports", brand: "RunPro", rating: 4.4, reviewCount: 172, stock: 24 },
  { id: 5, name: "Modern Office Chair", description: "Ergonomic office chair with adjustable height, lumbar support and breathable backrest.", price: 6999, originalPrice: 8999, category: "Home", brand: "ComfortSpace", rating: 4.3, reviewCount: 94, stock: 12 },
  { id: 6, name: "Mechanical Gaming Keyboard", description: "RGB mechanical keyboard with tactile switches and durable aluminum construction.", price: 3299, originalPrice: 4499, category: "Electronics", brand: "GameCore", rating: 4.7, reviewCount: 301, stock: 19 },
  { id: 7, name: "Women's Casual Handbag", description: "Elegant everyday handbag with spacious compartments and durable synthetic leather.", price: 1799, originalPrice: 2499, category: "Fashion", brand: "StyleCraft", rating: 4.1, reviewCount: 63, stock: 31 },
  { id: 8, name: "Stainless Steel Water Bottle", description: "Double-wall insulated bottle that keeps beverages cold for 24 hours.", price: 799, originalPrice: 1199, category: "Sports", brand: "HydroMax", rating: 4.5, reviewCount: 145, stock: 55 }
].map((product) => ({
  ...product,
  imageQuery: product.name,
  features: categoryFeatures[product.category],
  image: getProductImage(product.name, product.category)
}));

const products = [...seedProducts];

/* ---------------------- GENERATION DATA ---------------------- */

const MIN_PRODUCTS_PER_CATEGORY = 101;

const productNameVariants = [
  "Classic", "Premium", "Essential", "Pro", "Plus", "Lite", "Max", "Ultra",
  "Everyday", "Deluxe", "Modern", "Comfort", "Advanced", "Signature", "Urban",
  "Elite", "Smart", "Portable", "Compact", "Professional", "Studio", "Active",
  "Performance", "Flex", "Eco", "Prime", "Select", "Premium Edition",
  "Special Edition", "Limited Edition"
];

const categoryNames = {
  Electronics: [
    "Wireless Earbuds", "Bluetooth Speaker", "Smart Watch", "Gaming Mouse", "Laptop Backpack",
    "USB-C Charger", "Power Bank", "Wireless Keyboard", "Computer Monitor", "Gaming Headset",
    "Webcam", "Tablet", "Smartphone", "Portable SSD", "External Hard Drive",
    "Wi-Fi Router", "USB Hub", "Laptop Stand", "Mobile Tripod", "Smart Plug",
    "Streaming Stick", "Digital Camera", "Action Camera", "Camera Tripod", "Microphone",
    "Soundbar", "Projector", "Gaming Controller", "VR Headset", "Smart Doorbell"
  ],
  Fashion: [
    "Cotton T-Shirt", "Slim Fit Jeans", "Casual Shirt", "Hoodie", "Denim Jacket",
    "Polo T-Shirt", "Formal Shirt", "Chinos", "Cargo Pants", "Track Pants",
    "Sweatshirt", "Kurta", "Saree", "Dress", "Maxi Dress",
    "Casual Skirt", "Leather Jacket", "Blazer", "Winter Jacket", "Sports T-Shirt",
    "Sneakers", "Casual Shoes", "Formal Shoes", "Sandals", "Loafers",
    "Handbag", "Backpack", "Wallet", "Sunglasses", "Cap"
  ],
  Sports: [
    "Running Shoes", "Training Shoes", "Football", "Cricket Bat", "Cricket Ball",
    "Tennis Racket", "Badminton Racket", "Basketball", "Volleyball", "Table Tennis Bat",
    "Yoga Mat", "Gym Gloves", "Resistance Bands", "Skipping Rope", "Dumbbell Set",
    "Kettlebell", "Gym Bag", "Sports Bottle", "Cycling Helmet", "Football Shoes",
    "Sports Socks", "Compression T-Shirt", "Track Pants", "Sports Shorts", "Swimming Goggles",
    "Swimming Cap", "Tennis Balls", "Golf Balls", "Golf Gloves", "Fitness Tracker"
  ],
  Home: [
    "Office Chair", "Study Table", "Coffee Table", "Bedside Table", "Bookshelf",
    "Sofa", "Dining Chair", "Dining Table", "Floor Lamp", "Table Lamp",
    "Ceiling Light", "Wall Clock", "Curtains", "Bedsheet", "Pillow",
    "Blanket", "Cushion", "Carpet", "Doormat", "Storage Box",
    "Kitchen Rack", "Dinner Set", "Coffee Mug", "Water Bottle", "Frying Pan",
    "Cookware Set", "Knife Set", "Cutting Board", "Laundry Basket", "Bathroom Organizer"
  ]
};

const categoryBrands = {
  Electronics: ["SoundMax", "VisionTech", "GameCore", "TechNova", "Electra", "SmartEdge", "PixelPro", "DigitalOne", "NextGen", "Voltix"],
  Fashion: ["UrbanWear", "StyleCraft", "TrendLine", "FashionHub", "StreetStyle", "ModeX", "ClassicWear", "UrbanEdge", "StyleHouse", "VogueFit"],
  Sports: ["RunPro", "SportX", "FitZone", "ActivePro", "PowerPlay", "GameFit", "Athletica", "MoveMax", "ProSport", "PeakFit"],
  Home: ["ComfortSpace", "HomeNest", "CasaLiving", "UrbanHome", "HomeCraft", "LivingPlus", "DecorHouse", "CozyHome", "ModernLiving", "HomeStyle"]
};

const categoryPriceRanges = {
  Electronics: { min: 999, max: 75000 },
  Fashion: { min: 399, max: 9999 },
  Sports: { min: 499, max: 14999 },
  Home: { min: 499, max: 29999 }
};

const descriptionTemplates = {
  Electronics: (name) =>
    `The ${name} combines dependable performance with a sleek, modern design. Built with quality components and tested for everyday reliability, it is a smart upgrade for work, play and everything in between.`,
  Fashion: (name) =>
    `The ${name} is made from comfortable, high-quality material with a flattering fit. A versatile addition to your wardrobe that looks great on its own or styled with your favourite pieces.`,
  Sports: (name) =>
    `The ${name} is engineered for performance and durability. Whether you are training at home, at the gym or on the field, it helps you push harder and play longer.`,
  Home: (name) =>
    `The ${name} brings practical style to your home. Crafted from durable materials with a clean, contemporary look, it fits naturally into any room and makes everyday living easier.`
};

/* ---------------------- GENERATE REMAINING ---------------------- */

let nextProductId = Math.max(...products.map((product) => product.id)) + 1;

const usedNames = new Set(products.map((product) => product.name));

Object.keys(categoryNames).forEach((category) => {
  const currentCount = products.filter((product) => product.category === category).length;
  const productsNeeded = Math.max(0, MIN_PRODUCTS_PER_CATEGORY - currentCount);

  const names = categoryNames[category];
  const brands = categoryBrands[category];
  const priceRange = categoryPriceRanges[category];

  for (let index = 0; index < productsNeeded; index++) {
    const baseName = names[index % names.length];

    /* (base, variant) pairs never repeat for index < 900 */
    const variant =
      productNameVariants[
        (index + Math.floor(index / names.length) * 7) % productNameVariants.length
      ];

    let name = `${baseName} ${variant}`;
    while (usedNames.has(name)) name += " II";
    usedNames.add(name);

    const brand = brands[(index + Math.floor(index / brands.length)) % brands.length];
    const productId = nextProductId++;

    const priceRangeSize = priceRange.max - priceRange.min;
    const priceVariation = (index * 137 + productId * 31) % priceRangeSize;
    const price = Math.round((priceRange.min + priceVariation) / 50) * 50;

    const discountPercent = 10 + (index % 31);
    const originalPrice = Math.max(
      Math.round(price / (1 - discountPercent / 100) / 50) * 50,
      price + 50
    );

    const rating = Number((3.6 + ((index * 7) % 14) / 10).toFixed(1));
    const reviewCount = 25 + ((index * 47 + productId * 3) % 2500);
    const stock = 5 + ((index * 17 + productId * 5) % 96);

    products.push({
      id: productId,
      name,
      description: descriptionTemplates[category](name),
      price,
      originalPrice,
      category,
      brand,
      rating,
      reviewCount,
      stock,
      imageQuery: baseName,
      features: categoryFeatures[category],
      image: getProductImage(name, category)
    });
  }
});

if (products.length !== 404) {
  console.warn(`Expected 404 products but found ${products.length}.`);
}

export default products;
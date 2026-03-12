import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "./models/productModel.js";

const MONGO_URI = process.env.DB;

// ─── Real Unsplash images per category ───────────────────────────────────────
const images = {
  tshirts: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=800",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800",
  ],
  hoodies: [
    "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800",
    "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800",
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=800",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
  ],
  pants: [
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
    "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800",
    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800",
    "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800",
    "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800",
  ],
  sneakers: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    "https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=800",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
    "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800",
  ],
  jackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800",
    "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=800",
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800",
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800",
    "https://images.unsplash.com/photo-1520975867351-fd0d42f7e0ad?w=800",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    "https://images.unsplash.com/photo-1625591342274-013866180a31?w=800",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
    "https://images.unsplash.com/photo-1512201078372-9c6b2a0d528b?w=800",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800",
  ],
  dresses: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
    "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
    "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800",
    "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800",
  ],
  bags: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800",
    "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=800",
    "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
  ],
};

// ─── Product config per category ─────────────────────────────────────────────
const catalog = {
  tshirts: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    priceRange: [15, 65],
    names: [
      "Essential Cotton Tee",
      "Oversized Graphic Tee",
      "Vintage Wash Tee",
      "Premium Slim Fit Tee",
      "Relaxed Drop Shoulder Tee",
      "Classic Crew Neck Tee",
      "Tie-Dye Tee",
      "Striped Pocket Tee",
      "Longline Basic Tee",
      "Acid Wash Tee",
    ],
    descriptions: [
      "A timeless essential tee crafted from 100% organic cotton for all-day comfort.",
      "An oversized graphic tee with a bold print, perfect for a street-style look.",
      "A vintage-washed tee with a worn-in feel that gets better with every wash.",
      "A premium slim-fit tee made from soft pima cotton for a clean, tailored look.",
      "A relaxed drop-shoulder tee with a modern silhouette for effortless style.",
    ],
  },
  hoodies: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    priceRange: [45, 130],
    names: [
      "Classic Pullover Hoodie",
      "Zip-Up Fleece Hoodie",
      "Oversized Hoodie",
      "Vintage Hoodie",
      "Heavyweight Hoodie",
      "French Terry Hoodie",
      "Cropped Hoodie",
      "Half-Zip Hoodie",
      "Graphic Hoodie",
      "Essential Hoodie",
    ],
    descriptions: [
      "A classic pullover hoodie with a soft fleece interior, perfect for chilly days.",
      "A zip-up hoodie with a cozy fleece lining and a modern relaxed fit.",
      "An oversized hoodie in a premium heavyweight fabric for a streetwear aesthetic.",
      "A vintage-inspired hoodie with a washed finish and retro embroidery details.",
      "A heavyweight hoodie built for warmth, crafted from thick cotton-blend fabric.",
    ],
  },
  pants: {
    sizes: ["28", "30", "32", "34", "36", "38"],
    priceRange: [40, 120],
    names: [
      "Slim Fit Chinos",
      "Relaxed Cargo Pants",
      "Classic Straight Jeans",
      "Tapered Joggers",
      "Wide Leg Trousers",
      "Slim Fit Jeans",
      "Utility Cargo Pants",
      "Pleated Dress Pants",
      "Stretch Skinny Jeans",
      "Linen Pants",
    ],
    descriptions: [
      "Slim-fit chinos made from stretch cotton for a sharp yet comfortable look.",
      "Relaxed cargo pants with multiple pockets, built for function and style.",
      "Classic straight-leg jeans in a timeless wash, a wardrobe staple.",
      "Tapered joggers in a soft French terry fabric, perfect for on-the-go comfort.",
      "Wide-leg trousers with a relaxed silhouette for an effortlessly elevated look.",
    ],
  },
  sneakers: {
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    priceRange: [60, 220],
    names: [
      "Classic Low-Top Sneaker",
      "Chunky Sole Sneaker",
      "Minimalist Runner",
      "High-Top Basketball Sneaker",
      "Retro Court Sneaker",
      "Slip-On Canvas Sneaker",
      "Trail Running Sneaker",
      "Platform Sneaker",
      "Leather Sneaker",
      "Tech Runner",
    ],
    descriptions: [
      "A classic low-top sneaker with a clean silhouette and premium leather upper.",
      "A chunky sole sneaker with bold proportions and maximum street-style impact.",
      "A minimalist runner with a lightweight mesh upper and responsive cushioning.",
      "A high-top sneaker inspired by basketball culture with premium ankle support.",
      "A retro court sneaker with vintage-inspired details and a modern comfort fit.",
    ],
  },
  jackets: {
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    priceRange: [80, 280],
    names: [
      "Classic Denim Jacket",
      "Bomber Jacket",
      "Puffer Jacket",
      "Trench Coat",
      "Windbreaker",
      "Leather Jacket",
      "Utility Jacket",
      "Overshirt Jacket",
      "Coach Jacket",
      "Sherpa Jacket",
    ],
    descriptions: [
      "A classic denim jacket with a vintage wash and a timeless silhouette.",
      "A sleek bomber jacket in satin fabric with ribbed cuffs and a clean finish.",
      "A lightweight puffer jacket with warm insulation and a packable design.",
      "A tailored trench coat in water-resistant fabric for a sophisticated look.",
      "A technical windbreaker with taped seams and a packable hood.",
    ],
  },
  accessories: {
    sizes: ["ONE SIZE"],
    priceRange: [10, 80],
    names: [
      "Beanie Hat",
      "Baseball Cap",
      "Leather Belt",
      "Canvas Tote Bag",
      "Wool Scarf",
      "Sunglasses",
      "Snapback Cap",
      "Bucket Hat",
      "Knit Gloves",
      "Crossbody Pouch",
    ],
    descriptions: [
      "A cozy ribbed beanie in soft merino wool blend, perfect for cold days.",
      "A structured baseball cap with an embroidered logo and adjustable strap.",
      "A genuine leather belt with a classic buckle, a timeless wardrobe essential.",
      "A heavyweight canvas tote bag with reinforced handles and a spacious interior.",
      "A soft wool scarf with fringed edges, adding warmth and style to any outfit.",
    ],
  },
  dresses: {
    sizes: ["XS", "S", "M", "L", "XL"],
    priceRange: [35, 160],
    names: [
      "Floral Midi Dress",
      "Slip Dress",
      "Wrap Dress",
      "Shirt Dress",
      "Mini Dress",
      "Maxi Dress",
      "Off-Shoulder Dress",
      "Bodycon Dress",
      "Linen Dress",
      "Smock Dress",
    ],
    descriptions: [
      "A floral midi dress in a lightweight fabric, perfect for warm-weather occasions.",
      "A satin slip dress with adjustable straps and a sleek, minimalist silhouette.",
      "A wrap dress in a flowing fabric with a flattering adjustable waist tie.",
      "A relaxed shirt dress with a button-down front and a casual everyday vibe.",
      "A breezy linen dress with a relaxed fit, ideal for warm summer days.",
    ],
  },
  bags: {
    sizes: ["ONE SIZE"],
    priceRange: [30, 250],
    names: [
      "Mini Crossbody Bag",
      "Leather Tote Bag",
      "Backpack",
      "Shoulder Bag",
      "Clutch Bag",
      "Gym Duffle Bag",
      "Bucket Bag",
      "Fanny Pack",
      "Camera Bag",
      "Weekender Bag",
    ],
    descriptions: [
      "A compact crossbody bag with a zip closure and adjustable strap for everyday use.",
      "A structured leather tote with a spacious interior and premium hardware.",
      "A versatile backpack with multiple compartments and padded laptop sleeve.",
      "A soft leather shoulder bag with a top handle and detachable shoulder strap.",
      "A sleek clutch bag in faux leather, perfect for evenings out.",
    ],
  },
};

// ─── Distribution: 200 products ──────────────────────────────────────────────
const distribution = [
  { category: "tshirts", count: 35 },
  { category: "hoodies", count: 25 },
  { category: "pants", count: 25 },
  { category: "sneakers", count: 30 },
  { category: "jackets", count: 25 },
  { category: "accessories", count: 20 },
  { category: "dresses", count: 25 },
  { category: "bags", count: 15 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomPrice = ([min, max]) =>
  Math.round(getRandomInt(min, max) / 5) * 5; // round to nearest 5
const getRandomImages = (category) => {
  const pool = [...images[category]];
  const count = getRandomInt(2, 4);
  const result = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
};
const getRandomSizes = (allSizes) => {
  if (allSizes.length === 1) return allSizes; // ONE SIZE
  const count = getRandomInt(3, allSizes.length);
  const shuffled = [...allSizes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).sort(
    (a, b) => allSizes.indexOf(a) - allSizes.indexOf(b), // preserve size order
  );
};

// ─── Generate products ────────────────────────────────────────────────────────
function generateProducts() {
  const products = [];

  for (const { category, count } of distribution) {
    const config = catalog[category];

    for (let i = 0; i < count; i++) {
      const stock = getRandomInt(0, 100);

      products.push({
        name: getRandom(config.names),
        description: getRandom(config.descriptions),
        category,
        price: getRandomPrice(config.priceRange),
        images: getRandomImages(category),
        sizes: getRandomSizes(config.sizes),
        stock,
        isActive: stock > 0,
      });
    }
  }

  return products;
}

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected\n");

    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});
    console.log("✅ Cleared\n");

    console.log("🌱 Generating 200 products...");
    const products = generateProducts();

    console.log("💾 Inserting into MongoDB...");
    await Product.insertMany(products);

    // Summary
    const counts = distribution.map(
      ({ category, count }) => `  ${category}: ${count}`,
    );
    console.log("\n✅ Seeded successfully!");
    console.log("📦 Product breakdown:");
    console.log(counts.join("\n"));
    console.log(`\n  Total: ${products.length} products`);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

seed();

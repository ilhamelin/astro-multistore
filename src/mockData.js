export const PRESETS = {
  tech: {
    id: "tech",
    name: "Neo-Tech",
    slogan: "Futuristic gadgets and high-performance gear for digital pioneers.",
    fontHeading: "font-mono tracking-tight font-black",
    fontBody: "font-sans font-light",
    themeClass: "theme-tech",
    colors: {
      primary: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400 bg-cyan-950/40 border-cyan-800",
      accentRaw: "#06b6d4",
      bg: "bg-slate-950 text-slate-100",
      cardBg: "bg-slate-900/80 border-slate-800 backdrop-blur-md",
      navBg: "bg-slate-950/80 border-slate-800 backdrop-blur-lg",
      button: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 transition-all duration-200 uppercase font-bold text-xs rounded-none border border-cyan-300",
      buttonSecondary: "bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-800",
      input: "bg-slate-950 border-slate-800 focus:border-cyan-500 text-slate-100",
      footerBg: "bg-slate-950 border-t border-slate-900",
      heroOverlay: "bg-gradient-to-r from-slate-950 via-slate-950/90 to-cyan-950/20"
    },
    heroImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    categories: ["Audio", "Peripherals", "Wearables", "Components"]
  },
  luxury: {
    id: "luxury",
    name: "Quiet Luxury",
    slogan: "Exquisite craftsmanship and timeless elegance for the refined taste.",
    fontHeading: "font-serif tracking-wide italic font-medium",
    fontBody: "font-serif",
    themeClass: "theme-luxury",
    colors: {
      primary: "from-amber-800 to-amber-950",
      accent: "text-amber-300 bg-stone-900 border-amber-800/40",
      accentRaw: "#d97706",
      bg: "bg-stone-950 text-stone-100",
      cardBg: "bg-stone-900/40 border-stone-800 backdrop-blur-sm",
      navBg: "bg-stone-950/95 border-b border-stone-900",
      button: "bg-amber-700 hover:bg-amber-600 text-stone-100 font-serif tracking-widest text-xs uppercase rounded-none transition-colors duration-300 border border-amber-600/30",
      buttonSecondary: "bg-transparent hover:bg-stone-900 text-stone-200 border border-stone-850",
      input: "bg-stone-900 border-stone-800 focus:border-amber-700 text-stone-100",
      footerBg: "bg-stone-950 border-t border-stone-900",
      heroOverlay: "bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent"
    },
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
    categories: ["Apparel", "Jewelry", "Watches", "Accessories"]
  },
  eco: {
    id: "eco",
    name: "Emerald Eco",
    slogan: "Sustainably sourced, thoughtfully designed essentials for natural living.",
    fontHeading: "font-sans font-extrabold tracking-tight",
    fontBody: "font-sans",
    themeClass: "theme-eco",
    colors: {
      primary: "from-emerald-800 to-teal-900",
      accent: "text-emerald-300 bg-emerald-950/50 border-emerald-800/30",
      accentRaw: "#10b981",
      bg: "bg-zinc-900 text-zinc-100",
      cardBg: "bg-zinc-850/60 border-zinc-800 backdrop-blur-md rounded-2xl",
      navBg: "bg-zinc-900/90 border-b border-zinc-800/50 backdrop-blur-md",
      button: "bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 active:scale-98 transition-all font-semibold",
      buttonSecondary: "bg-zinc-800 hover:bg-zinc-750 text-emerald-400 border border-zinc-700 rounded-xl",
      input: "bg-zinc-850 border-zinc-800 focus:border-emerald-600 text-zinc-100 rounded-xl",
      footerBg: "bg-zinc-950 border-t border-zinc-900",
      heroOverlay: "bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent"
    },
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
    categories: ["Home Goods", "Kitchen", "Self-Care", "Gardening"]
  },
  bakery: {
    id: "bakery",
    name: "Sunset Bakery",
    slogan: "Warm, fresh, and handmade artisan treats delivered straight to your door.",
    fontHeading: "font-serif tracking-normal font-bold",
    fontBody: "font-sans",
    themeClass: "theme-bakery",
    colors: {
      primary: "from-orange-400 to-amber-600",
      accent: "text-amber-800 bg-amber-100 border-amber-200",
      accentRaw: "#d97706",
      bg: "bg-amber-50/90 text-amber-950",
      cardBg: "bg-white border-amber-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow",
      navBg: "bg-white/80 border-b border-amber-100 backdrop-blur-md",
      button: "bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg shadow-amber-500/20 active:scale-95 transition-all font-medium",
      buttonSecondary: "bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full",
      input: "bg-white border-amber-200 focus:border-amber-500 text-amber-950 rounded-full px-4",
      footerBg: "bg-amber-100/50 border-t border-amber-200",
      heroOverlay: "bg-gradient-to-r from-amber-50/90 via-amber-50/70 to-transparent"
    },
    heroImage: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    categories: ["Breads", "Pastries", "Cakes", "Beverages"]
  }
};

export const INITIAL_PRODUCTS = [
  // Tech products
  {
    id: "tech-1",
    name: "CyberClaw Mechanical Keyboard",
    price: 189.99,
    description: "Hot-swappable tactile mechanical keyboard with custom programmable dynamic RGB backlighting and aluminum enclosure.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
    category: "Peripherals",
    stock: 12,
    theme: "tech",
    rating: 4.8,
    specs: { "Switch Type": "Gateron Brown", "Layout": "75% ANSI", "Connectivity": "USB-C & Bluetooth" }
  },
  {
    id: "tech-2",
    name: "ApexPulse Wireless ANC Headphones",
    price: 299.99,
    description: "Hybrid active noise canceling headphones featuring hi-res audio, 40-hour battery life, and spatial audio support.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    category: "Audio",
    stock: 8,
    theme: "tech",
    rating: 4.9,
    specs: { "Battery Life": "40 Hours", "ANC": "Hybrid Active", "Driver Size": "40mm Silk Dome" }
  },
  {
    id: "tech-3",
    name: "SpectraLink OLED Smart Watch",
    price: 249.50,
    description: "Keep track of your vitals and notifications with an ultra-bright AMOLED curved screen and built-in standalone GPS.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600",
    category: "Wearables",
    stock: 25,
    theme: "tech",
    rating: 4.5,
    specs: { "Screen": "1.78\" AMOLED", "GPS": "Built-in GLONASS", "Waterproof": "5 ATM" }
  },
  {
    id: "tech-4",
    name: "AeroGlide Ergonomic Mouse",
    price: 89.99,
    description: "Ultra-lightweight gaming and productivity mouse featuring a flawless 26k DPI sensor and dual wireless connectivity.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600",
    category: "Peripherals",
    stock: 18,
    theme: "tech",
    rating: 4.7,
    specs: { "Weight": "55 grams", "Sensor": "PixArt 3395", "DPI": "Up to 26,000" }
  },

  // Luxury products
  {
    id: "lux-1",
    name: "Mélange Silk Trench Coat",
    price: 850.00,
    description: "A timeless, fluid double-breasted coat crafted from pure Italian heavy silk twill, offering a relaxed yet refined silhouette.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600",
    category: "Apparel",
    stock: 4,
    theme: "luxury",
    rating: 4.9,
    specs: { "Material": "100% Italian Silk", "Origin": "Made in Italy", "Care": "Dry clean only" }
  },
  {
    id: "lux-2",
    name: "Aurelia Gold Link Necklace",
    price: 1200.00,
    description: "Handcrafted 18k solid yellow gold chunky chain link necklace with a polished toggle clasp. Perfect for layering.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600",
    category: "Jewelry",
    stock: 3,
    theme: "luxury",
    rating: 5.0,
    specs: { "Metal": "18k Yellow Gold", "Length": "45cm", "Weight": "24.5g" }
  },
  {
    id: "lux-3",
    name: "The Chronos Minimalist Watch",
    price: 1750.00,
    description: "Elegant mechanical watch featuring an automatic movement, sapphire crystal back, and a hand-stitched alligator strap.",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600",
    category: "Watches",
    stock: 5,
    theme: "luxury",
    rating: 4.8,
    specs: { "Movement": "Automatic Swiss", "Case Diameter": "38mm", "Strap": "Alligator Leather" }
  },

  // Eco products
  {
    id: "eco-1",
    name: "Hand-Thrown Ceramic Planter",
    price: 45.00,
    description: "Locally sourced stoneware clay pot with a beautiful speckled white glaze. Includes drainage hole and matching saucer.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
    category: "Home Goods",
    stock: 14,
    theme: "eco",
    rating: 4.7,
    specs: { "Dimensions": "6\" Diameter x 5.5\" H", "Material": "Speckled Stoneware", "Finish": "Gloss Glaze" }
  },
  {
    id: "eco-2",
    name: "Bamboo Travel Dinnerware Kit",
    price: 28.00,
    description: "Compact reusable zero-waste dining set containing bamboo fork, knife, spoon, chopsticks, and straw in an organic canvas pouch.",
    image: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=600",
    category: "Kitchen",
    stock: 45,
    theme: "eco",
    rating: 4.6,
    specs: { "Includes": "6 Pieces", "Material": "Certified Organic Bamboo", "Pouch": "Unbleached Cotton" }
  },
  {
    id: "eco-3",
    name: "Cold-Pressed Organic Soap Bar Set",
    price: 32.00,
    description: "Set of four botanical cold-pressed soaps (Lavender Cedar, Oatmeal Honey, Eucalyptus Mint, and Sage Grapefruit).",
    image: "https://images.unsplash.com/photo-1607006342411-9a905c3ee126?auto=format&fit=crop&q=80&w=600",
    category: "Self-Care",
    stock: 30,
    theme: "eco",
    rating: 4.9,
    specs: { "Quantity": "4 x 120g Bars", "Ingredients": "Vegan, Paraben-Free", "Packaging": "Recycled Board" }
  },

  // Bakery products
  {
    id: "bakery-1",
    name: "Signature Sourdough Boule",
    price: 8.50,
    description: "Naturally leavened wild yeast sourdough bread with a blistered crust and a soft, tangy, open-crumb interior.",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600",
    category: "Breads",
    stock: 20,
    theme: "bakery",
    rating: 4.9,
    specs: { "Weight": "850g", "Ingredients": "Flour, Water, Sea Salt", "Fermentation": "36-Hour Cold Prove" }
  },
  {
    id: "bakery-2",
    name: "Pain au Chocolat Box (6-Pack)",
    price: 24.00,
    description: "Six buttery, flaky, layers of French pastry filled with dual strips of premium dark Valrhona chocolate, baked fresh daily.",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=600",
    category: "Pastries",
    stock: 10,
    theme: "bakery",
    rating: 4.8,
    specs: { "Quantity": "6 Croissants", "Pastry Butter": "AOP French Butter", "Allergens": "Gluten, Dairy" }
  },
  {
    id: "bakery-3",
    name: "Lemon Raspberry Macaron Box",
    price: 18.00,
    description: "A gorgeous collection of eight gluten-free almond meringue macarons filled with organic lemon curd and fresh raspberry jam.",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600",
    category: "Cakes",
    stock: 15,
    theme: "bakery",
    rating: 4.7,
    specs: { "Quantity": "8 Macarons", "Gluten Free": "Yes", "Storage": "Keep refrigerated" }
  },
  // Added tech products
  {
    id: "tech-5",
    name: "HyperFocus VR Headset",
    price: 499.99,
    description: "All-in-one standalone virtual reality gaming headset featuring a sharp 4K dual screen and next-gen hand tracking controllers.",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600",
    category: "Wearables",
    stock: 10,
    theme: "tech",
    rating: 4.8,
    specs: { "Resolution": "2K per eye OLED", "Refresh Rate": "120Hz", "Processor": "Snapdragon XR2" }
  },
  {
    id: "tech-6",
    name: "NovaRGB Light Bars (2-Pack)",
    price: 69.99,
    description: "Smart ambient backlighting bars that sync color frequencies with your screen visuals and audio rhythm dynamically.",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600",
    category: "Peripherals",
    stock: 40,
    theme: "tech",
    rating: 4.6,
    specs: { "Length": "12 Inches", "RGB Colors": "16.8 Million", "Control": "WiFi App & Voice" }
  },
  {
    id: "tech-7",
    name: "Nexus 2TB Portable SSD",
    price: 159.00,
    description: "Pocket-sized external solid-state drive built with tough IP65 drop resistance and blisteringly fast USB 3.2 transfers.",
    image: "https://images.unsplash.com/photo-1597872200319-3814424e89ae?auto=format&fit=crop&q=80&w=600",
    category: "Components",
    stock: 35,
    theme: "tech",
    rating: 4.9,
    specs: { "Capacity": "2 Terabytes", "Speed": "Up to 1050 MB/s", "Material": "Rubberized Alloy" }
  },
  // Added luxury products
  {
    id: "lux-4",
    name: "Sienna Italian Leather Tote",
    price: 980.00,
    description: "Generously sized minimalist shopper tote made from top-grain vegetable-tanned leather with double-stitch support handles.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    stock: 6,
    theme: "luxury",
    rating: 4.9,
    specs: { "Material": "Vachetta Leather", "Dimensions": "35cm x 28cm x 15cm", "Closure": "Magnetic Clasp" }
  },
  {
    id: "lux-5",
    name: "Vesper Silk Sleep Mask Set",
    price: 120.00,
    description: "Luxurious pure mulberry silk sleep mask and matching pillowcase set designed to prevent skin friction and retain hair moisture.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    stock: 15,
    theme: "luxury",
    rating: 4.7,
    specs: { "Silk Type": "22 Momme Mulberry", "Includes": "Mask & Standard Case", "Closure": "Envelope Style" }
  },
  {
    id: "lux-6",
    name: "Diamond Cluster Stud Earrings",
    price: 2400.00,
    description: "Sparkling pair of 14k white gold studs featuring a brilliant-cut center diamond surrounded by a halo cluster of pavé diamonds.",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600",
    category: "Jewelry",
    stock: 2,
    theme: "luxury",
    rating: 5.0,
    specs: { "Metal": "14k White Gold", "Carat Weight": "1.25 t.c.w.", "Cut": "Very Good Round" }
  },
  // Added eco products
  {
    id: "eco-4",
    name: "Recycled Hemp Hammock",
    price: 85.00,
    description: "Hand-braided, weather-resistant double hammock woven from durable recycled organic hemp ropes. Easy tree mounting loops.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600",
    category: "Gardening",
    stock: 12,
    theme: "eco",
    rating: 4.8,
    specs: { "Max Capacity": "450 lbs", "Length": "11 Feet", "Fiber": "Recycled Hemp" }
  },
  {
    id: "eco-5",
    name: "Zero-Waste Organic Cotton Tote Mesh",
    price: 22.00,
    description: "Thick mesh net shopping bag crafted from pesticide-free organic cotton. Light, expandable and fully biodegradable.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    category: "Self-Care",
    stock: 50,
    theme: "eco",
    rating: 4.5,
    specs: { "Bag Type": "Expandable Net", "Material": "100% GOTS Cotton", "Origin": "Fair Trade Certified" }
  },
  {
    id: "eco-6",
    name: "Organic Herb Garden Starter Kit",
    price: 39.00,
    description: "Everything you need to grow organic herbs at home: biodegradable coco pots, soil discs, and seeds (Basil, Mint, Parsley, Cilantro).",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600",
    category: "Gardening",
    stock: 20,
    theme: "eco",
    rating: 4.7,
    specs: { "Includes": "4 Seed Packets", "Pots": "Coco Coir Fiber", "Fertilizer": "Organic Starter Feed" }
  },
  // Added bakery products
  {
    id: "bakery-4",
    name: "Artisan Cinnamon Rolls (4-Pack)",
    price: 16.00,
    description: "Four sweet, soft cinnamon-spiced buns baked to golden brown perfection, drizzled with our signature vanilla bean cream cheese glaze.",
    image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=600",
    category: "Pastries",
    stock: 12,
    theme: "bakery",
    rating: 4.9,
    specs: { "Quantity": "4 Large Buns", "Glaze": "Cream Cheese Frosting", "Freshness": "Bake-to-Order" }
  },
  {
    id: "bakery-5",
    name: "Cold Brew Coffee Concentrate",
    price: 14.00,
    description: "Rich, velvety organic cold brew coffee concentrate steep-extracted for 18 hours using high-altitude single origin Colombian beans.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600",
    category: "Beverages",
    stock: 25,
    theme: "bakery",
    rating: 4.8,
    specs: { "Volume": "32 Fluid Oz", "Serving Ratio": "1:1 Dilution", "Caffeine": "High" }
  },
  {
    id: "bakery-6",
    name: "Matcha Pistachio Celebration Cake",
    price: 48.00,
    description: "Beautiful three-layered sponge cake infused with ceremonial Uji matcha tea powder, frosted with roasted pistachio buttercream.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    category: "Cakes",
    stock: 6,
    theme: "bakery",
    rating: 4.9,
    specs: { "Diameter": "8 Inches", "Servings": "10-12 People", "Main Flavor": "Green Tea & Roasted Nut" }
  }
];

export const MOCK_USERS = [
  {
    id: "user-1",
    name: "Administrador Flex",
    email: "admin@tienda.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: "user-2",
    name: "Juan Cliente",
    email: "cliente@tienda.com",
    password: "cliente123",
    role: "customer"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    productId: "tech-1",
    userName: "Alex G.",
    userEmail: "alex@tech.com",
    rating: 5,
    comment: "Excelente teclado. El sonido de los switches brown es perfecto y la retroiluminación es super personalizable.",
    date: "12/07/2026"
  },
  {
    id: "rev-2",
    productId: "tech-1",
    userName: "Sofía M.",
    userEmail: "sofia@mail.com",
    rating: 4,
    comment: "Muy buena calidad de construcción. Solo me gustaría que el cable USB-C fuera un poco más largo.",
    date: "10/07/2026"
  },
  {
    id: "rev-3",
    productId: "tech-2",
    userName: "Lucas R.",
    userEmail: "lucas@sound.com",
    rating: 5,
    comment: "La cancelación de ruido es una maravilla. Los uso todo el día en la oficina y son sumamente cómodos.",
    date: "14/07/2026"
  },
  {
    id: "rev-4",
    productId: "lux-1",
    userName: "Victoria P.",
    userEmail: "victoria@luxury.com",
    rating: 5,
    comment: "Una prenda espectacular. La seda es de la más alta calidad y la caída es hermosísima.",
    date: "05/07/2026"
  },
  {
    id: "rev-5",
    productId: "eco-1",
    userName: "Diana S.",
    userEmail: "diana@eco.com",
    rating: 4,
    comment: "Muy bonito diseño artesanal. El color del esmalte moteado es precioso en mi sala.",
    date: "09/07/2026"
  },
  {
    id: "rev-6",
    productId: "bakery-1",
    userName: "Mateo T.",
    userEmail: "mateo@bread.com",
    rating: 5,
    comment: "El mejor pan de masa madre que he probado. La corteza es crujiente y la miga súper elástica y sabrosa.",
    date: "13/07/2026"
  }
];



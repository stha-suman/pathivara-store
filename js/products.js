let products = [
  {
    id: 1,
    name: "Classic Cotton Shirt",
    category: "Men",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Blue"],
    stock: 12,
    description:
      "A clean, comfortable cotton shirt for everyday wear and smart casual occasions.",
  },
  {
    id: 2,
    name: "Classic Denim Jeans",
    category: "Men",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Dark Blue"],
    stock: 8,
    description:
      "Versatile denim jeans designed for comfortable everyday styling.",
  },
  {
    id: 3,
    name: "Elegant Saree",
    category: "Sarees",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["Free Size"],
    colors: ["Red", "Maroon"],
    stock: 5,
    description:
      "An elegant traditional saree suitable for celebrations and special occasions.",
  },
  {
    id: 4,
    name: "Women's Casual Dress",
    category: "Women",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Cream"],
    stock: 7,
    description:
      "A comfortable casual dress that works beautifully for everyday outings.",
  },
  {
    id: 5,
    name: "Kids Cotton T-Shirt",
    category: "Kids",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    colors: ["Yellow", "Blue"],
    stock: 15,
    description: "Soft, playful everyday wear for active kids.",
  },
  {
    id: 6,
    name: "Women's Kurti",
    category: "Women",
    price: 1800,
    image:
      "https://byhand.in/cdn/shop/files/9.jpg?v=1727855089",
    images: [
      "https://byhand.in/cdn/shop/files/9.jpg?v=1727855089",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Pink", "Green"],
    stock: 9,
    description: "A stylish kurti made for comfortable everyday fashion.",
  },
  {
    id: 7,
    name: "Men's Polo T-Shirt",
    category: "Men",
    price: 1400,
    image:
      "https://cdna.lystit.com/photos/ralphlauren/8ce93752/1500x1500/polo-ralph-lauren-White-Pullover-Mit-Polokragen-Und-Zopfmuster.jpeg",
    images: [
      "https://cdna.lystit.com/photos/ralphlauren/8ce93752/1500x1500/polo-ralph-lauren-White-Pullover-Mit-Polokragen-Und-Zopfmuster.jpeg",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Navy"],
    stock: 10,
    description:
      "A smart casual polo for workdays, weekends and everyday wear.",
  },
  {
    id: 8,
    name: "Kids Party Wear",
    category: "Kids",
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    colors: ["Pink", "White"],
    stock: 6,
    description:
      "A cheerful outfit for birthdays, parties and family celebrations.",
  },
  {
    id: 9,
    name: "Women's Denim Jacket",
    category: "Women",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue"],
    stock: 4,
    description: "A versatile denim layer for casual looks.",
  },
  {
    id: 10,
    name: "Men's Casual Jacket",
    category: "Men",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Brown", "Black"],
    stock: 5,
    description:
      "A practical casual jacket for cooler days and layered outfits.",
  },
  {
    id: 11,
    name: "Printed Saree Collection",
    category: "Sarees",
    price: 2900,
    image:
      "https://www.jollysilks.com/media/cache/834x0/catalog/product/s/t/std801002545_01_1696566766.webp",
    images: [
      "https://www.jollysilks.com/media/cache/834x0/catalog/product/s/t/std801002545_01_1696566766.webp",
    ],
    sizes: ["Free Size"],
    colors: ["Green", "Blue"],
    stock: 5,
    description:
      "A graceful printed saree for festive and everyday traditional wear.",
  },
  {
    id: 12,
    name: "Kids Denim Outfit",
    category: "Kids",
    price: 1900,
    image:
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=85",
    images: [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=85",
    ],
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    colors: ["Blue"],
    stock: 6,
    description: "A fun denim-inspired outfit for kids.",
  },
];

// The storefront and the admin dashboard share the same server catalog.
// Keep the bundled list only as a fallback when the site is opened without PHP.
try {
  const request = new XMLHttpRequest();
  request.open("GET", "api/products.php", false);
  request.send();
  if (request.status >= 200 && request.status < 300) {
    const liveProducts = JSON.parse(request.responseText);
    if (Array.isArray(liveProducts)) {
      products = liveProducts.map((product) => ({
        ...product,
        images:
          Array.isArray(product.images) && product.images.length
            ? product.images
            : product.image
              ? [product.image]
              : [],
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
      }));
    }
  }
} catch (_) {
  // Static preview mode: the bundled catalogue above remains available.
}

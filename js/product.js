const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));
const product = products.find((p) => p.id === id) || (!params.has("id") ? products[0] : null);
const detail = document.getElementById("productDetail");

if (!product) {
  detail.innerHTML = `<div class="empty-state"><div>🔎</div><h1>Product not found</h1><p>This product may no longer be available.</p><a class="btn btn-primary" href="shop.html">Browse Products</a></div>`;
  document.getElementById("relatedGrid").innerHTML = "";
} else {

detail.innerHTML = `
<div class="breadcrumbs"><a href="shop.html">Shop</a> / ${product.category} / ${product.name}</div>
<div class="product-detail">
  <div class="detail-gallery">
    <div class="main-product-image"><img id="mainProductImage" src="${product.image}" alt="${product.name}"></div>
    <div class="thumb-row">${product.images.map((img, i) => `<button class="thumb ${i === 0 ? "active" : ""}" onclick="changeImage('${img}',this)"><img src="${img}" alt=""></button>`).join("")}</div>
  </div>
  <div class="detail-info">
    <p class="eyebrow">${product.category.toUpperCase()}</p>
    <h1>${product.name}</h1><div class="detail-price">Rs. ${product.price.toLocaleString("en-IN")}</div>
    <p class="detail-description">${product.description}</p>
    <div class="stock"><span class="stock-dot"></span>${product.stock} available</div>
    <label>Size</label><div class="choice-row" id="sizeChoices">${product.sizes.map((s, i) => `<button class="choice ${i === 0 ? "selected" : ""}" data-value="${s}">${s}</button>`).join("")}</div>
    <label>Color</label><div class="choice-row" id="colorChoices">${product.colors.map((c, i) => `<button class="choice ${i === 0 ? "selected" : ""}" data-value="${c}">${c}</button>`).join("")}</div>
    <label>Quantity</label><div class="quantity"><button id="minus">−</button><span id="qty">1</span><button id="plus">+</button></div>
    <div class="detail-actions"><button class="btn btn-primary" id="addButton">Add to Cart</button><a class="btn btn-whatsapp" id="waButton" target="_blank">Order on WhatsApp</a></div>
    <div class="product-note">📞 Need help? Call <a href="tel:9842743833">9842743833</a></div>
  </div>
</div>`;

let qty = 1;
document.getElementById("minus").onclick = () => {
  if (qty > 1) {
    qty--;
    document.getElementById("qty").textContent = qty;
  }
};
document.getElementById("plus").onclick = () => {
  if (qty < product.stock) {
    qty++;
    document.getElementById("qty").textContent = qty;
  }
};

document.querySelectorAll(".choice").forEach(
  (btn) =>
    (btn.onclick = () => {
      const group = btn.parentElement;
      group
        .querySelectorAll(".choice")
        .forEach((x) => x.classList.remove("selected"));
      btn.classList.add("selected");
    }),
);
document.getElementById("addButton").onclick = () => {
  const size =
    document.querySelector("#sizeChoices .selected")?.dataset.value || "";
  const color =
    document.querySelector("#colorChoices .selected")?.dataset.value || "";
  addDetailedToCart(product.id, qty, size, color);
};
function addDetailedToCart(id, quantity, size, color) {
  let cart = JSON.parse(localStorage.getItem("pathivaraCart") || "[]");
  const key = `${id}-${size}-${color}`;
  const existing = cart.find((x) => x.key === key);
  if (existing) existing.qty += quantity;
  else cart.push({ key, id, qty: quantity, size, color });
  localStorage.setItem("pathivaraCart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart.");
}
function changeImage(src, el) {
  document.getElementById("mainProductImage").src = src;
  document
    .querySelectorAll(".thumb")
    .forEach((x) => x.classList.remove("active"));
  el.classList.add("active");
}
document.getElementById("waButton").href =
  `https://wa.me/9779842743833?text=${encodeURIComponent(`Hello Pathivara Store, I want to order ${product.name} (Rs. ${product.price})`)}`;

const related = products
  .filter((p) => p.category === product.category && p.id !== product.id)
  .slice(0, 4);
document.getElementById("relatedGrid").innerHTML = related
  .map(
    (p) =>
      `<article class="product-card"><a href="product.html?id=${p.id}" class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"></a><div class="product-info"><h3>${p.name}</h3><div class="product-meta">${p.category}</div><div class="price">Rs. ${p.price.toLocaleString("en-IN")}</div></div></article>`,
  )
  .join("");
}

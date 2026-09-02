let filter = "All";
const grid = document.getElementById("shopGrid");
const search = document.getElementById("searchInput");
const sort = document.getElementById("sortSelect");
const count = document.getElementById("resultsCount");
const empty = document.getElementById("emptyState");

function renderShop() {
  let list = products.filter((p) => filter === "All" || p.category === filter);
  const q = search.value.trim().toLowerCase();
  if (q)
    list = list.filter((p) =>
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q),
    );
  if (sort.value === "low") list.sort((a, b) => a.price - b.price);
  if (sort.value === "high") list.sort((a, b) => b.price - a.price);
  if (sort.value === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  count.textContent = `${list.length} product${list.length !== 1 ? "s" : ""}`;
  empty.hidden = list.length !== 0;
  grid.innerHTML = list.map(productCard).join("");
}
function productCard(p) {
  return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"></a><div class="product-info"><h3>${p.name}</h3><div class="product-meta">${p.category}</div><div class="price">Rs. ${p.price.toLocaleString("en-IN")}</div><div class="product-actions"><a class="btn btn-outline" href="product.html?id=${p.id}">View</a><button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button></div></div></article>`;
}
document.querySelectorAll("#categoryPills .filter-btn").forEach(
  (btn) =>
    (btn.onclick = () => {
      filter = btn.dataset.filter;
      document
        .querySelectorAll("#categoryPills .filter-btn")
        .forEach((x) => x.classList.toggle("active", x === btn));
      renderShop();
    }),
);
search.addEventListener("input", renderShop);
sort.addEventListener("change", renderShop);
renderShop();

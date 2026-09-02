const ADMIN_KEY = "pathivaraAdminLogged";
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("productModal").hidden = true;
  document.getElementById("orderModal").hidden = true;
});
const STORE_PRODUCTS = "pathivaraProducts";
const STORE_ORDERS = "pathivaraOrders";
const STORE_SETTINGS = "pathivaraSettings";

const seedProducts = products.map((p) => ({ ...p }));
const defaultOrders = JSON.parse(localStorage.getItem(STORE_ORDERS) || "[]");

function getProducts() {
  let x = localStorage.getItem(STORE_PRODUCTS);
  if (!x) {
    localStorage.setItem(STORE_PRODUCTS, JSON.stringify(seedProducts));
    return seedProducts;
  }
  return JSON.parse(x);
}
function setProducts(x) {
  localStorage.setItem(STORE_PRODUCTS, JSON.stringify(x));
}
function getOrders() {
  return JSON.parse(localStorage.getItem(STORE_ORDERS) || "[]");
}
function setOrders(x) {
  localStorage.setItem(STORE_ORDERS, JSON.stringify(x));
}
function money(n) {
  return `Rs. ${Number(n).toLocaleString("en-IN")}`;
}
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c],
  );
}

function showSection(name) {
  document
    .querySelectorAll(".admin-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(name + "Section").classList.add("active");
  document
    .querySelectorAll(".side-link")
    .forEach((b) => b.classList.toggle("active", b.dataset.section === name));
  document.getElementById("sectionTitle").textContent =
    name[0].toUpperCase() + name.slice(1);
  renderAll();
}
window.showSection = showSection;

function updateDashboard() {
  const ps = getProducts(),
    os = getOrders();
  document.getElementById("statProducts").textContent = ps.length;
  document.getElementById("statLow").textContent = ps.filter(
    (p) => p.stock <= 5,
  ).length;
  document.getElementById("statOrders").textContent = os.length;
  document.getElementById("statPending").textContent = os.filter((o) =>
    ["New", "Confirmed", "Processing"].includes(o.status),
  ).length;
  const recent = os.slice(-5).reverse();
  document.getElementById("recentOrders").innerHTML = recent.length
    ? recent
        .map(
          (o) =>
            `<div class="mini-row"><span><strong>${esc(o.ref)}</strong><small>${esc(o.name)}</small></span><span>${money(o.subtotal)}</span></div>`,
        )
        .join("")
    : `<p class="muted">No customer orders yet.</p>`;
  const low = ps
    .filter((p) => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);
  document.getElementById("lowStock").innerHTML = low.length
    ? low
        .map(
          (p) =>
            `<div class="mini-row"><span><strong>${esc(p.name)}</strong><small>${esc(p.category)}</small></span><span>${p.stock} left</span></div>`,
        )
        .join("")
    : `<p class="muted">Stock levels look healthy.</p>`;
}
function renderProducts() {
  let ps = getProducts(),
    q = (document.getElementById("productSearch")?.value || "").toLowerCase(),
    cat = document.getElementById("productCategory")?.value || "All";
  ps = ps.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      `${p.name} ${p.category}`.toLowerCase().includes(q),
  );
  document.getElementById("productsTable").innerHTML =
    ps
      .map(
        (p) => `<tr>
 <td><div class="prod-cell"><img src="${esc(p.image)}" alt=""><span><strong>${esc(p.name)}</strong><small>ID ${p.id}</small></span></div></td>
 <td>${esc(p.category)}</td><td>${money(p.price)}</td><td>${p.stock}</td>
 <td><span class="status ${p.stock <= 5 ? "cancelled" : "ready"}">${p.stock <= 5 ? "Low Stock" : "In Stock"}</span></td>
 <td><div class="row-actions"><button onclick="openProductModal(${p.id})">Edit</button><button onclick="deleteProduct(${p.id})">Delete</button></div></td></tr>`,
      )
      .join("") || `<tr><td colspan="6">No products found.</td></tr>`;
}
function openProductModal(id) {
  const p = id ? getProducts().find((x) => x.id === id) : null;
  document.getElementById("productModal").hidden = false;
  document.getElementById("productModalTitle").textContent = p
    ? "Edit Product"
    : "Add Product";
  document.getElementById("productId").value = p?.id || "";
  document.getElementById("pName").value = p?.name || "";
  document.getElementById("pCategory").value = p?.category || "Men";
  document.getElementById("pPrice").value = p?.price || "";
  document.getElementById("pStock").value = p?.stock ?? "";
  document.getElementById("pImage").value = p?.image || "";
  document.getElementById("pDescription").value = p?.description || "";
}
window.openProductModal = openProductModal;
function closeProductModal() {
  document.getElementById("productModal").hidden = true;
}
window.closeProductModal = closeProductModal;
document.getElementById("productForm").onsubmit = (e) => {
  e.preventDefault();
  let ps = getProducts(),
    id = Number(document.getElementById("productId").value),
    data = {
      id: id || Date.now(),
      name: document.getElementById("pName").value.trim(),
      category: document.getElementById("pCategory").value,
      price: Number(document.getElementById("pPrice").value),
      stock: Number(document.getElementById("pStock").value),
      image:
        document.getElementById("pImage").value.trim() ||
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
      images: [],
      sizes: ["M", "L", "XL"],
      colors: ["Default"],
      description: document.getElementById("pDescription").value.trim(),
    };
  data.images = [data.image];
  const i = ps.findIndex((x) => x.id === id);
  if (i > -1) ps[i] = { ...ps[i], ...data };
  else ps.unshift(data);
  setProducts(ps);
  closeProductModal();
  renderAll();
};
function deleteProduct(id) {
  const p = getProducts().find((x) => x.id === id);
  if (!p) return;
  if (confirm(`Delete "${p.name}"?`)) {
    setProducts(getProducts().filter((x) => x.id !== id));
    renderAll();
  }
}
window.deleteProduct = deleteProduct;

function renderOrders() {
  let os = getOrders(),
    q = (document.getElementById("orderSearch")?.value || "").toLowerCase(),
    status = document.getElementById("orderStatusFilter")?.value || "All";
  os = os.filter(
    (o) =>
      (status === "All" || o.status === status) &&
      `${o.ref} ${o.name} ${o.phone}`.toLowerCase().includes(q),
  );
  document.getElementById("ordersTable").innerHTML =
    os
      .slice()
      .reverse()
      .map(
        (o) => `<tr>
 <td><strong>${esc(o.ref)}</strong><br><small>${new Date(o.createdAt || Date.now()).toLocaleDateString()}</small></td><td>${esc(o.name)}<br><small>${esc(o.phone)}</small></td>
 <td>${o.items?.reduce((s, x) => s + x.qty, 0) || 0}</td><td>${money(o.subtotal)}</td>
 <td><select class="status-select" onchange="changeStatus('${esc(o.ref)}',this.value)">${["New", "Confirmed", "Processing", "Ready", "Delivered", "Cancelled"].map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
 <td><div class="row-actions"><button onclick="openOrderModal('${esc(o.ref)}')">View</button><button onclick="deleteOrder('${esc(o.ref)}')">Delete</button></div></td></tr>`,
      )
      .join("") || `<tr><td colspan="6">No orders found.</td></tr>`;
}
function changeStatus(ref, status) {
  let os = getOrders(),
    o = os.find((x) => x.ref === ref);
  if (o) {
    o.status = status;
    setOrders(os);
    updateDashboard();
  }
}
window.changeStatus = changeStatus;
function openOrderModal(ref) {
  const o = getOrders().find((x) => x.ref === ref);
  if (!o) return;
  document.getElementById("orderModal").hidden = false;
  document.getElementById("orderModalTitle").textContent = o.ref;
  document.getElementById("orderDetail").innerHTML =
    `<div class="order-detail-head"><strong>${esc(o.status)}</strong><span>${new Date(o.createdAt || Date.now()).toLocaleString()}</span></div>
 <div class="order-customer"><strong>${esc(o.name)}</strong><br>${esc(o.phone)}<br>${esc(o.address)}${o.city ? ", " + esc(o.city) : ""}${o.note ? `<br><span>Note: ${esc(o.note)}</span>` : ""}</div>
 <div>${(o.items || []).map((x) => `<div class="order-line"><span>${esc(x.p.name)} × ${x.qty}<small>${x.size ? "Size " + esc(x.size) : ""}${x.color ? " · " + esc(x.color) : ""}</small></span><strong>${money(x.p.price * x.qty)}</strong></div>`).join("")}</div>
 <div class="order-total"><span>Subtotal</span><strong>${money(o.subtotal)}</strong></div>`;
  document.getElementById("orderWhatsApp").onclick = () =>
    window.open(
      `https://wa.me/9779842743833?text=${encodeURIComponent(`Hello ${o.name}, this is Pathivara Store regarding order ${o.ref}.`)}`,
      "_blank",
    );
}
window.openOrderModal = openOrderModal;
function closeOrderModal() {
  document.getElementById("orderModal").hidden = true;
}
window.closeOrderModal = closeOrderModal;
function deleteOrder(ref) {
  if (confirm("Delete this order from this browser?")) {
    setOrders(getOrders().filter((x) => x.ref !== ref));
    renderAll();
  }
}
window.deleteOrder = deleteOrder;

function renderAll() {
  updateDashboard();
  renderProducts();
  renderOrders();
}
document
  .querySelectorAll(".side-link")
  .forEach((b) => (b.onclick = () => showSection(b.dataset.section)));
document.getElementById("sidebarToggle").onclick = () =>
  document.getElementById("sidebar").classList.toggle("open");
document.getElementById("productSearch").oninput = renderProducts;
document.getElementById("productCategory").onchange = renderProducts;
document.getElementById("orderSearch").oninput = renderOrders;
document.getElementById("orderStatusFilter").onchange = renderOrders;

document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  const u = document.getElementById("loginUser").value.trim(),
    p = document.getElementById("loginPass").value;
  if (u === "admin" && p === "pathivara123") {
    sessionStorage.setItem(ADMIN_KEY, "1");
    showApp();
  } else
    document.getElementById("loginError").textContent =
      "Incorrect username or password.";
};
function showApp() {
  document.getElementById("loginView").hidden = true;
  document.getElementById("appView").hidden = false;
  renderAll();
}
document.getElementById("logoutBtn").onclick = () => {
  sessionStorage.removeItem(ADMIN_KEY);
  location.reload();
};

const settings = JSON.parse(localStorage.getItem(STORE_SETTINGS) || "{}");
["Name", "Phone", "Location", "Whatsapp"].forEach((x) => {
  if (settings[x.toLowerCase()])
    document.getElementById("set" + x).value = settings[x.toLowerCase()];
});
document.getElementById("saveSettings").onclick = () => {
  const s = {
    name: setName.value,
    phone: setPhone.value,
    location: setLocation.value,
    whatsapp: setWhatsapp.value,
  };
  localStorage.setItem(STORE_SETTINGS, JSON.stringify(s));
  alert("Settings saved in this browser.");
};
document.getElementById("exportData").onclick = () => {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          products: getProducts(),
          orders: getOrders(),
          settings: JSON.parse(localStorage.getItem(STORE_SETTINGS) || "{}"),
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pathivara-store-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
};
document.getElementById("resetData").onclick = () => {
  if (confirm("Reset products and orders to demo data?")) {
    localStorage.removeItem(STORE_PRODUCTS);
    localStorage.removeItem(STORE_ORDERS);
    location.reload();
  }
};

if (sessionStorage.getItem(ADMIN_KEY) === "1") showApp();

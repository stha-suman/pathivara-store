let csrf = "",
  products = [],
  orders = [];
const $ = (x) => document.getElementById(x);
async function api(u, o = {}) {
  let r = await fetch("api/" + u, { credentials: "same-origin", ...o }),
    d = await r.json().catch(() => ({}));
  // A session can rotate after login or when an older admin tab is left open.
  // Refresh once, then repeat the original protected request with the new token.
  if (r.status === 419 && u !== "auth.php?action=me") {
    const sessionResponse = await fetch("api/auth.php?action=me", {
      credentials: "same-origin",
    });
    const session = await sessionResponse.json().catch(() => ({}));
    if (!session.authenticated) {
      location.replace("login.php");
      throw Error("Your session has expired. Please sign in again.");
    }
    csrf = session.csrf;
    r = await fetch("api/" + u, {
      credentials: "same-origin",
      ...o,
      headers: { ...(o.headers || {}), "X-CSRF-Token": csrf },
    });
    d = await r.json().catch(() => ({}));
  }
  if (!r.ok) throw Error(d.error || "Request failed");
  return d;
}
function json(method, data) {
  return {
    method,
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
    body: JSON.stringify(data),
  };
}
function money(n) {
  return "Rs. " + Number(n).toLocaleString("en-IN");
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
async function init() {
  let m = await api("auth.php?action=me", { cache: "no-store" });
  csrf = m.csrf;
  if (!m.authenticated) {
    location.replace("login.php");
    return;
  }
  $("loginView").hidden = true;
  $("app").hidden = false;
  await load();
}
async function load() {
  [products, orders] = await Promise.all([
    api("products.php"),
    // Order data is admin-only, including when it is read for the dashboard.
    api("orders.php", { headers: { "X-CSRF-Token": csrf } }),
  ]);
  render();
  let s = await api("settings.php");
  $("snm").value = s.name || "Pathivara Store";
  $("sph").value = s.phone || "9842743833";
  $("sloc").value = s.location || "Phungling, Taplejung, Nepal";
  $("swa").value = s.whatsapp || "9779842743833";
}
function render() {
  $("sp").textContent = products.length;
  $("sl").textContent = products.filter((p) => p.stock <= 5).length;
  $("so").textContent = orders.length;
  $("sn").textContent = orders.filter((o) =>
    ["New", "Confirmed", "Processing"].includes(o.status),
  ).length;
  $("recent").innerHTML =
    orders
      .slice(0, 5)
      .map(
        (o) =>
          `<div class="mini-row"><span><strong>${esc(o.reference)}</strong><small>${esc(o.customer_name)}</small></span><span>${money(o.subtotal)}</span></div>`,
      )
      .join("") || '<p class="muted">No orders yet.</p>';
  $("low").innerHTML =
    products
      .filter((p) => p.stock <= 5)
      .slice(0, 6)
      .map(
        (p) =>
          `<div class="mini-row"><span><strong>${esc(p.name)}</strong><small>${esc(p.category)}</small></span><span>${p.stock} left</span></div>`,
      )
      .join("") || '<p class="muted">No low-stock products.</p>';
  renderProducts();
  renderOrders();
}
function renderProducts() {
  let q = $("pq").value.toLowerCase(),
    c = $("pc").value;
  let a = products.filter(
    (p) =>
      (c === "All" || p.category === c) &&
      `${p.name} ${p.category}`.toLowerCase().includes(q),
  );
  $("pt").innerHTML =
    a
      .map(
        (p) =>
          `<tr><td><div class="prod-cell"><img src="${esc(p.image)}" alt=""><span><strong>${esc(p.name)}</strong><small>ID ${p.id}</small></span></div></td><td>${esc(p.category)}</td><td>${money(p.price)}</td><td>${p.stock}</td><td><button onclick="edit(${p.id})">Edit</button> <button onclick="del(${p.id})">Delete</button></td></tr>`,
      )
      .join("") || '<tr><td colspan="5">No products.</td></tr>';
}
function renderOrders() {
  let q = $("oq").value.toLowerCase(),
    s = $("os").value;
  let a = orders.filter(
    (o) =>
      (s === "All" || o.status === s) &&
      `${o.reference} ${o.customer_name} ${o.phone}`.toLowerCase().includes(q),
  );
  $("ot").innerHTML =
    a
      .map(
        (o) =>
          `<tr><td><strong>${esc(o.reference)}</strong><br><small>${new Date(o.created_at).toLocaleString()}</small></td><td>${esc(o.customer_name)}<br><small>${esc(o.phone)}</small></td><td>${money(o.subtotal)}</td><td><select onchange="changeStatus(${o.id},this.value)">${["New", "Confirmed", "Processing", "Ready", "Delivered", "Cancelled"].map((x) => `<option ${x === o.status ? "selected" : ""}>${x}</option>`).join("")}</select></td><td><button onclick="view(${o.id})">View</button></td></tr>`,
      )
      .join("") || '<tr><td colspan="5">No orders.</td></tr>';
}
function go(s) {
  document
    .querySelectorAll(".admin-section")
    .forEach((x) => x.classList.remove("active"));
  $(s).classList.add("active");
  document
    .querySelectorAll(".side-link")
    .forEach((x) => x.classList.toggle("active", x.dataset.s === s));
  $("title").textContent = s[0].toUpperCase() + s.slice(1);
}
document
  .querySelectorAll(".side-link")
  .forEach((b) => (b.onclick = () => go(b.dataset.s)));
$("hamb").onclick = () =>
  document.querySelector(".sidebar").classList.toggle("open");
$("add").onclick = $("add2").onclick = () => open();
$("close").onclick = $("cancel").onclick = () => {
  $("pm").hidden = true;
};
function open(p) {
  $("pm").hidden = false;
  $("mt").textContent = p ? "Edit Product" : "Add Product";
  $("id").value = p?.id || "";
  $("n").value = p?.name || "";
  $("c").value = p?.category || "Men";
  $("pr").value = p?.price || "";
  $("st").value = p?.stock ?? "";
  $("im").value = p?.image || "";
  $("de").value = p?.description || "";
}
window.edit = (id) => open(products.find((p) => p.id === id));
window.del = async (id) => {
  if (confirm("Delete this product?")) {
    try {
      await api("products.php?id=" + id, json("DELETE", {}));
      await load();
    } catch (error) {
      alert(error.message);
    }
  }
};
$("pf").onsubmit = async (e) => {
  e.preventDefault();
  let d = {
    name: $("n").value.trim(),
    category: $("c").value,
    price: +$("pr").value,
    stock: +$("st").value,
    image: $("im").value.trim(),
    description: $("de").value.trim(),
    sizes: ["M", "L", "XL"],
    colors: ["Default"],
  };
  let id = +$("id").value;
  try {
    await api(
      "products.php" + (id ? "?id=" + id : ""),
      json(id ? "PUT" : "POST", d),
    );
    $("pm").hidden = true;
    try {
      await load();
    } catch (error) {
      alert(
        "The product was saved, but the dashboard could not refresh. Reload this page to see the latest data.",
      );
    }
  } catch (error) {
    alert(error.message);
  }
};
window.changeStatus = async (id, s) => {
  await api("orders.php?id=" + id, json("PUT", { status: s }));
  await load();
};
window.view = (id) => {
  let o = orders.find((x) => x.id === id);
  alert(
    `${o.reference}\n\n${o.customer_name}\n${o.phone}\n${o.address}${o.city ? ", " + o.city : ""}\n\n${o.items.map((x) => `${x.p?.name || x.name || "Product"} × ${x.qty}`).join("\n")}\n\nSubtotal: ${money(o.subtotal)}`,
  );
};
$("pq").oninput = renderProducts;
$("pc").onchange = renderProducts;
$("oq").oninput = renderOrders;
$("os").onchange = renderOrders;
$("save").onclick = async () => {
  await api(
    "settings.php",
    json("POST", {
      name: $("snm").value,
      phone: $("sph").value,
      location: $("sloc").value,
      whatsapp: $("swa").value,
    }),
  );
  alert("Settings saved.");
};
init().catch((e) => alert(e.message));

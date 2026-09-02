const CART_KEY = "pathivaraCart";
let pendingOrder = null;
let customerProfile = null;
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  updateCartCount();
  renderCart();
}
function money(n) {
  return `Rs. ${Number(n).toLocaleString("en-IN")}`;
}
function totals() {
  const items = getCart()
    .map((x) => {
      const p = products.find((y) => y.id === x.id);
      return p ? { ...x, p } : null;
    })
    .filter(Boolean);
  return {
    items,
    qty: items.reduce((s, x) => s + x.qty, 0),
    subtotal: items.reduce((s, x) => s + x.p.price * x.qty, 0),
  };
}
function renderCart() {
  const box = document.getElementById("cartItems"),
    empty = document.getElementById("emptyCart"),
    layout = document.getElementById("checkoutLayout"),
    t = totals();
  if (!t.items.length) {
    empty.hidden = false;
    layout.hidden = true;
    return;
  }
  empty.hidden = true;
  layout.hidden = false;
  box.innerHTML = t.items
    .map(
      (x, i) =>
        `<article class="cart-item"><img src="${x.p.image}" alt="${x.p.name}"><div class="cart-item-info"><h3>${x.p.name}</h3><p>${x.p.category}${x.size ? ` · Size ${x.size}` : ""}${x.color ? ` · ${x.color}` : ""}</p><strong>${money(x.p.price)}</strong></div><div class="cart-qty"><button onclick="changeQty(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${i},1)">+</button></div><button class="remove-btn" onclick="removeItem(${i})">Remove</button></article>`,
    )
    .join("");
  document.getElementById("itemCount").textContent = t.qty;
  document.getElementById("subtotal").textContent = money(t.subtotal);
  document.getElementById("total").textContent = money(t.subtotal);
}
function changeQty(i, d) {
  const t = totals(),
    target = t.items[i],
    c = getCart(),
    idx = c.findIndex(
      (x) =>
        (x.key && x.key === target.key) ||
        (!x.key &&
          x.id === target.id &&
          x.size === target.size &&
          x.color === target.color),
    );
  if (idx > -1) {
    c[idx].qty += d;
    if (c[idx].qty <= 0) c.splice(idx, 1);
    saveCart(c);
  }
}
function removeItem(i) {
  const t = totals(),
    target = t.items[i],
    c = getCart(),
    idx = c.findIndex(
      (x) =>
        (x.key && x.key === target.key) ||
        (!x.key &&
          x.id === target.id &&
          x.size === target.size &&
          x.color === target.color),
    );
  if (idx > -1) c.splice(idx, 1);
  saveCart(c);
}
function err(id, msg) {
  document.getElementById(id).textContent = msg;
}
function validate() {
  document.querySelectorAll(".error").forEach((x) => (x.textContent = ""));
  let ok = true;
  const n = customerName.value.trim(),
    p = customerPhone.value.replace(/[\s-]/g, ""),
    a = customerAddress.value.trim();
  if (n.length < 2) {
    err("nameError", "Please enter your full name.");
    ok = false;
  }
  if (!/^(?:\+977)?9[678]\d{8}$/.test(p)) {
    err("phoneError", "Enter a valid Nepal mobile number.");
    ok = false;
  }
  if (a.length < 5) {
    err("addressError", "Please enter your delivery/contact address.");
    ok = false;
  }
  return ok;
}
async function loadCustomer() {
  const response = await fetch("api/customer-auth.php?action=me", { cache: "no-store" });
  const data = await response.json();
  if (!data.authenticated) return;
  customerProfile = data.customer;
  customerName.value = customerProfile.name;
  customerPhone.value = customerProfile.phone;
  customerAddress.value = customerProfile.address;
  customerCity.value = customerProfile.city || "";
  document.getElementById("accountRequired").hidden = true;
  checkoutForm.querySelectorAll("input[readonly], textarea[readonly]").forEach((field) => {
    field.classList.add("saved-field");
  });
}
function ref() {
  const d = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `PS-${d}-${Math.floor(1000 + Math.random() * 9000)}`;
}
function esc(s) {
  return String(s).replace(
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
function orderText(o) {
  let t = `Hello Pathivara Store,\n\nI would like to place an order.\n\nOrder Reference: ${o.ref}\n\n`;
  o.items.forEach(
    (x, i) =>
      (t += `${i + 1}. ${x.p.name}\n   Size: ${x.size || "Not specified"}\n   Color: ${x.color || "Not specified"}\n   Qty: ${x.qty}\n   Price: ${money(x.p.price)}\n\n`),
  );
  return (
    t +
    `Subtotal: ${money(o.subtotal)}\nDelivery: To be confirmed\n\nCustomer Details:\nName: ${o.name}\nPhone: ${o.phone}\nAddress: ${o.address}\nCity/Area: ${o.city || "Not specified"}\n${o.note ? `Delivery Notes: ${o.note}\n` : ""}\nPlease confirm availability and delivery charges.\n\nThank you.`
  );
}
function review(o) {
  orderReference.textContent = o.ref;
  reviewContent.innerHTML = `<div class="review-customer"><strong>Customer</strong><p>${esc(o.name)} · ${esc(o.phone)}<br>${esc(o.address)}${o.city ? `, ${esc(o.city)}` : ""}</p></div><div class="review-products">${o.items.map((x) => `<div class="review-line"><span>${esc(x.p.name)} × ${x.qty}<small>${x.size ? `Size ${esc(x.size)} · ` : ""}${x.color ? `Color ${esc(x.color)}` : ""}</small></span><strong>${money(x.p.price * x.qty)}</strong></div>`).join("")}</div><div class="review-total"><span>Subtotal</span><strong>${money(o.subtotal)}</strong></div>`;
}
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!totals().items.length) return alert("Your cart is empty.");
  if (!customerProfile) return alert("Please sign in or create an account before ordering.");
  if (!validate()) return;
  const t = totals();
  pendingOrder = {
    ref: ref(),
    items: t.items,
    subtotal: t.subtotal,
    name: customerProfile.name,
    phone: customerProfile.phone,
    address: customerProfile.address,
    city: customerProfile.city || "",
    note: deliveryNote.value.trim(),
  };
  sessionStorage.setItem("pathivaraPendingOrder", JSON.stringify(pendingOrder));
  review(pendingOrder);
  checkoutLayout.hidden = true;
  orderReview.hidden = false;
  scrollTo({ top: 0, behavior: "smooth" });
});
editOrder.onclick = () => {
  orderReview.hidden = true;
  checkoutLayout.hidden = false;
};
sendWhatsApp.onclick = () => {
  if (!pendingOrder) return;
  window.open(
    `https://wa.me/9779842743833?text=${encodeURIComponent(orderText(pendingOrder))}`,
    "_blank",
  );
  sessionStorage.setItem("pathivaraLastOrder", JSON.stringify(pendingOrder));
  void (async () => {
    try {
      const r = await fetch("api/orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref: pendingOrder.ref,
          name: pendingOrder.name,
          phone: pendingOrder.phone,
          address: pendingOrder.address,
          city: pendingOrder.city,
          note: pendingOrder.note,
          subtotal: pendingOrder.subtotal,
          items: pendingOrder.items,
        }),
      });
      if (!r.ok) {
        const x = await r.json().catch(() => ({}));
        throw new Error(x.error || "Order save failed");
      }
    } catch (err) {
      alert(
        "The server could not save the order. The WhatsApp message will still be prepared; please contact the store if needed.",
      );
    }
  })();
  {
  }
  orderReview.hidden = true;
  confirmation.hidden = false;
  confirmedReference.textContent = pendingOrder.ref;
};
backToOrder.onclick = () => {
  confirmation.hidden = true;
  orderReview.hidden = false;
};
renderCart();
loadCustomer().catch(() => {});

let cart = JSON.parse(localStorage.getItem("pathivaraCart") || "[]");

function updateCartCount() {
  const element = document.getElementById("cartCount");
  if (element)
    element.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

document.getElementById("menuToggle")?.addEventListener("click", () => {
  document.getElementById("mainNav")?.classList.toggle("open");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mainNav")?.classList.remove("open");
  });
});

document.getElementById("themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "pathivaraTheme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
});

if (localStorage.getItem("pathivaraTheme") === "dark") {
  document.body.classList.add("dark");
}

document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.lang;
    localStorage.setItem("pathivaraLang", language);
    document.querySelectorAll(".lang-btn").forEach((item) => {
      item.classList.toggle("active", item.dataset.lang === language);
    });
    document.querySelectorAll("[data-en]").forEach((element) => {
      element.textContent =
        language === "ne" ? element.dataset.ne : element.dataset.en;
    });
  });
});

function addToCart(id) {
  const storedCart = JSON.parse(localStorage.getItem("pathivaraCart") || "[]");
  const existingItem = storedCart.find(
    (item) => item.id === id && !item.size && !item.color,
  );

  if (existingItem) {
    existingItem.qty++;
  } else {
    storedCart.push({ id, qty: 1 });
  }

  localStorage.setItem("pathivaraCart", JSON.stringify(storedCart));
  cart = storedCart;
  updateCartCount();
  alert("Product added to cart.");
}

updateCartCount();

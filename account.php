<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>My Account | Pathivara Store</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="site-header"><div class="container nav-wrap">
    <a href="index.html" class="brand"><span class="brand-mark">PS</span><span><strong>Pathivara Store</strong><small>Fashion for Everyone</small></span></a>
    <a href="shop.html" class="back-link">Continue Shopping</a>
  </div></header>
  <main><section class="cart-section"><div class="container account-shell">
    <p class="eyebrow">PATHIVARA STORE</p><h1>My Account</h1>
    <div id="accountMessage" class="account-message" role="status"></div>
    <div id="authForms" class="account-grid">
      <form class="customer-card account-form" id="loginForm">
        <p class="eyebrow">WELCOME BACK</p><h2>Sign in</h2>
        <label>Phone Number<input name="phone" inputmode="tel" autocomplete="tel" required placeholder="98XXXXXXXX"></label>
        <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="btn btn-primary" type="submit">Sign In</button>
      </form>
      <form class="customer-card account-form" id="registerForm">
        <p class="eyebrow">NEW CUSTOMER</p><h2>Create account</h2>
        <label>Full Name<input name="name" autocomplete="name" required></label>
        <label>Phone Number<input name="phone" inputmode="tel" autocomplete="tel" required placeholder="98XXXXXXXX"></label>
        <label>Delivery / Contact Address<textarea name="address" autocomplete="street-address" required></textarea></label>
        <label>City / Area<input name="city" value="Phungling, Taplejung" autocomplete="address-level2"></label>
        <label>Password<input name="password" type="password" minlength="6" autocomplete="new-password" required></label>
        <button class="btn btn-primary" type="submit">Create Account</button>
      </form>
    </div>
    <div id="accountPanel" class="customer-card account-panel" hidden>
      <p class="eyebrow">SIGNED IN</p><h2 id="accountName"></h2><p id="accountDetails"></p>
      <div class="review-actions"><a class="btn btn-primary" href="cart.html">Go to Cart</a><button class="btn btn-outline" id="logoutButton">Sign Out</button></div>
    </div>
  </div></section></main>
  <script>
    const forms = document.getElementById('authForms'), panel = document.getElementById('accountPanel'), message = document.getElementById('accountMessage');
    const showMessage = (text, error = false) => { message.textContent = text; message.className = `account-message${error ? ' error' : ''}`; };
    const setAccount = (customer) => { forms.hidden = true; panel.hidden = false; accountName.textContent = `Hello, ${customer.name}`; accountDetails.innerHTML = `${customer.phone}<br>${customer.address}${customer.city ? `, ${customer.city}` : ''}`; };
    async function checkAccount() { const response = await fetch('api/customer-auth.php?action=me', { cache: 'no-store' }); const data = await response.json(); if (data.authenticated) setAccount(data.customer); }
    async function submitAccount(form, action) { const data = Object.fromEntries(new FormData(form)); const response = await fetch(`api/customer-auth.php?action=${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to continue.'); setAccount(result.customer); showMessage('Your account is ready.'); }
    loginForm.addEventListener('submit', async (event) => { event.preventDefault(); try { await submitAccount(loginForm, 'login'); } catch (error) { showMessage(error.message, true); } });
    registerForm.addEventListener('submit', async (event) => { event.preventDefault(); try { await submitAccount(registerForm, 'register'); } catch (error) { showMessage(error.message, true); } });
    logoutButton.onclick = async () => { await fetch('api/customer-auth.php?action=logout', { method: 'POST' }); location.reload(); };
    checkAccount().catch(() => showMessage('Unable to check your account right now.', true));
  </script>
</body>
</html>

console.log("cart script loaded");

// ✅ Only protect cart/checkout (so we can include this on other pages for the badge)
const onProtectedPage = /\/(cart\.html|checkout\.html)$/i.test(window.location.pathname);
const token = localStorage.getItem("token");
if (!token && onProtectedPage) {
  alert("You must be logged in to view this page.");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Elements (may or may not exist depending on page)
  const cartTableBody = document.querySelector("#cart-table tbody");
  const totalPriceEl   = document.getElementById("total-price");
  const clearCartBtn   = document.getElementById("clear-cart");
  const checkoutBtn    = document.getElementById("checkout-btn");

  // Checkout elements
  const orderTableBody  = document.querySelector("#order-table tbody");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const checkoutForm    = document.getElementById("checkout-form");

  // --- Badge helpers ---
  function ensureCartCountEl() {
    let el = document.getElementById("cart-count");
    if (!el) {
      const link = document.querySelector(".cart-link");
      if (link) {
        el = document.createElement("span");
        el.id = "cart-count";
        el.className = "cart-count";
        el.textContent = "0";
        link.appendChild(el);
      }
    }
    return el;
  }

  function updateCartCount() {
    const el = ensureCartCountEl();
    if (!el) return;
    const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    el.textContent = totalItems;
  }

  // --------------------------
  // CART PAGE FUNCTIONS
  // --------------------------
  function renderCart() {
    if (!cartTableBody) { updateCartCount(); return; }

    cartTableBody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
      if (totalPriceEl) totalPriceEl.textContent = "0";
      updateCartCount();
      return;
    }

    cart.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <img src="${item.image}" alt="${item.title}"
               style="width:50px;height:50px;vertical-align:middle;margin-right:8px;">
          ${item.title}
        </td>
        <td>${item.price}</td>
        <td>
          <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
        </td>
        <td>${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn" data-index="${index}">X</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    if (totalPriceEl) totalPriceEl.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Quantity change & remove
  if (cartTableBody) {
    cartTableBody.addEventListener("click", (e) => {
      if (e.target.classList.contains("qty-btn")) {
        const index = e.target.dataset.index;
        const action = e.target.dataset.action;
        if (action === "increase") cart[index].quantity++;
        if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }

      if (e.target.classList.contains("remove-btn")) {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      }
    });
  }

  // Clear cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Clear the cart?")) {
        cart = [];
        localStorage.removeItem("cart");
        renderCart();
      }
    });
  }

  // Proceed to checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }

  // --------------------------
  // CHECKOUT PAGE FUNCTIONS
  // --------------------------
  function renderOrderSummary() {
    if (!orderTableBody) { updateCartCount(); return; }

    orderTableBody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      orderTableBody.innerHTML = `<tr><td colspan="3">Your cart is empty.</td></tr>`;
      if (checkoutTotalEl) checkoutTotalEl.textContent = "0";
      updateCartCount();
      return;
    }

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.quantity}</td>
        <td>${subtotal.toFixed(2)}</td>
      `;
      orderTableBody.appendChild(row);
    });

    if (checkoutTotalEl) checkoutTotalEl.textContent = total.toFixed(2);
    updateCartCount();
  }

  if (checkoutForm) {
    renderOrderSummary();
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const name = document.getElementById("fullname").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const postal = document.getElementById("postal").value.trim();
      const city = document.getElementById("city").value.trim();
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      const card = document.getElementById("card").value.trim();

      if (!name || !email || !address || !postal || !city) {
        alert("Please fill in all delivery address fields.");
        return;
      }
      if (paymentMethod === "card" && !/^\d{16}$/.test(card)) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }

      alert(`Thank you, ${name}! Your order (${cart.length} items) has been placed using ${paymentMethod.toUpperCase()}.`);
      localStorage.removeItem("cart");
      cart = [];
      updateCartCount();
      window.location.href = "index.html";
    });
  }

  // Initial draw
  renderCart();      // cart page only; safe otherwise
  renderOrderSummary(); // checkout page only; safe otherwise
  updateCartCount(); // ensure badge shows on any page
});

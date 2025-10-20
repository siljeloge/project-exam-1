// cart.js
console.log("Cart script loaded");

// --- Check login before showing cart or checkout ---
const currentPath = window.location.pathname;
const onProtectedPage = /\/(cart\.html|checkout\.html)$/i.test(currentPath);
const token = localStorage.getItem("token");

if (onProtectedPage && !token) {
  alert("You must be logged in to view this page.");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Get cart from localStorage ---
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart)) {
    cart = [];
    localStorage.removeItem("cart");
  }

  // Page elements
  const cartTableBody = document.querySelector("#cart-table tbody");
  const totalPriceEl = document.getElementById("total-price");
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Checkout page elements
  const orderTableBody = document.querySelector("#order-table tbody");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const checkoutForm = document.getElementById("checkout-form");

  // --- Cart count (badge) ---
  function ensureCartBadge() {
    let badge = document.getElementById("cart-count");
    if (!badge) {
      const link = document.querySelector(".cart-link");
      if (link) {
        badge = document.createElement("span");
        badge.id = "cart-count";
        badge.className = "cart-count";
        badge.textContent = "0";
        link.appendChild(badge);
      }
    }
    return badge;
  }

  function updateCartCount() {
    const badge = ensureCartBadge();
    if (!badge) return;

    try {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = saved.reduce((sum, item) => {
        const qty = Number(item.quantity);
        return sum + (isNaN(qty) ? 0 : qty);
      }, 0);
      badge.textContent = totalItems;
    } catch (err) {
      console.warn("Cart data invalid:", err);
      localStorage.removeItem("cart");
      badge.textContent = "0";
    }
  }

  // --- CART PAGE ---
  function renderCart() {
    if (!cartTableBody) {
      updateCartCount();
      return;
    }

    cartTableBody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="4">Your cart is empty.</td></tr>`;
      if (totalPriceEl) totalPriceEl.textContent = "0";
      updateCartCount();
      return;
    }

    cart.forEach((item, index) => {
      const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="product-cell">
          <div class="product-info">
            <img src="${item.image}" alt="${item.title}">
            <p class="product-title">${item.title}</p>
          </div>
        </td>
        <td>${item.price}</td>
        <td>
          <button class="qty-btn" data-index="${index}" data-action="decrease">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
        </td>
        <td><button class="remove-btn" data-index="${index}">Remove</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    if (totalPriceEl) totalPriceEl.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Quantity & remove buttons
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

  // Clear entire cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        localStorage.removeItem("cart");
        renderCart();
      }
    });
  }

  // Go to checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }

  // --- CHECKOUT PAGE ---
  function renderOrderSummary() {
    if (!orderTableBody) {
      updateCartCount();
      return;
    }

    orderTableBody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      orderTableBody.innerHTML = `<tr><td colspan="3">Your cart is empty.</td></tr>`;
      if (checkoutTotalEl) checkoutTotalEl.textContent = "0";
      updateCartCount();
      return;
    }

    cart.forEach((item) => {
      const subtotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
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

  // Handle checkout submit
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
        alert("Please fill in all delivery fields.");
        return;
      }

      if (paymentMethod === "card" && !/^\d{16}$/.test(card)) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }

      alert(`Thanks, ${name}! Your order was placed using ${paymentMethod.toUpperCase()}.`);
      localStorage.removeItem("cart");
      cart = [];
      updateCartCount();
      window.location.href = "success.html";
    });
  }

  // Initial render
  renderCart();
  renderOrderSummary();
  updateCartCount();
});

// --- Logout button (for success page) ---
const logoutBtn = document.querySelector(".log-out-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to log out?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    sessionStorage.clear();

    window.location.href = "login.html";
  });
}

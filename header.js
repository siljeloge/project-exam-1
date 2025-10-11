document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Elements already in your HTML
  const cartLink = document.querySelector(".cart-link");
  const loginLink = document.querySelector("a.login-link");
  const registerLink = document.querySelector("a.register-link");
  const navUl = document.querySelector("nav ul");

  // --- 🧩 Greeting setup ---
  let greetingEl = document.querySelector(".greeting");
  if (!greetingEl) {
    greetingEl = document.createElement("li");
    greetingEl.className = "greeting";
    navUl.insertBefore(greetingEl, loginLink?.parentElement || null);
  }

  // --- 🛒 Cart count badge setup ---
  let cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl && cartLink) {
    cartCountEl = document.createElement("span");
    cartCountEl.id = "cart-count";
    cartCountEl.className = "cart-count";
    cartLink.appendChild(cartCountEl);
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
    }
  }

  // --- 👤 User state management ---
  if (token && user?.name) {
    // ✅ Logged-in state
    greetingEl.textContent = `Hello, ${user.name}`;

    if (loginLink) {
      loginLink.textContent = "Logout";
      loginLink.classList.add("logout-link");
      loginLink.href = "#";

      // ✅ Logout logic — clears token, user, and cart
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart"); // 🧹 clear cart
        updateCartCount(); // show 0 immediately

        alert("You have been logged out, and your cart has been cleared.");
        window.location.href = "index.html";
      });
    }

    if (registerLink) registerLink.style.display = "none";
  } else {
    // ❌ Logged-out state
    greetingEl.textContent = "";

    if (loginLink) {
      loginLink.textContent = "Login";
      loginLink.href = "login.html";
      loginLink.classList.remove("logout-link");
    }

    if (registerLink) registerLink.style.display = "";
    updateCartCount(); // ensure it shows 0 for logged-out users
  }

  // 🔄 Always update cart count on page load
  updateCartCount();
});
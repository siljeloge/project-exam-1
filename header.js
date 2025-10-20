// header.js
console.log("Header script loaded");

document.addEventListener("DOMContentLoaded", () => {
  // --- Get user info ---
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // --- Grab header elements ---
  const cartLink = document.querySelector(".cart-link");
  const loginLink = document.querySelector("a.login-link");
  const registerLink = document.querySelector("a.register-link");
  const navUl = document.querySelector("nav ul");

  // --- Add a greeting if it doesn’t exist ---
  let greetingEl = document.querySelector(".greeting");
  if (!greetingEl) {
    greetingEl = document.createElement("li");
    greetingEl.classList.add("greeting");
    // Put it before the login link in the nav
    if (loginLink) {
      navUl.insertBefore(greetingEl, loginLink.parentElement);
    } else {
      navUl.appendChild(greetingEl);
    }
  }

  // --- Cart badge setup ---
  let cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl && cartLink) {
    cartCountEl = document.createElement("span");
    cartCountEl.id = "cart-count";
    cartCountEl.className = "cart-count";
    cartCountEl.textContent = "0";
    cartLink.appendChild(cartCountEl);
  }

  // Function to update the little cart number
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
    }
  }

  // --- Logged-in vs logged-out state ---
  if (token && user?.name) {
    // If user is logged in
    greetingEl.textContent = `Hello, ${user.name}`;

    if (loginLink) {
      loginLink.textContent = "Logout";
      loginLink.classList.add("logout-link");
      loginLink.href = "#";

      // When clicking logout, clear data and redirect
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart"); // clear cart too
        updateCartCount();

        alert("You’ve been logged out.");
        window.location.href = "index.html";
      });
    }

    // Hide register if logged in
    if (registerLink) {
      registerLink.style.display = "none";
    }
  } else {
    // If user is logged out
    greetingEl.textContent = "";

    if (loginLink) {
      loginLink.textContent = "Login";
      loginLink.href = "login.html";
      loginLink.classList.remove("logout-link");
    }

    if (registerLink) {
      registerLink.style.display = "";
    }

    updateCartCount();
  }

  // Update cart badge right away when page loads
  updateCartCount();
});
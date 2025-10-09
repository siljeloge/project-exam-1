document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Get existing elements from the HTML
  const cartLink      = document.querySelector(".cart-link");       // keep this intact!
  const loginLink     = document.querySelector("a.login-link");
  const registerLink  = document.querySelector("a.register-link");

  // If you want to show a greeting <span> after the cart
  const navUl = document.querySelector("nav ul");
  let greetingEl = document.querySelector(".greeting");
  if (!greetingEl) {
    greetingEl = document.createElement("li");
    greetingEl.className = "greeting";
    navUl.insertBefore(greetingEl, loginLink?.parentElement || null);
  }

  if (token && user?.name) {
    // Logged in → greet + logout
    greetingEl.textContent = `Hello, ${user.name}`;

    if (loginLink) {
      loginLink.textContent = "Logout";
      loginLink.classList.add("logout-link");
      loginLink.href = "#";
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("You have been logged out.");
        window.location.href = "index.html";
      });
    }

    if (registerLink) registerLink.style.display = "none";
  } else {
    // Not logged in → show login/register
    greetingEl.textContent = "";

    if (loginLink) {
      loginLink.textContent = "Login";
      loginLink.href = "login.html";
      loginLink.classList.add("login-link");
    }

    if (registerLink) registerLink.style.display = "";
  }
});
// login.js
console.log("Login script loaded");

const BASE_URL = "https://v2.api.noroff.dev/auth";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // Handle login form submit
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      // Send login request to Noroff API
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Check your email and password.");
      }

      const data = await response.json();

      // Save login data to localStorage
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));

      alert("Login successful!");
      window.location.href = "index.html"; // Go back to home page
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
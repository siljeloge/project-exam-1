// register.js
console.log("Register script loaded");

const BASE_URL = "https://v2.api.noroff.dev/auth";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic input validation
    if (!/^[A-Za-z0-9_]+$/.test(name)) {
      alert("Name can only contain letters, numbers, and underscores.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 4) {
      alert("Password must be at least 4 characters long.");
      return;
    }

    try {
      // Send registration data to Noroff API
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created! You can now log in.");
        window.location.href = "login.html";
      } else {
        alert(data.errors?.[0]?.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
});

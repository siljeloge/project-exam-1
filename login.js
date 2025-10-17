const BASE_URL = "https://v2.api.noroff.dev/auth"; // Noroff Auth endpoint

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Check your email and password.");
      }

      const data = await response.json();

      // ✅ Save token + user info in localStorage
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.data));

      alert("Login successful!");
      window.location.href = "index.html"; // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  });
});
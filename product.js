// product.js
console.log("Product script loaded");

const detailContainer = document.querySelector(".product-detail");
const BASE_URL = "https://v2.api.noroff.dev/online-shop";

// Get product ID from the URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// Update cart number in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  let totalItems = 0;
  cart.forEach(item => totalItems += item.quantity);
  countEl.textContent = totalItems;
}

// Fetch single product by ID
async function fetchProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.json();
    renderProduct(data.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    detailContainer.innerHTML = `<p>Could not load product. Please try again later.</p>`;
  }
}

// Display product details
function renderProduct(product) {
  if (!detailContainer) return;

  const discountedPrice = product.discountedPrice
    ? `<p><strong>Discounted Price: ${product.discountedPrice} NOK</strong></p>`
    : "";

  const rating = product.rating
    ? `<p>Rating: ${product.rating} / 5</p>`
    : `<p>Rating: None</p>`;

  const tags = product.tags?.length
    ? product.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")
    : `<p>No tags available.</p>`;

  const reviews = product.reviews?.length
    ? product.reviews.map(review => `
        <li>
          <strong>${review.username || "Anonymous"}</strong>:
          ${review.description || "No text"} 
          ${review.rating ? `(⭐ ${review.rating})` : ""}
        </li>
      `).join("")
    : `<p>No reviews available.</p>`;

  detailContainer.innerHTML = `
    <div class="product-page">
      <img src="${product.image?.url}" alt="${product.title}">
      <div class="product-info">
        <h1>${product.title}</h1>
        <h2>${product.description}</h2>
        <h3><strong>Price: ${product.price} NOK</strong></h3>
        <div class="discount">${discountedPrice}</div>
        <div class="rating">${rating}</div>
        <div class="tags">${tags}</div>
        <div class="reviews">${reviews}</div>
        <div class="button-container">
          <button id="add-to-cart">Add to cart</button>
          <button id="share-btn">Share link</button>
        </div>
      </div>
    </div>
  `;

  // Share product link
  const shareBtn = document.getElementById("share-btn");
  if (shareBtn && productId) {
    shareBtn.addEventListener("click", () => {
      const shareUrl = `${window.location.origin}/product.html?id=${productId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Product link copied to clipboard!");
      });
    });
  }

  // Add to cart
  const addToCartBtn = document.getElementById("add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to add products to the cart.");
        window.location.href = "login.html";
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image?.url,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(`${product.title} added to cart!`);
    });
  }
}

// Load product on page load
if (productId) {
  fetchProduct(productId);
  updateCartCount();
} else {
  detailContainer.innerHTML = `<p>Invalid product ID</p>`;
}

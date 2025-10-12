const container = document.querySelector(".product-list");
const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-control.prev");
const nextBtn = document.querySelector(".carousel-control.next");

const BASE_URL = "https://v2.api.noroff.dev/online-shop";

let products = [];
let currentIndex = 0;

// Fetch all products
async function fetchProducts() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    products = data.data;

    renderProducts(products);
    renderCarousel(products);
    updateCartCount();
  } catch (error) {
    console.error("Error fetching products:", error);
    if (container) {
      container.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
    }
  }
}

// Render product grid
function renderProducts(products) {
  if (!container) return;
  container.innerHTML = "";

  products.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("product-item");

    item.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image?.url}" alt="${product.title}" />
      </a>
      <h2>${product.title}</h2>
      <p><strong>${product.price} NOK</strong></p>
      <button class="view-product-btn" data-id="${product.id}">View product</button>
    `;

    container.appendChild(item);
  });

  container.querySelectorAll(".view-product-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      window.location.href = `product.html?id=${productId}`;
    });
  });
}

// Render latest 3 products in carousel
function renderCarousel(products) {
  if (!carouselTrack) return;

  const latest = products.slice(-3);
  carouselTrack.innerHTML = "";

  latest.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("carousel-item");

    item.innerHTML = `
      <img src="${product.image?.url}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>${product.price} NOK</p>
      <a href="product.html?id=${product.id}">
        <button>View Product</button>
      </a>
    `;

    carouselTrack.appendChild(item);
  });

  updateCarousel();
}

// Update carousel position
function updateCarousel() {
  const items = document.querySelectorAll(".carousel-item");
  const total = items.length;

  if (currentIndex < 0) currentIndex = total - 1;
  if (currentIndex >= total) currentIndex = 0;

  const offset = -currentIndex * 100;
  carouselTrack.style.transform = `translateX(${offset}%)`;
}

// Carousel buttons
if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex--;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    updateCarousel();
  });
}

// --- Touch swipe for mobile carousel ---
if (carouselTrack) {
  let startX = 0;
  let endX = 0;

  carouselTrack.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carouselTrack.addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
  });

  carouselTrack.addEventListener("touchend", () => {
    const diff = startX - endX;
    const threshold = 50; // minimum px to trigger swipe

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        currentIndex++;
      } else {
        currentIndex--;
      }
      updateCarousel();
    }
  });
}

// Optional autoplay
setInterval(() => {
  if (products.length > 0) {
    currentIndex++;
    updateCarousel();
  }
}, 5000);

// Placeholder for cart updates
function updateCartCount() {
  console.log("Cart count updated!");
}

// Start everything
fetchProducts();
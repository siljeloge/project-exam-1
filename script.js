const container = document.querySelector(".product-list");
const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector(".carousel-control.prev");
const nextBtn = document.querySelector(".carousel-control.next");

const BASE_URL = "https://v2.api.noroff.dev/online-shop";

let products = [];
let currentIndex = 0;
let isTransitioning = false;

// Fetch products
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

// Render all products grid
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

  container.querySelectorAll(".view-product-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      window.location.href = `product.html?id=${productId}`;
    });
  });
}

// Render latest 3 products into the carousel
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

  // ✅ Clone first and last items for infinite looping
  const firstClone = carouselTrack.firstElementChild.cloneNode(true);
  const lastClone = carouselTrack.lastElementChild.cloneNode(true);
  carouselTrack.appendChild(firstClone);
  carouselTrack.insertBefore(lastClone, carouselTrack.firstElementChild);

  currentIndex = 1;
  updateCarousel(false); // no transition for initial position
}

// Update carousel position
function updateCarousel(withTransition = true) {
  const items = document.querySelectorAll(".carousel-item");
  const total = items.length;

  if (withTransition) carouselTrack.style.transition = "transform 0.8s ease-in-out";
  else carouselTrack.style.transition = "none";

  const offset = -currentIndex * 100;
  carouselTrack.style.transform = `translateX(${offset}%)`;
}

// Move carousel
function nextSlide() {
  if (isTransitioning) return;
  const items = document.querySelectorAll(".carousel-item");
  isTransitioning = true;

  currentIndex++;
  updateCarousel();

  carouselTrack.addEventListener("transitionend", () => {
    if (currentIndex === items.length - 1) {
      currentIndex = 1;
      updateCarousel(false);
    }
    isTransitioning = false;
  }, { once: true });
}

function prevSlide() {
  if (isTransitioning) return;
  const items = document.querySelectorAll(".carousel-item");
  isTransitioning = true;

  currentIndex--;
  updateCarousel();

  carouselTrack.addEventListener("transitionend", () => {
    if (currentIndex === 0) {
      currentIndex = items.length - 2;
      updateCarousel(false);
    }
    isTransitioning = false;
  }, { once: true });
}

// Buttons
if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);
}

// --- Touch swipe for mobile ---
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
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) nextSlide(); // swipe left
      else prevSlide();          // swipe right
    }
  });
}

// --- Autoplay every 5s ---
setInterval(() => {
  if (products.length > 0) nextSlide();
}, 5000);

// Placeholder for cart badge
function updateCartCount() {
  console.log("Cart count updated!");
}

// Initialize
fetchProducts();
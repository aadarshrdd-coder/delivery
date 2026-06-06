/* =====================================================
   main.js – Core logic for Switchit e-commerce
   ===================================================== */

// ---- Business Config ----
const CONFIG = {
  DELIVERY_FEE: 30,
  PER_KM_RATE: 2, // Extra ₹2 per KM
  FREE_DELIVERY_THRESHOLD: 800 // Increased threshold for distance-based delivery
};

function getMockDistance(state, city) {
  if (!state || !city) return 0;
  // Stable pseudo-random distance based on location names (5km to 50km)
  const str = (state + city).toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return (hash % 45) + 5; 
}

function calculateDelivery(subtotal, state = null, city = null) {
  if (subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD) return 0;
  if (!state || !city) return CONFIG.DELIVERY_FEE; 
  
  const distance = getMockDistance(state, city);
  return Math.round(CONFIG.DELIVERY_FEE + (distance * CONFIG.PER_KM_RATE));
}

// ---- Cart helpers (localStorage) ----
function getCart() {
  return JSON.parse(localStorage.getItem('fv_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('fv_cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}
function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(cart.filter(i => i.id !== id));
  } else {
    saveCart(cart);
  }
}
function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// ---- Toast notification ----
function showToast(msg) {
  let toast = document.getElementById('fv-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fv-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---- Currency formatter ----
function fmt(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// ---- Product card HTML ----
function productCardHTML(p) {
  // Store only essential data for cart (avoid storing full image URL in onclick)
  const cartData = JSON.stringify({ id: p.id, name: p.name, price: p.price, unit: p.unit, image: p.image });
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('img-fallback');this.parentElement.setAttribute('data-label','${p.name}')" />
      </div>
      <div class="info">
        <h3>${p.name}</h3>
        <p class="unit">${p.unit}</p>
        <span class="price">${fmt(p.price)}</span>
      </div>
      <div class="card-actions">
        <a href="product.html?id=${p.id}" class="btn-view">View</a>
        <button onclick='addToCart(${cartData.replace(/'/g, "&#39;")})'>Add to Cart</button>
      </div>
    </div>`;
}

// ---- Market Rate Simulation ----
// Simulates day-by-day government paper price fluctuations
function getDailyMarketAdjustment() {
  const today = new Date();
  // Use the date as a seed so prices change once per day
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const pseudoRandom = Math.abs(Math.sin(seed));
  // Prices fluctuate between 90% and 115% of base price
  return 0.90 + (pseudoRandom * 0.25);
}

// ---- Fetch products ----
async function loadProducts() {
  try {
    const res = await fetch('products.json');
    const data = await res.json();
    const adjustment = getDailyMarketAdjustment();
    
    // Apply daily government/market rate adjustment
    return data.map(p => ({
      ...p,
      price: Math.round(p.price * adjustment)
    }));
  } catch (e) {
    console.error('Failed to load products', e);
    return [];
  }
}

// ---- Geolocation Helper ----
async function performDynamicLocationDetection(stateEl, cityEl, statusEl, callback) {
  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser.");
    return;
  }
  if (statusEl) statusEl.textContent = "Detecting...";
  
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      // Using OpenStreetMap Nominatim for free reverse geocoding
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
      const data = await res.json();
      const addr = data.address || {};
      const detState = addr.state || "";
      const detCity = addr.city || addr.town || addr.village || addr.suburb || addr.district || "";

      const foundState = INDIA_LOCATIONS.find(s => 
        detState && s.state.toLowerCase().includes(detState.toLowerCase().replace(' & ', ' and '))
      );

      if (foundState) {
        stateEl.value = foundState.state;
        stateEl.dispatchEvent(new Event('change')); // Trigger city population
        const foundCity = foundState.cities.find(c => 
          detCity && c.toLowerCase().includes(detCity.toLowerCase())
        );
        if (foundCity) {
          cityEl.value = foundCity;
          if (statusEl) statusEl.textContent = `📍 Detected: ${foundCity}, ${foundState.state}`;
          if (callback) callback(foundCity, foundState.state);
        } else if (statusEl) statusEl.textContent = `📍 In ${foundState.state} (Pick city)`;
      } else if (statusEl) statusEl.textContent = "Detected location outside our zones.";
    } catch (err) {
      if (statusEl) statusEl.textContent = "Detection failed.";
      showToast("Error retrieving location details.");
    }
  }, () => {
    if (statusEl) statusEl.textContent = "Access denied.";
    showToast("Location access denied.");
  });
}

// ---- Restaurant Discovery ----
const RESTAURANT_DATA = [
  { name: "Biryani Blues", cuisine: "Hyderabadi, Indian", rating: 4.4, time: "35 min", image: "https://images.unsplash.com/photo-1563379091339-03b1cbb897f8?w=400&h=400&fit=crop" },
  { name: "Wok & Roll", cuisine: "Chinese, Pan-Asian", rating: 4.2, time: "25 min", image: "https://images.unsplash.com/photo-1512058560366-cd242d4235cd?w=400&h=400&fit=crop" },
  { name: "The Burger Club", cuisine: "Continental, American", rating: 4.6, time: "20 min", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop" },
  { name: "Spice Garden", cuisine: "North Indian, Tandoor", rating: 4.3, time: "40 min", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
  { name: "Healthy Bites", cuisine: "Salads, Juices", rating: 4.7, time: "15 min", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=400&fit=crop" },
  { name: "Sweet Tooth", cuisine: "Desserts, Bakery", rating: 4.5, time: "20 min", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop" }
];

function restaurantCardHTML(r, city) {
  return `
    <div class="restaurant-card product-card visible">
      <div class="card-img">
        <img src="${r.image}" alt="${r.name}" />
      </div>
      <div class="info">
        <h3>${r.name}</h3>
        <p class="unit">${r.cuisine}</p>
        <p style="font-size: 0.85rem; color: var(--clr-accent); margin: 0.5rem 0;">📍 ${city} (${r.localDistance} km away)</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
          <span style="font-weight: 700; color: #ffca28;">⭐ ${r.rating}</span>
          <span style="font-size: 0.85rem; color: var(--clr-text-muted);">⏱️ ${r.time}</span>
        </div>
      </div>
      <div class="card-actions">
        <a href="products.html" class="btn-view" style="width:100%">View Menu</a>
      </div>
    </div>`;
}

// ---- Page-specific initialisers ----

// HOME – featured grid
async function initHome() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  
  const products = await loadProducts();
  const searchInput = document.getElementById('home-search-input');

  // Location Discovery elements
  const detectBtn = document.getElementById('detect-location-btn');
  const showSelectsBtn = document.getElementById('show-selects-btn');
  const dropdowns = document.getElementById('location-dropdowns');
  const stateSelect = document.getElementById('home-state-select');
  const citySelect = document.getElementById('home-city-select');
  const resSection = document.getElementById('restaurants-section');
  const resGrid = document.getElementById('restaurant-grid');
  const cityNameSpan = document.getElementById('active-city-name');

  function showRestaurants(city) {
    cityNameSpan.textContent = city;
    
    // Generate unique mock distances for restaurants based on the chosen city
    const nearByRestaurants = RESTAURANT_DATA.map((r, index) => {
      // Use a formula to generate a stable mock distance between 0.5 and 7.5 km
      const mockDist = ((city.length + index) % 7) + 0.5 + (index * 0.2);
      return { ...r, localDistance: mockDist.toFixed(1) };
    });

    resSection.style.display = 'block';
    resGrid.innerHTML = nearByRestaurants.map(r => restaurantCardHTML(r, city)).join('');
    resSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (stateSelect && typeof INDIA_LOCATIONS !== 'undefined') {
    INDIA_LOCATIONS.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc.state; opt.textContent = loc.state;
      stateSelect.appendChild(opt);
    });

    stateSelect.addEventListener('change', () => {
      citySelect.innerHTML = '<option value="">Select City</option>';
      if (!stateSelect.value) { citySelect.disabled = true; return; }
      const stateData = INDIA_LOCATIONS.find(l => l.state === stateSelect.value);
      stateData.cities.slice().sort().forEach(city => {
        const opt = document.createElement('option');
        opt.value = city; opt.textContent = city;
        citySelect.appendChild(opt);
      });
      citySelect.disabled = false;
    });

    citySelect.addEventListener('change', () => {
      if (citySelect.value) showRestaurants(citySelect.value);
    });
  }

  detectBtn?.addEventListener('click', () => {
    performDynamicLocationDetection(stateSelect, citySelect, document.getElementById('location-status'), (city) => {
      showRestaurants(city);
    });
  });

  showSelectsBtn?.addEventListener('click', () => {
    dropdowns.style.display = dropdowns.style.display === 'none' ? 'flex' : 'none';
  });

  function render() {
    let list = [...products];
    // Filter by search query (A‑Z)
    const q = (searchInput?.value || '').toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
    // Sort alphabetically
    list.sort((a, b) => a.name.localeCompare(b.name));
    // Show all matching items (or featured if no query)
    const displayList = q ? list : list.filter(p => p.featured);
    grid.innerHTML = displayList.map(productCardHTML).join('');
    observeFadeIn();
  }

  // Attach listener
  searchInput?.addEventListener('input', render);
  // Initial render (featured items)
  render();
}

// PRODUCTS – catalogue with filter, sort, search
async function initProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const products = await loadProducts();
  const catFilter = document.getElementById('category-filter');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');
  const emptyState = document.getElementById('empty-state');

  function render() {
    let list = [...products];

    // Filter by category
    const cat = catFilter?.value || 'all';
    if (cat !== 'all') list = list.filter(p => p.category === cat);

    // Search
    const q = (searchInput?.value || '').toLowerCase();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q));

    // Sort
    const sort = sortSelect?.value || 'name-asc';
    list.sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      if (sort === 'price-asc') return a.price - b.price;
      return b.price - a.price;
    });

    grid.innerHTML = list.map(productCardHTML).join('');
    if (emptyState) emptyState.style.display = list.length ? 'none' : 'block';
    observeFadeIn();
  }

  catFilter?.addEventListener('change', render);
  sortSelect?.addEventListener('change', render);
  searchInput?.addEventListener('input', render);
  render();
}

// PRODUCT DETAIL
async function initProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return;

  const id = Number(new URLSearchParams(window.location.search).get('id'));
  const products = await loadProducts();
  const p = products.find(item => item.id === id);

  if (!p) {
    container.innerHTML = '<p class="error-msg">Product not found. <a href="products.html">Browse all →</a></p>';
    return;
  }

  document.title = `${p.name} – Switchit`;

  const cartData = JSON.stringify({ id: p.id, name: p.name, price: p.price, unit: p.unit, image: p.image });
  container.innerHTML = `
    <div class="detail-grid">
      <div class="detail-img">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <div class="detail-info">
        <h1>${p.name}</h1>
        <span class="detail-price">${fmt(p.price)} <small>/ ${p.unit}</small></span>
        <p class="detail-desc">${p.description}</p>
        <div class="detail-actions">
          <button class="btn-primary" onclick='addToCart(${cartData.replace(/'/g, "&#39;")})'>Add to Cart</button>
          <a href="products.html" class="btn-secondary">← Back to Shop</a>
        </div>
      </div>
    </div>`;
}

// CART
function initCart() {
  const itemsContainer = document.getElementById('cart-items');
  if (!itemsContainer) return;

  function render() {
    const cart = getCart();
    const emptyEl = document.getElementById('empty-cart');
    const summaryEl = document.getElementById('cart-summary');

    if (cart.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (summaryEl) summaryEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'block';

    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-row">
        <img class="cart-thumb" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>${fmt(item.price)} × ${item.qty}</p>
        </div>
        <div class="qty-controls">
          <button onclick="updateQty(${item.id}, -1); document.dispatchEvent(new Event('cart-changed'));">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1); document.dispatchEvent(new Event('cart-changed'));">+</button>
        </div>
        <span class="cart-item-total">${fmt(item.price * item.qty)}</span>
        <button class="remove-btn" onclick="removeFromCart(${item.id}); document.dispatchEvent(new Event('cart-changed'));">✕</button>
      </div>
    `).join('');

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const isFree = subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD;

    document.getElementById('subtotal').textContent = fmt(subtotal);
    // On cart page, we show a range or "Calculated at checkout"
    document.getElementById('delivery-fee').textContent = isFree ? "FREE" : "Based on distance";
    const deliveryVal = isFree ? 0 : CONFIG.DELIVERY_FEE;
    document.getElementById('total').textContent = fmt(subtotal + deliveryVal);
  }

  document.addEventListener('cart-changed', render);
  render();
}

// CHECKOUT
function initCheckout() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  // Setup Location dropdowns
  const stateSelect = document.getElementById('state');
  const citySelect = document.getElementById('city');

  // Function to refresh the order overview display
  function renderOverview() {
    const overview = document.getElementById('order-overview');
    if (!overview) return;
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = calculateDelivery(subtotal, stateSelect.value, citySelect.value);
    overview.innerHTML = `
      <h3>Order Summary</h3>
      ${cart.map(i => `<div class="overview-row"><span>${i.name} × ${i.qty}</span><span>${fmt(i.price * i.qty)}</span></div>`).join('')}
      <div class="overview-row total"><span>Total (Delivery: ${delivery === 0 ? 'FREE' : fmt(delivery)})</span><span>${fmt(subtotal + delivery)}</span></div>
    `;
  }

  if (stateSelect && citySelect && typeof INDIA_LOCATIONS !== 'undefined') {
    // Populate states
    INDIA_LOCATIONS.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc.state;
      opt.textContent = loc.state;
      stateSelect.appendChild(opt);
    });

    // Update cities based on state selection
    stateSelect.addEventListener('change', () => {
      const selectedState = stateSelect.value;
      citySelect.innerHTML = '<option value="">Select City</option>';
      
      if (!selectedState) {
        citySelect.disabled = true;
        return;
      }

      const stateData = INDIA_LOCATIONS.find(l => l.state === selectedState);
      if (stateData) {
        stateData.cities.slice().sort().forEach(city => {
          const opt = document.createElement('option');
          opt.value = city;
          opt.textContent = city;
          citySelect.appendChild(opt);
        });
        citySelect.disabled = false;
      }
      renderOverview();
    });

    citySelect.addEventListener('change', renderOverview);
  }

  document.getElementById('detect-checkout-btn')?.addEventListener('click', () => {
    performDynamicLocationDetection(stateSelect, citySelect, null, renderOverview);
  });

  // Show order overview
  renderOverview();

  form.addEventListener('submit', e => {
    e.preventDefault();

    const orderId = `SW${Math.floor(Math.random() * 900000 + 100000)}`;
    const items = getCart();
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const customerState = document.getElementById('state').value;
    const customerCity = document.getElementById('city').value;
    const delivery = calculateDelivery(subtotal, customerState, customerCity);
    const total = subtotal + delivery;
    const distance = getMockDistance(customerState, customerCity);

    // Construct order data to "send" to owner
    const orderData = {
      orderId: orderId,
      customer: {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        state: customerState,
        city: customerCity,
        address: document.getElementById('address').value
      },
      items: items,
      payment: document.getElementById('payment-method').value,
      total: total,
      delivery: delivery,
      timestamp: new Date().toISOString()
    };

    // Log the data (simulating owner notification)
    console.log("Order notification sent to website owner:", orderData);

    // Populate success modal with order details
    const successSummary = document.getElementById('success-order-summary');
    if (successSummary) {
      successSummary.innerHTML = `
        <div style="text-align: left; margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 0.9rem;">
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Total Amount:</strong> ${fmt(total)}</p>
          <p><strong>Items:</strong> ${items.length} item(s)</p>
          <p style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--clr-text-muted);">Delivering to: ${orderData.customer.city}</p>
        </div>
      `;
    }

    // Construct WhatsApp message to send to the owner (8978920932)
    let msg = `*New Order - Switchit* (#${orderId})\n\n`;
    msg += `*Customer:* ${orderData.customer.name}\n`;
    msg += `*Email:* ${orderData.customer.email}\n`;
    msg += `*Phone:* ${orderData.customer.phone}\n`;
    msg += `*Location:* ${orderData.customer.city}, ${orderData.customer.state} (~${distance}km)\n`;
    msg += `*Delivery Address:* ${orderData.customer.address}\n\n`;
    msg += `*Items:* \n`;

    orderData.items.forEach(item => {
      msg += `- ${item.name} x ${item.qty} (${fmt(item.price * item.qty)})\n`;
    });

    const deliveryLabel = delivery === 0 ? 'FREE' : `${fmt(delivery)} (Distance-based)`;
    msg += `\n*Subtotal:* ${fmt(subtotal)}`;
    msg += `\n*Delivery:* ${deliveryLabel}`;
    msg += `\n*Grand Total: ${fmt(total)}*\n`;
    msg += `*Payment:* ${orderData.payment.toUpperCase()}`;

    const whatsappUrl = `https://wa.me/918978920932?text=${encodeURIComponent(msg)}`;
    
    // Open WhatsApp with order details
    window.open(whatsappUrl, '_blank');

    // Clear cart
    localStorage.removeItem('fv_cart');
    updateCartCount();
    document.getElementById('success-modal').style.display = 'flex';
  });
}

// ---- Scroll fade-in observer ----
function observeFadeIn() {
  const cards = document.querySelectorAll('.product-card');
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => observer.observe(c));
}

// ---- Mobile nav toggle ----
function initMobileNav() {
  const btn = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.nav-links');
  if (btn && nav) {
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initMobileNav();
  initHome();
  initProducts();
  initProductDetail();
  initCart();
  initCheckout();
});

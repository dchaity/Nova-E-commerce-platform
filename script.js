/* ============================================================
   NOVA — Premium E-Commerce Storefront (Light Orange Theme)
   Vanilla JavaScript · FakeStoreAPI · localStorage
   ============================================================ */

// ---------- 1. Configuration ----------
const CONFIG = {
  API_BASE: 'https://fakestoreapi.com',
  TAX_RATE: 0.08,
  FREE_SHIPPING_THRESHOLD: 100,
  SHIPPING_FLAT: 5.99,
  CURRENCY: 'USD',
  LOCALE: 'en-US'
};

// ---------- 2. Application State ----------
const state = {
  products: [],
  filteredProducts: [],
  categories: [],
  cart: [],
  filters: {
    search: '',
    category: 'all',
    sort: 'featured'
  },
  loading: true,
  error: null,
  quickViewProduct: null,
  quickViewQty: 1,
  checkoutProcessing: false,
  orderPlaced: false
};

// ---------- 3. DOM References ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  navbar: $('#navbar'),
  productGrid: $('#productGrid'),
  productCountDisplay: $('#productCountDisplay'),
  categoryFilters: $('#categoryFilters'),
  sortSelect: $('#sortSelect'),
  searchInput: $('#searchInput'),
  clearFiltersBtn: $('#clearFiltersBtn'),
  catalogMessage: $('#catalogMessage'),
  messageText: $('#messageText'),
  retryBtn: $('#retryBtn'),
  cartBadge: $('#cartBadge'),
  cartToggle: $('#cartToggle'),
  cartDrawer: $('#cartDrawer'),
  cartBackdrop: $('#cartBackdrop'),
  closeCartBtn: $('#closeCartBtn'),
  cartItemsList: $('#cartItemsList'),
  cartItemCount: $('#cartItemCount'),
  subtotal: $('#subtotal'),
  tax: $('#tax'),
  shipping: $('#shipping'),
  total: $('#total'),
  checkoutBtn: $('#checkoutBtn'),
  continueShoppingBtn: $('#continueShoppingBtn'),
  quickViewModal: $('#quickViewModal'),
  quickViewContent: $('#quickViewContent'),
  checkoutModal: $('#checkoutModal'),
  checkoutContent: $('#checkoutContent'),
  searchOverlay: $('#searchOverlay'),
  searchToggle: $('#searchToggle'),
  closeSearchBtn: $('#closeSearchBtn'),
  searchInputOverlay: $('#searchInputOverlay'),
  heroCollage: $('#heroCollage'),
  categoriesGrid: $('#categoriesGrid'),
  newsletterForm: $('#newsletterForm'),
  newsletterEmail: $('#newsletterEmail'),
  newsletterFeedback: $('#newsletterFeedback'),
  mobileMenuBtn: $('#mobileMenuBtn'),
  mobileNav: $('#mobileNav'),
  logoHome: $('#logoHome'),
  shopCollectionBtn: $('#shopCollectionBtn'),
  exploreCategoriesBtn: $('#exploreCategoriesBtn'),
  copyrightYear: $('#copyrightYear'),
  toast: $('#toast')
};

// ---------- 4. Utilities ----------
const formatPrice = (amount) => {
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: 'currency',
    currency: CONFIG.CURRENCY
  }).format(amount);
};

const roundToTwo = (num) => Math.round(num * 100) / 100;

const showToast = (message, duration = 2500) => {
  dom.toast.textContent = message;
  dom.toast.classList.add('show');
  clearTimeout(dom.toast._timeout);
  dom.toast._timeout = setTimeout(() => {
    dom.toast.classList.remove('show');
  }, duration);
};

const escapeHtml = (str) => {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// ---------- 5. API Service ----------
const api = {
  async fetchProducts() {
    const res = await fetch(`${CONFIG.API_BASE}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid response format');
    return data;
  },

  async fetchCategories() {
    const res = await fetch(`${CONFIG.API_BASE}/products/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async fetchProduct(id) {
    const res = await fetch(`${CONFIG.API_BASE}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
};

// ---------- 6. Product Data Management ----------
const productManager = {
  validate(product) {
    return product
      && typeof product.id === 'number'
      && typeof product.title === 'string'
      && typeof product.price === 'number'
      && typeof product.category === 'string';
  },

  normalize(product) {
    return {
      id: product.id,
      title: product.title || 'Untitled',
      price: product.price || 0,
      description: product.description || '',
      category: product.category || 'uncategorized',
      image: product.image || '',
      rating: product.rating && typeof product.rating.rate === 'number'
        ? { rate: product.rating.rate, count: product.rating.count || 0 }
        : { rate: 0, count: 0 }
    };
  },

  getCategoryLabel(category) {
    const labels = {
      'electronics': 'Electronics',
      'jewelery': 'Jewelry',
      "men's clothing": "Men's Clothing",
      "women's clothing": "Women's Clothing"
    };
    return labels[category] || category;
  },

  getBadge(product) {
    if (product.rating.rate >= 4.5) return 'Top Rated';
    if (product.rating.count >= 400) return 'Popular';
    if (product.id % 7 === 0) return 'New Arrival';
    return null;
  }
};

// ---------- 7. Filtering & Sorting ----------
const filterEngine = {
  apply() {
    let items = [...state.products];

    if (state.filters.search.trim()) {
      const q = state.filters.search.toLowerCase().trim();
      items = items.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (state.filters.category !== 'all') {
      items = items.filter(p => p.category === state.filters.category);
    }

    switch (state.filters.sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => (b.rating.rate || 0) - (a.rating.rate || 0));
        break;
      case 'name':
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    state.filteredProducts = items;
    return items;
  }
};

// ---------- 8. Product Rendering ----------
const productRenderer = {
  renderGrid(products) {
    if (!products.length) {
      dom.productGrid.innerHTML = '';
      dom.catalogMessage.classList.remove('hidden');
      dom.messageText.textContent = 'No products match your current filters. Try adjusting your search or filters.';
      dom.retryBtn.classList.add('hidden');
      dom.productCountDisplay.textContent = '0 products';
      return;
    }

    dom.catalogMessage.classList.add('hidden');
    dom.productCountDisplay.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;

    dom.productGrid.innerHTML = products.map(product => this.createCard(product)).join('');
  },

  createCard(product) {
    const badge = productManager.getBadge(product);
    const categoryLabel = productManager.getCategoryLabel(product.category);
    const stars = this.renderStars(product.rating.rate);
    const ratingCount = product.rating.count > 0 ? `(${product.rating.count})` : '';

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-image-wrapper" data-quick-view="${product.id}">
          ${badge ? `<span class="product-badge">${badge}</span>` : ''}
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy" 
               onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23f0d0b0' stroke-width='1'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Cpath d='M22 22l-6-6-4 4-6-6'/%3E%3C/svg%3E'">
          <button class="quick-view-btn" data-quick-view="${product.id}">Quick View</button>
        </div>
        <div class="product-info">
          <span class="product-category">${escapeHtml(categoryLabel)}</span>
          <h3 class="product-title">${escapeHtml(product.title)}</h3>
          <div class="product-rating">
            ${stars} ${ratingCount}
          </div>
          <div class="product-price-row">
            <span class="product-price">${formatPrice(product.price)}</span>
            <button class="add-to-cart-btn" data-add-to-cart="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  },

  renderStars(rate) {
    if (!rate) return '<span class="star">★</span>'.repeat(5).replace(/★/g, '☆');
    const full = Math.floor(rate);
    const half = rate % 1 >= 0.5;
    let html = '<span class="star">★</span>'.repeat(full);
    if (half) html += '<span class="star">★</span>';
    const empty = 5 - full - (half ? 1 : 0);
    html += '<span class="star" style="color:#e0d0c0;fill:#e0d0c0;">★</span>'.repeat(empty);
    return html;
  },

  renderSkeleton() {
    dom.productGrid.innerHTML = Array(8).fill(0).map(() => `
      <div class="product-card" style="pointer-events:none;">
        <div class="product-image-wrapper skeleton" style="aspect-ratio:1;"></div>
        <div class="product-info">
          <div class="skeleton" style="height:12px;width:40%;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:16px;width:90%;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:12px;width:50%;margin-bottom:12px;"></div>
          <div class="skeleton" style="height:20px;width:30%;"></div>
        </div>
      </div>
    `).join('');
  }
};

// ---------- 9. Cart State Management ----------
const cartManager = {
  addToCart(product, quantity = 1) {
    const existing = state.cart.find(item => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        productId: product.id,
        quantity,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category
        }
      });
    }
    this.saveCart();
    this.updateUI();
    showToast(`${product.title.substring(0, 30)}... added to cart`);
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.productId !== productId);
    this.saveCart();
    this.updateUI();
    showToast('Item removed from cart');
  },

  updateQuantity(productId, quantity) {
    if (quantity < 1) quantity = 1;
    const item = state.cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
      this.updateUI();
    }
  },

  calculateSubtotal() {
    return roundToTwo(state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
  },

  calculateTax() {
    return roundToTwo(this.calculateSubtotal() * CONFIG.TAX_RATE);
  },

  calculateShipping() {
    const subtotal = this.calculateSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_FLAT;
  },

  calculateTotal() {
    return roundToTwo(this.calculateSubtotal() + this.calculateTax() + this.calculateShipping());
  },

  getItemCount() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  saveCart() {
    try {
      const data = state.cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product
      }));
      localStorage.setItem('nova_cart', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  },

  loadCart() {
    try {
      const raw = localStorage.getItem('nova_cart');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return;
      state.cart = data.filter(item =>
        item
        && typeof item.productId === 'number'
        && typeof item.quantity === 'number'
        && item.quantity > 0
        && item.product
      ).map(item => ({
        productId: item.productId,
        quantity: Math.max(1, item.quantity),
        product: item.product
      }));
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
      state.cart = [];
    }
  },

  updateUI() {
    const count = this.getItemCount();
    dom.cartBadge.textContent = count;
    dom.cartBadge.style.display = count > 0 ? 'flex' : 'none';
    dom.cartItemCount.textContent = count;

    this.renderCartItems();

    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    const shipping = this.calculateShipping();
    const total = this.calculateTotal();

    dom.subtotal.textContent = formatPrice(subtotal);
    dom.tax.textContent = formatPrice(tax);
    dom.shipping.textContent = shipping === 0 && subtotal > 0 ? 'Free' : formatPrice(shipping);
    dom.total.textContent = formatPrice(total);

    if (state.cart.length === 0) {
      dom.cartItemsList.innerHTML = `
        <div style="text-align:center;padding:48px 16px;color:var(--text-secondary);">
          <i data-lucide="shopping-bag" style="width:48px;height:48px;margin-bottom:16px;opacity:0.4;"></i>
          <p>Your cart is empty</p>
          <p style="font-size:0.85rem;">Discover something you love.</p>
        </div>
      `;
      dom.checkoutBtn.disabled = true;
      dom.checkoutBtn.style.opacity = '0.5';
    } else {
      dom.checkoutBtn.disabled = false;
      dom.checkoutBtn.style.opacity = '1';
    }

    lucide.createIcons();
  },

  renderCartItems() {
    dom.cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-cart-item="${item.productId}">
        <img src="${escapeHtml(item.product.image)}" alt="${escapeHtml(item.product.title)}"
             onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 24 24' fill='none' stroke='%23f0d0b0' stroke-width='1'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Cpath d='M22 22l-6-6-4 4-6-6'/%3E%3C/svg%3E'">
        <div class="cart-item-info">
          <div class="cart-item-title">${escapeHtml(item.product.title)}</div>
          <div class="cart-item-price">${formatPrice(item.product.price)}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" data-cart-decrease="${item.productId}">−</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="qty-btn" data-cart-increase="${item.productId}">+</button>
            <button class="remove-item-btn" data-cart-remove="${item.productId}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
};

// ---------- 10. Modal & Drawer Controls ----------
const uiController = {
  openCart() {
    dom.cartDrawer.classList.add('open');
    dom.cartBackdrop.classList.add('active');
    dom.cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  },

  closeCart() {
    dom.cartDrawer.classList.remove('open');
    dom.cartBackdrop.classList.remove('active');
    dom.cartDrawer.setAttribute('aria-hidden', 'true');
    if (!dom.quickViewModal.classList.contains('open') && !dom.checkoutModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  },

  openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.quickViewProduct = product;
    state.quickViewQty = 1;

    const stars = productRenderer.renderStars(product.rating.rate);
    const categoryLabel = productManager.getCategoryLabel(product.category);

    dom.quickViewContent.innerHTML = `
      <button class="icon-btn close-modal-btn" id="closeQuickViewBtn" aria-label="Close quick view">
        <i data-lucide="x"></i>
      </button>
      <div class="quick-view-grid">
        <div class="quick-view-image">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}"
               onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24' fill='none' stroke='%23f0d0b0' stroke-width='1'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Cpath d='M22 22l-6-6-4 4-6-6'/%3E%3C/svg%3E'">
        </div>
        <div class="quick-view-details">
          <div class="quick-view-category">${escapeHtml(categoryLabel)}</div>
          <h2>${escapeHtml(product.title)}</h2>
          <div class="quick-view-price">${formatPrice(product.price)}</div>
          <div class="quick-view-rating">
            ${stars} <span style="font-size:0.85rem;color:var(--text-secondary);">(${product.rating.count} reviews)</span>
          </div>
          <p class="quick-view-desc">${escapeHtml(product.description)}</p>
          <div class="quick-view-qty">
            <span style="font-weight:600;font-size:0.9rem;">Quantity:</span>
            <div class="qty-selector">
              <button id="qvDecrease">−</button>
              <span id="qvQty">1</span>
              <button id="qvIncrease">+</button>
            </div>
          </div>
          <button class="btn btn-primary" id="qvAddToCart" style="width:100%;">Add to Cart</button>
        </div>
      </div>
    `;

    dom.quickViewModal.classList.add('open');
    dom.quickViewModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();

    document.getElementById('closeQuickViewBtn').addEventListener('click', () => this.closeQuickView());

    document.getElementById('qvDecrease').addEventListener('click', () => {
      if (state.quickViewQty > 1) {
        state.quickViewQty--;
        document.getElementById('qvQty').textContent = state.quickViewQty;
      }
    });

    document.getElementById('qvIncrease').addEventListener('click', () => {
      state.quickViewQty++;
      document.getElementById('qvQty').textContent = state.quickViewQty;
    });

    document.getElementById('qvAddToCart').addEventListener('click', () => {
      cartManager.addToCart(product, state.quickViewQty);
      this.closeQuickView();
      this.openCart();
    });
  },

  closeQuickView() {
    dom.quickViewModal.classList.remove('open');
    dom.quickViewModal.setAttribute('aria-hidden', 'true');
    if (!dom.cartDrawer.classList.contains('open') && !dom.checkoutModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  },

  openCheckout() {
    if (state.cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }

    const subtotal = cartManager.calculateSubtotal();
    const tax = cartManager.calculateTax();
    const shipping = cartManager.calculateShipping();
    const total = cartManager.calculateTotal();

    const itemsHtml = state.cart.map(item => `
      <div class="checkout-item">
        <span>${escapeHtml(item.product.title)} × ${item.quantity}</span>
        <span>${formatPrice(item.product.price * item.quantity)}</span>
      </div>
    `).join('');

    dom.checkoutContent.innerHTML = `
      <button class="icon-btn close-modal-btn" id="closeCheckoutBtn" aria-label="Close checkout">
        <i data-lucide="x"></i>
      </button>
      <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:24px;">Checkout</h2>
      <div class="checkout-grid">
        <form class="checkout-form" id="checkoutForm" novalidate>
          <h3>Contact Information</h3>
          <div class="form-group" id="group-name">
            <label for="fullName">Full Name *</label>
            <input type="text" id="fullName" name="fullName" required autocomplete="name">
            <span class="error-msg">Please enter your full name.</span>
          </div>
          <div class="form-group" id="group-email">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required autocomplete="email">
            <span class="error-msg">Please enter a valid email address.</span>
          </div>
          <div class="form-group" id="group-phone">
            <label for="phone">Phone Number (optional)</label>
            <input type="tel" id="phone" name="phone" autocomplete="tel">
            <span class="error-msg"></span>
          </div>

          <h3>Delivery Information</h3>
          <div class="form-group" id="group-address">
            <label for="address">Street Address *</label>
            <input type="text" id="address" name="address" required autocomplete="street-address">
            <span class="error-msg">Please enter your street address.</span>
          </div>
          <div class="form-group" id="group-city">
            <label for="city">City *</label>
            <input type="text" id="city" name="city" required autocomplete="address-level2">
            <span class="error-msg">Please enter your city.</span>
          </div>
          <div class="form-group" id="group-postal">
            <label for="postal">Postal Code *</label>
            <input type="text" id="postal" name="postal" required autocomplete="postal-code">
            <span class="error-msg">Please enter your postal code.</span>
          </div>
          <div class="form-group" id="group-country">
            <label for="country">Country *</label>
            <input type="text" id="country" name="country" required autocomplete="country-name">
            <span class="error-msg">Please enter your country.</span>
          </div>
        </form>

        <div class="checkout-summary">
          <h3>Order Summary</h3>
          ${itemsHtml}
          <div class="checkout-totals">
            <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
            <div class="summary-row"><span>Estimated Tax</span><span>${formatPrice(tax)}</span></div>
            <div class="summary-row"><span>Shipping</span><span>${shipping === 0 && subtotal > 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          </div>
          <button class="btn btn-primary place-order-btn" id="placeOrderBtn" type="button">Place Demo Order</button>
          <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:12px;text-align:center;">This is a simulation. No real payment is taken.</p>
        </div>
      </div>
    `;

    dom.checkoutModal.classList.add('open');
    dom.checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();

    document.getElementById('closeCheckoutBtn').addEventListener('click', () => this.closeCheckout());
    document.getElementById('placeOrderBtn').addEventListener('click', () => this.handleCheckoutSubmit());
  },

  closeCheckout() {
    dom.checkoutModal.classList.remove('open');
    dom.checkoutModal.setAttribute('aria-hidden', 'true');
    state.checkoutProcessing = false;
    if (!dom.cartDrawer.classList.contains('open') && !dom.quickViewModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  },

  handleCheckoutSubmit() {
    if (state.checkoutProcessing || state.orderPlaced) return;

    const form = document.getElementById('checkoutForm');
    if (!form) return;

    $$('.form-group').forEach(g => g.classList.remove('has-error'));

    const fields = {
      fullName: { value: form.fullName.value.trim() },
      email: { value: form.email.value.trim() },
      phone: { value: form.phone.value.trim() },
      address: { value: form.address.value.trim() },
      city: { value: form.city.value.trim() },
      postal: { value: form.postal.value.trim() },
      country: { value: form.country.value.trim() }
    };

    let isValid = true;

    if (!fields.fullName.value) {
      document.getElementById('group-name').classList.add('has-error');
      isValid = false;
    }
    if (!fields.email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
      document.getElementById('group-email').classList.add('has-error');
      isValid = false;
    }
    if (!fields.address.value) {
      document.getElementById('group-address').classList.add('has-error');
      isValid = false;
    }
    if (!fields.city.value) {
      document.getElementById('group-city').classList.add('has-error');
      isValid = false;
    }
    if (!fields.postal.value) {
      document.getElementById('group-postal').classList.add('has-error');
      isValid = false;
    }
    if (!fields.country.value) {
      document.getElementById('group-country').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    state.checkoutProcessing = true;
    const placeBtn = document.getElementById('placeOrderBtn');
    placeBtn.disabled = true;
    placeBtn.textContent = 'Processing...';
    placeBtn.style.opacity = '0.6';

    setTimeout(() => {
      const orderRef = 'NOVA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      const orderItems = state.cart.map(item => ({
        title: item.product.title,
        quantity: item.quantity,
        price: item.product.price,
        lineTotal: roundToTwo(item.product.price * item.quantity)
      }));
      const orderSubtotal = cartManager.calculateSubtotal();
      const orderTax = cartManager.calculateTax();
      const orderShipping = cartManager.calculateShipping();
      const orderTotal = cartManager.calculateTotal();

      state.cart = [];
      cartManager.saveCart();
      cartManager.updateUI();

      state.orderPlaced = true;
      state.checkoutProcessing = false;

      dom.checkoutContent.innerHTML = `
        <button class="icon-btn close-modal-btn" id="closeConfirmationBtn" aria-label="Close confirmation">
          <i data-lucide="x"></i>
        </button>
        <div class="order-confirmation">
          <div class="success-icon">
            <i data-lucide="check" style="width:32px;height:32px;"></i>
          </div>
          <h2>Order Confirmed!</h2>
          <p class="order-ref">Order Reference: <strong>${orderRef}</strong></p>

          <div style="text-align:left;max-width:400px;margin:0 auto 24px;">
            ${orderItems.map(item => `
              <div class="checkout-item">
                <span>${escapeHtml(item.title)} × ${item.quantity}</span>
                <span>${formatPrice(item.lineTotal)}</span>
              </div>
            `).join('')}
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
              <div class="summary-row"><span>Subtotal</span><span>${formatPrice(orderSubtotal)}</span></div>
              <div class="summary-row"><span>Estimated Tax</span><span>${formatPrice(orderTax)}</span></div>
              <div class="summary-row"><span>Shipping</span><span>${orderShipping === 0 ? 'Free' : formatPrice(orderShipping)}</span></div>
              <div class="summary-row total"><span>Total</span><span>${formatPrice(orderTotal)}</span></div>
            </div>
          </div>

          <p class="demo-disclaimer">This is a simulated order. No real payment was taken, and no products will be shipped.</p>
        </div>
      `;

      lucide.createIcons();

      document.getElementById('closeConfirmationBtn').addEventListener('click', () => {
        this.closeCheckout();
        state.orderPlaced = false;
      });
    }, 1200);
  }
};

// ---------- 11. Newsletter ----------
const newsletterHandler = {
  init() {
    dom.newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = dom.newsletterEmail.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        dom.newsletterFeedback.textContent = 'Please enter a valid email address.';
        dom.newsletterFeedback.className = 'newsletter-feedback error';
        return;
      }
      dom.newsletterFeedback.textContent = 'Thank you! (Demo only — no email will be sent.)';
      dom.newsletterFeedback.className = 'newsletter-feedback success';
      dom.newsletterEmail.value = '';
    });
  }
};

// ---------- 12. Initialization & Event Wiring ----------
const app = {
  async init() {
    dom.copyrightYear.textContent = new Date().getFullYear();

    cartManager.loadCart();
    cartManager.updateUI();

    this.setupGlobalListeners();
    this.setupNavListeners();
    this.setupCatalogListeners();
    this.setupCartListeners();
    this.setupModalListeners();
    newsletterHandler.init();

    await this.loadData();

    lucide.createIcons();
  },

  async loadData() {
    state.loading = true;
    state.error = null;
    productRenderer.renderSkeleton();
    dom.catalogMessage.classList.add('hidden');

    try {
      const [productsRaw, categories] = await Promise.all([
        api.fetchProducts(),
        api.fetchCategories()
      ]);

      const validProducts = productsRaw
        .filter(p => productManager.validate(p))
        .map(p => productManager.normalize(p));

      if (validProducts.length === 0) {
        throw new Error('No valid products returned');
      }

      state.products = validProducts;
      state.categories = categories;

      this.buildCategoryFilters(categories);
      this.renderHeroCollage(validProducts.slice(0, 4));
      this.renderCategoryCards(validProducts);

      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);

      state.loading = false;
    } catch (err) {
      console.error('Failed to load data:', err);
      state.loading = false;
      state.error = err.message;
      productRenderer.renderGrid([]);
      dom.catalogMessage.classList.remove('hidden');
      dom.messageText.textContent = 'Unable to load products. Please check your connection and try again.';
      dom.retryBtn.classList.remove('hidden');
    }

    lucide.createIcons();
  },

  buildCategoryFilters(categories) {
    const filterLabels = [
      { key: 'all', label: 'All Products' },
      ...categories.map(c => ({
        key: c,
        label: productManager.getCategoryLabel(c)
      }))
    ];

    dom.categoryFilters.innerHTML = filterLabels.map(f => `
      <button class="filter-btn ${f.key === 'all' ? 'active' : ''}" data-category-filter="${f.key}">${escapeHtml(f.label)}</button>
    `).join('');

    dom.categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category-filter]');
      if (!btn) return;

      const category = btn.dataset.categoryFilter;

      dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.filters.category = category;
      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);

      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  },

  renderHeroCollage(products) {
    if (!products.length) return;
    dom.heroCollage.innerHTML = products.map(p => `
      <div class="hero-img-wrapper">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy"
             onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23f0d0b0' stroke-width='1'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Cpath d='M22 22l-6-6-4 4-6-6'/%3E%3C/svg%3E'">
      </div>
    `).join('');
  },

  renderCategoryCards(products) {
    const categories = [
      {
        key: 'electronics',
        title: 'Electronics',
        desc: 'Discover the latest gadgets and tech essentials.',
        image: products.find(p => p.category === 'electronics')?.image || ''
      },
      {
        key: 'jewelery',
        title: 'Jewelry',
        desc: 'Elegant pieces to elevate every look.',
        image: products.find(p => p.category === 'jewelery')?.image || ''
      },
      {
        key: 'clothing',
        title: 'Clothing',
        desc: 'Curated styles for men and women.',
        image: products.find(p => p.category === "men's clothing")?.image || ''
      }
    ];

    dom.categoriesGrid.innerHTML = categories.map(c => `
      <div class="category-card" data-category-card="${c.key}">
        <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}"
             onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23f0d0b0' stroke-width='1'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ccircle cx='8' cy='8' r='2'/%3E%3Cpath d='M22 22l-6-6-4 4-6-6'/%3E%3C/svg%3E'">
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.desc)}</p>
        <span class="shop-link">Shop Now →</span>
      </div>
    `).join('');

    dom.categoriesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-category-card]');
      if (!card) return;

      let category = card.dataset.categoryCard;
      if (category === 'clothing') {
        const clothingProducts = state.products.filter(p =>
          p.category === "men's clothing" || p.category === "women's clothing"
        );
        state.filters.category = 'all';
        state.filters.search = '';
        dom.searchInput.value = '';
        dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = dom.categoryFilters.querySelector('[data-category-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        state.filteredProducts = clothingProducts;
        productRenderer.renderGrid(clothingProducts);
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      state.filters.category = category;
      state.filters.search = '';
      dom.searchInput.value = '';
      dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.categoryFilter === category);
      });
      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  },

  setupGlobalListeners() {
    dom.retryBtn.addEventListener('click', () => {
      this.loadData();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (dom.quickViewModal.classList.contains('open')) uiController.closeQuickView();
        if (dom.checkoutModal.classList.contains('open')) uiController.closeCheckout();
        if (dom.cartDrawer.classList.contains('open')) uiController.closeCart();
        if (dom.searchOverlay.classList.contains('active')) {
          dom.searchOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    dom.quickViewModal.addEventListener('click', (e) => {
      if (e.target === dom.quickViewModal) uiController.closeQuickView();
    });
    dom.checkoutModal.addEventListener('click', (e) => {
      if (e.target === dom.checkoutModal) uiController.closeCheckout();
    });
    dom.cartBackdrop.addEventListener('click', () => uiController.closeCart());

    dom.quickViewContent.addEventListener('click', (e) => e.stopPropagation());
    dom.checkoutContent.addEventListener('click', (e) => e.stopPropagation());
  },

  setupNavListeners() {
    dom.logoHome.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      state.filters.category = 'all';
      state.filters.search = '';
      state.filters.sort = 'featured';
      dom.searchInput.value = '';
      dom.sortSelect.value = 'featured';
      dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.categoryFilter === 'all');
      });
      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);
    });

    dom.searchToggle.addEventListener('click', () => {
      dom.searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      dom.searchInputOverlay.focus();
    });

    dom.closeSearchBtn.addEventListener('click', () => {
      dom.searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    dom.searchOverlay.addEventListener('click', (e) => {
      if (e.target === dom.searchOverlay) {
        dom.searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    dom.searchInputOverlay.addEventListener('input', (e) => {
      const val = e.target.value;
      dom.searchInput.value = val;
      state.filters.search = val;
      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);
      if (val.length > 0) {
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    dom.shopCollectionBtn.addEventListener('click', () => {
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    dom.exploreCategoriesBtn.addEventListener('click', () => {
      document.getElementById('categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    dom.mobileMenuBtn.addEventListener('click', () => {
      dom.mobileNav.classList.toggle('open');
    });

    dom.mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        dom.mobileNav.classList.remove('open');
      });
    });

    document.querySelectorAll('.footer-links a[data-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.category;
        state.filters.category = cat;
        state.filters.search = '';
        dom.searchInput.value = '';
        dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.categoryFilter === cat);
        });
        filterEngine.apply();
        productRenderer.renderGrid(state.filteredProducts);
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  },

  setupCatalogListeners() {
    let searchTimeout;
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.filters.search = e.target.value;
        filterEngine.apply();
        productRenderer.renderGrid(state.filteredProducts);
      }, 250);
    });

    dom.sortSelect.addEventListener('change', (e) => {
      state.filters.sort = e.target.value;
      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);
    });

    dom.clearFiltersBtn.addEventListener('click', () => {
      state.filters.search = '';
      state.filters.category = 'all';
      state.filters.sort = 'featured';
      dom.searchInput.value = '';
      dom.searchInputOverlay.value = '';
      dom.sortSelect.value = 'featured';
      dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.categoryFilter === 'all');
      });
      filterEngine.apply();
      productRenderer.renderGrid(state.filteredProducts);
    });

    dom.productGrid.addEventListener('click', (e) => {
      const quickViewEl = e.target.closest('[data-quick-view]');
      if (quickViewEl) {
        const id = parseInt(quickViewEl.dataset.quickView, 10);
        if (!isNaN(id)) uiController.openQuickView(id);
        return;
      }

      const addBtn = e.target.closest('[data-add-to-cart]');
      if (addBtn) {
        const id = parseInt(addBtn.dataset.addToCart, 10);
        const product = state.products.find(p => p.id === id);
        if (product) {
          cartManager.addToCart(product, 1);
          dom.cartBadge.style.transform = 'scale(1.3)';
          setTimeout(() => dom.cartBadge.style.transform = 'scale(1)', 200);
        }
      }
    });
  },

  setupCartListeners() {
    dom.cartToggle.addEventListener('click', () => uiController.openCart());
    dom.closeCartBtn.addEventListener('click', () => uiController.closeCart());
    dom.continueShoppingBtn.addEventListener('click', () => uiController.closeCart());

    dom.cartItemsList.addEventListener('click', (e) => {
      const increase = e.target.closest('[data-cart-increase]');
      const decrease = e.target.closest('[data-cart-decrease]');
      const remove = e.target.closest('[data-cart-remove]');

      if (increase) {
        const id = parseInt(increase.dataset.cartIncrease, 10);
        const item = state.cart.find(i => i.productId === id);
        if (item) cartManager.updateQuantity(id, item.quantity + 1);
      }

      if (decrease) {
        const id = parseInt(decrease.dataset.cartDecrease, 10);
        const item = state.cart.find(i => i.productId === id);
        if (item) cartManager.updateQuantity(id, Math.max(1, item.quantity - 1));
      }

      if (remove) {
        const id = parseInt(remove.dataset.cartRemove, 10);
        cartManager.removeFromCart(id);
      }
    });

    dom.checkoutBtn.addEventListener('click', () => {
      uiController.closeCart();
      uiController.openCheckout();
    });
  },

  setupModalListeners() {
    // Handled in uiController methods
  }
};

// ---------- 13. Start the application ----------
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
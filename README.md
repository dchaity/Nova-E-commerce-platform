# NOVA — Premium E-Commerce Storefront

A complete, professional, and fully functional e-commerce frontend built with **HTML5, CSS3, and Vanilla JavaScript**. NOVA delivers a polished shopping experience with product discovery, category filtering, search, sorting, a persistent cart, quantity controls, accurate price calculations, and a simulated checkout process — all powered by live data from **FakeStoreAPI**.

> **Live Demo:** https://dchaity.github.io/Nova-E-commerce-platform/

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Main Features](#-main-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [API Information](#-api-information)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [Supported Functionality](#-supported-functionality)
- [Design System](#-design-system)
- [Accessibility](#-accessibility)
- [Performance](#-performance)
- [Known Limitations](#-known-limitations)
- [Checkout Simulation Disclaimer](#-checkout-simulation-disclaimer)
- [Testing Checklist](#-testing-checklist)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## 🛍️ Project Overview

**NOVA** is a production-quality frontend e-commerce storefront that demonstrates how a modern shopping platform can be built without any framework, build step, or backend.

It fetches real product data from **FakeStoreAPI** and provides a complete shopping flow:

1. **Discover** products through a curated hero section and category cards.
2. **Browse** the catalog with live search, category filters, and sorting.
3. **Inspect** products in a quick-view modal with full details and a quantity selector.
4. **Add to cart**, adjust quantities, and remove items in a slide-out cart drawer.
5. **Review** a transparent order summary with subtotal, estimated tax, shipping, and total.
6. **Checkout** through a validated, simulated form that generates a demo order reference.

The cart persists in `localStorage`, so your selections survive page refreshes. All prices are formatted using `Intl.NumberFormat`, and every interaction provides clear visual feedback.

**Brand personality:** Modern · Minimalist · Elegant · Trustworthy · Premium · User-friendly.

---

## ✨ Main Features

### Product Discovery
- ✅ Dynamic product fetching from FakeStoreAPI (no hardcoded catalog).
- ✅ Live search matching product **titles and descriptions**.
- ✅ Category filtering: All, Electronics, Jewelry, Men's Clothing, Women's Clothing.
- ✅ Sorting: Featured, Price (Low→High / High→Low), Rating, Name (A→Z).
- ✅ Search + category + sort work together without resetting each other.
- ✅ "Clear Filters" restores the default catalog view.
- ✅ Live product count and empty-state messaging.
- ✅ Rule-based badges: **Top Rated**, **Popular**, **New Arrival** (presentation labels only).

### Product Cards
- ✅ API product image with `object-fit: contain` and graceful fallback for broken URLs.
- ✅ Category, title (line-clamped), price, average rating, and review count.
- ✅ **Add to Cart** and **Quick View** actions.

### Quick View Modal
- ✅ Accessible modal with larger image, full description, price, and rating.
- ✅ Quantity selector before adding to cart.
- ✅ Closes on backdrop click, Escape key, or close button.
- ✅ Focus management and background scroll prevention.

### Shopping Cart
- ✅ Slide-out drawer from the right with item count.
- ✅ Persistent via `localStorage` (survives refresh).
- ✅ Quantity controls (+/−) with a minimum of 1.
- ✅ Remove item action.
- ✅ Adding an existing product increases its quantity (no duplicates).
- ✅ Line-item subtotals and full order summary.
- ✅ Navbar cart badge shows **total units**, not distinct products.
- ✅ Immediate synchronization of badge, drawer, and totals.

### Pricing Engine
- ✅ Configurable tax rate (default **8%**).
- ✅ Configurable shipping: **free over $100**, otherwise **$5.99 flat**.
- ✅ Accurate two-decimal rounding with unrounded underlying values.
- ✅ Empty cart total = **$0.00**.
- ✅ All values recalculate on any cart change.

### Simulated Checkout
- ✅ Modal with Contact + Delivery information sections.
- ✅ Client-side validation (required fields, email format) with field-specific errors.
- ✅ Processing state that prevents duplicate submissions.
- ✅ Unique demo order reference (e.g., `NOVA-XXXXXX-XXXX`).
- ✅ Order confirmation screen with item summary and total.
- ✅ Cart cleared only after successful simulated order.
- ✅ Clear disclaimer: **no real payment is taken**.

### Additional Sections
- ✅ Sticky navigation with mobile menu.
- ✅ Hero with product collage from API data.
- ✅ Featured category cards (Electronics, Jewelry, Clothing) with clickable filtering.
- ✅ "Why Shop with NOVA" trust section (3 feature cards).
- ✅ Newsletter form with email validation and demo-only feedback.
- ✅ Footer with dynamic copyright year and demo disclosure.

### Reliability & UX
- ✅ Loading skeletons during data fetch.
- ✅ Friendly error state with **Retry** button when the API fails.
- ✅ Toast notifications for cart actions.
- ✅ Graceful handling of missing images and ratings.
- ✅ No JavaScript console errors during normal usage.

---

## 🧰 Technology Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 (semantic) |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Data | [FakeStoreAPI](https://fakestoreapi.com) |
| Persistence | Browser `localStorage` |
| Icons | [Lucide Icons](https://lucide.dev) (CDN) |
| Typography | [Google Fonts – Inter](https://fonts.google.com/specimen/Inter) |

**No frameworks. No build step. No backend required.**

---

## 📁 Project Structure

```text
nova-storefront/
├── index.html      # Semantic HTML structure & content
├── style.css       # Complete light-orange theme & responsive layout
├── script.js       # Application logic (API, cart, checkout, UI)
└── README.md       # Project documentation (this file)

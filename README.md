NOVA — Premium E-Commerce Storefront
A complete, professional, and fully functional e-commerce frontend built with HTML5, CSS3, and Vanilla JavaScript. NOVA delivers a polished shopping experience with product discovery, category filtering, search, sorting, a persistent cart, quantity controls, accurate price calculations, and a simulated checkout process — all powered by live data from FakeStoreAPI.

Live Demo: 

📋 Table of Contents
Project Overview

Main Features

Technology Stack

Project Structure

API Information

Running Locally

Deployment

Supported Functionality

Design System

Accessibility

Performance

Known Limitations

Checkout Simulation Disclaimer

Testing Checklist

Screenshots

License

🛍️ Project Overview
NOVA is a production-quality frontend e-commerce storefront that demonstrates how a modern shopping platform can be built without any framework, build step, or backend.

It fetches real product data from FakeStoreAPI and provides a complete shopping flow:

Discover products through a curated hero section and category cards.

Browse the catalog with live search, category filters, and sorting.

Inspect products in a quick-view modal with full details and a quantity selector.

Add to cart, adjust quantities, and remove items in a slide-out cart drawer.

Review a transparent order summary with subtotal, estimated tax, shipping, and total.

Checkout through a validated, simulated form that generates a demo order reference.

The cart persists in localStorage, so your selections survive page refreshes. All prices are formatted using Intl.NumberFormat, and every interaction provides clear visual feedback.

Brand personality: Modern · Minimalist · Elegant · Trustworthy · Premium · User-friendly.

✨ Main Features
Product Discovery
✅ Dynamic product fetching from FakeStoreAPI (no hardcoded catalog).

✅ Live search matching product titles and descriptions.

✅ Category filtering: All, Electronics, Jewelry, Men's Clothing, Women's Clothing.

✅ Sorting: Featured, Price (Low→High / High→Low), Rating, Name (A→Z).

✅ Search + category + sort work together without resetting each other.

✅ "Clear Filters" restores the default catalog view.

✅ Live product count and empty-state messaging.

✅ Rule-based badges: Top Rated, Popular, New Arrival (presentation labels only).

Product Cards
✅ API product image with object-fit: contain and graceful fallback for broken URLs.

✅ Category, title (line-clamped), price, average rating, and review count.

✅ Add to Cart and Quick View actions.

Quick View Modal
✅ Accessible modal with larger image, full description, price, and rating.

✅ Quantity selector before adding to cart.

✅ Closes on backdrop click, Escape key, or close button.

✅ Focus management and background scroll prevention.

Shopping Cart
✅ Slide-out drawer from the right with item count.

✅ Persistent via localStorage (survives refresh).

✅ Quantity controls (+/−) with a minimum of 1.

✅ Remove item action.

✅ Adding an existing product increases its quantity (no duplicates).

✅ Line-item subtotals and full order summary.

✅ Navbar cart badge shows total units, not distinct products.

✅ Immediate synchronization of badge, drawer, and totals.

Pricing Engine
✅ Configurable tax rate (default 8%).

✅ Configurable shipping: free over $100**, otherwise **$5.99 flat.

✅ Accurate two-decimal rounding with unrounded underlying values.

✅ Empty cart total = $0.00.

✅ All values recalculate on any cart change.

Simulated Checkout
✅ Modal with Contact + Delivery information sections.

✅ Client-side validation (required fields, email format) with field-specific errors.

✅ Processing state that prevents duplicate submissions.

✅ Unique demo order reference (e.g., NOVA-XXXXXX-XXXX).

✅ Order confirmation screen with item summary and total.

✅ Cart cleared only after successful simulated order.

✅ Clear disclaimer: no real payment is taken.

Additional Sections
✅ Sticky navigation with mobile menu.

✅ Hero with product collage from API data.

✅ Featured category cards (Electronics, Jewelry, Clothing) with clickable filtering.

✅ "Why Shop with NOVA" trust section (3 feature cards).

✅ Newsletter form with email validation and demo-only feedback.

✅ Footer with dynamic copyright year and demo disclosure.

Reliability & UX
✅ Loading skeletons during data fetch.

✅ Friendly error state with Retry button when the API fails.

✅ Toast notifications for cart actions.

✅ Graceful handling of missing images and ratings.

✅ No JavaScript console errors during normal usage.

🧰 Technology Stack
Layer	Technology
Structure	HTML5 (semantic)
Styling	CSS3 (Custom Properties, Grid, Flexbox, animations)
Logic	Vanilla JavaScript (ES6+)
Data	FakeStoreAPI
Persistence	Browser localStorage
Icons	Lucide Icons (CDN)
Typography	Google Fonts – Inter
No frameworks. No build step. No backend required.

📁 Project Structure
text
nova-storefront/
├── index.html      # Semantic HTML structure & content
├── style.css       # Complete light-orange theme & responsive layout
├── script.js       # Application logic (API, cart, checkout, UI)
└── README.md       # Project documentation (this file)
JavaScript Architecture
script.js is organized into clear, testable modules:

Section	Responsibility
CONFIG	Tax rate, shipping rules, currency, API base
state	Single source of truth for products, cart, filters
api	Async fetch helpers with HTTP status checks
productManager	Validation, normalization, category labels, badges
filterEngine	Search, category filtering, and sorting
productRenderer	Card markup, star ratings, skeleton loaders
cartManager	Add/remove/update, calculations, persistence, UI sync
uiController	Cart drawer, quick view, checkout, confirmation
newsletterHandler	Email validation and demo feedback
app	Initialization, event wiring, data loading
🔌 API Information
This project uses FakeStoreAPI — a free, no-auth, public REST API for sample e-commerce data.

Endpoints Used
Purpose	Endpoint
All products	GET https://fakestoreapi.com/products
All categories	GET https://fakestoreapi.com/products/categories
Single product	GET https://fakestoreapi.com/products/{id}
Category products	GET https://fakestoreapi.com/products/category/{category}
Expected Product Shape
json
{
  "id": 1,
  "title": "Product title",
  "price": 109.95,
  "description": "Product description",
  "category": "electronics",
  "image": "https://example.com/product.jpg",
  "rating": { "rate": 3.9, "count": 120 }
}
API Categories
FakeStoreAPI returns four categories:

electronics → displayed as Electronics

jewelery → displayed as Jewelry (spelling normalized in the UI)

men's clothing → displayed as Men's Clothing

women's clothing → displayed as Women's Clothing

⚠️ Note: FakeStoreAPI is a third-party demo service and may be temporarily unavailable. The app handles failures gracefully with an error message and a retry button. It does not substitute fabricated products when the API is down.

Data Handling
Products are validated before rendering (required fields checked).

Ratings missing from the API fall back to { rate: 0, count: 0 }.

Broken image URLs are replaced with an inline SVG placeholder.

Product data is cached in memory for the current session (no redundant requests).

No API keys or secrets are used or exposed.

🚀 Running Locally
Option 1: VS Code Live Server (Recommended)
Install Visual Studio Code.

Install the Live Server extension (by Ritwick Dey).

Open the project folder in VS Code.

Right-click index.html → Open with Live Server.

The site opens at http://127.0.0.1:5500 (or similar).

Option 2: Python HTTP Server
bash
# From the project directory
python -m http.server 8000
Then open http://localhost:8000 in your browser.

Option 3: Node.js http-server
bash
npx http-server -p 8000
Then open http://localhost:8000.

Why a server? The app fetches data from a remote API and uses localStorage. Opening index.html directly via file:// may cause CORS or storage restrictions in some browsers. Serving over HTTP is recommended.

🌐 Deployment
The project is a static site — no build step, no server-side code. Deploy it anywhere that serves static files.

GitHub Pages
Push the project to a GitHub repository.

Go to Settings → Pages.

Under Source, select Deploy from a branch.

Choose main (or master) and / (root).

Save — the site will be live at https://<username>.github.io/<repo>/.

Netlify
Log in to Netlify.

Click Add new site → Import an existing project.

Connect your Git repository.

Leave the build command empty; set Publish directory to / (or the repo root).

Deploy.

Or drag-and-drop: Drag the project folder onto the Netlify dashboard.

Vercel
Log in to Vercel.

Click Add New → Project.

Import your Git repository.

Framework preset: Other (no build step).

Deploy.

Relative Paths
All asset references (style.css, script.js) use relative paths, so the site works at any subpath (e.g., GitHub Pages project URLs).

✅ Supported Functionality
Catalog
☑ Fetch products from FakeStoreAPI
☑ Display dynamic product cards with image, price, category, rating
☑ Search by title and description
☑ Filter by category (all + four API categories)
☑ Sort by price, rating, and name
☑ Clear all active filters
☑ Loading skeletons and error/retry states
☑ Empty-state messaging for no matches
Product Interaction
☑ Quick View modal with full details
☑ Quantity selector in quick view
☑ Add to cart from card or quick view
☑ Modal closes via backdrop, Escape, or close button
Cart
☑ Add products (with quantity merging)
☑ Increase / decrease quantities (minimum 1)
☑ Remove products
☑ Live navbar badge (total units)
☑ Persistent cart via localStorage
☑ Cart restored after refresh
☑ Invalid/missing localStorage data handled gracefully
☑ Empty cart state
Pricing
☑ Subtotal calculation
☑ Estimated tax (8%)
☑ Shipping (free ≥ $100, else $5.99)
☑ Final total
☑ Two-decimal rounding
☑ Empty cart total = $0.00
Checkout
☑ Checkout modal with contact & delivery fields
☑ Required-field and email validation
☑ Field-specific error messages
☑ Duplicate-submission prevention
☑ Demo order reference generation
☑ Order confirmation screen
☑ Cart cleared after success
☑ Simulation disclaimer
General
☑ Responsive layout (mobile, tablet, desktop)
☑ Sticky navigation
☑ Mobile menu
☑ Keyboard accessibility (Escape to close)
☑ Reduced-motion support
☑ Newsletter with validation (demo only)
☑ Dynamic copyright year
🎨 Design System
The theme is defined using CSS Custom Properties in :root, making it easy to customize.

Light Orange Palette
Token	Value	Usage
--accent	#F97316	Primary buttons, badges, links, highlights
--accent-hover	#EA6A0A	Hover state for accent elements
--accent-soft	#FFF1E6	Soft tinted backgrounds (announcement, newsletter)
--bg-page	#FFF9F4	Warm off-white page background
--bg-card	#FFFFFF	Card surfaces
--text-main	#2D1B0E	Primary text (deep warm brown)
--text-secondary	#8A6B4F	Muted warm brown for secondary text
--border	#F0E0D4	Warm light borders
--success	#16A34A	Success feedback
--error	#DC2626	Validation errors
Typography
Font: Inter (Google Fonts), fallback to system sans-serif.

Hierarchy: Hero → Section headings → Card titles → Prices → Body → Labels.

Spacing & radii: Consistent 8px-based spacing scale and 8px / 12px / 20px radii.

Customization
Change the accent color by editing --accent and --accent-soft in style.css:

css
:root {
  --accent: #F59E0B;       /* golden orange */
  --accent-soft: #FFF8E1;  /* matching soft tint */
}
♿ Accessibility
Semantic HTML5 landmarks (header, nav, main, section, footer).

Accessible labels on all form inputs and icon buttons (aria-label).

Keyboard-operable controls (buttons and links are native elements).

Escape key closes modals and the cart drawer.

Visible focus indicators on interactive elements.

Meaningful alt text on product images.

aria-hidden toggled on modals and drawers.

Decorative icons marked so screen readers ignore them.

prefers-reduced-motion support disables animations.

Sufficient color contrast for text on backgrounds.

Note: This project follows practical WCAG principles but has not undergone a formal accessibility audit.

⚡ Performance
Lazy loading for product images below the fold (loading="lazy").

Fixed aspect-ratio image containers reduce layout shift.

In-memory product caching prevents redundant API calls.

Debounced search input (250ms) limits re-renders.

Skeleton placeholders instead of blocking spinners.

Lightweight animations and transitions.

No heavy dependencies — only Lucide icons and Google Fonts via CDN.

⚠️ Known Limitations
This is a frontend demonstration, not a production commerce system. Limitations include:

No real backend or database. All data comes from FakeStoreAPI; the cart lives only in localStorage.

No authentication. There are no user accounts, login, or profiles.

No real payments. Checkout is fully simulated — no payment gateway, no card processing.

No order fulfillment. Orders are not stored, emailed, or shipped.

FakeStoreAPI dependency. If the API is down, products cannot load (a retry option is provided).

Demo tax/shipping rules. The 8% tax and $5.99/$100 shipping thresholds are illustrative examples, not real quotes.

No email delivery. The newsletter form validates input but does not send or store anything.

localStorage is not secure storage. Do not store sensitive data there.

No server-side search or pagination. All filtering happens client-side on the fetched catalog (20 products).

Badges are rule-based presentation labels, not verified sales or inventory data.

🧾 Checkout Simulation Disclaimer
This is a frontend demonstration only.

No real payment is processed. No card numbers are requested or stored.

No order is placed with any real merchant or fulfillment service.

The order reference (e.g., NOVA-XXXXXX-XXXX) is randomly generated for demonstration purposes.

The confirmation screen explicitly states that the order is simulated.

The cart is cleared after the simulated order to demonstrate the full flow.

🧪 Testing Checklist
Use this checklist to verify the app after any change. Items are only checked if verified in a browser.

Product Catalog
□ Products load from FakeStoreAPI on first visit.
□ Product cards show correct title, price, category, image, and rating.
□ Searching for a product filters the grid.
□ Applying a category filter narrows the results.
□ Search + category + sort work together.
□ Sorting changes the order correctly.
□ "Clear" restores the full catalog.
□ No-match search shows an empty-state message.
□ API failure shows an error message with a working Retry button.
Shopping Cart
□ Adding a product updates the badge and drawer.
□ Adding the same product again increases its quantity.
□ +/− buttons change quantity (never below 1).
□ Remove deletes the item immediately.
□ Badge shows total units, not distinct products.
□ Refreshing the page preserves the cart.
□ Cart totals update with every change.
Pricing Scenarios
Scenario	Subtotal	Tax (8%)	Shipping	Total
A	$50.00	$4.00	$5.99	$59.99
B	$100.00	$8.00	$0.00	$108.00
C	$0.00	$0.00	$0.00	$0.00
□ Scenario A matches.
□ Scenario B matches.
□ Scenario C matches.
Checkout
□ Empty form submission shows validation errors.
□ Invalid email shows an email-specific error.
□ Valid details produce a confirmation with an order reference.
□ Cart is cleared after the demo order.
□ Refreshing does not restore the completed order.
□ Double-clicking "Place Demo Order" does not create duplicates.
Responsive & Accessibility
□ Layout works at ~375px, 430px, 768px, 1024px, 1440px.
□ No horizontal overflow on mobile.
□ Cart drawer fits the viewport.
□ Checkout modal is usable on mobile.
□ Escape closes modals and the drawer.
□ Keyboard focus is visible.
□ Mobile navigation menu opens and closes.


📄 License
This project is provided for educational and demonstration purposes. It uses FakeStoreAPI, a free public demo API. Product data, images, and categories belong to their respective owners.

You may use, modify, and adapt this code for learning and portfolio purposes.

🙏 Acknowledgements
FakeStoreAPI — free sample product data.

Lucide Icons — lightweight, consistent icon set.

Google Fonts – Inter — modern, readable typography.

Built with ❤️ using plain HTML, CSS, and JavaScript.
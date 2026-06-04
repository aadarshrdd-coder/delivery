# Fresh Veggies – Vegetable Delivery E‑Commerce

## Overview
A premium static web app for a vegetable‑delivery service built with vanilla HTML, CSS, and JavaScript. It showcases modern design (gradient hero, glass‑morphism, micro‑animations) and full client‑side cart functionality.

## Directory Layout
```
App/
├─ index.html               # Home / landing page
├─ products.html            # Catalogue view
├─ product.html             # Single product detail (URL param based)
├─ cart.html                # Shopping cart page
├─ checkout.html            # Checkout placeholder (no real payment)
├─ assets/
│   ├─ css/
│   │   └─ style.css        # Design system and component styles
│   ├─ js/
│   │   ├─ main.js          # Router, cart logic, UI helpers
│   │   └─ utils.js         # Small reusable utilities
│   └─ images/              # Placeholder vegetable photos (generated)
├─ products.json            # Sample product data used by the app
└─ README.md                # This file
```

## Development
1. **Start a static server** (Python or Node) from the `App` folder:
   ```bash
   # Python 3.x
   python -m http.server 8000
   # Or using Node's http‑server (install with `npm i -g http-server`)
   npx http-server -p 8000
   ```
2. Open <http://localhost:8000> in your browser.
3. Edit HTML/CSS/JS files; refresh to see changes. The cart persists via `localStorage`.

## Customisation
- Replace images in `assets/images/` with real product photos.
- Tweak the colour palette in `style.css` (primary/accent HSL values).
- To add real payment, swap `checkout.html` for a form that posts to your gateway and implement server‑side order handling.

## SEO & Accessibility
- Descriptive `<title>` and `<meta name="description">` tags are added.
- Semantic HTML elements (`header`, `nav`, `main`, `section`, `footer`).
- Keyboard‑focusable navigation links.
- All images include `alt` attributes.

Enjoy building your fresh‑produce delivery experience! 🚜🥕🌱

# ShopSphere — Production Capstone Project

ShopSphere is a production-style commerce dashboard built with **React + Vite**. It demonstrates the capstone requirements:

- Authentication simulation
- Interactive product catalog
- Dynamic CRUD operations
- Persistent client-side state
- Order workflow simulation
- Responsive UI
- Production build ready for Vercel, Netlify or Cloudflare Pages
- Professional README and architecture documentation

## 1. Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 |
| Build | Vite |
| Icons | Lucide React |
| State | React hooks |
| Persistence | Browser localStorage |
| Hosting | Vercel / Netlify / Cloudflare Pages |

> This capstone intentionally uses simulated authentication and local persistence so it can be deployed publicly without exposing real credentials or requiring a paid backend.

## 2. Features

### Authentication simulation
- Sign-in screen with name, email and password validation.
- Session is persisted in localStorage.
- Sign-out clears the simulated session.

### Product catalog
- Search by product name/category.
- Filter by category.
- Create products.
- Edit products.
- Delete products.
- Automatic low-stock status when stock is 5 or below.

### Persistent state
Product and order data are stored in browser localStorage. Refreshing the deployed application keeps the changes on the same browser.

### Order workflow
Orders can be moved through:
`Processing → Shipped → Delivered → Processing`

## 3. Architecture

```text
                  ┌─────────────────────────┐
                  │       ShopSphere UI     │
                  │       React + Vite      │
                  └────────────┬────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
       Authentication      Catalog CRUD     Order Workflow
              │                │                │
              └────────────────┼────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ React State Layer   │
                    │ useState / useMemo  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Browser localStorage│
                    │ Persistent State    │
                    └─────────────────────┘
```

## 4. Project Structure

```text
shopsphere-capstone/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    └── styles.css
```

## 5. Run Locally

Requirements:
- Node.js 18+
- npm

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

For a production build:

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## 6. Deployment

### Vercel
1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

### Netlify
1. Import the GitHub repository.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy.

### Cloudflare Pages
1. Create a Pages project from GitHub.
2. Build command: `npm run build`.
3. Build output directory: `dist`.
4. Deploy.

## 7. Mentor Demo Flow

Use this sequence during evaluation:

1. Open the live URL.
2. Sign in using the prefilled demo details.
3. Show the dashboard statistics.
4. Open **Product Catalog**.
5. Search for a product.
6. Filter by category.
7. Add a new product.
8. Edit that product.
9. Delete it.
10. Refresh the browser and show that existing data remains.
11. Open **Orders** and change an order status.
12. Sign out and sign in again.
13. Explain that the project uses simulated authentication and localStorage persistence.

## 8. Capstone Requirement Mapping

| Requirement | Implementation |
|---|---|
| Authentication simulation | Login form + localStorage session |
| Interactive catalog | Search + category filter |
| Dynamic CRUD | Add/Edit/Delete product modal |
| Persistent state | localStorage |
| Public deployment | Vite `dist` build |
| README | This document |
| Architecture diagram | Included above |
| GitHub repository | Repository-ready project |

## 9. Future Enhancements

For a real commercial deployment, the localStorage layer can be replaced with:
- Node.js/Express API
- PostgreSQL or MongoDB
- JWT/session authentication
- Cloud image storage
- Role-based access control
- Payment gateway
- Server-side validation and rate limiting

## 10. License

Educational capstone project. Free to modify for academic demonstration.

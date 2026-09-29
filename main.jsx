import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, Box, Check, ChevronDown, CircleUserRound, Edit3,
  LayoutDashboard, LogIn, LogOut, Menu, PackagePlus, Plus,
  Search, ShoppingBag, Trash2, X
} from "lucide-react";
import "./styles.css";

const seedProducts = [
  { id: "p-1001", name: "Aurora Wireless Headphones", category: "Audio", price: 2499, stock: 24, status: "Active", emoji: "🎧" },
  { id: "p-1002", name: "Nova Smart Watch", category: "Wearables", price: 3999, stock: 12, status: "Active", emoji: "⌚" },
  { id: "p-1003", name: "Pulse Mechanical Keyboard", category: "Accessories", price: 3199, stock: 7, status: "Active", emoji: "⌨️" },
  { id: "p-1004", name: "Orbit USB-C Hub", category: "Accessories", price: 1799, stock: 18, status: "Active", emoji: "🔌" },
  { id: "p-1005", name: "Pixel Air Lamp", category: "Home", price: 1299, stock: 4, status: "Low Stock", emoji: "💡" },
  { id: "p-1006", name: "Terra Travel Backpack", category: "Bags", price: 2199, stock: 31, status: "Active", emoji: "🎒" }
];

const money = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
});

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [user, setUser] = usePersistentState("shopsphere_user", null);
  const [products, setProducts] = usePersistentState("shopsphere_products", seedProducts);
  const [orders, setOrders] = usePersistentState("shopsphere_orders", [
    { id: "ORD-1042", customer: "Arun Kumar", amount: 4998, status: "Delivered" },
    { id: "ORD-1043", customer: "Priya S", amount: 3199, status: "Processing" },
    { id: "ORD-1044", customer: "Rahul M", amount: 2199, status: "Shipped" }
  ]);
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter(p => {
      const matchesSearch = !term || `${p.name} ${p.category}`.toLowerCase().includes(term);
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const stats = {
    products: products.length,
    stock: products.reduce((sum, p) => sum + p.stock, 0),
    low: products.filter(p => p.stock <= 5).length,
    revenue: orders.reduce((sum, o) => sum + o.amount, 0)
  };

  function login(name) {
    setUser({ name, email: `${name.toLowerCase().replace(/\s+/g, ".")}@demo.com` });
    setToast("Welcome to ShopSphere!");
  }

  function logout() {
    setUser(null);
    setPage("dashboard");
  }

  function saveProduct(product) {
    if (modal?.mode === "edit") {
      setProducts(products.map(p => p.id === product.id ? product : p));
      setToast("Product updated successfully.");
    } else {
      setProducts([{ ...product, id: `p-${Date.now()}` }, ...products]);
      setToast("Product created successfully.");
    }
    setModal(null);
  }

  function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    setProducts(products.filter(p => p.id !== id));
    setToast("Product deleted.");
  }

  if (!user) return <Login onLogin={login} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div><strong>ShopSphere</strong><span>Capstone</span></div>
        </div>

        <nav>
          <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>
            <LayoutDashboard size={18}/> Dashboard
          </button>
          <button className={page === "catalog" ? "active" : ""} onClick={() => setPage("catalog")}>
            <ShoppingBag size={18}/> Product Catalog
          </button>
          <button className={page === "orders" ? "active" : ""} onClick={() => setPage("orders")}>
            <Box size={18}/> Orders
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-user"><CircleUserRound size={32}/><div><b>{user.name}</b><small>Demo account</small></div></div>
          <button className="logout" onClick={logout}><LogOut size={17}/> Sign out</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu"><Menu size={21}/></button>
          <div>
            <p className="eyebrow">Production Capstone</p>
            <h1>{page === "dashboard" ? "Dashboard" : page === "catalog" ? "Product Catalog" : "Orders"}</h1>
          </div>
          <div className="top-actions"><span className="status-dot"></span> Local persistence</div>
        </header>

        {page === "dashboard" && (
          <Dashboard stats={stats} products={products} orders={orders} goCatalog={() => setPage("catalog")} />
        )}

        {page === "catalog" && (
          <Catalog
            products={filteredProducts}
            categories={categories}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            onAdd={() => setModal({ mode: "add" })}
            onEdit={(p) => setModal({ mode: "edit", product: p })}
            onDelete={deleteProduct}
          />
        )}

        {page === "orders" && <Orders orders={orders} setOrders={setOrders} toast={setToast} />}

        <footer>ShopSphere Capstone • Built with React + Vite • Data persists in browser localStorage</footer>
      </main>

      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          onClose={() => setModal(null)}
          onSave={saveProduct}
        />
      )}

      {toast && <div className="toast"><Check size={18}/>{toast}</div>}
    </div>
  );
}

function Login({ onLogin }) {
  const [name, setName] = useState("Kabilan");
  const [email, setEmail] = useState("kabilan@demo.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 4) {
      setError("Enter a valid name, email and 4+ character password.");
      return;
    }
    onLogin(name.trim());
  }

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="brand brand-light"><div className="brand-mark">S</div><div><strong>ShopSphere</strong><span>Production Capstone</span></div></div>
        <div className="visual-copy">
          <span className="pill">FULL-STACK WEB DEVELOPMENT</span>
          <h1>A practical commerce dashboard built for real-world workflows.</h1>
          <p>Authentication simulation, interactive catalog, CRUD operations and persistent browser state in one production-ready interface.</p>
        </div>
      </div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-icon"><LogIn size={23}/></div>
        <p className="eyebrow">Demo authentication</p>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to access your capstone dashboard.</p>
        <label>Name<input value={name} onChange={e => setName(e.target.value)} /></label>
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <div className="error">{error}</div>}
        <button className="primary wide" type="submit">Sign in <ChevronDown size={17}/></button>
        <p className="hint">This is a simulated login; no real credentials are stored.</p>
      </form>
    </div>
  );
}

function Dashboard({ stats, products, orders, goCatalog }) {
  return (
    <section className="content">
      <div className="hero">
        <div><span className="pill">OVERVIEW</span><h2>Everything in one place.</h2><p>Monitor products, stock and recent commerce activity.</p></div>
        <button className="primary" onClick={goCatalog}><PackagePlus size={18}/> Manage catalog</button>
      </div>

      <div className="stats-grid">
        <Stat icon={<ShoppingBag/>} label="Products" value={stats.products}/>
        <Stat icon={<Box/>} label="Units in stock" value={stats.stock}/>
        <Stat icon={<BarChart3/>} label="Low stock" value={stats.low} accent/>
        <Stat icon={<span className="rupee">₹</span>} label="Demo revenue" value={money.format(stats.revenue)}/>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><div><h3>Inventory snapshot</h3><p>Current catalog stock levels</p></div><button className="text-btn" onClick={goCatalog}>View all</button></div>
          <div className="inventory-list">
            {products.slice(0, 5).map(p => (
              <div className="inventory-row" key={p.id}><span className="product-icon">{p.emoji}</span><div className="grow"><b>{p.name}</b><small>{p.category}</small></div><strong className={p.stock <= 5 ? "warning-text" : ""}>{p.stock} units</strong></div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><div><h3>Recent orders</h3><p>Latest demo transactions</p></div></div>
          <div className="orders-mini">
            {orders.map(o => <div className="order-row" key={o.id}><div><b>{o.id}</b><small>{o.customer}</small></div><div className="order-right"><strong>{money.format(o.amount)}</strong><span className={`badge ${o.status.toLowerCase()}`}>{o.status}</span></div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value, accent }) {
  return <div className={`stat-card ${accent ? "accent" : ""}`}><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong></div>;
}

function Catalog({ products, categories, search, setSearch, category, setCategory, onAdd, onEdit, onDelete }) {
  return (
    <section className="content">
      <div className="page-heading"><div><span className="pill">CRUD MANAGEMENT</span><h2>Product catalog</h2><p>Create, update and delete products with persistent state.</p></div><button className="primary" onClick={onAdd}><Plus size={18}/> Add product</button></div>

      <div className="toolbar">
        <div className="search-box"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." /></div>
        <select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select>
      </div>

      <div className="catalog-grid">
        {products.map(p => (
          <article className="product-card" key={p.id}>
            <div className="product-top"><span className="large-product-icon">{p.emoji}</span><span className={`badge ${p.status === "Low Stock" ? "low" : "active"}`}>{p.status}</span></div>
            <div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><div className="product-meta"><strong>{money.format(p.price)}</strong><span>{p.stock} in stock</span></div></div>
            <div className="card-actions"><button onClick={() => onEdit(p)}><Edit3 size={16}/> Edit</button><button className="danger" onClick={() => onDelete(p.id)}><Trash2 size={16}/> Delete</button></div>
          </article>
        ))}
        {!products.length && <div className="empty"><Search size={28}/><h3>No products found</h3><p>Try a different search or add a new product.</p></div>}
      </div>
    </section>
  );
}

function Orders({ orders, setOrders, toast }) {
  function cycleStatus(id) {
    const flow = ["Processing", "Shipped", "Delivered"];
    setOrders(orders.map(o => {
      if (o.id !== id) return o;
      const next = flow[(flow.indexOf(o.status) + 1) % flow.length];
      return { ...o, status: next };
    }));
    toast("Order status updated.");
  }
  return (
    <section className="content">
      <div className="page-heading"><div><span className="pill">ORDER WORKFLOW</span><h2>Orders</h2><p>Update the simulated order lifecycle.</p></div></div>
      <div className="panel table-panel">
        <table><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{orders.map(o => <tr key={o.id}><td><b>{o.id}</b></td><td>{o.customer}</td><td>{money.format(o.amount)}</td><td><span className={`badge ${o.status.toLowerCase()}`}>{o.status}</span></td><td><button className="small-btn" onClick={() => cycleStatus(o.id)}>Next status</button></td></tr>)}</tbody></table>
      </div>
    </section>
  );
}

function ProductModal({ mode, product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: "", category: "Accessories", price: 999, stock: 10, status: "Active", emoji: "📦" });
  function update(key, value) { setForm({ ...form, [key]: value }); }
  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || Number(form.price) < 0 || Number(form.stock) < 0) return;
    onSave({ ...form, name: form.name.trim(), price: Number(form.price), stock: Number(form.stock), status: Number(form.stock) <= 5 ? "Low Stock" : "Active" });
  }
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head"><div><span className="pill">{mode === "edit" ? "UPDATE" : "CREATE"}</span><h2>{mode === "edit" ? "Edit product" : "Add product"}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X/></button></div>
        <label>Product name<input autoFocus value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Smart Speaker" /></label>
        <div className="form-grid"><label>Category<select value={form.category} onChange={e => update("category", e.target.value)}><option>Accessories</option><option>Audio</option><option>Wearables</option><option>Home</option><option>Bags</option><option>Electronics</option></select></label><label>Emoji<input value={form.emoji} onChange={e => update("emoji", e.target.value)} /></label></div>
        <div className="form-grid"><label>Price (₹)<input type="number" min="0" value={form.price} onChange={e => update("price", e.target.value)} /></label><label>Stock<input type="number" min="0" value={form.stock} onChange={e => update("stock", e.target.value)} /></label></div>
        <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" type="submit"><Check size={17}/>{mode === "edit" ? "Save changes" : "Create product"}</button></div>
      </form>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

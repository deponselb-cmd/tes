<!doctype html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Celebes - ISP SaaS Dashboard</title>
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Plus Jakarta Sans', sans-serif; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .gradient-border { background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); padding: 1px; border-radius: 12px; }
    .gradient-border > div { background: #0f172a; border-radius: 11px; }
    .sidebar-item { transition: all 0.2s; }
    .sidebar-item:hover { background: rgba(99,102,241,0.1); padding-left: 1.25rem; }
    .sidebar-item.active { background: rgba(99,102,241,0.15); border-right: 3px solid #6366f1; }
    .fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .status-online { background: #10b981; box-shadow: 0 0 8px #10b981; }
    .status-warning { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
    .status-offline { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
    .toggle-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: 0.3s; border-radius: 10px; }
    .toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: 0.3s; border-radius: 50%; }
    input:checked + .toggle-slider { background-color: #6366f1; }
    input:checked + .toggle-slider:before { transform: translateX(20px); }
    /* Light Mode */
    body.light-mode { background: #f9fafb; color: #1f2937; }
    body.light-mode .bg-\\[\\#0f1629\\] { background: #ffffff !important; border-color: #e5e7eb !important; }
    body.light-mode .bg-\\[\\#0a0e1a\\] { background: #f9fafb !important; }
    body.light-mode .border-gray-800 { border-color: #e5e7eb !important; }
    body.light-mode .text-gray-400, body.light-mode .text-gray-500 { color: #6b7280 !important; }
    body.light-mode .text-gray-300, body.light-mode .text-gray-200 { color: #374151 !important; }
    body.light-mode .bg-gray-800, body.light-mode .bg-gray-800\\/50 { background: #f3f4f6 !important; }
    body.light-mode input, body.light-mode textarea, body.light-mode select { background: #ffffff; border-color: #d1d5db; color: #1f2937; }
    body.light-mode input::placeholder, body.light-mode textarea::placeholder { color: #9ca3af; }
    body.light-mode button { color: #ffffff; }
  </style>
</head>
<body class="h-full bg-[#0a0e1a] text-gray-200 overflow-hidden">
<div id="app" class="h-full w-full flex">

<!-- SIDEBAR -->
<aside class="w-64 bg-[#0f1629] border-r border-gray-800 flex flex-col h-full shrink-0">
  <div class="p-5 border-b border-gray-800">
    <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">NetBill Pro</h1>
    <p class="text-xs text-gray-500 mt-1">ISP Management Platform</p>
  </div>
  <nav class="flex-1 py-4 overflow-y-auto">
    <div class="px-3 mb-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Main</div>
    <div class="sidebar-item active flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-indigo-300" data-page="dashboard" onclick="switchPage('dashboard')"><i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="billing" onclick="switchPage('billing')"><i data-lucide="receipt" class="w-4 h-4"></i> Billing Engine</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="network" onclick="switchPage('network')"><i data-lucide="wifi" class="w-4 h-4"></i> Network</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="mikrotik" onclick="switchPage('mikrotik')"><i data-lucide="server" class="w-4 h-4"></i> MikroTik</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="customers" onclick="switchPage('customers')"><i data-lucide="users" class="w-4 h-4"></i> Customers</div>
    <div class="px-3 mt-4 mb-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Operations</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="tickets" onclick="switchPage('tickets')"><i data-lucide="headphones" class="w-4 h-4"></i> Support</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="voucher" onclick="switchPage('voucher')"><i data-lucide="ticket" class="w-4 h-4"></i> Voucher</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="inventory" onclick="switchPage('inventory')"><i data-lucide="package" class="w-4 h-4"></i> Inventory & POS</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="whitelabel" onclick="switchPage('whitelabel')"><i data-lucide="palette" class="w-4 h-4"></i> White-Label</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="flow" onclick="switchPage('flow')"><i data-lucide="git-branch" class="w-4 h-4"></i> Workflow</div>
    <div class="px-3 mt-4 mb-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">System</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="settings" onclick="switchPage('settings')"><i data-lucide="settings" class="w-4 h-4"></i> Settings</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="users" onclick="switchPage('users')"><i data-lucide="user-cog" class="w-4 h-4"></i> Users</div>
    <div class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer text-gray-400" data-page="admin" onclick="switchPage('admin')"><i data-lucide="cpu" class="w-4 h-4"></i> Control Panel</div>
  </nav>
</aside>

<!-- MAIN -->
<main class="flex-1 overflow-y-auto h-full">
  <header class="sticky top-0 z-10 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-gray-800 px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-4"><h2 id="page-title" class="text-lg font-semibold">Dashboard</h2><span class="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Live</span></div>
    <button onclick="toggleTheme()" id="theme-btn" class="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><i data-lucide="moon" class="w-3 h-3"></i></button>
  </header>
  <div id="content-area" class="p-6 fade-in">
    <!-- Semua halaman akan dirender di sini oleh JavaScript -->
  </div>
</main>
</div>

<!-- MODALS (disembunyikan, akan dipindahkan oleh JS) -->
<div id="modal-container"></div>

<script>
// ========== STATE & DATA ==========
let customersData = JSON.parse(localStorage.getItem('customersData') || '[]');
let usersData = JSON.parse(localStorage.getItem('usersData') || '[]');
let inventoryItems = JSON.parse(localStorage.getItem('inventoryItems') || '[]');
let todaysSales = JSON.parse(localStorage.getItem('todaysSales') || '[]');
let posCart = [];
let isDarkMode = true;

// ========== TEMA ==========
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('light-mode', !isDarkMode);
  document.querySelector('#theme-btn i').setAttribute('data-lucide', isDarkMode ? 'moon' : 'sun');
  localStorage.setItem('app-theme', isDarkMode ? 'dark' : 'light');
  lucide.createIcons();
}

// ========== NOTIFIKASI ==========
function showNotification(msg, type='info') {
  const el = document.createElement('div');
  el.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-sm z-50 ${
    type==='success'?'bg-emerald-500/20 text-emerald-300':type==='error'?'bg-red-500/20 text-red-300':'bg-indigo-500/20 text-indigo-300'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ========== NAVIGASI ==========
function switchPage(page) {
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.remove('active','text-indigo-300'); el.classList.add('text-gray-400');
    if (el.dataset.page === page) { el.classList.add('active','text-indigo-300'); el.classList.remove('text-gray-400'); }
  });
  document.getElementById('page-title').textContent = {
    dashboard:'Dashboard', billing:'Billing Engine', network:'Network', mikrotik:'MikroTik',
    customers:'Customers', tickets:'Support', voucher:'Voucher', inventory:'Inventory & POS',
    whitelabel:'White-Label', flow:'Workflow', settings:'Settings', users:'Users', admin:'Control Panel'
  }[page] || page;
  document.getElementById('content-area').innerHTML = renderPage(page);
  lucide.createIcons();
  if (page === 'customers') { renderCustomersTable(); updateCustomerStats(); }
  if (page === 'users') { renderUsersTable(); updateUserStats(); }
  if (page === 'inventory') { switchInvTab('inventory'); }
  if (page === 'settings') { initSettings(); }
  if (page === 'admin') { initAdminPanel(); }
  window.scrollTo(0, 0);
}

// ========== RENDER HALAMAN ==========
function renderPage(page) {
  const pages = {
    dashboard: `<div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card-hover gradient-border"><div class="p-4"><div class="flex justify-between"><div><p class="text-[10px] uppercase text-gray-500">Monthly Revenue</p><p class="text-2xl font-bold mt-1 text-white">Rp 847.2M</p></div><div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center"><i data-lucide="trending-up" class="w-5 h-5 text-indigo-400"></i></div></div></div></div>
      <div class="card-hover gradient-border"><div class="p-4"><div class="flex justify-between"><div><p class="text-[10px] uppercase text-gray-500">Active Customers</p><p class="text-2xl font-bold mt-1 text-white">2,847</p></div><div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center"><i data-lucide="users" class="w-5 h-5 text-cyan-400"></i></div></div></div></div>
      <div class="card-hover gradient-border"><div class="p-4"><div class="flex justify-between"><div><p class="text-[10px] uppercase text-gray-500">Unpaid Invoices</p><p class="text-2xl font-bold mt-1 text-white">156</p></div><div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><i data-lucide="alert-circle" class="w-5 h-5 text-amber-400"></i></div></div></div></div>
      <div class="card-hover gradient-border"><div class="p-4"><div class="flex justify-between"><div><p class="text-[10px] uppercase text-gray-500">Isolated Users</p><p class="text-2xl font-bold mt-1 text-white">34</p></div><div class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center"><i data-lucide="shield-off" class="w-5 h-5 text-red-400"></i></div></div></div></div>
    </div>`,
    billing: `<div class="grid grid-cols-3 gap-4 mb-6"><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5"><p class="text-sm font-semibold">Auto Invoice</p><p class="text-2xl font-bold">2,847</p></div><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5"><p class="text-sm font-semibold">Payment Gateway</p><p class="text-xs">Midtrans ✓ | Xendit ✓</p></div><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5"><p class="text-sm font-semibold">Prorate Engine</p><p class="text-xs">Late fee 5%</p></div></div>`,
    network: `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">Network Topology</h3><svg class="w-full h-48" viewBox="0 0 400 180"><circle cx="200" cy="20" r="12" fill="#4f46e5"/><text x="200" y="24" text-anchor="middle" fill="white" font-size="8">ISP</text></svg></div>`,
    mikrotik: `<div class="grid grid-cols-3 gap-4 mb-6"><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5"><p class="text-xs text-gray-500">PPPoE Active</p><p class="text-2xl font-bold">1,847</p></div><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5"><p class="text-xs text-gray-500">Hotspot Users</p><p class="text-2xl font-bold">956</p></div><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-5"><p class="text-xs text-gray-500">Queue Active</p><p class="text-2xl font-bold">2,803</p></div></div>`,
    tickets: `<div class="grid grid-cols-3 gap-4"><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">Open Tickets</p><p class="text-xl font-bold">23</p></div><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">Avg Resolution</p><p class="text-xl font-bold">4.2h</p></div><div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">WhatsApp Bot</p><p class="text-xl font-bold text-emerald-400">Active</p></div></div>`,
    voucher: `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><div class="flex justify-between items-center mb-4"><h3 class="text-sm font-semibold">Voucher Editor & Print</h3><button onclick="printVouchers()" class="text-[10px] bg-indigo-500 text-white px-3 py-1.5 rounded-lg">🖨 Print Unlimited</button></div><div class="grid grid-cols-2 gap-4 mb-4"><div><label class="text-[10px] text-gray-500 block mb-1">Profile</label><select id="voucher-profile" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><option>Hotspot 3 Jam - Rp 5,000</option></select></div><div><label class="text-[10px] text-gray-500 block mb-1">Qty</label><input type="number" id="voucher-qty" value="30" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"></div></div><div id="voucher-grid" class="grid grid-cols-5 gap-2"></div></div>`,
    whitelabel: `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">White-Label Configuration</h3><div class="grid grid-cols-2 gap-6"><div><label class="text-[10px] text-gray-500 block mb-1">Custom Domain</label><input type="text" value="billing.myisp.co.id" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"></div><div><label class="text-[10px] text-gray-500 block mb-1">Primary Color</label><input type="color" value="#6366f1" class="w-10 h-8 rounded"></div></div></div>`,
    flow: `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">ISP Onboarding Workflow</h3><div class="flex items-center justify-center gap-4 flex-wrap py-4"><div class="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center"><i data-lucide="user-plus" class="w-6 h-6 text-indigo-400"></i></div><div class="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center"><i data-lucide="settings" class="w-6 h-6 text-purple-400"></i></div><div class="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center"><i data-lucide="server" class="w-6 h-6 text-cyan-400"></i></div></div></div>`,
    customers: `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><div class="flex justify-between items-center mb-4"><h3 class="text-sm font-semibold">Customer Management</h3><div class="flex gap-2"><button onclick="showAddCustomerModal()" class="text-[10px] bg-indigo-500 text-white px-3 py-1.5 rounded-lg">+ Add Customer</button><button onclick="exportCustomersCSV()" class="text-[10px] bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg">📤 Export CSV</button></div></div><div class="grid grid-cols-4 gap-3 mb-4"><div class="bg-gray-800/50 rounded-lg p-3 text-center"><p class="text-lg font-bold" id="cust-total">0</p><p class="text-[10px] text-gray-500">Total</p></div><div class="bg-emerald-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-emerald-400" id="cust-active">0</p></div><div class="bg-red-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-red-400" id="cust-isolated">0</p></div><div class="bg-amber-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-amber-400" id="cust-pending">0</p></div></div><table class="w-full text-xs"><thead><tr class="text-gray-500 border-b border-gray-800"><th class="text-left py-2 px-2">Name</th><th class="text-left py-2 px-2">Plan</th><th class="text-left py-2 px-2">PPPoE</th><th class="text-left py-2 px-2">Status</th><th class="text-left py-2 px-2">Phone</th><th class="text-right py-2 px-2">Start Date</th><th class="text-center py-2 px-2">Actions</th></tr></thead><tbody id="customers-tbody"></tbody></table></div>`,
    inventory: `<div class="flex gap-2 mb-4"><button onclick="switchInvTab('inventory')" class="inv-tab-btn active bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg text-sm" data-tab="inventory">📦 Inventory</button><button onclick="switchInvTab('pos')" class="inv-tab-btn bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm" data-tab="pos">🛒 POS</button></div><div id="inv-inventory-tab" class="space-y-4">${inventoryTabHTML()}</div><div id="inv-pos-tab" class="hidden space-y-4">${posTabHTML()}</div>`,
    settings: settingsHTML(),
    users: usersHTML(),
    admin: adminPanelHTML()
  };
  return pages[page] || '';
}

// ========== INVENTORY TAB HTML ==========
function inventoryTabHTML() {
  return `<div class="grid grid-cols-4 gap-4 mb-6">
      <div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">Total Items</p><p class="text-2xl font-bold" id="inv-total-items">0</p></div>
      <div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">Total Value</p><p class="text-2xl font-bold text-emerald-400" id="inv-total-value">Rp 0</p></div>
      <div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">Low Stock</p><p class="text-2xl font-bold text-amber-400" id="inv-low-stock">0</p></div>
      <div class="card-hover bg-[#0f1629] rounded-xl border border-gray-800 p-4"><p class="text-[10px] text-gray-500">Sales Today</p><p class="text-2xl font-bold text-cyan-400" id="inv-sales-today">Rp 0</p></div></div>
    <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5 mb-6"><h3 class="text-sm font-semibold mb-4">Add New Item</h3>
      <div class="grid grid-cols-5 gap-3"><input type="text" id="inv-item-name" placeholder="Item Name" class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><input type="text" id="inv-sku" placeholder="SKU" class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><select id="inv-category" class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><option>Hardware</option><option>Cable</option><option>Accessories</option></select><input type="number" id="inv-unit-price" placeholder="Unit Price" class="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" step="1000"><div class="flex gap-2"><input type="number" id="inv-quantity" placeholder="Qty" class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><button onclick="addInventoryItem()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs">+ Add</button></div></div></div>
    <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><div class="flex justify-between items-center mb-4"><h3 class="text-sm font-semibold">Inventory Items</h3><div class="flex gap-2"><input type="file" id="import-inventory-file" accept=".csv" class="hidden" onchange="importInventoryCSV(this.files[0])"><button onclick="document.getElementById('import-inventory-file').click()" class="text-[10px] bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg">📥 Import</button><button onclick="exportInventoryCSV()" class="text-[10px] bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg">📤 Export</button></div></div><table class="w-full text-xs"><thead><tr class="text-gray-500 border-b border-gray-800"><th class="text-left py-2 px-2">Item Name</th><th class="text-left py-2 px-2">SKU</th><th class="text-left py-2 px-2">Category</th><th class="text-right py-2 px-2">Stock</th><th class="text-right py-2 px-2">Unit Price</th><th class="text-right py-2 px-2">Total Value</th><th class="text-center py-2 px-2">Status</th><th class="text-center py-2 px-2">Action</th></tr></thead><tbody id="inv-items-tbody"></tbody></table></div>`;
}

function posTabHTML() {
  return `<div class="grid grid-cols-4 gap-4">
    <div class="col-span-2 bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">Products</h3><div class="space-y-2 max-h-96 overflow-y-auto" id="pos-products-list"></div></div>
    <div class="col-span-2 space-y-4">
      <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">Shopping Cart</h3><div class="space-y-2 max-h-64 overflow-y-auto mb-4" id="pos-cart-items"><p class="text-xs text-gray-500 text-center py-4">Cart is empty</p></div>
        <div class="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div class="flex justify-between text-xs"><span>Subtotal:</span><span id="pos-subtotal">Rp 0</span></div>
          <div class="flex justify-between text-xs"><span>Discount:</span><input type="number" id="pos-discount" placeholder="0" class="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white" onchange="calculatePOSTotal()"></div>
          <div class="border-t border-gray-700 pt-2 flex justify-between text-sm font-bold"><span>Total:</span><span id="pos-total" class="text-emerald-400">Rp 0</span></div>
        </div>
      </div>
      <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-xs font-semibold mb-3 uppercase text-gray-500">Payment Method</h3><div class="space-y-2"><label class="flex items-center gap-2"><input type="radio" name="payment-method" value="cash" checked> 💵 Cash</label><label class="flex items-center gap-2"><input type="radio" name="payment-method" value="card"> 💳 Card</label></div></div>
      <div class="flex gap-2"><button onclick="clearPOSCart()" class="flex-1 px-4 py-2 bg-red-600/20 text-red-300 rounded-lg text-xs">🗑️ Clear</button><button onclick="completePOSSale()" class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs">✓ Complete Sale</button></div>
    </div>
  </div>
  <div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5 mt-6"><h3 class="text-sm font-semibold mb-4">Today's Sales</h3><table class="w-full text-xs"><thead><tr class="text-gray-500 border-b border-gray-800"><th class="text-left py-2 px-2">Sale ID</th><th class="text-left py-2 px-2">Time</th><th class="text-right py-2 px-2">Amount</th><th class="text-left py-2 px-2">Method</th><th class="text-center py-2 px-2">Receipt</th></tr></thead><tbody id="pos-sales-tbody"></tbody></table></div>`;
}

// ========== USERS HTML ==========
function usersHTML() {
  return `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><div class="flex justify-between items-center mb-4"><h3 class="text-sm font-semibold">User Management</h3><div class="flex gap-2"><button onclick="showAddUserModal()" class="text-[10px] bg-indigo-500 text-white px-3 py-1.5 rounded-lg">+ Add User</button><button onclick="exportUsersCSV()" class="text-[10px] bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg">📤 Export CSV</button></div></div>
    <div class="grid grid-cols-4 gap-3 mb-4"><div class="bg-gray-800/50 rounded-lg p-3 text-center"><p class="text-lg font-bold" id="user-total">0</p></div><div class="bg-emerald-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-emerald-400" id="user-active">0</p></div><div class="bg-red-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-red-400" id="user-inactive">0</p></div><div class="bg-indigo-500/10 rounded-lg p-3 text-center"><p class="text-lg font-bold text-indigo-400" id="user-admin">0</p></div></div>
    <table class="w-full text-xs"><thead><tr class="text-gray-500 border-b border-gray-800"><th class="text-left py-2 px-2">Name</th><th class="text-left py-2 px-2">Email</th><th class="text-left py-2 px-2">Role</th><th class="text-center py-2 px-2">Status</th><th class="text-right py-2 px-2">Last Login</th><th class="text-center py-2 px-2">Actions</th></tr></thead><tbody id="users-tbody"></tbody></table></div>`;
}

// ========== SETTINGS HTML (ringkas dengan placeholder) ==========
function settingsHTML() {
  return `<div class="grid grid-cols-3 gap-6"><div class="col-span-1"><div class="bg-[#0f1629] rounded-xl border border-gray-800 p-4"><div class="space-y-1">`+
    ['general','billing','security','email','api','backup'].map(tab =>
      `<button onclick="switchSettingsTab('${tab}')" class="settings-tab w-full text-left px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 ${tab==='general'?'bg-indigo-500/20 text-indigo-300':'text-gray-400 hover:bg-gray-800/50'}" data-tab="${tab}"><i data-lucide="${tab==='general'?'sliders-horizontal':tab==='billing'?'credit-card':tab==='security'?'shield':tab==='email'?'mail':tab==='api'?'code':'hard-drive'}" class="w-4 h-4"></i> ${tab==='general'?'General':'Billing Settings'}</button>`
    ).join('')+
    `</div></div></div><div class="col-span-2">`+
    settingsPanelsHTML()+
    `</div></div>`;
}

function settingsPanelsHTML() {
  return `
    <div id="settings-general" class="settings-panel bg-[#0f1629] rounded-xl border border-gray-800 p-6"><h3 class="text-lg font-bold mb-6">General Settings</h3>
      <div class="space-y-5"><div><label class="text-sm text-gray-300 block mb-2">Platform Name</label><input type="text" id="platform_name" value="NetBill Pro" placeholder="Enter platform name" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"></div>
      <div><label class="text-sm text-gray-300 block mb-2">Support Email</label><input type="email" id="support_email" value="support@netbill.co.id" placeholder="e.g. support@isp.com" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"></div>
      <div class="flex gap-3 pt-4"><button onclick="saveGeneralSettings()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Save Changes</button><button onclick="resetGeneralSettings()" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Cancel</button></div></div></div>
    <div id="settings-billing" class="settings-panel hidden bg-[#0f1629] rounded-xl border border-gray-800 p-6"><h3 class="text-lg font-bold mb-6">Billing Settings</h3><div class="space-y-5"><div class="grid grid-cols-2 gap-4"><div><label class="text-sm text-gray-300 block mb-2">Invoice Due Days</label><input type="number" id="invoice_due_days" value="14" placeholder="e.g. 14" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"></div><div><label class="text-sm text-gray-300 block mb-2">Late Fee (%)</label><input type="number" id="late_fee" value="5" step="0.1" placeholder="e.g. 5.0" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"></div></div><div class="flex gap-3 pt-4"><button onclick="saveBillingSettings()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Save Changes</button><button onclick="resetBillingSettings()" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Cancel</button></div></div></div>
    <div id="settings-security" class="settings-panel hidden bg-[#0f1629] rounded-xl border border-gray-800 p-6"><h3 class="text-lg font-bold mb-6">Security Settings</h3><div class="space-y-5"><div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"><div><p class="text-sm font-medium">Two-Factor Authentication (2FA)</p></div><label class="toggle-switch"><input type="checkbox" id="twofa_enabled" checked><span class="toggle-slider"></span></label></div><div class="flex gap-3 pt-4"><button onclick="saveSecuritySettings()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Save Changes</button><button class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">Cancel</button></div></div></div>
    <div id="settings-api" class="settings-panel hidden bg-[#0f1629] rounded-xl border border-gray-800 p-6"><h3 class="text-lg font-bold mb-6">API Keys</h3><div class="space-y-4"><div class="p-4 bg-gray-800/50 rounded-lg"><div class="flex justify-between items-start mb-2"><div><p class="text-sm font-medium">Midtrans API Key</p></div><span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Connected</span></div><div class="flex items-center gap-2"><input type="password" id="midtrans_key" value="sk_live_xxxxxxxxxxxxx" class="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-xs text-white"><button onclick="copyToClipboard('midtrans_key')" class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs">Copy</button></div></div></div></div>
    <div id="settings-backup" class="settings-panel hidden bg-[#0f1629] rounded-xl border border-gray-800 p-6"><h3 class="text-lg font-bold mb-6">Backup & Restore</h3><div class="space-y-4"><div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"><p class="text-sm text-emerald-300"><strong>Last Backup:</strong> Today, 02:15 AM</p></div><div class="grid grid-cols-2 gap-3"><button onclick="exportAllData()" class="p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/30 transition text-center"><i data-lucide="download" class="w-5 h-5 text-indigo-400 mx-auto mb-2"></i><p class="text-sm text-indigo-300">Export All Data</p></button><button onclick="document.getElementById('import-backup-file').click()" class="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition text-center"><input type="file" id="import-backup-file" accept=".json" class="hidden" onchange="importAllData(this.files[0])"><i data-lucide="upload" class="w-5 h-5 text-purple-400 mx-auto mb-2"></i><p class="text-sm text-purple-300">Import Backup</p></button></div></div></div>`;
}

// ========== ADMIN PANEL HTML ==========
function adminPanelHTML() {
  return `<div class="space-y-6"><div class="grid grid-cols-3 gap-4"><div class="col-span-2 bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">Server Information</h3><div class="grid grid-cols-2 gap-3 text-xs"><div class="flex justify-between border-b border-gray-800 py-1.5"><span class="text-gray-400">Laravel Version</span><span class="text-white font-medium">10.0</span></div><div class="flex justify-between border-b border-gray-800 py-1.5"><span class="text-gray-400">PHP Version</span><span class="text-white font-medium">8.2.4</span></div></div></div><div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">Resource Usage</h3><p class="text-xs text-gray-400">Memory: 64 MB</p></div></div><div class="bg-[#0f1629] rounded-xl border border-gray-800 p-5"><h3 class="text-sm font-semibold mb-4">Cache & Maintenance</h3><div class="grid grid-cols-3 gap-3">${['clear-cache','clear-route','clear-config','clear-view','clear-compiled','restart-queue'].map(a=>`<button onclick="performAdminAction('${a}')" class="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 text-left"><p class="text-xs font-medium">${a.replace(/-/g,' ')}</p><p class="text-[10px] text-gray-500 mt-1">${a}</p></button>`).join('')}</div></div></div>`;
}

// ========== INISIALISASI ==========
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('app-theme') === 'light') {
    isDarkMode = false;
    document.body.classList.add('light-mode');
    document.querySelector('#theme-btn i').setAttribute('data-lucide', 'sun');
  }
  switchPage('dashboard');
  lucide.createIcons();
});

// ========== FUNGSI CRUD CUSTOMERS ==========
function showAddCustomerModal() {
  const modal = document.createElement('div');
  modal.id = 'add-customer-modal';
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.innerHTML = `<div class="bg-[#0f1629] rounded-xl border border-gray-800 p-6 w-full max-w-2xl"><h3 class="text-lg font-bold mb-4">Add Customer</h3><form id="customer-form" onsubmit="return false"><input type="hidden" id="customer-id"><div class="grid grid-cols-2 gap-4 mb-5"><div><label class="text-xs text-gray-400 block mb-1">Full Name *</label><input type="text" id="cust-fullname" placeholder="John Doe" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required></div><div><label class="text-xs text-gray-400 block mb-1">Phone *</label><input type="tel" id="cust-phone" placeholder="+62 8XX" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required></div><div><label class="text-xs text-gray-400 block mb-1">Plan *</label><select id="cust-plan" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white" required><option value="">Select Plan</option><option value="Basic 10 Mbps">Basic 10 Mbps</option><option value="Standard 30 Mbps">Standard 30 Mbps</option><option value="Premium 50 Mbps">Premium 50 Mbps</option></select></div><div><label class="text-xs text-gray-400 block mb-1">Status</label><select id="cust-status" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"><option value="active">Active</option><option value="isolated">Isolated</option><option value="pending">Pending</option></select></div></div><div class="mb-4"><label class="text-xs text-gray-400 block mb-1">Address</label><textarea id="cust-address" placeholder="Full address" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white h-20"></textarea></div><div class="flex gap-2"><button onclick="saveCustomer()" class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs">Save Customer</button><button onclick="document.getElementById('add-customer-modal').remove()" class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs">Cancel</button></div></form></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function saveCustomer() {
  const data = {
    id: document.getElementById('customer-id').value || 'cust-' + Date.now(),
    name: document.getElementById('cust-fullname').value,
    phone: document.getElementById('cust-phone').value,
    plan: document.getElementById('cust-plan').value,
    status: document.getElementById('cust-status').value,
    address: document.getElementById('cust-address').value,
    pppoe: 'pppoe-' + document.getElementById('cust-fullname').value.toLowerCase().replace(/\s/g,''),
    start_date: new Date().toISOString().split('T')[0]
  };
  const existing = customersData.findIndex(c => c.id === data.id);
  if (existing !== -1) customersData[existing] = data;
  else customersData.push(data);
  localStorage.setItem('customersData', JSON.stringify(customersData));
  document.getElementById('add-customer-modal').remove();
  renderCustomersTable();
  updateCustomerStats();
  showNotification('Customer saved', 'success');
}

function renderCustomersTable() {
  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;
  tbody.innerHTML = customersData.length ? '' : '<tr><td colspan="7" class="text-center py-4 text-gray-500">No customers</td></tr>';
  customersData.forEach(c => {
    const badge = c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : (c.status === 'isolated' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300');
    tbody.innerHTML += `<tr class="border-b border-gray-800/50"><td class="py-2.5 px-2">${c.name}</td><td class="py-2.5 px-2">${c.plan}</td><td class="py-2.5 px-2 text-gray-400">${c.pppoe||'-'}</td><td class="py-2.5 px-2"><span class="${badge} px-2 py-0.5 rounded text-[10px]">${c.status}</span></td><td class="py-2.5 px-2 text-gray-400">${c.phone}</td><td class="py-2.5 px-2 text-right text-gray-400">${c.start_date||'-'}</td><td class="py-2.5 px-2 text-center"><button onclick="editCustomer('${c.id}')" class="text-indigo-400 text-xs mr-2">✏️</button><button onclick="deleteCustomer('${c.id}')" class="text-red-400 text-xs">🗑️</button></td></tr>`;
  });
}

function updateCustomerStats() {
  document.getElementById('cust-total').textContent = customersData.length;
  document.getElementById('cust-active').textContent = customersData.filter(c=>c.status==='active').length;
  document.getElementById('cust-isolated').textContent = customersData.filter(c=>c.status==='isolated').length;
  document.getElementById('cust-pending').textContent = customersData.filter(c=>c.status==='pending').length;
}

function editCustomer(id) {
  const c = customersData.find(c => c.id === id);
  if (!c) return;
  showAddCustomerModal();
  document.getElementById('customer-id').value = c.id;
  document.getElementById('cust-fullname').value = c.name;
  document.getElementById('cust-phone').value = c.phone;
  document.getElementById('cust-plan').value = c.plan;
  document.getElementById('cust-status').value = c.status;
  document.getElementById('cust-address').value = c.address || '';
}

function deleteCustomer(id) {
  if (!confirm('Delete?')) return;
  customersData = customersData.filter(c => c.id !== id);
  localStorage.setItem('customersData', JSON.stringify(customersData));
  renderCustomersTable();
  updateCustomerStats();
  showNotification('Customer deleted', 'success');
}

function exportCustomersCSV() {
  let csv = 'Name,Phone,Plan,Status,PPPoE,Start Date\n';
  customersData.forEach(c => csv += `"${c.name}","${c.phone}","${c.plan}","${c.status}","${c.pppoe||''}","${c.start_date||''}"\n`);
  downloadBlob(csv, 'customers.csv', 'text/csv');
}

// ========== CRUD USERS (mirip) ==========
function showAddUserModal() { /* serupa dengan customer modal */ }
function saveUser() { /* ... */ }
function renderUsersTable() { /* ... */ }
function updateUserStats() { /* ... */ }
function editUser(id) { /* ... */ }
function deleteUser(id) { /* ... */ }
function exportUsersCSV() { /* ... */ }

// ========== INVENTORY CRUD ==========
function addInventoryItem() {
  const item = {
    id: 'item-' + Date.now(),
    item_name: document.getElementById('inv-item-name').value,
    sku: document.getElementById('inv-sku').value,
    category: document.getElementById('inv-category').value,
    quantity: parseInt(document.getElementById('inv-quantity').value) || 0,
    unit_price: parseFloat(document.getElementById('inv-unit-price').value) || 0
  };
  inventoryItems.push(item);
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
  renderInventoryTable();
  updateInventoryStats();
  showNotification('Item added', 'success');
}

function renderInventoryTable() {
  const tbody = document.getElementById('inv-items-tbody');
  if (!tbody) return;
  tbody.innerHTML = inventoryItems.map(i => `<tr class="border-b border-gray-800/50"><td class="py-2.5 px-2">${i.item_name}</td><td class="py-2.5 px-2 text-gray-400">${i.sku}</td><td class="py-2.5 px-2 text-gray-400">${i.category}</td><td class="py-2.5 px-2 text-right">${i.quantity}</td><td class="py-2.5 px-2 text-right">Rp ${i.unit_price.toLocaleString('id-ID')}</td><td class="py-2.5 px-2 text-right">Rp ${(i.quantity * i.unit_price).toLocaleString('id-ID')}</td><td class="py-2.5 px-2 text-center"><span class="${i.quantity <= 10 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'} px-2 py-0.5 rounded text-[10px]">${i.quantity <= 10 ? '⚠ Low' : '✓ OK'}</span></td><td class="py-2.5 px-2 text-center"><button onclick="deleteInventoryItem('${i.id}')" class="text-red-400 text-xs">🗑️</button></td></tr>`).join('');
}

function updateInventoryStats() {
  document.getElementById('inv-total-items').textContent = inventoryItems.length;
  const totalValue = inventoryItems.reduce((s,i)=> s + i.quantity * i.unit_price, 0);
  document.getElementById('inv-total-value').textContent = 'Rp ' + totalValue.toLocaleString('id-ID');
  document.getElementById('inv-low-stock').textContent = inventoryItems.filter(i=>i.quantity<=10).length;
  document.getElementById('inv-sales-today').textContent = 'Rp ' + todaysSales.reduce((s,sale)=> s + sale.total, 0).toLocaleString('id-ID');
}

function deleteInventoryItem(id) {
  if (!confirm('Delete?')) return;
  inventoryItems = inventoryItems.filter(i => i.id !== id);
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
  renderInventoryTable();
  updateInventoryStats();
}

function exportInventoryCSV() {
  let csv = 'Item Name,SKU,Category,Quantity,Unit Price\n';
  inventoryItems.forEach(i => csv += `"${i.item_name}","${i.sku}","${i.category}",${i.quantity},${i.unit_price}\n`);
  downloadBlob(csv, 'inventory.csv', 'text/csv');
}

function importInventoryCSV(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const rows = e.target.result.split('\n').slice(1);
    rows.forEach(row => {
      const [name, sku, cat, qty, price] = row.split(',');
      if (name && sku) inventoryItems.push({ id: 'item-'+Date.now(), item_name: name.replace(/"/g,''), sku: sku.replace(/"/g,''), category: cat||'Hardware', quantity: parseInt(qty)||0, unit_price: parseFloat(price)||0 });
    });
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
    renderInventoryTable();
    updateInventoryStats();
    showNotification('Imported', 'success');
  };
  reader.readAsText(file);
}

// ========== POS ==========
function switchInvTab(tab) {
  document.getElementById('inv-inventory-tab').classList.toggle('hidden', tab !== 'inventory');
  document.getElementById('inv-pos-tab').classList.toggle('hidden', tab !== 'pos');
  document.querySelectorAll('.inv-tab-btn').forEach(b => b.classList.toggle('bg-indigo-500/20', b.dataset.tab === tab));
  if (tab === 'pos') renderPOSProducts();
}

function renderPOSProducts() {
  const container = document.getElementById('pos-products-list');
  container.innerHTML = inventoryItems.filter(i=>i.quantity>0).map(i => `<div onclick="addToCart('${i.id}')" class="p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 border border-gray-700"><p class="text-xs font-medium text-white">${i.item_name}</p><p class="text-sm font-bold text-emerald-400">Rp ${i.unit_price.toLocaleString('id-ID')}</p></div>`).join('');
}

function addToCart(itemId) {
  const item = inventoryItems.find(i => i.id === itemId);
  if (!item) return;
  const existing = posCart.find(i => i.id === itemId);
  if (existing) { if (existing.qty < item.quantity) existing.qty++; }
  else posCart.push({ ...item, qty: 1 });
  renderPOSCart();
  calculatePOSTotal();
}

function renderPOSCart() {
  const container = document.getElementById('pos-cart-items');
  container.innerHTML = posCart.length ? posCart.map((item,idx) => `<div class="p-2 bg-gray-800/50 rounded-lg flex justify-between items-center"><div><p class="text-xs font-medium text-white">${item.item_name}</p><p class="text-[10px] text-gray-500">Rp ${item.unit_price.toLocaleString('id-ID')} × <input type="number" value="${item.qty}" min="1" max="${item.quantity}" class="w-10 bg-gray-700 border border-gray-600 rounded px-1 py-0.5 text-[10px] text-white" onchange="updateCartQty(${idx}, this.value)"></p></div><div class="text-right"><p class="text-xs font-bold text-cyan-400">Rp ${(item.unit_price * item.qty).toLocaleString('id-ID')}</p></div><button onclick="removeFromCart(${idx})" class="text-red-400 text-xs">✕</button></div>`).join('') : '<p class="text-xs text-gray-500 text-center py-4">Cart is empty</p>';
}

function updateCartQty(idx, qty) { posCart[idx].qty = parseInt(qty) || 1; renderPOSCart(); calculatePOSTotal(); }
function removeFromCart(idx) { posCart.splice(idx,1); renderPOSCart(); calculatePOSTotal(); }
function calculatePOSTotal() {
  const subtotal = posCart.reduce((s,i) => s + i.unit_price * i.qty, 0);
  const discount = parseFloat(document.getElementById('pos-discount').value) || 0;
  const total = Math.max(0, subtotal - discount);
  document.getElementById('pos-subtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
  document.getElementById('pos-total').textContent = 'Rp ' + total.toLocaleString('id-ID');
}
function clearPOSCart() { posCart = []; renderPOSCart(); calculatePOSTotal(); }
function completePOSSale() {
  if (!posCart.length) return showNotification('Cart empty', 'error');
  const discount = parseFloat(document.getElementById('pos-discount').value)||0;
  const subtotal = posCart.reduce((s,i)=>s+i.unit_price*i.qty,0);
  const total = Math.max(0, subtotal - discount);
  const method = document.querySelector('input[name="payment-method"]:checked').value;
  const sale = { id: 'sale-'+Date.now(), sale_id: 'SALE-'+Date.now().toString().slice(-8), time: new Date().toLocaleTimeString('id-ID'), total, method, discount };
  todaysSales.unshift(sale);
  // Kurangi stok
  posCart.forEach(ci => {
    const item = inventoryItems.find(i => i.id === ci.id);
    if (item) item.quantity -= ci.qty;
  });
  localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
  localStorage.setItem('todaysSales', JSON.stringify(todaysSales));
  posCart = [];
  renderPOSCart();
  renderPOSProducts();
  updateInventoryStats();
  renderSalesHistory();
  showNotification('Sale completed!', 'success');
}

function renderSalesHistory() {
  const tbody = document.getElementById('pos-sales-tbody');
  if (!tbody) return;
  tbody.innerHTML = todaysSales.map(s => `<tr class="border-b border-gray-800/50"><td class="py-2.5 px-2">${s.sale_id}</td><td class="py-2.5 px-2 text-gray-400">${s.time}</td><td class="py-2.5 px-2 text-right text-emerald-400 font-medium">Rp ${s.total.toLocaleString('id-ID')}</td><td class="py-2.5 px-2"><span class="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">${s.method}</span></td><td class="py-2.5 px-2 text-center"><button onclick="printReceipt('${s.sale_id}')" class="text-cyan-400 text-xs">🖨 Print</button></td></tr>`).join('');
}

function printReceipt(saleId) {
  const sale = todaysSales.find(s => s.sale_id === saleId);
  if (!sale) return;
  const w = window.open('','','width=400,height=600');
  w.document.write(`<html><body><h3>Receipt</h3><p>${sale.sale_id}</p><p>Total: Rp ${sale.total.toLocaleString('id-ID')}</p></body></html>`);
  w.document.close();
  w.print();
}

// ========== VOUCHER PRINT ==========
function printVouchers() {
  const profile = document.getElementById('voucher-profile')?.value || 'Hotspot 3 Jam - Rp 5,000';
  const qty = parseInt(document.getElementById('voucher-qty')?.value) || 30;
  let html = '<html><head><style>body{font-family:Arial;padding:20px}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.voucher{border:2px solid #333;border-radius:8px;padding:12px;text-align:center;page-break-inside:avoid;background:#f9f9f9}.code{font-size:12px;font-weight:bold;font-family:monospace;color:#4f46e5}</style></head><body><h2>Voucher Print</h2><p>'+profile+'</p><div class="grid">';
  for (let i=0;i<qty;i++) html += `<div class="voucher"><div class="code">${Math.random().toString(36).substring(2,8).toUpperCase()}</div><div>${profile.split(' - ')[0]}</div></div>`;
  html += '</div></body></html>';
  const w = window.open('','','width=1200,height=800');
  w.document.write(html); w.document.close(); w.print();
}

// ========== SETTINGS ==========
function switchSettingsTab(tab) {
  document.querySelectorAll('.settings-panel').forEach(el => el.classList.add('hidden'));
  const panel = document.getElementById('settings-' + tab);
  if (panel) panel.classList.remove('hidden');
  document.querySelectorAll('.settings-tab').forEach(btn => {
    btn.classList.remove('bg-indigo-500/20','text-indigo-300');
    btn.classList.add('text-gray-400','hover:bg-gray-800/50');
    if (btn.dataset.tab === tab) { btn.classList.add('bg-indigo-500/20','text-indigo-300'); btn.classList.remove('text-gray-400','hover:bg-gray-800/50'); }
  });
}
function initSettings() { /* load saved settings */ }
function saveGeneralSettings() {
  const data = { platform_name: document.getElementById('platform_name').value, support_email: document.getElementById('support_email').value };
  localStorage.setItem('general_settings', JSON.stringify(data));
  showNotification('General settings saved', 'success');
}
function resetGeneralSettings() {
  const saved = JSON.parse(localStorage.getItem('general_settings')||'{}');
  document.getElementById('platform_name').value = saved.platform_name || 'NetBill Pro';
  document.getElementById('support_email').value = saved.support_email || '';
}
function saveBillingSettings() { /* similar */ }
function saveSecuritySettings() { /* similar */ }
function exportAllData() {
  const allData = { customers: customersData, users: usersData, inventory: inventoryItems, sales: todaysSales, settings: { general: JSON.parse(localStorage.getItem('general_settings')||'{}') } };
  downloadBlob(JSON.stringify(allData,null,2), `backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  showNotification('Backup exported', 'success');
}
function importAllData(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.customers) { customersData = data.customers; localStorage.setItem('customersData', JSON.stringify(customersData)); }
      if (data.users) { usersData = data.users; localStorage.setItem('usersData', JSON.stringify(usersData)); }
      if (data.inventory) { inventoryItems = data.inventory; localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems)); }
      if (data.settings?.general) localStorage.setItem('general_settings', JSON.stringify(data.settings.general));
      showNotification('Backup imported', 'success');
      switchPage('settings'); // refresh view
    } catch { showNotification('Invalid file', 'error'); }
  };
  reader.readAsText(file);
}
function copyToClipboard(id) {
  const input = document.getElementById(id);
  input.type = 'text';
  input.select();
  document.execCommand('copy');
  input.type = 'password';
  showNotification('Copied!', 'success');
}

// ========== ADMIN PANEL ==========
function performAdminAction(action) {
  if (!confirm('Run '+action+'?')) return;
  showNotification(`Executed: ${action}`, 'success');
}

// ========== HELPER ==========
function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
</script>
</body>
</html>

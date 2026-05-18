<aside class="w-64 bg-[#0f1629] border-r border-gray-800 flex flex-col h-full shrink-0">
    <div class="p-5 border-b border-gray-800">
        <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">NetBill Pro</h1>
        <p class="text-xs text-gray-500 mt-1">ISP Management Platform</p>
    </div>
    <nav class="flex-1 py-4 overflow-y-auto">
        <div class="px-3 mb-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Main</div>
        <a href="{{ route('dashboard') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('dashboard') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard
        </a>
        <a href="{{ route('billing') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('billing*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="receipt" class="w-4 h-4"></i> Billing Engine
        </a>
        <a href="{{ route('mikrotik.routers') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('mikrotik*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="server" class="w-4 h-4"></i> MikroTik
        </a>
        <a href="{{ route('customers.index') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('customers*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="users" class="w-4 h-4"></i> Customers
        </a>
        <div class="px-3 mt-4 mb-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Operations</div>
        <a href="{{ route('tickets') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('tickets*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="headphones" class="w-4 h-4"></i> Support
        </a>
        <a href="{{ route('voucher') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('voucher*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="ticket" class="w-4 h-4"></i> Voucher
        </a>
        <a href="{{ route('inventory.index') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('inventory*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="package" class="w-4 h-4"></i> Inventory & POS
        </a>
        <a href="{{ route('whitelabel') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('whitelabel*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="palette" class="w-4 h-4"></i> White-Label
        </a>
        <div class="px-3 mt-4 mb-2 text-[10px] uppercase tracking-wider text-gray-600 font-semibold">System</div>
        <a href="{{ route('settings.index') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('settings*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="settings" class="w-4 h-4"></i> Settings
        </a>
        <a href="{{ route('users.index') }}" class="sidebar-item flex items-center gap-3 px-4 py-2.5 text-sm {{ request()->routeIs('users*') ? 'active text-indigo-300' : 'text-gray-400' }}">
            <i data-lucide="user-cog" class="w-4 h-4"></i> Users
        </a>
    </nav>
    <div class="p-4 border-t border-gray-800">
        <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">SA</div>
            <div>
                <div class="text-xs font-medium">SuperAdmin</div>
                <div class="text-[10px] text-gray-500">admin@isp.net</div>
            </div>
        </div>
    </div>
</aside>
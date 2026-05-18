<header class="sticky top-0 z-10 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-gray-800 px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-4">
        <h2 id="page-title" class="text-lg font-semibold">@yield('page-title', 'Dashboard')</h2>
        <span class="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Live</span>
    </div>
    <div class="flex items-center gap-3">
        <div class="relative"><i data-lucide="bell" class="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition"></i><span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span></div>
        <div class="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full status-online"></span> 12 Routers Online</div>
        <button type="button" onclick="toggleTheme()" id="theme-btn" class="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><i data-lucide="moon" class="w-3 h-3"></i></button>
    </div>
</header>
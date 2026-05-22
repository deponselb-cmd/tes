export default function Header() {
  return (
    <header className="flex-shrink-0 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-light dark:bg-background-dark z-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-slate-500 dark:text-[#9eb7a8] mt-1 text-sm">Overview of your financial performance</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center bg-white dark:bg-surface-dark rounded-full px-4 py-2.5 border border-slate-200 dark:border-[#2a3f33] w-64 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
          <input 
            className="bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-gray-400 focus:ring-0 w-full ml-2" 
            placeholder="Search..." 
            type="text" 
          />
        </div>
        
        {/* Month Picker */}
        <div className="relative">
          <select className="appearance-none bg-primary text-slate-900 font-semibold text-sm rounded-full pl-5 pr-10 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:ring-offset-background-dark hover:brightness-110 transition-all shadow-[0_0_15px_rgba(54,226,123,0.3)]">
            <option>October 2023</option>
            <option>September 2023</option>
            <option>August 2023</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-900">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
          </div>
        </div>
      </div>
    </header>
  );
}

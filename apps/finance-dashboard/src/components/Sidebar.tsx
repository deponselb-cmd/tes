import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useSession, useSignOut } from '../hooks/useAuth';

export default function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const { signOut } = useSignOut();

  const handleLogout = async () => {
    await signOut();
  };

  // Get user initials for avatar fallback
  const userInitials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <aside className="hidden md:flex flex-col w-72 h-full bg-[#111714] dark:bg-[#0d1611] border-r border-[#2a3f33]/30 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/20 p-2 rounded-xl">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>insights</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">FinTrack</h1>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-full transition-all ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </NavLink>
          <NavLink 
            to="/transaction" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
          >
            <span className={`material-symbols-outlined transition-colors ${(({ isActive }: {isActive: boolean}) => isActive ? '' : 'group-hover:text-primary')}`}>credit_card</span>
            <span className="font-medium text-sm">Transactions</span>
          </NavLink>
          <NavLink 
            to="/reports" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
          >
            <span className={`material-symbols-outlined transition-colors ${(({ isActive }: {isActive: boolean}) => isActive ? '' : 'group-hover:text-primary')}`}>bar_chart</span>
            <span className="font-medium text-sm">Reports</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center gap-4 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`
            }
          >
            <span className={`material-symbols-outlined transition-colors ${(({ isActive }: {isActive: boolean}) => isActive ? '' : 'group-hover:text-primary')}`}>settings</span>
            <span className="font-medium text-sm">Settings</span>
          </NavLink>
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-[#2a3f33]/30">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-dark hover:bg-white/5 cursor-pointer transition-colors border border-transparent focus:outline-none"
          >
            {session?.user?.image ? (
              <div 
                className="w-10 h-10 rounded-full bg-cover bg-center" 
                style={{ backgroundImage: `url("${session.user.image}")` }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {userInitials}
              </div>
            )}
            <div className="flex flex-col items-start">
              <p className="text-sm font-semibold text-white">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate max-w-[120px]">{session?.user?.email || ''}</p>
            </div>
            <span className={`material-symbols-outlined ml-auto text-gray-400 text-sm transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1c2620] border border-[#2a3f33] rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="py-1">
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <span className="text-sm">Profile</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  <span className="text-sm">Billing</span>
                </a>
                <div className="h-px bg-[#2a3f33]/50 my-1 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

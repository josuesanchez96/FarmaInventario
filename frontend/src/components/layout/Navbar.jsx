import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, User, Pill, Menu } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-glow">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-brand-600 to-teal-500 dark:from-brand-400 dark:to-teal-300 bg-clip-text text-transparent">
              FarmaInventario
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Control de Medicamentos</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Info & Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{user.name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">{user.role}</span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-950/80 border border-brand-300 dark:border-brand-700/60 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            <button
              onClick={logout}
              title="Cerrar Sesión"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

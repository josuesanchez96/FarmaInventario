import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Pill, PlusCircle, Settings, ShieldCheck } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/medicamentos', label: 'Medicamentos', icon: Pill },
  { path: '/medicamentos/nuevo', label: 'Nuevo Medicamento', icon: PlusCircle },
  { path: '/configuracion', label: 'Configuración / Perfil', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Navegación Principal
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-glow dark:bg-brand-600'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="p-3.5 bg-slate-100/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">JWT Protegido</p>
            <p className="text-[10px] text-slate-400">Estado: En línea</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

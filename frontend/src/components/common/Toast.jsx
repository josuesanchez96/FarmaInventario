import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastConfig = {
  success: {
    icon: CheckCircle2,
    colors: 'bg-emerald-900/90 text-emerald-100 border-emerald-700/80 shadow-emerald-950/20'
  },
  error: {
    icon: AlertCircle,
    colors: 'bg-rose-900/90 text-rose-100 border-rose-700/80 shadow-rose-950/20'
  },
  warning: {
    icon: AlertTriangle,
    colors: 'bg-amber-900/90 text-amber-100 border-amber-700/80 shadow-amber-950/20'
  },
  info: {
    icon: Info,
    colors: 'bg-sky-900/90 text-sky-100 border-sky-700/80 shadow-sky-950/20'
  }
};

export const Toast = ({ type = 'info', message, onClose }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg animate-fade-in transition-all ${config.colors}`}>
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

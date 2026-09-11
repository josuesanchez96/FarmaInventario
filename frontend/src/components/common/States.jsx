import React from 'react';
import { RefreshCw, AlertTriangle, Inbox, ShieldAlert } from 'lucide-react';
import Button from './Button';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ label = 'Cargando datos...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500 dark:text-slate-400">
      <div className={`rounded-full border-brand-500 border-t-transparent animate-spin ${sizeClasses[size]}`} />
      {label && <p className="text-sm font-medium animate-pulse">{label}</p>}
    </div>
  );
};

/**
 * Table Skeleton Loader Component
 */
export const SkeletonLoader = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-3 p-4 animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mb-4" />
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="h-6 bg-slate-200 dark:bg-slate-800/60 rounded-md flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Empty State Component with Custom Illustration / Icon
 */
export const EmptyState = ({
  title = 'No se encontraron medicamentos',
  description = 'No hay registros que coincidan con tu búsqueda o filtros actuales.',
  actionLabel,
  onAction,
  icon: CustomIcon
}) => {
  const IconToRender = CustomIcon || Inbox;

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white/50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl animate-fade-in my-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
        <IconToRender className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

/**
 * Error Alert Component with Retry Action
 */
export const ErrorAlert = ({
  title = 'Error al cargar la información',
  message = 'Ocurrió un fallo en la comunicación con el servidor backend.',
  onRetry
}) => {
  return (
    <div className="p-6 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl animate-fade-in my-4">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-xl shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-rose-900 dark:text-rose-200">{title}</h4>
          <p className="text-sm text-rose-700 dark:text-rose-300 mt-1 mb-4">{message}</p>
          {onRetry && (
            <Button
              variant="danger"
              size="sm"
              icon={RefreshCw}
              onClick={onRetry}
            >
              Reintentar Petición
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

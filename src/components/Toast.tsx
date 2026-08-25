import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bg = 'bg-slate-900 text-white border-slate-800';
          let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-emerald-950/95 text-emerald-100 border-emerald-800/60';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-950/95 text-amber-100 border-amber-800/60';
            icon = <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />;
          } else if (toast.type === 'error') {
            bg = 'bg-rose-950/95 text-rose-100 border-rose-800/60';
            icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${bg}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                <p className="text-xs mt-1 text-slate-300 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

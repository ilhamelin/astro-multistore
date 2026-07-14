import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, setToast, currentTheme } = useStore();

  if (!toast) return null;

  const { message, type } = toast;

  // Select style settings based on type and active theme
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/90 text-emerald-300',
          icon: <CheckCircle className="h-5 w-5 text-emerald-400" />
        };
      case 'error':
        return {
          border: 'border-red-500/30',
          bg: 'bg-red-950/90 text-red-300',
          icon: <AlertCircle className="h-5 w-5 text-red-400" />
        };
      case 'info':
      default:
        return {
          border: 'border-cyan-500/30',
          bg: 'bg-cyan-950/90 text-cyan-300',
          icon: <Info className="h-5 w-5 text-cyan-400" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-sm animate-slide-in">
      <div className={`p-4 border backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-between gap-3 ${styles.bg} ${styles.border}`}>
        <div className="flex items-center gap-2.5">
          {styles.icon}
          <span className="text-xs font-semibold tracking-wide leading-tight">{message}</span>
        </div>
        <button
          onClick={() => setToast(null)}
          className="p-1 rounded-full hover:bg-white/10 text-inherit cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

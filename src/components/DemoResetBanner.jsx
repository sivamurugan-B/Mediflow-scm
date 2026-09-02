import React, { useState } from 'react';
import { RotateCcw, ArrowRightLeft, Sparkles, Check, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetDemoData } from '../utils/localStorage';

export default function DemoResetBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resetMessage, setResetMessage] = useState(false);
  const isSupplier = location.pathname.startsWith('/supplier');
  const isCustomer = location.pathname.startsWith('/customer');

  const handleReset = () => {
    resetDemoData();
    setResetMessage(true);
    setTimeout(() => {
      setResetMessage(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            MediFlow Simulation Engine:
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Zero-database offline state synced via localStorage. Actions in either portal sync in real-time.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isCustomer && (
            <button
              onClick={() => navigate('/supplier')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 transition-colors border border-slate-700 font-medium"
            >
              <ArrowRightLeft className="w-3 h-3 text-teal-400" />
              Switch to Supplier Portal
            </button>
          )}

          {isSupplier && (
            <button
              onClick={() => navigate('/customer')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 transition-colors border border-slate-700 font-medium"
            >
              <ArrowRightLeft className="w-3 h-3 text-teal-400" />
              Switch to Customer Portal
            </button>
          )}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 transition-colors border border-rose-800 font-medium"
            title="Restore original products, orders, inventory, and shipments"
          >
            {resetMessage ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Reset Successful!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

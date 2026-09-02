import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Layers, 
  Truck, 
  UserCheck, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Medi<span className="text-brand-600">Flow</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  SCM
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-tight">
                Healthcare Logistics & Supply Chain
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/customer" 
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/customer') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              Customer Portal
            </Link>
            <Link 
              to="/supplier" 
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${location.pathname.startsWith('/supplier') ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              <Truck className="w-4 h-4 text-brand-600" />
              Supplier Portal
            </Link>
            <a 
              href="#features" 
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Action Portal Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/customer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-teal-500/30 bg-teal-50/70 text-teal-800 text-xs font-bold hover:bg-teal-100 hover:border-teal-400 transition-all shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              Customer Portal
            </Link>
            <Link
              to="/supplier"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/25 hover:shadow-brand-600/40"
            >
              <Truck className="w-4 h-4" />
              Supplier Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/customer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-teal-700 bg-teal-50"
          >
            Customer / Professor Portal
          </Link>
          <Link
            to="/supplier"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-700 bg-brand-50"
          >
            Supplier / Logistics Portal
          </Link>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            About System
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Contact & Support
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/customer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-teal-300 text-teal-800 font-semibold text-sm bg-teal-50"
            >
              Enter Customer Portal
            </Link>
            <Link
              to="/supplier"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-brand-600 text-white font-semibold text-sm shadow-md"
            >
              Enter Supplier Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ShoppingBag, 
  Stethoscope, 
  Package, 
  CalendarCheck, 
  MapPin, 
  LayoutDashboard, 
  ArrowRightLeft, 
  Menu, 
  X,
  Home,
  Truck
} from 'lucide-react';
import { getOrders, getBookings } from '../utils/localStorage';

export default function CustomerNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  const updateCounts = () => {
    const orders = getOrders();
    const bookings = getBookings();
    setOrderCount(orders.length);
    setBookingCount(bookings.length);
  };

  useEffect(() => {
    updateCounts();
    const handleStorage = () => updateCounts();
    window.addEventListener('mediflow_storage_update', handleStorage);
    return () => window.removeEventListener('mediflow_storage_update', handleStorage);
  }, []);

  const navLinks = [
    { name: "Home", path: "/customer", icon: Home, exact: true },
    { name: "Products", path: "/customer/products", icon: ShoppingBag },
    { name: "Healthcare Services", path: "/customer/services", icon: Stethoscope },
    { name: "My Orders", path: "/customer/orders", icon: Package, badge: orderCount },
    { name: "My Bookings", path: "/customer/bookings", icon: CalendarCheck, badge: bookingCount },
    { name: "Track Order", path: "/customer/tracking", icon: MapPin },
    { name: "Dashboard", path: "/customer/dashboard", icon: LayoutDashboard },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link to="/customer" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow group-hover:bg-teal-700 transition-colors">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  Medi<span className="text-teal-600">Flow</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Customer / Professor
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      active ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Switch to Supplier Portal */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate('/supplier')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-semibold shadow transition-colors border border-slate-700"
              title="Open the Supplier Management Portal"
            >
              <Truck className="w-3.5 h-3.5 text-teal-400" />
              <span>Switch to Supplier Portal</span>
              <ArrowRightLeft className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => navigate('/supplier')}
              className="sm:hidden p-1.5 rounded-lg bg-slate-900 text-teal-300 text-xs"
              title="Supplier Portal"
            >
              <Truck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active 
                    ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/supplier');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-teal-300 text-sm font-semibold shadow"
            >
              <Truck className="w-4 h-4 text-teal-400" />
              <span>Switch to Supplier Portal</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

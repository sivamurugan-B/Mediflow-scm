import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Truck, 
  Package, 
  Boxes, 
  ClipboardList, 
  Navigation, 
  BarChart3, 
  ArrowRightLeft, 
  Home, 
  Menu, 
  X,
  AlertTriangle,
  Layers,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { getOrders, getInventory, getShipments } from '../utils/localStorage';

export default function SupplierSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [activeShipmentsCount, setActiveShipmentsCount] = useState(0);

  const updateMetrics = () => {
    const orders = getOrders();
    const inv = getInventory();
    const shipments = getShipments();

    const pending = orders.filter(o => 
      ['new', 'confirmed', 'order confirmed', 'processing'].includes(o.status?.toLowerCase())
    ).length;
    const low = inv.filter(i => i.stock <= i.reorderLevel).length;
    const active = shipments.filter(s => 
      !['delivered', 'completed'].includes(s.status?.toLowerCase())
    ).length;

    setPendingOrdersCount(pending);
    setLowStockCount(low);
    setActiveShipmentsCount(active);
  };

  useEffect(() => {
    updateMetrics();
    const handleStorage = () => updateMetrics();
    window.addEventListener('mediflow_storage_update', handleStorage);
    return () => window.removeEventListener('mediflow_storage_update', handleStorage);
  }, []);

  const menuItems = [
    { name: "Supplier Home", path: "/supplier", icon: Home, exact: true },
    { name: "Supplier Orders", path: "/supplier/orders", icon: Package, badge: pendingOrdersCount, badgeColor: "bg-brand-500 text-white" },
    { name: "Inventory Management", path: "/supplier/inventory", icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeColor: "bg-amber-500 text-white" },
    { name: "Supplier / Procurement", path: "/supplier/procurement", icon: ClipboardList },
    { name: "Shipment Management", path: "/supplier/shipments", icon: Truck, badge: activeShipmentsCount, badgeColor: "bg-teal-600 text-white" },
    { name: "Supply Chain Tracking", path: "/supplier/tracking", icon: Navigation },
    { name: "Logistics Dashboard", path: "/supplier/dashboard", icon: BarChart3, highlight: true },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile Top Bar for Supplier */}
      <header className="lg:hidden bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base">MediFlow Supplier</span>
            <span className="block text-[10px] text-teal-400 font-medium">Logistics & Supply Chain</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/customer')}
            className="px-2 py-1 rounded bg-slate-800 text-xs text-teal-300 border border-slate-700 font-medium"
          >
            Customer Portal
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col">
          <div className="bg-slate-900 w-4/5 max-w-sm h-full p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                    <Activity className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base">MediFlow Supplier</h2>
                    <p className="text-[11px] text-brand-400">Operations Control Tower</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        active 
                          ? 'bg-brand-600 text-white font-bold shadow-md' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/customer');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors shadow"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch to Customer Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800 shrink-0 select-none min-h-[calc(100vh-33px)] sticky top-[33px]">
        {/* Brand & Portal Type */}
        <div className="p-5 border-b border-slate-800/80">
          <Link to="/supplier" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1">
                Medi<span className="text-brand-400">Flow</span>
              </span>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-400">
                Supplier Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation items */}
        <div className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Supply Chain Modules
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-tight shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Switch Portal Box & Facility Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
          <button
            onClick={() => navigate('/customer')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-teal-600/90 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow hover:shadow-teal-500/20"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch to Customer Portal</span>
          </button>

          <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-300">Central Hub Online</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Chennai Central Warehouse (Active)
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  Truck, 
  AlertCircle, 
  CheckCircle2, 
  Boxes, 
  ClipboardList, 
  BarChart3, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Layers,
  Building2,
  Navigation
} from 'lucide-react';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, getInventory, getShipments } from '../../utils/localStorage';

export default function SupplierHome() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [shipments, setShipments] = useState([]);

  const loadData = () => {
    setOrders(getOrders());
    setInventory(getInventory());
    setShipments(getShipments());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  // Summary Metrics
  const todaysOrders = orders.filter(o => o.orderDate === '2026-09-02' || o.orderDate === new Date().toISOString().split('T')[0]).length || 3;
  const pendingOrders = orders.filter(o => ['new', 'confirmed', 'order confirmed', 'processing'].includes(o.status?.toLowerCase())).length;
  const lowStockItems = inventory.filter(i => i.stock <= i.reorderLevel).length;
  const activeShipments = shipments.filter(s => !['delivered', 'completed'].includes(s.status?.toLowerCase())).length;
  const delayedShipments = shipments.filter(s => s.status?.toLowerCase().includes('delayed')).length;
  const completedDeliveries = shipments.filter(s => ['delivered', 'completed'].includes(s.status?.toLowerCase())).length;

  // Recent Supplier Orders
  const recentOrders = orders.slice(0, 5);

  // Low Stock Products
  const lowStockProducts = inventory.filter(i => i.stock <= i.reorderLevel);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoResetBanner />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Persistent Supplier Sidebar */}
        <SupplierSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Hero Section */}
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Operations Command Tower
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Supplier Management Portal
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Manage healthcare orders, inventory, shipments and supply-chain operations from one place.
              </p>
            </div>
          </div>

          {/* 6 SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Today's Orders */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Today's Orders</span>
                <Package className="w-4 h-4 text-brand-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{todaysOrders}</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live Ingested</span>
            </div>

            {/* Pending Orders */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Pending</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 mt-2">{pendingOrders}</div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Awaiting Dispatch</span>
            </div>

            {/* Low Stock Items */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600 mt-2">{lowStockItems}</div>
              <span className="text-[10px] text-rose-600 font-bold mt-1 block">Needs Reorder</span>
            </div>

            {/* Active Shipments */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Transit</span>
                <Truck className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-sky-600 mt-2">{activeShipments}</div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">On Route</span>
            </div>

            {/* Delayed Shipments */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Delayed</span>
                <AlertCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600 mt-2">{delayedShipments}</div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Weather / Traffic</span>
            </div>

            {/* Completed Deliveries */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">{completedDeliveries}</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">98.2% On-Time</span>
            </div>

          </div>

          {/* QUICK ACTIONS BUTTONS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Quick Operational Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/supplier/orders')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700">View Orders</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/supplier/inventory')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Boxes className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Manage Inventory</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/supplier/shipments')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700">Manage Shipments</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/supplier/dashboard')}
                className="p-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-bold">View Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* TWO SECTIONS: RECENT SUPPLIER ORDERS & LOW STOCK PRODUCTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Recent Supplier Orders */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-600" />
                    <h3 className="font-bold text-sm text-slate-900">Recent Supplier Orders</h3>
                  </div>
                  <Link to="/supplier/orders" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    Manage Orders ({orders.length})
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-3 px-5">Order Number</th>
                        <th className="py-3 px-5">Customer</th>
                        <th className="py-3 px-5">Product</th>
                        <th className="py-3 px-5">Quantity</th>
                        <th className="py-3 px-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.map((ord) => (
                        <tr key={ord.orderNumber} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-5 font-mono font-bold text-slate-800">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-5 text-slate-700 max-w-[140px] truncate" title={ord.customerName}>
                            {ord.customerName}
                          </td>
                          <td className="py-3 px-5 font-semibold text-slate-900">
                            {ord.productName}
                          </td>
                          <td className="py-3 px-5 text-slate-600">
                            {ord.quantity}
                          </td>
                          <td className="py-3 px-5">
                            <StatusBadge status={ord.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="text-slate-500">Live feed from Customer Portal requisitions</span>
                <Link to="/supplier/orders" className="font-bold text-brand-600 hover:underline">
                  Update Order Statuses →
                </Link>
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-sm text-slate-900">Low Stock Alerts</h3>
                  </div>
                  <Link to="/supplier/inventory" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    Inventory ({inventory.length})
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-3 px-5">Product</th>
                        <th className="py-3 px-5">Current</th>
                        <th className="py-3 px-5">Reorder</th>
                        <th className="py-3 px-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lowStockProducts.slice(0, 5).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-5 font-bold text-slate-800">
                            {item.product}
                            <span className="block font-mono text-[10px] text-slate-400">{item.sku}</span>
                          </td>
                          <td className="py-3 px-5 font-black text-rose-600">
                            {item.stock} {item.unit}
                          </td>
                          <td className="py-3 px-5 text-slate-600">
                            {item.reorderLevel}
                          </td>
                          <td className="py-3 px-5">
                            <StatusBadge status={item.stock === 0 ? "Out of Stock" : "Low Stock"} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="text-slate-500">Threshold triggered automatically</span>
                <Link to="/supplier/procurement" className="font-bold text-teal-700 hover:underline">
                  Raise Purchase Order →
                </Link>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

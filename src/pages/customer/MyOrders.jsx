import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, ShoppingBag, ArrowRight, ExternalLink, Calendar, MapPin } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getOrders } from '../../utils/localStorage';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.productName.toLowerCase().includes(search.toLowerCase()) ||
    o.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                <Package className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Consignee Orders
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comprehensive list of all your product orders and their real-time fulfillment status.
            </p>
          </div>

          <Link
            to="/customer/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Place New Order</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, product, supplier..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">{filteredOrders.length} records</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-6">Supplier</th>
                  <th className="py-3.5 px-6">Quantity</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Order Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-slate-400 text-xs">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.orderNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">
                        {ord.orderNumber}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {ord.productName}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {ord.supplier}
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-semibold">
                        {ord.quantity} units
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {ord.orderDate}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={ord.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/customer/tracking?id=${ord.orderNumber}`)}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Track Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

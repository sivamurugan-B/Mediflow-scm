import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Edit,
  Save,
  X,
  Building2,
  Warehouse
} from 'lucide-react';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, updateOrderStatus } from '../../utils/localStorage';

export default function SupplierOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null); // For edit modal
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const STATUS_OPTIONS = [
    'New',
    'Confirmed',
    'Processing',
    'Quality Check',
    'Packed',
    'Dispatched',
    'In Transit',
    'Delivered',
    'Delayed'
  ];

  const loadOrders = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setStatusNotes(ord.notes || '');
  };

  const handleUpdateStatus = (orderNumber, statusToSet, notes = '') => {
    updateOrderStatus(orderNumber, statusToSet, notes);
    setToastMessage(`Order ${orderNumber} updated to "${statusToSet}"! Check Customer Tracking.`);
    setSelectedOrder(null);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                          ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          ord.productName.toLowerCase().includes(search.toLowerCase()) ||
                          ord.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ord.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoResetBanner />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <SupplierSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-brand-100 text-brand-700">
                  <Package className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Fulfillment & Ingested Orders
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Supplier Orders Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Incoming orders from hospital customers. Updating status here immediately updates the customer tracking view!
              </p>
            </div>

            {/* Quick Link to view customer tracking */}
            <Link
              to="/customer/tracking"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors shrink-0"
            >
              <span>View Customer Tracking Side</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
            </Link>
          </div>

          {/* Interactive Synchronized Toast Banner */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-3 animate-fade-in text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="p-1 rounded-lg hover:bg-emerald-700 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order #, customer, product..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Confirmed', 'Processing', 'Packed', 'Dispatched', 'In Transit', 'Delivered', 'Delayed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Master Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3.5 px-5">Order Number</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Product</th>
                    <th className="py-3.5 px-5">Quantity</th>
                    <th className="py-3.5 px-5">Order Date</th>
                    <th className="py-3.5 px-5">Supplier</th>
                    <th className="py-3.5 px-5">Warehouse</th>
                    <th className="py-3.5 px-5">Current Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-12 text-slate-400 text-xs">
                        No orders match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.orderNumber} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Order Number */}
                        <td className="py-4 px-5 font-mono font-bold text-slate-800">
                          {ord.orderNumber}
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 block max-w-[150px] truncate" title={ord.customerName}>
                            {ord.customerName}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate" title={ord.email}>
                            {ord.email}
                          </span>
                        </td>

                        {/* Product */}
                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 block">
                            {ord.productName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Unit: ₹{ord.unitAmount}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-5 font-semibold text-slate-700">
                          {ord.quantity} units
                          <span className="block text-[10px] text-teal-700 font-bold">
                            ₹{ord.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Order Date */}
                        <td className="py-4 px-5 text-slate-600">
                          {ord.orderDate}
                        </td>

                        {/* Supplier */}
                        <td className="py-4 px-5 text-slate-700 font-medium">
                          {ord.supplier}
                        </td>

                        {/* Warehouse */}
                        <td className="py-4 px-5 text-slate-600">
                          {ord.warehouse || "Chennai Warehouse"}
                        </td>

                        {/* Status (Live interactive dropdown) */}
                        <td className="py-4 px-5">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateStatus(ord.orderNumber, e.target.value)}
                            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Action */}
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenStatusModal(ord)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors inline-flex items-center gap-1"
                            title="Open detailed operational update"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAILED STATUS MODAL */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-in">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-brand-600">
                      Supply Chain Status Controller
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Update Order: {selectedOrder.orderNumber}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div>Customer: <strong>{selectedOrder.customerName}</strong></div>
                  <div>Product: <strong>{selectedOrder.productName} ({selectedOrder.quantity} units)</strong></div>
                  <div>Destination: <span className="text-slate-600">{selectedOrder.shippingAddress}</span></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select New Supply Chain Status:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setNewStatus(opt)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          newStatus === opt
                            ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Operational Remarks / Checkpoint Note:
                  </label>
                  <input
                    type="text"
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    placeholder="e.g. Scanned at Outbound Gate 4, sealed with Tamper Tag #9921"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder.orderNumber, newStatus, statusNotes)}
                    className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Sync State</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ThermometerSnowflake, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  X, 
  Save,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getShipments, updateShipmentStatus } from '../../utils/localStorage';

export default function Shipments() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [toast, setToast] = useState(null);

  const SHIPMENT_STATUSES = [
    'Order Confirmed',
    'Processing',
    'Packed',
    'Dispatched',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Delayed'
  ];

  const loadShipments = () => {
    setShipments(getShipments());
  };

  useEffect(() => {
    loadShipments();
    const handleUpdate = () => loadShipments();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const handleOpenEdit = (s) => {
    setSelectedShipment(s);
    setNewStatus(s.status);
    setNewLocation(s.currentLocation || '');
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    if (!selectedShipment) return;

    updateShipmentStatus(selectedShipment.shipmentId, newStatus, newLocation);
    setToast(`Shipment ${selectedShipment.shipmentId} updated to "${newStatus}" at "${newLocation}"!`);
    setSelectedShipment(null);
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = shipments.filter(s => {
    const matchesSearch = s.shipmentId.toLowerCase().includes(search.toLowerCase()) ||
                          s.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                          s.customer.toLowerCase().includes(search.toLowerCase()) ||
                          s.product.toLowerCase().includes(search.toLowerCase()) ||
                          s.carrier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status?.toLowerCase() === statusFilter.toLowerCase();
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
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Truck className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                  Freight & Fleet Dispatch
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Shipment Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Active carrier assignments, temperature telemetry, transit checkpoints, and consignee delivery status.
              </p>
            </div>

            <button
              onClick={() => navigate('/supplier/tracking')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow transition-all shrink-0 flex items-center gap-2"
            >
              <span>Detailed 8-Stage Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="p-3.5 rounded-xl bg-sky-600 text-white text-xs font-semibold shadow flex items-center justify-between">
              <span>{toast}</span>
              <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Shipment ID, Order, Customer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Dispatched', 'In Transit', 'Delivered', 'Delayed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Shipments Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3.5 px-5">Shipment ID</th>
                    <th className="py-3.5 px-5">Order Number</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Product & Qty</th>
                    <th className="py-3.5 px-5">Warehouse Origin</th>
                    <th className="py-3.5 px-5">Current Location</th>
                    <th className="py-3.5 px-5">Transport Mode</th>
                    <th className="py-3.5 px-5">Carrier</th>
                    <th className="py-3.5 px-5">Estimated Delivery</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-10 text-slate-400 text-xs">
                        No shipments found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => (
                      <tr key={s.shipmentId} className="hover:bg-slate-50/70 transition-colors">
                        
                        <td className="py-4 px-5 font-mono font-bold text-sky-800">
                          {s.shipmentId}
                        </td>

                        <td className="py-4 px-5 font-mono font-semibold text-slate-700">
                          {s.orderNumber}
                        </td>

                        <td className="py-4 px-5">
                          <strong className="text-slate-900 block max-w-[140px] truncate" title={s.customer}>
                            {s.customer}
                          </strong>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-900 block">{s.product}</span>
                          <span className="text-slate-400 text-[10px]">{s.quantity} {s.unit || 'units'}</span>
                        </td>

                        <td className="py-4 px-5 text-slate-600 max-w-[130px] truncate" title={s.warehouse}>
                          {s.warehouse}
                        </td>

                        <td className="py-4 px-5 font-semibold text-teal-800 max-w-[150px] truncate" title={s.currentLocation}>
                          {s.currentLocation}
                        </td>

                        <td className="py-4 px-5 text-slate-700 font-medium">
                          {s.transportMode}
                        </td>

                        <td className="py-4 px-5 text-slate-600">
                          <span className="font-semibold text-slate-800 block">{s.carrier}</span>
                          <span className="text-[10px] text-slate-400">{s.vehicleNumber}</span>
                        </td>

                        <td className="py-4 px-5 font-semibold text-slate-900">
                          {s.estimatedDelivery}
                        </td>

                        <td className="py-4 px-5">
                          <StatusBadge status={s.status} size="sm" />
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
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

          {/* EDIT SHIPMENT MODAL */}
          {selectedShipment && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-scale-in">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-sky-600">
                      Fleet Logistics Control
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      Update Shipment: {selectedShipment.shipmentId}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedShipment(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveUpdate} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Shipment Status:
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      {SHIPMENT_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Location Checkpoint:
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Bengaluru Distribution Center, Electronic City"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 space-y-1">
                    <div>Consignment: <strong>{selectedShipment.product} ({selectedShipment.quantity} units)</strong></div>
                    <div>Destination: <strong>{selectedShipment.destination}</strong></div>
                    <div>Carrier: <strong>{selectedShipment.carrier}</strong></div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedShipment(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Sync</span>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

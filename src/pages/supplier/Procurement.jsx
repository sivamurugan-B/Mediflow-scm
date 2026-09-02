import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Building2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Plus, 
  X,
  FileCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getSuppliers, getProcurementOrders, updateProcurementStatus } from '../../utils/localStorage';

export default function Procurement() {
  const [suppliers, setSuppliers] = useState([]);
  const [procurementOrders, setProcurementOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const loadData = () => {
    setSuppliers(getSuppliers());
    setProcurementOrders(getProcurementOrders());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const handleStatusChange = (poNumber, newStatus) => {
    updateProcurementStatus(poNumber, newStatus);
    setToast(`Purchase Order ${poNumber} status updated to ${newStatus}`);
    setTimeout(() => setToast(null), 4000);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoResetBanner />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <SupplierSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <ClipboardList className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Vendor Network & Purchasing
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Procurement & Supplier Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Qualified medical equipment vendors, contractual lead times, and Purchase Order (PO) replenishment lifecycles.
              </p>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="p-3.5 rounded-xl bg-indigo-700 text-white text-xs font-semibold shadow flex items-center justify-between">
              <span>{toast}</span>
              <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* SECTION 1: SUPPLIER LIST */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-black text-slate-900">Registered Medical Suppliers</h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{suppliers.length} Certified Vendors</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {suppliers.map((sup) => (
                <div 
                  key={sup.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                          {sup.badge}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">{sup.name}</h3>
                        <p className="text-xs text-slate-500">{sup.company}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{sup.rating}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                        </span>
                        <strong className="text-slate-800">{sup.location}</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Lead Time:
                        </span>
                        <strong className="text-slate-800">{sup.leadTime}</strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Performance:
                        </span>
                        <strong className="text-emerald-700 font-bold">{sup.performance}</strong>
                      </div>

                      <div className="pt-2 border-t border-slate-100/70">
                        <span className="text-slate-400 text-[11px] block">Supplies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {sup.productsSupplied?.map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{sup.phone}</span>
                    <span className="text-indigo-600 font-bold hover:underline cursor-pointer">
                      View Vendor Dossier
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: PROCUREMENT ORDERS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Procurement Purchase Orders (POs)</h3>
                <p className="text-xs text-slate-500">Supply replenishment lifecycle from requisition to receiving dock</p>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">
                WMS Auto-Procure
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3.5 px-5">PO Number</th>
                    <th className="py-3.5 px-5">Supplier</th>
                    <th className="py-3.5 px-5">Product & SKU</th>
                    <th className="py-3.5 px-5">Quantity</th>
                    <th className="py-3.5 px-5">Order Date</th>
                    <th className="py-3.5 px-5">Expected Arrival</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {procurementOrders.map((po) => (
                    <tr key={po.poNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-slate-800">
                        {po.poNumber}
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-900">
                        {po.supplier}
                      </td>
                      <td className="py-4 px-5">
                        <strong className="text-slate-900 block">{po.product}</strong>
                        <span className="font-mono text-[10px] text-slate-400">{po.sku}</span>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-800">
                        {po.quantity} units
                        <span className="block text-[10px] text-slate-400 font-normal">
                          ₹{po.totalAmount?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600">
                        {po.orderDate}
                      </td>
                      <td className="py-4 px-5 text-slate-800 font-medium">
                        {po.expectedArrival}
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={po.status} size="sm" />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <select
                          value={po.status}
                          onChange={(e) => handleStatusChange(po.poNumber, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          {['Requested', 'Approved', 'Ordered', 'In Transit', 'Received'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

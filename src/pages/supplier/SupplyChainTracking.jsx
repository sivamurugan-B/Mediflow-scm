import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Search, 
  MapPin, 
  Building2, 
  Warehouse, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Barcode, 
  FileText,
  Boxes,
  ThermometerSnowflake,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, getShipments, updateOrderStatus, updateShipmentStatus } from '../../utils/localStorage';

export default function SupplyChainTracking() {
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeShipment, setActiveShipment] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = () => {
    const o = getOrders();
    const s = getShipments();
    setOrders(o);
    setShipments(s);

    const target = selectedOrderNumber || (o.length > 0 ? o[0].orderNumber : '');
    setSelectedOrderNumber(target);

    const matchOrd = o.find(item => item.orderNumber === target) || o[0];
    const matchShip = s.find(item => item.orderNumber === target) || s[0];
    setActiveOrder(matchOrd);
    setActiveShipment(matchShip);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, [selectedOrderNumber]);

  // Operational 8-Stage Flow Definition
  const operationalStages = [
    { id: 1, name: "Supplier Processing", defaultTime: "01 Sep 2026 - 09:30 AM", defaultLoc: "Supplier ERP Desk", defaultRemarks: "PO validated, production batch allocated" },
    { id: 2, name: "Quality Check", defaultTime: "01 Sep 2026 - 11:00 AM", defaultLoc: "QA Cleanroom Bay", defaultRemarks: "Sterility & seal integrity testing cleared" },
    { id: 3, name: "Warehouse Ingestion", defaultTime: "01 Sep 2026 - 02:30 PM", defaultLoc: "Chennai Central Warehouse", defaultRemarks: "Barcoded into outbound staging rack" },
    { id: 4, name: "Packing", defaultTime: "01 Sep 2026 - 06:00 PM", defaultLoc: "Packing Terminal 2", defaultRemarks: "Corrugated insulated shipper box with data logger" },
    { id: 5, name: "Dispatched", defaultTime: "02 Sep 2026 - 08:00 AM", defaultLoc: "Outbound Loading Dock", defaultRemarks: "Transferred to linehaul container vehicle" },
    { id: 6, name: "Distribution Center", defaultTime: "02 Sep 2026 - 04:15 PM", defaultLoc: "Bengaluru Hub, Electronic City", defaultRemarks: "Regional cross-dock scan completed" },
    { id: 7, name: "Transportation", defaultTime: "03 Sep 2026 - 07:30 AM", defaultLoc: "Local Highway Transit", defaultRemarks: "Refrigerated van en route to hospital" },
    { id: 8, name: "Customer Delivery", defaultTime: "Expected 05 Sep 2026", defaultLoc: "Consignee Receiving Wing", defaultRemarks: "Awaiting physical handover and digital POD sign-off" }
  ];

  // Advance stage button for professor demo
  const handleAdvanceStage = (stageName) => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.orderNumber, stageName, `Supplier checkpoint updated to ${stageName}`);
    setToast(`Updated to stage "${stageName}". Customer Tracking reflects this instantly!`);
    setTimeout(() => setToast(null), 4000);
  };

  const getStageState = (stageIndex, activeStatus) => {
    const statusMap = {
      'new': 0,
      'order confirmed': 0,
      'processing': 1,
      'quality check': 2,
      'packed': 3,
      'dispatched': 4,
      'in transit': 5,
      'delayed': 5,
      'out for delivery': 6,
      'delivered': 7
    };
    const currentIdx = statusMap[activeStatus?.toLowerCase()] !== undefined ? statusMap[activeStatus.toLowerCase()] : 4;

    if (stageIndex < currentIdx) return 'completed';
    if (stageIndex === currentIdx) return 'current';
    return 'pending';
  };

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
                  <Navigation className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Detailed Operational Telematics
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Supplier Supply Chain Tracking
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Deep operational breakdown: Supplier → QC → Warehouse → Packing → Dispatch → DC → Transit → Customer.
              </p>
            </div>

            {/* Consignment Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Inspect Order:
              </label>
              <select
                value={selectedOrderNumber}
                onChange={(e) => setSelectedOrderNumber(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-500 shadow-xs cursor-pointer"
              >
                {orders.map((ord) => (
                  <option key={ord.orderNumber} value={ord.orderNumber}>
                    {ord.orderNumber} - {ord.productName} ({ord.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow flex items-center justify-between animate-fade-in">
              <span>{toast}</span>
              <button onClick={() => setToast(null)} className="font-bold">✕</button>
            </div>
          )}

          {activeOrder && (
            <div className="space-y-6">
              
              {/* THREE MAIN OPERATIONAL INFORMATION CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. ORDER INFORMATION */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        ORDER INFORMATION
                      </span>
                      <StatusBadge status={activeOrder.status} size="sm" />
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Order Number:</span>
                        <strong className="font-mono text-slate-900">{activeOrder.orderNumber}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer:</span>
                        <strong className="text-slate-800 max-w-[150px] truncate">{activeOrder.customerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Product:</span>
                        <strong className="text-slate-900">{activeOrder.productName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quantity:</span>
                        <strong className="text-slate-900 font-bold">{activeOrder.quantity} units (₹{activeOrder.totalAmount?.toLocaleString('en-IN')})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Order Date:</span>
                        <span className="text-slate-700">{activeOrder.orderDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Destination: <span className="text-slate-700 font-medium">{activeOrder.shippingAddress || "Apollo Hospital Store"}</span>
                  </div>
                </div>

                {/* 2. SUPPLIER INFORMATION */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        SUPPLIER INFORMATION
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Origin Hub
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Supplier:</span>
                        <strong className="text-slate-900">{activeOrder.supplier || "MediSupply Pvt Ltd"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Warehouse:</span>
                        <strong className="text-slate-800">{activeOrder.warehouse || "Chennai Central Warehouse"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Inventory Status:</span>
                        <strong className="text-emerald-700 font-bold">Allocated & Barcoded</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Processing Status:</span>
                        <strong className="text-brand-700 font-bold">{activeOrder.status}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Fulfillment SLA: <strong className="text-slate-700">Priority Medical Dispatch</strong>
                  </div>
                </div>

                {/* 3. LOGISTICS INFORMATION */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                        <Truck className="w-4 h-4" />
                        LOGISTICS INFORMATION
                      </span>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Fleet Telemetry
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Shipment ID:</span>
                        <strong className="font-mono text-sky-800">{activeShipment?.shipmentId || "SHIP-2026-00125"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Carrier:</span>
                        <strong className="text-slate-900">{activeShipment?.carrier || "MediExpress Logistics"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Transport Mode:</span>
                        <span className="text-slate-800 font-semibold">{activeShipment?.transportMode || "Road Express"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Current Location:</span>
                        <strong className="text-teal-700">{activeOrder.currentLocation || "Bengaluru DC"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimated Delivery:</span>
                        <strong className="text-slate-900 font-bold">{activeOrder.estimatedDelivery || "05 September 2026"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Temp: <strong>22°C (Optimal)</strong></span>
                    <span>RH: <strong>45%</strong></span>
                  </div>
                </div>

              </div>

              {/* 4. SUPPLY CHAIN FLOW: 8-STAGE DEEP OPERATIONAL DRILL-DOWN */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Detailed Operational Supply Chain Flow
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supplier → Quality Check → Warehouse → Packing → Dispatch → Distribution Center → Transportation → Customer
                    </p>
                  </div>

                  {/* Advance Stage Control */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Quick Advance:</span>
                    <button
                      onClick={() => handleAdvanceStage("Dispatched")}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Dispatched
                    </button>
                    <button
                      onClick={() => handleAdvanceStage("In Transit")}
                      className="px-2.5 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold"
                    >
                      In Transit
                    </button>
                    <button
                      onClick={() => handleAdvanceStage("Delivered")}
                      className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold"
                    >
                      Delivered
                    </button>
                  </div>
                </div>

                {/* Vertical Stage Pipeline */}
                <div className="mt-8 space-y-6">
                  {operationalStages.map((stage, idx) => {
                    const state = getStageState(idx, activeOrder.status);
                    const isCompleted = state === 'completed';
                    const isCurrent = state === 'current';
                    const isPending = state === 'pending';

                    return (
                      <div 
                        key={stage.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isCurrent 
                            ? 'bg-brand-50/80 border-brand-300 shadow-md ring-1 ring-brand-200' 
                            : isCompleted 
                            ? 'bg-slate-50/70 border-slate-200' 
                            : 'bg-white border-slate-200/50 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          <div className="flex items-center gap-4">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                              isCompleted 
                                ? 'bg-emerald-600 text-white' 
                                : isCurrent 
                                ? 'bg-brand-600 text-white animate-pulse' 
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : stage.id}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-slate-900">
                                  {stage.name}
                                </h4>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                                    ● Current Stage
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ Completed
                                  </span>
                                )}
                                {isPending && (
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    ○ Pending
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {stage.defaultRemarks}
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right text-xs space-y-0.5 shrink-0 pl-13 sm:pl-0">
                            <div className="flex items-center sm:justify-end gap-1.5 text-slate-700 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{stage.defaultTime}</span>
                            </div>
                            <div className="flex items-center sm:justify-end gap-1.5 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-brand-500" />
                              <span>{stage.defaultLoc}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

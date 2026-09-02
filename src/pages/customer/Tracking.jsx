import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Navigation, 
  Search, 
  MapPin, 
  Building2, 
  Warehouse, 
  Calendar, 
  Clock, 
  User, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import TrackingTimeline from '../../components/TrackingTimeline';
import { getOrders, getShipments, getBookings } from '../../utils/localStorage';

export default function Tracking() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramId = searchParams.get('id');

  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedId, setSelectedId] = useState(paramId || '');
  const [searchInput, setSearchInput] = useState(paramId || '');
  const [activeItem, setActiveItem] = useState(null);
  const [activeShipment, setActiveShipment] = useState(null);

  const loadData = () => {
    const o = getOrders();
    const s = getShipments();
    const b = getBookings();
    setOrders(o);
    setShipments(s);
    setBookings(b);

    const targetId = selectedId || paramId || (o.length > 0 ? o[0].orderNumber : '');
    setSelectedId(targetId);

    // Find order or booking
    const matchedOrder = o.find(item => item.orderNumber?.toLowerCase() === targetId?.toLowerCase());
    const matchedBooking = b.find(item => item.bookingNumber?.toLowerCase() === targetId?.toLowerCase());
    const matchedShipment = s.find(item => item.orderNumber?.toLowerCase() === targetId?.toLowerCase() || item.shipmentId?.toLowerCase() === targetId?.toLowerCase());

    if (matchedOrder) {
      setActiveItem({ ...matchedOrder, isOrder: true });
    } else if (matchedBooking) {
      setActiveItem({ ...matchedBooking, isBooking: true });
    } else if (o.length > 0) {
      setActiveItem({ ...o[0], isOrder: true });
    }

    setActiveShipment(matchedShipment || s[0] || null);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, [selectedId, paramId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedId(searchInput.trim());
    }
  };

  // Combine items for the select switcher
  const allSelectable = [
    ...orders.map(o => ({ id: o.orderNumber, label: `Order: ${o.orderNumber} - ${o.productName} (${o.status})` })),
    ...bookings.map(b => ({ id: b.bookingNumber, label: `Service: ${b.bookingNumber} - ${b.serviceName} (${b.status})` }))
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                <Navigation className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Live Consignment Telemetry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time temperature, milestone progression, and distribution tracking.
            </p>
          </div>

          {/* Switch Order Select / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Order ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </form>

            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setSearchInput(e.target.value);
              }}
              className="w-full sm:w-72 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-xs"
            >
              {allSelectable.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ORDER SUMMARY BANNER */}
        {activeItem ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Primary Metadata & Operational Cards */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Main Status Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {activeItem.isOrder ? activeItem.orderNumber : activeItem.bookingNumber}
                  </span>
                  <StatusBadge status={activeItem.status} size="md" />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    {activeItem.isOrder ? 'Consignment Product' : 'Booked Service'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {activeItem.isOrder ? activeItem.productName : activeItem.serviceName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeItem.isOrder ? `Quantity: ${activeItem.quantity} units • Total: ₹${activeItem.totalAmount?.toLocaleString('en-IN')}` : `Rate: ₹${activeItem.serviceAmount?.toLocaleString('en-IN')}`}
                  </p>
                </div>

                {/* Key Logistics Metadata */}
                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  
                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Customer:
                    </span>
                    <strong className="text-slate-800 text-right max-w-[170px] truncate">
                      {activeItem.customerName}
                    </strong>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Supplier:
                    </span>
                    <strong className="text-slate-800 text-right">
                      {activeItem.supplier || "MediSupply Pvt Ltd"}
                    </strong>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                      Warehouse:
                    </span>
                    <strong className="text-slate-800 text-right">
                      {activeItem.warehouse || "Chennai Central Warehouse"}
                    </strong>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      Current Location:
                    </span>
                    <strong className="text-teal-700 font-bold text-right">
                      {activeItem.currentLocation || "Bengaluru Distribution Center"}
                    </strong>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Expected Delivery:
                    </span>
                    <strong className="text-slate-900 font-bold text-right">
                      {activeItem.estimatedDelivery || activeItem.serviceDate || "05 September 2026"}
                    </strong>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Last Updated:
                    </span>
                    <span className="text-slate-600 text-right">
                      {activeItem.lastUpdated || "Just now"}
                    </span>
                  </div>

                </div>

                {/* Simulated Telemetry telemetry sensor box */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                  <div className="flex items-center justify-between text-teal-400 font-bold text-[11px] uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                      Live Container Telemetry
                    </span>
                    <span>ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-slate-800/80 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Temperature</span>
                      <span className="font-bold text-teal-300 text-sm">{activeShipment?.temperature || "22°C (Ambient)"}</span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 block">Humidity</span>
                      <span className="font-bold text-teal-300 text-sm">{activeShipment?.humidity || "45% RH"}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Carrier: {activeShipment?.carrier || "MediExpress Logistics"} • {activeShipment?.vehicleNumber || "TN-02-CP-8841"}
                  </div>
                </div>

              </div>

              {/* Cross portal sync demo hint */}
              <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-teal-800">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>College Project Professor Demo Note</span>
                </div>
                <p className="text-teal-700 leading-relaxed text-[11px]">
                  Want to test live supply-chain progression? Go to the <strong>Supplier Portal → Supplier Orders</strong>, select this order (<code>{activeItem.orderNumber || activeItem.bookingNumber}</code>), and change its status. When you return here, this visual timeline will automatically update!
                </p>
                <Link
                  to="/supplier/orders"
                  className="inline-flex items-center gap-1 font-bold text-teal-800 underline text-xs pt-1"
                >
                  Open Supplier Orders <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

            </div>

            {/* Right Col: Interactive Visual Supply Chain Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Consignment Milestone Progression
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Step-by-step verification from warehouse quality check to consignee receiving bay.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed
                    </span>
                    <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" /> Current
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Pending
                    </span>
                  </div>
                </div>

                {/* Timeline Component */}
                <div className="mt-4">
                  <TrackingTimeline 
                    currentStatus={activeItem.status} 
                    stages={activeShipment?.stages}
                    detailed={true}
                  />
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center">
            <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No consignment selected</h3>
            <p className="text-xs text-slate-500 mt-1">Please select an order number or enter an ID to track.</p>
          </div>
        )}

      </main>
    </div>
  );
}

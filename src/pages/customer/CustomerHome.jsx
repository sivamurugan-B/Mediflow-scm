import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Stethoscope, 
  Package, 
  CalendarCheck, 
  Truck, 
  Search, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, getBookings, getShipments } from '../../utils/localStorage';

export default function CustomerHome() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [trackQuery, setTrackQuery] = useState('');

  const loadData = () => {
    setOrders(getOrders());
    setBookings(getBookings());
    setShipments(getShipments());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      navigate(`/customer/tracking?id=${encodeURIComponent(trackQuery.trim())}`);
    } else {
      navigate('/customer/tracking');
    }
  };

  // Find active current shipment for snippet
  const activeShipment = shipments.find(s => s.status !== 'Delivered') || shipments[0];
  const recentOrders = orders.slice(0, 3);
  const recentBookings = bookings.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Customer Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              Verified Healthcare Consignee Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Welcome to MediFlow
            </h1>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              Order healthcare products and book healthcare services with reliable, temperature-controlled supply-chain tracking.
            </p>

            {/* Quick Tracking Search Bar */}
            <form onSubmit={handleQuickTrack} className="pt-3 max-w-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="Enter Order / Booking ID (e.g. MED-ORD-2026-0001)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-colors shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Quick Tracking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* TWO MAJOR CARDS: PRODUCTS & HEALTHCARE SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: PRODUCTS */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Supply Catalog</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                PRODUCTS
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Browse and order healthcare products including sterile surgical gloves, 3-ply masks, hypodermic syringes, IV sets, bandages, and PPE kits.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">8 Essential Categories</span>
              <Link
                to="/customer/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: HEALTHCARE SERVICES */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">Specialized Services</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                HEALTHCARE SERVICES
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Book healthcare logistics and healthcare services including Cold Chain (2°C-8°C), medical equipment transport, bio-maintenance, and emergency logistics.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">7 Logistics Solutions</span>
              <Link
                to="/customer/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all"
              >
                <span>Browse Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Current Shipment Snippet */}
        {activeShipment && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 border border-teal-200 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-teal-800">Current Active Consignment</span>
                    <StatusBadge status={activeShipment.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {activeShipment.product} ({activeShipment.quantity} {activeShipment.unit})
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                    <span className="flex items-center gap-1 font-mono text-slate-700 font-semibold">
                      ID: {activeShipment.orderNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      Location: <strong className="text-slate-800">{activeShipment.currentLocation}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      Expected: <strong className="text-slate-800">{activeShipment.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => navigate(`/customer/tracking?id=${activeShipment.orderNumber}`)}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
                >
                  <span>Track Consignment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RECENT ORDERS & RECENT BOOKINGS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Orders */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-base text-slate-900">Recent Orders</h3>
                </div>
                <Link to="/customer/orders" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  View All Orders ({orders.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {recentOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No orders found.</p>
                ) : (
                  recentOrders.map((ord) => (
                    <div 
                      key={ord.orderNumber} 
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/60 transition-colors flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 block">
                          {ord.orderNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                          {ord.productName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Qty: {ord.quantity} • Total: ₹{ord.totalAmount?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right space-y-1.5 shrink-0">
                        <StatusBadge status={ord.status} size="sm" />
                        <div>
                          <Link 
                            to={`/customer/tracking?id=${ord.orderNumber}`}
                            className="text-[11px] font-bold text-teal-700 hover:underline inline-flex items-center gap-0.5"
                          >
                            Track <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <Link 
                to="/customer/products" 
                className="text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                + Place New Product Order
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-brand-600" />
                  <h3 className="font-bold text-base text-slate-900">Recent Service Bookings</h3>
                </div>
                <Link to="/customer/bookings" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  View All Bookings ({bookings.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {recentBookings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No service bookings found.</p>
                ) : (
                  recentBookings.map((b) => (
                    <div 
                      key={b.bookingNumber} 
                      className="p-3.5 rounded-xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200/60 transition-colors flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 block">
                          {b.bookingNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                          {b.serviceName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Date: {b.serviceDate} • Location: {b.serviceLocation}
                        </p>
                      </div>
                      <div className="text-right space-y-1.5 shrink-0">
                        <StatusBadge status={b.status} size="sm" />
                        <div>
                          <span className="text-xs font-bold text-slate-700 block">
                            ₹{b.serviceAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <Link 
                to="/customer/services" 
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                + Book New Healthcare Service
              </Link>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

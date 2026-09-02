import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  PackageCheck, 
  CalendarCheck, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  ArrowRight, 
  Printer, 
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, getBookings } from '../../utils/localStorage';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [type, setType] = useState('product'); // 'product' or 'service'
  const [order, setOrder] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (location.state?.type === 'service' && location.state?.booking) {
      setType('service');
      setBooking(location.state.booking);
    } else if (location.state?.type === 'product' && location.state?.order) {
      setType('product');
      setOrder(location.state.order);
    } else {
      // Fallback: pick the latest order or booking from localStorage
      const orders = getOrders();
      const bookings = getBookings();
      if (orders.length > 0) {
        setType('product');
        setOrder(orders[0]);
      } else if (bookings.length > 0) {
        setType('service');
        setBooking(bookings[0]);
      }
    }
  }, [location.state]);

  const handleTrack = () => {
    if (type === 'product' && order) {
      navigate(`/customer/tracking?id=${order.orderNumber}`);
    } else if (type === 'service' && booking) {
      navigate(`/customer/tracking?id=${booking.bookingNumber}`);
    } else {
      navigate('/customer/tracking');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:shadow-none print:border-none">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-4 shadow-md">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white mb-2">
              Transaction Successful
            </span>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {type === 'product' ? '✓ ORDER CONFIRMED' : '✓ SERVICE BOOKED'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-md mx-auto">
              Your requisition has been validated and queued for logistics dispatch. State has been synchronized with the supplier operations dashboard.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-black/25 text-white font-mono text-xs font-bold border border-white/20">
              <span>{type === 'product' ? 'Order Number:' : 'Service Number:'}</span>
              <span className="text-teal-200">
                {type === 'product' ? (order?.orderNumber || 'MED-ORD-2026-0001') : (booking?.bookingNumber || 'MED-SRV-2026-0001')}
              </span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Customer Information Grid */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Customer / Consignee Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Customer Name:</span>
                  <strong className="text-slate-800 text-sm">
                    {type === 'product' ? (order?.customerName || 'Prof. Dr. A. V. Sharma') : (booking?.customerName || 'Prof. Dr. A. V. Sharma')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone:</span>
                  <strong className="text-slate-800 text-sm">
                    {type === 'product' ? (order?.phone || '9840011223') : (booking?.phone || '9840011223')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Email:</span>
                  <strong className="text-slate-800 text-sm truncate block" title={type === 'product' ? order?.email : booking?.email}>
                    {type === 'product' ? (order?.email || 'sharma.apollo@medflow.org') : (booking?.email || 'sharma.apollo@medflow.org')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Product / Service Breakdown */}
            {type === 'product' ? (
              <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-teal-600" />
                  Product Order Breakdown
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                    <span className="text-slate-600">Product:</span>
                    <strong className="text-slate-900 text-sm">{order?.productName || 'Surgical Gloves'}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                    <span className="text-slate-600">Unit Amount:</span>
                    <strong className="text-slate-900">₹{(order?.unitAmount || 500)?.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                    <span className="text-slate-600">Quantity:</span>
                    <strong className="text-slate-900">{order?.quantity || 10} units</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                    <span className="text-slate-600">Status:</span>
                    <StatusBadge status={order?.status || "Order Confirmed"} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-2 text-base">
                    <span className="font-bold text-slate-800">Total Amount:</span>
                    <span className="font-black text-2xl text-teal-700">
                      ₹{(order?.totalAmount || 5000)?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-brand-50/40 border border-brand-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-brand-600" />
                  Service Booking Breakdown
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-100">
                    <span className="text-slate-600">Service:</span>
                    <strong className="text-slate-900 text-sm">{booking?.serviceName || 'Cold Chain Transportation'}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-brand-100">
                    <span className="text-slate-600">Service Date:</span>
                    <strong className="text-slate-900">{booking?.serviceDate || '10 September 2026'}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-brand-100">
                    <span className="text-slate-600">Service Location:</span>
                    <strong className="text-slate-900">{booking?.serviceLocation || 'Chennai'}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-brand-100">
                    <span className="text-slate-600">Status:</span>
                    <StatusBadge status={booking?.status || "Booking Confirmed"} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-2 text-base">
                    <span className="font-bold text-slate-800">Amount:</span>
                    <span className="font-black text-2xl text-brand-700">
                      ₹{(booking?.serviceAmount || 5000)?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <Link
                  to="/customer/products"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Place Another Order
                </Link>
              </div>

              <button
                onClick={handleTrack}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all flex items-center justify-center gap-2 print:hidden"
              >
                <span>{type === 'product' ? 'TRACK MY ORDER' : 'TRACK MY SERVICE'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Cross portal tip */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs flex items-start gap-3 print:hidden">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Supply Chain Verification Tip:</strong>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Switch to the <Link to="/supplier/orders" className="text-teal-400 font-bold underline">Supplier Portal → Supplier Orders</Link> to inspect this newly created requisition, change its status to <em>"Dispatched"</em> or <em>"In Transit"</em>, and come back here to watch the timeline advance in real-time!
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

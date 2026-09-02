import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  CheckCircle2, 
  CalendarCheck, 
  Clock, 
  Truck, 
  MapPin, 
  ChevronRight, 
  BarChart2, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, getBookings, getShipments } from '../../utils/localStorage';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [shipments, setShipments] = useState([]);

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

  // Compute metrics from Customer perspective
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => 
    !['delivered', 'completed', 'cancelled'].includes(o.status?.toLowerCase())
  ).length;
  const completedOrders = orders.filter(o => 
    ['delivered', 'completed'].includes(o.status?.toLowerCase())
  ).length;
  const totalBookings = bookings.length;

  // Chart data: Distribution of Customer Orders by status
  const statusCounts = orders.reduce((acc, curr) => {
    const s = curr.status || 'Confirmed';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusCounts).map(status => ({
    name: status,
    orders: statusCounts[status]
  }));

  const pieColors = ['#0284c7', '#0d9488', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const pieData = Object.keys(statusCounts).map((status, index) => ({
    name: status,
    value: statusCounts[status],
    color: pieColors[index % pieColors.length]
  }));

  const activeShipment = shipments.find(s => s.status !== 'Delivered') || shipments[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              Hospital & Consignee Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Customer Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Personalized overview of your medical orders, active shipments, and logistics bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/customer/products"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order Products</span>
            </Link>
            <Link
              to="/customer/services"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Book Service</span>
            </Link>
          </div>
        </div>

        {/* 4 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DashboardCard
            title="Total Orders"
            value={totalOrders}
            subtitle="All-time hospital requisitions"
            icon={Package}
            theme="blue"
          />
          <DashboardCard
            title="Active Orders"
            value={activeOrders}
            subtitle="Currently in transit / packing"
            icon={Clock}
            theme="teal"
          />
          <DashboardCard
            title="Completed Orders"
            value={completedOrders}
            subtitle="Delivered & signed off"
            icon={CheckCircle2}
            theme="emerald"
          />
          <DashboardCard
            title="Service Bookings"
            value={totalBookings}
            subtitle="Cold chain & maintenance"
            icon={CalendarCheck}
            theme="purple"
          />
        </div>

        {/* CURRENT SHIPMENT BANNER & ORDER STATUS CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Current Shipment Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Current Shipment Tracker</h3>
                    <p className="text-xs text-slate-500">Live active consignment status</p>
                  </div>
                </div>
                {activeShipment && (
                  <StatusBadge status={activeShipment.status} size="sm" />
                )}
              </div>

              {activeShipment ? (
                <div className="mt-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Tracking Number:</span>
                      <strong className="font-mono text-slate-800 text-sm">{activeShipment.shipmentId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Product & Qty:</span>
                      <strong className="text-slate-800 text-sm">{activeShipment.product} ({activeShipment.quantity} {activeShipment.unit})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Expected Delivery:</span>
                      <strong className="text-slate-800 text-sm">{activeShipment.estimatedDelivery}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Current Location: <strong className="text-slate-900">{activeShipment.currentLocation}</strong></span>
                    </div>
                    <span className="text-slate-400">Carrier: {activeShipment.carrier}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No shipments currently active.</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Direct GPS & Telemetry Sync</span>
              {activeShipment && (
                <Link
                  to={`/customer/tracking?id=${activeShipment.orderNumber}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
                >
                  <span>Open Interactive Timeline</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Simple Order-Status Chart */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-base text-slate-900">Order Status Breakdown</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">{orders.length} total</span>
              </div>

              {/* Chart */}
              <div className="mt-4 h-48 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                        itemStyle={{ color: '#38bdf8' }}
                      />
                      <Bar dataKey="orders" fill="#0d9488" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    No orders data yet.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                Real-time chart mapped from your active orders
              </span>
            </div>
          </div>

        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent Orders</h3>
              <p className="text-xs text-slate-500">Order Number | Product | Quantity | Status</p>
            </div>
            <Link
              to="/customer/orders"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-6">Order Number</th>
                  <th className="py-3 px-6">Product</th>
                  <th className="py-3 px-6">Quantity</th>
                  <th className="py-3 px-6">Total Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.orderNumber} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-700">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {ord.productName}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {ord.quantity} units
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={ord.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/customer/tracking?id=${ord.orderNumber}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
                      >
                        <span>Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT BOOKINGS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent Service Bookings</h3>
              <p className="text-xs text-slate-500">Booking Number | Service | Date | Status</p>
            </div>
            <Link
              to="/customer/bookings"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3 px-6">Booking Number</th>
                  <th className="py-3 px-6">Service</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Location</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.bookingNumber} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-700">
                      {b.bookingNumber}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {b.serviceName}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {b.serviceDate}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {b.serviceLocation}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      ₹{b.serviceAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/customer/tracking?id=${b.bookingNumber}`)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, Search, Stethoscope, ArrowRight, Clock, MapPin } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getBookings } from '../../utils/localStorage';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');

  const loadBookings = () => {
    setBookings(getBookings());
  };

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => loadBookings();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const filtered = bookings.filter(b => 
    b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    b.serviceLocation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-100 text-brand-700">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Service Reservations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              My Service Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Scheduled medical transportations, calibrations, and cold chain shipments.
            </p>
          </div>

          <Link
            to="/customer/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book New Service</span>
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
              placeholder="Search by booking #, service name, location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none shadow-xs"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">{filtered.length} bookings</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3.5 px-6">Booking ID</th>
                  <th className="py-3.5 px-6">Service</th>
                  <th className="py-3.5 px-6">Service Date</th>
                  <th className="py-3.5 px-6">Pickup / Base Location</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400 text-xs">
                      No matching service bookings found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.bookingNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">
                        {b.bookingNumber}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {b.serviceName}
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {b.serviceDate}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {b.serviceLocation}
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-bold">
                        ₹{b.serviceAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => navigate(`/customer/tracking?id=${b.bookingNumber}`)}
                          className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Details</span>
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

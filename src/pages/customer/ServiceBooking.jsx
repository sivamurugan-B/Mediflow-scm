import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  ArrowLeft, 
  CalendarCheck, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import { INITIAL_SERVICES } from '../../data/services';
import { generateBookingNumber } from '../../utils/generateNumbers';
import { saveBooking } from '../../utils/localStorage';

export default function ServiceBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected service passed via state or default to Cold Chain Transportation
  const passedService = location.state?.selectedService || INITIAL_SERVICES[0];

  const [selectedServiceId, setSelectedServiceId] = useState(passedService.id);
  const [selectedService, setSelectedService] = useState(passedService);

  const [formData, setFormData] = useState({
    customerName: 'Prof. Dr. A. V. Sharma',
    phone: '9840011223',
    email: 'sharma.apollo@medflow.org',
    serviceDate: '2026-09-10',
    serviceLocation: 'Chennai',
    destinationLocation: 'Apollo Hospital Biotech Wing, Bannerghatta Road, Bengaluru',
    additionalNotes: 'Requires strict 2°C to 8°C cold box telemetry with digital PDF logger graph certificate upon delivery.'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const found = INITIAL_SERVICES.find(s => s.id === selectedServiceId) || INITIAL_SERVICES[0];
    setSelectedService(found);
  }, [selectedServiceId]);

  const serviceAmount = selectedService?.serviceAmount || 5000;

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer Name is required.";
    if (!formData.phone.trim() || formData.phone.trim().length < 8) newErrors.phone = "Valid Phone number is required.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid Email is required.";
    if (!formData.serviceDate) newErrors.serviceDate = "Service Date is required.";
    if (!formData.serviceLocation.trim()) newErrors.serviceLocation = "Service Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const bookingNumber = generateBookingNumber();
    const newBooking = {
      bookingNumber,
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      serviceName: selectedService.name,
      serviceId: selectedService.id,
      serviceAmount: serviceAmount,
      serviceDate: formData.serviceDate,
      serviceLocation: formData.serviceLocation.trim(),
      destinationLocation: formData.destinationLocation.trim(),
      additionalNotes: formData.additionalNotes.trim(),
      status: "Booking Confirmed",
      bookingDate: new Date().toISOString().split('T')[0],
      duration: selectedService.duration,
      lastUpdated: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save to localStorage
    saveBooking(newBooking);

    // Navigate to confirmation page
    navigate('/customer/confirmation', {
      state: {
        type: 'service',
        booking: newBooking
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/customer/services')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Healthcare Services</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-700 via-brand-800 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-brand-500/30 text-brand-200">
                <Stethoscope className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                Specialized Logistics Booking
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Service Booking Form
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 mt-1">
              Schedule certified medical equipment transport, cold-chain courier, or technical maintenance.
            </p>
          </div>

          {/* Selected Service Highlight Card */}
          <div className="p-6 sm:p-8 border-b border-slate-200 bg-brand-50/40">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img 
                src={selectedService.image} 
                alt={selectedService.name}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                      {selectedService.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      {selectedService.duration}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Service Amount</span>
                    <span className="text-xl font-black text-brand-700">
                      ₹{serviceAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Service Dropdown */}
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                    Selected Service:
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {INITIAL_SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} (₹{srv.serviceAmount}) — {srv.duration}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {selectedService.description}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Customer / Professor Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Prof. Dr. A. V. Sharma"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 shadow-xs ${
                    errors.customerName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-brand-500'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.customerName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9840011223"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 shadow-xs ${
                    errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-brand-500'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. sharma.apollo@medflow.org"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 shadow-xs ${
                    errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-brand-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Service Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Date *
                </label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 shadow-xs ${
                    errors.serviceDate ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-brand-500'
                  }`}
                />
                {errors.serviceDate && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.serviceDate}
                  </p>
                )}
              </div>

              {/* Service Location / Pickup */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service / Pickup Location *
                </label>
                <input
                  type="text"
                  value={formData.serviceLocation}
                  onChange={(e) => setFormData({ ...formData, serviceLocation: e.target.value })}
                  placeholder="e.g. Chennai Central Hospital"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 shadow-xs ${
                    errors.serviceLocation ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-brand-500'
                  }`}
                />
                {errors.serviceLocation && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.serviceLocation}
                  </p>
                )}
              </div>

              {/* Destination Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Destination / Delivery Facility
                </label>
                <input
                  type="text"
                  value={formData.destinationLocation}
                  onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
                  placeholder="e.g. Bengaluru Apollo Biotech Lab"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                />
              </div>

            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Notes & SLA Directives
              </label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="Specify temperature range, sterile packing requirements, or equipment model..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>

            {/* Total Fee Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Service Fixed Rate (includes GPS & Telemetry):
                </span>
                <span className="text-sm font-semibold text-brand-300">
                  {selectedService.name} • {selectedService.duration}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Total Service Amount
                </span>
                <span className="text-3xl font-black text-brand-400 tracking-tight">
                  ₹{serviceAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Initial status: <strong>Booking Confirmed</strong></span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>BOOK SERVICE</span>
              </button>
            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

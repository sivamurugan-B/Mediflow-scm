import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, CheckCircle, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  const handleBookService = () => {
    navigate('/customer/service-booking', {
      state: { selectedService: service }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Service Header image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-75" />
        
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-teal-800 shadow-sm">
          {service.category}
        </span>

        {service.badge && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-600 text-white shadow-sm">
            {service.badge}
          </span>
        )}

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-teal-300" />
            <span>Duration: {service.duration}</span>
          </div>
          {service.rating && (
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{service.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
            {service.name}
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {service.description}
          </p>

          {/* Key Features */}
          {service.features && (
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              {service.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Booking */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Service Fee
            </span>
            <div className="text-xl font-black text-teal-700">
              ₹{service.serviceAmount?.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400 ml-1">/ booking</span>
            </div>
          </div>

          <button
            onClick={handleBookService}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-teal-600/25 hover:shadow-teal-600/40 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>BOOK SERVICE</span>
          </button>
        </div>
      </div>
    </div>
  );
}

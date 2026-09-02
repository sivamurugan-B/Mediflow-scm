import React, { useState } from 'react';
import { Stethoscope, Search, ShieldCheck, ThermometerSnowflake, Truck, Clock } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import ServiceCard from '../../components/ServiceCard';
import { INITIAL_SERVICES } from '../../data/services';

export default function HealthcareServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Specialized Transit', 'Heavy & Sensitive Logistics', 'Technical Services', 'Distribution Logistics', 'Critical Response', 'Warehousing', 'Field Operations'];

  const filteredServices = INITIAL_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-100 text-brand-700">
                <Stethoscope className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                Logistics & Technical Solutions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Healthcare Services
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Temperature-sensitive transit, biomedical calibration, emergency logistics, and GDP compliant warehousing.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <ThermometerSnowflake className="w-4 h-4 text-brand-600" />
            <span>Active Temperature Telemetry & 24/7 SLA Tracking</span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logistics services, SLAs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

      </main>
    </div>
  );
}

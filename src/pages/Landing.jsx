import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Truck, 
  UserCheck, 
  ShoppingBag, 
  Stethoscope, 
  Boxes, 
  Navigation, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ThermometerSnowflake, 
  Sparkles,
  Clock,
  Warehouse,
  FileText,
  ChevronRight
} from 'lucide-react';
import Header from '../components/Header';
import DemoResetBanner from '../components/DemoResetBanner';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: ShoppingBag,
      title: "Healthcare Products",
      desc: "Instant procurement catalog of hospital-grade consumables, surgical gloves, PPE kits, sterile syringes, and IV sets.",
      badge: "Institutional Supplies",
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Stethoscope,
      title: "Healthcare Services",
      desc: "Specialized cold-chain logistics (2°C - 8°C), medical equipment white-glove transit, NABL calibration, and emergency dispatch.",
      badge: "SLA Certified",
      color: "from-teal-600 to-emerald-600"
    },
    {
      icon: FileText,
      title: "Order Management",
      desc: "Dual-sided real-time ordering workflow linking institutional purchase orders directly to supplier fulfillment queues.",
      badge: "Live Status Sync",
      color: "from-sky-600 to-blue-700"
    },
    {
      icon: Navigation,
      title: "Supply Chain Tracking",
      desc: "End-to-end multi-checkpoint visibility from supplier QA, warehouse packing, and transit hubs to hospital ward delivery.",
      badge: "Telemetry & GPS",
      color: "from-indigo-600 to-purple-600"
    },
    {
      icon: Warehouse,
      title: "Supplier & Inventory",
      desc: "Automated SKU tracking, batch management, minimum reorder thresholds, and direct supplier procurement purchase orders.",
      badge: "WMS Integrated",
      color: "from-emerald-600 to-teal-700"
    },
    {
      icon: BarChart3,
      title: "Logistics Analytics",
      desc: "Comprehensive operations dashboard with on-time delivery rates, carrier performance, inventory turnover, and delay alerts.",
      badge: "Predictive BI",
      color: "from-amber-600 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Decorative Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-400/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Healthcare Products, Services & Supply Chain Management</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Smart Healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-600 to-brand-700">Logistics</span> & Supply Chain
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
              Order healthcare products, book healthcare services, and monitor the complete supply chain from supplier to hospital delivery in real-time.
            </p>

            {/* TWO LARGE PORTAL BUTTONS */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {/* Customer Portal Entry */}
              <Link
                to="/customer"
                className="group relative p-6 rounded-2xl bg-white border-2 border-teal-500/30 hover:border-teal-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col text-left overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-md shadow-teal-600/30">
                  <UserCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">Hospital & Academic</span>
                <h3 className="text-xl font-black text-slate-900 mt-1 flex items-center justify-between">
                  CUSTOMER / PROFESSOR PORTAL
                  <ArrowRight className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Browse products, book medical cold-chain logistics, place orders, and track your consignments.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
                  <span>Enter Customer Experience</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Supplier Portal Entry */}
              <Link
                to="/supplier"
                className="group relative p-6 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-brand-500 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col text-left overflow-hidden text-white"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-4 shadow-md shadow-brand-500/30">
                  <Truck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Warehouse & Dispatch</span>
                <h3 className="text-xl font-black text-white mt-1 flex items-center justify-between">
                  SUPPLIER PORTAL
                  <ArrowRight className="w-5 h-5 text-brand-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  Manage incoming hospital orders, adjust stock levels, dispatch shipments, and analyze operations.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs font-bold text-brand-400">
                  <span>Enter Supplier Operations</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm max-w-4xl mx-auto">
              <div className="text-center p-2">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">99.4%</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Cold Chain Integrity</div>
              </div>
              <div className="text-center p-2 border-l border-slate-200">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">8+ Hubs</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Distribution Network</div>
              </div>
              <div className="text-center p-2 sm:border-l border-slate-200">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">&lt; 4 Hours</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Critical Emergency SLA</div>
              </div>
              <div className="text-center p-2 border-l border-slate-200">
                <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Browser Local State</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Holistic SCM Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Designed for Resilient Healthcare Supply Chains
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Every stage of medical equipment transit and consumable supply chain synchronized seamlessly.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-7 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-brand-300 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-5 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center text-xs font-bold text-brand-600 group-hover:text-brand-700">
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* College Project Architecture Highlight */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-slate-800 px-3 py-1 rounded-full">
                College Project Evaluation Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3 text-white">
                Demonstrating Real-Time SCM Synchronization Without a Database
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                When a professor or customer places an order for <strong>Surgical Gloves</strong> in the Customer Portal:
              </p>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>A unique order number (e.g. <code>MED-ORD-2026-XXXX</code>) is generated and stored in browser <code>localStorage</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>The order automatically appears in the <strong>Supplier Orders</strong> operational queue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>When the supplier changes status to <strong>"Dispatched"</strong>, the Customer Tracking page immediately reflects the change!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Warehouse inventory automatically decrements and reflects in the low-stock alert thresholds.</span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/customer/products"
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Start Demo in Customer Portal
                </Link>
                <Link
                  to="/supplier/orders"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                >
                  Inspect Supplier Orders
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-bold text-slate-300">Live Dual-Portal Architecture</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">localStorage</span>
              </div>
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-teal-300">
                  <span className="text-slate-500">// Customer Action</span>
                  <div>Customer: Order 10x Surgical Gloves</div>
                  <div className="text-emerald-400">↳ saveOrder() → LocalStorage updated</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-brand-300">
                  <span className="text-slate-500">// Supplier Action</span>
                  <div>Supplier: Update Status → "Dispatched"</div>
                  <div className="text-emerald-400">↳ updateOrderStatus() → State synchronized</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-amber-300">
                  <span className="text-slate-500">// Real-time Reflection</span>
                  <div>Customer Tracking: Status = "Dispatched"</div>
                  <div className="text-emerald-400">✓ Visual timeline highlighted automatically</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="mt-auto bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-bold text-slate-900">MediFlow Healthcare Logistics</span>
                <p className="text-xs text-slate-500">College Academic Project in Logistics & Supply Chain Management</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <Link to="/customer" className="hover:text-brand-600">Customer Portal</Link>
              <Link to="/supplier" className="hover:text-brand-600">Supplier Portal</Link>
              <Link to="/supplier/dashboard" className="hover:text-brand-600">Logistics Analytics</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            © 2026 MediFlow SCM Prototype. Designed for Healthcare Supply Chain Research & Evaluation.
          </div>
        </div>
      </footer>
    </div>
  );
}

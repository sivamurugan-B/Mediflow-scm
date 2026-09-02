import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Clock, 
  RotateCw, 
  Truck, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Boxes,
  TrendingUp,
  MapPin,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import DashboardCard from '../../components/DashboardCard';
import StatusBadge from '../../components/StatusBadge';
import { getOrders, getInventory, getShipments, getSuppliers } from '../../utils/localStorage';

export default function LogisticsDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const loadAll = () => {
    setOrders(getOrders());
    setInventory(getInventory());
    setShipments(getShipments());
    setSuppliers(getSuppliers());
  };

  useEffect(() => {
    loadAll();
    const handleUpdate = () => loadAll();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  // Compute 8 KPI cards:
  // Total Orders: 245 + orders.length, Pending: 32, Processing: 27, In Transit: 48, Delivered: 165, Delayed: 8, Low Stock: 12
  const totalOrdersCount = 240 + orders.length;
  const pendingCount = 30 + orders.filter(o => ['new', 'confirmed', 'order confirmed'].includes(o.status?.toLowerCase())).length;
  const processingCount = 25 + orders.filter(o => ['processing', 'quality check', 'packed'].includes(o.status?.toLowerCase())).length;
  const activeShipmentsCount = 45 + shipments.filter(s => !['delivered', 'completed'].includes(s.status?.toLowerCase())).length;
  const inTransitCount = 42 + shipments.filter(s => s.status?.toLowerCase().includes('in transit')).length;
  const deliveredCount = 160 + shipments.filter(s => ['delivered', 'completed'].includes(s.status?.toLowerCase())).length;
  const delayedCount = 6 + shipments.filter(s => s.status?.toLowerCase().includes('delayed')).length;
  const lowStockCount = inventory.filter(i => i.stock <= i.reorderLevel).length;

  // Chart 1: Monthly Orders Data
  const monthlyOrdersData = [
    { month: 'Apr', regular: 120, emergency: 25, coldChain: 45 },
    { month: 'May', regular: 145, emergency: 30, coldChain: 55 },
    { month: 'Jun', regular: 160, emergency: 35, coldChain: 60 },
    { month: 'Jul', regular: 190, emergency: 40, coldChain: 75 },
    { month: 'Aug', regular: 220, emergency: 48, coldChain: 90 },
    { month: 'Sep', regular: 245, emergency: 52, coldChain: 110 },
  ];

  // Chart 2: Shipment Status Distribution (Donut Chart)
  const shipmentStatusData = [
    { name: 'Delivered', value: deliveredCount, color: '#10b981' },
    { name: 'In Transit', value: inTransitCount, color: '#0284c7' },
    { name: 'Processing / QC', value: processingCount, color: '#f59e0b' },
    { name: 'Delayed', value: delayedCount, color: '#ef4444' }
  ];

  // Chart 3: Inventory Levels (Bar Chart)
  const inventoryChartData = inventory.slice(0, 6).map(i => ({
    name: i.sku,
    Stock: i.stock,
    ReorderLevel: i.reorderLevel
  }));

  // Chart 4: Supplier Performance (Bar Chart)
  const supplierPerformanceChartData = [
    { supplier: 'MediSupply', onTimeRate: 98.5, orderVolume: 142 },
    { supplier: 'HealthCare Dist', onTimeRate: 94.2, orderVolume: 98 },
    { supplier: 'MedEquip India', onTimeRate: 96.0, orderVolume: 84 },
    { supplier: 'PharmaLogix', onTimeRate: 91.8, orderVolume: 65 }
  ];

  // Chart 5: Delivery Performance Trend
  const deliveryTrendData = [
    { week: 'Week 1', onTime: 96.2, target: 95 },
    { week: 'Week 2', onTime: 95.8, target: 95 },
    { week: 'Week 3', onTime: 97.4, target: 95 },
    { week: 'Week 4', onTime: 98.5, target: 95 },
    { week: 'Current', onTime: 98.2, target: 95 }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoResetBanner />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <SupplierSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-brand-100 text-brand-700">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Supply Chain Intelligence
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Logistics Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Real-time overview of healthcare supply-chain operations, cold-chain compliance, and fulfillment KPIs.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry Node Active: Telemetry Engine v2.6</span>
            </div>
          </div>

          {/* 8 DASHBOARD CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
            <DashboardCard
              title="Total Orders"
              value={totalOrdersCount}
              subtitle="245 baseline"
              icon={Package}
              theme="blue"
            />
            <DashboardCard
              title="Pending"
              value={pendingCount}
              subtitle="Awaiting allocation"
              icon={Clock}
              theme="amber"
            />
            <DashboardCard
              title="Processing"
              value={processingCount}
              subtitle="Picking & QC"
              icon={RotateCw}
              theme="teal"
            />
            <DashboardCard
              title="Active Shipments"
              value={activeShipmentsCount}
              subtitle="Linehaul + Local"
              icon={Truck}
              theme="blue"
            />
            <DashboardCard
              title="In Transit"
              value={inTransitCount}
              subtitle="On highways"
              icon={Navigation}
              theme="teal"
            />
            <DashboardCard
              title="Delivered"
              value={deliveredCount}
              subtitle="98.2% On-time"
              icon={CheckCircle2}
              theme="emerald"
            />
            <DashboardCard
              title="Delayed"
              value={delayedCount}
              subtitle="Monsoon route alert"
              icon={AlertCircle}
              theme="rose"
            />
            <DashboardCard
              title="Low Stock"
              value={lowStockCount}
              subtitle="Needs reorder"
              icon={AlertTriangle}
              theme="amber"
            />
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Monthly Orders */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">1. Monthly Orders Volume</h3>
                    <p className="text-xs text-slate-500">Regular vs. Emergency vs. Cold Chain requisitions</p>
                  </div>
                  <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    +18.4% MoM
                  </span>
                </div>

                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyOrdersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }} 
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="regular" name="Regular Orders" fill="#0284c7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="coldChain" name="Cold Chain (2-8°C)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="emergency" name="Emergency Logistics" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 2: Shipment Status Distribution (Donut Chart) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">2. Shipment Status Distribution</h3>
                    <p className="text-xs text-slate-500">Real-time status breakdown across all consignments</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Total: {deliveredCount + inTransitCount + processingCount + delayedCount}
                  </span>
                </div>

                <div className="mt-4 h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Pie
                        data={shipmentStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {shipmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Inventory Levels */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">3. Warehouse Inventory Levels</h3>
                    <p className="text-xs text-slate-500">Available Stock vs. Minimum Safety Reorder Threshold</p>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    6 Key SKUs
                  </span>
                </div>

                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="Stock" name="Available Stock" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ReorderLevel" name="Reorder Level" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 4: Supplier Performance */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">4. Supplier On-Time Performance %</h3>
                    <p className="text-xs text-slate-500">Contractual fulfillment reliability by supplier vendor</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Avg 95.1%
                  </span>
                </div>

                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierPerformanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="supplier" tick={{ fontSize: 10 }} />
                      <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="onTimeRate" name="On-Time Delivery %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* LOGISTICS DASHBOARD TABLES */}
          <div className="space-y-6">
            
            {/* Table 1: Recent Shipments */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Recent Shipments</h3>
                  <p className="text-xs text-slate-500">Shipment ID | Order Number | Product | Supplier | Warehouse | Current Location | Status | Estimated Delivery</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">Fleet Control</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-3 px-5">Shipment ID</th>
                      <th className="py-3 px-5">Order Number</th>
                      <th className="py-3 px-5">Product</th>
                      <th className="py-3 px-5">Supplier</th>
                      <th className="py-3 px-5">Warehouse</th>
                      <th className="py-3 px-5">Current Location</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Estimated Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shipments.map((s) => (
                      <tr key={s.shipmentId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-sky-800">{s.shipmentId}</td>
                        <td className="py-3.5 px-5 font-mono text-slate-600">{s.orderNumber}</td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">{s.product}</td>
                        <td className="py-3.5 px-5 text-slate-600">MediSupply Pvt Ltd</td>
                        <td className="py-3.5 px-5 text-slate-600">{s.warehouse}</td>
                        <td className="py-3.5 px-5 font-semibold text-teal-800">{s.currentLocation}</td>
                        <td className="py-3.5 px-5"><StatusBadge status={s.status} size="sm" /></td>
                        <td className="py-3.5 px-5 text-right font-semibold text-slate-800">{s.estimatedDelivery}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Two Columns: Table 2 (Inventory Overview) & Table 3 (Supplier Performance) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Table 2: Inventory Overview */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Inventory Overview</h3>
                  <p className="text-xs text-slate-500">Product | Stock | Reorder Level | Status</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-2.5 px-5">Product</th>
                        <th className="py-2.5 px-5">Stock</th>
                        <th className="py-2.5 px-5">Reorder Level</th>
                        <th className="py-2.5 px-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory.slice(0, 6).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-5 font-bold text-slate-800">
                            {item.product}
                            <span className="block font-mono text-[10px] text-slate-400">{item.sku}</span>
                          </td>
                          <td className="py-3 px-5 font-black text-slate-900">{item.stock} {item.unit}</td>
                          <td className="py-3 px-5 text-slate-600">{item.reorderLevel}</td>
                          <td className="py-3 px-5">
                            <StatusBadge status={item.stock === 0 ? "Out of Stock" : item.stock <= item.reorderLevel ? "Low Stock" : "In Stock"} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 3: Supplier Performance */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Supplier Performance Matrix</h3>
                  <p className="text-xs text-slate-500">Supplier | Orders | Delivered | Delayed | On-Time % | Performance</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-2.5 px-5">Supplier</th>
                        <th className="py-2.5 px-5">Orders</th>
                        <th className="py-2.5 px-5">Delivered</th>
                        <th className="py-2.5 px-5">Delayed</th>
                        <th className="py-2.5 px-5">On-Time %</th>
                        <th className="py-2.5 px-5">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {suppliers.map((sup) => (
                        <tr key={sup.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-5 font-bold text-slate-800">{sup.name}</td>
                          <td className="py-3 px-5 text-slate-700">{sup.ordersCount}</td>
                          <td className="py-3 px-5 text-emerald-700 font-bold">{Math.floor(sup.ordersCount * 0.96)}</td>
                          <td className="py-3 px-5 text-rose-600 font-bold">{Math.floor(sup.ordersCount * 0.04)}</td>
                          <td className="py-3 px-5 font-black text-brand-700">{sup.performance.split(' ')[0]}</td>
                          <td className="py-3 px-5"><StatusBadge status="Active" size="sm" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Table 4: Delivery Performance Summary */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">Delivery Performance Summary</h3>
                  <p className="text-xs text-slate-400">On-Time Deliveries | Delayed Deliveries | Average Delivery Time</p>
                </div>
                <span className="text-xs text-teal-400 font-mono font-bold">Aggregate 30-Day SLA</span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">On-Time Deliveries</span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{deliveredCount} (98.2%)</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Consignments reached destination within SLA window</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Delayed Deliveries</span>
                  <div className="text-3xl font-black text-rose-400 mt-1">{delayedCount} (1.8%)</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Attributed to monsoon flood diversion on NH-48</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Average Delivery Time</span>
                  <div className="text-3xl font-black text-teal-400 mt-1">26.4 Hours</div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Inter-state transit with real-time telematics</span>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

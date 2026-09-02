import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Check, 
  X, 
  ArrowUpDown, 
  Save, 
  RefreshCw,
  Warehouse,
  Barcode
} from 'lucide-react';
import SupplierSidebar from '../../components/SupplierSidebar';
import DemoResetBanner from '../../components/DemoResetBanner';
import StatusBadge from '../../components/StatusBadge';
import { getInventory, updateInventoryStock, addInventoryItem } from '../../utils/localStorage';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [newItem, setNewItem] = useState({
    product: '',
    sku: '',
    category: 'Surgical Supplies',
    stock: 500,
    reorderLevel: 200,
    unit: 'Boxes',
    warehouse: 'Chennai Central Warehouse',
    supplier: 'MediSupply Pvt Ltd',
    unitCost: 450
  });

  const loadInventory = () => {
    setInventory(getInventory());
  };

  useEffect(() => {
    loadInventory();
    const handleUpdate = () => loadInventory();
    window.addEventListener('mediflow_storage_update', handleUpdate);
    return () => window.removeEventListener('mediflow_storage_update', handleUpdate);
  }, []);

  const handleStockChange = (id, delta) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const nextStock = Math.max(0, item.stock + delta);
    updateInventoryStock(id, nextStock);
    showToast(`Updated ${item.product} stock to ${nextStock} units.`);
  };

  const handleDirectStockEdit = (id, value) => {
    const nextStock = Math.max(0, parseInt(value) || 0);
    updateInventoryStock(id, nextStock);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.product.trim()) return;

    addInventoryItem(newItem);
    setIsAddModalOpen(false);
    showToast(`Added new item ${newItem.product} to warehouse inventory!`);
    setNewItem({
      product: '',
      sku: '',
      category: 'Surgical Supplies',
      stock: 500,
      reorderLevel: 200,
      unit: 'Boxes',
      warehouse: 'Chennai Central Warehouse',
      supplier: 'MediSupply Pvt Ltd',
      unitCost: 450
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filtered = inventory.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(search.toLowerCase()) ||
                          item.sku.toLowerCase().includes(search.toLowerCase()) ||
                          item.warehouse.toLowerCase().includes(search.toLowerCase());
    
    let itemStatus = "In Stock";
    if (item.stock === 0) itemStatus = "Out of Stock";
    else if (item.stock <= item.reorderLevel) itemStatus = "Low Stock";

    const matchesFilter = filterStatus === 'All' || itemStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoResetBanner />
      
      <div className="flex-1 flex flex-col lg:flex-row">
        <SupplierSidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                  <Boxes className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Warehouse Stock Control
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Inventory Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Monitor available stock, reorder thresholds, SKU bin locations, and modify quantities interactively.
              </p>
            </div>

            {/* + ADD INVENTORY BUTTON */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD INVENTORY</span>
            </button>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow flex items-center justify-between">
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage(null)}><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SKU, product name, warehouse..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterStatus === st
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3.5 px-5">Product & SKU</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Available Stock</th>
                    <th className="py-3.5 px-5">Quick Adjust</th>
                    <th className="py-3.5 px-5">Reorder Level</th>
                    <th className="py-3.5 px-5">Warehouse & Zone</th>
                    <th className="py-3.5 px-5">Stock Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-400 text-xs">
                        No inventory records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => {
                      let statusText = "In Stock";
                      if (item.stock === 0) statusText = "Out of Stock";
                      else if (item.stock <= item.reorderLevel) statusText = "Low Stock";

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          
                          {/* Product & SKU */}
                          <td className="py-3.5 px-5">
                            <span className="font-bold text-slate-900 block text-sm">
                              {item.product}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-slate-400 font-mono text-[11px]">
                              <Barcode className="w-3.5 h-3.5" />
                              <span>SKU: {item.sku}</span>
                              {item.batchNumber && <span>• {item.batchNumber}</span>}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-5 text-slate-600 font-medium">
                            {item.category}
                          </td>

                          {/* Available Stock */}
                          <td className="py-3.5 px-5">
                            <span className={`text-base font-black ${
                              item.stock === 0 ? 'text-rose-600' : item.stock <= item.reorderLevel ? 'text-amber-600' : 'text-slate-900'
                            }`}>
                              {item.stock}
                            </span>
                            <span className="text-slate-400 text-xs ml-1">{item.unit || 'units'}</span>
                          </td>

                          {/* Quick Adjust Buttons */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStockChange(item.id, -50)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-xs"
                                title="Subtract 50 units"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={item.stock}
                                onChange={(e) => handleDirectStockEdit(item.id, e.target.value)}
                                className="w-16 px-1.5 py-0.5 rounded border border-slate-300 text-center font-bold text-xs"
                              />
                              <button
                                onClick={() => handleStockChange(item.id, 50)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-xs"
                                title="Add 50 units"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Reorder Level */}
                          <td className="py-3.5 px-5 text-slate-600 font-semibold">
                            {item.reorderLevel} {item.unit || 'units'}
                          </td>

                          {/* Warehouse & Zone */}
                          <td className="py-3.5 px-5 text-slate-600">
                            <span className="font-semibold text-slate-800 block">{item.warehouse}</span>
                            <span className="text-[11px] text-slate-400">{item.locationZone || "Aisle 3"}</span>
                          </td>

                          {/* Stock Status Badge */}
                          <td className="py-3.5 px-5">
                            <StatusBadge status={statusText} size="sm" />
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD INVENTORY MODAL */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-in">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-teal-600">
                      Warehouse Intake
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      + Add New Inventory SKU
                    </h3>
                  </div>
                  <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddItem} className="space-y-4 text-xs">
                  
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newItem.product}
                      onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                      placeholder="e.g. Sterile Cannula 18G"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        SKU Code
                      </label>
                      <input
                        type="text"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        placeholder="e.g. CN-018"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="Surgical Supplies">Surgical Supplies</option>
                        <option value="Infection Control">Infection Control</option>
                        <option value="Injection & Infusion">Injection & Infusion</option>
                        <option value="Wound Care">Wound Care</option>
                        <option value="Hospital Sanitation">Hospital Sanitation</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Initial Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newItem.stock}
                        onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Reorder Level
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItem.reorderLevel}
                        onChange={(e) => setNewItem({ ...newItem, reorderLevel: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={newItem.unit}
                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        placeholder="Boxes"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Warehouse Location
                    </label>
                    <select
                      value={newItem.warehouse}
                      onChange={(e) => setNewItem({ ...newItem, warehouse: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Chennai Central Warehouse">Chennai Central Warehouse</option>
                      <option value="Bengaluru Distribution Center">Bengaluru Distribution Center</option>
                      <option value="Hyderabad Logistics Hub">Hyderabad Logistics Hub</option>
                      <option value="Mumbai Port Terminal">Mumbai Port Terminal</option>
                    </select>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md"
                    >
                      Save to Inventory
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

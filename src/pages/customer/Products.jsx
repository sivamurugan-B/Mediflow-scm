import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import ProductCard from '../../components/ProductCard';
import { INITIAL_PRODUCTS } from '../../data/products';
import { getInventory } from '../../utils/localStorage';

export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync availableStock dynamically from inventory
  useEffect(() => {
    const updateWithInventory = () => {
      const inventory = getInventory();
      const updated = INITIAL_PRODUCTS.map(p => {
        const matchingInv = inventory.find(i => i.sku === p.sku);
        if (matchingInv) {
          return { ...p, availableStock: matchingInv.stock };
        }
        return p;
      });
      setProducts(updated);
    };

    updateWithInventory();
    window.addEventListener('mediflow_storage_update', updateWithInventory);
    return () => window.removeEventListener('mediflow_storage_update', updateWithInventory);
  }, []);

  const categories = ['All', 'Surgical Supplies', 'Infection Control', 'Injection & Infusion', 'Wound Care', 'Hospital Sanitation'];

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DemoResetBanner />
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Medical Supplies Catalog
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Healthcare Products
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Certified medical consumables and surgical equipment directly available for hospital dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>ISO 13485 & GMP Quality Assurance Verified</span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers, SKUs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 mt-6 p-8">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting "All" categories.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Package, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate('/customer/product-order', {
      state: { selectedProduct: product }
    });
  };

  const isLowStock = product.availableStock <= product.reorderLevel;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image Header */}
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
          {product.category}
        </span>

        {/* Badge or Stock alert */}
        {product.badge && (
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
            isLowStock 
              ? 'bg-amber-500 text-white' 
              : 'bg-teal-600 text-white'
          }`}>
            {product.badge}
          </span>
        )}

        <div className="absolute bottom-2.5 left-3 text-white">
          <span className="text-[11px] font-medium opacity-90">SKU: {product.sku}</span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors">
              {product.name}
            </h3>
          </div>
          
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Supplier:
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={product.supplier}>
                {product.supplier}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                Available Stock:
              </span>
              <span className={`font-semibold ${isLowStock ? 'text-amber-600 font-bold' : 'text-emerald-700'}`}>
                {product.availableStock} {product.unit || 'units'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing and Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Unit Amount
            </span>
            <div className="text-xl font-black text-teal-700">
              ₹{product.unitAmount?.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400 ml-1">/ unit</span>
            </div>
          </div>

          <button
            onClick={handleOrderNow}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-teal-600/25 hover:shadow-teal-600/40 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>ORDER NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Truck, 
  ShieldCheck, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';
import DemoResetBanner from '../../components/DemoResetBanner';
import { INITIAL_PRODUCTS } from '../../data/products';
import { generateOrderNumber } from '../../utils/generateNumbers';
import { saveOrder } from '../../utils/localStorage';

export default function ProductOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  // Selected product passed via state or default to first product (Surgical Gloves)
  const passedProduct = location.state?.selectedProduct || INITIAL_PRODUCTS[0];

  const [selectedProductId, setSelectedProductId] = useState(passedProduct.id);
  const [selectedProduct, setSelectedProduct] = useState(passedProduct);

  const [formData, setFormData] = useState({
    customerName: 'Prof. Dr. A. V. Sharma',
    phone: '9840011223',
    email: 'sharma.apollo@medflow.org',
    shippingAddress: 'Central Surgical Stores, Apollo Multispeciality Hospital, Bengaluru - 560076',
    quantity: 10
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const found = INITIAL_PRODUCTS.find(p => p.id === selectedProductId) || INITIAL_PRODUCTS[0];
    setSelectedProduct(found);
  }, [selectedProductId]);

  const unitAmount = selectedProduct?.unitAmount || 500;
  const quantity = Math.max(1, parseInt(formData.quantity) || 1);
  const totalAmount = unitAmount * quantity;

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer Name is required.";
    if (!formData.phone.trim() || formData.phone.trim().length < 8) newErrors.phone = "Valid Phone Number is required.";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid Email address is required.";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderNumber = generateOrderNumber();
    const newOrder = {
      orderNumber,
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      productName: selectedProduct.name,
      productId: selectedProduct.id,
      unitAmount: unitAmount,
      quantity: quantity,
      totalAmount: totalAmount,
      supplier: selectedProduct.supplier || "MediSupply Pvt Ltd",
      warehouse: selectedProduct.warehouse || "Chennai Central Warehouse",
      currentLocation: selectedProduct.warehouse || "Chennai Central Warehouse",
      shippingAddress: formData.shippingAddress || "Hospital Central Pharmacy Dock",
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "Order Confirmed",
      lastUpdated: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save to localStorage (which also updates shipments & inventory)
    saveOrder(newOrder);

    // Navigate to confirmation page
    navigate('/customer/confirmation', {
      state: {
        type: 'product',
        order: newOrder
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
          onClick={() => navigate('/customer/products')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-700 to-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-teal-500/30 text-teal-200">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Purchase Order Requisition
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              Product Order
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              Verify requisition details and submit to trigger real-time supplier order dispatch.
            </p>
          </div>

          {/* Selected Product Highlight Card */}
          <div className="p-6 sm:p-8 border-b border-slate-200 bg-teal-50/40">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {selectedProduct.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      SKU: {selectedProduct.sku}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Unit Amount</span>
                    <span className="text-xl font-black text-teal-700">
                      ₹{unitAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Change Product Dropdown */}
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                    Selected Product:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {INITIAL_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (₹{prod.unitAmount} / unit) — {prod.supplier}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Supplier: <strong>{selectedProduct.supplier}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    Dispatch: <strong>{selectedProduct.warehouse}</strong>
                  </span>
                </div>
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
                    errors.customerName ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-teal-500'
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
                    errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Address */}
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
                    errors.email ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quantity (Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold text-teal-800 focus:outline-none focus:ring-2 shadow-xs ${
                    errors.quantity ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
                {errors.quantity && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.quantity}
                  </p>
                )}
              </div>

            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hospital / Institution Delivery Address
              </label>
              <textarea
                rows={2}
                value={formData.shippingAddress}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                placeholder="Enter hospital wing, department, and receiving bay address..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
              />
            </div>

            {/* Automatic Total Calculation Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Automatic Live Calculation:
                </span>
                <span className="text-sm font-semibold text-teal-300">
                  ₹{unitAmount.toLocaleString('en-IN')} × {quantity} units
                </span>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Total Payable Amount
                </span>
                <span className="text-3xl font-black text-teal-400 tracking-tight">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Immediate status: <strong>Order Confirmed</strong> (Syncs to Supplier)</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 transition-all flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4" />
                <span>ORDER NOW</span>
              </button>
            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

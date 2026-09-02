import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeStorage } from './utils/localStorage';

// Landing Page
import Landing from './pages/Landing';

// Customer Portal Pages
import CustomerHome from './pages/customer/CustomerHome';
import Products from './pages/customer/Products';
import HealthcareServices from './pages/customer/HealthcareServices';
import ProductOrder from './pages/customer/ProductOrder';
import ServiceBooking from './pages/customer/ServiceBooking';
import Confirmation from './pages/customer/Confirmation';
import Tracking from './pages/customer/Tracking';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyOrders from './pages/customer/MyOrders';
import MyBookings from './pages/customer/MyBookings';

// Supplier Portal Pages
import SupplierHome from './pages/supplier/SupplierHome';
import SupplierOrders from './pages/supplier/SupplierOrders';
import Inventory from './pages/supplier/Inventory';
import Procurement from './pages/supplier/Procurement';
import Shipments from './pages/supplier/Shipments';
import SupplyChainTracking from './pages/supplier/SupplyChainTracking';
import LogisticsDashboard from './pages/supplier/LogisticsDashboard';

export default function App() {
  useEffect(() => {
    // Ensure initial realistic demo data is loaded in localStorage
    initializeStorage();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Landing Route */}
        <Route path="/" element={<Landing />} />

        {/* Customer / Professor Portal Routes */}
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/customer/products" element={<Products />} />
        <Route path="/customer/services" element={<HealthcareServices />} />
        <Route path="/customer/product-order" element={<ProductOrder />} />
        <Route path="/customer/service-booking" element={<ServiceBooking />} />
        <Route path="/customer/confirmation" element={<Confirmation />} />
        <Route path="/customer/tracking" element={<Tracking />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/orders" element={<MyOrders />} />
        <Route path="/customer/bookings" element={<MyBookings />} />

        {/* Supplier Portal Routes */}
        <Route path="/supplier" element={<SupplierHome />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/supplier/inventory" element={<Inventory />} />
        <Route path="/supplier/procurement" element={<Procurement />} />
        <Route path="/supplier/shipments" element={<Shipments />} />
        <Route path="/supplier/tracking" element={<SupplyChainTracking />} />
        <Route path="/supplier/dashboard" element={<LogisticsDashboard />} />

        {/* Fallback to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

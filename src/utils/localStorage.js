import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_SERVICES } from '../data/services';
import { INITIAL_ORDERS, INITIAL_BOOKINGS } from '../data/orders';
import { INITIAL_INVENTORY } from '../data/inventory';
import { INITIAL_SHIPMENTS } from '../data/shipments';
import { INITIAL_SUPPLIERS, INITIAL_PROCUREMENT_ORDERS } from '../data/suppliers';

const STORAGE_KEYS = {
  PRODUCTS: 'mediflow_products',
  SERVICES: 'mediflow_services',
  ORDERS: 'mediflow_orders',
  BOOKINGS: 'mediflow_bookings',
  INVENTORY: 'mediflow_inventory',
  SHIPMENTS: 'mediflow_shipments',
  SUPPLIERS: 'mediflow_suppliers',
  PROCUREMENT: 'mediflow_procurement',
  INITIALIZED: 'mediflow_initialized_v2'
};

// Dispatch custom event so listening components update immediately
function notifyStorageUpdate(key, data) {
  window.dispatchEvent(new CustomEvent('mediflow_storage_update', {
    detail: { key, data }
  }));
}

// Initialize seed data if not yet present in localStorage
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInit) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    localStorage.setItem(STORAGE_KEYS.PROCUREMENT, JSON.stringify(INITIAL_PROCUREMENT_ORDERS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

// Reset data back to default demo state
export function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(INITIAL_SHIPMENTS));
  localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
  localStorage.setItem(STORAGE_KEYS.PROCUREMENT, JSON.stringify(INITIAL_PROCUREMENT_ORDERS));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

  notifyStorageUpdate('ALL', null);
}

// --- ORDERS ---
export function getOrders() {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  } catch (e) {
    console.error("Error reading orders:", e);
    return INITIAL_ORDERS;
  }
}

export function saveOrder(order) {
  const orders = getOrders();
  const updatedOrders = [order, ...orders];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

  // Also auto-create or link corresponding shipment in shipments collection
  const shipments = getShipments();
  const newShipment = {
    shipmentId: `SHIP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    orderNumber: order.orderNumber,
    customer: order.customerName,
    contactPerson: order.customerName,
    phone: order.phone,
    email: order.email,
    product: order.productName,
    quantity: order.quantity,
    unit: "Units",
    warehouse: order.warehouse || "Chennai Central Warehouse",
    origin: order.warehouse || "Chennai Central Warehouse",
    destination: order.shippingAddress || "Regional Consignee Depot",
    currentLocation: order.warehouse || "Chennai Central Warehouse",
    transportMode: "Road Express",
    carrier: "MediExpress Logistics",
    vehicleNumber: "TN-02-CP-9021",
    driverName: "Logistics Dispatch Desk",
    orderDate: order.orderDate,
    dispatchDate: "Scheduled for Next Business Day",
    estimatedDelivery: order.estimatedDelivery || "4 Business Days",
    status: order.status || "Order Confirmed",
    temperature: "Ambient (20-25°C)",
    humidity: "48% RH",
    stages: [
      { id: 1, name: "Order Placed", stageName: "Order Received", status: "completed", timestamp: `${new Date().toLocaleDateString('en-GB')} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, location: "Customer Portal", remarks: "Digital order captured" },
      { id: 2, name: "Order Confirmed", stageName: "Order Confirmed", status: "current", timestamp: `${new Date().toLocaleDateString('en-GB')} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, location: order.warehouse || "Central Warehouse", remarks: "Inventory allocated" },
      { id: 3, name: "Processing", stageName: "Pick & Pack", status: "pending", timestamp: "Pending", location: order.warehouse || "Central Warehouse", remarks: "Waiting for batch pick" },
      { id: 4, name: "Quality Check", stageName: "QA Inspection", status: "pending", timestamp: "Pending", location: "QA Bay", remarks: "Scheduled" },
      { id: 5, name: "Packed", stageName: "Packed", status: "pending", timestamp: "Pending", location: "Packing Dock", remarks: "Scheduled" },
      { id: 6, name: "Dispatched", stageName: "Carrier Dispatch", status: "pending", timestamp: "Pending", location: "Outbound Bay", remarks: "Scheduled" },
      { id: 7, name: "In Transit", stageName: "Transit Hub", status: "pending", timestamp: "Pending", location: "En Route", remarks: "Scheduled" },
      { id: 8, name: "Out for Delivery", stageName: "Last Mile", status: "pending", timestamp: "Pending", location: "Local Station", remarks: "Scheduled" },
      { id: 9, name: "Delivered", stageName: "Delivered", status: "pending", timestamp: "Pending", location: "Customer Destination", remarks: "Scheduled" }
    ]
  };
  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify([newShipment, ...shipments]));

  // Adjust stock in inventory if matching product
  const inventory = getInventory();
  const updatedInv = inventory.map(item => {
    if (item.product.toLowerCase().includes(order.productName.toLowerCase()) || order.productName.toLowerCase().includes(item.product.toLowerCase())) {
      const nextStock = Math.max(0, item.stock - Number(order.quantity));
      return { ...item, stock: nextStock };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updatedInv));

  notifyStorageUpdate(STORAGE_KEYS.ORDERS, updatedOrders);
  notifyStorageUpdate(STORAGE_KEYS.SHIPMENTS, [newShipment, ...shipments]);
  notifyStorageUpdate(STORAGE_KEYS.INVENTORY, updatedInv);

  return order;
}

export function updateOrderStatus(orderNumber, newStatus, remarks = "") {
  const orders = getOrders();
  const updatedOrders = orders.map(o => {
    if (o.orderNumber === orderNumber) {
      return {
        ...o,
        status: newStatus,
        lastUpdated: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: remarks || o.notes
      };
    }
    return o;
  });
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

  // Sync to shipments as well
  const shipments = getShipments();
  const updatedShipments = shipments.map(s => {
    if (s.orderNumber === orderNumber) {
      // Map stages
      const stages = s.stages.map(st => {
        if (st.name === newStatus) {
          return { ...st, status: 'current', timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), remarks: remarks || st.remarks };
        }
        return st;
      });
      return {
        ...s,
        status: newStatus,
        stages
      };
    }
    return s;
  });
  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(updatedShipments));

  notifyStorageUpdate(STORAGE_KEYS.ORDERS, updatedOrders);
  notifyStorageUpdate(STORAGE_KEYS.SHIPMENTS, updatedShipments);

  return updatedOrders;
}

// --- BOOKINGS ---
export function getBookings() {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : INITIAL_BOOKINGS;
  } catch (e) {
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking) {
  const bookings = getBookings();
  const updatedBookings = [booking, ...bookings];
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
  notifyStorageUpdate(STORAGE_KEYS.BOOKINGS, updatedBookings);
  return booking;
}

export function updateBookingStatus(bookingNumber, newStatus) {
  const bookings = getBookings();
  const updated = bookings.map(b => b.bookingNumber === bookingNumber ? { ...b, status: newStatus } : b);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  notifyStorageUpdate(STORAGE_KEYS.BOOKINGS, updated);
  return updated;
}

// --- INVENTORY ---
export function getInventory() {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : INITIAL_INVENTORY;
  } catch (e) {
    return INITIAL_INVENTORY;
  }
}

export function updateInventoryStock(id, newStock) {
  const inventory = getInventory();
  const updated = inventory.map(item => {
    if (item.id === id || item.sku === id) {
      return { ...item, stock: Math.max(0, parseInt(newStock) || 0) };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
  notifyStorageUpdate(STORAGE_KEYS.INVENTORY, updated);
  return updated;
}

export function addInventoryItem(newItem) {
  const inventory = getInventory();
  const itemWithId = {
    id: `inv-${Date.now()}`,
    sku: newItem.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    ...newItem,
    stock: parseInt(newItem.stock) || 0,
    reorderLevel: parseInt(newItem.reorderLevel) || 100
  };
  const updated = [itemWithId, ...inventory];
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
  notifyStorageUpdate(STORAGE_KEYS.INVENTORY, updated);
  return updated;
}

// --- SHIPMENTS ---
export function getShipments() {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SHIPMENTS);
    return data ? JSON.parse(data) : INITIAL_SHIPMENTS;
  } catch (e) {
    return INITIAL_SHIPMENTS;
  }
}

export function updateShipmentStatus(shipmentId, newStatus, currentLocation, remarks) {
  const shipments = getShipments();
  let targetOrderNumber = null;
  const updated = shipments.map(s => {
    if (s.shipmentId === shipmentId) {
      targetOrderNumber = s.orderNumber;
      return {
        ...s,
        status: newStatus,
        currentLocation: currentLocation || s.currentLocation
      };
    }
    return s;
  });
  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(updated));

  if (targetOrderNumber) {
    // Also update order status in orders collection
    const orders = getOrders();
    const updatedOrders = orders.map(o => o.orderNumber === targetOrderNumber ? { ...o, status: newStatus, currentLocation: currentLocation || o.currentLocation } : o);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    notifyStorageUpdate(STORAGE_KEYS.ORDERS, updatedOrders);
  }

  notifyStorageUpdate(STORAGE_KEYS.SHIPMENTS, updated);
  return updated;
}

// --- SUPPLIERS & PROCUREMENT ---
export function getSuppliers() {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return data ? JSON.parse(data) : INITIAL_SUPPLIERS;
  } catch (e) {
    return INITIAL_SUPPLIERS;
  }
}

export function getProcurementOrders() {
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROCUREMENT);
    return data ? JSON.parse(data) : INITIAL_PROCUREMENT_ORDERS;
  } catch (e) {
    return INITIAL_PROCUREMENT_ORDERS;
  }
}

export function updateProcurementStatus(poNumber, newStatus) {
  const orders = getProcurementOrders();
  const updated = orders.map(po => po.poNumber === poNumber ? { ...po, status: newStatus } : po);
  localStorage.setItem(STORAGE_KEYS.PROCUREMENT, JSON.stringify(updated));
  notifyStorageUpdate(STORAGE_KEYS.PROCUREMENT, updated);
  return updated;
}

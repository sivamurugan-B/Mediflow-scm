// Unique ID generators for MediFlow

export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MED-ORD-${year}-${randomNum}`;
}

export function generateBookingNumber() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MED-SRV-${year}-${randomNum}`;
}

export function generateShipmentId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SHIP-${year}-${randomNum}`;
}

export function generatePONumber() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}-${randomNum}`;
}

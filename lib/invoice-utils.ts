export function generateInvoiceNumber() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  const random = Math.floor(100 + Math.random() * 900);

  return `KRT-${year}${month}${day}-${random}`;
}
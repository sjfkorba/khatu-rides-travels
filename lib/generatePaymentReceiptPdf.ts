import jsPDF from "jspdf";

export type PaymentReceiptData = {
  bookingNumber: string;
  bookingType?: string;

  customerName: string;
  customerMobile: string;

  paymentId?: string;
  paymentDate: string;
  paymentMode: string;
  transactionId?: string;
  amount: number;

  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;

  note?: string;
};

const BRAND = {
  navy: [5, 27, 58] as [number, number, number],
  blue: [6, 59, 143] as [number, number, number],
  yellow: [255, 193, 7] as [number, number, number],
  lightYellow: [255, 248, 225] as [number, number, number],
  lightBlue: [241, 246, 255] as [number, number, number],
  light: [247, 249, 252] as [number, number, number],
  border: [221, 226, 233] as [number, number, number],
  text: [15, 23, 42] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [22, 163, 74] as [number, number, number],
};

function money(value: number) {
  return `Rs. ${Math.round(
    Number(value || 0)
  ).toLocaleString("en-IN")}`;
}

function safe(value: unknown) {
  return String(value ?? "").trim() || "-";
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
   LOAD IMAGE
============================================================ */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () =>
      reject(new Error(`Unable to load image: ${src}`));

    image.src = src;
  });
}

/* ============================================================
   ADD LOGO
============================================================ */

async function addLogo(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number
) {
  try {
    const logo = await loadImage("/logo.png");

    doc.addImage(
      logo,
      "PNG",
      x,
      y,
      width,
      height,
      undefined,
      "FAST"
    );

    return true;
  } catch (error) {
    console.warn(
      "Khatu Rides logo could not be loaded:",
      error
    );

    return false;
  }
}

/* ============================================================
   SMALL LABEL
============================================================ */

function label(
  doc: jsPDF,
  text: string,
  x: number,
  y: number
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.muted);
  doc.text(text.toUpperCase(), x, y);
}

/* ============================================================
   FIELD
============================================================ */

function field(
  doc: jsPDF,
  title: string,
  value: string,
  x: number,
  y: number,
  width: number
) {
  label(doc, title, x, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.text);

  const lines = doc.splitTextToSize(
    safe(value),
    width
  );

  doc.text(lines, x, y + 7);

  return lines.length;
}

/* ============================================================
   PDF GENERATOR
============================================================ */

export async function generatePaymentReceiptPdf(
  data: PaymentReceiptData
) {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  const left = 15;
  const right = 195;
  const contentWidth = 180;

  /* ==========================================================
     PAGE BACKGROUND
  ========================================================== */

  doc.setFillColor(250, 251, 253);
  doc.rect(
    0,
    0,
    pageWidth,
    pageHeight,
    "F"
  );

  /* ==========================================================
     TOP BRAND HEADER
  ========================================================== */

  doc.setFillColor(...BRAND.navy);

  doc.roundedRect(
    10,
    10,
    190,
    51,
    5,
    5,
    "F"
  );

  /* Logo white container */

  doc.setFillColor(...BRAND.white);

  doc.roundedRect(
    17,
    17,
    38,
    32,
    4,
    4,
    "F"
  );

  await addLogo(
    doc,
    20,
    20,
    32,
    26
  );

  /* Brand name */

  doc.setTextColor(...BRAND.white);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text(
    "KHATU RIDES",
    64,
    25
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "TRAVELS CO.",
    64,
    32
  );

  doc.setFontSize(7.5);

  doc.text(
    "Reliable Cab & Travel Services",
    64,
    41
  );

  doc.text(
    "Korba, Chhattisgarh  |  +91 92441 37353",
    64,
    48
  );

  /* Receipt title on right */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text(
    "PAYMENT",
    188,
    27,
    { align: "right" }
  );

  doc.setTextColor(...BRAND.yellow);

  doc.setFontSize(12);

  doc.text(
    "RECEIPT",
    188,
    35,
    { align: "right" }
  );

  doc.setTextColor(...BRAND.white);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  doc.text(
    "OFFICIAL PAYMENT ACKNOWLEDGEMENT",
    188,
    45,
    { align: "right" }
  );

  /* ==========================================================
     RECEIPT META
  ========================================================== */

  let y = 73;

  doc.setTextColor(...BRAND.text);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    "RECEIPT DETAILS",
    left,
    y
  );

  y += 6;

  doc.setDrawColor(...BRAND.border);

  doc.setLineWidth(0.35);

  doc.line(
    left,
    y,
    right,
    y
  );

  y += 12;

  const col1 = 15;
  const col2 = 105;

  field(
    doc,
    "Receipt ID",
    data.paymentId || "Generated Payment Receipt",
    col1,
    y,
    78
  );

  field(
    doc,
    "Payment Date",
    formatDate(data.paymentDate),
    col2,
    y,
    75
  );

  y += 18;

  field(
    doc,
    "Payment Mode",
    data.paymentMode,
    col1,
    y,
    78
  );

  field(
    doc,
    "Transaction / Reference",
    data.transactionId || "Not provided",
    col2,
    y,
    75
  );

  /* ==========================================================
     CUSTOMER + BOOKING
  ========================================================== */

  y += 25;

  doc.setFillColor(...BRAND.white);

  doc.roundedRect(
    left,
    y,
    contentWidth,
    48,
    4,
    4,
    "F"
  );

  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.35);

  doc.roundedRect(
    left,
    y,
    contentWidth,
    48,
    4,
    4,
    "S"
  );

  /* Header */

  doc.setFillColor(...BRAND.lightBlue);

  doc.roundedRect(
    left,
    y,
    contentWidth,
    12,
    4,
    4,
    "F"
  );

  doc.setFillColor(...BRAND.lightBlue);

  doc.rect(
    left,
    y + 7,
    contentWidth,
    5,
    "F"
  );

  doc.setTextColor(...BRAND.navy);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "CUSTOMER & BOOKING",
    left + 7,
    y + 8
  );

  /* Customer */

  field(
    doc,
    "Customer Name",
    data.customerName,
    left + 7,
    y + 21,
    75
  );

  field(
    doc,
    "Mobile Number",
    data.customerMobile,
    left + 7,
    y + 35,
    75
  );

  /* Booking */

  field(
    doc,
    "Booking Number",
    data.bookingNumber,
    108,
    y + 21,
    78
  );

  field(
    doc,
    "Booking Type",
    data.bookingType || "Advance Booking",
    108,
    y + 35,
    78
  );

  /* ==========================================================
     PAYMENT RECEIVED HERO
  ========================================================== */

  y += 61;

  doc.setFillColor(...BRAND.yellow);

  doc.roundedRect(
    left,
    y,
    contentWidth,
    45,
    5,
    5,
    "F"
  );

  /* Accent stripe */

  doc.setFillColor(...BRAND.navy);

  doc.roundedRect(
    left,
    y,
    5,
    45,
    2,
    2,
    "F"
  );

  doc.setTextColor(...BRAND.navy);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "PAYMENT RECEIVED",
    left + 13,
    y + 13
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);

  doc.text(
    money(data.amount),
    right - 8,
    y + 22,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  doc.text(
    "Amount received towards this booking",
    left + 13,
    y + 27
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    `Payment Mode: ${safe(data.paymentMode)}`,
    left + 13,
    y + 37
  );

  /* ==========================================================
     PAYMENT SUMMARY
  ========================================================== */

  y += 57;

  doc.setTextColor(...BRAND.text);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    "BOOKING PAYMENT SUMMARY",
    left,
    y
  );

  y += 8;

  /* Summary box */

  doc.setFillColor(...BRAND.white);

  doc.roundedRect(
    left,
    y,
    contentWidth,
    53,
    4,
    4,
    "F"
  );

  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.35);

  doc.roundedRect(
    left,
    y,
    contentWidth,
    53,
    4,
    4,
    "S"
  );

  /* Total */

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);

  doc.text(
    "Total Booking Amount",
    left + 8,
    y + 13
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND.text);

  doc.text(
    money(data.totalAmount),
    right - 8,
    y + 13,
    { align: "right" }
  );

  /* Paid */

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND.muted);

  doc.text(
    "Total Paid",
    left + 8,
    y + 27
  );

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND.green);

  doc.text(
    money(data.paidAmount),
    right - 8,
    y + 27,
    { align: "right" }
  );

  /* Separator */

  doc.setDrawColor(...BRAND.border);

  doc.line(
    left + 8,
    y + 33,
    right - 8,
    y + 33
  );

  /* Balance */

  doc.setFillColor(...BRAND.lightYellow);

  doc.roundedRect(
    left + 5,
    y + 37,
    contentWidth - 10,
    12,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.setTextColor(...BRAND.navy);

  doc.text(
    "BALANCE DUE",
    left + 11,
    y + 45
  );

  doc.setFontSize(11);

  doc.text(
    money(data.balanceAmount),
    right - 11,
    y + 45,
    { align: "right" }
  );

  /* ==========================================================
     NOTE
  ========================================================== */

  if (data.note) {
    y += 65;

    doc.setFillColor(...BRAND.light);

    const noteLines = doc.splitTextToSize(
      data.note,
      164
    );

    const noteHeight = Math.min(
      Math.max(25, noteLines.length * 5 + 15),
      45
    );

    doc.roundedRect(
      left,
      y,
      contentWidth,
      noteHeight,
      4,
      4,
      "F"
    );

    doc.setTextColor(...BRAND.navy);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(
      "NOTE",
      left + 8,
      y + 9
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const visibleLines =
      noteLines.slice(0, 5);

    doc.text(
      visibleLines,
      left + 8,
      y + 17
    );
  }

  /* ==========================================================
     FOOTER
  ========================================================== */

  const footerY = 267;

  doc.setFillColor(...BRAND.navy);

  doc.roundedRect(
    10,
    footerY,
    190,
    20,
    4,
    4,
    "F"
  );

  doc.setTextColor(...BRAND.yellow);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "KHATU RIDES TRAVELS CO.",
    20,
    footerY + 8
  );

  doc.setTextColor(...BRAND.white);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  doc.text(
    "Thank you for choosing us for your travel needs.",
    20,
    footerY + 14
  );

  doc.text(
    "www.khaturidescg.in  |  +91 92441 37353",
    190,
    footerY + 11,
    { align: "right" }
  );

  /* ==========================================================
     DOCUMENT FOOTNOTE
  ========================================================== */

  doc.setTextColor(...BRAND.muted);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);

  doc.text(
    "This receipt acknowledges the payment received against the booking mentioned above.",
    105,
    294,
    { align: "center" }
  );

  return doc;
}

/* ============================================================
   DOWNLOAD
============================================================ */

export async function downloadPaymentReceiptPdf(
  data: PaymentReceiptData
) {
  const doc =
    await generatePaymentReceiptPdf(data);

  const reference =
    data.paymentId ||
    data.bookingNumber ||
    "Booking";

  const filename =
    `Khatu-Rides-Payment-Receipt-${reference}.pdf`;

  doc.save(filename);
}
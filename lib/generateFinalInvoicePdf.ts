import jsPDF from "jspdf";

type VehicleLine = {
  vehicleType?: string;
  variant?: string;
  quantity?: number;
  ratePerVehicle?: number;
  total?: number;
};

type Payment = {
  id?: string;
  amount?: number;
  paymentDate?: string;
  paymentMode?: string;
  transactionId?: string;
  note?: string;
};

export type FinalInvoiceData = {
  bookingNumber: string;
  bookingType?: string;
  bookingDate?: string;
  journeyDate?: string;
  pickupTime?: string;

  customerName: string;
  customerMobile: string;

  pickupLocation: string;
  dropLocation: string;

  vehicles: VehicleLine[];

  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;

  status?: string;
  remarks?: string;

  payments?: Payment[];
};

const COMPANY = {
  name: "KHATU RIDES TRAVELS CO.",
  tagline: "Reliable Cab & Travel Services",
  phone: "+91 92441 37353",
  website: "www.khaturidescg.in",
  location: "Korba, Chhattisgarh",
};

function money(value: number) {
  return `Rs. ${Math.round(Number(value || 0)).toLocaleString("en-IN")}`;
}

function safe(value: unknown) {
  return String(value ?? "").trim() || "-";
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight = 5
) {
  const lines = doc.splitTextToSize(text, width);

  doc.text(lines, x, y);

  return y + lines.length * lineHeight;
}

export function generateFinalInvoicePdf(data: FinalInvoiceData) {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  let y = 14;

  /*
   * HEADER
   */

  doc.setFillColor(5, 27, 58);
  doc.rect(0, 0, pageWidth, 39, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(COMPANY.name, margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(COMPANY.tagline, margin, 22);

  doc.setFontSize(8);
  doc.text(COMPANY.location, margin, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("FINAL INVOICE", pageWidth - margin, 16, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    `Booking No: ${safe(data.bookingNumber)}`,
    pageWidth - margin,
    23,
    { align: "right" }
  );

  doc.text(
    `Booking Date: ${formatDate(data.bookingDate)}`,
    pageWidth - margin,
    29,
    { align: "right" }
  );

  y = 48;

  /*
   * CUSTOMER + JOURNEY
   */

  doc.setTextColor(5, 27, 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER DETAILS", margin, y);

  doc.text("JOURNEY DETAILS", 108, y);

  y += 7;

  doc.setDrawColor(220, 225, 232);
  doc.line(margin, y - 3, 96, y - 3);
  doc.line(108, y - 3, pageWidth - margin, y - 3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(safe(data.customerName), margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(`Mobile: ${safe(data.customerMobile)}`, margin, y + 6);

  doc.text(
    `Booking Type: ${safe(data.bookingType)}`,
    margin,
    y + 12
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("Pickup", 108, y);
  doc.text("Drop", 108, y + 8);

  doc.setFont("helvetica", "normal");

  y = addWrappedText(
    doc,
    safe(data.pickupLocation),
    128,
    y,
    62,
    4.5
  );

  y = addWrappedText(
    doc,
    safe(data.dropLocation),
    128,
    y + 3,
    62,
    4.5
  );

  doc.text(
    `Journey Date: ${formatDate(data.journeyDate)}`,
    108,
    y + 5
  );

  doc.text(
    `Pickup Time: ${safe(data.pickupTime)}`,
    108,
    y + 11
  );

  y = Math.max(y + 18, 91);

  /*
   * VEHICLE TABLE
   */

  doc.setFillColor(5, 27, 58);
  doc.roundedRect(margin, y, contentWidth, 9, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("VEHICLE / SERVICE", margin + 4, y + 6);
  doc.text("QTY", 122, y + 6, { align: "center" });
  doc.text("RATE", 151, y + 6, { align: "right" });
  doc.text("AMOUNT", 192, y + 6, { align: "right" });

  y += 9;

  doc.setTextColor(20, 30, 45);

  const vehicles = Array.isArray(data.vehicles)
    ? data.vehicles
    : [];

  vehicles.forEach((vehicle) => {
    const vehicleName = [
      safe(vehicle.vehicleType),
      vehicle.variant && vehicle.variant !== "-"
        ? `(${vehicle.variant})`
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    const quantity = Number(vehicle.quantity || 0);
    const rate = Number(vehicle.ratePerVehicle || 0);
    const total = Number(vehicle.total || quantity * rate);

    doc.setDrawColor(225, 229, 235);
    doc.line(margin, y + 9, pageWidth - margin, y + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text(vehicleName, margin + 4, y + 6);

    doc.setFont("helvetica", "normal");

    doc.text(String(quantity), 122, y + 6, {
      align: "center",
    });

    doc.text(money(rate), 151, y + 6, {
      align: "right",
    });

    doc.setFont("helvetica", "bold");

    doc.text(money(total), 192, y + 6, {
      align: "right",
    });

    y += 10;
  });

  if (!vehicles.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Travel Service", margin + 4, y + 6);
    y += 10;
  }

  y += 8;

  /*
   * PAYMENT SUMMARY
   */

  const summaryX = 115;
  const summaryWidth = 81;

  doc.setFillColor(247, 249, 252);
  doc.roundedRect(
    summaryX,
    y,
    summaryWidth,
    48,
    3,
    3,
    "F"
  );

  doc.setTextColor(5, 27, 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PAYMENT SUMMARY", summaryX + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text("Total Amount", summaryX + 5, y + 17);
  doc.text(
    money(data.totalAmount),
    summaryX + summaryWidth - 5,
    y + 17,
    { align: "right" }
  );

  doc.text("Paid Amount", summaryX + 5, y + 26);

  doc.setFont("helvetica", "bold");
  doc.text(
    money(data.paidAmount),
    summaryX + summaryWidth - 5,
    y + 26,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.text("Balance Due", summaryX + 5, y + 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    money(data.balanceAmount),
    summaryX + summaryWidth - 5,
    y + 35,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `Status: ${safe(data.status)}`,
    summaryX + 5,
    y + 43
  );

  /*
   * PAYMENT HISTORY
   */

  y += 58;

  const payments = Array.isArray(data.payments)
    ? data.payments
    : [];

  if (payments.length > 0) {
    doc.setTextColor(5, 27, 58);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PAYMENT HISTORY", margin, y);

    y += 7;

    doc.setFillColor(5, 27, 58);
    doc.rect(margin, y, contentWidth, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);

    doc.text("DATE", margin + 3, y + 5);
    doc.text("MODE", 62, y + 5);
    doc.text("REFERENCE", 101, y + 5);
    doc.text("AMOUNT", 192, y + 5, {
      align: "right",
    });

    y += 8;

    payments.forEach((payment) => {
      doc.setTextColor(25, 35, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);

      doc.text(
        formatDate(payment.paymentDate),
        margin + 3,
        y + 5
      );

      doc.text(
        safe(payment.paymentMode),
        62,
        y + 5
      );

      doc.text(
        safe(payment.transactionId),
        101,
        y + 5
      );

      doc.setFont("helvetica", "bold");

      doc.text(
        money(Number(payment.amount || 0)),
        192,
        y + 5,
        { align: "right" }
      );

      doc.setDrawColor(225, 229, 235);
      doc.line(margin, y + 8, pageWidth - margin, y + 8);

      y += 9;
    });

    y += 7;
  }

  /*
   * REMARKS
   */

  if (data.remarks) {
    doc.setTextColor(5, 27, 58);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("NOTES / REMARKS", margin, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    y = addWrappedText(
      doc,
      data.remarks,
      margin,
      y,
      100,
      4.5
    );

    y += 5;
  }

  /*
   * TERMS
   */

  if (y > 245) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(5, 27, 58);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("IMPORTANT INFORMATION", margin, y);

  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  const terms = [
    "This invoice is generated against the above travel booking.",
    "Any additional toll, parking, permit or other applicable charges may be payable separately unless included in the booking.",
    "Please retain this invoice/payment record for your reference.",
    "For booking support, contact Khatu Rides Travels Co.",
  ];

  terms.forEach((term) => {
    y = addWrappedText(
      doc,
      `• ${term}`,
      margin,
      y,
      contentWidth,
      4
    );

    y += 1;
  });

  /*
   * FOOTER
   */

  doc.setFillColor(5, 27, 58);
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "Thank you for travelling with Khatu Rides!",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text(
    `${COMPANY.phone}  •  ${COMPANY.website}`,
    pageWidth / 2,
    pageHeight - 9,
    { align: "center" }
  );

  return doc;
}

export function downloadFinalInvoicePdf(data: FinalInvoiceData) {
  const doc = generateFinalInvoicePdf(data);

  const filename =
    `Khatu-Rides-Final-Invoice-${data.bookingNumber || "Booking"}.pdf`;

  doc.save(filename);
}
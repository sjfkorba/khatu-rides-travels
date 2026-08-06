// lib/generateInvoicePdf.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Helper for converting numbers to English words (Indian numbering system)
const convertNumberToWords = (num: number): string => {
  if (num <= 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const numToWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + numToWords(n % 10000000) : "");
  };

  return `${numToWords(Math.floor(num))} Rupees Only`;
};

export const generateTravelInvoicePdf = (receiptData: any) => {
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Premium Dark Theme Colors
    const bgDark = [26, 32, 44];         // Main background (Dark slate)
    const cardBg = [45, 55, 72];         // Card background
    const navyDeep = [15, 23, 42];       // Table Header
    const orange = [249, 115, 22];       // Brand Orange
    const textMain = [247, 250, 252];    // White/Light Gray
    const textMuted = [160, 174, 192];   // Muted Gray
    const borderDark = [74, 85, 104];    // Borders

    // Financial Data
    const totalGrossFare = Number(receiptData?.totalFare || receiptData?.amount || 1999);
    const advancePaid = Number(receiptData?.amount || 1);
    const discountUsed = Number(receiptData?.discountUsed || 0);
    const balanceDue = Math.max(0, totalGrossFare - advancePaid - discountUsed);

    // Cab assignment
    const assignedCab = receiptData?.vehicleLabel || receiptData?.vehicle || "";
    const isCabAssigned = assignedCab && assignedCab !== "Currently cab not assigned" && assignedCab !== "N/A";
    const vehicleDisplay = isCabAssigned ? assignedCab.replace(/ \(.*\)/, "") : "Maruti Suzuki Entra";

    // Date formatting
    const rawDate = receiptData?.date || "07/09/2026";
    const formattedDate = rawDate.includes("-") ? rawDate.split("-").reverse().join("/") : rawDate;

    // 1. Page background
    doc.setFillColor(bgDark[0], bgDark[1], bgDark[2]);
    doc.rect(0, 0, 210, 297, "F");

    // 2. Header Section
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("KHATU RIDES", 14, 22);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("Premium Intercity Car Service | Travels Co.", 14, 28);

    // Header Contact Info (Left)
    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text("Search    :", 14, 38);
    doc.text("Email       :", 14, 43);
    doc.text("Support   :", 14, 48);

    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.text("Premium Intercity Car Service", 32, 38);
    doc.text("+91 797644783", 32, 43);
    doc.text("+91 94360 1130", 32, 48);

    // 3. Tax Invoice Badge (Top Right)
    doc.setFillColor(textMain[0], textMain[1], textMain[2]);
    doc.roundedRect(130, 12, 66, 16, 2, 2, "F");
    doc.setTextColor(15, 23, 42); // Dark text for light badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TAX INVOICE", 163, 18, { align: "center" });
    
    // Booking confirmed small inner badge
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(130, 21, 66, 7, 2, 2, "F");
    doc.setFontSize(7.5);
    doc.text("✓ BOOKING CONFIRMED", 163, 26, { align: "center" });

    // Invoice Meta Card (Right)
    doc.setFillColor(textMain[0], textMain[1], textMain[2]);
    doc.roundedRect(130, 32, 66, 18, 2, 2, "F");
    doc.setTextColor(45, 55, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Invoice No: KRLS${receiptData?.invoiceId || "31206"}`, 133, 37);
    doc.text(`Date          : ${formattedDate}`, 133, 42);
    doc.text(`Time          : ${receiptData?.time || "11:30"}`, 133, 47);

    // Divider
    doc.setDrawColor(borderDark[0], borderDark[1], borderDark[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 55, 196, 55);

    // Tagline
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text("Safe Journey • Happy Memories • Verified Intercity Cabs", 105, 61, { align: "center" });

    // Status Pills
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(28, 65, 40, 7, 3.5, 3.5, "F");
    doc.roundedRect(72, 65, 34, 7, 3.5, 3.5, "F");
    doc.setTextColor(253, 230, 138); // Yellowish
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text("BOOKING CONFIRMED", 48, 69.6, { align: "center" });
    doc.setTextColor(147, 197, 253); // Blueish
    doc.text("PARTIALLY PAID", 89, 69.6, { align: "center" });

    // 4. MAIN CARDS: Customer & Trip (Dark Theme)
    const cardY = 75;
    
    // Customer Card
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.setDrawColor(borderDark[0], borderDark[1], borderDark[2]);
    doc.roundedRect(14, cardY, 90, 43, 3, 3, "FD");
    
    doc.setDrawColor(borderDark[0], borderDark[1], borderDark[2]);
    doc.line(14, cardY + 9, 104, cardY + 9); // Header line
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("CUSTOMER DETAILS", 18, cardY + 6);

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const customerName = receiptData?.customerName || "Pramod Sharma";
    const customerPhone = receiptData?.customerPhone || "+47 767644783";
    const pickupLocation = receiptData?.pickup || "Korba, Chhattisgarh, India";

    doc.text("Customer Name", 18, cardY + 16);
    doc.text("Customer Contact", 18, cardY + 23);
    doc.text("Pickup Location", 18, cardY + 30);
    doc.text("Pickup Date & Time", 18, cardY + 37);

    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.text(customerName, 50, cardY + 16);
    doc.text(customerPhone, 50, cardY + 23);
    doc.text(pickupLocation, 50, cardY + 30);
    doc.text(`${receiptData?.phone || "97693668"} / ${receiptData?.time || "11:30"}`, 50, cardY + 37);

    // Trip Details Card
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(106, cardY, 90, 43, 3, 3, "FD");
    doc.line(106, cardY + 9, 196, cardY + 9); // Header line
    
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFontSize(8.5);
    doc.text("TRIP DETAILS", 110, cardY + 6);

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Drop Location", 110, cardY + 16);
    doc.text("Vehicle Type", 110, cardY + 23);
    doc.text("Cab assignment", 110, cardY + 30);
    doc.text("Payment Mode", 110, cardY + 37);

    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.text(receiptData?.drop || "Champa, Chhattisgarh, India", 140, cardY + 16);
    doc.text(vehicleDisplay, 140, cardY + 23);
    doc.text(vehicleDisplay, 140, cardY + 30);
    doc.text(receiptData?.paymentMode || "*1 TRIAL ADVANCE", 140, cardY + 37);

    // 5. FARE SUMMARY
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(14, 126, 42, 7, 3.5, 3.5, "F");
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("FARE SUMMARY", 22, 131);

    const tableBody: any[] = [];
    tableBody.push([
      `Contract Fixed Fare Booking Model (${receiptData?.bookingType === "roundtrip" ? "Round Trip" : "One Way"})`,
      "",
      `* ${totalGrossFare.toLocaleString("en-IN")}.00`
    ]);
    tableBody.push(["State Toll Taxes & Border Entry Clearance Charges", "", "Included in Contract"]);
    tableBody.push(["Night Hailing & Order Parka Packages", "", "Included in Contract"]);

    autoTable(doc, {
      startY: 136,
      theme: "grid",
      head: [["PARTICULARS DESCRIPTION", "DETAILS", "AMOUNT (INR)"]],
      headStyles: {
        fillColor: [45, 55, 72],
        textColor: [247, 250, 252],
        fontStyle: "bold",
        fontSize: 8,
        lineColor: [74, 85, 104],
        lineWidth: 0.1
      },
      styles: {
        fillColor: [26, 32, 44],
        textColor: [247, 250, 252],
        fontSize: 8,
        cellPadding: 4,
        lineColor: [74, 85, 104],
        lineWidth: 0.1
      },
      body: tableBody,
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 30, halign: "center" },
        2: { halign: "right", cellWidth: 52, fontStyle: "bold", textColor: [253, 230, 138] }
      },
      alternateRowStyles: { fillColor: [26, 32, 44] } // Keep consistent dark bg
    });

    const finalTableY = (doc as any).lastAutoTable.finalY;

    // 6. Financial Summary Box (Orange Border on Right)
    doc.setDrawColor(orange[0], orange[1], orange[2]);
    doc.setFillColor(textMain[0], textMain[1], textMain[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(118, finalTableY + 6, 78, 22, 2, 2, "FD");

    doc.setTextColor(45, 55, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Gross Trip Fare", 122, finalTableY + 11);
    doc.text(`Rs. ${totalGrossFare.toLocaleString("en-IN")}.00`, 192, finalTableY + 11, { align: "right" });

    doc.text("Advance Paid Driver", 122, finalTableY + 16);
    doc.text(`Rs. ${advancePaid.toLocaleString("en-IN")}.00`, 192, finalTableY + 16, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BALANCE DUE TO DRIVER:", 122, finalTableY + 23);
    doc.text(`Rs. ${balanceDue.toLocaleString("en-IN")}.00`, 192, finalTableY + 23, { align: "right" });

    // Total Fare Text (Left)
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("TOTAL FARE & SETTLEMENT", 14, finalTableY + 14);

    // 7. Amount in words strip & Net Payable
    const wordsBoxY = finalTableY + 31;
    doc.setDrawColor(orange[0], orange[1], orange[2]);
    doc.setFillColor(textMain[0], textMain[1], textMain[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(14, wordsBoxY, 182, 14, 2, 2, "FD");

    doc.setTextColor(45, 55, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("AMOUNT IN WORDS (ENGLISH)", 17, wordsBoxY + 5);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(convertNumberToWords(totalGrossFare), 17, wordsBoxY + 10);

    // Split block for Net Payable
    doc.setDrawColor(orange[0], orange[1], orange[2]);
    doc.line(130, wordsBoxY, 130, wordsBoxY + 14);
    
    doc.setTextColor(45, 55, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("NET PAYABLE", 133, wordsBoxY + 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Rs. ${totalGrossFare.toLocaleString("en-IN")}.00`, 133, wordsBoxY + 10);

    // 8. Bottom Note & Terms
    const bottomY = wordsBoxY + 20;
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(48, bottomY, 112, 7, 3.5, 3.5, "F");
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Note: This is a computer generated invoice. No GET applicable.", 104, bottomY + 4.5, { align: "center" });

    const termsY = bottomY + 12;
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("TERMS & CONDITIONS", 46, termsY, { align: "center" });

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("* This bill is valid for the mentioned trip manifest only.", 14, termsY + 6);
    doc.text("* This voucher first milestone drop cancellations.", 14, termsY + 10);
    doc.text("* For support call +91 babel bdfstal or visit www.khaturrides.in.", 14, termsY + 14);

    // Signature
    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("AUTHORIZED SIGNATURE", 170, termsY, { align: "center" });

    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.text("Khatu Rides", 170, termsY + 12, { align: "center" });

    // 9. Premium Footer Banner (QR Code & Promo)
    const footerY = 250;
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(14, footerY, 182, 32, 4, 4, "F");
    
    // QR Code Placeholder (Draw a white box with a pattern to mimic QR)
    doc.setFillColor(255, 255, 255);
    doc.rect(20, footerY + 4, 24, 24, "F");
    doc.setFillColor(0, 0, 0);
    doc.rect(22, footerY + 6, 4, 4, "F");
    doc.rect(38, footerY + 6, 4, 4, "F");
    doc.rect(22, footerY + 22, 4, 4, "F");
    doc.rect(28, footerY + 12, 10, 10, "F"); // Center block

    doc.setTextColor(textMain[0], textMain[1], textMain[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Scan for Future\nBookings & Reviews", 52, footerY + 14);

    // Right side App placeholder
    doc.setFillColor(bgDark[0], bgDark[1], bgDark[2]);
    doc.roundedRect(140, footerY + 4, 50, 24, 2, 2, "F");
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFontSize(8);
    doc.text("[ App UI Graphic Placeholder ]", 165, footerY + 16, { align: "center" });

    // 10. Bottom-most strip
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Trusted Rides, On Time, Every Time.", 14, 290);
    doc.text("ASP Support: +91 5767 6783", 105, 290, { align: "center" });
    doc.text("www.khaturides.in", 196, 290, { align: "right" });

    // Filename save
    const cleanCustomerName = (receiptData?.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
    const cleanInvoiceId = (receiptData?.invoiceId || "KRLS").replace(/[^a-zA-Z0-9]/g, "_");
    doc.save(`Khatu_Rides_Premium_Bill_${cleanCustomerName}_${cleanInvoiceId}.pdf`);

  } catch (err) {
    console.error("Error generating online travel invoice PDF:", err);
    alert("Error building premium canvas layout.");
  }
};
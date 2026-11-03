
import { jsPDF } from "jspdf";

export type BookingTicketData = {
  bookingId: string;
  passenger: {
    name: string;
    mobile: string;
    email: string;
  };
  pickup: string;
  drop: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string | null;
  returnTime?: string | null;
  bookingType: string;
  vehicleLabel: string;
  distanceKm: number;
  totalFare: number;
  advancePaid: number;
  remainingFare: number;
  paymentId: string;
};

// ==================================================
// KHATU RIDES - PREMIUM E-TICKET V2
// Design: Modern Mobility / Premium Travel Pass
// Format: A5 Portrait
// ==================================================

const C = {
  navy: [15, 23, 42] as const,
  navy2: [30, 41, 59] as const,
  black: [17, 24, 39] as const,
  white: [255, 255, 255] as const,
  green: [5, 150, 105] as const,
  greenLight: [236, 253, 245] as const,
  gray: [107, 114, 128] as const,
  grayDark: [71, 85, 105] as const,
  grayLight: [226, 232, 240] as const,
  background: [248, 250, 252] as const,
  blue: [37, 99, 235] as const,
  red: [220, 38, 38] as const,
};

const money = (value: number) =>
  "Rs. " +
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

// ==================================================
// LOGO LOADER
// ==================================================

function loadLogo(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);

    img.src = "/nav_logo.png";
  });
}

// ==================================================
// MAIN PDF GENERATOR
// ==================================================

export async function downloadBookingTicket(
  booking: BookingTicketData
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
    compress: true,
  });

  const W = 148;
  const H = 210;

  const M = 11;
  const CW = W - M * 2;
  const R = W - M;

  const logo = await loadLogo();

  // ------------------------------------------------
  // BASIC HELPERS
  // ------------------------------------------------

  const fill = (color: readonly number[]) => {
    pdf.setFillColor(color[0], color[1], color[2]);
  };

  const stroke = (color: readonly number[]) => {
    pdf.setDrawColor(color[0], color[1], color[2]);
  };

  const write = (
    value: string,
    x: number,
    y: number,
    size = 8,
    color: readonly number[] = C.black,
    bold = false,
    align: "left" | "center" | "right" = "left"
  ) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);

    pdf.setTextColor(color[0], color[1], color[2]);

    pdf.text(String(value || "-"), x, y, {
      align,
    });
  };

  const roundedCard = (
    x: number,
    y: number,
    w: number,
    h: number,
    background: readonly number[] = C.white
  ) => {
    fill(background);
    stroke(C.grayLight);

    pdf.setLineWidth(0.25);

    pdf.roundedRect(
      x,
      y,
      w,
      h,
      2,
      2,
      "FD"
    );
  };

  const divider = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    stroke(C.grayLight);
    pdf.setLineWidth(0.25);

    pdf.line(x1, y1, x2, y2);
  };

  const label = (
    value: string,
    x: number,
    y: number
  ) => {
    write(
      value.toUpperCase(),
      x,
      y,
      5.3,
      C.gray,
      true
    );
  };

  const value = (
    content: string,
    x: number,
    y: number,
    maxWidth: number,
    size = 8,
    maxLines = 2
  ) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(size);

    const lines = pdf
      .splitTextToSize(String(content || "-"), maxWidth)
      .slice(0, maxLines);

    pdf.setTextColor(C.black[0], C.black[1], C.black[2]);

    pdf.text(lines, x, y);

    return lines.length;
  };

  const field = (
    title: string,
    content: string,
    x: number,
    y: number,
    width: number,
    size = 8
  ) => {
    label(title, x, y);

    value(
      content,
      x,
      y + 4.5,
      width,
      size,
      2
    );
  };

  const section = (
    number: string,
    title: string,
    y: number
  ) => {
    write(
      number,
      M,
      y,
      7,
      C.green,
      true
    );

    write(
      title.toUpperCase(),
      M + 6,
      y,
      7,
      C.navy,
      true
    );
  };

  // ------------------------------------------------
  // BACKGROUND
  // ------------------------------------------------

  fill(C.background);
  pdf.rect(0, 0, W, H, "F");

  // ------------------------------------------------
  // 1. PREMIUM HEADER
  // ------------------------------------------------

  fill(C.navy);
  pdf.rect(0, 0, W, 36, "F");

  // Brand accent
  fill(C.green);
  pdf.rect(0, 0, W, 2, "F");

  // Logo
  if (logo) {
    try {
      const imageInfo = pdf.getImageProperties(logo);

      const maxW = 21;
      const maxH = 21;

      const ratio = Math.min(
        maxW / imageInfo.width,
        maxH / imageInfo.height
      );

      const logoW = imageInfo.width * ratio;
      const logoH = imageInfo.height * ratio;

      pdf.addImage(
        logo,
        "PNG",
        M,
        7,
        logoW,
        logoH,
        undefined,
        "FAST"
      );
    } catch (error) {
      console.warn("Ticket logo error:", error);
    }
  }

  const brandX = logo ? M + 24 : M;

  write(
    "KHATU RIDES",
    brandX,
    14,
    14,
    C.white,
    true
  );

  write(
    "TRAVELS CO.",
    brandX,
    19,
    5.5,
    [203, 213, 225],
    true
  );

  write(
    "PREMIUM CAB SERVICES",
    brandX,
    26,
    6,
    [203, 213, 225]
  );

  // Booking reference
  write(
    "BOOKING REFERENCE",
    R,
    8,
    5,
    [203, 213, 225],
    true,
    "right"
  );

  write(
    booking.bookingId,
    R,
    14,
    8,
    C.white,
    true,
    "right"
  );

  // Confirmation badge
  fill(C.green);
  pdf.roundedRect(
    M,
    29,
    34,
    5,
    2.5,
    2.5,
    "F"
  );

  write(
    "CONFIRMED",
    M + 17,
    32.5,
    5.5,
    C.white,
    true,
    "center"
  );

  write(
    "YOUR JOURNEY STARTS HERE",
    R,
    32.5,
    5.2,
    [203, 213, 225],
    true,
    "right"
  );

  // ------------------------------------------------
  // 2. PASSENGER DETAILS
  // ------------------------------------------------

  section("01", "PASSENGER DETAILS", 43);

  roundedCard(M, 47, CW, 25);

  // Passenger name
  field(
    "PASSENGER NAME",
    booking.passenger.name,
    M + 5,
    54,
    55,
    8
  );

  // Mobile
  field(
    "MOBILE NUMBER",
    booking.passenger.mobile,
    M + 70,
    54,
    47,
    8
  );

  // Email
  field(
    "EMAIL ADDRESS",
    booking.passenger.email,
    M + 5,
    65,
    CW - 10,
    7
  );

  // ------------------------------------------------
  // 3. JOURNEY DETAILS
  // ------------------------------------------------

  section("02", "JOURNEY DETAILS", 80);

  const isReturn = Boolean(booking.returnDate);

  const journeyY = 84;
  const journeyH = 72;

  roundedCard(
    M,
    journeyY,
    CW,
    journeyH
  );

  // Route timeline
  const routeX = M + 9;

  // Pickup marker
  stroke(C.green);
  pdf.setLineWidth(0.8);

  pdf.circle(
    routeX,
    journeyY + 10,
    1.6,
    "S"
  );

  // Timeline line
  stroke(C.grayLight);

  pdf.setLineWidth(0.8);

  pdf.line(
    routeX,
    journeyY + 12,
    routeX,
    journeyY + 34
  );

  // Drop marker
  fill(C.navy);

  pdf.circle(
    routeX,
    journeyY + 36,
    1.6,
    "F"
  );

  // Pickup
  label(
    "PICKUP LOCATION",
    M + 17,
    journeyY + 9
  );

  value(
    booking.pickup,
    M + 17,
    journeyY + 14,
    CW - 24,
    8,
    2
  );

  // Drop
  label(
    "DROP LOCATION",
    M + 17,
    journeyY + 30
  );

  value(
    booking.drop || "Local Rental",
    M + 17,
    journeyY + 35,
    CW - 24,
    8,
    2
  );

  // Horizontal separator
  divider(
    M + 4,
    journeyY + 42,
    R - 4,
    journeyY + 42
  );

  // Information panel
  fill(C.background);

  pdf.rect(
    M + 0.3,
    journeyY + 42.2,
    CW - 0.6,
    29.5,
    "F"
  );

  const x1 = M + 5;
  const x2 = M + CW / 2 + 2;
  const colW = CW / 2 - 10;

  // Pickup and return dates
  field(
    "PICKUP DATE & TIME",
    `${booking.pickupDate} | ${booking.pickupTime}`,
    x1,
    journeyY + 50,
    colW,
    7
  );

  if (isReturn) {
    field(
      "RETURN DATE & TIME",
      `${booking.returnDate} | ${booking.returnTime || "-"}`,
      x2,
      journeyY + 50,
      colW,
      7
    );

    field(
      "ASSIGNED VEHICLE",
      booking.vehicleLabel,
      x1,
      journeyY + 63,
      colW,
      7
    );

    field(
      "TRIP DISTANCE",
      `${booking.distanceKm} KM`,
      x2,
      journeyY + 63,
      colW,
      7
    );
  } else {
    field(
      "ASSIGNED VEHICLE",
      booking.vehicleLabel,
      x1,
      journeyY + 63,
      colW,
      7
    );

    field(
      "TRIP DISTANCE",
      `${booking.distanceKm} KM`,
      x2,
      journeyY + 63,
      colW,
      7
    );
  }

  // ------------------------------------------------
  // 4. PAYMENT SUMMARY
  // ------------------------------------------------

  section("03", "PAYMENT SUMMARY", 163);

  roundedCard(
    M,
    167,
    CW,
    31
  );

  // Total fare
  write(
    "TOTAL TRIP FARE",
    M + 5,
    174,
    7.5,
    C.black
  );

  write(
    money(booking.totalFare),
    R - 5,
    174,
    9,
    C.navy,
    true,
    "right"
  );

  // Advance
  write(
    "ADVANCE PAID",
    M + 5,
    182,
    7.5,
    C.gray
  );

  write(
    money(booking.advancePaid),
    R - 5,
    182,
    9,
    C.green,
    true,
    "right"
  );

  // Balance block
  fill(C.navy);

  pdf.roundedRect(
    M + 0.3,
    185,
    CW - 0.6,
    10,
    1.5,
    1.5,
    "F"
  );

  write(
    "BALANCE PAYABLE",
    M + 5,
    191.5,
    7,
    C.white,
    true
  );

  write(
    money(booking.remainingFare),
    R - 5,
    192,
    10,
    C.white,
    true,
    "right"
  );

  // Payment reference
  if (booking.paymentId) {
    write(
      `Payment Ref: ${booking.paymentId}`,
      M + 5,
      196.5,
      4.5,
      C.gray
    );
  }

  // ------------------------------------------------
  // 5. FOOTER
  // ------------------------------------------------

  divider(
    M,
    202,
    R,
    202
  );

  write(
    "THANK YOU FOR CHOOSING KHATU RIDES!",
    W / 2,
    206,
    7,
    C.navy,
    true,
    "center"
  );

  write(
    "24x7 Support: 9244137353",
    W / 2,
    209,
    5.5,
    C.gray,
    false,
    "center"
  );

  // ------------------------------------------------
  // 6. BOTTOM BRAND ACCENT
  // ------------------------------------------------

  fill(C.green);
  pdf.rect(0, H - 1.5, W, 1.5, "F");

  // ------------------------------------------------
  // 7. PDF METADATA & DOWNLOAD
  // ------------------------------------------------

  const safeId = booking.bookingId.replace(
    /[^a-zA-Z0-9-_]/g,
    ""
  );

  pdf.setProperties({
    title: `Khatu Rides Premium Ticket - ${booking.bookingId}`,
    subject: "Cab Booking Confirmation",
    author: "Khatu Rides Travels Co.",
    creator: "Khatu Rides",
  });

  pdf.save(
    `Khatu-Rides-Ticket-${safeId || "Booking"}.pdf`
  );
}

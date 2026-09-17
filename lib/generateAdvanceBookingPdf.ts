import { jsPDF } from "jspdf";

/* ============================================================
   TYPES
============================================================ */

export type AdvanceBookingPdfVehicle = {
  vehicleType?: string;
  variant?: string;
  quantity?: number | string;
  ratePerVehicle?: number | string;
  total?: number | string;
};

export type AdvanceBookingPdfData = {
  bookingNumber?: string;
  bookingType?: string;

  bookingDate?: string;
  journeyDate?: string;
  pickupTime?: string;

  customerName?: string;
  customerMobile?: string;

  pickupLocation?: string;
  dropLocation?: string;

  vehicles?: AdvanceBookingPdfVehicle[];

  totalVehicles?: number | string;
  totalAmount?: number | string;
  advanceAmount?: number | string;
  balanceAmount?: number | string;

  status?: string;
  remarks?: string;
};

/* ============================================================
   TYPES
============================================================ */

type RGB = [number, number, number];

type TextOptions = {
  size?: number;
  color?: RGB;
  bold?: boolean;
  align?: "left" | "center" | "right";
};

/* ============================================================
   COLORS
============================================================ */

const C = {
  navy: [5, 24, 52] as RGB,
  navy2: [7, 32, 68] as RGB,
  blue: [7, 67, 150] as RGB,
  blueLight: [237, 245, 255] as RGB,

  amber: [245, 180, 0] as RGB,
  amberDark: [165, 112, 0] as RGB,
  amberLight: [255, 249, 231] as RGB,

  green: [18, 145, 83] as RGB,
  greenLight: [235, 249, 241] as RGB,

  red: [214, 55, 55] as RGB,
  redLight: [255, 241, 241] as RGB,

  white: [255, 255, 255] as RGB,

  slate950: [15, 23, 42] as RGB,
  slate800: [30, 41, 59] as RGB,
  slate700: [51, 65, 85] as RGB,
  slate600: [71, 85, 105] as RGB,
  slate500: [100, 116, 139] as RGB,
  slate400: [148, 163, 184] as RGB,
  slate300: [203, 213, 225] as RGB,
  slate200: [226, 232, 240] as RGB,
  slate100: [241, 245, 249] as RGB,
  slate50: [248, 250, 252] as RGB,
};

/* ============================================================
   A4
============================================================ */

const PAGE_W = 210;
const PAGE_H = 297;

const MARGIN = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;

/*
 * Main single-page content normally finishes above this area.
 */
const CONTENT_BOTTOM = 283;

/* ============================================================
   HELPERS
============================================================ */

function num(value: number | string | undefined): number {
  const n = Number(
    String(value ?? "")
      .replace(/,/g, "")
      .trim()
  );

  return Number.isFinite(n) ? n : 0;
}

function clean(
  value: unknown,
  fallback = "-"
): string {
  if (value === undefined || value === null) {
    return fallback;
  }

  const text = String(value)
    .replace(/₹/g, "INR ")
    .replace(/×/g, "x")
    .replace(/•/g, "|")
    .replace(/[–—]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E\r\n]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  return text || fallback;
}

function money(
  value: number | string | undefined
): string {
  return `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(num(value)))}`;
}

function dateText(
  value?: string
): string {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return clean(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
   FONT / TEXT
============================================================ */

function font(
  doc: jsPDF,
  bold = false
) {
  doc.setFont(
    "helvetica",
    bold ? "bold" : "normal"
  );
}

function text(
  doc: jsPDF,
  value: string,
  x: number,
  y: number,
  options: TextOptions = {}
) {
  const size = options.size ?? 8;

  const color = options.color ?? C.slate800;

  doc.setFontSize(size);

  font(
    doc,
    options.bold ?? false
  );

  doc.setTextColor(
    color[0],
    color[1],
    color[2]
  );

  doc.text(
    clean(value, ""),
    x,
    y,
    {
      align: options.align ?? "left",
    }
  );
}

function lines(
  doc: jsPDF,
  value: string,
  width: number,
  size: number,
  bold = false
): string[] {
  doc.setFontSize(size);

  font(
    doc,
    bold
  );

  return doc.splitTextToSize(
    clean(value, ""),
    width
  ) as string[];
}

function wrapped(
  doc: jsPDF,
  value: string,
  x: number,
  y: number,
  width: number,
  options: {
    size?: number;
    color?: RGB;
    bold?: boolean;
    lineHeight?: number;
    maxLines?: number;
  } = {}
): number {
  const size =
    options.size ?? 7;

  const lineHeight =
    options.lineHeight ?? 3.8;

  const allLines =
    lines(
      doc,
      value,
      width,
      size,
      options.bold ?? false
    );

  const visible =
    options.maxLines
      ? allLines.slice(
          0,
          options.maxLines
        )
      : allLines;

  visible.forEach(
    (line, index) => {
      text(
        doc,
        line,
        x,
        y + index * lineHeight,
        {
          size,
          color:
            options.color ??
            C.slate700,
          bold:
            options.bold ??
            false,
        }
      );
    }
  );

  return (
    y +
    visible.length *
      lineHeight
  );
}

/* ============================================================
   LOGO
============================================================ */

async function getLogo(): Promise<string | null> {
  try {
    const response =
      await fetch("/nav_logo.png");

    if (!response.ok) {
      return null;
    }

    const blob =
      await response.blob();

    return await new Promise(
      (resolve) => {
        const reader =
          new FileReader();

        reader.onload = () => {
          resolve(
            typeof reader.result ===
              "string"
              ? reader.result
              : null
          );
        };

        reader.onerror = () =>
          resolve(null);

        reader.readAsDataURL(
          blob
        );
      }
    );
  } catch {
    return null;
  }
}

/* ============================================================
   ROUNDED CARD
============================================================ */

function card(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: RGB = C.white,
  border: RGB = C.slate200
) {
  doc.setFillColor(
    fill[0],
    fill[1],
    fill[2]
  );

  doc.setDrawColor(
    border[0],
    border[1],
    border[2]
  );

  doc.setLineWidth(
    0.3
  );

  doc.roundedRect(
    x,
    y,
    w,
    h,
    2.8,
    2.8,
    "FD"
  );
}

/* ============================================================
   LABEL
============================================================ */

function label(
  doc: jsPDF,
  value: string,
  x: number,
  y: number
) {
  text(
    doc,
    value.toUpperCase(),
    x,
    y,
    {
      size: 6.2,
      color: C.slate500,
      bold: true,
    }
  );
}

/* ============================================================
   STATUS
============================================================ */

function statusColors(
  status: string
): {
  bg: RGB;
  text: RGB;
} {
  switch (status) {
    case "Confirmed":
      return {
        bg: C.greenLight,
        text: C.green,
      };

    case "Partially Paid":
      return {
        bg: C.amberLight,
        text: C.amberDark,
      };

    case "Cancelled":
      return {
        bg: C.redLight,
        text: C.red,
      };

    case "Completed":
      return {
        bg: C.slate100,
        text: C.slate700,
      };

    default:
      return {
        bg: C.blueLight,
        text: C.blue,
      };
  }
}

/* ============================================================
   PAGE FOOTER
============================================================ */

function footer(
  doc: jsPDF,
  pageNumber = 1,
  totalPages = 1
) {
  const y = 289;

  doc.setDrawColor(
    C.slate200[0],
    C.slate200[1],
    C.slate200[2]
  );

  doc.setLineWidth(
    0.25
  );

  doc.line(
    MARGIN,
    y - 4,
    PAGE_W - MARGIN,
    y - 4
  );

  text(
    doc,
    "Khatu Rides Travels Co. | Korba, Chhattisgarh",
    MARGIN,
    y,
    {
      size: 6,
      color: C.slate500,
      bold: true,
    }
  );

  text(
    doc,
    "+91 92441 37353  |  www.khaturidescg.in",
    PAGE_W / 2,
    y,
    {
      size: 6,
      color: C.slate500,
      align: "center",
    }
  );

  text(
    doc,
    `Page ${pageNumber} of ${totalPages}`,
    PAGE_W - MARGIN,
    y,
    {
      size: 6,
      color: C.slate500,
      align: "right",
    }
  );
}

/* ============================================================
   PAGE BACKGROUND
============================================================ */

function drawPageBackground(
  doc: jsPDF
) {
  doc.setFillColor(
    C.slate50[0],
    C.slate50[1],
    C.slate50[2]
  );

  doc.rect(
    0,
    0,
    PAGE_W,
    PAGE_H,
    "F"
  );
}

/* ============================================================
   HEADER
============================================================ */

async function drawHeader(
  doc: jsPDF,
  bookingNo: string,
  bookingDate: string
) {
  const headerH = 43;

  doc.setFillColor(
    C.navy[0],
    C.navy[1],
    C.navy[2]
  );

  doc.rect(
    0,
    0,
    PAGE_W,
    headerH,
    "F"
  );

  /*
   * Decorative blue glow.
   */
  doc.setFillColor(
    C.blue[0],
    C.blue[1],
    C.blue[2]
  );

  doc.circle(
    207,
    0,
    28,
    "F"
  );

  /*
   * Amber accent line.
   */
  doc.setFillColor(
    C.amber[0],
    C.amber[1],
    C.amber[2]
  );

  doc.rect(
    0,
    headerH - 1,
    PAGE_W,
    1,
    "F"
  );

  /*
   * Logo.
   */
  const logo =
    await getLogo();

  if (logo) {
    try {
      doc.addImage(
        logo,
        "PNG",
        MARGIN,
        7,
        28,
        18,
        undefined,
        "FAST"
      );
    } catch {
      // Logo failure should never break PDF generation.
    }
  }

  /*
   * Company.
   */
  text(
    doc,
    "KHATU RIDES",
    MARGIN + 32,
    13,
    {
      size: 12.5,
      color: C.white,
      bold: true,
    }
  );

  text(
    doc,
    "TRAVELS CO.",
    MARGIN + 32,
    19,
    {
      size: 7,
      color: C.amber,
      bold: true,
    }
  );

  text(
    doc,
    "TRAVEL  |  TAXI  |  TOURS  |  CORPORATE MOBILITY",
    MARGIN + 32,
    25,
    {
      size: 5.3,
      color: [190, 210, 235],
      bold: true,
    }
  );

  text(
    doc,
    "Korba, Chhattisgarh",
    MARGIN + 32,
    31,
    {
      size: 5.8,
      color: [180, 200, 225],
    }
  );

  /*
   * Header right.
   */
  text(
    doc,
    "ADVANCE BOOKING",
    PAGE_W - MARGIN,
    12,
    {
      size: 9,
      color: C.white,
      bold: true,
      align: "right",
    }
  );

  text(
    doc,
    "BOOKING CONFIRMATION",
    PAGE_W - MARGIN,
    18,
    {
      size: 6,
      color: C.amber,
      bold: true,
      align: "right",
    }
  );

  text(
    doc,
    bookingNo,
    PAGE_W - MARGIN,
    26,
    {
      size: 7.2,
      color: C.white,
      bold: true,
      align: "right",
    }
  );

  text(
    doc,
    `Booking Date: ${bookingDate}`,
    PAGE_W - MARGIN,
    32,
    {
      size: 5.8,
      color: [190, 210, 235],
      align: "right",
    }
  );
}

/* ============================================================
   GENERATOR
============================================================ */

export async function generateAdvanceBookingPdf(
  booking: AdvanceBookingPdfData
): Promise<Blob> {
  const doc =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

  /* ==========================================================
     METADATA
  ========================================================== */

  const bookingNo =
    clean(
      booking.bookingNumber,
      "Booking"
    );

  doc.setProperties({
    title:
      `Khatu Rides Advance Booking - ${bookingNo}`,
    subject:
      "Advance Booking Confirmation",
    author:
      "Khatu Rides Travels Co.",
    creator:
      "Khatu Rides Travels Co.",
  });

  /* ==========================================================
     DATA
  ========================================================== */

  const bookingType =
    clean(
      booking.bookingType,
      "Advance Booking"
    );

  const customerName =
    clean(
      booking.customerName,
      "Customer"
    );

  const customerMobile =
    clean(
      booking.customerMobile,
      "-"
    );

  const bookingDate =
    dateText(
      booking.bookingDate
    );

  const journeyDate =
    dateText(
      booking.journeyDate
    );

  const pickupTime =
    clean(
      booking.pickupTime,
      "As discussed"
    );

  const pickup =
    clean(
      booking.pickupLocation,
      "-"
    );

  const destination =
    clean(
      booking.dropLocation,
      "-"
    );

  const status =
    clean(
      booking.status,
      "Pending"
    );

  const remarks =
    clean(
      booking.remarks,
      ""
    );

  const vehicles =
    Array.isArray(
      booking.vehicles
    )
      ? booking.vehicles
      : [];

  const calculatedVehicles =
    vehicles.reduce(
      (
        sum,
        vehicle
      ) =>
        sum +
        num(
          vehicle.quantity
        ),
      0
    );

  const calculatedTotal =
    vehicles.reduce(
      (
        sum,
        vehicle
      ) =>
        sum +
        num(
          vehicle.quantity
        ) *
        num(
          vehicle.ratePerVehicle
        ),
      0
    );

  const totalAmount =
    num(
      booking.totalAmount
    ) ||
    calculatedTotal;

  const totalVehicles =
    num(
      booking.totalVehicles
    ) ||
    calculatedVehicles;

  const advanceAmount =
    Math.max(
      0,
      num(
        booking.advanceAmount
      )
    );

  const balanceAmount =
    Math.max(
      0,
      totalAmount -
      advanceAmount
    );

  /* ==========================================================
     BACKGROUND
  ========================================================== */

  drawPageBackground(doc);

  /* ==========================================================
     HEADER
  ========================================================== */

  await drawHeader(
    doc,
    bookingNo,
    bookingDate
  );

  /* ==========================================================
     STATUS STRIP
  ========================================================== */

  let y = 48;

  const sc =
    statusColors(status);

  doc.setFillColor(
    sc.bg[0],
    sc.bg[1],
    sc.bg[2]
  );

  doc.roundedRect(
    MARGIN,
    y,
    CONTENT_W,
    9,
    2.5,
    2.5,
    "F"
  );

  text(
    doc,
    status.toUpperCase(),
    MARGIN + 5,
    y + 6,
    {
      size: 6.2,
      color: sc.text,
      bold: true,
    }
  );

  text(
    doc,
    bookingType,
    PAGE_W - MARGIN - 5,
    y + 6,
    {
      size: 6.2,
      color: C.slate600,
      bold: true,
      align: "right",
    }
  );

  y += 12;

  /* ==========================================================
     CUSTOMER + JOURNEY
  ========================================================== */

  const gap = 4;

  const half =
    (CONTENT_W - gap) /
    2;

  const infoH = 45;

  /*
   * Customer card.
   */

  card(
    doc,
    MARGIN,
    y,
    half,
    infoH
  );

  label(
    doc,
    "Customer Details",
    MARGIN + 6,
    y + 7
  );

  text(
    doc,
    customerName,
    MARGIN + 6,
    y + 16,
    {
      size: 11,
      color: C.slate950,
      bold: true,
    }
  );

  label(
    doc,
    "Mobile",
    MARGIN + 6,
    y + 25
  );

  text(
    doc,
    `+91 ${customerMobile}`,
    MARGIN + 6,
    y + 33,
    {
      size: 8.5,
      color: C.blue,
      bold: true,
    }
  );

  label(
    doc,
    "Booking Type",
    MARGIN + 6,
    y + 41
  );

  text(
    doc,
    bookingType,
    MARGIN + 31,
    y + 41,
    {
      size: 7,
      color: C.slate700,
      bold: true,
    }
  );

  /*
   * Journey card.
   */

  const journeyX =
    MARGIN +
    half +
    gap;

  card(
    doc,
    journeyX,
    y,
    half,
    infoH
  );

  label(
    doc,
    "Journey Details",
    journeyX + 6,
    y + 7
  );

  label(
    doc,
    "Journey Date",
    journeyX + 6,
    y + 16
  );

  text(
    doc,
    journeyDate,
    journeyX + 35,
    y + 16,
    {
      size: 8,
      color: C.slate950,
      bold: true,
    }
  );

  label(
    doc,
    "Pickup",
    journeyX + 6,
    y + 25
  );

  const pickupLines =
    lines(
      doc,
      pickup,
      half - 43,
      7.5,
      true
    ).slice(0, 1);

  text(
    doc,
    pickupLines[0] ||
      pickup,
    journeyX + 35,
    y + 25,
    {
      size: 7.5,
      color: C.slate950,
      bold: true,
    }
  );

  label(
    doc,
    "Destination",
    journeyX + 6,
    y + 34
  );

  const destinationLines =
    lines(
      doc,
      destination,
      half - 43,
      7.5,
      true
    ).slice(0, 1);

  text(
    doc,
    destinationLines[0] ||
      destination,
    journeyX + 35,
    y + 34,
    {
      size: 7.5,
      color: C.slate950,
      bold: true,
    }
  );

  label(
    doc,
    "Reporting",
    journeyX + 6,
    y + 42
  );

  text(
    doc,
    pickupTime,
    journeyX + 35,
    y + 42,
    {
      size: 7.5,
      color: C.slate700,
      bold: true,
    }
  );

  y +=
    infoH + 8;

  /* ==========================================================
     VEHICLE RESERVATION
  ========================================================== */

  text(
    doc,
    "VEHICLE RESERVATION",
    MARGIN,
    y,
    {
      size: 6.3,
      color: C.slate500,
      bold: true,
    }
  );

  text(
    doc,
    "Booked Vehicles",
    MARGIN,
    y + 7,
    {
      size: 11,
      color: C.slate950,
      bold: true,
    }
  );

  text(
    doc,
    `${totalVehicles} vehicle${
      totalVehicles === 1
        ? ""
        : "s"
    }`,
    PAGE_W - MARGIN,
    y + 6,
    {
      size: 6.5,
      color: C.blue,
      bold: true,
      align: "right",
    }
  );

  y += 11;

  /* ==========================================================
     VEHICLE TABLE
  ========================================================== */

  const tableX = MARGIN;

  const vehicleW = 67;
  const variantW = 42;
  const qtyW = 17;
  const rateW = 33;

  const amountW =
    CONTENT_W -
    vehicleW -
    variantW -
    qtyW -
    rateW;

  const tableHeaderH = 9;

  /*
   * Header.
   */

  doc.setFillColor(
    C.navy[0],
    C.navy[1],
    C.navy[2]
  );

  doc.roundedRect(
    tableX,
    y,
    CONTENT_W,
    tableHeaderH,
    2,
    2,
    "F"
  );

  text(
    doc,
    "VEHICLE",
    tableX + 4,
    y + 6,
    {
      size: 5.8,
      color: C.white,
      bold: true,
    }
  );

  text(
    doc,
    "VARIANT",
    tableX +
      vehicleW +
      4,
    y + 6,
    {
      size: 5.8,
      color: C.white,
      bold: true,
    }
  );

  text(
    doc,
    "QTY",
    tableX +
      vehicleW +
      variantW +
      qtyW -
      3,
    y + 6,
    {
      size: 5.8,
      color: C.white,
      bold: true,
      align: "right",
    }
  );

  text(
    doc,
    "RATE",
    tableX +
      vehicleW +
      variantW +
      qtyW +
      rateW -
      3,
    y + 6,
    {
      size: 5.8,
      color: C.white,
      bold: true,
      align: "right",
    }
  );

  text(
    doc,
    "AMOUNT",
    tableX +
      CONTENT_W -
      4,
    y + 6,
    {
      size: 5.8,
      color: C.white,
      bold: true,
      align: "right",
    }
  );

  y +=
    tableHeaderH;

  /* ==========================================================
     VEHICLE ROWS
  ========================================================== */

  const rowCount =
    vehicles.length;

  /*
   * Normal bookings are designed for
   * maximum readability.
   *
   * Very large bookings automatically
   * continue to a second page rather
   * than making the text microscopic.
   */

  const maxRowsFirstPage = 9;

  const firstPageVehicles =
    vehicles.slice(
      0,
      maxRowsFirstPage
    );

  const remainingVehicles =
    vehicles.slice(
      maxRowsFirstPage
    );

  const normalRowH =
    10;

  const compactRowH =
    9;

  firstPageVehicles.forEach(
    (
      vehicle,
      index
    ) => {
      const quantity =
        num(
          vehicle.quantity
        );

      const rate =
        num(
          vehicle.ratePerVehicle
        );

      const lineTotal =
        quantity * rate;

      const vehicleName =
        clean(
          vehicle.vehicleType,
          "Vehicle"
        );

      const variant =
        clean(
          vehicle.variant,
          ""
        );

      const rowH =
        rowCount > 7
          ? compactRowH
          : normalRowH;

      const rowColor =
        index % 2 === 0
          ? C.white
          : C.slate50;

      doc.setFillColor(
        rowColor[0],
        rowColor[1],
        rowColor[2]
      );

      doc.rect(
        tableX,
        y,
        CONTENT_W,
        rowH,
        "F"
      );

      doc.setDrawColor(
        C.slate200[0],
        C.slate200[1],
        C.slate200[2]
      );

      doc.setLineWidth(
        0.15
      );

      doc.line(
        tableX,
        y + rowH,
        tableX +
          CONTENT_W,
        y + rowH
      );

      /*
       * Vehicle.
       */

      text(
        doc,
        vehicleName,
        tableX + 4,
        y + 6.5,
        {
          size:
            rowCount > 7
              ? 7
              : 7.5,
          color:
            C.slate950,
          bold: true,
        }
      );

      /*
       * Variant.
       */

      text(
        doc,
        variant || "-",
        tableX +
          vehicleW +
          4,
        y + 6.5,
        {
          size:
            rowCount > 7
              ? 6.5
              : 7,
          color:
            variant
              ? C.blue
              : C.slate400,
          bold:
            Boolean(
              variant
            ),
        }
      );

      /*
       * Quantity.
       */

      text(
        doc,
        String(quantity),
        tableX +
          vehicleW +
          variantW +
          qtyW -
          3,
        y + 6.5,
        {
          size: 7,
          color:
            C.slate800,
          bold: true,
          align: "right",
        }
      );

      /*
       * Rate.
       */

      text(
        doc,
        money(rate),
        tableX +
          vehicleW +
          variantW +
          qtyW +
          rateW -
          3,
        y + 6.5,
        {
          size:
            rowCount > 7
              ? 6.5
              : 7,
          color:
            C.slate800,
          bold: true,
          align: "right",
        }
      );

      /*
       * Amount.
       */

      text(
        doc,
        money(lineTotal),
        tableX +
          CONTENT_W -
          4,
        y + 6.5,
        {
          size:
            rowCount > 7
              ? 7
              : 7.5,
          color:
            C.blue,
          bold: true,
          align: "right",
        }
      );

      y += rowH;
    }
  );

  /* ==========================================================
     NO VEHICLES
  ========================================================== */

  if (
    vehicles.length === 0
  ) {
    doc.setFillColor(
      C.slate50[0],
      C.slate50[1],
      C.slate50[2]
    );

    doc.rect(
      tableX,
      y,
      CONTENT_W,
      12,
      "F"
    );

    text(
      doc,
      "No vehicle details available.",
      tableX + 4,
      y + 7.5,
      {
        size: 7,
        color: C.slate500,
      }
    );

    y += 12;
  }

  /* ==========================================================
     MORE VEHICLES NOTICE
  ========================================================== */

  if (
    remainingVehicles.length > 0
  ) {
    doc.setFillColor(
      C.blueLight[0],
      C.blueLight[1],
      C.blueLight[2]
    );

    doc.rect(
      tableX,
      y,
      CONTENT_W,
      9,
      "F"
    );

    text(
      doc,
      `${remainingVehicles.length} additional vehicle line${
        remainingVehicles.length === 1
          ? ""
          : "s"
      } shown on the next page.`,
      tableX + 4,
      y + 6,
      {
        size: 6.5,
        color: C.blue,
        bold: true,
      }
    );

    y += 9;
  }

  /* ==========================================================
     TOTAL ROW
  ========================================================== */

  doc.setFillColor(
    C.slate100[0],
    C.slate100[1],
    C.slate100[2]
  );

  doc.rect(
    tableX,
    y,
    CONTENT_W,
    13,
    "F"
  );

  text(
    doc,
    "TOTAL BOOKING AMOUNT",
    tableX + 4,
    y + 8.5,
    {
      size: 7,
      color: C.slate700,
      bold: true,
    }
  );

  text(
    doc,
    money(totalAmount),
    tableX +
      CONTENT_W -
      4,
    y + 8.5,
    {
      size: 11,
      color: C.slate950,
      bold: true,
      align: "right",
    }
  );

  y += 20;

  /* ==========================================================
     PAYMENT SUMMARY
  ========================================================== */

  text(
    doc,
    "PAYMENT SUMMARY",
    MARGIN,
    y,
    {
      size: 6.3,
      color: C.slate500,
      bold: true,
    }
  );

  text(
    doc,
    "Booking Payment",
    MARGIN,
    y + 7,
    {
      size: 11,
      color: C.slate950,
      bold: true,
    }
  );

  y += 11;

  const paymentH = 37;

  const paymentLeftW =
    112;

  const paymentRightW =
    CONTENT_W -
    paymentLeftW -
    5;

  /* ----------------------------------------------------------
     LEFT PAYMENT CARD
  ---------------------------------------------------------- */

  card(
    doc,
    MARGIN,
    y,
    paymentLeftW,
    paymentH
  );

  label(
    doc,
    "Total Booking",
    MARGIN + 6,
    y + 8
  );

  text(
    doc,
    money(totalAmount),
    MARGIN + 6,
    y + 16,
    {
      size: 9,
      color: C.slate950,
      bold: true,
    }
  );

  label(
    doc,
    "Advance Received",
    MARGIN + 6,
    y + 25
  );

  text(
    doc,
    money(advanceAmount),
    MARGIN + 6,
    y + 33,
    {
      size: 9,
      color: C.green,
      bold: true,
    }
  );

  /* ----------------------------------------------------------
     RIGHT BALANCE CARD
  ---------------------------------------------------------- */

  const balanceX =
    MARGIN +
    paymentLeftW +
    5;

  doc.setFillColor(
    C.navy[0],
    C.navy[1],
    C.navy[2]
  );

  doc.roundedRect(
    balanceX,
    y,
    paymentRightW,
    paymentH,
    3,
    3,
    "F"
  );

  text(
    doc,
    "BALANCE DUE",
    balanceX + 6,
    y + 9,
    {
      size: 6.5,
      color: [180, 200, 225],
      bold: true,
    }
  );

  text(
    doc,
    money(balanceAmount),
    balanceX + 6,
    y + 21,
    {
      size: 13,
      color: C.amber,
      bold: true,
    }
  );

  text(
    doc,
    `${totalVehicles} vehicle${
      totalVehicles === 1
        ? ""
        : "s"
    } reserved`,
    balanceX + 6,
    y + 31,
    {
      size: 6.2,
      color: [200, 215, 235],
    }
  );

  y +=
    paymentH + 9;

  /* ==========================================================
     NOTES + TERMS
  ========================================================== */

  const lowerGap = 4;

  const lowerW =
    (CONTENT_W -
      lowerGap) /
    2;

  const lowerH = 38;

  /* ----------------------------------------------------------
     NOTES
  ---------------------------------------------------------- */

  card(
    doc,
    MARGIN,
    y,
    lowerW,
    lowerH,
    C.amberLight,
    [247, 225, 165]
  );

  label(
    doc,
    "Booking Notes",
    MARGIN + 6,
    y + 7
  );

  if (remarks) {
    wrapped(
      doc,
      remarks,
      MARGIN + 6,
      y + 15,
      lowerW - 12,
      {
        size: 6.5,
        color: C.slate700,
        lineHeight: 3.6,
        maxLines: 6,
      }
    );
  } else {
    text(
      doc,
      "No special instructions added.",
      MARGIN + 6,
      y + 16,
      {
        size: 6.5,
        color: C.slate600,
      }
    );
  }

  /* ----------------------------------------------------------
     TERMS
  ---------------------------------------------------------- */

  const termsX =
    MARGIN +
    lowerW +
    lowerGap;

  card(
    doc,
    termsX,
    y,
    lowerW,
    lowerH
  );

  label(
    doc,
    "Terms & Conditions",
    termsX + 6,
    y + 7
  );

  const terms = [
    "Vehicle allocation subject to availability and final confirmation.",
    "Customer should report at the agreed pickup location and time.",
    "Additional applicable charges will follow booking terms.",
    "Advance payment is adjusted against the booking amount.",
  ];

  let termY =
    y + 14;

  terms.forEach(
    (
      item,
      index
    ) => {
      text(
        doc,
        `${index + 1}.`,
        termsX + 6,
        termY,
        {
          size: 6,
          color: C.blue,
          bold: true,
        }
      );

      const termLines =
        lines(
          doc,
          item,
          lowerW - 19,
          6,
          false
        ).slice(0, 1);

      text(
        doc,
        termLines[0] ||
          item,
        termsX + 11,
        termY,
        {
          size: 6,
          color: C.slate600,
        }
      );

      termY += 5.8;
    }
  );

  y +=
    lowerH + 8;

  /* ==========================================================
     IMPORTANT NOTICE
  ========================================================== */

  const noticeH = 22;

  doc.setFillColor(
    C.blueLight[0],
    C.blueLight[1],
    C.blueLight[2]
  );

  doc.setDrawColor(
    210,
    225,
    248
  );

  doc.setLineWidth(
    0.3
  );

  doc.roundedRect(
    MARGIN,
    y,
    CONTENT_W,
    noticeH,
    2.5,
    2.5,
    "FD"
  );

  label(
    doc,
    "Important Booking Notice",
    MARGIN + 6,
    y + 7
  );

  wrapped(
    doc,
    "This is a computer-generated advance booking document issued for travel-service confirmation and record purposes. It is not a tax invoice unless separately issued as such. Vehicle allocation and applicable charges remain subject to confirmed booking terms.",
    MARGIN + 6,
    y + 14,
    CONTENT_W - 12,
    {
      size: 6.2,
      color: C.slate600,
      lineHeight: 3.2,
      maxLines: 2,
    }
  );

  /* ==========================================================
     FOOTER - FIRST PAGE
  ========================================================== */

  const totalPages =
    remainingVehicles.length > 0
      ? 2
      : 1;

  footer(
    doc,
    1,
    totalPages
  );

  /* ==========================================================
     SECOND PAGE
  ========================================================== */

  if (
    remainingVehicles.length > 0
  ) {
    doc.addPage();

    drawPageBackground(doc);

    /*
     * Second page header.
     */

    doc.setFillColor(
      C.navy[0],
      C.navy[1],
      C.navy[2]
    );

    doc.rect(
      0,
      0,
      PAGE_W,
      36,
      "F"
    );

    doc.setFillColor(
      C.amber[0],
      C.amber[1],
      C.amber[2]
    );

    doc.rect(
      0,
      35,
      PAGE_W,
      1,
      "F"
    );

    text(
      doc,
      "KHATU RIDES",
      MARGIN,
      13,
      {
        size: 13,
        color: C.white,
        bold: true,
      }
    );

    text(
      doc,
      "TRAVELS CO.",
      MARGIN,
      20,
      {
        size: 7,
        color: C.amber,
        bold: true,
      }
    );

    text(
      doc,
      "ADVANCE BOOKING - VEHICLE DETAILS",
      PAGE_W - MARGIN,
      14,
      {
        size: 8,
        color: C.white,
        bold: true,
        align: "right",
      }
    );

    text(
      doc,
      bookingNo,
      PAGE_W - MARGIN,
      22,
      {
        size: 7,
        color: [190, 210, 235],
        bold: true,
        align: "right",
      }
    );

    let page2Y = 47;

    text(
      doc,
      "ADDITIONAL VEHICLE RESERVATION",
      MARGIN,
      page2Y,
      {
        size: 7,
        color: C.slate500,
        bold: true,
      }
    );

    text(
      doc,
      "Remaining Booked Vehicles",
      MARGIN,
      page2Y + 9,
      {
        size: 13,
        color: C.slate950,
        bold: true,
      }
    );

    page2Y += 15;

    /*
     * Second page table.
     */

    const tableHeaderH2 = 10;

    doc.setFillColor(
      C.navy[0],
      C.navy[1],
      C.navy[2]
    );

    doc.roundedRect(
      MARGIN,
      page2Y,
      CONTENT_W,
      tableHeaderH2,
      2,
      2,
      "F"
    );

    text(
      doc,
      "VEHICLE",
      MARGIN + 4,
      page2Y + 6.5,
      {
        size: 6,
        color: C.white,
        bold: true,
      }
    );

    text(
      doc,
      "VARIANT",
      MARGIN +
        vehicleW +
        4,
      page2Y + 6.5,
      {
        size: 6,
        color: C.white,
        bold: true,
      }
    );

    text(
      doc,
      "QTY",
      MARGIN +
        vehicleW +
        variantW +
        qtyW -
        3,
      page2Y + 6.5,
      {
        size: 6,
        color: C.white,
        bold: true,
        align: "right",
      }
    );

    text(
      doc,
      "RATE",
      MARGIN +
        vehicleW +
        variantW +
        qtyW +
        rateW -
        3,
      page2Y + 6.5,
      {
        size: 6,
        color: C.white,
        bold: true,
        align: "right",
      }
    );

    text(
      doc,
      "AMOUNT",
      MARGIN +
        CONTENT_W -
        4,
      page2Y + 6.5,
      {
        size: 6,
        color: C.white,
        bold: true,
        align: "right",
      }
    );

    page2Y +=
      tableHeaderH2;

    remainingVehicles.forEach(
      (
        vehicle,
        index
      ) => {
        const quantity =
          num(
            vehicle.quantity
          );

        const rate =
          num(
            vehicle.ratePerVehicle
          );

        const lineTotal =
          quantity * rate;

        const vehicleName =
          clean(
            vehicle.vehicleType,
            "Vehicle"
          );

        const variant =
          clean(
            vehicle.variant,
            ""
          );

        const rowH =
          10;

        const rowColor =
          index % 2 === 0
            ? C.white
            : C.slate50;

        doc.setFillColor(
          rowColor[0],
          rowColor[1],
          rowColor[2]
        );

        doc.rect(
          MARGIN,
          page2Y,
          CONTENT_W,
          rowH,
          "F"
        );

        doc.setDrawColor(
          C.slate200[0],
          C.slate200[1],
          C.slate200[2]
        );

        doc.setLineWidth(
          0.15
        );

        doc.line(
          MARGIN,
          page2Y + rowH,
          MARGIN +
            CONTENT_W,
          page2Y + rowH
        );

        text(
          doc,
          vehicleName,
          MARGIN + 4,
          page2Y + 6.5,
          {
            size: 7.5,
            color:
              C.slate950,
            bold: true,
          }
        );

        text(
          doc,
          variant || "-",
          MARGIN +
            vehicleW +
            4,
          page2Y + 6.5,
          {
            size: 7,
            color:
              variant
                ? C.blue
                : C.slate400,
            bold:
              Boolean(
                variant
              ),
          }
        );

        text(
          doc,
          String(quantity),
          MARGIN +
            vehicleW +
            variantW +
            qtyW -
            3,
          page2Y + 6.5,
          {
            size: 7,
            color:
              C.slate800,
            bold: true,
            align: "right",
          }
        );

        text(
          doc,
          money(rate),
          MARGIN +
            vehicleW +
            variantW +
            qtyW +
            rateW -
            3,
          page2Y + 6.5,
          {
            size: 7,
            color:
              C.slate800,
            bold: true,
            align: "right",
          }
        );

        text(
          doc,
          money(lineTotal),
          MARGIN +
            CONTENT_W -
            4,
          page2Y + 6.5,
          {
            size: 7.5,
            color:
              C.blue,
            bold: true,
            align: "right",
          }
        );

        page2Y += rowH;
      }
    );

    /*
     * Page 2 summary.
     */

    page2Y += 12;

    card(
      doc,
      MARGIN,
      page2Y,
      CONTENT_W,
      45
    );

    label(
      doc,
      "Booking Summary",
      MARGIN + 7,
      page2Y + 8
    );

    text(
      doc,
      `Booking Number: ${bookingNo}`,
      MARGIN + 7,
      page2Y + 18,
      {
        size: 8,
        color: C.slate950,
        bold: true,
      }
    );

    text(
      doc,
      `Customer: ${customerName}`,
      MARGIN + 7,
      page2Y + 27,
      {
        size: 8,
        color: C.slate700,
        bold: true,
      }
    );

    text(
      doc,
      `Journey: ${journeyDate}  |  ${pickup} -> ${destination}`,
      MARGIN + 7,
      page2Y + 36,
      {
        size: 7,
        color: C.slate700,
      }
    );

    footer(
      doc,
      2,
      totalPages
    );
  }

  /* ==========================================================
     SAFETY
  ========================================================== */

  /*
   * No empty pages.
   */

  while (
    doc.getNumberOfPages() >
    totalPages
  ) {
    doc.deletePage(
      doc.getNumberOfPages()
    );
  }

  /* ==========================================================
     RETURN BLOB
  ========================================================== */

  return doc.output(
    "blob"
  );
}

/* ============================================================
   DOWNLOAD
============================================================ */

export async function downloadAdvanceBookingPdf(
  booking: AdvanceBookingPdfData
): Promise<Blob> {
  const blob =
    await generateAdvanceBookingPdf(
      booking
    );

  if (
    !blob ||
    blob.size === 0
  ) {
    throw new Error(
      "Generated advance booking PDF is empty."
    );
  }

  const safeBookingNumber =
    clean(
      booking.bookingNumber,
      "Booking"
    ).replace(
      /[^a-zA-Z0-9-_]/g,
      "-"
    );

  const fileName =
    `Khatu-Rides-Advance-Booking-${safeBookingNumber}.pdf`;

  const url =
    URL.createObjectURL(
      blob
    );

  try {
    const anchor =
      document.createElement(
        "a"
      );

    anchor.href =
      url;

    anchor.download =
      fileName;

    anchor.style.display =
      "none";

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();
  } finally {
    window.setTimeout(
      () => {
        URL.revokeObjectURL(
          url
        );
      },
      1500
    );
  }

  return blob;
}
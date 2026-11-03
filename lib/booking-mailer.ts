
import nodemailer from "nodemailer";

type BookingEmailData = {
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

  returnDate?: string;
  returnTime?: string;

  bookingType: string;
  vehicleLabel: string;

  distanceKm: number;
  totalFare: number;
  advancePaid: number;

  paymentId: string;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP configuration missing. Check SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

function bookingRows(data: BookingEmailData) {
  const rows: [string, string][] = [
    ["Booking ID", data.bookingId],
    ["Passenger", data.passenger.name],
    ["Mobile", data.passenger.mobile],
    ["Email", data.passenger.email],
    ["Trip Type", data.bookingType],
    ["Pickup", data.pickup],
    ["Drop", data.drop || "Local Rental"],
    ["Journey Date", data.pickupDate],
    ["Pickup Time", data.pickupTime],
    ["Vehicle", data.vehicleLabel],
    ["Distance", `${data.distanceKm || 0} KM`],
    ["Total Fare", money(data.totalFare)],
    ["Advance Paid", money(data.advancePaid)],
    [
      "Balance Payable",
      money(Math.max(0, data.totalFare - data.advancePaid)),
    ],
    ["Razorpay Payment ID", data.paymentId],
  ];

  if (data.returnDate) {
    rows.push(["Return Date", data.returnDate]);
    rows.push(["Return Time", data.returnTime || "-"]);
  }

  return rows;
}

function htmlTable(data: BookingEmailData) {
  return bookingRows(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:11px 12px;border-bottom:1px solid #edf0f4;color:#64748b;font-size:13px;width:38%;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:11px 12px;border-bottom:1px solid #edf0f4;color:#172033;font-size:13px;font-weight:600;word-break:break-word;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");
}

function emailShell(title: string, content: string) {
  return `
  <!doctype html>
  <html>
  <body style="margin:0;padding:24px 10px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="max-width:640px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <div style="background:#b91c1c;padding:25px 28px;color:#ffffff;">
        <div style="font-size:23px;font-weight:800;letter-spacing:1px;">KHATU RIDES</div>
        <div style="font-size:11px;margin-top:6px;letter-spacing:1.5px;">TRAVELS CO.</div>
      </div>
      <div style="padding:26px 24px;">
        ${content}
      </div>
      <div style="background:#f8fafc;padding:18px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <div style="font-size:13px;font-weight:700;color:#b91c1c;">Khatu Rides Travels Co.</div>
        <div style="font-size:12px;color:#64748b;margin-top:6px;">9244137353 · khaturidescg.in</div>
      </div>
    </div>
  </body>
  </html>`;
}

export async function sendBookingEmails(data: BookingEmailData) {
  const from = process.env.SMTP_FROM;
  const adminEmail =
    process.env.BOOKING_ADMIN_EMAIL || "khaturides@gmail.com";

  if (!from) {
    throw new Error("SMTP_FROM is missing.");
  }

  if (!data.passenger.email) {
    throw new Error("Customer email address is missing.");
  }

  const transporter = getTransporter();

  const table = htmlTable(data);

  const customerHtml = emailShell(
    "Your booking is confirmed",
    `
      <div style="text-align:center;">
        <div style="display:inline-block;background:#dcfce7;color:#166534;padding:8px 16px;border-radius:30px;font-size:12px;font-weight:700;">
          PAYMENT VERIFIED · BOOKING CONFIRMED
        </div>
        <h1 style="font-size:25px;margin:20px 0 8px;">Thank You, ${escapeHtml(data.passenger.name)}!</h1>
        <p style="font-size:14px;line-height:1.7;color:#64748b;margin:0;">
          Your booking with Khatu Rides Travels Co. has been successfully confirmed.
          Please keep this email for your travel reference.
        </p>
      </div>

      <div style="margin:22px 0;padding:15px;background:#f0fdf4;border-radius:10px;text-align:center;">
        <div style="font-size:11px;color:#166534;">YOUR BOOKING REFERENCE</div>
        <div style="font-size:18px;font-weight:800;color:#166534;margin-top:5px;">
          ${escapeHtml(data.bookingId)}
        </div>
      </div>

      <h2 style="font-size:16px;margin:22px 0 10px;">Your Journey & Payment Details</h2>
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        ${table}
      </table>

      <div style="margin-top:22px;padding:16px;background:#fff7ed;border-radius:10px;color:#9a3412;font-size:13px;line-height:1.7;">
        Our team will coordinate your cab assignment and share the vehicle and driver details.
        For assistance, call 9244137353.
      </div>

      <p style="font-size:12px;color:#64748b;margin-top:22px;">
        Thank you for choosing Khatu Rides. We wish you a safe and comfortable journey.
      </p>
    `
  );

  const adminHtml = emailShell(
    "New online booking received",
    `
      <div style="background:#fff7ed;padding:15px;border-radius:10px;margin-bottom:20px;">
        <div style="font-size:18px;font-weight:800;color:#9a3412;">NEW ONLINE BOOKING</div>
        <div style="font-size:12px;color:#9a3412;margin-top:5px;">
          Payment verified · Ready for cab assignment
        </div>
      </div>

      <h2 style="font-size:16px;margin:0 0 10px;">Complete Booking Details</h2>
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        ${table}
      </table>

      <div style="margin-top:20px;padding:15px;background:#f8fafc;border-radius:10px;font-size:13px;line-height:1.8;">
        <strong>Action Required:</strong><br/>
        1. Check vehicle availability.<br/>
        2. Assign suitable cab and driver.<br/>
        3. Contact passenger to coordinate pickup.<br/>
        4. Update the booking assignment in the admin panel.
      </div>

      <p style="font-size:12px;color:#64748b;margin-top:20px;">
        This notification was generated automatically after successful Razorpay payment verification.
      </p>
    `
  );

  const text = bookingRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  // Send both emails. If either fails, report the error to
  // the verification API so the email status can be retried.
  const results = await Promise.allSettled([
    transporter.sendMail({
      from,
      to: data.passenger.email,
      replyTo: adminEmail,
      subject: `Booking Confirmed – ${data.bookingId} | Khatu Rides`,
      text:
        `Dear ${data.passenger.name},\n\nYour Khatu Rides booking is confirmed.\n\n${text}\n\nFor help: 9244137353`,
      html: customerHtml,
    }),

    transporter.sendMail({
      from,
      to: adminEmail,
      replyTo: data.passenger.email,
      subject: `NEW ONLINE BOOKING – ${data.bookingId}`,
      text:
        `New online booking received.\n\n${text}\n\nPlease assign a suitable cab.`,
      html: adminHtml,
    }),
  ]);

  const failures = results
    .map((result, index) =>
      result.status === "rejected"
        ? `${index === 0 ? "Customer email" : "Admin email"}: ${
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason)
          }`
        : null
    )
    .filter(Boolean);

  if (failures.length) {
    throw new Error(failures.join(" | "));
  }

  return {
    customerMessageId:
      results[0].status === "fulfilled"
        ? results[0].value.messageId
        : null,
    adminMessageId:
      results[1].status === "fulfilled"
        ? results[1].value.messageId
        : null,
  };
}

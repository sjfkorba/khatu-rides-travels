
import nodemailer from "nodemailer";

export type OnlineBookingEmailData = {
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

const ADMIN_EMAIL = "khaturides@gmail.com";

const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function safe(value: unknown): string {
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

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error("EMAIL_USER or EMAIL_PASS is missing.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

function getBookingRows(data: OnlineBookingEmailData) {
  const rows: [string, string][] = [
    ["Booking ID", data.bookingId],
    ["Passenger Name", data.passenger.name],
    ["Mobile Number", data.passenger.mobile],
    ["Email Address", data.passenger.email],
    ["Trip Type", data.bookingType],
    ["Pickup Location", data.pickup],
    ["Drop Location", data.drop || "Local Rental"],
    ["Journey Date", data.pickupDate],
    ["Pickup Time", data.pickupTime],
  ];

  if (data.returnDate) {
    rows.push(["Return Date", data.returnDate]);
    rows.push(["Return Time", data.returnTime || "-"]);
  }

  rows.push(
    ["Selected Vehicle", data.vehicleLabel],
    ["Approximate Distance", `${data.distanceKm || 0} KM`],
    ["Total Trip Fare", money(data.totalFare)],
    ["Advance Paid", money(data.advancePaid)],
    ["Remaining Fare", money(data.remainingFare)],
    ["Razorpay Payment ID", data.paymentId],
  );

  return rows;
}

function createDetailsTable(data: OnlineBookingEmailData) {
  return getBookingRows(data)
    .map(
      ([label, value], index) => `
        <tr style="background:${index % 2 === 0 ? "#f8fafc" : "#ffffff"};">
          <td style="padding:11px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:38%;">
            ${safe(label)}
          </td>
          <td style="padding:11px;border-bottom:1px solid #e2e8f0;color:#172033;font-size:13px;font-weight:700;word-break:break-word;">
            ${safe(value)}
          </td>
        </tr>
      `
    )
    .join("");
}

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:25px 10px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:650px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
        <div style="background:#b91c1c;padding:25px;color:#ffffff;">
          <h1 style="margin:0;font-size:25px;letter-spacing:1px;">KHATU RIDES</h1>
          <p style="margin:6px 0 0;font-size:12px;letter-spacing:2px;">TRAVELS CO.</p>
        </div>
        <div style="padding:25px;">
          ${content}
        </div>
        <div style="padding:18px;text-align:center;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <strong style="color:#b91c1c;">Khatu Rides Travels Co.</strong>
          <p style="margin:6px 0;color:#64748b;font-size:12px;">
            9244137353 | khaturidescg.in
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendOnlineBookingEmails(
  data: OnlineBookingEmailData
) {
  if (
    !data.bookingId ||
    !data.passenger?.name ||
    !data.passenger?.mobile ||
    !data.passenger?.email ||
    !data.paymentId
  ) {
    throw new Error("Required booking or payment details are missing.");
  }

  const emailUser = process.env.EMAIL_USER;

  if (!emailUser || !process.env.EMAIL_PASS) {
    throw new Error("Email SMTP credentials are not configured.");
  }

  const transporter = createTransporter();
  const detailsTable = createDetailsTable(data);

  const customerHtml = emailLayout(`
    <div style="text-align:center;">
      <div style="display:inline-block;background:#dcfce7;color:#166534;padding:9px 17px;border-radius:30px;font-size:12px;font-weight:bold;">
        ✓ PAYMENT VERIFIED · BOOKING CONFIRMED
      </div>

      <h2 style="color:#172033;margin:22px 0 8px;">
        Thank You, ${safe(data.passenger.name)}!
      </h2>

      <p style="color:#64748b;font-size:14px;line-height:1.7;">
        Your booking with Khatu Rides Travels Co. has been successfully confirmed.
        Please keep this email for your journey reference.
      </p>
    </div>

    <div style="background:#f0fdf4;padding:17px;border-radius:10px;text-align:center;margin:22px 0;">
      <div style="font-size:11px;color:#166534;font-weight:bold;">BOOKING REFERENCE</div>
      <div style="font-size:20px;color:#166534;font-weight:800;margin-top:7px;">
        ${safe(data.bookingId)}
      </div>
    </div>

    <h3 style="font-size:16px;color:#172033;">Your Booking Details</h3>

    <table style="width:100%;border-collapse:collapse;">
      ${detailsTable}
    </table>

    <div style="background:#fff7ed;color:#9a3412;padding:16px;border-radius:10px;margin-top:22px;font-size:13px;line-height:1.7;">
      Our team will coordinate your cab assignment and share vehicle and driver details.
      For assistance, contact us at <strong>9244137353</strong>.
    </div>

    <p style="font-size:13px;color:#64748b;margin-top:22px;">
      Thank you for choosing Khatu Rides. We wish you a safe and comfortable journey!
    </p>
  `);

  const adminHtml = emailLayout(`
    <div style="background:#fff7ed;padding:17px;border-radius:10px;margin-bottom:22px;">
      <h2 style="margin:0;color:#9a3412;font-size:20px;">
        🚖 NEW ONLINE BOOKING
      </h2>
      <p style="margin:7px 0 0;color:#9a3412;font-size:13px;">
        Payment successfully verified. Cab assignment required.
      </p>
    </div>

    <h3 style="font-size:16px;color:#172033;">Complete Booking Information</h3>

    <table style="width:100%;border-collapse:collapse;">
      ${detailsTable}
    </table>

    <div style="background:#f8fafc;padding:17px;border-radius:10px;margin-top:22px;font-size:13px;line-height:1.9;">
      <strong>ADMIN ACTION REQUIRED</strong><br/>
      1. Check vehicle availability.<br/>
      2. Assign suitable vehicle and driver.<br/>
      3. Contact passenger for pickup coordination.<br/>
      4. Update cab assignment in the admin panel.
      <br/><br/>
      <a href="tel:${safe(data.passenger.mobile)}"
         style="display:inline-block;background:#b91c1c;color:#ffffff;padding:11px 18px;border-radius:7px;text-decoration:none;font-weight:bold;">
        Call Passenger
      </a>
    </div>
  `);

  const textDetails = getBookingRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const results = await Promise.allSettled([
    transporter.sendMail({
      from: `"Khatu Rides Travels Co." <${emailUser}>`,
      to: data.passenger.email,
      replyTo: ADMIN_EMAIL,
      subject: `✅ Booking Confirmed – ${data.bookingId} | Khatu Rides`,
      text: `Dear ${data.passenger.name},\n\nYour booking is confirmed.\n\n${textDetails}\n\nKhatu Rides Travels Co. | 9244137353`,
      html: customerHtml,
    }),

    transporter.sendMail({
      from: `"Khatu Rides Online Booking" <${emailUser}>`,
      to: ADMIN_EMAIL,
      replyTo: data.passenger.email,
      subject: `🚨 NEW ONLINE BOOKING – ${data.bookingId}`,
      text: `New online booking received.\n\n${textDetails}\n\nPlease assign a vehicle.`,
      html: adminHtml,
    }),
  ]);

  const customerResult = results[0];
  const adminResult = results[1];

  return {
    customer: {
      success: customerResult.status === "fulfilled",
      messageId:
        customerResult.status === "fulfilled"
          ? customerResult.value.messageId
          : null,
      error:
        customerResult.status === "rejected"
          ? String(customerResult.reason)
          : null,
    },
    admin: {
      success: adminResult.status === "fulfilled",
      messageId:
        adminResult.status === "fulfilled"
          ? adminResult.value.messageId
          : null,
      error:
        adminResult.status === "rejected"
          ? String(adminResult.reason)
          : null,
    },
    success:
      customerResult.status === "fulfilled" &&
      adminResult.status === "fulfilled",
  };
}

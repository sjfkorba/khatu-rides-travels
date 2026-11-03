
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase-admin";
import { sendOnlineBookingEmails } from "@/lib/booking-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ======================================================
// HELPERS
// ======================================================

function jsonError(message: string, status: number, extra = {}) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...extra,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}


function validSignature(
  orderId: string,
  paymentId: string,
  receivedSignature: string,
  secret: string
): boolean {
  if (!orderId || !paymentId || !receivedSignature || !secret) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  // SHA-256 HMAC hexadecimal signature = 64 characters
  if (!/^[a-fA-F0-9]{64}$/.test(receivedSignature)) {
    return false;
  }

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(receivedSignature, "hex");

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}


// ======================================================
// POST: VERIFY RAZORPAY PAYMENT
// ======================================================

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // 1. RAZORPAY CONFIGURATION
    // --------------------------------------------------

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return jsonError(
        "Razorpay server configuration is missing.",
        500
      );
    }

    // --------------------------------------------------
    // 2. READ REQUEST
    // --------------------------------------------------

    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid request body.", 400);
    }

    const bookingId = String(body.bookingId || "").trim();

    const razorpayOrderId = String(
      body.razorpay_order_id || ""
    ).trim();

    const razorpayPaymentId = String(
      body.razorpay_payment_id || ""
    ).trim();

    const razorpaySignature = String(
      body.razorpay_signature || ""
    ).trim();

    if (
      !bookingId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return jsonError(
        "Payment verification details are incomplete.",
        400
      );
    }

    // --------------------------------------------------
    // 3. LOAD FIREBASE BOOKING
    // --------------------------------------------------

    const db = getAdminDb();

    const bookingRef = db
      .collection("online_bookings")
      .doc(bookingId);

    const bookingSnapshot = await bookingRef.get();

    if (!bookingSnapshot.exists) {
      return jsonError(
        "Booking record not found in Firebase.",
        404
      );
    }

    const booking = bookingSnapshot.data();

    if (!booking) {
      return jsonError(
        "Booking details are unavailable.",
        404
      );
    }

    // --------------------------------------------------
    // 4. VERIFY ORDER ID
    // --------------------------------------------------

    if (booking.razorpayOrderId !== razorpayOrderId) {
      return jsonError(
        "Razorpay order does not match this booking.",
        400
      );
    }

    // --------------------------------------------------
    // 5. VERIFY RAZORPAY SIGNATURE
    // --------------------------------------------------

    const signatureIsValid = validSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      keySecret
    );

    if (!signatureIsValid) {
      return jsonError(
        "Invalid Razorpay payment signature.",
        400
      );
    }

    // --------------------------------------------------
    // 6. VERIFY PAYMENT DIRECTLY WITH RAZORPAY
    // --------------------------------------------------

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const payment = await razorpay.payments.fetch(
      razorpayPaymentId
    );

    if (payment.order_id !== razorpayOrderId) {
      return jsonError(
        "Payment does not belong to this Razorpay order.",
        400
      );
    }

    if (payment.status !== "captured") {
      return jsonError(
        "Payment has not been captured. Booking is not confirmed yet.",
        409,
        {
          paymentStatus: payment.status,
          paymentId: razorpayPaymentId,
        }
      );
    }

    // --------------------------------------------------
    // 7. VERIFY EXACT ORDER AMOUNT
    // --------------------------------------------------

    // advanceDue must be saved in Firestore when
    // the Razorpay order is created.
    // Current test amount: ₹1 = 100 paise.

    const expectedAmountPaise =
      Math.round(Number(booking.advanceDue) * 100);

    if (
      !Number.isFinite(expectedAmountPaise) ||
      expectedAmountPaise <= 0
    ) {
      return jsonError(
        "Expected booking payment amount is missing in Firebase.",
        400
      );
    }

    if (
      Number(payment.amount) !== expectedAmountPaise ||
      payment.currency !== "INR"
    ) {
      return jsonError(
        "Payment amount or currency does not match the booking.",
        400
      );
    }

    const advancePaid = Number(payment.amount) / 100;

    const totalFare = Number(booking.totalFare || 0);

    const remainingFare = Math.max(
      0,
      totalFare - advancePaid
    );

    // --------------------------------------------------
    // 8. VALIDATE BOOKING DATA FOR EMAIL
    // --------------------------------------------------

    const passenger = booking.passenger || {};

    if (
      !passenger.name ||
      !passenger.mobile ||
      !passenger.email ||
      !booking.pickup ||
      !booking.vehicleLabel
    ) {
      return jsonError(
        "Required passenger or journey details are missing from the booking.",
        400
      );
    }

    // --------------------------------------------------
    // 9. CONFIRM BOOKING + CLAIM EMAIL DISPATCH
    // --------------------------------------------------

    let shouldSendEmails = false;
    let alreadyConfirmed = false;

    await db.runTransaction(async (transaction) => {
      const latestSnapshot = await transaction.get(
        bookingRef
      );

      if (!latestSnapshot.exists) {
        throw new Error("Booking record not found.");
      }

      const latestBooking = latestSnapshot.data();

      if (!latestBooking) {
        throw new Error("Booking details are unavailable.");
      }

      if (
        latestBooking.razorpayOrderId !== razorpayOrderId
      ) {
        throw new Error("Booking order mismatch.");
      }

      // A different captured payment must never
      // overwrite the existing confirmed payment.
      if (
        latestBooking.paymentStatus === "captured" &&
        latestBooking.razorpayPaymentId !== razorpayPaymentId
      ) {
        throw new Error(
          "A different payment is already recorded for this booking."
        );
      }

      const alreadyPaid =
        latestBooking.paymentStatus === "captured" &&
        latestBooking.razorpayPaymentId === razorpayPaymentId;

      alreadyConfirmed = alreadyPaid;

      // Both emails already sent: do not send duplicates.
      const customerSent =
        latestBooking.customerEmailStatus === "sent";

      const adminSent =
        latestBooking.adminEmailStatus === "sent";

      const emailProcessing =
        latestBooking.emailDispatchStatus === "processing";

      if (!alreadyPaid) {
        transaction.update(bookingRef, {
          status: "confirmed",
          paymentStatus: "captured",

          razorpayPaymentId,
          razorpaySignature,

          paidAmount: advancePaid,
          advancePaid,
          remainingFare,

          confirmedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),

          confirmationEmailStatus: "pending",
          customerEmailStatus: "pending",
          adminEmailStatus: "pending",
          emailDispatchStatus: "pending",
        });
      }

      if (
        !customerSent &&
        !adminSent &&
        !emailProcessing
      ) {
        transaction.update(bookingRef, {
          emailDispatchStatus: "processing",
          emailDispatchStartedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        shouldSendEmails = true;
      } else if (
        !customerSent &&
        !adminSent &&
        emailProcessing
      ) {
        // Another verification request is already
        // sending the emails. Avoid concurrent duplicates.
        shouldSendEmails = false;
      } else if (!customerSent || !adminSent) {
        // At least one email is still pending/failed.
        // Allow retry of incomplete delivery.
        transaction.update(bookingRef, {
          emailDispatchStatus: "processing",
          emailDispatchStartedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        shouldSendEmails = true;
      }
    });

    // --------------------------------------------------
    // 10. SEND CUSTOMER + ADMIN EMAILS
    // --------------------------------------------------

    let customerEmailStatus: "sent" | "failed" | "already_sent" =
      "already_sent";

    let adminEmailStatus: "sent" | "failed" | "already_sent" =
      "already_sent";

    let emailError: string | null = null;

    if (shouldSendEmails) {
      try {
        const emailResult = await sendOnlineBookingEmails({
          bookingId,

          passenger: {
            name: String(passenger.name),
            mobile: String(passenger.mobile),
            email: String(passenger.email),
          },

          pickup: String(booking.pickup || ""),
          drop: String(booking.drop || ""),

          pickupDate: String(booking.pickupDate || ""),
          pickupTime: String(booking.pickupTime || ""),

          returnDate: booking.returnDate
            ? String(booking.returnDate)
            : null,

          returnTime: booking.returnTime
            ? String(booking.returnTime)
            : null,

          bookingType: String(booking.bookingType || ""),
          vehicleLabel: String(booking.vehicleLabel || ""),

          distanceKm: Number(booking.distanceKm || 0),

          totalFare,
          advancePaid,
          remainingFare,

          paymentId: razorpayPaymentId,
        });

        customerEmailStatus = emailResult.customer.success
          ? "sent"
          : "failed";

        adminEmailStatus = emailResult.admin.success
          ? "sent"
          : "failed";

        if (!emailResult.success) {
          emailError = [
            emailResult.customer.error,
            emailResult.admin.error,
          ]
            .filter(Boolean)
            .join(" | ");
        }

        await bookingRef.update({
          customerEmailStatus,
          adminEmailStatus,

          confirmationEmailStatus:
            emailResult.success ? "sent" : "partial_or_failed",

          emailDispatchStatus:
            emailResult.success ? "sent" : "failed",

          customerEmailMessageId:
            emailResult.customer.messageId || null,

          adminEmailMessageId:
            emailResult.admin.messageId || null,

          customerEmailError:
            emailResult.customer.error || null,

          adminEmailError:
            emailResult.admin.error || null,

          emailError,
          emailSentAt: emailResult.success
            ? FieldValue.serverTimestamp()
            : null,

          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (mailError) {
        emailError =
          mailError instanceof Error
            ? mailError.message.slice(0, 500)
            : "Email delivery failed.";

        customerEmailStatus = "failed";
        adminEmailStatus = "failed";

        console.error(
          "Khatu Rides booking email error:",
          mailError
        );

        await bookingRef.update({
          confirmationEmailStatus: "failed",
          customerEmailStatus: "failed",
          adminEmailStatus: "failed",
          emailDispatchStatus: "failed",
          emailError,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } else {
      const latest = (await bookingRef.get()).data();

      customerEmailStatus =
        latest?.customerEmailStatus === "sent"
          ? "already_sent"
          : "failed";

      adminEmailStatus =
        latest?.adminEmailStatus === "sent"
          ? "already_sent"
          : "failed";
    }

    // --------------------------------------------------
    // 11. SUCCESS RESPONSE
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        bookingId,

        status: "confirmed",
        paymentStatus: "captured",

        paymentId: razorpayPaymentId,
        paidAmount: advancePaid,

        emails: {
          customer: customerEmailStatus,
          admin: adminEmailStatus,
          error: emailError,
        },

        message:
          "Your Khatu Rides payment has been verified and booking is confirmed.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

  } catch (error) {
    console.error(
      "Khatu Rides Payment Verification Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}


import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { FieldValue } from "firebase-admin/firestore";

import { getServerRouteDistance } from "@/lib/google-route";
import { getAdminDb } from "@/lib/firebase-admin";
import { calculateFare } from "@/lib/fareCalculator";

import type {
  BookingType,
  VehicleType,
  LocalPackageType,
} from "@/lib/fareCalculator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ======================================================
// PAYMENT CONFIGURATION
// ======================================================

// Collect 25% of the actual server-calculated total fare.
const ADVANCE_PAYMENT_PERCENT = 25;

// ======================================================
// ALLOWED VALUES
// ======================================================

const ALLOWED_BOOKING_TYPES: BookingType[] = [
  "oneway",
  "roundtrip",
  "local",
];

const ALLOWED_VEHICLE_TYPES: VehicleType[] = [
  "sedan",
  "ertiga",
  "crysta",
];

const ALLOWED_LOCAL_PACKAGES: LocalPackageType[] = [
  "4hr40km",
  "8hr80km",
  "12hr120km",
];

// ======================================================
// HELPER FUNCTIONS
// ======================================================

function cleanText(value: unknown, maxLength = 180): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

// ======================================================
// CREATE ORDER API
// ======================================================

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // 1. RAZORPAY CONFIGURATION
    // --------------------------------------------------

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return errorResponse(
        "Razorpay keys are not configured.",
        500
      );
    }

    // --------------------------------------------------
    // 2. REQUEST BODY
    // --------------------------------------------------

    let body: Record<string, any>;

    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid request body.", 400);
    }

    const booking = body?.booking ?? body;

    if (!booking || typeof booking !== "object") {
      return errorResponse(
        "Booking details are required.",
        400
      );
    }

    // --------------------------------------------------
    // 3. PASSENGER DETAILS
    // --------------------------------------------------

    const passenger = {
      name: cleanText(booking.passenger?.name, 100),
      mobile: cleanText(booking.passenger?.mobile, 10),
      email: cleanText(
        booking.passenger?.email,
        160
      ).toLowerCase(),
    };

    if (
      passenger.name.length < 2 ||
      !isValidMobile(passenger.mobile) ||
      !isValidEmail(passenger.email)
    ) {
      return errorResponse(
        "Valid passenger name, 10-digit mobile number and email are required.",
        400
      );
    }

    // --------------------------------------------------
    // 4. JOURNEY DETAILS
    // --------------------------------------------------

    const pickup = cleanText(booking.pickup);
    const drop = cleanText(booking.drop);

    const pickupDate = cleanText(
      booking.pickupDate,
      10
    );

    const pickupTime = cleanText(
      booking.pickupTime,
      5
    );

    const returnDate = cleanText(
      booking.returnDate,
      10
    );

    const returnTime = cleanText(
      booking.returnTime,
      5
    );

    const bookingType =
      cleanText(booking.bookingType) as BookingType;

    const vehicleType =
      cleanText(booking.vehicleType) as VehicleType;

    const vehicleLabel = cleanText(
      booking.vehicleLabel || booking.vehicleType,
      100
    );

    if (
      !pickup ||
      !pickupDate ||
      !pickupTime ||
      !vehicleLabel ||
      !ALLOWED_BOOKING_TYPES.includes(bookingType) ||
      !ALLOWED_VEHICLE_TYPES.includes(vehicleType)
    ) {
      return errorResponse(
        "Invalid journey or vehicle details.",
        400
      );
    }

    if (bookingType !== "local" && !drop) {
      return errorResponse(
        "Drop location is required.",
        400
      );
    }

    if (
      bookingType === "roundtrip" &&
      (!returnDate || returnDate < pickupDate)
    ) {
      return errorResponse(
        "Valid return date is required.",
        400
      );
    }

    // --------------------------------------------------
    // 5. LOCAL PACKAGE
    // --------------------------------------------------

    const requestedPackage =
      cleanText(booking.localPackage) as LocalPackageType;

    const localPackage: LocalPackageType =
      ALLOWED_LOCAL_PACKAGES.includes(requestedPackage)
        ? requestedPackage
        : "8hr80km";

    // --------------------------------------------------
    // 6. SERVER-SIDE DISTANCE
    // --------------------------------------------------

    // Never trust the distance sent by the browser.
    let distanceKm = 0;
    let duration = "0s";

    if (bookingType !== "local") {
      const stops: string[] = Array.isArray(booking.stops)
        ? booking.stops
            .filter(
              (item: unknown): item is string =>
                typeof item === "string"
            )
            .map((item: string) => item.trim())
            .filter(Boolean)
            .slice(0, 5)
        : [];

      const serverRoute = await getServerRouteDistance(
        pickup,
        drop,
        stops
      );

      distanceKm = serverRoute.distanceKm;
      duration = serverRoute.duration;
    } else {
      // Preserve the existing local-package validation.
      // Local package server-side calculation is not yet
      // implemented in this API.
      return errorResponse(
        "Local package server-side validation is pending. Please use an outstation booking for this test.",
        400
      );
    }

    // --------------------------------------------------
    // 7. SERVER-SIDE FARE CALCULATION
    // --------------------------------------------------

    // Ignore client-submitted totalFare and amount.
    const fareResult = calculateFare({
      distance: distanceKm,
      vehicleType,
      bookingType,
      serviceType: "outstation",
      pickup,
      drop,
      pickupDate,
      pickupTime,
      returnDate: returnDate || undefined,
      returnTime: returnTime || undefined,
      localPackage,
    });

    const totalFare = Math.round(
      Number(fareResult.finalFare)
    );

    if (
      !Number.isFinite(totalFare) ||
      totalFare < 1
    ) {
      return errorResponse(
        "Unable to calculate a valid booking fare.",
        400
      );
    }

    // --------------------------------------------------
    // 8. CALCULATE 25% ADVANCE
    // --------------------------------------------------

    // Round advance to the nearest whole rupee.
    const advanceAmount = Math.round(
      (totalFare * ADVANCE_PAYMENT_PERCENT) / 100
    );

    const remainingFare = Math.max(
      0,
      totalFare - advanceAmount
    );

    if (
      !Number.isSafeInteger(advanceAmount) ||
      advanceAmount < 1
    ) {
      return errorResponse(
        "Unable to calculate a valid advance payment.",
        400
      );
    }

    // Razorpay accepts payment amount in paise.
    const advanceAmountPaise = advanceAmount * 100;

    // --------------------------------------------------
    // 9. FIREBASE ADMIN
    // --------------------------------------------------

    const db = getAdminDb();

    // Create a new pending booking document.
    const newBookingRef = db
      .collection("online_bookings")
      .doc();

    const bookingId = newBookingRef.id;

    // --------------------------------------------------
    // 10. SAVE PENDING BOOKING
    // --------------------------------------------------

    await newBookingRef.set({
      bookingId,

      status: "payment_pending",
      paymentStatus: "created",

      passenger,

      pickup,
      drop,

      pickupDate,
      pickupTime,

      returnDate: returnDate || null,
      returnTime: returnTime || null,

      bookingType,
      serviceType: "outstation",

      vehicleType,
      vehicleLabel,

      distanceKm,
      estimatedDuration: duration,

      localPackage,

      // Complete fare breakdown
      totalFare,

      advancePercentage: ADVANCE_PAYMENT_PERCENT,
      advanceDue: advanceAmount,
      advancePaid: 0,

      remainingFare,

      paymentProvider: "razorpay",

      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // --------------------------------------------------
    // 11. CREATE RAZORPAY ORDER
    // --------------------------------------------------

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const order = await razorpay.orders.create({
        amount: advanceAmountPaise,
        currency: "INR",

        receipt: `krt_${bookingId.slice(0, 25)}`,

        notes: {
          bookingId,
          pickup: pickup.slice(0, 120),
          drop: drop.slice(0, 120),
          vehicle: vehicleLabel,
          passengerName: passenger.name,
          passengerMobile: passenger.mobile,
          passengerEmail: passenger.email,
          journeyDate: pickupDate,
          journeyTime: pickupTime,
          totalFare: String(totalFare),
          advancePercentage: String(ADVANCE_PAYMENT_PERCENT),
          advanceAmount: String(advanceAmount),
          remainingFare: String(remainingFare),
        },
      });

      // ------------------------------------------------
      // 12. UPDATE FIRESTORE WITH ORDER ID
      // ------------------------------------------------

      await newBookingRef.update({
        razorpayOrderId: order.id,
        razorpayOrderAmount: advanceAmountPaise,
        paymentStatus: "order_created",
        updatedAt: FieldValue.serverTimestamp(),
      });

      // ------------------------------------------------
      // 13. RESPONSE TO FRONTEND
      // ------------------------------------------------

      return NextResponse.json(
        {
          success: true,

          bookingId,

          orderId: order.id,
          keyId,

          amount: order.amount,
          currency: order.currency,

          totalFare,

          advancePercentage: ADVANCE_PAYMENT_PERCENT,
          advanceDue: advanceAmount,
          paymentAmountRupees: advanceAmount,

          remainingFare,

          message: `Please pay ${ADVANCE_PAYMENT_PERCENT}% advance to confirm your booking.`,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    } catch (razorpayError) {
      await newBookingRef.update({
        status: "order_creation_failed",
        paymentStatus: "order_creation_failed",
        updatedAt: FieldValue.serverTimestamp(),
      });

      throw razorpayError;
    }
  } catch (error) {
    console.error(
      "Khatu Rides Create Order Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create booking payment order.",
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

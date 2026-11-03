import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { FieldValue, type DocumentReference } from "firebase-admin/firestore";

import { getServerRouteDistance } from "@/lib/google-route";
import { getAdminDb } from "@/lib/firebase-admin";
import { calculateFare } from "@/lib/fareCalculator";

import type {
  BookingType,
  VehicleType,
  LocalPackageType,
  FestivalFareRule,
  RouteCouponRule,
} from "@/lib/fareCalculator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADVANCE_PAYMENT_PERCENT = 25;

const ALLOWED_BOOKING_TYPES: BookingType[] = ["oneway", "roundtrip", "local"];
const ALLOWED_VEHICLE_TYPES: VehicleType[] = ["sedan", "ertiga", "crysta"];
const ALLOWED_LOCAL_PACKAGES: LocalPackageType[] = ["4hr40km", "8hr80km", "12hr120km"];

function cleanText(value: unknown, maxLength = 180): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile);
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function normalize(value: unknown): string {
  return String(value ?? "").trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
}

function asDateString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date.toISOString();
  }
  return "";
}

export async function POST(req: Request) {
  let bookingRef: DocumentReference | null = null;

  try {
    // 1. Razorpay configuration
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return errorResponse("Razorpay keys are not configured.", 500);
    }

    // 2. Request body
    let body: Record<string, any>;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid request body.", 400);
    }

    const booking = body?.booking ?? body;
    if (!booking || typeof booking !== "object") {
      return errorResponse("Booking details are required.", 400);
    }

    // 3. Passenger details
    const passenger = {
      name: cleanText(booking.passenger?.name, 100),
      mobile: cleanText(booking.passenger?.mobile, 10),
      email: cleanText(booking.passenger?.email, 160).toLowerCase(),
    };

    if (
      passenger.name.length < 2 ||
      !isValidMobile(passenger.mobile) ||
      !isValidEmail(passenger.email)
    ) {
      return errorResponse(
        "Valid passenger name, 10-digit mobile number and email are required.",
        400,
      );
    }

    // 4. Journey details
    const pickup = cleanText(booking.pickup);
    const drop = cleanText(booking.drop);
    const pickupDate = cleanText(booking.pickupDate, 10);
    const pickupTime = cleanText(booking.pickupTime, 5);
    const returnDate = cleanText(booking.returnDate, 10);
    const returnTime = cleanText(booking.returnTime, 5);
    const bookingType = cleanText(booking.bookingType) as BookingType;
    const vehicleType = cleanText(booking.vehicleType) as VehicleType;
    const vehicleLabel = cleanText(booking.vehicleLabel || booking.vehicleType, 100);

    if (
      !pickup ||
      !pickupDate ||
      !pickupTime ||
      !vehicleLabel ||
      !ALLOWED_BOOKING_TYPES.includes(bookingType) ||
      !ALLOWED_VEHICLE_TYPES.includes(vehicleType)
    ) {
      return errorResponse("Invalid journey or vehicle details.", 400);
    }

    if (bookingType !== "local" && !drop) {
      return errorResponse("Drop location is required.", 400);
    }

    if (bookingType === "roundtrip" && (!returnDate || returnDate < pickupDate)) {
      return errorResponse("Valid return date is required.", 400);
    }

    // 5. Local package
    const requestedPackage = cleanText(booking.localPackage) as LocalPackageType;
    const localPackage: LocalPackageType = ALLOWED_LOCAL_PACKAGES.includes(requestedPackage)
      ? requestedPackage
      : "8hr80km";

    // 6. Server-side route distance. Never trust distance submitted by browser.
    let distanceKm = 0;
    let duration = "0s";
    const stops: string[] = Array.isArray(booking.stops)
      ? booking.stops
          .filter((item: unknown): item is string => typeof item === "string")
          .map((item: string) => item.trim())
          .filter(Boolean)
          .slice(0, 5)
      : [];

    if (bookingType !== "local") {
      const serverRoute = await getServerRouteDistance(pickup, drop, stops);
      distanceKm = Number(serverRoute.distanceKm);
      duration = String(serverRoute.duration || "0s");

      if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
        return errorResponse("Unable to verify route distance. Please calculate the fare again.", 400);
      }
    }

    // 7. Load promotion rules from trusted Firestore source.
    const db = getAdminDb();

    const [festivalSnapshot, couponSnapshot] = await Promise.all([
      db.collection("festival_fares").get(),
      db.collection("route_coupons").get(),
    ]);

    const festivalRules: FestivalFareRule[] = festivalSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: cleanText(data.name, 120),
        increasePercent: Number(data.increasePercent || 0),
        isActive: data.isActive === true,
        startAt: asDateString(data.startAt),
        endAt: asDateString(data.endAt),
        status: data.status,
        fareTypes: Array.isArray(data.fareTypes) ? data.fareTypes : undefined,
        scope: data.scope,
      } as FestivalFareRule;
    });

    const couponRules: RouteCouponRule[] = couponSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: cleanText(data.code, 30).toUpperCase(),
        from: cleanText(data.from, 120),
        to: cleanText(data.to, 120),
        fromNormalized: cleanText(data.fromNormalized, 120),
        toNormalized: cleanText(data.toNormalized, 120),
        discountPercent: Number(data.discountPercent || 0),
        startAt: asDateString(data.startAt),
        endAt: asDateString(data.endAt),
        isActive: data.isActive === true,
        usageCount: Number(data.usageCount || 0),
      };
    });

    // Only the coupon code selected by the customer is considered.
    const couponCode = cleanText(
      booking.couponCode ||
      booking.appliedCoupon?.code ||
      booking.selectedCoupon?.code,
      30,
    ).toUpperCase();

    // 8. Recalculate final fare on the server using the same fare engine.
    // Client totalFare/finalFare/advance values are deliberately ignored.
    const fareResult = calculateFare({
      distance: distanceKm,
      vehicleType,
      bookingType,
      serviceType: bookingType === "local" ? "local" : "outstation",
      pickup,
      drop,
      pickupDate,
      pickupTime,
      returnDate: returnDate || undefined,
      returnTime: returnTime || undefined,
      localPackage,
      localHours: Number.isFinite(Number(booking.localHours))
        ? Number(booking.localHours)
        : undefined,
      localKilometers: Number.isFinite(Number(booking.localKilometers))
        ? Number(booking.localKilometers)
        : undefined,
      festivalRules,
      couponRules,
      couponCode: couponCode || undefined,
      bookingDate: pickupDate,
    });

    if (bookingType === "oneway" && !fareResult.isOneWayAvailable) {
      return errorResponse("One-way service is not available for this route.", 400);
    }

    const totalFare = Math.round(Number(fareResult.finalFare));

    if (!Number.isFinite(totalFare) || totalFare < 1) {
      return errorResponse("Unable to calculate a valid booking fare.", 400);
    }

    // 9. Calculate advance from the final fare (after festival and coupon).
    const advanceAmount = Math.round((totalFare * ADVANCE_PAYMENT_PERCENT) / 100);
    const remainingFare = Math.max(0, totalFare - advanceAmount);

    if (!Number.isSafeInteger(advanceAmount) || advanceAmount < 1) {
      return errorResponse("Unable to calculate a valid advance payment.", 400);
    }

    const advanceAmountPaise = advanceAmount * 100;

    // 10. Save pending booking before creating the Razorpay order.
    const newBookingRef = db.collection("online_bookings").doc();
    bookingRef = newBookingRef;

    const appliedFestival = fareResult.appliedFestivalRule || null;
    const appliedCoupon = fareResult.appliedCoupon || null;

    await newBookingRef.set({
      bookingId: newBookingRef.id,
      status: "payment_pending",
      paymentStatus: "created",
      passenger,
      pickup,
      drop: drop || null,
      pickupDate,
      pickupTime,
      returnDate: returnDate || null,
      returnTime: returnTime || null,
      bookingType,
      serviceType: bookingType === "local" ? "local" : "outstation",
      vehicleType,
      vehicleLabel,
      distanceKm,
      estimatedDuration: duration,
      localPackage: bookingType === "local" ? localPackage : null,
      totalFare,
      baseFareBeforePromotions: totalFare - Number(fareResult.festivalIncreaseAmount || 0) + Number(fareResult.couponDiscountAmount || 0),
      festivalIncreasePercent: Number(fareResult.festivalSurchargePercent || 0),
      festivalIncreaseAmount: Number(fareResult.festivalIncreaseAmount || 0),
      appliedFestival,
      couponCode: appliedCoupon?.code || null,
      couponDiscountPercent: Number(appliedCoupon?.discountPercent || 0),
      couponDiscountAmount: Number(fareResult.couponDiscountAmount || 0),
      appliedCoupon,
      fareCalculationBreakdown: fareResult.calculationBreakdown || [],
      advancePercentage: ADVANCE_PAYMENT_PERCENT,
      advanceDue: advanceAmount,
      advancePaid: 0,
      remainingFare,
      paymentProvider: "razorpay",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 11. Create Razorpay order for exactly the calculated advance.
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: advanceAmountPaise,
      currency: "INR",
      receipt: `krt_${newBookingRef.id.slice(0, 25)}`,
      notes: {
        bookingId: newBookingRef.id,
        pickup: pickup.slice(0, 120),
        drop: (drop || "Local Rental").slice(0, 120),
        vehicle: vehicleLabel,
        passengerName: passenger.name,
        passengerMobile: passenger.mobile,
        passengerEmail: passenger.email,
        journeyDate: pickupDate,
        journeyTime: pickupTime,
        bookingType,
        totalFare: String(totalFare),
        festivalIncreasePercent: String(fareResult.festivalSurchargePercent || 0),
        festivalIncreaseAmount: String(fareResult.festivalIncreaseAmount || 0),
        couponCode: appliedCoupon?.code || "",
        couponDiscountPercent: String(appliedCoupon?.discountPercent || 0),
        couponDiscountAmount: String(fareResult.couponDiscountAmount || 0),
        advancePercentage: String(ADVANCE_PAYMENT_PERCENT),
        advanceAmount: String(advanceAmount),
        remainingFare: String(remainingFare),
      },
    });

    // 12. Update pending booking with Razorpay order details.
    await newBookingRef.update({
      razorpayOrderId: order.id,
      razorpayOrderAmount: advanceAmountPaise,
      paymentStatus: "order_created",
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 13. Response to frontend.
    return NextResponse.json(
      {
        success: true,
        bookingId: newBookingRef.id,
        orderId: order.id,
        keyId,
        amount: order.amount,
        currency: order.currency,
        totalFare,
        advancePercentage: ADVANCE_PAYMENT_PERCENT,
        advanceDue: advanceAmount,
        paymentAmountRupees: advanceAmount,
        remainingFare,
        appliedFestival,
        festivalIncreasePercent: Number(fareResult.festivalSurchargePercent || 0),
        festivalIncreaseAmount: Number(fareResult.festivalIncreaseAmount || 0),
        appliedCoupon,
        couponDiscountPercent: Number(appliedCoupon?.discountPercent || 0),
        couponDiscountAmount: Number(fareResult.couponDiscountAmount || 0),
        fareBreakdown: fareResult.calculationBreakdown || [],
        message: `Please pay ${ADVANCE_PAYMENT_PERCENT}% advance to confirm your booking.`,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Khatu Rides Create Order Error:", error);

    if (bookingRef) {
      try {
        await bookingRef.update({
          status: "order_creation_failed",
          paymentStatus: "order_creation_failed",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error("Unable to mark booking order failure:", updateError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error
          ? error.message
          : "Unable to create booking payment order.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

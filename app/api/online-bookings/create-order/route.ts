import { NextResponse } from "next/server";

import Razorpay from "razorpay";

import { FieldValue, type DocumentReference } from "firebase-admin/firestore";

import { getServerRouteDistance } from "@/lib/google-route";

import { getAdminDb } from "@/lib/firebase-admin";

import { calculateFare, roundCustomerFare } from "@/lib/fareCalculator";

import { getPromotionEligibilityReason, calculatePromotionDiscount, type FarePromotion } from "@/lib/fare-promotions";

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

// Match city names even when Google Places returns "Bilaspur, Chhattisgarh, India".
function normalizePickupCity(value: unknown): string {
  return normalize(value)
    .split(",")[0]
    .replace(/\b(city|district)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function timestampMillis(value: unknown): number {
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object") {
    const v = value as { toDate?: () => Date; seconds?: number; _seconds?: number };
    if (typeof v.toDate === "function") return v.toDate().getTime();
    const seconds = Number(v.seconds ?? v._seconds);
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
  }
  return 0;
}

function ceilCustomerFare(value: number): number {
  return Math.ceil(Math.max(0, value) / 100) * 100;
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

    const [festivalSnapshot, couponSnapshot, campaignSnapshot, pickupRuleSnapshot] = await Promise.all([
      db.collection("festival_fares").get(),
      db.collection("route_coupons").get(),
      db.collection("fare_promotions").where("isActive", "==", true).get(),
      db.collection("pickup_location_fare_rules").get(),
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

      // Apply festival and route coupon below, matching Fare Results order.

      bookingDate: pickupDate,

    });

    if (bookingType === "oneway" && !fareResult.isOneWayAvailable) {

      return errorResponse("One-way service is not available for this route.", 400);

    }

    // Apply the same active pickup-location increase used by the customer fare calculator.
    // The rule is read from trusted Firestore; browser-submitted rule/fare values are ignored.
    const now = Date.now();
    const pickupCity = normalizePickupCity(pickup);
    const activePickupRule = pickupRuleSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((rule: any) => {
        const ruleCity = normalizePickupCity(rule.pickupNormalized || rule.pickupLocation);
        const percent = Number(rule.increasePercent || 0);
        const startedAt = timestampMillis(rule.startedAt);
        const expiresAt = timestampMillis(rule.expiresAt);
        return rule.isActive === true && !!pickupCity && ruleCity === pickupCity &&
          Number.isFinite(percent) && percent > 0 && percent <= 100 &&
          (!startedAt || startedAt <= now) && expiresAt > now;
      })
      .sort((a: any, b: any) => Number(b.increasePercent || 0) - Number(a.increasePercent || 0))[0] as any || null;

    const pickupIncreasePercent = activePickupRule ? Number(activePickupRule.increasePercent) : 0;

    // Pickup-surge bookings cannot use any base, coupon or campaign discount.
    const requestedCampaignId = activePickupRule ? "" : cleanText(booking.campaignId || booking.appliedCampaign?.id || booking.fareBreakdown?.campaignId, 140);
    const requestedCampaignCode = activePickupRule ? "" : cleanText(booking.campaignCode || booking.fareBreakdown?.campaignCode, 30).toUpperCase();
    const couponCode = activePickupRule ? "" : (requestedCampaignId ? "" : cleanText(
      booking.couponCode || booking.appliedCoupon?.code || booking.selectedCoupon?.code, 30,
    ).toUpperCase());

    // Validate the selected AUTO / COUPON campaign again on the server.

    // Browser-submitted discount amounts are never trusted.

    let appliedCampaign: FarePromotion | null = null;

    let campaignDiscountAmount = 0;

    // Match Fare Results: base fare -> festival -> route coupon -> campaign.

    const journeyAt = new Date(`${pickupDate}T12:00:00+05:30`).getTime();

    const isWithinJourneyDate = (startAt: string, endAt: string) => {

      const start = new Date(startAt).getTime();

      const end = new Date(endAt).getTime();

      return Number.isFinite(journeyAt) && Number.isFinite(start) &&

        Number.isFinite(end) && journeyAt >= start && journeyAt <= end;

    };

    const selectedFestival = festivalRules

      .filter((rule) => rule.isActive === true && Number(rule.increasePercent) > 0 &&

        !!rule.startAt && !!rule.endAt && isWithinJourneyDate(rule.startAt, rule.endAt))

      .sort((a, b) => Number(b.increasePercent) - Number(a.increasePercent))[0] || null;

    const engineFare = Number(fareResult.finalFare || 0);
    const engineNightSurchargeAmount = Number(fareResult.nightSurchargeAmount || 0);
    const engineNightSurchargePercent = Number(fareResult.nightSurchargePercent || 0);
    const engineBaseDiscountAmount = Number(fareResult.baseDiscountAmount || 0);

    // When pickup surge is active, remove the normal 10% base discount and
    // recompute night surcharge on the undiscounted base, exactly as the UI does.
    const undiscountedBaseFare = activePickupRule
      ? Math.max(0, engineFare - engineNightSurchargeAmount + engineBaseDiscountAmount)
      : Math.max(0, engineFare - engineNightSurchargeAmount);
    const nightSurchargeAmount = activePickupRule
      ? Math.round(undiscountedBaseFare * engineNightSurchargePercent / 100)
      : engineNightSurchargeAmount;
    const fareAfterNight = activePickupRule
      ? undiscountedBaseFare + nightSurchargeAmount
      : engineFare;

    const baseFare = activePickupRule
      ? undiscountedBaseFare
      : Math.max(0, fareAfterNight - engineNightSurchargeAmount + engineBaseDiscountAmount);
    const festivalPercent = Number(selectedFestival?.increasePercent || 0);
    const festivalIncreaseAmount = fareAfterNight * festivalPercent / 100;
    const festivalAdjustedFare = activePickupRule
      ? ceilCustomerFare(fareAfterNight + festivalIncreaseAmount)
      : roundCustomerFare(fareAfterNight + festivalIncreaseAmount);

    const pickupLocationPercentageFare = activePickupRule
      ? ceilCustomerFare(festivalAdjustedFare * (1 + pickupIncreasePercent / 100))
      : festivalAdjustedFare;
    const b2bCost = Number(fareResult.b2bMaxFare ?? fareResult.b2bMinFare ?? 0);
    const pickupLocationMarginFloor = activePickupRule && b2bCost > 0
      ? ceilCustomerFare(b2bCost + 500)
      : 0;
    const pickupLocationFinalFare = activePickupRule
      ? Math.max(pickupLocationPercentageFare, pickupLocationMarginFloor)
      : festivalAdjustedFare;

    const selectedCoupon = couponCode

      ? couponRules.find((rule) => {

          const from = normalize(pickup);

          const to = normalize(drop);

          const couponFrom = normalize(rule.fromNormalized || rule.from);

          const couponTo = normalize(rule.toNormalized || rule.to);

          return rule.isActive === true && rule.code?.toUpperCase() === couponCode &&

            Number(rule.discountPercent) > 0 && Number(rule.discountPercent) <= 100 &&

            !!rule.startAt && !!rule.endAt && isWithinJourneyDate(rule.startAt, rule.endAt) &&

            from.includes(couponFrom) && to.includes(couponTo);

        }) || null

      : null;

    if (couponCode && !selectedCoupon) {

      return errorResponse("Selected route coupon is no longer valid for this journey.", 409);

    }

    const couponPercent = Number(selectedCoupon?.discountPercent || 0);

    const fareAfterCoupon = selectedCoupon
      ? roundCustomerFare(pickupLocationFinalFare * (1 - couponPercent / 100))
      : pickupLocationFinalFare;

    let totalFare = fareAfterCoupon;

    if (requestedCampaignId && !activePickupRule) {

      const campaignDoc = campaignSnapshot.docs.find((d) => d.id === requestedCampaignId);

      if (!campaignDoc) return errorResponse("This discount campaign is no longer active.", 409);

      const d = campaignDoc.data();

      const asDate = (v: any) => typeof v === "string" ? v : v && typeof v.toDate === "function" ? v.toDate().toISOString() : "";

      appliedCampaign = {

        id: campaignDoc.id, name: cleanText(d.name, 120),

        discountType: d.discountType === "fixed" ? "fixed" : "percentage", discountValue: Number(d.discountValue || 0),

        bookingTypes: Array.isArray(d.bookingTypes) ? d.bookingTypes : [],

        routeScope: d.routeScope === "selected" ? "selected" : "all",

        selectedRoutes: Array.isArray(d.selectedRoutes) ? d.selectedRoutes : [],

        offerMode: d.offerMode === "coupon" ? "coupon" : "automatic", couponCode: cleanText(d.couponCode, 30),

        startAt: asDate(d.startAt), endAt: asDate(d.endAt), activeDays: Array.isArray(d.activeDays) ? d.activeDays.map(Number) : [],

        minimumFare: Number(d.minimumFare || 0), maximumDiscount: d.maximumDiscount == null ? null : Number(d.maximumDiscount),

        usageLimit: d.usageLimit == null ? null : Number(d.usageLimit), usageCount: Number(d.usageCount || 0),

        perCustomerLimit: d.perCustomerLimit == null ? null : Number(d.perCustomerLimit),

        allowStacking: d.allowStacking === true, priority: Number(d.priority || 0), isActive: d.isActive === true,

      };

      if (appliedCampaign.offerMode === "coupon" && (!requestedCampaignCode || requestedCampaignCode !== appliedCampaign.couponCode?.toUpperCase())) {

        return errorResponse("Campaign coupon code is invalid.", 400);

      }

      if (appliedCampaign.offerMode === "automatic" && requestedCampaignCode) {

        return errorResponse("Automatic campaign does not accept a coupon code.", 400);

      }

      const reason = getPromotionEligibilityReason(appliedCampaign, {

        bookingType, pickupDate, pickupTime, pickup, drop, fare: totalFare, offerMode: appliedCampaign.offerMode,

      });

      if (reason) return errorResponse(`Discount campaign is not eligible: ${reason}.`, 409);

      campaignDiscountAmount = calculatePromotionDiscount(appliedCampaign, totalFare);

      if (campaignDiscountAmount <= 0) return errorResponse("Campaign discount is zero for this fare.", 409);

      totalFare = Math.max(0, totalFare - campaignDiscountAmount);

    }

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

    const appliedFestival = selectedFestival ? { id: selectedFestival.id, name: selectedFestival.name, increasePercent: festivalPercent } : null;

    const appliedCoupon = selectedCoupon ? { id: selectedCoupon.id, code: selectedCoupon.code, discountPercent: couponPercent } : null;

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
      pickupLocationRuleId: activePickupRule?.id || null,
      pickupLocationName: activePickupRule ? cleanText(activePickupRule.pickupLocation, 120) : null,
      pickupLocationIncreasePercent: pickupIncreasePercent,
      pickupLocationIncreaseAmount: activePickupRule ? pickupLocationFinalFare - festivalAdjustedFare : 0,
      nightSurchargeAmount,
      pickupLocationMarginFloor,
      pickupLocationRuleApplied: Boolean(activePickupRule),

      baseFareBeforePromotions: baseFare,

      festivalIncreasePercent: festivalPercent,

      festivalIncreaseAmount,

      appliedFestival,

      couponCode: appliedCoupon?.code || null,

      couponDiscountPercent: couponPercent,

      couponDiscountAmount: activePickupRule ? 0 : festivalAdjustedFare - fareAfterCoupon,

      appliedCoupon,

      campaignId: appliedCampaign?.id || null,

      appliedCampaign: appliedCampaign ? { id: appliedCampaign.id, name: appliedCampaign.name, offerMode: appliedCampaign.offerMode, couponCode: appliedCampaign.offerMode === "coupon" ? appliedCampaign.couponCode : null, discountType: appliedCampaign.discountType, discountValue: appliedCampaign.discountValue, discountAmount: campaignDiscountAmount } : null,

      campaignDiscountAmount,

      fareCalculationBreakdown: [
        ...(fareResult.calculationBreakdown || []),
        ...(activePickupRule ? [`Pickup location increase (${pickupIncreasePercent}%): +₹${pickupLocationFinalFare - festivalAdjustedFare}`] : []),
        ...(appliedCampaign ? [`Campaign ${appliedCampaign.name}: -₹${campaignDiscountAmount}`] : []),
      ],

      advancePercentage: ADVANCE_PAYMENT_PERCENT,

      advanceDue: advanceAmount,

      advancePaid: 0,

      remainingFare,

      paymentProvider: "razorpay",

      createdAt: FieldValue.serverTimestamp(),

      updatedAt: FieldValue.serverTimestamp(),

    });

    // Reserve one campaign use atomically for this payment-pending booking.

    // Pending attempts count against usage caps to prevent simultaneous oversubscription.

    if (appliedCampaign) {

      const campaignRef = db.collection("fare_promotions").doc(appliedCampaign.id);

      await db.runTransaction(async (tx) => {

        const current = await tx.get(campaignRef);

        if (!current.exists || current.data()?.isActive !== true) throw new Error("Discount campaign was paused before checkout.");

        const data = current.data() || {};

        const used = Number(data.usageCount || 0);

        const limit = data.usageLimit == null ? null : Number(data.usageLimit);

        if (limit != null && used >= limit) throw new Error("Discount campaign usage limit has been reached.");

        const perCustomer = data.perCustomerLimit == null ? null : Number(data.perCustomerLimit);

        if (perCustomer != null) {

          const q = db.collection("online_bookings").where("campaignId", "==", appliedCampaign!.id).where("passenger.mobile", "==", passenger.mobile);

          const previous = await tx.get(q);

          const priorCustomerUses = previous.docs.filter((doc) => doc.id !== newBookingRef.id).length;

          if (priorCustomerUses >= perCustomer) throw new Error("You have already used this offer the maximum allowed number of times.");

        }

        tx.update(campaignRef, { usageCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() });

      });

    }

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

        festivalIncreasePercent: String(festivalPercent),

        festivalIncreaseAmount: String(festivalIncreaseAmount),

        couponCode: appliedCoupon?.code || "",

        couponDiscountPercent: String(couponPercent),

        couponDiscountAmount: String(activePickupRule ? 0 : festivalAdjustedFare - fareAfterCoupon),

        campaignId: appliedCampaign?.id || "",

        campaignDiscountAmount: String(campaignDiscountAmount),

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
        pickupLocationFareRule: activePickupRule ? {
          id: activePickupRule.id,
          pickupLocation: cleanText(activePickupRule.pickupLocation, 120),
          increasePercent: pickupIncreasePercent,
          increaseAmount: pickupLocationFinalFare - festivalAdjustedFare,
          marginFloorApplied: pickupLocationMarginFloor > pickupLocationPercentageFare,
        } : null,

        advancePercentage: ADVANCE_PAYMENT_PERCENT,

        advanceDue: advanceAmount,

        paymentAmountRupees: advanceAmount,

        remainingFare,

        appliedFestival,

        festivalIncreasePercent: festivalPercent,

        festivalIncreaseAmount,

        appliedCoupon,

        couponDiscountPercent: couponPercent,

        couponDiscountAmount: activePickupRule ? 0 : festivalAdjustedFare - fareAfterCoupon,

        appliedCampaign: appliedCampaign ? { id: appliedCampaign.id, name: appliedCampaign.name, offerMode: appliedCampaign.offerMode, discountAmount: campaignDiscountAmount } : null,

        campaignDiscountAmount,

        fareBreakdown: [
          ...(fareResult.calculationBreakdown || []),
          ...(activePickupRule ? [`Pickup location increase (${pickupIncreasePercent}%): +₹${pickupLocationFinalFare - festivalAdjustedFare}`] : []),
        ],

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

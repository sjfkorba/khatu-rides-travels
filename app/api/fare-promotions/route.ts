import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import type { FarePromotion } from "@/lib/fare-promotions";
import { getPromotionEligibilityReason } from "@/lib/fare-promotions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max = 180) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function dateValue(value: any): string {
  if (typeof value === "string") return value;
  if (value && typeof value.toDate === "function") return value.toDate().toISOString();
  return "";
}
function serialize(id: string, d: any): FarePromotion {
  return {
    id, name: clean(d.name, 120), discountType: d.discountType === "fixed" ? "fixed" : "percentage",
    discountValue: Number(d.discountValue || 0), bookingTypes: Array.isArray(d.bookingTypes) ? d.bookingTypes : [],
    routeScope: d.routeScope === "selected" ? "selected" : "all",
    selectedRoutes: Array.isArray(d.selectedRoutes) ? d.selectedRoutes : [],
    offerMode: d.offerMode === "coupon" ? "coupon" : "automatic", couponCode: clean(d.couponCode, 30),
    startAt: dateValue(d.startAt), endAt: dateValue(d.endAt), activeDays: Array.isArray(d.activeDays) ? d.activeDays.map(Number) : [],
    minimumFare: Number(d.minimumFare || 0), maximumDiscount: d.maximumDiscount == null ? null : Number(d.maximumDiscount),
    usageLimit: d.usageLimit == null ? null : Number(d.usageLimit), usageCount: Number(d.usageCount || 0),
    perCustomerLimit: d.perCustomerLimit == null ? null : Number(d.perCustomerLimit),
    allowStacking: d.allowStacking === true, priority: Number(d.priority || 0), isActive: d.isActive === true,
  };
}
function fail(message: string, status = 400) { return NextResponse.json({ success: false, error: message }, { status, headers: { "Cache-Control": "no-store" } }); }

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const bookingType = clean(u.searchParams.get("bookingType")) as "oneway" | "roundtrip" | "local";
    const pickupDate = clean(u.searchParams.get("pickupDate"), 10);
    const pickupTime = clean(u.searchParams.get("pickupTime"), 5);
    const pickup = clean(u.searchParams.get("pickup"));
    const drop = clean(u.searchParams.get("drop"));
    if (!(["oneway", "roundtrip", "local"].includes(bookingType)) || !pickupDate || !pickup) return fail("Journey details are required.");
    const snap = await getAdminDb().collection("fare_promotions").where("isActive", "==", true).get();
    const campaigns = snap.docs.map((d) => serialize(d.id, d.data())).filter((c) => c.offerMode === "automatic")
      .filter((c) => !getPromotionEligibilityReason(c, { bookingType, pickupDate, pickupTime, pickup, drop, fare: Number.MAX_SAFE_INTEGER, offerMode: "automatic" }))
      .map(({ couponCode: _hidden, ...c }) => c);
    return NextResponse.json({ success: true, campaigns }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("Fare promotions GET error", e);
    return fail("Unable to load fare promotions.", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = clean(body?.code, 30).toUpperCase();
    const bookingType = clean(body?.bookingType) as "oneway" | "roundtrip" | "local";
    const pickupDate = clean(body?.pickupDate, 10), pickupTime = clean(body?.pickupTime, 5);
    const pickup = clean(body?.pickup), drop = clean(body?.drop);
    const fare = Number(body?.fare || 0);
    if (!code || !(["oneway", "roundtrip", "local"].includes(bookingType)) || !pickupDate || !pickup || !Number.isFinite(fare)) return fail("Valid coupon and journey details are required.");
    const snap = await getAdminDb().collection("fare_promotions").where("isActive", "==", true).get();
    const found = snap.docs.map((d) => serialize(d.id, d.data())).find((c) => c.offerMode === "coupon" && c.couponCode?.toUpperCase() === code);
    if (!found) return fail("Coupon code not found or inactive.");
    const reason = getPromotionEligibilityReason(found, { bookingType, pickupDate, pickupTime, pickup, drop, fare, offerMode: "coupon" });
    if (reason) return fail(reason);
    return NextResponse.json({ success: true, campaign: found }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("Fare promotion coupon validation error", e);
    return fail("Unable to validate coupon.", 500);
  }
}

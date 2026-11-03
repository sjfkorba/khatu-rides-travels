
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // ==========================================
    // 1. GET BOOKING ID
    // ==========================================
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Booking ID is required.",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // ==========================================
    // 2. FIREBASE ADMIN CONNECTION
    // ==========================================
    const db = getAdminDb();

    // ==========================================
    // 3. FETCH BOOKING
    // ==========================================
    const bookingRef = db
      .collection("online_bookings")
      .doc(id);

    const snapshot = await bookingRef.get();

    if (!snapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking record not found.",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const booking = snapshot.data()!;

    // ==========================================
    // 4. CHECK PAYMENT STATUS
    // ==========================================
    if (
      booking.status !== "confirmed" ||
      booking.paymentStatus !== "captured"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification is pending. Your booking is not confirmed yet.",
          status: booking.status || "pending",
          paymentStatus: booking.paymentStatus || "pending",
        },
        {
          status: 409,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // ==========================================
    // 5. PREPARE CONFIRMED BOOKING DETAILS
    // ==========================================
    const responseBooking = {
      bookingId: booking.bookingId || snapshot.id,

      passenger: {
        name: booking.passenger?.name || "",
        mobile: booking.passenger?.mobile || "",
        email: booking.passenger?.email || "",
      },

      pickup: booking.pickup || "",
      drop: booking.drop || "",

      pickupDate: booking.pickupDate || "",
      pickupTime: booking.pickupTime || "",

      returnDate: booking.returnDate || null,
      returnTime: booking.returnTime || null,

      bookingType: booking.bookingType || "",

      vehicleLabel: booking.vehicleLabel || "",

      distanceKm: Number(booking.distanceKm || 0),

      totalFare: Number(booking.totalFare || 0),

      advancePaid: Number(
        booking.paidAmount ?? booking.advanceDue ?? 0
      ),

      remainingFare: Number(
        booking.remainingFare || 0
      ),

      paymentId: booking.razorpayPaymentId || "",

      status: booking.status,
    };

    // ==========================================
    // 6. RETURN SUCCESS RESPONSE
    // ==========================================
    return NextResponse.json(
      {
        success: true,
        booking: responseBooking,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );

  } catch (error) {
    console.error(
      "Khatu Rides Booking Details API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to retrieve booking details. Please contact Khatu Rides.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

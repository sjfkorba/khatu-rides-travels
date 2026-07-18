import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET() {
  const PLACE_ID = "ChIJU0DGLl0NwUoRsPmdIgaa_PU";
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { error: "Missing GOOGLE_PLACES_API_KEY" },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total,name&key=${API_KEY}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    const data = await res.json();

    console.log("GOOGLE API RESPONSE STATUS:", data.status);
    console.log("TOTAL REVIEWS RECEIVED:", data?.result?.reviews?.length || 0);

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.status, details: data },
        { status: 400 }
      );
    }

    const reviews = Array.isArray(data?.result?.reviews) ? data.result.reviews : [];

    return NextResponse.json({
      placeName: data?.result?.name || "",
      rating: data?.result?.rating || 0,
      user_ratings_total: data?.result?.user_ratings_total || 0,
      reviews,
      reviewsCountReturned: reviews.length,
      note: "Google Place Details usually returns limited public reviews only.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch Google reviews",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
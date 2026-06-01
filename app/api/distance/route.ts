import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const origin = body?.origin?.trim();
    const destination = body?.destination?.trim();

    console.log("Origin:", origin);
    console.log("Destination:", destination);

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    console.log("API Key Present:", !!apiKey);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters",
        },
        body: JSON.stringify({
          origin: {
            address: origin,
          },
          destination: {
            address: destination,
          },
          travelMode: "DRIVE",
        }),
      }
    );

    const data = await response.json();

    console.log("Google Response:", JSON.stringify(data));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || "Google API Error",
          fullError: data,
        },
        { status: response.status }
      );
    }

    const distanceMeters =
      data?.routes?.[0]?.distanceMeters;

    return NextResponse.json({
      distanceMeters,
      distanceKm: Math.round(distanceMeters / 1000),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to calculate distance" },
      { status: 500 }
    );
  }
}
  import { NextResponse } from "next/server";

  export const runtime = "nodejs";
  export const dynamic = "force-dynamic";

  type GoogleRoutesResponse = {
    routes?: Array<{
      distanceMeters?: number;
    }>;
    error?: {
      code?: number;
      message?: string;
      status?: string;
    };
  };

  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const origin = body?.origin?.trim();
      const destination = body?.destination?.trim();

      if (!origin || !destination) {
        return NextResponse.json(
          { error: "Origin and destination are required" },
          { status: 400 }
        );
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

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
          cache: "no-store",
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

      const data: GoogleRoutesResponse = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            error:
              data?.error?.message || "Failed to fetch route from Google Maps",
          },
          { status: response.status }
        );
      }

      const distanceMeters = data?.routes?.[0]?.distanceMeters;

      if (typeof distanceMeters !== "number") {
        return NextResponse.json(
          { error: "Distance not found" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        distanceMeters,
        distanceKm: Math.round(distanceMeters / 1000),
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to calculate distance" },
        { status: 500 }
      );
    }
  }
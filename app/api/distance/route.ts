// app/api/distance/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DistanceRequestBody = {
  origin?: string;
  destination?: string;
  stops?: string[];
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DistanceRequestBody;

    const origin = cleanText(body?.origin);
    const destination = cleanText(body?.destination);
    const stops = Array.isArray(body?.stops)
      ? body.stops.map(cleanText).filter(Boolean)
      : [];

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

    const requestBody = {
      origin: { address: origin },
      destination: { address: destination },
      intermediates: stops.map((stop) => ({ address: stop })),
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
      computeAlternativeRoutes: false,
      languageCode: "en-IN",
      units: "METRIC",
    };

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.legs.distanceMeters,routes.legs.duration,routes.travelAdvisory.tollInfo",
        },
        body: JSON.stringify(requestBody),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Google API Error" },
        { status: response.status }
      );
    }

    const route = data?.routes?.[0];
    if (!route?.distanceMeters) {
      return NextResponse.json({ error: "No route distance found" }, { status: 404 });
    }

    const distanceMeters = route.distanceMeters;
    const distanceKm = Math.round(distanceMeters / 1000);

    const hasToll = Boolean(route?.travelAdvisory?.tollInfo);
    let estimatedTollCost = 0;
    if (hasToll && route?.travelAdvisory?.tollInfo?.estimatedPrice) {
      const priceList = route.travelAdvisory.tollInfo.estimatedPrice;
      const inrPrice = priceList.find((p: any) => p.currencyCode === "INR");
      if (inrPrice) {
        estimatedTollCost = Math.round(Number(inrPrice.units || 0));
      }
    }

    return NextResponse.json({
      origin,
      destination,
      distanceKm,
      hasToll,
      estimatedTollCost,
    });
  } catch (error) {
    console.error("Distance API Pure Error:", error);
    return NextResponse.json({ error: "Failed to calculate distance" }, { status: 500 });
  }
}
type GoogleRouteResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
  }>;
};

export async function getServerRouteDistance(
  origin: string,
  destination: string,
  stops: string[] = []
) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is missing.");
  }

  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        intermediates: stops.map((stop) => ({
          address: stop,
        })),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
        computeAlternativeRoutes: false,
        languageCode: "en-IN",
        units: "METRIC",
      }),
      cache: "no-store",
    }
  );

  const data = (await response.json()) as GoogleRouteResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(data.error?.message || "Google Routes API failed.");
  }

  const meters = Number(data.routes?.[0]?.distanceMeters);

  if (!Number.isFinite(meters) || meters <= 0) {
    throw new Error("No valid route distance found.");
  }

  return {
    distanceMeters: meters,
    distanceKm: Math.round(meters / 1000),
    duration: data.routes?.[0]?.duration || "0s",
  };
}
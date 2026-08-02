// app/api/toll-calculator/route.ts
import { NextResponse } from "next/server";

interface TollPlaza {
  name: string;
  location: string;
  amount: number;
  state?: string;
}

// 👑 Real & Realistic Toll Database for Chhattisgarh & Madhya Pradesh Corridors
const CG_MP_TOLL_DATABASE: Record<string, TollPlaza[]> = {
  // Korba Connectivity Routes
  "korba-ambikapur": [
    { name: "Chotiya Toll Plaza", location: "NH-130, Chotiya (Katghora-Ambikapur Road)", amount: 115 }
  ],
  "korba-bilaspur": [
    { name: "Pali / Ratanpur Toll Plaza", location: "SH-5 / Bilaspur Highway Corridor", amount: 95 }
  ],
  "korba-raipur": [
    { name: "Pali / Ratanpur Toll Plaza", location: "Bilaspur Highway Route", amount: 95 },
    { name: "Takhatpur / Bilaspur Bypass Toll", location: "NH-130 Route", amount: 115 },
    { name: "Simga Toll Plaza", location: "NH-30, Simga Route", amount: 110 }
  ],
  "korba-raigarh": [
    { name: "Gharghoda / Tamnar Toll Plaza", location: "Industrial Corridor Route", amount: 85 }
  ],
  "korba-durg": [
    { name: "Bilaspur Bypass Toll", location: "NH-130", amount: 115 },
    { name: "Simga Toll Plaza", location: "NH-30", amount: 110 },
    { name: "Kumhari / Durg Toll Plaza", location: "NH-53 Expressway", amount: 75 }
  ],

  // Bilaspur Connectivity Routes
  "bilaspur-raipur": [
    { name: "Simga Toll Plaza", location: "NH-30, Simga Route", amount: 110 }
  ],
  "bilaspur-ambikapur": [
    { name: "Pali Toll Plaza", location: "Bilaspur Exit Corridor", amount: 95 },
    { name: "Chotiya Toll Plaza", location: "NH-130, Chotiya", amount: 115 }
  ],
  "bilaspur-durg": [
    { name: "Simga Toll Plaza", location: "NH-30", amount: 110 },
    { name: "Kumhari / Durg Toll Plaza", location: "NH-53", amount: 75 }
  ],

  // Raipur Connectivity & Interstate Routes
  "raipur-durg": [
    { name: "Kumhari / Durg Toll Plaza", location: "NH-53 Expressway", amount: 75 }
  ],
  "raipur-jagdalpur": [
    { name: "Dhamtari Road Toll Plaza", location: "NH-30", amount: 90 },
    { name: "Kanker Toll Checkpoint", location: "NH-30 South Corridor", amount: 105 }
  ],
  "raipur-bhopal": [
    { name: "Simga Toll Plaza", location: "NH-30", amount: 110 },
    { name: "Durg Bypass Toll", location: "NH-53", amount: 130 },
    { name: "Dongargarh Border Toll", state: "MP/CG", location: "NH-53 Interstate Border", amount: 140 }
  ],
  "raipur-indore": [
    { name: "Simga Toll Plaza", location: "NH-30", amount: 110 },
    { name: "Durg Bypass Toll", location: "NH-53", amount: 130 },
    { name: "Dongargarh Border Toll", state: "MP/CG", location: "NH-53", amount: 140 },
    { name: "Nagpur Bypass Toll", state: "Maharashtra", location: "NH-44 Corridor", amount: 155 }
  ],
  "raipur-nagpur": [
    { name: "Durg Bypass Toll", location: "NH-53", amount: 130 },
    { name: "Rajnandgaon Toll Plaza", location: "NH-53", amount: 125 },
    { name: "CG-MH Border Toll Plaza", state: "Maharashtra", location: "NH-53", amount: 135 }
  ]
};

export async function POST(request: Request) {
  try {
    const { pickup, drop } = await request.json();

    if (!pickup || !drop) {
      return NextResponse.json({ error: "Pickup and drop locations are required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API Key not configured" }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      pickup
    )}&destination=${encodeURIComponent(drop)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.routes || data.routes.length === 0) {
      return NextResponse.json({ error: `Google Maps Error: ${data.error_message || data.status}` }, { status: 400 });
    }

    const route = data.routes[0];
    const leg = route.legs[0];
    const distanceKm = leg.distance.value / 1000;
    const summary = route.summary ? route.summary.toLowerCase() : "";

    const pickupKey = pickup.split(",")[0].trim().toLowerCase();
    const dropKey = drop.split(",")[0].trim().toLowerCase();
    const routeKeyMatch = `${pickupKey}-${dropKey}`;
    const reverseKeyMatch = `${dropKey}-${pickupKey}`;

    let plazas: TollPlaza[] = [];

    // Check in our CG & MP real database first
    if (CG_MP_TOLL_DATABASE[routeKeyMatch]) {
      plazas = CG_MP_TOLL_DATABASE[routeKeyMatch];
    } else if (CG_MP_TOLL_DATABASE[reverseKeyMatch]) {
      plazas = CG_MP_TOLL_DATABASE[reverseKeyMatch];
    } else {
      // Fallback smart calculation for unlisted routes based on distance & regional standards
      if (distanceKm > 50) {
        const calculatedTolls = Math.max(1, Math.round(distanceKm / 80));
        const originCity = pickup.split(",")[0].trim();
        const destCity = drop.split(",")[0].trim();

        for (let i = 1; i <= calculatedTolls; i++) {
          plazas.push({
            name: i === 1 ? `Outskirt Toll Plaza near ${originCity}` : `Highway Corridor Toll Plaza #${i}`,
            location: `${originCity} - ${destCity} Route (National Highway)`,
            amount: 115,
          });
        }
      }
    }

    const totalTollAmount = plazas.reduce((sum, item) => sum + item.amount, 0);

    const tollDetails = {
      totalTolls: plazas.length,
      totalAmount: totalTollAmount,
      vehicleCategory: "Commercial Cab / Taxi (LMV)",
      plazas,
      encodedPolyline: route.overview_polyline.points,
    };

    return NextResponse.json({
      success: true,
      distanceText: leg.distance.text,
      durationText: leg.duration.text,
      tollDetails,
    });
  } catch (error: any) {
    console.error("CG-MP Toll calculation server crash:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
// lib/fareCalculator.ts

export const VEHICLES = {
  sedan: {
    label: "Sedan (Dzire/Etios)",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 15,
  },
  ertiga: {
    label: "Ertiga (6+1 Seater)",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 18,
  },
  innova: {
    label: "Innova (Premium 7 Seater)",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 20,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip";

export type CalculateFareResult = {
  actualDistance: number;
  billedDistance: number;
  rateUsed: number;
  strikeFare: number;
  finalFare: number;
  discountPercent: number;
  durationMinutes: number; 
};

interface RouteConfig {
  match: (p: string, d: string) => boolean;
  multiplier: number;
  discount: number;
  targetPriceOverride?: Record<VehicleType, number>;
  displayDistanceOverride?: number;
}

const ROUTE_RULES: RouteConfig[] = [
  {
    match: (p, d) => (p.includes("korba") && d.includes("bilaspur")) || (p.includes("bilaspur") && d.includes("korba")),
    multiplier: 1.80, discount: 0.18, displayDistanceOverride: 100,
    targetPriceOverride: { sedan: 1999, ertiga: 2499, innova: 2999 }
  },
  {
    match: (p, d) => (p.includes("korba") && d.includes("raipur")) || (p.includes("raipur") && d.includes("korba")),
    multiplier: 1.25, discount: 0.08, displayDistanceOverride: 220,
    targetPriceOverride: { sedan: 3499, ertiga: 4299, innova: 4899 }
  },
  {
    match: (p, d) => (p.includes("raipur") && d.includes("jagdalpur")) || (p.includes("jagdalpur") && d.includes("raipur")),
    multiplier: 1.25, discount: 0.10, displayDistanceOverride: 330,
    targetPriceOverride: { sedan: 5199, ertiga: 6299, innova: 6999 }
  },
  {
    match: (p, d) => (p.includes("bilaspur") && d.includes("ambikapur")) || (p.includes("ambikapur") && d.includes("bilaspur")),
    multiplier: 1.25, discount: 0.05, displayDistanceOverride: 250,
    targetPriceOverride: { sedan: 3899, ertiga: 4699, innova: 5299 }
  },
  {
    match: (p, d) => (p.includes("korba") && d.includes("ambikapur")) || (p.includes("ambikapur") && d.includes("korba")),
    multiplier: 1.35, discount: 0.08, displayDistanceOverride: 200, // Aapka bataya hua 200kms ka strict buffer loop
    targetPriceOverride: { sedan: 3699, ertiga: 4499, innova: 4999 }
  },
  {
    match: (p, d) => (p.includes("korba") && d.includes("champa")) || (p.includes("champa") && d.includes("korba")),
    multiplier: 1.55, discount: 0.10, displayDistanceOverride: 50,
    targetPriceOverride: { sedan: 999, ertiga: 1299, innova: 1599 }
  }
];

export function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  pickupLocation = "",
  dropLocation = "",
}: {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  pickupLocation?: string;
  dropLocation?: string;
}): CalculateFareResult {
  const baseDistance = distance > 0 ? Math.round(distance) : 0;
  const pLoc = pickupLocation.toLowerCase();
  const dLoc = dropLocation.toLowerCase();
  const ratePerKm = VEHICLES[vehicleType].baseRatePerKm;
  
  let currentMultiplier = 1.35; // Global long-route protection backup
  let currentDiscount = 0.06;
  let finalBilledDistance = baseDistance;
  let absoluteFinalFare = 0;
  let absoluteStrikeFare = 0;

  const matchedRule = ROUTE_RULES.find(rule => rule.match(pLoc, dLoc));

  if (matchedRule) {
    currentMultiplier = matchedRule.multiplier;
    currentDiscount = matchedRule.discount;
    if (matchedRule.displayDistanceOverride) {
      finalBilledDistance = matchedRule.displayDistanceOverride;
    }
    if (matchedRule.targetPriceOverride && matchedRule.targetPriceOverride[vehicleType]) {
      absoluteFinalFare = matchedRule.targetPriceOverride[vehicleType];
      const rawStrike = absoluteFinalFare / (1 - currentDiscount);
      absoluteStrikeFare = psychologicalPrice(rawStrike);
    }
  }

  // Pure dynamic logic injection if user enters completely raw node outside standard configurations
  if (absoluteFinalFare === 0) {
    const calculatedBase = baseDistance * ratePerKm;
    if (baseDistance > 400) currentMultiplier = 1.15; // Fair pricing matrix adjustments for high distance routes

    const baseWithMultiplier = calculatedBase * currentMultiplier;
    const discountedFare = baseWithMultiplier * (1 - currentDiscount);
    
    absoluteFinalFare = psychologicalPrice(discountedFare);
    absoluteStrikeFare = psychologicalPrice(baseWithMultiplier);
  }

  if (bookingType === "roundtrip") {
    absoluteFinalFare = absoluteFinalFare * 2;
    absoluteStrikeFare = absoluteStrikeFare * 2;
    finalBilledDistance = finalBilledDistance * 2;
  }

  // Duration Calculator Engine (~50km/hr standard structural translation ratio)
  const durationMinutes = Math.round((finalBilledDistance / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: finalBilledDistance,
    rateUsed: ratePerKm,
    strikeFare: absoluteStrikeFare,
    finalFare: absoluteFinalFare,
    discountPercent: Math.round(currentDiscount * 100),
    durationMinutes
  };
}
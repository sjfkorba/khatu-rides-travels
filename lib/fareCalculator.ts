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

const HIGH_VOLUME_HUBS = ["korba", "bilaspur", "raigarh", "raipur", "durg", "bhilai"];
const DRY_LOW_VOLUME_NODES = ["ambikapur", "chirmiri", "pithora", "sheorinarayan", "sakti", "baradwar"];

interface RouteConfig {
  match: (p: string, d: string) => boolean;
  multiplier: number;
  targetPriceOverride?: Record<VehicleType, number>;
  displayDistanceOverride?: number;
}

// 👑 FIXED: Tariffs directly set to the previous higher amounts since the discount framework is removed
const FIXED_ROUTE_RULES: RouteConfig[] = [
  {
    match: (p, d) => (p.includes("korba") && d.includes("bilaspur")) || (p.includes("bilaspur") && d.includes("korba")),
    multiplier: 1.80, displayDistanceOverride: 100,
    targetPriceOverride: { sedan: 2399, ertiga: 2999, innova: 3599 }
  },
  {
    match: (p, d) => (p.includes("korba") && d.includes("raipur")) || (p.includes("raipur") && d.includes("korba")),
    multiplier: 1.25, displayDistanceOverride: 220,
    targetPriceOverride: { sedan: 3799, ertiga: 4649, innova: 5299 } // 🎯 Locked to previous high premium rates
  },
  {
    match: (p, d) => (p.includes("raipur") && d.includes("jagdalpur")) || (p.includes("jagdalpur") && d.includes("raipur")),
    multiplier: 1.25, displayDistanceOverride: 330,
    targetPriceOverride: { sedan: 5799, ertiga: 6999, innova: 7699 }
  },
  {
    match: (p, d) => (p.includes("korba") && d.includes("champa")) || (p.includes("champa") && d.includes("korba")),
    multiplier: 1.55, displayDistanceOverride: 50,
    targetPriceOverride: { sedan: 1099, ertiga: 1449, innova: 1799 }
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
  
  let currentMultiplier = 1.00; 
  let finalBilledDistance = baseDistance;
  let absoluteFinalFare = 0;
  let absoluteStrikeFare = 0;

  const matchedFixedRule = FIXED_ROUTE_RULES.find(rule => rule.match(pLoc, dLoc));

  if (matchedFixedRule) {
    currentMultiplier = matchedFixedRule.multiplier;
    if (matchedFixedRule.displayDistanceOverride) {
      finalBilledDistance = matchedFixedRule.displayDistanceOverride;
    }
    if (matchedFixedRule.targetPriceOverride && matchedFixedRule.targetPriceOverride[vehicleType]) {
      absoluteFinalFare = matchedFixedRule.targetPriceOverride[vehicleType];
      absoluteStrikeFare = psychologicalPrice(absoluteFinalFare * 1.15);
    }
  }

  if (absoluteFinalFare === 0) {
    const isPickupDry = DRY_LOW_VOLUME_NODES.some(node => pLoc.includes(node));
    const isDropDry = DRY_LOW_VOLUME_NODES.some(node => dLoc.includes(node));
    
    const isOutsideCG = (!pLoc.includes("chhattisgarh") && !pLoc.includes(", cg")) || 
                        (!dLoc.includes("chhattisgarh") && !dLoc.includes(", cg"));

    const isInterstate = isOutsideCG && 
                         ((pLoc.includes("odisha") || dLoc.includes("odisha")) || 
                          (pLoc.includes("madhya pradesh") || dLoc.includes("madhya pradesh")) || 
                          (pLoc.includes("maharashtra") || dLoc.includes("maharashtra")) ||
                          (pLoc.includes("bihar") || dLoc.includes("bihar")) ||
                          (pLoc.includes("jharkhand") || dLoc.includes("jharkhand")));

    if (bookingType === "oneway") {
      if (isInterstate) {
        currentMultiplier = 1.55; 
      } else if (isPickupDry || isDropDry || isOutsideCG) {
        currentMultiplier = 1.25; 
      } else {
        currentMultiplier = 1.10; 
      }
    } else {
      currentMultiplier = 1.00;
    }

    const calculatedBase = baseDistance * ratePerKm;
    const baseWithMultiplier = calculatedBase * currentMultiplier;
    
    absoluteFinalFare = psychologicalPrice(baseWithMultiplier);
    absoluteStrikeFare = psychologicalPrice(baseWithMultiplier * 1.15);
  }

  if (bookingType === "roundtrip") {
    absoluteFinalFare = absoluteFinalFare * 2;
    absoluteStrikeFare = absoluteStrikeFare * 2;
    finalBilledDistance = finalBilledDistance * 2;
  }

  const durationMinutes = Math.round((finalBilledDistance / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: finalBilledDistance,
    rateUsed: ratePerKm,
    strikeFare: absoluteStrikeFare,
    finalFare: absoluteFinalFare,
    discountPercent: 0, 
    durationMinutes
  };
}
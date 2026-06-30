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

// 👑 HIGH-VOLUME CORE HUBS (Normal Base Rates Apply)
const HIGH_VOLUME_HUBS = ["korba", "bilaspur", "raigarh", "raipur", "durg", "bhilai"];

// 👑 DRY / LOW-VOLUME NODES (Forced 1.25x Multiplier on One-Way)
const DRY_LOW_VOLUME_NODES = ["ambikapur", "chirmiri", "pithora", "sheorinarayan", "sakti", "baradwar"];

// Hardcoded target overrides for explicit standard loops
interface RouteConfig {
  match: (p: string, d: string) => boolean;
  multiplier: number;
  discount: number;
  targetPriceOverride?: Record<VehicleType, number>;
  displayDistanceOverride?: number;
}

const FIXED_ROUTE_RULES: RouteConfig[] = [
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
  
  let currentMultiplier = 1.00; 
  let currentDiscount = 0.05;
  let finalBilledDistance = baseDistance;
  let absoluteFinalFare = 0;
  let absoluteStrikeFare = 0;

  // Step 1: Check if route matches explicit static high-volume rules first
  const matchedFixedRule = FIXED_ROUTE_RULES.find(rule => rule.match(pLoc, dLoc));

  if (matchedFixedRule) {
    currentMultiplier = matchedFixedRule.multiplier;
    currentDiscount = matchedFixedRule.discount;
    if (matchedFixedRule.displayDistanceOverride) {
      finalBilledDistance = matchedFixedRule.displayDistanceOverride;
    }
    if (matchedFixedRule.targetPriceOverride && matchedFixedRule.targetPriceOverride[vehicleType]) {
      absoluteFinalFare = matchedFixedRule.targetPriceOverride[vehicleType];
      const rawStrike = absoluteFinalFare / (1 - currentDiscount);
      absoluteStrikeFare = psychologicalPrice(rawStrike);
    }
  }

  // Step 2: Algorithmic pricing logic block for dynamic routes
  if (absoluteFinalFare === 0) {
    const isPickupDry = DRY_LOW_VOLUME_NODES.some(node => pLoc.includes(node));
    const isDropDry = DRY_LOW_VOLUME_NODES.some(node => dLoc.includes(node));
    
    // Check if route involves moving out of state lines or missing standard CG tag
    const isOutsideCG = (!pLoc.includes("chhattisgarh") && !pLoc.includes(", cg")) || 
                        (!dLoc.includes("chhattisgarh") && !dLoc.includes(", cg"));

    // Strict state boundary validation (Odisha, MP, Maharashtra, etc.)
    const isInterstate = isOutsideCG && 
                         ((pLoc.includes("odisha") || dLoc.includes("odisha")) || 
                          (pLoc.includes("madhya pradesh") || dLoc.includes("madhya pradesh")) || 
                          (pLoc.includes("maharashtra") || dLoc.includes("maharashtra")) ||
                          (pLoc.includes("bihar") || dLoc.includes("bihar")) ||
                          (pLoc.includes("jharkhand") || dLoc.includes("jharkhand")));

    if (bookingType === "oneway") {
      if (isInterstate) {
        // 👑 1.55x Multiplier for Interstate routes (e.g. Puri <-> Raipur, Raipur <-> Jharsuguda)
        currentMultiplier = 1.55;
        currentDiscount = 0.05; 
      } else if (isPickupDry || isDropDry || isOutsideCG) {
        // ⚡ 1.25x Multiplier for dynamic state dry nodes (e.g. Ambikapur, Chirmiri)
        currentMultiplier = 1.25;
        currentDiscount = 0.05;
      } else {
        // Standard high-volume intra-state hub connections
        currentMultiplier = 1.10;
        currentDiscount = 0.08;
      }
    } else {
      // Round-trip default configuration backup overhead
      currentMultiplier = 1.00;
      currentDiscount = 0.06;
    }

    const calculatedBase = baseDistance * ratePerKm;
    const baseWithMultiplier = calculatedBase * currentMultiplier;
    const discountedFare = baseWithMultiplier * (1 - currentDiscount);
    
    absoluteFinalFare = psychologicalPrice(discountedFare);
    absoluteStrikeFare = psychologicalPrice(baseWithMultiplier);
  }

  // Step 3: Handle Round-Trip final calculation
  if (bookingType === "roundtrip") {
    absoluteFinalFare = absoluteFinalFare * 2;
    absoluteStrikeFare = absoluteStrikeFare * 2;
    finalBilledDistance = finalBilledDistance * 2;
  }

  // Arrival estimation speed engine sync
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
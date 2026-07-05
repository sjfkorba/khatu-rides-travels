// lib/fareCalculator.ts

export interface VehicleConfig {
  label: string;
  image: string;
  baseRatePerKm: number;
  longRatePerKm: number;
}

export const VEHICLES = {
  wagonr: {
    label: "WagonR (Hatchback CNG)",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 12,
    longRatePerKm: 12,
  },
  sedan: {
    label: "Sedan (Dzire/Etios)",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 15,
    longRatePerKm: 15,
  },
  ertiga: {
    label: "Ertiga (6+1 Seater)",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 18, 
    longRatePerKm: 20, 
  },
  innova: {
    label: "Innova (Premium 7 Seater)",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=400",
    baseRatePerKm: 22, 
    longRatePerKm: 24, 
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip";
export type ServiceType = "outstation" | "local" | "airport";

export type CalculateFareResult = {
  actualDistance: number;
  billedDistance: number;
  rateUsed: number;
  strikeFare: number;
  finalFare: number;
  discountPercent: number;
  durationMinutes: number;
};

const DRY_LOW_VOLUME_NODES = ["ambikapur", "chirmiri", "pithora", "sheorinarayan", "sakti", "baradwar"];

export function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  serviceType = "outstation",
  pickupLocation = "",
  dropLocation = "",
}: {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  serviceType?: ServiceType;
  pickupLocation?: string;
  dropLocation?: string;
}): CalculateFareResult {
  const baseDistance = distance > 0 ? Math.round(distance) : 0;
  const pLoc = pickupLocation.toLowerCase();
  const dLoc = dropLocation.toLowerCase();

  if (serviceType === "local") {
    const localPackages = {
      wagonr: { finalFare: 1499, strikeFare: 1899, rate: 12 },
      sedan: { finalFare: 1899, strikeFare: 2299, rate: 15 },
      ertiga: { finalFare: 2499, strikeFare: 2999, rate: 20 },
      innova: { finalFare: 3299, strikeFare: 3899, rate: 22 },
    };
    const pack = localPackages[vehicleType];
    return {
      actualDistance: baseDistance || 80,
      billedDistance: 80,
      rateUsed: pack.rate,
      strikeFare: pack.strikeFare,
      finalFare: pack.finalFare,
      discountPercent: 15,
      durationMinutes: 480
    };
  }

  if (serviceType === "airport" && baseDistance < 40) {
    if (vehicleType === "sedan" || vehicleType === "wagonr") {
      return {
        actualDistance: baseDistance,
        billedDistance: baseDistance,
        rateUsed: 15,
        strikeFare: 749,
        finalFare: 599, 
        discountPercent: 20,
        durationMinutes: 45
      };
    }
  }

  let showKms = baseDistance;
  if (baseDistance <= 100) {
    showKms = baseDistance + 20;
  } else if (baseDistance <= 250) {
    showKms = baseDistance + 30;
  } else {
    showKms = baseDistance + 50;
  }

  const isLongDistance = baseDistance > 150;
  const ratePerKm = isLongDistance 
    ? VEHICLES[vehicleType].longRatePerKm 
    : VEHICLES[vehicleType].baseRatePerKm;

  let currentMultiplier = 1.00; 
  let absoluteFinalFare = 0;
  let absoluteStrikeFare = 0;
  let discountPercent = 0;

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
      currentMultiplier = 1.75; 
    } else if (isPickupDry || isDropDry || isOutsideCG) {
      currentMultiplier = 1.25; 
    } else {
      currentMultiplier = baseDistance <= 150 ? 1.85 : 1.65;
    }
  } else {
    currentMultiplier = 1.00;
  }

  const calculatedBase = showKms * ratePerKm;
  const baseWithMultiplier = calculatedBase * currentMultiplier;
  
  if (baseDistance <= 100) {
    discountPercent = 20; 
  } else if (baseDistance <= 150) {
    discountPercent = 21; 
  } else {
    discountPercent = 10; 
  }
  
  absoluteStrikeFare = psychologicalPrice(baseWithMultiplier * 1.15);
  const discountedValue = baseWithMultiplier * (1 - discountPercent / 100);
  absoluteFinalFare = psychologicalPrice(discountedValue);

  if (bookingType === "roundtrip") {
    absoluteFinalFare = absoluteFinalFare * 2;
    absoluteStrikeFare = absoluteStrikeFare * 2;
    showKms = showKms * 2;
  }

  const durationMinutes = Math.round((showKms / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: showKms,
    rateUsed: ratePerKm,
    strikeFare: absoluteStrikeFare,
    finalFare: absoluteFinalFare,
    discountPercent, 
    durationMinutes
  };
}
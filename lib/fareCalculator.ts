// lib/fareCalculator.ts

/**
 * =========================================================================
 * 👑 VEHICLE FLEET CONFIGURATION INTERFACE
 * =========================================================================
 */
export interface VehicleConfig {
  label: string;
  image: string;
  baseRatePerKm: number;
  longRatePerKm: number;
}

/**
 * =========================================================================
 * 👑 GLOBAL FLEET PRICE MATRIX (COMMERCIAL PER-KM RATES)
 * =========================================================================
 */
export const VEHICLES: Record<string, VehicleConfig> = {
  sedan: {
    label: "Maruti Suzuki Dzire",
    image: "/dezire.png",
    baseRatePerKm: 11, 
    longRatePerKm: 13,
  },
  ertiga: {
    label: "Maruti Suzuki Ertiga (MUV)",
    image: "/ertiga.png",
    baseRatePerKm: 13, 
    longRatePerKm: 15, 
  },
  crysta: {
    label: "Toyota Innova Crysta (Premium)",
    image: "/crysta.png",
    baseRatePerKm: 20, 
    longRatePerKm: 17, 
  },
};

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip";
export type ServiceType = "outstation" | "local";

export type CalculateFareResult = {
  actualDistance: number;
  billedDistance: number;
  rateUsed: number;
  strikeFare: number;
  finalFare: number;
  discountPercent: number;
  durationMinutes: number;
  haltCharges: number;
  autoCorrectedService: ServiceType;
};

export function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
}

// 👑 POPULAR HUBS WHITELIST (Standard Competitive Pricing Corridor)
const POPULAR_HUBS = [
  "bilaspur",
  "raipur",
  "durg",
  "korba",
  "raigarh",
  "bhilai"
];

/**
 * Check if the drop location matches our popular high-density commercial hubs
 */
function isPopularHub(dropLocation: string): boolean {
  if (!dropLocation) return true; // Default true if empty to prevent breakage
  const lowerDrop = dropLocation.toLowerCase();
  return POPULAR_HUBS.some(hub => lowerDrop.includes(hub));
}

/**
 * =========================================================================
 * 👑 THE MASTER FARE CALCULATOR ENGINE
 * =========================================================================
 */
export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  serviceType = "outstation",
  pickupDate = "",
  pickupTime = "",
  returnDate = "",
  returnTime = "",
  drop = "",
}: {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  serviceType?: ServiceType;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  drop?: string;
}): CalculateFareResult {
  let baseDistance = distance > 0 ? Math.round(distance) : 0;
  
  /**
   * =========================================================================
   * 👑 FUNDA 1: AUTO-SERVICE TYPE CORRECTOR MACHINE
   * =========================================================================
   */
  let finalServiceType = serviceType;
  if (baseDistance > 80 && serviceType === "local") {
    finalServiceType = "outstation";
  } else if (baseDistance <= 40 && baseDistance > 0 && serviceType === "outstation") {
    finalServiceType = "local";
  }

  // Local Package fallback allocation sheet
  if (finalServiceType === "local") {
    const localPackages: Record<string, { finalFare: number; strikeFare: number; rate: number }> = {
      sedan: { finalFare: 1899, strikeFare: 1899, rate: 11 },
      ertiga: { finalFare: 2499, strikeFare: 2499, rate: 13 },
      crysta: { finalFare: 3299, strikeFare: 3299, rate: 20 },
    };
    const pack = localPackages[vehicleType];
    return {
      actualDistance: baseDistance || 80,
      billedDistance: 80,
      rateUsed: pack.rate,
      strikeFare: pack.finalFare,
      finalFare: pack.finalFare,
      discountPercent: 0,
      durationMinutes: 480,
      haltCharges: 0,
      autoCorrectedService: "local"
    };
  }

  /**
   * =========================================================================
   * 👑 LONG DISTANCE DISTANCE ADJUSTMENT RULE (+25 KMS IF 150+ KM ONEWAY)
   * =========================================================================
   */
  if (bookingType === "oneway" && baseDistance > 150) {
    baseDistance += 25; // Adding 25 Kms extra buffer for long distance one-way return overhead
  }

  // Short lead check buffer lock bypass (>500 KMs follows absolute true tracking)
  let showKms = baseDistance;
  if (baseDistance > 500) {
    showKms = baseDistance + 50; 
  }

  // 👑 RE-ENGINEERED UNCONDITIONAL LOCK: Micro Leads Minimum Floor Protection Block
  let effectiveCalculationDistance = showKms;
  if (bookingType === "oneway" && showKms < 80) {
    effectiveCalculationDistance = 80; 
  }

  let ratePerKm = VEHICLES[vehicleType].baseRatePerKm;
  let currentMultiplier = 1.00;
  let haltCharges = 0;

  /**
   * =========================================================================
   * 👑 ONE WAY PRICING CONTROL WITH COMPREHENSIVE STRATEGIC SLABS
   * =========================================================================
   */
  if (bookingType === "oneway") {
    
    // 👑 SLAB 0: Micro Leads Protection (<80 KM Floor Shield)
    if (showKms < 80) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.70;
        ratePerKm = 11.00;        
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 2.40;
        ratePerKm = 13.00;        
      } else if (vehicleType === "crysta") {
        currentMultiplier = 2.85;
        ratePerKm = 20.00;        
      }
    }
    // 👑 SLAB 1: Short Leads (80 KM - 150 KM Corridor)
    else if (showKms > 80 && showKms <= 150) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.95;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 2.10;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.80;
        ratePerKm = 20.00; 
      }
    }
    // 👑 SLAB 2: Mid-Corridors (151 KM - 350 KM Corridor)
    else if (showKms > 150 && showKms <= 350) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.45;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.55;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.25;
        ratePerKm = 20.00; 
      }
    }
    // 👑 SLAB 3: Long Routes (351 KM - 600 KM Corridor)
    else if (showKms > 350 && showKms <= 600) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.75;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 2.10;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.85;
        ratePerKm = 20.00; 
      }
    }
    // 👑 SLAB 4: Mega Highways Corridor (>600 KM)
    else {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.65;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.65;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.45;
        ratePerKm = 20.00; 
      }
    }

    // 👑 REMOTE / NON-POPULAR HUB SURCHARGE CHECK
    if (!isPopularHub(drop)) {
      currentMultiplier *= 1.42; 
    }

  /**
   * =========================================================================
   * 👑 ROUND TRIP PRICING CONTROL WITH VEHICLE-SPECIFIC MULTI-TIER SLABS
   * =========================================================================
   */
  } else if (bookingType === "roundtrip") {
    const totalRoundTripKm = baseDistance * 2;

    if (vehicleType === "sedan") {
      if (totalRoundTripKm > 400 && totalRoundTripKm < 600) {
        currentMultiplier = 2.45;
      } else if (totalRoundTripKm >= 600) {
        currentMultiplier = 2.10;
      } else {
        currentMultiplier = 3.40;
      }
    } else if (vehicleType === "ertiga") {
      if (totalRoundTripKm > 400 && totalRoundTripKm < 600) {
        currentMultiplier = 2.90;
      } else if (totalRoundTripKm >= 600) {
        currentMultiplier = 2.55;
      } else {
        currentMultiplier = 2.90;
      }
    } else if (vehicleType === "crysta") {
      if (totalRoundTripKm > 400 && totalRoundTripKm < 600) {
        currentMultiplier = 2.90;
      } else if (totalRoundTripKm >= 600) {
        currentMultiplier = 2.55;
      } else {
        currentMultiplier = 2.90;
      }
    }

    if (pickupDate && returnDate && pickupTime && returnTime) {
      try {
        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
        const returnDateTime = new Date(`${returnDate}T${returnTime}`);
        
        const estimatedTransitHours = showKms / 50;
        const estimatedTransitMs = estimatedTransitHours * 60 * 60 * 1000;
        
        const destinationReachDateTime = new Date(pickupDateTime.getTime() + estimatedTransitMs);
        const freeStayLimitDateTime = new Date(destinationReachDateTime.getTime() + (6 * 60 * 60 * 1000));
        
        if (returnDateTime.getTime() > freeStayLimitDateTime.getTime()) {
          const stayTimeDiffMs = returnDateTime.getTime() - destinationReachDateTime.getTime();
          const totalStayDays = Math.ceil(stayTimeDiffMs / (1000 * 60 * 60 * 24));
          
          if (totalStayDays > 0) {
            haltCharges = totalStayDays * 350;
          }
        }
      } catch (timelineError) {
        console.error("Timeline analysis crash:", timelineError);
      }
    }
  }

  /**
   * =========================================================================
   * 🧮 FINAL MATHEMATICAL MATRIX COMPLETION
   * =========================================================================
   */
  const calculatedBase = effectiveCalculationDistance * ratePerKm;
  const baseWithMultiplier = calculatedBase * currentMultiplier;

  const finalFareWithoutHalt = psychologicalPrice(baseWithMultiplier);
  const absoluteFinalFare = finalFareWithoutHalt + haltCharges;

  const durationMinutes = Math.round((showKms / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: bookingType === "roundtrip" ? showKms * 2 : effectiveCalculationDistance,
    rateUsed: ratePerKm,
    strikeFare: absoluteFinalFare,
    finalFare: absoluteFinalFare,
    discountPercent: 0,
    durationMinutes,
    haltCharges,
    autoCorrectedService: finalServiceType
  };
}
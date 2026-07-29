// lib/fareCalculator.ts

export interface VehicleConfig {
  label: string;
  image: string;
  baseRatePerKm: number;
  longRatePerKm: number;
}

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

const POPULAR_HUBS = [
  "bilaspur",
  "raipur",
  "durg",
  "korba",
  "raigarh",
  "bhilai"
];

function isPopularHub(dropLocation: string): boolean {
  if (!dropLocation) return true;
  const lowerDrop = dropLocation.toLowerCase();
  return POPULAR_HUBS.some(hub => lowerDrop.includes(hub));
}

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
  
  let finalServiceType = serviceType;
  if (baseDistance > 80 && serviceType === "local") {
    finalServiceType = "outstation";
  }

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

  if (bookingType === "oneway" && baseDistance > 150) {
    baseDistance += 25; 
  }

  let showKms = baseDistance;
  if (baseDistance > 500) {
    showKms = baseDistance + 50; 
  }

  let effectiveCalculationDistance = showKms;
  if (bookingType === "oneway" && showKms < 80) {
    effectiveCalculationDistance = 80; // Pricing calculation ke liye floor
  }

  let ratePerKm = VEHICLES[vehicleType].baseRatePerKm;
  let currentMultiplier = 1.00;
  let haltCharges = 0;
  let useCustomMicroBase = false;
  let customBaseFareValue = 0;

  if (bookingType === "oneway") {
    if (showKms < 80) {
      useCustomMicroBase = true;
      ratePerKm = 10.00; 

      if (vehicleType === "sedan") {
        customBaseFareValue = 1100;
      } else if (vehicleType === "ertiga") {
        customBaseFareValue = 1400;
      } else if (vehicleType === "crysta") {
        customBaseFareValue = 1800;
      }
    }
    else if (showKms >= 80 && showKms <= 150) {
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
    else if (showKms > 150 && showKms <= 300) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.35;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.50;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.15;
        ratePerKm = 20.00; 
      }
    }
    else if (showKms > 300 && showKms <= 600) {
      if (vehicleType === "sedan") {
        currentMultiplier = 0.95;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.15;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1;
        ratePerKm = 20.00; 
      }
    }
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

    if (!isPopularHub(drop)) {
      currentMultiplier *= 1.42; 
    }

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

  let baseWithMultiplier = 0;

  if (useCustomMicroBase) {
    const rawMicroTotal = customBaseFareValue + (showKms * ratePerKm);
    baseWithMultiplier = rawMicroTotal * currentMultiplier;
  } else {
    const calculatedBase = effectiveCalculationDistance * ratePerKm;
    baseWithMultiplier = calculatedBase * currentMultiplier;
  }

  const finalFareWithoutHalt = psychologicalPrice(baseWithMultiplier);
  const absoluteFinalFare = finalFareWithoutHalt + haltCharges;

  const durationMinutes = Math.round((showKms / 50) * 60) + 30;

  // Pop-up me actual/true distance show karne ke liye billedDistance me showKms return kar rahe hain
  const finalBilledDisplayDistance = bookingType === "roundtrip" ? showKms * 2 : showKms;

  return {
    actualDistance: baseDistance,
    billedDistance: finalBilledDisplayDistance,
    rateUsed: ratePerKm,
    strikeFare: absoluteFinalFare,
    finalFare: absoluteFinalFare,
    discountPercent: 0,
    durationMinutes,
    haltCharges,
    autoCorrectedService: finalServiceType
  };
}
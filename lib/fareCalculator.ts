// lib/fareCalculator.ts

export interface VehicleConfig {
  label: string;
  image: string;
  baseRatePerKm: number;
  longRatePerKm: number;
}

export const VEHICLES = {
  sedan: {
    label: "Maruti Suzuki Dzire",
    image: "/dezire.png",
    baseRatePerKm: 15,
    longRatePerKm: 15,
  },
  ertiga: {
    label: "Maruti Suzuki Ertiga (MUV)",
    image: "/ertiga.png",
    baseRatePerKm: 18, 
    longRatePerKm: 20, 
  },
  crysta: {
    label: "Toyota Innova Crysta (Premium)",
    image: "/crysta.png",
    baseRatePerKm: 22, 
    longRatePerKm: 24, 
  },
} as const;

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
};

export function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
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
}: {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  serviceType?: ServiceType;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
}): CalculateFareResult {
  const baseDistance = distance > 0 ? Math.round(distance) : 0;
  
  // 👑 DYNAMIC DISCOUNT ENGINE: 500 KM se zyada hone par 18%, baaki sab me standard flat 25%
  const discountPercent = baseDistance > 500 ? 10 : 25;

  // Local Packages Strategy
  if (serviceType === "local") {
    const localPackages = {
      sedan: { finalFare: 1899, strikeFare: 2532, rate: 15 },
      ertiga: { finalFare: 2499, strikeFare: 3332, rate: 20 },
      crysta: { finalFare: 3299, strikeFare: 4399, rate: 22 },
    };
    const pack = localPackages[vehicleType];
    return {
      actualDistance: baseDistance || 80,
      billedDistance: 80,
      rateUsed: pack.rate,
      strikeFare: pack.strikeFare,
      finalFare: pack.finalFare,
      discountPercent: 25, // Local slots follow standard marketing structure
      durationMinutes: 480,
      haltCharges: 0
    };
  }

  // Dynamic showKms buffer expansion setup (116 + 30 = 146 KM dynamic block hit)
  let showKms = baseDistance;
  if (baseDistance <= 100) {
    showKms = baseDistance + 20;
  } else if (baseDistance <= 250) {
    showKms = baseDistance + 30;
  } else {
    showKms = baseDistance + 50;
  }

  const isLongDistance = baseDistance > 150;
  let ratePerKm = isLongDistance 
    ? VEHICLES[vehicleType].longRatePerKm 
    : VEHICLES[vehicleType].baseRatePerKm;

  let currentMultiplier = 1.00;
  let haltCharges = 0;
  
  // Calculation standard expanded buffer distance (showKms) par hi chalegi
  let calculationDistance = showKms; 

  // =========================================================================
  // 👑 ONE WAY PRICING CONTROL BASED ON SHOWKMS (146 KM BRACKET CONTROL)
  // =========================================================================
  if (bookingType === "oneway") {
    currentMultiplier = 1.55; 

    /* 👑 FIXED CAP ON SHOWKMS:
       Calculation showKms par hi ho rahi hai, lekin agar final showKms 150 KM se kam aa raha hai,
       toh fare ko extra bhagne se rokne ke liye multipliers ko bracket lock kiya hai.
    */
    if (showKms < 150) {
      currentMultiplier = 1.55; 

      // Per KM standard base boundaries lock
      if (vehicleType === "sedan") ratePerKm = 15;
      if (vehicleType === "ertiga") ratePerKm = 20; 
      if (vehicleType === "crysta") ratePerKm = 22;
    }

  // =========================================================================
  // 👑 ROUND TRIP PRICING CONTROL
  // =========================================================================
  } else if (bookingType === "roundtrip") {
    currentMultiplier = 2.80; 

    // Dynamic timestamp evaluation engine for Night Halt Charges
    if (pickupDate && returnDate) {
      const startDateTime = new Date(`${pickupDate}T${pickupTime || "00:00"}`);
      const endDateTime = new Date(`${returnDate}T${returnTime || "00:00"}`);
      
      const timeDifferenceDiff = endDateTime.getTime() - startDateTime.getTime();
      const totalDaysStay = Math.ceil(timeDifferenceDiff / (1000 * 60 * 60 * 24));
      
      if (totalDaysStay > 0) {
        haltCharges = totalDaysStay * 300;
      }
    }
  }

  // Final math execution flow based entirely on target calculation architecture
  const calculatedBase = calculationDistance * ratePerKm;
  const baseWithMultiplier = calculatedBase * currentMultiplier;

  // Final Fare core calculation engine constant re-tracked with dynamic discount
  const dynamicFinalFareValue = baseWithMultiplier * (1 - discountPercent / 100);
  const finalFareWithoutHalt = psychologicalPrice(dynamicFinalFareValue);
  
  // Backward Trace mathematical equation mapping to ensure perfect dynamic alignment on UI screen
  const computedStrikeFare = Math.round(finalFareWithoutHalt / (1 - discountPercent / 100));

  const absoluteFinalFare = finalFareWithoutHalt + haltCharges;
  const absoluteStrikeFare = computedStrikeFare + haltCharges;

  const durationMinutes = Math.round((showKms / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: bookingType === "roundtrip" ? showKms * 2 : showKms,
    rateUsed: ratePerKm,
    strikeFare: absoluteStrikeFare,
    finalFare: absoluteFinalFare,
    discountPercent, // 👑 Pass back dynamically updated percentage object to the state layer
    durationMinutes,
    haltCharges
  };
}
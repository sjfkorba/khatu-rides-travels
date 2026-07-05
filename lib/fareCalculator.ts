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

  // Local Packages Strategy
  if (serviceType === "local") {
    const localPackages = {
      sedan: { finalFare: 1899, strikeFare: 2299, rate: 15 },
      ertiga: { finalFare: 2499, strikeFare: 2999, rate: 20 },
      crysta: { finalFare: 3299, strikeFare: 3899, rate: 22 },
    };
    const pack = localPackages[vehicleType];
    return {
      actualDistance: baseDistance || 80,
      billedDistance: 80,
      rateUsed: pack.rate,
      strikeFare: pack.strikeFare,
      finalFare: pack.finalFare,
      discountPercent: 25,
      durationMinutes: 480,
      haltCharges: 0
    };
  }

  // Dynamic showKms buffer expansion setup
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
  let haltCharges = 0;

  // 👑 NEW MULTIPLIER AND EXTRA NIGHT HALT CALCULATIONS
  if (bookingType === "oneway") {
    currentMultiplier = 1.55; // 👑 Flat short/long one-way multiplier
  } else if (bookingType === "roundtrip") {
    currentMultiplier = 2.75; // 👑 Flat short/long roundtrip multiplier

    // Dynamic timestamp evaluation engine for Night Halt Charges
    if (pickupDate && returnDate) {
      const startDateTime = new Date(`${pickupDate}T${pickupTime || "00:00"}`);
      const endDateTime = new Date(`${returnDate}T${returnTime || "00:00"}`);
      
      const timeDifferenceDiff = endDateTime.getTime() - startDateTime.getTime();
      const totalDaysStay = Math.ceil(timeDifferenceDiff / (1000 * 60 * 60 * 24));
      
      if (totalDaysStay > 0) {
        // Driver halt allocation loop setup @ ₹300 per night stay
        haltCharges = totalDaysStay * 300;
      }
    }
  }

  const calculatedBase = showKms * ratePerKm;
  const baseWithMultiplier = calculatedBase * currentMultiplier;
  const discountPercent = 25; // 👑 Flat 25% Discount updated as requested

  const absoluteStrikeFare = psychologicalPrice(baseWithMultiplier * 1.25) + haltCharges;
  const discountedValue = baseWithMultiplier * (1 - discountPercent / 100);
  const absoluteFinalFare = psychologicalPrice(discountedValue) + haltCharges;

  const durationMinutes = Math.round((showKms / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: bookingType === "roundtrip" ? showKms * 2 : showKms,
    rateUsed: ratePerKm,
    strikeFare: absoluteStrikeFare,
    finalFare: absoluteFinalFare,
    discountPercent, 
    durationMinutes,
    haltCharges
  };
}
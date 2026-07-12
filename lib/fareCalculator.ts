// lib/fareCalculator.ts

/**
 * =========================================================================
 * 👑 VEHICLE FLEET CONFIGURATION INTERFACE
 * =========================================================================
 * FUNDA: Yeh interface define karta hai ki har gadi ke segment me kya parameters hone chahiye.
 * ISSE KYA HOGA: System strictly typesafety maintain karega taaki image aur rates galat mapping na hon.
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
 * FUNDA: Khatu Rides Travels Co. ka official base rate aur long-distance rate sheet hai.
 * ISSE KYA HOGA: Sedan, Ertiga aur Crysta ki base pricing yahin se multi-ply hoke pure system me travel karegi.
 */
export const VEHICLES: Record<string, VehicleConfig> = {
  sedan: {
    label: "Maruti Suzuki Dzire",
    image: "/dezire.png",
    baseRatePerKm: 15,
    longRatePerKm: 12,
  },
  ertiga: {
    label: "Maruti Suzuki Ertiga (MUV)",
    image: "/ertiga.png",
    baseRatePerKm: 18, 
    longRatePerKm: 13, 
  },
  crysta: {
    label: "Toyota Innova Crysta (Premium)",
    image: "/crysta.png",
    baseRatePerKm: 22, 
    longRatePerKm: 18, 
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

/**
 * =========================================================================
 * 👑 PSYCHOLOGICAL PRICING ALGORITHM (MARKETING TRICK)
 * =========================================================================
 * FUNDA: Yeh pricing engine har final calculated amount ko nearest 50 me round karke 1 rupaya kam kar deta hai.
 * ISSE KYA HOGA: conversion rate maximum milta hai (e.g. ₹3999 instead of ₹4020).
 */
export function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
}

/**
 * =========================================================================
 * 👑 THE MASTER FARE CALCULATOR ENGINE
 * =========================================================================
 * FUNDA: Khatu Rides Travels Co. ka core mathematical logic sheet.
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
  
  /**
   * =========================================================================
   * 👑 FUNDA 1: AUTO-SERVICE TYPE CORRECTOR MACHINE
   * =========================================================================
   * FUNDA: Distance ke base par service type ko auto-correct karta hai.
   * ISSE KYA HOGA: Revenue loss bilkul 0% ho jayega agar koi wrong package choose karega.
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
      sedan: { finalFare: 1899, strikeFare: 1899, rate: 15 },
      ertiga: { finalFare: 2499, strikeFare: 2499, rate: 20 },
      crysta: { finalFare: 3299, strikeFare: 3299, rate: 22 },
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

  // Short lead check buffer lock bypass (<500 KMs follows absolute true google tracking)
  let showKms = baseDistance;
  if (baseDistance > 500) {
    showKms = baseDistance + 50; 
  }

  /**
   * =========================================================================
   * 👑 PER-KM COMMERCIAL TIER SELECTOR & LONG DISTANCE FLUCTUATION RATE TIER
   * =========================================================================
   * FUNDA: Route ki depth check karke correct per-kilometer price map ki jati hai.
   */
  const isLongDistance = baseDistance > 150;
  const isMegaOutstation = baseDistance > 500;
  
  let ratePerKm = isLongDistance 
    ? VEHICLES[vehicleType].longRatePerKm 
    : VEHICLES[vehicleType].baseRatePerKm;

  if (isMegaOutstation) {
    ratePerKm += (vehicleType === "sedan" ? 1 : vehicleType === "ertiga" ? 4 : 5);
  }

  let currentMultiplier = 1.00;
  let haltCharges = 0;

  /**
   * =========================================================================
   * 👑 ONE WAY PRICING CONTROL WITH NEW CUSTOM MULTIPLIER TIER SLABS
   * =========================================================================
   * FUNDA: Oneway route configuration settings based entirely on base distance ranges.
   * ISSE KYA HOGA:
   * - 500 KM se 700 KM ke long range corridors par highly attractive multiplier = 1.15 apply hoga.
   * - 80 KM se 200 KM ke beech short lead drop runs par premium protection multiplier = 1.85 register hoga.
   * - Baki sab fallback defaults standard 1.85 multiplier layer ko lock rakhenge.
   */
  if (bookingType === "oneway") {
    if (baseDistance > 500 && baseDistance < 700) {
      currentMultiplier = 1.15; 
    } else if (baseDistance > 90 && baseDistance < 200) {
      currentMultiplier = 1.25;
    } else if (baseDistance < 80){
      currentMultiplier = 1.35;
    }
    else {
      currentMultiplier = 1.85; 
    }

    // Tier 1 Corridor Filter: Short Lead Corridor (<200 KMs)
    if (showKms > 80 && showKms < 200) {
      if (vehicleType === "sedan") ratePerKm = 15;
      else if (vehicleType === "ertiga") ratePerKm = 17; 
      else if (vehicleType === "crysta") ratePerKm = 21;
    }
    // Tier 2 Corridor Filter: Medium Outstation Loops (200 KM se 490 KM ke beech)
    else if (showKms < 490) {
      if (vehicleType === "sedan") ratePerKm = 17.5;
      else if (vehicleType === "ertiga") ratePerKm = 21.5; 
      else if (vehicleType === "crysta") ratePerKm = 23.5;
    }
    // Tier 3 Corridor Filter: Mega Long Corridor (500 KM se 600 KM ke beech)
    else if (showKms > 500 && showKms < 600) {
      if (vehicleType === "sedan") ratePerKm = 10.5;
      else if (vehicleType === "ertiga") ratePerKm = 14.5; 
      else if (vehicleType === "crysta") ratePerKm = 20;
    }

  /**
   * =========================================================================
   * 👑 ROUND TRIP PRICING CONTROL WITH TRIPLE MULTIPLIER SLABS
   * =========================================================================
   */
  } else if (bookingType === "roundtrip") {
    if (baseDistance > 400 && baseDistance < 600) {
      currentMultiplier = 2.45; 
    } else if (baseDistance > 600) {
      currentMultiplier = 2.10;
    } else {
      currentMultiplier = 2.80; 
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
  const calculatedBase = showKms * ratePerKm;
  const baseWithMultiplier = calculatedBase * currentMultiplier;

  const finalFareWithoutHalt = psychologicalPrice(baseWithMultiplier);
  const absoluteFinalFare = finalFareWithoutHalt + haltCharges;

  const durationMinutes = Math.round((showKms / 50) * 60) + 30;

  return {
    actualDistance: baseDistance,
    billedDistance: bookingType === "roundtrip" ? showKms * 2 : showKms,
    rateUsed: ratePerKm,
    strikeFare: absoluteFinalFare,
    finalFare: absoluteFinalFare,
    discountPercent: 0,
    durationMinutes,
    haltCharges,
    autoCorrectedService: finalServiceType
  };
}
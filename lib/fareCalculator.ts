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
  isOneWayAvailable: boolean;
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
  "bhilai",
  "jharsuguda",
  "jagdalpur",
  "sambalpur",
  "ambikapur"
];

const AVAILABLE_ONEWAY_CITIES = [
  "raipur",
  "bilaspur",
  "korba",
  "raigarh",
  "durg",
  "bhilai",
  "rajnandgaon",
  "jagdalpur",
  "ambikapur",
  "dhamtari",
  "mahasamund",
  "kawardha",
  "janjgir",
  "champa",
  "balod",
  "bemetara",
  "kanker",
  "kondagaon",
  "dantewada",
  "sukma",
  "bijapur",
  "narayanpur",
  "gariaband",
  "baloda bazar",
  "mungeli",
  "surajpur",
  "balrampur",
  "jashpur",
  "gaurela",
  "pendra",
  "marwahi",
  "gevra",
  "dipka",
  "kusmunda",
  "katghora",
  "chirmiri",
  "manendragarh",
  "baikunthpur",
  "pathalgaon",
  "tilda",
  "simga",
  "arang",
  "kurud",
  "pithora",
  "saraipali",
  "basna",
  "dongargarh",
  "khairagarh",
  "sakti",
  "akaltara",
  "naila",
  "pali",
  "bharatpur",
  "lakhanpur",
  "wadrafnagar",
  "bhopal",
  "indore",
  "jabalpur",
  "nagpur",
  "jharsuguda",
  "sambalpur",
  "rourkela"
];

function isPopularHub(dropLocation: string): boolean {
  if (!dropLocation) return true;
  const lowerDrop = dropLocation.toLowerCase();
  return POPULAR_HUBS.some(hub => lowerDrop.includes(hub));
}

function isOneWayServiceAvailable(pickupLocation: string, dropLocation: string): boolean {
  const lowerPickup = pickupLocation ? pickupLocation.toLowerCase() : "";
  const lowerDrop = dropLocation ? dropLocation.toLowerCase() : "";

  const isPickupValid = AVAILABLE_ONEWAY_CITIES.some(city => lowerPickup.includes(city));
  const isDropValid = AVAILABLE_ONEWAY_CITIES.some(city => lowerDrop.includes(city));

  return isPickupValid || isDropValid;
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
  pickup = "",
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
  pickup?: string;
}): CalculateFareResult {
  let inputDistance = distance > 0 ? Math.round(distance) : 0;
  
  let finalServiceType = serviceType;
  if (inputDistance > 80 && serviceType === "local") {
    finalServiceType = "outstation";
  }

  let oneWayAvailable = true;
  if (bookingType === "oneway" && serviceType !== "local") {
    oneWayAvailable = isOneWayServiceAvailable(pickup, drop);
  }

  let workingDistance = inputDistance;
  if (bookingType === "roundtrip") {
    workingDistance = inputDistance * 2;
  }

  if (bookingType === "roundtrip" && workingDistance < 80) {
    const shortRoundTripPackages: Record<string, { baseFare: number; rate: number }> = {
      sedan: { baseFare: 1200, rate: 11 },
      ertiga: { baseFare: 1500, rate: 12 },
      crysta: { baseFare: 2200, rate: 14 },
    };

    const pack = shortRoundTripPackages[vehicleType];
    const rawTotal = pack.baseFare + (workingDistance * pack.rate) + 100;
    const calculatedFareValue = psychologicalPrice(rawTotal);

    return {
      actualDistance: workingDistance,
      billedDistance: workingDistance,
      rateUsed: pack.rate,
      strikeFare: calculatedFareValue,
      finalFare: calculatedFareValue,
      discountPercent: 0,
      durationMinutes: 480,
      haltCharges: 0,
      autoCorrectedService: "local",
      isOneWayAvailable: true
    };
  }

  if (finalServiceType === "local") {
    const localPackages: Record<string, { baseFare: number; rate: number }> = {
      sedan: { baseFare: 1200, rate: 11 },
      ertiga: { baseFare: 1500, rate: 12 },
      crysta: { baseFare: 2200, rate: 14 },
    };
    const pack = localPackages[vehicleType];
    const rawTotal = pack.baseFare + (80 * pack.rate) + 100;
    const finalFareValue = psychologicalPrice(rawTotal);

    return {
      actualDistance: 80,
      billedDistance: 80,
      rateUsed: pack.rate,
      strikeFare: finalFareValue,
      finalFare: finalFareValue,
      discountPercent: 0,
      durationMinutes: 480,
      haltCharges: 0,
      autoCorrectedService: "local",
      isOneWayAvailable: true
    };
  }

  if (bookingType === "oneway" && workingDistance > 150) {
    workingDistance += 5; 
  }

  let showKms = workingDistance;
  if (workingDistance > 500) {
    showKms = workingDistance + 50; 
  }

  let effectiveCalculationDistance = showKms;
  if (bookingType === "oneway" && showKms < 80) {
    effectiveCalculationDistance = 80; 
  }

  let ratePerKm = VEHICLES[vehicleType].baseRatePerKm;
  let currentMultiplier = 1.00;
  let haltCharges = 0;
  let useCustomMicroBase = false;
  let customBaseFareValue = 0;

  if (bookingType === "oneway") {
    if (showKms >= 39 && showKms < 70) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.25;
        ratePerKm = VEHICLES.sedan.baseRatePerKm; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.30;
        ratePerKm = VEHICLES.ertiga.baseRatePerKm; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.20;
        ratePerKm = VEHICLES.crysta.baseRatePerKm; 
      }
    }
    else if (showKms >= 70 && showKms <= 100) {
      if (vehicleType === "sedan") {
        currentMultiplier = 2.10;
        ratePerKm = 12.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 2.10;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.80;
        ratePerKm = 20.00; 
      }
    }
    else if (showKms >= 100 && showKms <= 150) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.74;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.90;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.50;
        ratePerKm = 20.00; 
      }
    }
    else if (showKms >= 150 && showKms <= 260) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.30;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.45;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.15;
        ratePerKm = 20.00; 
      }
    }
    else if (showKms > 260 && showKms <= 350) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.25;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.30;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.25;
        ratePerKm = 20.00; 
      }
    }
    else if (showKms > 300 && showKms <= 600) {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.35;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.55;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.40;
        ratePerKm = 20.00; 
      }
    }
    else {
      if (vehicleType === "sedan") {
        currentMultiplier = 1.05;
        ratePerKm = 11.00; 
      } else if (vehicleType === "ertiga") {
        currentMultiplier = 1.20;
        ratePerKm = 13.00; 
      } else if (vehicleType === "crysta") {
        currentMultiplier = 1.05;
        ratePerKm = 20.00; 
      }
    }

    if (!isPopularHub(drop)) {
      if (showKms <= 300) {
        currentMultiplier *= 1.45; 
      } else {
        currentMultiplier *= 1.10; 
      }
    }

  } else if (bookingType === "roundtrip") {
    const totalRoundTripKm = workingDistance;

    if (vehicleType === "sedan") {
      if (totalRoundTripKm > 1000) {
        currentMultiplier = 1.30;
        ratePerKm = 11.00;
      } else if (totalRoundTripKm > 600) {
        currentMultiplier = 1.25;
        ratePerKm = 11.00;
      } else if (totalRoundTripKm > 400) {
        currentMultiplier = 1.50;
        ratePerKm = 11.00;
      } else {
        currentMultiplier = 1.95;
        ratePerKm = 11.00;
      }
    } else if (vehicleType === "ertiga") {
      if (totalRoundTripKm > 1000) {
        currentMultiplier = 1.40;
        ratePerKm = 13.00;
      } else if (totalRoundTripKm > 600) {
        currentMultiplier = 1.45;
        ratePerKm = 13.00;
      } else if (totalRoundTripKm > 400) {
        currentMultiplier = 1.80;
        ratePerKm = 13.00;
      } else {
        currentMultiplier = 2.10;
        ratePerKm = 13.00;
      }
    } else if (vehicleType === "crysta") {
      if (totalRoundTripKm > 1000) {
        currentMultiplier = 1.35;
        ratePerKm = 18.00;
      } else if (totalRoundTripKm > 600) {
        currentMultiplier = 1.40;
        ratePerKm = 18.00;
      } else if (totalRoundTripKm > 400) {
        currentMultiplier = 1.90;
        ratePerKm = 18.00;
      } else {
        currentMultiplier = 2.20;
        ratePerKm = 18.00;
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
  const finalBilledDisplayDistance = showKms;
  const calculatedStrikeFare = Math.round(absoluteFinalFare * 1.15);

  // 👑 Ambikapur Special Override: Force finalFare to mirror strikeFare / higher fixed display price when drop is Ambikapur
  let displayedFinalFare = absoluteFinalFare;
  if (drop && drop.toLowerCase().includes("ambikapur")) {
    displayedFinalFare = calculatedStrikeFare;
  }

  return {
    actualDistance: workingDistance,
    billedDistance: finalBilledDisplayDistance,
    rateUsed: ratePerKm,
    strikeFare: calculatedStrikeFare,
    finalFare: displayedFinalFare,
    discountPercent: 0,
    durationMinutes,
    haltCharges,
    autoCorrectedService: finalServiceType,
    isOneWayAvailable: oneWayAvailable
  };
}
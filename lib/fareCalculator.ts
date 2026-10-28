/* =========================================================
   VEHICLE CONFIGURATION
========================================================= */

export interface VehicleConfig {
  label: string;
  image: string;
  baseRatePerKm: number;
  longRatePerKm: number;
  localRatePerKm: number;
  oneWayMultiplier: number;
}

export const VEHICLES: Record<string, VehicleConfig> = {
  sedan: {
    label: "Maruti Suzuki Dzire",
    image: "/dezire.png",
    baseRatePerKm: 11,
    longRatePerKm: 13,
    localRatePerKm: 10,
    oneWayMultiplier: 1,
  },

  ertiga: {
    label: "Maruti Suzuki Ertiga (MUV)",
    image: "/ertiga.png",
    baseRatePerKm: 13,
    longRatePerKm: 15,
    localRatePerKm: 13,
    oneWayMultiplier: 1.25,
  },

  crysta: {
    label: "Toyota Innova Crysta (Premium)",
    image: "/crysta.png",
    baseRatePerKm: 20,
    longRatePerKm: 17,
    localRatePerKm: 16,
    oneWayMultiplier: 1.65,
  },
};

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip" | "local";
export type ServiceType = "outstation" | "local";

/* =========================================================
   LOCAL PACKAGE TYPES & MASTER DATA (Exact Rates)
========================================================= */

export type LocalPackageType =
  | "4hr40km"
  | "8hr80km"
  | "12hr120km";

export interface LocalPackageConfig {
  id: LocalPackageType;
  label: string;
  hours: number;
  kms: number;
  baseFare: number;
  extraHourRate: number;
  extraKmRate: number;
}

export interface LocalFareResult {
  package: LocalPackageConfig;
  packageFare: number;
  actualHours: number;
  actualKilometers: number;
  extraHours: number;
  extraKilometers: number;
  extraHourCharges: number;
  extraKmCharges: number;
  totalExtraCharges: number;
  finalFare: number;
  strikeFare: number;
  tollParkingExcluded: boolean;
  driverAllowanceIncluded: boolean;
  fuelIncluded: boolean;
  freeCancellationHours: number;
}

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
  localFare?: LocalFareResult;
  /** Customer-facing B2C fare range for one-way bookings only. */
  b2cMinFare?: number;
  b2cMaxFare?: number;
};

export function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
}

export const LOCAL_PACKAGES: Record<
  VehicleType,
  Record<LocalPackageType, LocalPackageConfig>
> = {
  sedan: {
    "4hr40km": { id: "4hr40km", label: "4 Hours / 40 KM", hours: 4, kms: 40, baseFare: 600, extraHourRate: 300, extraKmRate: 10 },
    "8hr80km": { id: "8hr80km", label: "8 Hours / 80 KM", hours: 8, kms: 80, baseFare: 1200, extraHourRate: 300, extraKmRate: 10 },
    "12hr120km": { id: "12hr120km", label: "12 Hours / 120 KM", hours: 12, kms: 120, baseFare: 1800, extraHourRate: 300, extraKmRate: 10 },
  },
  ertiga: {
    "4hr40km": { id: "4hr40km", label: "4 Hours / 40 KM", hours: 4, kms: 40, baseFare: 750, extraHourRate: 300, extraKmRate: 10 },
    "8hr80km": { id: "8hr80km", label: "8 Hours / 80 KM", hours: 8, kms: 80, baseFare: 1500, extraHourRate: 300, extraKmRate: 10 },
    "12hr120km": { id: "12hr120km", label: "12 Hours / 120 KM", hours: 12, kms: 120, baseFare: 2250, extraHourRate: 300, extraKmRate: 10 },
  },
  crysta: {
    "4hr40km": { id: "4hr40km", label: "4 Hours / 40 KM", hours: 4, kms: 40, baseFare: 1100, extraHourRate: 300, extraKmRate: 10 },
    "8hr80km": { id: "8hr80km", label: "8 Hours / 80 KM", hours: 8, kms: 80, baseFare: 2200, extraHourRate: 300, extraKmRate: 10 },
    "12hr120km": { id: "12hr120km", label: "12 Hours / 120 KM", hours: 12, kms: 120, baseFare: 3300, extraHourRate: 300, extraKmRate: 10 },
  },
};
export function calculateLocalFare({
  vehicleType,
  packageType,
  actualHours,
  actualKilometers,
}: {
  vehicleType: VehicleType;
  packageType: LocalPackageType;
  actualHours: number;
  actualKilometers: number;
}): LocalFareResult {
  const packageConfig = LOCAL_PACKAGES[vehicleType][packageType || "8hr80km"];
  const safeHours = Math.max(0, Number(actualHours) || packageConfig.hours);
  const safeKilometers = Math.max(0, Number(actualKilometers) || packageConfig.kms);

  // Package base fare scales proportionally from the finalized 8-hour B2C base fare.
  const baseFarePerEightHours = LOCAL_PACKAGES[vehicleType]["8hr80km"].baseFare;
  const scaledBaseFare = Math.round(baseFarePerEightHours * (safeHours / 8));

  const extraHours = Math.max(0, Math.ceil(safeHours - packageConfig.hours));
  const extraKilometers = Math.max(0, Math.ceil(safeKilometers - packageConfig.kms));
  const extraHourCharges = extraHours * packageConfig.extraHourRate;
  // Extra kilometres are already charged through runningCharges below, so do not add a second extra-KM charge.
  const extraKmCharges = 0;

  // Finalized local rule: package base + ALL actual KM × vehicle-specific local rate + ₹200 driver fooding.
  const localRatePerKm = VEHICLES[vehicleType].localRatePerKm;
  const runningCharges = Math.ceil(safeKilometers) * localRatePerKm;
  const driverFooding = 200;
  const totalExtraCharges = extraHourCharges;
  const finalFare = scaledBaseFare + runningCharges + driverFooding + extraHourCharges;
  const strikeFare = Math.round(finalFare * 1.15);

  return {
    package: { ...packageConfig, baseFare: scaledBaseFare },
    packageFare: scaledBaseFare,
    actualHours: safeHours,
    actualKilometers: safeKilometers,
    extraHours,
    extraKilometers,
    extraHourCharges,
    extraKmCharges,
    totalExtraCharges,
    finalFare,
    strikeFare,
    tollParkingExcluded: true,
    driverAllowanceIncluded: false,
    fuelIncluded: true,
    freeCancellationHours: 6,
  };
}

const POPULAR_HUBS = [
  "bilaspur", "raipur", "durg", "korba", "raigarh",
  "bhilai", "jharsuguda", "jagdalpur", "sambalpur", "ambikapur",
];

const AVAILABLE_ONEWAY_CITIES = [
  "raipur", "bilaspur", "korba", "raigarh", "durg", "bhilai",
  "rajnandgaon", "jagdalpur", "ambikapur", "dhamtari", "mahasamund",
  "kawardha", "janjgir", "champa", "balod", "bemetara", "kanker",
  "kondagaon", "dantewada", "sukma", "bijapur", "narayanpur", "gariaband",
  "baloda bazar", "mungeli", "surajpur", "balrampur", "jashpur", "gaurela",
  "pendra", "marwahi", "gevra", "dipka", "kusmunda", "katghora",
  "chirmiri", "manendragarh", "baikunthpur", "pathalgaon", "tilda",
  "simga", "arang", "kurud", "pithora", "saraipali", "basna",
  "dongargarh", "khairagarh", "sakti", "akaltara", "naila", "pali",
  "bharatpur", "lakhanpur", "wadrafnagar", "bhopal", "indore",
  "jabalpur", "nagpur", "rourkela",
];

function isPopularHub(dropLocation: string): boolean {
  if (!dropLocation) return true;
  const lowerDrop = dropLocation.toLowerCase();
  return POPULAR_HUBS.some((hub) => lowerDrop.includes(hub));
}

function isOneWayServiceAvailable(pickupLocation: string, dropLocation: string): boolean {
  const lowerPickup = pickupLocation ? pickupLocation.toLowerCase() : "";
  const lowerDrop = dropLocation ? dropLocation.toLowerCase() : "";
  const isPickupValid = AVAILABLE_ONEWAY_CITIES.some((city) => lowerPickup.includes(city));
  const isDropValid = AVAILABLE_ONEWAY_CITIES.some((city) => lowerDrop.includes(city));
  return isPickupValid || isDropValid;
}

/* =========================================================
   CUSTOM FIXED ONEWAY FARES (Route Specific)
========================================================= */
export const FIXED_ONEWAY_FARES: Record<string, Record<VehicleType, number>> = {
  "korba-bilaspur": { sedan: 1799, ertiga: 2499, crysta: 3000 },
  "bilaspur-korba": { sedan: 1799, ertiga: 2499, crysta: 3000 }, // Reverse
  
  "korba-uslapur": { sedan: 1799, ertiga: 2499, crysta: 3000 },
  "uslapur-korba": { sedan: 1799, ertiga: 2499, crysta: 3000 }, // Reverse
  
  "korba-raipur": { sedan: 3899, ertiga: 4499, crysta: 5499 },
  "raipur-korba": { sedan: 3899, ertiga: 4499, crysta: 5499 }, // Reverse
  
  "korba-raigarh": { sedan: 2499, ertiga: 3299, crysta: 4299 },
  "raigarh-korba": { sedan: 2499, ertiga: 3299, crysta: 4299 }, // Reverse
  
  "raipur-ambikapur": { sedan: 5499, ertiga: 6499, crysta: 7999 },
  "ambikapur-raipur": { sedan: 5499, ertiga: 6499, crysta: 7999 }, // Reverse
};

/* =========================================================
   MAIN FARE CALCULATION ENGINE
========================================================= */
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
  localPackage = "8hr80km",
  localHours,
  localKilometers,
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
  localPackage?: LocalPackageType;
  localHours?: number;
  localKilometers?: number;
}): CalculateFareResult {
  const inputDistance = distance > 0 ? Math.round(distance) : 0;
  let finalServiceType = serviceType;

  if (inputDistance > 120 && serviceType === "local") {
    finalServiceType = "outstation";
  }

  let oneWayAvailable = true;
  if (bookingType === "oneway" && serviceType !== "local") {
    oneWayAvailable = isOneWayServiceAvailable(pickup, drop);
  }

  // --- LOCAL FARE LOGIC ---
  if (serviceType === "local") {
    const selectedPackage = LOCAL_PACKAGES[vehicleType][localPackage || "8hr80km"];
    const calculatedHours = typeof localHours === "number" ? localHours : selectedPackage.hours;
    const calculatedKilometers = typeof localKilometers === "number" ? localKilometers : selectedPackage.kms;

    const localFare = calculateLocalFare({
      vehicleType,
      packageType: localPackage || "8hr80km",
      actualHours: calculatedHours,
      actualKilometers: calculatedKilometers,
    });

    return {
      actualDistance: calculatedKilometers,
      billedDistance: calculatedKilometers,
      rateUsed: localFare.package.extraKmRate,
      strikeFare: localFare.strikeFare,
      finalFare: localFare.finalFare,
      discountPercent: 0,
      durationMinutes: Math.round(calculatedHours * 60),
      haltCharges: 0,
      autoCorrectedService: "local",
      isOneWayAvailable: true,
      localFare,
    };
  }

  // --- FINALIZED ONEWAY B2C FARE LOGIC ---
  // Customer-facing only. B2B/vendor prices are not returned or shown.
  // Default margin is ₹300; change ONEWAY_MARGIN to ₹200 for the lower-margin option.
  if (bookingType === "oneway") {
    const distanceKm = Math.max(0, inputDistance);

    const slabRate =
      distanceKm <= 50 ? 15 :
      distanceKm <= 100 ? 14 :
      distanceKm <= 150 ? 13 :
      distanceKm <= 200 ? 13 :
      distanceKm <= 300 ? 12 :
      distanceKm <= 450 ? 11 :
      distanceKm <= 600 ? 10 :
      distanceKm <= 800 ? 9 :
      8.5;

    const ONEWAY_MARGIN = 300;
    const tollRatePerKm = 2.15;
    const vehicleRate = slabRate * VEHICLES[vehicleType].oneWayMultiplier;

    // The sedan adjustment calibrates the 114-km fare to ₹1,987 with ₹300 margin
    // while retaining the configured ₹2.15/km toll. It applies to one-way only.
    const sedanCalibrationAdjustment =
      vehicleType === "sedan" ? distanceKm * 0.35 : 0;
    const baseFareBeforeMargin =
      distanceKm * vehicleRate +
      distanceKm * tollRatePerKm -
      sedanCalibrationAdjustment;

    const finalFare = Math.round(baseFareBeforeMargin + ONEWAY_MARGIN);
    const b2cMinFare = Math.round(baseFareBeforeMargin + 200);
    const b2cMaxFare = Math.round(baseFareBeforeMargin + 300);
    const strikeFare = Math.round(finalFare * 1.15);
    const durationMinutes = Math.round((distanceKm / 50) * 60) + 30;

    return {
      actualDistance: distanceKm,
      billedDistance: distanceKm,
      rateUsed: vehicleRate + tollRatePerKm,
      strikeFare,
      finalFare,
      discountPercent: 0,
      durationMinutes,
      haltCharges: 0,
      autoCorrectedService: finalServiceType,
      isOneWayAvailable: oneWayAvailable,
      b2cMinFare,
      b2cMaxFare,
    };
  }

  let workingDistance = bookingType === "roundtrip" ? inputDistance * 2 : inputDistance;

  // --- SHORT ROUNDTRIP OVERRIDE ---
  if (bookingType === "roundtrip" && workingDistance < 80) {
    const shortRoundTripPackages: Record<string, { baseFare: number; rate: number }> = {
      sedan: { baseFare: 1200, rate: 11 },
      ertiga: { baseFare: 1500, rate: 12 },
      crysta: { baseFare: 2200, rate: 14 },
    };
    const pack = shortRoundTripPackages[vehicleType];
    const rawTotal = pack.baseFare + workingDistance * pack.rate + 100;
    const calculatedFareValue = psychologicalPrice(rawTotal);
    const calculatedStrikeFare = Math.round(calculatedFareValue * 1.15);

    return {
      actualDistance: workingDistance,
      billedDistance: workingDistance,
      rateUsed: pack.rate,
      strikeFare: calculatedStrikeFare,
      finalFare: calculatedFareValue,
      discountPercent: 15,
      durationMinutes: 480,
      haltCharges: 0,
      autoCorrectedService: "local",
      isOneWayAvailable: true,
    };
  }

  // The finalized one-way calculator returns above; this remaining path handles round trips.
  const showKms = workingDistance > 500 ? workingDistance + 50 : workingDistance;
  const effectiveCalculationDistance = showKms;

  const lowerPickup = pickup ? pickup.toLowerCase().trim() : "";
  const lowerDrop = drop ? drop.toLowerCase().trim() : "";

  let ratePerKm = VEHICLES[vehicleType].baseRatePerKm;
  let currentMultiplier = 1.0;
  let haltCharges = 0;
  let useCustomMicroBase = false;
  let customBaseFareValue = 0;
  let routeCustomMultiplier = 1.0;

  if (lowerDrop.includes("ambikapur") && showKms < 200) {
    routeCustomMultiplier = 1.25;
  } else if (lowerDrop.includes("ambikapur") && showKms > 200) {
    routeCustomMultiplier = 1.1;
  } else if (lowerPickup.includes("ambikapur")) {
    routeCustomMultiplier = 1.05;
  }

  {
    const totalRoundTripKm = workingDistance;
    if (vehicleType === "sedan") {
      currentMultiplier = totalRoundTripKm > 1000 ? 1.3 : totalRoundTripKm > 600 ? 1.25 : totalRoundTripKm > 400 ? 1.5 : 1.95;
      ratePerKm = 11;
    } else if (vehicleType === "ertiga") {
      currentMultiplier = totalRoundTripKm > 1000 ? 1.4 : totalRoundTripKm > 600 ? 1.45 : totalRoundTripKm > 400 ? 1.8 : 2.1;
      ratePerKm = 13;
    } else if (vehicleType === "crysta") {
      currentMultiplier = totalRoundTripKm > 1000 ? 1.35 : totalRoundTripKm > 600 ? 1.4 : totalRoundTripKm > 400 ? 1.9 : 2.2;
      ratePerKm = 18;
    }

    if (pickupDate && returnDate && pickupTime && returnTime) {
      try {
        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
        const returnDateTime = new Date(`${returnDate}T${returnTime}`);
        const estimatedTransitHours = showKms / 50;
        const destinationReachDateTime = new Date(pickupDateTime.getTime() + estimatedTransitHours * 3600000);
        const freeStayLimitDateTime = new Date(destinationReachDateTime.getTime() + 21600000);

        if (returnDateTime.getTime() > freeStayLimitDateTime.getTime()) {
          const stayTimeDiffMs = returnDateTime.getTime() - destinationReachDateTime.getTime();
          const totalStayDays = Math.ceil(stayTimeDiffMs / 86400000);
          if (totalStayDays > 0) haltCharges = totalStayDays * 350;
        }
      } catch (e) {}
    }
  }

  const baseWithMultiplier = useCustomMicroBase
    ? (customBaseFareValue + showKms * ratePerKm) * currentMultiplier * routeCustomMultiplier
    : effectiveCalculationDistance * ratePerKm * currentMultiplier * routeCustomMultiplier;

  const finalFareWithoutHalt = psychologicalPrice(baseWithMultiplier);
  const absoluteFinalFare = finalFareWithoutHalt + haltCharges;
  const durationMinutes = Math.round((showKms / 50) * 60) + 30;
  const calculatedStrikeFare = Math.round(absoluteFinalFare * 1.15);

  return {
    actualDistance: workingDistance,
    billedDistance: showKms,
    rateUsed: ratePerKm,
    strikeFare: calculatedStrikeFare,
    finalFare: absoluteFinalFare,
    discountPercent: 15,
    durationMinutes,
    haltCharges,
    autoCorrectedService: finalServiceType,
    isOneWayAvailable: oneWayAvailable,
  };
}
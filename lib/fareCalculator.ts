/* =========================================================
   VEHICLE CONFIGURATION
========================================================= */

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
    "4hr40km": {
      id: "4hr40km",
      label: "4 Hours / 40 KM",
      hours: 4,
      kms: 40,
      baseFare: 1640,
      extraHourRate: 350,
      extraKmRate: 15,
    },
    "8hr80km": {
      id: "8hr80km",
      label: "8 Hours / 80 KM",
      hours: 8,
      kms: 80,
      baseFare: 3000,
      extraHourRate: 300,
      extraKmRate: 15,
    },
    "12hr120km": {
      id: "12hr120km",
      label: "12 Hours / 120 KM",
      hours: 12,
      kms: 120,
      baseFare: 4200,
      extraHourRate: 250,
      extraKmRate: 15,
    },
  },

  ertiga: {
    "4hr40km": {
      id: "4hr40km",
      label: "4 Hours / 40 KM",
      hours: 4,
      kms: 40,
      baseFare: 2280,
      extraHourRate: 400,
      extraKmRate: 20,
    },
    "8hr80km": {
      id: "8hr80km",
      label: "8 Hours / 80 KM",
      hours: 8,
      kms: 80,
      baseFare: 3500,
      extraHourRate: 300,
      extraKmRate: 20,
    },
    "12hr120km": {
      id: "12hr120km",
      label: "12 Hours / 120 KM",
      hours: 12,
      kms: 120,
      baseFare: 5200,
      extraHourRate: 250,
      extraKmRate: 20,
    },
  },

  crysta: {
    "4hr40km": {
      id: "4hr40km",
      label: "4 Hours / 40 KM",
      hours: 4,
      kms: 40,
      baseFare: 2800,
      extraHourRate: 450,
      extraKmRate: 25,
    },
    "8hr80km": {
      id: "8hr80km",
      label: "8 Hours / 80 KM",
      hours: 8,
      kms: 80,
      baseFare: 4500,
      extraHourRate: 300,
      extraKmRate: 25,
    },
    "12hr120km": {
      id: "12hr120km",
      label: "12 Hours / 120 KM",
      hours: 12,
      kms: 120,
      baseFare: 5800,
      extraHourRate: 250,
      extraKmRate: 20,
    },
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

  const extraHours = Math.max(0, Math.ceil(safeHours - packageConfig.hours));
  const extraKilometers = Math.max(0, Math.ceil(safeKilometers - packageConfig.kms));

  const extraHourCharges = extraHours * packageConfig.extraHourRate;
  const extraKmCharges = extraKilometers * packageConfig.extraKmRate;
  const totalExtraCharges = extraHourCharges + extraKmCharges;

  const finalFare = packageConfig.baseFare + totalExtraCharges;
  const strikeFare = Math.round(finalFare * 1.15);

  return {
    package: packageConfig,
    packageFare: packageConfig.baseFare,
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
    driverAllowanceIncluded: true,
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

  let workingDistance = bookingType === "roundtrip" ? inputDistance * 2 : inputDistance;

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

  if (bookingType === "oneway" && workingDistance > 150) {
    workingDistance += 5;
  }

  let showKms = workingDistance > 500 ? workingDistance + 50 : workingDistance;
  let effectiveCalculationDistance = bookingType === "oneway" && showKms < 80 ? 80 : showKms;
  let ratePerKm = VEHICLES[vehicleType].baseRatePerKm;
  let currentMultiplier = 1.0;
  let haltCharges = 0;
  let useCustomMicroBase = false;
  let customBaseFareValue = 0;

  const lowerPickup = pickup ? pickup.toLowerCase() : "";
  const lowerDrop = drop ? drop.toLowerCase() : "";
  let routeCustomMultiplier = 1.0;

  if (lowerDrop.includes("ambikapur") && showKms < 200) {
    routeCustomMultiplier = 1.25;
  } else if (lowerDrop.includes("ambikapur") && showKms > 200) {
    routeCustomMultiplier = 1.1;
  } else if (lowerPickup.includes("ambikapur")) {
    routeCustomMultiplier = 1.05;
  }

  if (bookingType === "oneway") {
    if (showKms >= 39 && showKms < 50) {
      currentMultiplier = vehicleType === "sedan" ? 1.35 : vehicleType === "ertiga" ? 1.3 : 1.2;
    } else if (showKms >= 50 && showKms <= 100) {
      currentMultiplier = vehicleType === "crysta" ? 1.8 : 2.1;
      ratePerKm = vehicleType === "sedan" ? 12 : vehicleType === "ertiga" ? 13 : 20;
    } else if (showKms >= 100 && showKms <= 150) {
      currentMultiplier = vehicleType === "sedan" ? 1.05 : vehicleType === "ertiga" ? 1.9 : 1.5;
      ratePerKm = vehicleType === "sedan" ? 20 : vehicleType === "ertiga" ? 13 : 20;
    } else if (showKms >= 150 && showKms <= 260) {
      currentMultiplier = vehicleType === "sedan" ? 1.4 : vehicleType === "ertiga" ? 1.45 : 1.15;
      ratePerKm = vehicleType === "sedan" ? 12 : vehicleType === "ertiga" ? 14 : 19.5;
    } else if (showKms > 260 && showKms <= 350) {
      currentMultiplier = vehicleType === "sedan" ? 1.45 : vehicleType === "ertiga" ? 1.4 : 1.4;
      ratePerKm = vehicleType === "sedan" ? 12 : vehicleType === "ertiga" ? 14 : 20;
    } else if (showKms > 300 && showKms <= 600) {
      currentMultiplier = vehicleType === "sedan" ? 1.6 : vehicleType === "ertiga" ? 1.85 : 1.65;
      ratePerKm = vehicleType === "sedan" ? 12 : vehicleType === "ertiga" ? 14 : 20;
    } else {
      currentMultiplier = vehicleType === "sedan" || vehicleType === "ertiga" ? 1.75 : 1.45;
      ratePerKm = vehicleType === "crysta" ? 20 : vehicleType === "sedan" ? 11 : 13;
    }

    if (!isPopularHub(drop)) {
      currentMultiplier *= showKms <= 300 ? 1.45 : 1.1;
    }
  } else {
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
export const VEHICLES = {
  sedan: {
    label: "Sedan",
    ratePerKm: 18,
    perDayCharge: 1200,
    fixedLocalCharge: 2400,
    dayHalt: 500,
    nightHalt: 600,
    maxPassengers: 4,
  },
  ertiga: {
    label: "Ertiga",
    ratePerKm: 20,
    perDayCharge: 1500,
    fixedLocalCharge: 3500,
    dayHalt: 600,
    nightHalt: 700,
    maxPassengers: 6,
  },
  innova: {
    label: "Innova",
    ratePerKm: 22,
    perDayCharge: 2000,
    fixedLocalCharge: 4500,
    dayHalt: 800,
    nightHalt: 900,
    maxPassengers: 7,
  },
  crysta: {
    label: "Innova Crysta",
    ratePerKm: 24,
    perDayCharge: 2500,
    fixedLocalCharge: 4500,
    dayHalt: 900,
    nightHalt: 1000,
    maxPassengers: 7,
  },
  scorpio: {
    label: "Scorpio",
    ratePerKm: 23,
    perDayCharge: 2200,
    fixedLocalCharge: 3500,
    dayHalt: 800,
    nightHalt: 900,
    maxPassengers: 7,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;

export type BookingType =
  | "oneway"
  | "roundtrip"
  | "airporttransfer"
  | "local";

export type PricingMode = "fixed" | "running";

type CalculateFareParams = {
  distance: number;
  extraKm?: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  pricingMode?: PricingMode;
  passengerCount?: number;
  stoppage?: number;
  dayHalts?: number;
  nightHalts?: number;
  tripDays?: number;
};

export type CalculateFareResult = {
  mapDistance: number;
  extraKm: number;
  totalRunningDistance: number;
  fare: number;
  finalFare: number;
  baseFare: number;
  fuelCharge: number;
  stoppageCharge: number;
  passengerCharge: number;
  dayHaltCharge: number;
  nightHaltCharge: number;
  remarks: string[];
};

function getPassengerCharge(
  passengerCount: number,
  maxPassengers: number
): number {
  if (!Number.isFinite(passengerCount) || passengerCount <= maxPassengers) {
    return 0;
  }
  return 300;
}

export function calculateFare({
  distance,
  extraKm = 0,
  vehicleType,
  bookingType,
  pricingMode = "fixed",
  passengerCount = 1,
  stoppage = 0,
  dayHalts = 0,
  nightHalts = 0,
  tripDays = 1,
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];

  const safeDistance =
    Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  const safeExtraKm =
    Number.isFinite(extraKm) && extraKm > 0 ? Math.round(extraKm) : 0;

  const safePassengerCount =
    Number.isFinite(passengerCount) && passengerCount > 0
      ? Math.round(passengerCount)
      : 1;

  const safeStoppage =
    Number.isFinite(stoppage) && stoppage > 0
      ? Math.min(Math.round(stoppage), 5)
      : 0;

  const safeDayHalts =
    Number.isFinite(dayHalts) && dayHalts > 0 ? Math.round(dayHalts) : 0;

  const safeNightHalts =
    Number.isFinite(nightHalts) && nightHalts > 0 ? Math.round(nightHalts) : 0;

  const safeTripDays =
    Number.isFinite(tripDays) && tripDays > 0 ? Math.round(tripDays) : 1;

  const passengerCharge = getPassengerCharge(
    safePassengerCount,
    vehicle.maxPassengers
  );

  const stoppageCharge = safeStoppage * 150;
  const dayHaltCharge = safeDayHalts * vehicle.dayHalt;
  const nightHaltCharge = safeNightHalts * vehicle.nightHalt;

  const oneSideDistance = safeDistance;
  const roundTripDistance = safeDistance * 2;
  const totalRunningDistance =
    bookingType === "roundtrip" ? roundTripDistance + safeExtraKm : oneSideDistance + safeExtraKm;

  let baseFare = 0;
  const fuelCharge = 0;
  const remarks: string[] = [];

  if (bookingType === "oneway") {
    const roundTripBase = (oneSideDistance * 2 + safeExtraKm) * vehicle.ratePerKm;
    baseFare = roundTripBase * 0.52;

    remarks.push(`One way distance: ${oneSideDistance} KM`);
    remarks.push(`Fare calculated on discounted round-trip base`);
  }

  if (bookingType === "roundtrip") {
    const distanceFare = (oneSideDistance * 2 + safeExtraKm) * vehicle.ratePerKm;
    const tripDayFare = safeTripDays * vehicle.perDayCharge;

    if (pricingMode === "fixed") {
      baseFare = distanceFare + tripDayFare + dayHaltCharge + nightHaltCharge;
    } else {
      baseFare = distanceFare + tripDayFare + dayHaltCharge + nightHaltCharge;
    }

    remarks.push(`Round trip distance: ${oneSideDistance * 2} KM`);
    remarks.push(`Trip days: ${safeTripDays}`);
  }

  if (bookingType === "local") {
    if (pricingMode === "fixed") {
      baseFare = vehicle.fixedLocalCharge;
    } else {
      baseFare =
        vehicle.perDayCharge + dayHaltCharge + nightHaltCharge + safeExtraKm * vehicle.ratePerKm;
    }

    remarks.push(`Local trip fare applied`);
  }

  if (bookingType === "airporttransfer") {
    baseFare = (oneSideDistance + safeExtraKm) * vehicle.ratePerKm;

    remarks.push(`Airport transfer distance: ${oneSideDistance} KM`);
  }

  const finalFare = Math.round(
    baseFare + stoppageCharge + passengerCharge
  );

  remarks.push(`Total running distance: ${totalRunningDistance} KM`);
  remarks.push(`Final fare: ₹${finalFare}`);

  return {
    mapDistance: oneSideDistance,
    extraKm: safeExtraKm,
    totalRunningDistance,
    fare: finalFare,
    finalFare,
    baseFare: Math.round(baseFare),
    fuelCharge,
    stoppageCharge,
    passengerCharge,
    dayHaltCharge,
    nightHaltCharge,
    remarks,
  };
}
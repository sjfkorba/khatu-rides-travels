export const VEHICLES = {
  sedan: {
    ratePerKm: 14,
    localPackage: 1800,
    dayHalt: 500,
    nightHalt: 600,
  },
  ertiga: {
    ratePerKm: 15,
    localPackage: 2200,
    dayHalt: 600,
    nightHalt: 700,
  },
  innova: {
    ratePerKm: 20,
    localPackage: 2500,
    dayHalt: 800,
    nightHalt: 900,
  },
  crysta: {
    ratePerKm: 22,
    localPackage: 2800,
    dayHalt: 900,
    nightHalt: 1000,
  },
  scorpio: {
    ratePerKm: 18,
    localPackage: 2500,
    dayHalt: 800,
    nightHalt: 900,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;

export type BookingType =
  | "oneway"
  | "roundtrip"
  | "airporttransfer"
  | "local";

type CalculateFareParams = {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  passengerCount: number;
  stoppage: number;
  dayHalts?: number;
  nightHalts?: number;
};

type CalculateFareResult = {
  distance: number;
  fare: number;
  finalFare: number;
  stoppageCharge: number;
  passengerCharge: number;
  dayHaltCharge: number;
  nightHaltCharge: number;
  remarks: string[];
};

function getPassengerCharge(passengerCount: number) {
  if (!Number.isFinite(passengerCount) || passengerCount <= 4) return 0;
  if (passengerCount <= 6) return 100;
  if (passengerCount <= 7) return 200;
  return 300;
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  passengerCount,
  stoppage,
  dayHalts = 0,
  nightHalts = 0,
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];

  const safeDistance =
    Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

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

  let baseFare = 0;

  if (bookingType === "oneway") {
    baseFare =
      safeDistance < 180
        ? safeDistance * vehicle.ratePerKm * 1.55
        : safeDistance * vehicle.ratePerKm * 1.25;
  } else if (bookingType === "roundtrip") {
    baseFare =
      safeDistance *
      vehicle.ratePerKm *
      2 *
      (safeDistance > 180 ? 1 : 1.15);
  } else if (bookingType === "airporttransfer") {
    baseFare = safeDistance * vehicle.ratePerKm * 1.35 + 150;
  } else if (bookingType === "local") {
    baseFare = vehicle.localPackage;
  }

  const passengerCharge = getPassengerCharge(safePassengerCount);
  const stoppageCharge = safeStoppage * 150;
  const dayHaltCharge = safeDayHalts * vehicle.dayHalt;
  const nightHaltCharge = safeNightHalts * vehicle.nightHalt;

  const subtotal =
    baseFare +
    passengerCharge +
    stoppageCharge +
    dayHaltCharge +
    nightHaltCharge;

  const finalFare = Math.round(subtotal);

  const remarks = [
    "Toll Tax Extra",
    "Parking Charges Extra",
    `Day Halt ₹${vehicle.dayHalt}/Day (if applicable)`,
    `Night Halt ₹${vehicle.nightHalt}/Night (if applicable)`,
    bookingType === "local"
      ? "Local package max 80 KM only"
      : "Fare calculated on actual/estimated distance",
    bookingType === "oneway"
      ? safeDistance < 180
        ? "One way fare multiplier applied: 1.60 (distance below 180 KM)"
        : "One way fare multiplier applied: 1.35 (distance 180 KM or above)"
      : "Standard booking fare rule applied",
    `Passenger count: ${safePassengerCount}`,
    `Stoppage charge: ₹150 per stop`,
    safeStoppage > 0
      ? `${safeStoppage} stoppage(s) added`
      : "No stoppage added",
    safeDayHalts > 0
      ? `${safeDayHalts} day halt(s) added`
      : "No day halt added",
    safeNightHalts > 0
      ? `${safeNightHalts} night halt(s) added`
      : "No night halt added",
  ];

  return {
    distance: safeDistance,
    fare: finalFare,
    finalFare,
    stoppageCharge,
    passengerCharge,
    dayHaltCharge,
    nightHaltCharge,
    remarks,
  };
}
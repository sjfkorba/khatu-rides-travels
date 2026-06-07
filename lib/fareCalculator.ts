export const VEHICLES = {
  sedan: {
    ratePerKm: 13.5,
    minimumOnewayFare: 900,
    localPackage: 1800,
    dayHalt: 500,
    nightHalt: 600,
  },
  ertiga: {
    ratePerKm: 15,
    minimumOnewayFare: 1100,
    localPackage: 2200,
    dayHalt: 600,
    nightHalt: 700,
  },
  innova: {
    ratePerKm: 17,
    minimumOnewayFare: 1300,
    localPackage: 2500,
    dayHalt: 800,
    nightHalt: 900,
  },
  crysta: {
    ratePerKm: 18.5,
    minimumOnewayFare: 1500,
    localPackage: 2800,
    dayHalt: 900,
    nightHalt: 1000,
  },
  scorpio: {
    ratePerKm: 17.25,
    minimumOnewayFare: 1400,
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
  pickup?: string;
  drop?: string;
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

const HIGH_DEMAND_ONEWAY_ROUTES = new Set([
  "raipur-korba",
  "korba-raipur",
  "raipur-bilaspur",
  "bilaspur-raipur",
  "raipur-raigarh",
  "raigarh-raipur",
  "raipur airport-korba",
  "korba-raipur airport",
  "raipur airport-bilaspur",
  "bilaspur-raipur airport",
  "korba-bilaspur",
  "bilaspur-korba",
]);

function normalizeLocation(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isHighDemandOnewayRoute(pickup?: string, drop?: string) {
  const from = normalizeLocation(pickup || "");
  const to = normalizeLocation(drop || "");

  if (!from || !to) return false;

  return HIGH_DEMAND_ONEWAY_ROUTES.has(`${from}-${to}`);
}

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
  pickup = "",
  drop = "",
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

  const isHighDemandRoute = isHighDemandOnewayRoute(pickup, drop);

  let baseFare = 0;

  if (bookingType === "oneway") {
    if (!isHighDemandRoute) {
      baseFare = safeDistance * vehicle.ratePerKm * 2.15;
    } else if (safeDistance <= 80) {
      baseFare =
        vehicle.minimumOnewayFare + safeDistance * vehicle.ratePerKm;
    } else if (safeDistance < 280) {
      baseFare = safeDistance * vehicle.ratePerKm * 1.55;
    } else {
      baseFare = safeDistance * vehicle.ratePerKm * 1.8;
    }
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
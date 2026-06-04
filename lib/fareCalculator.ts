export const VEHICLES = {
  sedan: { ratePerKm: 11, localPackage: 1600, nightHalt: 500 },
  ertiga: { ratePerKm: 13, localPackage: 1900, nightHalt: 600 },
  innova: { ratePerKm: 16, localPackage: 2200, nightHalt: 800 },
  crysta: { ratePerKm: 17, localPackage: 2400, nightHalt: 900 },
  scorpio: { ratePerKm: 16, localPackage: 2200, nightHalt: 700 },
} as const;

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip" | "airporttransfer" | "local";

type CalculateFareParams = {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  passengerCount: number;
  stoppage: number;
};

type CalculateFareResult = {
  distance: number;
  fare: number;
  discount: number;
  finalFare: number;
  stoppageCharge: number;
  passengerCharge: number;
  nightHalt: number;
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
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];
  const safeDistance = Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;
  const safePassengerCount =
    Number.isFinite(passengerCount) && passengerCount > 0 ? Math.round(passengerCount) : 1;
  const safeStoppage =
    Number.isFinite(stoppage) && stoppage > 0 ? Math.min(Math.round(stoppage), 5) : 0;

  let baseFare = 0;

  if (bookingType === "oneway") {
    baseFare = safeDistance * vehicle.ratePerKm * 1.55;
  } else if (bookingType === "roundtrip") {
    baseFare = safeDistance * vehicle.ratePerKm * 2 * (safeDistance > 180 ? 1 : 1.15);
  } else if (bookingType === "airporttransfer") {
    baseFare = safeDistance * vehicle.ratePerKm * 1.35 + 150;
  } else if (bookingType === "local") {
    baseFare = vehicle.localPackage;
  }

  const passengerCharge = getPassengerCharge(safePassengerCount);
  const stoppageCharge = safeStoppage * 150;
  const subtotal = baseFare + passengerCharge + stoppageCharge;

  const discount = bookingType !== "local" && safeDistance > 140 ? Math.round(subtotal * 0.18) : 0;
  const finalFare = Math.max(0, Math.round(subtotal - discount));

  const remarks = [
    "Toll Tax Extra",
    "Parking Charges Extra",
    `Night Halt ₹${vehicle.nightHalt}/Night (if applicable)`,
    bookingType === "local"
      ? "Local package max 80 KM only"
      : "Fare calculated on approximate distance",
    `Passenger count: ${safePassengerCount}`,
    `Stoppage charge: ₹150 per stop`,
    safeStoppage > 0 ? `${safeStoppage} stoppage(s) added` : "No stoppage added",
    discount > 0 ? "18% discount applied for long trips" : "No distance discount applied",
  ];

  return {
    distance: safeDistance,
    fare: Math.round(subtotal),
    discount,
    finalFare,
    stoppageCharge,
    passengerCharge,
    nightHalt: vehicle.nightHalt,
    remarks,
  };
}
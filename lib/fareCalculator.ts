export const VEHICLE_RATES = {
  sedan: 12,
  ertiga: 14,
  innova: 17,
  crysta: 18,
  scorpio: 16,
} as const;

export type VehicleType = keyof typeof VEHICLE_RATES;

export type BookingType =
  | "oneway"
  | "roundtrip"
  | "local"
  | "outstation";

type CalculateFareParams = {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
};

type CalculateFareResult = {
  distance: number;
  fare: number;
  discount: number;
  finalFare: number;
};

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
}: CalculateFareParams): CalculateFareResult {
  const safeDistance = Number.isFinite(distance) && distance > 0 ? distance : 0;
  const baseRate = VEHICLE_RATES[vehicleType];

  const effectiveRate =
    bookingType === "roundtrip" || bookingType === "outstation"
      ? Math.max(baseRate - 2, 0)
      : baseRate;

  const billableDistance = safeDistance + 25;

  let fare = 0;

  switch (bookingType) {
    case "oneway":
      fare = billableDistance * effectiveRate * 1.7;
      break;

    case "roundtrip":
      fare = billableDistance * 2 * effectiveRate * 1.5;
      break;

    case "local":
      fare = Math.max(billableDistance * effectiveRate, 1800);
      break;

    case "outstation":
      fare = billableDistance * effectiveRate * 2 + 300;
      break;

    default:
      fare = billableDistance * effectiveRate * 1.7;
      break;
  }

  const discount = fare * 0.15;
  const finalFare = fare - discount;

  return {
    distance: Math.round(billableDistance),
    fare: Math.round(fare),
    discount: Math.round(discount),
    finalFare: Math.round(finalFare),
  };
}
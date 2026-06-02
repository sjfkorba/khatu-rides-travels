export const VEHICLES = {
  sedan: {
    ratePerKm: 12,
    nightHalt: 500,
    localPackage: 2800,
  },

  ertiga: {
    ratePerKm: 14,
    nightHalt: 600,
    localPackage: 3500,
  },

  innova: {
    ratePerKm: 17,
    nightHalt: 800,
    localPackage: 4500,
  },

  crysta: {
    ratePerKm: 18,
    nightHalt: 900,
    localPackage: 5000,
  },

  scorpio: {
    ratePerKm: 16,
    nightHalt: 700,
    localPackage: 4000,
  },
} as const;

export type VehicleType =
  keyof typeof VEHICLES;

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
  nightHalt: number;
  remarks: string[];
};

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
}: CalculateFareParams): CalculateFareResult {
  const vehicle =
    VEHICLES[vehicleType];

  const km =
    Number.isFinite(distance) &&
    distance > 0
      ? distance
      : 0;

  let fare = 0;

  switch (bookingType) {
    case "oneway":
      fare =
        km *
        vehicle.ratePerKm *
        1.7;
      break;

    case "roundtrip":
      if (km > 180) {
        fare =
          km *
          vehicle.ratePerKm *
          2;
      } else {
        fare =
          km *
          vehicle.ratePerKm *
          2 *
          1.5;
      }
      break;

    case "local":
      fare =
        vehicle.localPackage;
      break;

    case "outstation":
      fare =
        km *
        vehicle.ratePerKm *
        2;
      break;

    default:
      fare =
        km *
        vehicle.ratePerKm;
  }

  // UI compatibility ke liye
  const discount = 0;

  const finalFare =
    Math.round(fare);

  return {
    distance: Math.round(km),

    fare: Math.round(fare),

    discount,

    finalFare,

    nightHalt:
      vehicle.nightHalt,

    remarks: [
      "Toll Tax Extra",
      "Parking Charges Extra",
      `Night Halt ₹${vehicle.nightHalt}/Night (if applicable)`,
      "Driver fooding & allowance extra for round trips",
      "Final discount will be confirmed during booking",
    ],
  };
}

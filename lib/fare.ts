// lib/fare.ts

export const VEHICLES = {
  sedan: {
    label: "Sedan",
    ratePerKm: 12,
    nightHalt: 500,
    localPackage: 2800,
  },
  ertiga: {
    label: "Ertiga",
    ratePerKm: 14,
    nightHalt: 600,
    localPackage: 3500,
  },
  innova: {
    label: "Innova",
    ratePerKm: 17,
    nightHalt: 800,
    localPackage: 4500,
  },
  crysta: {
    label: "Innova Crysta",
    ratePerKm: 18,
    nightHalt: 900,
    localPackage: 5000,
  },
  scorpio: {
    label: "Scorpio",
    ratePerKm: 16,
    nightHalt: 700,
    localPackage: 4000,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;

export type BookingType =
  | "oneway"
  | "roundtrip"
  | "local"
  | "outstation";

export type FareFormData = {
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  pickupTime: string;
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
};

export type CalculateFareParams = {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
};

export type CalculateFareResult = {
  actualDistance: number;
  extraDistance: number;
  distance: number;
  fare: number;
  discount: number;
  finalFare: number;
  nightHalt: number;
  discountApplied: boolean;
  remarks: string[];
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getVehicleLabel(vehicleType: VehicleType) {
  return VEHICLES[vehicleType]?.label ?? vehicleType;
}

export function getBookingTypeLabel(bookingType: BookingType) {
  switch (bookingType) {
    case "oneway":
      return "One Way";
    case "roundtrip":
      return "Round Trip";
    case "local":
      return "Local";
    case "outstation":
      return "Outstation";
    default:
      return bookingType;
  }
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];

  const totalApproxDistance =
    Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  let fare = 0;

  switch (bookingType) {
    case "oneway":
      fare = totalApproxDistance * vehicle.ratePerKm * 1.55;
      break;

    case "roundtrip":
      if (totalApproxDistance > 180) {
        fare = totalApproxDistance * vehicle.ratePerKm * 2;
      } else {
        fare = totalApproxDistance * vehicle.ratePerKm * 2 * 1.15;
      }
      break;

    case "local":
      fare = vehicle.localPackage;
      break;

    case "outstation":
      fare = totalApproxDistance * vehicle.ratePerKm * 2;
      break;

    default:
      fare = totalApproxDistance * vehicle.ratePerKm;
  }

  const roundedFare = Math.round(fare);
  const discountApplied = totalApproxDistance > 140;
  const discount = discountApplied ? Math.round(roundedFare * 0.18) : 0;
  const finalFare = roundedFare - discount;

  return {
    actualDistance: 0,
    extraDistance: 0,
    distance: totalApproxDistance,
    fare: roundedFare,
    discount,
    finalFare,
    nightHalt: vehicle.nightHalt,
    discountApplied,
    remarks: [
      "Toll Tax Extra",
      "Parking Charges Extra",
      `Night Halt ₹${vehicle.nightHalt}/Night (if applicable)`,
      "Driver fooding & allowance extra for round trips",
      "Fare calculated on total approximate distance",
      ...(discountApplied
        ? ["18% discount applied for distance above 140 km"]
        : []),
      "Final confirmation will be provided during booking",
    ],
  };
}

export function validateFareForm(data: Partial<FareFormData>) {
  const errors: string[] = [];

  if (!data.pickupLocation?.trim()) errors.push("Pick-up location is required.");
  if (!data.dropLocation?.trim()) errors.push("Drop location is required.");
  if (!data.pickupDate?.trim()) errors.push("Pick-up date is required.");
  if (!data.pickupTime?.trim()) errors.push("Pick-up time is required.");
  if (!data.vehicleType) errors.push("Vehicle type is required.");
  if (!data.bookingType) errors.push("Ride type is required.");
  if (!data.distance || data.distance <= 0)
    errors.push("Valid distance is required.");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function buildWhatsAppFareMessage(
  data: FareFormData,
  fareResult: CalculateFareResult
) {
  const lines = [
    "🚖 *NEW FARE ESTIMATE REQUEST*",
    "━━━━━━━━━━━━━━━━━━",
    `📍 Pick-up      : ${data.pickupLocation}`,
    `📍 Drop         : ${data.dropLocation}`,
    `📅 Date         : ${data.pickupDate}`,
    `⏰ Time         : ${data.pickupTime}`,
    `🛣️ Distance     : ${fareResult.distance} km`,
    `🚘 Vehicle      : ${getVehicleLabel(data.vehicleType)}`,
    `🔁 Ride Type    : ${getBookingTypeLabel(data.bookingType)}`,
    "━━━━━━━━━━━━━━━━━━",
    `💰 Total Fare   : ${formatCurrency(fareResult.fare)}`,
    ...(fareResult.discountApplied
      ? [`🎁 Discount     : -${formatCurrency(fareResult.discount)}`]
      : []),
    `✅ Net Payable  : ${formatCurrency(fareResult.finalFare)}`,
    `🌙 Night Halt   : ${formatCurrency(fareResult.nightHalt)}/Night`,
    "━━━━━━━━━━━━━━━━━━",
    "📝 Notes:",
    ...fareResult.remarks.map((item) => `• ${item}`),
  ];

  return lines.join("\n");
}
// lib/fareCalculator.ts

export const VEHICLES = {
  sedan: {
    label: "Sedan",
    nightHalt: 500,
    localPackage: 1999,
    oldRatePerKm: 12,
  },

  ertiga: {
    label: "Ertiga",
    nightHalt: 600,
    localPackage: 2499,
    oldRatePerKm: 14,
  },

  innova: {
    label: "Innova",
    nightHalt: 800,
    localPackage: 3299,
    oldRatePerKm: 17,
  },

  crysta: {
    label: "Innova Crysta",
    nightHalt: 900,
    localPackage: 3999,
    oldRatePerKm: 18,
  },

  scorpio: {
    label: "Scorpio",
    nightHalt: 700,
    localPackage: 2999,
    oldRatePerKm: 16,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;

export type BookingType =
  | "oneway"
  | "roundtrip"
  | "local"
  | "airporttransfer";

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

const MIN_FARE = {
  sedan: 1799,
  ertiga: 2300,
  innova: 2800,
  crysta: 3500,
  scorpio: 3000,
} as const;

/**
 * Sirf yahan se one way fare hike change karo
 * 15 = 15%
 * 10 = 10%
 * 0 = no hike
 */
export const ONE_WAY_HIKE_PERCENT = 17.5;

function applyHikePercent(amount: number, hikePercent: number) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (!Number.isFinite(hikePercent) || hikePercent <= 0) {
    return Math.round(amount);
  }
  return Math.round(amount * (1 + hikePercent / 100));
}

function getOneWayRate(vehicleType: VehicleType, distance: number) {
  switch (vehicleType) {
    case "sedan":
      if (distance <= 300) return 16;
      if (distance <= 400) return 15;
      if (distance <= 500) return 14;
      return 13;

    case "ertiga":
      if (distance <= 300) return 20;
      if (distance <= 400) return 18;
      if (distance <= 500) return 17;
      return 16;

    case "innova":
    case "crysta":
      if (distance <= 300) return 26;
      if (distance <= 400) return 24;
      if (distance <= 500) return 22;
      return 18;

    case "scorpio":
      if (distance <= 300) return 24;
      if (distance <= 400) return 22;
      if (distance <= 500) return 20;
      return 18;

    default:
      return 15;
  }
}

function getRoundTripRate(
  vehicleType: VehicleType,
  totalRoundTripDistance: number
) {
  switch (vehicleType) {
    case "sedan":
      if (totalRoundTripDistance <= 300) return 15;
      if (totalRoundTripDistance <= 500) return 14;
      if (totalRoundTripDistance <= 800) return 13;
      return 12;

    case "ertiga":
      if (totalRoundTripDistance <= 300) return 17;
      if (totalRoundTripDistance <= 500) return 16;
      if (totalRoundTripDistance <= 800) return 15;
      return 14;

    case "innova":
      if (totalRoundTripDistance <= 300) return 18;
      if (totalRoundTripDistance <= 500) return 17;
      if (totalRoundTripDistance <= 800) return 16;
      return 15;

    case "crysta":
      if (totalRoundTripDistance <= 300) return 21;
      if (totalRoundTripDistance <= 500) return 19;
      if (totalRoundTripDistance <= 800) return 18;
      return 17;

    case "scorpio":
      if (totalRoundTripDistance <= 300) return 18;
      if (totalRoundTripDistance <= 500) return 17;
      if (totalRoundTripDistance <= 800) return 16;
      return 15;

    default:
      return 15;
  }
}

function getAirportFare(vehicleType: VehicleType) {
  switch (vehicleType) {
    case "sedan":
      return 699;
    case "ertiga":
      return 999;
    case "innova":
      return 1299;
    case "crysta":
      return 1699;
    case "scorpio":
      return 1499;
    default:
      return 699;
  }
}

function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 100) * 100;
  return rounded - 1;
}

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
      return "Local (8Hr / 80Km)";
    case "airporttransfer":
      return "Airport Transfer";
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

  const oneWayDistance =
    Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  let fare = 0;
  let discount = 0;
  let discountApplied = false;

  if (bookingType === "oneway") {
    if (oneWayDistance <= 250) {
      const rate = getOneWayRate(vehicleType, oneWayDistance);
      const baseFare = oneWayDistance * rate;
      fare = Math.max(baseFare, MIN_FARE[vehicleType]);
      fare = applyHikePercent(fare, ONE_WAY_HIKE_PERCENT);
    } else if (oneWayDistance <= 600) {
      const baseFare = oneWayDistance * vehicle.oldRatePerKm;
      fare = baseFare * 1.9;
      fare = applyHikePercent(fare, ONE_WAY_HIKE_PERCENT);
      discountApplied = false;
    } else {
      const baseFare = oneWayDistance * vehicle.oldRatePerKm;
      fare = baseFare * 1.75;
      fare = applyHikePercent(fare, ONE_WAY_HIKE_PERCENT);
      discount = Math.round(baseFare * 0.18);
      discountApplied = false;
    }
  }

  if (bookingType === "roundtrip") {
    const totalRTDistance = oneWayDistance * 2;
    const rate = getRoundTripRate(vehicleType, totalRTDistance);
    fare = totalRTDistance * rate;

    if (totalRTDistance > 300) fare += 500;
    if (totalRTDistance > 500) fare += 500;
  }

  if (bookingType === "local") {
    fare = vehicle.localPackage;
  }

  if (bookingType === "airporttransfer") {
    fare = getAirportFare(vehicleType);
  }

  const finalFare = psychologicalPrice(fare);
  const displayDistance =
    bookingType === "roundtrip" ? oneWayDistance * 2 : oneWayDistance;

  return {
    actualDistance: oneWayDistance,
    extraDistance: 0,
    distance: displayDistance,
    fare: finalFare,
    discount,
    finalFare,
    nightHalt: vehicle.nightHalt,
    discountApplied,
    remarks: [
      "Toll Tax Extra",
      "Parking Charges Extra",
      `Night Halt ₹${vehicle.nightHalt}/Night (if applicable)`,
      "Driver allowance extra if required",
      "Fare is estimated and may vary based on route & availability",
      "Final confirmation will be shared on WhatsApp",
    ],
  };
}

export function validateFareForm(data: Partial<FareFormData>) {
  const errors: string[] = [];

  if (!data.pickupLocation?.trim()) errors.push("Pick-up location is required.");
  if (!data.pickupDate?.trim()) errors.push("Pick-up date is required.");
  if (!data.pickupTime?.trim()) errors.push("Pick-up time is required.");
  if (!data.vehicleType) errors.push("Vehicle type is required.");
  if (!data.bookingType) errors.push("Ride type is required.");

  if (data.bookingType !== "local" && !data.dropLocation?.trim()) {
    errors.push("Drop location is required.");
  }

  if (data.bookingType !== "local" && (!data.distance || data.distance <= 0)) {
    errors.push("Valid distance is required.");
  }

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
    `💰 Estimated Fare : ${formatCurrency(fareResult.finalFare)}`,
    "━━━━━━━━━━━━━━━━━━",
    "📝 Notes:",
    ...fareResult.remarks.map((item) => `• ${item}`),
  ];

  return lines.join("\n");
}

/**
 * Vehicle cards ke liye helper
 * One way = sirf 5S + 7S (Sedan + Ertiga)
 * Round trip = saari vehicles
 */
export type FareOptionCard = {
  vehicleType: VehicleType;
  vehicleLabel: string;
  fare: number;
  fareText: string;
  nightHalt: number;
  remarks: string[];
};

export function getFareOptionsByBooking(
  distance: number,
  bookingType: BookingType,
  vehicleTypes?: VehicleType[]
): FareOptionCard[] {
  let allowedVehicles: VehicleType[];

  if (vehicleTypes && vehicleTypes.length > 0) {
    allowedVehicles = vehicleTypes;
  } else if (bookingType === "oneway") {
    allowedVehicles = ["sedan", "ertiga"];
  } else if (bookingType === "roundtrip") {
    allowedVehicles = ["sedan", "ertiga", "innova", "crysta", "scorpio"];
  } else {
    allowedVehicles = ["sedan", "ertiga", "innova", "crysta", "scorpio"];
  }

  return allowedVehicles.map((vehicleType) => {
    const result = calculateFare({
      distance,
      vehicleType,
      bookingType,
    });

    return {
      vehicleType,
      vehicleLabel: getVehicleLabel(vehicleType),
      fare: result.finalFare,
      fareText: formatCurrency(result.finalFare),
      nightHalt: result.nightHalt,
      remarks: result.remarks,
    };
  });
}
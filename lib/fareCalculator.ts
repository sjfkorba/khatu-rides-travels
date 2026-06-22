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
  distance: number; // one side distance
  vehicleType: VehicleType;
  bookingType: BookingType;
  tripDays?: number;
};

export type PricingMode =
  | "oneway-slab"
  | "oneway-mid-distance"
  | "oneway-long-distance"
  | "roundtrip-short-rule"
  | "roundtrip-standard"
  | "local-package"
  | "airport-flat";

export type CalculateFareResult = {
  actualDistance: number; // one side actual distance
  extraDistance: number;
  billedDistance: number;
  distance: number; // displayed distance
  fare: number;
  discount: number;
  finalFare: number;
  nightHalt: number;
  discountApplied: boolean;
  pricingMode: PricingMode;
  baseFareUsed: number;
  rateUsed: number;
  shortRuleApplied: boolean;
  tollIncluded: boolean;
  parkingIncluded: boolean;
  remarks: string[];
};

const MIN_FARE = {
  sedan: 1799,
  ertiga: 2300,
  innova: 2800,
  crysta: 3500,
  scorpio: 3000,
} as const;

// Change anytime
const ONE_WAY_HIKE_PERCENT = 20;

// Aapke custom short round trip rules
const ROUND_TRIP_SHORT_RULES = {
  sedan: { minFare: 1200, ratePerKm: 11 },
  ertiga: { minFare: 1600, ratePerKm: 11 },
  innova: { minFare: 2000, ratePerKm: 12 },
  crysta: { minFare: 2400, ratePerKm: 13 },
  scorpio: { minFare: 2200, ratePerKm: 12 },
} as const;

function applyHikePercent(amount: number, hikePercent: number) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (!Number.isFinite(hikePercent) || hikePercent <= 0) return Math.round(amount);
  return Math.round(amount * (1 + hikePercent / 100));
}

function getOneWayRate(vehicleType: VehicleType, distance: number) {
  switch (vehicleType) {
    case "sedan":
      if (distance <= 250) return 16;
      if (distance <= 400) return 15;
      if (distance <= 500) return 14;
      return 13;

    case "ertiga":
      if (distance <= 250) return 20;
      if (distance <= 400) return 18;
      if (distance <= 500) return 17;
      return 16;

    case "innova":
    case "crysta":
      if (distance <= 250) return 26;
      if (distance <= 400) return 24;
      if (distance <= 500) return 22;
      return 18;

    case "scorpio":
      if (distance <= 250) return 24;
      if (distance <= 400) return 22;
      if (distance <= 500) return 20;
      return 18;

    default:
      return 15;
  }
}

function getRoundTripRate(vehicleType: VehicleType, totalRoundTripDistance: number) {
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

export function getPricingModeLabel(mode: PricingMode) {
  switch (mode) {
    case "oneway-slab":
      return "One Way Slab Pricing";
    case "oneway-mid-distance":
      return "One Way Mid Distance Pricing";
    case "oneway-long-distance":
      return "One Way Long Distance Pricing";
    case "roundtrip-short-rule":
      return "Round Trip Short Route Rule";
    case "roundtrip-standard":
      return "Standard Round Trip Pricing";
    case "local-package":
      return "Local Package";
    case "airport-flat":
      return "Airport Flat Fare";
    default:
      return "Standard Pricing";
  }
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  tripDays = 1,
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];

  const oneWayDistance =
    Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  let fare = 0;
  let discount = 0;
  let discountApplied = false;
  let extraDistance = 0;
  let billedDistance = bookingType === "roundtrip" ? oneWayDistance * 2 : oneWayDistance;
  let pricingMode: PricingMode = "oneway-slab";
  let baseFareUsed = 0;
  let rateUsed = 0;
  let shortRuleApplied = false;

  if (bookingType === "oneway") {
    if (oneWayDistance <= 250) {
      rateUsed = getOneWayRate(vehicleType, oneWayDistance);
      baseFareUsed = oneWayDistance * rateUsed;
      fare = Math.max(baseFareUsed, MIN_FARE[vehicleType]);
      fare = applyHikePercent(fare, ONE_WAY_HIKE_PERCENT);
      pricingMode = "oneway-slab";
    } else if (oneWayDistance <= 600) {
      baseFareUsed = oneWayDistance * vehicle.oldRatePerKm;
      rateUsed = vehicle.oldRatePerKm;
      fare = applyHikePercent(baseFareUsed * 1.9, ONE_WAY_HIKE_PERCENT);
      pricingMode = "oneway-mid-distance";
    } else {
      baseFareUsed = oneWayDistance * vehicle.oldRatePerKm;
      rateUsed = vehicle.oldRatePerKm;
      fare = applyHikePercent(baseFareUsed * 1.75, ONE_WAY_HIKE_PERCENT);
      discount = Math.round(baseFareUsed * 0.18);
      pricingMode = "oneway-long-distance";
    }
  }

  if (bookingType === "roundtrip") {
    const upDownDistance = oneWayDistance * 2;
    billedDistance = upDownDistance;

    if (oneWayDistance < 80) {
      const rule = ROUND_TRIP_SHORT_RULES[vehicleType];
      baseFareUsed = rule.minFare;
      rateUsed = rule.ratePerKm;
      fare = rule.minFare + upDownDistance * rule.ratePerKm;
      pricingMode = "roundtrip-short-rule";
      shortRuleApplied = true;
      extraDistance = 0;
    } else {
      rateUsed = getRoundTripRate(vehicleType, upDownDistance);
      baseFareUsed = upDownDistance * rateUsed;
      fare = baseFareUsed;
      pricingMode = "roundtrip-standard";

      if (upDownDistance > 300) fare += 500;
      if (upDownDistance > 500) fare += 500;
    }
  }

  if (bookingType === "local") {
    fare = vehicle.localPackage;
    billedDistance = 80;
    baseFareUsed = vehicle.localPackage;
    rateUsed = 0;
    pricingMode = "local-package";
  }

  if (bookingType === "airporttransfer") {
    fare = getAirportFare(vehicleType);
    baseFareUsed = fare;
    rateUsed = 0;
    pricingMode = "airport-flat";
  }

  const finalFare = psychologicalPrice(fare);
  const displayDistance =
    bookingType === "roundtrip" ? oneWayDistance * 2 : oneWayDistance;

  return {
    actualDistance: oneWayDistance,
    extraDistance,
    billedDistance,
    distance: displayDistance,
    fare: finalFare,
    discount,
    finalFare,
    nightHalt: vehicle.nightHalt,
    discountApplied,
    pricingMode,
    baseFareUsed,
    rateUsed,
    shortRuleApplied,
    tollIncluded: true,
    parkingIncluded: false,
    remarks: [
      bookingType === "roundtrip" && shortRuleApplied
        ? `Short route rule applied: Base fare + up/down KM fare`
        : "Fare calculated as per selected trip type",
      "Toll Tax Extra (Depends on Final Confirmation)",
      "Parking Charges Extra",
      `Night Halt ₹${vehicle.nightHalt}/Night (if applicable)`,
      "Fare is estimated and may vary based on route & availability",
      "Final confirmation will be shared on WhatsApp",
      "One Way Cab depends on availability of routine booking routes for return booking and fare may be vary at the time of finalized your booking."
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
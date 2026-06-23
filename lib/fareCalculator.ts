// lib/fareCalculator.ts

export const VEHICLES = {
  sedan: {
    label: "Sedan",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    nightHalt: 250,
    dayHalt: 300,
    localPackage: 2199,
    oldRatePerKm: 14,
    extraPerKm: 14,
  },
  ertiga: {
    label: "Ertiga",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    nightHalt: 300,
    dayHalt: 400,
    localPackage: 2699,
    oldRatePerKm: 16,
    extraPerKm: 16,
  },
  innova: {
    label: "Innova",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80",
    nightHalt: 400,
    dayHalt: 500,
    localPackage: 3499,
    oldRatePerKm: 19,
    extraPerKm: 19,
  },
  crysta: {
    label: "Innova Crysta",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    nightHalt: 400,
    dayHalt: 600,
    localPackage: 4199,
    oldRatePerKm: 21,
    extraPerKm: 21,
  },
  scorpio: {
    label: "Scorpio",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
    nightHalt: 400,
    dayHalt: 500,
    localPackage: 3199,
    oldRatePerKm: 18,
    extraPerKm: 18,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip" | "local" | "airporttransfer";

export type RouteStop = { id: string; label: string; };
export type FareFormData = {
  pickupLocation: string;
  dropLocation: string;
  stops?: RouteStop[];
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
  tripDays?: number;
  stopCount?: number;
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
  actualDistance: number;
  extraDistance: number;
  billedDistance: number;
  distance: number;
  fare: number;
  strikeFare: number;
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
  stopCharge: number;
  remarks: string[];
};

const MIN_FARE: Record<VehicleType, number> = {
  sedan: 1699,
  ertiga: 2200,
  innova: 2800,
  crysta: 3600,
  scorpio: 3000,
};

const ONE_WAY_HIKE_PERCENT = 15;
const STRIKE_PRICE_MULTIPLIER = 1.15;
const EXTRA_STOP_CHARGE = 150;

// Re-integrated your exact structural one-way slab rates parameters
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

// Balanced stable pricing index optimized for competitive roundtrip booking conversions
function getRoundTripRate(vehicleType: VehicleType, totalRoundTripDistance: number) {
  switch (vehicleType) {
    case "sedan":
      if (totalRoundTripDistance <= 300) return 15.5;
      if (totalRoundTripDistance <= 600) return 15;
      return 14.5;
    case "ertiga":
      if (totalRoundTripDistance <= 300) return 17.5;
      if (totalRoundTripDistance <= 600) return 16.5;
      return 16;
    case "innova":
    case "scorpio":
      if (totalRoundTripDistance <= 300) return 19.5;
      if (totalRoundTripDistance <= 600) return 18.5;
      return 18;
    case "crysta":
      if (totalRoundTripDistance <= 300) return 22;
      if (totalRoundTripDistance <= 600) return 21;
      return 20.5;
    default:
      return 15;
  }
}

function getAirportFare(vehicleType: VehicleType) {
  switch (vehicleType) {
    case "sedan": return 899;
    case "ertiga": return 1199;
    case "innova": return 1499;
    case "crysta": return 1899;
    case "scorpio": return 1699;
    default: return 899;
  }
}

function applyHikePercent(amount: number, hikePercent: number) {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (!Number.isFinite(hikePercent) || hikePercent <= 0) return Math.round(amount);
  return Math.round(amount * (1 + hikePercent / 100));
}

function psychologicalPrice(value: number) {
  const rounded = Math.round(value / 50) * 50;
  return Math.max(rounded - 1, 0);
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

export function getVehicleImage(vehicleType: VehicleType) {
  return VEHICLES[vehicleType]?.image ?? "";
}

export function getBookingTypeLabel(bookingType: BookingType) {
  switch (bookingType) {
    case "oneway": return "One Way";
    case "roundtrip": return "Round Trip";
    case "local": return "Local (8Hr / 80Km)";
    case "airporttransfer": return "Airport Transfer";
    default: return bookingType;
  }
}

export function getPricingModeLabel(mode: PricingMode) {
  switch (mode) {
    case "oneway-slab": return "One Way Economy Pricing";
    case "oneway-mid-distance": return "One Way Mid Distance Option";
    case "oneway-long-distance": return "One Way Long Route Special";
    case "roundtrip-short-rule": return "Round Trip Minimum Route Rate";
    case "roundtrip-standard": return "Standard Round Trip Pricing";
    case "local-package": return "Local Package";
    case "airport-flat": return "Airport Flat Fare";
    default: return "Standard Pricing";
  }
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  tripDays = 1,
  stopCount = 0,
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];
  const oneWayDistance = Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  let fare = 0;
  let discount = 0;
  let discountApplied = false;
  let extraDistance = 0;
  let billedDistance = oneWayDistance;
  let pricingMode: PricingMode = "roundtrip-standard";
  let baseFareUsed = 0;
  let rateUsed = 0;
  let shortRuleApplied = false;

  const stopCharge = stopCount > 0 ? stopCount * EXTRA_STOP_CHARGE : 0;

  // 1. ORIGINAL FUNDAMENTAL: ADAPTIVE DISTANCE ADD-ONS RULE
  if (bookingType === "oneway" && oneWayDistance > 0) {
    if (oneWayDistance <= 100) extraDistance = 5;
    else if (oneWayDistance <= 250) extraDistance = 15;
    else if (oneWayDistance <= 400) extraDistance = 20;
    else extraDistance = 30;
    
    billedDistance = oneWayDistance + extraDistance;
  } else if (bookingType === "roundtrip" && oneWayDistance > 0) {
    extraDistance = 30; 
    billedDistance = (oneWayDistance * 2) + extraDistance;
  }

  // 2. PERFECTLY MERGED PRICING MATRIX CORE LOGIC
  if (bookingType === "oneway") {
    if (oneWayDistance <= 250) {
      rateUsed = getOneWayRate(vehicleType, oneWayDistance);
      baseFareUsed = billedDistance * rateUsed;
      fare = Math.max(baseFareUsed, MIN_FARE[vehicleType]);
      fare = applyHikePercent(fare, ONE_WAY_HIKE_PERCENT);
      pricingMode = "oneway-slab";
    } else if (oneWayDistance <= 600) {
      baseFareUsed = billedDistance * vehicle.oldRatePerKm;
      rateUsed = vehicle.oldRatePerKm;
      fare = applyHikePercent(baseFareUsed * 1.9, ONE_WAY_HIKE_PERCENT); // Your original high-converting mid multiplier
      pricingMode = "oneway-mid-distance";
    } else {
      baseFareUsed = billedDistance * vehicle.oldRatePerKm;
      rateUsed = vehicle.oldRatePerKm;
      fare = applyHikePercent(baseFareUsed * 1.75, ONE_WAY_HIKE_PERCENT); // Your original long route multiplier
      discount = Math.round(baseFareUsed * 0.18);
      fare -= discount;
      discountApplied = true;
      pricingMode = "oneway-long-distance";
    }
  }

  if (bookingType === "roundtrip") {
    rateUsed = getRoundTripRate(vehicleType, billedDistance);
    baseFareUsed = billedDistance * rateUsed;
    fare = baseFareUsed;
    pricingMode = "roundtrip-standard";
  }

  if (bookingType === "local") {
    fare = vehicle.localPackage;
    billedDistance = 80;
    baseFareUsed = vehicle.localPackage;
    pricingMode = "local-package";
  }

  if (bookingType === "airporttransfer") {
    fare = getAirportFare(vehicleType);
    billedDistance = oneWayDistance;
    baseFareUsed = fare;
    pricingMode = "airport-flat";
  }

  fare += stopCharge;

  const finalFare = psychologicalPrice(fare);
  const strikeFare = psychologicalPrice(finalFare * STRIKE_PRICE_MULTIPLIER);

  return {
    actualDistance: oneWayDistance,
    extraDistance,
    billedDistance,
    distance: billedDistance,
    fare: finalFare,
    strikeFare,
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
    stopCharge,
    remarks: [
      "State Highway Toll Tax Included",
      `Route Addon Included: +${extraDistance} KM`,
      "Zero Booking Advance Needed",
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
  if (data.bookingType !== "local" && !data.dropLocation?.trim()) errors.push("Drop location is required.");
  return { isValid: errors.length === 0, errors };
}

export function buildWhatsAppFareMessage(data: FareFormData, fareResult: CalculateFareResult) {
  const lines = [
    "𚖥 *NEW FARE ESTIMATE REQUEST*",
    "━━━━━━━━━━━━━━━━━━",
    `📍 Pick-up      : ${data.pickupLocation}`,
    `📍 Drop         : ${data.dropLocation}`,
    `📅 Date         : ${data.pickupDate} @ ${data.pickupTime}`,
    `🛣️ Billed Dist  : ${fareResult.billedDistance} km`,
    `🚘 Vehicle      : ${getVehicleLabel(data.vehicleType)}`,
    `🔁 Ride Type    : ${getBookingTypeLabel(data.bookingType)}`,
    "━━━━━━━━━━━━━━━━━━",
    `💰 Net Payable  : ${formatCurrency(fareResult.finalFare)}`,
    "━━━━━━━━━━━━━━━━━━",
    "• Toll Taxes Included",
    "• Direct Group Driver Fleet Deployment",
  ];
  return lines.join("\n");
}
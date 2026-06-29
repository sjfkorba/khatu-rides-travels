// lib/fareCalculator.ts

export const VEHICLES = {
  sedan: {
    label: "Sedan",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBAAMBEQACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAAAQIDBQQGB//EAN4QAAEDAgIHAggICQoHAAAAAAEAAgMEEQUSBhMhMUFRYXGRFCIyU4GSodEVFkJSYnKxwQcjM4KDk6LS8CQ0Q1RjZHSEwtMXNkVzlOHj/A9G+EfTfHeebeGbyHwA8N0N8d7xAGHh3mAeN3gA8W8N3vHe3AId+9fKAG9od5eDfdAG6DeM3wNAG8veLdAG6AN6AN7yY95YQDvL3jhAG6DveADugBvWDegDefvG9AbwHrvvfAEPDdWDeIeG7oA8YboZveAHeId+7gEPHveO9v76AHi3hnv70AN47wd+7ugDvLvEPFvRvvQHvLvd4AO68HeveIeO+G6ADvXw72b4AgX7urCHvXyIDvdWGDeA94h36oAD37+rCBvdWEA727vQHvFvfID3jvFugDvEPEDv3wBDw3RnwQBvXvvghvugPdPv70Bv74Ih4eA+qA94N/vEDeA798P6/qgh4/B/rID/2Q==",
    nightHalt: 250,
    dayHalt: 300,
    localPackage: 2199,
    oldRatePerKm: 14,
    extraPerKm: 14,
  },
  ertiga: {
    label: "Ertiga",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBCwMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAAMFBgECBwj/xABJEAACAQAAA/YwCEAAkGBwYGBAcAAQIDBBEFIRIxBhMUIkFRMmFxgZEHFUJSU5KhsdEjYnKCwTNDk9Lh8BZEY6IkRVSDssI0NaP/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQIDBAUG/8QALBEAAgECBgEDAwQDAAAAAAAAAAECAxEEEhMhLimF6oXv3N67p67O6T6vdfpFlbWksFyWstIisV2sA9alANb1Sij1qUBm5l0JQZkLYXQlBdAO6Cg7oKC6ChXQUaOidZ6N+Evg7WLv6/B/rID/2Q==",
    nightHalt: 300,
    dayHalt: 400,
    localPackage: 2699,
    oldRatePerKm: 16,
    extraPerKm: 16,
  },
  innova: {
    label: "Innova",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBDgMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xABOEAACAQAAA/YwCEAAkGBwYGBAcAAQIDBBEFIRIxBhMUIkFRMmFxgZEHFUJSU5KhsdEjYnKCwTNDk9Lh8BZEY6IkRVSDssI0NaP/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQIDBAUG/8QALBEAAgECBgEDAwQDAAAAAAAAAAECAxEEEhMhLimF6oXv3N67p67O6T6vdfpFlbWksFyWstIisV2sA9alANb1Sij1qUBm5l0JQZkLYXQlBdAO6Cg7oKC6ChXQUaOidZ6N+Evg7WLv6/B/rID/2Q==",
    nightHalt: 400,
    dayHalt: 500,
    localPackage: 3499,
    oldRatePerKm: 19,
    extraPerKm: 19,
  },
  crysta: {
    label: "Innova Crysta",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA6wMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABgcEBQECAwj/xABH669Y7f7p9M3/HwXvU90XFwiNCbH9bp+uH9yq6ZIsT6DoR996eheCfehV0yNInRTRXvPZPRvEv9D/uVXMjSOnQ6G3/W+K6Yf/...dTpfC++9CidCtC+C/vR+6VIsfwZ97r739X3UrE0/DPvdff6N4nr6KVicN97p77+reId3vUonQ7AvvdPf/qdVsPhZPrUpC6dAsPvdfer+lVLD6XvpWy7C6dDsD+9D7rUonQtgveD+7C9+lIuHshbBfdC/vUonQ3w3g39XoN+lKxOH2FvBvRbdwPnUi39j6M0K9f7K89jdxmC5TvFX9Y/T8x8Ki3eA3bC4t5FubR9lfby8DUyXm/CObN07S3pW1yZbe/shPHbXw6qXbDuNfCvz339/Wj9X0Fv65wU6L6vDdfhenoWffb96vepIsXwnTvAXwPVOitV7S3gN4U6m6XFvdg97v9B6K1SPrXgN4E6d4DvfX+uN+v7pPSvewV7C3gM4HqnD9eMHeFvdClIunYV8V9XpC3p49eFevUvAegG6T0r6XpE6L6p6vQv6vQWpWsLhF6K0F06HwXviXulYnQr7E9b8X8KUisVwM9T02B7vUovof8AJXQr706F+F6N4noG+9ToV9b1KUiwWwfA+EfdVepV+f1lF0wS9Z39U6C6T0VKNInRnhbYPhvB+FfW8w/+6lHRL7Du3unmId697uD/vUpNidAsE6D4E7h9X4Xn71KX7E6FfDeAdB8CfDvvWl7K6K6E+l/C/vUpfXgVwFrE6FvF2ZofCnE+bV6F6Ew/TUrToXwnUeA9WepvjXvvUuWpA/AnDvAOg+A7reGfV/7qlFwXph7C8B6B70O96UfF1KVshfCejdBeAnp9/6pWvT/m6UpR8H3pwExwK4fCHAnveC9elLooF06F4r0F+E4feG/Uv/AL99fX0pE6EwToXwDqB/gU3XepRcH3r8X8KVwFpSOnTOnw8W8f8Ac08fRof6wI8uVfOVfN9Y8D5wHwB4xPwnW+gH6p9K7nZby11ZofGOn904MvGfA0ZnmLqTby9MNNfAnid90wX3Ywaz6ZgK0oMh5bBw69P8Ap6lV2DIdV7S7G3q3BPhV6q2tshnB9K6eY8B9lWfV6C4a3m6oGMo6NkgDcc/gD+FXWp69uNUn00x7Z7t9W1q97NId9b8fNPhfCveb873uBfevOnT/EOnvX/AFvMPvUfSlFwXph7C8B6gP1p8L++UrZdB8Lw2b/As3Efe7wKUXBfBeK/DML/U++b96lHRX2J8A9W+6v/bUpXwfTofAevV/hYn1+qlo7A/BeC7/CcSemyb94vcrXor7E6fDML4PviXv6lK3TofBfhbA+9M3EdfTUpW6XDwH+t+F5b/q8W9PrpSLoXwWq7pPhX4Zgfp/pSlo6Ym6EaD/W8wzD77Vw+pUrRdA9X0+Eeh6f1vMPfUda7H/2Q==",
    nightHalt: 400,
    dayHalt: 600,
    oldRatePerKm: 21,
    extraPerKm: 21,
  },
  scorpio: {
    label: "Scorpio",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBCgMBIgACEQEDEQH/AUBEoVfN9Y8D5wHwB4xPwnW+gH6p9K7nZby11ZofGOn904MvGfA0ZnmLqTby9MNNfAnid90wX3Ywaz6ZgK0oMh5bBw69P8Ap6lV2DIdV7S7G3q3BPhV6q2tshnB9K6eY8B9lWfV6C4a3m6oGMo6NkgDcc/gD+FXWp69uNUn00x7Z7t9W1q97NId9b8fNPhfCveb873uBfevOnT/EOnvX/AFvMPvUfSlFwXph7C8B6gP1p8L++UrZdB8Lw2b/As3Efe7wKUXBfBeK/DML/U++b96lHRX2J8A9W+6v/bUpXwfTofAevV/hYn1+qlo7A/BeC7/CcSemyb94vcrXor7E6fDML4PviXv6lK3TofBfhbA+9M3EdfTUpW6XDwH+t+F5b/q8W9PrpSLoXwWq7pPhX4Zgfp/pSlo6Ym6EaD/W8wzD77Vw+pUrRdA9X0+Eeh6f1vMPfUda7H/2Q==",
    nightHalt: 400,
    dayHalt: 500,
    localPackage: 3199,
    oldRatePerKm: 18,
    extraPerKm: 18,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;
export type BookingType = "oneway" | "roundtrip" | "local" | "airporttransfer";
export type RouteStop = { id: string; value: string; };

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
  pricingMode: string;
  baseFareUsed: number;
  rateUsed: number;
  shortRuleApplied: boolean;
  tollIncluded: boolean;
  parkingIncluded: boolean;
  stopCharge: number;
  remarks: string[];
  b2bPartnerPayout: number;
};

const MIN_FARE: Record<VehicleType, number> = {
  sedan: 1999,
  ertiga: 2999,
  innova: 3899,
  crysta: 4499,
  scorpio: 3999,
};

const EXTRA_STOP_CHARGE = 150;

// 👑 30+ COMPLETELY INTEGRATED LOW-VOLUME / DRY NODES MASTER LIST 👑
const LOW_VOLUME_KEYWORDS = [
  // Surguja / North
  "chirmiri", "baikunthpur", "manendragarh", "ambikapur", "jashpur", "surajpur", "koriya", "ramanujganj", "wadrafnagar", "pathalgaon",
  // Plain / Center
  "sakti", "kharsia", "sarangarh", "janjgir", "champa", "balodabazar", "rajnandgaon", "mahasamund", "kawardha", "dhamtari", "dongargarh", "gariaband", "bhatapara", "bemetara",
  // Bastar / South
  "kanker", "kondagaon", "jagdalpur", "dantewada", "sukma", "bijapur", "narayanpur", "geedam", "bacheli", "kirandul"
];

export function psychologicalPrice(value: number) {
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

function getMarketSedanRate(distance: number): number {
  if (distance <= 55) return 30.0;
  if (distance <= 105) return 20.0;
  if (distance <= 135) return 16.5; 
  if (distance <= 210) return 15.0;
  if (distance <= 260) return 14.0;
  if (distance <= 310) return 13.5;
  if (distance <= 360) return 15.0;
  if (distance <= 410) return 20.0;
  return 14.0; 
}

function getMarketSevenSeaterRate(distance: number, vehicleType: VehicleType): number {
  let standard7SeaterRate = 20.0;
  if (distance <= 55) standard7SeaterRate = 40.0;
  else if (distance <= 105) standard7SeaterRate = 24.0;
  else if (distance <= 135) standard7SeaterRate = 22.0;
  else if (distance <= 210) standard7SeaterRate = 20.0;
  else if (distance <= 310) standard7SeaterRate = 20.0;
  else if (distance <= 360) standard7SeaterRate = 20.0;
  else if (distance <= 410) standard7SeaterRate = 30.0;
  else standard7SeaterRate = 18.0;

  if (vehicleType === "innova" || vehicleType === "crysta") {
    return standard7SeaterRate * 1.25;
  }
  return standard7SeaterRate;
}

export function calculateFare({
  distance,
  vehicleType,
  bookingType,
  stopCount = 0,
  pickupTime = "09:00",
  pickupLocation = "",
  dropLocation = "",
}: {
  distance: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  stopCount?: number;
  pickupTime?: string;
  pickupLocation?: string;
  dropLocation?: string;
}): CalculateFareResult {
  const oneWayDistance = Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  let fare = 0;
  let strikeFare = 0;
  let extraDistance = 0;
  let rateUsed = 14;

  if (oneWayDistance <= 55) extraDistance = 55 - oneWayDistance;
  else if (oneWayDistance <= 105) extraDistance = 105 - oneWayDistance;
  else if (oneWayDistance <= 135) extraDistance = 135 - oneWayDistance;
  else if (oneWayDistance <= 210) extraDistance = 210 - oneWayDistance;
  else if (oneWayDistance <= 260) extraDistance = 260 - oneWayDistance;
  else if (oneWayDistance <= 310) extraDistance = 310 - oneWayDistance;
  else if (oneWayDistance <= 360) extraDistance = 360 - oneWayDistance;
  else if (oneWayDistance <= 410) extraDistance = 410 - oneWayDistance;
  else extraDistance = 45;

  const billedDistance = oneWayDistance + extraDistance;
  let baseOneWayRate = vehicleType === "sedan" ? getMarketSedanRate(oneWayDistance) : getMarketSevenSeaterRate(oneWayDistance, vehicleType);

  const pLoc = pickupLocation.toLowerCase();
  const dLoc = dropLocation.toLowerCase();

  const isPickupDry = LOW_VOLUME_KEYWORDS.some(kw => pLoc.includes(kw));
  const isDropDry = LOW_VOLUME_KEYWORDS.some(kw => dLoc.includes(kw));

  if (bookingType === "oneway") {
    rateUsed = baseOneWayRate;
    let baseFareUsed = oneWayDistance * rateUsed;

    const isKorbaBilaspur = (pLoc.includes("korba") && dLoc.includes("bilaspur")) || (pLoc.includes("bilaspur") && dLoc.includes("korba"));
    const isBilaspurRaipur = (pLoc.includes("bilaspur") && dLoc.includes("raipur")) || (pLoc.includes("raipur") && dLoc.includes("bilaspur"));
    const isKorbaRaipur = (pLoc.includes("korba") && dLoc.includes("raipur")) || (pLoc.includes("raipur") && dLoc.includes("korba"));
    const isJagdalpurRoute = (pLoc.includes("raipur") && dLoc.includes("jagdalpur")) || (pLoc.includes("jagdalpur") && dLoc.includes("raipur"));

    if (isJagdalpurRoute) {
      // 👑 Long-Distance Core Flagship Corridor 👑
      if (vehicleType === "sedan") { fare = 4799; strikeFare = 5400; }
      else if (vehicleType === "ertiga") { fare = 5999; strikeFare = 6900; }
      else if (vehicleType === "crysta") { fare = 7499; strikeFare = 8800; }
      else { fare = baseFareUsed * 1.5; strikeFare = baseFareUsed * 1.7; }
    } else if (isKorbaRaipur) {
      // 👑 Balanced Local Reality Sweet Spot 👑
      if (vehicleType === "sedan") { fare = 3149; strikeFare = 3600; }
      else if (vehicleType === "ertiga") { fare = 4199; strikeFare = 4900; }
      else if (vehicleType === "crysta") { fare = 5299; strikeFare = 6200; }
      else { fare = baseFareUsed * 1.1; strikeFare = baseFareUsed * 1.3; }
    } else if (isKorbaBilaspur || isBilaspurRaipur) {
      // 👑 Hyper Popular Short Run Loops 👑
      if (vehicleType === "sedan") { fare = 1999; strikeFare = 2400; }
      else if (vehicleType === "ertiga") { fare = 2849; strikeFare = 3300; }
      else if (vehicleType === "crysta") { fare = 3499; strikeFare = 4200; }
      else { fare = Math.max(baseFareUsed * 0.95, MIN_FARE[vehicleType]); strikeFare = fare * 1.15; }
    } else if (isDropDry && dLoc.includes("chirmiri")) {
      if (vehicleType === "sedan") { fare = 3699; strikeFare = 4400; }
      else if (vehicleType === "ertiga") { fare = 4799; strikeFare = 5600; }
      else if (vehicleType === "crysta") { fare = 6299; strikeFare = 7400; }
      else { fare = 5499; strikeFare = 6400; }
    } else if (isDropDry && dLoc.includes("sakti")) {
      if (vehicleType === "sedan") { fare = 2299; strikeFare = 2650; }
      else if (vehicleType === "ertiga") { fare = 2999; strikeFare = 3600; }
      else if (vehicleType === "crysta") { fare = 3899; strikeFare = 4600; }
      else { fare = Math.max(baseFareUsed * 0.95, MIN_FARE[vehicleType]); strikeFare = fare * 1.15; }
    } else if (isDropDry && dLoc.includes("rajnandgaon")) {
      if (vehicleType === "sedan") { fare = 1899; strikeFare = 2200; }
      else if (vehicleType === "ertiga") { fare = 2699; strikeFare = 3200; }
      else if (vehicleType === "crysta") { fare = 3499; strikeFare = 4200; }
      else { fare = Math.max(baseFareUsed * 0.95, MIN_FARE[vehicleType]); strikeFare = fare * 1.15; }
    } else if (oneWayDistance >= 250) {
      // General outstations standard protection algorithm
      fare = Math.max(baseFareUsed * 1.5, MIN_FARE[vehicleType]);
      strikeFare = baseFareUsed * 1.7;
    } else {
      fare = Math.max(baseFareUsed * 0.95, MIN_FARE[vehicleType]);
      strikeFare = fare * 1.15;
    }

  } else if (bookingType === "roundtrip") {
    // Round trip calculation reduction logic active
    rateUsed = baseOneWayRate - 1.75; 
    let totalRoundTripDistance = oneWayDistance * 2;
    fare = Math.max((totalRoundTripDistance * rateUsed) * 0.95, MIN_FARE[vehicleType] * 1.6);
    strikeFare = fare * 1.15;
  }

  fare += (stopCount * EXTRA_STOP_CHARGE);

  // Night Shift Processing Loop
  const [hours] = pickupTime.split(":").map(Number);
  const isDayTime = hours >= 5 && hours < 22;
  if (!isDayTime) {
    fare = fare * 1.15;
    strikeFare = strikeFare * 1.15;
  }

  const finalFare = psychologicalPrice(fare);
  const finalStrikeFare = psychologicalPrice(strikeFare);

  // 👑 AUTOPILOT MARGIN REVERSE PUMP LOGIC ENGINE 👑
  let b2bPartnerPayout = finalFare * 0.82; // Standard payout bracket ratio

  if (bookingType === "oneway" && isPickupDry) {
    // Reverse dry pickup point detected: automatic partner layout reduction active
    b2bPartnerPayout = finalFare * 0.68; 
  }

  return {
    actualDistance: oneWayDistance,
    extraDistance,
    billedDistance: bookingType === "roundtrip" ? billedDistance * 2 : billedDistance,
    distance: bookingType === "roundtrip" ? billedDistance * 2 : billedDistance,
    fare: finalFare,
    strikeFare: finalStrikeFare, 
    discount: 0,
    finalFare,
    nightHalt: 300,
    discountApplied: false,
    pricingMode: "standard-fleet-pricing",
    baseFareUsed: finalFare,
    rateUsed,
    shortRuleApplied: false,
    tollIncluded: true,
    parkingIncluded: false,
    stopCharge: stopCount * EXTRA_STOP_CHARGE,
    remarks: ["State Highway Toll Tax Fully Included"],
    b2bPartnerPayout: Math.round(b2bPartnerPayout)
  };
}

export function validateFareForm(data: Partial<{ pickupLocation: string; }>) {
  const errors: string[] = [];
  if (!data.pickupLocation?.trim()) errors.push("Pick-up location is required.");
  return { isValid: errors.length === 0, errors };
}
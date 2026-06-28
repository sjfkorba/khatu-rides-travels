// lib/fareCalculator.ts

export const VEHICLES = {
  sedan: {
    label: "Sedan",
    image: "data:image/jpeg;base64,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",
    nightHalt: 250,
    dayHalt: 300,
    localPackage: 2199,
    oldRatePerKm: 14,
    extraPerKm: 14,
  },
  ertiga: {
    label: "Ertiga",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBCwMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAAMFBgECBwj/xABJEAACAQAAA/YwCEAAkGBwYGBAcAAQIDBBEFIRIxBhMUIkFRMmFxgZEHFUJSU5KhsdEjYnKCwTNDk9Lh8BZEY6IkRVSDssI0NaP/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQIDBAUG/8QALBEAAgECBgEDAwQDAAAAAAAAAAECAxEEEhMhLimF6oXv3N67p67O6T6vdfpFlbWksFyWstIisV2sA9alANb1Sij1qUBm5l0JQZkLYXQlBdAO6Cg7oKC6ChXQUaOidZ6N+Evg7WLv6/wB66RmbFf5P6bFmD2C62lVNDXG6fWf80mEwK0V7gVjL0f6U6OitV2FvG0Z6m66iNf68hxW9vFnW+BfCOo2/JuU7Wj7SAtT0vI8S7Hz5090CpdC9IThVTheI8XbV7lX8SoxX6fO8mGfN6f9X1R1Vn7OfXFvG5bYV6I5pP9rV7n09CH0I02Cgq8XNidw/b966fO5vEexC6FpD0v6XU1W/N1Z7p9M3/AHXfcp8VmeIbeOHeLpdpfSuxP1P0uMbx9pPhmP8ACm79jR66DDPwq7TfP9I6nE8Zf8FYvVsL/wCtYvCMeY63fUukcsZ4gKEnB16fO8mLm+hGg9S7F2Fv62Ife9bXWw9iXW3U6RofUz6RofS6/D79e6D0Fv7X7F0i6K0I8bO+P67gEre59jS8G8Xp9gU2iV2EWFmZg+gN/vXTXfJnS6SboF96E6D1Nsuw39fA770nd8C+G6fA/XfW+6fWw9w6gY++p8bXIsLwbPuhug9S7C2K6XFf9b4BfG6bByw94U3VwXFw6Do3Y7qA6v3pZEfAAd+7ugDvLvEPFvRvvQHvLvd4AO68HeveIeO+G6ADvXw72b4AgX7urCHvXyIDvdWGDeA94h36oAD37+rCBvdWEA727vQHvFvfID3jvFugDvEPEDv3wBDw3RnwQBvXvvghvugPdPv70Bv74Ih4eA+qA94N/vEDeA798P6/qgh4/wB6AO89XfHeAHeXvvvgeHfPePeIeB/rID/2Q==",
    nightHalt: 300,
    dayHalt: 400,
    localPackage: 2699,
    oldRatePerKm: 16,
    extraPerKm: 16,
  },
  innova: {
    label: "Innova",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBDgMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xABOEAACAQAAA/YwCEAAkGBwYGBAcAAQIDBBEFIRIxBhMUIkFRMmFxgZEHFUJSU5KhsdEjYnKCwTNDk9Lh8BZEY6IkRVSDssI0NaP/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQIDBAUG/8QALBEAAgECBgEDAwQDAAAAAAAAAAECAxEEEhMhLimF6oXv3N67p67O6T6vdfpFlbWksFyWstIisV2sA9alANb1Sij1qUBm5l0JQZkLYXQlBdAO6Cg7oKC6ChXQUaOidZ6N+Evg7WLv6/wB66RmbFf5P6bFmD2C62lVNDXG6fWf80mEwK0V7gVjL0f6U6OitV2FvG0Z6m66iNf68hxW9vFnW+BfCOo2/JuU7Wj7SAtT0vI8S7Hz5090CpdC9IThVTheI8XbV7lX8SoxX6fO8mGfN6f9X1R1Vn7OfXFvG5bYV6I5pP9rV7n09CH0I02Cgq8XNidw/b966fO5vEexC6FpD0v6XU1W/N1Z7p9M3/AHXfcp8VmeIbeOHeLpdpfSuxP1P0uMbx9pPhmP8ACm79jR66DDPwq7TfP9I6nE8Zf8FYvVsL/wCtYvCMeY63fUukcsZ4gKEnB16fO8mLm+hGg9S7F2Fv62Ife9bXWw9iXW3U6RofUz6RofS6/D79e6D0Fv7X7F0i6K0I8bO+P67gEre59jS8G8Xp9gU2iV2EWFmZg+gN/vXTXfJnS6SboF96E6D1Nsuw39fA770nd8C+G6fA/XfW+6fWw9w6gY++p8bXIsLwbPuhug9S7C2K6XFf9b4BfG6bByw94U3VwXFw6Do3Y7qA6v3pZEfAAd+7ugDvLvEPFvRvvQHvLvd4AO68HeveIeO+G6ADvXw72b4AgX7urCHvXyIDvdWGDeA94h36oAD37+rCBvdWEA727vQHvFvfID3jvFugDvEPEDv3wBDw3RnwQBvXvvghvugPdPv70Bv74Ih4eA+qA94N/vEDeA798P6/qgh4/wB6AO89XfHeAHeXvvvgeHfPePeIeB/rID/2Q==",
    nightHalt: 400,
    dayHalt: 500,
    localPackage: 3499,
    oldRatePerKm: 19,
    extraPerKm: 19,
  },
  crysta: {
    label: "Innova Crysta",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAADY2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA6wMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABgcEBQECAwj/xABH669Y7f7p9M3/HwXvU90XFwiNCbH9bp+uH9yq6ZIsT6DoR996eheCfehV0yNInRTRXvPZPRvEv9D/uVXMjSOnQ6G3/W+K6Yf/...dTpfC++9CidCtC+C/vR+6VIsfwZ97r739X3UrE0/DPvdff6N4nr6KVicN97p77+reId3vUonQ7AvvdPf/qdVsPhZPrUpC6dAsPvdfer+lVLD6XvpWy7C6dDsD+9D7rUonQtgveD+7C9+lIuHshbBfdC/vUonQ3w3g39XoN+lKxOH2FvBvRbdwPnUi39j6M0K9f7K89jdxmC5TvFX9Y/T8x8Ki3eA3bC4t5FubR9lfby8DUyXm/wCObN07S3pW1yZbe/shPHbXw6qXbDuNfCvz339/Wj9X0Fv65wU6L6vDdfhenoWffb96vepIsXwnTvAXwPVOitV7S3gN4U6m6XFvdg97v9B6K1SPrXgN4E6d4DvfX+uN+v7pPSvewV7C3gM4HqnD9eMHeFvdClIunYV8V9XpC3p49eFevUvAegG6T0r6XpE6L6p6vQv6vQWpWsLhF6K0F06HwXviXulYnQr7E9b8X8KUisVwM9T02B7vUovof8AJXQr706F+F6N4noG+9ToV9b1KUiwWwfA+EfdVepV+f1lF0wS9Z39U6C6T0VKNInRnhbYPhvB+FfW8w/+6lHRL7Du3unmId697uD/vUpNidAsE6D4E7h9X4Xn71KX7E6FfDeAdB8CfDvvWl7K6K6E+l/C/vUpfXgVwFrE6FvF2ZofCnE+bV6F6Ew/TUrToXwnUeA9WepvjXvvUuWpA/AnDvAOg+A7reGfV/7qlFwXph7C8B6B70O96UfF1KVshfCejdBeAnp9/6pWvT/m6UpR8H3pwExwK4fCHAnveC9elLooF06F4r0F+E4feG/Uv/AL99fX0pE6EwToXwDqB/gU3XepRcH3r8X8KVwFpSOnTOnw8W8f8Ac08fRof6wI8uVfOVfN9Y8D5wHwB4xPwnW+gH6p9K7nZby11ZofGOn904MvGfA0ZnmLqTby9MNNfAnid90wX3Ywaz6ZgK0oMh5bBw69P8Ap6lV2DIdV7S7G3q3BPhV6q2tshnB9K6eY8B9lWfV6C4a3m6oGMo6NkgDcc/gD+FXWp69uNUn00x7Z7t9W1q97NId9b8fNPhfCveb873uBfevOnT/EOnvX/AFvMPvUfSlFwXph7C8B6gP1p8L++UrZdB8Lw2b/As3Efe7wKUXBfBeK/DML/U++b96lHRX2J8A9W+6v/bUpXwfTofAevV/hYn1+qlo7A/BeC7/CcSemyb94vcrXor7E6fDML4PviXv6lK3TofBfhbA+9M3EdfTUpW6XDwH+t+F5b/q8W9PrpSLoXwWq7pPhX4Zgfp/pSlo6Ym6EaD/W8wzD77Vw+pUrRdA9X0+Eeh6f1vMPfUda7H/2Q==",
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
  pickupTime?: string;
  returnTime?: string;
};

export type PricingMode =
  | "oneway-hyper-short"
  | "oneway-slab"
  | "oneway-mid-distance"
  | "oneway-long-distance"
  | "roundtrip-hyper-short"
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
  sedan: 1599,
  ertiga: 2299,
  innova: 2799,
  crysta: 3499,
  scorpio: 2999,
};

const EXTRA_STOP_CHARGE = 150;

function estimateRahulTravelsFare(
  vehicleType: VehicleType,
  oneWayDistance: number,
  bookingType: BookingType,
  tripDays: number,
  isDayTime: boolean,
  pickup: string = "",
  drop: string = ""
): number {
  const p = pickup.toLowerCase();
  const d = drop.toLowerCase();

  const matchRoute = (city1: string, city2: string) => {
    return (p.includes(city1) && d.includes(city2)) || (p.includes(city2) && d.includes(city1));
  };

  // -----------------------------------------
  // 1. ONE WAY STRICT MAPPING (SEGREGATED GAPS)
  // -----------------------------------------
  if (bookingType === "oneway") {
    if (matchRoute("korba", "bilaspur")) {
      if (vehicleType === "sedan") return 1999;
      if (vehicleType === "ertiga") return 2999;
      return 2999; // Crysta/Innova
    }
    if (matchRoute("korba", "raipur")) {
      if (vehicleType === "sedan") return 3499;
      if (vehicleType === "ertiga") return 4999;
      return 4999; 
    }
    if (matchRoute("bilaspur", "raipur")) {
      if (vehicleType === "sedan") return 1999;
      if (vehicleType === "ertiga") return 2999;
      return 2999;
    }
    if (matchRoute("bilaspur", "chirmiri")) {
      if (vehicleType === "sedan") return 2999;
      if (vehicleType === "ertiga") return 4999;
      return 4999;
    }
    if (matchRoute("korba", "raigarh")) {
      if (vehicleType === "sedan") return 1999;
      if (vehicleType === "ertiga") return 2999;
      return 2999;
    }
    if (matchRoute("bilaspur", "raigarh")) {
      if (vehicleType === "sedan") return 1999;
      if (vehicleType === "ertiga") return 2999;
      return 2999;
    }
    if (matchRoute("raipur", "raigarh")) {
      if (vehicleType === "sedan") return 3499;
      if (vehicleType === "ertiga") return 4999;
      return 4999;
    }
    if (matchRoute("raigarh", "jharsuguda")) {
      if (vehicleType === "sedan") return 1999;
      if (vehicleType === "ertiga") return 2999;
      return 2999;
    }

    // Dynamic Slabs with split vehicle calculations
    if (oneWayDistance <= 120) {
      if (vehicleType === "sedan") return 1999;
      if (vehicleType === "ertiga") return 2999;
      return 2999;
    }
    if (oneWayDistance <= 260) {
      if (vehicleType === "sedan") return 3499;
      if (vehicleType === "ertiga") return 4999;
      return 4999;
    }
    
    // Default fallback base logic
    const baseRate = vehicleType === "sedan" ? 20 : vehicleType === "ertiga" ? 26 : 30;
    return (oneWayDistance * baseRate);
  }
  
  // -----------------------------------------
  // 2. ROUND TRIP STRICT MAPPING
  // -----------------------------------------
  if (bookingType === "roundtrip") {
    if (matchRoute("korba", "bilaspur")) return vehicleType === "sedan" ? 3699 : 4699;
    if (matchRoute("korba", "raipur")) return vehicleType === "sedan" ? 6999 : 9999;
    if (matchRoute("bilaspur", "raipur")) return vehicleType === "sedan" ? 4500 : 5400;
    if (matchRoute("bilaspur", "chirmiri")) return vehicleType === "sedan" ? 5599 : 7499; 
    if (matchRoute("korba", "raigarh")) return vehicleType === "sedan" ? 4500 : 5400;
    if (matchRoute("bilaspur", "raigarh")) return vehicleType === "sedan" ? 4500 : 5400;
    if (matchRoute("raigarh", "raipur")) return vehicleType === "sedan" ? 6999 : 8999;
    if (matchRoute("raigarh", "jharsuguda")) return vehicleType === "sedan" ? 3699 : 4699;
    if (matchRoute("raipur", "jagdalpur")) return vehicleType === "sedan" ? 3999 : 5999;

    if (oneWayDistance <= 120) return vehicleType === "sedan" ? 3699 : 4699;
    if (oneWayDistance <= 260) return vehicleType === "sedan" ? 6999 : 9999;
    
    const ratePerKm = vehicleType === "sedan" ? 14.5 : vehicleType === "ertiga" ? 18.5 : 22.5;
    const minKmBlock = Math.max(oneWayDistance * 2, 250 * tripDays);
    return (minKmBlock * ratePerKm);
  }

  return vehicleType === "sedan" ? 2199 : 3499;
}

function getOneWayRate(vehicleType: VehicleType, distance: number, isDayTime: boolean) {
  let rate = 17.7; 
  switch (vehicleType) {
    case "sedan":
      if (distance <= 150) rate = isDayTime ? 20.3 : 20.0; 
      else if (distance <= 260) rate = isDayTime ? 18.3 : 18.0;
      else if (distance <= 400) rate = 18.0;
      else rate = 17.7;
      break;
    case "ertiga":
      if (distance <= 150) rate = isDayTime ? 25.5 : 28.7; 
      else if (distance <= 260) rate = isDayTime ? 23.5 : 26.5;
      else if (distance <= 400) rate = 24.2;
      else rate = 25.2; 
      break;
    case "innova":
    case "crysta":
      if (distance <= 150) rate = isDayTime ? 29.5 : 32.5; 
      else if (distance <= 260) rate = isDayTime ? 27.5 : 30.5;
      else if (distance <= 400) rate = 28.5;
      else rate = 29.5;
      break;
    case "scorpio":
      if (distance <= 150) rate = isDayTime ? 26.2 : 28.2;
      else if (distance <= 260) rate = isDayTime ? 24.7 : 26.7;
      else if (distance <= 400) rate = 25.7;
      else rate = 26.7;
      break;
  }
  return rate;
}

function getHyperShortFlatFare(vehicleType: VehicleType, isDayTime: boolean): number {
  const nightPremium = isDayTime ? 0 : 300;
  switch (vehicleType) {
    case "sedan": return 1049 + nightPremium;
    case "ertiga": return 1699 + nightPremium;
    case "innova": return 2199 + nightPremium;
    case "crysta": return 2349 + nightPremium;
    case "scorpio": return 2199 + nightPremium;
    default: return 1049;
  }
}

function getHyperShortRoundTripFare(vehicleType: VehicleType, isDayTime: boolean): number {
  const nightPremium = isDayTime ? 0 : 400;
  switch (vehicleType) {
    case "sedan": return 2149 + nightPremium;
    case "ertiga": return 2999 + nightPremium;
    case "innova": return 3899 + nightPremium;
    case "crysta": return 4149 + nightPremium;
    case "scorpio": return 3899 + nightPremium;
    default: return 2149;
  }
}

function getRoundTripRate(vehicleType: VehicleType, totalRoundTripDistance: number, isDayTime: boolean) {
  switch (vehicleType) {
    case "sedan":
      if (totalRoundTripDistance <= 240) return isDayTime ? 16.2 : 15.8; 
      if (totalRoundTripDistance <= 600) return 15.8;
      if (totalRoundTripDistance <= 1000) return 14.5;
      return 13.0; 
    case "ertiga":
      if (totalRoundTripDistance <= 240) return isDayTime ? 18.5 : 19.5;
      if (totalRoundTripDistance <= 600) return 17.5;
      if (totalRoundTripDistance <= 1000) return 16.5;
      return 15.5; 
    case "innova":
    case "scorpio":
      if (totalRoundTripDistance <= 240) return isDayTime ? 21.0 : 22.0;
      if (totalRoundTripDistance <= 600) return 20.0;
      if (totalRoundTripDistance <= 1000) return 19.0;
      return 17.5;
    case "crysta":
      if (totalRoundTripDistance <= 240) return isDayTime ? 23.0 : 24.0; 
      if (totalRoundTripDistance <= 600) return 21.5;
      if (totalRoundTripDistance <= 1000) return 20.5;
      return 19.0;
    default:
      return 14.0;
  }
}

function getAirportFare(vehicleType: VehicleType) {
  switch (vehicleType) {
    case "sedan": return 899;
    case "ertiga": return 1299;
    case "innova": return 1699;
    case "crysta": return 1999;
    case "scorpio": return 1899;
    default: return 899;
  }
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
    case "oneway-hyper-short": return "Twin Cities Fast Corridor Rate";
    case "oneway-slab": return "One Way Economy Pricing";
    case "oneway-mid-distance": return "One Way Mid Distance Option";
    case "oneway-long-distance": return "One Way Long Route Special";
    case "roundtrip-hyper-short": return "Twin Cities Round Trip Package";
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
  pickupTime = "09:00",
  pickupLocation = "",
  dropLocation = "",
}: CalculateFareParams & { pickupLocation?: string; dropLocation?: string; }): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];
  const oneWayDistance = Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  let fare = 0;
  let extraDistance = 0;
  let billedDistance = oneWayDistance;
  let pricingMode: PricingMode = "roundtrip-standard";
  let baseFareUsed = 0;
  let rateUsed = 0;
  let shortRuleApplied = false;

  const stopCharge = stopCount > 0 ? stopCount * EXTRA_STOP_CHARGE : 0;
  let stopKmBuffer = stopCount * 15; 

  const [hours] = pickupTime.split(":").map(Number);
  const isDayTime = hours >= 5 && hours < 22; 

  if (bookingType === "oneway" && oneWayDistance > 0 && oneWayDistance <= 50) {
    fare = getHyperShortFlatFare(vehicleType, isDayTime);
    billedDistance = Math.max(oneWayDistance, 50);
    pricingMode = "oneway-hyper-short";
  } else if (bookingType === "roundtrip" && oneWayDistance > 0 && oneWayDistance <= 50) {
    fare = getHyperShortRoundTripFare(vehicleType, isDayTime);
    billedDistance = Math.max(oneWayDistance * 2, 100) + 15;
    pricingMode = "roundtrip-hyper-short";
  } else {
    if (bookingType === "oneway" && oneWayDistance > 0) {
      if (oneWayDistance <= 100) extraDistance = 5;
      else if (oneWayDistance <= 250) extraDistance = 15;
      else if (oneWayDistance <= 400) extraDistance = 20;
      else extraDistance = 30; 
      billedDistance = oneWayDistance + extraDistance + stopKmBuffer;
    } else if (bookingType === "roundtrip" && oneWayDistance > 0) {
      extraDistance = 15; 
      let rawUpDown = oneWayDistance * 2;
      billedDistance = Math.max(rawUpDown, 200) + extraDistance + stopKmBuffer;
    }

    if (bookingType === "oneway") {
      rateUsed = getOneWayRate(vehicleType, oneWayDistance, isDayTime);
      baseFareUsed = billedDistance * rateUsed;
      if (oneWayDistance <= 150) {
        fare = Math.max(baseFareUsed, MIN_FARE[vehicleType]);
        pricingMode = "oneway-slab";
      } else if (oneWayDistance <= 400) {
        fare = Math.max(baseFareUsed, MIN_FARE[vehicleType]);
        pricingMode = "oneway-mid-distance";
      } else {
        fare = baseFareUsed; 
        pricingMode = "oneway-long-distance";
      }
    }

    if (bookingType === "roundtrip") {
      rateUsed = getRoundTripRate(vehicleType, billedDistance, isDayTime);
      baseFareUsed = billedDistance * rateUsed;
      
      const isSameDayDaylightTrip = tripDays === 1 && isDayTime;

      let dynamicHaltDeduction = 0;
      if (!isSameDayDaylightTrip) {
        dynamicHaltDeduction = (vehicle.dayHalt * tripDays) + (vehicle.nightHalt * tripDays);
      }
      
      fare = baseFareUsed - dynamicHaltDeduction;
      pricingMode = (oneWayDistance * 2) <= 250 ? "roundtrip-short-rule" : "roundtrip-standard";
    }
  }

  fare += stopCharge;

  // PREMIUM PROTECTION GAP ENGINE
  if (bookingType === "oneway" || bookingType === "roundtrip") {
    const rahulFare = estimateRahulTravelsFare(vehicleType, oneWayDistance, bookingType, tripDays, isDayTime, pickupLocation, dropLocation);
    const currentDifference = rahulFare - fare;

    // Badi gaadiyo (SUV/Crysta) ke business aur margin protection ke liye tightly calibrated filter
    if (vehicleType === "crysta" || vehicleType === "innova") {
      if (currentDifference > 200) {
        fare = rahulFare - 149; // Premium segment hamesha market se safe ₹150 gap par hi rahega, usse zyada drop nahi hoga
      }
    } else if (vehicleType === "ertiga") {
      if (currentDifference > 300) {
        fare = rahulFare - 199; // Ertiga safe zone filter
      }
    } else {
      // Sedan operations
      if (currentDifference < 100) {
        fare = rahulFare - 90;
      } else if (currentDifference > 500 && (oneWayDistance * 2) > 300) {
        fare = rahulFare - 150;
      }
    }
  }

  // FIXED OVERRIDE: Korba-Bilaspur Sedan Lock
  const pLoc = pickupLocation.toLowerCase();
  const dLoc = dropLocation.toLowerCase();
  if (bookingType === "oneway" && vehicleType === "sedan" && 
      ((pLoc.includes("korba") && dLoc.includes("bilaspur")) || (pLoc.includes("bilaspur") && dLoc.includes("korba")))) {
    fare = 1949; 
  }

  const finalFare = psychologicalPrice(fare);

  return {
    actualDistance: oneWayDistance,
    extraDistance: extraDistance + stopKmBuffer,
    billedDistance,
    distance: billedDistance,
    fare: finalFare,
    strikeFare: finalFare, 
    discount: 0,
    finalFare,
    nightHalt: vehicle.nightHalt,
    discountApplied: false,
    pricingMode,
    baseFareUsed: baseFareUsed || fare,
    rateUsed,
    shortRuleApplied,
    tollIncluded: true,
    parkingIncluded: false,
    stopCharge,
    remarks: [
      "State Highway Toll Tax Included",
      `Route Addon Included: +${extraDistance + stopKmBuffer} KM`,
      isDayTime ? "Daylight Slot Economy Applied" : "Standard Fleet Run Mode",
    ],
  };
}
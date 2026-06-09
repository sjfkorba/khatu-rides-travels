export const VEHICLES = {
  sedan: {
    label: "Sedan",
    ratePerKm: 18,
    perDayCharge: 1200,
    fixedLocalCharge: 1800,
    dayHalt: 500,
    nightHalt: 600,
    maxPassengers: 4,
  },
  ertiga: {
    label: "Ertiga",
    ratePerKm: 20,
    perDayCharge: 1500,
    fixedLocalCharge: 2200,
    dayHalt: 600,
    nightHalt: 700,
    maxPassengers: 6,
  },
  innova: {
    label: "Innova",
    ratePerKm: 22,
    perDayCharge: 2000,
    fixedLocalCharge: 2500,
    dayHalt: 800,
    nightHalt: 900,
    maxPassengers: 7,
  },
  crysta: {
    label: "Innova Crysta",
    ratePerKm: 24,
    perDayCharge: 2500,
    fixedLocalCharge: 2800,
    dayHalt: 900,
    nightHalt: 1000,
    maxPassengers: 7,
  },
  scorpio: {
    label: "Scorpio",
    ratePerKm: 23,
    perDayCharge: 2200,
    fixedLocalCharge: 2500,
    dayHalt: 800,
    nightHalt: 900,
    maxPassengers: 7,
  },
} as const;

export type VehicleType = keyof typeof VEHICLES;

export type BookingType =
  | "oneway"
  | "roundtrip"
  | "airporttransfer"
  | "local";

export type PricingMode = "fixed" | "running";

type CalculateFareParams = {
  distance: number;
  extraKm?: number;
  vehicleType: VehicleType;
  bookingType: BookingType;
  pricingMode?: PricingMode;
  passengerCount?: number;
  stoppage?: number;
  dayHalts?: number;
  nightHalts?: number;
  tripDays?: number;
  fuelPricePerLitre?: number;
};

export type CalculateFareResult = {
  mapDistance: number;
  extraKm: number;
  totalRunningDistance: number;
  fare: number;
  finalFare: number;
  baseFare: number;
  fuelCharge: number;
  stoppageCharge: number;
  passengerCharge: number;
  dayHaltCharge: number;
  nightHaltCharge: number;
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
  extraKm = 0,
  vehicleType,
  bookingType,
  pricingMode = "running",
  passengerCount = 1,
  stoppage = 0,
  dayHalts = 0,
  nightHalts = 0,
  tripDays = 1,
  fuelPricePerLitre = 95,
}: CalculateFareParams): CalculateFareResult {
  const vehicle = VEHICLES[vehicleType];

  const safeDistance =
    Number.isFinite(distance) && distance > 0 ? Math.round(distance) : 0;

  const safeExtraKm =
    Number.isFinite(extraKm) && extraKm > 0 ? Math.round(extraKm) : 0;

  const totalRunningDistance = safeDistance + safeExtraKm;

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

  const safeTripDays =
    Number.isFinite(tripDays) && tripDays > 0 ? Math.round(tripDays) : 1;

  const safeFuelPrice =
    Number.isFinite(fuelPricePerLitre) && fuelPricePerLitre > 0
      ? fuelPricePerLitre
      : 95;

  let baseFare = 0;
  let fuelCharge = 0;
  const remarks: string[] = [];

  const passengerCharge = getPassengerCharge(safePassengerCount);
  const stoppageCharge = safeStoppage * 150;
  const dayHaltCharge = safeDayHalts * vehicle.dayHalt;
  const nightHaltCharge = safeNightHalts * vehicle.nightHalt;

  if (bookingType === "oneway") {
    const amount = totalRunningDistance * vehicle.ratePerKm;
    const multiplier = totalRunningDistance >= 250 ? 1.05 : 1.1;
    baseFare = amount * multiplier;

    remarks.push(
      `One way fare = ${totalRunningDistance} KM × ₹${vehicle.ratePerKm}/KM × ${multiplier}`
    );
  } else if (bookingType === "roundtrip") {
    if (pricingMode === "fixed") {
      const amount = totalRunningDistance * vehicle.ratePerKm;
      baseFare = amount * 2.05;

      remarks.push(
        `Round trip fixed fare = ${totalRunningDistance} KM × ₹${vehicle.ratePerKm}/KM × 2.05`
      );
    } else {
      fuelCharge = Math.round((totalRunningDistance / 10) * safeFuelPrice);

      const rentCharge = safeTripDays * vehicle.perDayCharge;

      baseFare =
        rentCharge +
        fuelCharge +
        dayHaltCharge +
        nightHaltCharge;

      remarks.push(
        `Round trip running = ${safeTripDays} day × ₹${vehicle.perDayCharge} + fuel + halt charges`
      );
      remarks.push(
        `Vehicle rent = ${safeTripDays} × ₹${vehicle.perDayCharge} = ₹${rentCharge}`
      );
      remarks.push(
        `Fuel = ${totalRunningDistance} KM ÷ 10 × ₹${safeFuelPrice}/L = ₹${fuelCharge}`
      );
      remarks.push(
        `Day halt = ${safeDayHalts} × ₹${vehicle.dayHalt} = ₹${dayHaltCharge}`
      );
      remarks.push(
        `Night halt = ${safeNightHalts} × ₹${vehicle.nightHalt} = ₹${nightHaltCharge}`
      );
      remarks.push("Toll charges extra");
      remarks.push("Driver fooding extra");
    }
  } else if (bookingType === "local") {
    if (pricingMode === "fixed") {
      baseFare = vehicle.fixedLocalCharge;

      remarks.push("Local fixed fare based on 80 KM / 10 Hours");
      remarks.push("Toll charges extra");
      remarks.push("Driver fooding extra");
    } else {
      fuelCharge = Math.round((totalRunningDistance / 10) * safeFuelPrice);
      baseFare = vehicle.perDayCharge + fuelCharge;

      remarks.push(`Local running = per day charge ₹${vehicle.perDayCharge} + fuel`);
      remarks.push(
        `Fuel = ${totalRunningDistance} KM ÷ 10 × ₹${safeFuelPrice}/L = ₹${fuelCharge}`
      );
      remarks.push("Toll charges extra");
      remarks.push("Driver fooding extra");
    }
  } else if (bookingType === "airporttransfer") {
    const amount = totalRunningDistance * vehicle.ratePerKm;
    baseFare = amount;

    remarks.push(
      `Airport transfer fare = ${totalRunningDistance} KM × ₹${vehicle.ratePerKm}/KM`
    );
  }

  const finalFare = Math.round(
    baseFare + passengerCharge + stoppageCharge
  );

  remarks.push(`Map distance: ${safeDistance} KM`);
  remarks.push(`Extra running added: ${safeExtraKm} KM`);
  remarks.push(`Total running distance: ${totalRunningDistance} KM`);

  if (safeStoppage > 0) {
    remarks.push(`${safeStoppage} stoppage(s) added @ ₹150 each`);
  } else {
    remarks.push("No stoppage added");
  }

  if (safeDayHalts > 0) {
    remarks.push(`${safeDayHalts} day halt(s) added`);
  } else {
    remarks.push("No day halt added");
  }

  if (safeNightHalts > 0) {
    remarks.push(`${safeNightHalts} night halt(s) added`);
  } else {
    remarks.push("No night halt added");
  }

  remarks.push(`Passenger count: ${safePassengerCount}`);

  return {
    mapDistance: safeDistance,
    extraKm: safeExtraKm,
    totalRunningDistance,
    fare: finalFare,
    finalFare,
    baseFare: Math.round(baseFare),
    fuelCharge,
    stoppageCharge,
    passengerCharge,
    dayHaltCharge,
    nightHaltCharge,
    remarks,
  };
}
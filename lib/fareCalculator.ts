/* =========================================================

   KHATU RIDES – CENTRAL FARE ENGINE

   Replacement for the previous fare-calculation module.



   Business rules implemented:

   - One Way: round-trip base KM, hub percentages, route overrides.

   - Long One Way: +25 KM only when actual one-way distance >500 KM.

   - Interstate rate tier applies only above 500 KM; Korba–Odisha keeps its special rate.

   - Round Trip: same-day, under-80 KM, multi-day and

     Bilaspur–Raipur route-specific override.

   - Local Rental: approved package + extra KM + extra hours.

   - Festival: both B2C and B2B; highest eligible percentage only.



   Important:

   - Toll is separate unless the specific rule says otherwise.

   - Multi-day round-trip running rates are toll-inclusive.

   - Local night-halt charge is not finalized; it is not invented here.

   - This module calculates fares only. It does not write to Firebase.

\========================================================= */



export type VehicleType = "sedan" | "ertiga" | "crysta";

export type BookingType = "oneway" | "roundtrip" | "local";

export type ServiceType = "outstation" | "local";

export type HubCategory = "major" | "semi-major" | "non-major";

export type RouteClassification = "domestic" | "interstate" | "korba-odisha";

export type LocalPackageType = "4hr40km" | "8hr80km" | "12hr120km";

export type FestivalFareType = BookingType;



export interface VehicleConfig {

  label: string;

  image: string;

  oneWayB2CRate: number;

  oneWayB2BMinRate: number;

  oneWayB2BMaxRate: number;

  interstateB2CRate: number;

  interstateB2BMinRate: number;

  interstateB2BMaxRate: number;

  roundTripRate: number;

  shortRoundTripFixed: number;

  shortRoundTripRate: number;

  localRatePerKm: number;

  /** Legacy compatibility aliases used by older UI components. */

  baseRatePerKm: number;

  longRatePerKm: number;

  oneWayMultiplier: number;

  bilaspurRaipurRate: number;

}



export const VEHICLES: Record<VehicleType, VehicleConfig> = {

  sedan: {

    label: "Maruti Suzuki Dzire",

    image: "/dezire.png",

    oneWayB2CRate: 12,

    oneWayB2BMinRate: 9,

    oneWayB2BMaxRate: 10,

    interstateB2CRate: 17,

    interstateB2BMinRate: 14,

    interstateB2BMaxRate: 15,

    roundTripRate: 14,

    shortRoundTripFixed: 1200,

    shortRoundTripRate: 11,

    localRatePerKm: 11,

    baseRatePerKm: 14,

    longRatePerKm: 14,

    oneWayMultiplier: 1,

    bilaspurRaipurRate: 11,

  },

  ertiga: {

    label: "Maruti Suzuki Ertiga (MUV)",

    image: "/ertiga.png",

    oneWayB2CRate: 14,

    oneWayB2BMinRate: 11,

    oneWayB2BMaxRate: 12,

    interstateB2CRate: 19,

    interstateB2BMinRate: 16,

    interstateB2BMaxRate: 17,

    roundTripRate: 17,

    shortRoundTripFixed: 1500,

    shortRoundTripRate: 13,

    localRatePerKm: 14,

    baseRatePerKm: 17,

    longRatePerKm: 17,

    oneWayMultiplier: 1,

    bilaspurRaipurRate: 13,

  },

  crysta: {

    label: "Toyota Innova Crysta (Premium)",

    image: "/crysta.png",

    oneWayB2CRate: 17,

    oneWayB2BMinRate: 14,

    oneWayB2BMaxRate: 15,

    interstateB2CRate: 22,

    interstateB2BMinRate: 19,

    interstateB2BMaxRate: 20,

    roundTripRate: 21,

    shortRoundTripFixed: 2000,

    shortRoundTripRate: 16,

    localRatePerKm: 17,

    baseRatePerKm: 21,

    longRatePerKm: 21,

    oneWayMultiplier: 1,

    bilaspurRaipurRate: 17,

  },

};



export interface LocalPackageConfig {

  id: LocalPackageType;

  label: string;

  hours: number;

  kms: number;

  b2cFare: number;

  b2bFare: number;

  b2cExtraHourRate: number;

  b2bExtraHourRate: number;

  b2cExtraKmRate: number;

  b2bExtraKmRate: number;

  /** Legacy compatibility aliases. */

  baseFare: number;

  extraHourRate: number;

  extraKmRate: number;

}



export const LOCAL_PACKAGES: Record<
  VehicleType,
  Record<LocalPackageType, LocalPackageConfig>
> = {
  sedan: {
    "4hr40km": {
      id: "4hr40km", label: "4 Hours / 40 KM", hours: 4, kms: 40,
      b2cFare: 1640, b2bFare: 1200,
      b2cExtraHourRate: 120, b2bExtraHourRate: 90,
      b2cExtraKmRate: 11, b2bExtraKmRate: 10,
      baseFare: 1640, extraHourRate: 120, extraKmRate: 11,
    },
    "8hr80km": {
      id: "8hr80km", label: "8 Hours / 80 KM", hours: 8, kms: 80,
      b2cFare: 2080, b2bFare: 1600,
      b2cExtraHourRate: 120, b2bExtraHourRate: 90,
      b2cExtraKmRate: 11, b2bExtraKmRate: 10,
      baseFare: 2080, extraHourRate: 120, extraKmRate: 11,
    },
    "12hr120km": {
      id: "12hr120km", label: "12 Hours / 120 KM", hours: 12, kms: 120,
      b2cFare: 2520, b2bFare: 2000,
      b2cExtraHourRate: 120, b2bExtraHourRate: 90,
      b2cExtraKmRate: 11, b2bExtraKmRate: 10,
      baseFare: 2520, extraHourRate: 120, extraKmRate: 11,
    },
  },
  ertiga: {
    "4hr40km": {
      id: "4hr40km", label: "4 Hours / 40 KM", hours: 4, kms: 40,
      b2cFare: 2060, b2bFare: 1680,
      b2cExtraHourRate: 150, b2bExtraHourRate: 120,
      b2cExtraKmRate: 14, b2bExtraKmRate: 12,
      baseFare: 2060, extraHourRate: 150, extraKmRate: 14,
    },
    "8hr80km": {
      id: "8hr80km", label: "8 Hours / 80 KM", hours: 8, kms: 80,
      b2cFare: 2620, b2bFare: 2160,
      b2cExtraHourRate: 150, b2bExtraHourRate: 120,
      b2cExtraKmRate: 14, b2bExtraKmRate: 12,
      baseFare: 2620, extraHourRate: 150, extraKmRate: 14,
    },
    "12hr120km": {
      id: "12hr120km", label: "12 Hours / 120 KM", hours: 12, kms: 120,
      b2cFare: 3180, b2bFare: 2640,
      b2cExtraHourRate: 150, b2bExtraHourRate: 120,
      b2cExtraKmRate: 14, b2bExtraKmRate: 12,
      baseFare: 3180, extraHourRate: 150, extraKmRate: 14,
    },
  },
  crysta: {
    "4hr40km": {
      id: "4hr40km", label: "4 Hours / 40 KM", hours: 4, kms: 40,
      b2cFare: 2880, b2bFare: 2120,
      b2cExtraHourRate: 180, b2bExtraHourRate: 150,
      b2cExtraKmRate: 17, b2bExtraKmRate: 13,
      baseFare: 2880, extraHourRate: 180, extraKmRate: 17,
    },
    "8hr80km": {
      id: "8hr80km", label: "8 Hours / 80 KM", hours: 8, kms: 80,
      b2cFare: 3560, b2bFare: 2640,
      b2cExtraHourRate: 180, b2bExtraHourRate: 150,
      b2cExtraKmRate: 17, b2bExtraKmRate: 13,
      baseFare: 3560, extraHourRate: 180, extraKmRate: 17,
    },
    "12hr120km": {
      id: "12hr120km", label: "12 Hours / 120 KM", hours: 12, kms: 120,
      b2cFare: 4240, b2bFare: 3160,
      b2cExtraHourRate: 180, b2bExtraHourRate: 150,
      b2cExtraKmRate: 17, b2bExtraKmRate: 13,
      baseFare: 4240, extraHourRate: 180, extraKmRate: 17,
    },
  },
};

export interface FestivalFareRule {
  id: string; name: string; increasePercent: number;
  isActive?: boolean; startAt?: string; endAt?: string;
  status?: "draft" | "active" | "paused" | "expired";
  fareTypes?: FestivalFareType[];
  validity?: { startDate: string; endDate: string; timezone?: string };
  scope?: { type: "all" | "routes" | "hubs"; routes?: string[]; hubs?: string[] };
  reason?: string; surchargeBasis?: "both"; stackingPolicy?: "highest_only";
}

export interface RouteCouponRule {
  id: string; code: string; from: string; to: string;
  fromNormalized?: string; toNormalized?: string;
  discountPercent: number; startAt: string; endAt: string;
  isActive: boolean; usageCount?: number;
}

export interface LocalFareResult {

  package: LocalPackageConfig;

  packageFare: number;

  actualHours: number;

  actualKilometers: number;

  extraHours: number;

  extraKilometers: number;

  extraHourCharges: number;

  extraKmCharges: number;

  totalExtraCharges: number;

  finalFare: number;

  strikeFare: number;

  tollParkingExcluded: boolean;

  driverAllowanceIncluded: boolean;

  fuelIncluded: boolean;

  freeCancellationHours: number;

  b2bFare?: number;

  b2bExtraCharges?: number;

  festivalSurchargePercent?: number;
  couponDiscountPercent?: number;
  couponDiscountAmount?: number;

}



export interface CalculateFareResult {

  actualDistance: number;

  billedDistance: number;

  rateUsed: number;

  strikeFare: number;

  finalFare: number;

  discountPercent: number;

  durationMinutes: number;

  haltCharges: number;

  autoCorrectedService: ServiceType;

  isOneWayAvailable: boolean;

  localFare?: LocalFareResult;

  /** Retained for compatibility with older UI; these are customer-fare values only if supplied. */

  b2cMinFare?: number;

  b2cMaxFare?: number;

  b2bMinFare?: number;

  b2bMaxFare?: number;

  grossProfitMin?: number;

  grossProfitMax?: number;

  tollCharges?: number;

  driverFooding?: number;

  festivalSurchargePercent?: number;

  appliedFestivalRule?: { id: string; name: string; increasePercent: number } | null;
  appliedCoupon?: { id: string; code: string; discountPercent: number } | null;
  festivalIncreaseAmount?: number;
  couponDiscountAmount?: number;

  calculationBreakdown?: string[];

  routeClassification?: RouteClassification;

  hubCategory?: HubCategory;

}



/** @deprecated Fixed route prices were removed in favor of the locked formula-based engine.

 * Kept as an empty compatibility export so older imports do not fail during migration.

 */

export const FIXED_ONEWAY_FARES: Partial<

  Record<string, Partial<Record<VehicleType, number>>>

> = {};



export interface CalculateFareInput {

  distance: number;

  vehicleType: VehicleType;

  bookingType: BookingType;

  serviceType?: ServiceType;

  pickupDate?: string;

  pickupTime?: string;

  returnDate?: string;

  returnTime?: string;

  drop?: string;

  pickup?: string;

  localPackage?: LocalPackageType;

  localHours?: number;

  localKilometers?: number;



  // Optional rule inputs. Existing callers may omit these.

  hubCategory?: HubCategory;

  routeClassification?: RouteClassification;

  isInterstate?: boolean;

  isKorbaOriginOdisha?: boolean;

  roundTripBufferKm?: number;

  intermediateDayCount?: number;

  intermediateDailyKm?: number;

  nightCount?: number;

  includeBilaspurRaipurFooding?: boolean;
  driverFoodingPerDay?: number;

  festivalRules?: FestivalFareRule[];
  couponRules?: RouteCouponRule[];
  couponCode?: string;

  bookingDate?: string; // YYYY-MM-DD; used to select festival rule

}



const HUB_PERCENTAGES: Record<

  HubCategory,

  { customer: number; vendorMin: number; vendorMax: number }

> = {

  major: { customer: 0.7, vendorMin: 0.6, vendorMax: 0.6 },

  "semi-major": { customer: 0.8, vendorMin: 0.7, vendorMax: 0.7 },

  "non-major": { customer: 0.9, vendorMin: 0.6, vendorMax: 0.8 },

};



const ONEWAY_BUFFER_THRESHOLD_KM = 500;

const ONEWAY_LONG_DISTANCE_BUFFER_KM = 25;

const TOLL_PER_KM = 1.98;

const BILASPUR_RAIPUR_LIMIT_KM = 250;

const DEFAULT_SAME_DAY_BUFFER_KM = 30;



function safeNumber(value: unknown, fallback = 0): number {

  const parsed = Number(value);

  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;

}



/** Customer fare rounds to nearest ₹100 as per the locked policy. */

export function roundCustomerFare(value: number): number {

  return Math.round(value / 100) * 100;

}



/** Retained as a compatibility export; no longer used for fare calculation. */

export function psychologicalPrice(value: number): number {

  return Math.max(0, Math.round(value));

}



function normalize(value: string): string {

  return (value || "").toLowerCase().trim();

}



function isBilaspurRaipurRoute(pickup: string, drop: string): boolean {

  const p = normalize(pickup);

  const d = normalize(drop);

  return (

    (p.includes("bilaspur") && d.includes("raipur")) ||

    (p.includes("raipur") && d.includes("bilaspur"))

  );

}



/** Specific customer-fare override for Raipur ↔ Jharsuguda only. */

function isRaipurJharsugudaRoute(pickup: string, drop: string): boolean {

  const p = normalize(pickup);

  const d = normalize(drop);

  return (

    (p.includes("raipur") && d.includes("jharsuguda")) ||

    (p.includes("jharsuguda") && d.includes("raipur"))

  );

}



const ODISHA_PLACE_HINTS = [

  "odisha", "orissa", "sambalpur", "jharsuguda", "balangir",

  "balangir", "bargarh", "rourkela", "sundargarh", "bhubaneswar",

  "cuttack", "berhampur", "koraput", "keonjhar", "angul", "talcher",

];



function inferRouteClassification(input: CalculateFareInput): RouteClassification {

  if (input.routeClassification) return input.routeClassification;

  const pickup = normalize(input.pickup || "");

  const drop = normalize(input.drop || "");

  if (input.isKorbaOriginOdisha) return "korba-odisha";



  const pickupIsKorba = pickup.includes("korba");

  const dropIsKorba = drop.includes("korba");

  const pickupIsOdisha = ODISHA_PLACE_HINTS.some((place) => pickup.includes(place));

  const dropIsOdisha = ODISHA_PLACE_HINTS.some((place) => drop.includes(place));



  // Korba–Odisha special pricing works in both directions.

  if ((pickupIsKorba && dropIsOdisha) || (dropIsKorba && pickupIsOdisha)) {

    return "korba-odisha";

  }



  if (typeof input.isInterstate === "boolean") {

    return input.isInterstate ? "interstate" : "domestic";

  }



  const hasCg = /\b(chhattisgarh|chattisgarh|cg)\b/.test(`${pickup} ${drop}`);
  const hasOtherState = /\b(odisha|orissa|madhya pradesh|maharashtra|telangana|jharkhand|uttar pradesh)\b/.test(`${pickup} ${drop}`);



  // Odisha city-name hints recognize city-only Google Maps results.

  if (pickupIsOdisha || dropIsOdisha || (hasCg && hasOtherState)) {

    return "interstate";

  }

  return "domestic";

}



/**

 * Hub classification lists for Chhattisgarh One-Way pricing.

 *

 * Rule agreed for Non-Major:

 * Any pickup/drop hub that is NOT present in the Major list, the

 * Semi-Major list, or another explicitly configured hub section in this

 * fare engine is treated as Non-Major. We therefore do not need to maintain

 * a manually exhaustive list of every small town/village in Chhattisgarh.

 * Google Maps place names not recognized by the lists also default to

 * Non-Major.

 */

export const MAJOR_ONEWAY_HUBS = [

  "raipur",

  "naya raipur",

  "new raipur",

  "atal nagar",

  "bhilai",

  "durg",

  "bilaspur",

  "korba",

  "raigarh",

  "ambikapur",

  "jagdalpur",

  "kawardha",

] as const;



export const SEMI_MAJOR_ONEWAY_HUBS = [

  "dhamtari",

  "mahasamund",

  "kondagaon",

  "kondagaon",

  "kanker",

  "jharsuguda",

  "rourkela",

  "dongargarh",

  "balod",

  "bemetara",

  "baloda bazar",

  "balodabazar",

  "janjgir",

  "champa",

  "sakti",



  "gharghoda",

  "katghora",

  "dipka",

  "pali",

  "mungeli",

  "takhatpur",

  "takhतपुर",

  "ratanpur",

  "baikunthpur",

  "baikunthpur",

  "manendragarh",

  "surajpur",

  "jashpur nagar",

  "jashpur",

  "balrampur",

  "dantewada",

  "narayanpur",

  // Previously configured explicit exception in this engine.

  "balangir",

] as const;



/**

 * Explicitly configured Non-Major One-Way hubs.

 * These hubs use the Non-Major pricing percentages:

 * Customer/B2C: 90%; Vendor/B2B: 60%–80%.

 *

 * Any other location not present in Major or Semi-Major lists

 * also defaults to Non-Major automatically.

 */

export const NON_MAJOR_ONEWAY_HUBS = [

  "kharsia",

  "kharsiya", // Common alternate spelling

] as const;



function containsHub(routeText: string, hubs: readonly string[]): boolean {

  return hubs.some((hub) => routeText.includes(normalize(hub)));

}



function inferSingleHubCategory(location: string): HubCategory {

  const normalized = normalize(location);

  if (!normalized) return "non-major";

  if (containsHub(normalized, MAJOR_ONEWAY_HUBS)) return "major";

  if (containsHub(normalized, SEMI_MAJOR_ONEWAY_HUBS)) return "semi-major";

  if (containsHub(normalized, NON_MAJOR_ONEWAY_HUBS)) return "non-major";

  // Any location not present in the configured hub sections is Non-Major.

  return "non-major";

}



function inferHubCategory(input: CalculateFareInput): HubCategory {

  if (input.hubCategory) return input.hubCategory;



  const pickup = normalize(input.pickup || "");

  const drop = normalize(input.drop || "");



  // Explicit route override: Korba → Ambikapur is Non-Major One-Way.

  if (pickup.includes("korba") && drop.includes("ambikapur")) {

    return "non-major";

  }



  const pickupCategory = inferSingleHubCategory(pickup);

  const dropCategory = inferSingleHubCategory(drop);



  // A route takes the less-popular endpoint's category. This ensures that

  // Raipur (Major) → Rajnandgaon (unlisted/Non-Major) is Non-Major.

  if (pickupCategory === "non-major" || dropCategory === "non-major") {

    return "non-major";

  }

  if (pickupCategory === "semi-major" || dropCategory === "semi-major") {

    return "semi-major";

  }

  return "major";

}



function bookingTimestamp(date: string, time = "00:00"): number {
  if (!date) return Number.NaN;
  const safeTime = /^\\d{2}:\\d{2}$/.test(time) ? time : "00:00";
  return new Date(`${date}T${safeTime}:00+05:30`).getTime();
}
function inPromotionWindow(startAt: string | undefined, endAt: string | undefined, date: string, time: string): boolean {
  const at = bookingTimestamp(date, time);
  const start = startAt ? new Date(startAt).getTime() : NaN;
  const end = endAt ? new Date(endAt).getTime() : NaN;
  return Number.isFinite(at) && Number.isFinite(start) && Number.isFinite(end) && at >= start && at <= end;
}
function getApplicableFestivalRule(
  rules: FestivalFareRule[] | undefined, bookingType: BookingType,
  bookingDate: string, pickupTime: string, pickup: string, drop: string,
): FestivalFareRule | null {
  if (!rules?.length || !bookingDate) return null;
  const routeKey = `${normalize(pickup)}-${normalize(drop)}`;
  const eligible = rules.filter((rule) => {
    if (!(rule.isActive === true || rule.status === "active") || !(Number(rule.increasePercent) > 0)) return false;
    if (rule.fareTypes?.length && !rule.fareTypes.includes(bookingType)) return false;
    const dateOk = rule.startAt && rule.endAt
      ? inPromotionWindow(rule.startAt, rule.endAt, bookingDate, pickupTime)
      : !!rule.validity && bookingDate >= rule.validity.startDate && bookingDate <= rule.validity.endDate;
    if (!dateOk) return false;
    const scope = rule.scope || { type: "all" as const };
    if (scope.type === "all") return true;
    if (scope.type === "routes") return (scope.routes || []).some((r) => {
      const key = normalize(r); return key === routeKey || (!!key && routeKey.includes(key));
    });
    if (scope.type === "hubs") {
      const locations = `${normalize(pickup)} ${normalize(drop)}`;
      return (scope.hubs || []).some((h) => locations.includes(normalize(h)));
    }
    return false;
  });
  return eligible.sort((x, y) => y.increasePercent - x.increasePercent)[0] || null;
}
function cityKey(value: string): string { return normalize(value).split(",")[0].trim(); }
function getApplicableCoupon(
  rules: RouteCouponRule[] | undefined, selectedCode: string | undefined,
  bookingDate: string, pickupTime: string, pickup: string, drop: string,
): RouteCouponRule | null {
  const code = (selectedCode || "").trim().toUpperCase();
  if (!code || !rules?.length) return null;
  return rules.find((c) => c.isActive === true &&
    c.code?.trim().toUpperCase() === code &&
    Number(c.discountPercent) > 0 && Number(c.discountPercent) <= 100 &&
    inPromotionWindow(c.startAt, c.endAt, bookingDate, pickupTime) &&
    cityKey(pickup) === cityKey(c.fromNormalized || c.from) &&
    cityKey(drop) === cityKey(c.toNormalized || c.to)
  ) || null;
}
function applyCoupon(value: number, percent: number): number { return value * (1 - percent / 100); }

function applyFestival(value: number, percent: number): number {

  return value * (1 + percent / 100);

}



function makeStrikeFare(finalFare: number): number {

  // Compatibility display reference only; not an applied discount.

  return Math.round(finalFare * 1.15);

}



const AVAILABLE_ONEWAY_CITIES = [

  "raipur", "bilaspur", "uslapur", "korba", "raigarh", "durg", "bhilai",

  "rajnandgaon", "jagdalpur", "ambikapur", "dhamtari", "mahasamund",

  "kawardha", "janjgir", "champa", "balod", "bemetara", "kanker",

  "kondagaon", "dantewada", "sukma", "bijapur", "narayanpur", "gariaband",

  "baloda bazar", "mungeli", "surajpur", "balrampur", "jashpur", "gaurela",

  "pendra", "marwahi", "gevra", "dipka", "kusmunda", "katghora",

  "chirmiri", "manendragarh", "baikunthpur", "pathalgaon", "tilda",

  "simga", "arang", "kurud", "pithora", "saraipali", "basna",

  "dongargarh", "khairagarh", "sakti", "akaltara", "naila", "pali",

  "bharatpur", "lakhanpur", "wadrafnagar", "bhopal", "indore",

  "jabalpur", "nagpur", "rourkela",

];



function isOneWayServiceAvailable(pickup: string, drop: string): boolean {

  const lowerPickup = normalize(pickup);

  const lowerDrop = normalize(drop);

  const pickupValid = AVAILABLE_ONEWAY_CITIES.some((city) => lowerPickup.includes(city));

  const dropValid = AVAILABLE_ONEWAY_CITIES.some((city) => lowerDrop.includes(city));

  return pickupValid || dropValid;

}



export function calculateLocalFare({

  vehicleType,

  packageType,

  actualHours,

  actualKilometers,

  festivalSurchargePercent = 0,
  couponDiscountPercent = 0,

}: {

  vehicleType: VehicleType;

  packageType: LocalPackageType;

  actualHours: number;

  actualKilometers: number;

  festivalSurchargePercent?: number;
  couponDiscountPercent?: number;

}): LocalFareResult {

  const packageConfig = LOCAL_PACKAGES[vehicleType][packageType || "8hr80km"];

  const safeHours = safeNumber(actualHours, packageConfig.hours);

  const safeKilometers = safeNumber(actualKilometers, packageConfig.kms);



  const extraHours = Math.max(0, Math.ceil(safeHours - packageConfig.hours));

  const extraKilometers = Math.max(0, Math.ceil(safeKilometers - packageConfig.kms));



  const extraHourCharges = extraHours * packageConfig.b2cExtraHourRate;

  const extraKmCharges = extraKilometers * packageConfig.b2cExtraKmRate;

  const b2cBase = packageConfig.b2cFare + extraHourCharges + extraKmCharges;



  const b2bExtraCharges =

    extraHours * packageConfig.b2bExtraHourRate +

    extraKilometers * packageConfig.b2bExtraKmRate;

  const b2bBase = packageConfig.b2bFare + b2bExtraCharges;



  const surcharge = safeNumber(festivalSurchargePercent);
  const couponPercent = safeNumber(couponDiscountPercent);
  const afterFestival = applyFestival(b2cBase, surcharge);
  const afterCoupon = applyCoupon(afterFestival, couponPercent);
  const finalFare = roundCustomerFare(afterCoupon);

  const finalB2B = Math.round(applyFestival(b2bBase, surcharge));



  return {

    package: packageConfig,

    packageFare: packageConfig.b2cFare,

    actualHours: safeHours,

    actualKilometers: safeKilometers,

    extraHours,

    extraKilometers,

    extraHourCharges,

    extraKmCharges,

    totalExtraCharges: extraHourCharges + extraKmCharges,

    finalFare,

    strikeFare: makeStrikeFare(finalFare),

    tollParkingExcluded: true,

    driverAllowanceIncluded: false,

    fuelIncluded: true,

    freeCancellationHours: 0,

    b2bFare: finalB2B,

    b2bExtraCharges,

    festivalSurchargePercent: surcharge,

  };

}



/* =========================================================

   MAIN FARE CALCULATION ENGINE

\========================================================= */



export function calculateFare(input: CalculateFareInput): CalculateFareResult {

  const {

    distance,

    vehicleType,

    bookingType,

    serviceType = bookingType === "local" ? "local" : "outstation",

    pickupDate = "",

    pickupTime = "",

    returnDate = "",

    returnTime = "",

    drop = "",

    pickup = "",

    localPackage = "8hr80km",

    localHours,

    localKilometers,

  } = input;



  const vehicle = VEHICLES[vehicleType];

  if (!vehicle) throw new Error(`Unsupported vehicle type: ${vehicleType}`);



  const actualOneWayKm = safeNumber(distance);

  const hubCategory = inferHubCategory(input);

  const hubPercent = HUB_PERCENTAGES[hubCategory];

  const routeClassification = inferRouteClassification(input);

  const bookingDate = input.bookingDate || pickupDate;

  const festivalRule = getApplicableFestivalRule(
    input.festivalRules, bookingType, bookingDate, pickupTime, pickup, drop,
  );
  const couponRule = getApplicableCoupon(
    input.couponRules, input.couponCode, bookingDate, pickupTime, pickup, drop,
  );
  const festivalPercent = festivalRule?.increasePercent || 0;
  const couponPercent = couponRule?.discountPercent || 0;



  const isOneWayAvailable =

    bookingType === "oneway" ? isOneWayServiceAvailable(pickup, drop) : true;



  // ---------------- LOCAL RENTAL ----------------

  if (bookingType === "local" || serviceType === "local") {

    const selectedPackage = LOCAL_PACKAGES[vehicleType][localPackage];

    const calculatedHours =

      typeof localHours === "number" ? localHours : selectedPackage.hours;

    const calculatedKilometers =

      typeof localKilometers === "number" ? localKilometers : selectedPackage.kms;



    const localFare = calculateLocalFare({

      vehicleType,

      packageType: localPackage,

      actualHours: calculatedHours,

      actualKilometers: calculatedKilometers,

      festivalSurchargePercent: festivalPercent,
      couponDiscountPercent: couponPercent,

    });



    const b2bMin = localFare.b2bFare || selectedPackage.b2bFare;

    const b2bMax = b2bMin; // Local package has a single configured vendor rate.

    const finalFare = localFare.finalFare;



    return {

      actualDistance: calculatedKilometers,

      billedDistance: calculatedKilometers,

      rateUsed: selectedPackage.b2cExtraKmRate,

      strikeFare: localFare.strikeFare,

      finalFare,

      discountPercent: couponPercent,

      durationMinutes: Math.round(calculatedHours * 60),

      haltCharges: 0,

      autoCorrectedService: "local",

      isOneWayAvailable: true,

      localFare,

      b2bMinFare: b2bMin,

      b2bMaxFare: b2bMax,

      grossProfitMin: finalFare - b2bMax,

      grossProfitMax: finalFare - b2bMin,

      festivalSurchargePercent: festivalPercent,

      appliedFestivalRule: festivalRule

        ? { id: festivalRule.id, name: festivalRule.name, increasePercent: festivalPercent }

        : null,

      appliedCoupon: couponRule ? { id: couponRule.id, code: couponRule.code, discountPercent: couponPercent } : null,
      festivalIncreaseAmount: (selectedPackage.b2cFare + localFare.totalExtraCharges) * festivalPercent / 100,
      couponDiscountAmount: localFare.couponDiscountAmount || 0,
      calculationBreakdown: [

        `${selectedPackage.label} package: ₹${selectedPackage.b2cFare}`,

        `Extra KM: ${localFare.extraKilometers} × ₹${selectedPackage.b2cExtraKmRate}`,

        `Extra hours: ${localFare.extraHours} × ₹${selectedPackage.b2cExtraHourRate}`,

        `Festival surcharge: ${festivalPercent}%`,
        `Coupon discount: ${couponPercent}% applied after festival increase`,

        "Toll, parking, permit and night halt (if applicable) are separate.",

        "Driver fooding is not included in the local package.",

      ],

    };

  }



  // ---------------- ONE WAY ----------------

  if (bookingType === "oneway") {

    const minimumBillingOneWayKm = 50;
    const fareCalculationOneWayKm = Math.max(actualOneWayKm, minimumBillingOneWayKm);
    const minimumDistanceApplied = actualOneWayKm < minimumBillingOneWayKm;

    const longDistanceBuffer =

      fareCalculationOneWayKm > ONEWAY_BUFFER_THRESHOLD_KM

        ? ONEWAY_LONG_DISTANCE_BUFFER_KM

        : 0;

    const billedOneWayKm = fareCalculationOneWayKm + longDistanceBuffer;

    const roundTripBaseKm = billedOneWayKm * 2;



    const isKorbaOdisha = routeClassification === "korba-odisha";

    const isRaipurJharsuguda = isRaipurJharsugudaRoute(pickup, drop);

    const isLongInterstate =

      routeClassification === "interstate" &&

      fareCalculationOneWayKm > ONEWAY_BUFFER_THRESHOLD_KM;



    const isShortOneWay = fareCalculationOneWayKm < 80;



    // Non-Major One-Way has its own fare formula:

    // (vehicle B2C rate × (round-trip KM + 15 extra KM))

    // + (round-trip KM × toll rate) + fixed local vehicle base fare.

    // This formula replaces the old Non-Major hub percentage calculation.

    const NON_MAJOR_EXTRA_KM = 15;

    const NON_MAJOR_TOLL_PER_KM = 2.25;



    // Short One-Way formula remains unchanged for Major and Semi-Major.

    const shortOneWayConfig: Record<

      VehicleType,

      { fixed: number; ratePerKm: number }

    > = {

      sedan: { fixed: 800, ratePerKm: 12 },

      ertiga: { fixed: 1200, ratePerKm: 15 },

      crysta: { fixed: 1600, ratePerKm: 15 },

    };



    const isNonMajorOneWay = hubCategory === "non-major" || isKorbaOdisha;

    const b2cRate = isKorbaOdisha || isLongInterstate

      ? vehicle.interstateB2CRate

      : isNonMajorOneWay

        ? vehicle.oneWayB2CRate

        : isShortOneWay

          ? shortOneWayConfig[vehicleType].ratePerKm

          : vehicle.oneWayB2CRate;

    const b2bMinRate = isKorbaOdisha || isLongInterstate

      ? vehicle.interstateB2BMinRate

      : vehicle.oneWayB2BMinRate;

    const b2bMaxRate = isKorbaOdisha || isLongInterstate

      ? vehicle.interstateB2BMaxRate

      : vehicle.oneWayB2BMaxRate;



    // Non-Major category uses the new fixed + running + toll formula.

    // For this formula, the vehicle base fare comes from shortRoundTripFixed:

    // Dzire ₹1,200, Ertiga ₹1,500, Crysta ₹2,000.

    // Raipur ↔ Jharsuguda gets a 70% customer percentage on the normal

    // One-Way formula. It does NOT use the Korba-Odisha/Non-Major formula.

    const effectiveHub = isKorbaOdisha

      ? HUB_PERCENTAGES["non-major"]

      : isRaipurJharsuguda

        ? { ...hubPercent, customer: 0.70 }

        : hubPercent;

    const shortConfig = shortOneWayConfig[vehicleType];

    const nonMajorRoundTripKm = fareCalculationOneWayKm * 2;

    const nonMajorBilledRunningKm = nonMajorRoundTripKm + NON_MAJOR_EXTRA_KM;

    const nonMajorToll = nonMajorRoundTripKm * NON_MAJOR_TOLL_PER_KM;



    const nonMajorGrossFare =

      nonMajorBilledRunningKm * b2cRate +

      nonMajorToll +

      vehicle.shortRoundTripFixed;



    // Customer is charged 70% of the calculated Non-Major gross fare.

    const NON_MAJOR_CUSTOMER_PAYABLE_PERCENT = 0.70;



    const b2cBase = isNonMajorOneWay

      ? nonMajorGrossFare * NON_MAJOR_CUSTOMER_PAYABLE_PERCENT

      : isShortOneWay

        ? (shortConfig.fixed + fareCalculationOneWayKm * shortConfig.ratePerKm) * effectiveHub.customer

        : roundTripBaseKm * b2cRate * effectiveHub.customer;



    // B2B vendor range retains the configured vendor rate and hub percentages.

    // The newly specified formula is applied to the customer/B2C fare only.

    const b2bMinBase = roundTripBaseKm * b2bMinRate * effectiveHub.vendorMin;

    const b2bMaxBase = roundTripBaseKm * b2bMaxRate * effectiveHub.vendorMax;



    const fareAfterFestival = applyFestival(b2cBase, festivalPercent);
    const fareAfterCoupon = applyCoupon(fareAfterFestival, couponPercent);
    const b2cFinal = roundCustomerFare(fareAfterCoupon);

    const b2bMinFinal = Math.round(applyFestival(b2bMinBase, festivalPercent));

    const b2bMaxFinal = Math.round(applyFestival(b2bMaxBase, festivalPercent));



    const durationMinutes = Math.round((actualOneWayKm / 50) * 60) + 30;



    return {

      actualDistance: actualOneWayKm,

      billedDistance: isNonMajorOneWay ? nonMajorBilledRunningKm : (isShortOneWay ? fareCalculationOneWayKm : billedOneWayKm),

      rateUsed: b2cRate,

      tollCharges: isNonMajorOneWay ? nonMajorToll : 0,

      strikeFare: makeStrikeFare(b2cFinal),

      finalFare: b2cFinal,

      discountPercent: couponPercent,

      durationMinutes,

      haltCharges: 0,

      autoCorrectedService: "outstation",

      isOneWayAvailable,

      b2bMinFare: b2bMinFinal,

      b2bMaxFare: b2bMaxFinal,

      grossProfitMin: b2cFinal - b2bMaxFinal,

      grossProfitMax: b2cFinal - b2bMinFinal,

      festivalSurchargePercent: festivalPercent,

      appliedFestivalRule: festivalRule

        ? { id: festivalRule.id, name: festivalRule.name, increasePercent: festivalPercent }

        : null,

      appliedCoupon: couponRule ? { id: couponRule.id, code: couponRule.code, discountPercent: couponPercent } : null,
      festivalIncreaseAmount: b2cBase * festivalPercent / 100,
      couponDiscountAmount: fareAfterFestival - fareAfterCoupon,

      routeClassification,

      hubCategory: isKorbaOdisha ? "non-major" : hubCategory,

      calculationBreakdown: [

        `Actual One-Way Distance: ${actualOneWayKm} KM`,
        ...(minimumDistanceApplied ? [`Minimum billing distance applied: ${minimumBillingOneWayKm} KM`] : []),

        `Long-distance buffer: ${longDistanceBuffer} KM`,

        `Billing One-Way Distance: ${billedOneWayKm} KM`,

        `Round Trip Base KM: ${roundTripBaseKm} KM`,

        `B2C Rate: ₹${b2cRate}/KM`,

        ...(isRaipurJharsuguda ? [

          "Specific route override: Raipur ↔ Jharsuguda",

          "Customer fare: 70% of the normal One-Way fare base; Korba-Odisha special formula is not applied.",

        ] : []),

        ...(isNonMajorOneWay ? [

          `Non-Major round-trip distance: ${nonMajorRoundTripKm} KM`,

          `Extra running distance: ${NON_MAJOR_EXTRA_KM} KM`,

          `Billed running distance: ${nonMajorBilledRunningKm} KM × ₹${b2cRate}/KM`,

          `Running charges: ₹${nonMajorBilledRunningKm * b2cRate}`,

          `Toll: ${nonMajorRoundTripKm} KM × ₹${NON_MAJOR_TOLL_PER_KM}/KM = ₹${nonMajorToll}`,

          `Local vehicle base fare: ₹${vehicle.shortRoundTripFixed}`,

          `Non-Major gross fare: ₹${nonMajorGrossFare}`,

          `Customer payable: ${NON_MAJOR_CUSTOMER_PAYABLE_PERCENT * 100}% of gross fare = ₹${nonMajorGrossFare * NON_MAJOR_CUSTOMER_PAYABLE_PERCENT}`,

          "Non-Major formula: 70% of (running charges + toll + local vehicle base fare); hub percentage is not applied.",

        ] : isShortOneWay ? [

          `Short One Way fixed charge: ₹${shortConfig.fixed}`,

          `Short One Way running: ${fareCalculationOneWayKm} KM × ₹${shortConfig.ratePerKm}/KM (one-side distance)`,

          `Short One Way customer hub percentage: ${effectiveHub.customer * 100}% applied to fixed + one-side running subtotal.`,

        ] : [

          `Customer hub percentage: ${effectiveHub.customer * 100}%`,

        ]),

        `Vendor rate range: ₹${b2bMinRate}–₹${b2bMaxRate}/KM`,

        `Vendor hub percentage: ${effectiveHub.vendorMin * 100}%–${effectiveHub.vendorMax * 100}%`,

        `Festival surcharge: ${festivalPercent}%`,
        `Coupon discount: ${couponPercent}% applied after festival increase`,
        `Coupon discount amount: ₹${fareAfterFestival - fareAfterCoupon}`,

        ...(isNonMajorOneWay ? ["Toll is included in the Non-Major formula above."] : ["Toll is separate."]),

      ],

    };

  }



  // ---------------- ROUND TRIP ----------------

  // Finalized Round Trip rules:
  // - <= 80 KM one-way: short-distance special (80 KM is inclusive).
  // - Same-day: dynamic 20-30 KM buffer, maximum 50 KM.
  // - Multi-day: fixed 50 KM route buffer, applied once.
  // - Intermediate days: minimum 50 KM running per day.
  // - Day halt: intermediate days only.
  // - Night halt: <= 200 KM one-way ₹500; > 200 KM ₹1,000 per night.
  // - Toll and driver fooding are separate.
  // - Driver fooding is charged per travel day at the supplied admin rate.

  const SHORT_DISTANCE_LIMIT_KM = 80;
  const MIN_SAME_DAY_BUFFER_KM = 20;
  const MAX_SAME_DAY_BUFFER_KM = 50;
  const MULTI_DAY_ROUTE_BUFFER_KM = 50;
  const MIN_INTERMEDIATE_DAILY_KM = 50;

  const NIGHT_HALT_DISTANCE_LIMIT_KM = 200;
  const NIGHT_HALT_SHORT_RATE = 500;
  const NIGHT_HALT_LONG_RATE = 1000;

  const actualRoundTripKm = actualOneWayKm * 2;

  const getCalendarDayDifference = (
    startDate: string,
    endDate: string,
  ): number => {
    if (!startDate || !endDate) return 0;

    const startParts = startDate.split("-").map(Number);
    const endParts = endDate.split("-").map(Number);

    if (
      startParts.length !== 3 ||
      endParts.length !== 3 ||
      [...startParts, ...endParts].some((part) => !Number.isFinite(part))
    ) {
      return 0;
    }

    const startUtc = Date.UTC(
      startParts[0],
      startParts[1] - 1,
      startParts[2],
    );
    const endUtc = Date.UTC(
      endParts[0],
      endParts[1] - 1,
      endParts[2],
    );

    return Math.max(
      0,
      Math.round((endUtc - startUtc) / 86_400_000),
    );
  };

  const dateDifference = getCalendarDayDifference(
    pickupDate,
    returnDate,
  );

  const intermediateDays =
    input.intermediateDayCount !== undefined
      ? Math.floor(safeNumber(input.intermediateDayCount))
      : Math.max(0, dateDifference - 1);

  const nights =
    input.nightCount !== undefined
      ? Math.floor(safeNumber(input.nightCount))
      : dateDifference;

  const isMultiDay =
    dateDifference > 0 || intermediateDays > 0 || nights > 0;

  // Calendar travel days include both pickup and return dates.
  // If dates are unavailable, use the supplied stay counts.
  const travelDays = isMultiDay
    ? Math.max(1, dateDifference > 0
        ? dateDifference + 1
        : intermediateDays + nights + 1)
    : 1;

  const intermediateDailyActualKm = safeNumber(
    input.intermediateDailyKm,
    MIN_INTERMEDIATE_DAILY_KM,
  );

  const intermediateDailyChargeableKm = Math.max(
    MIN_INTERMEDIATE_DAILY_KM,
    intermediateDailyActualKm,
  );

  const intermediateRunningKm =
    intermediateDays * intermediateDailyChargeableKm;

  const dayHaltRate = vehicle.shortRoundTripFixed;
  const dayHaltCharges = intermediateDays * dayHaltRate;

  const nightHaltRate =
    actualOneWayKm <= NIGHT_HALT_DISTANCE_LIMIT_KM
      ? NIGHT_HALT_SHORT_RATE
      : NIGHT_HALT_LONG_RATE;

  const nightHaltCharges = nights * nightHaltRate;
  const haltCharges = dayHaltCharges + nightHaltCharges;

  const driverFoodingPerDay = safeNumber(
    input.driverFoodingPerDay,
    0,
  );
  const driverFooding = travelDays * driverFoodingPerDay;

  let billedDistance = actualRoundTripKm;
  let runningFare = 0;
  let rateUsed = vehicle.roundTripRate;
  let routeNote = "";
  const breakdown: string[] = [];

  if (actualOneWayKm <= SHORT_DISTANCE_LIMIT_KM) {
    // Short-distance special running on the actual outbound + return route.
    // Intermediate-day running, when applicable, uses the standard RT rate.
    const shortDistanceRunningFare =
      actualRoundTripKm * vehicle.shortRoundTripRate;

    const intermediateRunningFare =
      intermediateRunningKm * vehicle.roundTripRate;

    const multiDayBufferKm = isMultiDay
      ? MULTI_DAY_ROUTE_BUFFER_KM
      : 0;

    const multiDayBufferFare =
      multiDayBufferKm * vehicle.roundTripRate;

    billedDistance =
      actualRoundTripKm +
      intermediateRunningKm +
      multiDayBufferKm;

    runningFare =
      vehicle.shortRoundTripFixed +
      shortDistanceRunningFare +
      intermediateRunningFare +
      multiDayBufferFare;

    rateUsed = vehicle.shortRoundTripRate;
    routeNote = isMultiDay
      ? "Short-distance multi-day round trip"
      : "Short-distance same-day round trip";

    breakdown.push(
      `Short-distance fixed charge: ₹${vehicle.shortRoundTripFixed}`,
      `Actual outbound + return: ${actualRoundTripKm} KM × ₹${vehicle.shortRoundTripRate}/KM`,
      `Intermediate days: ${intermediateDays}`,
      `Intermediate daily actual KM: ${intermediateDailyActualKm} KM`,
      `Intermediate daily chargeable KM: ${intermediateDailyChargeableKm} KM`,
      `Intermediate running: ${intermediateRunningKm} KM × ₹${vehicle.roundTripRate}/KM`,
      ...(isMultiDay
        ? [
            `Fixed multi-day route buffer: ${multiDayBufferKm} KM × ₹${vehicle.roundTripRate}/KM`,
          ]
        : ["No additional KM buffer for the short-distance same-day special."]),
    );
  } else if (isMultiDay) {
    // Multi-day: apply the 50 KM route buffer once to the outbound + return
    // route distance. Add each intermediate day's chargeable running KM.
    billedDistance =
      actualRoundTripKm +
      MULTI_DAY_ROUTE_BUFFER_KM +
      intermediateRunningKm;

    runningFare = billedDistance * vehicle.roundTripRate;
    rateUsed = vehicle.roundTripRate;
    routeNote = "Multi-day round trip";

    breakdown.push(
      `Actual outbound + return distance: ${actualRoundTripKm} KM`,
      `Fixed multi-day route buffer: ${MULTI_DAY_ROUTE_BUFFER_KM} KM`,
      `Intermediate days: ${intermediateDays}`,
      `Intermediate daily actual KM: ${intermediateDailyActualKm} KM`,
      `Intermediate daily minimum chargeable KM: ${intermediateDailyChargeableKm} KM`,
      `Total intermediate running: ${intermediateRunningKm} KM`,
      `Total chargeable running: ${billedDistance} KM`,
      `Running rate: ₹${vehicle.roundTripRate}/KM`,
    );
  } else {
    // Same-day: caller may provide the dynamic buffer.
    const requestedBuffer =
      input.roundTripBufferKm === undefined
        ? DEFAULT_SAME_DAY_BUFFER_KM
        : safeNumber(input.roundTripBufferKm);

    const boundedBuffer = Math.min(
      MAX_SAME_DAY_BUFFER_KM,
      Math.max(MIN_SAME_DAY_BUFFER_KM, requestedBuffer),
    );

    billedDistance = actualRoundTripKm + boundedBuffer;
    runningFare = billedDistance * vehicle.roundTripRate;
    rateUsed = vehicle.roundTripRate;
    routeNote = "Same-day round trip";

    breakdown.push(
      `Actual round-trip distance: ${actualRoundTripKm} KM`,
      `Dynamic same-day buffer: ${boundedBuffer} KM`,
      `Total chargeable running: ${billedDistance} KM`,
      `Running rate: ₹${vehicle.roundTripRate}/KM`,
      "No day halt or night halt for same-day return.",
    );
  }

  // Toll is separate for every Round Trip type.
  const tollCharges = billedDistance * TOLL_PER_KM;

  const rawFare =
    runningFare +
    tollCharges +
    haltCharges +
    driverFooding;

  const fareAfterFestival = applyFestival(rawFare, festivalPercent);
  const fareAfterCoupon = applyCoupon(fareAfterFestival, couponPercent);
  const b2cFinal = roundCustomerFare(fareAfterCoupon);

  breakdown.push(
    `Running fare: ₹${runningFare}`,
    `Toll: ${billedDistance} KM × ₹${TOLL_PER_KM}/KM = ₹${tollCharges}`,
    `Day halt: ${intermediateDays} × ₹${dayHaltRate} = ₹${dayHaltCharges}`,
    `Night halt: ${nights} × ₹${nightHaltRate} = ₹${nightHaltCharges}`,
    `Driver fooding: ${travelDays} days × ₹${driverFoodingPerDay} = ₹${driverFooding}`,
    `Subtotal before festival: ₹${rawFare}`,
    `Festival surcharge: ${festivalPercent}%`,
    `Fare after festival: ₹${fareAfterFestival}`,
    `Coupon discount: ${couponPercent}% = ₹${fareAfterFestival - fareAfterCoupon}`,
    `Final fare rounded to nearest ₹100: ₹${b2cFinal}`,
  );

  return {
    actualDistance: actualRoundTripKm,
    billedDistance,
    rateUsed,
    strikeFare: makeStrikeFare(b2cFinal),
    finalFare: b2cFinal,
    discountPercent: couponPercent,
    durationMinutes: Math.round((billedDistance / 50) * 60) + 30,
    haltCharges,
    autoCorrectedService: "outstation",
    isOneWayAvailable: true,
    tollCharges,
    driverFooding,
    festivalSurchargePercent: festivalPercent,
    appliedFestivalRule: festivalRule
      ? {
          id: festivalRule.id,
          name: festivalRule.name,
          increasePercent: festivalPercent,
        }
      : null,
    appliedCoupon: couponRule ? { id: couponRule.id, code: couponRule.code, discountPercent: couponPercent } : null,
    festivalIncreaseAmount: rawFare * festivalPercent / 100,
    couponDiscountAmount: fareAfterFestival - fareAfterCoupon,
    calculationBreakdown: [
      routeNote,
      ...breakdown,
      "Toll and driver fooding are separate charges.",
      "B2B Round Trip rates are not configured in this fare engine.",
    ],
  };
}



/* =========================================================

   LEGACY / HELPER EXPORTS

\========================================================= */



/** @deprecated Use explicit hubCategory in calculateFare input. */

export function isPopularHub(dropLocation: string): boolean {

  const normalized = normalize(dropLocation);

  const majorOrKnownHubs = [

    "bilaspur", "uslapur", "raipur", "durg", "korba", "raigarh",

    "bhilai", "jharsuguda", "jagdalpur", "sambalpur", "ambikapur",

  ];

  return majorOrKnownHubs.some((hub) => normalized.includes(hub));

}



/** @deprecated Kept for old imports; service coverage should be configured centrally. */

export function isOneWayServiceAvailableLegacy(

  pickupLocation: string,

  dropLocation: string,

): boolean {

  return isOneWayServiceAvailable(pickupLocation, dropLocation);

}

/* =========================================================

KHATU RIDES – CENTRAL FARE ENGINE

Replacement for the previous fare-calculation module.

Business rules implemented:

- One Way: round-trip base KM, hub percentages, route overrides.

- Long One Way: +25 KM only when the existing >500 KM rule applies.

- KR-700+: for actual interstate one-way distance >700 KM (701+), B2C rates are Dzire ₹13/KM, Ertiga ₹18/KM, Crysta ₹22/KM. Existing >500 KM to 700 KM rates, B2B rates and Korba–Odisha special rates are preserved.

- KR-SHARED: door-to-door shared taxi fare is 35% of the same route's private one-way customer fare per passenger, with four fixed daily departure slots (06:00, 08:00, 16:00, 18:00) and locked booking/cancellation policy metadata.

- Local 20 KM Point-to-Point / Airport Transfer module is on hold and is not added to this fare engine.

- Round Trip: same-day, under-80 KM, multi-day and

Bilaspur–Raipur route-specific override.

- Local Rental: approved package + extra KM + extra hours + pickup-time night surcharge.

- B2C: 10% base-fare discount before applicable pickup-time night surcharge.
- Festival: both B2C and B2B; highest eligible percentage only.

Important:

- Toll is separate unless the specific rule says otherwise.

- Multi-day round-trip running rates are toll-inclusive.

- One Way and Local Rental: 20% customer night surcharge for pickup 21:00–05:59,
  calculated after the 10% B2C base-fare discount. Round Trip night-halt rules remain unchanged.

- This module calculates fares only. It does not write to Firebase.

//========================================================= */

export type VehicleType = "sedan" | "ertiga" | "crysta";

/** "shared" is KR-SHARED; "local" remains the pre-existing hourly/package rental. */
export type BookingType = "oneway" | "roundtrip" | "local" | "shared";

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

/** KR-700+: dedicated B2C rate for interstate one-way routes above 700 KM. */
kr700PlusB2CRate?: number;

/** Dedicated legacy rate for the Korba–Odisha special route. */
korbaOdishaB2CRate?: number;

interstateB2BMinRate: number;

interstateB2BMaxRate: number;

/** Dedicated vendor range for the Korba–Odisha special route. */
korbaOdishaB2BMinRate?: number;

korbaOdishaB2BMaxRate?: number;

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

oneWayB2CRate: 11,

oneWayB2BMinRate: 9,

oneWayB2BMaxRate: 10,

interstateB2CRate: 12,

kr700PlusB2CRate: 11.5,

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

oneWayB2CRate: 15,

oneWayB2BMinRate: 11,

oneWayB2BMaxRate: 12,

interstateB2CRate: 20.5,

kr700PlusB2CRate: 19.75,

korbaOdishaB2CRate: 19,

interstateB2BMinRate: 16,

interstateB2BMaxRate: 17,

korbaOdishaB2BMinRate: 16,

korbaOdishaB2BMaxRate: 17,

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

oneWayB2CRate: 17.5,

oneWayB2BMinRate: 14,

oneWayB2BMaxRate: 15,

interstateB2CRate: 26,

kr700PlusB2CRate: 24.5,

korbaOdishaB2CRate: 22,

interstateB2BMinRate: 19,

interstateB2BMaxRate: 20,

korbaOdishaB2BMinRate: 19,

korbaOdishaB2BMaxRate: 20,

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

nightSurchargePercent?: number;

nightSurchargeAmount?: number;

couponDiscountPercent?: number;

couponDiscountAmount?: number;
baseDiscountPercent?: number;
baseDiscountAmount?: number;

}

export interface SharedTaxiPolicyResult {
  model: "KR-SHARED";
  onlineBookingRequired: true;
  minimumAdvanceBookingDays: 7;
  seatConfirmationHoursBefore: 48;
  minimumSeatsPerDeparture: 2;
  operatorCancellationRefundPercent: 100;
  luggageAllowancePerPassenger: 1;
  pickupMode: "door-to-door";
  dropMode: "door-to-door";
  fleetSource: "vendor-network";
  departurePeriods: ["morning", "evening"];
  departureTimes: ["06:00", "08:00", "16:00", "18:00"];
  selectedDepartureTime: string;
  departureTimeEligible: boolean;
  fixedDailySchedule: true;
  exactDepartureTimesFinalized: true;
  supportedDirectionalRoutes: string[];
  routeEligible: boolean;
  advanceBookingEligible: boolean | null;
  bookingEligible: boolean | null;
  bookedSeats?: number;
  operatorCancellationAllowed: boolean | null;
  refundPercent: number;
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

/** KR-SHARED: 35% of private One-Way fare, less the public 10% shared discount. */
sharedPerPersonFare?: number;
sharedBasePerPersonFare?: number;
sharedDiscountPercent?: number;
sharedDiscountAmount?: number;
sharedPrivateOneWayFare?: number;
sharedPassengerCount?: number;
sharedTotalFare?: number;
sharedPolicy?: SharedTaxiPolicyResult;

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

nightSurchargePercent?: number;

nightSurchargeAmount?: number;

appliedFestivalRule?: { id: string; name: string; increasePercent: number } | null;

appliedCoupon?: { id: string; code: string; discountPercent: number } | null;

festivalIncreaseAmount?: number;

couponDiscountAmount?: number;

baseDiscountPercent?: number;

baseDiscountAmount?: number;

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

  // KR-SHARED inputs. Optional for compatibility with all existing callers.
  sharedPassengerCount?: number;
  /** Total seats booked across this departure, used for the 2-seat cancellation rule. */
  sharedBookedSeats?: number;
  /** KR-SHARED fixed departure slot: 06:00, 08:00, 16:00 or 18:00. */
  sharedDepartureTime?: "06:00" | "08:00" | "16:00" | "18:00" | string;

}

const HUB_PERCENTAGES: Record<

HubCategory,

{ customer: number; vendorMin: number; vendorMax: number }

> = {

major: { customer: 0.75, vendorMin: 0.6, vendorMax: 0.6 },

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

/** Calendar-day difference using YYYY-MM-DD values, independent of local DST. */
function calendarDaysBetween(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) return null;
  const start = /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate.split("-").map(Number) : [];
  const end = /^\d{4}-\d{2}-\d{2}$/.test(endDate) ? endDate.split("-").map(Number) : [];
  if (start.length !== 3 || end.length !== 3) return null;
  const startUtc = Date.UTC(start[0], start[1] - 1, start[2]);
  const endUtc = Date.UTC(end[0], end[1] - 1, end[2]);
  if (!Number.isFinite(startUtc) || !Number.isFinite(endUtc)) return null;
  return Math.round((endUtc - startUtc) / 86_400_000);
}

const KR_SHARED_HUBS = ["korba", "bilaspur", "raipur"] as const;
const KR_SHARED_MIN_ADVANCE_DAYS = 7;
const KR_SHARED_SEAT_CONFIRMATION_HOURS = 48;
const KR_SHARED_MINIMUM_SEATS = 2;
const KR_SHARED_REFUND_PERCENT = 100;
const KR_SHARED_PRIVATE_FARE_PERCENT = 60;
const KR_SHARED_DEPARTURE_TIMES = ["06:00", "08:00", "16:00", "18:00"] as const;

/** Resolve an approved shared-taxi hub from a full address or city string. */
function getKrSharedHub(value: string): (typeof KR_SHARED_HUBS)[number] | null {
  const normalized = normalize(value);
  return KR_SHARED_HUBS.find((hub) => normalized.includes(hub)) || null;
}

/** Shared Taxi is limited to the six directions between its three locked hubs. */
function getKrSharedDirectionalRoute(pickup: string, drop: string): string | null {
  const from = getKrSharedHub(pickup);
  const to = getKrSharedHub(drop);
  if (!from || !to || from === to) return null;
  return `${from} → ${to}`;
}


/**

 * Night surcharge applies to customer fare when pickup is from 21:00

 * through 05:59 (inclusive). Uses the booking pickup time.

 */

const BASE_FARE_DISCOUNT_PERCENT = 10;
const NIGHT_SURCHARGE_PERCENT = 20;

function applyBaseFareDiscount(value: number): number {
  return value * (1 - BASE_FARE_DISCOUNT_PERCENT / 100);
}

function getNightSurchargePercent(pickupTime: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec((pickupTime || "").trim());

  if (!match) return 0;

  const hours = Number(match[1]);

  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return 0;

  return hours >= 21 || hours < 6 ? NIGHT_SURCHARGE_PERCENT : 0;

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
  "bargarh", "rourkela", "sundargarh", "bhubaneswar",
  "cuttack", "berhampur", "koraput", "keonjhar", "angul", "talcher",
];

/**
 * Out-of-Chhattisgarh city hints are needed because Google Places often
 * returns only a city name or a short address without the state name.
 */
const OTHER_STATE_CITY_HINTS = [
  // Madhya Pradesh
  "bhopal", "indore", "jabalpur", "gwalior", "ujjain", "sagar", "rewa",
  "satna", "katni", "chhindwara", "burhanpur", "khandwa", "dewas", "ratlam",
  // Maharashtra
  "nagpur", "mumbai", "pune", "nashik", "amravati", "wardha", "akola",
  "chandrapur", "gondia", "yavatmal", "aurangabad", "sambhajinagar",
  // Telangana / Andhra Pradesh
  "hyderabad", "warangal", "karimnagar", "nizamabad", "vijayawada", "visakhapatnam",
  // Jharkhand / Uttar Pradesh / Bihar
  "ranchi", "jamshedpur", "dhanbad", "bokaro", "varanasi", "prayagraj",
  "allahabad", "lucknow", "kanpur", "patna", "gaya", "muzaffarpur",
  // Other nearby states
  "kolkata", "howrah", "bhubaneswar", "cuttack", "jaipur", "delhi",
];

const OTHER_STATE_NAME_HINTS = [
  "madhya pradesh", "maharashtra", "telangana", "andhra pradesh",
  "jharkhand", "uttar pradesh", "bihar", "west bengal", "rajasthan",
  "gujarat", "goa", "karnataka", "kerala", "tamil nadu", "punjab",
  "haryana", "uttarakhand", "himachal pradesh", "assam", "meghalaya",
  "manipur", "mizoram", "nagaland", "tripura", "sikkim", "arunachal pradesh",
  "delhi", "jammu and kashmir", "ladakh", "puducherry", "chandigarh",
];

export function inferRouteClassification(
  input: Pick<CalculateFareInput, "pickup" | "drop" | "routeClassification" | "isInterstate" | "isKorbaOriginOdisha">
): RouteClassification {
  if (input.routeClassification) return input.routeClassification;

  const pickup = normalize(input.pickup || "");
  const drop = normalize(input.drop || "");
  const routeText = `${pickup} ${drop}`;

  if (input.isKorbaOriginOdisha) return "korba-odisha";

  const pickupIsKorba = pickup.includes("korba");
  const dropIsKorba = drop.includes("korba");
  const pickupIsOdisha = ODISHA_PLACE_HINTS.some((place) => pickup.includes(place));
  const dropIsOdisha = ODISHA_PLACE_HINTS.some((place) => drop.includes(place));

  // Preserve the dedicated Korba–Odisha pricing in both directions.
  if ((pickupIsKorba && dropIsOdisha) || (dropIsKorba && pickupIsOdisha)) {
    return "korba-odisha";
  }

  // An explicit classification supplied by the caller takes precedence.
  if (typeof input.isInterstate === "boolean") {
    return input.isInterstate ? "interstate" : "domestic";
  }

  const hasCg = /\b(chhattisgarh|chattisgarh|cg)\b/.test(routeText);
  const hasOtherState = OTHER_STATE_NAME_HINTS.some((state) => routeText.includes(state)) ||
    /\b(odisha|orissa|mp|mh|ts|jh|up|br|wb|rj|gj|ga|ka|kl|tn|ap|pb|hr|uk|hp|as|dl)\b/.test(routeText);
  const hasOutsideCgCity = OTHER_STATE_CITY_HINTS.some((city) => routeText.includes(city));

  // Google Places may return a city only, a city + state, or a full address.
  // Any recognized non-Chhattisgarh state/city is treated as Interstate.
  if (pickupIsOdisha || dropIsOdisha || hasOutsideCgCity || hasOtherState || (hasCg && hasOtherState)) {
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

'uslapur',

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

const safeTime = /^\d{2}:\d{2}$/.test(time) ? time : "00:00";

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

nightSurchargePercent = 0,

}: {

vehicleType: VehicleType;

packageType: LocalPackageType;

actualHours: number;

actualKilometers: number;

festivalSurchargePercent?: number;

couponDiscountPercent?: number;

nightSurchargePercent?: number;

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

const nightPercent = safeNumber(nightSurchargePercent);

const baseDiscountAmount = b2cBase * BASE_FARE_DISCOUNT_PERCENT / 100;
const discountedBase = applyBaseFareDiscount(b2cBase);
const nightAmount = discountedBase * nightPercent / 100;
const afterNight = discountedBase + nightAmount;

const afterFestival = applyFestival(afterNight, surcharge);

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

nightSurchargePercent: nightPercent,

nightSurchargeAmount: nightAmount,
baseDiscountPercent: BASE_FARE_DISCOUNT_PERCENT,
baseDiscountAmount,
couponDiscountAmount: afterFestival - afterCoupon,

};

}

/* =========================================================

MAIN FARE CALCULATION ENGINE

//========================================================= */

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

const nightPercent =

  bookingType === "oneway" || bookingType === "local"

    ? getNightSurchargePercent(pickupTime)

    : 0;

const isOneWayAvailable =

bookingType === "oneway" ? isOneWayServiceAvailable(pickup, drop) : true;

// ---------------- KR-SHARED DOOR-TO-DOOR ----------------
if (bookingType === "shared") {
  const sharedRoute = getKrSharedDirectionalRoute(pickup, drop);
  const routeEligible = !!sharedRoute;
  const advanceDays = calendarDaysBetween(input.bookingDate || "", pickupDate);
  const advanceBookingEligible =
    advanceDays === null ? null : advanceDays >= KR_SHARED_MIN_ADVANCE_DAYS;
  const selectedDepartureTime = String(input.sharedDepartureTime || pickupTime || "").trim();
  const departureTimeEligible = (KR_SHARED_DEPARTURE_TIMES as readonly string[]).includes(selectedDepartureTime);

  // Shared fare = 35% of the same route's private One-Way customer fare.
  // Reuse the existing One-Way engine so the existing hub, interstate,
  // toll, buffer, discount, night and promotion rules remain authoritative.
  // No held Local 20-KM Point-to-Point logic is invoked here.
  const privateFare = calculateFare({
    ...input,
    bookingType: "oneway",
    serviceType: "outstation",
  });

  const privateOneWayFare = privateFare.finalFare;
  const sharedBasePerPersonFare = Math.round(
    privateOneWayFare * KR_SHARED_PRIVATE_FARE_PERCENT / 100,
  );
  // Public KR-SHARED promotion: an additional 10% off the 35% shared base fare.
  const sharedDiscountPercent = 10;
  const perPersonFare = Math.round(
    sharedBasePerPersonFare * (1 - sharedDiscountPercent / 100),
  );
  const sharedDiscountAmount = sharedBasePerPersonFare - perPersonFare;
  const passengerCount = Math.max(
    1,
    Math.floor(safeNumber(input.sharedPassengerCount, 1)),
  );
  const totalFare = perPersonFare * passengerCount;
  const bookedSeats =
    input.sharedBookedSeats === undefined
      ? undefined
      : Math.floor(safeNumber(input.sharedBookedSeats));
  const cancellationAllowed =
    bookedSeats === undefined ? null : bookedSeats < KR_SHARED_MINIMUM_SEATS;
  const bookingEligible =
    !routeEligible || !privateFare.isOneWayAvailable || !departureTimeEligible
      ? false
      : advanceBookingEligible === null
        ? null
        : advanceBookingEligible;

  const sharedPolicy: SharedTaxiPolicyResult = {
    model: "KR-SHARED",
    onlineBookingRequired: true,
    minimumAdvanceBookingDays: KR_SHARED_MIN_ADVANCE_DAYS,
    seatConfirmationHoursBefore: KR_SHARED_SEAT_CONFIRMATION_HOURS,
    minimumSeatsPerDeparture: KR_SHARED_MINIMUM_SEATS,
    operatorCancellationRefundPercent: KR_SHARED_REFUND_PERCENT,
    luggageAllowancePerPassenger: 1,
    pickupMode: "door-to-door",
    dropMode: "door-to-door",
    fleetSource: "vendor-network",
    departurePeriods: ["morning", "evening"],
    departureTimes: [...KR_SHARED_DEPARTURE_TIMES],
    selectedDepartureTime,
    departureTimeEligible,
    fixedDailySchedule: true,
    exactDepartureTimesFinalized: true,
    supportedDirectionalRoutes: [
      "Korba → Bilaspur",
      "Bilaspur → Korba",
      "Korba → Raipur",
      "Raipur → Korba",
      "Bilaspur → Raipur",
      "Raipur → Bilaspur",
    ],
    routeEligible,
    advanceBookingEligible,
    bookingEligible,
    bookedSeats,
    operatorCancellationAllowed: cancellationAllowed,
    refundPercent: cancellationAllowed ? KR_SHARED_REFUND_PERCENT : 0,
  };

  const sharedBreakdown = [
    `KR-SHARED Door-to-Door route: ${sharedRoute || "Unsupported route"}`,
    `Private One-Way customer fare: ₹${privateOneWayFare}`,
    `Shared fare rule: ${KR_SHARED_PRIVATE_FARE_PERCENT}% of private One-Way fare per passenger`,
    `Selected daily departure: ${selectedDepartureTime || "Not selected"}${departureTimeEligible ? "" : " (invalid or not selected)"}`,
    `Shared base fare per passenger (35% of private fare): ₹${sharedBasePerPersonFare}`,
    `Public shared discount (${sharedDiscountPercent}%): -₹${sharedDiscountAmount} per passenger`,
    `Final Shared Taxi fare per passenger: ₹${perPersonFare}`,
    `Passenger count in this booking: ${passengerCount}`,
    `Total booking fare: ₹${totalFare}`,
    `Online booking required; minimum ${KR_SHARED_MIN_ADVANCE_DAYS} days advance booking.`,
    `Seat confirmation is scheduled ${KR_SHARED_SEAT_CONFIRMATION_HOURS} hours before journey.`,
    `Minimum ${KR_SHARED_MINIMUM_SEATS} booked seats per departure; below this, operator may cancel with ${KR_SHARED_REFUND_PERCENT}% refund.`,
    "One luggage item is allowed per passenger.",
    "Door-to-door pickup and drop within the defined city service limits.",
    "Vendor-network cab allocation; fixed daily departure slots: 06:00 AM, 08:00 AM, 04:00 PM and 06:00 PM.",
    ...(advanceDays === null
      ? ["Advance-booking eligibility: not evaluated because bookingDate or pickupDate is missing."]
      : [`Advance-booking lead time: ${advanceDays} day(s); ${advanceBookingEligible ? "eligible" : "not eligible"}.`]),
  ];

  return {
    actualDistance: actualOneWayKm,
    billedDistance: privateFare.billedDistance,
    rateUsed: privateFare.rateUsed,
    strikeFare: makeStrikeFare(sharedBasePerPersonFare * passengerCount),
    finalFare: totalFare,
    discountPercent: sharedDiscountPercent,
    durationMinutes: privateFare.durationMinutes,
    haltCharges: 0,
    autoCorrectedService: "outstation",
    isOneWayAvailable: bookingEligible === true && routeEligible && privateFare.isOneWayAvailable,
    sharedPerPersonFare: perPersonFare,
    sharedBasePerPersonFare,
    sharedDiscountPercent,
    sharedDiscountAmount: sharedDiscountAmount * passengerCount,
    sharedPrivateOneWayFare: privateOneWayFare,
    sharedPassengerCount: passengerCount,
    sharedTotalFare: totalFare,
    sharedPolicy,
    festivalSurchargePercent: privateFare.festivalSurchargePercent,
    nightSurchargePercent: privateFare.nightSurchargePercent,
    nightSurchargeAmount: privateFare.nightSurchargeAmount,
    appliedFestivalRule: privateFare.appliedFestivalRule,
    appliedCoupon: privateFare.appliedCoupon,
    festivalIncreaseAmount: privateFare.festivalIncreaseAmount,
    couponDiscountAmount: privateFare.couponDiscountAmount,
    baseDiscountPercent: sharedDiscountPercent,
    baseDiscountAmount: sharedDiscountAmount * passengerCount,
    routeClassification: privateFare.routeClassification,
    hubCategory: privateFare.hubCategory,
    calculationBreakdown: sharedBreakdown,
  };
}

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

nightSurchargePercent: nightPercent,

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

nightSurchargePercent: nightPercent,

nightSurchargeAmount: localFare.nightSurchargeAmount || 0,

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

`Night surcharge: ${nightPercent}% = ₹${localFare.nightSurchargeAmount || 0}`,

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

// KR-700+ is a separate customer-rate tier. It starts only when the
// actual one-side interstate distance is greater than 700 KM (701+).
// Existing >500 KM long-distance buffer and B2B logic are unchanged.
const isKr700PlusInterstate =
  routeClassification === "interstate" &&
  actualOneWayKm > 700;

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

const b2cRate = isKorbaOdisha

? (vehicle.korbaOdishaB2CRate ?? vehicle.interstateB2CRate)

: isKr700PlusInterstate

? (vehicle.kr700PlusB2CRate ?? vehicle.interstateB2CRate)

: isLongInterstate

? vehicle.interstateB2CRate

: isNonMajorOneWay

? vehicle.oneWayB2CRate

: isShortOneWay

? shortOneWayConfig[vehicleType].ratePerKm

: vehicle.oneWayB2CRate;

const b2bMinRate = isKorbaOdisha

? (vehicle.korbaOdishaB2BMinRate ?? vehicle.interstateB2BMinRate)

: isLongInterstate

? vehicle.interstateB2BMinRate

: vehicle.oneWayB2BMinRate;

const b2bMaxRate = isKorbaOdisha

? (vehicle.korbaOdishaB2BMaxRate ?? vehicle.interstateB2BMaxRate)

: isLongInterstate

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

// The 10% base discount is available only when the actual one-side route is 70 KM or more.
// Do not use minimum billed KM or long-distance buffer for this eligibility check.
const baseDiscountEligible = actualOneWayKm >= 70;
const baseDiscountPercent = baseDiscountEligible ? BASE_FARE_DISCOUNT_PERCENT : 0;
const baseDiscountAmount = baseDiscountEligible ? b2cBase * BASE_FARE_DISCOUNT_PERCENT / 100 : 0;
const discountedBaseFare = baseDiscountEligible ? applyBaseFareDiscount(b2cBase) : b2cBase;
const nightSurchargeAmount = discountedBaseFare * nightPercent / 100;
const fareAfterNight = discountedBaseFare + nightSurchargeAmount;

const fareAfterFestival = applyFestival(fareAfterNight, festivalPercent);

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

nightSurchargePercent: nightPercent,

nightSurchargeAmount,

appliedFestivalRule: festivalRule

? { id: festivalRule.id, name: festivalRule.name, increasePercent: festivalPercent }

: null,

appliedCoupon: couponRule ? { id: couponRule.id, code: couponRule.code, discountPercent: couponPercent } : null,

festivalIncreaseAmount: b2cBase * festivalPercent / 100,

couponDiscountAmount: fareAfterFestival - fareAfterCoupon,
baseDiscountPercent,
baseDiscountAmount,

routeClassification,

hubCategory: isKorbaOdisha ? "non-major" : hubCategory,

calculationBreakdown: [

`Actual One-Way Distance: ${actualOneWayKm} KM`,

...(minimumDistanceApplied ? [`Minimum billing distance applied: ${minimumBillingOneWayKm} KM`] : []),

`Long-distance buffer: ${longDistanceBuffer} KM`,

`Billing One-Way Distance: ${billedOneWayKm} KM`,

`Round Trip Base KM: ${roundTripBaseKm} KM`,

`Route Classification: ${routeClassification}`,
`Hub Category: ${hubCategory}`,
`B2C Rate Applied: ₹${b2cRate}/KM`,
...(isKr700PlusInterstate ? ["KR-700+ tier applied: actual interstate one-way distance is above 700 KM."] : []),
...(baseDiscountEligible ? [`Base fare discount: ${BASE_FARE_DISCOUNT_PERCENT}% = ₹${baseDiscountAmount}`] : ["Base fare discount: Not eligible below 70 KM actual one-side distance."]),
`Discounted base fare: ₹${discountedBaseFare}`,
`Night surcharge: ${nightPercent}% = ₹${nightSurchargeAmount}`,

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

const baseDiscountAmount = rawFare * BASE_FARE_DISCOUNT_PERCENT / 100;
const discountedBaseFare = applyBaseFareDiscount(rawFare);
// Round Trip pickup-time night surcharge remains disabled by the existing booking-type rule.
const nightSurchargeAmount = discountedBaseFare * nightPercent / 100;
const fareAfterNight = discountedBaseFare + nightSurchargeAmount;
const fareAfterFestival = applyFestival(fareAfterNight, festivalPercent);

const fareAfterCoupon = applyCoupon(fareAfterFestival, couponPercent);

const b2cFinal = roundCustomerFare(fareAfterCoupon);

breakdown.push(

`Running fare: ₹${runningFare}`,

`Toll: ${billedDistance} KM × ₹${TOLL_PER_KM}/KM = ₹${tollCharges}`,

`Day halt: ${intermediateDays} × ₹${dayHaltRate} = ₹${dayHaltCharges}`,

`Night halt: ${nights} × ₹${nightHaltRate} = ₹${nightHaltCharges}`,

`Driver fooding: ${travelDays} days × ₹${driverFoodingPerDay} = ₹${driverFooding}`,

`Subtotal before discount: ₹${rawFare}`,
`Base fare discount: ${BASE_FARE_DISCOUNT_PERCENT}% = ₹${baseDiscountAmount}`,
`Discounted base fare: ₹${discountedBaseFare}`,
`Night surcharge: ${nightPercent}% = ₹${nightSurchargeAmount}`,

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
baseDiscountPercent: BASE_FARE_DISCOUNT_PERCENT,
baseDiscountAmount,

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

//========================================================= */

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
"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  BellRing,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Info,
  Layers,
  MapPin,
  Pause,
  Percent,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Megaphone,
  Ticket,
  Trash2,
} from "lucide-react";
import { db } from "@/lib/firebase";

type BookingType = "one-way" | "round-trip" | "local" | "shared";
type DiscountType = "percentage" | "fixed";
type OfferMode = "automatic" | "coupon";
type RouteScope = "all" | "selected";
type TabKey = "campaign" | "festival" | "coupon" | "special" | "location";

type Festival = {
  id: string;
  name: string;
  increasePercent: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
  fareTypes?: Array<"oneway" | "roundtrip" | "local" | "shared">;
};

type Coupon = {
  id: string;
  code: string;
  from: string;
  to: string;
  fromNormalized: string;
  toNormalized: string;
  discountPercent: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
  usageCount?: number;
};

type Campaign = {
  id: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  bookingTypes: BookingType[];
  routeScope: RouteScope;
  selectedRoutes: Array<{
    from: string;
    to: string;
    fromNormalized: string;
    toNormalized: string;
  }>;
  offerMode: OfferMode;
  couponCode?: string;
  startAt: string;
  endAt: string;
  activeDays: number[];
  minimumFare: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  allowStacking: boolean;
  priority: number;
  isActive: boolean;
};

type LocationFareRule = {
  id: string;
  pickupLocation: string;
  pickupNormalized: string;
  increasePercent: number;
  isActive: boolean;
  startedAt: string;
  expiresAt: string;
  createdAt?: unknown;
};

type SpecialPopupRecord = {
  id: string;
  popupType?: "notice" | "offer" | string;
  isActive?: boolean;
  offerAvailable?: boolean;
  noticeTitle?: string;
  noticeMessage?: string;
  buttonText?: string;
  buttonLink?: string;
  priority?: number;
  fromCity?: string;
  toCity?: string;
  tripType?: string;
  vehicleType?: string;
  strikeFare?: number | string | null;
  offerFare?: number | string;
};

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-[15px] font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-100";
const labelClass = "mb-2 block text-[13px] font-bold text-slate-700";
const cardClass =
  "rounded-[26px] border border-slate-200/80 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.055)]";
const normalize = (s: string) =>
  s.trim().toLocaleLowerCase("en-IN").replace(/\s+/g, " ");
const validDates = (a: string, b: string) =>
  !!a && !!b && new Date(a).getTime() < new Date(b).getTime();
const iso = (s: string) => new Date(s).toISOString();
const dateLabel = (s: string) =>
  new Date(s).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
const code6 = () =>
  String(100000 + Math.floor(Math.random() * 900000));
const dayOptions = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const tripLabels: Record<BookingType, string> = {
  "one-way": "One Way",
  "round-trip": "Round Trip",
  local: "Local Rental",
  shared: "KR-SHARED",
};
const fareTypeAliases: Record<BookingType, "oneway" | "roundtrip" | "local" | "shared"> = {
  "one-way": "oneway",
  "round-trip": "roundtrip",
  local: "local",
  shared: "shared",
};
const defaultFestivalBookingTypes: BookingType[] = ["one-way", "round-trip", "local", "shared"];
const tabs: Array<{ id: TabKey; label: string; shortLabel: string }> = [
  { id: "campaign", label: "Discount Campaigns", shortLabel: "Campaigns" },
  { id: "festival", label: "Festival Fare", shortLabel: "Festival" },
  { id: "coupon", label: "Route Coupons", shortLabel: "Coupons" },
  { id: "special", label: "Popup Offers", shortLabel: "Popups" },
  { id: "location", label: "Pickup Fare Increase", shortLabel: "Location" },
];

function AppTabIcon({ tab }: { tab: TabKey }) {
  if (tab === "campaign") return <Sparkles size={19} />;
  if (tab === "festival") return <CalendarDays size={19} />;
  if (tab === "coupon") return <Ticket size={19} />;
  if (tab === "location") return <MapPin size={19} />;
  return <BellRing size={19} />;
}

function StatusPill({
  active,
  start,
  end,
}: {
  active: boolean;
  start: string;
  end: string;
}) {
  const now = Date.now();
  const label = !active
    ? "Paused"
    : now < new Date(start).getTime()
      ? "Scheduled"
      : now > new Date(end).getTime()
        ? "Expired"
        : "Active";
  const styles =
    label === "Active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : label === "Scheduled"
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : label === "Expired"
          ? "bg-amber-50 text-amber-800 ring-amber-200"
          : "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ring-inset ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-200/70">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600">
          {eyebrow}
        </p>
        <h2 className="mt-0.5 text-lg font-black tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export default function FarePromotionsAdminPage() {
  const [tab, setTab] = useState<TabKey>("campaign");
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [popupRecords, setPopupRecords] = useState<SpecialPopupRecord[]>([]);
  const [locationRules, setLocationRules] = useState<LocationFareRule[]>([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [locationIncrease, setLocationIncrease] = useState("10");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newCode, setNewCode] = useState("");

  const [festivalName, setFestivalName] = useState("");
  const [festivalPercent, setFestivalPercent] = useState("10");
  const [festivalStart, setFestivalStart] = useState("");
  const [festivalEnd, setFestivalEnd] = useState("");
  const [festivalBookingTypes, setFestivalBookingTypes] = useState<BookingType[]>(defaultFestivalBookingTypes);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [discount, setDiscount] = useState("10");
  const [couponStart, setCouponStart] = useState("");
  const [couponEnd, setCouponEnd] = useState("");

  const [campaignName, setCampaignName] = useState("");
  const [campaignDiscountType, setCampaignDiscountType] =
    useState<DiscountType>("percentage");
  const [campaignDiscount, setCampaignDiscount] = useState("10");
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>([
    "one-way",
    "round-trip",
  ]);
  const [routeScope, setRouteScope] = useState<RouteScope>("all");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [offerMode, setOfferMode] = useState<OfferMode>("automatic");
  const [campaignStart, setCampaignStart] = useState("");
  const [campaignEnd, setCampaignEnd] = useState("");
  const [activeDays, setActiveDays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);
  const [minimumFare, setMinimumFare] = useState("0");
  const [maximumDiscount, setMaximumDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [perCustomerLimit, setPerCustomerLimit] = useState("1");
  const [priority, setPriority] = useState("1");

  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeButtonText, setNoticeButtonText] = useState("Book Now");
  const [noticeButtonLink, setNoticeButtonLink] = useState("#booking-form");
  const [noticePriority, setNoticePriority] = useState("20");
  const [popupFrom, setPopupFrom] = useState("");
  const [popupTo, setPopupTo] = useState("");
  const [popupTripType, setPopupTripType] = useState("oneway");
  const [popupVehicle, setPopupVehicle] = useState("Sedan");
  const [popupStrikeFare, setPopupStrikeFare] = useState("");
  const [popupOfferFare, setPopupOfferFare] = useState("");

  useEffect(() => {
    let ready = [false, false, false, false, false];
    const finish = () => {
      if (ready.every(Boolean)) setLoading(false);
    };
    const subscribe = (
      name: string,
      index: number,
      setter: (v: any[]) => void,
      sortByCreatedAt = true,
    ) => {
      const collectionRef = collection(db, name);
      const source = sortByCreatedAt
        ? query(collectionRef, orderBy("createdAt", "desc"))
        : collectionRef;
      return onSnapshot(
        source,
        (snapshot) => {
          setter(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            })),
          );
          ready[index] = true;
          finish();
        },
        (snapshotError) => {
          setError(snapshotError.message);
          ready[index] = true;
          finish();
        },
      );
    };

    const unsubscribeFestivals = subscribe(
      "festival_fares",
      0,
      setFestivals,
    );
    const unsubscribeCoupons = subscribe("route_coupons", 1, setCoupons);
    const unsubscribeCampaigns = subscribe(
      "fare_promotions",
      2,
      setCampaigns,
    );
    // special_offers may contain older documents without createdAt, so do not orderBy here.
    const unsubscribePopups = subscribe(
      "special_offers",
      3,
      setPopupRecords,
      false,
    );
    const unsubscribeLocationRules = subscribe(
      "pickup_location_fare_rules",
      4,
      setLocationRules,
      false,
    );

    return () => {
      unsubscribeFestivals();
      unsubscribeCoupons();
      unsubscribeCampaigns();
      unsubscribePopups();
      unsubscribeLocationRules();
    };
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      activeCampaigns: campaigns.filter(
        (campaign) =>
          campaign.isActive &&
          now >= new Date(campaign.startAt).getTime() &&
          now <= new Date(campaign.endAt).getTime(),
      ).length,
      totalCampaigns: campaigns.length,
      totalFestivals: festivals.length,
      totalCoupons: coupons.length,
      totalPopupItems: popupRecords.length,
      activeLocationRules: locationRules.filter((rule) => rule.isActive && new Date(rule.expiresAt).getTime() > now).length,
    };
  }, [campaigns, festivals, coupons, popupRecords, locationRules]);

  const resetMessages = () => {
    setError("");
    setMessage("");
    setNewCode("");
  };

  const saveFestival = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    const percentage = Number(festivalPercent);

    if (!festivalName.trim()) {
      setError("Festival / season ka naam enter karein.");
      return;
    }
    if (!(percentage > 0 && percentage <= 100)) {
      setError("Increase 1% se 100% ke beech hona chahiye.");
      return;
    }
    if (!validDates(festivalStart, festivalEnd)) {
      setError("End date/time, start date/time ke baad honi chahiye.");
      return;
    }
    if (!festivalBookingTypes.length) {
      setError("Festival rule ke liye kam se kam ek booking type select karein.");
      return;
    }

    setBusy(true);
    try {
      await addDoc(collection(db, "festival_fares"), {
        name: festivalName.trim(),
        increasePercent: percentage,
        fareTypes: festivalBookingTypes.map((bookingType) => fareTypeAliases[bookingType]),
        startAt: iso(festivalStart),
        endAt: iso(festivalEnd),
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setFestivalName("");
      setFestivalPercent("10");
      setFestivalStart("");
      setFestivalEnd("");
      setFestivalBookingTypes(defaultFestivalBookingTypes);
      setMessage("Festival fare rule Firebase mein save ho gaya.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Save failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createLocationFareRule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    const location = pickupLocation.trim();
    const percentage = Number(locationIncrease);
    if (!location) return setError("Pickup location enter karein.");
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
      return setError("Fare increase 1% se 100% ke beech hona chahiye.");
    }
    const normalized = normalize(location);
    const existingActive = locationRules.find(
      (rule) => rule.pickupNormalized === normalized && rule.isActive && new Date(rule.expiresAt).getTime() > Date.now(),
    );
    if (existingActive) {
      return setError("Is pickup location par pehle se active rule hai. Pehle use pause karein.");
    }
    setBusy(true);
    try {
      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + 24 * 60 * 60 * 1000);
      await addDoc(collection(db, "pickup_location_fare_rules"), {
        pickupLocation: location,
        pickupNormalized: normalized,
        increasePercent: percentage,
        isActive: true,
        startedAt: startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setPickupLocation("");
      setLocationIncrease("10");
      setMessage(`Pickup location fare increase ${location} ke liye 24 hours activate ho gaya.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Location fare rule save failed.");
    } finally {
      setBusy(false);
    }
  };

  const createCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    const value = Number(campaignDiscount);

    if (!campaignName.trim()) {
      setError("Campaign name enter karein.");
      return;
    }
    if (
      !(value > 0 && value <= (campaignDiscountType === "percentage" ? 100 : 100000))
    ) {
      setError("Discount value valid nahi hai.");
      return;
    }
    if (!bookingTypes.length) {
      setError("Kam se kam ek booking type select karein.");
      return;
    }
    if (!validDates(campaignStart, campaignEnd)) {
      setError("End date/time, start date/time ke baad honi chahiye.");
      return;
    }
    if (!activeDays.length) {
      setError("Kam se kam ek active day select karein.");
      return;
    }
    if (
      routeScope === "selected" &&
      (!routeFrom.trim() ||
        !routeTo.trim() ||
        normalize(routeFrom) === normalize(routeTo))
    ) {
      setError("Selected route ke liye valid From aur To enter karein.");
      return;
    }
    if (
      Number(minimumFare) < 0 ||
      (maximumDiscount && Number(maximumDiscount) <= 0) ||
      (usageLimit && Number(usageLimit) <= 0) ||
      (perCustomerLimit && Number(perCustomerLimit) <= 0)
    ) {
      setError("Minimum fare aur usage limits check karein.");
      return;
    }

    setBusy(true);
    try {
      let couponCode: string | undefined;
      if (offerMode === "coupon") {
        const existing = new Set([
          ...coupons.map((coupon) => coupon.code),
          ...campaigns.map((campaign) => campaign.couponCode).filter(Boolean),
        ]);
        for (let index = 0; index < 30; index += 1) {
          const candidate = code6();
          if (!existing.has(candidate)) {
            couponCode = candidate;
            break;
          }
        }
        if (!couponCode) {
          throw new Error("Unique coupon code generate nahi hua. Dobara try karein.");
        }
      }

      const selectedRoutes =
        routeScope === "selected"
          ? [
              {
                from: routeFrom.trim(),
                to: routeTo.trim(),
                fromNormalized: normalize(routeFrom),
                toNormalized: normalize(routeTo),
              },
            ]
          : [];

      await addDoc(collection(db, "fare_promotions"), {
        name: campaignName.trim(),
        discountType: campaignDiscountType,
        discountValue: value,
        bookingTypes,
        routeScope,
        selectedRoutes,
        offerMode,
        ...(couponCode ? { couponCode } : {}),
        startAt: iso(campaignStart),
        endAt: iso(campaignEnd),
        activeDays,
        minimumFare: Number(minimumFare) || 0,
        maximumDiscount: maximumDiscount ? Number(maximumDiscount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        usageCount: 0,
        perCustomerLimit: perCustomerLimit ? Number(perCustomerLimit) : null,
        allowStacking: false,
        priority: Number(priority) || 1,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setNewCode(couponCode || "");
      setCampaignName("");
      setCampaignDiscount("10");
      setRouteFrom("");
      setRouteTo("");
      setCampaignStart("");
      setCampaignEnd("");
      setMaximumDiscount("");
      setUsageLimit("");
      setMessage(
        couponCode
          ? `Campaign save ho gaya. Coupon code: ${couponCode}`
          : "Automatic discount campaign Firebase mein save ho gaya.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Campaign create failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    const percentage = Number(discount);
    const normalizedFrom = normalize(from);
    const normalizedTo = normalize(to);

    if (
      !normalizedFrom ||
      !normalizedTo ||
      normalizedFrom === normalizedTo
    ) {
      setError("Valid aur alag From / To city enter karein.");
      return;
    }
    if (!(percentage > 0 && percentage <= 100)) {
      setError("Discount 1% se 100% ke beech hona chahiye.");
      return;
    }
    if (!validDates(couponStart, couponEnd)) {
      setError("Expiry, start date/time ke baad honi chahiye.");
      return;
    }

    setBusy(true);
    try {
      const existing = new Set([
        ...coupons.map((coupon) => coupon.code),
        ...campaigns.map((campaign) => campaign.couponCode).filter(Boolean),
      ]);
      let saved = "";

      for (let index = 0; index < 30; index += 1) {
        const candidate = code6();
        if (existing.has(candidate)) continue;

        await addDoc(collection(db, "route_coupons"), {
          code: candidate,
          from: from.trim(),
          to: to.trim(),
          fromNormalized: normalizedFrom,
          toNormalized: normalizedTo,
          discountPercent: percentage,
          startAt: iso(couponStart),
          endAt: iso(couponEnd),
          isActive: true,
          usageCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        saved = candidate;
        break;
      }

      if (!saved) throw new Error("Unique coupon generate nahi hua.");
      setNewCode(saved);
      setFrom("");
      setTo("");
      setDiscount("10");
      setCouponStart("");
      setCouponEnd("");
      setMessage(`Route coupon ${saved} Firebase mein save ho gaya.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Coupon create failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const createPopupNotice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    if (!noticeTitle.trim()) return setError("Notice title enter karein.");
    if (!noticeMessage.trim()) return setError("Notice message enter karein.");
    if (!noticeButtonText.trim() || !noticeButtonLink.trim()) {
      return setError("Notice button text aur link enter karein.");
    }
    const noticeOrder = Number(noticePriority);
    if (!Number.isFinite(noticeOrder) || noticeOrder < 0) {
      return setError("Notice priority 0 ya usse zyada honi chahiye.");
    }

    setBusy(true);
    try {
      await addDoc(collection(db, "special_offers"), {
        popupType: "notice",
        noticeTitle: noticeTitle.trim(),
        noticeMessage: noticeMessage.trim(),
        buttonText: noticeButtonText.trim(),
        buttonLink: noticeButtonLink.trim(),
        priority: noticeOrder,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNoticeTitle("");
      setNoticeMessage("");
      setNoticeButtonText("Book Now");
      setNoticeButtonLink("#booking-form");
      setNoticePriority("20");
      setMessage("Important Notice special_offers collection mein save ho gaya.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Notice save failed.");
    } finally {
      setBusy(false);
    }
  };

  const createPopupOffer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();
    const finalOfferFare = Number(popupOfferFare);
    const oldFare = popupStrikeFare ? Number(popupStrikeFare) : null;
    if (!popupFrom.trim() || !popupTo.trim() || normalize(popupFrom) === normalize(popupTo)) {
      return setError("Popup offer ke liye valid From aur To city enter karein.");
    }
    if (!Number.isFinite(finalOfferFare) || finalOfferFare <= 0) {
      return setError("Offer fare 0 se zyada hona chahiye.");
    }
    if (oldFare !== null && (!Number.isFinite(oldFare) || oldFare <= finalOfferFare)) {
      return setError("Strike fare, offer fare se zyada hona chahiye.");
    }

    setBusy(true);
    try {
      await addDoc(collection(db, "special_offers"), {
        popupType: "offer",
        fromCity: popupFrom.trim(),
        toCity: popupTo.trim(),
        tripType: popupTripType,
        vehicleType: popupVehicle,
        ...(oldFare !== null ? { strikeFare: oldFare } : {}),
        offerFare: finalOfferFare,
        offerAvailable: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setPopupFrom("");
      setPopupTo("");
      setPopupStrikeFare("");
      setPopupOfferFare("");
      setMessage("Popup route offer special_offers collection mein save ho gaya.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Popup offer save failed.");
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (
    type: "festival" | "coupon" | "campaign" | "special" | "location",
    id: string,
    active: boolean,
    specialKind?: "notice" | "offer",
  ) => {
    const path =
      type === "festival"
        ? "festival_fares"
        : type === "coupon"
          ? "route_coupons"
          : type === "special"
            ? "special_offers"
            : type === "location"
              ? "pickup_location_fare_rules"
              : "fare_promotions";
    try {
      const statusUpdate =
        type === "special" && specialKind === "offer"
          ? { offerAvailable: !active, updatedAt: serverTimestamp() }
          : { isActive: !active, updatedAt: serverTimestamp() };
      await updateDoc(doc(db, path, id), statusUpdate);
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Status update failed.",
      );
    }
  };

  const remove = async (
    type: "festival" | "coupon" | "campaign" | "special" | "location",
    id: string,
  ) => {
    if (!window.confirm("Kya aap is record ko delete karna chahte hain?")) return;
    const path =
      type === "festival"
        ? "festival_fares"
        : type === "coupon"
          ? "route_coupons"
          : type === "special"
            ? "special_offers"
            : type === "location"
              ? "pickup_location_fare_rules"
              : "fare_promotions";
    try {
      await deleteDoc(doc(db, path, id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Delete failed.",
      );
    }
  };

  const toggleBooking = (value: BookingType) =>
    setBookingTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  const toggleFestivalBooking = (value: BookingType) =>
    setFestivalBookingTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  const toggleDay = (value: number) =>
    setActiveDays((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value].sort(),
    );

  const copyCode = async () => {
    if (!newCode) return;
    try {
      await navigator.clipboard.writeText(newCode);
      setMessage("Coupon code copied.");
    } catch {
      setError("Clipboard access nahi mila. Code ko manually copy karein.");
    }
  };

  const renderCampaigns = () => (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(340px,410px)_minmax(0,1fr)]">
      <form onSubmit={createCampaign} className={`${cardClass} space-y-5 p-4 sm:p-6`}>
        <SectionTitle
          eyebrow="Create new offer"
          title="Discount Campaign"
          description="Trip type, route aur validity ke hisaab se offer banayein."
          icon={<Sparkles size={21} />}
        />

        <FormField label="Campaign Name">
          <input
            className={fieldClass}
            value={campaignName}
            onChange={(event) => setCampaignName(event.target.value)}
            placeholder="Weekend Special"
            maxLength={60}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Discount Type">
            <select
              className={fieldClass}
              value={campaignDiscountType}
              onChange={(event) =>
                setCampaignDiscountType(event.target.value as DiscountType)
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </FormField>
          <FormField label="Discount Value">
            <div className="relative">
              <input
                className={`${fieldClass} pr-11`}
                type="number"
                min="1"
                max={campaignDiscountType === "percentage" ? 100 : 100000}
                step="0.5"
                value={campaignDiscount}
                onChange={(event) => setCampaignDiscount(event.target.value)}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                {campaignDiscountType === "percentage" ? "%" : "₹"}
              </span>
            </div>
          </FormField>
        </div>

        <fieldset className="space-y-3">
          <legend className={labelClass}>Applicable booking types</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              ["one-way", "round-trip", "local", "shared"] as BookingType[]
            ).map((value) => {
              const selected = bookingTypes.includes(value);
              return (
                <label
                  key={value}
                  className={`flex min-h-[58px] cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-2.5 transition active:scale-[0.98] ${
                    selected
                      ? "border-rose-300 bg-rose-50 text-rose-800 shadow-sm shadow-rose-100"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleBooking(value)}
                  />
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {value === "shared" ? (
                      <Layers size={15} />
                    ) : value === "local" ? (
                      <MapPin size={15} />
                    ) : (
                      <CarFront size={16} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-extrabold leading-tight">
                      {tripLabels[value]}
                    </span>
                    {value === "shared" && (
                      <span className="mt-0.5 block text-[10px] font-semibold text-rose-600">
                        Door-to-door shared
                      </span>
                    )}
                  </span>
                  {selected && (
                    <CheckCircle2 className="ml-auto shrink-0 text-rose-600" size={16} />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className={labelClass}>Route coverage</legend>
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
            {([
              ["all", "All Routes"],
              ["selected", "Specific Route"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRouteScope(value)}
                className={`min-h-11 rounded-xl px-2 text-[13px] font-extrabold transition ${
                  routeScope === value
                    ? "bg-white text-rose-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {routeScope === "selected" && (
            <div className="grid grid-cols-2 gap-2">
              <FormField label="From city">
                <input
                  className={fieldClass}
                  value={routeFrom}
                  onChange={(event) => setRouteFrom(event.target.value)}
                  placeholder="Korba"
                />
              </FormField>
              <FormField label="To city">
                <input
                  className={fieldClass}
                  value={routeTo}
                  onChange={(event) => setRouteTo(event.target.value)}
                  placeholder="Raipur"
                />
              </FormField>
            </div>
          )}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className={labelClass}>Offer mode</legend>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["automatic", "Auto Apply", <Sparkles size={16} key="auto" />],
              ["coupon", "Coupon Code", <Ticket size={16} key="coupon" />],
            ] as const).map(([value, label, icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setOfferMode(value)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border text-[13px] font-extrabold transition ${
                  offerMode === value
                    ? "border-orange-300 bg-orange-50 text-orange-800"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
          {offerMode === "coupon" && (
            <p className="flex gap-2 rounded-2xl bg-sky-50 p-3 text-xs leading-5 text-sky-800">
              <Info className="mt-0.5 shrink-0" size={15} />
              Save karte hi unique 6-digit coupon code generate hoga.
            </p>
          )}
        </fieldset>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Start Date & Time">
            <input
              className={fieldClass}
              type="datetime-local"
              value={campaignStart}
              onChange={(event) => setCampaignStart(event.target.value)}
            />
          </FormField>
          <FormField label="End Date & Time">
            <input
              className={fieldClass}
              type="datetime-local"
              value={campaignEnd}
              onChange={(event) => setCampaignEnd(event.target.value)}
            />
          </FormField>
        </div>

        <fieldset className="space-y-3">
          <legend className={labelClass}>Active days</legend>
          <div className="grid grid-cols-7 gap-1.5">
            {dayOptions.map((day, index) => {
              const selected = activeDays.includes(index);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(index)}
                  className={`min-h-10 rounded-xl text-[11px] font-extrabold transition ${
                    selected
                      ? "bg-rose-600 text-white shadow-sm shadow-rose-200"
                      : "border border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Minimum Fare (₹)">
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={minimumFare}
              onChange={(event) => setMinimumFare(event.target.value)}
            />
          </FormField>
          <FormField label="Max Discount (₹)">
            <input
              className={fieldClass}
              type="number"
              min="1"
              value={maximumDiscount}
              onChange={(event) => setMaximumDiscount(event.target.value)}
              placeholder="No limit"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Total Usage Limit">
            <input
              className={fieldClass}
              type="number"
              min="1"
              value={usageLimit}
              onChange={(event) => setUsageLimit(event.target.value)}
              placeholder="Unlimited"
            />
          </FormField>
          <FormField label="Per Customer Limit">
            <input
              className={fieldClass}
              type="number"
              min="1"
              value={perCustomerLimit}
              onChange={(event) => setPerCustomerLimit(event.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Priority (higher wins)">
          <input
            className={fieldClass}
            type="number"
            min="1"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          />
        </FormField>

        <button
          disabled={busy}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 px-5 text-[15px] font-black text-white shadow-lg shadow-rose-200 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
        >
          <Plus size={19} />
          {busy ? "Saving..." : "Create Discount Campaign"}
        </button>
        <p className="text-[11px] leading-5 text-slate-500">
          Best discount policy: eligible offers mein customer ko highest saving
          milegi. Campaign create hone se customer-side/API integration
          automatically enable nahi hota.
        </p>
      </form>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-slate-100 bg-gradient-to-r from-rose-50 via-white to-orange-50 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-600">
                Firestore · fare_promotions
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-900">
                Saved Campaigns
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Manage, pause or remove your offers.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
              <Tag size={20} />
            </div>
          </div>
        </div>
        {loading ? (
          <p className="p-5 text-sm font-medium text-slate-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <div className="p-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Ticket size={24} />
            </div>
            <p className="mt-3 font-bold text-slate-800">No campaigns yet</p>
            <p className="mt-1 text-xs text-slate-500">Create your first discount campaign.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {campaigns.map((campaign) => (
              <article key={campaign.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="mr-auto min-w-0 break-words text-[15px] font-black text-slate-900">
                    {campaign.name}
                  </h3>
                  <StatusPill
                    active={campaign.isActive}
                    start={campaign.startAt}
                    end={campaign.endAt}
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                  <p className="text-2xl font-black tracking-tight text-emerald-700">
                    {campaign.discountType === "percentage"
                      ? `${campaign.discountValue}% OFF`
                      : `₹${campaign.discountValue} OFF`}
                    {campaign.maximumDiscount
                      ? ` · Max ₹${campaign.maximumDiscount}`
                      : ""}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-600">
                    {campaign.offerMode === "automatic" ? "Auto apply" : "Coupon"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(campaign.bookingTypes || []).map((type) => (
                    <span
                      key={type}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        type === "shared"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {tripLabels[type] || type}
                    </span>
                  ))}
                </div>
                <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-slate-600">
                  <MapPin className="mt-0.5 shrink-0 text-slate-400" size={14} />
                  {campaign.routeScope === "all"
                    ? "All routes"
                    : (campaign.selectedRoutes || [])
                        .map((route) => `${route.from} → ${route.to}`)
                        .join(", ")}
                </p>
                {campaign.couponCode && (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-xl border border-dashed border-violet-300 bg-violet-50 px-3 py-2 font-mono text-sm font-black tracking-[0.16em] text-violet-800">
                    <Ticket size={14} /> {campaign.couponCode}
                  </p>
                )}
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} /> {dateLabel(campaign.startAt)} — {dateLabel(campaign.endAt)}
                  </span>
                  <span>
                    Used {campaign.usageCount || 0}
                    {campaign.usageLimit ? ` / ${campaign.usageLimit}` : ""}
                  </span>
                  <span>
                    {campaign.activeDays?.map((day) => dayOptions[day]).join(", ")}
                  </span>
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggle("campaign", campaign.id, campaign.isActive)}
                    className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                  >
                    {campaign.isActive ? <Pause size={14} /> : <Play size={14} />}
                    {campaign.isActive ? "Pause" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove("campaign", campaign.id)}
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 text-xs font-extrabold text-rose-700 transition hover:bg-rose-100 active:scale-[0.98]"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderFestivals = () => (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
      <form onSubmit={saveFestival} className={`${cardClass} space-y-5 p-4 sm:p-6`}>
        <SectionTitle
          eyebrow="Seasonal pricing"
          title="Festival Fare Rule"
          description="Selected period ke liye fare increase configure karein."
          icon={<CalendarDays size={21} />}
        />
        <fieldset className="space-y-3">
          <legend className={labelClass}>Applicable booking types</legend>
          <div className="grid grid-cols-2 gap-2">
            {defaultFestivalBookingTypes.map((value) => {
              const selected = festivalBookingTypes.includes(value);
              return (
                <label key={value} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-extrabold ${selected ? "border-orange-300 bg-orange-50 text-orange-800" : "border-slate-200 text-slate-500"}`}>
                  <input className="accent-orange-600" type="checkbox" checked={selected} onChange={() => toggleFestivalBooking(value)} />
                  {tripLabels[value]}
                </label>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500">Default mein chaaron booking types selected hain, jaise pehle sabhi fares par festival rule apply hota tha.</p>
        </fieldset>
        <FormField label="Festival / Season Name">
          <input
            className={fieldClass}
            value={festivalName}
            onChange={(event) => setFestivalName(event.target.value)}
            placeholder="Diwali Special"
            maxLength={60}
          />
        </FormField>
        <FormField label="Fare Increase (%)">
          <div className="relative">
            <input
              className={`${fieldClass} pr-11`}
              type="number"
              min="0.5"
              max="100"
              step="0.5"
              value={festivalPercent}
              onChange={(event) => setFestivalPercent(event.target.value)}
            />
            <Percent className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          </div>
        </FormField>
        <FormField label="Start Date & Time">
          <input className={fieldClass} type="datetime-local" value={festivalStart} onChange={(event) => setFestivalStart(event.target.value)} />
        </FormField>
        <FormField label="End Date & Time">
          <input className={fieldClass} type="datetime-local" value={festivalEnd} onChange={(event) => setFestivalEnd(event.target.value)} />
        </FormField>
        <button disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 px-5 text-[15px] font-black text-white shadow-lg shadow-orange-100 disabled:opacity-60">
          <Plus size={19} /> {busy ? "Saving..." : "Save Festival Rule"}
        </button>
      </form>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">Firestore · festival_fares</p>
          <h2 className="mt-1 text-lg font-black">Saved Festival Rules</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading festival rules...</p>
        ) : festivals.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No festival fare rules found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {festivals.map((festival) => (
              <article key={festival.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-900">{festival.name}</h3>
                    <StatusPill active={festival.isActive} start={festival.startAt} end={festival.endAt} />
                  </div>
                  <p className="mt-1 text-2xl font-black text-orange-600">+{festival.increasePercent}%</p>
                  <p className="mt-1 text-xs text-slate-500">{dateLabel(festival.startAt)} — {dateLabel(festival.endAt)}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{(festival.fareTypes?.length ? festival.fareTypes : ["oneway", "roundtrip", "local", "shared"]).map((fareType) => {
                    const label = fareType === "oneway" ? "One Way" : fareType === "roundtrip" ? "Round Trip" : fareType === "shared" ? "KR-SHARED" : "Local Rental";
                    return <span key={fareType} className={`rounded-full px-2 py-1 text-[10px] font-bold ${fareType === "shared" ? "bg-violet-50 text-violet-700" : "bg-orange-50 text-orange-700"}`}>{label}</span>;
                  })}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => toggle("festival", festival.id, festival.isActive)} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700 sm:flex-none">
                    {festival.isActive ? <Pause size={14} /> : <Play size={14} />}
                    {festival.isActive ? "Pause" : "Activate"}
                  </button>
                  <button type="button" onClick={() => remove("festival", festival.id)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-extrabold text-rose-700">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderCoupons = () => (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
      <form onSubmit={createCoupon} className={`${cardClass} space-y-5 p-4 sm:p-6`}>
        <SectionTitle
          eyebrow="Route-specific offer"
          title="Generate Route Coupon"
          description="Ek selected route ke liye 6-digit coupon create karein."
          icon={<Ticket size={21} />}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="From">
            <input className={fieldClass} value={from} onChange={(event) => setFrom(event.target.value)} placeholder="Raipur" maxLength={80} />
          </FormField>
          <FormField label="To">
            <input className={fieldClass} value={to} onChange={(event) => setTo(event.target.value)} placeholder="Bilaspur" maxLength={80} />
          </FormField>
        </div>
        <FormField label="Discount (%)">
          <div className="relative">
            <input className={`${fieldClass} pr-11`} type="number" min="0.5" max="100" step="0.5" value={discount} onChange={(event) => setDiscount(event.target.value)} />
            <Percent className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          </div>
        </FormField>
        <FormField label="Coupon Start Date & Time">
          <input className={fieldClass} type="datetime-local" value={couponStart} onChange={(event) => setCouponStart(event.target.value)} />
        </FormField>
        <FormField label="Coupon Expiry Date & Time">
          <input className={fieldClass} type="datetime-local" value={couponEnd} onChange={(event) => setCouponEnd(event.target.value)} />
        </FormField>
        <button disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[15px] font-black text-white shadow-lg shadow-violet-100 disabled:opacity-60">
          <Plus size={19} /> {busy ? "Generating..." : "Generate 6-Digit Coupon"}
        </button>
      </form>

      <section className={`${cardClass} overflow-hidden`}>
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white p-4 sm:p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-600">Firestore · route_coupons</p>
          <h2 className="mt-1 text-lg font-black">Saved Route Coupons</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No route coupons found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {coupons.map((coupon) => (
              <article key={coupon.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded-xl border border-dashed border-violet-300 bg-violet-50 px-3 py-1.5 text-lg font-black tracking-[0.16em] text-violet-800">{coupon.code}</code>
                    <StatusPill active={coupon.isActive} start={coupon.startAt} end={coupon.endAt} />
                  </div>
                  <p className="mt-2 font-extrabold text-slate-800">{coupon.from} → {coupon.to}</p>
                  <p className="text-lg font-black text-emerald-700">{coupon.discountPercent}% OFF</p>
                  <p className="mt-1 text-xs text-slate-500">{dateLabel(coupon.startAt)} — {dateLabel(coupon.endAt)} · Used {coupon.usageCount || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => toggle("coupon", coupon.id, coupon.isActive)} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700 sm:flex-none">
                    {coupon.isActive ? <Pause size={14} /> : <Play size={14} />}
                    {coupon.isActive ? "Pause" : "Activate"}
                  </button>
                  <button type="button" onClick={() => remove("coupon", coupon.id)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-extrabold text-rose-700">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderLocationFareRules = () => {
    const now = Date.now();
    const sortedRules = [...locationRules].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
    return (
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <form onSubmit={createLocationFareRule} className={`${cardClass} space-y-5 p-4 sm:p-6`}>
          <SectionTitle
            eyebrow="Dynamic pickup pricing"
            title="Pickup Location Fare Increase"
            description="Selected pickup location par 24 hours ke liye extra fare apply karein."
            icon={<MapPin size={21} />}
          />
          <FormField label="Pickup Location">
            <input
              className={fieldClass}
              value={pickupLocation}
              onChange={(event) => setPickupLocation(event.target.value)}
              placeholder="Example: Korba, Industrial Area"
              maxLength={100}
            />
          </FormField>
          <FormField label="Fare Increase (%)">
            <div className="relative">
              <input
                className={`${fieldClass} pr-11`}
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={locationIncrease}
                onChange={(event) => setLocationIncrease(event.target.value)}
              />
              <Percent className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            </div>
          </FormField>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            Rule enable hote hi start hoga aur 24 hours baad automatically expire ho jayega. Aap beech mein kabhi bhi Pause kar sakte hain.
          </div>
          <button disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 px-5 text-[15px] font-black text-white shadow-lg shadow-rose-100 disabled:opacity-60">
            <Plus size={19} /> {busy ? "Activating..." : "Enable for 24 Hours"}
          </button>
        </form>

        <section className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-slate-100 bg-gradient-to-r from-rose-50 to-white p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-600">Firestore · pickup_location_fare_rules</p>
            <h2 className="mt-1 text-lg font-black">Pickup Location Rules</h2>
            <p className="mt-0.5 text-xs text-slate-500">{locationRules.filter((rule) => rule.isActive && new Date(rule.expiresAt).getTime() > now).length} currently active</p>
          </div>
          {loading ? (
            <p className="p-5 text-sm text-slate-500">Loading location rules...</p>
          ) : sortedRules.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No pickup location fare rules created yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedRules.map((rule) => {
                const expired = new Date(rule.expiresAt).getTime() <= now;
                const active = rule.isActive && !expired;
                return (
                  <article key={rule.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">{rule.pickupLocation}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${active ? "bg-emerald-50 text-emerald-700" : expired ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                          {active ? "Active" : expired ? "Expired" : "Paused"}
                        </span>
                      </div>
                      <p className="mt-1 text-2xl font-black text-rose-600">+{rule.increasePercent}%</p>
                      <p className="mt-1 text-xs text-slate-500">Started: {dateLabel(rule.startedAt)}</p>
                      <p className="text-xs text-slate-500">Expires: {dateLabel(rule.expiresAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      {!expired && (
                        <button type="button" onClick={() => toggle("location", rule.id, rule.isActive)} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700 sm:flex-none">
                          {rule.isActive ? <Pause size={14} /> : <Play size={14} />}
                          {rule.isActive ? "Pause" : "Activate"}
                        </button>
                      )}
                      <button type="button" onClick={() => remove("location", rule.id)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-extrabold text-rose-700">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  };

  const renderSpecialPopups = () => {
    const notices = popupRecords
      .filter((record) => record.popupType === "notice" || !!record.noticeTitle)
      .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
    const popupOffers = popupRecords.filter(
      (record) => !!record.fromCity && !!record.toCity && record.offerFare !== undefined,
    );

    return (
      <div className="space-y-5">
        <div className="rounded-[24px] border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg shadow-sky-100"><BellRing size={21} /></span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-700">Firestore · special_offers</p>
              <h2 className="mt-0.5 text-lg font-black text-slate-900">Popup Notice & Route Offers</h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">Website popup ke Important Notice aur special route fares yahin manage karein. Notice priority ke hisaab se list hoga; active route offers popup ke next step mein show honge.</p>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-2">
          <form onSubmit={createPopupNotice} className={`${cardClass} space-y-4 p-4 sm:p-6`}>
            <SectionTitle eyebrow="Customer announcement" title="Create Important Notice" description="Popup mein offers se pehle dikhne wala notice." icon={<Megaphone size={21} />} />
            <FormField label="Notice Title">
              <input className={fieldClass} value={noticeTitle} onChange={(event) => setNoticeTitle(event.target.value)} placeholder="Important Notice" maxLength={90} />
            </FormField>
            <FormField label="Notice Message">
              <textarea className={`${fieldClass} min-h-28 resize-y`} value={noticeMessage} onChange={(event) => setNoticeMessage(event.target.value)} placeholder="Customer ko kya information deni hai?" maxLength={600} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Button Text">
                <input className={fieldClass} value={noticeButtonText} onChange={(event) => setNoticeButtonText(event.target.value)} placeholder="Book Now" maxLength={30} />
              </FormField>
              <FormField label="Button Link">
                <input className={fieldClass} value={noticeButtonLink} onChange={(event) => setNoticeButtonLink(event.target.value)} placeholder="#booking-form" maxLength={180} />
              </FormField>
            </div>
            <FormField label="Priority (higher shows first)">
              <input className={fieldClass} type="number" min="0" step="1" value={noticePriority} onChange={(event) => setNoticePriority(event.target.value)} />
            </FormField>
            <button disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 px-5 text-[15px] font-black text-white shadow-lg shadow-rose-100 disabled:opacity-60"><Plus size={19} /> {busy ? "Saving..." : "Save Important Notice"}</button>
          </form>

          <form onSubmit={createPopupOffer} className={`${cardClass} space-y-4 p-4 sm:p-6`}>
            <SectionTitle eyebrow="Customer-facing deal" title="Create Route Popup Offer" description="Website popup mein show hone wala discounted route fare." icon={<Tag size={21} />} />
            <div className="grid grid-cols-2 gap-3">
              <FormField label="From City">
                <input className={fieldClass} value={popupFrom} onChange={(event) => setPopupFrom(event.target.value)} placeholder="Korba" maxLength={80} />
              </FormField>
              <FormField label="To City">
                <input className={fieldClass} value={popupTo} onChange={(event) => setPopupTo(event.target.value)} placeholder="Raipur" maxLength={80} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Trip Type">
                <select className={fieldClass} value={popupTripType} onChange={(event) => setPopupTripType(event.target.value)}>
                  <option value="oneway">One Way</option>
                  <option value="roundtrip">Round Trip</option>
                  <option value="local">Local Rental</option>
                </select>
              </FormField>
              <FormField label="Vehicle">
                <select className={fieldClass} value={popupVehicle} onChange={(event) => setPopupVehicle(event.target.value)}>
                  <option value="Sedan">Sedan</option>
                  <option value="Ertiga">Ertiga</option>
                  <option value="Innova">Innova</option>
                  <option value="Innova Crysta">Innova Crysta</option>
                  <option value="SUV">SUV</option>
                </select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Strike Fare (₹) · Optional">
                <input className={fieldClass} type="number" min="1" value={popupStrikeFare} onChange={(event) => setPopupStrikeFare(event.target.value)} placeholder="Regular fare" />
              </FormField>
              <FormField label="Offer Fare (₹)">
                <input className={fieldClass} type="number" min="1" value={popupOfferFare} onChange={(event) => setPopupOfferFare(event.target.value)} placeholder="Special fare" />
              </FormField>
            </div>
            <p className="rounded-2xl bg-violet-50 p-3 text-xs leading-5 text-violet-800">Offer save hote hi <b>offerAvailable: true</b> set hoga aur popup offers carousel mein include ho sakega.</p>
            <button disabled={busy} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-[15px] font-black text-white shadow-lg shadow-violet-100 disabled:opacity-60"><Plus size={19} /> {busy ? "Saving..." : "Save Route Popup Offer"}</button>
          </form>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-slate-100 bg-rose-50/70 p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-600">Priority order · highest first</p>
              <h3 className="mt-1 text-base font-black">Important Notices <span className="ml-1 text-sm text-slate-400">({notices.length})</span></h3>
            </div>
            {loading ? <p className="p-5 text-sm text-slate-500">Loading notices...</p> : notices.length === 0 ? <p className="p-5 text-sm text-slate-500">No notices saved yet.</p> : <div className="divide-y divide-slate-100">{notices.map((notice) => (
              <article key={notice.id} className="p-4">
                <div className="flex flex-wrap items-center gap-2"><h4 className="mr-auto font-black text-slate-900">{notice.noticeTitle || "Important Notice"}</h4><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${notice.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{notice.isActive ? "Active" : "Paused"}</span></div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{notice.noticeMessage}</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">Priority: {notice.priority ?? 0} · Button: {notice.buttonText || "Book Now"}</p>
                <div className="mt-3 flex gap-2"><button type="button" onClick={() => toggle("special", notice.id, !!notice.isActive, "notice")} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700">{notice.isActive ? <Pause size={14} /> : <Play size={14} />}{notice.isActive ? "Pause" : "Activate"}</button><button type="button" onClick={() => remove("special", notice.id)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-extrabold text-rose-700"><Trash2 size={14} /> Delete</button></div>
              </article>
            ))}</div>}
          </section>

          <section className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-slate-100 bg-violet-50/70 p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-600">Website popup carousel</p>
              <h3 className="mt-1 text-base font-black">Route Offers <span className="ml-1 text-sm text-slate-400">({popupOffers.length})</span></h3>
            </div>
            {loading ? <p className="p-5 text-sm text-slate-500">Loading popup offers...</p> : popupOffers.length === 0 ? <p className="p-5 text-sm text-slate-500">No popup route offers saved yet.</p> : <div className="divide-y divide-slate-100">{popupOffers.map((offer) => (
              <article key={offer.id} className="p-4">
                <div className="flex flex-wrap items-center gap-2"><h4 className="mr-auto font-black text-slate-900">{offer.fromCity} → {offer.toCity}</h4><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${offer.offerAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{offer.offerAvailable ? "Available" : "Hidden"}</span></div>
                <p className="mt-1 text-xs font-semibold text-slate-500">{offer.vehicleType || "Sedan"} · {offer.tripType || "oneway"}</p>
                <div className="mt-2 flex items-baseline gap-2">{offer.strikeFare != null && offer.strikeFare !== "" && <span className="text-sm font-bold text-slate-400 line-through">₹{Number(offer.strikeFare).toLocaleString("en-IN")}</span>}<span className="text-2xl font-black text-violet-700">₹{Number(offer.offerFare).toLocaleString("en-IN")}</span></div>
                <div className="mt-3 flex gap-2"><button type="button" onClick={() => toggle("special", offer.id, !!offer.offerAvailable, "offer")} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-extrabold text-slate-700">{offer.offerAvailable ? <Pause size={14} /> : <Play size={14} />}{offer.offerAvailable ? "Hide offer" : "Show offer"}</button><button type="button" onClick={() => remove("special", offer.id)} className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-extrabold text-rose-700"><Trash2 size={14} /> Delete</button></div>
              </article>
            ))}</div>}
          </section>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f6fb] pb-28 text-slate-900 sm:pb-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Android-style app bar */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[#9f1239] via-[#be123c] to-[#ea580c] text-white shadow-lg shadow-rose-900/10">
          <div className="flex min-h-[74px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner">
              <CarFront size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-100">Khatu Rides · Admin</p>
              <h1 className="truncate text-[18px] font-black tracking-tight sm:text-xl">Fare & Offers</h1>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-bold text-white/90 sm:flex">
              <ShieldCheck size={14} /> Management Console
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-rose-700 shadow-sm">
              <span className="text-sm font-black">KR</span>
            </div>
          </div>
        </header>

        <div className="space-y-5 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Overview */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-[22px] border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">Campaigns</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><Sparkles size={16} /></span>
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight">{stats.totalCampaigns}</p>
              <p className="text-[10px] font-semibold text-slate-400">Total offers</p>
            </div>
            <div className="rounded-[22px] border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">Live Campaigns</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></span>
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight text-emerald-700">{stats.activeCampaigns}</p>
              <p className="text-[10px] font-semibold text-slate-400">Currently running</p>
            </div>
            <div className="rounded-[22px] border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">Festival Rules</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><CalendarDays size={16} /></span>
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight">{stats.totalFestivals}</p>
              <p className="text-[10px] font-semibold text-slate-400">Saved rules</p>
            </div>
            <div className="rounded-[22px] border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">Route Coupons</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Ticket size={16} /></span>
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight">{stats.totalCoupons}</p>
              <p className="text-[10px] font-semibold text-slate-400">Generated codes</p>
            </div>
            <div className="rounded-[22px] border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">Popup Items</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><BellRing size={16} /></span>
              </div>
              <p className="mt-2 text-2xl font-black tracking-tight">{stats.totalPopupItems}</p>
              <p className="text-[10px] font-semibold text-slate-400">Notices & offers</p>
            </div>
          </section>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-semibold text-rose-800">
              <Info className="mt-0.5 shrink-0" size={17} />
              <span className="min-w-0 flex-1">{error}</span>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error" className="rounded-full p-1 hover:bg-rose-100">×</button>
            </div>
          )}
          {message && (
            <div role="status" className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={17} />
              <span className="min-w-0 flex-1">{message}</span>
              {newCode && (
                <button type="button" className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white" onClick={copyCode}>Copy {newCode}</button>
              )}
              <button type="button" onClick={() => { setMessage(""); setNewCode(""); }} aria-label="Dismiss message" className="rounded-full p-1 hover:bg-emerald-100">×</button>
            </div>
          )}

          {/* Desktop navigation */}
          <nav className="hidden rounded-[22px] border border-slate-200/80 bg-white p-1.5 shadow-sm sm:grid sm:grid-cols-5 sm:gap-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setTab(item.id); resetMessages(); }}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-extrabold transition ${
                  tab === item.id
                    ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md shadow-rose-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <AppTabIcon tab={item.id} />
                {item.label}
                {tab === item.id && <ChevronRight size={15} />}
              </button>
            ))}
          </nav>

          {/* Active page heading */}
          <div className="flex items-center justify-between gap-3 px-1 sm:hidden">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-600">Manage your collections</p>
              <h2 className="mt-0.5 text-xl font-black tracking-tight">{tabs.find((item) => item.id === tab)?.label}</h2>
            </div>
            <span className="rounded-full bg-white px-3 py-2 text-[10px] font-extrabold text-slate-500 shadow-sm">Live Firebase</span>
          </div>

          {tab === "campaign" && renderCampaigns()}
          {tab === "festival" && renderFestivals()}
          {tab === "coupon" && renderCoupons()}
          {tab === "special" && renderSpecialPopups()}
          {tab === "location" && renderLocationFareRules()}

          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-[11px] leading-5 text-amber-900">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              <b>Integration note:</b> This page manages
              <code className="mx-1 rounded bg-amber-100 px-1">fare_promotions</code>,
              <code className="mx-1 rounded bg-amber-100 px-1">festival_fares</code>,
              <code className="mx-1 rounded bg-amber-100 px-1">route_coupons</code> and
              <code className="mx-1 rounded bg-amber-100 px-1">special_offers</code>.
              KR-SHARED campaign selection is stored as <b>shared</b>. Customer-side
              promotion display, coupon redemption, atomic usage limits and Razorpay
              amount validation must still be enforced in the relevant API/server flow.
            </p>
          </div>
        </div>
      </div>

      {/* Android-style bottom navigation on mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {tabs.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { setTab(item.id); resetMessages(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-extrabold transition active:scale-95 ${selected ? "text-rose-700" : "text-slate-400"}`}
              >
                <span className={`flex h-8 min-w-[58px] items-center justify-center rounded-full transition ${selected ? "bg-rose-100 text-rose-700" : "bg-transparent"}`}>
                  <AppTabIcon tab={item.id} />
                </span>
                {item.shortLabel}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

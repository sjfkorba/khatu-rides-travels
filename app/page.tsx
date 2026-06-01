"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import {
  calculateFare,
  type BookingType,
  type VehicleType,
} from "@/lib/fareCalculator";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Clock3,
  Star,
  ArrowRight,
  CheckCircle2,
  Building2,
  Plane,
  Gift,
  X,
} from "lucide-react";

const libraries: "places"[] = ["places"];
const GOOGLE_REVIEW_LINK = "https://g.page/r/CbD5nSIGmvz1EBM/review";

const vehicles = [
  {
    name: "Dzire",
    type: "Sedan",
    value: "sedan" as VehicleType,
    price: "₹11/km onwards",
    seats: "4+1",
    luggage: "2 Bags",
    image:
      "https://content.carlelo.com/media/models/Dzire/base/maruti-suzuki-dzire-1.webp",
  },
  {
    name: "Ertiga",
    type: "7 Seater",
    value: "ertiga" as VehicleType,
    price: "₹13/km onwards",
    seats: "6+1",
    luggage: "4 Bags",
    image:
      "https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75",
  },
  {
    name: "Innova",
    type: "MPV",
    value: "innova" as VehicleType,
    price: "₹17/km onwards",
    seats: "7+1",
    luggage: "5 Bags",
    image:
      "https://stimg.cardekho.com/images/expert-review/select-model/20250728_160805/930x620/5_1200x67520250728_160805.jpg",
  },
  
];

const popularRoutes = [
  { title: "Raipur to Korba", fare: "₹2800+", link: "/routes/raipur-to-korba-taxi" },
  { title: "Raipur to Bilaspur", fare: "₹2200+", link: "/routes/raipur-to-bilaspur-taxi" },
  { title: "Raipur to Raigarh", fare: "₹3500+", link: "/routes/raipur-to-raigarh-taxi" },
  { title: "Airport to Korba", fare: "₹3000+", link: "/routes/raipur-airport-to-korba-taxi" },
  { title: "Airport to Bilaspur", fare: "₹2500+", link: "/routes/raipur-airport-to-bilaspur-taxi" },
  { title: "Korba to Bilaspur", fare: "₹1800+", link: "/routes/korba-to-bilaspur-taxi" },
];

const faqs = [
  {
    q: "What is the Raipur to Korba taxi fare?",
    a: "Taxi fare starts from approximately ₹2800 depending on vehicle type and travel date.",
  },
  {
    q: "Do you provide airport pickup service?",
    a: "Yes. Airport pickup and drop services are available across Chhattisgarh.",
  },
  {
    q: "Can I book one-way taxi?",
    a: "Yes. One-way taxi services are available on most routes.",
  },
  {
    q: "Do you provide GST invoices?",
    a: "Yes. GST invoices can be provided for eligible bookings.",
  },
];

const reviews = [
  { name: "Amit Verma", city: "Raipur", review: "Excellent taxi service. Clean vehicle and professional driver." },
  { name: "Sanjay Agrawal", city: "Korba", review: "Airport pickup was on time and the journey was comfortable." },
  { name: "Rohit Sharma", city: "Bilaspur", review: "Best taxi service for business travel across Chhattisgarh." },
  { name: "Deepak Yadav", city: "Raigarh", review: "Transparent fare and quick WhatsApp support." },
  { name: "Pooja Singh", city: "Raipur", review: "Family trip was smooth and comfortable." },
  { name: "Nitin Gupta", city: "Korba", review: "Booked Ertiga for airport transfer. Great experience." },
  { name: "Rajesh Patel", city: "Bilaspur", review: "Professional driver and well maintained vehicle." },
  { name: "Mukesh Agrawal", city: "Raipur", review: "Affordable pricing and hassle free booking process." },
  { name: "Vivek Sahu", city: "Raigarh", review: "Reliable taxi service for monthly corporate travel." },
  { name: "Aakash Jain", city: "Korba", review: "Quick confirmation and smooth journey." },
  { name: "Shubham Verma", city: "Raipur", review: "Best option for one way taxi bookings." },
  { name: "Ashish Gupta", city: "Bilaspur", review: "Airport taxi service was perfectly managed." },
  { name: "Pankaj Sharma", city: "Raigarh", review: "Comfortable trip and transparent billing." },
  { name: "Ravi Tiwari", city: "Raipur", review: "Driver was polite and vehicle was very clean." },
  { name: "Anjali Soni", city: "Korba", review: "Great support team and timely pickup." },
  { name: "Manoj Patel", city: "Bilaspur", review: "Good service for family travel." },
  { name: "Rakesh Agrawal", city: "Raigarh", review: "Highly recommended for airport transfers." },
  { name: "Harsh Jain", city: "Raipur", review: "Professional and trustworthy service." },
  { name: "Abhishek Sahu", city: "Korba", review: "Very convenient booking process." },
  { name: "Vikas Verma", city: "Bilaspur", review: "Comfortable long-distance journey." },
];

const routeDistanceMap: Record<string, number> = {
  "raipur-korba": 220,
  "korba-raipur": 220,
  "raipur-bilaspur": 140,
  "bilaspur-raipur": 140,
  "raipur-raigarh": 255,
  "raigarh-raipur": 255,
  "raipur airport-korba": 230,
  "korba-raipur airport": 230,
  "raipur airport-bilaspur": 150,
  "bilaspur-raipur airport": 150,
  "korba-bilaspur": 95,
  "bilaspur-korba": 95,
};

function normalizeLocation(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function estimateDistance(pickup: string, drop: string) {
  const from = normalizeLocation(pickup);
  const to = normalizeLocation(drop);

  if (!from || !to) return 0;

  const exactKey = `${from}-${to}`;
  if (routeDistanceMap[exactKey]) return routeDistanceMap[exactKey];

  if (from === to) return 10;
  if (from.includes("airport") || to.includes("airport")) return 160;

  return 120;
}

export default function HomePage() {
  const [pickupAutocomplete, setPickupAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [dropAutocomplete, setDropAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [vehicleType, setVehicleType] = useState<VehicleType>("sedan");
  const [bookingType, setBookingType] = useState<BookingType>("oneway");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");

  const [loadingFare, setLoadingFare] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isFormLocked, setIsFormLocked] = useState(false);

  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalFare, setFinalFare] = useState(0);

  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRef = useRef<HTMLAnchorElement | null>(null);

  const selectedVehicle = useMemo(() => {
    return vehicles.find((v) => v.value === vehicleType)?.name || vehicleType;
  }, [vehicleType]);

  const whatsappUrl = useMemo(() => {
    const message = `Hello Khatu Rides Travels,
Pickup: ${pickup || "-"}
Drop: ${drop || "-"}
Trip Type: ${bookingType}
Vehicle: ${selectedVehicle}
Pickup Date: ${pickupDate || "-"}
Pickup Time: ${pickupTime || "-"}
Estimated Fare: ${finalFare ? `₹${finalFare}` : "Please share fare"}`;

    return `https://wa.me/919244137353?text=${encodeURIComponent(message)}`;
  }, [pickup, drop, bookingType, selectedVehicle, pickupDate, pickupTime, finalFare]);

  useEffect(() => {
    if (!showReviewPopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = popupRef.current?.querySelector<
      HTMLButtonElement | HTMLAnchorElement
    >("button, a[href]");
    focusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowReviewPopup(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [showReviewPopup]);

  const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onDropLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDropAutocomplete(autocomplete);
  };

  const onPickupPlaceChanged = () => {
    if (!pickupAutocomplete) return;
    const place = pickupAutocomplete.getPlace();
    const address = place.formatted_address || place.name || "";
    setPickup(address);
  };

  const onDropPlaceChanged = () => {
    if (!dropAutocomplete) return;
    const place = dropAutocomplete.getPlace();
    const address = place.formatted_address || place.name || "";
    setDrop(address);
  };

  const applyFareResult = (tripDistance: number) => {
    const result = calculateFare({
      distance: tripDistance,
      vehicleType,
      bookingType,
    });

    setDistance(result.distance);
    setFare(result.fare);
    setDiscount(result.discount);
    setFinalFare(result.finalFare);
    setHasCalculated(true);
    setIsFormLocked(true);
  };

  const handleFareCalculation = async () => {
    if (!pickup || !drop || !pickupDate || !pickupTime) {
      alert("Please fill pickup, drop, date and time.");
      return;
    }

    setLoadingFare(true);

    try {
      const response = await fetch("/api/distance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: pickup,
          destination: drop,
        }),
      });

      const data = await response.json();
      const tripDistance =
        typeof data?.distanceKm === "number" && data.distanceKm > 0
          ? data.distanceKm
          : estimateDistance(pickup, drop);

      applyFareResult(tripDistance);
    } catch (error) {
      console.error(error);
      const tripDistance = estimateDistance(pickup, drop);
      applyFareResult(tripDistance);
    } finally {
      setLoadingFare(false);
    }
  };

  const handleRecalculate = () => {
    setIsFormLocked(false);
    setHasCalculated(false);
    setDistance(0);
    setFare(0);
    setDiscount(0);
    setFinalFare(0);
  };

  const openReviewPopup = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    triggerButtonRef.current = e.currentTarget;
    setShowReviewPopup(true);
  };

  const closeReviewPopup = () => {
    setShowReviewPopup(false);
  };

  const continueToWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setShowReviewPopup(false);
  };

  return (
    <>
      <TopBar />

      <main className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-24">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                  ⭐ Trusted Taxi Service in Chhattisgarh
                </div>

                <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
                  Book Reliable Taxi Service Across
                  <span className="text-orange-500"> Chhattisgarh</span>
                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  Airport Transfer • One Way Taxi • Round Trip
                  <br />
                  Raipur • Korba • Bilaspur • Raigarh
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    ✓ Transparent Fare
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    ✓ Verified Drivers
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    ✓ Clean Vehicles
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    ✓ 24×7 Support
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={whatsappUrl}
                    onClick={openReviewPopup}
                    className="rounded-2xl bg-orange-500 px-8 py-4 font-bold transition hover:bg-orange-600"
                  >
                    Get Fare on WhatsApp
                  </a>

                  <a
                    href="tel:9244137353"
                    className="rounded-2xl border border-white px-8 py-4 font-bold"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-2xl md:p-8">
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-slate-900">
                    Get Instant Fare Estimate
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Enter trip details and calculate your taxi fare.
                  </p>
                </div>

                <div className="space-y-4">
                  <fieldset
                    disabled={isFormLocked || loadingFare}
                    className={`space-y-4 ${isFormLocked ? "opacity-75" : ""}`}
                  >
                    {loadError ? (
                      <input
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Pickup Location"
                        className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    ) : isLoaded ? (
                      <Autocomplete
                        onLoad={onPickupLoad}
                        onPlaceChanged={onPickupPlaceChanged}
                        options={{
                          fields: ["formatted_address", "name", "geometry"],
                          componentRestrictions: { country: "in" },
                        }}
                      >
                        <input
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Pickup Location (Raipur, Bilaspur, Korba...)"
                          className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Loading pickup suggestions..."
                        className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    )}

                    {loadError ? (
                      <input
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        placeholder="Drop Location"
                        className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    ) : isLoaded ? (
                      <Autocomplete
                        onLoad={onDropLoad}
                        onPlaceChanged={onDropPlaceChanged}
                        options={{
                          fields: ["formatted_address", "name", "geometry"],
                          componentRestrictions: { country: "in" },
                        }}
                      >
                        <input
                          value={drop}
                          onChange={(e) => setDrop(e.target.value)}
                          placeholder="Drop Location"
                          className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        value={drop}
                        onChange={(e) => setDrop(e.target.value)}
                        placeholder="Loading drop suggestions..."
                        className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    )}

                    <select
                      value={bookingType}
                      onChange={(e) =>
                        setBookingType(e.target.value as BookingType)
                      }
                      className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="oneway">One Way Trip</option>
                      <option value="roundtrip">Round Trip</option>
                      <option value="local">Local Ride</option>
                      <option value="outstation">Outstation Trip</option>
                    </select>

                    <select
                      value={vehicleType}
                      onChange={(e) =>
                        setVehicleType(e.target.value as VehicleType)
                      }
                      className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="sedan">Sedan / Dzire</option>
                      <option value="ertiga">Ertiga</option>
                      <option value="innova">Innova</option>
                      <option value="crysta">Innova Crysta</option>
                      <option value="scorpio">Scorpio</option>
                    </select>

                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-black outline-none focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </fieldset>

                  {isFormLocked && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                      Fare calculated. Trip details are locked for security.
                      Click <span className="font-bold">Recalculate Fare</span>{" "}
                      to edit details.
                    </div>
                  )}

                  {!hasCalculated ? (
                    <button
                      onClick={handleFareCalculation}
                      disabled={loadingFare}
                      className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loadingFare ? "Calculating Fare..." : "Calculate Fare"}
                    </button>
                  ) : (
                    <button
                      onClick={handleRecalculate}
                      className="w-full rounded-xl bg-slate-900 py-4 font-bold text-white hover:bg-slate-800"
                    >
                      Recalculate Fare
                    </button>
                  )}

                  {finalFare > 0 && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                      <h3 className="text-lg font-black text-green-800">
                        Fare Estimate
                      </h3>

                      <div className="mt-4 space-y-2 text-sm text-slate-700">
                        <p>
                          Vehicle: <strong>{selectedVehicle}</strong>
                        </p>
                        <p>
                          Trip: <strong>{bookingType}</strong>
                        </p>
                        <p>
                          Distance: <strong>{distance} KM</strong>
                        </p>
                        <p>
                          Base Fare: <strong>₹{fare}</strong>
                        </p>
                        <p>
                          Discount:{" "}
                          <strong className="text-red-600">-₹{discount}</strong>
                        </p>

                        <hr className="my-3" />

                        <p className="text-xl font-black text-green-700">
                          Final Fare: ₹{finalFare}
                        </p>
                      </div>
                    </div>
                  )}

                  <a
                    href={whatsappUrl}
                    onClick={openReviewPopup}
                    className="block rounded-xl bg-orange-500 py-4 text-center font-bold text-white hover:bg-orange-600"
                  >
                    Book On WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-2 gap-5 text-center md:grid-cols-4">
              <div>
                <p className="text-3xl font-black text-orange-600">1000+</p>
                <p className="text-slate-600">Trips Completed</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-600">24×7</p>
                <p className="text-slate-600">Support</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-600">100%</p>
                <p className="text-slate-600">Transparent Fare</p>
              </div>
              <div>
                <p className="text-3xl font-black text-orange-600">4.9★</p>
                <p className="text-slate-600">Customer Rating</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black">Popular Taxi Routes</h2>
            <p className="mt-4 text-slate-600">
              Most booked routes across Chhattisgarh
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularRoutes.map((route) => (
              <Link
                key={route.title}
                href={route.link}
                className="rounded-3xl border bg-white p-6 transition hover:border-orange-500 hover:shadow-lg"
              >
                <h3 className="text-xl font-black">{route.title}</h3>
                <p className="mt-3 font-bold text-orange-600">
                  Starting {route.fare}
                </p>
                <p className="mt-4 text-slate-500">View Route →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-14 text-center">
              <h2 className="text-4xl font-black md:text-5xl">
                Why Choose Khatu Rides Travels?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Trusted by travelers across Chhattisgarh for airport transfers,
                one-way taxi bookings, corporate travel and family trips.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <ShieldCheck className="mb-4 text-orange-500" size={40} />
                <h3 className="text-xl font-black">Safe & Reliable</h3>
                <p className="mt-3 text-slate-600">
                  Professional service with customer-first approach.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <Clock3 className="mb-4 text-orange-500" size={40} />
                <h3 className="text-xl font-black">On-Time Pickup</h3>
                <p className="mt-3 text-slate-600">
                  Airport and city pickups without delays.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <Star className="mb-4 text-orange-500" size={40} />
                <h3 className="text-xl font-black">Transparent Pricing</h3>
                <p className="mt-3 text-slate-600">
                  No hidden charges. Clear fare information.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <Phone className="mb-4 text-orange-500" size={40} />
                <h3 className="text-xl font-black">Quick Support</h3>
                <p className="mt-3 text-slate-600">
                  Call or WhatsApp for instant booking assistance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-black md:text-5xl">
              Available Vehicles
            </h2>
            <p className="mt-4 text-slate-600">
              Comfortable vehicles for every travel need
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.name}
                className="overflow-hidden rounded-3xl border bg-white shadow-lg"
              >
                <div className="relative h-56">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black">{vehicle.name}</h3>
                  <p className="mt-2 font-semibold text-orange-600">
                    {vehicle.type}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-100 p-3">
                      <p className="text-xs text-slate-500">Seats</p>
                      <p className="font-bold">{vehicle.seats}</p>
                    </div>
                    <div className="rounded-xl bg-slate-100 p-3">
                      <p className="text-xs text-slate-500">Luggage</p>
                      <p className="font-bold">{vehicle.luggage}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Starting</p>
                      <p className="text-xl font-black text-orange-600">
                        {vehicle.price}
                      </p>
                    </div>

                    <a
                      href={whatsappUrl}
                      onClick={openReviewPopup}
                      className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white"
                    >
                      Book
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <Plane size={60} className="text-orange-500" />
                <h2 className="mt-6 text-4xl font-black md:text-5xl">
                  Raipur Airport Taxi Service
                </h2>
                <p className="mt-6 leading-8 text-slate-300">
                  Book airport pickup and drop services from Swami Vivekananda
                  Airport to Korba, Bilaspur, Raigarh and other destinations
                  across Chhattisgarh.
                </p>
                <Link
                  href="/routes/raipur-airport-taxi"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold"
                >
                  Explore Airport Taxi
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <ul className="space-y-5">
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-green-400" />
                    Flight Tracking Support
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-green-400" />
                    Direct Airport Pickup
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-green-400" />
                    Comfortable Luggage Space
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="text-green-400" />
                    Advance Booking Available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-10 text-white">
            <Building2 size={52} />
            <h2 className="mt-6 text-4xl font-black">
              Corporate Travel Solutions
            </h2>
            <p className="mt-4 max-w-3xl leading-8 text-white/90">
              Dedicated taxi services for businesses, factories, project sites,
              consultants, executives and repeat monthly travelers across
              Chhattisgarh.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:9244137353"
                className="rounded-2xl bg-white px-8 py-4 font-bold text-orange-600"
              >
                Discuss Corporate Rates
              </a>

              <a
                href={whatsappUrl}
                onClick={openReviewPopup}
                className="rounded-2xl border border-white px-8 py-4 font-bold"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-black md:text-5xl">
                Areas We Serve
              </h2>
              <p className="mt-4 text-slate-600">
                Taxi services available across major cities of Chhattisgarh
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[
                "Raipur",
                "Korba",
                "Bilaspur",
                "Raigarh",
                "Bhilai",
                "Durg",
                "Ambikapur",
                "Jagdalpur",
                "Raipur Airport",
                "Champa",
                "Katghora",
                "Pendra",
              ].map((city) => (
                <div
                  key={city}
                  className="rounded-2xl border bg-white p-4 text-center font-semibold"
                >
                  {city}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-14 text-center">
              <h2 className="text-4xl font-black md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="mt-4 text-slate-600">
                Trusted by travelers across Chhattisgarh
              </p>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex w-max gap-6 animate-[scroll_45s_linear_infinite]">
                {[...reviews, ...reviews].map((review, index) => (
                  <div
                    key={`${review.name}-${index}`}
                    className="w-[320px] flex-shrink-0 rounded-3xl border bg-slate-50 p-6 shadow-sm"
                  >
                    <div className="mb-4 flex gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>

                    <p className="leading-7 text-slate-600">{review.review}</p>

                    <div className="mt-5">
                      <h3 className="font-black">{review.name}</h3>
                      <p className="text-sm text-slate-500">{review.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-14 text-center">
              <h2 className="text-4xl font-black md:text-5xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border bg-white p-6">
                  <h3 className="text-lg font-black">{faq.q}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="rounded-3xl border bg-white p-8 md:p-12">
            <h2 className="mb-8 text-4xl font-black">
              Taxi Service Across Chhattisgarh
            </h2>

            <div className="space-y-6 leading-8 text-slate-600">
              <p>
                Khatu Rides Travels provides professional taxi services across
                Chhattisgarh including Raipur, Korba, Bilaspur, Raigarh,
                Bhilai, Durg, Ambikapur and Jagdalpur.
              </p>

              <p>
                Whether you need a one-way taxi, airport transfer, round trip
                booking or corporate travel solution, our goal is to provide
                safe, comfortable and reliable transportation at transparent
                pricing.
              </p>

              <p>
                We serve individual travelers, families, business professionals,
                corporate clients and tourists looking for dependable
                transportation throughout Chhattisgarh.
              </p>

              <p>
                Popular routes include Raipur to Korba Taxi, Raipur to Bilaspur
                Taxi, Raipur Airport Taxi, Korba to Bilaspur Taxi and Raipur to
                Raigarh Taxi.
              </p>

              <p>
                Customers can easily book through phone call or WhatsApp and
                receive quick fare details, route guidance and vehicle
                availability.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center">
            <h2 className="text-4xl font-black md:text-6xl">
              Ready To Book Your Taxi?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Get fare, availability and booking confirmation in less than 2
              minutes.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={whatsappUrl}
                onClick={openReviewPopup}
                className="rounded-2xl bg-orange-500 px-8 py-4 font-bold transition hover:bg-orange-600"
              >
                WhatsApp Now
              </a>

              <a
                href="tel:9244137353"
                className="rounded-2xl border border-white px-8 py-4 font-bold"
              >
                Call 9244137353
              </a>
            </div>
          </div>
        </section>

        <a
          href={whatsappUrl}
          onClick={openReviewPopup}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-2xl hover:bg-green-600"
        >
          <MessageCircle size={22} />
          <span className="hidden md:block">WhatsApp</span>
        </a>

        {showReviewPopup && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4"
            onClick={closeReviewPopup}
          >
            <div
              ref={popupRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-popup-title"
              aria-describedby="review-popup-desc"
              className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                    Special Offer
                  </p>
                  <h3
                    id="review-popup-title"
                    className="mt-1 text-xl font-black text-slate-900"
                  >
                    Get booking bonus
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeReviewPopup}
                  aria-label="Close popup"
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <Gift size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-slate-900">
                      Review do, next trip par cash discount pao
                    </p>
                    <p
                      id="review-popup-desc"
                      className="mt-1 text-xs leading-5 text-slate-600"
                    >
                      Screenshot WhatsApp karein aur offer claim karein.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <a
                  href={GOOGLE_REVIEW_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Give Google Review
                </a>

                <button
                  type="button"
                  onClick={continueToWhatsApp}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
                >
                  Continue to WhatsApp
                </button>
              </div>

              <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">
                Review ke baad screenshot WhatsApp bhejkar bonus claim karein.
              </p>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </main>
    </>
  );
}
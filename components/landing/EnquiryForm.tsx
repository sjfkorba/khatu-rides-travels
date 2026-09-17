"use client";

import { FormEvent, useState } from "react";
import {
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  User,
} from "lucide-react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const PHONE = "9244137353";

const TRIP_TYPES = [
  "One Way",
  "Round Trip",
  "Airport Transfer",
  "Local",
  "Outstation",
  "Tour Package",
];

const VEHICLE_TYPES = [
  "Any Suitable Vehicle",
  "Maruti Dzire",
  "Maruti Ertiga",
  "Toyota Innova",
  "Toyota Innova Crysta",
  "Mahindra Scorpio",
  "Mahindra Bolero",
];

type FormData = {
  tripType: string;
  vehicleType: string;
  from: string;
  to: string;
  date: string;
  time: string;
  name: string;
  phone: string;
};

const INITIAL_FORM: FormData = {
  tripType: "",
  vehicleType: "",
  from: "",
  to: "",
  date: "",
  time: "",
  name: "",
  phone: "",
};

export default function EnquiryForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    /* -------------------------------------------------------------- */
    /* Validation                                                      */
    /* -------------------------------------------------------------- */

    if (!form.tripType) {
      setError("Please select your trip type.");
      return;
    }

    if (!form.vehicleType) {
      setError("Please select your preferred vehicle.");
      return;
    }

    if (!form.from.trim()) {
      setError("Please enter your pickup location.");
      return;
    }

    if (!form.to.trim()) {
      setError("Please enter your destination.");
      return;
    }

    if (!form.date) {
      setError("Please select your travel date.");
      return;
    }

    if (!form.time) {
      setError("Please select your travel time.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    /* -------------------------------------------------------------- */
    /* Prevent duplicate submit                                       */
    /* -------------------------------------------------------------- */

    if (loading) return;

    setLoading(true);

    try {
      /* ------------------------------------------------------------ */
      /* Firestore                                                     */
      /* ------------------------------------------------------------ */

      await addDoc(
        collection(db, "website_enquiries"),
        {
          tripType: form.tripType,
          vehicleType: form.vehicleType,

          from: form.from.trim(),
          to: form.to.trim(),

          travelDate: form.date,
          travelTime: form.time,

          name: form.name.trim(),
          phone: cleanPhone,

          /* Useful for admin/CRM */
          status: "new",
          source: "website",
          page: window.location.pathname,

          createdAt: serverTimestamp(),

          /* Human readable information */
          enquirySummary: `${form.tripType} | ${form.from.trim()} → ${form.to.trim()} | ${form.date} ${form.time}`,
        }
      );

      /* ------------------------------------------------------------ */
      /* Success                                                       */
      /* ------------------------------------------------------------ */

      setSuccess(true);

      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Website enquiry error:", err);

      setError(
        "Something went wrong while submitting your enquiry. Please try again or call us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Success Screen                                                   */
  /* ---------------------------------------------------------------- */

  if (success) {
    return (
      <section
        id="enquiry"
        className="relative overflow-hidden rounded-[30px] bg-[#071A3A] p-6 text-white shadow-[0_25px_70px_rgba(7,26,58,0.18)] sm:p-10"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex min-h-[360px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_15px_40px_rgba(16,185,129,0.35)]">
            <CheckCircle2
              size={42}
              strokeWidth={2.5}
            />
          </div>

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
            Enquiry Received
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Thank You!
          </h2>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            Your travel enquiry has been successfully submitted.
            Our booking team will contact you shortly to confirm the
            vehicle, fare and travel details.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:+91${PHONE}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 text-sm font-black text-slate-950 shadow-lg transition hover:bg-amber-300"
            >
              <Phone
                size={17}
                fill="currentColor"
              />
              Call Us
            </a>

            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
            >
              <Send size={16} />
              New Enquiry
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Main Form                                                        */
  /* ---------------------------------------------------------------- */

  return (
    <section
      id="enquiry"
      className="relative overflow-hidden rounded-[30px] bg-[#071A3A] p-4 text-white shadow-[0_25px_70px_rgba(7,26,58,0.18)] sm:p-7 lg:p-9"
    >
      {/* ------------------------------------------------------------ */}
      {/* Background                                                    */}
      {/* ------------------------------------------------------------ */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative">
        {/* ---------------------------------------------------------- */}
        {/* Heading                                                     */}
        {/* ---------------------------------------------------------- */}

        <div className="mb-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Quick Enquiry
          </span>

          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            Tell Us About Your{" "}
            <span className="text-amber-300">
              Journey
            </span>
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Share your travel details and our booking team will
            contact you with suitable vehicle options and the latest
            fare.
          </p>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Form                                                        */}
        {/* ---------------------------------------------------------- */}

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-3 backdrop-blur-md sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* -------------------------------------------------- */}
              {/* Trip Type                                           */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="tripType"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Trip Type
                </label>

                <div className="relative">
                  <Car
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <select
                    id="tripType"
                    value={form.tripType}
                    onChange={(e) =>
                      updateField(
                        "tripType",
                        e.target.value
                      )
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                  >
                    <option
                      value=""
                      className="text-slate-900"
                    >
                      Select Trip Type
                    </option>

                    {TRIP_TYPES.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="text-slate-900"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* Vehicle Type                                        */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="vehicleType"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Vehicle Type
                </label>

                <div className="relative">
                  <Car
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <select
                    id="vehicleType"
                    value={form.vehicleType}
                    onChange={(e) =>
                      updateField(
                        "vehicleType",
                        e.target.value
                      )
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                  >
                    <option
                      value=""
                      className="text-slate-900"
                    >
                      Select Vehicle
                    </option>

                    {VEHICLE_TYPES.map((vehicle) => (
                      <option
                        key={vehicle}
                        value={vehicle}
                        className="text-slate-900"
                      >
                        {vehicle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* From                                                  */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="from"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Pickup From
                </label>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <input
                    id="from"
                    type="text"
                    value={form.from}
                    onChange={(e) =>
                      updateField(
                        "from",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Korba"
                    autoComplete="street-address"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white placeholder:text-white/30 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                  />
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* To                                                    */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="to"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Destination
                </label>

                <div className="relative">
                  <Navigation
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <input
                    id="to"
                    type="text"
                    value={form.to}
                    onChange={(e) =>
                      updateField(
                        "to",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Raipur"
                    autoComplete="off"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white placeholder:text-white/30 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                  />
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* Date                                                  */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Travel Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      updateField(
                        "date",
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* Time                                                  */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Travel Time
                </label>

                <div className="relative">
                  <Clock3
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      updateField(
                        "time",
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* Name                                                  */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Your Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white placeholder:text-white/30 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                  />
                </div>
              </div>

              {/* -------------------------------------------------- */}
              {/* Phone                                                 */}
              {/* -------------------------------------------------- */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-[9px] font-black uppercase tracking-[0.16em] text-white/55"
                >
                  Contact Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-300"
                  />

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) =>
                      updateField(
                        "phone",
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="10-digit mobile"
                    autoComplete="tel"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.08] pl-10 pr-3 text-xs font-bold text-white placeholder:text-white/30 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                  />
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* Error                                                    */}
            {/* ------------------------------------------------------ */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-200">
                {error}
              </div>
            )}

            {/* ------------------------------------------------------ */}
            {/* Submit                                                   */}
            {/* ------------------------------------------------------ */}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2 text-[9px] font-semibold leading-4 text-white/40">
                <MessageCircle
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span>
                  Submit your details and our team will contact you
                  shortly.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 text-xs font-black uppercase tracking-[0.08em] text-slate-950 shadow-[0_12px_35px_rgba(245,158,11,0.22)] transition hover:-translate-y-0.5 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Enquiry
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ---------------------------------------------------------- */}
        {/* Bottom Trust                                               */}
        {/* ---------------------------------------------------------- */}

        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-center">
          <span className="text-[9px] font-bold text-white/35">
            ✓ Private Cab
          </span>

          <span className="text-[9px] font-bold text-white/35">
            ✓ Flexible Pickup
          </span>

          <span className="text-[9px] font-bold text-white/35">
            ✓ 24×7 Booking Support
          </span>
        </div>
      </div>
    </section>
  );
}
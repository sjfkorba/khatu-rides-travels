// components/FareCalculator.tsx

"use client";

import { useMemo, useState } from "react";
import {
  BookingType,
  FareFormData,
  VehicleType,
  VEHICLES,
  buildWhatsAppFareMessage,
  calculateFare,
  formatCurrency,
  getBookingTypeLabel,
  getVehicleLabel,
  validateFareForm,
} from "@/lib/fare";

const ADMIN_WHATSAPP_NUMBER = "91XXXXXXXXXX";

const initialForm: FareFormData = {
  pickupLocation: "",
  dropLocation: "",
  pickupDate: "",
  pickupTime: "",
  distance: 0,
  vehicleType: "sedan",
  bookingType: "oneway",
};

export default function FareCalculator() {
  const [formData, setFormData] = useState<FareFormData>(initialForm);
  const [touched, setTouched] = useState(false);

  const fareResult = useMemo(() => {
    if (!formData.distance || formData.distance <= 0) return null;

    return calculateFare({
      distance: Number(formData.distance),
      vehicleType: formData.vehicleType,
      bookingType: formData.bookingType,
    });
  }, [formData.distance, formData.vehicleType, formData.bookingType]);

  const validation = useMemo(() => validateFareForm(formData), [formData]);

  const canSendWhatsApp = Boolean(validation.isValid && fareResult);

  const handleChange = (
    key: keyof FareFormData,
    value: string | number | VehicleType | BookingType
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "distance" ? Number(value) : value,
    }));
  };

  const handleWhatsAppClick = () => {
    setTouched(true);

    if (!fareResult || !validation.isValid) return;

    const rawMessage = buildWhatsAppFareMessage(formData, fareResult);
    const encodedMessage = encodeURIComponent(rawMessage);
    const waLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(waLink, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="w-full bg-white py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 overflow-hidden rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 via-lime-50 to-emerald-50 shadow-sm md:hidden">
          <div className="offer-marquee flex w-max items-center gap-8 px-4 py-2 text-xs font-semibold text-emerald-700">
            <span>140+ km rides par 18% OFF</span>
            <span>One Way Taxi Best Fare</span>
            <span>Local • Outstation • Roundtrip</span>
            <span>Instant Fare Estimate on WhatsApp</span>
            <span>Safe • Quick • Professional Booking</span>

            <span>140+ km rides par 18% OFF</span>
            <span>One Way Taxi Best Fare</span>
            <span>Local • Outstation • Roundtrip</span>
            <span>Instant Fare Estimate on WhatsApp</span>
            <span>Safe • Quick • Professional Booking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-5">
              <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Get Fare Estimate
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                Book your ride with instant estimate
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Fill complete details to generate a clean fare estimate and send
                it directly on WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor="pickupLocation">Pick-up Location</Label>
                <Input
                  id="pickupLocation"
                  placeholder="Enter pick-up point"
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    handleChange("pickupLocation", e.target.value)
                  }
                />
              </Field>

              <Field>
                <Label htmlFor="dropLocation">Drop Location</Label>
                <Input
                  id="dropLocation"
                  placeholder="Enter drop point"
                  value={formData.dropLocation}
                  onChange={(e) => handleChange("dropLocation", e.target.value)}
                />
              </Field>

              <Field>
                <Label htmlFor="pickupDate">Pick-up Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => handleChange("pickupDate", e.target.value)}
                />
              </Field>

              <Field>
                <Label htmlFor="pickupTime">Pick-up Time</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) => handleChange("pickupTime", e.target.value)}
                />
              </Field>

              <Field>
                <Label htmlFor="distance">Total Approx Distance (KM)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="1"
                  placeholder="Example: 165"
                  value={formData.distance || ""}
                  onChange={(e) => handleChange("distance", e.target.value)}
                />
              </Field>

              <Field>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) =>
                    handleChange("vehicleType", e.target.value as VehicleType)
                  }
                >
                  {Object.entries(VEHICLES).map(([key, vehicle]) => (
                    <option key={key} value={key}>
                      {vehicle.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field className="sm:col-span-2">
                <Label htmlFor="bookingType">Ride Type</Label>
                <Select
                  id="bookingType"
                  value={formData.bookingType}
                  onChange={(e) =>
                    handleChange("bookingType", e.target.value as BookingType)
                  }
                >
                  <option value="oneway">One Way</option>
                  <option value="roundtrip">Round Trip</option>
                  <option value="local">Local</option>
                  <option value="outstation">Outstation</option>
                </Select>
              </Field>
            </div>

            {touched && !validation.isValid && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  Please complete all required details:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-600">
                  {validation.errors.map((error) => (
                    <li key={error}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setTouched(true)}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
              >
                Calculate Fare
              </button>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                disabled={!canSendWhatsApp}
                className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition sm:w-auto ${
                  canSendWhatsApp
                    ? "bg-green-600 hover:bg-green-700"
                    : "cursor-not-allowed bg-gray-300"
                }`}
              >
                Send on WhatsApp
              </button>
            </div>
          </div>

          <div
            id="fare-estimate-card"
            className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm md:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Fare Estimate
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  Trip summary card
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Review all trip details before sending.
                </p>
              </div>

              {fareResult?.discountApplied && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  18% Discount Applied
                </span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailCard
                label="Pick-up Location"
                value={formData.pickupLocation || "—"}
              />
              <DetailCard
                label="Drop Location"
                value={formData.dropLocation || "—"}
              />
              <DetailCard label="Pick-up Date" value={formData.pickupDate || "—"} />
              <DetailCard label="Pick-up Time" value={formData.pickupTime || "—"} />
              <DetailCard
                label="Approx Distance"
                value={fareResult ? `${fareResult.distance} km` : "—"}
              />
              <DetailCard
                label="Vehicle Type"
                value={getVehicleLabel(formData.vehicleType)}
              />
              <DetailCard
                label="Ride Type"
                value={getBookingTypeLabel(formData.bookingType)}
              />
              <DetailCard
                label="Total Fare"
                value={fareResult ? formatCurrency(fareResult.fare) : "—"}
              />

              {fareResult?.discountApplied && (
                <DetailCard
                  label="Discount Amount"
                  value={`- ${formatCurrency(fareResult.discount)}`}
                  valueClassName="text-emerald-600"
                />
              )}

              <DetailCard
                label="Net Payable"
                value={fareResult ? formatCurrency(fareResult.finalFare) : "—"}
                valueClassName="text-gray-900"
                highlight
              />
            </div>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">Important Notes</p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                {(fareResult?.remarks ?? [
                  "Toll Tax Extra",
                  "Parking Charges Extra",
                  "Night Halt extra if applicable",
                  "Driver fooding & allowance extra for round trips",
                ]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .offer-marquee {
          animation: offerTicker 18s linear infinite;
          white-space: nowrap;
        }

        @keyframes offerTicker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .offer-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function Field({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-gray-800"
    >
      {children}
    </label>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
    />
  );
}

function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${className}`}
    >
      {children}
    </select>
  );
}

function DetailCard({
  label,
  value,
  valueClassName = "text-gray-900",
  highlight = false,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-gray-100 bg-gray-50"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
        {label}
      </p>
      <p className={`mt-2 text-sm font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}
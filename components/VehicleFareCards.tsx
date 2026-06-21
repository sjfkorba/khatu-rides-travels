"use client";

import { formatCurrency, type BookingType } from "@/lib/fareCalculator";
import Image from "next/image";

const ADMINWHATSAPPNUMBER = "919244137353";

type CardItem = {
  label: string;
  value: string;
  image: string;
  seats: string;
  fare: number;
  fareText: string;
};

type Props = {
  bookingType: BookingType;
  pickup: string;
  drop: string;
  distance: number;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  cards: CardItem[];
};

function getTripLabel(type: BookingType) {
  if (type === "oneway") return "One Way";
  if (type === "roundtrip") return "Round Trip";
  return "Local Rental";
}

export default function VehicleFareCards({
  bookingType,
  pickup,
  drop,
  distance,
  pickupDate,
  pickupTime,
  returnDate,
  returnTime,
  cards,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5">
        <h3 className="text-2xl font-black text-slate-900">Available Cab Fare</h3>
        <p className="mt-2 text-sm text-slate-600">
          Route: {pickup} → {drop} | {distance} KM | {getTripLabel(bookingType)}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((vehicle) => {
          const whatsappMessage = [
            "Hello Khatu Rides Travels Co, please confirm my booking.",
            `Trip Type: ${getTripLabel(bookingType)}`,
            `Pickup: ${pickup}`,
            `Drop: ${drop}`,
            `Pickup Date: ${pickupDate}`,
            `Pickup Time: ${pickupTime}`,
            bookingType === "oneway" || bookingType === "roundtrip"
              ? `End Date: ${returnDate}`
              : null,
            bookingType === "oneway" || bookingType === "roundtrip"
              ? `End Time: ${returnTime}`
              : null,
            `Distance: ${distance} KM`,
            `Vehicle: ${vehicle.label}`,
            `Estimated Fare: ${formatCurrency(vehicle.fare)}`,
          ]
            .filter(Boolean)
            .join("\n");

          const whatsappUrl = `https://wa.me/${ADMINWHATSAPPNUMBER}?text=${encodeURIComponent(
            whatsappMessage
          )}`;

          return (
            <div
              key={vehicle.value}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-52 bg-slate-100">
                <Image
                  src={vehicle.image}
                  alt={vehicle.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-black text-slate-900">
                      {vehicle.label}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">{vehicle.seats}</p>
                  </div>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    {getTripLabel(bookingType)}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                  <div className="text-xs uppercase tracking-widest text-orange-300">
                    Estimated Fare
                  </div>
                  <div className="mt-2 text-3xl font-black text-orange-400">
                    {vehicle.fareText}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Route distance: {distance} KM</p>
                  <p>Pickup: {pickup}</p>
                  <p>Drop: {drop}</p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Book Now
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
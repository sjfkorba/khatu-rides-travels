import type { Metadata } from "next";
import {
  FileText,
  ShieldCheck,
  Car,
  CreditCard,
  AlertTriangle,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Khatu Rides Travels",
  description:
    "Terms and Conditions for taxi booking, payments, cancellations and travel services offered by Khatu Rides Travels.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <FileText size={16} />
            Booking & Service Terms
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black">
            Terms & Conditions
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            These terms govern all taxi bookings,
            payments and travel services provided by
            Khatu Rides Travels across Chhattisgarh.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-xl bg-white/10 px-4 py-2 text-sm">
              Updated: {new Date().toLocaleDateString("en-IN")}
            </span>

            <span className="rounded-xl bg-white/10 px-4 py-2 text-sm">
              www.khaturidescg.in
            </span>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">

        <TermsCard
          icon={<ShieldCheck />}
          title="1. Booking Confirmation"
        >
          A booking is considered confirmed only after
          receiving confirmation from Khatu Rides Travels.
          Vehicle allocation may depend on availability.
        </TermsCard>

        <TermsCard
          icon={<CreditCard />}
          title="2. Advance Payment"
        >
          Certain bookings may require advance payment.
          Advance amount once paid may be adjusted against
          the final bill unless otherwise agreed.
        </TermsCard>

        <TermsCard
          icon={<Car />}
          title="3. Vehicle Allocation"
        >
          While we try to provide the requested vehicle,
          vehicle model may be changed with an equivalent
          or higher category vehicle in exceptional situations.
        </TermsCard>

        <TermsCard
          icon={<Car />}
          title="4. Travel Charges"
        >
          Final charges may vary depending on route,
          waiting time, toll tax, parking charges,
          night charges or additional customer requests.
        </TermsCard>

        <TermsCard
          icon={<AlertTriangle />}
          title="5. Delays & Unforeseen Circumstances"
        >
          Khatu Rides Travels shall not be held responsible
          for delays caused by weather conditions, traffic,
          road closures, accidents, government restrictions
          or other circumstances beyond our control.
        </TermsCard>

        <TermsCard
          icon={<ShieldCheck />}
          title="6. Customer Responsibilities"
        >
          Customers must provide accurate pickup location,
          travel date, passenger details and contact
          information while making a booking.
        </TermsCard>

        <TermsCard
          icon={<AlertTriangle />}
          title="7. Damage & Misuse"
        >
          Customers may be held responsible for damage,
          excessive cleaning requirements or misuse of
          the vehicle during the trip.
        </TermsCard>

        <TermsCard
          icon={<Phone />}
          title="8. Communication"
        >
          Customers agree to receive booking-related
          communication through phone calls, WhatsApp
          messages and SMS.
        </TermsCard>

        <TermsCard
          icon={<ShieldCheck />}
          title="9. Limitation of Liability"
        >
          Our liability is limited to the amount paid
          for the booking. We are not responsible for
          indirect losses, missed appointments or
          consequential damages.
        </TermsCard>

        <TermsCard
          icon={<FileText />}
          title="10. Updates to Terms"
        >
          Khatu Rides Travels reserves the right to
          modify these terms at any time without prior
          notice. Updated terms will be published on
          this website.
        </TermsCard>

        {/* Contact */}

        <div className="bg-white rounded-3xl border border-slate-200 p-8">

          <h2 className="text-3xl font-black mb-6">
            Contact Information
          </h2>

          <div className="space-y-4 text-slate-700">

            <p>
              <strong>Khatu Rides Travels</strong>
            </p>

            <p>
              Phone: +91 9244137353
            </p>

            <p>
              Website:
              <a
                href="https://www.khaturidescg.in"
                className="ml-2 text-orange-600 font-semibold"
              >
                www.khaturidescg.in
              </a>
            </p>

            <p>
              Service Area: Chhattisgarh, India
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-orange-600 text-white">

        <div className="max-w-6xl mx-auto px-6 py-16 text-center">

          <h2 className="text-4xl font-black">
            Ready To Book Your Taxi?
          </h2>

          <p className="mt-4 text-white/90">
            Airport transfers, one-way taxi,
            round trips and corporate travel.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <a
              href="https://wa.me/919244137353"
              className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold"
            >
              WhatsApp Now
            </a>

            <a
              href="tel:9244137353"
              className="border border-white px-8 py-4 rounded-2xl font-bold"
            >
              Call 9244137353
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}

function TermsCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition">

      <div className="flex items-center gap-3 mb-5">

        <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
          {icon}
        </div>

        <h2 className="text-2xl font-black">
          {title}
        </h2>

      </div>

      <div className="text-slate-600 leading-8">
        {children}
      </div>

    </div>
  );
}
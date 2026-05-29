import type { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  Database,
  Phone,
  Globe,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Khatu Rides Travels",
  description:
    "Privacy Policy of Khatu Rides Travels regarding customer information, bookings, payments, WhatsApp communication and website usage.",
};

const collectedData = [
  "Customer Name",
  "Mobile Number",
  "Pickup Location",
  "Drop Location",
  "Travel Date & Time",
  "Booking Details",
  "Payment Records",
  "WhatsApp Communication",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <ShieldCheck size={16} />
            Legal & Privacy Information
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black">
            Privacy Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            At Khatu Rides Travels, we respect your privacy and
            are committed to protecting your information.
            This Privacy Policy explains how we collect,
            use and protect customer data while providing
            taxi and travel services across Chhattisgarh.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
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

        {/* Commitment */}

        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
          <h2 className="text-3xl font-black">
            Our Commitment to Privacy
          </h2>

          <p className="mt-4 text-white/90 leading-8">
            We never sell customer information.
            Your booking details, contact information,
            payment records and travel information are
            used only for booking management, travel
            coordination and customer support.
          </p>
        </div>

        {/* Introduction */}

        <PolicyCard
          icon={<ShieldCheck />}
          title="1. Introduction"
        >
          Khatu Rides Travels collects limited customer
          information required for taxi bookings,
          travel coordination, payment tracking and
          customer support.
        </PolicyCard>

        {/* Data Collection */}

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
              <Database />
            </div>

            <h2 className="text-2xl font-black">
              2. Information We Collect
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {collectedData.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border p-4"
              >
                <CheckCircle2 className="text-green-600" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Usage */}

        <PolicyCard
          icon={<Globe />}
          title="3. How We Use Information"
        >
          Customer information may be used for booking
          confirmation, travel planning, driver coordination,
          customer support, payment tracking, dispute resolution
          and service improvement.
        </PolicyCard>

        {/* Payments */}

        <PolicyCard
          icon={<Lock />}
          title="4. Payment Information"
        >
          Payment information may be maintained internally
          for booking verification, accounting purposes and
          customer ledger management. We do not sell or share
          customer payment information with third parties.
        </PolicyCard>

        {/* Data Protection */}

        <PolicyCard
          icon={<ShieldCheck />}
          title="5. Data Protection & Security"
        >
          We take reasonable measures to protect customer
          information stored in our systems and databases.
          While we strive to secure all information, no
          online platform can guarantee absolute security.
        </PolicyCard>

        {/* Cookies */}

        <PolicyCard
          icon={<Database />}
          title="6. Cookies & Analytics"
        >
          Our website may use cookies, analytics tools
          and visitor tracking systems to improve website
          performance, understand visitor behaviour and
          enhance customer experience.
        </PolicyCard>

        {/* WhatsApp */}

        <PolicyCard
          icon={<Phone />}
          title="7. WhatsApp & Phone Communication"
        >
          By contacting us through WhatsApp, phone calls,
          website forms or direct enquiries, you consent
          to communication regarding bookings, quotations,
          customer support and travel services.
        </PolicyCard>

        {/* Rights */}

        <PolicyCard
          icon={<ShieldCheck />}
          title="8. Customer Rights"
        >
          Customers may request correction of inaccurate
          information by contacting us directly. We may
          update customer records to maintain accurate
          booking and payment information.
        </PolicyCard>

        {/* Security Highlight */}

        <div className="rounded-3xl bg-slate-900 text-white p-8">
          <h2 className="text-3xl font-black">
            Data Security
          </h2>

          <p className="mt-4 text-slate-300 leading-8">
            Customer trust is extremely important to us.
            We maintain reasonable security practices
            for booking information, customer records,
            travel details and payment tracking.
          </p>
        </div>

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
            Need a Taxi in Chhattisgarh?
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

function PolicyCard({
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
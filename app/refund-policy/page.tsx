import type { Metadata } from "next";
import {
  RotateCcw,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Khatu Rides Travels",
  description:
    "Cancellation and Refund Policy for taxi bookings made with Khatu Rides Travels.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <RotateCcw size={16} />
            Cancellation & Refund Policy
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black">
            Refund Policy
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            This policy explains cancellation charges,
            advance payment handling and refund rules
            applicable to bookings made with Khatu Rides Travels.
          </p>

        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">

        <PolicyCard
          icon={<ShieldCheck />}
          title="1. Booking Confirmation"
        >
          A booking is considered confirmed only after
          receiving confirmation from Khatu Rides Travels
          and any required advance payment.
        </PolicyCard>

        <PolicyCard
          icon={<CreditCard />}
          title="2. Advance Payment Policy"
        >
          Advance payments are collected to reserve the
          vehicle and block travel dates. Therefore,
          advance payments are generally non-refundable
          unless cancellation is initiated by Khatu Rides Travels.
        </PolicyCard>

        <PolicyCard
          icon={<RotateCcw />}
          title="3. Cancellation More Than 48 Hours Before Journey"
        >
          Cancellation requests made more than 48 hours
          before the scheduled pickup time may be eligible
          for partial refund after deducting administrative
          and reservation charges.
        </PolicyCard>

        <PolicyCard
          icon={<RotateCcw />}
          title="4. Cancellation Within 48 Hours"
        >
          Cancellations made within 48 hours of the pickup
          time may result in forfeiture of the advance amount,
          as the vehicle and driver remain reserved exclusively
          for the booking.
        </PolicyCard>

        <PolicyCard
          icon={<AlertTriangle />}
          title="5. Same-Day Cancellation"
        >
          No refund shall be provided for same-day
          cancellations or if the customer fails to
          report at the agreed pickup location and time.
        </PolicyCard>

        <PolicyCard
          icon={<AlertTriangle />}
          title="6. Driver Dispatch or Vehicle Departure"
        >
          Once the driver has been assigned, dispatched,
          or the vehicle has started for pickup,
          no refund will be applicable.
        </PolicyCard>

        <PolicyCard
          icon={<ShieldCheck />}
          title="7. Company-Initiated Cancellation"
        >
          If Khatu Rides Travels is unable to provide
          the booked service due to operational reasons,
          any advance amount received from the customer
          will be refunded or adjusted against a future booking.
        </PolicyCard>

        <PolicyCard
          icon={<CreditCard />}
          title="8. Refund Processing Time"
        >
          Approved refunds, if any, may take
          5–10 business days to reflect depending
          on the payment method and banking system.
        </PolicyCard>

        <PolicyCard
          icon={<ShieldCheck />}
          title="9. Route Changes & Rescheduling"
        >
          Customers may request rescheduling subject
          to vehicle availability. Approval of rescheduling
          requests remains at the sole discretion of
          Khatu Rides Travels.
        </PolicyCard>

        <PolicyCard
          icon={<Phone />}
          title="10. Contact Us"
        >
          For cancellation and refund-related queries,
          contact us directly:

          <div className="mt-4 space-y-2">
            <p>
              <strong>Khatu Rides Travels</strong>
            </p>

            <p>
              Phone: +91 9244137353
            </p>

            <p>
              Website:
              {" "}
              <a
                href="https://www.khaturidescg.in"
                className="text-orange-600 font-semibold"
              >
                www.khaturidescg.in
              </a>
            </p>
          </div>
        </PolicyCard>

      </section>

      {/* PROTECTION NOTICE */}

      <section className="max-w-5xl mx-auto px-6 pb-16">

        <div className="rounded-3xl bg-orange-600 text-white p-8">

          <h2 className="text-3xl font-black">
            Important Notice
          </h2>

          <p className="mt-4 text-white/90 leading-8">
            Vehicles are reserved exclusively for customers
            after confirmation. Last-minute cancellations
            directly impact driver schedules, vehicle
            utilization and business operations. Therefore,
            cancellation and refund decisions are governed
            by the above policy.
          </p>

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
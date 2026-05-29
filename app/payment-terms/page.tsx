import type { Metadata } from "next";
import {
  CreditCard,
  Wallet,
  Receipt,
  ShieldCheck,
  Phone,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Terms | Khatu Rides Travels",
  description:
    "Payment Terms for taxi bookings, corporate travel, advance payments and customer ledger settlements at Khatu Rides Travels.",
};

export default function PaymentTermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <CreditCard size={16} />
            Payments & Billing
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-black">
            Payment Terms
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            These payment terms govern booking advances,
            balance payments, fuel advances, corporate
            billing and customer ledger settlements for
            services provided by Khatu Rides Travels.
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
          icon={<Wallet />}
          title="1. Advance Payment"
        >
          Certain bookings may require advance payment
          to reserve the vehicle and confirm availability.
          Advance amount will be adjusted against the
          final trip bill unless otherwise specified.
        </TermsCard>

        <TermsCard
          icon={<Receipt />}
          title="2. Fuel / Diesel Advance"
        >
          For long-distance and outstation journeys,
          customers may be requested to provide partial
          payment in advance towards fuel, tolls or
          operational expenses. Such payments will be
          adjusted in the final settlement.
        </TermsCard>

        <TermsCard
          icon={<CreditCard />}
          title="3. Multiple Payment Installments"
        >
          Customers may make payments in multiple
          installments before, during or after the trip,
          subject to approval by Khatu Rides Travels.
          All payments received shall be recorded in the
          customer ledger.
        </TermsCard>

        <TermsCard
          icon={<Building2 />}
          title="4. Corporate & Monthly Clients"
        >
          Corporate clients, travel agents and repeat
          customers may receive credit facilities subject
          to mutual agreement. Outstanding balances must
          be cleared within the agreed payment period.
        </TermsCard>

        <TermsCard
          icon={<Receipt />}
          title="5. Customer Ledger Management"
        >
          Khatu Rides Travels maintains internal payment
          records and customer ledgers. Multiple bookings,
          advances and settlements may be adjusted against
          outstanding balances where applicable.
        </TermsCard>

        <TermsCard
          icon={<ShieldCheck />}
          title="6. Outstanding Payments"
        >
          Any unpaid amount remains payable by the customer.
          Khatu Rides Travels reserves the right to suspend
          future bookings until outstanding balances are
          cleared.
        </TermsCard>

        <TermsCard
          icon={<CreditCard />}
          title="7. Accepted Payment Methods"
        >
          Payments may be accepted through UPI, bank
          transfer, cash or other approved payment methods
          available at the time of booking.
        </TermsCard>

        <TermsCard
          icon={<ShieldCheck />}
          title="8. Payment Disputes"
        >
          Any billing concerns should be reported within
          7 days of trip completion. Supporting records
          and transaction details may be required to
          investigate payment disputes.
        </TermsCard>

        <TermsCard
          icon={<Receipt />}
          title="9. Invoice & Trip Records"
        >
          Trip details, payment records and booking
          information may be maintained for accounting,
          taxation, operational and customer support
          purposes.
        </TermsCard>

        <TermsCard
          icon={<Phone />}
          title="10. Contact Information"
        >
          For payment-related questions please contact:

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
        </TermsCard>

      </section>

      {/* BUSINESS NOTICE */}

      <section className="max-w-5xl mx-auto px-6 pb-16">

        <div className="rounded-3xl bg-orange-600 text-white p-8">

          <h2 className="text-3xl font-black">
            Important Payment Notice
          </h2>

          <p className="mt-4 text-white/90 leading-8">
            For operational efficiency, customer payments,
            booking advances and outstanding balances may
            be adjusted across multiple bookings under the
            same customer account or ledger where applicable.
          </p>

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
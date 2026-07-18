import type { Metadata } from "next";
import { RotateCcw, ShieldCheck, CreditCard, AlertTriangle, Phone, Banknote, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Comprehensive Cancellation & Refund Policy | Khatu Rides Travels",
  description: "Official legal policy governing cancellations, online refund processing, and cash adjustments for Khatu Rides Travels.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-orange-300 text-sm font-semibold">
            <Scale size={16} /> Legal Refund & Cancellation Terms
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-black">Official Refund Policy</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            These terms constitute a legally binding agreement between the customer and Khatu Rides Travels regarding service cancellations and refund protocols.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <PolicyCard icon={<CreditCard />} title="1. Online Refund Protocol">
          For all payments made via Razorpay, cancellations are subject to a mandatory administrative deduction. Upon successful approval of a refund request, the net amount will be credited back to the <strong>original payment method</strong> (source account) within <strong>7 working days</strong>. Please note that banks and payment gateways may vary in their processing speed.
        </PolicyCard>

        <PolicyCard icon={<AlertTriangle />} title="2. Administrative Cancellation Fees">
          Cancellation is not free of cost due to the operational expenses incurred in reserving vehicles and drivers. A non-refundable processing fee will be deducted from your advance payment based on the time of cancellation prior to the scheduled departure.
        </PolicyCard>

        <PolicyCard icon={<Banknote />} title="3. Cash Booking & Credit Policy">
          Bookings made via cash payments are non-refundable in currency format. In the event of a valid cancellation, Khatu Rides Travels will issue a <strong>"Travel Credit Note"</strong> equivalent to the refundable amount, which can be utilized for any future bookings within 6 months.
        </PolicyCard>

        <PolicyCard icon={<RotateCcw />} title="4. Cancellation Tiers & Forfeiture">
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li><strong>{'>'} 48 Hours:</strong> Eligible for refund (minus 20% admin/processing fee).</li>
            <li><strong>24 - 48 Hours:</strong> 50% of the advance amount will be forfeited.</li>
            <li><strong>{'<'} 24 Hours / No-Show:</strong> 100% of the advance amount will be forfeited.</li>
          </ul>
        </PolicyCard>

        <PolicyCard icon={<ShieldCheck />} title="5. Legal Dispute & Liability">
          By making a booking, the customer agrees that Khatu Rides Travels is not liable for indirect losses due to booking cancellations. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts in <strong>Korba, Chhattisgarh</strong>. Any attempt to initiate chargebacks via banks without exhausting our refund process will be considered a breach of contract.
        </PolicyCard>

        <PolicyCard icon={<Phone />} title="6. Grievance Redressal">
          If you are unsatisfied with the refund processing, you may escalate the issue formally:
          <div className="mt-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <p><strong>Support Email:</strong> support@khaturidescg.in</p>
            <p><strong>Official Contact:</strong> +91 9244137353</p>
            <p><strong>Office:</strong> Korba, Chhattisgarh, India</p>
          </div>
        </PolicyCard>
      </section>
    </main>
  );
}

function PolicyCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">{icon}</div>
        <h2 className="text-2xl font-black">{title}</h2>
      </div>
      <div className="text-slate-600 leading-8">{children}</div>
    </div>
  );
}
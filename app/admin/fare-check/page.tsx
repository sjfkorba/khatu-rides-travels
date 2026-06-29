// app/admin/fare-check/page.tsx
import AdminFareCalculator from "@/components/AdminFareCalculator";

export default function AdminFareCheckPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Corridor pricing verification and B2B partner payout distribution desk.
        </p>
      </div>

      {/* Main Calculator Component */}
      <main>
        <AdminFareCalculator />
      </main>
    </div>
  );
}
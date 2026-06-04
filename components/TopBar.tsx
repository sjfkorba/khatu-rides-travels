import { Phone, MessageCircle } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-3">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🚖</span>
            <span className="font-black text-base sm:text-lg tracking-wide text-center sm:text-left">
              Khatu Rides Travels
            </span>
          </div>

          {/* Mobile First CTA */}
          <div className="flex w-full sm:w-auto gap-2">

            <a
              href="tel:9244137353"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-xl font-bold transition shadow-lg"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>

            <a
              href="https://wa.me/919244137353"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-3 rounded-xl font-bold transition shadow-lg"
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}
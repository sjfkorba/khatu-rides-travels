import Link from "next/link";
import { Phone, MessageCircle, LogIn } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-slate-950 text-white border-b border-slate-800">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-3">

          {/* Brand */}

          <div className="flex items-center gap-2">

            <span className="text-xl">🚖</span>

            <span className="font-black text-lg tracking-wide">
              Khatu Rides Travels
            </span>

          </div>

          {/* Actions */}

          <div className="flex flex-wrap items-center gap-3">

            <a
              href="tel:9244137353"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-semibold transition"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>

            <a
              href="https://wa.me/919244137353"
              target="_blank"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl font-semibold transition"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-slate-600 hover:border-orange-500 px-4 py-2 rounded-xl font-semibold transition"
            >
              <LogIn size={16} />
              <span>Team Login</span>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
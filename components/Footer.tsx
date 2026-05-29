import Link from "next/link";
import {
  Car,
  Phone,
  MapPin,
  MessageCircle,
  ShieldCheck,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">

      {/* Top CTA */}

      <div className="border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">

            <div>
              <h2 className="text-3xl md:text-4xl font-black">
                Need a Taxi in Chhattisgarh?
              </h2>

              <p className="mt-3 text-white/90">
                Airport Transfers • One Way Taxi • Round Trip • Corporate Travel
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <a
                href="https://wa.me/919244137353"
                target="_blank"
                className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-bold"
              >
                WhatsApp Now
              </a>

              <a
                href="tel:9244137353"
                className="border border-white px-6 py-3 rounded-2xl font-bold"
              >
                Call Now
              </a>

            </div>

          </div>

        </div>

      </div>

      {/* Main Footer */}

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* Company */}

          <div>

            <div className="flex items-center gap-2 mb-4">
              <Car className="text-orange-500" size={24} />
              <h2 className="text-xl font-black">
                Khatu Rides Travels
              </h2>
            </div>

            <p className="text-slate-400 leading-7 text-sm">
              Trusted taxi service provider across
              Chhattisgarh for airport transfers,
              outstation travel, one-way trips and
              corporate bookings.
            </p>

            <div className="mt-6 space-y-3 text-sm">

              <div className="flex items-center gap-2 text-slate-300">
                <Phone size={16} />
                9244137353
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <MapPin size={16} />
                Chhattisgarh, India
              </div>

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Services
            </h3>

            <ul className="space-y-3 text-slate-400 text-sm">

              <li>
                <Link href="/services/taxi-service-in-raipur">
                  Taxi Service in Raipur
                </Link>
              </li>

              <li>
                <Link href="/services/taxi-service-in-korba">
                  Taxi Service in Korba
                </Link>
              </li>

              <li>
                <Link href="/services/taxi-service-in-bilaspur">
                  Taxi Service in Bilaspur
                </Link>
              </li>

              <li>
                <Link href="/routes/raipur-airport-taxi">
                  Airport Taxi Service
                </Link>
              </li>

            </ul>

          </div>

          {/* Popular Routes */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Popular Routes
            </h3>

            <ul className="space-y-3 text-slate-400 text-sm">

              <li>
                <Link href="/routes/raipur-to-korba-taxi">
                  Raipur to Korba Taxi
                </Link>
              </li>

              <li>
                <Link href="/routes/raipur-to-bilaspur-taxi">
                  Raipur to Bilaspur Taxi
                </Link>
              </li>

              <li>
                <Link href="/routes/raipur-to-raigarh-taxi">
                  Raipur to Raigarh Taxi
                </Link>
              </li>

              <li>
                <Link href="/routes/raipur-airport-taxi">
                  Raipur Airport Taxi
                </Link>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-slate-400 text-sm">

              <li>
                <Link href="/about-us">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact-us">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link href="/blog">
                  Travel Blog
                </Link>
              </li>

            </ul>

          </div>

          {/* Legal */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Legal
            </h3>

            <ul className="space-y-3 text-slate-400 text-sm">

              <li>
                <Link href="/privacy-policy">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/terms-and-conditions">
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link href="/refund-policy">
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link href="/payment-terms">
                  Payment Terms
                </Link>
              </li>

            </ul>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-slate-500 text-sm text-center md:text-left">

            © {new Date().getFullYear()} Khatu Rides Travels.
            All Rights Reserved.

          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-500">

            <Link href="/privacy-policy">
              Privacy Policy
            </Link>

            <Link href="/terms-and-conditions">
              Terms
            </Link>

            <Link href="/refund-policy">
              Refunds
            </Link>

            <Link href="/contact-us">
              Contact
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
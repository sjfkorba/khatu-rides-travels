import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CorporateHero from "@/components/CorporateHero";
import { PHONE } from "@/components/data";
import Navbar from "@/components/landing/Navbar"; 
import FloatingContact from "@/components/FloatingContact";
import { Briefcase, FileCheck, Building2, UserCheck, CheckCircle2, FileText, ShieldCheck, CarFront, ChevronRight, Settings, PhoneCall, Handshake, Star, Users } from "lucide-react";

const HUBS = [
  "raipur", "bilaspur", "durg", "bhilai", "korba", "raigarh", 
  "ambikapur", "jagdalpur", "champa", "kharsia", "katghora"
];

const formatName = (str: string) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateStaticParams() {
  return HUBS.map(city => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatName(city);

  return {
    title: `Corporate Car Rental & Taxi Services in ${cityName} | Khatu Rides B2B`,
    description: `Premium corporate taxi services, monthly car attachments, and executive transfers in ${cityName}. GST billing and dedicated account managers for businesses.`,
    keywords: `corporate car rental ${cityName}, commercial taxi ${cityName}, monthly cab rental ${cityName}, B2B taxi service ${cityName}, corporate travel ${cityName}, Khatu Rides corporate`,
    alternates: {
      canonical: `https://www.khaturidescg.in/corporate-taxi/${city}`,
    },
  };
}

export default async function CorporateTaxiPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  
  if (!HUBS.includes(city.toLowerCase())) return notFound();

  const cityName = formatName(city);

  const schemaOrgJSONLD = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `Khatu Rides Corporate Travels - ${cityName}`,
      "description": `Professional corporate taxi and monthly car rental services in ${cityName} with GST compliance.`,
      "telephone": PHONE,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": cityName,
        "addressRegion": "Chhattisgarh",
        "addressCountry": "IN"
      },
      "areaServed": { "@type": "City", "name": cityName }
    }
  ];

  return (
    <>
      <Navbar />
      <FloatingContact origin={cityName} destination="Corporate Travel" />

      <main className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />

        {/* Corporate Breadcrumbs */}
        <div className="bg-slate-950 text-slate-400 text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Corporate Solutions</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-semibold">{cityName}</span>
        </div>

        {/* Dynamic B2B Hero Section */}
        <CorporateHero initialCity={cityName} />

        {/* SECTION 1: B2B VALUE PROPOSITION */}
        <div className="bg-white border-b border-slate-200 py-10 shadow-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200">
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <FileCheck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-black text-slate-900 text-lg">100% GST Compliant</h4>
                <p className="text-sm text-slate-500 mt-2">Input Tax Credit (ITC) Ready Bills for your accounts</p>
              </div>
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-black text-slate-900 text-lg">Credit Facility</h4>
                <p className="text-sm text-slate-500 mt-2">Flexible Fortnightly or Monthly Invoicing cycles</p>
              </div>
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <UserCheck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-black text-slate-900 text-lg">Dedicated Manager</h4>
                <p className="text-sm text-slate-500 mt-2">Single Point of Contact for all your bookings</p>
              </div>
              <div className="px-4 hover:-translate-y-1 transition-transform">
                <ShieldCheck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-black text-slate-900 text-lg">Police Verified</h4>
                <p className="text-sm text-slate-500 mt-2">Highly trained & background checked chauffeurs</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRUSTED BY BRANDS (Social Proof) */}
        <section className="py-12 bg-slate-100 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by Leading Companies in Chhattisgarh</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Add real company logos here in future, using placeholders for now */}
              <div className="text-xl font-black text-slate-800 flex items-center gap-2"><Building2 /> SECL Vendors</div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2"><Settings /> Power Plants</div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2"><Briefcase /> Banking Sector</div>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2"><Building2 /> Pharma Co.</div>
            </div>
          </div>
        </section>

        {/* SECTION 3: SERVICES OFFERED */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Comprehensive Business Transport in {cityName}</h2>
              <p className="text-slate-600 mt-6 text-lg">From daily employee commutes to VIP executive transfers, we handle your company's entire mobility needs with professional precision.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <CarFront className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Monthly Car Attachment</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">Hire cars on a monthly retention basis (e.g., 2500 Kms / 30 Days). Best suited for sales teams, site visits, and regional managers in {cityName}.</p>
                <ul className="space-y-3 text-sm font-bold text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Fixed Monthly Budgeting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Replacement Car Guarantee</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Maintenance included</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Executive & CXO Travel</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">Premium fleet (Innova Crysta, Top-model Sedans) with uniformed, English-speaking drivers for your VIP guests and top management.</p>
                <ul className="space-y-3 text-sm font-bold text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Mineral Water & Newspapers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Punctuality SLA Guaranteed</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> High-end sanitized vehicles</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Hotel & Airport Transfers</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">Seamless point-to-point transfers for corporate events, conferences, or daily flight arrivals for your staff in and around {cityName}.</p>
                <ul className="space-y-3 text-sm font-bold text-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Flight Tracking Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Bulk Booking Management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Placard Pickup at Airport</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS (The Process) */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4">How to Partner With Us</h2>
              <p className="text-slate-400">A simple, transparent 4-step onboarding process for corporate clients.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]">1</div>
                <h4 className="text-xl font-bold mb-2">Share Needs</h4>
                <p className="text-slate-400 text-sm">Tell us your fleet size, routes, and monthly usage in {cityName}.</p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-dashed bg-slate-700 border-t-2 border-dashed border-slate-600"></div>
              </div>
              <div className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]">2</div>
                <h4 className="text-xl font-bold mb-2">Get Proposal</h4>
                <p className="text-slate-400 text-sm">We provide a customized B2B tariff card with credit terms.</p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-dashed bg-slate-700 border-t-2 border-dashed border-slate-600"></div>
              </div>
              <div className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]">3</div>
                <h4 className="text-xl font-bold mb-2">Sign Agreement</h4>
                <p className="text-slate-400 text-sm">Quick vendor registration and SLA sign-off.</p>
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-dashed bg-slate-700 border-t-2 border-dashed border-slate-600"></div>
              </div>
              <div className="text-center relative">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]"><CheckCircle2 className="w-8 h-8"/></div>
                <h4 className="text-xl font-bold mb-2">Start Booking</h4>
                <p className="text-slate-400 text-sm">Book cabs instantly via phone or WhatsApp with your dedicated account manager.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: OUR CORPORATE FLEET */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Corporate Fleet in {cityName}</h2>
                <p className="text-slate-600 text-lg">Well-maintained, commercial-plated vehicles ready for your business.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-2xl font-black text-slate-900">Executive Sedan</h3>
                <p className="text-blue-600 font-bold text-sm mb-6">Swift Dzire / Toyota Etios</p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 font-medium">
                  Ideal for regular site visits, daily official commuting, and sales team movements. Cost-effective and highly reliable.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all border-t-4 border-t-blue-500 relative">
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Most Demanded</div>
                <h3 className="text-2xl font-black text-slate-900 mt-2">MUV / SUV</h3>
                <p className="text-blue-600 font-bold text-sm mb-6">Maruti Ertiga / Kia Carens</p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 font-medium">
                  Perfect for group travel (up to 6 people), airport transfers with extra luggage, or inter-city branch visits.
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                <h3 className="text-2xl font-black text-slate-900">Premium SUV</h3>
                <p className="text-blue-600 font-bold text-sm mb-6">Toyota Innova Crysta</p>
                <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-600 font-medium">
                  The ultimate choice for VIPs, Directors, and international delegates. Supreme comfort and high safety standards.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: B2B FAQs */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Corporate Billing & FAQs</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="font-black text-xl text-slate-900 mb-3">How does the monthly credit facility work?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Once your company is onboarded as a corporate partner, employees can book cabs without paying cash. A digital log sheet (Duty Slip) is signed after every trip. At the end of the month (or every 15 days), we compile all slips and send a consolidated GST invoice with a 15 to 30 days payment window.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="font-black text-xl text-slate-900 mb-3">Can we get a car exclusively for our company on a monthly basis?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Yes! Our "Monthly Car Attachment" model gives you a dedicated car and driver for your company's exclusive use. You can choose packages like 2500 Kms / 300 Hours per month, which offers significant cost savings compared to daily bookings.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <h3 className="font-black text-xl text-slate-900 mb-3">Are your drivers trained for corporate duties?</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Absolutely. Our corporate chauffeurs undergo behavioral training. They are punctual, wear proper uniforms, know how to use GPS navigation, and maintain absolute discretion and professionalism with your executive guests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL CALL TO ACTION */}
        <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to upgrade your company's transport in {cityName}?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Get in touch with our B2B sales team today. We will analyze your monthly usage and provide a highly competitive tariff card.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={`tel:${PHONE}`} className="bg-white text-blue-700 font-black text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <PhoneCall className="w-5 h-5" /> Call Corporate Desk
              </a>
              <a href={`mailto:khaturides@gmail.com`} className="bg-blue-800 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" /> Email Requirements
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
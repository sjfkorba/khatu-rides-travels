import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import QuickServices from "@/components/landing/QuickServices";
import PopularRoutes from "@/components/landing/PopularRoutes";
import TourPackages from "@/components/landing/TourPackages";
import Fleet from "@/components/landing/Fleet";
import TrustSection from "@/components/landing/TrustSection";
import Services from "@/components/landing/Services";
import AirportSection from "@/components/landing/AirportSection";
import Reviews from "@/components/landing/Reviews";
import SeoSection from "@/components/landing/SeoSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import MobileActionBar from "@/components/landing/MobileActionBar";
import ImageCarousel from "@/components/ImageCarousel";
import EnquiryForm from "@/components/landing/EnquiryForm";
import SakhaBot from "@/components/SakhaBot";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f7f9fc] text-[#0b1b33]">
      <Navbar />
      <Hero />
      <QuickServices />
      <EnquiryForm/>
      <ImageCarousel/>
      <PopularRoutes />
      <TourPackages />
      <Fleet />
      <TrustSection />
      <Services />
      <AirportSection />
      <Reviews />
      <SeoSection />
      <FinalCTA />
      <MobileActionBar />
      <SakhaBot/>
    </main>
  );
}
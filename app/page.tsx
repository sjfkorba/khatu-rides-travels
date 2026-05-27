"use client";

import { useState } from "react";

const phone1 = "9244137353";
const phone2 = "8319376115";

const whatsappMessage =
  "Namaste Khatu Rides Travels, mujhe cab booking ke liye details chahiye.";

const vehicles = [
  {
    name: "Dzire",
    type: "Sedan",
    price: "₹11/km se",
    image:
      "https://content.carlelo.com/media/models/Dzire/base/maruti-suzuki-dzire-1.webp",
  },
  {
    name: "Ertiga",
    type: "7 Seater",
    price: "₹14/km se",
    image:
      "https://imgd.aeplcdn.com/642x361/n/cw/ec/171147/maruti-suzuki-ertiga-left-rear-three-quarter0.jpeg?isig=0&q=75",
  },
  {
    name: "Innova Crysta",
    type: "Premium SUV",
    price: "₹18/km se",
    image:
      "https://stimg.cardekho.com/images/expert-review/select-model/20250728_160805/930x620/5_1200x67520250728_160805.jpg",
  },
  {
    name: "Sedan",
    type: "Comfort Ride",
    price: "₹12/km se",
    image:
      "https://spn-sta.spinny.com/blog/20220308152631/VW-Virtus-launch.jpg",
  },
];

const services = [
  {
    title: "One Way Taxi in Chhattisgarh",
    desc: "Korba, Raipur, Bilaspur, Durg, Bhilai aur nearby cities ke liye affordable one way taxi booking. Sirf ek side travel ke liye best fare option.",
  },
  {
    title: "Round Trip Cab Booking",
    desc: "Family trip, business meeting ya personal travel ke liye clean cars, experienced drivers aur transparent fare ke saath round trip cab service.",
  },
  {
    title: "Outstation Taxi Service",
    desc: "Chhattisgarh se Odisha, Jharkhand, Madhya Pradesh aur nearby states ke liye safe aur comfortable outstation cab booking.",
  },
  {
    title: "Commercial Cab Booking",
    desc: "Company staff travel, office duty, monthly cab, business visit aur corporate travel ke liye reliable commercial taxi service.",
  },
  {
    title: "Airport & Railway Pickup Drop",
    desc: "Raipur Airport, railway station aur city pickup-drop ke liye on-time taxi service. Early morning aur late night booking available.",
  },
  {
    title: "Local Taxi Service in Korba",
    desc: "Korba city, NTPC, BALCO, Kusmunda, Gevra, Dipka aur nearby industrial areas ke liye local cab booking service.",
  },
];

const locations = [
  "Korba",
  "Raipur",
  "Bilaspur",
  "Durg",
  "Bhilai",
  "Jagdalpur",
  "Ambikapur",
  "Raigarh",
  "Janjgir",
  "Champa",
  "NTPC Korba",
  "BALCO",
  "Kusmunda",
  "Gevra",
  "Dipka",
];

const testimonials = [
  {
    name: "Rahul Sahu",
    route: "Raipur to Korba",
    rating: 5,
    text: "Cab time par aa gayi, driver polite tha aur journey comfortable rahi. Raipur to Korba ke liye service kaafi achhi lagi.",
  },
  {
    name: "Priya Verma",
    route: "Raipur Airport Pickup",
    rating: 5,
    text: "Airport pickup bilkul time par hua. Car clean thi aur fare bhi transparent tha. Family travel ke liye recommended.",
  },
  {
    name: "Amit Kumar",
    route: "Bilaspur Round Trip",
    rating: 5,
    text: "Round trip booking smooth rahi. Driver experienced tha aur WhatsApp par fare jaldi confirm ho gaya.",
  },
  {
    name: "Sandeep Patel",
    route: "Raipur to Bilaspur",
    rating: 5,
    text: "Raipur se Bilaspur ke liye cab book ki thi. Car clean thi, driver time par pahunch gaya aur ride comfortable rahi.",
  },
  {
    name: "Neha Sharma",
    route: "Korba Local Taxi",
    rating: 5,
    text: "Korba local travel ke liye service bahut achhi lagi. Booking process simple tha aur driver ka behavior professional tha.",
  },
  {
    name: "Vikas Yadav",
    route: "Raipur to Bhilai",
    rating: 5,
    text: "Fare WhatsApp par jaldi confirm ho gaya. Raipur to Bhilai journey smooth rahi aur car condition bhi achhi thi.",
  },
  {
    name: "Anjali Gupta",
    route: "Family Outstation Trip",
    rating: 5,
    text: "Family trip ke liye Ertiga book ki thi. Space comfortable tha aur driver ne safe driving ki.",
  },
  {
    name: "Manoj Verma",
    route: "Commercial Booking",
    rating: 5,
    text: "Office travel ke liye cab li thi. Time management aur service dono professional lage.",
  },
  {
    name: "Pooja Sinha",
    route: "Raipur Airport to Korba",
    rating: 5,
    text: "Airport pickup ke liye cab bilkul time par mili. Long journey ke liye car clean aur comfortable thi.",
  },
  {
    name: "Rohit Dewangan",
    route: "Korba to Raipur",
    rating: 5,
    text: "Korba se Raipur ke liye one way taxi book ki. Driver polite tha aur fare bhi reasonable laga.",
  },
  {
    name: "Kavita Rajput",
    route: "Bilaspur to Raipur",
    rating: 5,
    text: "Booking WhatsApp par easy ho gayi. Driver ne time par pickup kiya aur trip safe rahi.",
  },
  {
    name: "Nitin Sahu",
    route: "Raipur to Durg",
    rating: 5,
    text: "Raipur to Durg ride ke liye cab service reliable lagi. Car neat and clean thi.",
  },
  {
    name: "Sunita Kashyap",
    route: "Innova Crysta Booking",
    rating: 5,
    text: "Innova Crysta family travel ke liye book ki thi. Premium feel aur comfortable seating mili.",
  },
  {
    name: "Deepak Singh",
    route: "Outstation Taxi",
    rating: 5,
    text: "Outstation trip ke liye service dependable rahi. Driver route jaanta tha aur journey tension-free rahi.",
  },
  {
    name: "Meena Tiwari",
    route: "Raipur Railway Pickup",
    rating: 5,
    text: "Railway station pickup ke liye cab time par aa gayi. Luggage ke saath travel easy ho gaya.",
  },
];

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    vehicle: "Dzire",
    tripType: "One Way Taxi",
  });

  const sendBookingEnquiry = () => {
    const message = `Namaste Khatu Rides Travels Co.

Mujhe cab booking ke liye enquiry karni hai.

Customer Name: ${form.name}
Mobile Number: ${form.mobile}
Pickup Location: ${form.pickup}
Drop Location: ${form.drop}
Booking Date: ${form.date}
Booking Time: ${form.time}
Vehicle: ${form.vehicle}
Trip Type: ${form.tripType}

Please mujhe best fare bata dijiye.`;

    window.open(
      `https://wa.me/91${phone1}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-orange-600">
              Khatu Rides Travels Co.
            </h1>
            <p className="text-xs text-gray-500">
              Taxi Service in Korba & Chhattisgarh
            </p>
          </div>

          <div className="hidden md:flex gap-3">
 <a
  href="/admin/login"
  className="inline-flex items-center justify-center rounded-full border border-orange-500 bg-white px-3 py-2 text-xs font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 md:px-5 md:py-2.5 md:text-sm"
>
  Official Login
</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,247,237,0.98) 0%, rgba(255,247,237,0.92) 45%, rgba(255,255,255,0.72) 100%), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1600')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold mb-4">
              Trusted Taxi Service in Chhattisgarh
            </p>

            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Best Taxi Service in Korba, Raipur & Chhattisgarh
            </h2>

            <p className="mt-5 text-gray-700 text-lg leading-relaxed">
              Khatu Rides Travels Co. Korba, Raipur, Bilaspur aur poore
              Chhattisgarh me Dzire, Ertiga, Innova Crysta aur Sedan ke saath
              one way taxi, round trip cab, outstation tour, airport pickup-drop
              aur commercial booking provide karta hai.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 max-w-xl">
              {["Clean Cars", "Expert Drivers", "Best Fare", "Fast WhatsApp Booking"].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-white/90 border rounded-2xl px-4 py-3 shadow-sm font-semibold"
                  >
                    ✓ {item}
                  </div>
                )
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${phone1}`}
                className="px-6 py-3 rounded-full bg-orange-600 text-white font-bold shadow-lg hover:bg-orange-700 transition"
              >
                Call: {phone1}
              </a>
              <a
                href={`https://wa.me/91${phone2}?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 transition"
              >
                Get Fare on WhatsApp
              </a>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 border">
            <h3 className="text-2xl font-bold text-gray-900">
              Get Best Fare Estimate
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              Trip details bhejiye, hum WhatsApp par fare aur availability
              confirm karenge.
            </p>

            <div className="grid gap-3">
              <input
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Customer Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Pickup Location"
                  value={form.pickup}
                  onChange={(e) =>
                    setForm({ ...form, pickup: e.target.value })
                  }
                />

                <input
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Drop Location"
                  value={form.drop}
                  onChange={(e) => setForm({ ...form, drop: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                <input
                  type="time"
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <select
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                  value={form.vehicle}
                  onChange={(e) =>
                    setForm({ ...form, vehicle: e.target.value })
                  }
                >
                  <option>Dzire</option>
                  <option>Ertiga</option>
                  <option>Innova Crysta</option>
                  <option>Sedan</option>
                </select>

                <select
                  className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-500"
                  value={form.tripType}
                  onChange={(e) =>
                    setForm({ ...form, tripType: e.target.value })
                  }
                >
                  <option>One Way Taxi</option>
                  <option>Round Trip Booking</option>
                  <option>Outstation Tour</option>
                  <option>Commercial Booking</option>
                  <option>Airport / Railway Pickup</option>
                </select>
              </div>

              <button
                onClick={sendBookingEnquiry}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white rounded-full py-3 font-bold shadow-lg transition"
              >
                Send Enquiry on WhatsApp
              </button>

              <p className="text-xs text-center text-gray-500">
                Direct Call: {phone1} / {phone2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          Taxi Services in Korba, Raipur, Bilaspur & Chhattisgarh
        </h2>

        <p className="max-w-3xl mx-auto text-center text-gray-600 mb-10 leading-relaxed">
          Khatu Rides Travels Co. Chhattisgarh me one way taxi, round trip cab,
          outstation taxi, airport pickup-drop aur commercial cab booking ke
          liye trusted travel partner hai.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-6 rounded-3xl border bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold mb-4">
                ✓
              </div>

              <h3 className="text-xl font-bold text-gray-900">
                {service.title}
              </h3>

              <p className="mt-3 text-gray-600 leading-relaxed">
                {service.desc}
              </p>

              <a
                href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                  `Namaste, mujhe ${service.title} ke liye fare details chahiye.`
                )}`}
                className="inline-block mt-5 text-orange-600 font-bold hover:underline"
              >
                Get Fare →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="bg-orange-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-4">
            Cab Booking Available Across Chhattisgarh
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
            Korba aur nearby industrial areas se lekar Raipur, Bilaspur, Durg,
            Bhilai, Jagdalpur aur Ambikapur tak reliable taxi service.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {locations.map((loc) => (
              <span
                key={loc}
                className="bg-white border border-orange-200 rounded-full px-5 py-2 font-semibold text-gray-700 shadow-sm"
              >
                {loc} Taxi Service
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            Available Vehicles for Taxi Booking
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
            Budget sedan se premium SUV tak — family trip, airport transfer,
            business travel aur outstation journey ke liye suitable cars.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((car) => (
              <div
                key={car.name}
                className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition"
              >
                <img
                  src={car.image}
                  alt={`${car.name} taxi booking in Chhattisgarh`}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <p className="text-gray-500">{car.type}</p>
                  <p className="mt-3 font-bold text-orange-600">
                    {car.price}
                  </p>
                  <a
                    href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                      `Namaste, mujhe ${car.name} booking ke liye details chahiye.`
                    )}`}
                    className="mt-4 block text-center bg-gray-900 text-white rounded-full py-2 font-semibold"
                  >
                    Book {car.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
          Estimated Taxi Pricing
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Starting fare display kiya gaya hai. Final fare route, distance,
          vehicle, toll, parking aur driver allowance ke hisaab se confirm hoga.
        </p>

        <div className="overflow-x-auto rounded-2xl border shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Starting Fare</th>
                <th className="p-4">Best For</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((car) => (
                <tr key={car.name} className="border-b">
                  <td className="p-4 font-semibold">{car.name}</td>
                  <td className="p-4">{car.price}</td>
                  <td className="p-4">{car.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      

{/* Customer Reviews */}
<section className="bg-white py-16 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-10">
      <p className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold mb-4">
        Customer Feedback
      </p>

      <h2 className="text-3xl md:text-4xl font-extrabold">
        Our Customers Say
      </h2>

      <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
        Raipur, Korba, Bilaspur aur Chhattisgarh ke customers hamari taxi
        service ke baare me kya kehte hain.
      </p>
    </div>

    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

      <div className="review-marquee flex gap-6 w-max">
        {[...testimonials, ...testimonials].map((review, index) => (
          <div
            key={`${review.name}-${index}`}
            className="group w-[300px] sm:w-[340px] md:w-[380px] shrink-0 rounded-3xl border bg-orange-50/60 p-6 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-lg group-hover:text-orange-600 transition">
                  {review.name}
                </h3>
                <p className="text-sm text-gray-500">{review.route}</p>
              </div>

              <div className="text-orange-500 font-bold whitespace-nowrap transition-transform duration-300 group-hover:scale-110">
                {"★".repeat(review.rating)}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed min-h-[120px]">
              “{review.text}”
            </p>

            <div className="mt-5 text-sm font-bold text-green-700">
              Verified Customer Experience
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 text-center">
      <a
        href="YOUR_GOOGLE_REVIEW_LINK"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg transition"
      >
        ⭐ Review us on Google
      </a>

      <p className="mt-4 text-sm text-gray-500">
        Aapka Google review hume local search me grow karne aur better service
        dene me help karta hai.
      </p>
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Need Taxi in Korba, Raipur or Anywhere in Chhattisgarh?
          </h2>
          <p className="mt-4 text-gray-300">
            One way taxi, round trip, outstation tour, airport pickup-drop aur
            commercial cab booking ke liye direct call ya WhatsApp karein.
          </p>

          <div className="mt-8 flex justify-center flex-wrap gap-4">
            <a
              href={`tel:${phone1}`}
              className="px-7 py-3 bg-orange-600 rounded-full font-bold"
            >
              Call {phone1}
            </a>
            <a
              href={`tel:${phone2}`}
              className="px-7 py-3 bg-orange-600 rounded-full font-bold"
            >
              Call {phone2}
            </a>
            <a
              href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              className="px-7 py-3 bg-green-600 rounded-full font-bold"
            >
              WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500">
        © 2026 Khatu Rides Travels Co. | Best Taxi Service in Chhattisgarh
      </footer>

      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <a
          href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
            whatsappMessage
          )}`}
          className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
        >
          WhatsApp
        </a>
        <a
          href={`tel:${phone1}`}
          className="bg-orange-600 text-white px-5 py-3 rounded-full shadow-lg font-semibold"
        >
          Call
        </a>
      </div>
    </main>
  );
}
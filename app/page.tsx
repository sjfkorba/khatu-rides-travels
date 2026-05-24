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
  "One Way Taxi",
  "Round Trip Booking",
  "Outstation Tour",
  "Commercial Booking",
  "Airport / Railway Pickup",
  "Chhattisgarh Local Travel",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-orange-600">
              Khatu Rides Travels Co.
            </h1>
            <p className="text-xs text-gray-500">Chhattisgarh Taxi Service</p>
          </div>

          <div className="hidden md:flex gap-3">
            <a
              href={`tel:${phone1}`}
              className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm"
            >
              Call Now
            </a>
            <a
              href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-orange-600 font-semibold mb-3">
              Trusted Taxi Service in Chhattisgarh
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Safe, Comfortable & Affordable Cab Booking
            </h2>
            <p className="mt-5 text-gray-700 text-lg">
              Dzire, Ertiga, Innova Crysta aur Sedan ke saath One Way, Round
              Trip, Outstation Tour aur Commercial Booking available.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${phone1}`}
                className="px-6 py-3 rounded-full bg-orange-600 text-white font-semibold shadow-lg"
              >
                Call: {phone1}
              </a>
              <a
                href={`https://wa.me/91${phone2}?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                className="px-6 py-3 rounded-full bg-green-600 text-white font-semibold shadow-lg"
              >
                WhatsApp Booking
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              Contact: {phone1} / {phone2}
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1400"
              alt="Khatu Rides Travels taxi service"
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Taxi Services
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-orange-600">{service}</h3>
              <p className="mt-3 text-gray-600">
                Comfortable ride, trained driver aur transparent pricing ke
                saath booking.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            Available Vehicles
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((car) => (
              <div
                key={car.name}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <p className="text-gray-500">{car.type}</p>
                  <p className="mt-3 font-semibold text-orange-600">
                    {car.price}
                  </p>
                  <a
                    href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                      `Namaste, mujhe ${car.name} booking ke liye details chahiye.`
                    )}`}
                    className="mt-4 block text-center bg-gray-900 text-white rounded-full py-2"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Estimated Pricing
        </h2>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-left">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Local / Outstation</th>
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

        <p className="mt-4 text-sm text-gray-500 text-center">
          Final fare distance, route, toll, parking aur booking type ke hisaab
          se confirm hoga.
        </p>
      </section>

      {/* Booking CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Cab Booking ke liye abhi contact karein
          </h2>
          <p className="mt-4 text-gray-300">
            One Way, Round Trip, Outstation Tour aur Commercial Booking ke liye
            direct call ya WhatsApp karein.
          </p>

          <div className="mt-8 flex justify-center flex-wrap gap-4">
            <a
              href={`tel:${phone1}`}
              className="px-7 py-3 bg-orange-600 rounded-full font-semibold"
            >
              Call {phone1}
            </a>
            <a
              href={`tel:${phone2}`}
              className="px-7 py-3 bg-orange-600 rounded-full font-semibold"
            >
              Call {phone2}
            </a>
            <a
              href={`https://wa.me/91${phone1}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              className="px-7 py-3 bg-green-600 rounded-full font-semibold"
            >
              WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-500">
        © 2026 Khatu Rides Travels Co. | Taxi Service in Chhattisgarh
      </footer>

      {/* Floating Buttons */}
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
export default function BlogCTA() {
  return (
    <section className="bg-orange-600 text-white rounded-3xl p-10 text-center">

      <h2 className="text-4xl font-black">
        Need a Taxi in Chhattisgarh?
      </h2>

      <p className="mt-4">
        Airport Transfer • One Way Taxi • Round Trip
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-8">

        <a
          href="https://wa.me/919244137353"
          className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold"
        >
          WhatsApp Now
        </a>

        <a
          href="tel:9244137353"
          className="border border-white px-8 py-4 rounded-2xl font-bold"
        >
          Call Now
        </a>

      </div>

    </section>
  );
}
"use client";
import React from "react";

interface Review {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  route: string;
}

const STATIC_REVIEWS: Review[] = [
  {
    author_name: "Rajesh Agrawal",
    rating: 5,
    relative_time_description: "2 days ago",
    route: "Korba to Raipur Cab Service",
    text: "Khatu Rides ki sedan booking kaafi smooth rahi. Driver time par pickup karne aa gaye the aur gaadi bilkul clean aur AC thi. Raipur ke liye best taxi service hai Chhattisgarh me!",
  },
  {
    author_name: "Priya Sahu",
    rating: 5,
    relative_time_description: "5 days ago",
    route: "Bilaspur to Korba One Way Cab",
    text: "Maine family trip ke liye Ertiga book ki thi. Driver ka behavior bahut polite tha aur rate bhi market me sabse affordable laga. No hidden charges at all. Highly recommended!",
  },
  {
    author_name: "Amit Kumar Jha",
    rating: 4,
    relative_time_description: "1 week ago",
    route: "Korba to Bilaspur Outstation Taxi",
    text: "Amazing experience! Booking process bilkul easy hai aur instant confirmation mil gaya tha. 90 KM ka safar bahut comfortable raha. Thanks Khatu Rides Travels.",
  },
  {
    author_name: "Sanjay Dewangan",
    rating: 5,
    relative_time_description: "1 week ago",
    route: "Raigarh to Korba Cab",
    text: "Best cab service provider in Chhattisgarh. Raigarh se Korba aane ke liye maine Innova Crysta li thi, ride bahut hi luxury aur comfortable rahi. Driver driving me expert the.",
  },
  {
    author_name: "Neha Sharma",
    rating: 5,
    relative_time_description: "2 weeks ago",
    route: "Korba to Raipur Airport Drop",
    text: "Early morning flight ke liye cab chahiye thi. Driver subah 4 baje hi pahunch gaye the. Safe driving aur timely drop ke liye 5 stars!",
  },
  {
    author_name: "Vikas Verma",
    rating: 4,
    relative_time_description: "2 weeks ago",
    route: "Bilaspur to Raipur Intercity Cab",
    text: "Transparent pricing aur 50% advance payment option ne kaam asaan kar diya. Zero stress ride. Khatu Rides team is doing a fantastic job.",
  },
  {
    author_name: "Deepak Rathore",
    rating: 5,
    relative_time_description: "3 weeks ago",
    route: "Korba to Raigarh Business Trip",
    text: "Business meetings ke liye regular travelling hoti hai meri. Main hamesha Khatu Rides ko hi prefer karta hu kyunki inki time punctuality zabardast hai.",
  },
  {
    author_name: "Pooja Gupta",
    rating: 5,
    relative_time_description: "3 weeks ago",
    route: "Korba Local & Outstation Tour",
    text: "Pure Chhattisgarh me inki service sabse best hai. Clean cars, verified drivers aur customer support bhi 24x7 available milta hai.",
  },
  {
    author_name: "Manoj Tiwari",
    rating: 4,
    relative_time_description: "1 month ago",
    route: "Raipur to Ambikapur Long Route",
    text: "Long route travel ke liye Innova Crysta book ki thi. Car ki condition ekdam nayi jaisi thi aur ac ne poore raste acche se cooling di.",
  },
  {
    author_name: "Ravi Shankar Patel",
    rating: 5,
    relative_time_description: "1 month ago",
    route: "Korba to Bilaspur Taxi Booking",
    text: "Bahut hi badhiya experience raha. Online payment aur WhatsApp booking support dono ekdam fast hain. Ek baar zaroor try karein.",
  },
  {
    author_name: "Sunita Ekka",
    rating: 5,
    relative_time_description: "1 month ago",
    route: "Korba to Raipur Family Trip",
    text: "Family ke sath travel karte waqt safety sabse pehle dekhi jaati hai. Khatu Rides ke drivers kaafi trusted aur cooperative hote hain.",
  },
  {
    author_name: "Ankit Singh",
    rating: 4,
    relative_time_description: "1 month ago",
    route: "Bilaspur to Raigarh Cab",
    text: "Fabulous service! Rate bhi baki local travels se kafi reasonable mile. Ab se mera permanent travel partner Khatu Rides hi hai.",
  },
  {
    author_name: "Kunal Banerjee",
    rating: 5,
    relative_time_description: "2 months ago",
    route: "Korba to Durg Outstation Ride",
    text: "Smooth highway drive aur acchi music system ke sath journey kab khatam ho gayi pata hi nahi chala. Excellent service!",
  },
  {
    author_name: "Rekha Chandrakar",
    rating: 5,
    relative_time_description: "2 months ago",
    route: "Raipur to Bilaspur Corporate Travel",
    text: "Professional drivers and well-maintained vehicles. Corporate clients ke liye ye Chhattisgarh ki sabse reliable cab agency hai.",
  },
  {
    author_name: "Alok Nanda",
    rating: 4,
    relative_time_description: "2 months ago",
    route: "Korba to Jagdalpur Tour",
    text: "Long distance tour ke liye best experience. Driver ne raste ke saare acche spots aur dhabas par guide bhi kiya. Superb hospitality!",
  },
  {
    author_name: "Santosh Mahato",
    rating: 5,
    relative_time_description: "2 months ago",
    route: "Korba to Bilaspur One Way Drop",
    text: "Bas ek call ya click par cab ghar ke samne aa gayi thi. Fast response aur best pricing ke liye 5/5 stars.",
  },
  {
    author_name: "Meenakshi Verma",
    rating: 5,
    relative_time_description: "2 months ago",
    route: "Raipur to Korba Return Journey",
    text: "Round trip booking par kafi acha discount mila aur driver ka nature bhi bahut friendly tha. Safe travel experience.",
  },
  {
    author_name: "Tarun Kumar Soni",
    rating: 4,
    relative_time_description: "3 months ago",
    route: "Korba to Raigarh Highway Cab",
    text: "Zero hassle booking. Na koi extra charges aur na hi koi confusion. Jo rate website par dikha wahi pay kiya.",
  },
  {
    author_name: "Divya Nair",
    rating: 5,
    relative_time_description: "3 months ago",
    route: "Bilaspur to Ambikapur Cab",
    text: "Hilly areas aur ghat section me bhi driver ne gaadi bahut safely drive ki. Completely satisfied with Khatu Rides.",
  },
  {
    author_name: "Manish Khandelwal",
    rating: 5,
    relative_time_description: "3 months ago",
    route: "Korba to Raipur Airport Cab",
    text: "Flight miss hone ka darr rehta hai hamesha, par inke driver itne punctual hain ki time se 15 minute pehle airport chhod diya.",
  },
  {
    author_name: "Shweta Deshmukh",
    rating: 4,
    relative_time_description: "3 months ago",
    route: "Korba to Bilaspur Family Outing",
    text: "Ertiga cab ki space aur cleanliness dekh kar maza aa gaya. Bacho ke sath travel ke liye ye best option hai.",
  },
  {
    author_name: "Pramod Sao",
    rating: 5,
    relative_time_description: "3 months ago",
    route: "Raigarh to Raipur Fast Cab",
    text: "Fast booking aur instant driver details mil gayi thi SMS par. Bahut hi professional management hai Khatu Rides Travels ka.",
  }
];

export default function ReviewsCarousel() {
  const duplicatedReviews = [...STATIC_REVIEWS, ...STATIC_REVIEWS];

  return (
    <section
      className="relative mt-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 px-4"
      aria-labelledby="reviews-heading"
    >
      {/* decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/70 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-700 shadow-sm backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          Verified Rider Testimonials
        </span>

        <h2
          id="reviews-heading"
          className="mt-4 text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
        >
          Trusted By Our Riders
        </h2>

        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-2xl font-extrabold text-amber-500 sm:text-3xl">
            4.6 ★★★★★
          </span>
          <span className="text-sm font-bold text-slate-600 sm:text-base">
            (2,500+ Happy Online & Offline Customers)
          </span>
        </div>
      </div>

      {/* carousel container */}
      <div className="relative mt-12 w-full">
        {/* side gradients */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24 lg:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24 lg:w-32" />

        {/* marquee track */}
        <div className="group relative w-full overflow-hidden py-4">
          <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
            {duplicatedReviews.map((review, index) => (
              <div
                key={index}
                className="group/card relative w-[320px] sm:w-[360px] lg:w-[400px] overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/60 hover:shadow-2xl hover:shadow-orange-200/40"
              >
                {/* subtle gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/0 via-transparent to-amber-50/0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

                {/* header */}
                <div className="relative mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 font-black text-white shadow-md shadow-orange-500/20">
                      {review.author_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {review.author_name}
                      </h3>
                      <span className="text-[11px] font-bold text-orange-600">
                        {review.route}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {review.relative_time_description}
                  </span>
                </div>

                {/* stars */}
                <div className="relative mb-3 flex items-center gap-1 text-amber-400 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="drop-shadow-sm">
                      {i < review.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                {/* review text */}
                <p className="relative text-slate-600 text-xs font-medium leading-relaxed sm:text-sm">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* footer */}
                <div className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100/80 px-2.5 py-1.5 font-bold text-slate-700">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verified Ride
                  </span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    ✓ Khatu Rides
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 140s linear infinite;
        }
      `}</style>
    </section>
  );
}
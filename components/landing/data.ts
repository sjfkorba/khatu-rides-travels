// ============================================================
// KHATU RIDES TRAVELS
// Landing Page Data
// ============================================================


// ============================================================
// CONTACT DETAILS
// ============================================================

export const PHONE = "+919244137353";

export const PHONE_DISPLAY = "+91 92441 37353";

export const WHATSAPP = "919244137353";


// ============================================================
// HERO SLIDES
// ============================================================

export const HERO_SLIDES = [
  {
    image: "/hero/01.png",
    eyebrow: "ONE WAY CAB",
    title: "One-Way Cabs Across Chhattisgarh",
    description:
      "Travel city to city with reliable drivers, clean cars and transparent starting fares.",
  },
  {
    image: "/hero/02.png",
    eyebrow: "AIRPORT TAXI",
    title: "Airport Transfers Without The Stress",
    description:
      "On-time pickup and drop from Raipur Airport to Raipur, Bhilai, Durg, Bilaspur, Korba and beyond.",
  },
  {
    image: "/hero/03.png",
    eyebrow: "DIVINE JOURNEYS",
    title: "Plan Your Next Spiritual Journey",
    description:
      "Comfortable cab services for Khatu Shyam, Ujjain, Ayodhya, Varanasi, Prayagraj, Puri and more.",
  },
  {
    image: "/hero/04.png",
    eyebrow: "PILGRIMAGE TOURS",
    title: "Travel More. Worry Less.",
    description:
      "Family-friendly tour packages with practical vehicles and dedicated travel support.",
  },
  {
    image: "/hero/05.png",
    eyebrow: "CHHATTISGARH TOURISM",
    title: "Explore Chhattisgarh With Khatu Rides",
    description:
      "Discover Bastar, Chitrakoot, Tirathgarh and the best local destinations by cab.",
  },
] as const;


// ============================================================
// QUICK SERVICES
// ============================================================

export const QUICK_SERVICES = [
  {
    icon: "🚕",
    title: "Book a Cab",
    text: "City & Outstation",
    href: "#routes",
  },
  {
    icon: "✈️",
    title: "Airport Taxi",
    text: "On-Time, Every Time",
    href: "#airport",
  },
  {
    icon: "🛣️",
    title: "Outstation Cab",
    text: "Comfortable Long Rides",
    href: "#services",
  },
  {
    icon: "🛕",
    title: "Tour Packages",
    text: "Spiritual & Holiday Tours",
    href: "#tours",
  },
] as const;


// ============================================================
// POPULAR ROUTES
// ============================================================

export const ROUTES = [
  {
    from: "Korba",
    to: "Raipur",
    price: "₹1,999",
    meta: "One Way Cab",
    image: "/raipur_korba.png",
  },
  {
    from: "Raipur",
    to: "Korba",
    price: "₹1,999",
    meta: "One Way Cab",
    image: "/raipur_korba.png",
  },
  {
    from: "Bilaspur",
    to: "Raipur",
    price: "₹1,799",
    meta: "One Way Cab",
    image: "/bilaspur_raipur.png",
  },
  {
    from: "Korba",
    to: "Bilaspur",
    price: "₹1,799",
    meta: "One Way Cab",
    image: "/korba_bilaspur.png",
  },
  {
    from: "Raipur",
    to: "Durg",
    price: "₹1,599",
    meta: "One Way Cab",
    image: "/banner6.png",
  },
] as const;


// ============================================================
// SPIRITUAL / TOUR PACKAGES
// ============================================================

export const TOURS = [
  {
    title: "Khatu Shyam",
    type: "Tour Package",
    image: "/tour/khatu.png",
    href: "/tour-packages/khatu-shyam",
  },
  {
    title: "Ayodhya",
    type: "Tour Package",
    image: "/tour/ayodhya.png",
    href: "/tour-packages/ayodhya",
  },
  {
    title: "Ujjain",
    type: "Tour Package",
    image: "/tour/ujjain.png",
    href: "/tour-packages/ujjain",
  },
  {
    title: "Prayagraj",
    type: "Tour Package",
    image: "/tour/prayagraj.png",
    href: "/tour-packages/prayagraj",
  },
  {
    title: "Varanasi",
    type: "Tour Package",
    image: "/tour/varanasi.png",
    href: "/tour-packages/varanasi",
  },
  {
    title: "Puri",
    type: "Tour Package",
    image: "/tour/puri.png",
    href: "/tour-packages/puri",
  },
] as const;


// ============================================================
// CHHATTISGARH DESTINATIONS
// ============================================================

export const DESTINATIONS = [
  {
    title: "Bastar",
    type: "Chhattisgarh Tour",
    image: "/tour/bastar.png",
  },
  {
    title: "Chitrakoot",
    type: "Chhattisgarh Tour",
    image: "/tour/chitrakoot.png",
  },
  {
    title: "Tirathgarh",
    type: "Chhattisgarh Tour",
    image: "/tour/chhattisgarh.png",
  },
] as const;


// ============================================================
// FLEET
// ============================================================

export const FLEET = [
  {
    name: "Swift Dzire",
    type: "Sedan",
    seats: "4+1 Seats",
    image: "/dezire.png",
    tag: "Popular",
  },
  {
    name: "Ertiga",
    type: "MUV",
    seats: "6+1 Seats",
    image: "/ertiga.png",
    tag: "Family Choice",
  },
  {
    name: "Innova",
    type: "SUV",
    seats: "6+1 Seats",
    image: "/crysta.png",
    tag: "Comfort",
  },
  {
    name: "Innova Crysta",
    type: "Premium SUV",
    seats: "6+1 Seats",
    image: "/crysta_hero.png",
    tag: "Premium",
  },
  {
    name: "Scorpio",
    type: "SUV",
    seats: "6+1 Seats",
    image: "/scorpio.png",
    tag: "Adventure",
  },
] as const;


// ============================================================
// CAB SERVICES
// ============================================================

export const SERVICES = [
  [
    "01",
    "One Way Taxi",
    "Travel from one city to another without paying for an unnecessary return journey.",
  ],
  [
    "02",
    "Round Trip",
    "Dedicated cab and driver for family, business and multi-day outstation travel.",
  ],
  [
    "03",
    "Airport Taxi",
    "Reliable airport pickup and drop with flight-friendly coordination.",
  ],
  [
    "04",
    "Local Cab Rental",
    "Flexible city packages for business, sightseeing and personal travel.",
  ],
  [
    "05",
    "Tour Packages",
    "Comfortable vehicles for spiritual, family and holiday journeys.",
  ],
  [
    "06",
    "Corporate Travel",
    "Employee, client, hotel and business transportation support.",
  ],
] as const;


// ============================================================
// CUSTOMER REVIEWS
// ============================================================
// NOTE:
// These are structured sample/testimonial entries for the
// website carousel. Only publish them as actual Google/customer
// reviews if they represent genuine customer feedback.
// ============================================================

export const REVIEWS = [
  {
    name: "Amit Verma",
    route: "Korba → Raipur",
    text: "Very professional cab service from Korba to Raipur. The car was clean, the driver was polite and we reached on time. Good experience.",
    rating: 5,
  },

  {
    name: "Priya Sharma",
    route: "Raipur → Bilaspur",
    text: "Smooth booking and a comfortable cab from Raipur to Bilaspur. The driver was helpful and the journey was completely hassle-free.",
    rating: 5,
  },

  {
    name: "Rahul Singh",
    route: "Raipur Airport → Korba",
    text: "Booked a Raipur Airport taxi for Korba. The driver arrived before time and airport pickup was very convenient. Highly recommended.",
    rating: 5,
  },

  {
    name: "Neha Agrawal",
    route: "Bilaspur → Raipur",
    text: "Good one way cab service from Bilaspur to Raipur. The vehicle was comfortable and the driver maintained good driving standards throughout the trip.",
    rating: 5,
  },

  {
    name: "Vikas Patel",
    route: "Raipur → Durg",
    text: "Booked a cab from Raipur to Durg and had a comfortable journey. Easy booking, clean vehicle and professional driver.",
    rating: 5,
  },

  {
    name: "Sandeep Gupta",
    route: "Raipur → Bhilai",
    text: "The Bhilai cab service was convenient and the booking process was simple. Driver was punctual and the car was in good condition.",
    rating: 5,
  },

  {
    name: "Pooja Sahu",
    route: "Durg → Raipur",
    text: "Very comfortable taxi service from Durg to Raipur. The driver was courteous and reached the pickup location on time.",
    rating: 5,
  },

  {
    name: "Manish Tiwari",
    route: "Raipur → Korba",
    text: "Booked a one way taxi from Raipur to Korba. The journey was smooth and comfortable. Good service for outstation travel.",
    rating: 5,
  },

  {
    name: "Rakesh Jain",
    route: "Korba → Bilaspur",
    text: "Needed an outstation cab from Korba to Bilaspur and the booking was easy. Comfortable vehicle and polite driver.",
    rating: 5,
  },

  {
    name: "Anjali Verma",
    route: "Raipur Airport → Bilaspur",
    text: "Excellent airport transfer experience. Our Raipur Airport cab arrived on time and the journey to Bilaspur was comfortable.",
    rating: 5,
  },

  {
    name: "Deepak Yadav",
    route: "Raipur → Khatu Shyam",
    text: "Booked a cab for a Khatu Shyam spiritual journey. The vehicle was comfortable for the long trip and the driver was very cooperative.",
    rating: 5,
  },

  {
    name: "Kavita Sharma",
    route: "Raipur → Ujjain",
    text: "We booked an outstation cab for our Ujjain trip. The journey was comfortable and the driver was supportive throughout the travel.",
    rating: 5,
  },

  {
    name: "Rohit Mishra",
    route: "Raipur → Ayodhya",
    text: "Good cab service for a family pilgrimage to Ayodhya. The car was clean and there was good coordination during the journey.",
    rating: 5,
  },

  {
    name: "Sunil Kumar",
    route: "Raipur → Varanasi",
    text: "Booked a long-distance taxi for Varanasi. Comfortable vehicle, professional driver and smooth communication from booking to drop.",
    rating: 5,
  },

  {
    name: "Meena Patel",
    route: "Raipur → Prayagraj",
    text: "Our Prayagraj trip by cab was comfortable and well managed. The driver was polite and the vehicle was suitable for our family.",
    rating: 5,
  },

  {
    name: "Ashok Sahu",
    route: "Raipur → Puri",
    text: "Booked a cab for our Puri trip and had a pleasant travel experience. The vehicle was clean and the driver was experienced.",
    rating: 5,
  },

  {
    name: "Nitin Agrawal",
    route: "Raipur Airport → Bhilai",
    text: "Very convenient airport pickup from Raipur Airport to Bhilai. Driver was already waiting and helped with the luggage. Good service.",
    rating: 5,
  },

  {
    name: "Swati Singh",
    route: "Raipur Airport → Durg",
    text: "The airport taxi booking was quick and easy. Pickup was on time and the cab ride from Raipur Airport to Durg was comfortable.",
    rating: 5,
  },

  {
    name: "Rajesh Verma",
    route: "Bilaspur → Korba",
    text: "Booked a Bilaspur to Korba cab for an important trip. Driver was punctual, polite and drove safely. Overall a good experience.",
    rating: 5,
  },

  {
    name: "Shweta Jain",
    route: "Korba → Raipur Airport",
    text: "Needed an early morning cab from Korba to Raipur Airport. The driver arrived on time and we reached the airport comfortably.",
    rating: 5,
  },

  {
    name: "Arun Kumar",
    route: "Raipur → Chitrakoot",
    text: "We booked an outstation cab for Chitrakoot. The journey was comfortable and the driver was familiar with the route and travel requirements.",
    rating: 5,
  },

  {
    name: "Pankaj Soni",
    route: "Raipur → Bastar",
    text: "Good travel experience for our Bastar trip. The cab was comfortable for the long journey and the driver was helpful throughout.",
    rating: 5,
  },

  {
    name: "Komal Gupta",
    route: "Raipur → Tirathgarh",
    text: "Booked a cab for a Chhattisgarh sightseeing trip including Tirathgarh. Comfortable vehicle and good driver support made the journey enjoyable.",
    rating: 5,
  },

  {
    name: "Mohit Sharma",
    route: "Bhilai → Raipur Airport",
    text: "Reliable airport drop service from Bhilai to Raipur Airport. Pickup was punctual and the journey was smooth. Good option for airport travel.",
    rating: 5,
  },

  {
    name: "Ravi Tiwari",
    route: "Durg → Bilaspur",
    text: "Had a comfortable outstation journey from Durg to Bilaspur. Booking was easy and the driver was professional and courteous.",
    rating: 5,
  },

  {
    name: "Nisha Sahu",
    route: "Raipur Local Cab",
    text: "Used Khatu Rides for local cab service in Raipur. The vehicle was clean and the booking process was simple and convenient.",
    rating: 5,
  },

  {
    name: "Harish Patel",
    route: "Raipur → Korba",
    text: "Good experience with the Raipur to Korba one way cab service. The driver arrived on time and the ride was comfortable.",
    rating: 5,
  },

  {
    name: "Aarti Verma",
    route: "Bilaspur → Raipur Airport",
    text: "Booked an airport cab from Bilaspur to Raipur Airport for an early flight. The driver was punctual and we reached comfortably before departure.",
    rating: 5,
  },

  {
    name: "Vivek Sharma",
    route: "Raipur → Khatu Shyam → Raipur",
    text: "We booked a round trip cab for Khatu Shyam. The vehicle was comfortable for our family and the driver was cooperative during the entire trip.",
    rating: 5,
  },

  {
    name: "Ramesh Yadav",
    route: "Raipur → Ayodhya → Varanasi",
    text: "Our family planned a spiritual tour covering Ayodhya and Varanasi. Khatu Rides provided a comfortable vehicle and helpful driver for the journey.",
    rating: 5,
  },
];
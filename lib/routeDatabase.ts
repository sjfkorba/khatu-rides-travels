// src/data/routeDatabase.ts

export type RouteFAQ = {
  q: string;
  a: string;
};

export type RouteData = {
  h1: string;
  title: string;
  desc: string;
  from: string;
  to: string;
  dist: string;
  dur: string;
  fareNote: string;
  intro: string;
  sectionTitle: string;
  sectionParagraphs: string[];
  faqs: RouteFAQ[];
};

export const routeDatabase: Record<string, RouteData> = {
  "korba-to-raipur-taxi": {
    h1: "Korba to Raipur Taxi Service",
    title: "Korba to Raipur Cab Booking | Flat Rates",
    desc: "Book reliable Korba to Raipur taxi service with clean cabs, trained drivers, flexible pickup, and transparent pricing for one-way and round-trip travel.",
    from: "Korba",
    to: "Raipur",
    dist: "210 KM",
    dur: "5 Hours",
    fareNote: "One-way, round trip, local stopovers, and custom travel plans available.",
    intro:
      "Trusted intercity cab booking for business trips, family travel, airport transfers, railway station pickup, and personal outstation journeys.",
    sectionTitle: "Comfortable and reliable intercity cab booking",
    sectionParagraphs: [
      "Khatu Rides provides dependable Korba to Raipur taxi service for passengers who want a clean vehicle, professional driver support, and a smooth booking experience. This route is frequently booked for family visits, business meetings, airport connections, railway station transfers, medical travel, and urgent outstation needs, so our focus stays on punctuality, communication, and practical pricing.",
      "Whether you need a one-way cab from Korba to Raipur or a round-trip taxi with return on the same day or later, we help you choose the right vehicle according to passenger count, luggage, and comfort preference. Customers can book sedan, MPV, and premium SUV options depending on budget and travel purpose, which makes the service suitable for solo riders, families, and corporate travelers.",
      "Our booking process is simple. You can check trip details, use the fare calculator, and confirm your cab through phone or WhatsApp support. We keep the process straightforward so that you get clarity on travel type, pickup timing, and vehicle selection before the journey begins. This reduces confusion and helps customers avoid hidden charges or last-minute availability issues.",
      "If you are searching for the best Korba to Raipur cab booking service, service quality matters more than just a low headline price. A good intercity taxi should provide timely pickup, clean cars, trained drivers, and route familiarity. Khatu Rides is designed for travelers who want local support with a more organized booking experience and consistent assistance from inquiry to trip completion."
    ],
    faqs: [
      {
        q: "What is the taxi fare from Korba to Raipur?",
        a: "Taxi fare depends on cab category, one-way or round-trip plan, date, and pickup timing. Use the fare calculator or contact Khatu Rides for the latest exact fare."
      },
      {
        q: "Is one-way taxi available from Korba to Raipur?",
        a: "Yes, one-way cab booking is available for Korba to Raipur along with round-trip and custom outstation travel plans."
      },
      {
        q: "Can I book pickup from home, station, or airport?",
        a: "Yes, pickup and drop can be arranged from home, hotel, railway station, airport, or other selected locations based on your travel plan."
      }
    ]
  },

  "bilaspur-to-raipur-taxi": {
    h1: "Bilaspur to Raipur Taxi Service",
    title: "Bilaspur to Raipur Cab Booking | Flat Rates",
    desc: "Book reliable Bilaspur to Raipur taxi service with clean cabs, trained drivers, flexible pickup, and transparent pricing for one-way and round-trip travel.",
    from: "Bilaspur",
    to: "Raipur",
    dist: "120 KM",
    dur: "2.5 Hours",
    fareNote: "One-way, round trip, local stopovers, and custom travel plans available.",
    intro: "Trusted intercity cab booking for business trips, family travel, airport transfers, railway station pickup, and personal outstation journeys.",
    sectionTitle: "Comfortable and reliable Bilaspur to Raipur cab booking",
    sectionParagraphs: [
      "Khatu Rides provides dependable Bilaspur to Raipur taxi service for passengers who want a clean vehicle, professional driver support, and a smooth booking experience. This route is frequently booked for official work, family visits, business meetings, airport connections, and medical travel, so our focus stays on punctuality, communication, and practical pricing.",
      "Whether you need a one-way cab from Bilaspur to Raipur or a round-trip taxi with return on the same day or later, we help you choose the right vehicle according to passenger count, luggage, and comfort preference. Customers can book sedan, MPV, and premium SUV options depending on budget and travel purpose.",
      "Our booking process is simple. You can check trip details, use the fare calculator, and confirm your cab through phone or WhatsApp support. We keep the process straightforward so that you get clarity on pickup timing and vehicle selection before the journey begins.",
      "If you are searching for the best Bilaspur to Raipur cab booking service, Khatu Rides is designed for travelers who want local support with an organized booking experience and consistent assistance from inquiry to trip completion."
    ],
    faqs: [
      {
        q: "What is the taxi fare from Bilaspur to Raipur?",
        a: "Taxi fare depends on cab category, one-way or round-trip plan, date, and pickup timing. Contact Khatu Rides or use our fare calculator for exact details."
      },
      {
        q: "Is one-way taxi available from Bilaspur to Raipur?",
        a: "Yes, one-way cab booking is available along with round-trip and custom outstation travel plans."
      },
      {
        q: "Can I book pickup from home, station, or hotel?",
        a: "Yes, door-to-door pickup and drop can be arranged from any location in Bilaspur and Raipur."
      }
    ]
  },

  

  "chakarbhata-airport-to-korba-taxi": {
    h1: "Chakarbhata Airport to Korba Taxi Service",
    title: "Chakarbhata Airport (Bilaspur) to Korba Cab Booking",
    desc: "Direct taxi booking from Chakarbhata Airport (Bilaspur) to Korba. Punctual airport pickup, clean cars, and fixed pricing with zero waiting stress.",
    from: "Chakarbhata Airport (Bilaspur)",
    to: "Korba",
    dist: "90 KM",
    dur: "2 Hours",
    fareNote: "Flight-synchronized airport pickup with direct drop to Korba.",
    intro: "Prompt and reliable airport taxi transfer service connecting Bilaspur Chakarbhata Airport directly to Korba city and industrial areas.",
    sectionTitle: "Smooth airport transfers from Chakarbhata to Korba",
    sectionParagraphs: [
      "Arriving at Bilasa Devi Kewat Airport (Chakarbhata) and heading straight to Korba? Khatu Rides provides pre-booked airport cabs that wait for you at the terminal, ensuring you do not waste time searching for local transport.",
      "We track flight timings to manage delays and offer instant driver allocation for a hassle-free transition from flight to highway journey. Perfect for plant executives, power sector personnel, and business travelers visiting Korba.",
      "Select from clean, air-conditioned Sedans, Ertigas, and Innovas to fit your luggage and party size comfortably for the 2-hour road travel.",
      "Avoid overpriced instant taxi quotes by locking in your fixed flat rate with Khatu Rides prior to landing."
    ],
    faqs: [
      {
        q: "How far is Korba from Chakarbhata Airport?",
        a: "The distance is approximately 90 KM, which takes around 2 hours by cab."
      },
      {
        q: "What happens if my flight to Chakarbhata is delayed?",
        a: "Our drivers keep track of flight timings and adjust pickup time accordingly without extra hassle."
      },
      {
        q: "Can I get drop-off at NTPC or BALCO townships in Korba?",
        a: "Yes, we provide door-to-door drops across all residential, industrial, and township areas in Korba."
      }
    ]
  },

  "korba-to-chakarbhata-airport-taxi": {
    h1: "Korba to Chakarbhata Airport Taxi Service",
    title: "Korba to Chakarbhata Airport Cab | Timely Airport Transfer",
    desc: "Book reliable Korba to Chakarbhata Airport (Bilaspur) taxi with on-time doorstep pickup, safe drivers, and fixed rates for peaceful flight catch.",
    from: "Korba",
    to: "Chakarbhata Airport (Bilaspur)",
    dist: "90 KM",
    dur: "2 Hours",
    fareNote: "Guaranteed on-time pickup for hassle-free flight departures.",
    intro: "Dependable airport drop taxi service from Korba to Chakarbhata (Bilaspur) Airport for effortless and punctual flight catch.",
    sectionTitle: "Punctual Korba to Chakarbhata Airport Cab Transfers",
    sectionParagraphs: [
      "Catching a flight from Chakarbhata Airport? Khatu Rides guarantees timely doorstep pickup from Korba so you reach the airport terminal well before check-in closes.",
      "We prioritize route efficiency and driver punctuality for all airport runs, eliminating anxiety about missed flights or highway traffic delays.",
      "Our fleet includes well-maintained Sedans and spacious SUVs equipped with clean seating, AC, and plenty of boot space for your luggage.",
      "Book conveniently via phone call or WhatsApp, receiving instant confirmation and driver tracking details prior to trip departure."
    ],
    faqs: [
      {
        q: "How much in advance should I book a cab from Korba to Chakarbhata Airport?",
        a: "We recommend booking at least 4 to 6 hours prior, though advance booking guarantees your preferred car model."
      },
      {
        q: "Do drivers assist with heavy luggage?",
        a: "Yes, our drivers are courteous and gladly assist with loading and unloading your luggage."
      },
      {
        q: "Is nighttime pickup available from Korba for early morning flights?",
        a: "Yes, 24/7 pickup is available across all locations in Korba."
      }
    ]
  },

  "bilaspur-to-raipur-airport-taxi": {
    h1: "Bilaspur to Raipur Airport Taxi Service",
    title: "Bilaspur to Raipur Airport Cab Booking | Fixed Rates",
    desc: "Direct taxi from Bilaspur to Swami Vivekananda Airport (Raipur). On-time pickup, clean cabs, and direct terminal drop for a stress-free flight catch.",
    from: "Bilaspur",
    to: "Raipur Airport (RPR)",
    dist: "135 KM",
    dur: "3 Hours",
    fareNote: "Direct airport transfers with no hidden toll charges.",
    intro: "Fast, comfortable, and punctual taxi service connecting Bilaspur directly to Swami Vivekananda Airport, Raipur.",
    sectionTitle: "Dedicated Bilaspur to Swami Vivekananda Airport Transfer",
    sectionParagraphs: [
      "Traveling from Bilaspur to Raipur Airport (Mana) requires a punctual cab service so you never miss a flight. Khatu Rides offers dedicated airport transfer taxis designed specifically for precise timing and comfort.",
      "We pick you up directly from your residence, hotel, or office in Bilaspur and drop you right at the departures gate at Raipur Airport.",
      "Whether traveling solo with light bags or in a group with heavy luggage, choose between Swift Dzire, Etios, Ertiga, or Innova for maximum road comfort.",
      "Enjoy transparent flat-rate pricing with zero surprise additions at the end of your trip."
    ],
    faqs: [
      {
        q: "What is the travel time from Bilaspur to Raipur Airport by taxi?",
        a: "It takes around 2.5 to 3 hours to cover the 135 KM route depending on city traffic."
      },
      {
        q: "Will the cab drop me directly at the flight departures gate?",
        a: "Yes, our cabs provide direct drop-off right at the departure terminal gate of Raipur Airport."
      },
      {
        q: "Can I schedule a middle-of-the-night pickup from Bilaspur?",
        a: "Yes, we operate 24/7 airport cab services with prior booking."
      }
    ]
  },

  "raipur-airport-to-bilaspur-taxi": {
    h1: "Raipur Airport to Bilaspur Taxi Service",
    title: "Raipur Airport to Bilaspur Cab Booking | Terminal Pickup",
    desc: "Book hassle-free taxi from Raipur Airport (Mana) to Bilaspur. Driver waiting at arrival gate, clean AC cars, and direct drop to your Bilaspur home or hotel.",
    from: "Raipur Airport (RPR)",
    to: "Bilaspur",
    dist: "135 KM",
    dur: "3 Hours",
    fareNote: "Terminal pickup with flight tracking support.",
    intro: "Premium terminal pickup taxi service from Swami Vivekananda Airport Raipur to any location in Bilaspur.",
    sectionTitle: "Relaxed rides from Raipur Airport to Bilaspur",
    sectionParagraphs: [
      "After landing at Swami Vivekananda Airport (Raipur), avoid long queues and local driver haggling by booking a pre-arranged cab with Khatu Rides.",
      "Our driver arrives at the airport ahead of your landing time and assists you with your luggage right from the arrival exit.",
      "Enjoy a smooth 3-hour journey to Bilaspur in a clean, air-conditioned vehicle with high-speed highway comfort and relaxed seating.",
      "Flexible payment options and instant digital invoices make this service ideal for corporate travelers and visiting executives."
    ],
    faqs: [
      {
        q: "Where will the driver wait for me at Raipur Airport?",
        a: "The driver will wait near the designated arrival exit gate with your name tag or contact you directly on arrival."
      },
      {
        q: "Is there any extra charge if the flight is delayed?",
        a: "No, we monitor flight status and adjust pickup timing accordingly without charging extra waiting fees for reasonable flight delays."
      },
      {
        q: "Can I book a cab for multiple stops in Bilaspur?",
        a: "Yes, multi-stop and custom drop plans can be arranged at the time of booking."
      }
    ]
  },
//
  "raipur-to-bilaspur-taxi": {
  h1: "Raipur to Bilaspur Taxi Service",
  title: "Raipur to Bilaspur Cab Booking | One Way & Round Trip",
  desc: "Book Raipur to Bilaspur taxi service with clean cabs, easy booking, and reliable intercity travel support for one-way and round-trip rides.",
  from: "Raipur",
  to: "Bilaspur",
  dist: "140 KM",
  dur: "3.5 Hours",
  fareNote: "Available for one-way transfer, round trip, and custom booking plans.",
  intro:
    "Practical taxi service for business travel, family trips, station transfers, and direct city-to-city road journeys.",
  sectionTitle: "Comfortable Raipur to Bilaspur cab booking with direct support",
  sectionParagraphs: [
    "Khatu Rides offers Raipur to Bilaspur taxi service for passengers looking for clean vehicles, simple booking, and clear communication. This route is regularly used for work travel, family visits, railway station transfers, medical appointments, and personal outstation movement.",
    "Passengers can book one-way taxi service or choose a round-trip plan depending on schedule and return needs. Sedan, MPV, and premium vehicle options help customers select the right ride according to comfort, luggage, and passenger count.",
    "The route page is designed to make booking easier by keeping fare estimate access, route details, and contact support in one place. This helps users save time and compare options quickly.",
    "For Raipur to Bilaspur cab booking, the travel experience depends on timely pickup, cab condition, and communication quality. Khatu Rides focuses on these essentials to give customers a more dependable route booking experience."
  ],
  faqs: [
    {
      q: "What is the taxi fare from Raipur to Bilaspur?",
      a: "Fare depends on cab type, trip format, date, and pickup schedule. Use the fare calculator or contact us for the latest quote."
    },
    {
      q: "Is one-way taxi available from Raipur to Bilaspur?",
      a: "Yes, one-way taxi service is available, and return-trip booking can also be arranged."
    },
    {
      q: "Can I book pickup from airport, home, or station?",
      a: "Yes, pickup can be arranged from airport, home, hotel, railway station, or another selected location."
    }
  ]
},

"raipur-to-raigarh-taxi": {
  h1: "Raipur to Raigarh Taxi Service",
  title: "Raipur to Raigarh Cab Booking | Reliable Outstation Taxi",
  desc: "Book Raipur to Raigarh taxi service with comfortable cabs, trained drivers, and direct booking support for one-way and round-trip travel.",
  from: "Raipur",
  to: "Raigarh",
  dist: "250 KM",
  dur: "5.5 Hours",
  fareNote: "One-way, return-trip, and custom outstation bookings available.",
  intro:
    "Suitable for family travel, office movement, personal trips, and long intercity road journeys with flexible pickup support.",
  sectionTitle: "Trusted Raipur to Raigarh intercity taxi service",
  sectionParagraphs: [
    "Khatu Rides provides Raipur to Raigarh taxi service for passengers who want a smoother booking process and more dependable road travel. This route is frequently booked for business meetings, family visits, station travel, and direct outstation movement.",
    "Travelers can choose one-way booking or a round-trip plan according to timing and convenience. Vehicle options are available for solo passengers, couples, families, and small groups who need better comfort or luggage capacity.",
    "This route page brings together route information, service details, fare estimate access, and booking support so users can make decisions faster without extra navigation.",
    "For Raipur to Raigarh cab booking, a better ride experience comes from punctual pickup, vehicle quality, and direct communication. Khatu Rides is designed to support customers with a more route-focused booking system."
  ],
  faqs: [
    {
      q: "How much is the taxi fare from Raipur to Raigarh?",
      a: "Fare depends on vehicle category, travel date, trip type, and route requirement. Use the fare calculator or contact us directly for the latest fare."
    },
    {
      q: "Do you provide one-way taxi service from Raipur to Raigarh?",
      a: "Yes, one-way taxi booking is available, and round-trip travel plans can also be arranged."
    },
    {
      q: "Can I choose my pickup location and time?",
      a: "Yes, pickup location and timing can be selected based on your schedule and vehicle availability."
    }
  ]
},

  "raipur-to-korba-taxi": {
    h1: "Raipur to Korba Taxi Service",
    title: "Raipur to Korba Cab Booking | Best Fare",
    desc: "Experience dependable Raipur to Korba taxi service with verified drivers, clean vehicles, and simple booking for airport, family, and business travel.",
    from: "Raipur",
    to: "Korba",
    dist: "210 KM",
    dur: "5 Hours",
    fareNote: "Flexible pickup timing with direct and return-trip options.",
    intro:
      "Fast and trusted intercity taxi service for family travel, office trips, airport pickup, railway station transfer, and comfortable outstation rides.",
    sectionTitle: "Feel Premium Cab Journey With Khatu Rides Travels Co.",
    sectionParagraphs: [
      "Khatu Rides offers Raipur to Korba taxi service for passengers who want a better booking experience, transparent communication, and dependable road travel. This route is commonly used for business travel, personal visits, family functions, station transfers, and airport connectivity, so passengers usually look for comfort, timing flexibility, and a vehicle that matches their trip need.",
      "We support one-way taxi booking, round-trip cab service, and custom travel plans for Raipur to Korba. Travelers can choose among sedan, MPV, and premium larger vehicles according to luggage, passenger count, and ride comfort. This makes the route suitable for solo passengers, couples, families, and small groups who need organized and direct intercity transport.",
      "The booking flow is designed to be simple and conversion-focused. Instead of making customers search across multiple pages, this route page highlights travel information, vehicle choices, service features, and quick contact options in one place. You can estimate the trip, connect on WhatsApp or call directly, and confirm your requirement without unnecessary steps.",
      "For outstation taxi bookings, passengers care about real service quality: clean cabs, experienced drivers, fair pricing, and pickup reliability. Khatu Rides aims to deliver that with a stronger route-specific experience. If you are looking for Raipur to Korba cab booking with fast response and a more premium feel, this page is built to help customers compare, trust, and book faster."
    ],
    faqs: [
      {
        q: "What is the taxi fare from Raipur to Korba?",
        a: "Fare depends on the selected cab model, trip type, travel timing, and any custom stop requirements. Use the calculator above or contact us for the latest quote."
      },
      {
        q: "Do you provide one-way cab service on this route?",
        a: "Yes, one-way taxi service is available from Raipur to Korba, and round-trip booking is also available."
      },
      {
        q: "Can I book a cab for airport or railway station pickup?",
        a: "Yes, pickup can be arranged from airport, railway station, hotel, home, or another selected point based on schedule and availability."
      }
    ]
  },

  "korba-to-bilaspur-taxi": {
    h1: "Korba to Bilaspur Taxi Service",
    title: "Korba to Bilaspur Cab Booking | One Way & Round Trip",
    desc: "Book Korba to Bilaspur taxi service for smooth intercity travel with clean cabs, reliable drivers, and easy one-way or round-trip booking.",
    from: "Korba",
    to: "Bilaspur",
    dist: "120 KM",
    dur: "3 Hours",
    fareNote: "Available for one-way transfer, return booking, and custom travel plans.",
    intro:
      "Comfortable road travel for family trips, office work, station transfers, hospital visits, and personal outstation needs.",
    sectionTitle: "Easy Korba to Bilaspur cab booking for every travel need",
    sectionParagraphs: [
      "Khatu Rides offers reliable Korba to Bilaspur taxi service for passengers looking for timely pickup, simple communication, and a comfortable road journey. This route is commonly booked for family visits, official meetings, shopping travel, railway station transfers, medical appointments, and urgent intercity movement.",
      "Customers can choose one-way taxi booking or round-trip cab service depending on their travel plan. Vehicle options such as sedan, MPV, and premium SUV help passengers book according to budget, group size, luggage requirement, and comfort expectation, making the service suitable for both individual and family travelers.",
      "The booking process is kept direct and user-friendly. You can use the fare calculator, review route information, and confirm the trip through call or WhatsApp support. This route page is designed to reduce booking friction and provide practical details in one place.",
      "If you want a dependable Korba to Bilaspur cab booking service, focus on overall travel experience instead of just price. Clean vehicles, route familiarity, punctual pickup, and direct support make a strong difference in outstation travel, and that is where Khatu Rides aims to provide better value."
    ],
    faqs: [
      {
        q: "What is the taxi fare from Korba to Bilaspur?",
        a: "Fare depends on vehicle type, trip type, pickup timing, and route requirement. Use the fare calculator or contact us directly for the latest fare."
      },
      {
        q: "Is one-way cab available from Korba to Bilaspur?",
        a: "Yes, one-way taxi service is available, and you can also book a return trip according to your schedule."
      },
      {
        q: "Can I book the cab for station or home pickup?",
        a: "Yes, pickup can be arranged from home, hotel, railway station, or another selected point."
      }
    ]
  },

  "bilaspur-to-korba-taxi": {
    h1: "Bilaspur to Korba Taxi Service",
    title: "Bilaspur to Korba Cab Booking | Best Outstation Taxi",
    desc: "Book Bilaspur to Korba taxi service with professional drivers, clean vehicles, and simple booking for direct intercity travel.",
    from: "Bilaspur",
    to: "Korba",
    dist: "120 KM",
    dur: "3 Hours",
    fareNote: "One-way, round-trip, and custom booking options available.",
    intro:
      "Trusted cab booking support for personal travel, family trips, office rides, station transfers, and planned outstation journeys.",
    sectionTitle: "Dependable Bilaspur to Korba intercity taxi service",
    sectionParagraphs: [
      "Khatu Rides provides Bilaspur to Korba taxi service for travelers who want easy booking, clean cabs, and consistent support. This route is useful for work travel, family movement, return journeys, station pickup, medical appointments, and routine intercity trips where punctuality matters.",
      "Passengers can select one-way or round-trip booking based on timing and convenience. Sedan and larger vehicle options make the service flexible for solo rides, couples, families, and small groups who need more luggage space or added travel comfort.",
      "Our aim is to keep booking simple. Instead of forcing travelers through multiple steps, this page gives route details, service highlights, fare estimate access, and quick contact options in one structured experience.",
      "For Bilaspur to Korba cab booking, a better customer experience comes from cleaner vehicles, organized communication, and dependable pickup support. Khatu Rides focuses on making these essentials available for every traveler."
    ],
    faqs: [
      {
        q: "How much is the taxi fare from Bilaspur to Korba?",
        a: "Fare depends on the selected cab, trip format, date, and pickup details. Contact us or use the fare calculator for the latest price."
      },
      {
        q: "Can I book a one-way taxi from Bilaspur to Korba?",
        a: "Yes, one-way taxi booking is available along with return-trip and custom outstation plans."
      },
      {
        q: "Do you offer pickup from railway station or hotel?",
        a: "Yes, pickup can be arranged from railway station, hotel, home, or another preferred location."
      }
    ]
  },

  "korba-to-jagdalpur-taxi": {
    h1: "Korba to Jagdalpur Taxi Service",
    title: "Korba to Jagdalpur Cab Booking | Comfortable Outstation Ride",
    desc: "Book Korba to Jagdalpur taxi service with comfortable cabs, flexible booking, and direct support for long-distance outstation travel.",
    from: "Korba",
    to: "Jagdalpur",
    dist: "330 KM",
    dur: "8 Hours",
    fareNote: "Long-route taxi booking available with one-way and round-trip plans.",
    intro:
      "Ideal for personal travel, official visits, family journeys, and long-distance intercity movement with planned stops.",
    sectionTitle: "Long-distance Korba to Jagdalpur taxi booking made easier",
    sectionParagraphs: [
      "Khatu Rides offers Korba to Jagdalpur taxi service for travelers who need a more dependable option for long-route road travel. On longer routes, passengers usually care more about cab condition, driver reliability, communication clarity, and pickup planning, which is why this route page is designed around practical decision-making.",
      "Whether the requirement is one-way travel or a round trip with return later, travelers can select the most suitable cab based on passenger count, luggage, and comfort level. Sedan, MPV, and premium SUV choices help serve family travel, office trips, and outstation ride requirements more effectively.",
      "The booking process is kept straightforward so that users can review route information, estimate fare, and connect directly for trip confirmation. This helps reduce confusion and makes long-distance travel planning simpler.",
      "For Korba to Jagdalpur cab booking, dependable support matters because the journey is longer and more planning-sensitive than short city transfers. Khatu Rides focuses on helping customers book with more confidence and clarity."
    ],
    faqs: [
      {
        q: "Is one-way taxi available from Korba to Jagdalpur?",
        a: "Yes, one-way taxi service is available, and return-trip booking can also be arranged."
      },
      {
        q: "How is fare calculated for Korba to Jagdalpur taxi?",
        a: "Fare depends on cab type, route requirement, stopovers, timing, and trip format. Use the calculator or contact us for a direct quote."
      },
      {
        q: "Can I request custom pickup timing for this route?",
        a: "Yes, pickup timing can be planned according to trip schedule and vehicle availability."
      }
    ]
  },

  "jagdalpur-to-korba-taxi": {
    h1: "Jagdalpur to Korba Taxi Service",
    title: "Jagdalpur to Korba Cab Booking | Safe & Easy Travel",
    desc: "Book Jagdalpur to Korba taxi service for safe and comfortable intercity travel with flexible pickup and direct booking support.",
    from: "Jagdalpur",
    to: "Korba",
    dist: "330 KM",
    dur: "8 Hours",
    fareNote: "One-way and round-trip long-distance cab booking available.",
    intro:
      "Reliable option for long-distance family travel, official movement, and direct city-to-city road journeys.",
    sectionTitle: "Trusted Jagdalpur to Korba road travel support",
    sectionParagraphs: [
      "Khatu Rides provides Jagdalpur to Korba taxi service for passengers who need practical support for long-distance road travel. This route is suitable for business travel, family return journeys, urgent movement, and organized outstation trips where timing and comfort both matter.",
      "Travelers can choose one-way booking or round-trip planning depending on their schedule. Different vehicle categories help match the journey with budget, luggage load, and comfort preference, making the booking more flexible for different traveler types.",
      "Our route page is structured to make booking easier. Instead of generic information, users can review route details, service highlights, fare access, and contact options in one location for faster decision-making.",
      "A good Jagdalpur to Korba cab service should offer clean vehicles, planned pickup, direct communication, and consistent support. Khatu Rides is designed to provide that route-focused booking experience."
    ],
    faqs: [
      {
        q: "What is the fare for Jagdalpur to Korba taxi?",
        a: "Fare depends on cab category, trip plan, route preference, and travel date. Contact us or use the fare calculator for an estimate."
      },
      {
        q: "Do you provide one-way taxi from Jagdalpur to Korba?",
        a: "Yes, one-way cab service is available for this route, along with return-trip planning."
      },
      {
        q: "Can I get pickup from hotel or selected location?",
        a: "Yes, pickup can be arranged from hotel, home, or another selected point based on your travel plan."
      }
    ]
  },

  "korba-to-ambikapur-taxi": {
    h1: "Korba to Ambikapur Taxi Service",
    title: "Korba to Ambikapur Cab Booking | Outstation Taxi",
    desc: "Book Korba to Ambikapur taxi service with direct support, clean vehicles, and flexible one-way or round-trip options.",
    from: "Korba",
    to: "Ambikapur",
    dist: "200 KM",
    dur: "5 Hours",
    fareNote: "Suitable for one-way travel, return rides, and custom route plans.",
    intro:
      "Smart intercity cab booking for office travel, family visits, personal trips, and station pickup needs.",
    sectionTitle: "Smooth Korba to Ambikapur intercity taxi booking",
    sectionParagraphs: [
      "Khatu Rides offers Korba to Ambikapur taxi service for passengers looking for a clean vehicle, practical fare, and a booking process that feels easier to use. This route is often needed for family travel, official work, personal movement, and planned outstation requirements.",
      "Passengers can choose sedan, MPV, or premium vehicle types depending on luggage, travel comfort, and group size. One-way and round-trip options make the route suitable for both direct transfer and return planning.",
      "This route page is created to give real booking value. Customers can review route-specific details, estimate fare, and connect directly for confirmation without unnecessary steps.",
      "For Korba to Ambikapur cab booking, reliable pickup, better communication, and organized support make a visible difference in customer experience. Khatu Rides is built to deliver that in a more focused way."
    ],
    faqs: [
      {
        q: "Is Korba to Ambikapur one-way taxi available?",
        a: "Yes, one-way taxi service is available, and you can also book round-trip plans."
      },
      {
        q: "How do I know the fare for this route?",
        a: "Fare depends on the selected cab type, trip format, and timing. Use the fare calculator or call for the latest quote."
      },
      {
        q: "Can I choose pickup time and location?",
        a: "Yes, pickup time and location can be selected based on your schedule and route plan."
      }
    ]
  },

  "ambikapur-to-korba-taxi": {
    h1: "Ambikapur to Korba Taxi Service",
    title: "Ambikapur to Korba Cab Booking | Reliable Taxi Service",
    desc: "Book Ambikapur to Korba taxi service with easy booking, verified driver support, and comfortable outstation travel options.",
    from: "Ambikapur",
    to: "Korba",
    dist: "200 KM",
    dur: "5 Hours",
    fareNote: "Available for one-way, round-trip, and route-based custom bookings.",
    intro:
      "Reliable intercity travel solution for family movement, work travel, personal journeys, and direct pickup requirements.",
    sectionTitle: "Better Ambikapur to Korba cab booking experience",
    sectionParagraphs: [
      "Khatu Rides provides Ambikapur to Korba taxi service for passengers who want easier booking and more dependable intercity road travel. This route is useful for office trips, family return travel, medical visits, personal work, and time-sensitive outstation journeys.",
      "The service supports one-way taxi booking, return-trip cab service, and custom route planning. Passengers can select suitable vehicle options based on number of travelers, travel comfort, and luggage handling needs.",
      "Instead of showing generic information, this page is structured to help customers review route details, understand service quality, access the fare calculator, and book faster through direct contact.",
      "For Ambikapur to Korba cab booking, direct communication, punctual support, and well-maintained vehicles are essential. Khatu Rides focuses on improving these basics so travelers can plan with more confidence."
    ],
    faqs: [
      {
        q: "What is the taxi fare from Ambikapur to Korba?",
        a: "Fare depends on vehicle type, trip plan, pickup timing, and any custom travel requirement. Contact us for an exact quote."
      },
      {
        q: "Can I book a one-way taxi from Ambikapur to Korba?",
        a: "Yes, one-way booking is available along with return-trip service."
      },
      {
        q: "Do you support pickup from home or station?",
        a: "Yes, home, hotel, station, and selected-location pickups can be arranged."
      }
    ]
  },

  "korba-to-raigarh-taxi": {
    h1: "Korba to Raigarh Taxi Service",
    title: "Korba to Raigarh Cab Booking | Fast & Reliable Service",
    desc: "Book Korba to Raigarh taxi service with comfortable cabs, direct assistance, and easy booking for one-way or round-trip travel.",
    from: "Korba",
    to: "Raigarh",
    dist: "160 KM",
    dur: "4 Hours",
    fareNote: "One-way and return-trip bookings available with flexible travel support.",
    intro:
      "Convenient outstation travel for family rides, business work, personal trips, and planned intercity movement.",
    sectionTitle: "Practical Korba to Raigarh cab booking support",
    sectionParagraphs: [
      "Khatu Rides provides Korba to Raigarh taxi service for customers who want a cleaner booking experience, route details in one place, and dependable intercity support. This route is often booked for business visits, family trips, personal travel, and direct outstation movement.",
      "With one-way and round-trip options, passengers can book according to schedule and travel purpose. Vehicle categories allow flexibility for budget riders, families, and travelers looking for added comfort or extra luggage space.",
      "The route page simplifies the decision process by combining route information, service benefits, fare access, and direct contact in one structured experience. This makes it easier for users to compare and book quickly.",
      "For Korba to Raigarh cab booking, the right service should balance pricing with comfort, communication, and pickup reliability. Khatu Rides aims to deliver that in a more organized format."
    ],
    faqs: [
      {
        q: "Do you offer one-way taxi service from Korba to Raigarh?",
        a: "Yes, one-way booking is available for this route, and return-trip plans are also supported."
      },
      {
        q: "How can I check Korba to Raigarh taxi fare?",
        a: "You can use the fare calculator or contact us directly for the latest route fare."
      },
      {
        q: "Can I book pickup from home or office?",
        a: "Yes, pickup can be arranged from home, office, hotel, or another selected location."
      }
    ]
  },

  "raigarh-to-korba-taxi": {
    h1: "Raigarh to Korba Taxi Service",
    title: "Raigarh to Korba Cab Booking | Outstation Cab",
    desc: "Book Raigarh to Korba taxi service for direct intercity travel with clean vehicles, fast response, and flexible trip options.",
    from: "Raigarh",
    to: "Korba",
    dist: "160 KM",
    dur: "4 Hours",
    fareNote: "Flexible one-way and round-trip taxi booking available.",
    intro:
      "Suitable for office travel, family movement, urgent rides, and comfortable point-to-point outstation service.",
    sectionTitle: "Simple and trusted Raigarh to Korba taxi booking",
    sectionParagraphs: [
      "Khatu Rides offers Raigarh to Korba taxi service for passengers who need smoother road travel and simpler booking support. This route is useful for business trips, family travel, return planning, personal work, and direct intercity transportation.",
      "Passengers can choose one-way taxi service or round-trip cab booking based on timing and travel needs. Vehicle selection remains flexible so that solo travelers, couples, and families can choose according to budget and comfort.",
      "The route page is designed to reduce friction. Instead of making users search for route data across multiple sections, it keeps the travel information, fare estimate access, and contact flow together.",
      "For Raigarh to Korba cab booking, real travel quality depends on pickup reliability, vehicle condition, and direct communication. Khatu Rides focuses on these essentials for a better route-specific experience."
    ],
    faqs: [
      {
        q: "Is one-way taxi available from Raigarh to Korba?",
        a: "Yes, one-way taxi service is available, and round-trip booking can also be arranged."
      },
      {
        q: "How is taxi fare decided on this route?",
        a: "Fare depends on the cab type, trip format, timing, and route requirement. Contact us for the latest quote."
      },
      {
        q: "Can I book from railway station or hotel?",
        a: "Yes, pickup from railway station, hotel, home, or selected point is available."
      }
    ]
  },

  "korba-to-bsp-airport-taxi": {
    h1: "Korba to Bilaspur Airport Taxi Service",
    title: "Korba to Bilaspur Airport Cab Booking | Airport Transfer",
    desc: "Book Korba to Bilaspur Airport taxi service for timely airport transfer with direct booking support and comfortable intercity travel.",
    from: "Korba",
    to: "Bilaspur Airport",
    dist: "130 KM",
    dur: "3.5 Hours",
    fareNote: "Airport transfer booking available for one-way and return plans.",
    intro:
      "Timely cab service for airport drop, flight pickup planning, business travel, and family transfer needs.",
    sectionTitle: "Reliable Korba to Bilaspur Airport transfer service",
    sectionParagraphs: [
      "Khatu Rides offers Korba to Bilaspur Airport taxi service for travelers who need punctual airport transfer and smoother planning. Airport routes need better timing control than standard travel routes, which is why clear communication and pickup support are especially important.",
      "Passengers can book direct airport drop, return transfer, or linked travel support depending on flight timing and luggage needs. Vehicle options help travelers choose according to number of passengers and ride comfort.",
      "This route page is designed to simplify airport booking by combining route details, service support, and fare estimate access in one place. That helps reduce last-minute travel stress.",
      "For Korba to Bilaspur Airport cab booking, timing accuracy, clean vehicles, and direct support matter most. Khatu Rides focuses on providing a more reliable route experience for airport travelers."
    ],
    faqs: [
      {
        q: "Can I book an airport taxi from Korba to Bilaspur Airport?",
        a: "Yes, airport transfer service is available for scheduled drop and return travel."
      },
      {
        q: "How early should I book the airport cab?",
        a: "It is better to book early, especially for fixed flight timings, so that pickup planning remains smooth."
      },
      {
        q: "Do you support return airport pickup?",
        a: "Yes, return pickup can also be arranged based on travel schedule and availability."
      }
    ]
  },

  "bilaspur-airport-to-korba-taxi": {
    h1: "Bilaspur Airport to Korba Taxi Service",
    title: "Bilaspur Airport to Korba Cab Booking | Fast Airport Pickup",
    desc: "Book Bilaspur Airport to Korba taxi service for direct airport pickup, comfortable road travel, and easy booking support.",
    from: "Bilaspur Airport",
    to: "Korba",
    dist: "130 KM",
    dur: "3.5 Hours",
    fareNote: "Airport pickup and direct city transfer booking available.",
    intro:
      "Convenient cab service for airport arrivals, family pickup, official travel, and direct drop to Korba.",
    sectionTitle: "Comfortable Bilaspur Airport to Korba pickup support",
    sectionParagraphs: [
      "Khatu Rides provides Bilaspur Airport to Korba taxi service for travelers who need a dependable airport pickup and direct road transfer. This route is important for business passengers, family arrivals, and planned airport movement where timing and coordination are key.",
      "Travelers can choose suitable cab options according to luggage, passenger count, and comfort level. The service supports direct airport pickup as well as additional stop planning if required.",
      "This route page is kept practical so users can check the route, understand service support, and quickly connect for confirmation. That helps reduce confusion after arrival.",
      "For Bilaspur Airport to Korba cab booking, the best experience comes from planned pickup, cleaner vehicles, and direct communication. Khatu Rides focuses on those basics for a more dependable transfer experience."
    ],
    faqs: [
      {
        q: "Do you provide Bilaspur Airport to Korba pickup service?",
        a: "Yes, airport pickup service is available for direct transfer to Korba."
      },
      {
        q: "Can I pre-book the cab before flight arrival?",
        a: "Yes, pre-booking is recommended so that pickup timing and coordination can be arranged properly."
      },
      {
        q: "Is this service available for family and business travel?",
        a: "Yes, the service is suitable for personal, family, and business airport transfer needs."
      }
    ]
  }
};

export const routeSlugs = Object.keys(routeDatabase);

export function getRouteBySlug(slug: string): RouteData | undefined {
  return routeDatabase[slug];
}

export const allRouteLinks = Object.entries(routeDatabase).map(([slug, route]) => ({
  href: `/routes/${slug}`,
  label: `${route.from} to ${route.to} Cab`,
}));
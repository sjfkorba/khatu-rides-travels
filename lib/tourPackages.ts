// lib/tourPackages.ts

export type TourPackage = {
  slug: string;
  title: string;
  destination: string;
  category: string;
  badge?: string;
  image: string;

  duration: string;
  startingPrice: string;

  pickup: string;
  pickupCities: string[];

  shortDescription: string;
  description: string;

  places: string[];

  highlights: string[];

  itinerary: {
    day: string;
    title: string;
    description: string;
    places: string[];
  }[];

  inclusions: string[];
  exclusions: string[];

  suitableFor: string[];

  faqs: {
    question: string;
    answer: string;
  }[];
};

/**
 * Central Tour Package Database
 *
 * IMPORTANT:
 * Prices, durations, itinerary details and images below are the
 * current working package data for the website structure.
 *
 * Replace them with your final confirmed commercial/package details
 * before publishing them as actual offers.
 */

export const tourPackages: TourPackage[] = [
  {
    slug: "khatu-shyam-ji-tour",
    title: "Khatu Shyam Ji Tour Package",
    destination: "Khatu Shyam Ji, Rajasthan",
    category: "Pilgrimage",
    badge: "Most Popular",
    image: "/tour/khatu.png",

    duration: "3 Days / 2 Nights",
    startingPrice: "₹7,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Raigarh",
      "Ambikapur",
      "Jagdalpur",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Plan a comfortable Khatu Shyam Ji pilgrimage from Chhattisgarh with private cab travel, flexible pickup and a convenient temple-focused itinerary.",

    description:
      "Khatu Shyam Ji Tour Package is designed for devotees and families travelling from Chhattisgarh towards Khatu Shyam Ji Temple in Rajasthan. Khatu Rides Travels provides private cab travel with flexible pickup options from major cities of Chhattisgarh, making the journey convenient for families, senior citizens and groups.",

    places: [
      "Khatu Shyam Ji Temple",
      "Salasar Balaji",
      "Khatu Town",
      "Rajasthan",
    ],

    highlights: [
      "Private cab travel",
      "Pickup from major Chhattisgarh cities",
      "Flexible travel planning",
      "Temple-focused itinerary",
      "Family-friendly journey",
      "Suitable for senior citizens",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Chhattisgarh to Rajasthan Journey",
        description:
          "Pickup from your selected Chhattisgarh city and begin the journey towards Rajasthan in a private cab.",
        places: [
          "Korba / Raipur / Bilaspur / Other Pickup City",
          "En-route travel",
        ],
      },
      {
        day: "Day 2",
        title: "Khatu Shyam Ji Darshan",
        description:
          "Reach Khatu region, visit Khatu Shyam Ji Temple and spend time for darshan and local spiritual experience.",
        places: [
          "Khatu Shyam Ji Temple",
          "Khatu Town",
        ],
      },
      {
        day: "Day 3",
        title: "Salasar & Return Journey",
        description:
          "Visit Salasar Balaji subject to the selected itinerary and continue the return journey towards Chhattisgarh.",
        places: [
          "Salasar Balaji",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab for the selected trip",
      "Pickup and drop as per confirmed itinerary",
      "Driver assistance",
      "Travel planning assistance",
      "Route coordination",
    ],

    exclusions: [
      "Hotel accommodation unless specifically included",
      "Food and personal expenses",
      "Temple donations and offerings",
      "Parking/toll charges unless included in final quotation",
      "Expenses outside the confirmed itinerary",
    ],

    suitableFor: [
      "Family pilgrimage",
      "Senior citizen travel",
      "Group pilgrimage",
      "Temple darshan",
      "Private religious tour",
    ],

    faqs: [
      {
        question:
          "Can I book a Khatu Shyam Ji tour from Korba?",
        answer:
          "Yes. Khatu Rides Travels can arrange private cab travel from Korba to Khatu Shyam Ji. Contact the booking team for the latest route, vehicle and package quotation.",
      },
      {
        question:
          "Can I start the Khatu Shyam Ji tour from Raipur?",
        answer:
          "Yes. Pickup can be planned from Raipur and other major cities of Chhattisgarh depending on the confirmed itinerary.",
      },
      {
        question:
          "Is this package suitable for senior citizens?",
        answer:
          "Yes. A private cab gives families more flexibility with travel breaks, pickup timing and itinerary planning, making it suitable for senior citizens.",
      },
      {
        question:
          "Can we customize the Khatu Shyam Ji tour?",
        answer:
          "Yes. The itinerary can be discussed according to your pickup location, travel dates, number of passengers and additional destinations.",
      },
    ],
  },

  {
    slug: "prayagraj-tour",
    title: "Prayagraj Tour Package",
    destination: "Prayagraj, Uttar Pradesh",
    category: "Pilgrimage",
    badge: "Popular",
    image: "/tour/prayagraj.png",

    duration: "3 Days / 2 Nights",
    startingPrice: "₹8,499",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Ambikapur",
      "Raigarh",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Explore Prayagraj with a private cab tour covering Triveni Sangam, major spiritual locations and important city attractions.",

    description:
      "Prayagraj Tour Package offers a convenient private-cab journey from Chhattisgarh to Prayagraj. The package is suitable for families, devotees and groups looking for a flexible road trip covering the spiritual and cultural highlights of Prayagraj.",

    places: [
      "Triveni Sangam",
      "Prayagraj",
      "Allahabad Fort Area",
      "Major Ghats",
    ],

    highlights: [
      "Private cab travel",
      "Flexible pickup",
      "Triveni Sangam visit",
      "Family-friendly itinerary",
      "Customizable sightseeing",
      "Round-trip travel planning",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Chhattisgarh to Prayagraj",
        description:
          "Pickup from your selected city and travel towards Prayagraj by private cab.",
        places: [
          "Selected Chhattisgarh Pickup",
          "Prayagraj",
        ],
      },
      {
        day: "Day 2",
        title: "Prayagraj Sightseeing",
        description:
          "Explore Triveni Sangam and other important spiritual and cultural locations according to the selected itinerary.",
        places: [
          "Triveni Sangam",
          "Prayagraj Ghats",
          "Allahabad Fort Area",
        ],
      },
      {
        day: "Day 3",
        title: "Return Journey",
        description:
          "Complete the planned visit and begin the return journey towards Chhattisgarh.",
        places: [
          "Prayagraj",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop as per itinerary",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel unless included in final quotation",
      "Food",
      "Entry tickets",
      "Personal expenses",
      "Parking/toll unless included in final quotation",
    ],

    suitableFor: [
      "Family tours",
      "Pilgrimage",
      "Senior citizens",
      "Group travel",
      "Weekend spiritual trips",
    ],

    faqs: [
      {
        question: "Can I book a Prayagraj cab tour from Chhattisgarh?",
        answer:
          "Yes. Private cab tours to Prayagraj can be planned from major cities of Chhattisgarh. Contact Khatu Rides Travels for a current quotation.",
      },
      {
        question: "Does the Prayagraj tour include Triveni Sangam?",
        answer:
          "Triveni Sangam is included in the planned sightseeing itinerary, subject to the final package and travel schedule.",
      },
      {
        question: "Can the Prayagraj itinerary be customized?",
        answer:
          "Yes. Pickup city, travel dates, sightseeing and vehicle selection can be discussed before booking.",
      },
    ],
  },

  {
    slug: "ayodhya-tour",
    title: "Ayodhya Tour Package",
    destination: "Ayodhya, Uttar Pradesh",
    category: "Pilgrimage",
    badge: "Popular",
    image: "/tour/ayodhya.png",

    duration: "3 Days / 2 Nights",
    startingPrice: "₹8,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Ambikapur",
      "Raigarh",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Book a private Ayodhya tour from Chhattisgarh covering Ram Mandir, Hanuman Garhi, Saryu River and important spiritual attractions.",

    description:
      "Ayodhya Tour Package is designed for families and devotees travelling from Chhattisgarh to Ayodhya by private cab. Plan your journey with flexible pickup, comfortable road travel and a customizable sightseeing schedule.",

    places: [
      "Ram Mandir",
      "Hanuman Garhi",
      "Saryu River",
      "Ayodhya",
    ],

    highlights: [
      "Private cab",
      "Flexible pickup from Chhattisgarh",
      "Ram Mandir visit",
      "Hanuman Garhi",
      "Saryu River",
      "Family-friendly travel",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Journey to Ayodhya",
        description:
          "Pickup from the selected Chhattisgarh location and begin the road journey towards Ayodhya.",
        places: [
          "Selected Pickup City",
          "Ayodhya",
        ],
      },
      {
        day: "Day 2",
        title: "Ayodhya Darshan & Sightseeing",
        description:
          "Visit major spiritual attractions of Ayodhya according to the selected itinerary and available darshan arrangements.",
        places: [
          "Ram Mandir",
          "Hanuman Garhi",
          "Saryu River",
        ],
      },
      {
        day: "Day 3",
        title: "Ayodhya to Chhattisgarh",
        description:
          "Complete the planned visit and begin the return journey.",
        places: [
          "Ayodhya",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel accommodation unless included",
      "Food",
      "Darshan-related charges",
      "Personal expenses",
      "Parking/toll unless included in quotation",
    ],

    suitableFor: [
      "Ram Mandir pilgrimage",
      "Family pilgrimage",
      "Senior citizen travel",
      "Group tours",
      "Religious travel",
    ],

    faqs: [
      {
        question: "Can I book an Ayodhya tour from Korba?",
        answer:
          "Yes. Khatu Rides Travels can plan private cab travel from Korba to Ayodhya. Contact the booking team for current pricing and availability.",
      },
      {
        question: "Can I get Ayodhya pickup from Raipur?",
        answer:
          "Yes. Pickup from Raipur can be planned as part of the confirmed itinerary.",
      },
      {
        question: "Can we add other destinations to the Ayodhya tour?",
        answer:
          "Yes. Additional destinations can be discussed while preparing the final itinerary and quotation.",
      },
    ],
  },

  {
    slug: "varanasi-tour",
    title: "Varanasi Tour Package",
    destination: "Varanasi, Uttar Pradesh",
    category: "Pilgrimage",
    image: "/tour/varanasi.png",

    duration: "3 Days / 2 Nights",
    startingPrice: "₹8,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Ambikapur",
      "Raigarh",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Discover Varanasi with a private cab tour covering Kashi Vishwanath, Dashashwamedh Ghat and the famous Ganga Aarti experience.",

    description:
      "Varanasi Tour Package provides a convenient private cab journey from Chhattisgarh to Varanasi. The itinerary can cover major spiritual attractions, ghats and important sightseeing locations while allowing families and groups to customize their travel schedule.",

    places: [
      "Kashi Vishwanath",
      "Dashashwamedh Ghat",
      "Ganga Aarti",
      "Varanasi Ghats",
    ],

    highlights: [
      "Private cab travel",
      "Kashi Vishwanath visit",
      "Ganga Aarti experience",
      "Flexible sightseeing",
      "Family-friendly travel",
      "Custom itinerary",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Chhattisgarh to Varanasi",
        description:
          "Begin your private cab journey from the selected pickup city towards Varanasi.",
        places: [
          "Selected Pickup City",
          "Varanasi",
        ],
      },
      {
        day: "Day 2",
        title: "Kashi Darshan & Ganga Aarti",
        description:
          "Explore major spiritual attractions and ghats of Varanasi according to the confirmed itinerary.",
        places: [
          "Kashi Vishwanath",
          "Dashashwamedh Ghat",
          "Ganga Aarti",
        ],
      },
      {
        day: "Day 3",
        title: "Return Journey",
        description:
          "Complete the Varanasi visit and start the return journey towards Chhattisgarh.",
        places: [
          "Varanasi",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel",
      "Food",
      "Temple/darshan charges",
      "Boat ride charges",
      "Personal expenses",
      "Parking/toll unless included in quotation",
    ],

    suitableFor: [
      "Kashi pilgrimage",
      "Family tours",
      "Senior citizens",
      "Religious travel",
      "Group tours",
    ],

    faqs: [
      {
        question: "Can I book a Varanasi tour from Chhattisgarh?",
        answer:
          "Yes. Private Varanasi cab tours can be planned from major Chhattisgarh cities.",
      },
      {
        question: "Does the package cover Ganga Aarti?",
        answer:
          "The itinerary is designed to include the Ganga Aarti experience, subject to the final travel schedule.",
      },
      {
        question: "Can we customize the Varanasi tour?",
        answer:
          "Yes. Travel dates, pickup location, vehicle and sightseeing plan can be customized.",
      },
    ],
  },

  {
    slug: "mathura-vrindavan-tour",
    title: "Mathura Vrindavan Tour Package",
    destination: "Mathura & Vrindavan, Uttar Pradesh",
    category: "Pilgrimage",
    badge: "Family Favourite",
    image: "/tour/mathura-vrindavan.png",

    duration: "4 Days / 3 Nights",
    startingPrice: "₹11,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Ambikapur",
      "Raigarh",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Experience Mathura and Vrindavan with a private family cab tour covering Banke Bihari, Prem Mandir and major Krishna pilgrimage destinations.",

    description:
      "Mathura Vrindavan Tour Package is suitable for families and devotees travelling from Chhattisgarh to the birthplace and major pilgrimage destinations associated with Lord Krishna.",

    places: [
      "Mathura",
      "Vrindavan",
      "Banke Bihari Temple",
      "Prem Mandir",
    ],

    highlights: [
      "Private cab",
      "Mathura sightseeing",
      "Vrindavan sightseeing",
      "Banke Bihari visit",
      "Prem Mandir",
      "Family pilgrimage",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Journey Towards Mathura",
        description:
          "Pickup from your selected Chhattisgarh location and travel towards Mathura.",
        places: [
          "Selected Pickup City",
          "Mathura",
        ],
      },
      {
        day: "Day 2",
        title: "Mathura Sightseeing",
        description:
          "Explore major spiritual locations in Mathura.",
        places: [
          "Mathura",
          "Krishna-related pilgrimage locations",
        ],
      },
      {
        day: "Day 3",
        title: "Vrindavan Darshan",
        description:
          "Visit major Vrindavan attractions according to the confirmed itinerary.",
        places: [
          "Banke Bihari",
          "Prem Mandir",
          "Vrindavan",
        ],
      },
      {
        day: "Day 4",
        title: "Return Journey",
        description:
          "Complete the pilgrimage and begin the return journey towards Chhattisgarh.",
        places: [
          "Mathura / Vrindavan",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel",
      "Food",
      "Temple donations",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Krishna pilgrimage",
      "Family tours",
      "Senior citizens",
      "Group pilgrimage",
      "Religious travel",
    ],

    faqs: [
      {
        question: "Can I book Mathura Vrindavan from Chhattisgarh?",
        answer:
          "Yes. Private cab tours can be planned from major cities of Chhattisgarh.",
      },
      {
        question: "Does the tour cover Vrindavan?",
        answer:
          "Yes. The itinerary includes Vrindavan sightseeing and can cover major attractions such as Banke Bihari and Prem Mandir.",
      },
      {
        question: "Can we customize the itinerary?",
        answer:
          "Yes. The number of travel days and sightseeing destinations can be discussed before confirmation.",
      },
    ],
  },

  {
    slug: "chitrakoot-tour",
    title: "Chitrakoot Tour Package",
    destination: "Chitrakoot, Uttar Pradesh / Madhya Pradesh",
    category: "Pilgrimage",
    image: "/tour/chitrakut.png",

    duration: "2 Days / 1 Night",
    startingPrice: "₹5,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Bilaspur",
      "Raipur",
      "Ambikapur",
      "Raigarh",
    ],

    shortDescription:
      "Plan a spiritual Chitrakoot road trip from Chhattisgarh with private cab travel and a flexible sightseeing itinerary.",

    description:
      "Chitrakoot Tour Package is designed for devotees and families who want to explore the spiritual heritage of Chitrakoot by private cab from Chhattisgarh.",

    places: [
      "Chitrakoot",
      "Ramghat",
      "Spiritual Sites",
      "Local Sightseeing",
    ],

    highlights: [
      "Private cab",
      "Flexible pickup",
      "Spiritual sightseeing",
      "Family-friendly travel",
      "Customizable itinerary",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Chhattisgarh to Chitrakoot",
        description:
          "Pickup from the selected city and travel towards Chitrakoot.",
        places: [
          "Selected Pickup City",
          "Chitrakoot",
        ],
      },
      {
        day: "Day 2",
        title: "Chitrakoot Sightseeing & Return",
        description:
          "Visit important spiritual attractions and begin the return journey.",
        places: [
          "Ramghat",
          "Chitrakoot",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
    ],

    exclusions: [
      "Hotel",
      "Food",
      "Entry/darshan charges",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Pilgrimage",
      "Family travel",
      "Weekend spiritual trip",
      "Senior citizens",
    ],

    faqs: [
      {
        question: "Can I book Chitrakoot from Korba?",
        answer:
          "Yes. Private cab travel from Korba and other Chhattisgarh cities can be planned.",
      },
      {
        question: "Is Chitrakoot suitable for a family trip?",
        answer:
          "Yes. A private cab provides flexibility for family and senior-citizen travel.",
      },
    ],
  },

  {
    slug: "ujjain-tour",
    title: "Ujjain Tour Package",
    destination: "Ujjain, Madhya Pradesh",
    category: "Pilgrimage",
    badge: "Mahakal Special",
    image: "/tour/ujjain.png",

    duration: "3 Days / 2 Nights",
    startingPrice: "₹8,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Raigarh",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Book a private Ujjain Mahakal tour from Chhattisgarh with comfortable cab travel and flexible pilgrimage planning.",

    description:
      "Ujjain Tour Package is designed for devotees travelling to Ujjain and Mahakaleshwar from Chhattisgarh. The journey can be planned around your preferred pickup location, travel dates and sightseeing requirements.",

    places: [
      "Mahakaleshwar Temple",
      "Ujjain",
      "Mahakal Corridor",
      "Local Spiritual Sites",
    ],

    highlights: [
      "Private cab",
      "Mahakaleshwar visit",
      "Flexible pickup",
      "Family pilgrimage",
      "Custom itinerary",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Chhattisgarh to Ujjain",
        description:
          "Start the journey from the selected Chhattisgarh pickup location.",
        places: [
          "Selected Pickup City",
          "Ujjain",
        ],
      },
      {
        day: "Day 2",
        title: "Mahakal Darshan & Ujjain",
        description:
          "Explore Mahakaleshwar and other major spiritual attractions according to the itinerary.",
        places: [
          "Mahakaleshwar Temple",
          "Mahakal Corridor",
          "Ujjain",
        ],
      },
      {
        day: "Day 3",
        title: "Return Journey",
        description:
          "Complete the planned pilgrimage and begin the return journey.",
        places: [
          "Ujjain",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel",
      "Food",
      "Darshan tickets",
      "Donations",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Mahakal pilgrimage",
      "Family pilgrimage",
      "Senior citizens",
      "Group travel",
    ],

    faqs: [
      {
        question: "Can I book a Ujjain tour from Raipur?",
        answer:
          "Yes. Private cab travel from Raipur to Ujjain can be planned based on your travel dates and vehicle requirement.",
      },
      {
        question: "Does the package cover Mahakaleshwar Temple?",
        answer:
          "Yes. Mahakaleshwar is the primary pilgrimage destination covered in the planned itinerary.",
      },
    ],
  },

  {
    slug: "omkareshwar-tour",
    title: "Omkareshwar Tour Package",
    destination: "Omkareshwar, Madhya Pradesh",
    category: "Pilgrimage",
    image: "/tour/omkareshwar-tour.png",

    duration: "3 Days / 2 Nights",
    startingPrice: "₹9,499",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Durg",
      "Bhilai",
      "Raigarh",
    ],

    shortDescription:
      "Explore Omkareshwar with a private cab pilgrimage package from Chhattisgarh and enjoy flexible travel planning.",

    description:
      "Omkareshwar Tour Package provides private cab travel for devotees and families travelling from Chhattisgarh to Omkareshwar. The itinerary can be customized according to travel dates and sightseeing requirements.",

    places: [
      "Omkareshwar Jyotirlinga",
      "Omkareshwar",
      "Narmada River",
      "Local Temple Area",
    ],

    highlights: [
      "Private cab",
      "Jyotirlinga pilgrimage",
      "Flexible pickup",
      "Family travel",
      "Custom itinerary",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Journey to Omkareshwar",
        description:
          "Pickup from the selected city and travel towards Omkareshwar.",
        places: [
          "Selected Pickup City",
          "Omkareshwar",
        ],
      },
      {
        day: "Day 2",
        title: "Omkareshwar Darshan",
        description:
          "Visit Omkareshwar Jyotirlinga and nearby spiritual attractions.",
        places: [
          "Omkareshwar Jyotirlinga",
          "Narmada River",
          "Local Temple Area",
        ],
      },
      {
        day: "Day 3",
        title: "Return Journey",
        description:
          "Complete the pilgrimage and start the return journey.",
        places: [
          "Omkareshwar",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
    ],

    exclusions: [
      "Hotel",
      "Food",
      "Darshan charges",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Jyotirlinga pilgrimage",
      "Family tours",
      "Senior citizens",
      "Religious travel",
    ],

    faqs: [
      {
        question: "Can I book Omkareshwar from Chhattisgarh?",
        answer:
          "Yes. Private cab travel to Omkareshwar can be planned from major cities of Chhattisgarh.",
      },
      {
        question: "Is Omkareshwar suitable for senior citizens?",
        answer:
          "Private cab travel provides greater flexibility for breaks and itinerary planning, making it suitable for family and senior-citizen journeys.",
      },
    ],
  },

  {
    slug: "dwarka-somnath-tour",
    title: "Dwarka Somnath Tour Package",
    destination: "Dwarka & Somnath, Gujarat",
    category: "Multi-City",
    badge: "Premium",
    image: "/tour/dwarka-somnath-tour.png",

    duration: "6 Days / 5 Nights",
    startingPrice: "₹24,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Durg",
      "Bhilai",
      "Raigarh",
    ],

    shortDescription:
      "Plan a complete Dwarka and Somnath pilgrimage road trip with private cab travel and a multi-city itinerary.",

    description:
      "Dwarka Somnath Tour Package is designed for travellers from Chhattisgarh looking for a longer pilgrimage journey covering important destinations in Gujarat. The itinerary can be customized according to travel dates and preferred sightseeing.",

    places: [
      "Dwarka",
      "Somnath",
      "Dwarkadhish Temple",
      "Somnath Temple",
    ],

    highlights: [
      "Private cab",
      "Multi-city pilgrimage",
      "Dwarkadhish Temple",
      "Somnath Temple",
      "Flexible itinerary",
      "Family and group travel",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Journey Begins",
        description:
          "Pickup from Chhattisgarh and begin the long-distance road journey.",
        places: [
          "Selected Pickup City",
          "En-route destinations",
        ],
      },
      {
        day: "Day 2",
        title: "Travel Towards Dwarka",
        description:
          "Continue the journey towards Dwarka with planned travel breaks.",
        places: [
          "En-route",
          "Dwarka",
        ],
      },
      {
        day: "Day 3",
        title: "Dwarka Pilgrimage",
        description:
          "Explore major spiritual attractions of Dwarka.",
        places: [
          "Dwarkadhish Temple",
          "Dwarka",
        ],
      },
      {
        day: "Day 4",
        title: "Dwarka to Somnath",
        description:
          "Travel towards Somnath and explore the destination according to the itinerary.",
        places: [
          "Dwarka",
          "Somnath",
        ],
      },
      {
        day: "Day 5",
        title: "Somnath Darshan",
        description:
          "Visit Somnath Temple and nearby attractions.",
        places: [
          "Somnath Temple",
          "Somnath",
        ],
      },
      {
        day: "Day 6",
        title: "Return Journey",
        description:
          "Begin the return journey towards Chhattisgarh.",
        places: [
          "Somnath",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel unless specifically included",
      "Food",
      "Temple donations",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Long pilgrimage tours",
      "Family groups",
      "Jyotirlinga travel",
      "Religious tours",
      "Private group travel",
    ],

    faqs: [
      {
        question: "Can Dwarka and Somnath be covered in one trip?",
        answer:
          "Yes. The package is structured as a multi-city pilgrimage covering both destinations.",
      },
      {
        question: "Can the number of days be changed?",
        answer:
          "Yes. The itinerary can be customized according to travel dates and additional destinations.",
      },
    ],
  },

  {
    slug: "rajasthan-pilgrimage-tour",
    title: "Rajasthan Pilgrimage Tour Package",
    destination: "Rajasthan",
    category: "Multi-City",
    image: "/tour/rajasthan-tour.png",

    duration: "6 Days / 5 Nights",
    startingPrice: "₹19,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Raigarh",
      "Ambikapur",
      "Durg",
      "Bhilai",
    ],

    shortDescription:
      "Explore major Rajasthan pilgrimage destinations with a private cab tour from Chhattisgarh.",

    description:
      "Rajasthan Pilgrimage Tour Package is designed for families and groups who want to combine multiple spiritual destinations in Rajasthan in one private road trip.",

    places: [
      "Khatu Shyam Ji",
      "Salasar Balaji",
      "Rajasthan",
      "Other Selected Destinations",
    ],

    highlights: [
      "Private cab",
      "Multi-city Rajasthan tour",
      "Khatu Shyam Ji",
      "Salasar Balaji",
      "Customizable itinerary",
      "Family-friendly travel",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Chhattisgarh to Rajasthan",
        description:
          "Begin your private road journey from the selected Chhattisgarh pickup city.",
        places: [
          "Selected Pickup City",
          "Rajasthan",
        ],
      },
      {
        day: "Day 2",
        title: "Rajasthan Arrival",
        description:
          "Continue towards the selected pilgrimage destination.",
        places: [
          "Rajasthan",
          "Selected Destination",
        ],
      },
      {
        day: "Day 3",
        title: "Khatu Shyam Ji",
        description:
          "Visit Khatu Shyam Ji Temple and explore the surrounding pilgrimage area.",
        places: [
          "Khatu Shyam Ji",
        ],
      },
      {
        day: "Day 4",
        title: "Salasar Balaji",
        description:
          "Visit Salasar Balaji and continue the planned Rajasthan itinerary.",
        places: [
          "Salasar Balaji",
        ],
      },
      {
        day: "Day 5",
        title: "Additional Sightseeing",
        description:
          "Explore additional destinations based on the confirmed package.",
        places: [
          "Selected Rajasthan Locations",
        ],
      },
      {
        day: "Day 6",
        title: "Return Journey",
        description:
          "Begin the return journey towards Chhattisgarh.",
        places: [
          "Rajasthan",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotel unless included",
      "Food",
      "Temple donations",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Rajasthan pilgrimage",
      "Family tours",
      "Group tours",
      "Khatu Shyam Ji devotees",
      "Multi-city travel",
    ],

    faqs: [
      {
        question: "Can Rajasthan pilgrimage tours be customized?",
        answer:
          "Yes. Destinations, travel days and vehicle type can be discussed according to your requirements.",
      },
      {
        question: "Can I start the Rajasthan tour from Korba?",
        answer:
          "Yes. Pickup from Korba can be planned as part of the confirmed itinerary.",
      },
    ],
  },

  {
    slug: "north-india-pilgrimage-tour",
    title: "North India Pilgrimage Tour Package",
    destination: "North India",
    category: "Multi-City",
    badge: "Grand Pilgrimage",
    image: "/tour/north-india-tour.png",

    duration: "8 Days / 7 Nights",
    startingPrice: "₹29,999",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Raigarh",
      "Ambikapur",
      "Durg",
      "Bhilai",
      "Jagdalpur",
    ],

    shortDescription:
      "Plan an extended North India pilgrimage covering multiple spiritual destinations with a private cab from Chhattisgarh.",

    description:
      "North India Pilgrimage Tour Package is intended for families and groups looking for a longer multi-destination spiritual road trip. Destinations and itinerary can be customized according to the travel requirement.",

    places: [
      "Ayodhya",
      "Prayagraj",
      "Varanasi",
      "Mathura",
      "Vrindavan",
      "Other Selected Destinations",
    ],

    highlights: [
      "Multi-city private cab tour",
      "Multiple pilgrimage destinations",
      "Flexible itinerary",
      "Family and group travel",
      "Custom pickup",
      "Long-distance travel planning",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Journey Begins",
        description:
          "Pickup from Chhattisgarh and begin the North India pilgrimage journey.",
        places: [
          "Selected Pickup City",
          "En-route",
        ],
      },
      {
        day: "Day 2",
        title: "Ayodhya",
        description:
          "Explore major spiritual attractions of Ayodhya.",
        places: [
          "Ayodhya",
          "Ram Mandir",
        ],
      },
      {
        day: "Day 3",
        title: "Prayagraj",
        description:
          "Travel towards Prayagraj and visit important spiritual locations.",
        places: [
          "Prayagraj",
          "Triveni Sangam",
        ],
      },
      {
        day: "Day 4",
        title: "Varanasi",
        description:
          "Continue towards Varanasi for Kashi pilgrimage and ghats.",
        places: [
          "Kashi Vishwanath",
          "Varanasi Ghats",
        ],
      },
      {
        day: "Day 5",
        title: "Varanasi Sightseeing",
        description:
          "Explore additional Varanasi attractions according to the confirmed itinerary.",
        places: [
          "Ganga Aarti",
          "Dashashwamedh Ghat",
        ],
      },
      {
        day: "Day 6",
        title: "Mathura & Vrindavan",
        description:
          "Continue towards the Krishna pilgrimage region.",
        places: [
          "Mathura",
          "Vrindavan",
        ],
      },
      {
        day: "Day 7",
        title: "Vrindavan",
        description:
          "Explore major Vrindavan attractions before beginning the return journey.",
        places: [
          "Banke Bihari",
          "Prem Mandir",
        ],
      },
      {
        day: "Day 8",
        title: "Return Journey",
        description:
          "Begin the return journey towards Chhattisgarh.",
        places: [
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Travel coordination",
    ],

    exclusions: [
      "Hotels unless specifically included",
      "Food",
      "Temple/darshan charges",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Grand pilgrimage",
      "Family groups",
      "Large groups",
      "Multi-city religious tours",
      "Long-distance private travel",
    ],

    faqs: [
      {
        question: "Can the North India pilgrimage package be customized?",
        answer:
          "Yes. Destinations, duration, pickup city and vehicle type can be customized according to your requirements.",
      },
      {
        question: "Can multiple families travel together?",
        answer:
          "Yes. Vehicle selection can be planned according to the number of passengers and luggage.",
      },
    ],
  },

  {
    slug: "chhattisgarh-temple-tour",
    title: "Chhattisgarh Temple Tour Package",
    destination: "Chhattisgarh",
    category: "Family Tours",
    image: "/tour/chhattisgarh-tour.png",

    duration: "Customizable",
    startingPrice: "On Request",

    pickup: "Chhattisgarh Pickup",
    pickupCities: [
      "Korba",
      "Raipur",
      "Bilaspur",
      "Raigarh",
      "Ambikapur",
      "Jagdalpur",
      "Durg",
      "Bhilai",
      "Rajnandgaon",
      "Dhamtari",
    ],

    shortDescription:
      "Explore the temples and spiritual destinations of Chhattisgarh with a customizable private cab tour.",

    description:
      "Chhattisgarh Temple Tour Package is suitable for families, devotees and groups who want to explore spiritual destinations within Chhattisgarh by private cab. The itinerary can be planned according to your preferred cities and temples.",

    places: [
      "Major Chhattisgarh Temples",
      "Regional Pilgrimage Sites",
      "Spiritual Destinations",
      "Local Attractions",
    ],

    highlights: [
      "Private cab",
      "Flexible pickup",
      "Custom itinerary",
      "Multiple temple destinations",
      "Family-friendly travel",
      "Local sightseeing",
    ],

    itinerary: [
      {
        day: "Day 1",
        title: "Pickup & Temple Tour Begins",
        description:
          "Pickup from your selected Chhattisgarh city and begin the customized temple tour.",
        places: [
          "Selected Pickup City",
          "Selected Temple",
        ],
      },
      {
        day: "Day 2",
        title: "Regional Temple Sightseeing",
        description:
          "Continue visiting the selected temples and spiritual destinations.",
        places: [
          "Selected Temples",
          "Regional Attractions",
        ],
      },
      {
        day: "Day 3",
        title: "Return / Extended Tour",
        description:
          "Complete the selected itinerary or continue with additional destinations.",
        places: [
          "Selected Destinations",
          "Return Journey",
        ],
      },
    ],

    inclusions: [
      "Private cab",
      "Pickup and drop",
      "Driver assistance",
      "Custom itinerary planning",
    ],

    exclusions: [
      "Hotel",
      "Food",
      "Temple donations",
      "Entry tickets",
      "Personal expenses",
      "Parking/toll unless included",
    ],

    suitableFor: [
      "Family temple tours",
      "Weekend trips",
      "Pilgrimage",
      "Senior citizens",
      "Group travel",
    ],

    faqs: [
      {
        question: "Can I create a custom Chhattisgarh temple tour?",
        answer:
          "Yes. You can share the temples and cities you want to visit and the travel team can help plan a suitable private cab itinerary.",
      },
      {
        question: "Can I book a temple tour from Korba?",
        answer:
          "Yes. Korba can be used as a pickup location for customized Chhattisgarh temple tours.",
      },
      {
        question: "Is pricing fixed for this package?",
        answer:
          "This package is customizable, so the final quotation depends on destinations, distance, travel duration, vehicle and passenger requirements.",
      },
    ],
  },
];

/**
 * Find a package by its URL slug.
 */
export function getTourPackageBySlug(
  slug: string
): TourPackage | undefined {
  return tourPackages.find((tour) => tour.slug === slug);
}

/**
 * Return all available package slugs.
 * Used by generateStaticParams().
 */
export function getTourPackageSlugs(): string[] {
  return tourPackages.map((tour) => tour.slug);
}

/**
 * Related packages helper.
 * Keeps the current package out of the related list.
 */
export function getRelatedTourPackages(
  currentSlug: string,
  limit = 3
): TourPackage[] {
  const current = getTourPackageBySlug(currentSlug);

  if (!current) {
    return tourPackages.slice(0, limit);
  }

  const sameCategory = tourPackages.filter(
    (tour) =>
      tour.slug !== currentSlug &&
      tour.category === current.category
  );

  const remaining = tourPackages.filter(
    (tour) =>
      tour.slug !== currentSlug &&
      tour.category !== current.category
  );

  return [...sameCategory, ...remaining].slice(0, limit);
}

/**
 * Pickup-city specific package helper.
 */
export function getTourPackagesByPickupCity(
  city: string
): TourPackage[] {
  const normalizedCity = city.trim().toLowerCase();

  return tourPackages.filter((tour) =>
    tour.pickupCities.some(
      (pickupCity) =>
        pickupCity.toLowerCase() === normalizedCity
    )
  );
}

/**
 * Category filter helper.
 */
export function getTourPackagesByCategory(
  category: string
): TourPackage[] {
  if (
    !category ||
    category.toLowerCase() === "all" ||
    category.toLowerCase() === "all tours"
  ) {
    return tourPackages;
  }

  return tourPackages.filter(
    (tour) =>
      tour.category.toLowerCase() === category.toLowerCase()
  );
}
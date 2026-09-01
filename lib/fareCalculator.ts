// lib/fareCalculator.ts

/* =========================================================
   VEHICLE CONFIGURATION
========================================================= */

export interface VehicleConfig {
  label: string;
  image: string;
  baseRatePerKm: number;
  longRatePerKm: number;
}

export const VEHICLES: Record<string, VehicleConfig> = {
  sedan: {
    label: "Maruti Suzuki Dzire",
    image: "/dezire.png",
    baseRatePerKm: 11,
    longRatePerKm: 13,
  },

  ertiga: {
    label: "Maruti Suzuki Ertiga (MUV)",
    image: "/ertiga.png",
    baseRatePerKm: 13,
    longRatePerKm: 15,
  },

  crysta: {
    label: "Toyota Innova Crysta (Premium)",
    image: "/crysta.png",
    baseRatePerKm: 20,
    longRatePerKm: 17,
  },
};

/* =========================================================
   CORE TYPES
========================================================= */

export type VehicleType = keyof typeof VEHICLES;

export type BookingType =
  | "oneway"
  | "roundtrip";

export type ServiceType =
  | "outstation"
  | "local";

/* =========================================================
   LOCAL PACKAGE TYPES
========================================================= */

export type LocalPackageType =
  | "8hr80km"
  | "12hr120km";

export interface LocalPackageConfig {
  id: LocalPackageType;
  label: string;

  hours: number;
  kms: number;

  baseFare: number;

  extraHourRate: number;
  extraKmRate: number;
}

/* =========================================================
   LOCAL FARE RESULT
========================================================= */

export interface LocalFareResult {
  package: LocalPackageConfig;

  packageFare: number;

  actualHours: number;
  actualKilometers: number;

  extraHours: number;
  extraKilometers: number;

  extraHourCharges: number;
  extraKmCharges: number;

  totalExtraCharges: number;

  finalFare: number;
  strikeFare: number;

  tollParkingExcluded: boolean;
  driverAllowanceIncluded: boolean;
}

/* =========================================================
   NORMAL FARE RESULT
========================================================= */

export type CalculateFareResult = {
  actualDistance: number;
  billedDistance: number;
  rateUsed: number;

  strikeFare: number;
  finalFare: number;

  discountPercent: number;

  durationMinutes: number;

  haltCharges: number;

  autoCorrectedService: ServiceType;

  isOneWayAvailable: boolean;

  /*
   * Local package details.
   * Undefined for outstation calculations.
   */
  localFare?: LocalFareResult;
};

/* =========================================================
   PSYCHOLOGICAL PRICE
========================================================= */

export function psychologicalPrice(
  value: number
) {
  const rounded =
    Math.round(value / 50) * 50;

  return Math.max(
    rounded - 1,
    0
  );
}

/* =========================================================
   LOCAL PACKAGE MASTER DATA
=========================================================

   Commercial rules supplied for Khatu Rides:

   DZIRE
   8H / 80KM  = 3000
   Extra hour = 300
   Extra KM   = 15

   12H / 120KM = 4200
   Extra hour  = 250
   Extra KM    = 15

   ERTIGA
   8H / 80KM  = 3500
   Extra hour = 300
   Extra KM   = 20

   12H / 120KM = 5200
   Extra hour  = 250
   Extra KM    = 20

   CRYSTA
   8H / 80KM  = 4500
   Extra hour = 300
   Extra KM   = 25

   12H / 120KM = 5800
   Extra hour  = 250
   Extra KM    = 20

   Toll & Parking = Customer actual
   Driver allowance = Included
========================================================= */

export const LOCAL_PACKAGES: Record<
  VehicleType,
  Record<
    LocalPackageType,
    LocalPackageConfig
  >
> = {
  sedan: {
    "8hr80km": {
      id: "8hr80km",
      label: "8 Hours / 80 KM",
      hours: 8,
      kms: 80,
      baseFare: 3000,
      extraHourRate: 300,
      extraKmRate: 15,
    },

    "12hr120km": {
      id: "12hr120km",
      label: "12 Hours / 120 KM",
      hours: 12,
      kms: 120,
      baseFare: 4200,
      extraHourRate: 250,
      extraKmRate: 15,
    },
  },

  ertiga: {
    "8hr80km": {
      id: "8hr80km",
      label: "8 Hours / 80 KM",
      hours: 8,
      kms: 80,
      baseFare: 3500,
      extraHourRate: 300,
      extraKmRate: 20,
    },

    "12hr120km": {
      id: "12hr120km",
      label: "12 Hours / 120 KM",
      hours: 12,
      kms: 120,
      baseFare: 5200,
      extraHourRate: 250,
      extraKmRate: 20,
    },
  },

  crysta: {
    "8hr80km": {
      id: "8hr80km",
      label: "8 Hours / 80 KM",
      hours: 8,
      kms: 80,
      baseFare: 4500,
      extraHourRate: 300,
      extraKmRate: 25,
    },

    "12hr120km": {
      id: "12hr120km",
      label: "12 Hours / 120 KM",
      hours: 12,
      kms: 120,
      baseFare: 5800,
      extraHourRate: 250,
      extraKmRate: 20,
    },
  },
};

/* =========================================================
   LOCAL PACKAGE CALCULATOR
========================================================= */

export function calculateLocalFare({
  vehicleType,
  packageType,
  actualHours,
  actualKilometers,
}: {
  vehicleType: VehicleType;

  packageType: LocalPackageType;

  actualHours: number;

  actualKilometers: number;
}): LocalFareResult {
  const packageConfig =
    LOCAL_PACKAGES[
      vehicleType
    ][packageType];

  /*
   * Protect against invalid negative values.
   */

  const safeHours = Math.max(
    0,
    Number(actualHours) || 0
  );

  const safeKilometers =
    Math.max(
      0,
      Number(actualKilometers) || 0
    );

  /*
   * Extra hours:
   *
   * Example:
   * 8H package + 10 actual hours
   * = 2 extra hours
   */

  const extraHours =
    Math.max(
      0,
      Math.ceil(
        safeHours -
          packageConfig.hours
      )
    );

  /*
   * Extra kilometres:
   *
   * Example:
   * 80 KM package + 95 KM
   * = 15 extra KM
   */

  const extraKilometers =
    Math.max(
      0,
      Math.ceil(
        safeKilometers -
          packageConfig.kms
      )
    );

  /*
   * Extra hour charges.
   */

  const extraHourCharges =
    extraHours *
    packageConfig.extraHourRate;

  /*
   * Extra kilometre charges.
   */

  const extraKmCharges =
    extraKilometers *
    packageConfig.extraKmRate;

  /*
   * Total additional charges.
   */

  const totalExtraCharges =
    extraHourCharges +
    extraKmCharges;

  /*
   * FINAL LOCAL FARE
   *
   * No psychological pricing.
   * Package price remains exact.
   */

  const finalFare =
    packageConfig.baseFare +
    totalExtraCharges;

  /*
   * Strike fare is only a reference/display value.
   */

  const strikeFare =
    Math.round(
      finalFare * 1.15
    );

  return {
    package: packageConfig,

    packageFare:
      packageConfig.baseFare,

    actualHours:
      safeHours,

    actualKilometers:
      safeKilometers,

    extraHours,

    extraKilometers,

    extraHourCharges,

    extraKmCharges,

    totalExtraCharges,

    finalFare,

    strikeFare,

    tollParkingExcluded:
      true,

    driverAllowanceIncluded:
      true,
  };
}

/* =========================================================
   POPULAR HUBS
========================================================= */

const POPULAR_HUBS = [
  "bilaspur",
  "raipur",
  "durg",
  "korba",
  "raigarh",
  "bhilai",
  "jharsuguda",
  "jagdalpur",
  "sambalpur",
  "ambikapur",
];

/* =========================================================
   ONE-WAY AVAILABLE CITIES
========================================================= */

const AVAILABLE_ONEWAY_CITIES = [
  "raipur",
  "bilaspur",
  "korba",
  "raigarh",
  "durg",
  "bhilai",
  "rajnandgaon",
  "jagdalpur",
  "ambikapur",
  "dhamtari",
  "mahasamund",
  "kawardha",
  "janjgir",
  "champa",
  "balod",
  "bemetara",
  "kanker",
  "kondagaon",
  "dantewada",
  "sukma",
  "bijapur",
  "narayanpur",
  "gariaband",
  "baloda bazar",
  "mungeli",
  "surajpur",
  "balrampur",
  "jashpur",
  "gaurela",
  "pendra",
  "marwahi",
  "gevra",
  "dipka",
  "kusmunda",
  "katghora",
  "chirmiri",
  "manendragarh",
  "baikunthpur",
  "pathalgaon",
  "tilda",
  "simga",
  "arang",
  "kurud",
  "pithora",
  "saraipali",
  "basna",
  "dongargarh",
  "khairagarh",
  "sakti",
  "akaltara",
  "naila",
  "pali",
  "bharatpur",
  "lakhanpur",
  "wadrafnagar",
  "bhopal",
  "indore",
  "jabalpur",
  "nagpur",
  "jharsuguda",
  "sambalpur",
  "rourkela",
];

/* =========================================================
   LOCATION HELPERS
========================================================= */

function isPopularHub(
  dropLocation: string
): boolean {
  if (!dropLocation) {
    return true;
  }

  const lowerDrop =
    dropLocation.toLowerCase();

  return POPULAR_HUBS.some(
    (hub) =>
      lowerDrop.includes(hub)
  );
}

function isOneWayServiceAvailable(
  pickupLocation: string,
  dropLocation: string
): boolean {
  const lowerPickup =
    pickupLocation
      ? pickupLocation.toLowerCase()
      : "";

  const lowerDrop =
    dropLocation
      ? dropLocation.toLowerCase()
      : "";

  const isPickupValid =
    AVAILABLE_ONEWAY_CITIES.some(
      (city) =>
        lowerPickup.includes(city)
    );

  const isDropValid =
    AVAILABLE_ONEWAY_CITIES.some(
      (city) =>
        lowerDrop.includes(city)
    );

  return (
    isPickupValid ||
    isDropValid
  );
}

/* =========================================================
   MAIN FARE CALCULATOR
========================================================= */

export function calculateFare({
  distance,

  vehicleType,

  bookingType,

  serviceType = "outstation",

  pickupDate = "",

  pickupTime = "",

  returnDate = "",

  returnTime = "",

  drop = "",

  pickup = "",

  /*
   * NEW:
   * Local package selection.
   */
  localPackage = "8hr80km",

  /*
   * NEW:
   * Actual local duration.
   *
   * The UI can provide the user's
   * selected duration or default it
   * to the package duration.
   */
  localHours,

  /*
   * NEW:
   * Actual local distance.
   *
   * If omitted, 80 KM is used as
   * the default calculation distance.
   */
  localKilometers,
}: {
  distance: number;

  vehicleType: VehicleType;

  bookingType: BookingType;

  serviceType?: ServiceType;

  pickupDate?: string;

  pickupTime?: string;

  returnDate?: string;

  returnTime?: string;

  drop?: string;

  pickup?: string;

  localPackage?: LocalPackageType;

  localHours?: number;

  localKilometers?: number;
}): CalculateFareResult {
  /* =======================================================
     BASIC DISTANCE NORMALIZATION
  ======================================================= */

  const inputDistance =
    distance > 0
      ? Math.round(distance)
      : 0;

  /* =======================================================
     SERVICE AUTO-CORRECTION
  ======================================================= */

  let finalServiceType =
    serviceType;

  /*
   * Local service automatically becomes
   * outstation only when distance exceeds
   * 80 KM.
   *
   * NOTE:
   * This rule is retained for backward
   * compatibility with the previous engine.
   *
   * The new Local Package UI should pass
   * actual local usage separately.
   */

  if (
    inputDistance > 80 &&
    serviceType === "local"
  ) {
    finalServiceType =
      "outstation";
  }

  /* =======================================================
     ONE-WAY AVAILABILITY
  ======================================================= */

  let oneWayAvailable = true;

  if (
    bookingType === "oneway" &&
    serviceType !== "local"
  ) {
    oneWayAvailable =
      isOneWayServiceAvailable(
        pickup,
        drop
      );
  }

  /* =======================================================
     NEW LOCAL PACKAGE ENGINE
  ======================================================= */

  if (
    serviceType === "local"
  ) {
    /*
     * IMPORTANT:
     *
     * Local package calculation must
     * NOT use the old:
     *
     * baseFare + 80 × rate
     *
     * formula.
     *
     * It now uses:
     *
     * PACKAGE BASE FARE
     * +
     * EXTRA HOURS
     * +
     * EXTRA KM
     */

    const selectedPackage =
      LOCAL_PACKAGES[
        vehicleType
      ][localPackage];

    /*
     * If actual hours are not provided,
     * assume the package duration.
     */

    const calculatedHours =
      typeof localHours ===
      "number"
        ? localHours
        : selectedPackage.hours;

    /*
     * If actual kilometres are not
     * provided, assume package included KM.
     */

    const calculatedKilometers =
      typeof localKilometers ===
      "number"
        ? localKilometers
        : selectedPackage.kms;

    const localFare =
      calculateLocalFare({
        vehicleType,

        packageType:
          localPackage,

        actualHours:
          calculatedHours,

        actualKilometers:
          calculatedKilometers,
      });

    return {
      actualDistance:
        calculatedKilometers,

      billedDistance:
        calculatedKilometers,

      rateUsed:
        localFare.package.extraKmRate,

      strikeFare:
        localFare.strikeFare,

      finalFare:
        localFare.finalFare,

      discountPercent: 0,

      durationMinutes:
        Math.round(
          calculatedHours * 60
        ),

      haltCharges: 0,

      autoCorrectedService:
        "local",

      isOneWayAvailable: true,

      localFare,
    };
  }

  /* =======================================================
     ROUND TRIP WORKING DISTANCE
  ======================================================= */

  let workingDistance =
    inputDistance;

  if (
    bookingType === "roundtrip"
  ) {
    workingDistance =
      inputDistance * 2;
  }

  /* =======================================================
     SHORT ROUND TRIP
     EXISTING LOGIC PRESERVED
  ======================================================= */

  if (
    bookingType === "roundtrip" &&
    workingDistance < 80
  ) {
    const shortRoundTripPackages: Record<
      string,
      {
        baseFare: number;
        rate: number;
      }
    > = {
      sedan: {
        baseFare: 1200,
        rate: 11,
      },

      ertiga: {
        baseFare: 1500,
        rate: 12,
      },

      crysta: {
        baseFare: 2200,
        rate: 14,
      },
    };

    const pack =
      shortRoundTripPackages[
        vehicleType
      ];

    const rawTotal =
      pack.baseFare +
      workingDistance *
        pack.rate +
      100;

    const calculatedFareValue =
      psychologicalPrice(
        rawTotal
      );

    const calculatedStrikeFare =
      Math.round(
        calculatedFareValue *
          1.15
      );

    let displayedFinalFare =
      calculatedFareValue;

    const isPickupAmbikapur =
      pickup &&
      pickup
        .toLowerCase()
        .includes(
          "ambikapur"
        );

    const isDropAmbikapur =
      drop &&
      drop
        .toLowerCase()
        .includes(
          "ambikapur"
        );

    if (
      isPickupAmbikapur ||
      isDropAmbikapur
    ) {
      displayedFinalFare =
        calculatedStrikeFare;
    }

    return {
      actualDistance:
        workingDistance,

      billedDistance:
        workingDistance,

      rateUsed:
        pack.rate,

      strikeFare:
        calculatedStrikeFare,

      finalFare:
        displayedFinalFare,

      discountPercent: 0,

      durationMinutes: 480,

      haltCharges: 0,

      autoCorrectedService:
        "local",

      isOneWayAvailable:
        true,
    };
  }

  /* =======================================================
     ONE-WAY DISTANCE ADJUSTMENT
  ======================================================= */

  if (
    bookingType === "oneway" &&
    workingDistance > 150
  ) {
    workingDistance += 5;
  }

  /* =======================================================
     DISPLAY KM ADJUSTMENT
  ======================================================= */

  let showKms =
    workingDistance;

  if (
    workingDistance > 500
  ) {
    showKms += 50;
  }

  /* =======================================================
     MINIMUM CALCULATION DISTANCE
  ======================================================= */

  let effectiveCalculationDistance =
    showKms;

  if (
    bookingType === "oneway" &&
    showKms < 80
  ) {
    effectiveCalculationDistance =
      80;
  }

  /* =======================================================
     VEHICLE RATE
  ======================================================= */

  let ratePerKm =
    VEHICLES[
      vehicleType
    ].baseRatePerKm;

  let currentMultiplier = 1.0;

  let haltCharges = 0;

  let useCustomMicroBase =
    false;

  let customBaseFareValue =
    0;

  /* =======================================================
     AMBIKAPUR ROUTE MULTIPLIER
  ======================================================= */

  const lowerPickup =
    pickup
      ? pickup.toLowerCase()
      : "";

  const lowerDrop =
    drop
      ? drop.toLowerCase()
      : "";

  let routeCustomMultiplier =
    1.0;

  if (
    lowerDrop.includes(
      "ambikapur"
    ) &&
    showKms < 200
  ) {
    routeCustomMultiplier =
      1.25;
  } else if (
    lowerDrop.includes(
      "ambikapur"
    ) &&
    showKms > 200
  ) {
    routeCustomMultiplier =
      1.1;
  } else if (
    lowerPickup.includes(
      "ambikapur"
    )
  ) {
    routeCustomMultiplier =
      1.05;
  }

  /* =======================================================
     ONE-WAY FARE RULES
  ======================================================= */

  if (
    bookingType === "oneway"
  ) {
    if (
      showKms >= 39 &&
      showKms < 50
    ) {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          1.35;

        ratePerKm =
          VEHICLES.sedan
            .baseRatePerKm;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          1.3;

        ratePerKm =
          VEHICLES.ertiga
            .baseRatePerKm;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.2;

        ratePerKm =
          VEHICLES.crysta
            .baseRatePerKm;
      }
    } else if (
      showKms >= 50 &&
      showKms <= 100
    ) {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          2.1;

        ratePerKm = 12;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          2.1;

        ratePerKm = 13;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.8;

        ratePerKm = 20;
      }
    } else if (
      showKms >= 100 &&
      showKms <= 150
    ) {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          1.05;

        ratePerKm = 20;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          1.9;

        ratePerKm = 13;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.5;

        ratePerKm = 20;
      }
    } else if (
      showKms >= 150 &&
      showKms <= 260
    ) {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          1.4;

        ratePerKm = 12;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          1.45;

        ratePerKm = 14;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.15;

        ratePerKm = 19.5;
      }
    } else if (
      showKms > 260 &&
      showKms <= 350
    ) {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          1.45;

        ratePerKm = 12;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          1.4;

        ratePerKm = 14;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.4;

        ratePerKm = 20;
      }
    } else if (
      showKms > 300 &&
      showKms <= 600
    ) {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          1.6;

        ratePerKm = 12;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          1.85;

        ratePerKm = 14;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.65;

        ratePerKm = 20;
      }
    } else {
      if (
        vehicleType === "sedan"
      ) {
        currentMultiplier =
          1.75;

        ratePerKm = 11;
      } else if (
        vehicleType === "ertiga"
      ) {
        currentMultiplier =
          1.75;

        ratePerKm = 13;
      } else if (
        vehicleType === "crysta"
      ) {
        currentMultiplier =
          1.45;

        ratePerKm = 20;
      }
    }

    /* =====================================================
       NON-POPULAR DESTINATION
    ===================================================== */

    if (
      !isPopularHub(drop)
    ) {
      if (
        showKms <= 300
      ) {
        currentMultiplier *=
          1.45;
      } else {
        currentMultiplier *=
          1.1;
      }
    }
  }

  /* =======================================================
     ROUND TRIP FARE RULES
  ======================================================= */

  else if (
    bookingType ===
    "roundtrip"
  ) {
    const totalRoundTripKm =
      workingDistance;

    if (
      vehicleType === "sedan"
    ) {
      if (
        totalRoundTripKm >
        1000
      ) {
        currentMultiplier =
          1.3;

        ratePerKm = 11;
      } else if (
        totalRoundTripKm >
        600
      ) {
        currentMultiplier =
          1.25;

        ratePerKm = 11;
      } else if (
        totalRoundTripKm >
        400
      ) {
        currentMultiplier =
          1.5;

        ratePerKm = 11;
      } else {
        currentMultiplier =
          1.95;

        ratePerKm = 11;
      }
    }

    else if (
      vehicleType === "ertiga"
    ) {
      if (
        totalRoundTripKm >
        1000
      ) {
        currentMultiplier =
          1.4;

        ratePerKm = 13;
      } else if (
        totalRoundTripKm >
        600
      ) {
        currentMultiplier =
          1.45;

        ratePerKm = 13;
      } else if (
        totalRoundTripKm >
        400
      ) {
        currentMultiplier =
          1.8;

        ratePerKm = 13;
      } else {
        currentMultiplier =
          2.1;

        ratePerKm = 13;
      }
    }

    else if (
      vehicleType === "crysta"
    ) {
      if (
        totalRoundTripKm >
        1000
      ) {
        currentMultiplier =
          1.35;

        ratePerKm = 18;
      } else if (
        totalRoundTripKm >
        600
      ) {
        currentMultiplier =
          1.4;

        ratePerKm = 18;
      } else if (
        totalRoundTripKm >
        400
      ) {
        currentMultiplier =
          1.9;

        ratePerKm = 18;
      } else {
        currentMultiplier =
          2.2;

        ratePerKm = 18;
      }
    }

    /* =====================================================
       ROUND TRIP HALT CALCULATION
    ===================================================== */

    if (
      pickupDate &&
      returnDate &&
      pickupTime &&
      returnTime
    ) {
      try {
        const pickupDateTime =
          new Date(
            `${pickupDate}T${pickupTime}`
          );

        const returnDateTime =
          new Date(
            `${returnDate}T${returnTime}`
          );

        const estimatedTransitHours =
          showKms / 50;

        const estimatedTransitMs =
          estimatedTransitHours *
          60 *
          60 *
          1000;

        const destinationReachDateTime =
          new Date(
            pickupDateTime.getTime() +
              estimatedTransitMs
          );

        const freeStayLimitDateTime =
          new Date(
            destinationReachDateTime.getTime() +
              6 *
                60 *
                60 *
                1000
          );

        if (
          returnDateTime.getTime() >
          freeStayLimitDateTime.getTime()
        ) {
          const stayTimeDiffMs =
            returnDateTime.getTime() -
            destinationReachDateTime.getTime();

          const totalStayDays =
            Math.ceil(
              stayTimeDiffMs /
                (1000 *
                  60 *
                  60 *
                  24)
            );

          if (
            totalStayDays > 0
          ) {
            haltCharges =
              totalStayDays *
              350;
          }
        }
      } catch (
        timelineError
      ) {
        console.error(
          "Timeline analysis crash:",
          timelineError
        );
      }
    }
  }

  /* =======================================================
     FINAL OUTSTATION CALCULATION
  ======================================================= */

  let baseWithMultiplier =
    0;

  if (
    useCustomMicroBase
  ) {
    const rawMicroTotal =
      customBaseFareValue +
      showKms *
        ratePerKm;

    baseWithMultiplier =
      rawMicroTotal *
      currentMultiplier *
      routeCustomMultiplier;
  } else {
    const calculatedBase =
      effectiveCalculationDistance *
      ratePerKm;

    baseWithMultiplier =
      calculatedBase *
      currentMultiplier *
      routeCustomMultiplier;
  }

  /* =======================================================
     FINAL OUTSTATION FARE
  ======================================================= */

  const finalFareWithoutHalt =
    psychologicalPrice(
      baseWithMultiplier
    );

  const absoluteFinalFare =
    finalFareWithoutHalt +
    haltCharges;

  /* =======================================================
     DURATION
  ======================================================= */

  const durationMinutes =
    Math.round(
      (showKms / 50) * 60
    ) + 30;

  /* =======================================================
     DISPLAY DISTANCE
  ======================================================= */

  const finalBilledDisplayDistance =
    showKms;

  /* =======================================================
     STRIKE FARE
  ======================================================= */

  const calculatedStrikeFare =
    Math.round(
      absoluteFinalFare *
        1.15
    );

  /* =======================================================
     AMBIKAPUR DISPLAY RULE
  ======================================================= */

  let displayedFinalFare =
    absoluteFinalFare;

  const isPickupAmbikapur =
    pickup &&
    pickup
      .toLowerCase()
      .includes(
        "ambikapur"
      );

  const isDropAmbikapur =
    drop &&
    drop
      .toLowerCase()
      .includes(
        "ambikapur"
      );

  if (
    isPickupAmbikapur ||
    isDropAmbikapur
  ) {
    displayedFinalFare =
      calculatedStrikeFare;
  }

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    actualDistance:
      workingDistance,

    billedDistance:
      finalBilledDisplayDistance,

    rateUsed:
      ratePerKm,

    strikeFare:
      calculatedStrikeFare,

    finalFare:
      displayedFinalFare,

    discountPercent: 0,

    durationMinutes,

    haltCharges,

    autoCorrectedService:
      finalServiceType,

    isOneWayAvailable:
      oneWayAvailable,
  };
}
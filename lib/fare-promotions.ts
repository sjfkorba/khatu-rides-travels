
export type CampaignBookingType =
  | "oneway"
  | "roundtrip"
  | "local"
  | "shared";

export type FarePromotion = {
  id: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  bookingTypes: string[];
  routeScope: "all" | "selected";
  selectedRoutes?: Array<{
    from: string;
    to: string;
    fromNormalized?: string;
    toNormalized?: string;
  }>;
  offerMode: "automatic" | "coupon";
  couponCode?: string;
  startAt: string;
  endAt: string;
  activeDays: number[];
  minimumFare: number;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  allowStacking: boolean;
  priority: number;
  isActive: boolean;
};

export const normalizePromotionPlace = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-IN")
    .replace(/\s+/g, " ");

export function promotionJourneyDateTime(
  date: string,
  time = "12:00"
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NaN;

  const safeTime = /^\d{2}:\d{2}$/.test(time)
    ? time
    : "12:00";

  return new Date(
    `${date}T${safeTime}:00+05:30`
  ).getTime();
}

export function getPromotionEligibilityReason(
  campaign: FarePromotion,
  input: {
    bookingType: CampaignBookingType;
    pickupDate: string;
    pickupTime?: string;
    pickup: string;
    drop?: string;
    fare: number;
    offerMode?: "automatic" | "coupon";
  },
): string | null {
  if (campaign.isActive !== true) {
    return "Campaign inactive";
  }

  const journeyAt = promotionJourneyDateTime(
    input.pickupDate,
    input.pickupTime
  );

  if (!Number.isFinite(journeyAt)) {
    return "Invalid journey date";
  }

  const start = new Date(campaign.startAt).getTime();
  const end = new Date(campaign.endAt).getTime();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    journeyAt < start ||
    journeyAt > end
  ) {
    return "Journey date/time is outside campaign validity";
  }

  const day = new Date(
    `${input.pickupDate}T12:00:00+05:30`
  ).getDay();

  if (
    !Array.isArray(campaign.activeDays) ||
    !campaign.activeDays.includes(day)
  ) {
    return "Campaign not active on this weekday";
  }

  // Booking type aliases, including KR-SHARED.
  const tripAlias: Record<CampaignBookingType, string> = {
    oneway: "one-way",
    roundtrip: "round-trip",
    local: "local",
    shared: "shared",
  };

  if (
    !campaign.bookingTypes?.includes(
      tripAlias[input.bookingType]
    )
  ) {
    return "Trip type not eligible";
  }

  if (
    input.offerMode &&
    campaign.offerMode !== input.offerMode
  ) {
    return "Offer mode mismatch";
  }

  if (campaign.routeScope === "selected") {
    const from = normalizePromotionPlace(input.pickup);
    const to = normalizePromotionPlace(input.drop);

    const matched = (
      campaign.selectedRoutes || []
    ).some((route) => {
      const routeFrom = normalizePromotionPlace(
        route.fromNormalized || route.from
      );

      const routeTo = normalizePromotionPlace(
        route.toNormalized || route.to
      );

      return (
        !!routeFrom &&
        !!routeTo &&
        from.includes(routeFrom) &&
        to.includes(routeTo)
      );
    });

    if (!matched) {
      return "Route not eligible";
    }
  }

  if (
    Number(input.fare) <
    Number(campaign.minimumFare || 0)
  ) {
    return "Minimum fare not reached";
  }

  if (
    campaign.usageLimit != null &&
    Number(campaign.usageCount || 0) >=
      Number(campaign.usageLimit)
  ) {
    return "Campaign usage limit reached";
  }

  return null;
}

export function calculatePromotionDiscount(
  campaign: FarePromotion,
  fare: number
) {
  const safeFare = Math.max(
    0,
    Number(fare) || 0
  );

  if (
    safeFare <
    Number(campaign.minimumFare || 0)
  ) {
    return 0;
  }

  const raw =
    campaign.discountType === "percentage"
      ? (
          safeFare *
          Number(campaign.discountValue || 0)
        ) / 100
      : Number(campaign.discountValue || 0);

  const capped =
    campaign.maximumDiscount == null
      ? raw
      : Math.min(
          raw,
          Math.max(
            0,
            Number(campaign.maximumDiscount) || 0
          )
        );

  return Math.min(
    safeFare,
    Math.max(0, Math.round(capped))
  );
}

export function chooseBestAutomaticPromotion(
  campaigns: FarePromotion[],
  input: Omit<
    Parameters<typeof getPromotionEligibilityReason>[1],
    "offerMode"
  >
) {
  return campaigns
    .filter(
      (campaign) =>
        !getPromotionEligibilityReason(
          campaign,
          {
            ...input,
            offerMode: "automatic",
          }
        )
    )
    .map((campaign) => ({
      campaign,
      discountAmount: calculatePromotionDiscount(
        campaign,
        input.fare
      ),
    }))
    .filter((item) => item.discountAmount > 0)
    .sort(
      (a, b) =>
        b.discountAmount - a.discountAmount ||
        Number(b.campaign.priority || 0) -
          Number(a.campaign.priority || 0)
    )[0] || null;
}

export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-354257172";

export const GOOGLE_ADS_CONVERSIONS = {
  // Google Ads conversion labels
  websiteCall:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_LABEL || "",

  whatsapp:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL || "",

  fareCheck:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_FARE_CHECK_LABEL || "",

  booking:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL || "",
} as const;

export function conversionSendTo(label?: string) {
  if (!label) return "";

  return `${GOOGLE_ADS_ID}/${label}`;
}

export function trackGoogleAdsConversion(
  label: string | undefined,
  options: {
    value?: number;
    currency?: string;
    transactionId?: string;
  } = {}
) {
  if (
    typeof window === "undefined" ||
    typeof window.gtag !== "function" ||
    !label
  ) {
    return;
  }

  const payload: Record<string, unknown> = {
    send_to: conversionSendTo(label),
    value:
      typeof options.value === "number" && Number.isFinite(options.value)
        ? options.value
        : 1,
    currency: options.currency || "INR",
  };

  if (options.transactionId) {
    payload.transaction_id = options.transactionId;
  }

  window.gtag("event", "conversion", payload);
}

/**
 * WhatsApp button click
 */
export function trackWhatsAppClick() {
  trackGoogleAdsConversion(
    GOOGLE_ADS_CONVERSIONS.whatsapp
  );
}

/**
 * Successful fare check
 */
export function trackFareCheckConversion(value = 1) {
  trackGoogleAdsConversion(
    GOOGLE_ADS_CONVERSIONS.fareCheck,
    {
      value,
      currency: "INR",
    }
  );
}

/**
 * Confirmed booking
 */
export function trackBookingConversion(
  value: number,
  transactionId?: string
) {
  trackGoogleAdsConversion(
    GOOGLE_ADS_CONVERSIONS.booking,
    {
      value,
      currency: "INR",
      transactionId,
    }
  );
}
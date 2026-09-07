# Khatu Rides — Google Ads + landing page setup

## Files

- `page.tsx` — new homepage based on the latest centered OTA landing page.
- `FareCalculator.international-founder-v4.tsx` — production fare calculator source used as the homepage calculator.
- `components/GoogleAdsTracker.tsx` — Google tag + optional website-call phone snippet.
- `lib/googleAds.ts` — conversion helper functions.

## Google Ads ID

The supplied Google Ads ID is:

`AW-354257172`

## Required conversion labels

The Google Ads conversion ID is not enough to fire a specific conversion action. For each website conversion action, Google Ads provides a conversion label.

Put these labels in `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_LABEL=YOUR_WEBSITE_CALL_LABEL
NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=YOUR_WHATSAPP_CLICK_LABEL
NEXT_PUBLIC_GOOGLE_ADS_FARE_CHECK_LABEL=YOUR_FARE_CHECK_LABEL
NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL=YOUR_BOOKING_LABEL
```

Do NOT invent labels.

## What is tracked

### Direct calls from ads

`Calls from ads` is an account-side Google Ads conversion. No client-side conversion event is fired by this homepage for it.

### Calls from website

When `NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_LABEL` is set, the Google forwarding-number phone snippet is configured for the business number `+91 92441 37353`.

The Google Ads conversion action should be configured with the minimum call length you selected (currently 60 seconds). The conversion is therefore based on the actual qualifying call, not simply a page view.

### WhatsApp

`trackWhatsAppClick()` fires the WhatsApp conversion action when a WhatsApp link is clicked. This is a click conversion, not proof that a WhatsApp conversation became a booking.

### Fare check

A successful fare calculation calls `trackFareCheckConversion(1)`. Keep this conversion Secondary in Google Ads initially.

### Confirmed booking

After the existing Razorpay verification succeeds, the homepage calls `trackBookingConversion(processAmount, finalInvoiceId)`.

## Important billing note

Conversion tracking does NOT make Google Ads charge only when a call happens. If the campaign uses CPC-style charging, an ad click can still incur cost even when the visitor never calls. Conversion settings control measurement and bidding signals, not whether an ad click is billable.

## Google tag placement

For production, the Google tag should be loaded sitewide. If your root `app/layout.tsx` already has a Google tag, do not load a second copy. In that case, move the `<GoogleAdsTracker />` from `page.tsx` to the root layout and keep only one sitewide Google tag.

## Recommended conversion structure

- Calls from ads — Primary
- Calls from website — Primary
- Confirmed booking — Primary
- WhatsApp click — Secondary initially
- Fare check — Secondary
- Page view — not an optimization conversion

## Phone number

The website-call phone snippet uses the business number currently configured in the homepage:

`+91 92441 37353`

If the live website displays a different number, change `BUSINESS_PHONE` in `components/GoogleAdsTracker.tsx` and the Google Ads conversion action's display/destination number together.

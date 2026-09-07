"use client";

import Script from "next/script";
import { GOOGLE_ADS_ID, GOOGLE_ADS_CONVERSIONS } from "@/lib/googleAds";

const BUSINESS_PHONE = "+91 92441 37353";

/**
 * Sitewide Google Ads tag.
 *
 * - Loads AW-354257172 exactly once for this app shell/page.
 * - If NEXT_PUBLIC_GOOGLE_ADS_WEBSITE_CALL_LABEL is present, configures the
 *   Google forwarding-number phone snippet for the website-call conversion.
 * - The direct "Calls from ads" conversion is configured in Google Ads and
 *   does not need a client-side conversion event here.
 */
export default function GoogleAdsTracker() {
  const websiteCallLabel = GOOGLE_ADS_CONVERSIONS.websiteCall;

  return (
    <>
      <Script
        id="google-ads-gtag-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-ads-gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          ${
            websiteCallLabel
              ? `window.gtag('config', '${GOOGLE_ADS_ID}/${websiteCallLabel}', {
              'phone_conversion_number': '${BUSINESS_PHONE}'
            });`
              : ""
          }
          window.gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import OfferPopup from "@/components/OfferPopup";

/**
 * Public website chrome.
 * All popup/footer UI is excluded from /admin and every nested admin route.
 */
export default function SiteChrome() {
  const pathname = usePathname() || "/";
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <OfferPopup />
      <SiteFooter />
    </>
  );
}

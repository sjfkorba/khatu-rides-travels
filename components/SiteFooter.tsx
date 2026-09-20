// components/SiteFooter.tsx

"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function SiteFooter() {
  const pathname = usePathname();

  /*
   * All admin routes are treated as a separate application area.
   *
   * Examples:
   * /admin
   * /admin/bookings
   * /admin/advance-bookings
   * /admin/advance-bookings/create
   * /admin/advance-bookings/123
   * /admin/invoices
   * /admin/customers
   * /admin/settings
   *
   * None of these routes will display the public website footer.
   */
  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return null;
  }

  return <Footer />;
}
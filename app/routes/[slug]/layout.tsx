import type { Metadata } from "next";
import { routeDatabase } from "@/lib/routeDatabase";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const route = routeDatabase[params.slug];
  return { title: route?.title || "Route Not Found", description: route?.desc };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
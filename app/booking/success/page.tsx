import BookingSuccessClient from "./BookingSuccessClient";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  return <BookingSuccessClient bookingId={params.id || ""} />;
}

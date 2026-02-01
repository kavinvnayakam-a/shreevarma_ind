export const dynamic = "force-dynamic"; // Required for Next.js 15 dynamic routes

import OrderDetailClient from "./OrderDetailClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Pass the promise directly to the client
  return <OrderDetailClient params={params} />;
}
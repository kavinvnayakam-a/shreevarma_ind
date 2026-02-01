import SuccessClient from "./SuccessClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // Unwrap the promise to get the actual ID
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  return (
    <div className="min-h-screen bg-[#F9F5F1]">
      {/* Passing the ID as a simple string makes the Client logic much cleaner */}
      <SuccessClient orderId={orderId} />
    </div>
  );
}
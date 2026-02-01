'use client';
import { ZegoVideoCall } from '@/components/consultation/ZegoVideoCall';
import { use } from 'react';

export default function ConsultationSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <ZegoVideoCall consultationId={resolvedParams.id} />;
}

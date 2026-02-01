
import { specialists } from '@/components/home/specialists-data';
import DoctorProfileClient from './DoctorProfileClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return specialists.map((doctor) => ({
    slug: doctor.slug,
  }));
}

export default function DoctorProfilePage({ params }: { params: { slug: string } }) {
  const doctor = specialists.find((d) => d.slug === params.slug);

  if (!doctor) {
    notFound();
  }

  return <DoctorProfileClient doctor={doctor} />;
}

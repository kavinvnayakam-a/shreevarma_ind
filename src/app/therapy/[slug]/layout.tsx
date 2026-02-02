
import { therapiesData } from '../therapy-data';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const therapy = therapiesData.find((t) => t.slug === params.slug);

  if (!therapy) {
    return {
      title: 'Therapy Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${therapy.name} Therapy`,
    description: therapy.what.substring(0, 160),
    openGraph: {
      title: `${therapy.name} | Ayurvedic Therapy | Shreevarma's Wellness`,
      description: therapy.what.substring(0, 160),
      images: [therapy.imageUrl, ...previousImages],
    },
  };
}

export default function TherapyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

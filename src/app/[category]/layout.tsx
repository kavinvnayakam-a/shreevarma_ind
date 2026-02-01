import type { Metadata } from 'next';
import { categories } from '@/components/products/category-data';

type Props = {
  params: { category: string };
};

// Predefined metadata for each category to improve SEO
const metadataStore: { [key: string]: Metadata } = {
  Health: {
    title: "Ayurvedic Health Products | Natural Wellness Solutions",
    description: "Explore a wide range of Ayurvedic products for general health and wellness. Find natural remedies for common ailments and boost your overall well-being with Shreevarma.",
  },
  'Mens-Intimacy': {
    title: "Men's Intimacy & Vitality Products | Ayurvedic Solutions",
    description: "Enhance male vitality and wellness with our specially formulated Ayurvedic products for men's intimacy and reproductive health. Shop now for natural solutions.",
  },
  'Womens-Wellness': {
    title: "Women's Wellness & Hormonal Balance | Ayurvedic Care",
    description: "Discover natural Ayurvedic solutions for women's wellness, including support for hormonal balance, menstrual health, and overall vitality. Trusted and effective.",
  },
  'Kids-Care': {
    title: "Natural Ayurvedic Kids Care Products | Gentle & Safe",
    description: "Shop our gentle and safe Ayurvedic kids care range. Find natural products to support your child's immunity, growth, and overall health.",
  },
  'Hair-Care': {
    title: "Ayurvedic Hair Care Products | For Strong & Healthy Hair",
    description: "Transform your hair with our natural Ayurvedic hair care products. Address hair fall, dandruff, and promote strong, healthy hair growth with traditional remedies.",
  },
  'Skin-Care': {
    title: "Ayurvedic Skin Care Products | For Radiant & Clear Skin",
    description: "Achieve radiant and clear skin with our Ayurvedic skin care range. Explore natural face washes, creams, and treatments for all skin types at Shreevarma.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryInfo = categories.find((c) => c.slug === categorySlug);
  const categoryName = categoryInfo ? categoryInfo.name : 'Products';

  // Use specific metadata if available, otherwise generate a default
  const specificMetadata = metadataStore[categorySlug];
  if (specificMetadata) {
    return specificMetadata;
  }

  return {
    title: `${categoryName} | Ayurvedic Products | Shreevarma's Wellness`,
    description: `Shop for authentic Ayurvedic products in the ${categoryName} category. Natural and effective solutions for your health needs.`,
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

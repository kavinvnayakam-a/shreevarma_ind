

// This file can be removed later if it's no longer needed for placeholder data.

export type Product = {
  id: string;
  name: string;
  brand: string;
  description?: string;
  longDescription?: string; // Kept for cart/detail pages if needed
  sellingPrice: number;
  imageUrls?: string[];
  
  // Fields from the form that might exist on the product object
  ingredients?: string;
  directionOfUse?: string;
  comparedAtPrice?: number;
  sku?: string;
  inventoryQuantity?: number;
  continueSellingWhenOutOfStock?: boolean;
  status?: 'active' | 'draft';
  productType?: string;
  category?: string;
  tags?: string[];
  bannerImageUrl1?: string;
  bannerImageUrl2?: string;
  bannerImageUrl3?: string;
};

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Triphala Churna',
    brand: 'Himalayan Organics',
    description: 'A classic Ayurvedic formula for detoxification and rejuvenation.',
    longDescription:
      'Triphala Churna is a potent blend of three fruits: Amalaki, Bibhitaki, and Haritaki. It is renowned in Ayurveda for its ability to gently cleanse the colon, promote healthy digestion, and support overall wellness. Our Triphala is sourced from organic farms and carefully processed to retain its natural potency.',
    sellingPrice: 12.99,
    imageUrls: ['https://images.unsplash.com/photo-1662058595162-10e024b1a907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxheXVydmVkYSUyMGJvdHRsZXxlbnwwfHx8fDE3NjIzMTYwMzF8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    ingredients: 'Amalaki, Bibhitaki, Haritaki',
    directionOfUse: 'Take 1-2 teaspoons with warm water before bed or as directed by your physician.',
  },
  {
    id: 'prod-2',
    name: 'Chyawanprash',
    brand: 'Dabur',
    description: 'A delicious herbal jam to boost immunity and vitality.',
    longDescription:
      "Dabur Chyawanprash is a time-tested Ayurvedic formulation of more than 41 Ayurvedic herbs that aid in boosting the immune system, thereby protecting the body from everyday infections like cough and cold etc. caused by bacteria, viruses, dust and weather change. As a health supplement, Dabur Chyawanprash can be taken by people from all age groups.",
    sellingPrice: 19.99,
    imageUrls: ['https://images.unsplash.com/photo-1609150990057-f13c984a12f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxoZWFsdGglMjBzdXBwbGVtZW50fGVufDB8fHx8MTc2MjIzMDEwOHww&ixlib=rb-4.1.0&q=80&w=1080'],
    ingredients: 'Amla, Ashwagandha, Pippali, and more than 40 other herbs.',
    directionOfUse: 'One teaspoonful twice a day, preferably with milk.',
  },
  {
    id: 'prod-3',
    name: 'Ashwagandha Tablets',
    brand: 'Organic India',
    description: 'An adaptogenic herb to help manage stress and anxiety.',
    longDescription:
      'Ashwagandha is a powerful adaptogen that helps the body adapt to stress. It is known to calm the nervous system, reduce anxiety, and improve energy levels without being a stimulant. Our tablets are made from certified organic Ashwagandha root for maximum benefit.',
    sellingPrice: 15.49,
    imageUrls: ['https://images.unsplash.com/photo-1579476549678-f31de2ea0699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxoZXJiYWwlMjB0YWJsZXRzfGVufDB8fHx8MTc2MjMxNjAzMXww&ixlib=rb-4.1.0&q=80&w=1080'],
    ingredients: 'Organic Ashwagandha Root',
    directionOfUse: 'Take 1-2 tablets twice daily with water at mealtimes.',
  },
  {
    id: 'prod-4',
    name: 'Bhringraj Hair Oil',
    brand: 'Biotique',
    description: 'An intensive hair treatment to prevent hair loss and greying.',
    longDescription:
      'This intensive formula features pure Bhringraj, Butea frondosa, Amla and Centella blended with coconut oil and the healthfulness of goat milk to help treat alopecia and other causes of hair loss. Nourishes the scalp and strengthens hair strands to encourage fresh growth and help diminish greying.',
    sellingPrice: 9.99,
    imageUrls: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoYWlyJTIwb2lsfGVufDB8fHx8MTc2MjI1Mjk2NHww&ixlib=rb-4.1.0&q=80&w=1080'],
    ingredients: 'Bhringraj, Amla, Coconut Oil, Goat Milk',
    directionOfUse: 'Apply liberally to dry hair and scalp. Massage gently with circular motions. Leave on for at least half an hour. Shampoo.',
  },
  {
    id: 'prod-5',
    name: 'Brahmi Powder',
    brand: 'VedaLife',
    description: 'A nerve tonic that enhances memory, learning, and concentration.',
    longDescription:
      'Brahmi is a staple in traditional Ayurvedic medicine. It has been used for centuries to help improve memory, reduce anxiety, and treat a number of other ailments. As a potent antioxidant, it can also help protect the body against damage from free radicals.',
    sellingPrice: 11.0,
    imageUrls: ['https://images.unsplash.com/photo-1677599082447-6549af4c5454?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxoZXJiYWwlMjBwb3dkZXJ8ZW58MHx8fHwxNzYyMzE2MDMxfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    ingredients: 'Organic Brahmi Leaf Powder',
    directionOfUse: 'Mix 1/2 to 1 teaspoon with warm water, once or twice daily, or as directed by your health practitioner.',
  },
  {
    id: 'prod-6',
    name: 'Neem & Turmeric Soap',
    brand: 'Chandrika',
    description: 'A purifying soap for clear and healthy skin.',
    longDescription:
      'Experience the combination of two of Ayurveda\'s most potent herbs for skin care. Neem is known for its antibacterial properties, while Turmeric brightens the skin and reduces inflammation. This soap is perfect for daily use on all skin types.',
    sellingPrice: 5.99,
    imageUrls: ['https://images.unsplash.com/photo-1630942046599-12bb78bce814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxuYXR1cmFsJTIwc29hcHxlbnwwfHx8fDE3NjIyNzk0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    ingredients: 'Neem Oil, Turmeric Extract, Coconut Oil',
    directionOfUse: 'Work into a rich lather and apply to wet skin. Rinse well.',
  },
];

export type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: {
    product: Product;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
};

export const orders: any[] = [];

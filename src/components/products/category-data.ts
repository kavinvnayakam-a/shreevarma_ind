
const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/`;
const urlSuffix = `?alt=media`;

const getImageUrl = (path: string) => `${baseUrl}${encodeURIComponent(path)}${urlSuffix}`;

export const categories = [
    { name: 'Health', slug: 'Health', imageUrl: getImageUrl('site_assets/homepage/category_health.webp'), imageHint: 'health products' },
    { name: 'Men\'s Intimacy', slug: 'Mens-Intimacy', imageUrl: getImageUrl('site_assets/homepage/category_mens.webp'), imageHint: 'mens intimacy products' },
    { name: 'Women\'s Wellness', slug: 'Womens-Wellness', imageUrl: getImageUrl('site_assets/homepage/category_womens.webp'), imageHint: 'womens wellness products' },
    { name: 'Kids Care', slug: 'Kids-Care', imageUrl: getImageUrl('site_assets/homepage/category_kids.webp'), imageHint: 'kids care products' },
    { name: 'Hair Care', slug: 'Hair-Care', imageUrl: getImageUrl('site_assets/homepage/category_hair.webp'), imageHint: 'hair care products' },
    { name: 'Skin Care', slug: 'Skin-Care', imageUrl: getImageUrl('site_assets/homepage/category_skin.webp'), imageHint: 'skin care products' },
];

type HeroImages = {
    desktop: string;
    mobile: string;
    hint: string;
}

// This object provides hero images for specific known categories.
export const categoryHeros: { [key: string]: HeroImages } = {
    'Health': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FHealth%20Category%20%20Banner%20-%20desktop.webp?alt=media&token=d879e1ff-a41a-45a6-a67f-f53e039983f8',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FHealth%20Category%20%20Banner%20mobile.webp?alt=media&token=4788795a-1297-46ff-8b74-7de34f4c2d77',
        hint: 'health wellness' 
    },
    'Mens-Intimacy': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FMen\'s%20%20Category%20%20Banner%20desktop.webp?alt=media&token=e6dbd2fc-ff98-4bf3-a843-36bf277e7883',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FMen\'s%20%20Category%20%20Banner%20mobile.webp?alt=media&token=6d4deb0e-c7d7-4d8a-8caf-2557758c96a6',
        hint: 'mens intimacy' 
    },
    'Womens-Wellness': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FWomen\'s%20%20Category%20%20Banner%20desktop.webp?alt=media&token=e9576612-10a9-450b-93c9-a549befbcb92',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FWomen\'s%20%20Category%20%20Banner%20mobile.webp?alt=media&token=05c40f41-5af9-4610-998b-7be049f5f216',
        hint: 'womens wellness' 
    },
    'Kids-Care': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FKid\'s%20%20Category%20%20Banner%20desktop.webp?alt=media&token=a2f1b060-9f23-49b4-a6b5-574e8a3da603',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FKid\'s%20%20Category%20%20Banner%20mobile.webp?alt=media&token=82b32a13-6d22-4be4-8b85-02ab9aeafcdc',
        hint: 'kids care'
     },
    'Hair-Care': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FHair%20care%20%20Category%20%20Banner%20Desktop.webp?alt=media&token=18cd4543-395b-41dc-a27f-6bd9ec961060',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FHair%20care%20%20Category%20%20Banner%20mobile.webp?alt=media&token=ce32db38-e203-4677-a5ab-f45a8a36cc7c',
        hint: 'hair care' 
    },
    'Skin-Care': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FSkin%20Care%20%20Category%20%20Banner%20desktop.webp?alt=media&token=127990e6-3216-4dd4-96eb-e97fb9ff6d97',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/product%20pages%2FSkin%20Care%20%20Category%20%20Banner%20mobile.webp?alt=media&token=c8979bb2-6e6b-4656-bba7-18868e75a344',
        hint: 'skin care' 
    },
};

// Fallback hero image if a category-specific one is not found
export const defaultHero: HeroImages = {
    desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FHealth%20Category%20%20Banner.png?alt=media&token=cd995f4f-f023-47c1-86aa-6a55ccbf8bbe',
    mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FHealth%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=0ca15e3e-a32d-42d3-a60d-9e53a5c9c747',
    hint: 'ayurvedic products'
};

    

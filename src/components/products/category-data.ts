
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
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FHealth%20Category%20%20Banner.png?alt=media&token=cd995f4f-f023-47c1-86aa-6a55ccbf8bbe',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FHealth%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=0ca15e3e-a32d-42d3-a60d-9e53a5c9c747',
        hint: 'health wellness' 
    },
    'Mens-Intimacy': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FMen\'s%20%20Category%20%20Banner.png?alt=media&token=7a3946df-3071-47b0-9212-aedfb03c2c23',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FMen\'s%20%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=9399586b-9c29-4163-8458-00b84ece045e',
        hint: 'mens intimacy' 
    },
    'Womens-Wellness': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FWomen\'s%20%20Category%20%20Banner.png?alt=media&token=662c997f-aca5-4f38-902a-810829c21b2e',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FWomen\'s%20%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=ca8a7b64-71ef-4d49-960a-5375c361c691',
        hint: 'womens wellness' 
    },
    'Kids-Care': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FKid\'s%20%20Category%20%20Banner.png?alt=media&token=16e2f07d-9614-4593-996e-bc0ab7858e38',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FKid\'s%20%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=5cf8a19a-2ac3-4712-b9b4-41ec6c9f1f2e',
        hint: 'kids care'
     },
    'Hair-Care': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FHair%20care%20%20Category%20%20Banner.png?alt=media&token=8bf4626f-8890-4011-81c7-09312487fc95',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FHair%20care%20%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=1fd97e1b-5f90-419c-ada9-50d8cc807a44',
        hint: 'hair care' 
    },
    'Skin-Care': { 
        desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FSkin%20Care%20%20Category%20%20Banner.png?alt=media&token=de736d8f-f768-4ba6-b036-0f2e366b49a5',
        mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FSkin%20Care%20%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=89e90dcd-bce5-4b6c-a98e-d77ef94e543e',
        hint: 'skin care' 
    },
};

// Fallback hero image if a category-specific one is not found
export const defaultHero: HeroImages = {
    desktop: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Banner%20Desktop%2FHealth%20Category%20%20Banner.png?alt=media&token=cd995f4f-f023-47c1-86aa-6a55ccbf8bbe',
    mobile: 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/Category%20Hero%20Image%20Mobile%20view%2FHealth%20Category%20%20Banner%201080%20_1080-min.png?alt=media&token=0ca15e3e-a32d-42d3-a60d-9e53a5c9c747',
    hint: 'ayurvedic products'
};

    

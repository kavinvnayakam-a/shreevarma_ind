
export type Clinic = {
    id: string;
    name: string;
    address: string;
    phone: string;
    city: string;
    area: string;
    mapLink: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    imageHint: string;
    facilities: string[];
};

const commonImageUrl = 'https://firebasestorage.googleapis.com/v0/b/shreevarma-india-location.firebasestorage.app/o/LOGO.png?alt=media&token=5b296e5b-0b77-43b0-854d-0f3c60cd766a';

export const clinicsData: Clinic[] = [
    {
        id: '1',
        name: 'Dr. Shreevarma\'s Wellness - Manapakkam',
        address: 'No. 3/195, PRV Building, Parthasarathy Nagar, Poonamallee Mount High Road, Manapakkam, Chennai - 600 125',
        phone: '+919500946631',
        city: 'Chennai',
        area: 'Manapakkam',
        mapLink: 'https://www.google.com/maps?ll=13.020654,80.184032&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=10050701694273616315',
        rating: 4.8,
        reviewCount: 320,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Ayurvedic Consultation', 'Panchakarma Therapy', 'Herbal Pharmacy']
    },
    {
        id: '2',
        name: 'Dr. Shreevarma\'s Wellness - Vellore',
        address: 'No 13, Officers Line, Krishna Nagar, Vellore - 632001, Tamil Nadu, India.',
        phone: '+919500946632',
        city: 'Vellore',
        area: 'Krishna Nagar',
        mapLink: 'https://www.google.com/maps?ll=12.258205,79.054019&z=12&t=h&hl=en&gl=IN&mapclient=embed&cid=6879267765350471207',
        rating: 4.7,
        reviewCount: 150,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Siddha Consultation', 'Yoga Therapy', 'Herbal Supplements']
    },
    {
        id: '3',
        name: 'Dr. Shreevarma\'s Wellness - Tiruvallur',
        address: '2nd Floor, 137, TNHB Phase-II, Near GRT, Tiruvallur - 602001, Tamil Nadu, India.',
        phone: '+919500946633',
        city: 'Tiruvallur',
        area: 'TNHB Phase-II',
        mapLink: 'https://www.google.com/maps?ll=13.144943,79.910106&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=12982310591510472029',
        rating: 4.9,
        reviewCount: 210,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Ayurvedic Consultation', 'Detox Therapies', 'Diet Counseling']
    },
    {
        id: '4',
        name: 'Dr. Shreevarma\'s Wellness - Coimbatore',
        address: 'No 15, 1st Floor, Sri Sowdeswari Complex, Ram Nagar, Coimbatore - 641009, Tamil Nadu, India.',
        phone: '+919500946634',
        city: 'Coimbatore',
        area: 'Ram Nagar',
        mapLink: 'https://www.google.com/maps?ll=11.021715,77.01912&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=1608667013794032836',
        rating: 4.8,
        reviewCount: 450,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Panchakarma', 'Beauty Therapies', 'Herbal Pharmacy']
    },
    {
        id: '5',
        name: 'Dr. Shreevarma\'s Wellness - Salem',
        address: 'First floor, ARRS Multiplex, 5 Roads, Salem - 636004, Tamil Nadu, India.',
        phone: '+919500946635',
        city: 'Salem',
        area: 'ARRS Multiplex',
        mapLink: 'https://www.google.com/maps?ll=11.665113,78.155772&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=13670005095291119715',
        rating: 4.9,
        reviewCount: 380,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Ayurvedic Consultation', 'Panchakarma', 'Yoga Therapy']
    },
     {
        id: '6',
        name: 'Dr. Shreevarma\'s Wellness - Trichy',
        address: 'No 1, First Floor, Vignesh Park, Williams Road, Cantonment, Trichy - 620001, Tamil Nadu, India.',
        phone: '+919500946636',
        city: 'Trichy',
        area: 'Cantonment',
        mapLink: 'https://www.google.com/maps?ll=10.872581,78.761761&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=14686365836881852198',
        rating: 4.8,
        reviewCount: 290,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Siddha Consultation', 'Panchakarma Therapy', 'Herbal Pharmacy']
    },
    {
        id: '7',
        name: 'Dr. Shreevarma\'s Wellness - Hosur',
        address: 'First floor, Opp to Tanishq Jewellery, Near bus stand, Hosur - 635109, Tamil Nadu, India.',
        phone: '+919500946637',
        city: 'Hosur',
        area: 'Near bus stand',
        mapLink: 'https://www.google.com/maps?ll=12.743673,77.836319&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=6648068420990098120',
        rating: 4.7,
        reviewCount: 180,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Ayurvedic Consultation', 'Yoga Therapy', 'Herbal Supplements']
    },
    {
        id: '8',
        name: 'Dr. Shreevarma\'s Wellness - Nagercoil',
        address: 'No 29, 2nd floor, Near Chettikulam jn, Nagercoil - 629001, Tamil Nadu, India.',
        phone: '+919500946638',
        city: 'Nagercoil',
        area: 'Chettikulam jn',
        mapLink: 'https://www.google.com/maps?ll=8.181716,77.423577&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=7761937385094838921',
        rating: 4.9,
        reviewCount: 250,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Detox Therapies', 'Diet Counseling', 'Panchakarma']
    },
    {
        id: '9',
        name: 'Dr. Shreevarma\'s Wellness - Pondicherry',
        address: 'No 1, Iyyanar Koil Street, Raja Nagar, Pondicherry - 605013, Tamil Nadu, India.',
        phone: '+919500946639',
        city: 'Pondicherry',
        area: 'Raja Nagar',
        mapLink: 'https://www.google.com/maps?ll=11.934596,79.835974&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=1750629751034558342',
        rating: 4.8,
        reviewCount: 310,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Beauty Therapies', 'Herbal Pharmacy', 'Ayurvedic Consultation']
    },
    {
        id: '10',
        name: 'Dr. Shreevarma\'s Wellness - Bangalore',
        address: 'No. 32, 1st floor, 1st Main, Service Road, 1st Block, Near Wipro Park, Koramangala, Bangalore - 560034, Karnataka, India.',
        phone: '+919500946640',
        city: 'Bangalore',
        area: 'Koramangala',
        mapLink: 'https://www.google.com/maps?ll=12.980772,77.615559&z=15&t=h&hl=en&gl=IN&mapclient=embed&cid=18333712079385600834',
        rating: 4.9,
        reviewCount: 550,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Yoga Therapy', 'Panchakarma', 'Siddha Consultation']
    },
    {
        id: '11',
        name: 'Dr. Shreevarma\'s Wellness - Annanagar',
        address: 'Plot no 1139, H block, 1st street, Annanagar West, Chennai - 600040, Tamil Nadu, India.',
        phone: '+919500946641',
        city: 'Chennai',
        area: 'Annanagar West',
        mapLink: 'https://www.google.com/maps?ll=13.118955,80.148317&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=4069592523427081987',
        rating: 4.8,
        reviewCount: 420,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Ayurvedic Consultation', 'Panchakarma Therapy', 'Herbal Pharmacy']
    },
    {
        id: '12',
        name: 'Dr. Shreevarma\'s Wellness - Adyar',
        address: 'No 3, 1st Main Road, Opp to Adyar Anandha Bhavan, Gandhi Nagar, Adyar, Chennai - 600020, Tamil Nadu, India.',
        phone: '+919500946642',
        city: 'Chennai',
        area: 'Adyar',
        mapLink: 'https://www.google.com/maps?ll=12.98155,80.223603&z=15&t=h&hl=en&gl=IN&mapclient=embed&cid=7056124137764542670',
        rating: 4.9,
        reviewCount: 600,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Siddha Consultation', 'Yoga Therapy', 'Herbal Supplements']
    },
     {
        id: '13',
        name: 'Dr. Shreevarma\'s Wellness - Madurai',
        address: 'No 219, 1st floor, Opp to Aravind Eye Hospital, Anna Nagar, Madurai - 625020, Tamil Nadu, India.',
        phone: '+919500946643',
        city: 'Madurai',
        area: 'Anna Nagar',
        mapLink: 'https://www.google.com/maps?ll=9.936134,78.14292&z=15&t=m&hl=en&gl=IN&mapclient=embed&cid=12878170535568213458',
        rating: 4.8,
        reviewCount: 350,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Ayurvedic Consultation', 'Detox Therapies', 'Diet Counseling']
    },
    {
        id: '14',
        name: 'Dr. Shreevarma\'s Wellness - Vadapalani',
        address: 'No 1, 1st floor, Kumaran Colony, Near Vadapalani bus depot, Vadapalani, Chennai - 600026, Tamil Nadu, India.',
        phone: '+919500946644',
        city: 'Chennai',
        area: 'Vadapalani',
        mapLink: 'https://www.google.com/maps?ll=13.049725,80.217964&z=17&t=m&hl=en&gl=IN&mapclient=embed&cid=14253901759414562328',
        rating: 4.7,
        reviewCount: 280,
        imageUrl: commonImageUrl,
        imageHint: 'clinic logo',
        facilities: ['Panchakarma', 'Beauty Therapies', 'Herbal Pharmacy']
    }
];
    

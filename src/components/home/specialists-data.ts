
export type Specialist = {
    name: string;
    slug: string;
    specialty: string;
    experience: string;
    location: string;
    languages: string;
    imageId: string;
    hint: string;
    about: string;
    conditionsTreated: string[];
    certifications: string[];
    rating: number;
    reviewCount: number;
    consultationFee?: number;
    isAvailableForVideo: boolean;
};

export const specialists: Specialist[] = [
    { 
        name: 'Dr. Shreevarma', 
        slug: 'dr-shreevarma',
        specialty: 'BAMS, MSc', 
        experience: '25+ Years Experience', 
        location: 'Ayurveda Doctor, Chennai', 
        languages: '', 
        imageId: 'specialist-shreevarma', 
        hint: 'doctor portrait',
        about: 'Dr. Shreevarma is a world-renowned Ayurvedic practitioner with over two decades of experience in holistic healing. His approach combines traditional Ayurvedic wisdom with modern scientific research to provide effective and personalized treatments. He is the visionary behind Shreevarma Wellness and has dedicated his life to spreading the benefits of Ayurveda globally.',
        conditionsTreated: [
            'Lifestyle Disorders (Stress, Insomnia, etc)',
            'Hormonal and PCOD Issues (All forms of women\'s issues)',
            'Metabolic Management',
            'Digestive Health (Acidity, Gastritis, Irritable Bowel Syndrome)',
            'Skin Conditions (Eczema, Psoriasis, and allergy skin)',
            'Joint and Musculoskeletal disorders'
        ],
        certifications: [
            'Board Certified in Ayurvedic and Siddha Medicine (BAMS)',
            'Masters Certification for alternate therapy'
        ],
        rating: 4.9,
        reviewCount: 2187,
        consultationFee: 800,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Gowthaman', 
        slug: 'dr-gowthaman',
        specialty: 'BAMS', 
        experience: '24+ Years Experience', 
        location: 'Ayurveda Doctor, Chennai', 
        languages: '', 
        imageId: 'specialist-gowthaman', 
        hint: 'doctor portrait',
        about: 'Dr. Gowthaman is a senior Ayurvedic physician with extensive experience in treating chronic illnesses through classical Ayurvedic methods. He is known for his compassionate patient care and in-depth knowledge of herbal pharmacology.',
        conditionsTreated: [
            'Diabetes Management',
            'Cardiovascular Health',
            'Respiratory Ailments',
            'Kidney Disorders'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.8,
        reviewCount: 1500,
        consultationFee: 750,
        isAvailableForVideo: false,
    },
    { 
        name: 'Dr. Jayaroopa', 
        slug: 'dr-jayaroopa',
        specialty: 'BSMS MD', 
        experience: '12 Years Experience', 
        location: 'Ayurveda Doctor, Chennai', 
        languages: '', 
        imageId: 'specialist-jayaroopa', 
        hint: 'doctor portrait',
        about: 'Dr. Jayaroopa specializes in Siddha medicine and has a decade of experience in providing holistic care, particularly for women and children. Her expertise lies in integrating diet and lifestyle changes with traditional therapies.',
        conditionsTreated: [
            'Women\'s Health and Gynaecology',
            'Pediatric Health',
            'Skin and Hair Care',
            'Mental Wellness'
        ],
        certifications: [
            'Doctor of Medicine in Siddha (MD)',
            'Bachelor of Siddha Medicine and Surgery (BSMS)'
        ],
        rating: 4.9,
        reviewCount: 980,
        consultationFee: 700,
        isAvailableForVideo: false,
    },
    { 
        name: 'Dr. Shabina', 
        slug: 'dr-shabina',
        specialty: 'BAMS', 
        experience: '1.5 Years Experience', 
        location: 'Ayurveda Doctor, Thiruvannamalai', 
        languages: 'Tamil, English, Malayalam', 
        imageId: 'specialist-shabina', 
        hint: 'doctor portrait',
        about: 'Dr. Shabina is a dedicated Ayurvedic practitioner focused on promoting natural healing through personalized diet plans and herbal remedies. She is passionate about educating her patients on preventive healthcare.',
        conditionsTreated: [
            'General Wellness',
            'Digestive Issues',
            'Common Cold and Cough',
            'Headaches and Migraines'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.7,
        reviewCount: 150,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Hemala', 
        slug: 'dr-hemala',
        specialty: 'BAMS', 
        experience: '10 Years Experience', 
        location: 'Ayurveda Doctor, Thiruvallur', 
        languages: 'Telugu, Tamil, English', 
        imageId: 'specialist-hemala', 
        hint: 'doctor portrait',
        about: 'With 10 years of experience, Dr. Hemala is an expert in Panchakarma therapies and detoxification. She believes in cleansing the body from within to achieve long-lasting health and vitality.',
        conditionsTreated: [
            'Panchakarma and Detoxification',
            'Arthritis and Joint Pain',
            'Chronic Fatigue Syndrome',
            'Autoimmune Disorders'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)',
            'Certified Panchakarma Therapist'
        ],
        rating: 4.8,
        reviewCount: 850,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Malathi', 
        slug: 'dr-malathi',
        specialty: 'BSMS', 
        experience: '29 Years Experience', 
        location: 'Ayurveda Doctor, Coimbatore', 
        languages: 'Tamil, English', 
        imageId: 'specialist-malathi', 
        hint: 'doctor portrait',
        about: 'A veteran in the field of Siddha medicine, Dr. Malathi has nearly three decades of experience. Her practice is rooted in ancient Siddha principles, focusing on rejuvenation and anti-aging treatments.',
        conditionsTreated: [
            'Anti-aging and Rejuvenation',
            'Neurological Disorders',
            'Liver and Kidney Care',
            'Male and Female Infertility'
        ],
        certifications: [
            'Bachelor of Siddha Medicine and Surgery (BSMS)'
        ],
        rating: 4.9,
        reviewCount: 2500,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Saraswathi',
        slug: 'dr-saraswathi',
        specialty: 'BSMS, MA Yoga', 
        experience: '18 Years Experience', 
        location: 'Ayurveda Doctor, Salem', 
        languages: 'Tamil, English', 
        imageId: 'specialist-saraswathi', 
        hint: 'doctor portrait',
        about: 'Dr. Saraswathi integrates Yoga therapy with Siddha medicine to provide a comprehensive healing experience. She is an expert in managing lifestyle disorders through a holistic mind-body approach.',
        conditionsTreated: [
            'Yoga Therapy',
            'Stress and Anxiety Management',
            'Spinal Disorders',
            'Respiratory Conditions like Asthma'
        ],
        certifications: [
            'Bachelor of Siddha Medicine and Surgery (BSMS)',
            'Master of Arts in Yoga'
        ],
        rating: 4.8,
        reviewCount: 1200,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Surya bharathi',
        slug: 'dr-surya-bharathi',
        specialty: 'BAMS, Dip in yoga', 
        experience: '3 Years Experience', 
        location: 'Ayurveda Doctor, Trichy', 
        languages: 'Tamil, English', 
        imageId: 'specialist-surya', 
        hint: 'doctor portrait',
        about: 'Dr. Surya Bharathi is a young and dynamic Ayurvedic doctor who combines traditional knowledge with modern diagnostic approaches. She has a special interest in pediatric care and nutritional counseling.',
        conditionsTreated: [
            'Pediatric Ayurvedic Care',
            'Nutritional Guidance',
            'Immunity Boosting',
            'Allergic Conditions'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)',
            'Diploma in Yoga'
        ],
        rating: 4.7,
        reviewCount: 200,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Sonali J', 
        slug: 'dr-sonali-j',
        specialty: 'BAMS', 
        experience: '1.5 Years Experience', 
        location: 'Ayurveda Doctor, Hosur', 
        languages: 'Tamil, English, Malayalam', 
        imageId: 'specialist-sonali', 
        hint: 'doctor portrait',
        about: 'Dr. Sonali is passionate about making Ayurveda accessible to everyone. Her practice focuses on simple yet effective lifestyle modifications and herbal treatments for common health issues.',
        conditionsTreated: [
            'General Health Consultations',
            'Acidity and Indigestion',
            'Skin Rashes and Allergies',
            'Hair Fall'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.6,
        reviewCount: 120,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Jebashin J', 
        slug: 'dr-jebashin-j',
        specialty: 'BAMS', 
        experience: '15 Years Experience', 
        location: 'Ayurveda Doctor, Nagercoil', 
        languages: 'Tamil, English, Hindi, Malayalam', 
        imageId: 'specialist-jebashin', 
        hint: 'doctor portrait',
        about: 'With 15 years of rich experience, Dr. Jebashin is proficient in treating a wide range of diseases. He is particularly skilled in handling complex cases and providing second opinions.',
        conditionsTreated: [
            'Complex and Chronic Diseases',
            'Endocrine Disorders',
            'Male Health Issues',
            'Piles, Fissure, and Fistula'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.9,
        reviewCount: 1100,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Priyadharshani', 
        slug: 'dr-priyadharshani',
        specialty: 'BAMS', 
        experience: '2 Years Experience', 
        location: 'Ayurveda Doctor, Pondicherry', 
        languages: 'Hindi, English, Tamil', 
        imageId: 'specialist-priyadharshani', 
        hint: 'doctor portrait',
        about: 'Dr. Priyadharshani focuses on holistic wellness and preventive medicine. She offers practical advice on diet, exercise, and mental health to help her patients lead a balanced life.',
        conditionsTreated: [
            'Preventive Healthcare',
            'Weight Management',
            'Menstrual Disorders',
            'Thyroid Management'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.7,
        reviewCount: 180,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Guna Apsala T', 
        slug: 'dr-guna-apsala-t',
        specialty: 'BAMS', 
        experience: '3 Years Experience', 
        location: 'Ayurveda Doctor, Bangalore', 
        languages: 'Tamil, English, Malayalam, Hindi', 
        imageId: 'specialist-guna', 
        hint: 'doctor portrait',
        about: 'Dr. Guna Apsala is committed to patient-centric care. She takes the time to understand her patients\' concerns and creates tailored treatment plans that are both effective and easy to follow.',
        conditionsTreated: [
            'Acne and Skin Blemishes',
            'Hair and Scalp problems',
            'Stress-related issues',
            'General Debility'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.8,
        reviewCount: 250,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Anish Fatima', 
        slug: 'anish-fatima',
        specialty: 'BSMS', 
        experience: '7 Years Experience', 
        location: 'Ayurveda Doctor, Ambattur', 
        languages: 'Tamil, English, Malayalam', 
        imageId: 'specialist-anish', 
        hint: 'doctor portrait',
        about: 'Anish Fatima is a Siddha practitioner with a focus on non-invasive therapies for chronic pain management. She combines traditional Varma techniques with modern physiotherapy concepts for optimal results.',
        conditionsTreated: [
            'Chronic Pain Management',
            'Varma Therapy',
            'Musculoskeletal Disorders',
            'Post-injury Rehabilitation'
        ],
        certifications: [
            'Bachelor of Siddha Medicine and Surgery (BSMS)'
        ],
        rating: 4.8,
        reviewCount: 600,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Megala', 
        slug: 'dr-megala',
        specialty: 'BAMS', 
        experience: '1 Year Experience', 
        location: 'Ayurveda Doctor, Velachery', 
        languages: 'Tamil, Hindi, English, Malayalam', 
        imageId: 'specialist-megala', 
        hint: 'doctor portrait',
        about: 'Dr. Megala is a fresh and enthusiastic Ayurvedic doctor who is passionate about promoting a healthy lifestyle. She excels at providing dietary and lifestyle advice for young adults and professionals.',
        conditionsTreated: [
            'Lifestyle and Dietary Counseling',
            'Stress Management for Professionals',
            'Digital Eye Strain',
            'Improving Sleep Quality'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.6,
        reviewCount: 90,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Abina Mobisha', 
        slug: 'dr-abina-mobisha',
        specialty: 'BSMS', 
        experience: '7 Years Experience', 
        location: 'Ayurveda Doctor, Madhurai', 
        languages: 'Tamil, English, Malayalam', 
        imageId: 'specialist-abina', 
        hint: 'doctor portrait',
        about: 'Dr. Abina Mobisha is a skilled Siddha physician from Madurai. She is known for her expertise in treating dermatological conditions and her gentle approach with patients of all ages.',
        conditionsTreated: [
            'Dermatology (Skin Diseases)',
            'Allergic Rhinitis and Sinusitis',
            'Pediatric Immunity',
            'Geriatric Care'
        ],
        certifications: [
            'Bachelor of Siddha Medicine and Surgery (BSMS)'
        ],
        rating: 4.8,
        reviewCount: 550,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
    { 
        name: 'Dr. Anitha', 
        slug: 'dr-anitha',
        specialty: 'BAMS', 
        experience: '8 Years Experience', 
        location: 'Ayurveda Doctor, Kodampakam', 
        languages: 'Tamil, English, Sanskrit', 
        imageId: 'specialist-anitha', 
        hint: 'doctor portrait',
        about: 'Dr. Anitha is an experienced Ayurvedic doctor who specializes in classical Panchakarma treatments. She has a deep understanding of Sanskrit and the ancient Ayurvedic texts, which she applies in her clinical practice.',
        conditionsTreated: [
            'Panchakarma Therapy',
            'Rheumatoid Arthritis',
            'Neurological and Spinal issues',
            'Infertility Treatment'
        ],
        certifications: [
            'Bachelor of Ayurvedic Medicine and Surgery (BAMS)'
        ],
        rating: 4.9,
        reviewCount: 750,
        consultationFee: 500,
        isAvailableForVideo: true,
    },
];

    

import type { IResponseData } from "../types";

// Mock delay to simulate network requests
const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Real Pasadena rehabilitation centers for research study
const pasadenaRehabCenters = [
  {
    name: "Huntington Hospital Rehabilitation Services",
    address: "100 W California Blvd, Pasadena, CA 91105",
    phone: "(626) 397-5000",
    specialties: [
      "Spinal Cord Injury",
      "Adaptive Sports Training",
      "Occupational Therapy",
    ],
    description:
      "Leading rehabilitation hospital with specialized adaptive sports program and equipment loan library.",
  },
  {
    name: "Casa Colina Hospital and Centers for Healthcare",
    address: "255 E Bonita Ave, Pomona, CA 91767",
    phone: "(909) 596-7733",
    specialties: [
      "Comprehensive Rehabilitation",
      "Adaptive Technology",
      "Wheelchair Sports",
    ],
    description:
      "Nationally recognized rehabilitation center with adaptive sports programs and research initiatives.",
  },
  {
    name: "Pasadena Rehabilitation Institute",
    address: "1550 N Lake Ave, Pasadena, CA 91104",
    phone: "(626) 795-6100",
    specialties: [
      "Physical Therapy",
      "Adaptive Equipment Training",
      "Community Integration",
    ],
    description:
      "Community-focused rehabilitation with strong connections to local adaptive sports programs.",
  },
  {
    name: "Rose Bowl Aquatics Therapy Center",
    address: "1001 Rose Bowl Dr, Pasadena, CA 91103",
    phone: "(626) 577-3100",
    specialties: [
      "Aquatic Therapy",
      "Adaptive Swimming",
      "Pool Accessibility Training",
    ],
    description:
      "Specialized aquatic rehabilitation with adaptive swimming programs and accessible pool facilities.",
  },
  {
    name: "Caltech Student Health Center - Adaptive Services",
    address: "1200 E California Blvd, Pasadena, CA 91125",
    phone: "(626) 395-8331",
    specialties: [
      "Student Athlete Support",
      "Adaptive Technology",
      "Peer Mentoring",
    ],
    description:
      "University-based center focusing on adaptive technology and peer support for student athletes.",
  },
];

const generateMockCenters = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const center = pasadenaRehabCenters[i % pasadenaRehabCenters.length];

    return {
      id: `center-${i + 1}`,
      name: center.name,
      address: center.address,
      phone: center.phone,
      rating: (4.2 + Math.random() * 0.7).toFixed(1), // 4.2-4.9 rating
      reviewsCount: Math.floor(Math.random() * 80) + 25, // 25-105 reviews
      distance: (Math.random() * 8 + 0.5).toFixed(1), // 0.5-8.5 miles from Pasadena
      image:
        "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1200&q=80&auto=format&fit=crop",
      specialties: center.specialties,
      description: center.description,
      accessibility: {
        wheelchairAccessible: true,
        adaptiveEquipment: true,
        signLanguage: Math.random() > 0.3, // 70% have sign language
        accessibleParking: true,
        elevatorAccess: true,
        accessibleRestrooms: true,
      },
      insurance: [
        "Medicare",
        "Medicaid",
        "Blue Cross Blue Shield",
        "Aetna",
        "Kaiser Permanente",
        "Cigna",
      ],
      hours: {
        monday: "7:00 AM - 7:00 PM",
        tuesday: "7:00 AM - 7:00 PM",
        wednesday: "7:00 AM - 7:00 PM",
        thursday: "7:00 AM - 7:00 PM",
        friday: "7:00 AM - 6:00 PM",
        saturday: "8:00 AM - 4:00 PM",
        sunday: "Closed",
      },
      researchParticipant: Math.random() > 0.4, // 60% participate in research
      navigatorPartnership: Math.random() > 0.5, // 50% have navigator partnerships
    };
  });
};

// Pasadena adaptive sports medicine specialists
const pasadenaDoctors = [
  {
    name: "Dr. Sarah Chen",
    specialty: "Physical Medicine & Rehabilitation",
    education: "MD, UCLA David Geffen School of Medicine",
    bio: "Specializes in spinal cord injury rehabilitation and adaptive sports medicine. Lead researcher in wheelchair athletics performance.",
    experience: 12,
    languages: ["English", "Mandarin", "Spanish"],
  },
  {
    name: "Dr. Michael Rodriguez",
    specialty: "Orthopedic Surgery - Adaptive Sports",
    education: "MD, USC Keck School of Medicine",
    bio: "Expert in prosthetic fitting for athletes and adaptive equipment design. Former Paralympic team physician.",
    experience: 15,
    languages: ["English", "Spanish"],
  },
  {
    name: "Dr. Jennifer Kim",
    specialty: "Sports Psychology & Adaptive Athletics",
    education: "PhD, Stanford University",
    bio: "Focuses on confidence building and mental health support for adaptive athletes. Research in participation barriers.",
    experience: 8,
    languages: ["English", "Korean"],
  },
  {
    name: "Dr. David Thompson",
    specialty: "Neurology & Adaptive Sports",
    education: "MD, Caltech/UCLA Joint Medical Program",
    bio: "Neurological rehabilitation specialist with focus on adaptive technology and brain-computer interfaces for sports.",
    experience: 10,
    languages: ["English", "French"],
  },
  {
    name: "Dr. Lisa Patel",
    specialty: "Occupational Therapy & Equipment Specialist",
    education: "OTD, USC Chan Division of Occupational Science",
    bio: "Equipment assessment and training specialist. Leads the Pasadena Adaptive Equipment Loan Program.",
    experience: 7,
    languages: ["English", "Hindi", "Spanish"],
  },
];

const generateMockDoctors = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const doctor = pasadenaDoctors[i % pasadenaDoctors.length];

    return {
      id: `doctor-${i + 1}`,
      name: doctor.name,
      specialty: doctor.specialty,
      rating: (4.3 + Math.random() * 0.6).toFixed(1), // 4.3-4.9 rating
      reviewsCount: Math.floor(Math.random() * 60) + 15, // 15-75 reviews
      experience: `${doctor.experience} years`,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&auto=format",
      education: doctor.education,
      certifications: [
        "Board Certified",
        "Adaptive Sports Medicine Certified",
        "Paralympic Medical Classification",
        "Assistive Technology Professional",
      ],
      languages: doctor.languages,
      bio: doctor.bio,
      researchFocus: [
        "Adaptive Sports Performance",
        "Equipment Innovation",
        "Participation Barriers",
        "Confidence Building",
        "Community Integration",
      ][i % 5],
      acceptsNewPatients: Math.random() > 0.2, // 80% accepting new patients
      telehealth: Math.random() > 0.3, // 70% offer telehealth
    };
  });
};

// Rehabilitation centers and doctors API calls
export const rehabilitationApi = {
  // Get rehabilitation centers list
  rehabilitationCenterList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const centers = generateMockCenters(10);

    return {
      success: true,
      data: {
        items: centers,
        total: 25,
        page: data.page || 1,
        limit: 10,
        totalPages: 3,
      },
    };
  },

  // Get center detail
  centerDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const center = generateMockCenters(1)[0];
    center.id = data.centerId;

    // Add more detailed information
    const detailedCenter = {
      ...center,
      description:
        "A leading rehabilitation center specializing in adaptive sports and inclusive fitness programs.",
      services: [
        "Physical Therapy",
        "Occupational Therapy",
        "Adaptive Sports Training",
        "Equipment Fitting",
        "Mobility Assessment",
      ],
      facilities: [
        "Accessible Gym",
        "Therapy Pool",
        "Adaptive Equipment Room",
        "Consultation Rooms",
        "Parking",
      ],
      insurance: ["Medicare", "Medicaid", "Blue Cross", "Aetna", "Kaiser"],
      doctors: generateMockDoctors(3),
    };

    return {
      success: true,
      data: detailedCenter,
    };
  },

  // Get doctors list
  doctorList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const doctors = generateMockDoctors(8);

    return {
      success: true,
      data: {
        items: doctors,
        total: 20,
        page: data.page || 1,
        limit: 10,
        totalPages: 2,
      },
    };
  },

  // Get doctor detail
  doctorDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const doctor = generateMockDoctors(1)[0];
    doctor.id = data.doctorId;

    // Add more detailed information
    const detailedDoctor = {
      ...doctor,
      schedule: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 3:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 4:00 PM",
      },
      locations: [
        "Adaptive Rehabilitation Center 1",
        "Pasadena Sports Medicine Clinic",
      ],
      reviews: Array.from({ length: 5 }, (_, i) => ({
        id: `review-${i + 1}`,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: `Dr. ${doctor.name.split(" ")[1]} is excellent! Very knowledgeable about adaptive sports.`,
        author: `Patient ${i + 1}`,
        date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })),
    };

    return {
      success: true,
      data: detailedDoctor,
    };
  },

  // Get science popularization list
  scienceList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    // Research-focused educational articles for Pasadena adaptive sports
    const researchArticles = [
      {
        title: "Breaking Down Transportation Barriers in Pasadena",
        summary:
          "Research findings on how accessible transit options impact adaptive sports participation rates in the Pasadena area.",
        author: "Dr. Sarah Chen",
        category: "Transportation",
        researchBased: true,
      },
      {
        title:
          "Equipment Grants: Reducing Financial Barriers to Adaptive Sports",
        summary:
          "Study on how equipment loan programs and grants increase participation and confidence among new adaptive athletes.",
        author: "Dr. Michael Rodriguez",
        category: "Equipment",
        researchBased: true,
      },
      {
        title: "The Role of Sport Navigators in Building Confidence",
        summary:
          "Mixed-methods research on how peer mentorship and navigation services impact athlete confidence and long-term participation.",
        author: "Dr. Jennifer Kim",
        category: "Mentorship",
        researchBased: true,
      },
      {
        title: "Healthcare Integration in Adaptive Sports Programs",
        summary:
          "Analysis of how coordinated healthcare support reduces fragmentation and improves athlete outcomes in Pasadena.",
        author: "Dr. David Thompson",
        category: "Healthcare",
        researchBased: true,
      },
      {
        title: "Digital Platforms and Knowledge Access for Adaptive Athletes",
        summary:
          "Research on how mobile apps and digital resources address information gaps in the adaptive sports community.",
        author: "Dr. Lisa Patel",
        category: "Technology",
        researchBased: true,
      },
    ];

    const articles = Array.from({ length: 8 }, (_, i) => {
      const article = researchArticles[i % researchArticles.length];

      return {
        id: `article-${i + 1}`,
        title: article.title,
        summary: article.summary,
        content: `Research-based content about ${article.category.toLowerCase()} in adaptive sports...`,
        image:
          "https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1200&q=80&auto=format&fit=crop",
        author: article.author,
        category: article.category,
        readTime: `${4 + Math.floor(Math.random() * 6)} min read`,
        publishedAt: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
        ).toISOString(),
        tags: ["research", "pasadena-adaptive", article.category.toLowerCase()],
        researchBased: article.researchBased,
        studyType: [
          "Mixed-Methods",
          "Quantitative",
          "Qualitative",
          "Longitudinal",
        ][Math.floor(Math.random() * 4)],
        participantCount: Math.floor(Math.random() * 200) + 50, // 50-250 participants
      };
    });

    return {
      success: true,
      data: {
        items: articles,
        total: 50,
        page: data.page || 1,
        limit: 10,
        totalPages: 5,
      },
    };
  },

  // Get science detail
  scienceDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    return {
      success: true,
      data: {
        id: data.articleId,
        title: "Understanding Adaptive Sports Equipment",
        content: `
          <h2>Introduction to Adaptive Sports Equipment</h2>
          <p>Adaptive sports equipment has revolutionized the way athletes with disabilities participate in competitive and recreational sports...</p>
          
          <h3>Types of Equipment</h3>
          <ul>
            <li>Racing wheelchairs</li>
            <li>Prosthetic limbs for sports</li>
            <li>Adaptive skiing equipment</li>
            <li>Modified sports balls and implements</li>
          </ul>
          
          <h3>Choosing the Right Equipment</h3>
          <p>When selecting adaptive sports equipment, consider factors such as your sport of choice, level of competition, and personal preferences...</p>
        `,
        author: "Dr. Sarah Johnson",
        publishedAt: "2024-01-15T10:00:00Z",
        readTime: "5 min read",
        tags: ["adaptive-sports", "equipment", "guide"],
        relatedArticles: [
          { id: "article-2", title: "Training Tips for Adaptive Athletes" },
          { id: "article-3", title: "Nutrition for Peak Performance" },
        ],
      },
    };
  },

  // Get science categories
  scienceCategoryList: async (): Promise<IResponseData> => {
    await mockDelay(400);

    return {
      success: true,
      data: [
        { id: "1", name: "Equipment", icon: "🦽", count: 15 },
        { id: "2", name: "Training", icon: "🏋️", count: 22 },
        { id: "3", name: "Nutrition", icon: "🥗", count: 8 },
        { id: "4", name: "Recovery", icon: "😴", count: 12 },
        { id: "5", name: "Mental Health", icon: "🧠", count: 6 },
      ],
    };
  },
};

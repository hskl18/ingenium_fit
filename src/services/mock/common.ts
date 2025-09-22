import type { IResponseData } from '../types';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Common API calls
export const commonApi = {
  // Location services
  locationCity: async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    await mockDelay();

    // Mock location data for Pasadena area
    return {
      results: [
        {
          formatted_address: 'Pasadena, CA, USA',
          address_components: [
            {
              long_name: 'Pasadena',
              short_name: 'Pasadena',
              types: ['locality'],
            },
            {
              long_name: 'California',
              short_name: 'CA',
              types: ['administrative_area_level_1'],
            },
            {
              long_name: 'United States',
              short_name: 'US',
              types: ['country'],
            },
          ],
          geometry: {
            location: { lat: latitude, lng: longitude },
          },
        },
      ],
      status: 'OK',
    };
  },

  // SMS and email services
  sendEmailSmsCode: async (data: any): Promise<IResponseData> => {
    await mockDelay(1000);

    return {
      success: true,
      message: 'Verification code sent to email successfully',
    };
  },

  sendPhoneSmsCode: async (data: any): Promise<IResponseData> => {
    await mockDelay(1000);

    return {
      success: true,
      message: 'Verification code sent to phone successfully',
    };
  },

  // Search terms
  termsList: async (data = {}): Promise<IResponseData> => {
    await mockDelay(400);

    return {
      success: true,
      data: [
        'adaptive sports',
        'wheelchair basketball',
        'inclusive fitness',
        'rehabilitation center',
        'physical therapy',
        'mobility equipment',
        'accessible gym',
        'adaptive training',
      ],
    };
  },

  // Carousel/banners
  carouselList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    return {
      success: true,
      data: [
        {
          id: '1',
          title: 'Welcome to Adaptive Sports Navigator',
          image: 'https://via.placeholder.com/800x400?text=Welcome+Banner',
          link: '/showcase',
        },
        {
          id: '2',
          title: 'Find Your Local Rehabilitation Center',
          image: 'https://via.placeholder.com/800x400?text=Rehab+Centers',
          link: '/rehabilitation',
        },
        {
          id: '3',
          title: 'Connect with Sport Navigators',
          image: 'https://via.placeholder.com/800x400?text=Navigators',
          link: '/navigators',
        },
      ],
    };
  },

  carouselDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    return {
      success: true,
      data: {
        id: data.id,
        title: 'Carousel Item Detail',
        description: 'Detailed information about this carousel item.',
        image: `https://via.placeholder.com/800x600?text=Detail+${data.id}`,
      },
    };
  },

  // Comments
  commentList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const comments = Array.from({ length: 5 }, (_, i) => ({
      id: `comment-${i + 1}`,
      content: `This is a great post! Thanks for sharing your experience. #${i + 1}`,
      author: {
        id: `user-${i + 1}`,
        nickname: `Commenter ${i + 1}`,
        avatar: `https://via.placeholder.com/40?text=C${i + 1}`,
      },
      createdAt: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      ).toISOString(),
      likesCount: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.5,
    }));

    return {
      success: true,
      data: {
        items: comments,
        total: 15,
        page: data.page || 1,
        limit: 10,
        totalPages: 2,
      },
    };
  },

  addComment: async (data: any): Promise<IResponseData> => {
    await mockDelay(800);

    return {
      success: true,
      message: 'Comment added successfully',
      data: {
        id: `comment-${Date.now()}`,
        content: data.content,
        createdAt: new Date().toISOString(),
      },
    };
  },

  addCommentReply: async (data: any): Promise<IResponseData> => {
    await mockDelay(800);

    return {
      success: true,
      message: 'Reply added successfully',
      data: {
        id: `reply-${Date.now()}`,
        content: data.content,
        createdAt: new Date().toISOString(),
      },
    };
  },

  // Favorites
  favorite: async (data: any): Promise<IResponseData> => {
    await mockDelay(500);

    return {
      success: true,
      message: data.isFavorited
        ? 'Removed from favorites'
        : 'Added to favorites',
      data: {
        isFavorited: !data.isFavorited,
      },
    };
  },

  favoriteList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const favorites = Array.from({ length: 8 }, (_, i) => ({
      id: `favorite-${i + 1}`,
      title: `Favorite Item ${i + 1}`,
      type: ['post', 'center', 'doctor'][Math.floor(Math.random() * 3)],
      image: `https://via.placeholder.com/200x150?text=Fav+${i + 1}`,
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }));

    return {
      success: true,
      data: {
        items: favorites,
        total: 25,
        page: data.page || 1,
        limit: 10,
        totalPages: 3,
      },
    };
  },

  // FAQ
  faqsList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const faqs = [
      {
        id: '1',
        question: 'How do I find adaptive sports programs near me?',
        answer:
          'Use our program finder to filter by location, sport type, and accessibility features. You can also connect with a sport navigator for personalized recommendations.',
      },
      {
        id: '2',
        question: 'What equipment do I need to get started?',
        answer:
          'Equipment needs vary by sport and individual requirements. Our equipment guide and navigator consultations can help you find the right gear and funding options.',
      },
      {
        id: '3',
        question: 'How do I connect with other adaptive athletes?',
        answer:
          'Join our community feed to share experiences, ask questions, and connect with athletes in your area. You can also attend local events and workshops.',
      },
      {
        id: '4',
        question: 'Are the rehabilitation centers vetted?',
        answer:
          'Yes, all centers in our network are reviewed by adaptive athletes and sport navigators. You can read reviews and ratings from the community.',
      },
    ];

    return {
      success: true,
      data: {
        items: faqs,
        total: faqs.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  // Agreements
  agreementByCode: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const agreements = {
      'user-terms': {
        title: 'User Agreement',
        content: 'This is the user agreement content...',
      },
      'privacy-policy': {
        title: 'Privacy Policy',
        content: 'This is the privacy policy content...',
      },
      'platform-agreement': {
        title: 'Platform Agreement',
        content: 'This is the platform agreement content...',
      },
    };

    return {
      success: true,
      data: agreements[data.code as keyof typeof agreements] || {
        title: 'Agreement',
        content: 'Agreement content not found.',
      },
    };
  },
};

// Pasadena-specific content for the research app (demo data used as fallbacks)
export const pasadenaPrograms = [
  {
    id: "1",
    name: "Rose Bowl Adaptive Swimming",
    location: "Rose Bowl Aquatics Center",
    address: "1001 W California Blvd, Pasadena, CA 91105",
    description: "Weekly adaptive swimming sessions with certified instructors",
    schedule: "Tuesdays & Thursdays, 6:00-8:00 PM",
  },
  {
    id: "2",
    name: "PCC Wheelchair Basketball",
    location: "Pasadena City College Gymnasium",
    address: "1570 E Colorado Blvd, Pasadena, CA 91106",
    description: "Competitive and recreational wheelchair basketball",
    schedule: "Saturdays, 2:00-4:00 PM",
  },
];

export const pasadenaRehabCenters = [
  {
    id: "1",
    name: "Huntington Hospital Rehabilitation Services",
    address: "100 W California Blvd, Pasadena, CA 91105",
    phone: "(626) 397-5000",
    // Fields used by UI components
    coverImage:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&q=80&auto=format&fit=crop",
    star: 4.7,
    commentNum: 128,
    whetherFavoriteByLoginUser: false,
    accessibleHighlights: [
      "Wheelchair Access",
      "Elevator",
      "Accessible Restroom",
    ],
  },
  {
    id: "2",
    name: "Casa Colina Hospital",
    address: "255 E Bonita Ave, Pomona, CA 91767",
    phone: "(909) 596-7733",
    coverImage:
      "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200&q=80&auto=format&fit=crop",
    star: 4.8,
    commentNum: 203,
    whetherFavoriteByLoginUser: true,
    accessibleHighlights: ["Ramp", "Assistive Listening", "Valet Drop-off"],
  },
];

export const pasadenaKnowledgeSpotlights = [
  {
    id: "1",
    title: "Metro Gold Line Accessibility Guide",
    description: "Complete guide to accessible transit in Pasadena",
    category: "Transportation",
    coverImage:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop",
    createTime: Date.now(),
  },
  {
    id: "2",
    title: "Equipment Grant Applications",
    description: "How to apply for adaptive sports equipment funding",
    category: "Equipment",
    coverImage:
      "https://images.unsplash.com/photo-1576765608568-8ed91a7e59ad?w=1200&q=80&auto=format&fit=crop",
    createTime: Date.now(),
  },
];

// Additional demo content used by Home screen
export const navigatorQuickActions = [
  {
    id: "qa-1",
    title: "Schedule a Navigator Call",
    description: "Book a 15 minute intro with a sport navigator",
    icon: "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&q=80&auto=format&fit=crop",
    // in-app navigation handled in Home screen
  },
  {
    id: "qa-2",
    title: "Find Accessible Programs",
    description: "Browse curated adaptive sport options near you",
    icon: "https://images.unsplash.com/photo-1514512364185-4c2b3b9172c8?w=800&q=80&auto=format&fit=crop",
    // in-app navigation handled in Home screen
  },
  {
    id: "qa-3",
    title: "Transit Companion",
    description: "Plan a trip with accessible transfers and support",
    icon: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80&auto=format&fit=crop",
    // in-app navigation handled in Home screen
  },
];

export const navigatorWorkflow = [
  {
    id: "wf-1",
    title: "Tell us your goals",
    description: "Share confidence benchmarks and movement preferences",
  },
  {
    id: "wf-2",
    title: "Match with a navigator",
    description: "We pair you with a trained Pasadena sport navigator",
  },
  {
    id: "wf-3",
    title: "Build your plan",
    description: "Get a tailored plan for programs and transport",
  },
  {
    id: "wf-4",
    title: "Start and iterate",
    description: "Begin, track progress, and adjust with your navigator",
  },
];

export const navigatorSpotlights = [
  {
    id: "ns-1",
    badge: "Equipment",
    title: "Try a loaner handcycle",
    description: "Local partners offer short-term equipment loans",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop",
    // removed external link
  },
  {
    id: "ns-2",
    badge: "Transit",
    title: "On-demand ride pilots",
    description: "Explore lift-equipped ride options for program days",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop",
    // removed external link
  },
];

export const pasadenaCarousels = [
  {
    id: "c1",
    image:
      "https://images.unsplash.com/photo-1520975922284-9bcd3a3ba87f?w=1600&q=80&auto=format&fit=crop",
    type: 1,
    // no external link; will open in-app detail
  },
  {
    id: "c2",
    image:
      "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1600&q=80&auto=format&fit=crop",
    type: 1,
    // no external link; will open in-app detail
  },
  {
    id: "c3",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1600&q=80&auto=format&fit=crop",
    type: 1,
    // no external link; will open in-app detail
  },
];

export const pasadenaCategories = [
  {
    id: "cat-1",
    name: "Wheelchair Basketball",
    icon: "https://images.unsplash.com/photo-1521417531830-20fbd8d9be2e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "cat-2",
    name: "Swimming",
    icon: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "cat-3",
    name: "Handcycling",
    icon: "https://images.unsplash.com/photo-1448969607083-5e7e1a23a3cb?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "cat-4",
    name: "Track & Field",
    icon: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "cat-5",
    name: "Climbing",
    icon: "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "cat-6",
    name: "Tennis",
    icon: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80&auto=format&fit=crop",
  },
];

export const pasadenaCommunityHighlights = [
  {
    id: "ph-1",
    content: "First handcycle session on the Arroyo trail!",
    pictures:
      "https://images.unsplash.com/photo-1521417531830-20fbd8d9be2e?w=1200&q=80&auto=format&fit=crop",
    videos: "",
    createTime: Date.now(),
    likesNum: 12,
    whetherGiveLikeByLoginUser: false,
    user: {
      nickName: "Alex",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80&auto=format&fit=crop",
    },
  },
  {
    id: "ph-2",
    content: "Wheelchair basketball pickup tonight was packed and fun",
    pictures:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80&auto=format&fit=crop",
    videos: "",
    createTime: Date.now(),
    likesNum: 38,
    whetherGiveLikeByLoginUser: true,
    user: {
      nickName: "Jamie",
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&q=80&auto=format&fit=crop",
    },
  },
  {
    id: "ph-3",
    content: "Adaptive swim meet this weekend – see you there!",
    pictures:
      "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1200&q=80&auto=format&fit=crop",
    videos: "",
    createTime: Date.now(),
    likesNum: 7,
    whetherGiveLikeByLoginUser: false,
    user: {
      nickName: "Sam",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop",
    },
  },
];

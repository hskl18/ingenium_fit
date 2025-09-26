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
    coverImage:
      "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqyH3n8tgCozI-S1JPGsfm5jZzvuZZVoPPjS_INWi8jqgJSeMGQ9-BqlmXJT836oZDI81ckKCUvP02FaT6LPNzCs5HfSC1qEjBubCImL3T871--vSRnXR9g4L2Aw06EA3j8BctLVQ=s1360-w1360-h1020-rw",
    star: 4.7,
    commentNum: 128,
    isFavorited: false,
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
      "https://lh3.googleusercontent.com/p/AF1QipOcC4R1TLe9M5R3-4QeCfa3nFVGtpIJI8eSOZwC=s1360-w1360-h1020-rw",
    star: 4.8,
    commentNum: 203,
    isFavorited: true,
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
      "https://cdn.beta.metro.net/wp-content/uploads/2021/05/04232857/feature-eastside-extension-2.jpeg",
    createTime: Date.now(),
  },
  {
    id: "2",
    title: "Equipment Grant Applications",
    description: "How to apply for adaptive sports equipment funding",
    category: "Equipment",
    coverImage:
      "https://www.stopwaste.org/sites/default/files/San%20Lorenzo%20Family%20Help%20Center_Stop%20Waste-6471_0.jpg",
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
    icon: "https://accessibleicon.org/img/icon-iso-design-standardization.jpg",
  },
  {
    id: "qa-3",
    title: "Transit Companion",
    description: "Plan a trip with accessible transfers and support",
    icon: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80&auto=format&fit=crop",
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
      "https://carouselhistory.com/wp-content/uploads/2016/05/Belmont-Looff-armored-carousel-horse-restored-running-horse-studio-2016.jpg",
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
      "https://www.pasadenanow.com/weekendr/wp-content/uploads/2025/04/Carnival-Booths-fotor-2025040561552.png",
    type: 1,
    // no external link; will open in-app detail
  },
];

export const pasadenaCategories = [
  {
    id: "cat-1",
    name: "Wheelchair Basketball",
    icon: "https://cdn.prod.website-files.com/66a7ad387e177bc7c659bb45/66fd3ffca42a3926b064ffe5_66c5e4a95534c294675edf7d_20211205_FRA-GER__iwbf_FotoSteffieWunderl_0001.jpg",
  },
  {
    id: "cat-2",
    name: "Swimming",
    icon: "https://images.theconversation.com/files/371465/original/file-20201126-15-1h1jzzy.jpg?ixlib=rb-4.1.0&rect=0,394,3872,1935&q=45&auto=format&w=1356&h=668&fit=crop",
  },
  {
    id: "cat-3",
    name: "Handcycling",
    icon: "https://www.tineli.co.nz/assets/Tineli-Sponsorship-Ambassador-Jonathan-Jono-Nelson-Hand-Cycling-Jono-Nelson-for-TINELI-Screen-Res-050-0600-min__ResizedImageWzYwMCw0MDBd.jpg",
  },
  {
    id: "cat-4",
    name: "Track & Field",
    icon: "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_lg/f_auto/primary/hiuf5ahd3cbhr11q6m5m",
  },
  {
    id: "cat-5",
    name: "Climbing",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnhIRM5b2s11qJDDXaBfIIduFydkYup0PJyA&s",
  },
  {
    id: "cat-6",
    name: "Tennis",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ49hzpYxQxtJXH7UHOwRM0BxAi_QjPnHZ5yw&s",
  },
];

export const pasadenaCommunityHighlights = [
  {
    id: "ph-1",
    content: "First handcycle session on the Arroyo trail!",
    pictures:
      "https://myrgv.com/wp-content/uploads/2023/04/03242023_Hiker_Biker-Emergency-Location-Signs_5.jpg",
    image:
      "https://myrgv.com/wp-content/uploads/2023/04/03242023_Hiker_Biker-Emergency-Location-Signs_5.jpg",
    videos: "",
    createTime: Date.now(),
    likesNum: 12,
    isLiked: false,
    user: {
      nickName: "Alex",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSET7-hhlSFcFFA37UFyf0ff4pRf8priXXnDA&s",
    },
  },
  {
    id: "ph-2",
    content: "Wheelchair basketball pickup tonight was packed and fun",
    pictures:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRorszwXJ5FUJkTz6ULeq2dMmLAHfWMdeVMEQ&s",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRorszwXJ5FUJkTz6ULeq2dMmLAHfWMdeVMEQ&s",
    videos: "",
    createTime: Date.now(),
    likesNum: 38,
    isLiked: true,
    user: {
      nickName: "Jamie",
      avatar: "https://www.svgrepo.com/show/9907/male-avatar.svg",
    },
  },
  {
    id: "ph-3",
    content: "Adaptive swim meet this weekend – see you there!",
    pictures:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7UrMwrWYvGP0ntUqHl76_3JIt0loyPIIiaw&s",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7UrMwrWYvGP0ntUqHl76_3JIt0loyPIIiaw&s",
    videos: "",
    createTime: Date.now(),
    likesNum: 7,
    isLiked: false,
    user: {
      nickName: "Sam",
      avatar:
        "https://www.svgrepo.com/show/382105/male-avatar-boy-face-man-user-5.svg",
    },
  },
];

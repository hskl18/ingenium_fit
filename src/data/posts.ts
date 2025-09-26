export interface PostTemplate {
  id: string;
  title: string;
  content: string;
  location: string;
  category: string;
  images: string[];
  videos?: string[];
  tags?: string[];
  confidenceBoost?: boolean;
}

export interface AuthorTemplate {
  id: string;
  name: string;
  nickname: string;
  sport: string;
  avatar: string;
  isNavigator?: boolean;
}

export const pasadenaPostTemplates: PostTemplate[] = [
  {
    id: "post-rose-bowl-swim",
    title: "Amazing session at Rose Bowl Aquatics!",
    content:
      "Just finished my weekly adaptive swimming at Rose Bowl Aquatics Center. The new pool lift makes transfers so much easier! Shoutout to Coach Sarah for the technique tips.",
    location: "Rose Bowl Aquatics Center",
    category: "Training",
    images: [
      "https://rosebowlaquatics.org/files/_cache/ffcab83e8d1aac093f2ab486ff7aef5d.png",
      "https://rosebowlaquatics.org/files/_cache/ffcab83e8d1aac093f2ab486ff7aef5d.png",
    ],
    tags: ["#PasadenaAdaptive", "#Swimming", "#ConfidenceBoost"],
    confidenceBoost: true,
  },
  {
    id: "post-basketball-tryouts",
    title: "Wheelchair basketball tryouts this weekend",
    content:
      "Pasadena Adaptive Basketball is holding tryouts at PCC Gymnasium this Saturday 2pm. All skill levels welcome! Loaner chairs available for newcomers.",
    location: "Pasadena City College",
    category: "Community",
    images: [
      "https://s3.us-east-2.amazonaws.com/assets.turnstone.org/uploads/Pages/Sports/_1280xAUTO_fit_center-center_none/64-NKMS1802.jpg?v=1712254262",
      "https://s3.us-east-2.amazonaws.com/assets.turnstone.org/uploads/Pages/Sports/_1280xAUTO_fit_center-center_none/64-NKMS1802.jpg?v=1712254262",
    ],
    tags: ["#PasadenaAdaptive", "#Basketball", "#Community"],
  },
  {
    id: "post-grant-approval",
    title: "New racing chair grant available!",
    content:
      "Just got approved for the Pasadena Adaptive Sports Equipment Grant! $2,500 toward a new racing wheelchair. Happy to help others with the application process.",
    location: "Pasadena, CA",
    category: "Equipment",
    images: [
      "https://ainsleysangels.org/wp-content/uploads/2023/10/ADP-1.webp",
      "https://ainsleysangels.org/wp-content/uploads/2023/10/ADP-1.webp",
    ],
    tags: ["#PasadenaAdaptive", "#Equipment", "#Grants"],
  },
  {
    id: "post-metro-tips",
    title: "Accessible Metro Gold Line tips",
    content:
      "Pro tip for getting to sports venues: The Gold Line to Memorial Park station is fully accessible and only two blocks from the Rose Bowl. Much easier than parking!",
    location: "Memorial Park Station",
    category: "Transportation",
    images: [
      "https://wheelchairtraveling.com/wp-content/gallery/la-area-metro/metro_pasadena_1.jpg",
      "https://wheelchairtraveling.com/wp-content/gallery/la-area-metro/metro_pasadena_1.jpg",
    ],
    tags: ["#PasadenaAdaptive", "#Transit", "#Tips"],
  },
  {
    id: "post-cycling-group",
    title: "Adaptive cycling group ride tomorrow",
    content:
      "Weekly Pasadena Adaptive Cycling group meets at Brookside Park 9am Sundays. Hand cycles and recumbent bikes available to borrow. Beautiful Arroyo Seco route!",
    location: "Brookside Park",
    category: "Community",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUlKJ7h8P4WmpJyTTP9AZ-Q_-C8swB2sVpYA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUlKJ7h8P4WmpJyTTP9AZ-Q_-C8swB2sVpYA&s",
    ],
    tags: ["#PasadenaAdaptive", "#Cycling", "#Community"],
  },
  {
    id: "post-accessible-yoga",
    title: "Sunrise accessible yoga on the bluff",
    content:
      "Join the adaptive yoga meetup at Linda Vista Park this Sunday. Gentle stretches, chair-based flows, and post-class tea with the crew.",
    location: "Linda Vista Park",
    category: "Wellness",
    images: [
      "https://www.ernstandhaas.com/images/blog/YOga.jpg",
      "https://www.ernstandhaas.com/images/blog/YOga.jpg",
    ],
    tags: ["#PasadenaAdaptive", "#Yoga", "#Wellness"],
    confidenceBoost: true,
  },
  {
    id: "post-track-meet",
    title: "Adaptive track meet volunteers needed",
    content:
      "Looking for timers and cheer leaders for this weekend's adaptive track meet at John Muir High. DM if you can help or want to race!",
    location: "John Muir High School",
    category: "Community",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSprsuTeduBtNAM0ndIV9qQmV90S0FuQv9xfQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSprsuTeduBtNAM0ndIV9qQmV90S0FuQv9xfQ&s",
    ],
    tags: ["#PasadenaAdaptive", "#Track", "#Volunteers"],
  },
];

export const pasadenaAuthorTemplates: AuthorTemplate[] = [
  {
    id: "user-maria",
    name: "Maria Rodriguez",
    nickname: "MariaWheels",
    sport: "Wheelchair Basketball",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    isNavigator: true,
  },
  {
    id: "user-alex",
    name: "Alex Chen",
    nickname: "AlexSwims",
    sport: "Adaptive Swimming",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  },
  {
    id: "user-jordan",
    name: "Jordan Smith",
    nickname: "JordanRaces",
    sport: "Wheelchair Racing",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  },
  {
    id: "user-taylor",
    name: "Taylor Brown",
    nickname: "TaylorCycles",
    sport: "Hand Cycling",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    isNavigator: true,
  },
  {
    id: "user-casey",
    name: "Casey Wilson",
    nickname: "CaseyVolley",
    sport: "Sitting Volleyball",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  },
  {
    id: "user-riley",
    name: "Riley Davis",
    nickname: "RileyRolls",
    sport: "Adaptive Rowing",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  },
  {
    id: "user-quinn",
    name: "Quinn Martinez",
    nickname: "QuinnClimbs",
    sport: "Adaptive Climbing",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
  },
  {
    id: "user-avery",
    name: "Avery Garcia",
    nickname: "AveryTracks",
    sport: "Para Track",
    avatar: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
    isNavigator: false,
  },
];

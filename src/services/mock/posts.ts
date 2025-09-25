import type { IResponseData, Post, GroupedPost } from "../types";

// Mock delay to simulate network requests
const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Pasadena adaptive sports community posts for research study
const pasadenaPosts = [
  {
    title: "Amazing session at Rose Bowl Aquatics!",
    content:
      "Just finished my weekly adaptive swimming at Rose Bowl Aquatics Center. The new pool lift makes transfers so much easier! Shoutout to Coach Sarah for the technique tips. 🏊‍♀️ #PasadenaAdaptive #Swimming",
    location: "Rose Bowl Aquatics Center",
    category: "Training",
  },
  {
    title: "Wheelchair basketball tryouts this weekend",
    content:
      "Pasadena Adaptive Basketball is holding tryouts at PCC Gymnasium this Saturday 2pm. All skill levels welcome! They provide loaner chairs for newcomers. Great way to get into the sport! 🏀",
    location: "Pasadena City College",
    category: "Community",
  },
  {
    title: "New racing chair grant available!",
    content:
      "Just got approved for the Pasadena Adaptive Sports Equipment Grant! $2,500 towards a new racing wheelchair. The application process was straightforward - happy to help others navigate it. 💪",
    location: "Pasadena, CA",
    category: "Equipment",
  },
  {
    title: "Accessible Metro Gold Line tips",
    content:
      "Pro tip for getting to sports venues: The Gold Line to Memorial Park station is fully accessible and only 2 blocks from the Rose Bowl. Much easier than driving and parking! 🚊",
    location: "Memorial Park Station",
    category: "Transportation",
  },
  {
    title: "Adaptive cycling group ride tomorrow",
    content:
      "Weekly Pasadena Adaptive Cycling group meets at Brookside Park 9am Sundays. Hand cycles and recumbent bikes available to borrow. Beautiful route along the Arroyo Seco! 🚴‍♂️",
    location: "Brookside Park",
    category: "Community",
  },
];

const pasadenaAthletes = [
  {
    name: "Maria Rodriguez",
    nickname: "MariaWheels",
    sport: "Wheelchair Basketball",
  },
  { name: "Alex Chen", nickname: "AlexSwims", sport: "Adaptive Swimming" },
  { name: "Jordan Smith", nickname: "JordanRaces", sport: "Wheelchair Racing" },
  { name: "Taylor Brown", nickname: "TaylorCycles", sport: "Hand Cycling" },
  {
    name: "Casey Wilson",
    nickname: "CaseyVolley",
    sport: "Sitting Volleyball",
  },
];

const generateMockPosts = (count: number): Post[] => {
  return Array.from({ length: count }, (_, i) => {
    const postTemplate = pasadenaPosts[i % pasadenaPosts.length];
    const author = pasadenaAthletes[i % pasadenaAthletes.length];

    return {
      id: `post-${i + 1}`,
      title: postTemplate.title,
      content: postTemplate.content,
      images: [
        `https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200&q=80&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80&auto=format&fit=crop`,
      ],
      author: {
        id: `user-${(i % 5) + 1}`,
        nickname: author.nickname,
        name: author.name,
        sport: author.sport,
        avatar: `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces&auto=format`,
        isNavigator: i % 4 === 0, // Every 4th person is a navigator
      },
      location: postTemplate.location,
      likesCount: Math.floor(Math.random() * 50) + 10, // 10-60 likes
      commentsCount: Math.floor(Math.random() * 15) + 2, // 2-17 comments
      sharesCount: Math.floor(Math.random() * 8) + 1, // 1-9 shares
      isLiked: Math.random() > 0.6,
      isFavorited: Math.random() > 0.8,
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      category: postTemplate.category,
      tags: ["#PasadenaAdaptive", `#${postTemplate.category}`, "#IngeniusFit"],
      confidenceBoost: Math.random() > 0.7, // Research metric: posts that boost confidence
    };
  });
};

// Posts and dynamics related API calls
export const postsApi = {
  // Get posts list
  postList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const posts = generateMockPosts(10);

    return {
      success: true,
      data: {
        items: posts,
        total: 100,
        page: data.page || 1,
        limit: 10,
        totalPages: 10,
      },
    };
  },

  // Get post detail
  postDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const post = generateMockPosts(1)[0];
    post.id = data.postId;

    return {
      success: true,
      data: post,
    };
  },

  // Get my posts list
  myPostList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const posts = generateMockPosts(8);

    // Group posts by year-month
    const groupedPosts: { [key: string]: Post[] } = {};

    posts.forEach((post: Post) => {
      const date = new Date(post.createdAt);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!groupedPosts[yearMonth]) {
        groupedPosts[yearMonth] = [];
      }
      groupedPosts[yearMonth].push(post);
    });

    // Convert to the expected format with yearMonth and dynamicsPostList
    const groupedItems: GroupedPost[] = Object.entries(groupedPosts).map(
      ([yearMonth, dynamicsPostList]) => ({
        yearMonth,
        dynamicsPostList,
        id: yearMonth,
      })
    );

    return {
      success: true,
      data: {
        items: groupedItems,
        total: groupedItems.length,
        page: data.page || 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  // Publish post
  publishPost: async (data: any): Promise<IResponseData> => {
    await mockDelay(1200);

    return {
      success: true,
      message: "Post published successfully",
      data: {
        id: `post-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      },
    };
  },

  // Delete post
  deletePost: async (data: any): Promise<IResponseData> => {
    await mockDelay(600);

    return {
      success: true,
      message: "Post deleted successfully",
    };
  },

  // Block/unblock post
  blockPost: async (data: any): Promise<IResponseData> => {
    await mockDelay(500);

    return {
      success: true,
      message: data.isBlocked ? "Post unblocked" : "Post blocked",
    };
  },

  // Forward post
  forwardPost: async (data: any): Promise<IResponseData> => {
    await mockDelay(800);

    return {
      success: true,
      message: "Post shared successfully",
    };
  },

  // Like/unlike post
  toggleLike: async (data: any): Promise<IResponseData> => {
    await mockDelay(400);

    return {
      success: true,
      message: data.isLiked ? "Post unliked" : "Post liked",
      data: {
        isLiked: !data.isLiked,
        likesCount: data.likesCount + (data.isLiked ? -1 : 1),
      },
    };
  },

  // Get dynamics categories
  dynamicsCategoryList: async (data: any): Promise<IResponseData> => {
    await mockDelay(500);

    return {
      success: true,
      data: [
        { id: "1", name: "Training", icon: "🏋️" },
        { id: "2", name: "Equipment", icon: "🦽" },
        { id: "3", name: "Community", icon: "👥" },
        { id: "4", name: "Tips", icon: "💡" },
        { id: "5", name: "Events", icon: "📅" },
      ],
    };
  },
};

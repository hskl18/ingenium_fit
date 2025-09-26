import type { IResponseData, Post, GroupedPost } from "../types";
import {
  pasadenaAuthorTemplates,
  pasadenaPostTemplates,
  type AuthorTemplate,
  type PostTemplate,
} from "@/data/posts";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MY_POST_COUNT = 8;
const TOTAL_POST_COUNT = 100;
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

const DYNAMICS_CATEGORIES = [
  { id: "1", name: "Training", icon: "🏋️" },
  { id: "2", name: "Equipment", icon: "🦽" },
  { id: "3", name: "Community", icon: "👥" },
  { id: "4", name: "Tips", icon: "💡" },
  { id: "5", name: "Events", icon: "📅" },
];

const pasadenaPosts: PostTemplate[] = pasadenaPostTemplates;
const pasadenaAthletes: AuthorTemplate[] = pasadenaAuthorTemplates;

const simulateNetworkDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const chance = (probability: number) => Math.random() < probability;

const getTemplateByIndex = <T>(collection: T[], index: number): T =>
  collection[index % collection.length];

const buildImages = (template: PostTemplate): string[] => {
  const images = [...(template.images ?? [])];
  if (!images.length && template.videos?.length) {
    return [template.videos[0]];
  }

  return images;
};

const createAuthor = (template: AuthorTemplate, index: number): Post["author"] => ({
  id: template.id ?? `user-${(index % pasadenaAthletes.length) + 1}`,
  nickname: template.nickname,
  name: template.name,
  sport: template.sport,
  avatar: template.avatar,
  isNavigator: template.isNavigator ?? index % pasadenaAthletes.length === 0,
});

const getCreatedAtTimestamp = () => {
  const createdAtOffset = Math.random() * SEVEN_DAYS_IN_MS;
  return new Date(Date.now() - createdAtOffset).toISOString();
};

const createPostFromTemplates = (index: number): Post => {
  const postTemplate = getTemplateByIndex(pasadenaPosts, index);
  const authorTemplate = getTemplateByIndex(pasadenaAthletes, index);

  return {
    id: postTemplate.id ?? `post-${index + 1}`,
    title: postTemplate.title,
    content: postTemplate.content,
    images: buildImages(postTemplate),
    videos: postTemplate.videos,
    author: createAuthor(authorTemplate, index),
    location: postTemplate.location,
    likesCount: getRandomInt(10, 60),
    commentsCount: getRandomInt(2, 17),
    sharesCount: getRandomInt(1, 9),
    isLiked: chance(0.4),
    isFavorited: chance(0.2),
    createdAt: getCreatedAtTimestamp(),
    category: postTemplate.category,
    tags: postTemplate.tags ?? ["#PasadenaAdaptive", `#${postTemplate.category}`],
    confidenceBoost: postTemplate.confidenceBoost ?? chance(0.3),
  };
};

const generateMockPosts = (count: number, startIndex = 0): Post[] =>
  Array.from({ length: count }, (_, offset) =>
    createPostFromTemplates(startIndex + offset)
  );

const groupPostsByYearMonth = (posts: Post[]): GroupedPost[] => {
  const grouped = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const date = new Date(post.createdAt);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    acc[yearMonth] ??= [];
    acc[yearMonth].push(post);

    return acc;
  }, {});

  return Object.entries(grouped).map(([yearMonth, dynamicsPostList]) => ({
    id: yearMonth,
    yearMonth,
    dynamicsPostList,
  }));
};

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export const postsApi = {
  postList: async (data: { page?: number; limit?: number } = {}) => {
    await simulateNetworkDelay();

    const page = data.page ?? 1;
    const limit = data.limit ?? DEFAULT_PAGE_SIZE;
    const items = generateMockPosts(limit, (page - 1) * limit);

    return {
      success: true,
      data: {
        items,
        ...buildPagination(page, limit, TOTAL_POST_COUNT),
      },
    } satisfies IResponseData;
  },

  postDetail: async (data: { postId?: string } = {}) => {
    await simulateNetworkDelay();

    const post = createPostFromTemplates(0);

    return {
      success: true,
      data: {
        ...post,
        id: data.postId ?? post.id,
      },
    } satisfies IResponseData;
  },

  myPostList: async (data: { page?: number; limit?: number } = {}) => {
    await simulateNetworkDelay();

    const page = data.page ?? 1;
    const limit = data.limit ?? DEFAULT_PAGE_SIZE;
    const posts = generateMockPosts(DEFAULT_MY_POST_COUNT);
    const groupedItems = groupPostsByYearMonth(posts);

    return {
      success: true,
      data: {
        items: groupedItems,
        ...buildPagination(page, limit, groupedItems.length),
      },
    } satisfies IResponseData;
  },

  publishPost: async (data: Record<string, unknown> = {}) => {
    await simulateNetworkDelay(1200);

    const createdAt = new Date().toISOString();

    return {
      success: true,
      message: "Post published successfully",
      data: {
        id: `post-${Date.now()}`,
        createdAt,
        ...data,
      },
    } satisfies IResponseData;
  },

  deletePost: async () => {
    await simulateNetworkDelay(600);

    return {
      success: true,
      message: "Post deleted successfully",
    } satisfies IResponseData;
  },

  blockPost: async (data: { isBlocked?: boolean } = {}) => {
    await simulateNetworkDelay(500);

    return {
      success: true,
      message: data.isBlocked ? "Post unblocked" : "Post blocked",
    } satisfies IResponseData;
  },

  forwardPost: async () => {
    await simulateNetworkDelay(800);

    return {
      success: true,
      message: "Post shared successfully",
    } satisfies IResponseData;
  },

  toggleLike: async (data: { isLiked?: boolean; likesCount?: number } = {}) => {
    await simulateNetworkDelay(400);

    const isLiked = Boolean(data?.isLiked);
    const likesCount = data?.likesCount ?? 0;

    return {
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      data: {
        isLiked: !isLiked,
        likesCount: likesCount + (isLiked ? -1 : 1),
      },
    } satisfies IResponseData;
  },

  dynamicsCategoryList: async () => {
    await simulateNetworkDelay(500);

    return {
      success: true,
      data: DYNAMICS_CATEGORIES,
    } satisfies IResponseData;
  },
};

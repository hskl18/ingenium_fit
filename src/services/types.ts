// Common API response types
export interface IResponseData<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: number;
}

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  avatar?: string;
  phoneNumber?: string;
  introduction?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends IResponseData {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Common data structure types
export interface Post {
  id: string;
  title: string;
  content: string;
  images?: string[];
  videos?: string[];
  author: {
    id: string;
    nickname: string;
    name: string;
    sport?: string;
    avatar: string;
    isNavigator?: boolean;
  };
  location: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  createdAt: string;
  category: string;
  tags?: string[];
  confidenceBoost?: boolean;
}

export interface GroupedPost {
  yearMonth: string;
  dynamicsPostList: Post[];
  id: string;
}

export interface Message {
  id: string;
  title?: string;
  content?: string;
  sketch?: string;
  sendUserId: string;
  userName: string;
  userAvatar?: string;
  createTime: string;
  isRead?: number;
  rows?: Message[];
}

export interface SciencePopularization {
  id: string;
  title: string;
  content: string;
  detailImages?: string[];
  detailVideos?: string[];
  createTime: string;
  commentNum?: number;
  isLiked?: boolean;
  likesNum?: number;
  isFavorited?: boolean;
}

export interface RehabilitationCenter {
  id: string;
  name: string;
  distance: number;
  address: string;
  accessibleHighlights?: string[];
  rating?: number;
  image?: string;
}

export interface UserProfile {
  id: string;
  nickname?: string;
  avatar?: string;
  introduction?: string;
  whetherMutualFollow?: boolean;
  isFollowed?: boolean;
  whetherFollowByUser?: boolean;
}

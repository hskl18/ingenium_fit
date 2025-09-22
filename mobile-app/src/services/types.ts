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
  sortOrder?: 'asc' | 'desc';
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

import type { IResponseData } from "../types";

// Mock delay to simulate network requests
const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data - Pasadena adaptive athlete for research study
const mockUser = {
  id: "1",
  email: "maria.rodriguez@email.com",
  firstName: "Maria",
  lastName: "Rodriguez",
  nickname: "MariaWheels",
  avatar:
    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
  phoneNumber: "+1-626-555-0123",
  introduction:
    "Wheelchair basketball player at Rose Bowl Aquatics Center. Passionate about adaptive sports in Pasadena and helping new athletes find their community.",
  location: "Pasadena, CA",
  disabilities: ["Spinal Cord Injury"],
  sportsInterests: [
    "Wheelchair Basketball",
    "Adaptive Swimming",
    "Hand Cycling",
  ],
  confidenceLevel: 8, // Research metric: 1-10 scale
  participationFrequency: "Weekly",
  transportationNeeds: ["Accessible Transit", "Volunteer Driver"],
  equipmentNeeds: ["Racing Wheelchair", "Pool Transfer Chair"],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",
};

// User related API calls
export const userApi = {
  // Get current user info
  getLoginUser: async (): Promise<IResponseData> => {
    await mockDelay();

    return {
      success: true,
      data: mockUser,
    };
  },

  // Get user profile statistics
  getLoginUserProfile: async (): Promise<IResponseData> => {
    await mockDelay();

    return {
      success: true,
      data: {
        postsCount: 12,
        followersCount: 45,
        followingCount: 23,
        likesCount: 156,
        favoritesCount: 8,
      },
    };
  },

  // Edit user information
  editUserInfo: async (data: any): Promise<IResponseData> => {
    await mockDelay(1000);

    return {
      success: true,
      message: "User information updated successfully",
      data: {
        ...mockUser,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };
  },

  // Follow/unfollow user
  toggleFollow: async (data: any): Promise<IResponseData> => {
    await mockDelay(600);

    return {
      success: true,
      message: data.isFollowed ? "User unfollowed" : "User followed",
      data: {
        isFollowed: !data.isFollowed,
      },
    };
  },

  // Get follow list
  followList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    // Pasadena adaptive sports community members
    const pasadenaAthletes = [
      "Alex Chen - Adaptive Tennis",
      "Jordan Smith - Para Swimming",
      "Sam Johnson - Wheelchair Racing",
      "Taylor Brown - Adaptive Cycling",
      "Casey Wilson - Sitting Volleyball",
      "Riley Davis - Adaptive Rowing",
      "Morgan Lee - Wheelchair Basketball",
      "Avery Garcia - Para Track",
      "Quinn Martinez - Adaptive Climbing",
      "Cameron Thompson - Adaptive Skiing",
    ];

    const mockFollowers = Array.from({ length: 10 }, (_, i) => ({
      id: `user-${i + 1}`,
      nickname: pasadenaAthletes[i].split(" - ")[0],
      sport: pasadenaAthletes[i].split(" - ")[1],
      avatar:
        "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
      location: "Pasadena, CA",
      isFollowing: Math.random() > 0.5,
      isNavigator: i < 3, // First 3 are sport navigators
    }));

    return {
      success: true,
      data: {
        items: mockFollowers,
        total: 45,
        page: data.page || 1,
        limit: 10,
        totalPages: 5,
      },
    };
  },
};

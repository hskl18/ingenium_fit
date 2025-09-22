import type { IResponseData } from '../types';

export interface UploadResponse extends IResponseData {
  data?: {
    url: string;
    filename: string;
  };
}

// Mock delay to simulate network requests
const mockDelay = (ms: number = 2000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock Upload API calls
export const uploadApi = {
  uploadFile: async (data: FormData): Promise<UploadResponse> => {
    await mockDelay(2000); // Simulate upload time

    // Generate mock URL
    const mockUrl = `https://mock-cdn.example.com/uploads/${Date.now()}-mock-file.jpg`;

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: mockUrl,
        filename: 'mock-uploaded-file.jpg',
      },
    };
  },

  uploadImage: async (
    imageUri: string,
    filename?: string,
  ): Promise<UploadResponse> => {
    await mockDelay(1800);

    const mockUrl = `https://mock-cdn.example.com/images/${Date.now()}-${filename || 'image.jpg'}`;

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: mockUrl,
        filename: filename || 'image.jpg',
      },
    };
  },

  uploadVideo: async (
    videoUri: string,
    filename?: string,
  ): Promise<UploadResponse> => {
    await mockDelay(3000); // Videos take longer

    const mockUrl = `https://mock-cdn.example.com/videos/${Date.now()}-${filename || 'video.mp4'}`;

    return {
      success: true,
      message: 'Video uploaded successfully',
      data: {
        url: mockUrl,
        filename: filename || 'video.mp4',
      },
    };
  },
};

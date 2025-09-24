declare module "react-native-image-picker" {
  export interface ImagePickerResponse {
    didCancel?: boolean;
    error?: string;
    assets?: Array<{
      uri?: string;
      width?: number;
      height?: number;
      fileSize?: number;
      type?: string;
      fileName?: string;
      duration?: number;
      bitrate?: number;
      timestamp?: string;
      id?: string;
    }>;
  }

  export interface ImagePickerOptions {
    mediaType: string;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    includeBase64?: boolean;
    storageOptions?: {
      skipBackup?: boolean;
      path?: string;
    };
  }

  export function launchImageLibrary(
    options: ImagePickerOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;

  export function launchCamera(
    options: ImagePickerOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;
}

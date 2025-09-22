import { Platform } from "react-native";

function createStorage() {
  if (Platform.OS === "web") {
    // Simple localStorage wrapper for web
    return {
      getString: (key: string) => localStorage.getItem(key),
      setString: (key: string, value: string) =>
        localStorage.setItem(key, value),
      delete: (key: string) => localStorage.removeItem(key),
    };
  } else {
    try {
      const { MMKV } = require("react-native-mmkv");
      return new MMKV();
    } catch (error) {
      console.warn("MMKV not available, using fallback storage");
      // Fallback to a simple in-memory storage for Expo Go
      const memoryStorage: { [key: string]: string } = {};
      return {
        getString: (key: string) => memoryStorage[key] || null,
        setString: (key: string, value: string) => {
          memoryStorage[key] = value;
        },
        delete: (key: string) => {
          delete memoryStorage[key];
        },
      };
    }
  }
}

// Initialize and export storage
export const storage = createStorage();

import { Platform } from "react-native";

function createStorage() {
  if (Platform.OS === "web") {
    // Simple localStorage wrapper for web
    const ls = (globalThis as any)?.localStorage as
      | {
          getItem: (k: string) => string | null;
          setItem: (k: string, v: string) => void;
          removeItem: (k: string) => void;
        }
      | undefined;
    return {
      getString: (key: string) => (ls ? ls.getItem(key) : null),
      setString: (key: string, value: string) => {
        ls?.setItem(key, value);
      },
      // Alias for compatibility with code using storage.set
      set: (key: string, value: string) => {
        ls?.setItem(key, value);
      },
      delete: (key: string) => {
        ls?.removeItem(key);
      },
    };
  } else {
    const hasTurbo = Boolean((globalThis as any)?.__turboModuleProxy);
    try {
      if (!hasTurbo) {
        throw new Error("TurboModules not enabled; skip MMKV for Expo Go");
      }
      const { MMKV } = require("react-native-mmkv"); // eslint-disable-line @typescript-eslint/no-require-imports
      const instance = new MMKV();
      // Normalize API between MMKV and memory fallback
      if (typeof (instance as any).set !== "function") {
        (instance as any).set = (key: string, value: string) =>
          (instance as any).setString(key, value);
      }
      return instance;
    } catch (error) {
      console.warn("MMKV not available, using fallback storage");
      // Fallback to a simple in-memory storage for Expo Go
      const memoryStorage: { [key: string]: string } = {};
      return {
        getString: (key: string) => memoryStorage[key] || null,
        setString: (key: string, value: string) => {
          memoryStorage[key] = value;
        },
        // Alias for compatibility with code using storage.set
        set: (key: string, value: string) => {
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

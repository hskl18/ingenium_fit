import { storage } from './mmkv-instance';

// Simple storage utilities for demo app
export const StorageUtils = {
  setItem: (key: string, value: any): void => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    storage.set(key, stringValue);
  },

  getItem: <T = string>(key: string): T | null => {
    const value = storage.getString(key);
    if (value === undefined) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },

  removeItem: (key: string): void => {
    storage.delete(key);
  },
};

// Re-export storage instance
export { storage };
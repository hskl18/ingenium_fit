import { MMKV } from 'react-native-mmkv';

// Create a single MMKV instance to avoid circular dependencies
export const storage = new MMKV();

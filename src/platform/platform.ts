import { Platform } from "react-native";

export const isWeb = Platform.OS === "web";
export const isNative = Platform.OS === "ios" || Platform.OS === "android";
export const isExpoGo = Boolean((globalThis as any)?.ExpoGo);

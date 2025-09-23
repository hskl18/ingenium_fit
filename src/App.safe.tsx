import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { LogBox, StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Safe imports with fallbacks
import { ThemeProvider } from "@/theme";
import { storage } from "@/storage";
import { FALLBACK_LOCATION, useLocationStore } from "@/store";
import ApplicationNavigator from "@/navigation/Application";

// Simple test component instead of full navigation
if (__DEV__) {
  // Silence noisy development-only warnings
  LogBox.ignoreLogs([
    "MMKV not available, using fallback storage",
    "Clipboard not available in Expo Go",
    "ImagePicker not available in Expo Go",
    "Geolocation not available in Expo Go",
    "Permissions not available in Expo Go",
    "NitroSound not available in Expo Go",
    "Media console not available in Expo Go",
    "VideoPlayer not available in Expo Go",
    "useAnimations not available in Expo Go",
    "Couldn't load the icon:",
    "[Reanimated] Reading from `value` during component render",
  ]);

  try {
    // Disable Reanimated strict-mode warnings in dev
    configureReanimatedLogger({
      level: ReanimatedLogLevel.error,
      strict: false,
    });
  } catch {}

  // Globally suppress recurring console.warn spam in dev
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const first = args?.[0];
    if (
      typeof first === "string" &&
      (/not available in Expo Go/i.test(first) ||
        /Couldn't load the icon:/i.test(first) ||
        /\[Reanimated\]/i.test(first))
    ) {
      return;
    }
    originalWarn(...args);
  };

  // Reduce noisy logs in dev
  const originalLog = console.log;
  const noisyPatterns = [
    /recommendedSciencesData/i,
    /carouselInfoData/i,
    /postImages/i,
    /hasNextPage/i,
    /selectedIndex/i,
    /progress\.value/i,
    /messageData/i,
    /leaveWordData/i,
  ];
  console.log = (...args: any[]) => {
    const first = args?.[0];
    if (first === false) {
      return;
    }
    if (typeof first === "string" && noisyPatterns.some((p) => p.test(first))) {
      return;
    }
    if (
      args.some(
        (arg) =>
          typeof arg === "string" && noisyPatterns.some((p) => p.test(arg))
      )
    ) {
      return;
    }
    originalLog(...args);
  };
}
function TestApp() {
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    // Pin Pasadena, CA on every launch for the demo
    setLocation(FALLBACK_LOCATION);
    storage.setString(
      "LOCATION",
      JSON.stringify({
        city: "Pasadena, CA",
        coords: { latitude: 34.147785, longitude: -118.144516 },
      })
    );
  }, [setLocation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ApplicationNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
    queries: { retry: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storage={storage}>
        <TestApp />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Safe imports with fallbacks
import { ThemeProvider } from "@/theme";
import { storage } from "@/storage";
import { FALLBACK_LOCATION, useLocationStore } from "@/store";
import ApplicationNavigator from "@/navigation/Application";

// Simple test component instead of full navigation
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

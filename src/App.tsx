import React from "react";
import "react-native-gesture-handler";
// Conditionally import polyfills for native platforms only
if (typeof global !== "undefined" && !global.crypto) {
  try {
    require("react-native-get-random-values");
  } catch (error) {
    console.warn("Crypto polyfill not available in Expo Go");
  }
}
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { StatusBar, Platform } from "react-native";

// Conditionally import BootSplash only on native platforms
let BootSplash: any = null;
if (Platform.OS !== "web") {
  try {
    BootSplash = require("react-native-bootsplash").default;
  } catch (error) {
    console.warn("BootSplash not available in Expo Go");
  }
}

import { storage } from "@/storage";
import { RootSiblingParent } from "react-native-root-siblings";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import { useI18n } from "@/hooks";
import { ThemeProvider } from "@/theme";
import "@/translations";

import { Configs } from "@/common/configs.ts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Conditionally import KeyboardProvider
let KeyboardProvider: any = ({ children }: { children: React.ReactNode }) =>
  children;
if (Platform.OS !== "web") {
  try {
    KeyboardProvider =
      require("react-native-keyboard-controller").KeyboardProvider;
  } catch (error) {
    console.warn("KeyboardProvider not available in Expo Go");
  }
}

import ApplicationNavigator from "@/navigation/Application";
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

function App() {
  const { toggleLanguage } = useI18n();
  useEffect(() => {
    const language = storage.getString(Configs.Language);
    console.log("Language", language || "en-EN (default)");
    if (language) {
      toggleLanguage(language);
    } else {
      // Set default language if none is stored
      toggleLanguage("en-EN");
      storage.set(Configs.Language, "en-EN");
    }

    // Set demo location for the app
    storage.set(
      Configs.Location,
      JSON.stringify({
        city: "Pasadena, CA",
        coords: { latitude: 34.1478, longitude: -118.1445 },
      })
    );

    // Set demo token to bypass auth
    storage.set(Configs.Token, "demo-token");

    // Set demo user info
    storage.set(
      "userInfo",
      JSON.stringify({
        id: "demo-user",
        nickName: "Demo User",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      })
    );
  }, []);
  useEffect(() => {
    const init = async () => {
      if (BootSplash && Platform.OS !== "web") {
        await BootSplash.hide({ fade: true });
        console.log("BootSplash has been hidden successfully");
      }
    };

    init();
  }, []);
  return (
    <RootSiblingParent>
      <StatusBar
        animated
        translucent
        backgroundColor={"#FFFFFF00"}
        barStyle={"dark-content"}
      />
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <ThemeProvider storage={storage}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ApplicationNavigator />
              </GestureHandlerRootView>
            </ThemeProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}

export default App;

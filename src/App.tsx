import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
 Linking } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

import ApplicationNavigator from "@/navigation/Application";
import BootSplash from "@/platform/bootsplash";
import { KeyboardProvider } from "@/platform/keyboard";
import { isExpoGo, isWeb } from "@/platform/platform";

const WebPlaceholder = () => {
  return (
    <View style={styles.webContainer}>
      <View style={styles.webHeader}>
        <Text style={styles.webTitle}>Ingenium Fit (Preview)</Text>
        <Text style={styles.webSubtitle}>
          The full experience is available on iOS and Android. Use the links
          below to open the Expo preview or download the app.
        </Text>
      </View>
      <View style={styles.webActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => Linking.openURL("https://expo.dev/client")}
          style={styles.webButton}
        >
          <Text style={styles.webButtonText}>Get Expo Go</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Linking.openURL("https://expo.dev/@ingenium/ingenium-fit")
          }
          style={[styles.webButton, styles.webButtonSecondary]}
        >
          <Text style={styles.webButtonSecondaryText}>Open Dev Preview</Text>
        </Pressable>
      </View>
      <Text style={styles.webFooter}>
        If you already have Expo Go installed, scan the QR code shown in the
        terminal to launch the mobile app.
      </Text>
    </View>
  );
};

// All imports are static above; no runtime require
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
          "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
      })
    );
  }, [toggleLanguage]);
  useEffect(() => {
    const init = async () => {
      if (BootSplash && Platform.OS !== "web") {
        await BootSplash.hide({ fade: true });
        console.log("BootSplash has been hidden successfully");
      }
    };

    init();
  }, []);
  // Web-specific banner
  return (
    <RootSiblingParent>
      <StatusBar
        animated
        translucent
        backgroundColor={"#FFFFFF00"}
        barStyle={"dark-content"}
      />
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider disabled={isExpoGo}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <ThemeProvider storage={storage}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                {isWeb ? <WebPlaceholder /> : <ApplicationNavigator />}
              </GestureHandlerRootView>
            </ThemeProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    paddingHorizontal: 32,
    paddingTop: 64,
    alignItems: "center",
  },
  webHeader: {
    maxWidth: 640,
    alignItems: "center",
    gap: 16,
  },
  webTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a202c",
    textAlign: "center",
  },
  webSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4a5568",
    textAlign: "center",
  },
  webActions: {
    marginTop: 32,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    gap: 16,
  },
  webButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  webButtonSecondary: {
    backgroundColor: "#e2e8f0",
    shadowOpacity: 0,
  },
  webButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  webButtonSecondaryText: {
    color: "#1a202c",
    fontSize: 16,
    fontWeight: "600",
  },
  webFooter: {
    marginTop: 24,
    fontSize: 14,
    lineHeight: 22,
    color: "#718096",
    textAlign: "center",
    maxWidth: 540,
  },
});

export default App;

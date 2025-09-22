import "react-native-gesture-handler";
import "react-native-get-random-values";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar, Platform, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

function MinimalApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          animated
          translucent
          backgroundColor={"#FFFFFF00"}
          barStyle={"dark-content"}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            App is Working! 🎉
          </Text>
          <Text style={{ fontSize: 16, marginTop: 10 }}>
            Platform: {Platform.OS}
          </Text>
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default MinimalApp;

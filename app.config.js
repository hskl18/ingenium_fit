require("dotenv").config();

export default {
  expo: {
    name: "Ingenium Fit",
    slug: "ingenium-fit",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ingeniumfit.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.ingeniumfit.app",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    plugins: [
      [
        "react-native-bootsplash",
        {
          assetsDir: "assets/bootsplash",
          android: {
            parentTheme: "EdgeToEdge",
          },
        },
      ],
    ],
    scheme: "ingenium-fit",
    extra: {
      openaiApiKey: process.env.openai_api || "",
    },
  },
};

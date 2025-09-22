const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add SVG support
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// Add platform-specific extensions
config.resolver.platforms = ["native", "web", "ios", "android"];

// Add resolver for assets to handle require.context issues
config.resolver.resolverMainFields = ["react-native", "browser", "main"];
config.resolver.alias = {
  "@/assets": "./src/assets",
};

module.exports = config;

import { MD3LightTheme } from "react-native-paper";

// Configure react-native-paper to use @expo/vector-icons
export const paperTheme = {
  ...MD3LightTheme,
  // This tells react-native-paper to use @expo/vector-icons
  // which is already installed in your project
};

// You can also configure specific icon sets if needed
export const iconConfig = {
  // Use MaterialIcons from @expo/vector-icons
  web: {
    className: "material-icons",
  },
  ios: {
    font: "MaterialIcons",
  },
  android: {
    font: "MaterialIcons",
  },
};

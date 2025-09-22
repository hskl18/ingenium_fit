import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

import App from "./src/App.safe";

// Temporarily disabled to fix runtime issues
// if (__DEV__) {
//   require("./src/reactotron.config.ts");
// }

AppRegistry.registerComponent("main", () => App);

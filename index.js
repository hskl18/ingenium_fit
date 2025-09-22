import { AppRegistry } from "react-native";

import App from "./src/App";

if (__DEV__) {
  require("./src/reactotron.config");
}

AppRegistry.registerComponent("main", () => App);

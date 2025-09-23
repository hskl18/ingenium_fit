import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import { AppRegistry, LogBox } from "react-native";

import App from "./src/App.safe";

// Temporarily disabled to fix runtime issues
// if (__DEV__) {
//   require("./src/reactotron.config.ts");
// }

// Silence verbose logs in dev and production while keeping warnings/errors
// Toggle by setting global.__ENABLE_LOGS__ = true in the console if needed
if (typeof global.__ENABLE_LOGS__ === "undefined") {
  // eslint-disable-next-line no-undef
  global.__ENABLE_LOGS__ = false;
}
const noop = () => {};
// Always keep warn/error; quiet log/debug/info/trace unless explicitly enabled
// Devs can re-enable by setting global.__ENABLE_LOGS__ = true in the debugger
// or commenting out the lines below.
// eslint-disable-next-line no-undef
if (!__DEV__ || !global.__ENABLE_LOGS__) {
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.trace = noop;
}
// Reduce LogBox noise during development
if (__DEV__) {
  LogBox.ignoreLogs([
    "Require cycle:",
    "Non-serializable values were found in the navigation state",
  ]);
}

// Global no-op translator to avoid crashes if any legacy t('...') remains
if (typeof global.t !== "function") {
  // eslint-disable-next-line no-undef
  global.t = (key) => {
    try {
      if (!key) return "";
      const last =
        typeof key === "string" && key.includes(".")
          ? key.split(".").pop() || key
          : key;
      const words = String(last)
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return words || String(key);
    } catch {
      return String(key ?? "");
    }
  };
}

AppRegistry.registerComponent("main", () => App);

let BootSplash: {
  hide: (options?: { fade?: boolean }) => Promise<void>;
  isVisible?: () => Promise<boolean>;
} = {
  hide: async () => {},
  isVisible: async () => false,
};

try {
  BootSplash = require("react-native-bootsplash");
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown BootSplash error";
  if (__DEV__) {
    console.warn(
      "react-native-bootsplash failed to load. Using noop implementation.\n",
      message
    );
  }
}

export default BootSplash;

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
          },
          extensions: [".js", ".json", ".ts", ".tsx"],
          root: ["./src"],
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
};

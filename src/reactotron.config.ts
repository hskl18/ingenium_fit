import Reactotron from "reactotron-react-native";

if (__DEV__) {
  Reactotron.configure({
    name: "KangFu App",
  })
    .useReactNative({
      asyncStorage: false,
      networking: {
        ignoreUrls: /symbolicate/,
      },
      editor: false,
      errors: { veto: (stackFrame) => false },
      overlay: false,
    })
    .connect();
}

export default Reactotron;

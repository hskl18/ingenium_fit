import type { ComponentType, ReactNode } from "react";

type KeyboardProviderProps = {
  readonly children: ReactNode;
  readonly disabled?: boolean;
};

let NativeKeyboardProvider: ComponentType<KeyboardProviderProps> = ({
  children,
}) => children ?? null;

try {
  NativeKeyboardProvider =
    require("react-native-keyboard-controller").KeyboardProvider;
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown keyboard controller error";
  if (__DEV__) {
    console.warn(
      "react-native-keyboard-controller failed to load. Falling back to no-op provider.\n",
      message
    );
  }
}

const KeyboardProvider = NativeKeyboardProvider;

export { KeyboardProvider };

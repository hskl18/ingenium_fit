import type { ReactNode } from "react";

type KeyboardProviderProps = {
  readonly children: ReactNode;
};

const KeyboardProvider = ({ children }: KeyboardProviderProps) => children;

export { KeyboardProvider };

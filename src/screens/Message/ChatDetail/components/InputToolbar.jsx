import React from "react";

import { StyleSheet, View, Text } from "react-native";
import { InputToolbar, Composer, Send } from "react-native-gifted-chat";
import { useTheme } from "@/theme";

const ThemedToolbar = (props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.toolbarSurface}>
      <InputToolbar
        {...props}
        containerStyle={[styles.toolbarContainer, { borderTopColor: colors.gray300 }]}
        primaryStyle={styles.toolbarPrimary}
      />
    </View>
  );
};

export const renderInputToolbar = (props) => <ThemedToolbar {...props} />;

export const renderActions = () => null;

export const renderComposer = (props) => {
  const composerProps = {
    ...props,
    textInputProps: {
      placeholder: props?.placeholder || "Ask the Pasadena navigator anything…",
      placeholderTextColor: "rgba(26, 30, 46, 0.55)",
      allowFontScaling: true,
      multiline: true,
      underlineColorAndroid: "transparent",
      autoCorrect: true,
      autoComplete: "off",
      autoCapitalize: "sentences",
      textAlignVertical: "center",
      enablesReturnKeyAutomatically: true,
      blurOnSubmit: false,
      clearButtonMode: "never",
      editable: !props.disableComposer,
      selectionColor: "#0B6BFF",
      ...(props.textInputProps || {}),
    },
    textInputStyle: [styles.textInput, props.textInputStyle],
  };

  return <Composer {...composerProps} />;
};

const SendButton = (props) => {
  const { backgrounds, colors } = useTheme();
  const disabled = !props?.text?.trim?.();

  return (
    <View style={styles.sendContainer}>
      <Send
        {...props}
        disabled={disabled}
        containerStyle={styles.sendButtonContainer}
      >
        <View
          style={[
            backgrounds.primary,
            styles.sendButton,
            disabled && styles.sendButtonDisabled,
          ]}
        >
          <Text
            maxFontSizeMultiplier={1.2}
            style={[styles.sendLabel, { color: colors.gray1600 }]}
          >
            Send
          </Text>
        </View>
      </Send>
    </View>
  );
};

SendButton.displayName = "SendButton";

export const renderSend = (props) => <SendButton {...props} />;

const styles = StyleSheet.create({
  toolbarSurface: {
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(15, 23, 42, 0.12)",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  toolbarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toolbarPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: "#1A1E2E",
    backgroundColor: "#F4F6FB",
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: 15,
    lineHeight: 20,
    marginRight: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(15, 23, 42, 0.06)",
  },
  sendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  sendButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  sendButton: {
    minWidth: 64,
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(11, 107, 255, 0.25)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  sendButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  sendLabel: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});

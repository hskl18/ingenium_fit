import React from "react";

import { StyleSheet, Image, View, Pressable } from "react-native";
import {
  InputToolbar,
  Actions,
  Composer,
  Send,
} from "react-native-gifted-chat";
import ImageIcon from "@/assets/images/235.png";
import AudioIcon from "@/assets/images/234.png";
import SendIcon from "@/assets/images/233.png";
import { Text } from "react-native-paper";
import { useTheme } from "@/theme";
import { useTranslation } from "@/hooks";

export const renderInputToolbar = (props) => {
  const { selectImage, visibleToolbar } = props;
  return (
    <View>
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#FFFFFF",
          paddingTop: 6,
        }}
        primaryStyle={{ alignItems: "center" }}
      />
      {/* 底部工具栏 */}
      {visibleToolbar ? (
        <View style={styles.bottomToolbar}>
          <Pressable onPress={selectImage} style={styles.toolbarButton}>
            <Image style={styles.imageIcon} source={ImageIcon} />
          </Pressable>
        </View>
      ) : undefined}
    </View>
  );
};

export const renderActions = (props) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => <Image style={{ width: 26, height: 26 }} source={AudioIcon} />}
  />
);

export const renderComposer = (props) => (
  <Composer
    {...props}
    textInputStyle={{
      color: "#222B45",
      backgroundColor: "#F5F5F5",
      borderWidth: 1,
      borderRadius: 22,
      borderColor: "#F5F5F5",
      paddingTop: 8.5,
      paddingHorizontal: 12,
      marginLeft: 0,
    }}
  />
);

const SendButton = (props) => {
  SendButton.displayName = "SendButton";
  const { backgrounds, colors } = useTheme();
  return (
    <View style={styles.sendContainer}>
      <Send
        {...props}
        disabled={!props.text}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 4,
        }}
      >
        <View style={[backgrounds.primary, styles.button]}>
          <Text style={[styles.buttonText, { color: colors.gray1600 }]}>
            {"Send"}
          </Text>
        </View>
      </Send>
      <Pressable onPress={props.openToolbar} style={styles.iconButton}>
        <Image style={{ width: 26, height: 26 }} source={SendIcon} />
      </Pressable>
    </View>
  );
};

export const renderSend = (openToolbar) => {
  return (props) => <SendButton {...props} openToolbar={openToolbar} />;
};

const styles = StyleSheet.create({
  sendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
  },
  button: {
    width: 60,
    height: 34,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 500,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomToolbar: {
    minHeight: 156,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5E5",
  },
  toolbarButton: {},
  imageIcon: {
    width: 65,
    height: 65,
  },
  toolbarText: {
    fontSize: 11,
    color: "#666666",
    marginTop: 4,
    textAlign: "center",
  },
});

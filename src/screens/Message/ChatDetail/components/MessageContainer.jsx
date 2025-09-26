import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Avatar,
  Bubble,
  Message,
  MessageText,
  SystemMessage,
} from "react-native-gifted-chat";

let NitroSound = null;
try {
  NitroSound = require("react-native-nitro-sound");
} catch (error) {
  console.warn("NitroSound not available in Expo Go");
}

export const renderAvatar = (props) => (
  <Avatar {...props} imageStyle={{ left: styles.avatar, right: styles.avatar }} />
);

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={styles.systemMessageContainer}
    wrapperStyle={styles.systemMessageWrapper}
    textStyle={styles.systemMessageText}
  />
);

export const renderMessage = (props) => <Message {...props} />;

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    textStyle={{
      left: styles.messageTextLeft,
      right: styles.messageTextRight,
    }}
    customTextStyle={styles.messageText}
  />
);

const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const AudioMessage = ({ duration: audioDuration, isCurrentUser }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration] = useState(
    audioDuration ? formatTime(audioDuration) : "00:00"
  );

  const togglePlayback = async () => {
    if (!NitroSound) {
      console.warn("Audio playback not available in Expo Go");
      return;
    }

    try {
      setIsPlaying((current) => !current);
      // Real playback would be triggered here.
    } catch (error) {
      console.error("Audio play error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <View
      style={[styles.audioBubble, isCurrentUser && styles.audioBubbleRight]}
    >
      <Pressable
        onPress={togglePlayback}
        style={[styles.audioButton, isCurrentUser && styles.audioButtonRight]}
      >
        <Text
          style={[styles.audioButtonText, isCurrentUser && styles.audioButtonTextRight]}
        >
          {isPlaying ? "⏸" : "▶"}
        </Text>
      </Pressable>
      <View style={styles.audioDetails}>
        <Text
          style={[styles.audioLabel, isCurrentUser && styles.audioLabelRight]}
        >
          Voice message
        </Text>
        <Text
          style={[styles.audioDuration, isCurrentUser && styles.audioDurationRight]}
        >
          {duration}
        </Text>
      </View>
    </View>
  );
};

export const renderBubble = (props) => {
  const { currentMessage } = props;
  const isCurrentUser = currentMessage.user._id === props.user._id;

  if (currentMessage.messageType === 3 && currentMessage.audio) {
    return (
      <View
        style={[styles.audioBubbleWrapper, isCurrentUser && styles.alignEnd]}
      >
        <AudioMessage
          duration={currentMessage.duration}
          isCurrentUser={isCurrentUser}
        />
      </View>
    );
  }

  if (currentMessage.messageType === 2 && currentMessage.image) {
    return (
      <Bubble
        {...props}
        wrapperStyle={bubbleWrapperStyles}
        renderMessageImage={() => (
          <Image
            resizeMode="cover"
            source={{ uri: currentMessage.image }}
            style={styles.messageImage}
          />
        )}
      />
    );
  }

  return (
    <Bubble
      {...props}
      wrapperStyle={bubbleWrapperStyles}
      bottomContainerStyle={styles.bubbleFooter}
    />
  );
};

export const renderCustomView = () => null;

const bubbleWrapperStyles = {
  left: {
    backgroundColor: "#EEF3FF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
    maxWidth: "82%",
  },
  right: {
    backgroundColor: "#0B6BFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
    maxWidth: "82%",
  },
};

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  messageTextLeft: {
    color: "#1A1A1A",
  },
  messageTextRight: {
    color: "#FFFFFF",
  },
  systemMessageContainer: {
    marginBottom: 8,
  },
  systemMessageWrapper: {
    backgroundColor: "#E8EEFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  systemMessageText: {
    color: "#3E4C70",
    fontSize: 12,
    fontWeight: "500",
  },
  messageImage: {
    width: 220,
    height: 220,
    borderRadius: 18,
  },
  bubbleFooter: {
    paddingHorizontal: 6,
    paddingBottom: 2,
  },
  audioBubbleWrapper: {
    marginVertical: 4,
    alignItems: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  audioBubble: {
    backgroundColor: "#F3F6FC",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 260,
  },
  audioBubbleRight: {
    backgroundColor: "#0B6BFF",
  },
  audioButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  audioButtonRight: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  audioButtonText: {
    color: "#0B6BFF",
    fontSize: 16,
    fontWeight: "600",
  },
  audioButtonTextRight: {
    color: "#FFFFFF",
  },
  audioDetails: {
    flex: 1,
  },
  audioLabel: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "500",
  },
  audioLabelRight: {
    color: "#FFFFFF",
  },
  audioDuration: {
    color: "#5B6C8F",
    fontSize: 12,
    marginTop: 2,
  },
  audioDurationRight: {
    color: "rgba(255,255,255,0.85)",
  },
});

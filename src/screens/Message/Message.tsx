import type { RootScreenProps } from "@/navigation/types.ts";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks";
import {
  Image,
  ImageURISource,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import { Pressable } from "react-native-gesture-handler";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import SystemIcon from "@/assets/images/257.png";
import MessageIcon from "@/assets/images/258.png";
import {
  getLeaveWordUnReadNumAndLatest,
  getUnReadNumAndLatest,
} from "@/services";
import { dayjs } from "@/plugins/day.ts";
import { useFocusEffect } from "@react-navigation/native";

export default function Message({
  navigation,
}: RootScreenProps<Paths.Message>) {
  const { backgrounds, colors } = useTheme();
  const [message, setMessage] = useState({});
  const [leaveWord, setLeaveWord] = useState({});

  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Message],
        type: "active",
      });
      // Do something when the screen is focused
      return () => {};
    }, [queryClient])
  );

  const { data: messageData, isSuccess: messageIsSuccess } = useQuery({
    queryFn: getUnReadNumAndLatest,
    queryKey: [Paths.Message, "getUnReadNumAndLatest"],
  });

  const { data: leaveWordData, isSuccess: leaveWordIsSuccess } = useQuery({
    queryFn: getLeaveWordUnReadNumAndLatest,
    queryKey: [Paths.Message, "getLeaveWordUnReadNumAndLatest"],
  });

  useEffect(() => {
    if (messageIsSuccess) {
      setMessage(messageData.data || {});
    }
  }, [setMessage, messageData, messageIsSuccess]);

  useEffect(() => {
    console.log("leaveWordData", leaveWordData);
    if (leaveWordIsSuccess) {
      setLeaveWord(leaveWordData.data || {});
    }
  }, [setLeaveWord, leaveWordData, leaveWordIsSuccess]);

  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: [Paths.Message] });
  // }, []);

  return (
    <SafeScreen
      edges={["bottom"]}
      style={[styles.scrollView, backgrounds.gray1550]}
    >
      <View style={styles.container}>
        <TouchableRipple
          borderless
          rippleColor="rgba(0, 0, 0,0.06)"
          onPress={() => {
            navigation.push(Paths.ChatMessage);
          }}
          style={[styles.message, backgrounds.gray1600]}
        >
          <View style={[styles.messageInner]}>
            <View>
              <Image
                source={MessageIcon as ImageURISource}
                style={styles.messageIcon}
              />
              {leaveWord?.unReadMessageNum > 0 ? (
                <View style={styles.messageNum}>
                  <Text
                    style={{
                      ...styles.messageNumText,
                      color: colors.gray1600,
                    }}
                  >
                    {leaveWord?.unReadMessageNum}
                  </Text>
                </View>
              ) : undefined}
            </View>
            <View style={styles.content}>
              <View style={styles.titleWrapper}>
                <Text style={styles.titleText}>{"Chat"}</Text>
                <Text style={{ ...styles.dateText, color: colors.gray800 }}>
                  {leaveWord.latestLeaveWordSub?.createTime
                    ? dayjs(leaveWord.latestLeaveWordSub?.createTime).format(
                        "YYYY-MM-DD HH:mm"
                      )
                    : leaveWord.latestLeaveWordSub?.createTime}
                </Text>
              </View>

              {leaveWord.latestLeaveWordSub ? (
                <>
                  {+leaveWord.latestLeaveWordSub?.messageType === 1 ? (
                    <Text
                      numberOfLines={1}
                      style={{ ...styles.messageText, color: colors.gray800 }}
                    >
                      {leaveWord.latestLeaveWordSub?.messageContent}
                    </Text>
                  ) : undefined}
                  {+leaveWord.latestLeaveWordSub?.messageType === 2 ? (
                    <Text
                      numberOfLines={1}
                      style={{ ...styles.messageText, color: colors.gray800 }}
                    >
                      {"Image"}
                    </Text>
                  ) : undefined}
                  {+leaveWord.latestLeaveWordSub?.messageType === 3 ? (
                    <Text
                      numberOfLines={1}
                      style={{ ...styles.messageText, color: colors.gray800 }}
                    >
                      {"Voice"}
                    </Text>
                  ) : undefined}
                </>
              ) : undefined}
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple
          borderless
          rippleColor="rgba(0, 0, 0,0.06)"
          onPress={() => {
            navigation.push(Paths.SystemMessage);
          }}
          style={[
            styles.message,
            backgrounds.gray1600,
            {
              marginTop: 15,
            },
          ]}
        >
          <View style={[styles.messageInner]}>
            <View>
              <Image
                source={SystemIcon as ImageURISource}
                style={styles.messageIcon}
              />
              {message?.unReadNum > 0 ? (
                <View style={styles.messageNum}>
                  <Text
                    style={{
                      ...styles.messageNumText,
                      color: colors.gray1600,
                    }}
                  >
                    {message?.unReadNum}
                  </Text>
                </View>
              ) : undefined}
            </View>
            <View style={styles.content}>
              <View style={styles.titleWrapper}>
                <Text style={styles.titleText}>{"System"}</Text>
                <Text style={{ ...styles.dateText, color: colors.gray800 }}>
                  {message.latestUserMessage?.createTime
                    ? dayjs(message.latestUserMessage?.createTime).format(
                        "YYYY-MM-DD HH:mm"
                      )
                    : message.latestUserMessage?.createTime}
                </Text>
              </View>
              <Text style={{ ...styles.messageText, color: colors.gray800 }}>
                {message.latestUserMessage?.title}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  content: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 500,
  },
  messageInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  message: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  messageIcon: {
    height: 50,
    width: 50,
  },
  messageNum: {
    alignItems: "center",
    backgroundColor: "#F2262F",
    borderRadius: 20,
    height: 14,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    width: 13,
  },
  messageNumText: {
    fontSize: 11,
    fontWeight: 500,
  },
  messageText: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 10,
  },
  safeScreen: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  scrollView: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  titleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});

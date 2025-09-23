import type { RootScreenProps } from "@/navigation/types.ts";

import { LegendList } from "@legendapp/list";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Image, ImageURISource, StyleSheet, View } from "react-native";
import { Avatar, Text, TouchableRipple } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";
import { dayjs } from "@/plugins/day.ts";

import { leaveWordList } from "@/services";
import Empty from "@/components/common/Empty/Empty.tsx";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "@/hooks";

export default function ChatMessage({
  navigation,
}: RootScreenProps<Paths.ChatMessage>) {
  const { backgrounds, colors } = useTheme();
  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.ChatMessage, "leaveWordList"],
        type: "active",
      });
      // Do something when the screen is focused
      return () => {};
    }, [])
  );
  const {
    isPending,
    data,
    isFetching,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 20) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam) => {
      return leaveWordList({
        page: pageParam.pageParam,
        pageSize: 20,
      });
    },
    queryKey: [Paths.ChatMessage, "leaveWordList"],
  });

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows || []);
  }

  console.log(data);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableRipple
        borderless
        onPress={() => {
          navigation.navigate(Paths.ChatDetail, {
            userId: item.user?.id,
          });
        }}
        rippleColor="rgba(0, 0, 0,0.06)"
        style={[
          styles.message,
          backgrounds.gray1600,
          {
            marginTop: index > 0 ? 15 : 0,
          },
        ]}
      >
        <>
          <View>
            <Avatar.Image
              size={53}
              source={{
                uri: item?.user?.avatar,
              }}
              style={styles.messageIcon}
            />
            {item.unReadMessageNum > 0 ? (
              <View style={styles.messageNum}>
                <Text
                  style={{ ...styles.messageNumText, color: colors.gray1600 }}
                >
                  {item?.unReadMessageNum}
                </Text>
              </View>
            ) : undefined}
          </View>
          <View style={styles.content}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>{item.user?.nickName}</Text>
              <Text style={{ ...styles.dateText, color: colors.gray800 }}>
                {item.latestLeaveWordSub?.createTime
                  ? dayjs(item.latestLeaveWordSub?.createTime).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : item.latestLeaveWordSub?.createTime}
              </Text>
            </View>
            {item.latestLeaveWordSub ? (
              <>
                {+item.latestLeaveWordSub?.messageType === 1 ? (
                  <Text
                    numberOfLines={1}
                    style={{ ...styles.messageText, color: colors.gray800 }}
                  >
                    {item.latestLeaveWordSub?.messageContent}
                  </Text>
                ) : undefined}
                {+item.latestLeaveWordSub?.messageType === 2 ? (
                  <Text
                    numberOfLines={1}
                    style={{ ...styles.messageText, color: colors.gray800 }}
                  >
                    {"Image"}
                  </Text>
                ) : undefined}
                {+item.latestLeaveWordSub?.messageType === 3 ? (
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
        </>
      </TouchableRipple>
    );
  };

  return (
    <SafeScreen
      edges={["bottom"]}
      style={[styles.safeScreen, backgrounds.gray1550]}
    >
      <LegendList
        contentContainerStyle={styles.container}
        data={dataList}
        renderItem={renderItem}
        ListEmptyComponent={<Empty />}
        keyExtractor={(item) => item.id}
        onEndReached={fetchNextPage}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  content: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 500,
  },
  message: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  messageIcon: {
    height: 53,
    width: 53,
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
  phoneIcon: {
    height: 14,
    width: 14,
  },
  phoneText: {
    fontSize: 12,
    fontWeight: 500,
  },
  phoneWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
    marginTop: 12,
  },
  safeScreen: {
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

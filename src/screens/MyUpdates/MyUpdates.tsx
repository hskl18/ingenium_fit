import { LegendList } from "@legendapp/list";
import { useFocusEffect } from "@react-navigation/native";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import DynamicItem from "@/components/common/DynamicItem/DynamicItem.tsx";
import Empty from "@/components/common/Empty/Empty.tsx";
import { SafeScreen } from "@/components/templates";

import { myPostList } from "@/services";

export default function MyUpdates() {
  const { backgrounds } = useTheme();
  const queryClient = useQueryClient();
  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.MyUpdates],
        type: "active",
      });
      // Do something when the screen is focused
      return () => {};
    }, [queryClient])
  );

  const { data, fetchNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any, lastPageParam: number) => {
      console.log(lastPage, allPages);
      if (!(lastPage as any)?.rows || (lastPage as any).rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: async (pageParam) => {
      return myPostList({
        page: pageParam.pageParam,
      });
    },
    queryKey: [Paths.MyUpdates],
  });

  const onRefresh = () => {
    queryClient.refetchQueries({
      queryKey: [Paths.MyUpdates],
      type: "active",
    });
  };
  console.log(data);

  let dataList: any[] = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item: any) => {
      // Check if item has the expected structure with rows
      if (item?.rows && Array.isArray(item.rows)) {
        return item.rows;
      }
      // If item doesn't have rows, it might already be in the grouped format
      return item;
    });
  }
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Safety check for undefined item or missing properties
    if (!item || typeof item !== "object") {
      console.warn("Invalid item in MyUpdates renderItem:", item);
      return null;
    }

    const yearMonth = item.yearMonth || "Unknown";
    const dynamicsPostList = item.dynamicsPostList || [];

    return (
      <View key={yearMonth} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>• {yearMonth}</Text>
        </View>
        {dynamicsPostList.map((sItem: any, sIndex: number) => {
          // Safety check for each post item
          if (!sItem || typeof sItem !== "object" || !sItem.id) {
            console.warn("Invalid post item in dynamicsPostList:", sItem);
            return null;
          }

          return (
            <View key={sItem.id} style={{ marginTop: sIndex > 0 ? 20 : 0 }}>
              <DynamicItem item={sItem} onRefresh={onRefresh} />
            </View>
          );
        })}
      </View>
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
        keyExtractor={(item: any) => item?.yearMonth || "unknown"}
        ListEmptyComponent={<Empty />}
        onEndReached={() => fetchNextPage()}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safeScreen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleContainer: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 600,
  },
});

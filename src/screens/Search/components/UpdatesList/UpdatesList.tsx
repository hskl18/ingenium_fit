import { LegendList } from "@legendapp/list";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useTranslation } from "@/hooks";
import { StyleSheet, View } from "react-native";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import DynamicItem from "@/components/common/DynamicItem/DynamicItem.tsx";
import { SafeScreen } from "@/components/templates";
import { SearchContext } from "@/screens/Search/SearchContext";

import { postList } from "@/services";
import Empty from "@/components/common/Empty/Empty.tsx";

export default function UpdatesList() {
  const { backgrounds } = useTheme();
  const { t } = useTranslation();
  const { searchKey } = useContext(SearchContext);
  const queryClient = useQueryClient();

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
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam) => {
      return postList({
        // 查询类型：1-Friend Updates朋友动态  2-Recently最近的
        selectType: 2,
        page: pageParam.pageParam,
        searchKey,
      });
    },
    queryKey: [Paths.Search, "postList", searchKey],
  });
  const onRefresh = () => {
    queryClient.refetchQueries({
      queryKey: [Paths.Search, "postList"],
      type: "active",
    });
  };
  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <DynamicItem item={item} onRefresh={onRefresh} />
      </View>
    );
  };

  return (
    <SafeScreen
      edges={["bottom"]}
      style={[styles.safeScreen, backgrounds.gray1600]}
    >
      <LegendList
        contentContainerStyle={styles.container}
        data={dataList}
        renderItem={renderItem}
        ListEmptyComponent={<Empty />}
        keyExtractor={(item) => item.id}
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
});

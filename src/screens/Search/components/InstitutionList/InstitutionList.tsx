import { LegendList } from "@legendapp/list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useTranslation } from "@/hooks";
import { StyleSheet, View } from "react-native";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import InstitutionItem from "@/components/common/InstitutionItem/InstitutionItem.tsx";
import { SafeScreen } from "@/components/templates";

import { rehabilitationCenterList } from "@/services";
import { SearchContext } from "@/screens/Search/SearchContext";
import Empty from "@/components/common/Empty/Empty.tsx";
import { useLocationStore } from "@/store";

export default function RehabilitationCenterList() {
  const { backgrounds } = useTheme();
  const { t } = useTranslation();
  const { searchKey } = useContext(SearchContext);
  const location = useLocationStore((state) => state.location);

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
      return rehabilitationCenterList({
        ...(location?.coords || {}),
        page: pageParam.pageParam,
        searchKey: searchKey,
      });
    },
    queryKey: [Paths.Search, "rehabilitationCenterList", searchKey, location],
  });

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <InstitutionItem item={item} />
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
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty />}
        onEndReached={fetchNextPage}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  safeScreen: {
    flex: 1,
  },
  searchIcon: {
    height: 44,
    width: 44,
  },
});

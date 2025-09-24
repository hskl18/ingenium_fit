import { LegendList } from "@legendapp/list";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
// import { useTranslation } from '@/hooks';
import { StyleSheet, View } from "react-native";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import DynamicItem from "@/components/common/DynamicItem/DynamicItem.tsx";
import { SafeScreen } from "@/components/templates";

import { postList } from "@/services";
import Empty from "@/components/common/Empty/Empty.tsx";

export default function DynamicList({
  route,
  navigation,
}: RootScreenProps<Paths.DynamicList>) {
  const { backgrounds } = useTheme();
  const { selectType, whetherRecommend } = route.params;
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    let headerTitle = "";
    if (whetherRecommend) {
      headerTitle = "Recommended posts";
    }

    if (selectType && +selectType === 1) {
      headerTitle = "Friend updates";
    }
    navigation.setOptions({
      headerTitle: headerTitle,
    });
  }, [navigation, selectType, whetherRecommend]);
  const { data, fetchNextPage } = useInfiniteQuery<
    any,
    Error,
    any,
    any,
    number
  >({
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any, lastPageParam: number) => {
      if (__DEV__) console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam: any) => {
      return postList({
        selectType,
        whetherRecommend,
        page: pageParam.pageParam,
      });
    },
    queryKey: [Paths.DynamicList, "postList", selectType, whetherRecommend],
  });

  if (__DEV__) console.log("dynamicListData", data);

  const onRefresh = () => {
    queryClient.refetchQueries({
      queryKey: [Paths.DynamicList, "postList"],
      type: "active",
    });
  };

  let dataList: any[] = [];
  if (data?.pages) {
    dataList = data.pages.flatMap((item: any) => item?.rows);
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
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
        keyExtractor={(item) => item.id}
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
});

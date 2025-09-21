import { LegendList } from '@legendapp/list';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { favoriteList } from '@/services';
import SciencePopularizationItem from '@/components/common/SciencePopularizationItem/SciencePopularizationItem.tsx';
import Empty from "@/components/common/Empty/Empty.tsx";
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

export default function SciencePopularizationList() {
  const { backgrounds } = useTheme();
  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Collection, 'SciencePopularizationList'],
        type: 'active',
      });
      // Do something when the screen is focused
      return () => {};
    }, []),
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
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    queryFn: async (pageParam) => {
      return favoriteList({
        // 收藏对象类型：1-康复中心 2-科普 3-动态
        objectType: 2,
        page: pageParam.pageParam,
      });
    },
    queryKey: [Paths.Collection, 'SciencePopularizationList'],
  });

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows ?? []);
  }
  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 1 ? 20 : 0 }}>
        <SciencePopularizationItem item={item.science || {}}  showCollectIcon/>
      </View>
    );
  };
  return (
    <SafeScreen edges={['bottom']} style={[styles.safeScreen,backgrounds.gray1600]}>
      <LegendList
        columnWrapperStyle={{
          rowGap: 10,
          columnGap: 10,
        }}
        contentContainerStyle={styles.container}
        data={dataList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty/>}
        numColumns={2}
        onEndReached={fetchNextPage}

        renderItem={renderItem}
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

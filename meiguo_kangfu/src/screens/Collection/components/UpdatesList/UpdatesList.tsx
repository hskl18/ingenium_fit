import { LegendList } from '@legendapp/list';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import DynamicItem from '@/components/common/DynamicItem/DynamicItem.tsx';
import { SafeScreen } from '@/components/templates';

import { favoriteList } from '@/services';
import Empty from '@/components/common/Empty/Empty.tsx';
import { useFocusEffect } from '@react-navigation/native';

export default function UpdatesList() {
  const { backgrounds } = useTheme();

  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Collection, 'UpdatesList'],
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
        objectType: 3,
        page: pageParam.pageParam,
      });
    },
    queryKey: [Paths.Collection, 'UpdatesList'],
  });

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows ?? []);
  }
  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <DynamicItem item={item.dynamicsPost || {}} hideVisibleShield/>
      </View>
    );
  };
  return (
    <SafeScreen
      edges={['bottom']}
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
  safeScreen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

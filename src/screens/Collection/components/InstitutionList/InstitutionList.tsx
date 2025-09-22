import { LegendList } from '@legendapp/list';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import InstitutionItem from '@/components/common/InstitutionItem/InstitutionItem.tsx';
import { SafeScreen } from '@/components/templates';

import { favoriteList } from '@/services';
import Empty from '@/components/common/Empty/Empty.tsx';
import { useLocationStore } from '@/store';
import { useFocusEffect } from '@react-navigation/native';

export default function InstitutionList() {
  const { backgrounds } = useTheme();
  const location = useLocationStore((state) => state.location);
  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Collection, 'InstitutionList'],
        type: 'active',
      });
      // Do something when the screen is focused
      return () => {};
    }, []),
  );


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isSuccess,
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
        ...(location?.coords || {}),
        // 收藏对象类型：1-康复中心 2-科普 3-动态
        objectType: 1,
        page: pageParam.pageParam,
      });
    },
    queryKey: [Paths.Collection, 'InstitutionList', location],
  });

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }
  const renderItem = ({ index, item }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <InstitutionItem item={item.rehabilitationCenter || {}} />
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
        keyExtractor={(item) => item.id}
        onEndReached={fetchNextPage}
        ListEmptyComponent={<Empty />}
        renderItem={renderItem}
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
});

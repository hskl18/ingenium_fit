import { LegendList } from '@legendapp/list';
import { useFocusEffect } from '@react-navigation/native';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import DynamicItem from '@/components/common/DynamicItem/DynamicItem.tsx';
import Empty from '@/components/common/Empty/Empty.tsx';
import { SafeScreen } from '@/components/templates';

import { myPostList } from '@/services';

export default function MyUpdates() {
  const { backgrounds } = useTheme();
  const queryClient = useQueryClient();
  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.MyUpdates],
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
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
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
      type: 'active',
    });
  };
  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }
  const renderItem = ({ item, index }) => {
    return (
      <View key={item.yearMonth} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>• {item.yearMonth}</Text>
        </View>
        {item.dynamicsPostList?.map((sItem, sIndex: number) => (
          <View key={sItem.id} style={{ marginTop: sIndex > 0 ? 20 : 0 }}>
            <DynamicItem item={sItem} onRefresh={onRefresh} />
          </View>
        ))}
      </View>
    );
  };
  return (
    <SafeScreen
      edges={['bottom']}
      style={[styles.safeScreen, backgrounds.gray1550]}
    >
      <LegendList
        contentContainerStyle={styles.container}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.yearMonth}
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
  titleContainer: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 600,
  },
});

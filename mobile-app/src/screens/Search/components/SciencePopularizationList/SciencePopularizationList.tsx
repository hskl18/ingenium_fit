import { LegendList } from '@legendapp/list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { useTranslation } from '@/hooks';
import { StyleSheet, View } from 'react-native';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import SciencePopularizationItem from '@/components/common/SciencePopularizationItem/SciencePopularizationItem.tsx';
import { SafeScreen } from '@/components/templates';
import { SearchContext } from '@/screens/Search/Search.tsx';

import { scienceList } from '@/services';
import Empty from '@/components/common/Empty/Empty.tsx';

export default function SciencePopularizationList() {
  const { t } = useTranslation();
  const { backgrounds } = useTheme();
  const { searchKey } = useContext(SearchContext);

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
      return scienceList({
        page: pageParam.pageParam,
        searchKey,
      });
    },
    queryKey: [Paths.Search, 'scienceList', searchKey],
  });

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }

  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 1 ? 20 : 0 }}>
        <SciencePopularizationItem item={item} />
      </View>
    );
  };

  return (
    <SafeScreen
      edges={['bottom']}
      style={[styles.safeScreen, backgrounds.gray1600]}
    >
      <LegendList
        columnWrapperStyle={{
          rowGap: 10,
          columnGap: 10,
        }}
        contentContainerStyle={styles.container}
        data={dataList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty />}
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
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

import type { RootScreenProps } from '@/navigation/types.ts';
import { LegendList } from '@legendapp/list';
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks';
import {
  Image,
  ImageURISource,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import DynamicItem from '@/components/common/DynamicItem/DynamicItem.tsx';
import Empty from '@/components/common/Empty/Empty.tsx';
import { SafeScreen } from '@/components/templates';
import DynamicSort from '@/screens/Tabbar/Dynamic/components/DynamicSort/DynamicSort.tsx';
import FriendUpdatesItem from '@/screens/Tabbar/Dynamic/components/FriendUpdatesItem/FriendUpdatesItem.tsx';

import FilterIcon from '@/assets/images/51.png';
import EditIcon from '@/assets/images/54.png';
import { dynamicsCategoryList, postList } from '@/services';
import TabMenu from '@/components/common/TabMenu/TabMenu.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Dynamic({
  navigation,
}: RootScreenProps<Paths.Dynamic>) {
  const { t } = useTranslation();
  const { backgrounds, colors, navigationTheme, variant } = useTheme();
  const [selectType, setSelectType] = useState(undefined);
  const [whetherRecommend, setWhetherRecommend] = useState(1);
  const [categoryList, setCategoryList] = useState([]);
  const [visibleSort, setVisibleSort] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();

  const showSortModal = () => {
    setVisibleSort(true);
  };
  const hideSortModal = () => {
    setVisibleSort(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Dynamic],
        type: 'active',
      });
      // Do something when the screen is focused
      return () => {};
    }, []),
  );

  const { data: categoryData, isSuccess: categoryIsSuccess } = useQuery({
    queryFn: dynamicsCategoryList,
    queryKey: [Paths.Dynamic, 'dynamicsCategoryList'],
  });

  useEffect(() => {
    console.log('categoryData', categoryData);
    if (categoryIsSuccess) {
      setCategoryList(categoryData.data || {});
    }
  }, [setCategoryList, categoryData, categoryIsSuccess]);

  const { data: friendUpdatesData, isSuccess: friendUpdatesIsSuccess } =
    useQuery({
      placeholderData: keepPreviousData,
      queryFn: () => {
        return postList({
          // 查询类型：1-Friend Updates朋友动态  2-Recently最近的
          selectType: 1,
        });
      },
      queryKey: [Paths.Dynamic, 'Friend-Updates'],
    });
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
    enabled: !!categoryList.length,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam) => {
      console.log('selectedIndex', selectedIndex);
      return postList({
        sortBy,
        whetherRecommend,
        dynamicsPostCategoryId: categoryList[selectedIndex]?.id,
        page: pageParam.pageParam,
        // 查询类型：1-Friend Updates朋友动态  2-Recently最近的
        selectType,
      });
    },
    queryKey: [
      Paths.Dynamic,
      'postList',
      categoryList,
      sortBy,
      whetherRecommend,
      selectType,
      selectedIndex,
    ],
  });

  console.log(hasNextPage, data);

  const handleSetUpdatesType = (
    value: number,
    flag: 'recommend' | 'recently',
  ) => {
    if (flag === 'recommend') {
      setWhetherRecommend(1);
      setSelectType(undefined);
    }

    if (flag === 'recently') {
      setWhetherRecommend(undefined);
      setSelectType(2);
    }
  };

  const onRefresh = () => {
    queryClient.refetchQueries({
      queryKey: [Paths.Dynamic, 'postList'],
      type: 'active',
    });
  };

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }

  const renderItem = ({ item, index }) => {
    return (
      <View
        key={item.id}
        style={{ marginHorizontal: 20, marginTop: index > 0 ? 20 : 0 }}
      >
        <DynamicItem item={item} onRefresh={onRefresh} />
      </View>
    );
  };

  const renderListHeader = () => {
    return (
      <>
        <StatusBar
          backgroundColor={navigationTheme.colors.background}
          barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View
          style={[
            styles.header,
            {
              paddingTop:insets.top || StatusBar.currentHeight,
            },
          ]}
        >
          <View style={styles.heroWrapper}>
            <Text style={styles.heroBadge}>{t('common.community_badge')}</Text>
            <Text style={styles.titleText}>
              {t('common.community_feed_title')}
            </Text>
            <Text
              style={{ ...styles.heroSubtitle, color: colors.gray500 }}
            >
              {t('common.community_feed_subtitle')}
            </Text>
            <Button
              accessibilityLabel={t('common.share_progress')}
              contentStyle={styles.publishButtonContent}
              icon={() => (
                <Image
                  alt="publish-icon"
                  source={EditIcon as ImageURISource}
                  style={styles.publishButtonIcon}
                />
              )}
              labelStyle={styles.publishButtonLabel}
              mode="contained"
              onPress={() => {
                navigation.navigate(Paths.DynamicPublish);
              }}
              style={styles.publishButton}
              uppercase={false}
            >
              {t('common.share_progress')}
            </Button>
          </View>
          {categoryList.length > 0 ? (
            <>
              <Text style={{ ...styles.topicIntro, color: colors.gray500 }}>
                {t('common.community_topics_intro')}
              </Text>
              <TabMenu
                tabs={categoryList}
                tabIndex={selectedIndex}
                setTabIndex={setSelectedIndex}
              />
            </>
          ) : undefined}
        </View>
        <View style={styles.container}>
          {friendUpdatesIsSuccess && friendUpdatesData.rows?.length > 0 ? (
            <>
              <View style={styles.friendUpdatesTitleWrapper}>
                <Text style={styles.friendUpdatesTitle}>
                  {t('common.peer_spotlights')}
                </Text>
                <Button
                  mode="text"
                  onPress={() => {
                    navigation.navigate(Paths.DynamicList, {
                      // 查询类型：1-Friend Updates朋友动态  2-Recently最近的
                      selectType: 1,
                    });
                  }}
                  textColor={navigationTheme.colors.primary}
                >
                  {t('common.view_all')}
                </Button>
              </View>
              <ScrollView
                contentContainerStyle={styles.updates}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {friendUpdatesData.rows.map((item) => (
                  <View key={item.id}>
                    <FriendUpdatesItem item={item} />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : undefined}

          <View style={styles.updatesTitleWrapper}>
            <View style={styles.updatesTitleWrapperLeft}>
              <Text
                style={{
                  ...styles.updatesTitle,
                  color:
                    +whetherRecommend === 1
                      ? navigationTheme.colors.primary
                      : colors.gray800,
                }}
                onPress={() => {
                  handleSetUpdatesType(1, 'recommend');
                }}
              >
                {t('common.recommend')}
              </Text>
              <Text
                style={{
                  ...styles.updatesTitle,
                  color:
                    +selectType === 2
                      ? navigationTheme.colors.primary
                      : colors.gray800,
                }}
                onPress={() => {
                  handleSetUpdatesType(1, 'recently');
                }}
              >
                {t('common.recently')}
              </Text>
            </View>
            <Pressable onPress={showSortModal}>
              <Image
                source={FilterIcon as ImageURISource}
                style={styles.filterIcon}
              ></Image>
            </Pressable>
          </View>
        </View>
      </>
    );
  };
  return (
    <SafeScreen edges={[]} style={[styles.safeScreen, backgrounds.gray1600]}>
      <LegendList
        contentContainerStyle={{
          paddingBottom: 10,
        }}
        ListHeaderComponent={renderListHeader()}
        data={dataList}
        renderItem={renderItem}
        ListEmptyComponent={<Empty />}
        keyExtractor={(item) => item.id}
        onEndReached={fetchNextPage}
      />
      <DynamicSort
        hideModal={hideSortModal}
        setSortBy={setSortBy}
        sortBy={sortBy}
        visible={visibleSort}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 38, paddingHorizontal: 20 },
  filterIcon: {
    height: 16,
    width: 16,
  },
  friendUpdatesTitleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    backgroundColor: '#E3EFF8',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  safeScreen: {
    flex: 1,
  },
  heroWrapper: {
    paddingTop: 12,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 119, 210, 0.14)',
    borderRadius: 999,
    color: '#0B3A64',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
    marginTop: 16,
    color: '#0B2340',
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  publishButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    marginTop: 18,
  },
  publishButtonContent: {
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  publishButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  publishButtonIcon: {
    height: 18,
    marginRight: 4,
    width: 18,
  },
  updates: {
    columnGap: 15,
    marginBottom: 38,
  },
  friendUpdatesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  updatesTitle: {
    fontSize: 20,
  },
  updatesTitleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  updatesTitleWrapperLeft: {
    flexDirection: 'row',
    gap: 30,
  },
  topicIntro: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: 24,
  },
});

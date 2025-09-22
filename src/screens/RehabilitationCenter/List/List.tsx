import { LegendList } from '@legendapp/list';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from '@/hooks';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Button, Text, TextInput } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import InstitutionItem from '@/components/common/InstitutionItem/InstitutionItem.tsx';
import { SafeScreen } from '@/components/templates';
import RehabilitationCenterFilter from '@/screens/RehabilitationCenter/List/components/RehabilitationCenterFilter/RehabilitationCenterFilter.tsx';
import RehabilitationCenterSort from '@/screens/RehabilitationCenter/List/components/RehabilitationCenterSort/RehabilitationCenterSort.tsx';

import SearchIcon from '@/assets/images/19.png';
import FilterIcon from '@/assets/images/604.png';
import SortIcon from '@/assets/images/606.png';
import { rehabilitationCenterList } from '@/services';
import Empty from '@/components/common/Empty/Empty.tsx';
import { useLocationStore } from '@/store';

export default function RehabilitationCenterList({
  navigation,
}: RootScreenProps<Paths.RehabilitationCenterList>) {
  const { t } = useTranslation();
  const { backgrounds, colors } = useTheme();
  const queryClient = useQueryClient();
  const location = useLocationStore((state) => state.location);

  const [visibleSort, setVisibleSort] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  // 排序方式：1-默认排序(默认) 2-距离排序 3-星级排序
  const [sortBy, setSortBy] = useState('1');
  const [score, setScore] = useState({
    id: '',
    minScore: '',
    maxScore: '',
  });
  const [distance, setDistance] = useState({
    id: '',
    maxDistance: '',
    minDistance: '',
  });
  const [searchKey, setSearchKey] = useState('');

  const showSortModal = () => {
    setVisibleSort(true);
  };
  const hideSortModal = () => {
    setVisibleSort(false);
  };
  const showFilterModal = () => {
    setVisibleFilter(true);
  };
  const hideFilterModal = () => {
    setVisibleFilter(false);
  };
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
        orderByType: sortBy,
        minScore: score.minScore,
        maxScore: score.maxScore,
        minDistance: distance.minDistance,
        maxDistance: distance.maxDistance,
        page: pageParam.pageParam,
        searchKey: searchKey,
      });
    },
    queryKey: [
      Paths.RehabilitationCenterList,
      'rehabilitationCenterList',
      sortBy,
      score,
      distance,
      location
    ],
  });

  const handleSearch = () => {
    queryClient.invalidateQueries({
      queryKey: [Paths.RehabilitationCenterList, 'rehabilitationCenterList'],
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
        <InstitutionItem item={item} />
      </View>
    );
  };

  const renderListHeader = () => {
    return (
      <View>
        <View style={styles.heroWrapper}>
          <Text style={styles.heroTitle}>
            {t('common.care_network_title')}
          </Text>
          <Text
            style={{ ...styles.heroSubtitle, color: colors.gray500 }}
          >
            {t('common.care_network_description')}
          </Text>
        </View>
        <View style={styles.searchWrapper}>
          <TextInput
            maxLength={255}
            activeUnderlineColor="transparent"
            label=""
            mode="outlined"
            onChangeText={(text) => {
              setSearchKey(text);
            }}
            outlineColor="transparent"
            outlineStyle={styles.textInputOutline}
            placeholder={t('common.search_for_service')}
            style={[{ flex: 1, height: 44 }, backgrounds.gray1550]}
            underlineColor="transparent"
            value={searchKey}
          />
          <Pressable onPress={handleSearch}>
            <Image
              alt="avatar"
              source={SearchIcon as ImageURISource}
              style={styles.searchIcon}
            />
          </Pressable>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable style={styles.button} onPress={showFilterModal}>
            <Text>{t('common.filter')}</Text>
            <Image
              source={FilterIcon as ImageURISource}
              style={styles.buttonGroupIcon}
            />
          </Pressable>
          <Pressable style={styles.button} onPress={showSortModal}>
            <Text>{t('common.sort')}</Text>
            <Image
              source={SortIcon as ImageURISource}
              style={styles.buttonGroupIcon}
            />
          </Pressable>
        </View>
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
        ListHeaderComponent={renderListHeader()}
        ListEmptyComponent={<Empty />}
        onEndReached={fetchNextPage}
      />

      <RehabilitationCenterFilter
        distance={distance}
        hideModal={hideFilterModal}
        score={score}
        setDistance={setDistance}
        setScore={setScore}
        visible={visibleFilter}
      />
      <RehabilitationCenterSort
        hideModal={hideSortModal}
        setSortBy={setSortBy}
        sortBy={sortBy}
        visible={visibleSort}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    gap: 12,
    paddingBottom: 24,
    paddingTop: 6,
  },
  heroTitle: {
    color: '#0B2340',
    fontSize: 26,
    fontWeight: '700',
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    borderRadius: 13,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    height: 26,
    paddingHorizontal: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 18,
    marginTop: 4,
  },
  buttonGroupIcon: {
    height: 14,
    width: 14,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  safeScreen: {
    flex: 1,
  },
  searchIcon: {
    height: 44,
    width: 44,
  },
  searchWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  textInputOutline: {
    borderRadius: 12,
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

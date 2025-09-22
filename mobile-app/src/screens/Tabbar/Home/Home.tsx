import type { RootScreenProps } from '@/navigation/types.ts';

import { LegendList } from '@legendapp/list';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  ImageURISource,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Avatar, Button, Text, TextInput } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useShallow } from 'zustand/react/shallow';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import Empty from '@/components/common/Empty/Empty.tsx';
import InstitutionItem from '@/components/common/InstitutionItem/InstitutionItem.tsx';
import { SafeScreen } from '@/components/templates';
import FriendUpdatesItem from '@/screens/Tabbar/Dynamic/components/FriendUpdatesItem/FriendUpdatesItem.tsx';

import ArrowIcon from '@/assets/images/17.png';
import MessageIcon from '@/assets/images/18.png';
import SearchIcon from '@/assets/images/19.png';

import {
  pasadenaCarousels,
  pasadenaCategories,
  pasadenaCommunityHighlights,
  pasadenaKnowledgeSpotlights,
  pasadenaRehabCenters,
} from '@/data/pasadenaContent.ts';

import {
  carouselList,
  getLeaveWordUnReadNumAndLatest,
  getLoginUser,
  getUnReadNumAndLatest,
  locationCity,
  postList,
  rehabilitationCenterList,
  scienceCategoryList,
  scienceList,
} from '@/services';
import { useLocationStore, useUserStore } from '@/store';
import { useFocusEffect } from '@react-navigation/native';
import SciencePopularizationItem from '@/components/common/SciencePopularizationItem/SciencePopularizationItem.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NON_LATIN_REGEX = /[^\x00-\x7F]/;

export default function Home({ navigation }: RootScreenProps<Paths.Home>) {
  const { backgrounds, colors, navigationTheme, variant } = useTheme();
  const [searchKey, setSearchKey] = useState('');
  const [categoryList, setCategoryList] = useState(pasadenaCategories);
  const [recommendedPosts, setRecommendedPosts] = useState(
    pasadenaCommunityHighlights,
  );
  const [recommendedSciences, setRecommendedSciences] = useState(
    pasadenaKnowledgeSpotlights,
  );
  const [carousels, setCarouses] = useState(pasadenaCarousels);
  const [message, setMessage] = useState({});
  const [leaveWord, setLeaveWord] = useState({});
  const { t } = useTranslation();
  const progress = useSharedValue<number>(0);
  const [userInfo, setUserInfo] = useUserStore(
    useShallow((state) => [state.userInfo, state.setUserInfo]),
  );
  const location = useLocationStore((state) => state.location);

  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Home, 'refresh'],
        type: 'active',
      });
      // Do something when the screen is focused
      return () => {};
    }, []),
  );

  const { data: messageData, isSuccess: messageIsSuccess } = useQuery({
    queryFn: getUnReadNumAndLatest,
    queryKey: [Paths.Home, 'refresh', 'getUnReadNumAndLatest'],
  });

  const { data: leaveWordData, isSuccess: leaveWordIsSuccess } = useQuery({
    queryFn: getLeaveWordUnReadNumAndLatest,
    queryKey: [Paths.Home, 'refresh', 'getLeaveWordUnReadNumAndLatest'],
  });

  useEffect(() => {
    console.log('messageData', messageData);
    if (messageIsSuccess) {
      setMessage(messageData.data || {});
    }
  }, [setMessage, messageData, messageIsSuccess]);

  useEffect(() => {
    console.log('leaveWordData', leaveWordData);
    if (leaveWordIsSuccess) {
      setLeaveWord(leaveWordData.data || {});
    }
  }, [setLeaveWord, leaveWordData, leaveWordIsSuccess]);

  /**
   * 推荐科普
   */
  const {
    data: recommendedSciencesData,
    isSuccess: recommendedSciencesIsSuccess,
    isError: recommendedSciencesIsError,
  } = useQuery({
    queryFn: () => {
      return scienceList({
        page: 1,
        pageSize: 6,
        // 是否推荐：1-是 2-否,
        whetherRecommend: 1,
      });
    },
    queryKey: [Paths.Home, 'refresh', 'scienceList'],
  });

  useEffect(() => {
    console.log('recommendedSciencesData', recommendedSciencesData);

    if (recommendedSciencesIsSuccess) {
      const rows = recommendedSciencesData?.rows || [];
      const englishRows = rows.filter(
        (item) =>
          item?.title && typeof item.title === 'string' && !NON_LATIN_REGEX.test(item.title),
      );

      if (englishRows.length > 0) {
        setRecommendedSciences(englishRows);
      } else {
        setRecommendedSciences(pasadenaKnowledgeSpotlights);
      }
    }
  }, [
    setRecommendedSciences,
    recommendedSciencesData,
    recommendedSciencesIsSuccess,
  ]);

  useEffect(() => {
    if (recommendedSciencesIsError) {
      setRecommendedSciences(pasadenaKnowledgeSpotlights);
    }
  }, [recommendedSciencesIsError]);

  /**
   * 推荐帖子
   */
  const {
    data: recommendedPostsData,
    isSuccess: recommendedPostsIsSuccess,
    isError: recommendedPostsIsError,
  } = useQuery({
      queryFn: () => {
        return postList({
          // 是否推荐：1-是 2-否,
          page: 1,
          pageSize: 6,
          whetherRecommend: 1,
        });
      },
      queryKey: [Paths.Home, 'refresh', 'postList'],
    });

  useEffect(() => {
    if (recommendedPostsIsSuccess) {
      const rows = recommendedPostsData?.rows || [];
      const englishRows = rows.filter((item) => {
        const isContentEnglish =
          item?.content && typeof item.content === 'string'
            ? !NON_LATIN_REGEX.test(item.content)
            : false;
        const hasMedia = Boolean(item?.pictures || item?.videos);
        const isAuthorEnglish =
          item?.user?.nickName && typeof item.user.nickName === 'string'
            ? !NON_LATIN_REGEX.test(item.user.nickName)
            : true;
        return isContentEnglish && hasMedia && isAuthorEnglish;
      });

      if (englishRows.length > 0) {
        setRecommendedPosts(englishRows);
      } else {
        setRecommendedPosts(pasadenaCommunityHighlights);
      }
    }
  }, [setRecommendedPosts, recommendedPostsData, recommendedPostsIsSuccess]);

  useEffect(() => {
    if (recommendedPostsIsError) {
      setRecommendedPosts(pasadenaCommunityHighlights);
    }
  }, [recommendedPostsIsError]);

  /**
   * 登录用户信息
   */

  const { data: userInfoData, isSuccess: userInfoIsSuccess } = useQuery({
    queryFn: getLoginUser,
    queryKey: [Paths.Home, 'getLoginUser'],
  });

  useEffect(() => {
    if (userInfoIsSuccess) {
      setUserInfo(userInfoData?.data || {});
    }
  }, [setUserInfo, userInfoData, userInfoIsSuccess]);

  /**
   * 轮播图列表
   */

  const {
    data: carouselInfoData,
    isSuccess: carouselInfoIsSuccess,
    isError: carouselInfoIsError,
  } = useQuery({
    queryFn: carouselList,
    queryKey: [Paths.Home, 'refresh', 'carouselList'],
  });

  useEffect(() => {
    console.log('carouselInfoData', carouselInfoData);
    if (carouselInfoIsSuccess) {
      const items = (carouselInfoData?.data || []).filter((item) => item?.image);
      if (items.length > 0) {
        setCarouses(items);
      } else {
        setCarouses(pasadenaCarousels);
      }
    }
  }, [setCarouses, carouselInfoData, carouselInfoIsSuccess]);

  useEffect(() => {
    if (carouselInfoIsError) {
      setCarouses(pasadenaCarousels);
    }
  }, [carouselInfoIsError]);

  /**
   * 科普分类列表
   */

  const {
    data: scienceCategoryData,
    isSuccess: scienceCategoryIsSuccess,
    isError: scienceCategoryIsError,
  } = useQuery({
    queryFn: scienceCategoryList,
    queryKey: [Paths.Home, 'refresh', 'scienceCategoryList'],
  });

  useEffect(() => {
    if (scienceCategoryIsSuccess) {
      const categories = (scienceCategoryData?.data || []).filter(
        (item) => item?.name && !NON_LATIN_REGEX.test(item.name) && item?.icon,
      );
      if (categories.length > 0) {
        setCategoryList(categories);
      } else {
        setCategoryList(pasadenaCategories);
      }
    }
  }, [setCategoryList, scienceCategoryData, scienceCategoryIsSuccess]);

  useEffect(() => {
    if (scienceCategoryIsError) {
      setCategoryList(pasadenaCategories);
    }
  }, [scienceCategoryIsError]);

  /**
   * 康复中心
   */

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
      return undefined;
    },
    initialPageParam: 1,
    queryFn: (pageParam) => {
      return rehabilitationCenterList({
        ...(location?.coords || {}),
      });
    },
    queryKey: [Paths.Home, 'refresh', 'rehabilitationCenterList', location],
  });

  const handleCarouselClick = (item: any) => {
    console.log('item', item);
    if (item?.linkUrl) {
      Linking.openURL(item.linkUrl).catch((error) =>
        console.warn('Failed to open link', error),
      );
      return;
    }
    // 类型：1-图文介绍 2-科普文章 3-动态 4-个人中心页面
    switch (+item.type) {
      case 1: {
        navigation.navigate(Paths.CarouselDetail, {
          id: item.id,
        });
        break;
      }
      case 2: {
        navigation.navigate(Paths.SciencePopularizationDetail, {
          id: item.objectId,
        });
        break;
      }
      case 3: {
        navigation.navigate(Paths.DynamicDetail, {
          id: item.objectId,
        });
        break;
      }
      case 4: {
        navigation.jumpTo(Paths.Profile);
        break;
      }
    }
  };

  const renderItem = ({ index, item }) => {
    return (
      <View
        key={item.id}
        style={{ marginHorizontal: 20, marginTop: index > 0 ? 20 : 0 }}
      >
        <InstitutionItem item={item} />
      </View>
    );
  };

  const renderListHeader = () => {
    const displayCity = location?.city || 'Pasadena, CA';
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
          <View style={styles.titleWrapper}>
            <Pressable
              onPress={() => {
                navigation.navigate(Paths.SelectLocation, {
                  source: Paths.Home,
                });
              }}
              style={styles.titleLeft}
            >
              <Text
                style={{
                  ...styles.titleText,
                  color: navigationTheme.colors.primary,
                }}
              >
                {displayCity}
              </Text>
              <Image
                alt="arrow-icon"
                source={ArrowIcon as ImageURISource}
                style={styles.arrowIcon}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate(Paths.Message);
              }}
            >
              <Image
                alt="message-icon"
                source={MessageIcon as ImageURISource}
                style={styles.messageIcon}
              />

              {leaveWord?.unReadMessageNum + message?.unReadNum > 0 ? (
                <View style={styles.readFlag}></View>
              ) : undefined}
            </Pressable>
          </View>
          <View style={styles.avatarWrapper}>
            <Avatar.Image
              size={28}
              source={{
                uri: userInfo?.avatar,
              }}
            />
            <Text style={styles.nameText}>Hi,{userInfo.nickName}</Text>
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
              style={[{ flex: 1, height: 44 }, backgrounds.blue8]}
              underlineColor="transparent"
              value={searchKey}
            />
            <Pressable
              onPress={() => {
                navigation.navigate(Paths.Search, {
                  searchKey,
                });
                setTimeout(() => {
                  setSearchKey('');
                }, 100);
              }}
            >
              <Image
                alt={t('common.avatar')}
                source={SearchIcon as ImageURISource}
                style={styles.searchIcon}
              />
            </Pressable>
          </View>
          <Text style={{ ...styles.heroTagline, color: colors.gray800 }}>
            Discover adaptive sports meetups, coaching, and wellness tools across
            Pasadena.
          </Text>
        </View>
        <View style={styles.container}>
          <View style={styles.categoriesWrapper}>
            <Text style={styles.friendUpdatesTitle}>
              {t('common.popular_categories')}
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.categories}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categoryList.map((item, index) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  navigation.navigate(Paths.SciencePopularizationList, {
                    id: item.id,
                    name: item.name,
                  });
                }}
                style={styles.category}
              >
                <Image
                  source={{
                    uri: item.icon,
                  }}
                  style={styles.categoryImage}
                />
                <Text style={{ ...styles.categoryText, color: colors.gray800 }}>
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {carousels.length > 0 ? (
            <View style={styles.swiperWrapper}>
              <Carousel
                loop={carousels.length > 1}
                enabled={carousels.length > 1}
                data={carousels}
                height={154}
                onProgressChange={progress}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      handleCarouselClick(item);
                    }}
                  >
                    <Image
                      source={{
                        uri: item.image,
                      }}
                      style={styles.swiperImage}
                    />
                  </Pressable>
                )}
                width={Dimensions.get('window').width - 40}
              />
              <Pagination.Basic
                progress={progress}
                data={carousels}
                activeDotStyle={{
                  backgroundColor: '#0A8BCD',
                }}
                dotStyle={{
                  backgroundColor: 'rgba(0,0,0,0.24)',
                  width: 16,
                  height: 3,
                  borderRadius: 2.5,
                }}
                containerStyle={styles.indicatorWrapper}
              />
            </View>
          ) : undefined}
          {recommendedSciences.length > 0 ? (
            <>
              <View style={styles.friendUpdatesTitleWrapper}>
                <Text style={styles.friendUpdatesTitle}>
                  {t('common.recommended_science')}
                </Text>
                <Button
                  mode="text"
                  onPress={() => {
                    navigation.navigate(Paths.SciencePopularizationList, {
                      // 是否推荐：1-是 2-否
                      whetherRecommend: 1,
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
                {recommendedSciences.map((item) => (
                  <SciencePopularizationItem item={item} key={item.id} />
                ))}
              </ScrollView>
            </>
          ) : undefined}

          {recommendedPosts.length > 0 ? (
            <>
              <View style={styles.friendUpdatesTitleWrapper}>
                <Text style={styles.friendUpdatesTitle}>
                  {t('common.recommended_posts')}
                </Text>
                <Button
                  mode="text"
                  onPress={() => {
                    navigation.navigate(Paths.DynamicList, {
                      // 是否推荐：1-是 2-否,
                      whetherRecommend: 1,
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
                {recommendedPosts.map((item) => (
                  <FriendUpdatesItem item={item} key={item.id} />
                ))}
              </ScrollView>
            </>
          ) : undefined}

          <View style={styles.friendUpdatesTitleWrapper}>
            <Text style={styles.friendUpdatesTitle}>
              {t('common.rehabilitation_center')}
            </Text>
            <Button
              mode="text"
              onPress={() => {
                navigation.navigate(Paths.RehabilitationCenterList);
              }}
              textColor={navigationTheme.colors.primary}
            >
              {t('common.view_all')}
            </Button>
          </View>
        </View>
      </>
    );
  };

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data.pages.flatMap((item) => item?.rows || []);
  }
  const centersToRender = dataList.length > 0 ? dataList : pasadenaRehabCenters;

  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
      <SafeScreen edges={[]} style={[styles.safeScreen, backgrounds.gray1600]}>
        {renderListHeader()}
        {centersToRender.map((item, index) => renderItem({ index, item }))}
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    height: 12,
    width: 12,
  },
  avatar: {
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  avatarWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  categories: {
    columnGap: 24,
  },
  categoriesWrapper: {
    marginBottom: 18,
    marginTop: 38,
  },
  category: {
    alignItems: 'center',
    width: 71,
  },
  categoryImage: {
    height: 71,
    width: 71,
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 12,
    marginTop: 13,
    textAlign: 'center',
  },
  container: { paddingHorizontal: 20 },
  friendUpdatesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendUpdatesTitleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 38,
  },
  header: {
    backgroundColor: '#E6F1FF',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingBottom: 18,
    paddingHorizontal: 20,
  },
  heroTagline: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
  },
  messageIcon: {
    height: 40,
    width: 40,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  safeScreen: {
    flex: 1,
    paddingBottom: 10,
  },
  searchIcon: {
    height: 44,
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  searchWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 26,
  },
  swiperImage: {
    borderRadius: 18,
    height: 154,
    width: '100%',
  },
  indicatorWrapper: {
    position: 'absolute',
    bottom: 9,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  swiperWrapper: {
    marginTop: 38,
    position: 'relative',
  },
  textInputOutline: {
    borderRadius: 12,
  },
  titleLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 15,
  },
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  updates: {
    columnGap: 15,
  },
  updatesTitle: {
    fontSize: 20,
  },
  readFlag: {
    backgroundColor: '#F2262F',
    borderRadius: '50%',
    height: 8,
    position: 'absolute',
    right: 10,
    top: 10,
    width: 8,
  },
  updatesTitleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
    marginBottom: 18,
    marginTop: 38,
  },
});

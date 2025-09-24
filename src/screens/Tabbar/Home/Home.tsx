import type { RootScreenProps } from "@/navigation/types.ts";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageURISource,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useShallow } from "zustand/react/shallow";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";
import { Analytics } from "@/utils";

import InstitutionItem from "@/components/common/InstitutionItem/InstitutionItem.tsx";
import { SafeScreen } from "@/components/templates";
import FriendUpdatesItem from "@/screens/Tabbar/Dynamic/components/FriendUpdatesItem/FriendUpdatesItem.tsx";

import ArrowIcon from "@/assets/images/17.png";
import MessageIcon from "@/assets/images/18.png";
import SearchIcon from "@/assets/images/19.png";

import {
  navigatorQuickActions,
  navigatorSpotlights,
  navigatorWorkflow,
  pasadenaCarousels,
  pasadenaCategories,
  pasadenaCommunityHighlights,
  pasadenaKnowledgeSpotlights,
  pasadenaRehabCenters,
} from "@/data/pasadenaContent.ts";

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
} from "@/services";
import { useLocationStore, useUserStore } from "@/store";
import { useFocusEffect } from "@react-navigation/native";
import SciencePopularizationItem from "@/components/common/SciencePopularizationItem/SciencePopularizationItem.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalizeImageUrl, DEFAULT_PLACEHOLDER } from "@/utils/image";
import { ImageWithFallback } from "@/components/atoms";

const NON_LATIN_REGEX = /[^\x00-\x7F]/;

export default function Home({ navigation }: RootScreenProps<Paths.Home>) {
  const { backgrounds, colors, navigationTheme, variant } = useTheme();
  const [searchKey, setSearchKey] = useState("");
  const [categoryList, setCategoryList] = useState(pasadenaCategories);
  const [recommendedPosts, setRecommendedPosts] = useState(
    pasadenaCommunityHighlights
  );
  const [recommendedSciences, setRecommendedSciences] = useState(
    pasadenaKnowledgeSpotlights
  );
  const [carousels, setCarouses] = useState(pasadenaCarousels);
  const [message, setMessage] = useState({});
  const [leaveWord, setLeaveWord] = useState({});
  const progress = useSharedValue<number>(0);
  const [userInfo, setUserInfo] = useUserStore(
    useShallow((state) => [state.userInfo, state.setUserInfo])
  );
  const location = useLocationStore((state) => state.location);

  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      if (__DEV__) Analytics.screen("Home");
      queryClient.refetchQueries({
        queryKey: [Paths.Home, "refresh"],
        type: "active",
      });
      return () => {};
    }, [queryClient])
  );

  const { data: messageData, isSuccess: messageIsSuccess } = useQuery({
    queryFn: getUnReadNumAndLatest,
    queryKey: [Paths.Home, "refresh", "getUnReadNumAndLatest"],
  });

  const { data: leaveWordData, isSuccess: leaveWordIsSuccess } = useQuery({
    queryFn: getLeaveWordUnReadNumAndLatest,
    queryKey: [Paths.Home, "refresh", "getLeaveWordUnReadNumAndLatest"],
  });

  useEffect(() => {
    if (__DEV__) console.log("messageData", messageData);
    if (messageIsSuccess) {
      setMessage(messageData.data || {});
    }
  }, [setMessage, messageData, messageIsSuccess]);

  useEffect(() => {
    if (leaveWordIsSuccess) {
      setLeaveWord(leaveWordData?.data || {});
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
    queryKey: [Paths.Home, "refresh", "scienceList"],
  });

  useEffect(() => {
    if (recommendedSciencesIsSuccess) {
      const rows = recommendedSciencesData?.rows || [];
      const englishRows = rows.filter(
        (item) =>
          item?.title &&
          typeof item.title === "string" &&
          !NON_LATIN_REGEX.test(item.title)
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
    queryKey: [Paths.Home, "refresh", "postList"],
  });

  useEffect(() => {
    if (recommendedPostsIsSuccess) {
      const rows = recommendedPostsData?.rows || [];
      const englishRows = rows.filter((item) => {
        const isContentEnglish =
          item?.content && typeof item.content === "string"
            ? !NON_LATIN_REGEX.test(item.content)
            : false;
        const hasMedia = Boolean(item?.pictures || item?.videos);
        const isAuthorEnglish =
          item?.user?.nickName && typeof item.user.nickName === "string"
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
    queryKey: [Paths.Home, "getLoginUser"],
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
    queryKey: [Paths.Home, "refresh", "carouselList"],
  });

  useEffect(() => {
    if (carouselInfoIsSuccess) {
      const items = (carouselInfoData?.data || []).filter(
        (item) => item?.image
      );
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
    queryKey: [Paths.Home, "refresh", "scienceCategoryList"],
  });

  useEffect(() => {
    if (scienceCategoryIsSuccess) {
      const categories = (scienceCategoryData?.data || []).filter(
        (item) => item?.name && !NON_LATIN_REGEX.test(item.name) && item?.icon
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

  const { data, hasNextPage } = useInfiniteQuery({
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
    queryKey: [Paths.Home, "refresh", "rehabilitationCenterList", location],
  });

  const openExternalLink = (url?: string) => {
    if (!url) {
      return;
    }
    Linking.openURL(url).catch((error) =>
      console.warn("Failed to open link", error)
    );
  };

  const handleCarouselClick = (item: any) => {
    console.log("item", item);
    if (item?.linkUrl) {
      openExternalLink(item.linkUrl);
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
    const displayCity = location?.city || "Pasadena, CA";
    return (
      <>
        <StatusBar
          backgroundColor={navigationTheme.colors.background}
          barStyle={variant === "dark" ? "light-content" : "dark-content"}
        />
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top || StatusBar.currentHeight,
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
              placeholder={"Search for services"}
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
                  setSearchKey("");
                }, 100);
              }}
            >
              <Image
                alt={"search"}
                source={SearchIcon as ImageURISource}
                style={styles.searchIcon}
              />
            </Pressable>
          </View>
          <Text style={styles.heroBadge}>Adaptive Sport Navigator</Text>
          <Text style={{ ...styles.heroTagline, color: colors.gray800 }}>
            Start your adaptive sports journey
          </Text>
          <Text style={{ ...styles.heroDescription, color: colors.gray500 }}>
            Discover programs, plan transit, and get support.
          </Text>
          <Button
            mode="contained"
            uppercase={false}
            onPress={() => {
              openExternalLink(navigatorQuickActions[0]?.linkUrl);
            }}
            style={styles.navigatorButton}
            contentStyle={styles.navigatorButtonContent}
            labelStyle={styles.navigatorButtonLabel}
          >
            {"Start navigator call"}
          </Button>
        </View>
        <View style={styles.container}>
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <Text style={{ ...styles.sectionCaption, color: colors.gray500 }}>
                Jump into the most common tasks
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActions}
            >
              {navigatorQuickActions.map((action) => (
                <Pressable
                  key={action.id}
                  accessibilityRole="button"
                  onPress={() => {
                    openExternalLink(action.linkUrl);
                  }}
                  style={styles.quickActionCard}
                >
                  <ImageWithFallback
                    uri={action.icon}
                    style={styles.quickActionImage}
                  />
                  <View style={styles.quickActionContent}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text
                      numberOfLines={3}
                      style={{
                        ...styles.quickActionDescription,
                        color: colors.gray500,
                      }}
                    >
                      {action.description}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.workflowSection}>
            <Text style={styles.sectionTitle}>Navigator workflow</Text>
            <Text style={{ ...styles.sectionCaption, color: colors.gray500 }}>
              How it works from intake to activity
            </Text>
            <View style={styles.workflowSteps}>
              {navigatorWorkflow.map((step, index) => (
                <View key={step.id} style={styles.workflowCard}>
                  <View style={styles.workflowBadge}>
                    <Text style={styles.workflowBadgeText}>{index + 1}</Text>
                  </View>
                  <View style={styles.workflowContent}>
                    <Text style={styles.workflowTitle}>{step.title}</Text>
                    <Text
                      style={{
                        ...styles.workflowDescription,
                        color: colors.gray500,
                      }}
                    >
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.spotlightSection}>
            <Text style={styles.sectionTitle}>
              Transit & equipment spotlights
            </Text>
            <Text style={{ ...styles.sectionCaption, color: colors.gray500 }}>
              Highlights from the community
            </Text>
            {navigatorSpotlights.map((spotlight) => (
              <Pressable
                key={spotlight.id}
                accessibilityRole="button"
                onPress={() => {
                  openExternalLink(spotlight.linkUrl);
                }}
                style={styles.spotlightCard}
              >
                <ImageWithFallback
                  uri={spotlight.image}
                  style={styles.spotlightImage}
                />
                <View style={styles.spotlightContent}>
                  <Text style={styles.spotlightBadge}>{spotlight.badge}</Text>
                  <Text style={styles.spotlightTitle}>{spotlight.title}</Text>
                  <Text
                    style={{
                      ...styles.spotlightDescription,
                      color: colors.gray500,
                    }}
                  >
                    {spotlight.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.categoriesWrapper}>
            <Text style={styles.friendUpdatesTitle}>Popular categories</Text>
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
                <ImageWithFallback
                  uri={item.icon}
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
                    <ImageWithFallback
                      uri={normalizeImageUrl(item.image)}
                      style={styles.swiperImage}
                    />
                  </Pressable>
                )}
                width={Dimensions.get("window").width - 40}
              />
              <Pagination.Basic
                progress={progress}
                data={carousels}
                activeDotStyle={{
                  backgroundColor: "#0A8BCD",
                }}
                dotStyle={{
                  backgroundColor: "rgba(0,0,0,0.24)",
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
                  {"Recommended knowledge"}
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
                  {"View all"}
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
                  {"Recommended posts"}
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
                  {"View all"}
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
              Rehabilitation centers
            </Text>
            <Button
              mode="text"
              onPress={() => {
                navigation.navigate(Paths.RehabilitationCenterList);
              }}
              textColor={navigationTheme.colors.primary}
            >
              {"View all"}
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

  // Survey removed for demo

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
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 119, 210, 0.12)",
    borderRadius: 999,
    color: "#0077D2",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  navigatorButton: {
    alignSelf: "flex-start",
    borderRadius: 12,
    marginTop: 16,
  },
  navigatorButtonContent: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  navigatorButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  quickActionsSection: {
    marginTop: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionCaption: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  quickActions: {
    columnGap: 16,
    paddingRight: 20,
  },
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    width: 220,
    shadowColor: "#001C40",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  quickActionImage: {
    borderRadius: 14,
    height: 100,
    width: "100%",
  },
  quickActionContent: {
    marginTop: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickActionDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  workflowSection: {
    marginTop: 40,
  },
  workflowSteps: {
    marginTop: 20,
    rowGap: 16,
  },
  workflowCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    gap: 16,
    padding: 16,
    shadowColor: "#001C40",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  workflowBadge: {
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 210, 0.12)",
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  workflowBadgeText: {
    color: "#0077D2",
    fontSize: 16,
    fontWeight: "700",
  },
  workflowContent: {
    flex: 1,
  },
  workflowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  workflowDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  spotlightSection: {
    marginTop: 40,
  },
  spotlightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#001C40",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  spotlightImage: {
    height: 150,
    width: "100%",
  },
  spotlightContent: {
    padding: 16,
  },
  spotlightBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 119, 210, 0.12)",
    borderRadius: 999,
    color: "#0077D2",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  spotlightDescription: {
    fontSize: 13,
    lineHeight: 20,
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
    alignItems: "center",
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
    textAlign: "center",
  },
  container: { paddingHorizontal: 20 },
  friendUpdatesTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  friendUpdatesTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 38,
  },
  header: {
    backgroundColor: "#E6F1FF",
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
    fontWeight: "bold",
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
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },
  swiperImage: {
    borderRadius: 18,
    height: 154,
    width: "100%",
  },
  indicatorWrapper: {
    position: "absolute",
    bottom: 9,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  swiperWrapper: {
    marginTop: 38,
    position: "relative",
  },
  textInputOutline: {
    borderRadius: 12,
  },
  titleLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 15,
  },
  titleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  updates: {
    columnGap: 15,
  },
  updatesTitle: {
    fontSize: 20,
  },
  readFlag: {
    backgroundColor: "#F2262F",
    borderRadius: "50%",
    height: 8,
    position: "absolute",
    right: 10,
    top: 10,
    width: 8,
  },
  updatesTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 30,
    marginBottom: 18,
    marginTop: 38,
  },
});

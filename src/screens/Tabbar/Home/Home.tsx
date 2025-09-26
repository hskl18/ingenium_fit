import type { RootScreenProps } from "@/navigation/types.ts";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageURISource,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
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

import {
  pasadenaCarousels,
  pasadenaCommunityHighlights,
  pasadenaKnowledgeSpotlights,
  pasadenaRehabCenters,
} from "@/data/pasadenaContent.ts";

import {
  carouselList,
  getLoginUser,
  postList,
  rehabilitationCenterList,
  scienceList,
} from "@/services";
import { useLocationStore, useUserStore } from "@/store";
import { useFocusEffect } from "@react-navigation/native";
import SciencePopularizationItem from "@/components/common/SciencePopularizationItem/SciencePopularizationItem.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalizeImageUrl } from "@/utils/image";
import { ImageWithFallback } from "@/components/atoms";

const NON_LATIN_REGEX = /[^\x00-\x7F]/;

const AI_DAILY_SUGGESTIONS = [
  {
    id: "check-in",
    title: "Daily check-in",
    description: "Log how you're feeling so the assistant can adapt support.",
  },
  {
    id: "plan",
    title: "Plan today",
    description: "Let AI suggest activities, rides, and reminders in seconds.",
  },
  {
    id: "discover",
    title: "Discover inspiration",
    description: "Ask for fresh adaptive ideas matched to your goals.",
  },
];

export default function Home({ navigation }: RootScreenProps<Paths.Home>) {
  const { backgrounds, colors, navigationTheme, variant } = useTheme();
  const [searchKey, setSearchKey] = useState("");
  const [recommendedPosts, setRecommendedPosts] = useState(
    pasadenaCommunityHighlights
  );
  const [recommendedSciences, setRecommendedSciences] = useState(
    pasadenaKnowledgeSpotlights
  );
  const [carousels, setCarouses] = useState(pasadenaCarousels);
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

  const launchAssistantConversation = useCallback(
    (prompt?: string) => {
      const base = typeof prompt === "string" ? prompt : searchKey;
      const trimmed = base.trim();

      navigation.navigate(Paths.ChatDetail, {
        assistantOnly: true,
        initialPrompt: trimmed.length > 0 ? trimmed : undefined,
        userId: "assistant",
      });

      setSearchKey("");
    },
    [navigation, searchKey]
  );

  const handleSearchSubmit = useCallback(() => {
    launchAssistantConversation();
  }, [launchAssistantConversation]);

  const handleAssistantLaunch = useCallback(() => {
    launchAssistantConversation();
  }, [launchAssistantConversation]);

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
          id: String(item.id ?? ''),
          image: item.image,
          title: item.title,
          description: item.description,
          payload: item,
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
        let pictures: string[] = [];
        let videos: string[] = [];

        const itemPictures = item?.pictures ?? item?.images;
        if (Array.isArray(itemPictures)) {
          pictures = itemPictures.filter(Boolean).map((value) => String(value));
        } else if (typeof itemPictures === "string") {
          pictures = itemPictures
            .split(",")
            .map((value: string) => value.trim())
            .filter(Boolean);
        } else if (typeof item?.image === "string") {
          pictures = [item.image];
        }

        const rawVideos = item?.videos;
        if (Array.isArray(rawVideos)) {
          videos = rawVideos.filter(Boolean).map((value) => String(value));
        } else if (typeof rawVideos === "string") {
          videos = rawVideos
            .split(",")
            .map((value: string) => value.trim())
            .filter(Boolean);
        }

        const firstImage = pictures[0] || item?.coverImage || item?.image;
        const picturesParam = pictures.length
          ? pictures.join(",")
          : typeof item?.pictures === "string"
          ? item.pictures
          : undefined;
        const videosParam = videos.length
          ? videos.join(",")
          : typeof item?.videos === "string"
          ? item.videos
          : undefined;

        navigation.navigate(Paths.DynamicDetail, {
          id: String(item.objectId ?? item.id ?? ""),
          payload: item,
          pictures: picturesParam,
          videos: videosParam,
          image: firstImage,
          coverImage: firstImage,
          content: item?.content,
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
    const displayName = userInfo?.nickName || "Explorer";
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
            <TouchableOpacity
              accessibilityHint="Opens the location picker"
              accessibilityLabel={`Current location ${displayCity}`}
              accessibilityRole="button"
              hitSlop={8}
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
            </TouchableOpacity>
          </View>
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <Avatar.Image
                size={56}
                source={{
                  uri: userInfo?.avatar,
                }}
              />
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroGreeting}>{`Hi, ${displayName}`}</Text>
                <Text style={styles.heroSubheading}>Your daily AI companion</Text>
              </View>
            </View>
            <Text style={styles.heroBadge}>AI daily brief</Text>
            <Text style={styles.heroTagline}>Plan · Adapt · Shine</Text>
            <Text style={styles.heroDescription}>
              Get quick suggestions, reminders, and support tailored to today.
            </Text>
            <View style={styles.searchWrapper}>
              <TextInput
                accessibilityLabel="Ask the AI assistant"
                activeUnderlineColor="transparent"
                inputMode="search"
                keyboardType="default"
                label=""
                maxLength={255}
                mode="outlined"
                onChangeText={(text) => {
                  setSearchKey(text);
                }}
                outlineColor="transparent"
                outlineStyle={styles.textInputOutline}
                placeholder={"Ask the assistant"}
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                returnKeyType="search"
                selectionColor="rgba(255, 255, 255, 0.8)"
                style={styles.searchInput}
                underlineColor="transparent"
                value={searchKey}
                onSubmitEditing={() => {
                handleSearchSubmit();
                }}
              />
            </View>
            <TouchableOpacity
              accessibilityHint="Opens the updates feed for more ideas"
              accessibilityLabel="Open AI suggestions"
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={handleAssistantLaunch}
              style={styles.navigatorCta}
            >
              <Text style={styles.navigatorCtaText}>Open AI suggestions</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.aiSection}>
            <Text style={styles.sectionTitle}>AI daily suggestions</Text>
            <Text style={{ ...styles.sectionCaption, color: colors.gray500 }}>
              Stay on track with quick prompts you can act on now
            </Text>
            {AI_DAILY_SUGGESTIONS.map((suggestion) => (
              <View key={suggestion.id} style={styles.aiCard}>
                <Text style={styles.aiCardTitle}>{suggestion.title}</Text>
                <Text
                  style={{
                    ...styles.aiCardDescription,
                    color: colors.gray500,
                  }}
                >
                  {suggestion.description}
                </Text>
              </View>
            ))}
          </View>

          {carousels.length > 0 ? (
            <View style={styles.swiperWrapper}>
              <Carousel
                loop={carousels.length > 1}
                enabled={carousels.length > 1}
                data={carousels}
                height={154}
                onProgressChange={progress}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    accessibilityHint={item.title || "Opens featured content"}
                    accessibilityLabel={item.title || "Featured highlight"}
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={() => {
                      handleCarouselClick(item);
                    }}
                  >
                    <ImageWithFallback
                      uri={normalizeImageUrl(item.image)}
                      style={styles.swiperImage}
                    />
                  </TouchableOpacity>
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
  heroCard: {
    backgroundColor: "#0A83D1",
    borderRadius: 24,
    gap: 14,
    marginTop: 20,
    padding: 20,
    shadowColor: "#001C40",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 4,
  },
  heroHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  heroTextGroup: {
    flex: 1,
    gap: 2,
  },
  heroGreeting: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  heroSubheading: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    lineHeight: 18,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 999,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  heroDescription: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  heroTagline: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
    marginTop: 8,
  },
  navigatorCta: {
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: "#001C40",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  navigatorCtaText: {
    color: "#0A1F44",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  aiSection: {
    gap: 16,
    marginTop: 32,
  },
  aiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#001C40",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  aiCardDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
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
    backgroundColor: "#F2F6FB",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    gap: 12,
  },
  safeScreen: {
    flex: 1,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  searchWrapper: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: "transparent",
    color: "#FFFFFF",
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
    justifyContent: "flex-start",
    marginTop: 14,
  },
  updates: {
    columnGap: 15,
  },
  updatesTitle: {
    fontSize: 20,
  },
  updatesTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 30,
    marginBottom: 18,
    marginTop: 38,
  },
});

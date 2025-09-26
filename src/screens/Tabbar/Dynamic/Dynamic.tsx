import type { RootScreenProps } from "@/navigation/types.ts";
import { LegendList } from "@legendapp/list";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageURISource,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import DynamicItem from "@/components/common/DynamicItem/DynamicItem.tsx";
import Empty from "@/components/common/Empty/Empty.tsx";
import { SafeScreen } from "@/components/templates";
import DynamicSort from "@/screens/Tabbar/Dynamic/components/DynamicSort/DynamicSort.tsx";
import FriendUpdatesItem from "@/screens/Tabbar/Dynamic/components/FriendUpdatesItem/FriendUpdatesItem.tsx";

import FilterIcon from "@/assets/images/51.png";
import EditIcon from "@/assets/images/54.png";
import { dynamicsCategoryList, postList } from "@/services";
import TabMenu from "@/components/common/TabMenu/TabMenu.tsx";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dynamic({
  navigation,
}: RootScreenProps<Paths.Dynamic>) {
  const { backgrounds, colors, navigationTheme, variant } = useTheme();
  const [selectType, setSelectType] = useState<number>(1);
  const [whetherRecommend, setWhetherRecommend] = useState<number | undefined>(
    1
  );
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [visibleSort, setVisibleSort] = useState(false);
  const [sortBy, setSortBy] = useState("");
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
        type: "active",
      });
      // Do something when the screen is focused
      return () => {};
    }, [])
  );

  const { data: categoryData, isSuccess: categoryIsSuccess } = useQuery({
    queryFn: dynamicsCategoryList,
    queryKey: [Paths.Dynamic, "dynamicsCategoryList"],
  });

  useEffect(() => {
    console.log("categoryData", categoryData);
    if (categoryIsSuccess) {
      const list = Array.isArray(categoryData?.data) ? categoryData.data : [];
      setCategoryList(list);
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
      queryKey: [Paths.Dynamic, "Friend-Updates"],
    });
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    enabled: !!categoryList.length,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      const rows = (lastPage as any)?.rows;
      const items = (lastPage as any)?.data?.items || (lastPage as any)?.items;
      const length = Array.isArray(rows)
        ? rows.length
        : Array.isArray(items)
          ? items.length
          : 0;
      if (!length || length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam) => {
      console.log("selectedIndex", selectedIndex);
      return postList({
        sortBy,
        whetherRecommend,
        dynamicsPostCategoryId: categoryList[selectedIndex]?.id,
        page: (pageParam as any).pageParam,
        // 查询类型：1-Friend Updates朋友动态  2-Recently最近的
        selectType,
      });
    },
    queryKey: [
      Paths.Dynamic,
      "postList",
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
    flag: "recommend" | "recently"
  ) => {
    if (flag === "recommend") {
      setWhetherRecommend(1);
      setSelectType(1);
    }

    if (flag === "recently") {
      setWhetherRecommend(undefined);
      setSelectType(2);
    }
  };

  const onRefresh = () => {
    queryClient.refetchQueries({
      queryKey: [Paths.Dynamic, "postList"],
      type: "active",
    });
  };

  let dataList: any[] = [];
  if (data?.pages) {
    dataList = (data.pages as any[]).flatMap((page, pageIndex) => {
      const rows = (page as any)?.rows;
      const items = (page as any)?.data?.items || (page as any)?.items;
      const list = Array.isArray(rows)
        ? rows
        : Array.isArray(items)
          ? items
          : [];
      return list.map((row: any, rowIndex: number) => ({
        ...row,
        __legendKey: `${row?.id ?? "dynamic"}-${pageIndex}-${rowIndex}`,
      }));
    });
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (!item) return null;
    return (
      <View
        key={item.id ?? index}
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
          <View style={styles.heroCard}>
            <Text style={styles.heroBadge}>{"Community"}</Text>
            <Text style={styles.titleText}>{"Community hub"}</Text>
            <Text style={styles.heroSubtitle}>
              {"Share wins, ask for advice, and celebrate progress together."}
            </Text>
            <TouchableOpacity
              accessibilityHint={"Opens the publish screen"}
              accessibilityLabel={"Create a community update"}
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => {
                navigation.navigate(Paths.DynamicPublish);
              }}
              style={styles.publishCta}
            >
              <Image
                alt="Create an update"
                source={EditIcon as ImageURISource}
                style={styles.publishCtaIcon}
              />
              <Text style={styles.publishCtaLabel}>{"Create an update"}</Text>
            </TouchableOpacity>
          </View>
          {categoryList.length > 0 ? (
            <>
              <Text style={{ ...styles.topicIntro, color: colors.gray500 }}>
                {"Topics from the community"}
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
          {friendUpdatesIsSuccess &&
          friendUpdatesData?.data?.items?.length > 0 ? (
            <>
              <View style={styles.friendUpdatesTitleWrapper}>
                <Text style={styles.friendUpdatesTitle}>Peer spotlights</Text>
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
                  {"View all"}
                </Button>
              </View>
              <ScrollView
                contentContainerStyle={styles.updates}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {friendUpdatesData.data.items.map((item: any, idx: number) => (
                  <View key={`${item?.id ?? "friend-update"}-${idx}`}>
                    <FriendUpdatesItem item={item} index={idx} />
                  </View>
                ))}
              </ScrollView>
            </>
          ) : undefined}

          <View style={styles.updatesTitleWrapper}>
            <View style={styles.updatesTitleWrapperLeft}>
              <TouchableOpacity
                accessibilityLabel="Recommended feed"
                accessibilityRole="tab"
                accessibilityState={{ selected: +(whetherRecommend ?? 0) === 1 }}
                activeOpacity={0.85}
                onPress={() => {
                  handleSetUpdatesType(1, "recommend");
                }}
                style={[
                  styles.updatesTab,
                  +(whetherRecommend ?? 0) === 1 && styles.updatesTabActive,
                ]}
              >
                <Text
                  style={{
                    ...styles.updatesTitle,
                    color:
                      +(whetherRecommend ?? 0) === 1
                        ? "#0A1F44"
                        : colors.gray800,
                  }}
                >
                  {"Recommended"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Most recent feed"
                accessibilityRole="tab"
                accessibilityState={{ selected: +selectType === 2 }}
                activeOpacity={0.85}
                onPress={() => {
                  handleSetUpdatesType(1, "recently");
                }}
                style={[
                  styles.updatesTab,
                  +selectType === 2 && styles.updatesTabActive,
                ]}
              >
                <Text
                  style={{
                    ...styles.updatesTitle,
                    color:
                      +selectType === 2 ? "#0A1F44" : colors.gray800,
                  }}
                >
                  {"Recent"}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              accessibilityHint="Open sorting options"
              accessibilityLabel="Filter feed"
              accessibilityRole="button"
              hitSlop={8}
              onPress={showSortModal}
              style={styles.filterButton}
            >
              <Image
                source={FilterIcon as ImageURISource}
                style={styles.filterIcon}
              ></Image>
            </TouchableOpacity>
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
        keyExtractor={(item: any, idx: number) => item?.__legendKey ?? `${idx}`}
        onEndReached={() => {
          // LegendList expects a callback, not RN FlatList signature
          fetchNextPage();
        }}
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
  filterButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40,
    shadowColor: "#001C40",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  filterIcon: {
    height: 18,
    tintColor: "#0A8BCD",
    width: 18,
  },
  friendUpdatesTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  header: {
    backgroundColor: "#F2F6FB",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  safeScreen: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: "#0A8BCD",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginTop: 24,
    shadowColor: "#001C40",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 4,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 999,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 28,
    marginTop: 16,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  publishCta: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#001C40",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 3,
  },
  publishCtaIcon: {
    height: 20,
    tintColor: "#0A1F44",
    width: 20,
  },
  publishCtaLabel: {
    color: "#0A1F44",
    fontSize: 15,
    fontWeight: "700",
  },
  updates: {
    columnGap: 15,
    marginBottom: 38,
  },
  friendUpdatesTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  updatesTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  updatesTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  updatesTitleWrapperLeft: {
    flexDirection: "row",
    gap: 12,
  },
  updatesTab: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#001C40",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 1,
  },
  updatesTabActive: {
    backgroundColor: "#EAF4FF",
  },
  topicIntro: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: 24,
  },
});

import { LegendList } from "@legendapp/list";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks";
import {
  Dimensions,
  Image,
  ImageURISource,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { showLocation } from "react-native-map-link";
import { Pressable } from "react-native-gesture-handler";
import { Avatar, Text } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Toast from "react-native-root-toast";
import { WebView } from "react-native-webview";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";
import { ImageWithFallback } from "@/components/atoms";
import CommentItem from "@/screens/RehabilitationCenter/components/CommentItem/CommentItem.tsx";
import DoctorItem from "@/screens/RehabilitationCenter/components/DoctorItem/DoctorItem.tsx";

import LocationIcon from "@/assets/images/142.png";
import BackIcon from "@/assets/images/222.png";
import CollectIcon from "@/assets/images/223.png";
import CollectFIcon from "@/assets/images/225.png";
import FilterIcon from "@/assets/images/604.png";
import { centerDetail, commentList, doctorList, favorite } from "@/services";
import { Rating } from "@kolking/react-native-rating";
import { useLocationStore } from "@/store";
import { Configs } from "@/common/configs.ts";
import { useFocusEffect } from "@react-navigation/native";
import GalleryPreview from "react-native-gallery-preview";

export default function RehabilitationCenterDetail({
  navigation,
  route,
}: RootScreenProps<Paths.RehabilitationCenterDetail>) {
  const { backgrounds, colors } = useTheme();
  const { id } = route.params;
  const progress = useSharedValue<number>(0);
  const [post, setPost] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const location = useLocationStore((state) => state.location);

  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.RehabilitationCenterDetail],
        type: "active",
      });
      return () => {};
    }, [])
  );

  const mutation = useMutation({
    mutationFn: favorite,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        setPost((post) => ({
          ...post,
          whetherFavoriteByLoginUser: !post.whetherFavoriteByLoginUser,
        }));
        Toast.show(
          post.whetherFavoriteByLoginUser
            ? "Removed from favorites"
            : "Added to favorites",
          {
            animation: true,
            delay: 0,
            duration: 1000,
            hideOnPress: true,
            position: Toast.positions.CENTER,
            shadow: true,
          }
        );
      }
    },
  });

  const handleToggleCollect = useCallback(() => {
    if (!post.id) {
      return;
    }
    mutation.mutate({
      objectId: post.id,
      // 收藏对象类型：1-康复中心 2-科普 3-动态
      objectType: 1,
    });
  }, [post, mutation]);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerBtnGroup}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={BackIcon as ImageURISource}
                style={styles.headerBtnIcon}
              />
            </Pressable>
          </View>
        );
      },
      headerRight: () => {
        if (!post.id) {
          return undefined;
        }
        return (
          <View style={styles.headerBtnGroup}>
            <Pressable onPress={handleToggleCollect}>
              {post.whetherFavoriteByLoginUser ? (
                <Image
                  source={CollectFIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                />
              ) : (
                <Image
                  source={CollectIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                />
              )}
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation, post, handleToggleCollect]);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => {
      return centerDetail({
        ...(location?.coords || {}),
        id,
      });
    },
    queryKey: [Paths.RehabilitationCenterDetail, "centerDetail", id],
  });

  useEffect(() => {
    if (postDataIsSuccess) {
      setPost(postData.data || {});
    }
  }, [setPost, postData, postDataIsSuccess]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isSuccess,
  } = useInfiniteQuery({
    enabled: selectedIndex !== 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (__DEV__) console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    queryFn: async (pageParam) => {
      if (selectedIndex === 1) {
        return doctorList({
          page: pageParam.pageParam,
          rehabilitationCenterId: post.id,
        });
      }

      if (selectedIndex === 2) {
        return commentList({
          page: pageParam.pageParam,
          // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
          objectId: post.id,
          objectType: 3,
        });
      }
    },
    queryKey: [
      Paths.RehabilitationCenterDetail,
      "doctorList",
      "commentList",
      post,
      selectedIndex,
    ],
  });

  const renderDescription = useCallback(() => {
    return (
      <WebView
        automaticallyAdjustContentInsets
        injectedJavaScript={`
        document.body.style.overflow = 'hidden';
          document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              window.ReactNativeWebView.postMessage(link.href);
            });
          });
          setTimeout(function() { 
                        window.ReactNativeWebView.postMessage(String(document.body.scrollHeight|| ''));
          }, 100); // a slight delay seems to yield a more accurate value
           true;
        `}
        onError={(e) => {
          console.log(e);
        }}
        onLoadProgress={() => {
          console.log("loading…");
        }}
        onMessage={(event) => {
          const payload = event?.nativeEvent?.data;
          if (!payload) {
            return;
          }

          const parsedHeight = Number.parseInt(payload, 10);

          if (Number.isNaN(parsedHeight)) {
            // Non-numeric payloads are link clicks; treat them as external URLs.
            const maybeUrl = payload.trim();
            if (maybeUrl.startsWith("http")) {
              Linking.openURL(maybeUrl).catch((error) =>
                console.warn("Failed to open link from webview payload", error)
              );
            }
            return;
          }

          setSectionHeight(parsedHeight);
        }}
        originWhitelist={["*"]}
        overScrollMode="never"
        scalesPageToFit={Platform.OS === "ios"}
        scrollEnabled={false}
        source={{
          html:
            Configs.HtmlHead + `<body><div>${post.detail || ""}</div></body>`,
        }}
        style={[
          {
            height: sectionHeight,
          },
        ]}
      />
    );
  }, [post, sectionHeight]);

  const images = useMemo(() => {
    let pictures = [];
    if (post.backgroundImages) {
      pictures = post.backgroundImages?.split(",").map((img) => ({
        uri: img,
        type: "image",
      }));
    }
    return pictures;
  }, [post]);

  const postImages = useMemo(() => {
    return post.backgroundImages ? post.backgroundImages?.split(",") : [];
  }, [post]);

  let dataList = [];
  if (data?.pages && data?.pages.length) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }

  const handlePreview = (item) => {
    setIsVisible(true);
    setInitialIndex(images.findIndex((img) => img.uri === item));
  };

  const handleShowLocation = () => {
    showLocation({
      latitude: +post.latitude,
      longitude: +post.longitude,
      title: post.address,
      appsWhiteList: ["google-maps", "apple-maps"],
    });
  };

  const RenderListHeader = useCallback(() => {
    return (
      <View>
        <Carousel
          data={postImages}
          height={211}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                handlePreview(item);
              }}
            >
              <ImageWithFallback
                uri={String(item)}
                style={styles.carouselImg}
              />
            </Pressable>
          )}
          width={Dimensions.get("window").width}
        />
        <View style={[styles.info, backgrounds.gray1600]}>
          <Text style={styles.titleText}>{post.name}</Text>

          <View style={styles.locationWrapper}>
            <View style={styles.locationLeft}>
              <Text style={{ ...styles.locationText }}>{post.address}</Text>
              {post.distance ? (
                <Text style={{ ...styles.distanceText, color: colors.gray800 }}>
                  {post.distance}km
                </Text>
              ) : undefined}
            </View>
            <Pressable onPress={handleShowLocation}>
              <Image
                source={LocationIcon as ImageURISource}
                style={styles.locationIcon}
              />
            </Pressable>
          </View>

          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{post.star}</Text>
            <Rating
              disabled
              size={12}
              rating={+post.star}
              fillColor="#333"
              touchColor="#000"
            />
          </View>
        </View>
        <View style={[{ height: 8 }, backgrounds.gray1550]} />
      </View>
    );
  }, [post, progress, navigation]);

  const renderSegmentedControl = () => {
    return (
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          selectedIndex={selectedIndex}
          sliderStyle={styles.segmentedControlSlider}
          style={styles.segmentedControl}
          values={["Description", "Medical team", "Evaluation"]}
        />
      </View>
    );
  };
  const renderCommentTitle = () => {
    return (
      <View style={styles.evaluationTitleWrapper}>
        <View style={styles.evaluationTitleLeft}>
          <View style={styles.commentStar}>
            <Text style={{ ...styles.commentStarText, color: colors.gray1600 }}>
              {post.star}
            </Text>
          </View>
          <View>
            <Text>{"Very good"}</Text>
            <Text>
              {post.commentNum || 0}
              {"Reviews count"}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate(Paths.RehabilitationCenterEvaluate, {
              id: post.id,
              name: post.name,
              coverImage: post.coverImage,
            });
          }}
          style={[
            styles.button,
            {
              borderColor: colors.primary,
            },
          ]}
        >
          <Image
            source={FilterIcon as ImageURISource}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonLabel}>{"Write evaluation"}</Text>
        </Pressable>
      </View>
    );
  };

  const renderDoctorItem = ({ index, item }) => {
    return (
      <View key={item.id}>
        <DoctorItem item={item} />
      </View>
    );
  };
  const renderCommentItem = ({ index, item }) => {
    return (
      <View key={item.id}>
        <CommentItem item={item} />
      </View>
    );
  };

  console.log(hasNextPage, data);

  return (
    <>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        {selectedIndex === 0 ? (
          <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
            <RenderListHeader />
            {renderSegmentedControl()}
            {renderDescription()}
          </ScrollView>
        ) : undefined}
        {selectedIndex === 1 ? (
          <LegendList
            contentContainerStyle={styles.container}
            data={dataList}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                <RenderListHeader />
                {renderSegmentedControl()}
              </>
            }
            onEndReached={fetchNextPage}
            renderItem={renderDoctorItem}
          />
        ) : undefined}
        {selectedIndex === 2 ? (
          <>
            <LegendList
              contentContainerStyle={styles.container}
              data={dataList}
              keyExtractor={(item) => item.id}
              onEndReached={fetchNextPage}
              ListHeaderComponent={
                <>
                  <RenderListHeader />
                  {renderSegmentedControl()}
                  {renderCommentTitle()}
                </>
              }
              renderItem={renderCommentItem}
            />
          </>
        ) : undefined}
      </SafeScreen>
      <GalleryPreview
        isVisible={isVisible}
        initialIndex={initialIndex}
        onRequestClose={() => setIsVisible(false)}
        images={images}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    height: 30,
    paddingHorizontal: 11,
  },
  buttonIcon: {
    height: 14,
    width: 14,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  carouselImg: {
    height: 211,
    width: "100%",
  },
  commentIcon: {
    height: 18,
    width: 18,
  },
  commentTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {},
  content: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  contentText: {
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 14,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: 500,
    marginTop: 3,
  },
  commentStarText: {
    fontSize: 16,
    fontWeight: 500,
  },
  commentStar: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E77626",
  },
  evaluationTitleLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  evaluationTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  headerBtnGroup: {
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  headerBtnIcon: {
    height: 34,
    width: 34,
  },
  info: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  locationIcon: {
    height: 28,
    marginBottom: 6,
    width: 28,
  },
  locationText: {
    fontSize: 13,
    fontWeight: 500,
  },
  locationLeft: {
    flex: 1,
  },
  locationWrapper: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 20,
  },
  safeScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scoreIcon: {
    height: 16,
    width: 16,
  },
  scoreText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: 500,
  },
  scoreWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 14,
  },
  segmentedControl: {
    borderRadius: 18,
    height: 40,
    width: 298,
  },
  segmentedControlContainer: {
    alignItems: "center",
    marginBottom: 8,
    marginTop: 20,
  },
  segmentedControlSlider: {
    borderRadius: 18,
    height: 32,
    top: 4,
  },
  titleContainer: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 600,
  },
  toolWrapper: {
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    marginTop: 28,
  },
  userWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
});

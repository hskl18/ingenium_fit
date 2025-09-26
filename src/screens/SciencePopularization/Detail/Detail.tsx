import { LegendList } from "@legendapp/list";
import { useNavigation } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageURISource,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { ImageWithFallback } from "@/components/atoms";
import GalleryPreview from "react-native-gallery-preview";
import { Pressable } from "react-native-gesture-handler";
import { useKeyboardAnimation } from "react-native-keyboard-controller";
import { Avatar, Button, Divider, Text, TextInput } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Toast from "react-native-root-toast";
import { WebView } from "react-native-webview";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import CommentItem from "@/components/common/CommentItem/CommentItem.tsx";
import Empty from "@/components/common/Empty/Empty.tsx";
import { SafeScreen } from "@/components/templates";

import CommentIcon from "@/assets/images/221.png";
import BackIcon from "@/assets/images/222.png";
import CollectIcon from "@/assets/images/223.png";
import CollectFIcon from "@/assets/images/225.png";
import { Configs } from "@/common/configs.ts";
import { dayjs } from "@/plugins/day.ts";
import {
  addComment,
  addCommentReply,
  commentList,
  favorite,
  scienceDetail,
} from "@/services";
// Conditionally import VideoPlayer
let VideoPlayer: any = null;
try {
  const videoModule = require("react-native-video");
  VideoPlayer = videoModule?.default ?? videoModule;
} catch (error) {
  console.warn("VideoPlayer not available in Expo Go");
  // Fallback to a simple View for web/Expo Go
  VideoPlayer = ({ children }: any) => children;
}

export default function RehabilitationCenterDetail({
  route,
}: RootScreenProps<Paths.RehabilitationCenterDetail>) {
  const navigation = useNavigation();
  const { backgrounds, colors } = useTheme();
  const { id } = route.params;
  const progress = useSharedValue<number>(0);
  const [post, setPost] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(100);
  const [replyComment, setReplyComment] = useState(undefined);
  const [commentContent, setCommentContent] = useState("");
  const inputToolBarRef = useRef(null);
  const queryClient = useQueryClient();
  const { height, progress: progressKey } = useKeyboardAnimation();
  const videoPlayerRef = useRef(null);

  const scale = progressKey.interpolate({
    inputRange: [1, 1],
    outputRange: [1, 1],
  });
  const mutation = useMutation({
    mutationFn: favorite,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        setPost((current) => ({
          ...current,
          isFavorited: !current?.isFavorited,
        }));
        Toast.show(
          post?.isFavorited ? "Removed from favorites" : "Added to favorites",

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
    mutation.mutate({
      objectId: post.id,
      // 收藏对象类型：1-康复中心 2-科普 3-动态
      objectType: 2,
    });
  }, [post, mutation]);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerBtnGroup}>
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={BackIcon as ImageURISource}
                style={styles.headerBtnIcon}
              />
            </TouchableOpacity>
          </View>
        );
      },
      headerRight: () => {
        return post.id ? (
          <View style={styles.headerBtnGroup}>
            <Pressable onPress={handleToggleCollect}>
              {post?.isFavorited ? (
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
        ) : undefined;
      },
    });
  }, [navigation, post, handleToggleCollect]);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => {
      return scienceDetail({ id });
    },
    queryKey: [Paths.SciencePopularizationDetail, "scienceDetail", id],
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
    enabled: !!post.id,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (__DEV__) console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    queryFn: async (pageParam) => {
      return commentList({
        page: pageParam.pageParam,
        objectId: post.id,
        // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
        objectType: 2,
      });
    },
    queryKey: [Paths.SciencePopularizationDetail, "commentList", post],
  });

  const mutationReplyComment = useMutation({
    mutationFn: addCommentReply,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        inputToolBarRef.current?.blur();
        setCommentContent("");
        setReplyComment(undefined);
        queryClient.refetchQueries({
          queryKey: [Paths.SciencePopularizationDetail, "commentList"],
          type: "active",
        });
        Toast.show("Sent", {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });
  const mutationComment = useMutation({
    mutationFn: addComment,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        inputToolBarRef.current?.blur();
        setCommentContent("");
        queryClient.refetchQueries({
          queryKey: [Paths.SciencePopularizationDetail, "commentList"],
          type: "active",
        });
        Toast.show("Sent", {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const handleSend = () => {
    if (replyComment) {
      mutationReplyComment.mutate({
        content: commentContent,
        // 一级评论id
        userCommentId: replyComment.userCommentId
          ? replyComment.userCommentId
          : replyComment.id,
        // 回复用户id 回复一级评论不用传
        replyUserId: replyComment.userCommentId ? replyComment.user?.id : "",
      });
    } else {
      mutationComment.mutate({
        content: commentContent,
        objectId: post.id,
        // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
        objectType: 2,
      });
    }
  };

  const handleOnReply = (comment: any) => {
    console.log(comment);
    setReplyComment(comment);
    inputToolBarRef.current?.focus();
  };

  const handleVideoFullScreen = (playVideo) => {
    console.log("videoFullScreen", playVideo);
  };

  console.log(hasNextPage, data);

  let dataList: any[] = [];
  if (data?.pages) {
    dataList = (data.pages as any[]).flatMap((page, pageIndex) =>
      ((page as any)?.rows ?? []).map((row: any, rowIndex: number) => ({
        ...row,
        __legendKey: `${row?.id ?? "science-comment"}-${pageIndex}-${rowIndex}`,
      }))
    );
  }

  const images = useMemo(() => {
    let pictures = [];
    if (post.detailImages) {
      pictures = post.detailImages?.split(",").map((img) => ({
        uri: img,
        type: "image",
      }));
    }
    return pictures;
  }, [post]);

  const postImages = useMemo(() => {
    let videosOrimages = [];
    if (post.detailVideos) {
      videosOrimages = videosOrimages.concat(
        post.detailVideos?.split(",").map((img) => ({
          url: img,
          type: "video",
        }))
      );
    }
    if (post.detailImages) {
      videosOrimages = videosOrimages.concat(
        post.detailImages?.split(",").map((img) => ({
          url: img,
          type: "image",
        }))
      );
    }
    return videosOrimages;
  }, [post]);

  const handlePreview = (item) => {
    setIsVisible(true);
    setInitialIndex(images.findIndex((img) => img.uri === item.url));
  };

  const renderDescription = () => {
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
        onMessage={({ nativeEvent }) => {
          const messageData = nativeEvent?.data;

          setTimeout(() => {
            if (!messageData) {
              return;
            }

            // Handle the scrollHeight response
            if (isNaN(Number.parseInt(messageData))) {
              // Open the embedded web browser if the user clicks a link instead of reloading content within
              // the webview itself
            } else {
              // If "data" is a number, we can use that the set the height of the webview dynamically
              setSectionHeight(Number.parseInt(messageData));
            }
          }, 100);
        }}
        originWhitelist={["*"]}
        overScrollMode="never"
        scalesPageToFit={Platform.OS === "ios"}
        scrollEnabled={false}
        source={{
          html:
            Configs.HtmlHead + `<body><div>${post.content || ""}</div></body>`,
        }}
        style={[
          {
            height: sectionHeight,
          },
        ]}
      />
    );
  };

  const renderListHeader = useCallback(() => {
    console.log("postImages", postImages);
    return (
      <View>
        <View style={styles.carouselWrapper}>
          <Carousel
            enabled={postImages.length > 1}
            data={postImages}
            height={244}
            onProgressChange={progress}
            renderItem={({ item }) =>
              item.type === "video" ? (
                <VideoPlayer
                  paused
                  controls
                  source={{ uri: item.url }}
                  style={styles.carouselImg}
                />
              ) : (
                <Pressable
                  onPress={() => {
                    handlePreview(item);
                  }}
                >
                  <ImageWithFallback
                    uri={item.url}
                    style={styles.carouselImg}
                  />
                </Pressable>
              )
            }
            width={Dimensions.get("window").width}
          />
        </View>
        <View style={[styles.content, backgrounds.gray1600]}>
          <Text style={styles.titleText}>{post.title}</Text>
          <Text style={{ ...styles.timeText, color: colors.gray800 }}>
            {post?.createTime
              ? dayjs(+post?.createTime).format("YYYY-MM-DD HH:mm")
              : post?.createTime}
          </Text>
          {renderDescription()}
        </View>
        <Divider />
        <View style={styles.commentTitle}>
          <Image
            source={CommentIcon as ImageURISource}
            style={styles.commentIcon}
          />
          <Text style={{ ...styles.commentTitleText }}>
            {"Comments"}({post.commentNum || 0})
          </Text>
        </View>
      </View>
    );
  }, [post, progress, renderDescription]);

  const renderItem = ({ index, item }) => {
    return (
      <View
        key={item.__legendKey ?? item.id ?? index}
        style={{ marginTop: index > 0 ? 20 : 0 }}
      >
        <CommentItem item={item || {}} onReply={handleOnReply} />
      </View>
    );
  };

  const renderInputToolbar = () => {
    return (
      <>
        <TextInput
          ref={inputToolBarRef}
          maxLength={255}
          activeUnderlineColor="transparent"
          label=""
          mode="outlined"
          onChangeText={(text) => {
            setCommentContent(text);
          }}
          outlineColor="transparent"
          outlineStyle={styles.textInputOutline}
          placeholder={"Write a comment..."}
          style={[styles.inputBar, backgrounds.gray1560]}
          underlineColor="transparent"
          value={commentContent}
        />
        <View style={styles.inputToolBtn}>
          <Button
            disabled={!commentContent}
            mode="contained"
            onPress={handleSend}
          >
            {"Send"}
          </Button>
        </View>
      </>
    );
  };
  return (
    <>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        <LegendList
          contentContainerStyle={styles.container}
          data={dataList}
          keyExtractor={(item, index) =>
            item?.__legendKey ?? `${item?.id ?? index}`
          }
          ListHeaderComponent={renderListHeader()}
          ListEmptyComponent={<Empty />}
          ListFooterComponent={<View style={{ height: 74 }}></View>}
          onEndReached={() => fetchNextPage()}
          renderItem={renderItem}
        />
      </SafeScreen>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Animated.View
          style={[
            styles.inputToolBar,
            backgrounds.gray1600,
            {
              width: Dimensions.get("window").width,
              transform: [{ translateY: height || 0 }, { scale }],
            },
          ]}
        >
          {renderInputToolbar()}
        </Animated.View>
      </View>

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
  avatarWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  carouselImg: {
    height: 244,
    width: "100%",
  },
  carouselWrapper: {
    backgroundColor: "#000",
    height: 282,
  },
  commentIcon: {
    height: 18,
    width: 18,
  },
  commentTitle: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  commentTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {},
  content: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -38,
    paddingBottom: 26,
    paddingHorizontal: 20,
    paddingTop: 21,
  },
  contentText: {
    marginTop: 26,
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 14,
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
  inputBar: {
    flex: 1,
    height: 42,
  },
  inputToolBar: {
    alignItems: "center",
    flexDirection: "row",
    boxShadow: "-3 6 rgba(0, 0, 0, 0.0588)",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  inputToolBtn: {
    marginLeft: 15,
  },
  safeScreen: {},
  textInputOutline: {
    borderRadius: 16,
  },
  timeText: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: 500,
  },
  titleContainer: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tool: {
    alignItems: "center",
  },
  toolIcon: {
    height: 42,
    marginBottom: 6,
    width: 42,
  },
  toolWrapper: {
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    marginTop: 28,
  },
});

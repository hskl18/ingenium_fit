import { LegendList } from "@legendapp/list";
import { useNavigation } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@/hooks";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageURISource,
  StyleSheet,
  View,
  StatusBar,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
// import VideoPlayer from 'react-native-media-console';
// Conditionally import VideoPlayer
let VideoPlayer: any = null;
try {
  VideoPlayer = require("react-native-video").default;
} catch (error) {
  console.warn("VideoPlayer not available in Expo Go");
  // Fallback to a simple View for web/Expo Go
  VideoPlayer = ({ children, ...props }: any) => children;
}
import { Avatar, Button, Portal, Text, TextInput } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import CommentItem from "@/components/common/CommentItem/CommentItem.tsx";
import Empty from "@/components/common/Empty/Empty.tsx";
import { SafeScreen } from "@/components/templates";
import ApplicationShare from "@/screens/Dynamic/components/ApplicationShare/ApplicationShare.tsx";

import UserIcon from "@/assets/images/117.png";
import UserFIcon from "@/assets/images/127.png";
import LikeFIcon from "@/assets/images/128.png";
import ShieldIcon from "@/assets/images/166.png";
import ShieldBgIcon from "@/assets/images/167.png";
import LikeIcon from "@/assets/images/219.png";
import ShareIcon from "@/assets/images/220.png";
import CommentIcon from "@/assets/images/221.png";
import BackIcon from "@/assets/images/222.png";
import CollectIcon from "@/assets/images/223.png";
import CollectFIcon from "@/assets/images/225.png";
import MoreIcon from "@/assets/images/226.png";
import { dayjs } from "@/plugins/day.ts";
import {
  addComment,
  addCommentReply,
  blockPost,
  commentList,
  deletePost,
  favorite,
  postDetail,
  toggleFollow,
  toggleLike,
} from "@/services";
import { useUserStore } from "@/store";
import { useKeyboardAnimation } from "react-native-keyboard-controller";
import DeleteIcon from "@/assets/images/212.png";
import GalleryPreview from "react-native-gallery-preview";
import * as React from "react";
export default function DynamicDetail({
  route,
}: RootScreenProps<Paths.DynamicDetail>) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { backgrounds, colors } = useTheme();
  const { id } = route.params;

  const userInfo = useUserStore((state) => state.userInfo);
  const queryClient = useQueryClient();
  const { height, progress: progressKey } = useKeyboardAnimation();

  const scale = progressKey.interpolate({
    inputRange: [1, 1],
    outputRange: [1, 1],
  });
  const progress = useSharedValue<number>(0);
  const [post, setPost] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const [isShowShare, setIsShowShare] = useState(false);
  const [replyComment, setReplyComment] = useState(undefined);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const videoPlayerRef = useRef(null);
  const inputToolBarRef = useRef(null);

  const toggleOpenMenu = () => {
    setVisibleMenu((visible) => !visible);
  };
  const closeMenu = () => {
    setVisibleMenu(false);
  };

  const showShareModal = () => {
    setIsShowShare(true);
  };
  const hideShareModal = () => {
    setIsShowShare(false);
  };

  const mutation = useMutation({
    mutationFn: toggleFollow,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        setPost((post) => ({
          ...post,
          whetherFollowByLoginUser: !post.whetherFollowByLoginUser,
        }));
        Toast.show(
          post.whetherFollowByLoginUser
            ? t("common.unfollow_success")
            : t("common.follow_success"),
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

  const handleToggleFollow = () => {
    mutation.mutate({
      followUserId: post.user?.id,
    });
  };

  const mutationShield = useMutation({
    mutationFn: blockPost,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        Toast.show(t("common.block_success"), {
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
  const handleShield = () => {
    closeMenu();
    mutationShield.mutate({
      id: post.id,
    });
  };

  const mutationDelete = useMutation({
    mutationFn: deletePost,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        Toast.show(t("common.delete_success"), {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            navigation.goBack();
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });
  const handleDelete = () => {
    closeMenu();
    mutationDelete.mutate({
      id: post.id,
    });
  };

  const handlePreview = (item) => {
    setIsVisible(true);
    setInitialIndex(images.findIndex((img) => img.uri === item.url));
  };

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
              ></Image>
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
                ></Image>
              ) : (
                <Image
                  source={CollectIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                ></Image>
              )}
            </Pressable>
            <View style={styles.menuWrapper}>
              <Pressable onPress={toggleOpenMenu}>
                <Image
                  source={MoreIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                ></Image>
              </Pressable>

              {visibleMenu ? (
                <Portal>
                  {post.user && post.user?.id === userInfo.id ? (
                    <Pressable
                      onPress={handleDelete}
                      style={[
                        styles.shieldWrapper,
                        {
                          top: StatusBar.currentHeight + 50,
                        },
                      ]}
                    >
                      <ImageBackground
                        source={ShieldBgIcon}
                        resizeMode="cover"
                        style={styles.shieldInner}
                      >
                        <Image
                          source={DeleteIcon as ImageURISource}
                          style={styles.shieldIcon}
                        />
                        <Text
                          style={[
                            styles.shieldText,
                            {
                              color: colors.gray1600,
                            },
                          ]}
                        >
                          {t("common.delete")}
                        </Text>
                      </ImageBackground>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={handleShield}
                      style={[
                        styles.shieldWrapper,
                        {
                          top: StatusBar.currentHeight + 50,
                        },
                      ]}
                    >
                      <ImageBackground
                        source={ShieldBgIcon}
                        resizeMode="cover"
                        style={styles.shieldInner}
                      >
                        <Image
                          source={ShieldIcon as ImageURISource}
                          style={styles.shieldIcon}
                        />
                        <Text
                          style={[
                            styles.shieldText,
                            {
                              color: colors.gray1600,
                            },
                          ]}
                        >
                          {t("common.shield")}
                        </Text>
                      </ImageBackground>
                    </Pressable>
                  )}
                </Portal>
              ) : undefined}
            </View>
          </View>
        );
      },
    });
  }, [navigation, post, visibleMenu]);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => postDetail({ id }),
    queryKey: [Paths.DynamicDetail, "postDetail", id],
  });

  useEffect(() => {
    console.log("postData", postData);

    if (postDataIsSuccess) {
      setPost(postData.data || {});
    }
  }, [setPost, postData, postDataIsSuccess]);

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
    enabled: !!post.id,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: async (pageParam) => {
      return commentList({
        page: pageParam.pageParam,
        // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
        objectId: post.id,
        objectType: 1,
      });
    },
    queryKey: [Paths.DynamicDetail, "commentList", post],
  });

  const mutationCollect = useMutation({
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
            ? t("common.unfavorite_success")
            : t("common.favorite_success"),
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

  const handleToggleCollect = () => {
    mutationCollect.mutate({
      objectId: post.id,
      // 收藏对象类型：1-康复中心 2-科普 3-动态
      objectType: 3,
    });
  };

  const mutationLike = useMutation({
    mutationFn: toggleLike,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        setPost((post) => ({
          ...post,
          likesNum: post.whetherGiveLikeByLoginUser
            ? post.likesNum - 1
            : post.likesNum + 1,
          whetherGiveLikeByLoginUser: !post.whetherGiveLikeByLoginUser,
        }));
        Toast.show(
          post.whetherGiveLikeByLoginUser
            ? t("common.unlike_success")
            : t("common.like_success"),
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

  const handleToggleLike = () => {
    mutationLike.mutate({
      objectId: post.id,
      objectType: 1,
    });
  };
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
          queryKey: [Paths.DynamicDetail, "commentList"],
          type: "active",
        });
        Toast.show(t("common.send_success"), {
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
          queryKey: [Paths.DynamicDetail, "commentList"],
          type: "active",
        });
        Toast.show("发送成功", {
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
        objectType: 1,
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

  const images = useMemo(() => {
    let pictures = [];
    if (post.pictures) {
      pictures = post.pictures?.split(",").map((img) => ({
        uri: img,
        type: "image",
      }));
    }
    return pictures;
  }, [post]);
  const postImages = useMemo(() => {
    let videosOrimages = [];
    if (post.videos) {
      videosOrimages = videosOrimages.concat(
        post.videos?.split(",").map((img) => ({
          url: img,
          type: "video",
        }))
      );
    }
    if (post.pictures) {
      const pictures = post.pictures?.split(",").map((img) => ({
        url: img,
        type: "image",
      }));

      videosOrimages = videosOrimages.concat(pictures);
    }
    return videosOrimages;
  }, [post]);
  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }
  console.log("progress.value", progress.value);
  const renderListHeader = useCallback(() => {
    return (
      <View>
        <Carousel
          enabled={postImages.length > 1}
          width={Dimensions.get("window").width}
          height={282}
          data={postImages}
          onProgressChange={progress}
          onConfigurePanGesture={(gestureChain) =>
            gestureChain.activeOffsetX([-10, 10])
          }
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
                <Image
                  key={item as string}
                  source={{ uri: item.url }}
                  style={styles.carouselImg}
                />
              </Pressable>
            )
          }
        />

        <Pagination.Basic
          progress={progress}
          data={postImages}
          activeDotStyle={backgrounds.primary}
          dotStyle={{ backgroundColor: "rgba(0,0,0,0.28)", borderRadius: 50 }}
          containerStyle={styles.indicatorWrapper}
        />
        <View style={[styles.userWrapper, backgrounds.gray1550]}>
          <View style={styles.avatarWrapper}>
            <Avatar.Image size={29} source={{ uri: post.user?.avatar }} />
            <Text>{post.user?.nickName}</Text>
          </View>
          {post.user && post.user.id !== userInfo.id ? (
            <>
              {post.whetherFollowByLoginUser ? (
                <Pressable style={styles.button} onPress={handleToggleFollow}>
                  <Image
                    source={UserFIcon as ImageURISource}
                    style={styles.userIcon}
                  />
                  <Text
                    style={{ ...styles.buttonLabel, color: colors.primary }}
                  >
                    {t("common.followed")}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.button, backgrounds.primary]}
                  onPress={handleToggleFollow}
                >
                  <Image
                    source={UserIcon as ImageURISource}
                    style={styles.userIcon}
                  />
                  <Text
                    style={{ ...styles.buttonLabel, color: colors.gray1600 }}
                  >
                    {t("common.follow")}
                  </Text>
                </Pressable>
              )}
            </>
          ) : undefined}
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>{post.content}</Text>
          <Text style={{ ...styles.timeText, color: colors.gray800 }}>
            {post?.createTime
              ? dayjs(+post?.createTime).format("YYYY-MM-DD HH:mm")
              : post?.createTime}
          </Text>

          <View style={styles.toolWrapper}>
            <Pressable onPress={handleToggleLike}>
              <View style={styles.tool}>
                {post.whetherGiveLikeByLoginUser ? (
                  <Image
                    source={LikeFIcon as ImageURISource}
                    style={styles.toolIcon}
                  />
                ) : (
                  <Image
                    source={LikeIcon as ImageURISource}
                    style={styles.toolIcon}
                  />
                )}
                <Text style={{ ...styles.timeText, color: colors.gray800 }}>
                  {post.likesNum}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={showShareModal}>
              <View style={styles.tool}>
                <Image
                  source={ShareIcon as ImageURISource}
                  style={styles.toolIcon}
                />
                <Text style={{ ...styles.timeText, color: colors.gray800 }}>
                  {post.forwardNum}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={[{ height: 8 }, backgrounds.gray1550]}></View>
        <View style={styles.commentTitle}>
          <Image
            source={CommentIcon as ImageURISource}
            style={styles.commentIcon}
          />
          <Text style={{ ...styles.commentTitleText }}>
            {t("common.comment")}({post.commentNum || 0})
          </Text>
        </View>
      </View>
    );
  }, [post, progress, handleToggleLike]);

  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <CommentItem item={item || {}} onReply={handleOnReply} />
      </View>
    );
  };

  const renderInputToolbar = () => {
    return (
      <>
        <TextInput
          maxLength={255}
          ref={inputToolBarRef}
          activeUnderlineColor="transparent"
          label=""
          mode="outlined"
          onChangeText={(text) => {
            setCommentContent(text);
          }}
          outlineColor="transparent"
          outlineStyle={styles.textInputOutline}
          placeholder={t("common.civilized_comments")}
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
            {t("common.send")}
          </Button>
        </View>
      </>
    );
  };

  console.log("postImages", postImages);
  console.log(hasNextPage, data);
  return (
    <>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        <LegendList
          contentContainerStyle={styles.container}
          ListHeaderComponent={renderListHeader()}
          ListFooterComponent={<View style={{ height: 74 }}></View>}
          data={dataList}
          renderItem={renderItem}
          ListEmptyComponent={<Empty />}
          keyExtractor={(item) => item.id}
          onEndReached={fetchNextPage}
        />
        <ApplicationShare hideModal={hideShareModal} visible={isShowShare} />
      </SafeScreen>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    gap: 6,
    height: 30,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0, 119, 210, 0.1)",
  },
  buttonLabel: {
    fontSize: 14,
  },
  carouselImg: {
    height: 282,
    width: "100%",
    backgroundColor: "#000",
  },
  commentIcon: {
    width: 18,
    height: 18,
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  contentText: {
    marginBottom: 14,
    fontSize: 17,
    fontWeight: 600,
  },
  headerBtnGroup: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBtnIcon: {
    width: 34,
    height: 34,
  },
  menuWrapper: {
    position: "relative",
  },
  indicatorWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  inputBar: {
    flex: 1,
    height: 42,
  },
  inputToolBar: {
    alignItems: "center",
    bottom: 0,
    boxShadow: "-3 6 rgba(0, 0, 0, 0.0588)",
    flexDirection: "row",
    left: 0,
    paddingHorizontal: 20,
    paddingVertical: 6,
    position: "absolute",
    right: 0,
  },
  inputToolBtn: {
    marginLeft: 15,
  },
  safeScreen: {
    flex: 1,
  },
  shieldIcon: {
    height: 16,
    width: 16,
  },
  shieldInner: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    width: 76,
    height: 45,
  },
  shieldText: {
    fontSize: 14,
  },
  shieldWrapper: {
    position: "absolute",
    right: 20,
    zIndex: 9,
  },
  textInputOutline: {
    borderRadius: 16,
  },
  timeText: {
    fontSize: 12,
    fontWeight: 500,
  },
  titleContainer: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 600,
  },
  tool: {
    alignItems: "center",
  },
  toolIcon: {
    marginBottom: 6,
    width: 42,
    height: 42,
  },
  toolWrapper: {
    gap: 50,
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
  },
  userIcon: {
    width: 18,
    height: 18,
  },
  userWrapper: {
    height: 42,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});

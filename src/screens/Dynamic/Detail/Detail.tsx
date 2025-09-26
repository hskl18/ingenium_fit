import { LegendList } from "@legendapp/list";
import { useNavigation } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  ImageURISource,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Avatar, Button, Portal, Text, TextInput } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import type { IResponseData } from "@/services/types";
import { useTheme } from "@/theme";

import CommentItem from "@/components/common/CommentItem/CommentItem.tsx";
import Empty from "@/components/common/Empty/Empty.tsx";
import { ImageWithFallback } from "@/components/atoms";
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
import { normalizeImageUrl } from "@/utils/image";
let VideoPlayer: any = null;
try {
  const videoModule = require("react-native-video");
  VideoPlayer = videoModule?.default ?? videoModule;
} catch {
  console.warn("VideoPlayer not available in Expo Go");
  VideoPlayer = ({ children }: any) => children;
}
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const toRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
};

const collectFromValue = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectFromValue(entry));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const nested =
      record.url ??
      record.uri ??
      record.image ??
      record.src ??
      record.cover ??
      record.value;
    return collectFromValue(nested);
  }

  return [String(value)];
};

const uniqueStrings = (values: string[]): string[] => {
  const set = new Set<string>();
  values.forEach((value) => {
    const trimmed = value.trim();
    if (trimmed) {
      set.add(trimmed);
    }
  });
  return Array.from(set);
};

export default function DynamicDetail({
  route,
}: RootScreenProps<Paths.DynamicDetail>) {
  const navigation = useNavigation();
  const { backgrounds, colors } = useTheme();
  const { payload, ...paramsWithoutPayload } = route.params;
  const { id } = paramsWithoutPayload as { id: string };

  const userInfo = useUserStore((state) => state.userInfo);
  const queryClient = useQueryClient();
  const { height, progress: progressKey } = useKeyboardAnimation();

  const scale = progressKey.interpolate({
    inputRange: [1, 1],
    outputRange: [1, 1],
  });
  const progress = useSharedValue<number>(0);
  const [post, setPost] = useState<any>(() => ({
    ...toRecord(payload),
    ...paramsWithoutPayload,
  }));
  const [commentContent, setCommentContent] = useState("");
  const [isShowShare, setIsShowShare] = useState(false);
  const [replyComment, setReplyComment] = useState(undefined);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
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
        setPost((current) => ({
          ...current,
          isFollowed: !current?.isFollowed,
        }));
        Toast.show(post?.isFollowed ? "Unfollowed" : "Followed", {
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
        Toast.show("Blocked successfully", {
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
        Toast.show("Deleted successfully", {
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
    const index = images.findIndex((img) => img.uri === item.url);
    if (index < 0) {
      return;
    }
    setInitialIndex(index);
    setIsVisible(true);
  };

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerBtnGroup}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.headerIconButton}
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
        if (!post.id) {
          return undefined;
        }
        return (
          <View style={styles.headerBtnGroup}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                post?.isFavorited ? "Remove from favorites" : "Add to favorites"
              }
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleToggleCollect}
              style={styles.headerIconButton}
            >
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
            <View style={styles.menuWrapper}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="More options"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={toggleOpenMenu}
                style={styles.headerIconButton}
              >
                <Image
                  source={MoreIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                />
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
                          {"Delete"}
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
                          {"Block"}
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
      setPost((current: any) => ({
        ...(current || {}),
        ...toRecord(postData?.data),
      }));
    }
  }, [setPost, postData, postDataIsSuccess]);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
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
        setPost((current: any) => {
          const currentlyFavorited = Boolean(current?.isFavorited);
          Toast.show(
            currentlyFavorited
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

          return {
            ...(current || {}),
            isFavorited: !currentlyFavorited,
          };
        });
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
        setPost((current) => ({
          ...current,
          likesNum: current?.isLiked
            ? Math.max(0, (current.likesNum || 1) - 1)
            : (current.likesNum || 0) + 1,
          isLiked: !current?.isLiked,
        }));
        Toast.show(post?.isLiked ? "Unliked" : "Liked", {
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

  const pictureUris = useMemo(() => {
    const candidates = [
      (post as any)?.pictures,
      (post as any)?.images,
      (post as any)?.imageList,
      (post as any)?.image,
      (post as any)?.coverImage,
      (post as any)?.cover,
      (post as any)?.thumbnail,
      (post as any)?.media,
    ];

    return uniqueStrings(candidates.flatMap(collectFromValue));
  }, [post]);

  const videoUris = useMemo(() => {
    const candidates = [
      (post as any)?.videos,
      (post as any)?.videoList,
      (post as any)?.video,
    ];

    return uniqueStrings(candidates.flatMap(collectFromValue));
  }, [post]);

  const normalizedPictures = useMemo(() => {
    return pictureUris
      .map((uri) => normalizeImageUrl(String(uri)))
      .filter((uri): uri is string => Boolean(uri));
  }, [pictureUris]);

  const normalizedVideos = useMemo(() => {
    return videoUris
      .map((uri) => normalizeImageUrl(String(uri)))
      .filter((uri): uri is string => Boolean(uri));
  }, [videoUris]);

  const displayTitle = useMemo(() => {
    const source = toRecord(post);
    const candidates = [
      source.title,
      source.heading,
      source.headline,
      source.name,
      source.subject,
    ];

    for (const candidate of candidates) {
      if (isNonEmptyString(candidate)) {
        return candidate.trim();
      }
    }

    const contentCandidate = source.content;
    if (isNonEmptyString(contentCandidate)) {
      const firstLine = contentCandidate
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .find(Boolean);
      if (firstLine) {
        return firstLine;
      }
    }

    return undefined;
  }, [post]);

  const displayContent = useMemo(() => {
    const source = toRecord(post);
    const candidates = [
      source.content,
      source.description,
      source.summary,
      source.body,
    ];

    for (const candidate of candidates) {
      if (isNonEmptyString(candidate)) {
        return candidate.trim();
      }
    }

    return undefined;
  }, [post]);

  const images = useMemo(
    () =>
      normalizedPictures.map((uri) => ({
        uri,
        type: "image" as const,
      })),
    [normalizedPictures],
  );

  const postImages = useMemo(() => {
    const media: { url: string; type: "video" | "image" }[] = [];

    normalizedVideos.forEach((url) => {
      media.push({ url, type: "video" });
    });

    normalizedPictures.forEach((uri) => {
      media.push({ url: uri, type: "image" });
    });

    return media;
  }, [normalizedPictures, normalizedVideos]);
  let dataList: any[] = [];
  if (data?.pages) {
    dataList = (data.pages as any[]).flatMap((page, pageIndex) =>
      ((page as any)?.rows ?? []).map((row: any, rowIndex: number) => ({
        ...row,
        __legendKey: `${row?.id ?? "dynamic-comment"}-${pageIndex}-${rowIndex}`,
      }))
    );
  }
  console.log("progress.value", progress.value);
  const renderListHeader = useCallback(() => {
    const hasMedia = postImages.length > 0;
    return (
      <View>
        {hasMedia ? (
          <>
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
                    <ImageWithFallback
                      uri={item.url}
                      style={styles.carouselImg}
                    />
                  </Pressable>
                )
              }
            />

            {postImages.length > 1 ? (
              <Pagination.Basic
                progress={progress}
                data={postImages}
                activeDotStyle={backgrounds.primary}
                dotStyle={{
                  backgroundColor: "rgba(0,0,0,0.28)",
                  borderRadius: 50,
                }}
                containerStyle={styles.indicatorWrapper}
              />
            ) : null}
          </>
        ) : (
          <ImageWithFallback
            uri={undefined}
            style={styles.carouselImg}
          />
        )}
        <View style={[styles.userWrapper, backgrounds.gray1550]}>
          <View style={styles.avatarWrapper}>
            <Avatar.Image size={29} source={{ uri: post.user?.avatar }} />
            <Text>{post.user?.nickName}</Text>
          </View>
          {post.user && post.user.id !== userInfo.id ? (
            <>
              {post?.isFollowed ? (
                <Pressable style={styles.button} onPress={handleToggleFollow}>
                  <Image
                    source={UserFIcon as ImageURISource}
                    style={styles.userIcon}
                  />
                  <Text
                    style={{ ...styles.buttonLabel, color: colors.primary }}
                  >
                    {"Following"}
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
                    {"Follow"}
                  </Text>
                </Pressable>
              )}
            </>
          ) : undefined}
        </View>
        <View style={styles.content}>
          {displayTitle ? (
            <Text style={styles.titleText}>{displayTitle}</Text>
          ) : null}
          {displayContent ? (
            <Text style={styles.contentText}>{displayContent}</Text>
          ) : null}
          <Text style={{ ...styles.timeText, color: colors.gray800 }}>
            {post?.createTime
              ? dayjs(+post?.createTime).format("YYYY-MM-DD HH:mm")
              : post?.createTime}
          </Text>

          <View style={styles.toolWrapper}>
            <Pressable onPress={handleToggleLike}>
              <View style={styles.tool}>
                {post?.isLiked ? (
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
          <Text style={{ ...styles.commentTitleText }}>{`Comments (${post.commentNum ?? 0})`}</Text>
        </View>
      </View>
    );
  }, [
    backgrounds.gray1550,
    backgrounds.primary,
    colors.gray800,
    colors.gray1600,
    displayContent,
    displayTitle,
    handlePreview,
    handleToggleFollow,
    handleToggleLike,
    post,
    postImages,
    progress,
    showShareModal,
    userInfo.id,
  ]);

  const renderItem = ({ item, index }) => {
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
          keyExtractor={(item, index) =>
            item?.__legendKey ?? `${item?.id ?? index}`
          }
          onEndReached={() => fetchNextPage()}
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
    gap: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1A2D4E",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
    color: "#0A1F44",
  },
  headerBtnGroup: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(14, 23, 44, 0.55)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(10, 22, 41, 0.32)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  headerBtnIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
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

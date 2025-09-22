import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ImageBackground,
  ImageURISource,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
// Conditionally import VideoPlayer
let VideoPlayer: any = null;
try {
  VideoPlayer = require("react-native-media-console").default;
} catch (error) {
  console.warn("VideoPlayer not available in Expo Go");
  VideoPlayer = ({ children, ...props }: any) => children;
}
import { Avatar, Card, Text } from "react-native-paper";
import { useViewability, useViewabilityAmount } from "@legendapp/list";
import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import CollectFIcon from "@/assets/images/247.png";
import MoreIcon from "@/assets/images/251.png";
import ShareIcon from "@/assets/images/252.png";
import MessageIcon from "@/assets/images/254.png";
import CollectIcon from "@/assets/images/31.png";
import LikeIcon from "@/assets/images/52.png";
import LikeFIcon from "@/assets/images/53.png";
import ShieldIcon from "@/assets/images/166.png";
import DeleteIcon from "@/assets/images/212.png";
import ShieldBgIcon from "@/assets/images/167.png";
// Conditionally import useAnimations
let useAnimations: any = () => ({});
try {
  useAnimations =
    require("@react-native-media-console/reanimated").useAnimations;
} catch (error) {
  console.warn("useAnimations not available in Expo Go");
}
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Toast from "react-native-root-toast";

import { dayjs } from "@/plugins/day.ts";
import { blockPost, deletePost, favorite } from "@/services";
import { useUserStore } from "@/store";
import PlayIcon from "@/assets/images/256.png";

export default function DynamicItem({
  item,
  hideVisibleShield,
  onRefresh,
}: any) {
  const { backgrounds, colors } = useTheme();
  const navigation = useNavigation();
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [paused, setPaused] = useState(true);
  const userInfo = useUserStore((state) => state.userInfo);
  const videoPlayerRef = useRef(null);

  const toggleOpenMenu = () => {
    setVisibleMenu((visible) => !visible);
  };
  const closeMenu = () => {
    setVisibleMenu(false);
  };
  const mutation = useMutation({
    mutationFn: blockPost,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        onRefresh();
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
    mutation.mutate({
      id: item.id,
    });
  };

  const mutationDelete = useMutation({
    mutationFn: deletePost,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        onRefresh();
        Toast.show("Deleted successfully", {
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
  const handleDelete = () => {
    closeMenu();
    mutationDelete.mutate({
      id: item.id,
    });
  };

  const handleCheckDetail = () => {
    navigation.navigate(Paths.DynamicDetail, {
      id: item.id,
    });
    setVisibleMenu(false);
    console.log(videoPlayerRef.current);
    videoPlayerRef.current?.pause();
    setPaused(true);
  };

  let pictures = [];
  let videos = [];
  if (item?.pictures) {
    pictures = item.pictures.split(",");
  }
  if (item?.videos) {
    videos = item.videos.split(",");
  }

  console.log("pictures", pictures);
  if (!item) {
    return null;
  }
  return (
    <Card
      onPress={handleCheckDetail}
      style={[styles.container, backgrounds.gray1600]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Image
            size={40}
            source={{
              uri: item.user?.avatar,
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={{ ...styles.nameText, color: colors.gray800 }}>
              {item.user?.nickName}
            </Text>
            <Text style={{ ...styles.dateText, color: colors.gray800 }}>
              {item?.createTime
                ? dayjs(+item?.createTime).format("YYYY-MM-DD")
                : item?.createTime}
            </Text>
          </View>
        </View>

        {!hideVisibleShield ? (
          <View style={styles.menuWrapper}>
            <Pressable hitSlop={10} onPress={toggleOpenMenu} style={{}}>
              <Image
                source={MoreIcon as ImageURISource}
                style={styles.moreIcon}
              />
            </Pressable>
            {visibleMenu ? (
              item.user && item.user.id === userInfo.id ? (
                <Pressable onPress={handleDelete} style={styles.shieldWrapper}>
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
                <Pressable onPress={handleShield} style={styles.shieldWrapper}>
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
              )
            ) : undefined}
          </View>
        ) : undefined}
      </View>
      <View style={styles.coverImageWrapper}>
        {videos.length > 0 ? (
          <VideoPlayer
            paused
            disablePlayPause
            disableFullscreen
            disableVolume
            disableBack
            disableTimer
            disableSeekbar
            useAnimations={useAnimations}
            source={{ uri: videos[0] }}
            containerStyle={styles.coverImage}
            onPlay={() => {
              setPaused(false);
            }}
            onPause={() => {
              setPaused(true);
            }}
          />
        ) : (
          <Image
            source={{
              uri: pictures[0],
            }}
            style={styles.coverImage}
          />
        )}
        {videos.length > 0 ? (
          <Image source={PlayIcon as ImageURISource} style={styles.playIcon} />
        ) : undefined}
      </View>
      <View style={styles.toolWrapper}>
        <View style={styles.toolLeft}>
          <View style={styles.tool}>
            {item.whetherGiveLikeByLoginUser ? (
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
            <Text style={{ ...styles.toolText, color: colors.gray800 }}>
              {item.likesNum ?? 0}
            </Text>
          </View>
          <View style={styles.tool}>
            <Image
              source={MessageIcon as ImageURISource}
              style={styles.toolIcon}
            />
            <Text style={{ ...styles.toolText, color: colors.gray800 }}>
              {item.commentNum ?? 0}
            </Text>
          </View>
          <View style={styles.tool}>
            <Image
              source={ShareIcon as ImageURISource}
              style={styles.toolIcon}
            />
            <Text style={{ ...styles.toolText, color: colors.gray800 }}>
              {item.forwardNum ?? 0}
            </Text>
          </View>
        </View>
        <View style={styles.tool}>
          {item.whetherFavoriteByLoginUser ? (
            <Image
              source={CollectFIcon as ImageURISource}
              style={styles.toolIcon}
            />
          ) : (
            <Image
              source={CollectIcon as ImageURISource}
              style={styles.toolIcon}
            />
          )}
        </View>
      </View>
      <View style={styles.desc}>
        <Text numberOfLines={2} style={styles.descText}>
          {item.content}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  container: {
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  coverImage: {
    borderRadius: 18,
    height: 229,
    width: "100%",
  },
  coverImageWrapper: {
    marginBottom: 16,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    height: 36,
    position: "absolute",
    width: 36,
  },
  dateText: {
    fontSize: 12,
    marginTop: 6,
  },
  desc: {
    marginTop: 8,
  },
  descText: {
    fontSize: 13,
    fontWeight: 500,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  menuWrapper: {
    position: "relative",
  },
  moreIcon: {
    height: 4,
    width: 17,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 600,
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
    top: 10,
    right: 0,
    zIndex: 9,
  },
  tool: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  toolIcon: {
    height: 21,
    width: 21,
  },
  toolLeft: {
    flexDirection: "row",
    gap: 18,
  },
  toolText: {
    fontSize: 12,
    fontWeight: 500,
  },
  toolWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

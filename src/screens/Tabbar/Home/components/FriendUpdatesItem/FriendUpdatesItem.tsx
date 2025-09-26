import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ImageURISource,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ImageWithFallback } from "@/components/atoms";
import { Text } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import PlayIcon from "@/assets/images/256.png";
import LikeIcon from "@/assets/images/52.png";

import { dayjs } from "@/plugins/day.ts";
import { normalizeImageUrl } from "@/utils/image";

export default function FriendUpdatesItem({ item }) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  let pictures: string[] = [];
  let videos: string[] = [];

  if (item?.pictures) {
    if (Array.isArray(item.pictures)) {
      pictures = item.pictures.filter(Boolean);
    } else if (typeof item.pictures === "string") {
      pictures = item.pictures
        .split(",")
        .map((value: string) => value.trim())
        .filter(Boolean);
    }
  }

  if (!pictures.length && Array.isArray(item?.images)) {
    pictures = item.images.filter(Boolean);
  }

  if (!pictures.length && item?.image) {
    pictures = [item.image];
  }

  if (item?.videos) {
    if (Array.isArray(item.videos)) {
      videos = item.videos.filter(Boolean);
    } else if (typeof item.videos === "string") {
      videos = item.videos
        .split(",")
        .map((value: string) => value.trim())
        .filter(Boolean);
    }
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
  return (
    <Pressable
      onPress={() => {
        navigation.navigate(Paths.DynamicDetail, {
          id: String(item?.id ?? ""),
          payload: item,
          pictures: picturesParam,
          videos: videosParam,
          image: firstImage,
          coverImage: firstImage,
          content: item?.content,
        });
      }}
      style={[styles.container]}
    >
      <View style={styles.coverImageWrapper}>
        <ImageWithFallback
          uri={normalizeImageUrl(pictures[0])}
          style={styles.coverImage}
        />
        {videos.length > 0 ? (
          <Image source={PlayIcon as ImageURISource} style={styles.playIcon} />
        ) : null}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.titleText}>
          {item.content}
        </Text>
        <Text style={{ ...styles.dateText, color: colors.gray800 }}>
          {item.createTime
            ? dayjs(item.createTime).format("YYYY-MM-DD HH:mm")
            : item.createTime}
        </Text>
        <View style={styles.toolWrapper}>
          <View style={styles.toolLeft}>
            <ImageWithFallback
              uri={normalizeImageUrl(item.user?.avatar)}
              style={styles.avatar}
            />
            <Text style={{ ...styles.nameText, color: colors.gray800 }}>
              {item.user?.nickName}
            </Text>
          </View>

          <View style={styles.toolLeft}>
            <Image
              source={LikeIcon as ImageURISource}
              style={styles.likeIcon}
            />
            <Text style={{ ...styles.likeText, color: colors.gray800 }}>
              {item.likesNum}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  likeIcon: {
    height: 20,
    width: 20,
  },
  commentNumberText: {
    fontSize: 12,
    marginLeft: 2,
  },
  container: {
    width: 150,
  },
  content: {
    paddingTop: 16,
  },
  coverImage: {
    borderRadius: 18,
    height: 120,
    width: "100%",
  },
  coverImageWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 13,
    marginTop: 10,
  },
  nameText: {
    fontSize: 11,
  },

  likeText: {
    fontSize: 11,
  },
  playIcon: {
    height: 36,
    position: "absolute",
    width: 36,
  },
  titleText: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: 500,
  },
  toolLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
  },
  toolWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

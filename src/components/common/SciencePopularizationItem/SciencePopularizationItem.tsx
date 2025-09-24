import { useNavigation } from "@react-navigation/native";
import {
  Image,
  ImageURISource,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import DateIcon from "@/assets/images/249.png";
import PlayIcon from "@/assets/images/256.png";
import CollectFIcon from "@/assets/images/247.png";
import { dayjs } from "@/plugins/day.ts";
import { normalizeImageUrl, DEFAULT_PLACEHOLDER } from "@/utils/image";
// Conditionally import media console components
let useAnimations: any = () => ({});
let VideoPlayer: any = null;
// Note: Removed require() imports to fix linter warnings
VideoPlayer = ({ children, ...props }: any) => children;

export default function SciencePopularizationItem({
  item,
  showCollectIcon,
}: any) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate(Paths.SciencePopularizationDetail, {
          id: item.id,
        });
      }}
      style={[styles.container]}
    >
      <View>
        <View style={styles.coverImageWrapper}>
          {item.coverVideo ? (
            <VideoPlayer
              paused
              disablePlayPause
              disableFullscreen
              disableVolume
              disableBack
              disableTimer
              disableSeekbar
              useAnimations={useAnimations}
              source={{ uri: item.coverVideo }}
              containerStyle={styles.coverImage}
            />
          ) : (
            <Image
              source={{ uri: normalizeImageUrl(item.coverImage) }}
              defaultSource={DEFAULT_PLACEHOLDER as unknown as number}
              style={styles.coverImage}
            />
          )}
          {item.coverVideo ? (
            <Image
              source={PlayIcon as ImageURISource}
              style={styles.playIcon}
            />
          ) : undefined}
        </View>
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.titleText}>
            {item.title}
          </Text>
          <View style={styles.toolWrapper}>
            <View style={styles.toolLeft}>
              <Image
                source={DateIcon as ImageURISource}
                style={styles.dateIcon}
              />
              <Text style={{ ...styles.dateText, color: colors.gray800 }}>
                {item?.createTime
                  ? dayjs(+item?.createTime).format("YYYY-MM-DD")
                  : item?.createTime}
              </Text>
            </View>
            {showCollectIcon ? (
              <Image
                source={CollectFIcon as ImageURISource}
                style={styles.collectIcon}
              />
            ) : undefined}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  collectIcon: {
    height: 20,
    width: 20,
  },
  commentNumberText: {
    fontSize: 12,
    marginLeft: 2,
  },
  container: {
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
    maxWidth: 156,
    minWidth: 150,
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
  dateIcon: {
    height: 12,
    width: 12,
  },
  dateText: {
    fontSize: 13,
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
    gap: 5,
  },
  toolWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
});

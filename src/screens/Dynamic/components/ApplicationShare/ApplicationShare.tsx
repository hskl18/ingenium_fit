import {
  Image,
  ImageURISource,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, Text } from "react-native-paper";
import { Platform } from "react-native";

// Conditionally import Clipboard
let Clipboard: any = null;
if (Platform.OS !== "web") {
  try {
    Clipboard = require("@react-native-clipboard/clipboard").default;
  } catch (error) {
    console.warn("Clipboard not available in Expo Go");
  }
}
import { useTheme } from "@/theme";

import CloseIcon from "@/assets/images/181.png";
import ShareIcon from "@/assets/images/220.png";
import CopyLinkIcon from "@/assets/images/609.png";
import { Configs } from "@/common/configs.ts";

type Menu = {
  code: string;
  icon: ImageURISource;
  name: string;
};
export default function ApplicationShare({
  hideModal,
  visible,
}: {
  readonly hideModal: () => void;
  readonly visible: boolean;
}) {
  const { backgrounds } = useTheme();

  const menus: Menu[] = [
    {
      code: "share",
      name: "Share",
      icon: ShareIcon,
    },
    {
      code: "copy-link",
      name: "Copy link",
      icon: CopyLinkIcon,
    },
  ];

  const handleMenuClick = async (menu: Menu) => {
    hideModal();
    const shareUrl = Configs.ShareLink;
    switch (menu.code) {
      case "share": {
        try {
          const result = await Share.share({
            title: Configs.AppName,
            message: `【${Configs.AppName}】${shareUrl}`,
          });

          console.log("result", result);
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error: any) {
          console.log(error);
        }
        break;
      }
      case "copy-link": {
        if (Clipboard) {
          Clipboard.setString(`【${Configs.AppName}】${shareUrl}`);
        } else if (Platform.OS === "web" && navigator.clipboard) {
          // Web fallback
          navigator.clipboard.writeText(`【${Configs.AppName}】${shareUrl}`);
        } else {
          console.warn("Clipboard not available");
        }
        break;
      }
    }
  };
  return (
    <Modal
      animationType="fade"
      onRequestClose={hideModal}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.containerStyle}>
        <TouchableOpacity onPress={hideModal} style={{ flex: 1 }} />
        <View style={[styles.container, backgrounds.gray1600]}>
          <View style={styles.titleWrapper}>
            <Text style={styles.titleText}>{"Share to"}</Text>
            <Pressable onPress={hideModal} style={styles.closeIconWrapper}>
              <Image
                source={CloseIcon as ImageURISource}
                style={styles.closeIcon}
              ></Image>
            </Pressable>
          </View>
          <View style={styles.menuWrapper}>
            {menus.map((menu: Menu, index: number) => (
              <Pressable
                onPress={() => {
                  handleMenuClick(menu);
                }}
                key={menu.code}
                style={styles.menu}
              >
                <Image source={menu.icon} style={styles.menuIcon}></Image>
                <Text style={styles.menuText}>{menu.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  containerStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },
  menu: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 20,
  },
  closeIconWrapper: {
    position: "absolute",
    right: 20,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  menuIcon: {
    width: 54,
    height: 54,
  },
  menuText: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: 500,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 28,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    flexShrink: 1,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

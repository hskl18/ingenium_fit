import { Image, ImageURISource, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "@/hooks";

import NothingIcon from "@/assets/images/nothing.png";
import { useTheme } from "@/theme";

export default function Empty() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        source={NothingIcon as ImageURISource}
        style={styles.nothingIcon}
      />
      <Text style={{ ...styles.text, color: colors.gray800 }}>
        {t("common.no_data")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "center",
    flex: 1,
  },
  nothingIcon: {
    height: 240,
    width: 240,
  },
  text: {
    fontSize: 14,
  },
});

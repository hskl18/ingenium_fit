import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useTheme } from "@/theme";

interface WebFeatureNoticeProps {
  feature?: string;
  message?: string;
}

const WebFeatureNotice: React.FC<WebFeatureNoticeProps> = ({
  feature = "This feature",
  message = "is not available on the web version. Please use the mobile app for full functionality.",
}) => {
  const { colors } = useTheme();

  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.blue8 }]}>
      <Text style={[styles.text, { color: colors.gray1600 }]}>
        🌐 {feature} {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default WebFeatureNotice;

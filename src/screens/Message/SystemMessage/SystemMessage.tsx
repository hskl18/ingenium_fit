import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { RootScreenProps } from "@/navigation/types.ts";
import { Paths } from "@/navigation/paths.ts";

import { SafeScreen } from "@/components/templates";

export default function SystemMessage({
  navigation,
}: RootScreenProps<Paths.SystemMessage>) {
  return (
    <SafeScreen edges={[]} style={styles.safeScreen}>
      <View style={styles.container}>
        <Text style={styles.title}>
          System Message functionality placeholder
        </Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safeScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
});

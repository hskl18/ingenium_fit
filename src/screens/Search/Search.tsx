import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { RootScreenProps } from "@/navigation/types.ts";
import { Paths } from "@/navigation/paths.ts";

import { SafeScreen } from "@/components/templates";

export default function Search({ navigation }: RootScreenProps<Paths.Search>) {
  return (
    <SafeScreen edges={[]} style={styles.safeScreen}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.arrowIcon}>←</Text>
          </Pressable>
          <View style={styles.inputBar}>
            <View style={styles.inputInner}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.input}>{"Search..."}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>Search functionality placeholder</Text>
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
  inputWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputBar: {
    flex: 1,
  },
  inputInner: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    paddingHorizontal: 16,
    height: 46,
    backgroundColor: "#f5f5f5",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
  },
  searchIcon: {
    width: 14,
    height: 14,
    marginRight: 10,
  },
  arrowIcon: {
    width: 22,
    height: 22,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
});

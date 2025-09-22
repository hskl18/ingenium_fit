import type { RootScreenProps } from "@/navigation/types";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeScreen } from "@/components/templates";
import { useTheme } from "@/theme";
import { Analytics } from "@/utils";

export default function Research(_props: RootScreenProps<"research">) {
  const { colors } = useTheme();

  useEffect(() => {
    Analytics.screen("Research");
  }, []);

  return (
    <ScrollView>
      <SafeScreen style={styles.safe}>
        <View style={styles.section}>
          <Text variant="titleLarge">Adaptive Sport Navigator Research</Text>
          <Text style={[styles.paragraph, { color: colors.gray800 }]}>
            Mixed-methods study evaluating how an iOS-based navigator app
            reduces barriers for athletes with disabilities in Pasadena, CA.
          </Text>
        </View>
        <View style={styles.section}>
          <Text variant="titleMedium">Key Barriers Addressed</Text>
          <Text style={styles.paragraph}>• Knowledge access</Text>
          <Text style={styles.paragraph}>• Transportation</Text>
          <Text style={styles.paragraph}>• Equipment costs</Text>
          <Text style={styles.paragraph}>• Fragmented healthcare</Text>
        </View>
        <View style={styles.section}>
          <Text variant="titleMedium">Measures</Text>
          <Text style={styles.paragraph}>• Baseline awareness</Text>
          <Text style={styles.paragraph}>• Usability of prototype</Text>
          <Text style={styles.paragraph}>• Confidence change</Text>
          <Text style={styles.paragraph}>• Participation rates</Text>
          <Text style={styles.paragraph}>• Perceived accessibility</Text>
        </View>
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  safe: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
});

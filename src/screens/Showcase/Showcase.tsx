import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { useTranslation } from "@/hooks";

import { SafeScreen } from "@/components/templates";
import { showcaseCtaCards, showcaseSections } from "@/data/showcaseContent";
import { Paths } from "@/navigation/paths";
import type { RootScreenProps } from "@/navigation/types";
import { useTheme } from "@/theme";

function Showcase({ navigation }: RootScreenProps<Paths.Showcase>) {
  const { backgrounds, colors } = useTheme();
  const { t } = useTranslation();
  return (
    <SafeScreen
      edges={["bottom"]}
      style={[styles.safeScreen, backgrounds.gray1600]}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{"Showcase"}</Text>
        <Text style={{ ...styles.subtitle, color: colors.gray500 }}>
          {"Highlights and examples"}
        </Text>

        <View style={styles.ctaWrapper}>
          {showcaseCtaCards.map((card) => (
            <Card key={card.id} mode="contained" style={styles.ctaCard}>
              <Card.Cover
                source={{ uri: card.media }}
                style={styles.cardCover}
              />
              <Card.Content>
                <Text style={styles.cardTitle}>{card.titleKey}</Text>
                <Text
                  style={{ ...styles.cardDescription, color: colors.gray500 }}
                >
                  {card.descriptionKey}
                </Text>
                {card.badgeKeys ? (
                  <View style={styles.badgeRow}>
                    {card.badgeKeys.map((badge) => (
                      <Text key={badge} style={styles.badge}>
                        {badge}
                      </Text>
                    ))}
                  </View>
                ) : undefined}
              </Card.Content>
            </Card>
          ))}
        </View>

        {showcaseSections.map((section) => (
          <View key={section.id} style={styles.sectionWrapper}>
            <Text style={styles.sectionTitle}>{section.titleKey}</Text>
            <Text style={{ ...styles.sectionSubtitle, color: colors.gray500 }}>
              {section.subtitleKey}
            </Text>
            <View style={styles.cardList}>
              {section.cards.map((card) => (
                <Card key={card.id} mode="contained" style={styles.featureCard}>
                  <Card.Cover
                    source={{ uri: card.media }}
                    style={styles.cardCover}
                  />
                  <Card.Content>
                    <Text style={styles.cardTitle}>{card.titleKey}</Text>
                    <Text
                      style={{
                        ...styles.cardDescription,
                        color: colors.gray500,
                      }}
                    >
                      {card.descriptionKey}
                    </Text>
                    {card.badgeKeys ? (
                      <View style={styles.badgeRow}>
                        {card.badgeKeys.map((badge) => (
                          <Text key={badge} style={styles.badge}>
                            {badge}
                          </Text>
                        ))}
                      </View>
                    ) : undefined}
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        ))}

        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate(Paths.Tabbar);
          }}
          style={styles.backButton}
        >
          {"Learn more"}
        </Button>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(0, 119, 210, 0.12)",
    borderRadius: 999,
    color: "#0B3A64",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  backButton: {
    borderRadius: 14,
    marginTop: 40,
  },
  cardCover: {
    height: 152,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  cardList: {
    gap: 24,
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  contentContainer: {
    paddingBottom: 80,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  ctaCard: {
    borderRadius: 18,
    flex: 1,
    minWidth: 220,
  },
  ctaWrapper: {
    flexDirection: "column",
    gap: 20,
    marginTop: 28,
  },
  featureCard: {
    borderRadius: 18,
  },
  safeScreen: {
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  sectionWrapper: {
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
  },
});

export default Showcase;

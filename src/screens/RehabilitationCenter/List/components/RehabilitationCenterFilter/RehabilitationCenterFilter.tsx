import * as React from "react";
// import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Pressable,
  Image,
  ImageURISource,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";

import { useTheme } from "@/theme";

// import SortIcon from "@/assets/images/179.png";
// import SortFIcon from "@/assets/images/180.png";
import CloseIcon from "@/assets/images/181.png";

const scoreList = [
  {
    id: 1,
    label: "1-3",
    minScore: 1,
    maxScore: 3,
  },
  {
    id: 3,
    label: "3-5",
    minScore: 3,
    maxScore: 5,
  },
];
type ScoreState = {
  id: string | number;
  label?: string;
  minScore?: string | number;
  maxScore?: string | number;
};
type DistanceState = {
  id: string | number;
  label?: string;
  minDistance?: string | number;
  maxDistance?: string | number;
};

export default function RehabilitationCenterFilter({
  hideModal,
  setScore,
  score,
  setDistance,
  distance,
  visible,
}: {
  readonly distance: DistanceState;
  readonly hideModal: () => void;
  readonly score: ScoreState;
  readonly setDistance: (distance: DistanceState) => void;
  readonly setScore: (score: ScoreState) => void;
  readonly visible: boolean;
}) {
  const { backgrounds, colors } = useTheme();
  const [scopeScore, setScopeScore] = useState<ScoreState>(
    score || ({} as any)
  );
  const [scopeDistance, setScopeDistance] = useState<DistanceState>(
    distance || ({} as any)
  );

  const handleSubmit = () => {
    hideModal();
    setScore(scopeScore);
    setDistance(scopeDistance);
  };
  const distanceList: DistanceState[] = [
    {
      id: 1,
      label: "Within 1km",
      maxDistance: 1,
      minDistance: "",
    },
    {
      id: 2,
      label: "1-3km",
      maxDistance: 3,
      minDistance: 1,
    },
    {
      id: 3,
      label: "3-5km",
      maxDistance: 5,
      minDistance: 3,
    },
    {
      id: 4,
      label: "5-10km",
      maxDistance: 10,
      minDistance: 5,
    },
    {
      id: 5,
      label: "10-15km",
      maxDistance: 15,
      minDistance: 10,
    },
    {
      id: 6,
      label: "Over 15km",
      maxDistance: "",
      minDistance: 15,
    },
  ];

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
            <Text style={styles.titleText}>{"Filter by"}</Text>
            <Pressable style={styles.closeIcon} onPress={hideModal}>
              <Image
                source={CloseIcon as ImageURISource}
                style={styles.closeIcon}
              />
            </Pressable>
          </View>
          <View style={styles.scoreWrapper}>
            <Text style={styles.titleText}>{"Rating"}</Text>
            <View style={styles.scoreInnerWrapper}>
              {scoreList.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    setScopeScore(item);
                  }}
                  style={[
                    styles.score,
                    scopeScore.id === item.id
                      ? {
                          backgroundColor: colors.primary,
                        }
                      : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      scopeScore.id === item.id
                        ? {
                            color: colors.gray1600,
                          }
                        : {},
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.distanceWrapper}>
            <Text style={styles.titleText}>{"Distance"}</Text>
            <View style={styles.distanceInnerWrapper}>
              {distanceList.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    setScopeDistance(item);
                  }}
                  style={[
                    styles.score,
                    scopeDistance.id === item.id
                      ? {
                          backgroundColor: colors.primary,
                        }
                      : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      scopeDistance.id === item.id
                        ? {
                            color: colors.gray1600,
                          }
                        : {},
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Button
            contentStyle={styles.button}
            labelStyle={styles.buttonText}
            mode="contained"
            onPress={handleSubmit}
          >
            {"Confirm"}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    height: 49,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  closeIcon: {
    height: 14,
    width: 14,
  },
  container: {
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  containerStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },
  score: {
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    height: 32,
    paddingHorizontal: 14,
  },
  scoreInnerWrapper: {
    marginTop: 15,
    gap: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  distanceInnerWrapper: {
    marginTop: 15,
    gap: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  scoreText: {
    fontSize: 15,
    fontWeight: 600,
  },
  scoreWrapper: {
    marginTop: 22,
  },
  distanceWrapper: {
    marginTop: 22,
    marginBottom: 26,
  },
  titleText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
  titleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

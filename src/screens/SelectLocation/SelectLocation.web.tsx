import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useShallow } from "zustand/react/shallow";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { storage } from "@/storage";
import { Configs } from "@/common/configs.ts";
import { useLocationStore, FALLBACK_LOCATION } from "@/store";

export default function SelectLocation({
  route,
  navigation,
}: RootScreenProps<Paths.SelectLocation>) {
  const { source } = route.params;  const [location, setLocation] = useLocationStore(
    useShallow((state) => [state.location, state.setLocation])
  );

  const { backgrounds } = useTheme();

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation({
            coords,
            city: "Current Location",
          });
          storage.set(
            Configs.Location,
            JSON.stringify({
              coords,
              city: "Current Location",
            })
          );
          if (source === Paths.ObtainPosition) {
            navigation.reset({
              index: 0,
              routes: [{ name: Paths.Tabbar }],
            });
          } else {
            navigation.goBack();
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use fallback location
          setLocation(FALLBACK_LOCATION);
          storage.set(Configs.Location, JSON.stringify(FALLBACK_LOCATION));
          if (source === Paths.ObtainPosition) {
            navigation.reset({
              index: 0,
              routes: [{ name: Paths.Tabbar }],
            });
          } else {
            navigation.goBack();
          }
        }
      );
    }
  };

  return (
    <View style={[styles.container, backgrounds.gray1600]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {"Select Location"}
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          Maps are not available on web. Please use the mobile app for full
          location features.
        </Text>
        <Button
          mode="contained"
          onPress={handleUseCurrentLocation}
          style={styles.button}
        >
          Use Current Location
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            if (source === Paths.ObtainPosition) {
              navigation.reset({
                index: 0,
                routes: [{ name: Paths.Tabbar }],
              });
            } else {
              navigation.goBack();
            }
          }}
          style={styles.button}
        >
          Skip
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.7,
  },
  button: {
    marginVertical: 8,
    minWidth: 200,
  },
});

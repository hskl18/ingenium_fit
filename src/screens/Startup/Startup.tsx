import type { RootScreenProps } from "@/navigation/types";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "@/hooks";
import {
  ActivityIndicator,
  Image,
  ImageURISource,
  Text,
  View,
} from "react-native";

import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import { AssetByVariant } from "@/components/atoms";
import { SafeScreen } from "@/components/templates";
import { storage } from "@/storage";
import { Configs } from "@/common/configs.ts";
import LogoIocn from "@/assets/logo/logo.png";

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const { fonts, gutters, layout } = useTheme();

  const { isError, isFetching, isSuccess } = useQuery({
    queryFn: () => {
      return Promise.resolve(true);
    },
    queryKey: ["startup"],
  });

  useEffect(() => {
    if (isSuccess) {
      const token = storage.getString(Configs.Token);
      if (token) {
        const keys = storage.getAllKeys();
        console.log("keys", keys);
        const location = storage.getString(Configs.Location);
        console.log("location", location);
        if (!location) {
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.ObtainPosition }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.Tabbar }],
          });
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Login }],
        });
      }
    }
  }, [isSuccess, navigation]);

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
        ]}
      >
        <Image
          source={LogoIocn as ImageURISource}
          resizeMode="contain"
          style={{ height: 300, width: 300 }}
        />
        {isFetching ? (
          <ActivityIndicator size="large" style={[gutters.marginVertical_24]} />
        ) : undefined}
        {isError ? (
          <Text style={[fonts.size_16, fonts.red500]}>{"An error occurred"}</Text>
        ) : undefined}
      </View>
    </SafeScreen>
  );
}

export default Startup;

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, ImageURISource, StyleSheet } from "react-native";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import Dynamic from "@/screens/Tabbar/Dynamic/Dynamic";
import Home from "@/screens/Tabbar/Home/Home";
import Profile from "@/screens/Tabbar/Profile/Profile";

import HomeFIcon from "@/assets/tabbar/34.png";
import DynamicIcon from "@/assets/tabbar/36.png";
import HomeIcon from "@/assets/tabbar/38.png";
import DynamicFIcon from "@/assets/tabbar/39.png";
import ProfileIcon from "@/assets/tabbar/40.png";
import ProfileFIcon from "@/assets/tabbar/68.png";
import { useTranslation } from "@/hooks";

const Tab = createBottomTabNavigator();

export default function Tabbar() {
  const { backgrounds } = useTheme();
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: t("tabbar.home"),
        tabBarStyle: { ...backgrounds.gray1600 },
        title: t("tabbar.home"),
      }}
    >
      <Tab.Screen
        component={Home}
        name={Paths.Home}
        options={{
          headerShown: false,
          headerTitle: t("tabbar.home"),
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                alt={t("common.home")}
                source={HomeFIcon as ImageURISource}
                style={styles.iconStyle}
              />
            ) : (
              <Image
                alt={t("common.home")}
                source={HomeIcon as ImageURISource}
                style={styles.iconStyle}
              />
            );
          },
          title: t("tabbar.home"),
        }}
      />
      <Tab.Screen
        component={Dynamic}
        name={Paths.Dynamic}
        options={{
          headerShown: false,
          headerTitle: t("tabbar.dynamic"),
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                alt={t("common.home")}
                source={DynamicFIcon as ImageURISource}
                style={styles.iconStyle}
              />
            ) : (
              <Image
                alt={t("common.home")}
                source={DynamicIcon as ImageURISource}
                style={styles.iconStyle}
              />
            );
          },
          title: t("tabbar.dynamic"),
        }}
      />
      <Tab.Screen
        component={Profile}
        name={Paths.Profile}
        options={{
          headerShown: false,
          headerTitle: t("tabbar.profile"),
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                alt={t("common.home")}
                source={ProfileFIcon as ImageURISource}
                style={styles.iconStyle}
              />
            ) : (
              <Image
                alt={t("common.home")}
                source={ProfileIcon as ImageURISource}
                style={styles.iconStyle}
              />
            );
          },
          title: t("tabbar.profile"),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    height: 22,
    width: 22,
  },
});

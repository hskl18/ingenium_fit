import type { RootScreenProps } from "@/navigation/types.ts";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

import { Paths } from "@/navigation/paths.ts";

import FollowersList from "@/screens/FanAttention/components/FollowersList/FollowersList.tsx";
import FollowingList from "@/screens/FanAttention/components/FollowingList/FollowingList.tsx";
import { useTranslation } from "@/hooks";

const Tab = createMaterialTopTabNavigator();

export default function FanAttention({
  route,
}: RootScreenProps<Paths.FanAttention>) {
  const { name } = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
        },
      }}
      initialRouteName={name}
    >
      <Tab.Screen
        component={FollowingList}
        name={Paths.FollowingList}
        options={{
          title: "Following list",
        }}
      />
      <Tab.Screen
        component={FollowersList}
        name={Paths.FollowersList}
        options={{
          title: "Followers list",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

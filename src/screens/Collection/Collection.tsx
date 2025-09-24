import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

import InstitutionList from "@/screens/Collection/components/InstitutionList/InstitutionList.tsx";
import SciencePopularizationList from "@/screens/Collection/components/SciencePopularizationList/SciencePopularizationList.tsx";
import UpdatesList from "@/screens/Collection/components/UpdatesList/UpdatesList.tsx";
import { useTranslation } from "@/hooks";

const Tab = createMaterialTopTabNavigator();

export default function Collection() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      id="CollectionTab"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
        },
      }}
    >
      <Tab.Screen component={InstitutionList} name={"Rehabilitation centers"} />
      <Tab.Screen component={SciencePopularizationList} name={"Knowledge"} />
      <Tab.Screen component={UpdatesList} name={"Updates"} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

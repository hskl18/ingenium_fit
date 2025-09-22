import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';

import InstitutionList from '@/screens/Collection/components/InstitutionList/InstitutionList.tsx';
import SciencePopularizationList from '@/screens/Collection/components/SciencePopularizationList/SciencePopularizationList.tsx';
import UpdatesList from '@/screens/Collection/components/UpdatesList/UpdatesList.tsx';
import { useTranslation } from '@/hooks';

const Tab = createMaterialTopTabNavigator();

export default function Collection() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tab.Screen component={InstitutionList} name={t('common.rehabilitation_centre')}  />
      <Tab.Screen
        component={SciencePopularizationList}
        name={t('common.science_popularization')}
      />
      <Tab.Screen component={UpdatesList}  name={t('common.updates')} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

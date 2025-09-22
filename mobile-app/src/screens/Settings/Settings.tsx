import { useState } from 'react';
import { useTranslation } from '@/hooks';
import {
  Image,
  ImageURISource,
  StyleSheet,
  View,
} from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { Pressable } from 'react-native-gesture-handler';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';
import CancelAccount from '@/screens/Settings/components/CancelAccount/CancelAccount.tsx';

import ArrowIcon from '@/assets/images/203.png';
import { Agreements } from '@/common/agreement.ts';

type Menu = {
  code: string;
  name: string;
  path: Paths;
  params?: any;
};

export default function Settings({
  navigation,
}: RootScreenProps<Paths.Settings>) {
  const { t } = useTranslation();
  const { backgrounds, colors } = useTheme();
  
  const menus: Menu[] = [
    {
      code: 'changePassword',
      name: t('common.change_password'),
      path: Paths.ChangePassword,
    },
    {
      code: 'platformAgreement',
      name: t('common.platform_agreement'),
      params: {
        code: Agreements.PlatformAgreement,
      },
      path: Paths.Agreement,
    },
    {
      code: 'aboutUs',
      name: t('common.about_us'),
      params: {
        code: Agreements.AboutUs,
      },
      path: Paths.Agreement,
    },
  ];
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };

  const handleMenuClick = (item: Menu) => {
    navigation.navigate(item.path, item.params || {});
  };
  return (
    <SafeScreen edges={['bottom']} style={[backgrounds.gray1550]}>
      <View style={styles.container}>
        {menus.map((menu: Menu, index: number) => (
          <View key={menu.code}>
            <Pressable
              onPress={() => {
                handleMenuClick(menu);
              }}
            >
              <View style={[styles.menu, backgrounds.gray1600]}>
                <Text style={styles.menuNameText}>{menu.name}</Text>
                <Image
                  alt="arrow-right"
                  source={ArrowIcon as ImageURISource}
                  style={styles.menuArrowIcon}
                />
              </View>
            </Pressable>
            {index < menus.length-1 && <Divider />}
          </View>
        ))}
        <Pressable onPress={showModal}>
          <View style={[styles.menu, backgrounds.gray1600, { marginTop: 10 }]}>
            <Text style={styles.menuNameText}>{t('common.cancel_account')}</Text>
            <Image
              alt="arrow-right"
              source={ArrowIcon as ImageURISource}
              style={styles.menuArrowIcon}
            />
          </View>
        </Pressable>
      </View>

      <CancelAccount hideModal={hideModal} visible={visible} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  menuArrowIcon: {
    height: 15,
    width: 11,
  },
  menuNameText: {
    fontSize: 15,
    fontWeight: 500,
  },
});

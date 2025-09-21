import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, Text } from 'react-native-paper';

import { useI18n } from '@/hooks';
import { SupportedLanguages } from '@/hooks/language/schema.ts';
import { useTheme } from '@/theme';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { storage } from '@/App.tsx';
import { Configs } from '@/common/configs.ts';

type Menu = {
  code: SupportedLanguages;
  name: string;
};
export default function SetLanguage({
  hideModal,
  visible,
}: {
  readonly hideModal: () => void;
  readonly visible: boolean;
}) {
  const { t } = useTranslation();
  const { toggleLanguage } = useI18n();
  const { backgrounds } = useTheme();
  const queryClient = useQueryClient();
  
  const menus: Menu[] = [
    {
      code: SupportedLanguages.zh_Hans,
      name: t('common.chinese'),
    },
    {
      code: SupportedLanguages.EN_EN,
      name: t('common.english'),
    },
  ];

  const handleMenuClick = (menu: Menu) => {
    toggleLanguage(menu.code);
    storage.set(Configs.Language,menu.code)
    hideModal();
    queryClient.invalidateQueries({ exact: true });
  };
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
          {menus.map((menu: Menu, index: number) => (
            <View key={menu.code}>
              <Pressable
                onPress={() => {
                  handleMenuClick(menu);
                }}
              >
                <View style={styles.titleWrapper}>
                  <Text style={styles.titleText}>{menu.name}</Text>
                </View>
              </Pressable>
              {index < menus.length - 1 && <Divider />}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  titleText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});

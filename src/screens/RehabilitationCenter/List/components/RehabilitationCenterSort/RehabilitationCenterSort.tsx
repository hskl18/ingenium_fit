import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from '@/hooks';
import {
  Pressable,
  Image,
  ImageURISource,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useTheme } from '@/theme';

import SortIcon from '@/assets/images/179.png';
import SortFIcon from '@/assets/images/180.png';
import CloseIcon from '@/assets/images/181.png';

export default function RehabilitationCenterSort({
  hideModal,
  setSortBy,
  sortBy,
  visible,
}: {
  readonly hideModal: () => void;
  readonly setSortBy: (sortBy: string) => void;
  readonly sortBy: string;
  readonly visible: boolean;
}) {
  const navigation = useNavigation();
  const { backgrounds, colors } = useTheme();

  // 排序方式：1-默认排序(默认) 2-距离排序 3-星级排序
  const [sort, setSort] = useState(sortBy || '');

  const handleSubmit = () => {
    setSortBy(sort);
    hideModal();
  };

  console.log('sort', sort);
  const sortList = [
    {
      label: t('common.default_collation'),
      value: 1,
    },
    {
      label: t('common.closest_distance'),
      value: 2,
    },
    {
      label: t('common.highest_rating'),
      value: 3,
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
            <Text style={styles.titleText}>{t('common.sort_by')}</Text>
            <Pressable style={styles.closeIcon} onPress={hideModal}>
              <Image
                source={CloseIcon as ImageURISource}
                style={styles.closeIcon}
              />
            </Pressable>
          </View>

          <View style={styles.sortWrapper}>
            {sortList.map((sortItem) => (
              <Pressable
                key={sortItem.value}
                onPress={() => {
                  setSort(sortItem.value);
                }}
                style={styles.sort}
              >
                {+sort === sortItem.value ? (
                  <Image
                    source={SortFIcon as ImageURISource}
                    style={styles.sortIcon}
                  />
                ) : (
                  <Image
                    source={SortIcon as ImageURISource}
                    style={styles.sortIcon}
                  />
                )}

                <Text style={styles.sortText}>{sortItem.label}</Text>
              </Pressable>
            ))}
          </View>

          <Button
            contentStyle={styles.button}
            labelStyle={styles.buttonText}
            mode="contained"
            onPress={handleSubmit}
          >
            {t('common.confirm')}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    height: 49,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  sort: {
    paddingVertical: 9,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  sortIcon: {
    height: 22,
    width: 22,
  },
  sortText: {
    fontSize: 16,
    fontWeight: 500,
  },
  sortWrapper: {
    marginBottom: 16,
    marginTop: 12,
  },
  titleText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';
import { useShallow } from 'zustand/react/shallow';
import { Pressable } from 'react-native-gesture-handler';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import ArrowIcon from '@/assets/images/203.png';

import { editUserInfo, getLoginUser } from '@/services';
import { useUserStore } from '@/store';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-root-toast';
import AWSHelper from '@/utils/upload.ts';

type Menu = {
  code: string;
  name: string;
  path?: string;
};

export default function PersonalInformation({
  navigation,
}: RootScreenProps<Paths.PersonalInformation>) {
  const { t } = useTranslation();
  const { backgrounds, colors } = useTheme();

  const menus: Menu[] = [
    {
      code: 'nickname',
      name: t('common.nickname'),
      path: Paths.Nickname,
    },
    {
      code: 'name',
      name: t('common.name'),
    },
    {
      code: 'contactInformation',
      name: t('common.contact'),
    },
    {
      code: 'aboutUs',
      name: t('common.introduction'),
      path: Paths.Introduction,
    },
  ];
  const queryClient = useQueryClient();

  const [visible, setVisible] = useState(false);

  const [userInfo, setUserInfo] = useUserStore(
    useShallow((state) => [state.userInfo, state.setUserInfo]),
  );

  const { data: userInfoData, isSuccess: userInfoIsSuccess } = useQuery({
    queryFn: getLoginUser,
    queryKey: [Paths.PersonalInformation, 'getLoginUser'],
  });

  useEffect(() => {
    if (userInfoIsSuccess) {
      setUserInfo(userInfoData.data || {});
    }
  }, [setUserInfo, userInfoData, userInfoIsSuccess]);

  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };

  const handleMenuClick = (menu: Menu) => {
    if (menu.path) {
      navigation.push(menu.path);
    }
  };

  const mutation = useMutation({
    mutationFn: editUserInfo,
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        queryClient.refetchQueries({
          queryKey: [Paths.PersonalInformation, 'getLoginUser'],
          type: 'active',
        });

        Toast.show(t('common.save_success'), {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            navigation.goBack();
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const handleUploadImage = async () => {
    console.log('handleUploadImage');

    ImagePicker.openPicker({
      mediaType: 'photo',
    })
      .then(async (result) => {
        console.log('result', result);
        const file = {
          uri: result.path,
          name: result.filename,
          type: result.mime,
        };
        const res = await AWSHelper.uploadFile(file);
        console.log('res', res);
        if (res?.data) {
          mutation.mutate({
            avatar: res.data,
          });
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  return (
    <SafeScreen edges={['bottom']} style={[backgrounds.gray1550]}>
      <View style={styles.container}>
        <Pressable onPress={handleUploadImage}>
          <View style={[styles.menu, backgrounds.gray1600]}>
            <Text style={styles.menuNameText}>{t('common.avatar')}</Text>
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={36}
                source={{
                  uri: userInfo?.avatar,
                }}
              />
              <Image
                alt="arrow-right"
                source={ArrowIcon as ImageURISource}
                style={styles.menuArrowIcon}
              />
            </View>
          </View>
        </Pressable>
        <Divider />
        {menus.map((menu: Menu, index: number) => (
          <View key={menu.code}>
            <Pressable
              onPress={() => {
                handleMenuClick(menu);
              }}
            >
              <View style={[styles.menu, backgrounds.gray1600]}>
                <Text style={styles.menuNameText}>{menu.name}</Text>
                <View style={styles.menuRight}>
                  {menu.code === 'nickname' ? (
                    <Text style={styles.menuContentText}>
                      {userInfo.nickName}
                    </Text>
                  ) : undefined}

                  {menu.code === 'name' ? (
                    <Text style={styles.menuContentText}>
                      {userInfo.lastName}
                      {userInfo.firstName}
                    </Text>
                  ) : undefined}
                  {menu.code === 'contactInformation' ? (
                    <Text style={styles.menuContentText}>
                      {userInfo.email ?? userInfo.phone}
                    </Text>
                  ) : undefined}
                  {menu.path ? (
                    <Image
                      alt="arrow-right"
                      source={ArrowIcon as ImageURISource}
                      style={styles.menuArrowIcon}
                    />
                  ) : undefined}
                </View>
              </View>
            </Pressable>
            {index < menus.length - 1 && <Divider />}
          </View>
        ))}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    height: 36,
    width: 36,
  },
  avatarWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  container: {},
  menu: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  menuArrowIcon: {
    height: 15,
    width: 11,
  },
  menuContentText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuNameText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});

import type { RootScreenProps } from '@/navigation/types.ts';

import Geolocation from '@react-native-community/geolocation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PermissionsAndroid,
  Platform,
  Image,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { storage } from '@/App.tsx';
import LocationIcon from '@/assets/images/14.png';
import { Configs } from '@/common/configs.ts';
import { useLocationStore } from '@/store';
import { locationCity } from '@/services';
import Toast from 'react-native-root-toast';

export default function ObtainPosition({
  navigation,
}: RootScreenProps<Paths.ObtainPosition>) {
  const { t } = useTranslation();
  const { backgrounds, colors, navigationTheme } = useTheme();

  const setLocation = useLocationStore((state) => state.setLocation);
  // useEffect(() => {
  //   checkLocationPermission();
  // }, []);

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available on this device or OS.');
        break;
      case RESULTS.DENIED:
        console.log('Permission has not been requested / is denied.');
        handleDeniedPermissionModal();
        break;
      case RESULTS.GRANTED:
        console.log('Permission is granted.');
        break;
      case RESULTS.BLOCKED:
        console.log('Permission is denied and cannot be requested (blocked).');
        break;
    }
  };

  const handleDeniedPermissionModal = () => {
    Alert.alert(
      t('common.permission_required'),
      'We need access to your location to provide accurate results and personalized services. Please enable location permissions in your device settings.',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.open_settings'),
          onPress: () => openSettings(),
        },
      ],
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status === RESULTS.GRANTED) {
        console.log('Location permission granted.');
      } else {
        console.log('Location permission denied.');
        handleDeniedPermissionModal();
      }
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted.');

        Geolocation.getCurrentPosition((info) => {
          console.log(info);
          locationCity({
            ...(info?.coords || {}),
          })
            .then((res) => {
              console.log('locationCity', res);
              let addresss = res.results?.[0]?.address_components || [];
              if (addresss.length > 0) {
                addresss.reverse();
                const city =
                  addresss[2]?.long_name ||
                  addresss[1]?.long_name ||
                  addresss[0]?.long_name;
                storage.set(
                  Configs.Location,
                  JSON.stringify({
                    ...info,
                    city: city,
                  }),
                );
                setLocation({
                  ...info,
                  city: city,
                });
                navigation.reset({
                  index: 0,
                  routes: [{ name: Paths.Tabbar }],
                });
              } else {
                Toast.show(t('message.obtain_address_information_failed'), {
                  animation: true,
                  delay: 0,
                  duration: 1000,
                  hideOnPress: true,
                  position: Toast.positions.CENTER,
                  shadow: true,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              Toast.show(t('message.obtain_address_information_failed'), {
                animation: true,
                delay: 0,
                duration: 1000,
                hideOnPress: true,
                position: Toast.positions.CENTER,
                shadow: true,
              });
            });
        });
      } else {
        console.log('Location permission denied.');
        handleDeniedPermissionModal();
      }
    }
  };
  return (
    <SafeScreen style={[styles.safeScreen, backgrounds.gray1600]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Image
            alt="location-icon"
            source={LocationIcon}
            style={styles.locationIconStyle}
          />
          <Text style={styles.titleText}>What is Your Location?</Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.gray800,
              },
            ]}
          >
            We need to know your location in order to suggest nearby services.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.Button}
            labelStyle={styles.ButtonLabel}
            mode="contained"
            onPress={requestLocationPermission}
          >
            Allow Location Access
          </Button>
          <Button
            contentStyle={styles.Button}
            labelStyle={styles.ButtonLabel}
            mode="text"
            onPress={() => {
              navigation.push(Paths.SelectLocation, {
                source: Paths.ObtainPosition,
              });
            }}
            textColor={navigationTheme.colors.primary}
          >
            Enter Location Manually
          </Button>
        </View>
      </View>
    </SafeScreen>
  );
}
const styles = StyleSheet.create({
  Button: {
    alignItems: 'center',
    height: 49,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 40,
  },
  ButtonLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  container: {
    paddingTop: 120,
  },
  locationIconStyle: {
    height: 128,
    width: 128,
  },
  safeScreen: {
    paddingHorizontal: 20,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 47,
  },
});

import type { RootScreenProps } from '@/navigation/types.ts';

import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

export default function VerificationCode({
  navigation,
}: RootScreenProps<Paths.VerificationCode>) {
  const { backgrounds, colors } = useTheme();

  const { t } = useTranslation();
  return (
    <SafeScreen style={[styles.safeScreen, backgrounds.gray1600]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Verification</Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.gray800,
              },
            ]}
          >
            Please enter 4 digit code send to jwu810930@gmail.com
          </Text>
        </View>
        <View>
          <Text>Resend code in 59s</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            mode="contained"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: Paths.Tabbar }],
              });
            }}
          >
            {t('login.register_button')}
          </Button>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 34,
  },
  container: {
    paddingTop: 2,
  },
  safeScreen: {
    paddingHorizontal: 20,
  },
  signInButton: {
    alignItems: 'center',
    height: 49,
    justifyContent: 'center',
  },
  signInButtonLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
  titleContainer: {
    marginBottom: 36,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

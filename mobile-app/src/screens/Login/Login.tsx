import type { RootScreenProps } from '@/navigation/types.ts';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from '@/hooks';
import {  ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { login } from '@/services';
import { storage } from '@/App.tsx';
import { Configs } from '@/common/configs.ts';
import Toast from 'react-native-root-toast';
import { z } from 'zod/index';

export default function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { t } = useTranslation();
  const { navigationTheme, backgrounds, variant } = useTheme();
  const [parameters, setParameters] = useState({
    account: '',
    password: '',
  });


  const FormSchema = z.object({
    account: z
      .string()
      .min(1, { message: t('message.email_address') }),
    password: z.string().min(1, { message: t('message.password') }),
  });

  const checkForm = (): boolean => {
    const result = FormSchema.safeParse(parameters);
    if (!result.success) {
      const flattenError = z.flattenError(result.error);
      console.log(
        flattenError.fieldErrors[Object.keys(flattenError.fieldErrors)[0]],
      );
      const msg: string =
        flattenError.fieldErrors[
          Object.keys(flattenError.fieldErrors)[0]
          ]?.[0] || '';
      msg &&
      Toast.show(msg, {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
    }
    return result.success;
  };

  const mutation = useMutation({
    mutationFn: login,
    onError: (error) => {
      console.log('error', error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        storage.set(Configs.Token, response.data as string);

        Toast.show(t('message.login_successfully'), {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            const location = storage.getString(Configs.Location);
            console.log('location', location);
            if (!location) {
              navigation.reset({
                index: 0,
                routes: [{ name: Paths.ObtainPosition }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: Paths.Tabbar }],
              });
            }
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const handleUpdateParameters = (
    value: string,
    name: keyof typeof parameters,
  ) => {
    setParameters((parameters) => ({
      ...parameters,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!checkForm()) {
      return;
    }
    mutation.mutate(parameters);
  };

  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
      <SafeScreen
        edges={['bottom']}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        <StatusBar
          backgroundColor={navigationTheme.colors.background}
          barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{t('login.login')}</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>{t('common.email_address')}</Text>

            <TextInput
              maxLength={255}
              activeUnderlineColor="transparent"
              label=""
              mode="outlined"
              onChangeText={(text) => {
                handleUpdateParameters(text, 'account');
              }}
              outlineColor="transparent"
              outlineStyle={styles.textInputOutline}
              placeholder={t('input.email_address')}
              style={[backgrounds.gray50]}
              underlineColor="transparent"
              value={parameters.account}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>{t('common.password')}</Text>
            <TextInput
              maxLength={40}
              activeUnderlineColor="transparent"
              autoComplete="new-password"
              label=""
              mode="outlined"
              onChangeText={(text) => {
                handleUpdateParameters(text, 'password');
              }}
              outlineColor="transparent"
              outlineStyle={styles.textInputOutline}
              placeholder={t('input.password')}
              secureTextEntry
              style={[backgrounds.gray50]}
              textContentType="newPassword"
              underlineColor="transparent"
              value={parameters.password}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              contentStyle={styles.signInButton}
              labelStyle={styles.signInButtonLabel}
              loading={mutation.isPending}
              mode="contained"
              onPress={handleSubmit}
            >
              {t('login.login_button')}
            </Button>
          </View>
          <View style={styles.linkContainer}>
            <Button
              labelStyle={styles.linkText}
              mode="text"
              onPress={() => {
                navigation.push(Paths.Register);
              }}
              textColor={navigationTheme.colors.primary}
            >
              {t('login.register_button')}
            </Button>
            <Button
              labelStyle={styles.linkText}
              mode="text"
              onPress={() => {
                navigation.push(Paths.LoginForgetPassword);
              }}
              textColor={navigationTheme.colors.primary}
            >
              {t('login.forgot_password')}
            </Button>
          </View>
        </View>
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 34,
  },
  container: {
    paddingTop: 84,
  },
  inputContainer: {
    marginTop: 19,
  },
  labelText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  safeScreen: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
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
  textInputOutline: {
    borderRadius: 16,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

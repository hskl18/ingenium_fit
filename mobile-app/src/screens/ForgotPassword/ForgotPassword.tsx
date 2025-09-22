import type { RootScreenProps } from '@/navigation/types.ts';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, TextInput } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { forgotPassword, sendEmailSmsCode, sendPhoneSmsCode } from '@/services';
import { useUserStore } from '@/store';
import { storage } from '@/App.tsx';
import Toast from 'react-native-root-toast';
import { Configs } from '@/common/configs.ts';
import { z } from 'zod/index';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function ForgotPassword({
  navigation,
}: RootScreenProps<Paths.ForgotPassword>) {
  const { t } = useTranslation();
  const { backgrounds, navigationTheme } = useTheme();
  const userInfo = useUserStore((state) => state.userInfo);
  const [isSend, setIsSend] = useState(0);
  const [parameters, setParameters] = useState({
    account: userInfo.phone || userInfo.email,
    captcha: '',
    confirmNewPassword: '',
    loginPwd: '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (isSend > 0) {
        setIsSend((sendNumber) => sendNumber - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [isSend, setIsSend]);

  const FormSchema = z.object({
    captcha: z.string().min(1, { message: t('message.verification_code') }),
    loginPwd: z.string().min(1, { message: t('message.new_password') }),
    confirmNewPassword: z
      .string()
      .min(1, { message: t('message.confirm_new_password') }),
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
    mutationFn: forgotPassword,
    onError: async (error) => {
      console.log('error', error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        storage.delete(Configs.Token);
        Toast.show('忘记密码成功', {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: Paths.Login }],
            });
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

  const mutationEmailSmsCode = useMutation({
    mutationFn: sendEmailSmsCode,
    onSuccess: (response: IResponseData) => {
      // Invalidate and refetch
      if (response.code === 200) {
        console.log('验证码发送成功');
        Toast.show(t('message.verification_code_sent_successfully'), {
          animation: true,
          delay: 0,
          duration: 500,
          hideOnPress: true,
          onHidden: () => {
            setIsSend(60);
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const mutationPhoneSmsCode = useMutation({
    mutationFn: sendPhoneSmsCode,
    onSuccess: (response: IResponseData) => {
      // Invalidate and refetch
      if (response.code === 200) {
        console.log('验证码发送成功');
        Toast.show(t('message.verification_code_sent_successfully'), {
          animation: true,
          delay: 0,
          duration: 500,
          hideOnPress: true,
          onHidden: () => {
            setIsSend(60);
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const handleSendCode = () => {
    console.log(parameters);
    const isEmail = z.email().safeParse(parameters.account).success;
    console.log('isEmail', isEmail);
    if (isEmail) {
      mutationEmailSmsCode.mutate({
        email: parameters.account,
        // 短信类型：1-账号注册 2-忘记密码
        type: 2,
      });
    } else {
      mutationPhoneSmsCode.mutate({
        phone: parameters.account,
        // 短信类型：1-账号注册 2-忘记密码
        type: 2,
      });
    }
  };

  const handleSubmit = () => {
    console.log(parameters);
    if (!checkForm()) {
      return;
    }
    mutation.mutate(parameters);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <ScrollView style={[styles.scrollView, backgrounds.gray1550]}>
        <SafeScreen edges={['bottom']}>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={255}
                label=""
                placeholder={t('input.email_address')}
                readOnly
                style={[backgrounds.gray1600]}
                underlineColor="transparent"
                value={parameters.account}
              />
            </View>
            <Divider />
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={6}
                label=""
                onChangeText={(text) => {
                  handleUpdateParameters(text, 'captcha');
                }}
                placeholder={t('input.verification_code')}
                style={[backgrounds.gray1600]}
                underlineColor="transparent"
                value={parameters.captcha}
              />
              <View style={styles.sendButtonContainer}>
                {isSend > 0 ? (
                  <Button
                    disabled
                    mode="text"
                    textColor={navigationTheme.colors.tertiary}
                  >
                    {isSend}s
                  </Button>
                ) : (
                  <Button
                    mode="text"
                    onPress={handleSendCode}
                    textColor={navigationTheme.colors.tertiary}
                  >
                    {t('common.send')}
                  </Button>
                )}
              </View>
            </View>
            <Divider />
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={40}
                autoComplete="new-password"
                label=""
                onChangeText={(text) => {
                  handleUpdateParameters(text, 'loginPwd');
                }}
                placeholder={t('input.new_password')}
                secureTextEntry
                style={[backgrounds.gray1600]}
                underlineColor="transparent"
                textContentType="newPassword"
                value={parameters.loginPwd}
              />
            </View>
            <Divider />
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={40}
                autoComplete="new-password"
                label=""
                onChangeText={(text) => {
                  handleUpdateParameters(text, 'confirmNewPassword');
                }}
                placeholder={t('input.confirm_new_password')}
                secureTextEntry
                style={[backgrounds.gray1600]}
                textContentType="newPassword"
                underlineColor="transparent"
                value={parameters.confirmNewPassword}
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
                {t('common.confirm')}
              </Button>
            </View>
          </View>
        </SafeScreen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 54,
    paddingHorizontal: 15,
  },
  container: {
    paddingTop: 10,
  },
  inputContainer: {},
  sendButtonContainer: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 0,
  },
  scrollView: {
    flex: 1,
  },
  sendButtonLabel: {
    fontSize: 12,
    fontWeight: 500,
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
});

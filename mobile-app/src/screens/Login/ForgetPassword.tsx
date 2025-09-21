import type { RootScreenProps } from '@/navigation/types.ts';

import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword, sendEmailSmsCode, sendPhoneSmsCode } from '@/services';
import Toast from 'react-native-root-toast';
import { z } from 'zod/index';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

export default function ForgetPassword({
  navigation,
}: RootScreenProps<Paths.LoginForgetPassword>) {
  const { t } = useTranslation();
  const { backgrounds, colors, navigationTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSend, setIsSend] = useState(0);

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

  const [parameters, setParameters] = useState({
    account: '',
    captcha: '',
    loginPwd: '',
  });

  const EmailSchema = z
    .string()
    .min(1, {
      message: t('message.email_address'),
    })
    .pipe(z.email(t('message.email_address_incorrect')));

  const checkForm = (): boolean => {
    let FormSchema;
    switch (selectedIndex) {
      case 0: {
        FormSchema = z.object({
          account: EmailSchema,
          captcha: z
            .string()
            .min(1, { message: t('message.verification_code') }),
          loginPwd: z.string().min(1, { message: t('message.password') }),
        });
        break;
      }
      case 1: {
        FormSchema = z.object({
          account: z.string().min(1, {
            message: t('message.phone_number'),
          }),
          captcha: z
            .string()
            .min(1, { message: t('message.verification_code') }),
          loginPwd: z.string().min(1, { message: t('message.password') }),
        });
        break;
      }
    }
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

  const handleInputChange = (value: string, name: keyof typeof parameters) => {
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

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response: IResponseData) => {
      console.log(response);
      if (response.code === 200) {
        Toast.show(t('message.password_reset_successfully'), {
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

  const handleSendCode = () => {
    console.log(parameters);
    if (selectedIndex === 0) {
      const result = EmailSchema.safeParse(parameters.account);
      if (!result.success) {
        const flattenError = z.flattenError(result.error);
        console.log(flattenError);
        return Toast.show(flattenError.formErrors[0], {
          animation: true,
          delay: 0,
          duration: 500,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
      mutationEmailSmsCode.mutate({
        email: parameters.account,
        // 短信类型：1-账号注册 2-忘记密码
        type: 2,
      });
    } else if (selectedIndex === 1) {
      if (!parameters.account) {
        return Toast.show(t('message.phone_number'), {
          animation: true,
          delay: 0,
          duration: 500,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
      mutationPhoneSmsCode.mutate({
        phone: parameters.account,
        // 短信类型：1-账号注册 2-忘记密码
        type: 2,
      });
    }
  };

  const handleSubmit = () => {
    if (!checkForm()) {
      return;
    }
    console.log(parameters);
    mutation.mutate(parameters);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
        <SafeScreen style={[styles.safeScreen, backgrounds.gray1600]}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{t('login.forgot_password')}</Text>
              <Text
                style={[
                  styles.subtitleText,
                  {
                    color: colors.gray800,
                  },
                ]}
              >
                {t('login.forgot_password_subtitle')}
              </Text>
            </View>

            <View>
              <View style={styles.segmentedControlContainer}>
                <SegmentedControl
                  onChange={(event) => {
                    handleInputChange('', 'account');
                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                  }}
                  selectedIndex={selectedIndex}
                  sliderStyle={styles.segmentedControlSlider}
                  style={styles.segmentedControl}
                  values={[t('common.email'), t('common.phone_number')]}
                />
              </View>
            </View>
            {selectedIndex === 0 ? (
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>
                  {t('common.email_address')}
                </Text>
                <TextInput
                  maxLength={255}
                  activeUnderlineColor="transparent"
                  label=""
                  mode="outlined"
                  onChangeText={(text) => {
                    handleInputChange(text, 'account');
                  }}
                  outlineColor="transparent"
                  outlineStyle={styles.textInputOutline}
                  placeholder={t('input.email_address')}
                  style={[backgrounds.gray50]}
                  underlineColor="transparent"
                  value={parameters.account}
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>{t('common.phone_number')}</Text>
                <TextInput
                  maxLength={40}
                  inputMode="numeric"
                  activeUnderlineColor="transparent"
                  label=""
                  mode="outlined"
                  onChangeText={(text) => {
                    handleInputChange(text, 'account');
                  }}
                  outlineColor="transparent"
                  outlineStyle={styles.textInputOutline}
                  placeholder={t('input.phone_number')}
                  textContentType="telephoneNumber"
                  style={[backgrounds.gray50]}
                  underlineColor="transparent"
                  value={parameters.account}
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{t('common.verify_code')}</Text>
              <View>
                <TextInput
                  maxLength={6}
                  activeUnderlineColor="transparent"
                  label=""
                  mode="outlined"
                  onChangeText={(text) => {
                    handleInputChange(text, 'captcha');
                  }}
                  outlineColor="transparent"
                  outlineStyle={styles.textInputOutline}
                  placeholder={t('input.verification_code')}
                  style={[backgrounds.gray50]}
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
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>{t('common.password')}</Text>
                <TextInput
                  maxLength={40}
                  activeUnderlineColor="transparent"
                  label=""
                  mode="outlined"
                  onChangeText={(text) => {
                    handleInputChange(text, 'loginPwd');
                  }}
                  outlineColor="transparent"
                  outlineStyle={styles.textInputOutline}
                  placeholder={t('input.password')}
                  style={[backgrounds.gray50]}
                  textContentType="password"
                  underlineColor="transparent"
                  value={parameters.loginPwd}
                />
              </View>
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
    marginTop: 34,
  },
  container: {
    paddingTop: 2,
  },
  inputContainer: {
    marginTop: 28,
  },
  labelText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  safeScreen: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  segmentedControl: {
    borderRadius: 38,
    height: 38,
    width: 221,
  },
  segmentedControlContainer: {
    alignItems: 'center',
  },
  segmentedControlSlider: {
    borderRadius: 30,
    height: 30,
    top: 4,
  },
  sendButtonContainer: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
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
  textInputOutline: {
    borderRadius: 16,
  },
  titleContainer: {
    marginBottom: 36,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

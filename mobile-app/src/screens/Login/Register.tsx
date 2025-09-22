import type { RootScreenProps } from '@/navigation/types.ts';
import type { OTPInputRef } from 'input-otp-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { usePreventRemove } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { OTPInput, type SlotProps } from 'input-otp-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/hooks';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-root-toast';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { storage } from '@/App.tsx';
import { Agreements } from '@/common/agreement.ts';
import { Configs } from '@/common/configs.ts';
import { register, sendEmailSmsCode, sendPhoneSmsCode } from '@/services';
import { z } from 'zod/index';

export default function Register({
  navigation,
}: RootScreenProps<Paths.Register>) {
  const { backgrounds, colors, navigationTheme } = useTheme();

  const { t } = useTranslation();

  const [isVerificationCode, setIsVerificationCode] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
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
    firstName: '',
    lastName: '',
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
          firstName: z.string().min(1, { message: t('message.first_name') }),
          lastName: z.string().min(1, { message: t('message.last_name') }),
          account: EmailSchema,
          loginPwd: z.string().min(1, { message: t('message.password') }),
        });
        break;
      }
      case 1: {
        FormSchema = z.object({
          firstName: z.string().min(1, { message: t('message.first_name') }),
          lastName: z.string().min(1, { message: t('message.last_name') }),
          account: z.string().min(1, {
            message: t('message.phone_number'),
          }),
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
    } else if (!isAgree) {
      Toast.show(t('message.agree_agreement'), {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
    }
    return result.success && isAgree;
  };

  const reference = useRef<OTPInputRef>(null);

  usePreventRemove(isVerificationCode, ({ data }) => {
    console.log('isVerificationCode', data);
    if (isVerificationCode && !isLogin) {
      setIsVerificationCode(false);
    } else {
      navigation.dispatch(data.action);
    }
  });

  useEffect(() => {
    const onBackPress = () => {
      if (isVerificationCode && !isLogin) {
        setIsVerificationCode(false);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, [isVerificationCode, isLogin]);

  const onComplete = (code: string) => {
    setParameters((parameters) => ({
      ...parameters,
      captcha: code,
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
    mutationFn: register,
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        storage.set(Configs.Token, response.data as string);
        Toast.show(t('message.registered_successfully'), {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            const location = storage.getString(Configs.Location);
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

  const handleInputChange = (value: string, name: keyof typeof parameters) => {
    setParameters((parameters) => ({
      ...parameters,
      [name]: value,
    }));
  };

  const handleToggleAgree = () => {
    setIsAgree(!isAgree);
  };

  const handleSubmit = () => {
    if (!checkForm()) {
      return;
    }
    console.log(parameters);
    setIsVerificationCode(true);
    if (selectedIndex === 0) {
      mutationEmailSmsCode.mutate({
        email: parameters.account,
        // 短信类型：1-账号注册 2-忘记密码
        type: 1,
      });
    } else if (selectedIndex === 1) {
      mutationPhoneSmsCode.mutate({
        phone: parameters.account,
        // 短信类型：1-账号注册 2-忘记密码
        type: 1,
      });
    }
  };
  const handleLogin = () => {
    if (!parameters.captcha) {
      return Toast.show(t('message.verification_code'), {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
    }
    console.log(parameters);
    setIsLogin(true);
    mutation.mutate(parameters);
  };

  const renderVerificationCode = () => {
    return (
      <View style={styles.container}>
        <View style={styles.verificationTitleContainer}>
          <Text style={styles.titleText}>{t('login.verification')}</Text>
          <Text
            style={[
              styles.tipText,
              {
                color: colors.gray800,
              },
            ]}
          >
            {t('login.verification_subtitle')}
          </Text>

          <Text
            style={[
              {
                color: navigationTheme.colors.tertiary,
              },
            ]}
          >
            {parameters.account}
          </Text>
        </View>
        <View style={styles.optContainer}>
          <OTPInput
            maxLength={4}
            onComplete={onComplete}
            ref={reference}
            render={({ slots }) => (
              <View style={styles.slotsContainer}>
                {slots.map((slot, index) => (
                  <Slot key={index} {...slot} />
                ))}
              </View>
            )}
          />
        </View>
        <View style={styles.resendTextWrapper}>
          {isSend > 0 ? (
            <Button
              disabled
              mode="text"
              textColor={navigationTheme.colors.gray200}
            >
              {t('common.resend')} {isSend}s
            </Button>
          ) : (
            <Button
              mode="text"
              onPress={handleSubmit}
              textColor={navigationTheme.colors.tertiary}
            >
              {t('common.resend')}
            </Button>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            loading={mutation.isPending}
            mode="contained"
            onPress={handleLogin}
          >
            {t('login.verify')}
          </Button>
        </View>
      </View>
    );
  };

  const renderRegister = () => {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t('login.create_account')}</Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.gray800,
              },
            ]}
          >
            {t('login.create_account_subtitle')}
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
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>{t('common.first_name')}</Text>

            <TextInput
              maxLength={255}
              activeUnderlineColor="transparent"
              label=""
              mode="outlined"
              onChangeText={(text) => {
                handleInputChange(text, 'firstName');
              }}
              outlineColor="transparent"
              outlineStyle={styles.textInputOutline}
              placeholder={t('input.first_name')}
              style={[backgrounds.gray50]}
              underlineColor="transparent"
              value={parameters.firstName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>{t('common.last_name')}</Text>
            <TextInput
              maxLength={255}
              activeUnderlineColor="transparent"
              label=""
              mode="outlined"
              onChangeText={(text) => {
                handleInputChange(text, 'lastName');
              }}
              outlineColor="transparent"
              outlineStyle={styles.textInputOutline}
              placeholder={t('input.last_name')}
              style={[backgrounds.gray50]}
              underlineColor="transparent"
              value={parameters.lastName}
            />
          </View>
          {selectedIndex === 0 ? (
            <View style={styles.inputContainer}>
              <Text style={styles.labelText}>{t('common.email_address')}</Text>
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
                activeUnderlineColor="transparent"
                inputMode="numeric"
                label=""
                mode="outlined"
                onChangeText={(text) => {
                  handleInputChange(text, 'account');
                }}
                outlineColor="transparent"
                outlineStyle={styles.textInputOutline}
                placeholder={t('input.phone_number')}
                style={[backgrounds.gray50]}
                textContentType="telephoneNumber"
                underlineColor="transparent"
                value={parameters.account}
              />
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>{t('common.password')}</Text>
            <TextInput
              maxLength={40}
              activeUnderlineColor="transparent"
              autoComplete="new-password"
              label=""
              mode="outlined"
              onChangeText={(text) => {
                handleInputChange(text, 'loginPwd');
              }}
              outlineColor="transparent"
              outlineStyle={styles.textInputOutline}
              placeholder={t('input.password')}
              secureTextEntry
              style={[backgrounds.gray50]}
              textContentType="newPassword"
              underlineColor="transparent"
              value={parameters.loginPwd}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            mode="contained"
            onPress={handleSubmit}
          >
            {t('login.register_button')}
          </Button>
        </View>

        <View style={styles.linkContainer}>
          <IconButton
            icon={isAgree ? 'radiobox-marked' : 'radiobox-blank'}
            iconColor={isAgree ? colors.primary : '#999'}
            onPress={handleToggleAgree}
            size={20}
          />
          <Text>
            {t('login.i_agree')}
            <Text
              onPress={() => {
                navigation.push(Paths.Agreement, {
                  code: Agreements.UserTerms,
                });
              }}
              style={styles.linkText}
            >
              {' '}
              {t('agreement.user_terms')}{' '}
            </Text>
            {t('common.and')}
            <Text
              onPress={() => {
                navigation.push(Paths.Agreement, {
                  code: Agreements.PrivacyPolicy,
                });
              }}
              style={styles.linkText}
            >
              {' '}
              {t('agreement.privacy_policy')}{' '}
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
        <View style={styles.safeScreen}>
          {isVerificationCode ? renderVerificationCode() : renderRegister()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FakeCaret({ style }: { readonly style?: ViewStyle }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      ),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.fakeCaretContainer}>
      <Animated.View style={[styles.fakeCaret, style, animatedStyle]} />
    </View>
  );
}

function Slot({ char, hasFakeCaret, isActive }: SlotProps) {
  return (
    <View style={[styles.slot, isActive && styles.activeSlot]}>
      {char !== null && <Text style={styles.char}>{char}</Text>}
      {hasFakeCaret ? <FakeCaret /> : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  activeSlot: {
    borderColor: '#000000',
    borderWidth: 2,
  },
  buttonContainer: {
    marginTop: 28,
  },
  char: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '500',
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
  linkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 14,
  },
  linkText: {
    color: '#00A654',
  },
  optContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 12,
    fontWeight: 500,
    textAlign: 'center',
  },
  resendTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  safeScreen: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  signInButton: {
    alignItems: 'center',
    height: 49,
    justifyContent: 'center',
  },
  signInButtonLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  slot: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
  textInputOutline: {
    borderRadius: 16,
  },
  tipText: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 8,
  },
  titleContainer: {
    marginBottom: 36,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  verificationTitleContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  /* Caret */
  fakeCaret: {
    backgroundColor: '#000',
    borderRadius: 1,
    height: 28,
    width: 2,
  },
  fakeCaretContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
});

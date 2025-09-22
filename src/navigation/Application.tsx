import type { RootStackParamList } from '@/navigation/types';
import { navigationRef } from '../RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

import {
  Agreement,
  CarouselDetail,
  ChangePassword,
  ChatDetail,
  ChatMessage,
  Collection,
  DynamicDetail,
  DynamicList,
  DynamicPublish,
  FanAttention,
  FAQ,
  ForgotPassword,
  Introduction,
  Login,
  LoginForgetPassword,
  Message,
  MyUpdates,
  Nickname,
  ObtainPosition,
  PersonalInformation,
  Register,
  RehabilitationCenterDetail,
  RehabilitationCenterDoctor,
  RehabilitationCenterDoctorEvaluate,
  RehabilitationCenterEvaluate,
  RehabilitationCenterList,
  SciencePopularizationDetail,
  SciencePopularizationList,
  Search,
  SelectLocation,
  Settings,
  Startup,
  SystemMessage,
  SystemMessageDetail,
  Tabbar,
  VerificationCode,
} from '@/screens';
import { useTranslation } from '@/hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { backgrounds, navigationTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <PaperProvider theme={navigationTheme}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={Paths.Startup}
          screenOptions={{
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen
            component={Startup}
            name={Paths.Startup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={Tabbar}
            name={Paths.Tabbar}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={Search}
            name={Paths.Search}
            options={{
              animation: 'fade_from_bottom',
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={Message}
            name={Paths.Message}
            options={{
              animation: 'fade_from_bottom',
              headerShadowVisible: false,
              headerStyle: {
                ...backgrounds.gray1600,
              },
              headerTitle: t('title.message_notifications'),
            }}
          />
          <Stack.Screen
            component={Agreement}
            name={Paths.Agreement}
            options={{
              headerShadowVisible: false,
              headerStyle: {
                ...backgrounds.gray1600,
              },
              headerTitle: '',
            }}
          />
          <Stack.Screen
            component={ObtainPosition}
            name={Paths.ObtainPosition}
            options={{
              animation: 'fade_from_bottom',
              headerShown: false,
            }}
          />

          <Stack.Screen
            component={SelectLocation}
            name={Paths.SelectLocation}
            options={{
              animation: 'fade_from_bottom',
              headerShadowVisible: false,
              headerStyle: {
                ...backgrounds.gray1600,
              },
              headerTitle: t('title.select_location'),
            }}
          />

          {/* 登录 */}
          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={LoginForgetPassword}
              name={Paths.LoginForgetPassword}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: '',
              }}
            />
            <Stack.Screen
              component={Login}
              name={Paths.Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              component={Register}
              name={Paths.Register}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: '',
              }}
            />
            <Stack.Screen
              component={VerificationCode}
              name={Paths.VerificationCode}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: '',
              }}
            />
          </Stack.Group>

          {/* 康复中心 */}
          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={RehabilitationCenterList}
              name={Paths.RehabilitationCenterList}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.rehabilitation_center'),
              }}
            />
            <Stack.Screen
              component={RehabilitationCenterDetail}
              name={Paths.RehabilitationCenterDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: '',
              }}
            />
            <Stack.Screen
              component={RehabilitationCenterDoctor}
              name={Paths.RehabilitationCenterDoctor}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: '',
              }}
            />
            <Stack.Screen
              component={RehabilitationCenterDoctorEvaluate}
              name={Paths.RehabilitationCenterDoctorEvaluate}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.evaluate_physician'),
              }}
            />
            <Stack.Screen
              component={RehabilitationCenterEvaluate}
              name={Paths.RehabilitationCenterEvaluate}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.evaluate'),
              }}
            />
          </Stack.Group>

          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={SciencePopularizationList}
              name={Paths.SciencePopularizationList}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: '',
              }}
            />
            <Stack.Screen
              component={SciencePopularizationDetail}
              name={Paths.SciencePopularizationDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: '',
              }}
            />
          </Stack.Group>

          {/* 消息 */}
          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={ChatMessage}
              name={Paths.ChatMessage}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.chat_message'),
              }}
            />
            <Stack.Screen
              component={ChatDetail}
              name={Paths.ChatDetail}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: '',
              }}
            />

            <Stack.Screen
              component={SystemMessage}
              name={Paths.SystemMessage}
              options={{
                headerTitleAlign: 'left',
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.system_message'),
              }}
            />
            <Stack.Screen
              component={SystemMessageDetail}
              name={Paths.SystemMessageDetail}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.detail'),
              }}
            />

            <Stack.Screen
              component={CarouselDetail}
              name={Paths.CarouselDetail}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.detail'),
              }}
            />
          </Stack.Group>

          {/* 动态 */}
          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={DynamicPublish}
              name={Paths.DynamicPublish}
              options={{
                animation: 'fade_from_bottom',
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: t('title.publish'),
              }}
            />
            <Stack.Screen
              component={DynamicList}
              name={Paths.DynamicList}
              options={{
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: '',
              }}
            />
            <Stack.Screen
              component={DynamicDetail}
              name={Paths.DynamicDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: '',
              }}
            />
          </Stack.Group>

          {/* 个人中心 */}
          <Stack.Group
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: {
                ...backgrounds.gray1600,
              },
            }}
          >
            <Stack.Screen
              component={MyUpdates}
              name={Paths.MyUpdates}
              options={{
                headerTitle: t('title.my_updates'),
              }}
            />
            <Stack.Screen
              component={PersonalInformation}
              name={Paths.PersonalInformation}
              options={{
                animation: 'fade_from_bottom',
                headerTitle: t('title.personal_information'),
              }}
            />
            <Stack.Screen
              component={FAQ}
              name={Paths.FAQ}
              options={{
                headerTitle: t('title.faq'),
              }}
            />
            <Stack.Screen
              component={Settings}
              name={Paths.Settings}
              options={{
                headerTitle: t('title.settings'),
              }}
            />
            <Stack.Screen
              component={ChangePassword}
              name={Paths.ChangePassword}
              options={{
                headerTitle: t('title.change_password'),
              }}
            />
            <Stack.Screen
              component={ForgotPassword}
              name={Paths.ForgotPassword}
              options={{
                headerTitle: t('title.forgot_password'),
              }}
            />
            <Stack.Screen
              component={Collection}
              name={Paths.Collection}
              options={{
                headerTitle: t('title.collection'),
              }}
            />
            <Stack.Screen
              component={FanAttention}
              name={Paths.FanAttention}
              options={{
                headerTitle: t('title.fans_follow'),
              }}
            />
            <Stack.Screen
              component={Nickname}
              name={Paths.Nickname}
              options={{
                headerTitle: t('title.nickname'),
              }}
            />
            <Stack.Screen
              component={Introduction}
              name={Paths.Introduction}
              options={{
                headerTitle: t('title.introduction'),
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default ApplicationNavigator;

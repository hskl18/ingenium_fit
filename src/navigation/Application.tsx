import type { RootStackParamList } from "@/navigation/types";
import { navigationRef } from "../RootNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

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
} from "@/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { backgrounds, navigationTheme } = useTheme();
  return (
    <PaperProvider theme={navigationTheme}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={Paths.Startup}
          screenOptions={{
            headerTitleAlign: "center",
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
              animation: "fade_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={Message}
            name={Paths.Message}
            options={{
              animation: "fade_from_bottom",
              headerShadowVisible: false,
              headerStyle: {
                ...backgrounds.gray1600,
              },
              headerTitle: "Message notifications",
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
              headerTitle: "",
            }}
          />
          <Stack.Screen
            component={ObtainPosition}
            name={Paths.ObtainPosition}
            options={{
              animation: "fade_from_bottom",
              headerShown: false,
            }}
          />

          <Stack.Screen
            component={SelectLocation}
            name={Paths.SelectLocation}
            options={{
              animation: "fade_from_bottom",
              headerShadowVisible: false,
              headerStyle: {
                ...backgrounds.gray1600,
              },
              headerTitle: "Select location",
            }}
          />

          {/* Auth screens removed for demo */}

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
                headerTitle: "Rehabilitation centers",
              }}
            />
            <Stack.Screen
              component={RehabilitationCenterDetail}
              name={Paths.RehabilitationCenterDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: "",
              }}
            />
            <Stack.Screen
              component={RehabilitationCenterDoctor}
              name={Paths.RehabilitationCenterDoctor}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: "",
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
                headerTitle: "Evaluate physician",
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
                headerTitle: "Evaluate",
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
                headerTitle: "",
              }}
            />
            <Stack.Screen
              component={SciencePopularizationDetail}
              name={Paths.SciencePopularizationDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: "",
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
                headerTitle: "Chat",
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
                headerTitle: "",
              }}
            />

            <Stack.Screen
              component={SystemMessage}
              name={Paths.SystemMessage}
              options={{
                headerTitleAlign: "left",
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: "System message",
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
                headerTitle: "Detail",
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
                headerTitle: "Detail",
              }}
            />
          </Stack.Group>

          {/* 动态 */}
          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={DynamicPublish}
              name={Paths.DynamicPublish}
              options={{
                animation: "fade_from_bottom",
                headerShadowVisible: false,
                headerStyle: {
                  ...backgrounds.gray1600,
                },
                headerTitle: "Publish",
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
                headerTitle: "",
              }}
            />
            <Stack.Screen
              component={DynamicDetail}
              name={Paths.DynamicDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: "",
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
                headerTitle: "My updates",
              }}
            />
            <Stack.Screen
              component={PersonalInformation}
              name={Paths.PersonalInformation}
              options={{
                animation: "fade_from_bottom",
                headerTitle: "Personal information",
              }}
            />
            <Stack.Screen
              component={FAQ}
              name={Paths.FAQ}
              options={{
                headerTitle: "FAQ",
              }}
            />
            <Stack.Screen
              component={Settings}
              name={Paths.Settings}
              options={{
                headerTitle: "Settings",
              }}
            />
            <Stack.Screen
              component={ChangePassword}
              name={Paths.ChangePassword}
              options={{
                headerTitle: "Change password",
              }}
            />
            <Stack.Screen
              component={ForgotPassword}
              name={Paths.ForgotPassword}
              options={{
                headerTitle: "Forgot password",
              }}
            />
            <Stack.Screen
              component={Collection}
              name={Paths.Collection}
              options={{
                headerTitle: "Collection",
              }}
            />
            <Stack.Screen
              component={FanAttention}
              name={Paths.FanAttention}
              options={{
                headerTitle: "Fans & following",
              }}
            />
            <Stack.Screen
              component={Nickname}
              name={Paths.Nickname}
              options={{
                headerTitle: "Nickname",
              }}
            />
            <Stack.Screen
              component={Introduction}
              name={Paths.Introduction}
              options={{
                headerTitle: "Introduction",
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default ApplicationNavigator;

import type { RootStackParamList } from "@/navigation/types";
import { navigationRef } from "../RootNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Paths } from "@/navigation/paths";
import { useTheme } from "@/theme";

import * as Screens from "@/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { backgrounds, navigationTheme } = useTheme();
  return (
    <PaperProvider theme={navigationTheme}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <Stack.Navigator
          id="RootStack"
          initialRouteName={Paths.Tabbar}
          screenOptions={{
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            component={Screens.Tabbar}
            name={Paths.Tabbar}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={Screens.Search}
            name={Paths.Search}
            options={{
              animation: "fade_from_bottom",
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={Screens.Message}
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
            component={Screens.Agreement}
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
            component={Screens.ObtainPosition}
            name={Paths.ObtainPosition}
            options={{
              animation: "fade_from_bottom",
              headerShown: false,
            }}
          />

          <Stack.Screen
            component={Screens.SelectLocation}
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

          {/* 康复中心 */}
          <Stack.Group screenOptions={{}}>
            <Stack.Screen
              component={Screens.RehabilitationCenterList}
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
              component={Screens.RehabilitationCenterDetail}
              name={Paths.RehabilitationCenterDetail}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: "",
              }}
            />
            <Stack.Screen
              component={Screens.RehabilitationCenterDoctor}
              name={Paths.RehabilitationCenterDoctor}
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: "",
              }}
            />
            <Stack.Screen
              component={Screens.RehabilitationCenterDoctorEvaluate}
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
              component={Screens.RehabilitationCenterEvaluate}
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
              component={Screens.SciencePopularizationList}
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
              component={Screens.SciencePopularizationDetail}
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
              component={Screens.ChatMessage}
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
              component={Screens.ChatDetail}
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
              component={Screens.SystemMessage}
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
              component={Screens.SystemMessageDetail}
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
              component={Screens.CarouselDetail}
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
              component={Screens.DynamicPublish}
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
              component={Screens.DynamicList}
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
              component={Screens.DynamicDetail}
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
              component={Screens.MyUpdates}
              name={Paths.MyUpdates}
              options={{
                headerTitle: "My updates",
              }}
            />
            <Stack.Screen
              component={Screens.PersonalInformation}
              name={Paths.PersonalInformation}
              options={{
                animation: "fade_from_bottom",
                headerTitle: "Personal information",
              }}
            />
            <Stack.Screen
              component={Screens.FAQ}
              name={Paths.FAQ}
              options={{
                headerTitle: "FAQ",
              }}
            />
            <Stack.Screen
              component={Screens.Settings}
              name={Paths.Settings}
              options={{
                headerTitle: "Settings",
              }}
            />
            <Stack.Screen
              component={Screens.ChangePassword}
              name={Paths.ChangePassword}
              options={{
                headerTitle: "Change password",
              }}
            />
            <Stack.Screen
              component={Screens.Collection}
              name={Paths.Collection}
              options={{
                headerTitle: "Collection",
              }}
            />
            <Stack.Screen
              component={Screens.FanAttention}
              name={Paths.FanAttention}
              options={{
                headerTitle: "Fans & following",
              }}
            />
            <Stack.Screen
              component={Screens.Nickname}
              name={Paths.Nickname}
              options={{
                headerTitle: "Nickname",
              }}
            />
            <Stack.Screen
              component={Screens.Introduction}
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

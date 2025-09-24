import type { RootScreenProps } from "@/navigation/types.ts";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageURISource,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { Pressable } from "react-native-gesture-handler";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";
import LogOut from "@/screens/Tabbar/Profile/components/LogOut/LogOut.tsx";

import EditIcon from "@/assets/images/57.png";
import UpdateIcon from "@/assets/images/58.png";
import ArrowIcon from "@/assets/images/59.png";
import ArrowRedIcon from "@/assets/images/610.png";
import PersonalInformationIcon from "@/assets/images/60.png";
// Removed language switch feature
import FAQIcon from "@/assets/images/62.png";
import PrivacyPolicyIcon from "@/assets/images/63.png";
import SettingsIcon from "@/assets/images/64.png";
import LogOutIcon from "@/assets/images/65.png";
import { getLoginUserProfile } from "@/services";
import { useUserStore } from "@/store";
import { Agreements } from "@/common/agreement.ts";
import { useFocusEffect } from "@react-navigation/native";
// Translations removed – using plain English strings

type Menu = {
  code: string;
  icon: ImageURISource;
  name: string;
  params?: { code: string };
  path: Paths;
};

export default function Profile({
  navigation,
}: RootScreenProps<Paths.Profile>) {
  const { backgrounds, colors } = useTheme();
  const [visibleLogOut, setVisibleLogOut] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({});

  const queryClient = useQueryClient();

  const userInfo = useUserStore((state: any) => state.userInfo);
  const menus: Menu[] = [
    {
      code: "myUpdates",
      icon: UpdateIcon as ImageURISource,
      name: "My updates",
      path: Paths.MyUpdates,
    },
    {
      code: "personalInformation",
      icon: PersonalInformationIcon as ImageURISource,
      name: "Personal information",
      path: Paths.PersonalInformation,
    },
    {
      code: "faq",
      icon: FAQIcon as ImageURISource,
      name: "FAQ",
      path: Paths.FAQ,
    },
    {
      code: "privacyPolicy",
      icon: PrivacyPolicyIcon as ImageURISource,
      name: "Privacy policy",
      params: {
        code: Agreements.PrivacyPolicy,
      },
      path: Paths.Agreement,
    },
    {
      code: "settings",
      icon: SettingsIcon as ImageURISource,
      name: "Settings",
      path: Paths.Settings,
    },
  ];

  const { data: userProfileData, isSuccess: userProfileIsSuccess } = useQuery({
    queryFn: getLoginUserProfile,
    queryKey: [Paths.Profile, "getLoginUserProfile"],
  });

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.Profile, "getLoginUserProfile"],
        type: "active",
      });
      // Do something when the screen is focused
      return () => {};
    }, [queryClient])
  );

  useEffect(() => {
    if (userProfileIsSuccess) {
      setUserProfile(userProfileData.data || {});
    }
  }, [userProfileData, userProfileIsSuccess]);

  const showLogOutModal = () => {
    setVisibleLogOut(true);
  };
  const hideLogOutModal = () => {
    setVisibleLogOut(false);
  };

  const handleMenuClick = (item: Menu) => {
    switch (item.code) {
      default: {
        navigation.navigate(item.path, item.params || {});
        break;
      }
    }
  };
  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
      <SafeScreen style={[styles.safeScreen, backgrounds.gray1600]}>
        <View style={styles.container}>
          <Text style={styles.titleText}>{"Profile"}</Text>

          <View style={styles.avatarWrapper}>
            <View>
              <Avatar.Image
                size={118}
                source={{
                  uri: userInfo?.avatar,
                }}
              />
              <Pressable
                onPress={() => {
                  navigation.navigate(Paths.PersonalInformation);
                }}
                style={styles.editIcon}
              >
                <Image
                  alt="edit-icon"
                  source={EditIcon as ImageURISource}
                  style={styles.editIcon}
                />
              </Pressable>
            </View>
            <Text style={styles.nameText}>{userInfo.nickName}</Text>
          </View>
          <View style={styles.cardWrapper}>
            <Pressable
              onPress={() => {
                navigation.navigate(Paths.Collection);
              }}
              style={[styles.cardStyle, backgrounds.blue8]}
            >
              <Text style={{ ...styles.cardValueText, color: colors.blue800 }}>
                {userProfile.collectionNum ?? 0}
              </Text>
              <Text style={{ ...styles.cardNameText, color: colors.blue800 }}>
                {"Collection"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate(Paths.FanAttention, {
                  name: Paths.FollowingList,
                });
              }}
              style={[styles.cardStyle, backgrounds.blue8]}
            >
              <Text style={{ ...styles.cardValueText, color: colors.blue800 }}>
                {userProfile.followingNum ?? 0}
              </Text>
              <Text style={{ ...styles.cardNameText, color: colors.blue800 }}>
                {"Following"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate(Paths.FanAttention, {
                  name: Paths.FollowersList,
                });
              }}
              style={[styles.cardStyle, backgrounds.blue8]}
            >
              <Text style={{ ...styles.cardValueText, color: colors.blue800 }}>
                {userProfile.followersNum ?? 0}
              </Text>
              <Text style={{ ...styles.cardNameText, color: colors.blue800 }}>
                {"Followers"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.menuWrapper}>
            {menus.map((item) => (
              <Pressable
                key={item.code}
                onPress={() => {
                  handleMenuClick(item);
                }}
              >
                <View style={styles.menu}>
                  <View style={styles.menuLeft}>
                    <Image
                      alt={item.name}
                      source={item.icon}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuNameText}>{item.name}</Text>
                  </View>
                  <Image
                    alt="arrow-right"
                    source={ArrowIcon as ImageURISource}
                    style={styles.menuArrowIcon}
                  />
                </View>
              </Pressable>
            ))}

            <Pressable onPress={showLogOutModal}>
              <View style={styles.menu}>
                <View style={styles.menuLeft}>
                  <Image
                    alt={"Log out"}
                    source={LogOutIcon as ImageURISource}
                    style={styles.menuIcon}
                  />
                  <Text style={{ ...styles.menuNameText, color: "#FF0000" }}>
                    {"Log out"}
                  </Text>
                </View>
                <Image
                  alt="arrow-right"
                  source={ArrowRedIcon as ImageURISource}
                  style={styles.menuArrowIcon}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeScreen>
      <LogOut hideModal={hideLogOutModal} visible={visibleLogOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: "center",
    marginTop: 32,
  },
  cardNameText: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 14,
    marginTop: 12,
    textAlign: "center",
  },
  cardStyle: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    height: 97,
    justifyContent: "center",
    paddingVertical: 5,
  },
  cardValueText: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 22,
  },
  cardWrapper: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 38,
  },
  container: {
    paddingTop: 20,
  },
  editIcon: {
    bottom: 0,
    height: 40,
    position: "absolute",
    right: 0,
    width: 40,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  menuArrowIcon: {
    height: 15,
    width: 15,
  },

  menuIcon: {
    height: 22,
    width: 22,
  },
  menuLeft: {
    flexDirection: "row",
    gap: 12,
  },
  menuNameText: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 18,
  },
  menuWrapper: {
    marginTop: 18,
  },
  nameText: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 28,
    marginTop: 12,
  },
  safeScreen: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 28,
  },
});

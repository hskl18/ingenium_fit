import type { RootScreenProps } from "@/navigation/types.ts";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageURISource,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Avatar, Text, Button } from "react-native-paper";

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
  const { backgrounds } = useTheme();
  const [visibleLogOut, setVisibleLogOut] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({});

  const queryClient = useQueryClient();

  const userInfo = useUserStore((state: any) => state.userInfo);
  const displayName = userInfo?.nickName || "Explorer";
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

  const stats = [
    {
      key: "collections",
      label: "Collections",
      value: userProfile.collectionNum ?? 0,
      onPress: () => {
        navigation.navigate(Paths.Collection);
      },
    },
    {
      key: "following",
      label: "Following",
      value: userProfile.followingNum ?? 0,
      onPress: () => {
        navigation.navigate(Paths.FanAttention, {
          name: Paths.FollowingList,
        });
      },
    },
    {
      key: "followers",
      label: "Followers",
      value: userProfile.followersNum ?? 0,
      onPress: () => {
        navigation.navigate(Paths.FanAttention, {
          name: Paths.FollowersList,
        });
      },
    },
  ];

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

          <View style={styles.heroCard}>
            <View style={styles.heroRow}>
              <View style={styles.avatarContainer}>
                <Avatar.Image
                  size={96}
                  source={{
                    uri: userInfo?.avatar,
                  }}
                />
                <TouchableOpacity
                  accessibilityHint="Edit your profile details"
                  accessibilityLabel="Edit profile"
                  accessibilityRole="button"
                  activeOpacity={0.85}
                  onPress={() => {
                    navigation.navigate(Paths.PersonalInformation);
                  }}
                  style={styles.editAvatarButton}
                >
                  <Image
                    alt="Edit profile"
                    source={EditIcon as ImageURISource}
                    style={styles.editAvatarIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.heroTextGroup}>
                <Text style={styles.displayName}>{displayName}</Text>
                <Text style={styles.heroSubtitle}>
                  {"Curate your adaptive journey and keep your navigator in the loop."}
                </Text>
                <Button
                  accessibilityLabel="Edit profile"
                  buttonColor="#FFFFFF"
                  contentStyle={styles.editProfileButtonContent}
                  labelStyle={styles.editProfileButtonLabel}
                  mode="contained"
                  onPress={() => {
                    navigation.navigate(Paths.PersonalInformation);
                  }}
                  style={styles.editProfileButton}
                  textColor="#0A1F44"
                  uppercase={false}
                >
                  {"Edit profile"}
                </Button>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <TouchableOpacity
                key={stat.key}
                accessibilityHint={`Open ${stat.label.toLowerCase()}`}
                accessibilityLabel={`${stat.label} ${stat.value}`}
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={stat.onPress}
                style={styles.statCard}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.menuWrapper}>
            {menus.map((item) => (
              <TouchableOpacity
                key={item.code}
                accessibilityHint={`Open ${item.name.toLowerCase()}`}
                accessibilityLabel={item.name}
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={() => {
                  handleMenuClick(item);
                }}
                style={styles.menuRow}
              >
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
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              accessibilityHint="Sign out of your account"
              accessibilityLabel="Log out"
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={showLogOutModal}
              style={[styles.menuRow, styles.dangerRow]}
            >
              <View style={styles.menuLeft}>
                <Image
                  alt={"Log out"}
                  source={LogOutIcon as ImageURISource}
                  style={[styles.menuIcon, styles.dangerIcon]}
                />
                <Text style={[styles.menuNameText, styles.dangerText]}>
                  {"Log out"}
                </Text>
              </View>
              <Image
                alt="arrow-right"
                source={ArrowRedIcon as ImageURISource}
                style={[styles.menuArrowIcon, styles.dangerIcon]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeScreen>
      <LogOut hideModal={hideLogOutModal} visible={visibleLogOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    gap: 24,
  },
  heroCard: {
    backgroundColor: "#0A8BCD",
    borderRadius: 28,
    padding: 24,
    marginTop: 24,
    shadowColor: "#001C40",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 4,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 8,
    shadowColor: "#001C40",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  editAvatarIcon: {
    height: 20,
    tintColor: "#0A1F44",
    width: 20,
  },
  heroTextGroup: {
    flex: 1,
    gap: 12,
  },
  displayName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    lineHeight: 20,
  },
  editProfileButton: {
    alignSelf: "flex-start",
    borderRadius: 16,
  },
  editProfileButtonContent: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  editProfileButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flex: 1,
    paddingVertical: 20,
    shadowColor: "#001C40",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: {
    color: "#0A1F44",
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    color: "#475569",
    fontSize: 13,
    marginTop: 6,
  },
  menuWrapper: {
    gap: 12,
  },
  menuRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: "#001C40",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 1,
  },
  menuLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  menuIcon: {
    height: 28,
    tintColor: "#0A8BCD",
    width: 28,
  },
  menuArrowIcon: {
    height: 16,
    tintColor: "#94A3B8",
    width: 16,
  },
  menuNameText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerRow: {
    backgroundColor: "rgba(244, 63, 94, 0.08)",
  },
  dangerText: {
    color: "#DC2626",
  },
  dangerIcon: {
    tintColor: "#DC2626",
  },
  safeScreen: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  scrollView: {
    flex: 1,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
});

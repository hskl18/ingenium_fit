import { LegendList } from "@legendapp/list";
import { useNavigation } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Image, ImageURISource, StyleSheet, View } from "react-native";
import { Avatar, Button, Text, TouchableRipple } from "react-native-paper";
import { Pressable } from "react-native-gesture-handler";
import { useTranslation } from "@/hooks";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import PhoneIcon from "@/assets/images/239.png";
import MessageIcon from "@/assets/images/241.png";
import { followList, toggleFollow } from "@/services";
import Empty from "@/components/common/Empty/Empty.tsx";

export default function FollowersList({
  route,
}: RootScreenProps<Paths.FollowersList>) {
  const { backgrounds, colors } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isSuccess,
  } = useInfiniteQuery({
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    queryFn: async (pageParam) => {
      return followList({
        // 	列表类型 1 关注列表 2 粉丝列表
        listType: 2,
        page: pageParam.pageParam,
        pageSize: 20,
      });
    },
    queryKey: [Paths.FanAttention, Paths.FollowersList, "2"],
  });

  const mutation = useMutation({
    mutationFn: toggleFollow,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        queryClient.invalidateQueries({
          queryKey: [Paths.FanAttention],
        });
      }
    },
  });

  const handleToggleFollow = (user: any) => {
    mutation.mutate({
      followUserId: user?.id,
    });
  };

  console.log(hasNextPage, data);

  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows || []);
  }

  const FollowItem = ({
    user,
    whetherMutualFollow,
  }: {
    readonly whetherMutualFollow: boolean;
  }) => {
    return (
      <View style={[styles.user, backgrounds.gray1600]}>
        <Avatar.Image
          source={{
            uri: user.avatar,
          }}
          size={52}
        />
        <View style={styles.content}>
          <View style={styles.contentLeft}>
            <Text style={styles.nameText}>{user.nickName}</Text>
            <View style={styles.phoneWrapper}>
              <Image
                source={PhoneIcon as ImageURISource}
                style={styles.phoneIcon}
              />
              <Text style={{ ...styles.phoneText, color: colors.gray800 }}>
                {user.phone || user.email}
              </Text>
            </View>
          </View>
          <View style={styles.toolWrapper}>
            {whetherMutualFollow ? (
              <>
                <TouchableRipple
                  borderless
                  onPress={() => {
                    handleToggleFollow(user);
                  }}
                  rippleColor="rgba(0, 0, 0,0.06)"
                  style={[styles.button]}
                >
                  <Text style={styles.buttonLabel}>{"Mutual"}</Text>
                </TouchableRipple>
                <Pressable
                  onPress={() => {
                    navigation.navigate(Paths.ChatDetail, {
                      userId: user.id,
                    });
                  }}
                >
                  <Image
                    source={MessageIcon as ImageURISource}
                    style={styles.messageIcon}
                  />
                </Pressable>
              </>
            ) : (
              <TouchableRipple
                borderless
                onPress={() => {
                  handleToggleFollow(user);
                }}
                rippleColor="rgba(0, 0, 0,0.06)"
                style={[styles.buttonPrimary, backgrounds.primary]}
              >
                <Text style={{ ...styles.buttonLabel, color: colors.gray1600 }}>
                  {"Follow"}
                </Text>
              </TouchableRipple>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ index, item }) => {
    return (
      <View key={item.id} style={{ marginTop: index > 0 ? 20 : 0 }}>
        <FollowItem
          user={item.user}
          whetherMutualFollow={item.whetherMutualFollow as boolean}
        />
      </View>
    );
  };

  return (
    <SafeScreen
      edges={["bottom"]}
      style={[styles.safeScreen, backgrounds.gray1550]}
    >
      <LegendList
        contentContainerStyle={styles.container}
        data={dataList}
        keyExtractor={(item) => item.id}
        onEndReached={fetchNextPage}
        ListEmptyComponent={<Empty />}
        renderItem={renderItem}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
    height: 26,
    paddingHorizontal: 7,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: 500,
  },
  buttonPrimary: {
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    height: 26,
    paddingHorizontal: 15,
  },
  commentNumberText: {
    fontSize: 12,
    marginLeft: 2,
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentLeft: {
    maxWidth: 100,
  },
  messageIcon: {
    height: 26,
    width: 26,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 600,
  },
  phoneIcon: {
    height: 14,
    width: 14,
  },
  phoneText: {
    fontSize: 12,
    fontWeight: 500,
  },
  phoneWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
    marginTop: 12,
  },
  safeScreen: {
    flex: 1,
  },
  toolWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  user: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
});

import type { RootScreenProps } from '@/navigation/types.ts';

import { LegendList } from '@legendapp/list';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Avatar, Divider, Text, TouchableRipple } from 'react-native-paper';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Toast from 'react-native-root-toast';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import ReadIcon from '@/assets/images/79.png';
import RemoveIcon from '@/assets/images/81.png';
import ArrowIcon from '@/assets/images/80.png';
import { dayjs } from '@/plugins';
import { deleteMessage, messageList, readMessage } from '@/services';
import Empty from '@/components/common/Empty/Empty.tsx';

export default function SystemMessage({
  navigation,
}: RootScreenProps<Paths.SystemMessage>) {
  const { backgrounds, colors } = useTheme();  const queryClient = useQueryClient();

  const {
    isPending,
    data,
    isFetching,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 20) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam) => {
      return messageList({
        page: pageParam.pageParam,
      });
    },
    queryKey: [Paths.SystemMessage],
  });

  useEffect(() => {
    let dataList = [];
    if (data?.pages) {
      dataList = data?.pages.flatMap((item) => item?.rows || []);
    }
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => {
        if (!dataList.length) {
          return null;
        }
        return (
          <Pressable onPress={handleReadAll} style={styles.readIconWrapper}>
            <Image
              source={ReadIcon as ImageURISource}
              style={styles.readIcon}
            ></Image>
            <Text style={styles.readText}>{t('common.one_click_read')}</Text>
          </Pressable>
        );
      },
    });
  }, [navigation, data]);

  const mutationRead = useMutation({
    mutationFn: readMessage,
    onError: (error) => {
      console.log('error', error);
    },
    onSuccess: (response: IResponseData, variables) => {
      console.log('variables', variables);
      if (response.code === 200) {
        !variables.id
          ? Toast.show(t('common.read_all_success'), {
              animation: true,
              delay: 0,
              duration: 1000,
              hideOnPress: true,
              onHidden: () => {
                queryClient.invalidateQueries({
                  queryKey: [Paths.SystemMessage],
                });
              },
              position: Toast.positions.CENTER,
              shadow: true,
            })
          : queryClient.invalidateQueries({ queryKey: [Paths.SystemMessage] });
      }
    },
  });

  const handleReadAll = () => {
    mutationRead.mutate({});
  };

  const mutationRemove = useMutation({
    mutationFn: deleteMessage,
    onError: (error) => {
      console.log('error', error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        Toast.show(t('common.message_delete_success'), {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            queryClient.invalidateQueries({ queryKey: [Paths.SystemMessage] });
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const handleRemove = (item: any) => {
    mutationRemove.mutate({
      id: item.id,
    });
  };

  const handleCheckDetail = (item: any) => {
    navigation.navigate(Paths.SystemMessageDetail, {
      id: item?.id,
    });
    // isRead 是否已读：1-是 2-否
    if (+item.isRead === 2) {
      mutationRead.mutate({ id: item.id });
    }
  };
  let dataList = [];
  if (data?.pages) {
    dataList = data?.pages.flatMap((item) => item?.rows || []);
  }

  const RightAction = (item: any) => {
    return (prog: SharedValue<number>, drag: SharedValue<number>) => {
      const styleAnimation = useAnimatedStyle(() => {
        console.log('showRightProgress:', prog.value);
        console.log('appliedTranslation:', drag.value);

        return {
          transform: [{ translateX: drag.value + 50 }],
        };
      });

      return (
        <Reanimated.View style={styleAnimation}>
          <Pressable
            onPress={() => handleRemove(item)}
            style={styles.rightAction}
          >
            <Image
              source={RemoveIcon as ImageURISource}
              style={styles.removeIcon}
            ></Image>
          </Pressable>
        </Reanimated.View>
      );
    };
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginTop: index > 0 ? 15 : 0,
        }}
      >
        <Text style={{ ...styles.dateText, color: colors.gray800 }}>
          {item.createTime
            ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
            : item.createTime}
        </Text>
        <ReanimatedSwipeable
          enableTrackpadTwoFingerGesture
          friction={2}
          renderRightActions={RightAction(item)}
          rightThreshold={40}
        >
          <TouchableRipple
            borderless
            onPress={() => {
              handleCheckDetail(item);
            }}
            rippleColor="rgba(0, 0, 0,0.06)"
            style={[styles.message, backgrounds.gray1600]}
          >
            <View>
              {/* isRead 是否已读：1-是 2-否 */}
              {+item.isRead === 2 ? (
                <View style={styles.readFlag}></View>
              ) : undefined}
              <View style={styles.titleWrapper}>
                <Text style={styles.titleText}>{item.title}</Text>
              </View>
              <Text style={styles.sketchText}>{item.sketch}</Text>
              <Divider />
              <View style={styles.messageFooter}>
                <Text>{t('common.click_to_view_details')}</Text>

                <Image
                  source={ArrowIcon as ImageURISource}
                  style={styles.arrowIcon}
                ></Image>
              </View>
            </View>
          </TouchableRipple>
        </ReanimatedSwipeable>
      </View>
    );
  };

  return (
    <SafeScreen
      edges={['bottom']}
      style={[styles.safeScreen, backgrounds.gray1550]}
    >
      <LegendList
        contentContainerStyle={styles.container}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Empty />}
        onEndReached={fetchNextPage}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  messageFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  messageIcon: {
    height: 53,
    width: 53,
  },
  arrowIcon: {
    height: 10,
    width: 5,
  },
  messageNum: {
    alignItems: 'center',
    backgroundColor: '#F2262F',
    borderRadius: 20,
    height: 14,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 13,
  },
  messageNumText: {
    fontSize: 11,
    fontWeight: 500,
  },
  messageText: {
    fontSize: 12,
    marginTop: 10,
  },
  phoneIcon: {
    height: 14,
    width: 14,
  },
  phoneWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 1,
    marginTop: 12,
  },
  readFlag: {
    backgroundColor: '#E62330',
    borderRadius: 3,
    height: 6,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 6,
  },
  readIcon: {
    height: 20,
    width: 20,
  },
  readIconWrapper: {
    gap: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  readText: {
    fontSize: 13,
    color: '#F2262F',
  },
  removeIcon: {
    height: 36,
    width: 36,
  },
  rightAction: {
    alignItems: 'flex-end',
    height: '100%',
    justifyContent: 'center',
    width: 51,
  },
  safeScreen: {
    flex: 1,
  },
  sketchText: {
    fontSize: 12,
    marginVertical: 17,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleWrapper: {
    paddingRight: 12,
  },
  toolWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});

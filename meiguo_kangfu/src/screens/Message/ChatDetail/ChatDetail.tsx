import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import GalleryPreview from 'react-native-gallery-preview';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AudioRecorderPlayer, {
  RecordBackType,
  AudioSet,
  AVEncoderAudioQualityIOSType,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import AudioIcon from '@/assets/images/234.png';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import {
  leaveWordContentList,
  leaveWordDetail,
  sendLeaveWord,
  uploadFile,
} from '@/services';
import { useUserStore } from '@/store';

import {
  renderInputToolbar,
  renderComposer,
  renderSend,
} from './components/InputToolbar';
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from './components/MessageContainer';
import { SafeScreen } from '@/components/templates';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
import AWSHelper from '@/utils/upload.ts';
const { width } = Dimensions.get('window');

interface LeaveWordInfo {
  id?: string;
  user?: {
    nickName?: string;
  };
}

interface UserInfo {
  id: string;
  nickName: string;
  avatar: string;
}

function ChatDetail({ route, navigation }: RootScreenProps<Paths.ChatDetail>) {
  const { t } = useTranslation();
  const { backgrounds } = useTheme();
  const { userId } = route.params ?? {};
  const [leaveWordInfo, setLeaveWordInfo] = useState<LeaveWordInfo>({});

  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [visibleToolbar, setVisibleToolbar] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [recordSecs, setRecordSecs] = useState(0);
  const [audioPath, setAudioPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const userInfo = useUserStore((state: any) => state.userInfo) as UserInfo;
  const queryClient = useQueryClient();

  const toggleOpenToolbar = () => {
    // 可以在这里添加其他工具栏功能
    console.log('Open toolbar');
    setVisibleToolbar(!visibleToolbar);
  };

  const onPreview = (imgs: any) => {
    console.log('imgs', imgs);
    setImages(imgs);
    setIsVisible(true);
  };

  // 图片选择和上传功能
  const selectImage = () => {
    openImagePicker();
  };

  const handleOnPress = (context, message) => {
    console.log(context);
    console.log(message);
    if (+message.messageType === 2) {
      onPreview([
        {
          uri: message.image,
        },
      ]);
    }
  };

  const openImagePicker = async () => {
    try {
      const { launchImageLibrary } = require('react-native-image-picker');
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchImageLibrary(options, (response) => {
        console.log('response', response);
        if (response.didCancel || response.error) {
          console.log('Image picker cancelled or error:', response.error);
          return;
        }

        if (response.assets && response.assets[0]) {
          uploadImage(response.assets[0]);
        }
      });
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const openCamera = async () => {
    try {
      const { launchCamera } = require('react-native-image-picker');
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      };

      launchCamera(options, (response) => {
        if (response.didCancel || response.error) {
          console.log('Camera cancelled or error:', response.error);
          return;
        }

        if (response.assets && response.assets[0]) {
          uploadImage(response.assets[0]);
        }
      });
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const uploadImage = async (imageAsset) => {
    try {
      setIsUploading(true);
      const file = {
        uri: imageAsset.uri,
        name: imageAsset.fileName || `image_${Date.now()}.jpg`,
        type: imageAsset.type || 'image/jpeg',
      };
      const res = await AWSHelper.uploadFile(file);
      console.log('Image upload result:', res);

      if (res?.data) {
        // 发送图片消息
        mutation.mutate({
          leaveWordId: leaveWordInfo.id,
          messageContent: res.data,
          messageType: 2, // 图片消息
        });
      } else {
      }
    } catch (error) {
      console.error('Upload image error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  // 清理录音状态
  useEffect(() => {
    return () => {
      if (isRecording) {
        AudioRecorderPlayer.stopRecorder();
        AudioRecorderPlayer.removeRecordBackListener();
      }
    };
  }, [isRecording]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: leaveWordInfo.user?.nickName || '',
    });
  }, [navigation, leaveWordInfo]);

  const { data: leaveWordData, isSuccess: leaveWordDataIsSuccess } = useQuery({
    queryFn: () => leaveWordDetail({ userId }),
    queryKey: [Paths.ChatDetail, 'leaveWordDetail', userId],
  });

  useEffect(() => {
    console.log('leaveWordData', leaveWordData);
    if (leaveWordDataIsSuccess) {
      setLeaveWordInfo(leaveWordData.data || {});
    }
  }, [setLeaveWordInfo, leaveWordData, leaveWordDataIsSuccess]);

  const mutation = useMutation({
    mutationFn: sendLeaveWord,
    onError: (error) => {
      console.log('error', error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        setVisibleToolbar(false);
        queryClient.invalidateQueries({
          queryKey: [Paths.ChatDetail, 'leaveWordContentList'],
        });
        Toast.show(t('common.send_success'), {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
      // Invalidate and refetch
      console.log(t('common.login_success'));
    },
  });

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
    enabled: !!leaveWordInfo.id,
    getNextPageParam: (lastPage: any, allPages: any, lastPageParam: number) => {
      console.log(lastPage, allPages);
      const { rows } = lastPage;
      if (rows.length < 20) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: (pageParam) => {
      console.log('pageParam', pageParam);
      return leaveWordContentList({
        leaveWordId: leaveWordInfo.id,
        page: pageParam.pageParam,
        pageSize: 20,
      });
    },
    queryKey: [Paths.ChatDetail, 'leaveWordContentList', leaveWordInfo],
  });

  const onSend = (newMessages: any[] = []) => {
    console.log(newMessages);
    console.log(text);
    mutation.mutate({
      leaveWordId: leaveWordInfo.id,
      messageContent: text,
      // 消息类型：1-文字 2-图片 3-语音
      messageType: 1,
    });
  };

  // 请求录音权限
  const requestRecordPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: t('common.audio_recording_permission'),
            message:
              'This app needs access to your microphone to record audio.',
            buttonNeutral: t('common.ask_me_later'),
            buttonNegative: t('common.cancel'),
            buttonPositive: t('common.ok'),
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const audioSet: AudioSet = {
    // iOS Settings
    AVSampleRateKeyIOS: 44100,
    AVFormatIDKeyIOS: 'aac',
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVModeIOS: 'measurement', // Available options: 'gameChatAudio', 'measurement', 'moviePlayback', 'spokenAudio', 'videoChat', 'videoRecording', 'voiceChat', 'voicePrompt'

    // Android Settings
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
  };

  const meteringEnabled = true; // Enable audio metering

  // 录音功能
  const onStartRecord = async () => {
    try {
      // 检查权限
      const hasPermission = await requestRecordPermission();
      if (!hasPermission) {
        console.log(t('common.recording_permission_denied'));
        return;
      }

      // Set up recording progress listener
      AudioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        console.log(
          'Recording progress:',
          e.currentPosition,
          e.currentMetering,
        );
        setRecordSecs(e.currentPosition);
        setRecordTime(
          AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        );
      });

      const result = await AudioRecorderPlayer.startRecorder(
        undefined, // Use default path
        audioSet,
        meteringEnabled,
      );
      setAudioPath(result);
      setIsRecording(true);
      console.log('Recording started:', result);
    } catch (error) {
      console.error('Start recording error:', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await AudioRecorderPlayer.stopRecorder();
      AudioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      console.log('Recording stopped:', result);

      // 发送语音消息
      if (audioPath) {
        const file = {
          uri: 'file://' + audioPath,
          name: 'sound' + Date.now() + '.mp4',
          type: 'video/mp4',
        };
        const res = await AWSHelper.uploadFile(file);
        console.log('res', res);
        if (res?.data) {
          mutation.mutate({
            duration: recordSecs,
            leaveWordId: leaveWordInfo.id,
            messageContent: res.data,
            // 消息类型：1-文字 2-图片 3-语音
            messageType: 3,
          });
        }
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      setIsRecording(false);
    }
  };

  const onPressActionButton = () => {
    console.log('onPressActionButton');
    if (isRecording) {
      onStopRecord();
    } else {
      onStartRecord();
    }
  };

  console.log(hasNextPage, data);
  let messages: any[] = [];
  if (data?.pages) {
    messages = data?.pages.flatMap((item: any) =>
      item?.rows
        ? item?.rows.map((item: any) => {
            const baseMessage = {
              _id: item.id,
              createdAt: new Date(item.createTime),
              user: {
                _id: item.sendUserId,
                name: item.userName,
                avatar: item.userAvatar,
              },
              messageType: item.messageType, // 1-文字 2-图片 3-语音
            };

            // 根据消息类型设置不同的内容
            switch (+item.messageType) {
              case 1: // 文字消息
                return {
                  ...baseMessage,
                  text: item.messageContent,
                };
              case 2: // 图片消息
                return {
                  ...baseMessage,
                  image: item.messageContent,
                };
              case 3: // 语音消息
                return {
                  ...baseMessage,
                  audio: item.messageContent,
                  duration: item.duration,
                  text: t('common.voice_message'), // 显示占位文本
                };
              default:
                return {
                  ...baseMessage,
                  text: item.messageContent,
                };
            }
          })
        : [],
    );
  }

  const handleLoadEarlier = () => {
    console.log(
      'handleLoadEarlier',
      isPending,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
    );
    if (isPending || isFetching || isFetchingNextPage || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  const renderActions = () => {
    return (
      <View style={styles.actionsContainer}>
        <Pressable
          style={[styles.actions, isRecording && styles.recording]}
          onPress={onPressActionButton}
        >
          <Image style={{ width: 26, height: 26 }} source={AudioIcon} />
          {isRecording && (
            <Text style={styles.recordingText}>{recordTime}</Text>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <View style={[styles.container, backgrounds.gray1550]}>
        <GiftedChat
          placeholder={t('common.please_enter_send_content')}
          alignTop
          alwaysShowSend
          infiniteScroll
          isLoadingEarlier={isFetchingNextPage}
          isScrollToBottomEnabled
          loadEarlier={hasNextPage}
          messages={messages}
          onInputTextChanged={setText}
          onSend={onSend}
          showAvatarForEveryMessage
          text={text}
          user={{
            _id: userInfo.id,
            name: userInfo.nickName,
            avatar: userInfo.avatar,
          }}
          showUserAvatar
          messagesContainerStyle={[backgrounds.gray1550]}
          onLoadEarlier={handleLoadEarlier}
          onPress={handleOnPress}
          onPressAvatar={console.log}
          parsePatterns={(linkStyle) => [
            {
              pattern: /#(\w+)/,
              style: linkStyle,
              onPress: (tag: string) =>
                console.log(`Pressed on hashtag: ${tag}`),
            },
          ]}
          renderActions={renderActions}
          renderAvatar={renderAvatar}
          renderAvatarOnTop
          renderBubble={renderBubble}
          renderComposer={renderComposer}
          renderInputToolbar={(props) =>
            renderInputToolbar({ ...props, visibleToolbar, selectImage })
          }
          renderMessage={renderMessage}
          renderMessageText={renderMessageText}
          renderSend={renderSend(toggleOpenToolbar)}
        />
      </View>
      <GalleryPreview
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        images={images}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#ff4444',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default ChatDetail;

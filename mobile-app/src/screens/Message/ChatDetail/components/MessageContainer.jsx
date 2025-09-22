import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
} from 'react-native-gifted-chat';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useTranslation } from '@/hooks';

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    imageStyle={{
      left: { width: 44, height: 44 },
      right: {
        width: 44,
        height: 44,
      },
    }}
  />
);

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
);

export const renderMessage = (props) => (
  <Message
    {...props}
    containerStyle={{
      left: {},
    }}
    // renderDay={() => <Text>Date</Text>}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    textStyle={{
      left: { color: '#333333' },
      right: { color: '#FFFFFF' },
    }}
    customTextStyle={{ fontSize: 14, lineHeight: 18, fontWeight: 600 }}
  />
);

// 语音消息组件
const AudioMessage = ({ audio, duration: audioDuration, isCurrentUser }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(
    audioDuration
      ? AudioRecorderPlayer.mmssss(Math.floor(audioDuration))
      : '00:00',
  );
  const [currentTime, setCurrentTime] = useState('00:00');

  const playAudio = async () => {
    try {
      if (isPlaying) {
        await AudioRecorderPlayer.pausePlayer();
        setIsPlaying(false);
      } else {
        // 设置播放进度监听
        AudioRecorderPlayer.addPlayBackListener((e) => {
          setCurrentTime(
            AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
          );
          // setDuration(AudioRecorderPlayer.mmssss(Math.floor(e.duration)));

          if (e.currentPosition >= e.duration) {
            setIsPlaying(false);
            AudioRecorderPlayer.removePlayBackListener();
          }
        });

        await AudioRecorderPlayer.startPlayer(audio);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio play error:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View
      style={[
        styles.audioContainer,
        isCurrentUser ? styles.audioRight : styles.audioLeft,
      ]}
    >
      <Pressable style={styles.playButton} onPress={playAudio}>
        <Text style={styles.playButtonText}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </Pressable>
      <View style={styles.audioInfo}>
        <Text
          style={[
            styles.audioText,
            isCurrentUser ? styles.audioTextRight : styles.audioTextLeft,
          ]}
        >
          {t('common.voice_message')}
        </Text>
        <Text
          style={[
            styles.audioTime,
            isCurrentUser ? styles.audioTimeRight : styles.audioTimeLeft,
          ]}
        >
          {currentTime} / {duration}
        </Text>
      </View>
    </View>
  );
};

// 自定义消息渲染
export const renderBubble = (props) => {
  const { currentMessage } = props;
  const isCurrentUser = currentMessage.user._id === props.user._id;

  // 如果是语音消息，使用自定义渲染
  if (currentMessage.messageType === 3 && currentMessage.audio) {
    return (
      <View
        style={[
          styles.bubbleContainer,
          isCurrentUser ? styles.bubbleRight : styles.bubbleLeft,
        ]}
      >
        <AudioMessage
          audio={currentMessage.audio}
          duration={currentMessage.duration}
          isCurrentUser={isCurrentUser}
        />
      </View>
    );
  }

  // 如果是图片消息
  if (currentMessage.messageType === 2 && currentMessage.image) {
    return (
      <Bubble
        {...props}
        renderMessageImage={() => (
          <Image
            source={{ uri: currentMessage.image }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        wrapperStyle={{
          left: { backgroundColor: '#f0f0f0' },
          right: { backgroundColor: '#0077D2' },
        }}
      />
    );
  }

  // 默认文字消息
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { backgroundColor: '#f0f0f0' },
        right: { backgroundColor: '#0077D2' },
      }}
      textStyle={{
        left: { color: '#333333' },
        right: { color: '#FFFFFF' },
      }}
    />
  );
};

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20, alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 5,
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    minWidth: 150,
    maxWidth: 250,
  },
  audioLeft: {
    backgroundColor: '#f0f0f0',
  },
  audioRight: {
    backgroundColor: '#0077D2',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playButtonText: {
    fontSize: 16,
  },
  audioInfo: {
    flex: 1,
  },
  audioText: {
    fontSize: 14,
    fontWeight: '500',
  },
  audioTextLeft: {
    color: '#333333',
  },
  audioTextRight: {
    color: '#FFFFFF',
  },
  audioTime: {
    fontSize: 12,
    marginTop: 2,
  },
  audioTimeLeft: {
    color: '#666666',
  },
  audioTimeRight: {
    color: 'rgba(255,255,255,0.8)',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    margin: 5,
  },
});

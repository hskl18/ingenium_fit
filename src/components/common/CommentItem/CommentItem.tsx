import { useNavigation } from '@react-navigation/native';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';
import { useTranslation } from '@/hooks';

import { useTheme } from '@/theme';

import ArrowRIcon from '@/assets/images/91.png';
import { dayjs } from '@/plugins';
import { Pressable } from 'react-native-gesture-handler';

export default function CommentItem({ item, onReply }: any) {
  const { backgrounds, colors } = useTheme();
  const navigation = useNavigation();  const replyList = item.userCommentReplyList || [];
  console.log('replyList', replyList);
  return (
    <View>
      <View style={[styles.container]}>
        <Avatar.Image
          size={40}
          source={{
            uri: item.user?.avatar,
          }}
        />
        <View style={styles.containerLeft}>
          <Text style={{ ...styles.nameText, color: colors.gray800 }}>
            {item.user?.nickName}
          </Text>
          <View style={styles.contentWrapper}>
            <Text style={{ ...styles.contentText }}>{item.content}</Text>
          </View>
          <View style={styles.replyBtnWrapper}>
            <Text style={{ ...styles.dateText, color: colors.gray800 }}>
              {item.createTime
                ? dayjs(item.createTime).format('YYYY-MM-DD HH:mm')
                : item.createTime}
            </Text>
            <Pressable
              onPress={() => {
                onReply(item);
              }}
              style={styles.replyBtn}
            >
              <Text
                style={
                  ([styles.replyBtnText],
                  {
                    color: colors.primary,
                  })
                }
              >
                {t('common.reply')}
              </Text>
            </Pressable>
          </View>
          {replyList.length > 0 ? (
            <View style={styles.replyWrapper}>
              {replyList.map((sItem) => (
                <View key={sItem.id} style={styles.reply}>
                  <View style={styles.replyHeader}>
                    <Text style={{ ...styles.nameText, color: colors.gray800 }}>
                      {sItem.user?.nickName}
                      {!sItem.replyUser ? ':' : ''}
                    </Text>
                    {sItem.replyUser ? (
                      <View style={styles.arrowRIconWrapper}>
                        <Image
                          source={ArrowRIcon as ImageURISource}
                          style={styles.arrowRIcon}
                        ></Image>
                        <Text
                          style={{ ...styles.nameText, color: colors.gray800 }}
                        >
                          {sItem.replyUser?.nickName}:
                        </Text>
                      </View>
                    ) : undefined}
                  </View>
                  <Text style={styles.contentWrapper}>{sItem.content}</Text>
                  <View style={styles.replyBtnWrapper}>
                    <Text style={{ ...styles.dateText, color: colors.gray800 }}>
                      {sItem.createTime
                        ? dayjs(sItem.createTime).format('YYYY-MM-DD HH:mm')
                        : sItem.createTime}
                    </Text>
                    <Pressable
                      onPress={() => {
                        onReply(sItem);
                      }}
                      style={styles.replyBtn}
                    >
                      <Text
                        style={
                          ([styles.replyBtnText],
                          {
                            color: colors.primary,
                          })
                        }
                      >
                        {t('common.reply')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : undefined}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  containerLeft: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
  },
  contentWrapper: {
    marginVertical: 12,
  },
  desc: {
    marginTop: 10,
  },
  contentText: {
    fontSize: 14,
    fontWeight: 600,
  },
  replyBtnText: {
    fontSize: 11,
    fontWeight: 500,
  },
  replyBtn: {
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,119,210,0.1)',
  },

  starIcon: {
    height: 12,
    width: 12,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 500,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrowRIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowRIcon: {
    height: 8,
    width: 8,
  },
  picture: {
    borderRadius: 10,
    height: 80,
    width: 80,
  },
  replyWrapper: {
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E6E0E0',
    borderRadius: 12,
  },
  reply: {
    paddingVertical: 7,
  },
  replyBtnWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  pictureItem: {
    height: 80,
    marginTop: 10,
    width: 80,
  },
  pictureWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
});

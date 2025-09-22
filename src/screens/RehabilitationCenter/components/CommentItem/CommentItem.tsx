import { useNavigation } from '@react-navigation/native';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';

import { useTheme } from '@/theme';

import StarIcon from '@/assets/images/150.png';
import StarFIcon from '@/assets/images/244.png';

import { dayjs } from '@/plugins/index';
import { Pressable } from 'react-native-gesture-handler';
import RemoveIcon from '@/assets/images/159.png';
import { Rating } from '@kolking/react-native-rating';

export default function CommentItem({ item }: any) {
  const { backgrounds, colors } = useTheme();
  const navigation = useNavigation();

  let pictures = [];
  if (item?.images) {
    pictures = item.images.split(',');
  }

  console.log('pictures', pictures);
  if (!item) {
    return null;
  }

  const starList = Array.from({ length: +item.star });
  return (
    <View>
      <View style={[styles.container]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar.Image
              size={44}
              source={{
                uri: item.user?.avatar,
              }}
            />
            <View>
              <Text style={{ ...styles.nameText, color: colors.gray800 }}>
                {item.user?.nickName}
              </Text>
              <Text style={{ ...styles.dateText, color: colors.gray800 }}>
                {item.createTime
                  ? dayjs(item.createTime).format('YYYY-MM-DD')
                  : item.createTime}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Rating
              disabled
              size={12}
              rating={+item.star}
              fillColor="#333"
              touchColor="#000"
            />
            <Text>{item.star}</Text>
          </View>
        </View>
        <View style={styles.desc}>
          <Text style={{ ...styles.descText, color: colors.gray800 }}>
            {item.content}
          </Text>
        </View>
        <View style={styles.pictureWrapper}>
          {pictures.map((item, index) => (
            <View key={item} style={styles.pictureItem}>
              <Image source={{ uri: item }} style={styles.picture} />
            </View>
          ))}
        </View>
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateText: {
    fontSize: 12,
    marginTop: 6,
  },
  desc: {
    marginTop: 10,
  },
  descText: {
    fontSize: 13,
    fontWeight: 500,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  starIcon: {
    height: 12,
    width: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 600,
  },
  picture: {
    borderRadius: 10,
    height: 80,
    width: 80,
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

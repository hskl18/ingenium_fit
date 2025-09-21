import { useNavigation } from '@react-navigation/native';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text, TouchableRipple } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import MoreIcon from '@/assets/images/148.png';

import ScoreIcon from '@/assets/images/244.png';

export default function DoctorItem({ item }: any) {
  const { backgrounds, colors } = useTheme();
  const navigation = useNavigation();

  if (!item) {
    return null;
  }

  const tags = item.tags ? item.tags?.split(',') : [];

  return (
    <TouchableRipple
      borderless
      onPress={() => {
        navigation.navigate(Paths.RehabilitationCenterDoctor, {
          id: item.id,
        });
      }}
      rippleColor="rgba(0, 0, 0,0.06)"
    >
      <View>
        <View style={[styles.container]}>
          <View style={styles.containerLeft}>
            <Avatar.Image
              size={64}
              source={{
                uri: item.headImage,
              }}
            />
            <View>
              <Text style={{ ...styles.nameText, color: colors.gray800 }}>
                {item.name}
              </Text>
              <View style={styles.scoreWrapper}>
                <Text style={styles.scoreText}>{item.star}</Text>
                <Image
                  source={ScoreIcon as ImageURISource}
                  style={styles.scoreIcon}
                />
                <Text
                  style={{
                    ...styles.commentNumberText,
                    color: colors.gray800,
                  }}
                >
                  ({item.commentNum})
                </Text>
              </View>
              <View style={styles.tagWrapper}>
                {tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={{ ...styles.tagText, color: colors.primary }}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Image source={MoreIcon as ImageURISource} style={styles.moreIcon} />
        </View>
        <Divider />
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerLeft: {
    flexDirection: 'row',
    gap: 16,
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
  moreIcon: {
    height: 32,
    width: 32,
  },
  nameText: {
    fontSize: 17,
    fontWeight: 600,
  },
  scoreIcon: {
    height: 12,
    width: 12,
  },
  scoreText: {
    flexShrink: 1,
    fontSize: 12,
  },
  scoreWrapper: {
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tag: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 119, 210, 0.1)',
    borderRadius: 4,
    height: 19,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  tagText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: 500,
  },
  tagWrapper: {
    maxWidth: 196,
    marginTop: 8,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
});

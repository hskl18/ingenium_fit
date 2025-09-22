import { useNavigation } from '@react-navigation/native';
import { Image, ImageURISource, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTranslation } from '@/hooks';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import ScoreIcon from '@/assets/images/244.png';
import CollectIcon from '@/assets/images/31.png';
import CollectFIcon from '@/assets/images/247.png';

export default function InstitutionItem({ item }: any) {
  const { backgrounds, colors } = useTheme();
  const navigation = useNavigation();  return (
    <Card
      onPress={() => {
        navigation.navigate(Paths.RehabilitationCenterDetail, {
          id: item.id,
        });
      }}
      style={[styles.container, backgrounds.gray1600]}
    >
      <View>
        <Image
          source={{
            uri: item.coverImage,
          }}
          style={styles.coverImage}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.titleWrapper}>
          <Text numberOfLines={1} style={styles.titleText}>
            {item.name}
          </Text>
          {item.whetherFavoriteByLoginUser ? (
            <Image
              source={CollectFIcon as ImageURISource}
              style={styles.collectIcon}
            />
          ) : (
            <Image
              source={CollectIcon as ImageURISource}
              style={styles.collectIcon}
            />
          )}
        </View>
        {item.distance ? (
          <Text style={styles.distanceText}>
            {t('common.distance')} {item.distance}km
          </Text>
        ) : undefined}
        {Array.isArray(item.accessibleHighlights) &&
        item.accessibleHighlights.length > 0 ? (
          <View style={styles.highlightSection}>
            <Text
              style={{
                ...styles.highlightLabel,
                color: colors.gray500,
              }}
            >
              {t('common.accessibility_supports')}
            </Text>
            <View style={styles.highlightChips}>
              {item.accessibleHighlights.slice(0, 2).map((highlight) => (
                <Text key={highlight} style={styles.highlightChip}>
                  {highlight}
                </Text>
              ))}
            </View>
          </View>
        ) : undefined}
        <View style={styles.scoreWrapper}>
          <Text style={styles.scoreText}>{item.star}</Text>
          <Image
            source={ScoreIcon as ImageURISource}
            style={styles.scoreIcon}
          />
          <Text style={{ ...styles.commentNumberText, color: colors.gray800 }}>
            ({item.commentNum})
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  collectIcon: {
    height: 20,
    width: 20,
  },
  commentNumberText: {
    fontSize: 12,
    marginLeft: 2,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 0,
    shadowColor: '#001C40',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  coverImage: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 188,
    width: '100%',
  },
  descText: {
    fontSize: 13,
    fontWeight: 500,
  },
  distanceText: {
    color: '#00A654',
    flexShrink: 1,
    fontSize: 12,
    marginVertical: 9,
  },
  highlightSection: {
    marginTop: 12,
  },
  highlightLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  highlightChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  highlightChip: {
    backgroundColor: 'rgba(0, 119, 210, 0.08)',
    borderRadius: 999,
    color: '#0B3A64',
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  nameText: {
    fontSize: 16,
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
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 14,
  },
  titleText: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: 500,
  },
  titleWrapper: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
});

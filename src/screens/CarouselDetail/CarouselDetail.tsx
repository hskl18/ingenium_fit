import type { RootScreenProps } from '@/navigation/types.ts';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { Text } from 'react-native-paper';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';
import { carouselDetail } from '@/services';
import { Configs } from '@/common/configs.ts';
import { ImageWithFallback } from '@/components/atoms';
import { normalizeImageUrl } from '@/utils/image';

const IMAGE_KEYS: readonly string[] = [
  'image',
  'imageUrl',
  'imageURL',
  'coverImage',
  'coverUrl',
  'coverURL',
  'cover',
  'banner',
  'bannerUrl',
  'bannerImage',
  'carouselImage',
  'backgroundImage',
  'picture',
  'pictureUrl',
  'pictures',
  'imageList',
  'images',
  'thumbnail',
  'thumb',
  'logo',
  'icon',
];

const IMAGE_NESTED_KEYS: readonly string[] = [
  'url',
  'image',
  'imageUrl',
  'value',
  'cover',
  'coverUrl',
  'src',
  'path',
];

const TITLE_KEYS: readonly string[] = [
  'title',
  'name',
  'heading',
  'mainTitle',
  'carouselTitle',
  'headline',
];

const DESCRIPTION_KEYS: readonly string[] = [
  'description',
  'subtitle',
  'subTitle',
  'summary',
  'intro',
  'introduction',
  'excerpt',
];

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
};

const firstString = (
  value: unknown,
  nestedKeys: readonly string[] = [],
): string | undefined => {
  if (!value) return undefined;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const result = firstString(entry, nestedKeys);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of nestedKeys) {
      const result = firstString(record[key], nestedKeys);
      if (result) {
        return result;
      }
    }
  }

  return undefined;
};

const fromKeys = (
  source: Record<string, unknown>,
  keys: readonly string[],
  nestedKeys: readonly string[] = [],
): string | undefined => {
  for (const key of keys) {
    const result = firstString(source[key], nestedKeys);
    if (result) {
      return result;
    }
  }
  return undefined;
};

const imageFromHtml = (html?: string): string | undefined => {
  if (!html) {
    return undefined;
  }

  const match = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  return match?.[1];
};

export default function CarouselDetail({
  route,
}: RootScreenProps<Paths.CarouselDetail>) {
  const { backgrounds, colors } = useTheme();
  const { payload, ...paramsWithoutPayload } = route.params;
  const { id } = paramsWithoutPayload;
  const [post, setPost] = useState<Record<string, unknown>>(() => ({
    ...asRecord(payload),
    ...asRecord(paramsWithoutPayload),
  }));
  const [sectionHeight, setSectionHeight] = useState(100);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => carouselDetail({ id }),
    queryKey: [Paths.CarouselDetail, 'carouselDetail'],
  });

  useEffect(() => {
    console.log('postData', postData);

    if (postDataIsSuccess) {
      setPost((prev) => ({ ...prev, ...asRecord(postData?.data) }));
    }
  }, [setPost, postData, postDataIsSuccess]);

  const htmlContent = useMemo(() => {
    if (typeof post.content === 'string') {
      return post.content as string;
    }

    const fallbackContent = asRecord(paramsWithoutPayload).content;
    if (typeof fallbackContent === 'string') {
      return fallbackContent;
    }

    return undefined;
  }, [paramsWithoutPayload, post]);

  const displayImage = useMemo(() => {
    const merged = { ...asRecord(paramsWithoutPayload), ...post };
    const direct = fromKeys(merged, IMAGE_KEYS, IMAGE_NESTED_KEYS);
    if (direct) {
      return direct;
    }
    return imageFromHtml(htmlContent);
  }, [htmlContent, paramsWithoutPayload, post]);

  const displayTitle = useMemo(() => {
    return fromKeys({ ...asRecord(paramsWithoutPayload), ...post }, TITLE_KEYS);
  }, [paramsWithoutPayload, post]);

  const displayDescription = useMemo(() => {
    return fromKeys(
      { ...asRecord(paramsWithoutPayload), ...post },
      DESCRIPTION_KEYS,
    );
  }, [paramsWithoutPayload, post]);

  const normalizedImage = normalizeImageUrl(displayImage);
  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
      <SafeScreen
        edges={['bottom']}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        {normalizedImage ? (
          <ImageWithFallback
            uri={normalizedImage}
            style={styles.heroImage}
          />
        ) : null}
        {displayTitle || displayDescription ? (
          <View style={styles.headerContent}>
            {displayTitle ? <Text style={styles.title}>{displayTitle}</Text> : null}
            {displayDescription ? (
              <Text style={[styles.description, { color: colors.gray500 }]}>
                {displayDescription}
              </Text>
            ) : null}
          </View>
        ) : null}
        {htmlContent ? (
          <WebView
            automaticallyAdjustContentInsets
            injectedJavaScript={`
        document.body.style.overflow = 'hidden';
          setTimeout(function() { 
            window.ReactNativeWebView.postMessage(String(document.body.scrollHeight|| ''));
          }, 100);
           true;
        `}
        onMessage={(event) => {
          const payload = event?.nativeEvent?.data;
          if (!payload) {
            return;
          }

          const parsedHeight = Number.parseInt(payload, 10);

          if (Number.isNaN(parsedHeight)) {
            const maybeUrl = payload.trim();
            if (maybeUrl.startsWith('http')) {
              Linking.openURL(maybeUrl).catch((error) =>
                console.warn('Failed to open carousel link', error),
              );
            }
            return;
          }

          setSectionHeight(parsedHeight);
        }}
            originWhitelist={['*']}
            scalesPageToFit={Platform.OS === 'ios'}
            scrollEnabled={false}
            overScrollMode="never"
            source={{
              html:
                Configs.HtmlHead +
                `<body><div>${htmlContent || ''}</div></body>`,
            }}
            style={[
              styles.webView,
              {
                height: sectionHeight,
              },
            ]}
          />
        ) : null}
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    borderRadius: 24,
    height: 216,
    marginHorizontal: 20,
    marginTop: 24,
    width: '100%',
  },
  headerContent: {
    gap: 10,
    marginHorizontal: 20,
    marginTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  webView: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
});

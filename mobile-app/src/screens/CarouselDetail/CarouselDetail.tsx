import type { RootScreenProps } from '@/navigation/types.ts';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageURISource,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { Paths } from '@/navigation/paths.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { dayjs } from '@/plugins';
import { carouselDetail } from '@/services';
import { Configs } from '@/common/configs.ts';

export default function CarouselDetail({
  navigation,
  route,
}: RootScreenProps<Paths.CarouselDetail>) {
  const { backgrounds, colors } = useTheme();
  const { id } = route.params;
  const [post, setPost] = useState({});
  const [sectionHeight, setSectionHeight] = useState(100);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => carouselDetail({ id }),
    queryKey: [Paths.CarouselDetail, 'carouselDetail'],
  });

  useEffect(() => {
    console.log('postData', postData);

    if (postDataIsSuccess) {
      setPost(postData.data || {});
    }
  }, [setPost, postData, postDataIsSuccess]);

  if (!post.id) {
    return;
  }
  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
      <SafeScreen
        edges={['bottom']}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
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
              `<body><div>${post.content || ''}</div></body>`,
          }}
          style={[
            styles.container,
            {
              height: sectionHeight,
            },
          ]}
        />
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'transparent',
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  message: {
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  messageIcon: {
    height: 53,
    width: 53,
  },
  safeScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks';
import { Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import { SafeScreen } from '@/components/templates';

import { agreementByCode } from '@/services';
import { Configs } from '@/common/configs.ts';

export default function Agreement({
  navigation,
  route,
}: RootScreenProps<Paths.Agreement>) {
  const { code } = route.params;
  const { backgrounds } = useTheme();
  const [agreement, setAgreement] = useState({});


  const { data, isSuccess } = useQuery({
    queryFn: () => {
      return agreementByCode({ code });
    },
    queryKey: [Paths.Agreement, 'agreementByCode', code],
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: agreement.title ?? '',
    });
  }, [navigation, agreement]);

  useEffect(() => {
    console.log('data', data);
    if (isSuccess) {
      setAgreement(data.data || {});
    }
  }, [setAgreement, data, isSuccess]);

  return (
    <SafeScreen
      edges={['bottom']}
      style={[styles.safeScreen, backgrounds.gray1600]}
    >
      <WebView
        style={styles.container}
        originWhitelist={['*']}
        source={{ html: Configs.HtmlHead + `<div>${agreement.content || ''}</div>` }}
        scalesPageToFit={Platform.OS === 'ios'}
        automaticallyAdjustContentInsets
        injectedJavaScript={`
          document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              window.ReactNativeWebView.postMessage(link.href);
            });
          });
          setTimeout(function() { 
            window.ReactNativeWebView.postMessage(document.body.scrollHeight);
          }, 100); // a slight delay seems to yield a more accurate value
        `}
        onLoadProgress={() => console.log('loading…')}
        onMessage={(event) => {
          console.log('event', event);
        }}
        onError={(e) => console.log(e)}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingHorizontal: 10,
  },
  safeScreen: {},
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

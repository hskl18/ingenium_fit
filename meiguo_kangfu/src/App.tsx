import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import BootSplash from 'react-native-bootsplash';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { RootSiblingParent } from 'react-native-root-siblings';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { useI18n } from '@/hooks';
import ApplicationNavigator from '@/navigation/Application';
import { ThemeProvider } from '@/theme';
import '@/translations';

import { Configs } from '@/common/configs.ts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const storage = new MMKV();

function App() {
  const { toggleLanguage } = useI18n();
  useEffect(() => {
    const language = storage.getString(Configs.Language);
    console.log('Language', language);
    if (language) {
      toggleLanguage(language);
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    };

    init();
  }, []);
  return (
    <RootSiblingParent>
      <StatusBar
        animated
        translucent
        backgroundColor={'#FFFFFF00'}
        barStyle={'dark-content'}
      />
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <ThemeProvider storage={storage}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <ApplicationNavigator />
              </GestureHandlerRootView>
            </ThemeProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}

export default App;

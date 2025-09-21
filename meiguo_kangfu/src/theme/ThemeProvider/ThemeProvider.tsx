import type {
  FulfilledThemeConfiguration,
  Variant,
} from '@/theme/types/config';
import type { ComponentTheme, Theme } from '@/theme/types/theme';
import type { PropsWithChildren } from 'react';
import type { MMKV } from 'react-native-mmkv';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';

import {
  generateBackgrounds,
  staticBackgroundStyles,
} from '@/theme/backgrounds';
import {
  generateBorderColors,
  generateBorderRadius,
  generateBorderWidths,
  staticBorderStyles,
} from '@/theme/borders';
import componentsGenerator from '@/theme/components';
import {
  generateFontColors,
  generateFontSizes,
  staticFontStyles,
} from '@/theme/fonts';
import { generateGutters, staticGutterStyles } from '@/theme/gutters';
import layout from '@/theme/layout';
import generateConfig from '@/theme/ThemeProvider/generateConfig';

type Context = {
  changeTheme: (variant: Variant) => void;
} & Theme;

export const ThemeContext = createContext<Context | undefined>(undefined);

type Properties = PropsWithChildren<{
  readonly storage: MMKV;
}>;

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

function ThemeProvider({ children = false, storage }: Properties) {
  // Current theme variant
  const [variant, setVariant] = useState(Appearance.getColorScheme());

  useEffect(() => {
    // const subscription = Appearance.addChangeListener(
    //   ({ colorScheme: newColorScheme }: { colorScheme: ColorSchemeName }) => {
    //     console.log('newColorScheme', newColorScheme);
    //     setVariant(newColorScheme);
    //   },
    // );
    // return () => {
    //   subscription.remove();
    // };
  }, [storage, setVariant]);

  const changeTheme = useCallback(
    (nextVariant: Variant) => {
      setVariant(nextVariant);
      storage.set('theme', nextVariant as string);
    },
    [storage],
  );

  // Flatten config with current variant
  const fullConfig = useMemo(() => {
    return generateConfig(variant) satisfies FulfilledThemeConfiguration;
  }, [variant]);

  const fonts = useMemo(() => {
    return {
      ...generateFontSizes(),
      ...generateFontColors(fullConfig),
      ...staticFontStyles,
    };
  }, [fullConfig]);

  const backgrounds = useMemo(() => {
    return {
      ...generateBackgrounds(fullConfig),
      ...staticBackgroundStyles,
    };
  }, [fullConfig]);

  const gutters = useMemo(() => {
    return {
      ...generateGutters(fullConfig),
      ...staticGutterStyles,
    };
  }, [fullConfig]);

  const borders = useMemo(() => {
    return {
      ...generateBorderColors(fullConfig),
      ...generateBorderRadius(),
      ...generateBorderWidths(),
      ...staticBorderStyles,
    };
  }, [fullConfig]);

  const navigationTheme = useMemo(() => {
    if (variant === 'dark') {
      return {
        ...CombinedDarkTheme,
        colors: {
          ...fullConfig.navigationColors,
          ...CombinedDarkTheme.colors,
          // primary: '#0077D2',
          // tertiary: '#00A654',
        },
        dark: true,
      };
    }
    return {
      ...CombinedDefaultTheme,
      colors: {
        ...fullConfig.navigationColors,
        ...CombinedDefaultTheme.colors,
        primary: '#0077D2',
        tertiary: '#00A654',
      },
      dark: false,
    };
  }, [variant, fullConfig.navigationColors]);

  const theme = useMemo(() => {
    return {
      backgrounds,
      borders,
      colors: fullConfig.colors,
      fonts,
      gutters,
      layout,
      variant,
    } satisfies ComponentTheme;
  }, [variant, fonts, backgrounds, borders, fullConfig.colors, gutters]);

  const components = useMemo(() => {
    return componentsGenerator(theme);
  }, [theme]);

  const value = useMemo(() => {
    return { ...theme, changeTheme, components, navigationTheme };
  }, [theme, components, navigationTheme, changeTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default ThemeProvider;

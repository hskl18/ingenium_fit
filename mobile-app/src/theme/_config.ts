import type { ThemeConfiguration } from '@/theme/types/config';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const enum Variant {
  DARK = 'dark',
}

const colorsLight = {
  blue8: 'rgba(0, 119, 210, 0.08)',
  blue800: '#1B4F76',
  gray0: '#000',
  gray1100: '#BFBFBF',
  gray1300: '#D9D9D9',
  gray1500: '#F0F0F0',
  gray1550: '#F7F7F7',
  gray1560: '#FAFAFA',
  gray1600: '#FFFFFF',
  gray200: '#262626',
  gray50: '#EFEFEF',
  gray500: '#595959',
  gray800: '#8C8C8C',
  primary: '#0077D2',
  purple100: '#E1E1EF',
  purple50: '#1B1A23',
  purple500: '#44427D',
  red500: '#C13333',
  skeleton: '#A1A1A1',
} as const;

const colorsDark = {
  blue8: 'rgba(0, 119, 210, 0.32)',
  blue800: '#1B4F76',
  gray0: '#FFFFFF',
  gray1100: '#5A5A5A',
  gray1300: '#303030',
  gray1500: '#262626',
  gray1550: '#000000',
  gray1600: '#000000',
  gray200: '#DBDBDB',
  gray300: '#E3E3E3',
  gray50: '#232323',
  gray500: '#ACACAC',
  gray800: '#7D7D7D',
  primary: '#0077D2',
  purple100: '#252732',
  purple50: '#1B1A23',
  purple500: '#A6A4F0',
  red500: '#C13333',
  skeleton: '#303030',
} as const;

const sizes = [12, 16, 24, 32, 40, 80] as const;

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 16],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration;

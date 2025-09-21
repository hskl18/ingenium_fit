import i18next from 'i18next';

import { SupportedLanguages } from './schema';

const changeLanguage = (lang: SupportedLanguages) => {
  void i18next.changeLanguage(lang);
};

const toggleLanguage = (language: SupportedLanguages) => {
  void i18next.changeLanguage(language);
};

export const useI18n = () => {
  return { changeLanguage, toggleLanguage };
};

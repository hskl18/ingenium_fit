// Simple hooks for demo app
export const useI18n = () => {
  return {
    language: "en-EN",
    changeLanguage: (lang: string) => {
      console.log("Language changed to:", lang);
    },
  };
};

export const useTranslation = () => {
  return {
    t: (key: string) => key, // Just return the key as-is
    i18n: {
      language: "en-EN",
      changeLanguage: (lang: string) => Promise.resolve(),
    },
  };
};

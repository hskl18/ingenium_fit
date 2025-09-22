// Mock useTranslation hook for demo app (English only)
export const useTranslation = () => {
  return {
    t: (key: string) => key, // Just return the key as-is
    i18n: {
      language: "en-EN",
      changeLanguage: (lang: string) => Promise.resolve(),
    },
  };
};

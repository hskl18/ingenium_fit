// Simple English-only translations for demo
const translations = {
  // Add any translation keys that might be used
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
};

// Mock i18next for compatibility
export default {
  language: 'en-EN',
  t: (key: string) => key,
  changeLanguage: (lang: string) => Promise.resolve(),
};
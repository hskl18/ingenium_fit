import * as z from 'zod';

export const enum SupportedLanguages {
  EN_EN = 'en-EN',
  zh_Hans = 'zh-Hans',
}

export const languageSchema = z.enum([
  SupportedLanguages.EN_EN,
  SupportedLanguages.zh_Hans,
]);

export type Language = z.infer<typeof languageSchema>;

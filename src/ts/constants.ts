export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

// ここに無い言語の場合 en にフォールバックするように(コードが)なっている
export const LOCALE = {
  JA: 'ja-JP',
  EN: 'en', // en-GB(Great Britain) とかもあるので
} as const;

export const MESSAGES: {
  [name: string]: {
    [locale in Locale]: string;
  };
} = {
  TABLE_OF_CONTENTS: {
    [LOCALE.EN]: 'Table of contents',
    [LOCALE.JA]: '目次',
  },
  NO_HEADINGS: {
    [LOCALE.EN]: 'No headings',
    [LOCALE.JA]: '見出しなし',
  },
} as const;

// TODO: これも Container に移しちゃって良さそうだな
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const THROTTLE_TIME = 150;

export const ACTION = {
  PAGE_CHANGED: 'page-changed',
  WHOLE_FOLDED_BUTTON_CLICKED: 'click-whole-folded',
  TAIL_FOLDED_BUTTON_CLICKED: 'click-tail-folded',
  RESIZED: 'resized',
  HEADINGS_UPDATED: 'headings-updated',
};

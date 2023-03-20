// TODO: これも Container に移しちゃって良さそうだな
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const THROTTLE_TIME = 150;

export const ACTION = {
  PAGE_MOVED: 'page-moved',
  WHOLE_FOLDED_BUTTON_CLICKED: 'whole-folded-button-clicked',
  POST_WHOLE_FOLDED_BUTTON_CLICKED: 'post-whole-folded-button-clicked',
  TAIL_FOLDED_BUTTON_CLICKED: 'tail-folded-button-clicked',
  RESIZED: 'resized',
  HEADINGS_UPDATED: 'headings-updated',
};

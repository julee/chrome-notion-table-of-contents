type valueOf<T> = T[keyof T]; // util

export type Heading = {
  blockId: string;
  text: string;
  level: number;
  offset: number;
  isFocused: boolean;
};

export type Theme = valueOf<typeof import('./constants').THEME>;

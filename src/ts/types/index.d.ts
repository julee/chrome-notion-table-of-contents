type valueOf<T> = T[keyof T]; // util

type Heading = {
  blockId: string;
  text: string;
  level: number;
  offset: number;
  isFocused: boolean;
};
type Headings = Heading[];

type Locale = valueOf<typeof import('../constants').LOCALE>;

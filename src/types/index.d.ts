type valueOf<T> = T[keyof T]; // util

type Heading = {
  blockId: string;
  text: string;
  level: number;
  offset: number;
  isFocused: boolean;
};
type Headings = Heading[];

type Theme = valueOf<typeof import('../constants').THEME>;

type State = {
  tailFolded: boolean;
  wholeFolded: boolean;
  showsExpandButton: boolean;
  maxHeight: string;
};

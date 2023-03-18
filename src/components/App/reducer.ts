import { ACTION } from '../../constants';

const calcShowsExpandTailButton = (tailFolded: boolean): boolean => {
  const headings = document.querySelector('.toc-headings,.toc-no-headings');
  if (!headings)
    throw new Error('".toc-headings,.toc-no-headings" is not found');

  const hasScrollbar = headings.scrollHeight > headings.clientHeight;
  return tailFolded && !hasScrollbar;
};

export const reducer = (
  prevState: State,
  action: { type: valueOf<typeof ACTION> },
): State => {
  const state = { ...prevState };
  switch (action.type) {
    case ACTION.TAIL_FOLDED_BUTTON_CLICKED:
      state.tailFolded = !state.tailFolded;
      return state;
    case ACTION.WHOLE_FOLDED_BUTTON_CLICKED:
      state.wholeFolded = !state.wholeFolded;
      if (state.wholeFolded)
        state.showsExpandTailButton = calcShowsExpandTailButton(
          state.tailFolded,
        );
      return state;
    case ACTION.RESIZED:
      state.showsExpandTailButton = calcShowsExpandTailButton(state.tailFolded);
      return state;
    case ACTION.HEADINGS_UPDATED:
      state.showsExpandTailButton = calcShowsExpandTailButton(state.tailFolded);
      return state;
    case ACTION.PAGE_CHANGED:
      state.tailFolded = true;
      return state;
    default:
      throw new TypeError(`Unknown type: ${action.type}`);
  }
};

import { ACTION } from '../../constants';
export const DEFAULT_STATE = {
  tailFolded: true,
  wholeFolded: false,
  showsExpandTailButton: false,
  maxHeight: '26vh',
};

/*                  | hasScrollbar
                    | o   | x
--------------------|-----|------
tailFolded folded   | o   | x
           expanded | o   | o
                      ↑         ↑
- hasScrollbar なら fold だろうが |
  expanded だろうがボタン表示      |
- hasScrollbar でないなら ... あれ、いずれにせよ出す必要なくね？


*/
const calcShowsExpandTailButton = (tailFolded: boolean): boolean => {
  const headings = document.querySelector('.toc-headings,.toc-no-headings');
  if (!headings)
    throw new Error('".toc-headings,.toc-no-headings" is not found');

  const hasScrollbar = headings.scrollHeight > headings.clientHeight;
  return !tailFolded || hasScrollbar;
};

const calcExpandedMaxHeight = () => {
  // TODO: use ref
  const container = document.querySelector<HTMLElement>('.toc-container');
  if (!container) throw new Error('.toc-container is not found');
  return window.innerHeight - container.offsetTop - 69 + 'px';
};

export const reducer = (
  prevState: State,
  action: { type: valueOf<typeof ACTION> },
): State => {
  const state = { ...prevState };
  console.log('# action: ' + action.type);

  switch (action.type) {
    case ACTION.TAIL_FOLDED_BUTTON_CLICKED:
      state.tailFolded = !state.tailFolded;
      state.maxHeight = state.tailFolded
        ? DEFAULT_STATE.maxHeight
        : calcExpandedMaxHeight();
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
      state.maxHeight = state.tailFolded
        ? DEFAULT_STATE.maxHeight
        : calcExpandedMaxHeight();
      return state;
    case ACTION.HEADINGS_UPDATED:
      state.showsExpandTailButton = calcShowsExpandTailButton(state.tailFolded);
      return state;
    case ACTION.PAGE_MOVED:
      state.tailFolded = true;
      state.showsExpandTailButton = calcShowsExpandTailButton(state.tailFolded);
      return state;
    default:
      throw new TypeError(`Unknown type: ${action.type}`);
  }
};
